import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ID='aiposthub-awesome-opensource-ai-cheat-sheets-guide';
const resource=JSON.parse(fs.readFileSync('data/resources/'+ID+'.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('data/catalog-v2.json','utf8'));
const g=resource.learningGuide;
const commit=resource.source.upstreamCommit;

test('preserve original intake and separate source article from upstream GitHub',()=>{
 assert.equal(resource.entityType,'resource');
 assert.equal(resource.url,'https://www.aiposthub.com/sraodev-awesome-opensource-ai-cheat-sheets-guide/');
 assert.equal(resource.source.url,resource.url);
 assert.equal(resource.source.upstream,'https://github.com/sraodev/awesome-opensource-ai-cheat-sheets');
 assert.match(commit,/^[a-f0-9]{40}$/);
});

test('real, inspectable learning outcomes replace bare topic names',()=>{
 assert.equal(g.version,1);
 assert.ok(g.headline.length>=24);
 assert.ok(g.takeaway.length>=40);
 assert.equal(g.outcomes.length,5);
 for(const item of g.outcomes){
  for(const field of ['title','detail','check'])assert.ok(item[field]?.length>8,field+' should be an actual learning outcome');
 }
 assert.equal(g.modules.length,10,'All ten source sheets must remain covered');
 assert.equal(new Set(g.modules.map(m=>m.id)).size,10);
 for(const m of g.modules){
  for(const field of ['id','title','question','learn','example','output','group','sourceUrl'])assert.ok(m[field],m.id+' missing '+field);
  assert.ok(m.learn.length>=50,'A topic name alone is not a learning point: '+m.id);
  assert.ok(m.example.length>=30,'Every lesson must give a practical scenario: '+m.id);
  assert.ok(m.output.length>=10,'Each lesson should lead to an identifiable deliverable');
  assert.match(m.sourceUrl,new RegExp('^https://github\\.com/sraodev/awesome-opensource-ai-cheat-sheets/blob/'+commit+'/cheatsheets/[a-z-]+\\.md$'));
 }
});

test('study order links point to pinned upstream sources, not invented content',()=>{
 assert.equal(g.readingPath.length,4);
 assert.ok(g.readingPath.every(p=>p.title&&p.why&&p.sourceUrl.startsWith('https://github.com/sraodev/awesome-opensource-ai-cheat-sheets/blob/'+commit+'/')));
 assert.ok(g.practice?.scenario&&g.practice?.tasks.length>=4);
 assert.ok(g.practice.tasks.every(task=>g.modules.some(m=>m.id===task.sourceId)||task.sourceId==='readiness'));
 assert.ok(g.caveat.includes('非完整課程')||g.caveat.includes('並非完整課程'));
});

test('generated public catalog includes complete structured guide without removing original metadata',()=>{
 const found=catalog.resources.find(r=>r.id===ID);
 assert.ok(found,'The source must remain in All Collections');
 assert.equal(found.url,resource.url);
 assert.equal(found.learningGuide.modules.length,10,'Public site must have real study points after catalog build');
 assert.equal(found.features.length,resource.features.length,'The original source feature list must remain available');
 assert.equal(catalog.resources.length,270,'No unrelated Resource should be removed');
});
