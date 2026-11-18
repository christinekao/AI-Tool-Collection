import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const types={resources:'resource',skills:'skill',concepts:'concept',prompts:'prompt',combinations:'combination',workflows:'workflow'};
const floors={resources:270,skills:123,concepts:68,prompts:34,combinations:17,workflows:36};
const source=(id)=>JSON.parse(fs.readFileSync(path.join('data','resources',id+'.json'),'utf8'));

test('all six canonical collections remain present; records are not replaced by curated views',()=>{
 for(const [folder,entityType] of Object.entries(types)){
  const files=fs.readdirSync('data/'+folder).filter(x=>x.endsWith('.json'));
  assert.ok(files.length>=floors[folder],folder+' shrank below last verified intake baseline');
  assert.equal(new Set(files).size,files.length,folder+' duplicate filenames');
  for(const file of files){
   const rec=JSON.parse(fs.readFileSync('data/'+folder+'/'+file,'utf8'));
   assert.equal(rec.entityType,entityType);
   assert.equal(rec.id,file.slice(0,-5));
  }
 }
});

test('both user-provided original sources remain intact, distinct, and inspectable',()=>{
 const a=source('aiposthub-awesome-opensource-ai-cheat-sheets-guide');
 const b=source('tip31812-ai-usage-bar');
 assert.equal(a.url,'https://www.aiposthub.com/sraodev-awesome-opensource-ai-cheat-sheets-guide/');
 assert.equal(a.repo,'sraodev/awesome-opensource-ai-cheat-sheets');
 assert.equal(a.source.upstream,'https://github.com/sraodev/awesome-opensource-ai-cheat-sheets');
 assert.match(a.source.upstreamCommit,/^[a-f0-9]{40}$/);
 assert.equal(b.url,'https://github.com/tip31812/ai-usage-bar');
 assert.equal(b.repo,'tip31812/ai-usage-bar');
 assert.match(b.source.upstreamCommit,/^[a-f0-9]{40}$/);
 assert.equal(b.implementationKnowledge.executionStatus,'NOT_EXECUTED');
 assert.equal(a.implementationKnowledge.executionStatus,'NOT_EXECUTED');
 assert.ok(b.implementationKnowledge.architecture.providers);
 assert.ok(b.limitations.some(s=>s.includes('非公開')));
});

test('generated catalog includes both new Resources without hiding other types',()=>{
 const c=JSON.parse(fs.readFileSync('data/catalog-v2.json','utf8'));
 const ids=new Set(c.resources.map(x=>x.id));
 for(const id of ['aiposthub-awesome-opensource-ai-cheat-sheets-guide','tip31812-ai-usage-bar'])assert.ok(ids.has(id),'missing resource in collection catalog: '+id);
 for(const folder of Object.keys(types))assert.ok(c[folder]?.length>=floors[folder],folder+' disappeared from catalog');
});
