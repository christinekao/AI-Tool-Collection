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
 chrome=spawn(chromeBin,[
  '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
  '--remote-allow-origins=*','--remote-debugging-port=0',
  '--user-data-dir='+tmp,'--no-first-run','--no-default-browser-check','about:blank'
 ],{stdio:['ignore','ignore','pipe']});
 chrome.stderr.on('data',b=>{chromeLog+=String(b).slice(0,2000)});
 const portPath=path.join(tmp,'DevToolsActivePort');
 for(let i=0;i<90&&!fs.existsSync(portPath);i++){if(chrome.exitCode!==null)break;await pause(150);}
 assert.ok(fs.existsSync(portPath),'Chrome DevTools did not start: '+chromeLog.slice(-800));
 const debugPort=Number(fs.readFileSync(portPath,'utf8').split('\n')[0]);
 const page=await fetch('http://127.0.0.1:'+debugPort+'/json/new?'+encodeURIComponent(origin+'/knowledge.html#/problem/video-production'),{method:'PUT'}).then(x=>x.json());
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
 await waitFor('document.querySelector("#kg-count")?.textContent.includes("5 個問題")','Graph fetch and render');
 const init=await evaluate('({links:document.querySelectorAll("#kg-network [data-node-key]").length,title:document.querySelector("#kg-focus h2")?.textContent})');
 assert.ok(init.links>=4,'Expected curated nodes in video overview');
 assert.match(init.title,/影片/);
 console.log('PASS: Graph loaded and rendered curated Problem links');
 await evaluate('document.querySelector("[data-problem=long-video-to-shorts]").click();true');
 await waitFor('document.querySelector("#kg-focus h2")?.textContent.includes("Shorts")','Problem navigation');
 const selected=await evaluate('[...document.querySelectorAll("#kg-network [data-node-key]")].map(x=>x.dataset.nodeKey)');
 assert.ok(selected.includes('resource:fomofly-ai')&&selected.includes('resource:chatcut'));
 console.log('PASS: Problem selection exposes correct source-backed Resources');
 await evaluate('document.querySelector("[data-node-key=\'resource:fomofly-ai\']").click();true');
 await waitFor('document.querySelector("#kg-inspector h2")?.textContent.includes("Fomofly")','Node detail');
 const links=await evaluate('({detail:!!document.querySelector(\'#kg-inspector a[href="index.html#/resources/fomofly-ai"]\'),related:document.querySelectorAll("#kg-inspector .kg-neighbor").length})');
 assert.ok(links.detail,'Resource detail link missing');
 assert.ok(links.related>0,'Graph inverse relationships missing');
 console.log('PASS: Clickable node, detail link and inverse graph relationships');

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
 await send('Page.navigate',{url:origin+'/index.html#/explore'});
 await waitFor('document.querySelectorAll("#topics > .topic-card").length===9','Catalog home topics');
 const home=await evaluate('({nested:document.querySelectorAll("#topics > .topic-grid").length,cta:!!document.querySelector(\'a.hero-main-cta[href="knowledge.html"]\')})');
 assert.equal(home.nested,0,'Topic grid must not be nested');
 assert.ok(home.cta,'Main catalog is missing Problem Explorer entry');
 await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
 const fit=await evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})');
 assert.ok(fit.scroll<=fit.client+3,'Main index overflows at 375px '+JSON.stringify(fit));
 assert.deepEqual(errors,[],'Uncaught browser exceptions: '+errors.join('; '));
 console.log('PASS: Index navigation, direct topic grid, 375px layout, no JS exceptions');
}finally{
 try{ws?.close()}catch{}
 try{chrome?.kill('SIGTERM')}catch{}
 await new Promise(resolve=>server.close(resolve));
 fs.rmSync(tmp,{recursive:true,force:true});
}
