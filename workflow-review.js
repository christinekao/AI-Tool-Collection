/* Audit 07: read-only review model. Never execute, promote or mutate Canonical references. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.WorkflowReview=api;
})(typeof window==='object'?window:null,function(){
 'use strict';
 const list=x=>Array.isArray(x)?x:[];
 const text=x=>typeof x==='string'&&x.trim().length>0;
 const lanemap={ 'workflow-options-first':'流程工具選項優先', 'composition-interface-review':'元件介面待驗證', 'safety-boundary-first':'先驗證安全與權限'};
 const sourceMap={ 'canonical-stage-text-only':'僅依原始 Workflow 階段文字判讀', 'audit02-docs-review-runtime-not-tested':'包含 Audit 02 文件審查；未測試實際整合'};
 function inspect(review,catalog){
  const errors=[],fail=(condition,code)=>{if(!condition)errors.push(code)};
  const empty=()=>({ok:false,errors,byWorkflow:new Map(),summary:{reviewed:0,memberOptions:0}});
  if(!review||typeof review!=='object'||!catalog||typeof catalog!=='object'){
   errors.push('missing-review-or-catalog');return empty();
  }
  const combos=list(catalog.combinations),flows=list(catalog.workflows),rows=list(review.cases);
  if(!combos.length||!flows.length){errors.push('missing-canonical-entities');return empty()}
  fail(review.schemaVersion==='audit06-review-only-v1','unsupported-review-schema');
  fail(review.authority==='review-only'&&review.migrationApproved===false&&review.graphPromotionApproved===false,'review-not-read-only');
  fail(rows.length===combos.length&&rows.length===17,'incomplete-review-coverage');
  const byC=new Map(combos.map(c=>[c.id,c])),byW=new Map(flows.map(w=>[w.id,w]));
  const seen=new Set(),byWorkflow=new Map();
  for(const row of rows){
   if(!row||!text(row.id)){fail(false,'invalid-row');continue}
   fail(!seen.has(row.id),'duplicate-review-id:'+row.id);seen.add(row.id);
   const c=byC.get(row.id),w=byW.get(row.id);
   fail(Boolean(c&&w),'source-pair-missing:'+row.id);
   if(!c||!w)continue;
   fail(c.title===w.title&&c.goal===w.goal&&row.title===w.title,'source-identity-mismatch:'+row.id);
   fail(row.decision==='retain-original-pending-evidence'&&row.independentValue==='not-demonstrated'&&row.mutationApproved===false,'unapproved-review-decision:'+row.id);
   fail(row.crossWorkflowReuseVerified===false,'unproven-reuse:'+row.id);
   fail(Boolean(lanemap[row.reviewLane])&&Boolean(sourceMap[row.sourceLevel]),'unsupported-evidence-level:'+row.id);
   fail(text(row.gap)&&text(row.nextEvidence),'missing-review-explanation:'+row.id);
   const expected=list(c.members).map(m=>m.id).sort(),options=list(row.options);
   fail(options.length===expected.length&&options.map(o=>o?.resourceId).sort().join('|')===expected.join('|'),'unmatched-member-options:'+row.id);
   const once=new Set();
   for(const option of options){
    if(!option||!text(option.resourceId)){fail(false,'invalid-option:'+row.id);continue}
    fail(!once.has(option.resourceId),'duplicate-member-option:'+row.id);once.add(option.resourceId);
    fail(option.interoperabilityVerified===false,'unsupported-interop-claim:'+row.id);
    const stages=list(option.stageIndexes);
    fail(stages.length?option.mappingStatus==='workflow-text-candidate':option.mappingStatus==='not-established','bad-option-status:'+row.id);
    fail(new Set(stages).size===stages.length,'repeated-stage-index:'+row.id);
    for(const index of stages)fail(Number.isInteger(index)&&index>=0&&index<list(w.stages).length&&text(w.stages[index]?.title),'unknown-source-stage:'+row.id);
   }
   fail(list(c.workflowRefs).some(x=>x.type==='workflow'&&x.id===row.id),'missing-forward-ref:'+row.id);
   fail(list(w.combinationRefs).some(x=>x.type==='combination'&&x.id===row.id),'missing-back-ref:'+row.id);
   byWorkflow.set(row.id,row);
  }
  fail(seen.size===combos.length,'missing-case');
  const total=rows.reduce((n,x)=>n+list(x?.options).length,0);
  fail(total===58,'unexpected-option-count');
  if(errors.length)return empty();
  return {ok:true,errors:[],byWorkflow,summary:{reviewed:rows.length,memberOptions:total}};
 }
 function optionsForStage(row,index){
  if(!row||!Number.isInteger(index)||index<0)return [];
  return list(row.options).filter(x=>list(x?.stageIndexes).includes(index));
 }
 function unassignedOptions(row){
  return list(row?.options).filter(x=>list(x?.stageIndexes).length===0);
 }
 return Object.freeze({inspect,optionsForStage,unassignedOptions,laneLabel:x=>lanemap[x]||'待審查',sourceLabel:x=>sourceMap[x]||'證據未確認'});
});
