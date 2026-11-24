'use strict';
/* Independent Workflow Playground. Plans only; no tool execution or compatibility claims. */
const PG_RECIPES=['website-build-review','agent-delivery-qa','enterprise-knowledge-qa'];
const PG={catalog:null,graph:null,index:new Map(),nodes:new Map(),recipes:[],mode:'home',
 workflowId:null,recipeId:null,choices:{},problemId:null,draft:[],search:'',toolSearch:'',reviewCases:new Map(),reviewState:'unavailable',reviewOnly:false};
const p$=s=>document.querySelector(s);
const pEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pKey=r=>r.type+':'+r.id;
const pNames={resource:'Resource',skill:'Skill',concept:'Concept',prompt:'Prompt',workflow:'Workflow',combination:'Combination'};
function pProblems(){return [...PG.nodes.values()].filter(x=>x.type==='problem').sort((a,b)=>(a.domain||'影音與內容').localeCompare(b.domain||'影音與內容','zh-Hant')||a.title.localeCompare(b.title,'zh-Hant'))}
function pLinks(id){return PG.graph.edges.filter(e=>e.from==='problem:'+id&&e.kind==='curated')}
function pLinkedWorkflows(id){return new Set(pLinks(id).filter(e=>e.to.startsWith('workflow:')).map(e=>e.to.slice(9)))}
function pRecipeFor(workflowId){return PG.recipes.find(r=>r.sourceWorkflowRef?.id===workflowId)}
function pCuratedCount(workflowId){return pProblems().filter(p=>pLinkedWorkflows(p.id).has(workflowId)).length}
function pFlowList(){
 const selected=PG.problemId?pLinkedWorkflows(PG.problemId):null;
 const q=PG.search.toLowerCase().trim();
 return PG.catalog.workflows.filter(w=>(!selected||selected.has(w.id))&&(!PG.reviewOnly||PG.reviewCases.has(w.id))&&(!q||[w.title,w.goal,w.problem,...(w.tags||[])].join(' ').toLowerCase().includes(q)))
  .sort((a,b)=>Number(Boolean(pRecipeFor(b.id)))-Number(Boolean(pRecipeFor(a.id)))||pCuratedCount(b.id)-pCuratedCount(a.id)||a.title.localeCompare(b.title,'zh-Hant'));
}
function pRenderProblems(){
 const nodes=pProblems();let previous='';
 p$('#pg-problems').innerHTML=nodes.map(p=>{
  const domain=p.domain||'影音與內容';
  const head=domain===previous?'':'<div class="pg-domain">'+pEsc(domain)+'</div>';
  previous=domain;
  return head+'<button type="button" class="pg-sidebar-btn" data-problem-id="'+pEsc(p.id)+'" aria-pressed="'+(PG.problemId===p.id)+'"><strong>'+pEsc(p.title)+'</strong><small>'+pEsc(p.question||p.summary||'')+'</small></button>';
 }).join('')||'<p class="pg-empty">尚未建立 Problem。</p>';
}
function pRenderFlowList(){
 const list=pFlowList();
 const checkbox=p$('#pg-review-only');if(checkbox){checkbox.disabled=PG.reviewState!=='ready';checkbox.checked=PG.reviewOnly}
 const note=p$('#pg-review-filter-note');if(note)note.textContent=PG.reviewState==='ready'?'可預覽 '+PG.reviewCases.size+' 個流程的工具候選':'候選資料未載入；原有流程仍可使用';
 p$('#pg-flow-count').textContent=PG.problemId?'這個問題已連結 '+list.length+' 個 Flow':'共 '+list.length+' 個已收藏 Workflow；其中 '+PG.recipes.length+' 個有依賴條件範本';
 const clear=p$('#pg-clear-filters');if(clear)clear.hidden=!(PG.problemId||PG.search||PG.reviewOnly);
 p$('#pg-flows').innerHTML=list.map(w=>{
  const recipe=pRecipeFor(w.id),curated=pCuratedCount(w.id);
  return '<button type="button" class="pg-sidebar-btn" data-flow-id="'+pEsc(w.id)+'" aria-pressed="'+(PG.workflowId===w.id)+'"><strong>'+pEsc(w.title)+'</strong><small>'+ (recipe?'可調整依賴條件的 Recipe':curated?'已整理 Problem 推薦｜尚無互動 Recipe':'已收藏的 Workflow｜待策展')+' · '+(w.stages||[]).length+' 階段</small></button>';
 }).join('')||'<div class="pg-empty-state"><p class="pg-empty">沒有符合目前條件的 Workflow。這不代表來源資料不存在，可清除搜尋、Problem 或候選篩選。</p><button class="pg-action" type="button" data-clear-filters>清除全部篩選</button></div>';
}
function pSourceLink(type,id){const plural={resource:'resources',skill:'skills',concept:'concepts',workflow:'workflows',prompt:'prompts',combination:'combinations'}[type];return plural?'index.html#/'+plural+'/'+encodeURIComponent(id):'knowledge.html'}
function pIntro(){
 const recipes=PG.recipes.map(r=>'<button type="button" class="pg-feature" data-flow-id="'+pEsc(r.sourceWorkflowRef.id)+'"><span class="pg-kicker">CURATED RECIPE · '+r.stages.length+' STEPS</span><strong>'+pEsc(r.title)+'</strong><small>'+pEsc(r.description)+'</small></button>').join('');
 const featured=['stack','reference-agent-implementation','cross-agent-continuity-stack'].filter(id=>PG.reviewCases.has(id));
 const samples=PG.reviewState==='ready'?
  '<section class="pg-review-discover"><div class="pg-review-section-header"><span class="pg-kicker">AUDIT 06 · READ-ONLY</span><h3>查看工具如何對應流程階段</h3><p>已整理 '+PG.reviewCases.size+' 個 Workflow 的候選工具對應。這些是文字證據與待審提案，不是相容性測試或自動執行。</p></div><div class="pg-review-samples">'+featured.map(id=>'<button type="button" data-flow-id="'+pEsc(id)+'">'+pEsc(PG.index.get('workflow:'+id)?.title||id)+'<small>查看原始階段與待驗證事項</small></button>').join('')+'</div></section>':
  '<p class="pg-muted">Implementation Options 審查資料目前無法驗證，仍可瀏覽原有 Workflow。</p>';
 return '<div class="pg-editor-panel"><span class="pg-kicker">START WITH A RECOMMENDED FLOW</span><h2>先看成熟的流程，再決定要不要組合工具</h2><p>左側可以先選 Problem。已連結問題的 Workflow 會優先排列；只有建立了明確 requires／produces 契約的 Recipe，才能檢查階段缺口。</p><div class="pg-feature-grid">'+recipes+'</div>'+samples+'<div class="pg-note">現有 '+PG.catalog.workflows.length+' 個 Workflow 不是全部都能直接編輯：尚未補足候選工具或依賴條件的流程，會先顯示原始階段，不虛構工具相容性。</div></div>';
}
function pResult(html){return '<div class="pg-result">'+html+'</div>'}

/* Audit 06 suggestions are advisory and never change Recipe choices or Canonical data. */
function pReviewSummary(workflowId){
 const row=PG.reviewCases.get(workflowId);if(!row)return '';
 const matched=row.options.filter(o=>o.stageIndexes.length>0).length;
 return '<section id="pg-review-summary" class="pg-review-summary" aria-label="Implementation Options 唯讀候選">'+
  '<div class="pg-review-heading"><span class="pg-kicker">IMPLEMENTATION OPTIONS · REVIEW ONLY</span><span class="pg-review-badge">候選，未驗證</span></div>'+
  '<h3>可用哪些工具實作這個流程？</h3>'+
  '<p>原始 Combination 保留不變。這裡只是將已記錄的 Resource 對應到原始 Workflow 階段文字，並未證實各工具可直接串接。</p>'+
  '<dl class="pg-review-facts"><div><dt>審查方向</dt><dd>'+pEsc(WorkflowReview.laneLabel(row.reviewLane))+'</dd></div>'+
  '<div><dt>工具候選</dt><dd>'+row.options.length+' 個原有 Resource（'+matched+' 個有階段對應）</dd></div>'+
  '<div><dt>依據</dt><dd>'+pEsc(WorkflowReview.sourceLabel(row.sourceLevel))+'</dd></div></dl>'+
  '<div class="pg-review-decision"><strong>目前缺口</strong><p>'+pEsc(row.gap)+'</p><strong>下一個驗證項目</strong><p>'+pEsc(row.nextEvidence)+'</p></div>'+
  '<a class="pg-source-link" href="https://github.com/christinekao/AI-Tool-Collection/blob/main/docs/RELATIONSHIP_AUDIT_PHASE06_20261124.md#'+encodeURIComponent(workflowId)+'" target="_blank" rel="noopener noreferrer">查看 Audit 06 逐筆審查依據</a></section>';
}
function pReviewStageOptions(workflowId,stageIndex){
 const row=PG.reviewCases.get(workflowId);
 if(!row||!row.options.length)return '';
 const options=WorkflowReview.optionsForStage(row,stageIndex);
 if(!options.length)return '<p class="pg-review-empty">此階段尚無已對應的候選 Resource；仍需查證。</p>';
 return '<section class="pg-stage-review" aria-label="階段候選工具"><div class="pg-stage-review-title">候選工具 <span>相容性未驗證</span></div><ul class="pg-review-option-list">'+options.map(opt=>{
  const title=PG.index.get('resource:'+opt.resourceId)?.title||opt.resourceId;
  return '<li class="pg-review-option" data-review-resource="'+pEsc(opt.resourceId)+'"><a href="'+pSourceLink('resource',opt.resourceId)+'">'+pEsc(title)+'</a><small>Resource · '+pEsc(opt.resourceId)+'</small></li>';
 }).join('')+'</ul></section>';
}
function pReviewUnassigned(workflowId){
 const row=PG.reviewCases.get(workflowId);if(!row)return '';
 if(!row.options.length)return '<p class="pg-review-empty pg-review-unassigned">這份 Combination 目前沒有正式 Resource 成員，因此沒有工具候選；未核實的名稱不會自動加入。</p>';
 const options=WorkflowReview.unassignedOptions(row);
 if(!options.length)return '';
 return '<section class="pg-review-unassigned" aria-label="尚未對應階段的原有工具"><h4>尚未找到明確階段的原有工具</h4><p>以下 Resource 雖然已記錄在 Combination，但現有 Workflow 階段文字不足以判斷應放在哪一步。</p><ul class="pg-review-option-list">'+options.map(opt=>
  '<li class="pg-review-option"><a href="'+pSourceLink('resource',opt.resourceId)+'">'+pEsc(PG.index.get('resource:'+opt.resourceId)?.title||opt.resourceId)+'</a><small>Resource · '+pEsc(opt.resourceId)+' · 待確認 Stage</small></li>').join('')+'</ul></section>';
}
function pReviewOriginalStages(workflowId){
 const row=PG.reviewCases.get(workflowId),wf=PG.catalog.workflows.find(w=>w.id===workflowId);
 if(!row||!wf)return '';
 return '<details id="pg-reviewed-stages" class="pg-review-original" open><summary>查看原始 Workflow 的階段與候選工具</summary>'+
  '<p class="pg-muted">下列映射來自原始 Workflow，與上方可調整的 Recipe 不一定一對一對應；不會自動選取或更改 Recipe 工具。</p>'+
  (wf.stages||[]).map((stage,index)=>'<section class="pg-review-source-stage"><div class="pg-review-source-head"><span class="pg-index">'+String(index+1).padStart(2,'0')+'</span><strong>'+pEsc(stage.title||stage.id)+'</strong></div><p>'+pEsc(stage.purpose||'')+'</p>'+pReviewStageOptions(workflowId,index)+'</section>').join('')+
  pReviewUnassigned(workflowId)+'</details>';
}

function pRecipeEditor(){
 const recipe=PG.recipes.find(x=>x.id===PG.recipeId);if(!recipe)return pIntro();
 const result=WorkflowEngine.compose(recipe,PG.choices);
 const stages=result.steps.map((s,i)=>{
  const chosen=s.candidates.find(x=>pKey(x)===s.selection);
  const status={planned:'結構可接續',skipped:'已略過',missing:'尚缺必要工具',blocked:'上游阻塞'}[s.status];
  const choices=['<option value=""'+(s.selection===null?' selected':'')+'>'+(s.optional?'略過可選步驟':'不選（此步驟不完整）')+'</option>']
   .concat(s.candidates.map(x=>'<option value="'+pEsc(pKey(x))+'"'+(s.selection===pKey(x)?' selected':'')+'>'+pEsc(PG.index.get(pKey(x))?.title||x.id)+'</option>')).join('');
  return '<article class="pg-step" data-stage-id="'+pEsc(s.id)+'" data-status="'+pEsc(s.status)+'"><div class="pg-step-head"><span class="pg-index">'+String(i+1).padStart(2,'0')+'</span><strong>'+pEsc(s.title)+'</strong><span class="pg-status">'+status+'</span></div><p>'+pEsc(s.purpose)+'</p><label for="pg-choice-'+pEsc(s.id)+'">階段候選工具／Skill</label><select data-stage-choice="'+pEsc(s.id)+'" id="pg-choice-'+pEsc(s.id)+'">'+choices+'</select>'+
   (chosen?'<p class="pg-muted">來源依據：'+pEsc(chosen.why)+'</p>':'')+(s.missingInputs.length?'<p class="pg-muted">缺少上游產物：'+pEsc(s.missingInputs.join('、'))+'</p>':'')+
   '<div class="pg-contract"><span>需要：'+pEsc(s.requires.join('、')||'無')+'</span><span>預期產出：'+pEsc(s.produces.join('、')||'尚未定義')+'</span><span>Gate：'+pEsc(s.gate||'尚未定義')+'</span></div></article>';
 }).join('<div class="pg-connector" aria-hidden="true">↓</div>');
 const gaps=result.gaps.length?'<ul>'+result.gaps.map(x=>'<li>'+pEsc(x)+'</li>').join('')+'</ul>':'<p>所有已選步驟滿足此 Recipe 的前置產物定義；仍未驗證真實 API、資料格式、執行或輸出品質。</p>';
 return '<div class="pg-editor-panel"><span class="pg-kicker">EDITABLE RECIPE · PLANNING ONLY</span><h2>'+pEsc(recipe.title)+'</h2><p>'+pEsc(recipe.description)+'</p><div class="pg-toolbar"><button class="pg-action" type="button" data-reset-recipe>重設選擇</button><button class="pg-action pg-action-primary" type="button" data-copy-plan>複製流程</button><a class="pg-action" href="'+pSourceLink('workflow',recipe.sourceWorkflowRef.id)+'">查看原始 Workflow</a></div>'+pReviewSummary(recipe.sourceWorkflowRef.id)+stages+pResult('<strong>'+(result.structurallyPlanned?'結構規劃完整（未實測）':'目前有流程缺口')+'</strong>'+gaps)+pReviewOriginalStages(recipe.sourceWorkflowRef.id)+'<div class="pg-note">'+pEsc(recipe.disclaimer||'未驗證工具相容性。')+'</div></div>';
}
function pRecordedEditor(){
 const wf=PG.catalog.workflows.find(x=>x.id===PG.workflowId);if(!wf)return pIntro();
 const stages=(wf.stages||[]).map((stage,index)=>{
  const uses=(stage.uses||[]).map(ref=>'<a href="'+pSourceLink(ref.type,ref.id)+'">'+pEsc(PG.index.get(pKey(ref))?.title||ref.id)+'</a>').join('、');
  return '<article class="pg-step"><div class="pg-step-head"><span class="pg-index">'+String(index+1).padStart(2,'0')+'</span><strong>'+pEsc(stage.title||stage.id)+'</strong></div><p>'+pEsc(stage.purpose||'尚未整理階段內容')+'</p>'+
   (uses?'<div class="pg-step-use">正式引用：'+uses+'</div>':'<p class="pg-muted">此階段沒有正式指定工具。</p>')+
   pReviewStageOptions(wf.id,index)+
   '<div class="pg-contract"><span>已記錄產物：'+pEsc((stage.outputs||[]).join('、')||'尚未定義')+'</span><span>驗收：'+pEsc(stage.gate||'尚未定義')+'</span></div></article>';
 }).join('<div class="pg-connector" aria-hidden="true">↓</div>');
 return '<div class="pg-editor-panel"><span class="pg-kicker">RECORDED WORKFLOW · REFERENCE</span><h2>'+pEsc(wf.title)+'</h2><p>'+pEsc(wf.goal||wf.problem||'')+'</p>'+
  '<div class="pg-toolbar"><button type="button" class="pg-action pg-action-primary" data-from-workflow="'+pEsc(wf.id)+'">以正式引用工具建立自由草稿</button><button type="button" class="pg-action" data-copy-plan>複製流程</button><a class="pg-action" href="'+pSourceLink('workflow',wf.id)+'">查看完整原始資料</a></div>'+
  pReviewSummary(wf.id)+
  '<div class="pg-note">這是已收藏 Workflow 的原始階段。候選工具並非正式 Stage 引用，沒有實測 I/O 或相容契約；不可把這些候選當作已建立的 Recipe。</div>'+
  stages+pReviewUnassigned(wf.id)+'</div>';
}
function pDraftEditor(){
 const rows=PG.draft.map((key,i)=>{
  const rec=PG.index.get(key);
  return '<article class="pg-step"><div class="pg-step-head"><span class="pg-index">'+String(i+1).padStart(2,'0')+'</span><strong>'+pEsc(rec?.title||key)+'</strong><span class="pg-status">未驗證</span></div><p class="pg-muted">'+pEsc(pNames[rec?.entityType]||'工具')+' · 未建立輸入／輸出契約</p><div class="pg-step-controls"><button type="button" data-move-tool="-1" data-tool-index="'+i+'"'+(i===0?' disabled':'')+'>上移</button><button type="button" data-move-tool="1" data-tool-index="'+i+'"'+(i===PG.draft.length-1?' disabled':'')+'>下移</button><button type="button" data-remove-tool="'+pEsc(key)+'">移除</button><a href="'+pSourceLink(rec?.entityType||'resource',rec?.id||'')+'" class="pg-source-link">閱讀原始資料</a></div></article>';
 }).join('<div class="pg-connector" aria-hidden="true">↓</div>');
 return '<div class="pg-editor-panel"><span class="pg-kicker">FREEFORM DRAFT · UNVERIFIED</span><h2>自由組合你的 Workflow</h2><p>先從右下方工具資料庫加入 Resource／Skill，再調整順序。順序由你決定，不表示工具間已確認相容。</p><div class="pg-toolbar"><button class="pg-action pg-action-primary" type="button" data-copy-plan>複製草稿</button><button class="pg-action" type="button" data-reset-draft>清空草稿</button></div>'+(rows||'<div class="pg-empty-state"><p class="pg-empty">尚未加入工具。搜尋 Resource／Skill 或從知識探索開啟某個工具，即可建立草稿。</p></div>')+pResult('<strong>目前是尚未驗證的組合</strong><p>需要另外確認步驟的資料格式、依賴、API／權限、成本、安全、失敗處理與驗收條件。</p>')+'</div>';
}
function pToolsRelated(){
 const seeds=PG.draft;const candidate=new Map();
 for(const key of seeds){
  const conceptKeys=PG.graph.edges.filter(e=>e.from===key&&e.to.startsWith('concept:')).map(e=>e.to);
  for(const concept of conceptKeys){
   for(const edge of PG.graph.edges.filter(e=>e.to===concept)){
    const rec=PG.index.get(edge.from);if(!rec||!['resource','skill'].includes(rec.entityType)||seeds.includes(edge.from))continue;
    const prev=candidate.get(edge.from)||{key:edge.from,score:0,why:'共同引用 Concept：'+(PG.nodes.get(concept)?.title||'')};
    prev.score++;candidate.set(edge.from,prev);
   }
  }
 }
 return [...candidate.values()].sort((a,b)=>b.score-a.score).slice(0,8);
}
function pRenderTools(){
 const q=PG.toolSearch.toLowerCase().trim();
 let matches;
 if(q)matches=[...PG.catalog.resources,...PG.catalog.skills].filter(x=>[x.title,x.purpose,x.id,...(x.tags||[])].join(' ').toLowerCase().includes(q)).slice(0,18).map(x=>({key:pKey({type:x.entityType,id:x.id}),why:x.entityType}));
 else matches=pToolsRelated();
 p$('#pg-tools').innerHTML=matches.length?matches.map(x=>{
  const rec=PG.index.get(x.key);if(!rec)return '';
  return '<div class="pg-tool"><div><strong>'+pEsc(rec.title)+'</strong><small>'+pEsc(rec.entityType)+' · '+pEsc(x.why||'')+'</small></div><button type="button" data-add-tool="'+pEsc(x.key)+'"'+(PG.draft.includes(x.key)?' disabled':'')+'>'+(PG.draft.includes(x.key)?'已加入':'加入草稿')+'</button></div>';
 }).join(''):'<p class="pg-empty">'+(q?'找不到相符的 Resource／Skill，請換關鍵字。':'先搜尋工具；加入草稿後，這裡會顯示共同 Concept 的相關候選工具。')+'</p>';
}
function pRender(){pRenderProblems();pRenderFlowList();p$('#pg-editor').innerHTML=PG.mode==='recipe'?pRecipeEditor():PG.mode==='recorded'?pRecordedEditor():PG.mode==='draft'?pDraftEditor():pIntro();pRenderTools()}
function pSyncUrl(workflow=PG.workflowId,problem=PG.problemId,method='pushState'){
 const url=new URL(location.href);
 if(workflow)url.searchParams.set('workflow',workflow);else url.searchParams.delete('workflow');
 if(problem)url.searchParams.set('problem',problem);else url.searchParams.delete('problem');
 url.searchParams.delete('seed');
 if(url.href!==location.href)history[method](null,'',url.href);
}
function pOpenWorkflow(id,{push=false,scroll=true}={}){
 const wf=PG.catalog.workflows.find(x=>x.id===id);if(!wf)return;
 PG.workflowId=id;const r=pRecipeFor(id);
 if(r){PG.recipeId=r.id;PG.choices=WorkflowEngine.defaultChoices(r);PG.mode='recipe'}
 else{PG.recipeId=null;PG.mode='recorded'}
 if(push)pSyncUrl(id,PG.problemId);
 pRender();
 if(scroll)p$('#pg-editor').scrollIntoView({block:'start',behavior:'auto'});
}
function pRestoreRoute({scroll=false}={}){
 // URL is a shareable view state; never infer graph relationships from query params.
 PG.reviewOnly=false;PG.search='';
 const search=p$('#pg-search');if(search)search.value='';
 const params=new URLSearchParams(location.search);
 const workflow=params.get('workflow'),problem=params.get('problem'),seed=params.get('seed');
 PG.problemId=problem&&PG.nodes.has('problem:'+problem)?problem:null;
 if(workflow&&PG.catalog.workflows.some(w=>w.id===workflow)){
  if(PG.problemId&&!pLinkedWorkflows(PG.problemId).has(workflow)){
   PG.problemId=null;
   pSyncUrl(workflow,null,'replaceState'); // Keep explicit Workflow over conflicting Problem.
  }
  pOpenWorkflow(workflow,{scroll});return;
 }
 if(PG.problemId){
  const first=pFlowList()[0];
  if(first){pOpenWorkflow(first.id,{scroll});return}
 }
 if(seed&&PG.index.has(seed)&&['resource','skill'].includes(PG.index.get(seed).entityType)){
  if(!PG.draft.includes(seed)){PG.draft.push(seed);pPersistDraft()}
  PG.mode='draft';PG.workflowId=null;PG.recipeId=null;pRender();return;
 }
 PG.mode='home';PG.workflowId=null;PG.recipeId=null;pRender();
}
function pOpenDraft(){PG.mode='draft';PG.workflowId=null;PG.recipeId=null;pRender()}
function pPersistDraft(){try{localStorage.setItem('ai-tool-playground-draft-v1',JSON.stringify(PG.draft))}catch{}}
function pCopyText(){
 if(PG.mode==='recipe'){
  const r=PG.recipes.find(x=>x.id===PG.recipeId),plan=WorkflowEngine.compose(r,PG.choices);
  return [r.title,...plan.steps.map((s,i)=>(i+1)+'. '+s.title+'：'+(PG.index.get(s.selection)?.title||'未選')+' ['+s.status+']' +(s.missingInputs.length?' 缺少：'+s.missingInputs.join('、'):'')),...plan.gaps,'注意：僅結構規劃，未實測工具相容性。'].join('\n');
 }
 if(PG.mode==='recorded'){const w=PG.catalog.workflows.find(x=>x.id===PG.workflowId);return [w.title,w.goal,...(w.stages||[]).map((s,i)=>(i+1)+'. '+s.title+' — '+(s.purpose||'')),'注意：尚未核對跨工具依賴與相容性。'].join('\n')}
 return ['自由 Workflow 草稿（未驗證）',...PG.draft.map((k,i)=>(i+1)+'. '+(PG.index.get(k)?.title||k)),'注意：未核對輸入、輸出、依賴與安全條件。'].join('\n');
}
function pBind(){
 document.addEventListener('click',async e=>{
  const btn=e.target.closest('button');if(!btn)return;
  if(btn.dataset.problemId){PG.problemId=PG.problemId===btn.dataset.problemId?null:btn.dataset.problemId;const list=pFlowList();if(list.length){pOpenWorkflow(list[0].id,{push:true})}else{PG.mode='home';PG.workflowId=null;PG.recipeId=null;pSyncUrl(null,PG.problemId);pRender()}return}
  if(btn.dataset.flowId){pOpenWorkflow(btn.dataset.flowId,{push:true});return}
  if(btn.id==='pg-open-draft'){pOpenDraft();return}
  if(btn.id==='pg-clear-filters'||btn.hasAttribute('data-clear-filters')){PG.problemId=null;PG.reviewOnly=false;PG.search='';p$('#pg-search').value='';pSyncUrl(PG.workflowId,null);pRender();return}
  if(btn.hasAttribute('data-reset-recipe')){const r=PG.recipes.find(x=>x.id===PG.recipeId);PG.choices=WorkflowEngine.defaultChoices(r);pRender();return}
  if(btn.hasAttribute('data-from-workflow')){const w=PG.catalog.workflows.find(x=>x.id===btn.dataset.fromWorkflow);const keys=[...new Set((w?.stages||[]).flatMap(s=>s.uses||[]).filter(r=>['resource','skill'].includes(r.type)).map(pKey).filter(k=>PG.index.has(k)))];PG.draft=keys;pPersistDraft();pOpenDraft();return}
  if(btn.hasAttribute('data-add-tool')){const key=btn.dataset.addTool;const rec=PG.index.get(key);if(rec&&['resource','skill'].includes(rec.entityType)&&!PG.draft.includes(key)){PG.draft.push(key);pPersistDraft();pOpenDraft()}return}
  if(btn.hasAttribute('data-remove-tool')){PG.draft=PG.draft.filter(k=>k!==btn.dataset.removeTool);pPersistDraft();pRender();return}
  if(btn.hasAttribute('data-move-tool')){const i=Number(btn.dataset.toolIndex),j=i+Number(btn.dataset.moveTool);if(Number.isInteger(i)&&j>=0&&j<PG.draft.length){[PG.draft[i],PG.draft[j]]=[PG.draft[j],PG.draft[i]];pPersistDraft();pRender()}return}
  if(btn.hasAttribute('data-reset-draft')){PG.draft=[];pPersistDraft();pRender();return}
  if(btn.hasAttribute('data-copy-plan')){try{await navigator.clipboard.writeText(pCopyText());p$('#pg-status').textContent='已複製流程規劃'}catch{p$('#pg-status').textContent='瀏覽器未授權複製'}return}
 });
 document.addEventListener('change',e=>{const el=e.target.closest('[data-stage-choice]');if(!el)return;PG.choices[el.dataset.stageChoice]=el.value||null;pRender()});
 p$('#pg-search').addEventListener('input',e=>{PG.search=e.target.value;pRenderFlowList()});
 p$('#pg-review-only').addEventListener('change',e=>{PG.reviewOnly=e.target.checked&&PG.reviewState==='ready';pRenderFlowList()});
 window.addEventListener('popstate',()=>pRestoreRoute());
 p$('#pg-tool-search').addEventListener('input',e=>{PG.toolSearch=e.target.value;pRenderTools()});
}
async function pInit(){
 try{
  const [cRes,gRes,...rRes]=await Promise.all([fetch('data/catalog-v2.json',{cache:'no-store'}),fetch('data/knowledge-graph-v1.json',{cache:'no-store'}),...PG_RECIPES.map(id=>fetch('data/workflow-recipes/'+id+'.json',{cache:'no-store'}))]);
  if(!cRes.ok||!gRes.ok)throw Error('Catalog 或 Graph 讀取失敗');
  PG.catalog=await cRes.json();PG.graph=await gRes.json();
  if(!Array.isArray(PG.catalog.workflows)||!Array.isArray(PG.graph.edges))throw Error('資料格式不正確');
  PG.index=WorkflowEngine.indexCatalog(PG.catalog);PG.nodes=new Map(PG.graph.nodes.map(n=>[n.key,n]));
  try{
   const reviewResponse=await fetch('docs/RELATIONSHIP_AUDIT06_OPTIONS_REVIEW_20261124.json',{cache:'no-store'});
   if(!reviewResponse.ok)throw Error('Review JSON HTTP '+reviewResponse.status);
   const validated=WorkflowReview.inspect(await reviewResponse.json(),PG.catalog);
   if(!validated.ok)throw Error('Review source integrity: '+validated.errors.slice(0,4).join(', '));
   PG.reviewCases=validated.byWorkflow;PG.reviewState='ready';
  }catch(error){PG.reviewCases=new Map();PG.reviewState='unavailable';console.warn('Review preview disabled:',error.message)}
  const loaded=await Promise.all(rRes.map(r=>r.ok?r.json():null));
  PG.recipes=loaded.filter(Boolean).filter(r=>{try{WorkflowEngine.validateRecipe(r,PG.catalog);return true}catch(error){console.warn('Recipe ignored:',r.id,error);return false}});
  try{const old=JSON.parse(localStorage.getItem('ai-tool-playground-draft-v1')||'[]');PG.draft=Array.isArray(old)?old.filter(k=>PG.index.has(k)&&['resource','skill'].includes(PG.index.get(k).entityType)).slice(0,50):[]}catch{}
  pBind();pRestoreRoute({scroll:true});
 }catch(error){console.error(error);p$('#pg-editor').innerHTML='<div class="pg-error">Playground 載入失敗。請確認最新資料已部署並重新整理。</div>'}
}
pInit();
