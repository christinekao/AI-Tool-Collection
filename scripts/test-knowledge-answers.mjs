import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createAnswer,classifyIntent,indexKnowledge,searchKnowledge} from '../knowledge-answer-core.mjs';

const catalog=JSON.parse(fs.readFileSync('data/catalog-v2.json','utf8'));
const graph=JSON.parse(fs.readFileSync('data/knowledge-graph-v1.json','utf8'));
const problems=graph.nodes.filter(x=>x.type==='problem');
const all=indexKnowledge(catalog,problems);
const key=r=>r.type+':'+r.id;
const acceptedKeys=new Set(all.map(key));

test('whole collection still indexed: all 6 canonical types + optional Problems',()=>{
 const count=['resources','skills','concepts','prompts','workflows','combinations'].reduce((s,k)=>s+catalog[k].length,0)+problems.length;
 assert.equal(all.length,count);
 assert.ok(all.length>=568);
 assert.ok(acceptedKeys.has('resource:tip31812-ai-usage-bar'));
 assert.ok(acceptedKeys.has('resource:aiposthub-awesome-opensource-ai-cheat-sheets-guide'));
});

test('intent is based on user question, not hard-coded Problem records',()=>{
 assert.equal(classifyIntent('我想了解 AI Security'),'learn');
 assert.equal(classifyIntent('如何比較 RAG 和 Agent'),'compare');
 assert.equal(classifyIntent('我想實作 AI Usage Bar'),'implement');
 assert.equal(classifyIntent('有哪些 AI Security 的資料'),'find');
 assert.equal(classifyIntent('Agent的作用是什麼'),'understand');
});

test('learning answer cites actual records with substantive source facts',()=>{
 for(const query of ['我想了解 AI Security','我想學習 AI Agent','我想學 Agent Framework']){
  const result=createAnswer(query,catalog,problems);
  assert.ok(!result.empty,'unexpected empty: '+query);
  assert.ok(result.sources.length>0,query+' missing references');
  assert.ok(result.sections.some(x=>x.kind==='facts'),query+' missing source-backed explanations');
  for(const s of result.sources)assert.ok(acceptedKeys.has(key(s)),'fabricated source: '+key(s));
  for(const section of result.sections){
   for(const item of section.items){
    if(item.source)assert.ok(acceptedKeys.has(key(item.source)),'fabricated claim citation');
   }
  }
 }
});

test('implementation answer uses saved AI Usage Bar architecture, not fictitious execution',()=>{
 const result=createAnswer('我想實作 AI Usage Bar，應該怎麼開始？',catalog,problems);
 assert.equal(result.intent,'implement');
 assert.ok(result.sources.some(x=>x.id==='tip31812-ai-usage-bar'));
 assert.ok(result.sections.some(x=>x.kind==='steps'));
 assert.ok(result.sections.some(x=>x.kind==='risk'));
 assert.match(result.notice,/沒有執行/);
 const steps=result.sections.find(x=>x.kind==='steps');
 assert.ok(steps.items.some(x=>x.source.id==='tip31812-ai-usage-bar'));
 assert.ok(steps.items.some(x=>x.action.includes('Provider')));
});

test('comparison keeps source limitations and never asserts newest/best tool',()=>{
 const result=createAnswer('比較 RAG 與 AI Agent 有哪些取捨？',catalog,problems);
 assert.equal(result.intent,'compare');
 assert.ok(result.sections.some(x=>x.kind==='compare'||x.kind==='facts'));
 assert.ok(result.gap?.includes('已收藏資料'));
 assert.ok(result.sources.length>=1);
});

test('unknown search is transparent about the absence of sources',()=>{
 const result=createAnswer('zzzxxyynoexistenttechnicalterm',catalog,problems);
 assert.equal(result.empty,true);
 assert.equal(result.sources.length,0);
 assert.ok(result.missing.includes('找不到'));
});

test('all answer creation is read-only and cited links use known local routes',()=>{
 const before=JSON.stringify(catalog);
 const r=createAnswer('我想學習 GitHub 如何看 README',catalog,problems);
 assert.equal(JSON.stringify(catalog),before);
 for(const source of r.sources)assert.match(source.href,/^(index\.html#\/(resources|concepts|skills|workflows|prompts|combinations)\/|knowledge\.html#\/problem\/)/);
});

test('rank known title above broad loosely matching resources',()=>{
 const found=searchKnowledge('AI Usage Bar',all);
 assert.ok(found.length);
 assert.equal(found[0].record.id,'tip31812-ai-usage-bar');
});
