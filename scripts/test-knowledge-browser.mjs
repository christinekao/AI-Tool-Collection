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

 assert.ok(await evaluate('document.querySelectorAll("#repo-compose .repo-capability").length>0 && document.querySelectorAll("#repo-rebuild .repo-rebuild-stage").length>0'),'Resource detail must show capability contracts and rebuild guidance');
 assert.equal(await evaluate('document.querySelector(".detail-back a")?.getAttribute("href")'),'#/browse/all','Return from resource detail should preserve All Collections context');
 await send('Page.navigate',{url:origin+'/index.html#/browse/all'});
 await waitFor('document.querySelector("#q")?.value===""','All Collections clears prior search');
 await evaluate('(()=>{const el=document.querySelector("#q");el.value="aiposthub-awesome-opensource-ai-cheat-sheets-guide";el.dispatchEvent(new Event("input",{bubbles:true}));return true})()');
 await waitFor('document.querySelector(\'#app a[href="#/resources/aiposthub-awesome-opensource-ai-cheat-sheets-guide"]\')!==null','Original article and upstream repo resource searchable');

 await evaluate('document.querySelector("#app .card a.title-link").click();true');
 await waitFor('document.querySelector(".detail-panel h2")?.textContent.includes("AI 工程決策速查表")','Article detail opens');
 await waitFor('document.querySelectorAll(".learn-module").length===10','Ten study modules rendered from the saved original Resource');
 const studyContent=await evaluate('({heroHidden:!document.querySelector(".hero")||document.querySelector(".hero").hidden,outcomes:document.querySelectorAll(".learn-outcome").length,modules:document.querySelectorAll(".learn-module-inline").length,notes:document.querySelectorAll(".learn-essentials li").length,exercises:document.querySelectorAll(".learn-apply").length,readPath:document.querySelectorAll(".learn-path li").length,practice:document.querySelectorAll(".learn-practice li").length,sourceLinks:document.querySelectorAll(".learn-reference a[href*=sraodev]").length,defaultExternalLinks:document.querySelectorAll(".learn-path a").length,accordionCount:document.querySelectorAll(".learn-module summary").length,legacyFeatures:document.querySelector(".detail-panel")?.textContent.includes("主要功能")})');
 assert.ok(studyContent.heroHidden&&studyContent.outcomes===0&&studyContent.modules===10&&studyContent.notes===30&&studyContent.exercises===10&&studyContent.readPath===0&&studyContent.practice>=4&&studyContent.sourceLinks===10&&studyContent.defaultExternalLinks===0&&studyContent.accordionCount===0&&studyContent.legacyFeatures,'Inline lesson must include all source-backed knowledge and keep provenance: '+JSON.stringify(studyContent));
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
  ['agent-reach','.repo-guide','核心判斷規則'],
  ['arrow-2','.detail-panel','輸出驗收'],
  ['addyosmani-agent-skills','.detail-panel','選擇方法'],
  ['ai-code-acceptance-review-testing-rollout-guide','.learning-guide','主題重點筆記（4 章）'],
  ['pydantic-pydantic-ai','.repo-guide','型別化輸出'],
  ['huggingface-smolagents','.repo-guide','CodeAgent 與 ToolCallingAgent'],
  ['microsoft-ai-agents-for-beginners','.learning-guide','主題重點筆記（3 章）'],
  ['nirdiamant-genai-agents','.detail-panel','比較方式'],
  ['anthropics-skills','.detail-panel','建立及改善技能'],
  ['openrouter-ai','.detail-panel','供應商策略'],
  ['google-pagespeed-insights','.detail-panel','Field data']
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
  if(id==='agent-reach'){
   await evaluate('document.querySelector(\'.repo-toc a[href="#repo-architecture"]\').click();true');
   await pause(400);
   assert.equal(await evaluate('location.hash'),'#/resources/agent-reach','Repository section navigation must not discard resource route');
   assert.ok(await evaluate('!!document.querySelector(".repo-guide #repo-architecture")'));
  }
  if(['ai-code-acceptance-review-testing-rollout-guide','microsoft-ai-agents-for-beginners'].includes(id)){
   const expected=id==='microsoft-ai-agents-for-beginners'?3:4;
   assert.equal(await evaluate('document.querySelectorAll(".learn-module-inline").length'),expected);
   assert.equal(await evaluate('document.querySelectorAll(".learn-apply").length'),expected);
  }
 }
 console.log('PASS: Phase 3 eleven Resource pages at 375/430/768/1440px; repository section navigation and learning exercises');


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
