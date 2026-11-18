import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {readProblems} from './knowledge-graph-core.mjs';

const catalog=JSON.parse(fs.readFileSync('data/catalog-v2.json','utf8'));
const kinds={resource:'resources',skill:'skills',concept:'concepts',prompt:'prompts',workflow:'workflows',combination:'combinations'};
const records=new Map(Object.entries(kinds).flatMap(([type,plural])=>catalog[plural].map(rec=>[type+':'+rec.id,rec])));
const problems=readProblems();

test('every published Problem source is readable and canonically linked',()=>{
 assert.ok(problems.length>=20,'The 5 original and 15 curated cross-domain Problems must remain');
 for(const p of problems){
  assert.ok(p.question&&p.description&&p.outcome);
  for(const ref of p.links)assert.ok(records.has(ref.type+':'+ref.id),'Unknown Problem source: '+p.id+' → '+ref.type+':'+ref.id);
 }
});

test('learning notes teach principles, steps, decisions, a hypothetical example and self-checks',()=>{
 const lessons=problems.filter(p=>p.learning?.version===1);
 assert.ok(lessons.length>=7,'Initial source-backed lessons were lost');
 for(const p of lessons){
  const l=p.learning,at=p.id;
  assert.ok(l.takeaway?.length>=20,at+' lacks a concrete takeaway');
  assert.ok(l.principles?.length>=2,at+' lacks core concepts');
  for(const item of l.principles)assert.ok(item.title&&item.explanation,at+' principle missing substance');
  assert.ok(l.steps?.length>=3,at+' lacks practical steps');
  for(const step of l.steps){
   assert.ok(step.title&&step.action&&step.output&&step.check,at+' step lacks an action/output/check');
  }
  assert.ok(l.decisions?.length>=2,at+' lacks context-sensitive choices');
  for(const decision of l.decisions)assert.ok(decision.situation&&decision.approach&&decision.why);
  assert.ok(l.example?.label&&l.example?.input&&l.example?.process&&l.example?.output,at+' lacks worked example');
  assert.ok(l.practice?.task&&l.practice.checks?.length>=2,at+' lacks hands-on exercise');
  assert.ok(l.pitfalls?.length>=2,at+' lacks constraints');
  assert.ok(l.sourceRefs?.length>=1,at+' lacks source references');
  const linked=new Set(p.links.map(x=>x.type+':'+x.id));
  for(const ref of l.sourceRefs){
   assert.ok(records.has(ref.type+':'+ref.id),at+' cites missing canonical record');
   assert.ok(linked.has(ref.type+':'+ref.id),at+' guide source is not a curated Problem link');
  }
 }
});

test('learning guides do not mutate the original six canonical data types',()=>{
 const counts=Object.fromEntries(Object.entries(kinds).map(([type,plural])=>[type,catalog[plural].length]));
 assert.deepEqual(counts,{resource:268,skill:123,concept:68,prompt:34,workflow:36,combination:17});
});
