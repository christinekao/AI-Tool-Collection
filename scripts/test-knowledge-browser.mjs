#!/usr/bin/env node
/**
 * P1 browser smoke. Uses Chrome DevTools Protocol, Node.js and a local HTTP server.
 * Tests real JS execution and 375/430/768/1440px without external test packages.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn,spawnSync} from 'node:child_process';

const root=process.cwd(),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'kg-browser-'));
const screenshotDir=path.join(root,'artifacts');
const ports={};
let server,chrome,ws;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const which=bin=>{const r=spawnSync('which',[bin],{encoding:'utf8'});return r.status===0?r.stdout.trim():null};
const chromeBin=['google-chrome-stable','google-chrome','chromium','chromium-browser'].map(which).find(Boolean);
if(!chromeBin)throw Error('Chrome/Chromium executable is required for browser tests');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 const filename=path.resolve(root,'.'+pathname);
 if(!filename.startsWith(root+path.sep)||!fs.existsSync(filename)||!fs.statSync(filename).isFile()){
  res.writeHead(404);res.end('Not found');return;
 }
 res.setHeader('Content-Type',mime[path.extname(filename)]||'text/plain');
 fs.createReadStream(filename).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const appPort=server.address().port;
const origin='http://127.0.0.1:'+appPort;
let chromeLog='',send;
try{
 let debugPort=0;
 for(let attempt=1;attempt<=3;attempt++){
  const profile=path.join(tmp,'chrome-attempt-'+attempt);
  const portPath=path.join(profile,'DevToolsActivePort');
  chromeLog='';
  chrome=spawn(chromeBin,[
   attempt===3?'--headless':'--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
   '--disable-background-networking','--disable-extensions','--no-first-run','--no-default-browser-check',
   '--remote-allow-origins=*','--remote-debugging-port=0',
   '--user-data-dir='+profile,'about:blank'
  ],{stdio:['ignore','ignore','pipe']});
  chrome.stderr.on('data',b=>{chromeLog+=String(b).slice(0,2000)});
  for(let i=0;i<95&&!fs.existsSync(portPath);i++){
   if(chrome.exitCode!==null)break;
   await pause(150);
  }
  if(fs.existsSync(portPath)){
   debugPort=Number(fs.readFileSync(portPath,'utf8').split('\n')[0]);
   if(debugPort>0)break;
  }
  const diagnostics='Chrome attempt '+attempt+' failed (exit='+chrome.exitCode+'): '+chromeLog.slice(-350);
  console.warn(diagnostics);
  chrome.kill('SIGKILL');
  await pause(350);
 }
 assert.ok(debugPort>0,'Chrome DevTools did not start after three attempts: '+chromeLog.slice(-800));
 const page=await fetch('http://127.0.0.1:'+debugPort+'/json/new?'+encodeURIComponent(origin+'/knowledge.html'),{method:'PUT'}).then(x=>x.json());
 assert.ok(page.webSocketDebuggerUrl,'CDP page websocket unavailable');
 ws=new WebSocket(page.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
 const pending=new Map();let serial=0;const errors=[];
 ws.addEventListener('message',event=>{
  const msg=JSON.parse(event.data);
  if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params?.exceptionDetails?.text||'Script exception');
  if(!msg.id)return;
  const entry=pending.get(msg.id);if(!entry)return;
  pending.delete(msg.id);if(msg.error)entry.reject(new Error(msg.error.message));else entry.resolve(msg.result);
 });
 send=(method,params={})=>new Promise((resolve,reject)=>{
  const id=++serial;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));
 });
 await send('Page.enable');await send('Runtime.enable');
 const evaluate=async expression=>{
  const obj=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(obj.exceptionDetails)throw Error('Browser evaluate failed: '+obj.exceptionDetails.text);
  return obj.result?.value;
 };
 async function waitFor(expr,description){
  let value;
  for(let i=0;i<90;i++){
   value=await evaluate(expr);
   if(value)return value;
   await pause(110);
  }
  throw Error('Timed out: '+description+'; last='+JSON.stringify(value));
 }
 await waitFor('document.querySelector("#kg-count")?.textContent.includes("正式知識")','Graph fetch');
 const initial=await evaluate('({title:document.querySelector("#kg-title")?.textContent,exampleOpen:document.querySelector("#kg-examples")?.open,results:document.querySelectorAll("#kg-results .kg-result-card").length,graphHidden:document.querySelector("#kg-node-view")?.hidden})');
 assert.ok(initial.title.includes('你想學什麼')&&!initial.title.includes('影片'),'Default must be general-purpose');
 assert.equal(initial.exampleOpen,false,'Curated video Problems should be opt-in, not the default');
 assert.ok(initial.results>=12,'Default shows diverse canonical entities');
 assert.equal(initial.graphHidden,true);
 console.log('PASS: Generic homepage is not hard-coded to video');
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 fs.mkdirSync(screenshotDir,{recursive:true});
 let shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 fs.writeFileSync(path.join(screenshotDir,'discovery-1440.png'),Buffer.from(shot.data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
 await pause(120);
 const initialMobile=await evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})');
 assert.ok(initialMobile.scroll<=initialMobile.client+3,'Discovery overflows 375px: '+JSON.stringify(initialMobile));
 shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 fs.writeFileSync(path.join(screenshotDir,'discovery-375.png'),Buffer.from(shot.data,'base64'));
 console.log('PASS: Generic discovery desktop/mobile screenshot + mobile overflow');

 await evaluate('document.querySelector("#kg-search").value="Agent";document.querySelector("#kg-search").dispatchEvent(new Event("input",{bubbles:true}));true');
 await waitFor('document.querySelector("#kg-results .kg-result-card")?.textContent.toLowerCase().includes("agent")','Non-video search');
 const nonVideo=await evaluate('[...document.querySelectorAll("#kg-results .kg-result-card")].some(x=>x.dataset.openNode?.startsWith("resource:")||x.dataset.openNode?.startsWith("skill:"))');
 assert.ok(nonVideo,'Agent search must discover canonical records without any curated Agent Problem');
 console.log('PASS: Non-video query searches all existing entity types');
 await evaluate('document.querySelector("#kg-search").value="ChatCut";document.querySelector("#kg-search").dispatchEvent(new Event("input",{bubbles:true}));true');
 await waitFor('document.querySelector(\'#kg-results [data-open-node="resource:chatcut"]\')!==null','Resource discovery');
 await evaluate('document.querySelector(\'#kg-results [data-open-node="resource:chatcut"]\').click();true');
 await waitFor('document.querySelector("#kg-focus h2")?.textContent.includes("ChatCut")','Open graph from any Resource');
 const resource=await evaluate('({detail:!!document.querySelector(\'#kg-inspector a[href="index.html#/resources/chatcut"]\'),edges:document.querySelectorAll("#kg-network [data-node-key]").length})');
 assert.ok(resource.detail&&resource.edges>0,'Source detail and existing graph relationships should be accessible');
 console.log('PASS: Any Resource opens its inbound/outbound graph');
 await evaluate('document.querySelector("#kg-examples").open=true;document.querySelector("[data-problem=long-video-to-shorts]").click();true');
 await waitFor('document.querySelector("#kg-focus h2")?.textContent.includes("Shorts")','Curated sample navigation');
 const selected=await evaluate('[...document.querySelectorAll("#kg-network [data-node-key]")].map(x=>x.dataset.nodeKey)');
 assert.ok(selected.includes('resource:fomofly-ai')&&selected.includes('resource:chatcut'));
 console.log('PASS: Video sample remains available as an optional curated scenario');
 await evaluate('document.querySelector("[data-node-key=\'resource:fomofly-ai\']").click();true');
 await waitFor('document.querySelector("#kg-inspector h2")?.textContent.includes("Fomofly")','Node detail');
 const links=await evaluate('({detail:!!document.querySelector(\'#kg-inspector a[href="index.html#/resources/fomofly-ai"]\'),related:document.querySelectorAll("#kg-inspector .kg-neighbor").length})');
 assert.ok(links.detail&&links.related>0);
 console.log('PASS: Node detail and reverse references');
 for(const width of [375,430,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await pause(120);
  const sizing=await evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,buttons:document.querySelectorAll("#kg-network [data-node-key]").length})');
  assert.ok(sizing.scroll<=sizing.client+3,'Horizontal overflow at '+width+'px: '+JSON.stringify(sizing));
  assert.ok(sizing.buttons>0,'No graph cards at '+width+'px');
  if(width===375||width===1440){
   const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   fs.mkdirSync(screenshotDir,{recursive:true});
   fs.writeFileSync(path.join(screenshotDir,'knowledge-'+width+'.png'),Buffer.from(shot.data,'base64'));
  }
  console.log('PASS: knowledge.html '+width+'px, no horizontal overflow');
 }
 await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
 await evaluate('document.querySelector("[data-problem=product-video-motion]").click();true');
 await waitFor('document.querySelector("#kg-focus h2")?.textContent.includes("產品宣傳")','Mobile Problem switch');
 let didScroll=false;
 for(let i=0;i<30;i++){
  const top=await evaluate('document.querySelector("#kg-focus").getBoundingClientRect().top');
  if(top>=-3&&top<=20){didScroll=true;break}
  await pause(100);
 }
 assert.ok(didScroll,'Mobile Problem switch must scroll to the selected knowledge content');
 const mobileShot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 fs.writeFileSync(path.join(screenshotDir,'knowledge-375-selected.png'),Buffer.from(mobileShot.data,'base64'));
 console.log('PASS: mobile selection scrolls to knowledge and focuses selected Problem');
 await send('Page.navigate',{url:origin+'/index.html#/explore'});
 await waitFor('document.querySelectorAll("#topics > .topic-card").length===9','Catalog home topics');
 const home=await evaluate('({nested:document.querySelectorAll("#topics > .topic-grid").length,cta:!!document.querySelector(\'a.hero-main-cta[href="knowledge.html"]\')})');
 assert.equal(home.nested,0,'Topic grid must not be nested');
 assert.ok(home.cta,'Main catalog is missing Problem Explorer entry');
 await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
 const fit=await evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})');
 assert.ok(fit.scroll<=fit.client+3,'Main index overflows at 375px '+JSON.stringify(fit));

 // Verify a topic click is actually visible to the user, not just a green border.
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await evaluate('document.querySelector("#topics [data-topic=learning] strong").click();true');
 await waitFor('location.hash==="#/explore/learning" && document.querySelector("#result-title")?.textContent==="學習與教材"','Topic route');
 const topicState=await evaluate('({selected:document.querySelector("#topics [data-topic=learning]")?.getAttribute("aria-pressed"),feedback:document.querySelector("#topic-selection-feedback")?.textContent,resultTop:document.querySelector("#result-header")?.getBoundingClientRect().top,visible:document.querySelector("#app .card")!==null})');
 assert.equal(topicState.selected,'true');
 assert.match(topicState.feedback,/學習與教材/);
 assert.ok(topicState.resultTop>=-4&&topicState.resultTop<=40,'Results not visible after click: '+JSON.stringify(topicState));
 assert.ok(topicState.visible);
 console.log('PASS: Desktop topic click opens filtered results');
 await evaluate('document.querySelector("#all-topic").click();true');
 await waitFor('location.hash==="#/explore" && document.querySelector("#result-title")?.textContent==="全部收藏"','Reset topic');
 await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
 await evaluate('document.querySelector("#topics [data-topic=agents] .topic-count").click();true');
 await waitFor('location.hash==="#/explore/agents" && document.querySelector("#result-title")?.textContent==="AI Agent 與 Skills"','Mobile topic');
 const mobileTopic=await evaluate('({top:document.querySelector("#result-header").getBoundingClientRect().top,selected:document.querySelector("#topics [data-topic=agents]").getAttribute("aria-pressed"),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth})');
 assert.ok(mobileTopic.top>=-4&&mobileTopic.top<=40,'Mobile results not in view: '+JSON.stringify(mobileTopic));
 assert.equal(mobileTopic.selected,'true');
 assert.ok(mobileTopic.overflow<=3);
 console.log('PASS: Mobile topic click opens filtered results');
 assert.deepEqual(errors,[],'Uncaught browser exceptions: '+errors.join('; '));
 console.log('PASS: Index navigation, direct topic grid, 375px layout, no JS exceptions');
}finally{
 try{ws?.close()}catch{}
 try{chrome?.kill('SIGTERM')}catch{}
 await new Promise(resolve=>server.close(resolve));
 try{fs.rmSync(tmp,{recursive:true,force:true,maxRetries:10,retryDelay:100})}catch(error){console.warn('Chrome profile cleanup warning:',error.message)}
}
