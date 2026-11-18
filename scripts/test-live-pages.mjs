#!/usr/bin/env node
/** Real GitHub Pages HTTP contract test; separate from local-source CI. */
const BASE='https://christinekao.github.io/AI-Tool-Collection/';
const targets=[
 ['knowledge.html','text/html',text=>text.includes('knowledge-learning.js?v=20261118')&&text.includes('knowledge-app.js?v=20261118-recovery')],
 ['knowledge-app.js','javascript',text=>text.includes('kg-retry-load')&&text.includes('fetchKnowledgeJson')&&text.includes('DATA_RETRY_COUNT=3')],
 ['knowledge-learning.js','javascript',text=>text.includes('renderProblem')],
 ['workflow-engine.js','javascript',text=>text.includes('WorkflowEngine')],
 ['data/knowledge-graph-v1.json','json',text=>{const j=JSON.parse(text);return j.schemaVersion===1&&j.nodes?.length>=568&&j.edges?.length>=1813}],
 ['data/catalog-v2.json','json',text=>{const j=JSON.parse(text);return j.schemaVersion===2&&j.resources?.length>=270&&j.resources.some(x=>x.id==='aiposthub-awesome-opensource-ai-cheat-sheets-guide')&&j.resources.some(x=>x.id==='tip31812-ai-usage-bar')}],
 ['data/problems/ai-coding-spec-delivery.json','json',text=>{const j=JSON.parse(text);return j.id==='ai-coding-spec-delivery'&&j.learning?.version===1}],
 ['data/resources/aiposthub-awesome-opensource-ai-cheat-sheets-guide.json','json',text=>{const j=JSON.parse(text);return j.url==='https://www.aiposthub.com/sraodev-awesome-opensource-ai-cheat-sheets-guide/'&&j.repo==='sraodev/awesome-opensource-ai-cheat-sheets'&&j.implementationKnowledge?.executionStatus==='NOT_EXECUTED'}],
 ['data/resources/tip31812-ai-usage-bar.json','json',text=>{const j=JSON.parse(text);return j.url==='https://github.com/tip31812/ai-usage-bar'&&j.implementationKnowledge?.executionStatus==='NOT_EXECUTED'&&j.source?.upstreamCommit?.length===40}],
 ['playground.html','text/html',text=>text.includes('playground-app.js')],
 ['playground-app.js','javascript',text=>text.includes('PG_RECIPES')],
 ['index.html','text/html',text=>text.includes('開始學習完整解法')&&text.includes('#/browse/all')]
];
async function fetchWithTransientRetry(url){
 let lastError;
 for(let attempt=1;attempt<=4;attempt++){
  try{
   const {response,attempt}=await fetchWithTransientRetry(url);
   if(response.status!==429&&response.status<500)return {response,attempt};
   lastError=new Error('Transient HTTP '+response.status);
   if(attempt===4)return {response,attempt};
  }catch(error){
   lastError=error;
   if(attempt===4)throw error;
  }
  await new Promise(resolve=>setTimeout(resolve,attempt*450));
 }
 throw lastError||new Error('Network request did not complete');
}
let failed=0;
for(const [path,type,check] of targets){
 const url=BASE+path+'?live-check='+Date.now();
 try{
  const response=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{'Cache-Control':'no-cache'}});
  const raw=await response.text();
  let valid=false,details='';
  if(response.ok){try{valid=Boolean(check(raw))}catch(err){details=String(err)}}
  if(!response.ok||!valid)failed++;
  console.log(JSON.stringify({path,status:response.status,attempt,bytes:raw.length,contentType:response.headers.get('content-type'),valid,details,sample:response.ok?'':raw.slice(0,140)}));
 }catch(err){failed++;console.log(JSON.stringify({path,error:String(err)}))}
}
if(failed){console.error('LIVE SITE FAIL: '+failed+' assets not available/invalid');process.exitCode=1}
else console.log('LIVE SITE PASS: all '+targets.length+' assets are accessible and valid');
