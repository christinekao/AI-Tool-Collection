#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadCanonical} from './audit-knowledge-relations.mjs';
import {checkAudit06} from './validate-relationship-options.mjs';
const canonical=loadCanonical();
const matrix=JSON.parse(fs.readFileSync('docs/RELATIONSHIP_AUDIT06_OPTIONS_REVIEW_20261124.json','utf8'));
const copy=()=>structuredClone(matrix);
const verify=m=>checkAudit06(m,canonical);

test('17/17 pairs and 58 typed member options remain review-only',()=>{
 const before=JSON.stringify(canonical),result=verify(matrix);
 assert.equal(result.ok,true,result.errors.join('; '));
 assert.deepEqual(result.summary,{concepts:68,workflows:36,combinations:17,
 covered:17,memberOptions:58,lanes:{'workflow-options-first':5,'composition-interface-review':9,'safety-boundary-first':3},
 withoutRationale:14,withoutRecordedCrossWorkflowReuse:17});
 assert.equal(JSON.stringify(canonical),before);
});
test('each candidate references exact Canonical members; Stage index is source valid',()=>{
 for(const r of matrix.cases){
  const c=canonical.combinations.find(x=>x.id===r.id),w=canonical.workflows.find(x=>x.id===r.id);
  assert.deepEqual(r.options.map(x=>x.resourceId).sort(),c.members.map(x=>x.id).sort());
  for(const o of r.options)for(const index of o.stageIndexes)assert.ok(w.stages[index]?.title);
 }
});
test('authorization promotion and deletion decisions cannot be forged',()=>{
 for(const field of ['migrationApproved','graphPromotionApproved']){const x=copy();x[field]=true;assert.equal(verify(x).ok,false);}
 const x=copy();x.cases[0].decision='delete-now';assert.equal(verify(x).ok,false);
});
test('claimed reuse, independent value, and interoperability are rejected',()=>{
 const x=copy();x.cases[0].crossWorkflowReuseVerified=true;assert.equal(verify(x).ok,false);
 const y=copy();y.cases[0].independentValue='proven';assert.equal(verify(y).ok,false);
 const z=copy();z.cases[0].options[0].interoperabilityVerified=true;assert.equal(verify(z).ok,false);
});
test('fabricated resource, duplicated option, missing option cannot pass',()=>{
 const x=copy();x.cases[0].options[0].resourceId='fabricated-id';assert.equal(verify(x).ok,false);
 const y=copy();y.cases[0].options[1].resourceId=y.cases[0].options[0].resourceId;assert.equal(verify(y).ok,false);
 const z=copy();z.cases[0].options.pop();assert.equal(verify(z).ok,false);
});
test('unknown stages and misleading mappingStatus are rejected',()=>{
 const x=copy();x.cases[0].options[0].stageIndexes=[999];assert.equal(verify(x).ok,false);
 const y=copy();y.cases[0].options[0].mappingStatus='production-integrated';assert.equal(verify(y).ok,false);
});
test('a missing review or duplicate pair breaks the coverage gate',()=>{
 const x=copy();x.cases.pop();assert.equal(verify(x).ok,false);
 const y=copy();y.cases.push(structuredClone(y.cases[0]));assert.equal(verify(y).ok,false);
});
test('unresolved member labels are never silently promoted to typed Resource',()=>{
 for(const id of ['goal-build-evidence-learning-loop','local-pii-ai-processing-loop','voice-publish-evidence-social-content-loop']){
  const c=canonical.combinations.find(x=>x.id===id),r=matrix.cases.find(x=>x.id===id);
  assert.equal(r.options.length,c.members.length);
  for(const label of c.unresolvedMembers||[])assert.equal(r.options.some(o=>o.resourceId===label),false);
 }
});
test('Audit02 source review must not be presented as runtime proof for its two cases',()=>{
 for(const id of ['stack','system-1-system-2-agent-routing-stack']){
  const r=matrix.cases.find(x=>x.id===id);
  assert.equal(r.sourceLevel,'audit02-docs-review-runtime-not-tested');
  assert.equal(r.reviewLane,'safety-boundary-first');
 }
});
test('unsupported evidence claims or invalid lane fail closed',()=>{
 const x=copy();x.cases[0].gap='';assert.equal(verify(x).ok,false);
 const y=copy();y.cases[0].reviewLane='verified-cross-workflow';assert.equal(verify(y).ok,false);
 const z=copy();z.cases[0].sourceLevel='official-api-tested';assert.equal(verify(z).ok,false);
});
