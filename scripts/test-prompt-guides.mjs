#!/usr/bin/env node
/** Static Prompt Guide contract regressions — no model invocation or fake quality scores. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const dir='data/prompts';
const ids=fs.readdirSync(dir).filter(x=>x.endsWith('.json')).sort().map(x=>x.slice(0,-5));
const records=ids.map(id=>JSON.parse(fs.readFileSync(path.join(dir,id+'.json'),'utf8')));
const batch=records.slice(0,20);

test('Batch 01 is exactly the first 20 canonical Prompts in a 35-record collection',()=>{
 assert.equal(records.length,35);
 assert.equal(batch.length,20);
 for(const p of batch)assert.ok(p.id&&p.prompt&&p.entityType==='prompt',p.id);
});
test('Prompt Original and Adapted are independent, and placeholders have declared inputs',()=>{
 for(const p of batch){
  const g=p.promptGuide,review=p.intakeReview;
  assert.ok(g?.adaptedPrompt&&g.adaptedPrompt!==p.prompt,p.id+' missing independently adapted copy');
  assert.ok(g.provenance?.originalPromptPreserved,p.id+' original preservation flag missing');
  assert.ok(review?.readingSpec?.id==='prompt'&&review.readingSpec.status==='applied',p.id+' missing reading spec');
  assert.ok(review.sourceStatus==='source-checked'||review.sourceStatus==='provided-material',p.id+' sourceStatus');
  const placeholders=[...g.adaptedPrompt.matchAll(/\{\{([A-Z_]+)\}\}/g)].map(m=>m[1]);
  const variables=(g.variables||[]).map(v=>v.name);
  for(const key of placeholders)assert.ok(variables.includes(key),p.id+' undocumented variable '+key);
  assert.ok(g.composition?.capability?.input&&g.composition?.capability?.output,p.id+' composition I/O absent');
 }
});
test('All Batch 01 tests are labeled NOT_TESTED and do not claim a model was run',()=>{
 for(const p of batch){
  const g=p.promptGuide;
  assert.ok(g.testCases.length>=3,p.id+' insufficient scenario coverage');
  assert.ok(g.testCases.every(t=>t.status==='NOT_TESTED'),p.id+' fabricated test evidence');
  assert.equal(g.provenance?.testStatus,'NOT_TESTED',p.id);
  assert.equal(g.provenance?.modelExecution,'NOT_RUN',p.id);
  assert.equal(p.intakeReview.verification?.status,'not-tested',p.id);
 }
});
test('Sensitive cases keep human approval and source limits in adapted text',()=>{
 const find=id=>records.find(p=>p.id===id).promptGuide.adaptedPrompt;
 assert.match(find('google-maps-saved-places-cleanup-classification'),/明確核准/);
 assert.match(find('agent-api-key-budget-and-revocation-guardrails'),/不要要求或讀取任何金鑰/);
 assert.match(find('ibkr-weekly-risk-adjusted-performance'),/不產生假圖/);
 assert.match(find('continuity-first-product-motion-film'),/Noncommercial/);
});
