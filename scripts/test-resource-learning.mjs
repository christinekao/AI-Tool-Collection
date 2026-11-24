import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

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
 assert.equal(g.version,2);
 assert.ok(g.headline.length>=24);
 assert.ok(g.takeaway.length>=40);
 assert.equal(g.outcomes.length,5);
 for(const item of g.outcomes){
  assert.ok(item.title?.length>=4,'A learning outcome needs a meaningful label');
  for(const field of ['detail','check'])assert.ok(item[field]?.length>15,field+' should describe a measurable learning outcome');
 }
 assert.equal(g.modules.length,10,'All ten source sheets must remain covered');
 const system=g.modules.find(m=>m.id==='system-design');
 assert.ok(system,'System Design lesson must exist');
 assert.equal(system.decisionTable?.length,5,'Need five direct design choices, not a generic Agent claim');
 assert.equal(system.decisionChecks?.length,3,'Need three criteria for adding an Agent');
 assert.ok(system.decisionChecks.some(x=>x.includes('測試')),'Require observed failures and improvement evidence');
 assert.ok(system.decisionChecks.some(x=>x.includes('權限')),'Need explicit Agent authority and stopping conditions');
 
 assert.equal(new Set(g.modules.map(m=>m.id)).size,10);
 for(const m of g.modules){
  for(const field of ['id','title','question','learn','example','output','group','sourceUrl'])assert.ok(m[field],m.id+' missing '+field);
  assert.ok(m.learn.length>=40,'A topic name alone is not a learning point: '+m.id);
  assert.ok(m.example.length>=30,'Every lesson must give a practical scenario: '+m.id);
  assert.ok(m.output.length>=10,'Each lesson should lead to an identifiable deliverable');
  assert.equal(m.essentials?.length,3,'Each chapter must include 3 directly readable principles: '+m.id);
  for(const p of m.essentials)assert.ok(p.length>=20,'Avoid generic topic labels in quick-learning notes: '+m.id);
  assert.ok(m.apply?.length>=28,'Every chapter needs a practical quick exercise: '+m.id);
  assert.match(m.sourceUrl,new RegExp('^https://github\\.com/sraodev/awesome-opensource-ai-cheat-sheets/blob/'+commit+'/cheatsheets/[a-z-]+\\.md$'));
 }
});

test('study order links point to pinned upstream sources, not invented content',()=>{
 assert.equal(g.readingPath.length,4);
 assert.ok(g.readingPath.every(p=>p.title&&p.why&&p.sourceUrl.startsWith('https://github.com/sraodev/awesome-opensource-ai-cheat-sheets/blob/'+commit+'/')));
 assert.ok(g.practice?.scenario&&g.practice?.tasks.length>=4);
 assert.ok(g.practice.tasks.every(task=>g.modules.some(m=>m.id===task.sourceId)||task.sourceId==='readiness'));
 assert.ok(g.caveat.includes('速讀筆記')&&g.caveat.includes('原始資料'));
});

test('generated public catalog includes complete structured guide without removing original metadata',()=>{
 const found=catalog.resources.find(r=>r.id===ID);
 assert.ok(found,'The source must remain in All Collections');
 assert.equal(found.url,resource.url);
 assert.equal(found.learningGuide.modules.length,10,'Public site must have real study points after catalog build');
 assert.equal(found.learningGuide.version,2);
 assert.equal(found.learningGuide.modules.flatMap(m=>m.essentials||[]).length,30);
 assert.equal(found.features.length,resource.features.length,'The original source feature list must remain available');
 const canonicalResourceCount=fs.readdirSync('data/resources').filter(name=>name.endsWith('.json')).length;
 assert.equal(catalog.resources.length,canonicalResourceCount,'Public catalog must preserve every canonical Resource');
});

test('Phase 3: both new structured guides render from canonical data and prior guides remain intact',()=>{
 const js=fs.readFileSync('catalog-app.js','utf8');
 const context=vm.createContext({URL});
 const code=js.replace(/\ninit\(\);\s*$/,'\n');
 assert.notEqual(code,js,'Remove only startup invocation for pure rendering tests');
 vm.runInContext(code,context,{filename:'catalog-app.js'});
 const read=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 const html=id=>{const d=read(id);const built=catalog.resources.find(r=>r.id===id);assert.ok(built);assert.deepEqual(built.repoGuide,d.repoGuide);assert.deepEqual(built.learningGuide,d.learningGuide);return context.detail(built);};
 const repo=html('agent-reach');
 assert.match(repo,/class="repo-guide"/);
 assert.match(repo,/class="repo-lead repo-lead-no-shots"/);
 assert.doesNotMatch(repo,/class="repo-shots"/);
 assert.match(repo,/核心判斷規則/);
 assert.match(read('agent-reach').repoGuide.architecture.nodes.map(n=>n.detail).join(' '),/schema_version/);
 assert.match(repo,/取得結果及證據/);
 assert.match(repo,/未驗證/);
 const lesson=html('ai-code-acceptance-review-testing-rollout-guide');
 assert.match(lesson,/主題重點筆記（4 章）/);
 assert.equal((lesson.match(/class="learn-module learn-module-inline"/g)||[]).length,4);
 assert.doesNotMatch(lesson,/十個主題的重點筆記|學完能掌握什麼？/);
 assert.ok(lesson.indexOf('使用條件')<lesson.indexOf('class="learning-guide"'));
 assert.match(lesson,/自我驗收/);
 assert.match(html(ID),/十個主題的重點筆記/);
 assert.match(html('tip31812-ai-usage-bar'),/class="repo-shots"/);
 assert.match(html('arrow-2'),/輸出驗收/);
 assert.match(html('addyosmani-agent-skills'),/選擇方法/);
 for(const id of ['agent-reach','ai-code-acceptance-review-testing-rollout-guide','arrow-2','addyosmani-agent-skills']){
  const d=read(id);
  assert.equal(d.intakeReview.verification.status,'not-tested');
  assert.equal(d.intakeReview.capabilityReview.decision,'none');
  assert.ok(d.source.reviewScope);
 }
});
