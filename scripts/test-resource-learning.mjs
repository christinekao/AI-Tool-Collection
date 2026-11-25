import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {validateResourceLayerLinks,resolveResourceLayerLinks} from './resource-layer-links.mjs';

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
 assert.match(repo,/class="resource-reader-guide"/);
 assert.doesNotMatch(repo,/class="repo-guide"|class="repo-shots"|核心判斷規則/);
 assert.match(read('agent-reach').repoGuide.architecture.nodes.map(n=>n.detail).join(' '),/schema_version/);
 assert.match(repo,/整理三篇研究文章/);
 assert.match(repo,/未連線或執行/);
 const lesson=html('ai-code-acceptance-review-testing-rollout-guide');
 assert.match(lesson,/主題重點筆記（4 章）/);
 assert.equal((lesson.match(/class="learn-module learn-module-inline"/g)||[]).length,4);
 assert.doesNotMatch(lesson,/十個主題的重點筆記|學完能掌握什麼？/);
 assert.ok(lesson.indexOf('如何開始使用')<lesson.indexOf('class="learning-guide"'));
 assert.match(lesson,/自我驗收/);
 assert.match(html(ID),/十個主題的重點筆記/);
 assert.match(html('tip31812-ai-usage-bar'),/class="repo-shots"/);
 assert.match(html('tip31812-ai-usage-bar'),/class="resource-reader-guide"/);
 assert.doesNotMatch(html('tip31812-ai-usage-bar'),/class="repo-guide"|class="repo-rebuild-stage"/);
 assert.match(html('arrow-2'),/製作一組網站圖示/);
 assert.match(html('addyosmani-agent-skills'),/驗收表單儲存功能/);
 for(const id of ['agent-reach','ai-code-acceptance-review-testing-rollout-guide','arrow-2','addyosmani-agent-skills']){
  const d=read(id);
  assert.equal(d.intakeReview.verification.status,'not-tested');
  assert.equal(d.intakeReview.capabilityReview.decision,'none');
  assert.ok(d.source.reviewScope);
 }
});

test('Phase 3 batch 02: catalog, guide routes and review boundaries',()=>{
 const context=vm.createContext({URL});
 const code=fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n');
 vm.runInContext(code,context,{filename:'catalog-app.js'});
 const ids=['pydantic-pydantic-ai','huggingface-smolagents','microsoft-ai-agents-for-beginners','nirdiamant-genai-agents','anthropics-skills','openrouter-ai','google-pagespeed-insights'];
 for(const id of ids){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  const built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['id','url','classification','tags','conceptRefs','workflowRefs','features','requirements','limitations','repoGuide','learningGuide'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.intakeReview.capabilityReview.decision,'none',id);
  const html=context.detail(built);
  if(d.repoGuide){
   if(d.readerGuide){
    assert.match(html,/class="resource-reader-guide"/);
    assert.doesNotMatch(html,/class="repo-guide"/);
    assert.deepEqual(built.readerGuide,d.readerGuide);
    assert.match(html,id==='pydantic-pydantic-ai'?/實際應用：AI 履歷分析/:/庫存查詢與缺貨分析/);
    if(id==='pydantic-pydantic-ai'){assert.match(html,/為什麼不直接呼叫 LLM API/);assert.match(html,/years_of_experience/);}
    assert.doesNotMatch(html,/重建前仍缺少的證據|核心判斷規則|pydantic_ai_slim\/pydantic_ai/);
   }else assert.match(html,/class="repo-guide"/);
   assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
   assert.ok(d.repoGuide.architecture.nodes.every(n=>n.files?.length));
   assert.ok(d.repoGuide.rebuild.gaps.length);
  }else if(id==='microsoft-ai-agents-for-beginners'){
   assert.match(html,/主題重點筆記（3 章）/);
   assert.equal(d.learningGuide.modules.length,3);
   assert.equal(d.intakeReview.readingSpec.status,'deferred');
   assert.ok(d.learningGuide.modules.every(m=>m.sourceUrl.includes(d.source.upstreamCommit)&&m.essentials.length===3&&m.apply&&m.output));
  }else{
   assert.equal(d.intakeReview.readingSpec.id,'standard');
   assert.ok(d.features.length>=3&&d.requirements.length>=3);
   assert.doesNotMatch(html,/class="repo-guide"/);
  }
 }
});

test('Human and agent layers resolve both directions and reject unsupported mappings',()=>{
 const d=JSON.parse(fs.readFileSync('data/resources/pydantic-pydantic-ai.json','utf8'));
 const built=catalog.resources.find(r=>r.id===d.id);
 assert.deepEqual(built.readerGuide,d.readerGuide);
 assert.deepEqual(built.repoGuide,d.repoGuide);
 assert.deepEqual(validateResourceLayerLinks(d),[]);
 const forward=resolveResourceLayerLinks(d,{caseId:'document-extraction'});
 assert.equal(forward.useCases[0].id,'document-extraction');
 assert.equal(forward.example.id,'resume-extraction');
 assert.ok(forward.capabilities.some(c=>c.id==='typed-output'&&c.symbols.includes('output_type')&&c.sourceUrls.every(u=>u.includes(d.source.upstreamCommit))));
 assert.ok(forward.externalDependencies.some(s=>s.stepId==='prepare-text'));
 assert.ok(forward.externalDependencies.some(s=>s.stepId==='deliver-result'));
 assert.equal(forward.example.verificationStatus,'design-only');
 assert.ok(forward.capabilities.every(c=>c.runtimeStatus==='not-tested'));
 const reverse=resolveResourceLayerLinks(d,{capabilityId:'typed-output'});
 assert.deepEqual(reverse.useCases.map(u=>u.id),['document-extraction','workflow-integration']);
 assert.deepEqual(reverse.capabilities[0].exampleStepIds,['extract-fields']);
 assert.deepEqual(reverse.example.steps.map(s=>s.id),['extract-fields']);
 const query=resolveResourceLayerLinks(d,{caseId:'data-query'});
 assert.equal(query.example,null);
 assert.deepEqual(query.capabilities.map(c=>c.id),['function-tools','usage-limits']);
 for(const [mutate,pattern] of [
  [x=>x.readerGuide.useCases[0].capabilityRefs.push('missing'),/dangling reference/],
  [x=>x.readerGuide.useCases[1].id=x.readerGuide.useCases[0].id,/duplicate use case/],
  [x=>x.repoGuide.capabilities.push({...x.repoGuide.capabilities[0],id:'orphan'}),/orphan capability/],
  [x=>delete x.readerGuide.example.steps[0].externalDependency,/requires references/],
  [x=>x.repoGuide.capabilities[0].sourceFiles=[],/lacks source anchors/],
  [x=>x.readerGuide.example.verificationStatus='runtime-tested',/needs its own evidence/],
  [x=>x.repoGuide.capabilities[0].runtimeStatus='verified',/invalid runtime claim/]
 ]){
  const copy=structuredClone(d);mutate(copy);assert.match(validateResourceLayerLinks(copy).join('\n'),pattern);
 }
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 const html=context.detail(built);
 assert.match(html,/data-use-case-id="document-extraction"/);
 assert.match(html,/data-example-id="resume-extraction"/);
 assert.doesNotMatch(html,/pydantic_ai_slim\/pydantic_ai|class="repo-guide"/);
});

test('Dual-layer batch 01: four source-grounded reader guides preserve bidirectional evidence',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,caseId,unitId,title] of [
  ['agent-reach','web-research','normalized-read','整理三篇研究文章'],
  ['huggingface-smolagents','multi-tool-task','named-tool-calling','庫存查詢與缺貨分析'],
  ['arrow-2','create-icon','generate-svg','製作一組網站圖示'],
  ['google-pagespeed-insights','find-bottleneck','lab-diagnosis','驗收作品集首頁改版']
 ]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','agentEvidence','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  const forward=resolveResourceLayerLinks(d,{caseId}),backward=resolveResourceLayerLinks(d,{capabilityId:unitId});
  assert.equal(forward.useCases[0].id,caseId,id);
  assert.equal(forward.example.verificationStatus,'design-only',id);
  const units=forward.capabilities||forward.evidence,reverse=backward.capabilities||backward.evidence;
  assert.ok(units.some(x=>x.id===unitId&&x.runtimeStatus==='not-tested'),id);
  assert.ok(reverse[0].useCaseIds.includes(caseId),id);
  assert.ok(reverse[0].exampleStepIds.length,id);
  assert.ok(forward.example.steps.some(x=>x.externalDependency),id);
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|核心判斷規則|agent_reach\/runtime|src\/smolagents\//,id);
 }
});

test('Dual-layer batch 02: six reader pages preserve evidence and human learning material',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title,expected,chapters] of [
  ['addyosmani-agent-skills','驗收表單儲存功能','evidence-linked',0],
  ['nirdiamant-genai-agents','比較客服問題的分流方法','evidence-linked',0],
  ['anthropics-skills','建立 Resource 整理 Skill','evidence-linked',0],
  ['openrouter-ai','替摘要應用選擇模型','evidence-linked',0],
  ['ai-code-acceptance-review-testing-rollout-guide','驗收 AI 修改的申請表單','evidence-linked',4],
  ['microsoft-ai-agents-for-beginners','設計只讀客服案件查詢 Agent','deferred',3]
 ]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','agentEvidence','learningGuide','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,expected,id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  for(const uc of d.readerGuide.useCases){
   const f=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.evidenceRefs){
    assert.ok(f.evidence.some(u=>u.id===ref&&u.runtimeStatus==='not-tested'),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.equal((html.match(/class="learn-module learn-module-inline"/g)||[]).length,chapters,id);
  assert.doesNotMatch(html,/class="repo-guide"/,id);
  if(expected==='deferred'){assert.ok(d.intakeReview.layerReview.gap&&d.intakeReview.layerReview.nextAction);assert.equal(d.intakeReview.sourceStatus,'partial');}
 }
});

test('Dual-layer batch 03: eight resource guides preserve source knowledge and practical reader views',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title,expected,chapters] of [
  ['tip31812-ai-usage-bar','安排兩種 Coding Agent 的工作','mapped',0],
  [ID,'設計公司內部文件問答','evidence-linked',10],
  ['google-fonts','為中英雙語作品集選字型','evidence-linked',0],
  ['coolors','整理作品集的基本色彩系統','evidence-linked',0],
  ['artlist','為產品介紹影片準備配樂','evidence-linked',0],
  ['davinci-resolve','剪輯一支產品介紹影片','evidence-linked',0],
  ['google-flow','製作三鏡頭概念短片','evidence-linked',0],
  ['ffmpeg','批次輸出已完成的短影片','evidence-linked',0]
 ]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','agentEvidence','repoGuide','learningGuide','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,expected,id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  for(const uc of d.readerGuide.useCases){
   const f=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs||uc.evidenceRefs){
    assert.ok((f.capabilities||f.evidence).some(u=>u.id===ref&&u.runtimeStatus==='not-tested'),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.equal((html.match(/class="learn-module learn-module-inline"/g)||[]).length,chapters,id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  if(id==='tip31812-ai-usage-bar'){
   assert.ok(d.repoGuide.rebuild&&d.repoGuide.screenshots.length===2);
   assert.match(html,/class="repo-shots"/);
   assert.equal((html.match(/class="repo-shot"/g)||[]).length,2);
   assert.doesNotMatch(html,/Sources\/Models.swift|Sources\/Notifier.swift/);
  }
 }
});

test('Dual-layer batch 04: five source-mapped repositories and two documented deferred reviews',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title,expected] of [["systran-faster-whisper","為產品介紹影片建立字幕草稿","mapped"],["manimcommunity-manim","製作一段幾何變化解說影片","mapped"],["mrdoob-three-js","製作網頁 3D 產品預覽","mapped"],["comfy-org-comfyui","批次生成產品概念圖","mapped"],["lottiefiles-dotlottie-web","為表單儲存加入完成動畫","mapped"],["infiniflow-ragflow","建立公司規章問答測試","deferred"],["toeverything-affine","整理個人 AI 工具研究工作區","deferred"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','agentEvidence','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,expected,id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs||uc.evidenceRefs){
    const unit=(forward.capabilities||forward.evidence).find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    const backward=resolveResourceLayerLinks(d,{capabilityId:ref});
    assert.ok(backward.useCases.some(c=>c.id===uc.id),id+' '+ref);
    if(expected==='mapped'){assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.source.upstreamCommit)));assert.ok(unit.symbols?.length);}
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  if(expected==='deferred'){assert.equal(d.intakeReview.sourceStatus,'partial');assert.ok(d.intakeReview.layerReview.gap&&d.intakeReview.layerReview.nextAction);}
  else{assert.ok(d.repoGuide.architecture.nodes.every(n=>n.files?.length));assert.ok(d.repoGuide.rebuild.gaps.length);}
 }
 const rag=JSON.parse(fs.readFileSync('data/resources/infiniflow-ragflow.json','utf8'));
 assert.match(rag.intakeReview.layerReview.gap,/Python/);
 assert.match(rag.implementationKnowledge.sourceReview.deployment,/Linux/);
 const affine=JSON.parse(fs.readFileSync('data/resources/toeverything-affine.json','utf8'));
 assert.match(affine.implementationKnowledge.sourceReview.license,/EE License/);
 assert.ok(affine.readerGuide.limits.some(x=>x.includes('MIT')));
});

test('Dual-layer batch 05: five scoped source contracts and preserved historical context',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["blender-blender","渲染產品旋轉預覽"],["heygen-com-hyperframes","製作三段式產品介紹影片"],["theatlasteam-motion-design-skill","製作可互動的數字滾動示意"],["microsoft-autogen","研究撰稿與審查代理的協作"],["roocodeinc-roo-code","設計規劃與開發模式的權限測試"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  assert.ok(d.implementationKnowledge.priorPurposeSnapshot.text,id);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.source.upstreamCommit)),id+' '+ref);
    assert.ok(unit.symbols?.length);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  assert.ok(d.repoGuide.architecture.nodes.every(n=>n.files?.length));
  assert.ok(d.repoGuide.rebuild.gaps.length);
  if(['microsoft-autogen','roocodeinc-roo-code'].includes(id))assert.match(d.purpose,/封存/);
 }
});
