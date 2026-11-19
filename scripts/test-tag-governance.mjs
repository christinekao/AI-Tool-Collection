#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {recordTagProblems,vocabularyProblems,checkChanges} from './check-tag-governance.mjs';
const tax=JSON.parse(fs.readFileSync('data/taxonomy-v1.json','utf8'));
const base=()=>({id:'test',entityType:'resource',tags:['claude-code','python'],classification:{primaryDomain:'ai-agent',secondaryDomains:[]}});
test('new record: concise, non-duplicate, non-generic tags',()=>{
 const x=base();assert.deepEqual(recordTagProblems(null,x,tax),[]);
 x.tags=['claude-code','codex','mcp','python','rust','react','svg'];
 assert.ok(recordTagProblems(null,x,tax).some(x=>x.includes('exceeds')));
 x.tags=['MIT','mit-license'];
 assert.ok(recordTagProblems(null,x,tax).some(x=>x.includes('repeats canonical Tag')));
 x.tags=['important','day'];
 assert.ok(recordTagProblems(null,x,tax).some(x=>x.includes('generic')));
 x.tags=['ai-agent'];
 assert.ok(recordTagProblems(null,x,tax).some(x=>x.includes('repeats Domain')));
});
test('legacy records retain all old tags; newly added tag sprawl is rejected',()=>{
 const old=base();old.tags=Array.from({length:30},(_,i)=>'old-'+i);
 const next=structuredClone(old);
 assert.deepEqual(recordTagProblems(old,next,tax),[]);
 next.tags.push('rust','react');
 assert.deepEqual(recordTagProblems(old,next,tax),[]);
 next.tags.push('nodejs');
 assert.ok(recordTagProblems(old,next,tax).some(x=>x.includes('more than 2')));
});
test('existing aliases are reused instead of introducing duplicate tags',()=>{
 const old=base();old.tags=['mit'];
 const next=structuredClone(old);next.tags.push('mit-license');
 assert.ok(recordTagProblems(old,next,tax).some(x=>x.includes('duplicates existing canonical')));
});
test('unsupported one-off vocabulary terms are not silently adopted',()=>{
 const old=structuredClone(tax),updated=structuredClone(tax);
 updated.tagVocabulary.push({id:'one-off-product',dimension:'technology',aliases:[]});
 const records={resources:[{entityType:'resource',id:'r1',tags:['one-off-product']}]};
 const err=vocabularyProblems(old,updated,records);
 assert.ok(err.some(x=>x.includes('at least 3')));
 assert.ok(err.some(x=>x.includes('rationale')));
});
test('new vocabulary has meaningful distinct rationale and real repeated usage',()=>{
 const old=structuredClone(tax),updated=structuredClone(tax);
 updated.tagVocabulary.push({id:'reusable-method',dimension:'method',aliases:[],adoptionReview:{
  whyExistingInsufficient:'此標籤標示跨情境可重用的方法，與現有術語的意義不相同。',
  userBenefit:'可以在多個不同資料記錄中精準搜尋同一類方法，減少查找時間。',
  evidenceRecordIds:['resource/r1','resource/r2','skill/s1']
 }});
 const cat={resources:[{entityType:'resource',id:'r1',tags:['reusable-method']},{entityType:'resource',id:'r2',tags:['reusable-method']}],skills:[{entityType:'skill',id:'s1',tags:['reusable-method']}]};
 assert.deepEqual(vocabularyProblems(old,updated,cat),[]);
});
test('existing taxonomy without additions and unchanged canonical records pass',()=>{
 const cat=JSON.parse(fs.readFileSync('data/catalog-v2.json','utf8'));
 const out=checkChanges(tax,tax,cat,[],new Map());
 assert.equal(out.ok,true);assert.equal(out.reviewedRecords,0);
});
