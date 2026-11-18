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
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
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
const origin=process.env.LIVE_SITE_BASE?.replace(/\/$/,'')||'http://127.0.0.1:'+appPort;
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
 assert.ok(initial.title.includes('從一個問題開始')&&!initial.title.includes('影片'),'Homepage must promote learning, not data-type jargon');
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
 const firstLessons=await evaluate('({cards:document.querySelectorAll("#kg-learning-start .kg-learning-card").length,header:document.querySelector("#kg-learning-home-title")?.textContent})');
 assert.ok(firstLessons.cards>=6&&firstLessons.header?.includes('學會一套做法'),'Discovery must offer real learning paths before a large tool list');
 await evaluate('document.querySelector(\'#kg-learning-start [data-open-node="problem:enterprise-knowledge-search"]\').click();true');
 await waitFor('document.querySelector("#kg-knowledge .kg-lesson-thesis strong")?.textContent.includes("文件問答與資料庫分析")','Knowledge lesson loaded');
 const lesson=await evaluate('({principles:document.querySelectorAll(".kg-lesson-principles article").length,steps:document.querySelectorAll(".kg-lesson-step").length,concepts:document.querySelectorAll(".kg-lesson-concepts article").length,example:!!document.querySelector(".kg-lesson-example"),checks:document.querySelectorAll(".kg-lesson-checklist input").length,decision:document.querySelectorAll(".kg-lesson-decisions article").length})');
 assert.ok(lesson.principles>=3&&lesson.steps>=4&&lesson.concepts>=2&&lesson.example&&lesson.checks>=2&&lesson.decision>=2,'Problem lesson must teach why, how, alternatives, example and practice: '+JSON.stringify(lesson));
 await evaluate('document.querySelector("#kg-back").click();true');
 await waitFor('document.querySelector("#kg-learning-start .kg-learning-card")!==null','Return to learning-first home');
 console.log('PASS: Featured guided lesson has decisions, workflow, source concepts, example and practice');


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

 // A node must reveal useful source content, not just its graph title/summary.
 await send('Page.navigate',{url:origin+'/knowledge.html#/node/prompt/japanese-storybook-travel-itinerary-single-html'});
 await waitFor('document.querySelector("#kg-knowledge .kg-prompt-source")?.textContent.includes("日系繪本風")','Full Prompt source reading');
 const promptReading=await evaluate('({length:document.querySelector("#kg-knowledge .kg-prompt-source")?.textContent.length,hasCopy:!!document.querySelector("#kg-knowledge [data-copy-prompt]"),hasSource:!!document.querySelector("#kg-knowledge .kg-reading-section")})');
 assert.ok(promptReading.length>250,'Prompt must show its complete original instructions');
 assert.ok(promptReading.hasCopy&&promptReading.hasSource);
 console.log('PASS: Full Prompt body, inputs and learning notes are readable');

 // Knowledge source handoff must go to a separate Playground rather than embedding a builder.
 await send('Page.navigate',{url:origin+'/knowledge.html#/node/skill/frontend-design'});
 await waitFor('document.querySelector("#kg-playground-link")?.href.includes("seed=skill%3Afrontend-design")','Source to Playground deep link');
 assert.equal(await evaluate('document.querySelector("#kg-composer")===null'),true,'Composer must not stay inside Knowledge Explorer');
 console.log('PASS: Knowledge reading and Workflow Playground are separate');
 await send('Page.navigate',{url:origin+'/knowledge.html#/problem/build-business-website'});
 await waitFor('document.querySelector("#kg-knowledge .kg-lesson-thesis strong")?.textContent.includes("先決定網站")','Website lesson source loaded');
 const curated=await evaluate('({steps:document.querySelectorAll("#kg-knowledge .kg-lesson-step").length,principles:document.querySelectorAll("#kg-knowledge .kg-lesson-principles article").length,sourceLinks:document.querySelectorAll("#kg-knowledge .kg-lesson-evidence [data-read-node]").length,example:document.querySelector("#kg-knowledge .kg-lesson-example")?.textContent,playground:document.querySelector("#kg-playground-link")?.href.includes("problem=build-business-website")})');
 assert.ok(curated.steps===4&&curated.principles>=3&&curated.sourceLinks>=2&&curated.example?.includes('活動報名')&&curated.playground,'Problem content should teach how to act and cite source records without opening Graph: '+JSON.stringify(curated));
 console.log('PASS: Curated Problem opens direct source-backed recommendations');
 await send('Page.navigate',{url:origin+'/knowledge.html#/problem/product-video-motion'});
 await waitFor('document.querySelector("#kg-knowledge .kg-lesson-section")!==null','Source-only Problem guide');
 const fallbackLesson=await evaluate('({notice:document.querySelector("#kg-knowledge .kg-lesson-disclaimer")?.textContent,hasConcept:document.querySelectorAll(".kg-lesson-concepts article").length,steps:document.querySelectorAll(".kg-lesson-step").length,marked:document.querySelector("#kg-knowledge .kg-kicker")?.textContent})');
 assert.ok(fallbackLesson.hasConcept>=1&&fallbackLesson.steps>=1&&fallbackLesson.marked.includes('SOURCE-BASED GUIDE'),'Uncurated Problem must surface existing source knowledge without masquerading as a fully authored lesson');
 console.log('PASS: Uncurated Problem provides an evidence-based workflow reading path');



 // The existing website recipe remains fully editable on the dedicated page.
 await send('Page.navigate',{url:origin+'/playground.html?workflow=dual-agent-website-handoff-and-verification'});
 await waitFor('document.querySelector(\'#pg-editor [data-stage-id="visual"] select\')?.value==="skill:frontend-design"','Website recipe initial selection');
 const startPlan=await evaluate('({steps:document.querySelectorAll("#pg-editor .pg-step[data-stage-id]").length,planned:[...document.querySelectorAll("#pg-editor .pg-step")].every(x=>x.dataset.status==="planned")})');
 assert.equal(startPlan.steps,4);assert.equal(startPlan.planned,true);
 await evaluate('var visualChoiceEl=document.querySelector(\'#pg-editor select[data-stage-choice="visual"]\');visualChoiceEl.value="";visualChoiceEl.dispatchEvent(new Event("change",{bubbles:true}));true');
 await waitFor('document.querySelector(\'#pg-editor [data-stage-id="visual"]\')?.dataset.status==="skipped"','Skip optional design');
 assert.equal(await evaluate('document.querySelector(\'#pg-editor [data-stage-id="build"]\')?.dataset.status'),'planned');
 await evaluate('var buildChoiceEl=document.querySelector(\'#pg-editor select[data-stage-choice="build"]\');buildChoiceEl.value="";buildChoiceEl.dispatchEvent(new Event("change",{bubbles:true}));true');
 await waitFor('document.querySelector(\'#pg-editor [data-stage-id="review"]\')?.dataset.status==="blocked"','Missing build blocks QA');
 await evaluate('var buildSwapEl=document.querySelector(\'#pg-editor select[data-stage-choice="build"]\');buildSwapEl.value="resource:openai-codex";buildSwapEl.dispatchEvent(new Event("change",{bubbles:true}));true');
 await waitFor('document.querySelector(\'#pg-editor [data-stage-id="review"]\')?.dataset.status==="planned"','Restoring build restores QA');
 console.log('PASS: Dedicated website recipe supports optional step, blocking, and replacement');

 // The newly curated agent development recipe and enterprise knowledge recipe are accessible.
 await send('Page.navigate',{url:origin+'/playground.html?workflow=spec-multi-agent-delivery-evidence-qa-stack'});
 await waitFor('document.querySelectorAll("#pg-editor .pg-step[data-stage-id]").length===6','Agent delivery QA recipe');
 const agentRecipe=await evaluate('document.querySelector(\'#pg-editor [data-stage-id="coding"] select\')?.options.length');
 assert.ok(agentRecipe>=3);
 await send('Page.navigate',{url:origin+'/playground.html?workflow=stack'});
 await waitFor('document.querySelectorAll("#pg-editor .pg-step[data-stage-id]").length===4','Enterprise RAG recipe');
 console.log('PASS: Three independently curated recipes are readable and editable');

 // Problem-first navigation and free drafts with real Resource / Skill records.
 await send('Page.navigate',{url:origin+'/playground.html?problem=verify-ai-generated-code'});
 await waitFor('document.querySelector(\'[data-problem-id="verify-ai-generated-code"]\')?.getAttribute("aria-pressed")==="true"','Problem-first route');
 assert.ok(await evaluate('document.querySelectorAll("#pg-flows [data-flow-id]").length>=1'));
 await send('Page.navigate',{url:origin+'/playground.html?seed=resource%3Achatcut'});
 await waitFor('document.querySelector("#pg-editor .pg-step strong")?.textContent.toLowerCase().includes("chatcut")','Free draft seed');
 await evaluate('const x=document.querySelector("#pg-tool-search");x.value="Davinci";x.dispatchEvent(new Event("input",{bubbles:true}));true');
 await waitFor('document.querySelector("#pg-tools [data-add-tool]")!==null','Search for second tool');
 const availableOptions=await evaluate('[...document.querySelectorAll("#pg-tools [data-add-tool]")].map(x=>({key:x.dataset.addTool,disabled:x.disabled}))');
 assert.ok(availableOptions.some(x=>!x.disabled),'Tool search should find a candidate not already in the draft: '+JSON.stringify(availableOptions));
 await evaluate('document.querySelector("#pg-tools [data-add-tool]:not([disabled])").click();true');
 await waitFor('document.querySelectorAll("#pg-editor .pg-step").length===2','Adding tool to free draft');
 await evaluate('document.querySelectorAll("#pg-editor [data-remove-tool]")[1].click();true');
 await waitFor('document.querySelectorAll("#pg-editor .pg-step").length===1','Removing tool from free draft');
 assert.ok((await evaluate('document.querySelector("#pg-editor").textContent')).includes('未驗證'),'Free draft cannot imply compatible execution');
 await send('Page.navigate',{url:origin+'/playground.html'});
 await waitFor('document.querySelector("#pg-editor .pg-feature")!==null && document.querySelector("#pg-flow-count")?.textContent.includes("36")','Playground ready after reload');
 await evaluate('document.querySelector("#pg-open-draft").click();true');
 await waitFor('document.querySelector("#pg-editor .pg-step strong")?.textContent.toLowerCase().includes("chatcut")','Free draft persists across navigation');
 console.log('PASS: Draft remains available across navigation and browser reload');

 console.log('PASS: Problem recommendations and unverified freeform tool planning');

 for(const width of [375,430,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await pause(120);
  const size=await evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})');
  assert.ok(size.scroll<=size.client+3,'Playground overflows '+width+'px: '+JSON.stringify(size));
  console.log('PASS: Playground '+width+'px no horizontal overflow');
 }

 for(const width of [375,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await pause(100);
  const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.mkdirSync(screenshotDir,{recursive:true});
  fs.writeFileSync(path.join(screenshotDir,'playground-'+width+'.png'),Buffer.from(screenshot.data,'base64'));
 }
 await send('Page.navigate',{url:origin+'/knowledge.html#/node/resource/chatcut'});
 await waitFor('document.querySelector("#kg-network [data-node-key]")!==null','Knowledge Explorer graph after return');

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
 const home=await evaluate('({nested:document.querySelectorAll("#topics > .topic-grid").length,cta:!!document.querySelector(\'a.hero-main-cta[href="ask.html"]\'),learning:!!document.querySelector(\'a.hero-secondary-cta[href="knowledge.html"]\')})');
 assert.equal(home.nested,0,'Topic grid must not be nested');
 assert.ok(home.cta&&home.learning,'Home must link to dynamic answers and keep the existing Problem Explorer');
 await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
 const fit=await evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})');
 assert.ok(fit.scroll<=fit.client+3,'Main index overflows at 375px '+JSON.stringify(fit));

 // Verify a topic click is actually visible to the user, not just a green border.
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await evaluate('document.querySelector("#topics [data-topic=learning] strong").click();true');
 await waitFor('location.hash==="#/explore/learning" && document.querySelector("#result-title")?.textContent==="學習與教材"','Topic route');
 await waitFor('document.querySelector("#result-header")?.getBoundingClientRect().top>=-4 && document.querySelector("#result-header")?.getBoundingClientRect().top<=40','Desktop topic results scroll');
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
 await waitFor('document.querySelector("#result-header")?.getBoundingClientRect().top>=-4 && document.querySelector("#result-header")?.getBoundingClientRect().top<=40','Mobile topic results scroll');
 const mobileTopic=await evaluate('({top:document.querySelector("#result-header").getBoundingClientRect().top,selected:document.querySelector("#topics [data-topic=agents]").getAttribute("aria-pressed"),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth})');
 assert.ok(mobileTopic.top>=-4&&mobileTopic.top<=40,'Mobile results not in view: '+JSON.stringify(mobileTopic));
 assert.equal(mobileTopic.selected,'true');
 assert.ok(mobileTopic.overflow<=3);
 console.log('PASS: Mobile topic click opens filtered results');

 // Reproduce a transient failed knowledge-data request; the user must be able to retry without reloading.
 // Runs against this branch's local files only (the live site may not have this patch yet).
 if(!process.env.LIVE_SITE_BASE){
  const injected=await send('Page.addScriptToEvaluateOnNewDocument',{source:
   'if(location.search.includes("simulate-load-failure")){let failures=0;const original=window.fetch.bind(window);window.fetch=(...args)=>{if(String(args[0]).includes("data/knowledge-graph-v1.json")&&failures++<3)return Promise.reject(new Error("Simulated temporary network interruption"));return original(...args)}};'
  });
  await send('Page.navigate',{url:origin+'/knowledge.html?simulate-load-failure=1'});
  await waitFor('document.querySelector("#kg-retry-load")!==null','Recoverable knowledge loading error');
  const detail=await evaluate('document.querySelector(".kg-error details code")?.textContent');
  assert.ok(detail.includes('Simulated temporary network interruption'),'Show concrete loading error without losing navigation');
  await evaluate('document.querySelector("#kg-retry-load").click();true');
  await waitFor('document.querySelector("#kg-count")?.textContent.includes("正式知識")','Knowledge load succeeds after retry');
  assert.ok(await evaluate('document.querySelectorAll("#kg-learning-start .kg-learning-card").length>=6'));
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:injected.identifier});
  console.log('PASS: Transient failed Graph fetch offers working retry and recovers');
 }

 // The All Collections route is a stable, no-curation-required view of every V2 type.
 await send('Page.navigate',{url:origin+'/index.html#/browse/all'});
 await waitFor('document.querySelector("#result-title")?.textContent==="全部收藏" && document.querySelector("#result-count")?.textContent.includes("548")','All Collections shows the complete catalog');
 const allCollection=await evaluate('({discoverHidden:document.querySelector("#discover")?.hidden,tabCount:document.querySelectorAll("#type-tabs [data-type]").length,nav:!!document.querySelector(\'nav a[href="#/browse/all"]\'),rows:document.querySelector("#result-count")?.textContent})');
 assert.ok(allCollection.discoverHidden&&allCollection.tabCount===7&&allCollection.nav,'All Collections needs one direct independent route to all six types: '+JSON.stringify(allCollection));
 await evaluate('(()=>{const el=document.querySelector("#q");el.value="tip31812";el.dispatchEvent(new Event("input",{bubbles:true}));return true})()');
 await waitFor('document.querySelector(\'#app a[href="#/resources/tip31812-ai-usage-bar"]\')!==null','AI Usage Bar searchable through all collections');
 await evaluate('document.querySelector(\'#app a[href="#/resources/tip31812-ai-usage-bar"]\').click();true');
 await waitFor('document.querySelector(".detail-panel h2")?.textContent.includes("AI Usage Bar")','AI Usage Bar detail opens');
 assert.ok((await evaluate('document.querySelector(".detail-panel")?.textContent')).includes('從這份知識開始實作'),'Resource detail must show the saved implementation knowledge');
 assert.equal(await evaluate('document.querySelector(".detail-back a")?.getAttribute("href")'),'#/browse/all','Return from resource detail should preserve All Collections context');
 await send('Page.navigate',{url:origin+'/index.html#/browse/all'});
 await waitFor('document.querySelector("#q")?.value===""','All Collections clears prior search');
 await evaluate('(()=>{const el=document.querySelector("#q");el.value="aiposthub-awesome-opensource-ai-cheat-sheets-guide";el.dispatchEvent(new Event("input",{bubbles:true}));return true})()');
 await waitFor('document.querySelector(\'#app a[href="#/resources/aiposthub-awesome-opensource-ai-cheat-sheets-guide"]\')!==null','Original article and upstream repo resource searchable');

 await evaluate('document.querySelector("#app .card a.title-link").click();true');
 await waitFor('document.querySelector(".detail-panel h2")?.textContent.includes("AI 工程決策速查表")','Article detail opens');
 assert.ok(await evaluate('!!document.querySelector(".external-links a[href*=sraodev]")'),'Upstream source repository link must be visible');
 console.log('PASS: All Collections retains all six data types, both saved sources and independent deep links');

 // The intent-first entry synthesizes from the complete collection, not curated Problems alone.
 await send('Page.navigate',{url:origin+'/ask.html'});
 await waitFor('document.querySelector("#ask-meta")?.textContent.includes("已載入")','Knowledge answer page loaded');
 const initialKnowledge=await evaluate('({count:document.querySelector("#ask-meta")?.textContent,nav:!!document.querySelector(\'nav a[href="index.html#/browse/all"]\'),presets:document.querySelectorAll("[data-question]").length})');
 assert.ok(initialKnowledge.count.includes("548")&&initialKnowledge.nav&&initialKnowledge.presets>=4,'Ask page must reference all saved records and preserve All Collections navigation');
 await evaluate('document.querySelector(\'[data-question*="AI Security"]\').click();true');
 await waitFor('document.querySelector("#ask-output .ask-head h2")?.textContent.includes("AI Security")','Security answer');
 const securityAnswer=await evaluate('({mode:document.querySelector(".ask-kicker")?.textContent,sections:document.querySelectorAll("#ask-output [data-section]").length,citations:document.querySelectorAll("#ask-output a.ask-source").length})');
 assert.ok(securityAnswer.mode.includes('學習')&&securityAnswer.sections>=1&&securityAnswer.citations>=2,'Learning answer must cite real knowledge');
 await evaluate('document.querySelector(\'[data-question*="實作 AI Usage Bar"]\').click();true');
 await waitFor('document.querySelector("#ask-output [data-section=steps]")!==null','Implementation answer from saved resource');
 const implementationAnswer=await evaluate('({mode:document.querySelector(".ask-kicker")?.textContent,hasResource:document.querySelector("#ask-output").textContent.includes("AI Usage Bar"),steps:document.querySelectorAll("#ask-output [data-section=steps] .ask-step").length,risks:document.querySelectorAll("#ask-output [data-section=risk] .ask-fact").length,hasLink:!!document.querySelector(\'#ask-output a[href="index.html#/resources/tip31812-ai-usage-bar"]\')})');
 assert.ok(implementationAnswer.mode.includes('實作')&&implementationAnswer.steps>=2&&implementationAnswer.risks>=1&&implementationAnswer.hasLink,'Implementation must use resource architecture and warnings: '+JSON.stringify(implementationAnswer));
 await evaluate('document.querySelector("#ask-query").value="zzzxxyynoexistenttechnicalterm";document.querySelector("#ask-form").requestSubmit();true');
 await waitFor('document.querySelector("#ask-output .ask-gap")?.textContent.includes("找不到")','Evidence gap on unknown query');
 assert.equal(await evaluate('document.querySelectorAll("#ask-output .ask-source").length'),0,'No fake citations when records absent');
 console.log('PASS: Intent-aware learning / implementation / unknown-source flow with cited evidence');
 await send('Page.navigate',{url:origin+'/ask.html?q='+encodeURIComponent('比較 RAG 與 Agent')});
 await waitFor('document.querySelector("#ask-output [data-section=compare]")!==null','Deep link comparison answer');
 assert.ok(await evaluate('document.querySelectorAll("#ask-output .ask-comparison").length>=2'),'Comparison must show independent candidate Resources');
 for(const width of [375,430,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await pause(140);
  const measured=await evaluate('({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth})');
  assert.ok(measured.scroll<=measured.width+3,'Intent-aware answer horizontal overflow '+width+': '+JSON.stringify(measured));
  if(width===375||width===1440){
   const capture=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   fs.writeFileSync(path.join(screenshotDir,'ask-'+width+'.png'),Buffer.from(capture.data,'base64'));
  }
 }
 console.log('PASS: Intent answer deep links and 375/430/768/1440 responsive view');
 assert.deepEqual(errors,[],'Uncaught browser exceptions: '+errors.join('; '));
 console.log('PASS: Index navigation, direct topic grid, 375px layout, no JS exceptions');
}finally{
 try{ws?.close()}catch{}
 try{chrome?.kill('SIGTERM')}catch{}
 await new Promise(resolve=>server.close(resolve));
 try{fs.rmSync(tmp,{recursive:true,force:true,maxRetries:10,retryDelay:100})}catch(error){console.warn('Chrome profile cleanup warning:',error.message)}
}
