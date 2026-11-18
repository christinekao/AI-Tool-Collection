#!/usr/bin/env node
/** Real GitHub Pages HTTP contract test; separate from local-source CI. */
const BASE='https://christinekao.github.io/AI-Tool-Collection/';
const targets=[
 ['knowledge.html','text/html',text=>text.includes('knowledge-learning.js?v=20261118')&&text.includes('knowledge-app.js?v=20261118-recovery')],
 ['knowledge-app.js','javascript',text=>text.includes('kg-retry-load')&&text.includes('fetchKnowledgeJson')&&text.includes('DATA_RETRY_COUNT=3')],
 ['knowledge-learning.js','javascript',text=>text.includes('renderProblem')],
 ['workflow-engine.js','javascript',text=>text.includes('WorkflowEngine')],
 ['data/knowledge-graph-v1.json','json',text=>{const j=JSON.parse(text);return j.schemaVersion===1&&j.nodes?.length===566&&j.edges?.length===1806}],
 ['data/catalog-v2.json','json',text=>{const j=JSON.parse(text);return j.schemaVersion===2&&j.resources?.length===268}],
 ['data/problems/ai-coding-spec-delivery.json','json',text=>{const j=JSON.parse(text);return j.id==='ai-coding-spec-delivery'&&j.learning?.version===1}],
 ['playground.html','text/html',text=>text.includes('playground-app.js')],
 ['playground-app.js','javascript',text=>text.includes('PG_RECIPES')],
 ['index.html','text/html',text=>text.includes('開始學習完整解法')]
];
let failed=0;
for(const [path,type,check] of targets){
 const url=BASE+path+'?live-check='+Date.now();
 try{
  const response=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{'Cache-Control':'no-cache'}});
  const raw=await response.text();
  let valid=false,details='';
  if(response.ok){try{valid=Boolean(check(raw))}catch(err){details=String(err)}}
  if(!response.ok||!valid)failed++;
  console.log(JSON.stringify({path,status:response.status,bytes:raw.length,contentType:response.headers.get('content-type'),valid,details,sample:response.ok?'':raw.slice(0,140)}));
 }catch(err){failed++;console.log(JSON.stringify({path,error:String(err)}))}
}
if(failed){console.error('LIVE SITE FAIL: '+failed+' assets not available/invalid');process.exitCode=1}
else console.log('LIVE SITE PASS: all '+targets.length+' assets are accessible and valid');
