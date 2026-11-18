'use strict';
/* Problem lessons are rendered from canonical V2 records plus the separately curated
 * data/problems/<id>.json. They never claim an untested Workflow was executed. */
window.KnowledgeLearning=(()=>{
 const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const shorten=(s,n=300)=>{const x=String(s??'').replace(/\s+/g,' ').trim();return x.length>n?x.slice(0,n-1)+'…':x};
 const arr=v=>Array.isArray(v)?v:[];
 const key=(type,id)=>type+':'+id;
 const literal=x=>{
  if(typeof x==='string')return x;
  if(Array.isArray(x))return x.map(literal).filter(Boolean).join('；');
  if(x&&typeof x==='object')return literal(x.summary||x.description||x.details||x.method||x.title||x.name||'');
  return '';
 };
 function button(ref,title,caption){
  return '<button type="button" class="kg-lesson-ref" data-read-node="'+h(key(ref.type,ref.id))+'">'+h(title)+'<span>'+h(caption||'閱讀原始資料')+'</span></button>';
 }
 const section=(id,index,title,inner)=>'<section class="kg-lesson-section" id="kg-lesson-'+h(id)+'"><div class="kg-lesson-section-title"><span>'+h(String(index).padStart(2,'0'))+'</span><h3>'+h(title)+'</h3></div>'+inner+'</section>';
 const items=(items,cls)=>arr(items).length?'<ul class="'+h(cls||'kg-lesson-bullets')+'">'+items.map(s=>'<li>'+h(s)+'</li>').join('')+'</ul>':'';
 const featured=[
  {id:'build-business-website',kind:'網站設計',outcome:'學會從網站 Brief 走到可驗收的頁面'},
  {id:'ai-coding-spec-delivery',kind:'AI Agent 開發',outcome:'理解 Spec、Ticket、平行開發及 Evidence QA'},
  {id:'enterprise-knowledge-search',kind:'RAG 與資料',outcome:'分清文件問答與 SQL 資料分析'},
  {id:'long-video-to-shorts',kind:'影音製作',outcome:'學會挑片、初剪與可編輯時間軸'},
  {id:'shared-agent-memory',kind:'Agent Memory',outcome:'建立可持續更新的跨 Session 記憶'},
  {id:'privacy-safe-ai-documents',kind:'隱私與安全',outcome:'理解本機遮罩、雲端處理及還原檢查'}
 ];
 function featuredMarkup(byKey){
  return '<section class="kg-learning-home" aria-labelledby="kg-learning-home-title">'+
   '<div class="kg-learning-home-head"><span class="kg-kicker">START LEARNING / 從成果開始</span><h2 id="kg-learning-home-title">選一個問題，學會一套做法</h2><p>不只是收藏工具。每份完整教學會解釋核心原理、操作順序、選擇理由、虛構範例和練習題。</p></div>'+
   '<div class="kg-learning-cards">'+featured.filter(f=>byKey.has('problem:'+f.id)).map(f=>{
    const n=byKey.get('problem:'+f.id);
    return '<button class="kg-learning-card" type="button" data-open-node="'+h(n.key)+'"><small>'+h(f.kind)+' · 完整學習筆記</small><strong>'+h(n.title)+'</strong><span>'+h(f.outcome)+'</span><em>開始閱讀 →</em></button>';
   }).join('')+'</div>'+
   '<p class="kg-learning-home-footer">以下仍可搜尋全部原始收藏；尚未有深入教學的 Problem 會顯示來源支持的流程導讀及資料缺口。</p></section>';
 }
 function stepsFromWorkflow(wf){
  return arr(wf?.stages).map(s=>({
   title:s.title||s.id,
   action:s.purpose||'來源尚未提供具體步驟說明。',
   output:arr(s.outputs).join('、')||'原始 Workflow 尚未定義產物',
   check:s.gate||'原始 Workflow 尚未記錄可重現的驗收條件'
  }));
 }
 function renderSteps(steps,fromGuide){
  if(!steps.length)return '<p class="kg-lesson-empty">這個主題尚缺有依據的操作流程，不能依工具標籤自動拼出完整步驟。</p>';
  return '<p class="kg-lesson-caption">'+(fromGuide?'以下是依已收藏方法整理的教學步驟，並非已執行紀錄。':'以下直接整理自已收藏 Workflow 的原始階段；沒有填寫的產物與驗收不會自行補造。')+'</p>'+
   '<div class="kg-lesson-steps">'+steps.map((s,i)=>'<article class="kg-lesson-step"><div class="kg-lesson-step-head"><span>'+String(i+1).padStart(2,'0')+'</span><h4>'+h(s.title)+'</h4></div><p>'+h(s.action||'')+'</p><dl><div><dt>留下什麼</dt><dd>'+h(s.output||'尚未定義')+'</dd></div><div><dt>怎麼檢查</dt><dd>'+h(s.check||'尚未定義')+'</dd></div></dl></article>').join('')+'</div>';
 }
 function renderDecisions(decisions){
  return '<div class="kg-lesson-decisions">'+decisions.map(d=>
   '<article><p class="kg-lesson-condition">遇到：'+h(d.situation)+'</p><h4>'+h(d.approach)+'</h4><p>'+h(d.why)+'</p></article>'
  ).join('')+'</div>';
 }
 function renderExample(ex){
  if(!ex||!ex.input||!ex.output)return '';
  return '<p class="kg-lesson-caption">以下為協助理解的假設情境，不是第三方工具的實測成果。</p>'+
   '<div class="kg-lesson-example"><h4>'+h(ex.label||'假設範例')+'</h4>'+
   '<div><strong>起始需求</strong><p>'+h(ex.input)+'</p></div>'+
   '<div><strong>處理方式</strong><p>'+h(ex.process||'')+'</p></div>'+
   '<div><strong>理想產物</strong><p>'+h(ex.output)+'</p></div></div>';
 }
 function renderConcepts(edges,recordIndex,nodeIndex){
  const concepts=edges.filter(e=>e.to.startsWith('concept:')).slice(0,4);
  if(!concepts.length)return '<p class="kg-lesson-empty">尚未整理可以解釋這個問題的 Concept。</p>';
  return '<div class="kg-lesson-concepts">'+concepts.map(e=>{
   const record=recordIndex.get(e.to),node=nodeIndex.get(e.to);
   if(!node)return '';
   const methods=shorten(literal(record?.solutionMethods),450);
   const tradeoffs=shorten(literal(record?.tradeoffs),260);
   return '<article><div class="kg-lesson-concept-head">'+button({type:'concept',id:node.id},node.title,'查看完整原理')+'</div>'+
    (record?.coreProblem?'<p><b>它在解決：</b>'+h(shorten(record.coreProblem,350))+'</p>':'')+
    (methods?'<p><b>主要做法：</b>'+h(methods)+'</p>':'')+
    (tradeoffs?'<p><b>取捨：</b>'+h(tradeoffs)+'</p>':'')+
    '<small>與此問題的關聯：'+h(e.why||'人工整理引用')+'</small></article>';
  }).join('')+'</div>';
 }
 function renderResources(edges,recordIndex,nodeIndex){
  const relevant=edges.filter(e=>['resource:','skill:','prompt:','combination:'].some(x=>e.to.startsWith(x))).slice(0,12);
  if(!relevant.length)return '<p class="kg-lesson-empty">目前沒有直接策展的工具或技能引用。</p>';
  return '<div class="kg-lesson-resource-list">'+relevant.map(e=>{
   const node=nodeIndex.get(e.to),rec=recordIndex.get(e.to);if(!node)return '';
   const purpose=shorten(literal(rec?.purpose||rec?.goal||rec?.recommendation),260);
   return '<article><div>'+button({type:node.type,id:node.id},node.title,(node.type==='resource'?'工具':node.type==='skill'?'技能':node.type==='prompt'?'提示詞':'組合')+' · 查看資料')+
    '<p>'+h(e.why||purpose||'已整理的相關參考')+'</p>'+(purpose?'<small>原始用途：'+h(purpose)+'</small>':'')+'</div></article>';
  }).join('')+'</div>';
 }
 function renderRefs(learning,recordIndex,nodeIndex){
  const references=arr(learning?.sourceRefs).filter(ref=>recordIndex.has(key(ref.type,ref.id))&&nodeIndex.has(key(ref.type,ref.id)));
  return references.length?'<div class="kg-lesson-evidence">'+references.map(ref=>{
   const node=nodeIndex.get(key(ref.type,ref.id));
   return button(ref,node.title,'檢查知識原始紀錄');
  }).join('')+'</div>':'';
 }
 function renderProblem(node,source,context){
  const edges=context.edges.filter(e=>e.from===node.key&&e.kind==='curated'&&e.relation!=='has_subproblem');
  const guide=source?.learning?.version===1?source.learning:null;
  const workflowEdges=edges.filter(e=>e.to.startsWith('workflow:'));
  const wf=workflowEdges.map(e=>context.recordIndex.get(e.to)).find(w=>Array.isArray(w?.stages)&&w.stages.length);
  const steps=guide?.steps?.length?guide.steps:stepsFromWorkflow(wf);
  const outcomes=guide?.prerequisites||[];
  const start=source||node;
  let html='<div class="kg-lesson-top"><span class="kg-kicker">'+(guide?'GUIDED LESSON / 已整理教學':'SOURCE-BASED GUIDE / 來源導讀')+'</span>'+
   '<h2 id="kg-knowledge-heading">先理解解法，再決定要用哪些工具</h2>'+
   '<p>'+h(source?.description||node.summary||'')+'</p><div class="kg-lesson-thesis"><small>先記住這件事</small><strong>'+h(guide?.takeaway||node.outcome||'先確認目標與來源，再建立操作方法。')+'</strong></div>'+
   (outcomes.length?'<div class="kg-lesson-prereqs"><strong>開始前先準備</strong>'+items(outcomes)+'</div>':'')+'</div>';
  let num=0;
  html+=section('principles',++num,'為什麼要這樣做？',guide?.principles?.length?
   '<div class="kg-lesson-principles">'+guide.principles.map((c,i)=>'<article><span>觀念 '+(i+1)+'</span><h4>'+h(c.title)+'</h4><p>'+h(c.explanation)+'</p></article>').join('')+'</div>':
   '<p class="kg-lesson-caption">從已收藏的 Concept 讀取真實的問題、方法與取捨，而不是只列名稱。</p>');
  html+=section('concepts',++num,'先掌握哪些核心觀念？',renderConcepts(edges,context.recordIndex,context.nodeIndex));
  html+=section('steps',++num,'實際該怎麼開始？',renderSteps(steps,Boolean(guide?.steps?.length))+
   (wf?'<p class="kg-lesson-source-note">本主題的正式 Workflow：'+button({type:'workflow',id:wf.id},wf.title,'閱讀原始階段及資料')+'</p>':'<p class="kg-lesson-source-note">此 Problem 尚未直接連結具備階段資訊的 Workflow。上面的教學步驟如有提供，是學習導讀，不應自動當成已測試的工具串接流程。</p>'));
  if(guide?.decisions?.length)html+=section('decisions',++num,'不同情境，怎麼選？',renderDecisions(guide.decisions));
  if(guide?.example)html+=section('example',++num,'看一個完整的例子',renderExample(guide.example));
  html+=section('resources',++num,'工具與技能各負責什麼？',renderResources(edges,context.recordIndex,context.nodeIndex));
  if(guide?.practice)html+=section('practice',++num,'自己試一次，確認真的理解',
   '<div class="kg-lesson-practice"><h4>練習題</h4><p>'+h(guide.practice.task)+'</p><h4>完成後檢查</h4>'+
   '<div class="kg-lesson-checklist">'+arr(guide.practice.checks).map((s,i)=>'<label><input type="checkbox" aria-label="'+h(s)+'"><span>'+h(s)+'</span></label>').join('')+'</div><small>這是自行檢查清單，不會自動判斷答案是否正確，也不會送出你的資料。</small></div>');
  if(guide?.pitfalls?.length)html+=section('pitfalls',++num,'容易犯的錯誤',items(guide.pitfalls,'kg-lesson-pitfalls'));
  html+=section('sources',++num,'原始資料與可信度',
   (guide?renderRefs(guide,context.recordIndex,context.nodeIndex):'<p class="kg-lesson-caption">此問題尚未補齊完整教學。上方僅用現有正式資料的流程、Concept 與用途建立導讀。</p>')+
   '<p class="kg-lesson-disclaimer">這些內容是根據已收藏的知識整理出的學習方法，不等於第三方工具最新功能已驗證，也不代表工具間已實際串接。需要操作第三方服務時，請另外核對官方文件、資料權限、成本與安全條件。</p>');
  return '<div class="kg-lesson">'+html+'</div>';
 }
 return {renderProblem,featuredMarkup};
})();

