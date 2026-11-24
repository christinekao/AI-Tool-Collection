/**
 * Audit 06 static review integrity validation. Not an execution engine.
 * Canonical records remain read-only and always win over candidate mapping.
 */
import {auditKnowledgeRelations} from './audit-knowledge-relations.mjs';
const a=x=>Array.isArray(x)?x:[];
const s=x=>typeof x==='string'&&x.trim().length>0;
export function checkAudit06(matrix,canonical){
 const errors=[];const ok=(v,msg)=>{if(!v)errors.push(msg);};
 const combos=a(canonical?.combinations),workflows=a(canonical?.workflows),concepts=a(canonical?.concepts);
 const cBy=new Map(combos.map(c=>[c.id,c])),wBy=new Map(workflows.map(w=>[w.id,w]));
 const rows=a(matrix?.cases),seen=new Set();
 ok(matrix?.schemaVersion==='audit06-review-only-v1','wrong-schema');
 ok(matrix?.authority==='review-only'&&matrix?.migrationApproved===false&&matrix?.graphPromotionApproved===false,'review-authority-violated');
 ok(rows.length===combos.length,'coverage-count-mismatch');
 for(const r of rows){
  if(!r||!s(r.id)){errors.push('invalid-id');continue;}
  ok(!seen.has(r.id),'duplicate-id:'+r.id);seen.add(r.id);
  const c=cBy.get(r.id),w=wBy.get(r.id);
  ok(Boolean(c&&w),'unknown-pair:'+r.id);
  if(!c||!w)continue;
  ok(r.title===c.title&&r.title===w.title&&c.goal===w.goal,'pair-title-goal-mismatch:'+r.id);
  ok(r.decision==='retain-original-pending-evidence'&&r.independentValue==='not-demonstrated','unsupported-decision:'+r.id);
  ok(r.mutationApproved===false&&r.crossWorkflowReuseVerified===false,'unsafe-claim:'+r.id);
  ok(['workflow-options-first','composition-interface-review','safety-boundary-first'].includes(r.reviewLane),'review-lane-invalid:'+r.id);
  const level=['stack','system-1-system-2-agent-routing-stack'].includes(r.id)?'audit02-docs-review-runtime-not-tested':'canonical-stage-text-only';
  ok(r.sourceLevel===level,'source-claim-overstated:'+r.id);
  ok(s(r.gap)&&s(r.nextEvidence),'missing-evidence-decision:'+r.id);
  const memberIDs=a(c.members).map(m=>m.id).sort();
  const opts=a(r.options),ids=opts.map(o=>o?.resourceId).sort();
  ok(memberIDs.join('|')===ids.join('|')&&opts.length===memberIDs.length,'member-option-mismatch:'+r.id);
  const seenResources=new Set();
  for(const op of opts){
   if(!op||!s(op.resourceId)){errors.push('malformed-option:'+r.id);continue;}
   ok(!seenResources.has(op.resourceId),'duplicate-resource-option:'+r.id);seenResources.add(op.resourceId);
   ok(op.interoperabilityVerified===false,'fake-interoperability:'+r.id+':'+op.resourceId);
   const indices=a(op.stageIndexes);
   ok(indices.length?op.mappingStatus==='workflow-text-candidate':op.mappingStatus==='not-established','invalid-stage-status:'+r.id+':'+op.resourceId);
   ok(new Set(indices).size===indices.length,'duplicate-stage-index:'+r.id+':'+op.resourceId);
   for(const index of indices)ok(Number.isInteger(index)&&index>=0&&index<w.stages.length&&s(w.stages[index]?.title),'invalid-stage-index:'+r.id+':'+op.resourceId);
  }
  ok(a(c.workflowRefs).some(x=>x.type==='workflow'&&x.id===c.id),'missing-paired-workflow-ref:'+r.id);
  ok(a(w.combinationRefs).some(x=>x.type==='combination'&&x.id===c.id),'missing-backref:'+r.id);
 }
 ok(seen.size===combos.length,'coverage-unique-mismatch');
 const audit=auditKnowledgeRelations({concepts,combinations:combos,workflows});
 ok(audit.integrityErrors.length===0,'canonical-typed-ref-invalid');
 ok(audit.summary.withoutRecordedCrossWorkflowReuse===combos.length,'real-cross-workflow-reuse-may-now-exist');
 return {ok:errors.length===0,errors,summary:{
  concepts:concepts.length,workflows:workflows.length,combinations:combos.length,
  covered:seen.size,memberOptions:rows.reduce((n,r)=>n+a(r?.options).length,0),
  lanes:Object.fromEntries(['workflow-options-first','composition-interface-review','safety-boundary-first'].map(l=>[l,rows.filter(x=>x.reviewLane===l).length])),
  withoutRationale:audit.summary.withoutRationale,
  withoutRecordedCrossWorkflowReuse:audit.summary.withoutRecordedCrossWorkflowReuse
 }};
}
