#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeTagKey,vocabularyIndex} from './tag-taxonomy-core.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const catalog=read('data/catalog-v2.json'),featured=read('data/featured-tags-v1.json'),taxonomy=read('data/taxonomy-v1.json');
const known=new Map(catalog.resources.map(x=>['resource/'+x.id,x]));
const vocabulary=vocabularyIndex(taxonomy);
const canonical=t=>vocabulary.get(normalizeTagKey(t))?.id||normalizeTagKey(t);
test('first batch is a small, reviewed overlay and does not invent new Tags',()=>{
 assert.equal(Object.keys(featured.records).length,12);
 assert.equal(featured.evidence.includes('no independent upstream verification'),true);
 for(const [key,row] of Object.entries(featured.records)){
  const x=known.get(key);
  assert.ok(x,'Missing resource: '+key);
  assert.ok(row.selectedTags.length>=3&&row.selectedTags.length<=5,key+' selected count');
  assert.equal(row.originalTagCount,x.tags.length,key+' original count preserved');
  assert.ok(row.reason.length>=24,key+' reason');
  const selected=new Set();
  for(const tag of row.selectedTags){
   assert.ok(x.tags.includes(tag),key+' tag must be existing: '+tag);
   const id=canonical(tag);
   assert.ok(!selected.has(id),key+' duplicated synonym: '+tag);
   selected.add(id);
   assert.ok(!taxonomy.tagGovernance.genericTagsToReject.includes(tag),key+' generic tag');
   assert.ok(![x.classification?.primaryDomain,...(x.classification?.secondaryDomains||[])].includes(tag),key+' redundant Domain');
  }
 }
});
test('catalog retains all original tags while UI shows featured Tags only',()=>{
 const js=fs.readFileSync('catalog-app.js','utf8');
 assert.match(js,/fetch\('data\/featured-tags-v1\.json'/);
 assert.match(js,/tags\(visibleTags\(x\),3\)/);
 assert.match(js,/tags\(visibleTags\(x\),5\)/);
 assert.match(js,/list\(x\.tags\)\.join/,'search must retain full raw Tags');
});
