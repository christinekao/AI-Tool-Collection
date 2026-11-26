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
const catalogRecordCount=Object.values(JSON.parse(fs.readFileSync(path.join(root,'data/manifest-v2.json'),'utf8')).entities).reduce((n,ids)=>n+ids.length,0);
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

 // Prompt Guide regressions: copy/view controls must display the exact saved original and adapted strings.
 // Cover representatives across two batches, including legacy guides and high-risk execution boundaries.
 for (const id of [
   '0050-leakage-audited-train-validation-backtest',
   'google-maps-saved-places-cleanup-classification',
   'cv-jd-tailored-interview-questions-deep-followups',
    'knowledge-vault-session-handoff',
    'pstack-create-verification-todo-persistence-example',
    'sol-astra-end-user-ui-critique',
    'star-resume-experience-three-rewrites',
    'stepwise-ai-work-delegation-discovery',
    'tradingview-twstock-signal-to-backtest-audit',
    'weekly-ai-headhunter-job-search'
 ]) {
   await send('Page.navigate',{url:origin+'/index.html#/prompts/'+id});
   await waitFor('location.hash.includes('+JSON.stringify(id)+') && !!document.querySelector(".pg-prompt-text[data-prompt-text=adapted]")','Prompt detail '+id);
   const probe=await evaluate(`(async()=>{
     const record=(await (await fetch('data/catalog-v2.json')).json()).prompts.find(p=>p.id===${JSON.stringify(id)});
     const adapted=document.querySelector('[data-prompt-text="adapted"]');
     const original=document.querySelector('[data-prompt-text="original"]');
     const copy=document.querySelector('.pg-editor [data-copy-version]');
     const initial=adapted&&!adapted.hidden&&original.hidden&&copy?.dataset.copyVersion==='adapted';
     const same=adapted.textContent===record.promptGuide.adaptedPrompt&&original.textContent===record.prompt;
     document.querySelector('[data-prompt-view="original"]').click();
     const changed=!original.hidden&&adapted.hidden&&copy.dataset.copyVersion==='original'&&document.querySelector('[data-prompt-view="original"]').getAttribute('aria-pressed')==='true';
     document.querySelector('[data-prompt-view="adapted"]').click();
     const restored=!adapted.hidden&&original.hidden&&copy.dataset.copyVersion==='adapted';
     return {initial,same,changed,restored};
   })()`);
   assert.ok(probe.initial&&probe.same&&probe.changed&&probe.restored,'Prompt Original/Adapted mismatch: '+id+' '+JSON.stringify(probe));
 }
 await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
 await pause(100);
 const promptMobile=await evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})');
 assert.ok(promptMobile.scroll<=promptMobile.client+3,'Prompt guide overflows mobile 375px: '+JSON.stringify(promptMobile));
 console.log('PASS: Prompt Original/Adapted strings and version toggles; 375px mobile reading');

 // Concept Batch 02 regressions: real renderer must expose sourced principle vs hypothetical applications.
 for(const id of ['cross-agent-shared-memory','episodic-character-asset-consistency','memory-observability']){
  const record=JSON.parse(fs.readFileSync(path.join(root,'data/concepts',id+'.json'),'utf8'));
  await send('Page.navigate',{url:origin+'/knowledge.html#/node/concept/'+id});
  await waitFor('document.querySelector("#kg-knowledge")?.textContent.includes("候選跨領域應用（非實測）")','Concept scenario detail '+id);
  const expr='({visible:document.querySelector("#kg-knowledge")?.textContent.includes('+JSON.stringify(record.applicationScenarios[0])+'),question:document.querySelector("#kg-knowledge")?.textContent.includes('+JSON.stringify(record.validationQuestions[0])+'),title:document.querySelector("#kg-knowledge")?.textContent.includes("驗證時該問")})';
  const probe=await evaluate(expr);
  assert.ok(probe.visible&&probe.question&&probe.title,'Concept fields missing in Knowledge Explorer '+id+': '+JSON.stringify(probe));
 }
 await send('Page.navigate',{url:origin+'/index.html#/concepts/cross-agent-memory-portability'});
 await waitFor('document.querySelector("#app")?.textContent.includes("候選跨領域應用（非實測）")','Catalog Concept route');
 for(const width of [375,430,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await pause(125);
  const m=await evaluate('({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth})');
  assert.ok(m.scroll<=m.client+3,'Concept detail overflow '+width+': '+JSON.stringify(m));
  if(width===375||width===1440){
   const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   fs.writeFileSync(path.join(screenshotDir,'concept-batch02-'+width+'.png'),Buffer.from(shot.data,'base64'));
  }
 }
 console.log('PASS: Concept Batch 02 actual Knowledge/Catalog rendering and 375/430/768/1440px responsive');


 // Concept Batch 03: verify new source-preserved detail fields and responsive deep link.
 for(const id of ['point-in-time-retrieval','reversible-privacy-boundary','security-as-workflow-gate']){
  const record=JSON.parse(fs.readFileSync(path.join(root,'data/concepts',id+'.json'),'utf8'));
  await send('Page.navigate',{url:origin+'/knowledge.html#/node/concept/'+id});
  await waitFor('document.querySelector("#kg-knowledge")?.textContent.includes("候選跨領域應用（非實測）")','Concept Batch03 detail '+id);
  const probe=await evaluate('({scenario:document.querySelector("#kg-knowledge")?.textContent.includes('+JSON.stringify(record.applicationScenarios[0])+'),question:document.querySelector("#kg-knowledge")?.textContent.includes('+JSON.stringify(record.validationQuestions[0])+')})');
  assert.ok(probe.scenario&&probe.question,'Batch 03 Concept details missing '+id+': '+JSON.stringify(probe));
 }
 await send('Page.navigate',{url:origin+'/index.html#/concepts/point-in-time-retrieval'});
 await waitFor('document.querySelector("#app")?.textContent.includes("候選跨領域應用（非實測）")','Batch03 Catalog deep link');
 for(const width of [375,430,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await pause(125);
  const size=await evaluate('({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth})');
  assert.ok(size.scroll<=size.client+3,'Batch 03 Concept overflow '+width+': '+JSON.stringify(size));
  if(width===375||width===1440){
   const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   fs.writeFileSync(path.join(screenshotDir,'concept-batch03-'+width+'.png'),Buffer.from(shot.data,'base64'));
  }
 }
 console.log('PASS: Concept Batch 03 real Knowledge/Catalog 375/430/768/1440px');

 // Concept Batch 04: final 8 records, inspect 3 distinct domains and the real Catalog route.
 for(const id of ['semantic-layer-for-ai','source-first-job-intelligence','workflow-agent-system-agent-os-three-layer-architecture']){
  const record=JSON.parse(fs.readFileSync(path.join(root,'data/concepts',id+'.json'),'utf8'));
  await send('Page.navigate',{url:origin+'/knowledge.html#/node/concept/'+id});
  await waitFor('document.querySelector("#kg-knowledge")?.textContent.includes("候選跨領域應用（非實測）")','Concept Batch04 detail '+id);
  const probe=await evaluate('({scenario:document.querySelector("#kg-knowledge")?.textContent.includes('+JSON.stringify(record.applicationScenarios[0])+'),question:document.querySelector("#kg-knowledge")?.textContent.includes('+JSON.stringify(record.validationQuestions[0])+')})');
  assert.ok(probe.scenario&&probe.question,'Batch 04 Concept fields missing '+id+': '+JSON.stringify(probe));
 }
 await send('Page.navigate',{url:origin+'/index.html#/concepts/source-first-job-intelligence'});
 await waitFor('document.querySelector("#app")?.textContent.includes("候選跨領域應用（非實測）")','Batch04 Catalog detail route');
 for(const width of [375,430,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await pause(125);
  const size=await evaluate('({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth})');
  assert.ok(size.scroll<=size.client+3,'Batch 04 Concept overflow '+width+': '+JSON.stringify(size));
  if(width===375||width===1440){
   const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   fs.writeFileSync(path.join(screenshotDir,'concept-batch04-'+width+'.png'),Buffer.from(shot.data,'base64'));
  }
 }
 console.log('PASS: Concept Batch 04 real Knowledge/Catalog 375/430/768/1440px');

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
 await waitFor('document.querySelector("#pg-review-summary")?.textContent.includes("候選，未驗證") && document.querySelectorAll("#pg-reviewed-stages .pg-review-option").length===4','Deployed Workflow Review options');
 const deployedReview=await evaluate('({count:PG.reviewCases.size,links:[...document.querySelectorAll("#pg-reviewed-stages .pg-review-option a")].every(a=>a.getAttribute("href").startsWith("index.html#/resources/")),unverified:document.querySelector("#pg-review-summary")?.textContent.includes("未測試")||document.querySelector("#pg-review-summary")?.textContent.includes("未驗證")})');
 assert.equal(deployedReview.count,17);
 assert.equal(deployedReview.links,true);
 assert.equal(deployedReview.unverified,true);
 console.log('PASS: Deployed Audit07 Workflow Preview shows 17 review-only cases and 4 source-bound Enterprise RAG options');

 const audit08=await evaluate('({auditLink:document.querySelector("#pg-review-summary .pg-source-link")?.href,selectedWorkflow:PG.workflowId,search:location.search})');
 assert.ok(audit08.auditLink.endsWith('#stack')&&audit08.selectedWorkflow==='stack','Deployed audit case deep link incorrect: '+JSON.stringify(audit08));
 await send('Page.navigate',{url:origin+'/playground.html?problem=verify-ai-generated-code&workflow=stack'});
 await waitFor('typeof PG!=="undefined"&&PG.workflowId==="stack"&&document.querySelector("#pg-review-summary")!==null','Deployed Task C explicit Workflow query precedence');
 const resolved=await evaluate('({workflow:PG.workflowId,problem:PG.problemId,urlProblem:new URL(location.href).searchParams.get("problem")})');
 assert.deepEqual(resolved,{workflow:'stack',problem:null,urlProblem:null});
 console.log('PASS: Deployed Audit08 direct case evidence and conflicting Problem+Workflow URL repair');


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
 await waitFor('document.querySelectorAll("#topics > .topic-card").length===11','Catalog home topics');
 const home=await evaluate('({nested:document.querySelectorAll("#topics > .topic-grid").length,cta:!!document.querySelector(\'nav.top-nav a[href="ask.html"]\'),learning:!!document.querySelector(\'nav.top-nav a[href="knowledge.html"]\')})');
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
 await evaluate('document.querySelector("#topics [data-topic=ai-agent] .topic-count").click();true');
 await waitFor('location.hash==="#/explore/ai-agent" && document.querySelector("#result-title")?.textContent==="AI 系統與 Agent"','Mobile topic');
 await waitFor('document.querySelector("#result-header")?.getBoundingClientRect().top>=-4 && document.querySelector("#result-header")?.getBoundingClientRect().top<=40','Mobile topic results scroll');
 const mobileTopic=await evaluate('({top:document.querySelector("#result-header").getBoundingClientRect().top,selected:document.querySelector("#topics [data-topic=ai-agent]").getAttribute("aria-pressed"),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth})');
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
 await waitFor(`document.querySelector("#result-title")?.textContent==="全部收藏" && document.querySelector("#result-count")?.textContent.includes("${catalogRecordCount}")`,'All Collections shows the complete catalog');
 const allCollection=await evaluate('({discoverHidden:document.querySelector("#discover")?.hidden,tabCount:document.querySelectorAll("#type-tabs [data-type]").length,nav:!!document.querySelector(\'nav a[href="#/browse/all"]\'),rows:document.querySelector("#result-count")?.textContent})');
 assert.ok(allCollection.discoverHidden&&allCollection.tabCount===7&&allCollection.nav,'All Collections needs one direct independent route to all six types: '+JSON.stringify(allCollection));
 await evaluate('(()=>{const el=document.querySelector("#q");el.value="tip31812";el.dispatchEvent(new Event("input",{bubbles:true}));return true})()');
 await waitFor('document.querySelector(\'#app a[href="#/resources/tip31812-ai-usage-bar"]\')!==null','AI Usage Bar searchable through all collections');
 await evaluate('document.querySelector(\'#app a[href="#/resources/tip31812-ai-usage-bar"]\').click();true');
 await waitFor('document.querySelector(".detail-panel h2")?.textContent.includes("AI Usage Bar")','AI Usage Bar detail opens');
 // The opened record, not the collection list, should align to the full content width.
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 const detailWidth=await evaluate('(()=>{const m=document.querySelector("main.wrap"),d=document.querySelector(".detail"),mc=getComputedStyle(m),mRect=m.getBoundingClientRect(),rect=d.getBoundingClientRect();return {mainLeft:mRect.left,detailLeft:rect.left,available:mRect.width-parseFloat(mc.paddingLeft)-parseFloat(mc.paddingRight),width:rect.width,paddingLeft:parseFloat(mc.paddingLeft)}})()');
 assert.ok(detailWidth.width>=detailWidth.available-6,'Collection record detail should use full available main width: '+JSON.stringify(detailWidth));
 assert.ok(Math.abs(detailWidth.detailLeft-(detailWidth.mainLeft+detailWidth.paddingLeft))<=4,'Detail frame should align to the outer content edge: '+JSON.stringify(detailWidth));
 const detailShot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 fs.writeFileSync(path.join(screenshotDir,'collection-detail-1440.png'),Buffer.from(detailShot.data,'base64'));
 for(const width of [375,430,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  const dims=await evaluate('({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth})');
  assert.ok(dims.scroll<=dims.client+3,'Expanded detail must not overflow at '+width+'px: '+JSON.stringify(dims));
 }
 console.log('PASS: Expanded record detail aligns to the content edges and fits 375/430/768/1440px');

 assert.ok(await evaluate('document.querySelectorAll("[data-use-case-id]").length===3 && document.querySelectorAll(".repo-shot").length===2 && document.querySelectorAll(".repo-guide").length===0'),'Usage Bar reader shows use cases and official screenshots, with technical guide retained only in canonical');
 assert.equal(await evaluate('document.querySelector(".detail-back a")?.getAttribute("href")'),'#/browse/all','Return from resource detail should preserve All Collections context');
 await send('Page.navigate',{url:origin+'/index.html#/browse/all'});
 await waitFor('document.querySelector("#q")?.value===""','All Collections clears prior search');
 await evaluate('(()=>{const el=document.querySelector("#q");el.value="aiposthub-awesome-opensource-ai-cheat-sheets-guide";el.dispatchEvent(new Event("input",{bubbles:true}));return true})()');
 await waitFor('document.querySelector(\'#app a[href="#/resources/aiposthub-awesome-opensource-ai-cheat-sheets-guide"]\')!==null','Original article and upstream repo resource searchable');

 await evaluate('document.querySelector("#app .card a.title-link").click();true');
 await waitFor('document.querySelector(".detail-panel h2")?.textContent.includes("AI 工程決策速查表")','Article detail opens');
 await waitFor('document.querySelectorAll(".learn-module").length===10','Ten study modules rendered from the saved original Resource');
 const studyContent=await evaluate('({heroHidden:!document.querySelector(".hero")||document.querySelector(".hero").hidden,outcomes:document.querySelectorAll(".learn-outcome").length,modules:document.querySelectorAll(".learn-module-inline").length,notes:document.querySelectorAll(".learn-essentials li").length,exercises:document.querySelectorAll(".learn-apply").length,readPath:document.querySelectorAll(".learn-path li").length,practice:document.querySelectorAll(".learn-practice li").length,sourceLinks:document.querySelectorAll(".learn-reference a[href*=sraodev]").length,defaultExternalLinks:document.querySelectorAll(".learn-path a").length,accordionCount:document.querySelectorAll(".learn-module summary").length,readerCases:document.querySelectorAll("[data-use-case-id]").length})');
 assert.ok(studyContent.heroHidden&&studyContent.outcomes===0&&studyContent.modules===10&&studyContent.notes===30&&studyContent.exercises===10&&studyContent.readPath===0&&studyContent.practice>=4&&studyContent.sourceLinks===10&&studyContent.defaultExternalLinks===0&&studyContent.accordionCount===0&&studyContent.readerCases===4,'Inline lesson must include all source-backed knowledge and keep provenance: '+JSON.stringify(studyContent));
 const decision=await evaluate('({heroCount:document.querySelectorAll(".learning-guide .learn-header").length,decisionRows:document.querySelector(".learn-decision")?.querySelectorAll("tbody tr").length,decisionChecks:document.querySelectorAll(".learn-principle-check").length,decisionText:document.querySelector(".learn-decision")?.textContent})');
 assert.ok(decision.heroCount===0&&decision.decisionRows===5&&decision.decisionChecks>=3&&decision.decisionText.includes("固定 Workflow")&&decision.decisionText.includes("Agent"),'No duplicate intro; reader should see an actual decision tree for Agent selection: '+JSON.stringify(decision));
  const readability=await evaluate('({rendered:document.querySelectorAll(".learn-module-inline .learn-essentials li").length,visible:!!document.querySelector(".learn-essentials li")?.getClientRects().length,firstLesson:document.querySelector(".learn-module-inline")?.textContent})');
 assert.ok(readability.visible&&readability.rendered===30&&readability.firstLesson.includes("自己試試看")&&readability.firstLesson.includes("三個判斷原則"),'Lessons should already be readable without clicking summaries or leaving the website');
 console.log('PASS: No duplicate learning hero; five design choices, three Agent gates, thirty visible points');
 for(const width of [375,430,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await pause(80);
  const dims=await evaluate('({viewport:document.documentElement.clientWidth,content:document.documentElement.scrollWidth,guide:document.querySelector(".learning-guide")?.getBoundingClientRect().width})');
  assert.ok(dims.content<=dims.viewport+3,'Study guide must fit '+width+'px: '+JSON.stringify(dims));
  if(width===375||width===1440){
   const capture=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   fs.writeFileSync(path.join(screenshotDir,'resource-learning-'+width+'.png'),Buffer.from(capture.data,'base64'));
  }
 }
 console.log('PASS: Inline ten teaching chapters, five outcomes, thirty principles, responsive reading');

 assert.ok(await evaluate('!!document.querySelector(".external-links a[href*=sraodev]")'),'Upstream source repository link must be visible');
 console.log('PASS: All Collections retains all six data types, both saved sources and independent deep links');

 // Phase 3: four distinct resource detail pages, actual rendered DOM at target widths.
 const phase3=[
  ['agent-reach','.resource-reader-guide','整理三篇研究文章'],
  ['arrow-2','.resource-reader-guide','製作一組網站圖示'],
  ['addyosmani-agent-skills','.resource-reader-guide','驗收表單儲存功能'],
  ['ai-code-acceptance-review-testing-rollout-guide','.learning-guide','主題重點筆記（4 章）'],
  ['pydantic-pydantic-ai','.resource-reader-guide','實際應用：AI 履歷分析'],
  ['huggingface-smolagents','.resource-reader-guide','庫存查詢與缺貨分析'],
  ['microsoft-ai-agents-for-beginners','.learning-guide','主題重點筆記（3 章）'],
  ['nirdiamant-genai-agents','.resource-reader-guide','比較客服問題的分流方法'],
  ['anthropics-skills','.resource-reader-guide','建立 Resource 整理 Skill'],
  ['openrouter-ai','.resource-reader-guide','替摘要應用選擇模型'],
  ['google-pagespeed-insights','.resource-reader-guide','驗收作品集首頁改版'],
  ['google-fonts','.resource-reader-guide','為中英雙語作品集選字型'],
  ['coolors','.resource-reader-guide','整理作品集的基本色彩系統'],
  ['artlist','.resource-reader-guide','為產品介紹影片準備配樂'],
  ['davinci-resolve','.resource-reader-guide','剪輯一支產品介紹影片'],
  ['google-flow','.resource-reader-guide','製作三鏡頭概念短片'],
  ['ffmpeg','.resource-reader-guide','批次輸出已完成的短影片'],
  ["systran-faster-whisper",".resource-reader-guide","為產品介紹影片建立字幕草稿"],
  ["manimcommunity-manim",".resource-reader-guide","製作一段幾何變化解說影片"],
  ["mrdoob-three-js",".resource-reader-guide","製作網頁 3D 產品預覽"],
  ["comfy-org-comfyui",".resource-reader-guide","批次生成產品概念圖"],
  ["lottiefiles-dotlottie-web",".resource-reader-guide","為表單儲存加入完成動畫"],
  ["infiniflow-ragflow",".resource-reader-guide","建立公司規章問答測試"],
  ["toeverything-affine",".resource-reader-guide","整理個人 AI 工具研究工作區"],
  ["blender-blender",".resource-reader-guide","渲染產品旋轉預覽"],
  ["heygen-com-hyperframes",".resource-reader-guide","製作三段式產品介紹影片"],
  ["theatlasteam-motion-design-skill",".resource-reader-guide","製作可互動的數字滾動示意"],
  ["microsoft-autogen",".resource-reader-guide","研究撰稿與審查代理的協作"],
  ["roocodeinc-roo-code",".resource-reader-guide","設計規劃與開發模式的權限測試"],
  ["recraft",".resource-reader-guide","製作網站分類圖示"],
  ["remove-bg",".resource-reader-guide","整理電商商品去背流程"],
  ["rive",".resource-reader-guide","設計表單儲存狀態動畫"],
  ["pinterest-visual-reference",".resource-reader-guide","建立作品集視覺靈感看板"],
  ["landing-love",".resource-reader-guide","研究作品集首頁滾動動效"],
  ["maxibestof",".resource-reader-guide","規劃編輯式作品集首頁"],
  ["motion-sites",".resource-reader-guide","設計知識庫卡片的微互動"],
  ["google-stitch",".resource-reader-guide","規劃履歷投遞管理介面"],
  ["vercel-ai-gateway",".resource-reader-guide","驗證摘要服務的模型備援"],
  ["pythonanywhere",".resource-reader-guide","部署簡單的公開筆記展示頁"],
  ["higgsfield-ai",".resource-reader-guide","規劃三鏡頭商品宣傳短片"],
  ["inspora",".resource-reader-guide","建立產品品牌風格參考表"],
  ["chatcut",".resource-reader-guide","剪輯產品操作示範影片"],
  ["motionsites-ai",".resource-reader-guide","規劃投遞管理 Dashboard"],
  ["vercel-skills-sh",".resource-reader-guide","選擇程式審查 Skill"],
  ["meigen-ai",".resource-reader-guide","設計商品海報的生成測試"],
  ["openai-codex-security",".resource-reader-guide","規劃合成表單專案安全審查"],
  ["ibkr-portfolioanalyst",".resource-reader-guide","設計每月資產與交易回顧"],
  ["llm",".resource-reader-guide","比較三個模型的摘要表現"],
  ["ollama-ollama",".resource-reader-guide","設計本機研究筆記摘要服務"],
  ["playwright",".resource-reader-guide","驗收申請表單儲存功能"],
  ["n8n-io-n8n",".resource-reader-guide","規劃每日報表整理流程"],
  ["orca",".resource-reader-guide","分開開發網頁與回歸測試"],
  ["hindsight",".resource-reader-guide","設計跨任務研究記憶測試"],
  ["openai-codex",".resource-reader-guide","修正表單儲存錯誤"],
  ["openui",".resource-reader-guide","呈現研究摘要與來源卡片"],
  ["vercel-labs-skills-cli",".resource-reader-guide","規劃專案專用程式審查技能"],
  ["browser-use-browser-use",".resource-reader-guide","整理公開文件的指定欄位"],
  ["anomalyco-opencode",".resource-reader-guide","先分析再修正網頁顯示問題"],
  ["langgenius-dify",".resource-reader-guide","規劃每週報表摘要流程"],
  ["open-webui-open-webui",".resource-reader-guide","規劃本機模型聊天介面"],
  ["unclecode-crawl4ai",".resource-reader-guide","規劃公開文件的知識庫匯入"],
  ["opendatalab-mineru",".resource-reader-guide","規劃研究文件解析與搜尋"],
  ["openclaw-openclaw",".resource-reader-guide","規劃只讀個人研究助理"],
  ["r0x0r-pywebview",".resource-reader-guide","規劃本機 HTML 筆記閱讀器"],
  ["ant-design-ant-design",".resource-reader-guide","規劃申請審核管理頁"],
  ["chakra-ui-chakra-ui",".resource-reader-guide","規劃投遞管理系統的設計規則"],
  ["saadeghi-daisyui",".resource-reader-guide","規劃知識庫主題與側邊導覽"],
  ["lucide-icons",".resource-reader-guide","規劃知識庫導覽及工具列圖示"],
  ["shadcn-ui",".resource-reader-guide","規劃履歷管理系統的共用元件"],
  ["motion-dev",".resource-reader-guide","規劃知識庫詳情面板動效"],
  ["magicuidesign-magicui",".resource-reader-guide","規劃作品集成果數字與功能展示"],
  ["anime-js",".resource-reader-guide","規劃作品集功能展示動畫"],
  ["kokonut-ui",".resource-reader-guide","規劃 AI 研究助理的操作核准介面"],
  ["gsap-skills",".resource-reader-guide","規劃產品首頁滾動展示的 Agent 任務"],
  ["uiverse-io-galaxy",".resource-reader-guide","規劃知識庫搜尋欄與卡片樣式"],
  ["motion-dev-animations-skill",".resource-reader-guide","規劃作品集卡片動效驗收"],
  ["googlechrome-modern-web-guidance",".resource-reader-guide","規劃知識庫的原生響應式導覽"],
  ["elayadesign-ai-design-skills",".resource-reader-guide","規劃產品首頁與 Figma 設計規則"],
  ["leonxlnx-taste-skill",".resource-reader-guide","規劃企業首頁的設計與驗收流程"],
  ["impeccable",".resource-reader-guide","審查履歷管理系統的既有頁面"],
  ["frontend-design",".resource-reader-guide","規劃具有明確主題的作品集首頁"],
  ["pcottle-learn-git-branching",".resource-reader-guide","練習 Local Git 的分支與合併"],
  ["stitch-skills",".resource-reader-guide","規劃履歷投遞管理畫面的設計迭代"],
  ["cathrynlavery-diagram-design",".resource-reader-guide","規劃資料管線的技術交接圖"],
  ["yanliudesign-mono-color-skill",".resource-reader-guide","規劃雙色展覽海報的視覺配方"],
  ["gzh-design-skill",".resource-reader-guide","規劃技術教學長文的公眾號排版"],
  ["baoyu-skill",".resource-reader-guide","規劃 AI 教材文章的封面與插圖發布"],
  ["ui-ux-gold-standard",".resource-reader-guide","規劃資料分析 Dashboard 的共用設計規則"],
  ["electron",".resource-reader-guide","規劃離線個人知識庫的桌面應用"],
  ["oh-my-mermaid",".resource-reader-guide","規劃知識庫專案的可展開架構文件"],
  ["abi-screenshot-to-code",".resource-reader-guide","規劃履歷管理介面截圖的前端原型重建"],
  ["react-frontend-backend-for-beginners",".resource-reader-guide","判斷履歷管理網站的前後端及部署方式"],
  ["ryanhanwu-how-to-ask-questions-the-smart-way",".resource-reader-guide","將無法儲存的表單問題整理成工程除錯單"],
  ["dslab-lessons",".resource-reader-guide","規劃第一支 AI 影音的學習與驗收流程"],
  ["research-to-diagram",".resource-reader-guide","規劃 AI Agent 元件關係的研究圖解"],
  ["kubai087-kubai-icons",".resource-reader-guide","規劃履歷管理系統的統一功能圖示"],
  ["claude-svg-animation-logo-loading-chart-tutorial",".resource-reader-guide","規劃資料分析網站的動畫與靜態替代方案"],
  ["reactive-resume",".resource-reader-guide","規劃職缺專屬履歷版本及面試追蹤"],
  ["codebase-index",".resource-reader-guide","規劃修改履歷表單前的程式影響分析"],
  ["code-graph",".resource-reader-guide","規劃共用驗證函式的修改影響檢查"],
  ["codebase-memory-mcp",".resource-reader-guide","規劃跨模組功能與部署路徑的追蹤"],
  ["graphify-labs-graphify",".resource-reader-guide","規劃程式碼與公開技術筆記的知識圖譜"],
  ["anthropic-solving-code-review-at-anthropic",".resource-reader-guide","規劃 AI 修改表單功能的風險分級驗收"],
  ["pingdotgg-t3code",".resource-reader-guide","規劃多個 Coding Agent 的分支與遠端核准流程"],
  ["claude-codex-harness-sync",".resource-reader-guide","規劃 Claude Code 與 Codex 的共用開發規則維護"],
  ["df3011212-codex-local-board",".resource-reader-guide","規劃多專案 Agent 工作進度與驗收看板"],
  ["rtk",".resource-reader-guide","規劃 Coding Agent 的終端輸出與除錯回溯"],
  ["github-agentic-workflows",".resource-reader-guide","規劃 CI 失敗分析與受控 Issue 回報流程"],
  ["anthropics-sandbox-runtime",".resource-reader-guide","規劃 MCP Server 的檔案與網路最小權限"],
  ["anthropics-single-agent-loop-kit",".resource-reader-guide","規劃客服 Agent 架構精簡與逐次驗收"],
  ["agentic-system-lab-harness-relay",".resource-reader-guide","規劃多 Agent 平行修正與人工選擇最佳方案"],
  ["humanlayer",".resource-reader-guide","規劃跨 Session 的履歷系統功能開發與審查"],
  ["zed-industries-zed",".resource-reader-guide","規劃編輯器內的 AI 程式修改與權限審查"],
  ["herdrdev-herdr",".resource-reader-guide","規劃多主機 Coding Agent 終端與交接監控"],
  ["microsoft-tokeneconomizer",".resource-reader-guide","規劃重複開發任務的成本與品質對照實驗"],
  ["paperclip",".resource-reader-guide","規劃 AI Cowork 團隊的任務派發與預算治理"],
  ["graft",".resource-reader-guide","規劃大型專案的結構化讀取與 Context 控制"],
  ["strelov1-freehire-mcp",".resource-reader-guide","規劃 JD 搜尋、證據式履歷與求職進度管理"],
  ["arumwu-agentrelay",".resource-reader-guide","規劃兩個 Coding Agent 的跨工作階段交接"],
  ["charonyuu-whatsmyagentdoing",".resource-reader-guide","規劃多 Agent 等待人工處理的監控面板"],
  ["kieiken-project-hub",".resource-reader-guide","規劃個人專案與 AI 任務的工作台"],
  ["bi0h4z4rd88-pi-sidebar-tui",".resource-reader-guide","規劃 Pi 終端內的 Context 與任務資訊面板"],
  ["gagansd-herdr-insights",".resource-reader-guide","規劃跨 Coding Agent 的本機用量分析"],
  ["lakris2407-herdr-agent-quota",".resource-reader-guide","規劃跨供應商使用額度與支出的提醒面板"],
  ["allanyiin-toolanything",".resource-reader-guide","規劃企業查詢工具的跨協議契約"],
  ["allanyiin-documa",".resource-reader-guide","規劃長文件知識庫的逐步閱讀與引用"],
  ["yusufkaraaslan-skill-seekers",".resource-reader-guide","規劃公開技術文件的知識包製作"],
  ["mattpocock-skills",".resource-reader-guide","規劃從模糊需求到可驗證的功能修正"],
  ["garrytan-gstack",".resource-reader-guide","規劃功能需求、程式審查與 QA 證據的交付流程"],
  ["affaan-m-ecc",".resource-reader-guide","規劃 Agent 工作階段保存與交付驗收"],
  ["anthropics-knowledge-work-plugins",".resource-reader-guide","規劃企業資料分析與審查的職能插件組合"],
  ["anthropics-financial-services",".resource-reader-guide","規劃金融對帳差異的分層讀取與覆核"],
  ["pramoddutta-botskills",".resource-reader-guide","規劃只在測試環境運作的 Bug 重現 Bot"],
  ["aws-samples-sample-agent-cost-bench",".resource-reader-guide","規劃跨 Coding Agent 的成本與功能品質對照"],
  ["gggodlin-cc-harness",".resource-reader-guide","規劃 Agent 修改工作規則時的授權與證據閘門"],
  ["cloudflare-cloudflare-os",".resource-reader-guide","規劃企業知識工作區的讀取與外部寫入核准"],
  ["michael-denyer-pstack-claude",".resource-reader-guide","規劃跨 Claude Code 與 Codex 的專案驗收技能"],
  ["cursor-pstack-poteto",".resource-reader-guide","規劃複雜功能的架構選型與實際操作驗收"],
  ["agency-agents",".resource-reader-guide","規劃資料管線與儀表板的跨角色交付審查"],
  ["ai-memory",".resource-reader-guide","規劃跨 Coding Agent 的持久記憶與交接"],
  ["amp-agent-memory-protocol",".resource-reader-guide","規劃多 Agent 的 GitHub 記憶索引與按需讀取"],
  ["hermes-memory-wiki",".resource-reader-guide","規劃個人 Agent 歷史對話的唯讀知識索引"],
  ["garrytan-gbrain",".resource-reader-guide","規劃跨 Agent 的專案決策記憶與修正"],
  ["claude-mem",".resource-reader-guide","規劃跨開發 Session 的分層記憶檢索"],
  ["hermes-backsearch",".resource-reader-guide","規劃歷史研究的時點資料檢索與驗收"],
  ["onyx",".resource-reader-guide","規劃企業文件搜尋的權限與引用驗收"],
  ["nvidia-auto-ontology",".resource-reader-guide","規劃跨資料庫的商業資料語意與 Lineage"],
  ["wrenai",".resource-reader-guide","規劃有商業指標定義的自然語言 BI 查詢"],
  ["nvidia-skillspector",".resource-reader-guide","規劃第三方 Skill 安裝前的安全審查"],
  ["pii-guard",".resource-reader-guide","規劃繁體中文文件送入模型前的去識別化"],
  ["hermes-snyk-plugin",".resource-reader-guide","規劃開發專案的依賴與程式碼掃描驗收"],
  ["composiohq-awesome-claude-skills",".resource-reader-guide","規劃文件分析與 CRM 自動化的技能候選清單"],
  ["voltagent-awesome-agent-skills",".resource-reader-guide","規劃跨 Agent 的技能選用與安裝前審查"],
  ["voltagent-awesome-openclaw-skills",".resource-reader-guide","規劃 OpenClaw 個人知識管理技能選型"],
  ["hesreallyhim-awesome-claude-code",".resource-reader-guide","規劃 Claude Code 專案的記憶與驗收工具選型"],
  ["shubhamsaboo-awesome-llm-apps",".resource-reader-guide","規劃從 CSV 問答到有引用與記憶的 AI 應用原型"],
  ["cursor-plugins",".resource-reader-guide","規劃開發團隊的 Cursor 插件選用與治理"],
  ["awesome-agentic-ai-zh",".resource-reader-guide","規劃 Agent 開發與工作應用的個人學習路線"],
  ["ice1187-tw-security-and-ctf-resource",".resource-reader-guide","規劃 AI 專案開發者的資安基礎與合法練習"],
  ["wilsonfreitas-awesome-quant",".resource-reader-guide","規劃可重現的歷史市場資料與風險研究"],
  ["mukul975-anthropic-cybersecurity-skills",".resource-reader-guide","規劃企業 Agent 的安全治理與事件審查技能選型"],
  ["k-dense-ai-scientific-agent-skills",".resource-reader-guide","規劃公開研究資料的查詢與分析技能"],
  ["coreyhaines31-marketingskills",".resource-reader-guide","規劃產品頁的定位、文案與轉換實驗"],
  ["twood2024-prelaunch-check-defense",".resource-reader-guide","規劃網站與 AI 應用的上線前防禦檢查"],
  ["agricidaniel-claude-seo",".resource-reader-guide","規劃網站內容與 SEO 變更驗收"],
  ["kkkkhazix-khazix-skills",".resource-reader-guide","規劃個人工作協作、磁碟盤點與文章整理"],
  ["bruiandy-claude-obsidian",".resource-reader-guide","規劃有來源紀錄的 Obsidian 知識整理流程"],
  ["kepano-obsidian-vault-template",".resource-reader-guide","規劃日誌、來源剪藏與專案追蹤範本"],
  ["kepano-obsidian-minimal",".resource-reader-guide","規劃知識庫專注閱讀與卡片瀏覽介面"],
  ["vulture-s-whisper-guard",".resource-reader-guide","規劃中文轉錄幻覺過濾與誤刪驗收"],
  ["shubhamsaboo-needle",".resource-reader-guide","規劃長文件語意定位及原句回查"],
  ["openhands-agent-canvas",".resource-reader-guide","規劃多 Agent 執行環境與擴充介面治理"],
  ["debpalash-voicestudio",".resource-reader-guide","規劃雙語教學影片配音與音訊品質驗收"],
  ["leemysw-yovoice",".resource-reader-guide","規劃多版本旁白生成與本機音檔管理"],
  ["ath-maas-pixelle-video",".resource-reader-guide","規劃自有知識短影音的分鏡與合成驗收"],
  ["blader-humanizer",".resource-reader-guide","規劃技術文件與工作訊息的保真文字編輯"],
  ["heydamir-unslop",".resource-reader-guide","規劃儀表板視覺改善與前後對照驗收"],
  ["lieflat-less-ai-tone",".resource-reader-guide","規劃中文技術文章的分級審查與保真改寫"],
  ["harry0703-moneyprinterturbo",".resource-reader-guide","規劃知識短影音的任務清單與素材品質驗收"],
  ["hbai-ltd-toonflow-app",".resource-reader-guide","規劃分鏡工作區的媒體生成與取消驗收"],
  ["chatfire-ai-huobao-drama",".resource-reader-guide","規劃自有短劇的角色資產與分鏡提示詞驗收"],
  ["kepano-40-questions",".resource-reader-guide","規劃年度與十年個人反思紀錄的長期比較"],
  ["unclebob-ub-mode",".resource-reader-guide","規劃既有專案的最小修正與工程品質驗收"],
  ["qingyuna-answer-me-with-html",".resource-reader-guide","規劃可離線技術教材的引用與安全驗收"],
  ["thu-maic-openmaic",".resource-reader-guide","規劃 AI 互動教室的教材生成與大綱確認"],
  ["jit-learning-loop",".resource-reader-guide","規劃工程任務的學習檢查與可轉移知識紀錄"],
  ["alexyc9381-hiring-panel-skill",".resource-reader-guide","規劃職缺客製履歷的多角色審查與事實驗收"],
  ["loopagentteams",".resource-reader-guide","規劃多 Agent 任務的進度保存與主控恢復驗收"],
  ["deepseek-dsh-superagent-prototype",".resource-reader-guide","規劃事件驅動 Agent 的准入與回覆可靠性驗收"],
  ["dominicrico-jev-router",".resource-reader-guide","規劃 Coding Agent 的模型路由與快取策略驗收"],
  ["akto-api-security-akto",".resource-reader-guide","規劃企業 AI 工具盤點與安全政策覆蓋驗收"],
  ["usestrix-strix",".resource-reader-guide","規劃安全報告的覆蓋證據與匯出品質驗收"],
  ["wquguru-cicada",".resource-reader-guide","規劃已授權會議紀錄的搜尋與私人知識庫匯出"],
  ["guizang-product-video-skill",".resource-reader-guide","規劃自有產品更新影片的影音同步與交付驗收"],
  ["zhouxiaoka-autoclip",".resource-reader-guide","規劃短影音生成工作的逾時取消與日誌安全驗收"],
  ["juneyaooo-rea-video",".resource-reader-guide","規劃自有影片的素材分析與原創分鏡製作規格"],
  ["alchaincyf-huashu-motion",".resource-reader-guide","規劃程式動效影片的渲染與品質檢查"],
  ["hao0321-editkin",".resource-reader-guide","規劃剪輯渲染圖與色彩處理的契約驗收"],
  ["lucasmarkes-hairline",".resource-reader-guide","規劃互動線條圖形的參數與動效驗收"],
  ["nutlope-hallmark",".resource-reader-guide","規劃前端設計主題選擇與規則檢查驗收"],
  ["akas333-tysa",".resource-reader-guide","規劃個人學習平台的課程進度與題庫驗收"],
  ["minchenlee-loadsketch",".resource-reader-guide","規劃架構模擬的公平比較與延遲驗收"],
  ["madebypan-figcc",".resource-reader-guide","規劃自有設計畫布的選取內容與權限驗收"],
  ["lawpowen-ui-design-codex-bundle",".resource-reader-guide","規劃設計知識庫的資料契約與決策規則驗收"],
  ["seokwoooo-lucian-uxui-prompt",".resource-reader-guide","規劃互動元件收藏庫的建置與操作驗收"],
  ["rociiu-talorys",".resource-reader-guide","規劃私人 Agent 記憶版本與待核准動作驗收"],
  ["danyuchn-claude-work-mode",".resource-reader-guide","規劃 Coding Agent 工作模式與決策邊界驗收"],
  ["social-post",".resource-reader-guide","規劃社群內容工作流的授權與證據驗收"],
  ["storytold-artcraft",".resource-reader-guide","規劃影音創作工作台的素材與生成狀態驗收"],
  ["storytold-filmcraft",".resource-reader-guide","規劃影片剪輯專案的復原與匯出可靠性驗收"],
  ["lemomo-ai-lemo-opuscar",".resource-reader-guide","規劃程式影片的文字可讀性與字幕時間驗收"],
  ["nanako0129-syrtis",".resource-reader-guide","規劃 AI 用量監測的週期證據與隱私驗收"],
  ["block-buzz",".resource-reader-guide","規劃多 Agent 頻道事件的路由與佇列驗收"],
  ["makecindy-cindy",".resource-reader-guide","規劃跨 Harness Agent 的能力與 Session 驗收"],
  ["mars-tw-freedom-erp-crm",".resource-reader-guide","規劃模擬 ERP 工作區的資料一致性與備份驗收"],
  ["zichuanlan-freebie-radar",".resource-reader-guide","規劃資訊雷達的去重與分類證據驗收"],
  ["hirakujira-pokeep",".resource-reader-guide","規劃本機收藏資料的備份與建議可追溯驗收"],
  ["forget-c-jellyfish",".resource-reader-guide","規劃短劇專案的章節與生成任務驗收"],
  ["waooai-waoowaoo",".resource-reader-guide","規劃影音工作區的模型與資料寫入規則驗收"],
  ["ai-video-drama-platform",".resource-reader-guide","規劃文字故事至分鏡及測試影片的契約驗收"],
  ["blave-agent",".resource-reader-guide","規劃歷史研究成本與損益證據核對"],
  ["kerr20801-taiwan-stock-ai-analyzer",".resource-reader-guide","規劃台股分析分數的缺值與模擬資料辨識"],
  ["zhulinsen-daily-stock-analysis",".resource-reader-guide","規劃分析儀表板的資料來源與歷史追溯"],
  ["anti-gambling-trader-tw",".resource-reader-guide","規劃交易紀錄可信度與反詐證據稽核"],
  ["jakeschincariol-day-trader-skill",".resource-reader-guide","規劃合成交易提案的風險與回放測試"],
  ["pomerado-pomerado",".resource-reader-guide","規劃已授權網站整合的安全邊界驗收"],
  ["onetake",".resource-reader-guide","規劃非商業產品動效練習的畫面回歸驗收"],
  ["jub0t-concat",".resource-reader-guide","規劃影片剪輯工作與匯出狀態驗收"],
  ["awesome-gpt-image-2",".resource-reader-guide","規劃自有提示詞收藏目錄的多語索引"],
  ["photo-riso-poster",".resource-reader-guide","規劃自有照片的證據式抽象海報設計"],
  ["copywriting-skill",".resource-reader-guide","規劃自有產品頁文案的主張與保真驗收"],
  ["akseolabs-seo-cinematic-ui",".resource-reader-guide","規劃自有網站與工作台的動效及狀態驗收"],
  ["acheaisuiyimen-ache-life-to-comic-skill",".resource-reader-guide","規劃非商業生活漫畫手帳的素材與原文保真驗收"],
  ["alchaincy-huashu-design",".resource-reader-guide","規劃自有前端原型的設計方向與畫面驗收"],
  ["ayueh0102-ronnier-skill",".resource-reader-guide","規劃色彩科學學習筆記的名詞與證據核對"],
  ["blogger-distiller",".resource-reader-guide","規劃內容研究資料的隱私與品質驗收"],
  ["bobyu89-codex-ppt-style-expanded",".resource-reader-guide","規劃可編輯技術簡報的風格與版面驗收"],
  ["ecpay-ecpay-api-skill",".resource-reader-guide","規劃企業金流與發票整合的測試驗收清單"],
  ["gbro-collage-broll",".resource-reader-guide","規劃自有教學短片的首尾影格生成驗收"],
  ["gbro-cover-design",".resource-reader-guide","規劃文章封面提示詞與素材權利驗收"],
  ["hkuds-vimax",".resource-reader-guide","規劃影片生成後端的圖片格式與配置驗收"],
  ["irons163-three-tier-agent-orchestrator",".resource-reader-guide","規劃自有 AI Cowork 的委派與獨立驗收"],
  ["laya",".resource-reader-guide","規劃本機分類器的輸入契約與信心驗收"],
  ["cyyeh-agent-loop-visualizer",".resource-reader-guide","規劃 Agent 迴圈教學的事件與狀態驗收"],
  ["openchatx",".resource-reader-guide","規劃本機 Agent 的 Session 隔離與資源計量驗收"],
  ["rankupgames-spectra",".resource-reader-guide","規劃本機程式碼索引的增量證據與同步驗收"],
  ["strelov1-freehire",".resource-reader-guide","規劃自有職缺追蹤系統的搜尋與資料正規化"],
  ["citypulso-pulsoicon",".resource-reader-guide","規劃動態圖示的播放狀態與無障礙驗收"],
  ["punk-skill",".resource-reader-guide","規劃非商業視覺提示詞庫的規格驗收"],
  ["openmontage",".resource-reader-guide","規劃影音工作流的產物與付費請求驗收"],
  ["omniroute",".resource-reader-guide","規劃模型路由目錄的新鮮度與快取驗收"],
  ["minimax-m3-1-flash",".resource-reader-guide","規劃多模態模型的離線評估與部署前提"],
  ["minimax-code",".resource-reader-guide","規劃 Coding Agent 的變更範圍與交付驗收"],
  ["april-zhu-minicharts",".resource-reader-guide","規劃自有數據的主題式圖表與比例驗收"],
  ["brandonhimpfen-awesome-finance",".resource-reader-guide","規劃金融研究資源目錄的分類與連結治理"],
  ["herdr-mods-gallery",".resource-reader-guide","規劃自有工作台擴充的配方與發布驗收"],
  ["typesafe-ai-jev",".resource-reader-guide","規劃型別化客服決策的輸入與獨立驗收"],
  ["zeabur-oss-ai-agent-installer-guide",".resource-reader-guide","規劃自有伺服器的安裝前檢查與授權閘道"],
  ["tradingview-pine-screener-strategy-tester",".resource-reader-guide","規劃金融研究的篩選與回測證據核對"],
  ["skillry-web-design-template-skills",".resource-reader-guide","規劃自有作品集的版型採用與畫面驗收"],
  ["skillry-opus-5-5-video-pattern-library",".resource-reader-guide","規劃自有動效影片的參考模式與重製驗收"],
  ["zenbuapps",".resource-reader-guide","規劃小型服務業網站的預約與客服驗收"],
  ["bencho",".resource-reader-guide","設計作品集的互動操作與回饋"],
  ["fomofly-ai",".resource-reader-guide","從一段自有教學影片規劃短影音交付"],
  ["sona-orbit-parroting",".resource-reader-guide","規劃中英混合語音輸入的品質比較"],
  ["anthropic-claude-mythos-cybersecurity",".resource-reader-guide","制定企業防禦研究的模型採用審查表"],
  ["engineering-leadership-adobe-tech-lead-ai",".resource-reader-guide","規劃 AI 協作開發的交付與審查機制"],
  ["better-me-notes-amie",".resource-reader-guide","規劃個人成長閱讀與反思筆記"],
  ["littlehole2025-token-saver",".resource-reader-guide","規劃長對話工作交接的提示及狀態驗收"],
  ["rea",".resource-reader-guide","規劃自有軟體的獨立證據驗收"],
  ["alsyundawy-microsoft-office-for-macos",".resource-reader-guide","規劃企業 Mac Office 軟體來源與授權查核"],
  ["letswrite-buzz-self-hosted-relay-guide",".resource-reader-guide","規劃隔離的 Buzz 協作工作台部署驗收"],
  ["designed-to-scale",".resource-reader-guide","規劃系統設計課程的自學與應用驗收"],
  ["stitch-mcp",".resource-reader-guide","規劃作品集設計 Agent 的工具與產物驗收"],
  ["land-book-design-inspiration",".resource-reader-guide","規劃作品集首頁的設計參考與採用審查"],
  ["particles-casberry",".resource-reader-guide","規劃自有網站粒子背景的動效與效能驗收"]
 ];
 for(const [id,selector,phrase] of phase3){
  await send('Page.navigate',{url:origin+'/index.html#/resources/'+id});
  await waitFor('(()=>{const node=document.querySelector('+JSON.stringify(selector)+');return location.hash==='+JSON.stringify('#/resources/'+id)+'&&node?.textContent.includes('+JSON.stringify(phrase)+')})()','Phase 3 '+id);
  for(const width of [375,430,768,1440]){
   await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
   await pause(140);
   const dims=await evaluate('({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth})');
   assert.ok(dims.scroll<=dims.width+3,'Phase 3 horizontal overflow '+id+' '+width+': '+JSON.stringify(dims));
   if(width===375||width===1440){
    const capture=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    fs.writeFileSync(path.join(screenshotDir,'phase3-'+id+'-'+width+'.png'),Buffer.from(capture.data,'base64'));
   }
  }
  if(phase3.some(row=>row[0]===id)){
   assert.equal(await evaluate('document.querySelectorAll(".repo-guide").length'),0);
   assert.ok(await evaluate('document.querySelectorAll("[data-use-case-id]").length>=3'));
   assert.ok(await evaluate('!!document.querySelector("[data-example-id]")'));
   assert.equal(await evaluate('location.hash'),'#/resources/'+id);
  }
  if(['ai-code-acceptance-review-testing-rollout-guide','microsoft-ai-agents-for-beginners',"react-frontend-backend-for-beginners","ryanhanwu-how-to-ask-questions-the-smart-way","dslab-lessons","claude-svg-animation-logo-loading-chart-tutorial","anthropic-solving-code-review-at-anthropic"].includes(id)){
   const expected=id==='ai-code-acceptance-review-testing-rollout-guide'?4:3;
   assert.equal(await evaluate('document.querySelectorAll(".learn-module-inline").length'),expected);
   assert.equal(await evaluate('document.querySelectorAll(".learn-apply").length'),expected);
  }
 }
 console.log('PASS: Phase 3 Resource pages at 375/430/768/1440px; human-first reader guides and learning exercises');


 // The intent-first entry synthesizes from the complete collection, not curated Problems alone.
 await send('Page.navigate',{url:origin+'/ask.html'});
 await waitFor('document.querySelector("#ask-meta")?.textContent.includes("已載入")','Knowledge answer page loaded');
 const initialKnowledge=await evaluate('({count:document.querySelector("#ask-meta")?.textContent,nav:!!document.querySelector(\'nav a[href="index.html#/browse/all"]\'),presets:document.querySelectorAll("[data-question]").length})');
 assert.ok(initialKnowledge.count.includes(String(catalogRecordCount))&&initialKnowledge.nav&&initialKnowledge.presets>=4,'Ask page must reference all saved records and preserve All Collections navigation');
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
