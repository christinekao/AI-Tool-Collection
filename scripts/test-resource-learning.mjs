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
   assert.match(html,/主題重點筆記（18 章）/);
   assert.equal(d.learningGuide.modules.length,18);
   assert.equal(d.intakeReview.readingSpec.status,'applied');
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
  ['microsoft-ai-agents-for-beginners','設計只讀客服案件查詢 Agent','evidence-linked',18]
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

test('Dual-layer batch 06: ten official-document mappings with honest integration boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["recraft","製作網站分類圖示"],["remove-bg","整理電商商品去背流程"],["rive","設計表單儲存狀態動畫"],["pinterest-visual-reference","建立作品集視覺靈感看板"],["landing-love","研究作品集首頁滾動動效"],["maxibestof","規劃編輯式作品集首頁"],["motion-sites","設計知識庫卡片的微互動"],["google-stitch","規劃履歷投遞管理介面"],["vercel-ai-gateway","驗證摘要服務的模型備援"],["pythonanywhere","部署簡單的公開筆記展示頁"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','agentEvidence','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'evidence-linked',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.equal(d.readerGuide.mappingVersion,2,id);
  assert.equal(d.agentEvidence.length,3,id);
  assert.ok(d.implementationKnowledge.priorPurposeSnapshot.text,id);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.evidenceRefs){
    const unit=forward.evidence.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.evidenceFields.length&&d.source.referenceUrls.includes(unit.locator),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const cutout=JSON.parse(fs.readFileSync('data/resources/remove-bg.json','utf8'));
 assert.match(cutout.implementationKnowledge.sourceReview.migration,/2026-12-01/);
 assert.match(cutout.readerGuide.limits.join(' '),/遷移後/);
 const gateway=JSON.parse(fs.readFileSync('data/resources/vercel-ai-gateway.json','utf8'));
 assert.match(gateway.agentEvidence.find(x=>x.id==='provider-routing').detail,/order.*only/);
});

test('Dual-layer batch 07: eight official document mappings with data, rights and access boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["higgsfield-ai","規劃三鏡頭商品宣傳短片"],["inspora","建立產品品牌風格參考表"],["chatcut","剪輯產品操作示範影片"],["motionsites-ai","規劃投遞管理 Dashboard"],["vercel-skills-sh","選擇程式審查 Skill"],["meigen-ai","設計商品海報的生成測試"],["openai-codex-security","規劃合成表單專案安全審查"],["ibkr-portfolioanalyst","設計每月資產與交易回顧"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','agentEvidence','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'evidence-linked',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.equal(d.readerGuide.mappingVersion,2,id);
  assert.equal(d.agentEvidence.length,3,id);
  assert.ok(d.implementationKnowledge.priorPurposeSnapshot.text,id);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.evidenceRefs){
    const unit=forward.evidence.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.evidenceFields.length&&d.source.referenceUrls.includes(unit.locator),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('motionsites-ai').implementationKnowledge.sourceReview.identity,/其他同名/);
 assert.match(load('meigen-ai').implementationKnowledge.sourceReview.privacy,/公開 URL/);
 assert.match(load('vercel-skills-sh').implementationKnowledge.sourceReview.telemetry,/DISABLE_TELEMETRY=1/);
 assert.match(load('ibkr-portfolioanalyst').implementationKnowledge.sourceReview.export,/文字或 XML/);
});

test('Dual-layer batch 08: scoped runtime contracts and two explicit implementation gaps',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title,expected] of [["llm","比較三個模型的摘要表現","mapped"],["ollama-ollama","設計本機研究筆記摘要服務","mapped"],["playwright","驗收申請表單儲存功能","mapped"],["n8n-io-n8n","規劃每日報表整理流程","mapped"],["orca","分開開發網頁與回歸測試","deferred"],["hindsight","設計跨任務研究記憶測試","deferred"]]){
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
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
    if(expected==='mapped'){assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.source.upstreamCommit)));assert.ok(unit.symbols?.length);}
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  if(expected==='deferred'){assert.equal(d.intakeReview.sourceStatus,'partial');assert.match(d.intakeReview.layerReview.gap,/404/);assert.ok(d.intakeReview.layerReview.nextAction);}
  else{assert.ok(d.repoGuide.rebuild.gaps.length);}
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('orca').implementationKnowledge.sourceReview.install,/stablyai\/orca\/orca/);
 assert.match(load('hindsight').implementationKnowledge.sourceReview.isolation,/未實測/);
 assert.match(load('n8n-io-n8n').readerGuide.limits.join(' '),/Sustainable|EE/);
 assert.match(load('llm').repoGuide.capabilities.find(c=>c.id==='response-log').gate,/不代表刪除/);
});

test('Dual-layer batch 09: four scoped agent contracts and an explicit permission gap',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title,expected] of [["openai-codex","修正表單儲存錯誤","mapped"],["openui","呈現研究摘要與來源卡片","mapped"],["vercel-labs-skills-cli","規劃專案專用程式審查技能","mapped"],["browser-use-browser-use","整理公開文件的指定欄位","mapped"],["anomalyco-opencode","先分析再修正網頁顯示問題","deferred"]]){
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
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
    if(expected==='mapped'){assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.source.upstreamCommit)));assert.ok(unit.symbols?.length);}
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  if(expected==='deferred'){assert.equal(d.intakeReview.sourceStatus,'partial');assert.match(d.intakeReview.layerReview.gap,/404/);assert.ok(d.intakeReview.layerReview.nextAction);}
  else{assert.ok(d.repoGuide.rebuild.gaps.length);}
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('openai-codex').repoGuide.capabilities.find(c=>c.id==='lifecycle').gate,/不會終止背景終端/);
 assert.match(load('browser-use-browser-use').repoGuide.capabilities.find(c=>c.id==='run-boundary').gate,/timeout 不包含/);
 assert.match(load('vercel-labs-skills-cli').repoGuide.capabilities.find(c=>c.id==='discovery').gate,/不代表指令可信/);
 assert.match(load('anomalyco-opencode').agentEvidence.find(c=>c.id==='build').limitations,/不構成沙箱/);
});

test('Dual-layer batch 10: three workflow and model/data integration contracts',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["langgenius-dify","規劃每週報表摘要流程"],["open-webui-open-webui","規劃本機模型聊天介面"],["unclecode-crawl4ai","規劃公開文件的知識庫匯入"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  assert.ok(d.repoGuide.rebuild.gaps.length);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('langgenius-dify').readerGuide.limits.join(' '),/多租戶/);
 assert.match(load('open-webui-open-webui').readerGuide.limits.join(' '),/不是使用人數上限/);
 assert.match(load('unclecode-crawl4ai').repoGuide.capabilities.find(c=>c.id==='markdown-output').gate,/不是獨立事實驗證/);
});

test('Dual-layer batch 11: document, assistant and desktop interface contracts',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["opendatalab-mineru","規劃研究文件解析與搜尋"],["openclaw-openclaw","規劃只讀個人研究助理"],["r0x0r-pywebview","規劃本機 HTML 筆記閱讀器"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  assert.ok(d.repoGuide.rebuild.gaps.length);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('opendatalab-mineru').readerGuide.limits.join(' '),/2,000 萬美元/);
 assert.match(load('openclaw-openclaw').readerGuide.limits.join(' '),/不是安全邊界|視為安全邊界/);
 assert.match(load('r0x0r-pywebview').repoGuide.capabilities.find(c=>c.id==='python-bridge').gate,/最小能力/);
});

test('Dual-layer batch 12: frontend component and styling contracts',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["ant-design-ant-design","規劃申請審核管理頁"],["chakra-ui-chakra-ui","規劃投遞管理系統的設計規則"],["saadeghi-daisyui","規劃知識庫主題與側邊導覽"],["lucide-icons","規劃知識庫導覽及工具列圖示"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  assert.ok(d.repoGuide.rebuild.gaps.length);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('ant-design-ant-design').repoGuide.capabilities.find(c=>c.id==='responsive').gate,/不等於資料權限/);
 assert.match(load('chakra-ui-chakra-ui').repoGuide.capabilities.find(c=>c.id==='button-state').gate,/後端冪等/);
 assert.match(load('saadeghi-daisyui').repoGuide.capabilities.find(c=>c.id==='drawer-style').gate,/不是完整 dialog/);
 assert.match(load('lucide-icons').readerGuide.limits.join(' '),/Feather.*MIT/);
});

test('Dual-layer batch 13: copyable components and animation contracts',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["shadcn-ui","規劃履歷管理系統的共用元件"],["motion-dev","規劃知識庫詳情面板動效"],["magicuidesign-magicui","規劃作品集成果數字與功能展示"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  assert.ok(d.repoGuide.rebuild.gaps.length);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('shadcn-ui').repoGuide.capabilities.find(c=>c.id==='adoption').gate,/不能假定整個命令無寫入/);
 assert.match(load('motion-dev').repoGuide.capabilities.find(c=>c.id==='reduced-motion').gate,/沒有 setter/);
 assert.match(load('magicuidesign-magicui').readerGuide.limits.join(' '),/毫秒.*秒換算/);
});

test('Dual-layer batch 14: animation, approval UI and skill source contracts',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["anime-js","規劃作品集功能展示動畫"],["kokonut-ui","規劃 AI 研究助理的操作核准介面"],["gsap-skills","規劃產品首頁滾動展示的 Agent 任務"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  assert.ok(d.repoGuide.rebuild.gaps.length);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.equal(load('kokonut-ui').repo,'kokonut-labs/kokonutui');
 assert.match(load('kokonut-ui').repoGuide.capabilities.find(c=>c.id==='approval-ui').gate,/不代表服務端已核准/);
 assert.match(load('anime-js').repoGuide.capabilities.find(c=>c.id==='scope-revert').gate,/退回 document/);
 assert.match(load('gsap-skills').readerGuide.limits.join(' '),/非 GSAP 引擎/);
});

test('Dual-layer batch 15: community examples and web guidance validation boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["uiverse-io-galaxy","規劃知識庫搜尋欄與卡片樣式"],["motion-dev-animations-skill","規劃作品集卡片動效驗收"],["googlechrome-modern-web-guidance","規劃知識庫的原生響應式導覽"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('motion-dev-animations-skill').repoGuide.capabilities.find(c=>c.id==='config-check').gate,/不是量測/);
 assert.match(load('uiverse-io-galaxy').repoGuide.capabilities.find(c=>c.id==='input-style').gate,/for\/id/);
 assert.match(load('googlechrome-modern-web-guidance').repoGuide.capabilities.find(c=>c.id==='legacy-review').gate,/20%/);
});

test('Dual-layer batch 16: design skills and Git simulator learning boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["elayadesign-ai-design-skills","規劃產品首頁與 Figma 設計規則"],["leonxlnx-taste-skill","規劃企業首頁的設計與驗收流程"],["impeccable","審查履歷管理系統的既有頁面"],["frontend-design","規劃具有明確主題的作品集首頁"],["pcottle-learn-git-branching","練習 Local Git 的分支與合併"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('elayadesign-ai-design-skills').repoGuide.capabilities.find(c=>c.id==='figma').gate,/未連接或修改 Figma/);
 assert.match(load('leonxlnx-taste-skill').repoGuide.capabilities.find(c=>c.id==='waiver').gate,/PASS 不等於/);
 assert.match(load('impeccable').repoGuide.capabilities.find(c=>c.id==='detector').gate,/未讀 Rust/);
 assert.match(load('pcottle-learn-git-branching').repoGuide.capabilities.find(c=>c.id==='stage').gate,/changesModelEngaged/);
});

test('Dual-layer batch 17: design handoff, diagram privacy and visual asset rights',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["stitch-skills","規劃履歷投遞管理畫面的設計迭代"],["cathrynlavery-diagram-design","規劃資料管線的技術交接圖"],["yanliudesign-mono-color-skill","規劃雙色展覽海報的視覺配方"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.equal(load('stitch-skills').repo,'google-labs-code/stitch-skills');
 assert.match(load('stitch-skills').repoGuide.capabilities.find(c=>c.id==='project').gate,/未驗證 MCP/);
 assert.match(load('cathrynlavery-diagram-design').repoGuide.capabilities.find(c=>c.id==='style').gate,/不能宣稱單檔必然完全離線/);
 assert.match(load('yanliudesign-mono-color-skill').repoGuide.capabilities.find(c=>c.id==='inspection').gate,/原始 examples 不受 MIT 授權/);
});

test('Dual-layer batch 18: publishing and design recommendation boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["gzh-design-skill","規劃技術教學長文的公眾號排版"],["baoyu-skill","規劃 AI 教材文章的封面與插圖發布"],["ui-ux-gold-standard","規劃資料分析 Dashboard 的共用設計規則"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('gzh-design-skill').repoGuide.capabilities.find(c=>c.id==='lint').gate,/WARNING 為零/);
 assert.match(load('baoyu-skill').repoGuide.capabilities.find(c=>c.id==='publish').gate,/正式發布分開核准/);
 assert.match(load('ui-ux-gold-standard').readerGuide.limits.join(' '),/未找到獨立 LICENSE/);
});

test('Dual-layer batch 19: desktop IPC, architecture sharing and generated code boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["electron","規劃離線個人知識庫的桌面應用"],["oh-my-mermaid","規劃知識庫專案的可展開架構文件"],["abi-screenshot-to-code","規劃履歷管理介面截圖的前端原型重建"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('electron').repoGuide.capabilities.find(c=>c.id==='bridge').gate,/禁止直接暴露 ipcRenderer.send/);
 assert.match(load('oh-my-mermaid').repoGuide.capabilities.find(c=>c.id==='share').gate,/外送前單獨核准/);
 assert.match(load('abi-screenshot-to-code').repoGuide.capabilities.find(c=>c.id==='events').gate,/1000 不代表功能驗收/);
});

test('Dual-layer batch 20: learning materials preserve teaching and evidence',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["react-frontend-backend-for-beginners","判斷履歷管理網站的前後端及部署方式"],["ryanhanwu-how-to-ask-questions-the-smart-way","將無法儲存的表單問題整理成工程除錯單"],["dslab-lessons","規劃第一支 AI 影音的學習與驗收流程"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','agentEvidence','learningGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'evidence-linked',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.learningGuide.modules.length,3,id);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   for(const ref of uc.evidenceRefs){
    assert.ok(d.agentEvidence.some(u=>u.id===ref&&u.runtimeStatus==='not-tested'),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.equal((html.match(/class="learn-module learn-module-inline"/g)||[]).length,3,id);
  assert.doesNotMatch(html,/class="repo-guide"/,id);
 }
});

test('Dual-layer batch 21: research and licensed icon package boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["research-to-diagram","規劃 AI Agent 元件關係的研究圖解"],["kubai087-kubai-icons","規劃履歷管理系統的統一功能圖示"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('research-to-diagram').repoGuide.capabilities[0].gate,/來源清單不得省略/);
 const k=load('kubai087-kubai-icons');
 assert.match(k.license,/source-available/);
 assert.ok(k.repoGuide.capabilities.every(c=>c.sourceFiles.every(p=>p.startsWith('packages/')||p==='LICENSE-ICONS')));
});

test('Dual-layer batch 21: SVG teaching preserves data and evidence',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["claude-svg-animation-logo-loading-chart-tutorial","規劃資料分析網站的動畫與靜態替代方案"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','agentEvidence','learningGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'evidence-linked',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.learningGuide.modules.length,3,id);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   for(const ref of uc.evidenceRefs){
    assert.ok(d.agentEvidence.some(u=>u.id===ref&&u.runtimeStatus==='not-tested'),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.equal((html.match(/class="learn-module learn-module-inline"/g)||[]).length,3,id);
  assert.doesNotMatch(html,/class="repo-guide"/,id);
 }
});

test('Dual-layer batch 22: resume versioning and code index boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["reactive-resume","規劃職缺專屬履歷版本及面試追蹤"],["codebase-index","規劃修改履歷表單前的程式影響分析"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('reactive-resume').repoGuide.capabilities.find(c=>c.id==='tailor').gate,/match score 會寫入/);
 assert.match(load('codebase-index').repoGuide.capabilities.find(c=>c.id==='verify').gate,/不代表功能通過/);
});

test('Dual-layer batch 22: code graph remains a concept, not an executable repository',()=>{
 const id='code-graph',d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
 assert.ok(built,id);
 for(const key of ['readerGuide','agentEvidence','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
 assert.deepEqual(validateResourceLayerLinks(d),[],id);
 assert.equal(d.intakeReview.layerReview.status,'evidence-linked');
 assert.equal(d.intakeReview.verification.status,'not-tested');
 assert.equal(d.repo,'');assert.equal(d.url,'');assert.equal(d.repoGuide,undefined);
 for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
 for(const uc of d.readerGuide.useCases)for(const ref of uc.evidenceRefs){assert.ok(d.agentEvidence.some(u=>u.id===ref&&u.runtimeStatus==='not-tested'));assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id));}
 const context=vm.createContext({URL});vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 const html=context.detail(built);assert.ok(html.includes('規劃共用驗證函式的修改影響檢查')&&html.includes('class="resource-reader-guide"'));assert.doesNotMatch(html,/class="repo-guide"/);
});

test('Dual-layer batch 23: graph coverage and branch-specific source boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["codebase-memory-mcp","規劃跨模組功能與部署路徑的追蹤"],["graphify-labs-graphify","規劃程式碼與公開技術筆記的知識圖譜"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('codebase-memory-mcp').repoGuide.capabilities[0].gate,/沒有缺口不代表完整/);
 const g=load('graphify-labs-graphify');assert.equal(g.source.upstreamCommit,g.branchCommitReviewed);assert.equal(g.branchReviewed,'v3');assert.match(g.repoGuide.capabilities.find(c=>c.id==='merge').gate,/後寫屬性覆蓋/);
});

test('Dual-layer batch 23: code review teaching and evidence',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["anthropic-solving-code-review-at-anthropic","規劃 AI 修改表單功能的風險分級驗收"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','agentEvidence','learningGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'evidence-linked',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.learningGuide.modules.length,3,id);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   for(const ref of uc.evidenceRefs){
    assert.ok(d.agentEvidence.some(u=>u.id===ref&&u.runtimeStatus==='not-tested'),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.equal((html.match(/class="learn-module learn-module-inline"/g)||[]).length,3,id);
  assert.doesNotMatch(html,/class="repo-guide"/,id);
 }
});


test('Dual-layer batch 24: agent collaboration permissions and evidence boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["pingdotgg-t3code","規劃多個 Coding Agent 的分支與遠端核准流程"],["claude-codex-harness-sync","規劃 Claude Code 與 Codex 的共用開發規則維護"],["df3011212-codex-local-board","規劃多專案 Agent 工作進度與驗收看板"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('pingdotgg-t3code').repoGuide.capabilities[0].gate,/Full access/);
 assert.match(load('claude-codex-harness-sync').repoGuide.capabilities.find(c=>c.id==='classify').gate,/名稱相同不代表/);
 assert.match(load('df3011212-codex-local-board').repoGuide.capabilities[0].gate,/不代表獨立驗收/);
});

test('Dual-layer batch 25: output estimates, deterministic CI and sandbox boundaries',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["rtk","規劃 Coding Agent 的終端輸出與除錯回溯"],["github-agentic-workflows","規劃 CI 失敗分析與受控 Issue 回報流程"],["anthropics-sandbox-runtime","規劃 MCP Server 的檔案與網路最小權限"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('rtk').repoGuide.capabilities.find(c=>c.id==='measure').gate,/不等於供應商/);
 assert.match(load('github-agentic-workflows').repoGuide.capabilities.find(c=>c.id==='review').gate,/一般 Actions 驗收/);
 assert.match(load('anthropics-sandbox-runtime').repoGuide.capabilities.find(c=>c.id==='filesystem').gate,/預設讀取廣泛允許/);
});

test('Dual-layer batch 26: agent architecture, worktrees and task sync',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["anthropics-single-agent-loop-kit","規劃客服 Agent 架構精簡與逐次驗收"],["agentic-system-lab-harness-relay","規劃多 Agent 平行修正與人工選擇最佳方案"],["humanlayer","規劃跨 Session 的履歷系統功能開發與審查"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('anthropics-single-agent-loop-kit').repoGuide.capabilities.find(c=>c.id==='baseline').gate,/呼叫鏈/);
 assert.match(load('agentic-system-lab-harness-relay').repoGuide.capabilities.find(c=>c.id==='worktree').gate,/不是安全隔離/);
 assert.match(load('humanlayer').repoGuide.capabilities.find(c=>c.id==='task').gate,/不是完整 Repo 備份/);
});

test('Dual-layer batch 27: editor permissions, terminal persistence and cost controls',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["zed-industries-zed","規劃編輯器內的 AI 程式修改與權限審查"],["herdrdev-herdr","規劃多主機 Coding Agent 終端與交接監控"],["microsoft-tokeneconomizer","規劃重複開發任務的成本與品質對照實驗"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('zed-industries-zed').repoGuide.capabilities.find(c=>c.id==='permissions').gate,/Profile 決定工具是否可用/);
 assert.match(load('herdrdev-herdr').repoGuide.capabilities.find(c=>c.id==='resume').gate,/原程序不會存活/);
 assert.match(load('microsoft-tokeneconomizer').repoGuide.capabilities.find(c=>c.id==='loop').gate,/不會自行停止回合/);
});

test('Dual-layer batch 28: budget scope, context governance and career evidence',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 for(const [id,title] of [["paperclip","規劃 AI Cowork 團隊的任務派發與預算治理"],["graft","規劃大型專案的結構化讀取與 Context 控制"],["strelov1-freehire-mcp","規劃 JD 搜尋、證據式履歷與求職進度管理"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 assert.match(load('paperclip').repoGuide.capabilities.find(c=>c.id==='budget').gate,/billed_cents/);
 assert.match(load('graft').repoGuide.capabilities.find(c=>c.id==='read').gate,/不能視為檔案沒有符號/);
 assert.match(load('strelov1-freehire-mcp').repoGuide.capabilities.find(c=>c.id==='tracking').gate,/不代表向雇主送件/);
 assert.ok(load('strelov1-freehire-mcp').implementationKnowledge.priorSourceClaims);
});

// One acceptance PR, seven independently documented content groups.
for(const [batch,topic,rows] of [
  [
    29,
    "多 Agent 協作與交接",
    [
      [
        "arumwu-agentrelay",
        "規劃兩個 Coding Agent 的跨工作階段交接",
        1
      ],
      [
        "charonyuu-whatsmyagentdoing",
        "規劃多 Agent 等待人工處理的監控面板",
        1
      ],
      [
        "kieiken-project-hub",
        "規劃個人專案與 AI 任務的工作台",
        1
      ]
    ]
  ],
  [
    30,
    "Agent 用量與可觀測性",
    [
      [
        "bi0h4z4rd88-pi-sidebar-tui",
        "規劃 Pi 終端內的 Context 與任務資訊面板",
        1
      ],
      [
        "gagansd-herdr-insights",
        "規劃跨 Coding Agent 的本機用量分析",
        1
      ],
      [
        "lakris2407-herdr-agent-quota",
        "規劃跨供應商使用額度與支出的提醒面板",
        1
      ]
    ]
  ],
  [
    31,
    "工具契約與文件知識",
    [
      [
        "allanyiin-toolanything",
        "規劃企業查詢工具的跨協議契約",
        1
      ],
      [
        "allanyiin-documa",
        "規劃長文件知識庫的逐步閱讀與引用",
        1
      ],
      [
        "yusufkaraaslan-skill-seekers",
        "規劃公開技術文件的知識包製作",
        1
      ]
    ]
  ],
  [
    32,
    "工程工作流程",
    [
      [
        "mattpocock-skills",
        "規劃從模糊需求到可驗證的功能修正",
        2
      ],
      [
        "garrytan-gstack",
        "規劃功能需求、程式審查與 QA 證據的交付流程",
        1
      ],
      [
        "affaan-m-ecc",
        "規劃 Agent 工作階段保存與交付驗收",
        1
      ]
    ]
  ],
  [
    33,
    "職能插件與受控 Bot",
    [
      [
        "anthropics-knowledge-work-plugins",
        "規劃企業資料分析與審查的職能插件組合",
        2
      ],
      [
        "anthropics-financial-services",
        "規劃金融對帳差異的分層讀取與覆核",
        1
      ],
      [
        "pramoddutta-botskills",
        "規劃只在測試環境運作的 Bug 重現 Bot",
        1
      ]
    ]
  ],
  [
    34,
    "成本與治理",
    [
      [
        "aws-samples-sample-agent-cost-bench",
        "規劃跨 Coding Agent 的成本與功能品質對照",
        1
      ],
      [
        "gggodlin-cc-harness",
        "規劃 Agent 修改工作規則時的授權與證據閘門",
        1
      ],
      [
        "cloudflare-cloudflare-os",
        "規劃企業知識工作區的讀取與外部寫入核准",
        1
      ]
    ]
  ],
  [
    35,
    "工程角色與驗收指引",
    [
      [
        "michael-denyer-pstack-claude",
        "規劃跨 Claude Code 與 Codex 的專案驗收技能",
        2
      ],
      [
        "cursor-pstack-poteto",
        "規劃複雜功能的架構選型與實際操作驗收",
        2
      ],
      [
        "agency-agents",
        "規劃資料管線與儀表板的跨角色交付審查",
        2
      ]
    ]
  ]
]){
 test('Dual-layer batch '+batch+': '+topic,()=>{
  const context=vm.createContext({URL});
  vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
  for(const [id,title,version] of rows){
   const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
   assert.ok(built,id);
   for(const key of ['readerGuide',version===1?'repoGuide':'agentEvidence','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
   assert.deepEqual(validateResourceLayerLinks(d),[],id);
   assert.equal(d.readerGuide.mappingVersion,version,id);
   assert.equal(d.intakeReview.layerReview.status,version===1?'mapped':'evidence-linked',id);
   assert.equal(d.intakeReview.verification.status,'not-tested',id);
   assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
   assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
   assert.equal(d.readerGuide.useCases.length,3,id);
   if(version===2)assert.equal(d.classification.contentFormat,'collection',id);
   for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
   for(const uc of d.readerGuide.useCases){
    const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
    for(const ref of version===1?uc.capabilityRefs:uc.evidenceRefs){
     const unit=(version===1?forward.capabilities:forward.evidence).find(u=>u.id===ref);
     assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
     if(version===1)assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
     else assert.ok(unit.locator&&Object.keys(unit.fields).length,id+' '+ref);
     assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
    }
   }
   const html=context.detail(built);
   assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
   assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  }
 });
}


test('Dual-layer batch 36: memory capture, scoped retrieval and historical source',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 for(const [id,title] of [["ai-memory","規劃跨 Coding Agent 的持久記憶與交接"],["amp-agent-memory-protocol","規劃多 Agent 的 GitHub 記憶索引與按需讀取"],["hermes-memory-wiki","規劃個人 Agent 歷史對話的唯讀知識索引"]]){
  const d=load(id),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide','repoGuide','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.intakeReview.layerReview.status,'mapped',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
  for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of uc.capabilityRefs){
    const unit=forward.capabilities.find(u=>u.id===ref);
    assert.ok(unit&&unit.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(unit.sourceUrls?.length&&unit.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);
  assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
  assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 assert.match(load('ai-memory').repoGuide.capabilities.find(c=>c.id==='capture').gate,/缺少 marker 時仍允許擷取/);
 assert.match(load('amp-agent-memory-protocol').repoGuide.capabilities.find(c=>c.id==='privacy').gate,/不會清除已存在的 Git 歷史/);
 assert.equal(load('hermes-memory-wiki').implementationKnowledge.upstreamMigration.newSourceStatus,'not-reviewed');
 assert.match(load('hermes-memory-wiki').repoGuide.capabilities.find(c=>c.id==='read').gate,/不代表能防止資料洩漏/);
});

// Batches 37–46: one acceptance PR, ten independently documented groups.
for(const [batch,topic,rows] of [
  [
    37,
    "記憶與時點檢索",
    [
      [
        "garrytan-gbrain",
        "規劃跨 Agent 的專案決策記憶與修正",
        1,
        "mapped",
        "repository"
      ],
      [
        "claude-mem",
        "規劃跨開發 Session 的分層記憶檢索",
        1,
        "mapped",
        "repository"
      ],
      [
        "hermes-backsearch",
        "規劃歷史研究的時點資料檢索與驗收",
        1,
        "mapped",
        "repository"
      ]
    ]
  ],
  [
    38,
    "企業知識與資料語意",
    [
      [
        "onyx",
        "規劃企業文件搜尋的權限與引用驗收",
        1,
        "mapped",
        "repository"
      ],
      [
        "nvidia-auto-ontology",
        "規劃跨資料庫的商業資料語意與 Lineage",
        1,
        "mapped",
        "repository"
      ],
      [
        "wrenai",
        "規劃有商業指標定義的自然語言 BI 查詢",
        1,
        "mapped",
        "repository"
      ]
    ]
  ],
  [
    39,
    "技能安全與個資保護",
    [
      [
        "nvidia-skillspector",
        "規劃第三方 Skill 安裝前的安全審查",
        1,
        "mapped",
        "repository"
      ],
      [
        "pii-guard",
        "規劃繁體中文文件送入模型前的去識別化",
        1,
        "mapped",
        "repository"
      ],
      [
        "hermes-snyk-plugin",
        "規劃開發專案的依賴與程式碼掃描驗收",
        2,
        "deferred",
        "repository"
      ]
    ]
  ],
  [
    40,
    "技能索引與安全選型",
    [
      [
        "composiohq-awesome-claude-skills",
        "規劃文件分析與 CRM 自動化的技能候選清單",
        2,
        "evidence-linked",
        "collection"
      ],
      [
        "voltagent-awesome-agent-skills",
        "規劃跨 Agent 的技能選用與安裝前審查",
        2,
        "evidence-linked",
        "collection"
      ],
      [
        "voltagent-awesome-openclaw-skills",
        "規劃 OpenClaw 個人知識管理技能選型",
        2,
        "evidence-linked",
        "collection"
      ]
    ]
  ],
  [
    41,
    "開發工具與應用索引",
    [
      [
        "hesreallyhim-awesome-claude-code",
        "規劃 Claude Code 專案的記憶與驗收工具選型",
        2,
        "evidence-linked",
        "collection"
      ],
      [
        "shubhamsaboo-awesome-llm-apps",
        "規劃從 CSV 問答到有引用與記憶的 AI 應用原型",
        2,
        "evidence-linked",
        "collection"
      ],
      [
        "cursor-plugins",
        "規劃開發團隊的 Cursor 插件選用與治理",
        2,
        "evidence-linked",
        "collection"
      ]
    ]
  ],
  [
    42,
    "學習與研究路線",
    [
      [
        "awesome-agentic-ai-zh",
        "規劃 Agent 開發與工作應用的個人學習路線",
        2,
        "evidence-linked",
        "collection"
      ],
      [
        "ice1187-tw-security-and-ctf-resource",
        "規劃 AI 專案開發者的資安基礎與合法練習",
        2,
        "evidence-linked",
        "collection"
      ],
      [
        "wilsonfreitas-awesome-quant",
        "規劃可重現的歷史市場資料與風險研究",
        2,
        "evidence-linked",
        "collection"
      ]
    ]
  ],
  [
    43,
    "專業技能集合",
    [
      [
        "mukul975-anthropic-cybersecurity-skills",
        "規劃企業 Agent 的安全治理與事件審查技能選型",
        2,
        "evidence-linked",
        "collection"
      ],
      [
        "k-dense-ai-scientific-agent-skills",
        "規劃公開研究資料的查詢與分析技能",
        2,
        "evidence-linked",
        "collection"
      ],
      [
        "coreyhaines31-marketingskills",
        "規劃產品頁的定位、文案與轉換實驗",
        2,
        "evidence-linked",
        "collection"
      ]
    ]
  ],
  [
    44,
    "防禦、SEO 與工作技能",
    [
      [
        "twood2024-prelaunch-check-defense",
        "規劃網站與 AI 應用的上線前防禦檢查",
        2,
        "evidence-linked",
        "documentation"
      ],
      [
        "agricidaniel-claude-seo",
        "規劃網站內容與 SEO 變更驗收",
        1,
        "mapped",
        "repository"
      ],
      [
        "kkkkhazix-khazix-skills",
        "規劃個人工作協作、磁碟盤點與文章整理",
        2,
        "evidence-linked",
        "collection"
      ]
    ]
  ],
  [
    45,
    "個人知識庫",
    [
      [
        "bruiandy-claude-obsidian",
        "規劃有來源紀錄的 Obsidian 知識整理流程",
        2,
        "evidence-linked",
        "collection"
      ],
      [
        "kepano-obsidian-vault-template",
        "規劃日誌、來源剪藏與專案追蹤範本",
        2,
        "evidence-linked",
        "collection"
      ],
      [
        "kepano-obsidian-minimal",
        "規劃知識庫專注閱讀與卡片瀏覽介面",
        1,
        "mapped",
        "repository"
      ]
    ]
  ],
  [
    46,
    "轉錄、文件檢索及 Agent 介面",
    [
      [
        "vulture-s-whisper-guard",
        "規劃中文轉錄幻覺過濾與誤刪驗收",
        1,
        "mapped",
        "repository"
      ],
      [
        "shubhamsaboo-needle",
        "規劃長文件語意定位及原句回查",
        1,
        "mapped",
        "repository"
      ],
      [
        "openhands-agent-canvas",
        "規劃多 Agent 執行環境與擴充介面治理",
        1,
        "mapped",
        "repository"
      ]
    ]
  ],
  [
  47,
  "語音與影音製作",
  [
    [
      "debpalash-voicestudio",
      "規劃雙語教學影片配音與音訊品質驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "leemysw-yovoice",
      "規劃多版本旁白生成與本機音檔管理",
      1,
      "mapped",
      "repository"
    ],
    [
      "ath-maas-pixelle-video",
      "規劃自有知識短影音的分鏡與合成驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  48,
  "文字與介面品質",
  [
    [
      "blader-humanizer",
      "規劃技術文件與工作訊息的保真文字編輯",
      2,
      "evidence-linked",
      "documentation"
    ],
    [
      "heydamir-unslop",
      "規劃儀表板視覺改善與前後對照驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "lieflat-less-ai-tone",
      "規劃中文技術文章的分級審查與保真改寫",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  49,
  "影音任務與分鏡製作",
  [
    [
      "harry0703-moneyprinterturbo",
      "規劃知識短影音的任務清單與素材品質驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "hbai-ltd-toonflow-app",
      "規劃分鏡工作區的媒體生成與取消驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "chatfire-ai-huobao-drama",
      "規劃自有短劇的角色資產與分鏡提示詞驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  50,
  "個人反思、工程紀律與技術教材",
  [
    [
      "kepano-40-questions",
      "規劃年度與十年個人反思紀錄的長期比較",
      2,
      "evidence-linked",
      "documentation"
    ],
    [
      "unclebob-ub-mode",
      "規劃既有專案的最小修正與工程品質驗收",
      2,
      "evidence-linked",
      "documentation"
    ],
    [
      "qingyuna-answer-me-with-html",
      "規劃可離線技術教材的引用與安全驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  51,
  "教學 Agent、工程學習與履歷審查",
  [
    [
      "thu-maic-openmaic",
      "規劃 AI 互動教室的教材生成與大綱確認",
      1,
      "mapped",
      "repository"
    ],
    [
      "jit-learning-loop",
      "規劃工程任務的學習檢查與可轉移知識紀錄",
      1,
      "mapped",
      "repository"
    ],
    [
      "alexyc9381-hiring-panel-skill",
      "規劃職缺客製履歷的多角色審查與事實驗收",
      2,
      "evidence-linked",
      "documentation"
    ]
  ]
],
  [
  52,
  "Agent 協作、事件與模型路由",
  [
    [
      "loopagentteams",
      "規劃多 Agent 任務的進度保存與主控恢復驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "deepseek-dsh-superagent-prototype",
      "規劃事件驅動 Agent 的准入與回覆可靠性驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "dominicrico-jev-router",
      "規劃 Coding Agent 的模型路由與快取策略驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  53,
  "安全治理、報告證據與會議資料",
  [
    [
      "akto-api-security-akto",
      "規劃企業 AI 工具盤點與安全政策覆蓋驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "usestrix-strix",
      "規劃安全報告的覆蓋證據與匯出品質驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "wquguru-cicada",
      "規劃已授權會議紀錄的搜尋與私人知識庫匯出",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  54,
  "影音製作、任務可靠性與逐鏡分析",
  [
    [
      "guizang-product-video-skill",
      "規劃自有產品更新影片的影音同步與交付驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "zhouxiaoka-autoclip",
      "規劃短影音生成工作的逾時取消與日誌安全驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "juneyaooo-rea-video",
      "規劃自有影片的素材分析與原創分鏡製作規格",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  55,
  "影片渲染與互動動效",
  [
    [
      "alchaincyf-huashu-motion",
      "規劃程式動效影片的渲染與品質檢查",
      1,
      "mapped",
      "repository"
    ],
    [
      "hao0321-editkin",
      "規劃剪輯渲染圖與色彩處理的契約驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "lucasmarkes-hairline",
      "規劃互動線條圖形的參數與動效驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  56,
  "設計驗收、學習管理與架構模擬",
  [
    [
      "nutlope-hallmark",
      "規劃前端設計主題選擇與規則檢查驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "akas333-tysa",
      "規劃個人學習平台的課程進度與題庫驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "minchenlee-loadsketch",
      "規劃架構模擬的公平比較與延遲驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  57,
  "前端設計、元件與本機協作",
  [
    [
      "madebypan-figcc",
      "規劃自有設計畫布的選取內容與權限驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "lawpowen-ui-design-codex-bundle",
      "規劃設計知識庫的資料契約與決策規則驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "seokwoooo-lucian-uxui-prompt",
      "規劃互動元件收藏庫的建置與操作驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  58,
  "Agent 記憶、工作模式與內容治理",
  [
    [
      "rociiu-talorys",
      "規劃私人 Agent 記憶版本與待核准動作驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "danyuchn-claude-work-mode",
      "規劃 Coding Agent 工作模式與決策邊界驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "social-post",
      "規劃社群內容工作流的授權與證據驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  59,
  "影音素材、剪輯可靠性與字幕驗收",
  [
    [
      "storytold-artcraft",
      "規劃影音創作工作台的素材與生成狀態驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "storytold-filmcraft",
      "規劃影片剪輯專案的復原與匯出可靠性驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "lemomo-ai-lemo-opuscar",
      "規劃程式影片的文字可讀性與字幕時間驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  60,
  "Agent 用量與協作基礎設施",
  [
    [
      "nanako0129-syrtis",
      "規劃 AI 用量監測的週期證據與隱私驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "block-buzz",
      "規劃多 Agent 頻道事件的路由與佇列驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "makecindy-cindy",
      "規劃跨 Harness Agent 的能力與 Session 驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  61,
  "資料工作區、資訊分類與備份",
  [
    [
      "mars-tw-freedom-erp-crm",
      "規劃模擬 ERP 工作區的資料一致性與備份驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "zichuanlan-freebie-radar",
      "規劃資訊雷達的去重與分類證據驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "hirakujira-pokeep",
      "規劃本機收藏資料的備份與建議可追溯驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  62,
  "短劇生成與影音資料契約",
  [
    [
      "forget-c-jellyfish",
      "規劃短劇專案的章節與生成任務驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "waooai-waoowaoo",
      "規劃影音工作區的模型與資料寫入規則驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "ai-video-drama-platform",
      "規劃文字故事至分鏡及測試影片的契約驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  63,
  "金融研究的資料品質、成本與證據",
  [
    [
      "blave-agent",
      "規劃歷史研究成本與損益證據核對",
      1,
      "mapped",
      "repository"
    ],
    [
      "kerr20801-taiwan-stock-ai-analyzer",
      "規劃台股分析分數的缺值與模擬資料辨識",
      1,
      "mapped",
      "repository"
    ],
    [
      "zhulinsen-daily-stock-analysis",
      "規劃分析儀表板的資料來源與歷史追溯",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  64,
  "風險閘道與工具執行邊界",
  [
    [
      "anti-gambling-trader-tw",
      "規劃交易紀錄可信度與反詐證據稽核",
      1,
      "mapped",
      "repository"
    ],
    [
      "jakeschincariol-day-trader-skill",
      "規劃合成交易提案的風險與回放測試",
      1,
      "mapped",
      "repository"
    ],
    [
      "pomerado-pomerado",
      "規劃已授權網站整合的安全邊界驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  65,
  "影音處理與生成素材索引",
  [
    [
      "onetake",
      "規劃非商業產品動效練習的畫面回歸驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "jub0t-concat",
      "規劃影片剪輯工作與匯出狀態驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "awesome-gpt-image-2",
      "規劃自有提示詞收藏目錄的多語索引",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  66,
  "視覺設計與文字交付",
  [
    [
      "photo-riso-poster",
      "規劃自有照片的證據式抽象海報設計",
      2,
      "evidence-linked",
      "documentation"
    ],
    [
      "copywriting-skill",
      "規劃自有產品頁文案的主張與保真驗收",
      2,
      "evidence-linked",
      "documentation"
    ],
    [
      "akseolabs-seo-cinematic-ui",
      "規劃自有網站與工作台的動效及狀態驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  67,
  "生活紀錄、設計方向與色彩知識",
  [
    [
      "acheaisuiyimen-ache-life-to-comic-skill",
      "規劃非商業生活漫畫手帳的素材與原文保真驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "alchaincy-huashu-design",
      "規劃自有前端原型的設計方向與畫面驗收",
      2,
      "evidence-linked",
      "documentation"
    ],
    [
      "ayueh0102-ronnier-skill",
      "規劃色彩科學學習筆記的名詞與證據核對",
      2,
      "evidence-linked",
      "documentation"
    ]
  ]
],
  [
  68,
  "內容研究、簡報與企業整合",
  [
    [
      "blogger-distiller",
      "規劃內容研究資料的隱私與品質驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "bobyu89-codex-ppt-style-expanded",
      "規劃可編輯技術簡報的風格與版面驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "ecpay-ecpay-api-skill",
      "規劃企業金流與發票整合的測試驗收清單",
      2,
      "evidence-linked",
      "documentation"
    ]
  ]
],
  [
  69,
  "影音生成、封面與媒體契約",
  [
    [
      "gbro-collage-broll",
      "規劃自有教學短片的首尾影格生成驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "gbro-cover-design",
      "規劃文章封面提示詞與素材權利驗收",
      2,
      "evidence-linked",
      "documentation"
    ],
    [
      "hkuds-vimax",
      "規劃影片生成後端的圖片格式與配置驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  70,
  "Agent 委派、型別化決策及事件可視化",
  [
    [
      "irons163-three-tier-agent-orchestrator",
      "規劃自有 AI Cowork 的委派與獨立驗收",
      2,
      "evidence-linked",
      "documentation"
    ],
    [
      "laya",
      "規劃本機分類器的輸入契約與信心驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "cyyeh-agent-loop-visualizer",
      "規劃 Agent 迴圈教學的事件與狀態驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  71,
  "本機 Agent 執行、程式索引與職缺資料",
  [
    [
      "openchatx",
      "規劃本機 Agent 的 Session 隔離與資源計量驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "rankupgames-spectra",
      "規劃本機程式碼索引的增量證據與同步驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "strelov1-freehire",
      "規劃自有職缺追蹤系統的搜尋與資料正規化",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  72,
  "動態圖示、視覺規格與媒體產物治理",
  [
    [
      "citypulso-pulsoicon",
      "規劃動態圖示的播放狀態與無障礙驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "punk-skill",
      "規劃非商業視覺提示詞庫的規格驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "openmontage",
      "規劃影音工作流的產物與付費請求驗收",
      1,
      "mapped",
      "repository"
    ]
  ]
],
  [
  73,
  "模型目錄、模型評估與 Agent 開發",
  [
    [
      "omniroute",
      "規劃模型路由目錄的新鮮度與快取驗收",
      1,
      "mapped",
      "repository"
    ],
    [
      "minimax-m3-1-flash",
      "規劃多模態模型的離線評估與部署前提",
      2,
      "evidence-linked",
      "model",
      "web"
    ],
    [
      "minimax-code",
      "規劃 Coding Agent 的變更範圍與交付驗收",
      2,
      "evidence-linked",
      "application",
      "web"
    ]
  ]
],
  [
  74,
  "資料視覺化、知識目錄及工作台擴充",
  [
    [
      "april-zhu-minicharts",
      "規劃自有數據的主題式圖表與比例驗收",
      2,
      "evidence-linked",
      "documentation",
      "web"
    ],
    [
      "brandonhimpfen-awesome-finance",
      "規劃金融研究資源目錄的分類與連結治理",
      2,
      "evidence-linked",
      "collection"
    ],
    [
      "herdr-mods-gallery",
      "規劃自有工作台擴充的配方與發布驗收",
      2,
      "evidence-linked",
      "collection",
      "web"
    ]
  ]
],
  [
  75,
  "決策模型、基礎設施與回測契約",
  [
    [
      "typesafe-ai-jev",
      "規劃型別化客服決策的輸入與獨立驗收",
      2,
      "evidence-linked",
      "model",
      "web"
    ],
    [
      "zeabur-oss-ai-agent-installer-guide",
      "規劃自有伺服器的安裝前檢查與授權閘道",
      2,
      "evidence-linked",
      "documentation",
      "web"
    ],
    [
      "tradingview-pine-screener-strategy-tester",
      "規劃金融研究的篩選與回測證據核對",
      2,
      "evidence-linked",
      "service",
      "web"
    ]
  ]
],
  [
  76,
  "設計範本、影片參考及企業網站服務",
  [
    [
      "skillry-web-design-template-skills",
      "規劃自有作品集的版型採用與畫面驗收",
      2,
      "evidence-linked",
      "collection",
      "web"
    ],
    [
      "skillry-opus-5-5-video-pattern-library",
      "規劃自有動效影片的參考模式與重製驗收",
      2,
      "evidence-linked",
      "collection",
      "web"
    ],
    [
      "zenbuapps",
      "規劃小型服務業網站的預約與客服驗收",
      2,
      "evidence-linked",
      "service",
      "web"
    ]
  ]
]
]){
 test('Dual-layer batch '+batch+': '+topic,()=>{
  const context=vm.createContext({URL});
  vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
  for(const [id,title,version,status,format,sourceKind] of rows){
   const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
   assert.ok(built,id);
   for(const key of ['readerGuide',version===1?'repoGuide':'agentEvidence','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
   assert.deepEqual(validateResourceLayerLinks(d),[],id);
   assert.equal(d.readerGuide.mappingVersion,version,id);
   assert.equal(d.intakeReview.layerReview.status,status,id);
   assert.equal(d.classification.contentFormat,format,id);
   assert.equal(d.intakeReview.verification.status,'not-tested',id);
   assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
   if(sourceKind==='web'){assert.equal(version,2,id);assert.match(d.source.reviewedAt,/^\d{4}-\d\d-\d\d$/);assert.ok(d.source.referenceUrls.length>0&&d.source.referenceUrls.every(url=>/^https:\/\//.test(url)),id);assert.ok(!d.source.upstreamCommit,id+' must not invent upstream SHA');}else assert.match(d.source.upstreamCommit,/^[a-f0-9]{40}$/);
    // Batch 97 supplements the original three Snyk cases without replacing them.
    if(id==='hermes-snyk-plugin'){
     assert.deepEqual(d.readerGuide.useCases.map(c=>c.id),['use-config','use-choose','use-review','migrated-scan-contract-audit'],id);
     for(const [caseId,ref] of [['use-config','config'],['use-choose','choose'],['use-review','review']]){
      assert.deepEqual(d.readerGuide.useCases.find(c=>c.id===caseId).evidenceRefs,[ref],id+' '+caseId);
     }
    }else assert.equal(d.readerGuide.useCases.length,3,id);
   for(const key of ['title','input','process','output','destination','note'])assert.ok(d.readerGuide.example[key].trim().length>=12,id+' '+key);
   for(const uc of d.readerGuide.useCases){
    const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
    for(const ref of version===1?uc.capabilityRefs:uc.evidenceRefs){
     const item=(version===1?forward.capabilities:forward.evidence).find(u=>u.id===ref);
     assert.ok(item&&item.runtimeStatus==='not-tested',id+' '+ref);
     if(version===1)assert.ok(item.sourceUrls?.length&&item.sourceUrls.every(url=>url.includes(d.repo+'/blob/'+d.source.upstreamCommit)),id+' '+ref);
     else assert.ok(item.locator&&Object.keys(item.fields).length,id+' '+ref);
     assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
    }
   }
   const html=context.detail(built);
   assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);
   assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
  }
 });
}


test('Dual-layer batches 77–81: all 14 candidates keep scoped source evidence, user examples, and visible reader guides',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 const cases=[
  [
    "bencho",
    "設計作品集的互動操作與回饋",
    2,
    "evidence-linked",
    "application"
  ],
  [
    "fomofly-ai",
    "從一段自有教學影片規劃短影音交付",
    2,
    "evidence-linked",
    "application"
  ],
  [
    "sona-orbit-parroting",
    "規劃中英混合語音輸入的品質比較",
    2,
    "evidence-linked",
    "application"
  ],
  [
    "anthropic-claude-mythos-cybersecurity",
    "制定企業防禦研究的模型採用審查表",
    2,
    "evidence-linked",
    "model"
  ],
  [
    "engineering-leadership-adobe-tech-lead-ai",
    "規劃 AI 協作開發的交付與審查機制",
    2,
    "evidence-linked",
    "article"
  ],
  [
    "better-me-notes-amie",
    "規劃個人成長閱讀與反思筆記",
    2,
    "evidence-linked",
    "article"
  ],
  [
    "littlehole2025-token-saver",
    "規劃長對話工作交接的提示及狀態驗收",
    1,
    "mapped",
    "repository"
  ],
  [
    "rea",
    "規劃自有軟體的獨立證據驗收",
    2,
    "deferred",
    "repository"
  ],
  [
    "alsyundawy-microsoft-office-for-macos",
    "規劃企業 Mac Office 軟體來源與授權查核",
    2,
    "evidence-linked",
    "collection"
  ],
  [
    "letswrite-buzz-self-hosted-relay-guide",
    "規劃隔離的 Buzz 協作工作台部署驗收",
    2,
    "evidence-linked",
    "tutorial"
  ],
  [
    "designed-to-scale",
    "規劃系統設計課程的自學與應用驗收",
    2,
    "deferred",
    "interactive-tutorial"
  ],
  [
    "stitch-mcp",
    "規劃作品集設計 Agent 的工具與產物驗收",
    2,
    "deferred",
    "documentation"
  ],
  [
    "land-book-design-inspiration",
    "規劃作品集首頁的設計參考與採用審查",
    2,
    "deferred",
    "collection"
  ],
  [
    "particles-casberry",
    "規劃自有網站粒子背景的動效與效能驗收",
    2,
    "deferred",
    "application"
  ]
];
 for(const [id,title,version,status,format] of cases){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);
  for(const key of ['readerGuide',version===1?'repoGuide':'agentEvidence','implementationKnowledge','source','intakeReview'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  assert.equal(d.readerGuide.mappingVersion,version,id);
  assert.equal(d.intakeReview.layerReview.status,status,id);
  assert.equal(d.classification.contentFormat,format,id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.ok(d.readerGuide.useCases.length>=3,id);
  if(status==='deferred'){assert.ok(d.intakeReview.layerReview.gap&&d.intakeReview.layerReview.nextAction,id);}
  for(const uc of d.readerGuide.useCases){
   const forward=resolveResourceLayerLinks(d,{caseId:uc.id});
   for(const ref of version===1?uc.capabilityRefs:uc.evidenceRefs){
    const item=(version===1?forward.capabilities:forward.evidence).find(x=>x.id===ref);
    assert.ok(item&&item.runtimeStatus==='not-tested',id+' '+ref);
    assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(c=>c.id===uc.id),id+' '+ref);
   }
  }
  const html=context.detail(built);assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 const load=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 for(const id of ['designed-to-scale','stitch-mcp','land-book-design-inspiration','particles-casberry']){const d=load(id);assert.equal(d.intakeReview.sourceStatus,'partial',id);assert.ok(d.intakeReview.sourceGap,id);assert.ok(d.source.reviewScope.includes('未'),id);}
 const stitch=load('stitch-mcp');assert.ok(stitch.source.referenceUrls.some(u=>u.includes('f6aa86cde10c3f490acf09a63cc044582a50821d')), 'SDK evidence must be pinned');assert.ok(!stitch.source.upstreamCommit,'SDK SHA is not the hosted server revision');
 const buzz=load('letswrite-buzz-self-hosted-relay-guide');assert.equal(buzz.url,'https://www.letswrite.tw/buzz-install/');assert.ok(buzz.source.referenceUrls.some(u=>u.startsWith('https://dev.to/letswrite/')));
});


test('Dual-layer closeout batches 82–84: limited source, stable IDs and read-only evidence review',()=>{
 const context=vm.createContext({URL});
 vm.runInContext(fs.readFileSync('catalog-app.js','utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 const rows=[["reverse-skill-2","規劃自有測試案例的證據完整性驗收",1,"mapped"],["reverse-skill","規劃重複資安工具收藏的引用保留與證據驗收",2,"deferred"],["irons163-orchestrate-sol-terra-luna","規劃三層 Agent 分工的歷史來源與委派契約",2,"deferred"],["wellmade","規劃設計收藏庫的分類與作者來源驗收",2,"deferred"]];
 for(const [id,title,version,status] of rows){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8')),built=catalog.resources.find(r=>r.id===id);
  assert.ok(built,id);assert.deepEqual(validateResourceLayerLinks(d),[],id);
  for(const key of ['readerGuide',version===1?'repoGuide':'agentEvidence','source','intakeReview','implementationKnowledge'])assert.deepEqual(built[key],d[key],id+' '+key);
  assert.equal(d.readerGuide.mappingVersion,version,id);assert.equal(d.intakeReview.layerReview.status,status,id);assert.equal(d.intakeReview.verification.status,'not-tested',id);assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  if(status==='deferred'){assert.equal(d.intakeReview.sourceStatus,'partial',id);assert.ok(d.agentEvidence.every(x=>x.evidenceStatus==='partial'),id);assert.ok(d.intakeReview.layerReview.gap&&d.intakeReview.layerReview.nextAction,id);}
  for(const uc of d.readerGuide.useCases){const result=resolveResourceLayerLinks(d,{caseId:uc.id});for(const ref of version===1?uc.capabilityRefs:uc.evidenceRefs){assert.ok((version===1?result.capabilities:result.evidence).some(x=>x.id===ref&&x.runtimeStatus==='not-tested'),id);assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(x=>x.id===uc.id),id);}}
  const html=context.detail(built);assert.ok(html.includes(title)&&html.includes('class="resource-reader-guide"'),id);assert.doesNotMatch(html,/class="repo-guide"|class="repo-rebuild-stage"/,id);
 }
 for(const id of ['codex-router','viral-hook-title','whisper-ui','skillgodak-hgtv']){const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));assert.equal(d.intakeReview.sourceStatus,'partial',id);assert.ok(!d.readerGuide?.mappingVersion,id);}
});


test('Batch 85: Microsoft Agent course covers all 18 pinned README chapters without runtime claims',()=>{
 const d=JSON.parse(fs.readFileSync('data/resources/microsoft-ai-agents-for-beginners.json','utf8'));
 const chapters=d.learningGuide.modules.map(m=>Number(m.sourceUrl.match(/\/([0-9]{2})-[^/]+\/README\.md$/)[1])).sort((a,b)=>a-b);
 assert.deepEqual(chapters,Array.from({length:18},(_,i)=>i+1));
 assert.equal(d.agentEvidence.length,18);assert.equal(d.learningGuide.practice.tasks.length,18);assert.equal(d.intakeReview.layerReview.status,'evidence-linked');assert.equal(d.intakeReview.verification.status,'not-tested');
 assert.ok(d.agentEvidence.every(e=>e.runtimeStatus==='not-tested'&&e.evidenceStatus==='source-reviewed'&&e.locator.includes(d.source.upstreamCommit)));
 assert.deepEqual(validateResourceLayerLinks(d),[]);
 for(const e of d.agentEvidence){assert.ok(resolveResourceLayerLinks(d,{capabilityId:e.id}).useCases.length>0,e.id);}
 assert.ok(d.learningGuide.caveat.includes('未逐行審查或執行 Notebook'));
});


test('Deferred recovery batches 86–88: pinned partial source evidence and bidirectional mapping',()=>{
 const cases=[["hindsight","memory-contract-audit",["document-version","hybrid-recall","tenant-auth","reflect-budget","bank-delete-test"]],["anomalyco-opencode","permission-contract-audit",["policy-composition","saved-approval","role-defaults","subagent-gate","policy-test"]],["orca","worktree-contract-audit",["worktree-ipc","launch-capability","pty-process","worker-launch"]]];
 for(const [id,caseId,refs] of cases){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  assert.equal(d.intakeReview.layerReview.status,'deferred',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  const forward=resolveResourceLayerLinks(d,{caseId});
  for(const ref of refs){const e=forward.evidence.find(x=>x.id===ref);assert.ok(e&&e.locator.includes(d.source.upstreamCommit)&&e.runtimeStatus==='not-tested',ref);assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(x=>x.id===caseId),ref);}
 }
});

test('Deferred recovery batches 89–91: pinned source contract gaps and bidirectional links',()=>{
 const cases=[["hindsight","reflect-authorization-audit",["http-precheck","reflect-http","reflect-finish"]],["anomalyco-opencode","tool-boundary-audit",["plan-role","session-policy","shell-gate","mcp-tool-gate"]],["orca","worktree-lifecycle-audit",["git-worktree-add","git-worktree-remove","rpc-admission","worker-settlement"]]];
 for(const [id,caseId,refs] of cases){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  assert.equal(d.intakeReview.layerReview.status,'deferred',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  const forward=resolveResourceLayerLinks(d,{caseId});
  for(const ref of refs){const e=forward.evidence.find(x=>x.id===ref);assert.ok(e&&e.locator.includes(d.source.upstreamCommit)&&e.evidenceStatus==='partial'&&e.runtimeStatus==='not-tested',ref);assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(x=>x.id===caseId),ref);}
 }
});

test('Deferred recovery batches 92–94: pinned evidence, historical provenance and bidirectional links',()=>{
 const cases=[["hindsight","bank-citation-deletion-audit",["bank-validator-coverage","reflect-cited-id-filter","missing-bank-delete-test"]],["anomalyco-opencode","child-shell-mcp-audit",["child-session-admission","child-permission-inheritance","shell-unverifiable-policy","mcp-direct-service-boundary"]],["orca","remote-worker-stop-audit",["mobile-e2ee-auth","paired-device-scope","worker-stop-transaction","exited-terminal-release"]]];
 for(const [id,caseId,refs] of cases){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  assert.equal(d.intakeReview.layerReview.status,'deferred',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.match(d.intakeReview.layerReview.gap,/原 404 路徑已更正/,id);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  const forward=resolveResourceLayerLinks(d,{caseId});
  for(const ref of refs){const e=forward.evidence.find(x=>x.id===ref);assert.ok(e&&e.locator.includes(d.source.upstreamCommit)&&e.evidenceStatus==='partial'&&e.runtimeStatus==='not-tested',ref);assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(x=>x.id===caseId),ref);}
 }
});


test('Deferred recovery batches 95–97: pinned source gaps and bidirectional links',()=>{
 const cases=[["infiniflow-ragflow","go-rag-contract-audit","37b63fc3979365ea70f267f290c2f12d93fdbf50",["ingestion-task-state","retrieval-dependency-permission","citation-marker-filter"]],["toeverything-affine","document-sync-permission-audit","81da59d63d535d72ba677a097d9a0cc9a5871ade",["markdown-doc-write","native-update-merge","workspace-doc-permission"]],["hermes-snyk-plugin","migrated-scan-contract-audit","8937d2e90d04f7c91a14ababb0dd5175b3c4d4ed",["migrated-manifest-pin","migrated-network-boundary","migrated-scan-procedure"]]];
 for(const [id,caseId,pin,refs] of cases){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  assert.equal(d.intakeReview.layerReview.status,'deferred',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  const forward=resolveResourceLayerLinks(d,{caseId});
  for(const ref of refs){const e=forward.evidence.find(x=>x.id===ref);assert.ok(e&&e.locator.includes(pin)&&e.evidenceStatus==='partial'&&e.runtimeStatus==='not-tested',ref);assert.ok(d.source.referenceUrls.includes(e.locator.split('#')[0]),ref);assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(x=>x.id===caseId),ref);}
 }
});


test('Deferred recovery batches 98–100: source authority and SDK boundary',()=>{
 const cases=[["rea","closure-authority-audit","0aca049128687828bddc32e8c4c0a39d7544c1ff",["ledger-derived-status","ledger-proof-authority","license-inventory-boundary"]],["stitch-mcp","sdk-auth-result-download-audit","f6aa86cde10c3f490acf09a63cc044582a50821d",["sdk-auth-header","sdk-tool-envelope","sdk-expired-download-test"]]];
 for(const [id,caseId,pin,refs] of cases){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  assert.equal(d.intakeReview.layerReview.status,'deferred',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  const forward=resolveResourceLayerLinks(d,{caseId});
  for(const ref of refs){const e=forward.evidence.find(x=>x.id===ref);assert.ok(e&&e.locator.includes(pin)&&e.evidenceStatus==='partial'&&e.runtimeStatus==='not-tested',ref);assert.ok(d.source.referenceUrls.includes(e.locator.split('#')[0]),ref);assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(x=>x.id===caseId),ref);}
 }
 const course=JSON.parse(fs.readFileSync('data/resources/designed-to-scale.json','utf8'));
 assert.equal(course.intakeReview.layerReview.status,'deferred');
 assert.equal(course.intakeReview.verification.status,'not-tested');
});


test('Deferred recovery batches 101–103: dated document evidence and source gaps',()=>{
 const cases=[["land-book-design-inspiration","gallery-provenance-rights-audit",[["submission-authorship","https://land-book.com/terms-of-service"],["gallery-reuse-boundary","https://land-book.com/terms-of-service"],["editorial-review-scope","https://land-book.com/submission-guidelines"]]],["particles-casberry","particle-export-runtime-audit",[["standalone-export-contract","https://particles.casberry.in/changelog"],["effect-pruning-contract","https://particles.casberry.in/changelog"],["density-storage-contract","https://particles.casberry.in/changelog"]]]];
 for(const [id,caseId,refs] of cases){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  assert.equal(d.intakeReview.layerReview.status,'deferred',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.match(d.intakeReview.layerReview.gap,/403/,id);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  const forward=resolveResourceLayerLinks(d,{caseId});
  for(const [ref,url] of refs){const e=forward.evidence.find(x=>x.id===ref);assert.ok(e&&e.locator.startsWith(url+' — ')&&e.locator.includes('2026-11-26')&&e.evidenceStatus==='partial'&&e.runtimeStatus==='not-tested',ref);assert.ok(d.source.referenceUrls.includes(url),ref);assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(x=>x.id===caseId),ref);}
 }
 const wellmade=JSON.parse(fs.readFileSync('data/resources/wellmade.json','utf8'));
 assert.equal(wellmade.intakeReview.layerReview.status,'deferred');
});


test('Deferred recovery batches 104–105: candidate evidence is not historical identity',()=>{
 const cases=[["reverse-skill","reverse-skill-2","candidate-trust-provenance-audit","b972ad0e90f26d8f044828f004da22a4a585da12",["candidate-trust-boundary","candidate-readonly-scope"]],["irons163-orchestrate-sol-terra-luna","irons163-three-tier-agent-orchestrator","candidate-delegation-provenance-audit","86108395a5df3743b9e2b7d0499ef4319bc7494a",["candidate-explicit-invocation","candidate-isolated-delegation","candidate-coordinator-acceptance"]]];
 for(const [id,candidate,caseId,pin,refs] of cases){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  const current=JSON.parse(fs.readFileSync('data/resources/'+candidate+'.json','utf8'));
  assert.equal(d.id,id);assert.equal(current.id,candidate);
  assert.equal(d.intakeReview.layerReview.status,'deferred',id);
  assert.equal(d.intakeReview.sourceStatus,'partial',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.match(d.intakeReview.layerReview.gap,/原始 V2 無 URL/,id);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
  const forward=resolveResourceLayerLinks(d,{caseId});
  for(const ref of refs){const e=forward.evidence.find(x=>x.id===ref);assert.ok(e&&e.locator.includes(pin)&&e.evidenceStatus==='partial'&&e.runtimeStatus==='not-tested',ref);assert.ok(d.source.referenceUrls.includes(e.locator.split('#')[0]),ref);assert.ok(resolveResourceLayerLinks(d,{capabilityId:ref}).useCases.some(x=>x.id===caseId),ref);}
 }
});


test('Deferred recovery 95–105: supplemental example step precedes independent acceptance',()=>{
 for(const [id,caseId,gateId] of [["infiniflow-ragflow","go-rag-contract-audit","verify"],["toeverything-affine","document-sync-permission-audit","verify"],["hermes-snyk-plugin","migrated-scan-contract-audit","verify-output"],["rea","closure-authority-audit","verify-output"],["stitch-mcp","sdk-auth-result-download-audit","verify-output"],["land-book-design-inspiration","gallery-provenance-rights-audit","verify-output"],["particles-casberry","particle-export-runtime-audit","verify-output"],["reverse-skill","candidate-trust-provenance-audit","verify-output"],["irons163-orchestrate-sol-terra-luna","candidate-delegation-provenance-audit","verify-output"]]){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  const ex=d.readerGuide.example;
  assert.equal(ex.steps.at(-1).id,gateId,id);
  assert.ok(ex.steps.at(-1).externalDependency,id);
  assert.equal(ex.steps.at(-2).id,caseId,id);
  assert.ok(ex.process.includes(ex.steps.at(-2).title),id);
  assert.ok(ex.useCaseRefs.includes(caseId),id);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
 }
});


test('Resource quality audit 01: current source scope and practical reader starts stay distinct from runtime',()=>{
 const get=id=>JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
 const snyk=get('hermes-snyk-plugin');
 for(const s of [snyk.intakeReview.riskNotes,...snyk.readerGuide.limits.filter(x=>x.includes('歷史狀態'))]){
  assert.match(s,/2026-11-25 歷史狀態/);assert.match(s,/2026-11-26 已局部查核/);assert.match(s,/仍未實測/);
 }
 assert.ok(snyk.readerGuide.limits.some(x=>x.includes('歷史狀態')));
 const rag=get('infiniflow-ragflow');assert.match(rag.readerGuide.example.note,/局部 Go 原始碼及上游測試/);assert.match(rag.readerGuide.example.note,/未執行上游測試/);
 for(const [id,expected] of [['stitch-mcp','作品集畫面'],['land-book-design-inspiration','品牌方向'],['particles-casberry','粒子背景']]){
  const d=get(id);assert.match(d.readerGuide.start[0],new RegExp(expected));assert.equal(d.readerGuide.start.length,3,id);
 }
 for(const id of ["hermes-snyk-plugin","infiniflow-ragflow","stitch-mcp","land-book-design-inspiration","particles-casberry"]){const d=get(id);assert.equal(d.intakeReview.layerReview.status,'deferred',id);assert.equal(d.intakeReview.verification.status,'not-tested',id);assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);assert.deepEqual(validateResourceLayerLinks(d),[],id);}
});


test('Resource quality batch 01: concrete reader starts and preserved evidence mappings',()=>{
 const expected={"abi-screenshot-to-code":"要重建的元件","acheaisuiyimen-ache-life-to-comic-skill":"非商業用途的合成日記","affaan-m-ecc":"兩個自有測試 Worktree","agency-agents":"銷售資料每日更新","agentic-system-lab-harness-relay":"基準 Commit","agricidaniel-claude-seo":"歷史頁面基準","ai-memory":"不得保存的資料","ai-video-drama-platform":"預期分鏡","akas333-tysa":"SQL JOIN","akseolabs-seo-cinematic-ui":"拒絕等畫面狀態","akto-api-security-akto":"模擬政策與違規統計","alchaincy-huashu-design":"色彩、字型、間距","alchaincyf-huashu-motion":"預期轉場及循環條件","alexyc9381-hiring-panel-skill":"完整 JD","allanyiin-documa":"人工標註的證據","allanyiin-toolanything":"無副作用的合成 Python"};
 for(const [id,phrase] of Object.entries(expected)){
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  assert.ok(d.readerGuide.start[0].includes(phrase),id);
  assert.equal(d.readerGuide.start.length,3,id);
  assert.equal(d.readerGuide.example.verificationStatus,'design-only',id);
  assert.equal(d.intakeReview.verification.status,'not-tested',id);
  assert.ok(['mapped','evidence-linked'].includes(d.intakeReview.layerReview.status),id);
  assert.deepEqual(validateResourceLayerLinks(d),[],id);
 }
});
