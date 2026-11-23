#!/usr/bin/env node
/** Source-preserving Concept guide contracts. These tests invoke no model or third-party service. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const dir='data/concepts';
const ids=fs.readdirSync(dir).filter(x=>x.endsWith('.json')).sort().map(x=>x.slice(0,-5));
const read=id=>JSON.parse(fs.readFileSync(path.join(dir,id+'.json'),'utf8'));
const reviewed=ids.slice(0,68).map(read);
const batch02=ids.slice(20,40).map(read);
const batch03=ids.slice(40,60).map(read);
const batch04=ids.slice(60,68).map(read);
test('68 stable Concept IDs; completed 68 reviewed in four ordered batches',()=>{
 assert.equal(ids.length,68);
 assert.equal(reviewed.length,68);
 assert.equal(reviewed[0].id,'agent-credential-isolation');
 assert.equal(reviewed[19].id,'cross-agent-harness-portability');
 assert.equal(batch02.length,20);
 assert.equal(batch02[0].id,'cross-agent-memory-portability');
 assert.equal(batch02[19].id,'memory-observability');
 assert.equal(batch03.length,20);
 assert.equal(batch03[0].id,'motion-interaction-layer');
 assert.equal(batch03[19].id,'security-as-workflow-gate');
 assert.equal(batch04.length,8);
 assert.equal(batch04[0].id,'semantic-layer-for-ai');
 assert.equal(batch04[7].id,'workflow-agent-system-agent-os-three-layer-architecture');
});
test('68 Concepts describe transferable principles, genuine tradeoffs, counterexamples and validation questions',()=>{
 for(const p of reviewed){
  assert.equal(p.entityType,'concept',p.id);
  assert.ok(p.coreProblem?.length>20&&p.solutionMethods?.length>=2,p.id+' problem and methods');
  assert.ok(p.definition?.length>=24,p.id+' definition');
  for(const field of ['tradeoffs','signals','antiPatterns','applicationScenarios','validationQuestions'])
   assert.ok(p[field]?.length>=2,p.id+' '+field);
  assert.ok(p.applicationScenarios.every(x=>x.startsWith('示意：')),p.id+' hypothetical scenarios');
  assert.ok(p.validationQuestions.every(x=>x.endsWith('？')),p.id+' verification questions');
 }
});
test('Review provenance remains provided-material and real external execution NOT_TESTED',()=>{
 for(const p of reviewed){
  const review=p.intakeReview;
  assert.equal(review?.policyVersion,'1.0',p.id);
  assert.equal(review?.sourceStatus,'provided-material',p.id);
  assert.equal(review?.dedupeReview?.decision,'update',p.id);
  assert.equal(review?.readingSpec?.id,'standard',p.id);
  assert.equal(review?.verification?.status,'not-tested',p.id);
  assert.ok(review?.riskNotes?.includes('未實測'),p.id);
  assert.ok(p.applicationScenarios.every(x=>!x.includes('已部署')),p.id);
 }
});
test('Original examples and formal typed references remain separate from scenario drafts',()=>{
 for(const p of [...batch02,...batch03,...batch04]){
  assert.ok(p.applicationScenarios.length>=2,p.id);
  assert.ok(!p.applicationScenarios.some(x=>/PASS|已完成驗收|正式部署/.test(x)),p.id);
  assert.ok(p.intakeReview.conceptReview.reason.includes('Typed References')||p.intakeReview.conceptReview.reason.includes('Typed Reference'),p.id);
 }
});
test('Batch 04 preserves original high-detail records and does not convert scenarios into official refs',()=>{
 for(const p of batch04){
  assert.equal(p.intakeReview?.verification?.status,'not-tested');
  assert.ok(p.applicationScenarios.every(s=>s.startsWith('示意：')));
  assert.ok(p.intakeReview?.conceptReview?.reason.includes('Typed References'));
 }
 const jobs=batch04.find(x=>x.id==='source-first-job-intelligence');
 const architecture=batch04.find(x=>x.id==='workflow-agent-system-agent-os-three-layer-architecture');
 assert.ok(jobs.solutionMethods.length>=7&&jobs.exampleRefs.length===2,'job discovery evidence and example references intact');
 assert.ok(architecture.layers?.length>=3&&architecture.relatedConceptRefs?.length===3,'architecture layers and formal references intact');
});
test('Both detail renderers label hypothetical scenarios and validation gates',()=>{
 const knowledge=fs.readFileSync('knowledge-app.js','utf8');
 const catalog=fs.readFileSync('catalog-app.js','utf8');
 for(const content of [knowledge,catalog]){
  assert.ok(content.includes('候選跨領域應用（非實測）'));
  assert.ok(content.includes('驗證時該問'));
 }
});
