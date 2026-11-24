#!/usr/bin/env node
/**
 * Audit 07 real local Chromium smoke for read-only Workflow Review.
 * No npm dependencies, no external APIs, no execution of candidate tools.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {spawn,spawnSync} from 'node:child_process';

const root=process.cwd(),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'workflow-review-ui-'));
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const which=s=>{const r=spawnSync('which',[s],{encoding:'utf8'});return r.status===0?r.stdout.trim():null};
const chromeBin=['google-chrome-stable','google-chrome','chromium','chromium-browser'].map(which).find(Boolean);
if(!chromeBin)throw Error('Chrome/Chromium is required for this browser smoke');
const mime={'.html':'text/html;charset=utf-8','.json':'application/json;charset=utf-8','.css':'text/css;charset=utf-8','.js':'text/javascript;charset=utf-8'};
let chrome,ws,server;
const errors=[];
try{
 server=http.createServer((req,res)=>{
  let filename;
  try{
   const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
   filename=path.resolve(root,'.'+pathname);
  }catch{res.writeHead(400);res.end();return}
  if(!filename.startsWith(root+path.sep)||!fs.existsSync(filename)||!fs.statSync(filename).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.setHeader('Content-Type',mime[path.extname(filename)]||'text/plain;charset=utf-8');
  fs.createReadStream(filename).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 let port=0,stderr='';
 for(let attempt=1;attempt<=3;attempt++){
  const profile=path.join(tmp,'chrome-attempt-'+attempt);
  const portPath=path.join(profile,'DevToolsActivePort');
  stderr='';
  chrome=spawn(chromeBin,[
   attempt===3?'--headless':'--headless=new',
   '--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
   '--disable-background-networking','--disable-extensions','--no-first-run',
   '--remote-allow-origins=*','--remote-debugging-port=0',
   '--user-data-dir='+profile,'about:blank'
  ],{stdio:['ignore','ignore','pipe']});
  chrome.stderr.on('data',d=>{stderr+=String(d).slice(0,250)});
  for(let i=0;i<95&&!fs.existsSync(portPath);i++){
   if(chrome.exitCode!==null)break;
   await pause(150);
  }
  if(fs.existsSync(portPath)){
   port=Number(fs.readFileSync(portPath,'utf8').split('\n')[0]);
   if(port>0)break;
  }
  console.warn('Chrome attempt '+attempt+' failed: '+stderr.slice(-350));
  chrome.kill('SIGKILL');
  await pause(350);
 }
 assert.ok(port>0,'Chrome did not start after three attempts: '+stderr.slice(-600));
 const page=await fetch('http://127.0.0.1:'+port+'/json/new?'+encodeURIComponent(origin+'/playground.html'),{method:'PUT'}).then(r=>r.json());
 ws=new WebSocket(page.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
 const pending=new Map();let serial=0;
 ws.addEventListener('message',e=>{
  const msg=JSON.parse(e.data);
  if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params?.exceptionDetails?.text||'Browser exception');
  if(!msg.id)return;
  const waiter=pending.get(msg.id);
  if(!waiter)return;
  pending.delete(msg.id);
  msg.error?waiter.reject(Error(msg.error.message)):waiter.resolve(msg.result);
 });
 const send=(method,params={})=>new Promise((resolve,reject)=>{
  const id=++serial;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));
 });
 await send('Page.enable');await send('Runtime.enable');
 const evaluate=async expr=>{
  const a=await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});
  if(a.exceptionDetails)throw Error('Chromium evaluate failed: '+a.exceptionDetails.text);
  return a.result?.value;
 };
 const wait=async(expr,label)=>{
  for(let i=0;i<110;i++){const v=await evaluate(expr);if(v)return v;await pause(110)}
  throw Error('Timed out '+label);
 };
 const visit=async path=>{await send('Page.navigate',{url:origin+'/'+path});await wait('typeof PG!=="undefined"&&PG.reviewState==="ready"&&document.querySelector("#pg-editor")!==null','review '+path)};
 // Discoverability and filter
 await wait('document.querySelector("#pg-editor .pg-review-discover")!==null','homepage discovery');
 const ready=await evaluate('({reviewed:PG.reviewCases.size,filterDisabled:document.querySelector("#pg-review-only").disabled,count:document.querySelectorAll("#pg-flows [data-flow-id]").length})');
 assert.deepEqual(ready,{reviewed:17,filterDisabled:false,count:36});
 await evaluate('document.querySelector("#pg-review-only").click();true');
 const filtered=await evaluate('({count:document.querySelectorAll("#pg-flows [data-flow-id]").length,checked:document.querySelector("#pg-review-only").checked})');
 assert.equal(filtered.count,17);assert.equal(filtered.checked,true);
 console.log('PASS: 17 reviewed workflows discoverable through filter; remaining workflows preserved');
 // Recipe view: source stages are separate from interactive Recipe stages
 await visit('playground.html?workflow=stack');
 await wait('document.querySelector("#pg-reviewed-stages .pg-review-option")!==null','recipe review');
 const recipe=await evaluate('({review:document.querySelector("#pg-review-summary")?.textContent,sourceCandidates:document.querySelectorAll("#pg-reviewed-stages .pg-review-option").length,recipeSelections:document.querySelectorAll("#pg-editor [data-stage-choice]").length,sourceHeading:document.querySelector("#pg-reviewed-stages summary")?.textContent,hasAutomatedAction:!!document.querySelector("#pg-reviewed-stages [data-add-tool]")})');
 assert.ok(recipe.review.includes('候選，未驗證')&&recipe.review.includes('目前缺口'));
 assert.equal(recipe.sourceCandidates,4);
 assert.ok(recipe.recipeSelections>=3);
 assert.ok(recipe.sourceHeading.includes('原始 Workflow'));
 assert.equal(recipe.hasAutomatedAction,false);
 console.log('PASS: Source candidates are separated from editable Recipe and never auto-applied');
 // Ordinary recorded Workflow renders candidate links alongside corresponding stages
 await visit('playground.html?workflow=ai-vector-asset-code-stack');
 await wait('document.querySelectorAll("#pg-editor .pg-review-option").length===4','recorded candidate stage review');
 const recorded=await evaluate('({count:document.querySelectorAll("#pg-editor .pg-review-option").length,validLinks:[...document.querySelectorAll("#pg-editor .pg-review-option a")].every(a=>a.getAttribute("href").startsWith("index.html#/resources/")),stages:document.querySelectorAll("#pg-editor .pg-step").length,claim:document.querySelector("#pg-review-summary")?.textContent.includes("相容")})');
 assert.equal(recorded.count,4);assert.equal(recorded.validLinks,true);assert.equal(recorded.stages,4);assert.ok(recorded.claim);
 await visit('playground.html?workflow=goal-build-evidence-learning-loop');
 await wait('document.querySelector("#pg-review-summary")?.textContent.includes("0 個原有 Resource")','zero formal members');
 const empty=await evaluate('({candidateCount:document.querySelectorAll("#pg-editor .pg-review-option").length,warning:document.querySelector(".pg-review-unassigned")?.textContent.includes("沒有正式 Resource")})');
 assert.deepEqual(empty,{candidateCount:0,warning:true});
 console.log('PASS: Recorded and zero-member workflows show honest evidence boundaries');
 // Unmapped options are visible, not assigned to a non-existent stage
 await visit('playground.html?workflow=spec-multi-agent-delivery-evidence-qa-stack');
 await wait('document.querySelector("#pg-reviewed-stages .pg-review-unassigned")!==null','unmapped member');
 assert.equal(await evaluate('document.querySelector("#pg-reviewed-stages .pg-review-unassigned")?.textContent.includes("mattpocock-skills")'),true);
 // XSS escape safety on a review-only annotation
 await visit('playground.html?workflow=ai-vector-asset-code-stack');
 const escaped=await evaluate('PG.reviewCases.get("ai-vector-asset-code-stack").gap="<img src=x onerror=alert(1)>";pRender();({escaped:document.querySelector("#pg-review-summary").textContent.includes("<img src=x onerror=alert(1)>"),htmlInjected:!!document.querySelector("#pg-review-summary img")})');
 assert.equal(escaped.escaped,true);assert.equal(escaped.htmlInjected,false);
 // Responsive actual DOM: source details + 375/430/768/1440px
 await visit('playground.html?workflow=stack');
 for(const width of [375,430,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await pause(95);
  const dimensions=await evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})');
  assert.ok(dimensions.scroll<=dimensions.client+3,'Workflow review overflows '+width+'px: '+JSON.stringify(dimensions));
  if(width===375||width===1440){
   const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   assert.ok(Buffer.from(shot.data,'base64').byteLength>500,'Missing screenshot '+width);
  }
 }
 assert.deepEqual(errors,[],'Browser Runtime exceptions: '+errors.join('; '));
 console.log('PASS: Audit07 review-only UI, XSS escaping, 375/430/768/1440 responsive Chromium, no JS exceptions');
}finally{
 try{ws?.close()}catch{}
 chrome?.kill('SIGKILL');
 if(server)await new Promise(resolve=>server.close(resolve));
 try{fs.rmSync(tmp,{recursive:true,force:true})}catch{}
}
