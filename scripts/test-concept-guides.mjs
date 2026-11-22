#!/usr/bin/env node
/** Concept content regression tests: no model, external service or runtime execution. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const dir='data/concepts';
const ids=fs.readdirSync(dir).filter(x=>x.endsWith('.json')).sort().map(x=>x.slice(0,-5));
const batch=ids.slice(0,20).map(id=>JSON.parse(fs.readFileSync(path.join(dir,id+'.json'),'utf8')));
test('Concepts Batch 01 is exactly first 20 of 68 canonical IDs',()=>{
 assert.equal(ids.length,68);assert.equal(batch.length,20);
 assert.equal(batch[0].id,'agent-credential-isolation');
 assert.equal(batch[19].id,'cross-agent-harness-portability');
});
test('Each Concept has a durable explanation, tradeoffs, anti-patterns and untested transfer',()=>{
 for(const p of batch){
  assert.equal(p.entityType,'concept',p.id);
  assert.ok(p.coreProblem?.length>20&&p.solutionMethods?.length>=2,p.id);
  assert.ok(p.definition?.length>=24,p.id+' definition');
  for(const key of ['tradeoffs','signals','antiPatterns','applicationScenarios','validationQuestions'])
   assert.ok(p[key]?.length>=2,p.id+' '+key);
  assert.ok(p.applicationScenarios.every(x=>x.startsWith('示意：')),p.id+' provenance');
  assert.ok(p.validationQuestions.every(x=>x.endsWith('？')),p.id+' checks');
 }
});
test('Source review and real external execution remain explicitly unverified',()=>{
 for(const p of batch){
  const r=p.intakeReview;
  assert.equal(r?.policyVersion,'1.0',p.id);
  assert.equal(r?.sourceStatus,'provided-material',p.id);
  assert.equal(r?.dedupeReview?.decision,'update',p.id);
  assert.equal(r?.readingSpec?.id,'standard',p.id);
  assert.equal(r?.verification?.status,'not-tested',p.id);
  assert.ok(r?.riskNotes.includes('未實測'),p.id);
  assert.ok(!p.applicationScenarios.some(x=>x.includes('已部署')),p.id);
 }
});
test('Concept application labels are visible without mixing them into real examples',()=>{
 const knowledge=fs.readFileSync('knowledge-app.js','utf8');
 const catalog=fs.readFileSync('catalog-app.js','utf8');
 for(const content of [knowledge,catalog]){
  assert.ok(content.includes('候選跨領域應用（非實測）'));
  assert.ok(content.includes('驗證時該問'));
 }
});
