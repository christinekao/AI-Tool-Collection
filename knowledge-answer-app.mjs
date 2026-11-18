import {createAnswer,indexKnowledge,searchKnowledge,classifyIntent,INTENT_LABEL} from './knowledge-answer-core.mjs?v=1';

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const safeUrl=s=>{try{const u=new URL(s,location.href);return /^https?:$/.test(u.protocol)?u.href:''}catch{return ''}};
const state={catalog:null,problems:[],docs:new Map(),query:'',result:null,ready:false,busy:false};
const types={resource:'Resource',skill:'Skill',concept:'Concept',prompt:'Prompt',workflow:'Workflow',combination:'Combination',problem:'Problem'};

function citation(source){
 if(!source?.href)return '';
 return '<a class="ask-source" href="'+esc(source.href)+'" title="閱讀收藏中的原始紀錄">來源：'+esc(source.title)+'</a>';
}
function renderFact(item){
 return '<article class="ask-fact">'+
  (item.label?'<small>'+esc(item.label)+'</small>':'')+
  '<p>'+esc(item.text)+'</p>'+citation(item.source)+'</article>';
}
function renderSteps(items){
 return '<div class="ask-step-list">'+items.map((step,i)=>
  '<article class="ask-step"><div class="ask-step-row"><span class="ask-step-index">'+String(i+1).padStart(2,'0')+'</span><strong>'+esc(step.title)+'</strong></div>'+
  '<p>'+esc(step.action)+'</p><dl><div><dt>資料記載的產物</dt><dd>'+esc(step.output||'未定義')+'</dd></div>'+
  '<div><dt>資料記載的檢查條件</dt><dd>'+esc(step.check||'尚未定義')+'</dd></div></dl>'+citation(step.source)+'</article>'
 ).join('')+'</div>';
}
function renderComparison(items){
 return '<div class="ask-compare-list">'+items.map(i=>'<article class="ask-comparison"><strong>'+esc(i.title)+'</strong>'+
  '<p>'+esc(i.purpose)+'</p>'+(i.features?.length?'<h4>已記載的能力</h4><ul>'+i.features.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+
  (i.limitations?.length?'<h4>限制與取捨</h4><ul>'+i.limitations.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+
  citation(i.source)+'</article>').join('')+'</div>';
}
function renderPractice(items){
 return items.map(i=>'<div class="ask-practice"><p>'+esc(i.task)+'</p>'+
  (i.checks||[]).map(check=>'<label><input type="checkbox"><span>'+esc(check)+'</span></label>').join('')+
  '<p>'+citation(i.source)+'</p></div>').join('');
}
function renderSection(section){
 let body='';
 if(section.kind==='compare')body=renderComparison(section.items);
 else if(section.kind==='steps')body=renderSteps(section.items);
 else if(section.kind==='practice')body=renderPractice(section.items);
 else body='<div class="ask-facts">'+section.items.map(renderFact).join('')+'</div>';
 return '<section class="ask-panel" data-section="'+esc(section.kind)+'"><h3>'+esc(section.title)+'</h3>'+body+'</section>';
}
function renderSources(sources){
 return '<section class="ask-panel"><h3>資料來源（'+sources.length+'）</h3><div class="ask-source-list">'+sources.map(s=>
  '<article class="ask-resource"><span class="ask-badge">'+esc(types[s.type]||s.type)+'</span><div>'+
  '<a href="'+esc(s.href)+'">'+esc(s.title)+'</a><p>'+esc(s.reason||'已收藏的原始資料')+'</p>'+
  (safeUrl(s.sourceUrl)?'<a class="ask-origin" href="'+esc(safeUrl(s.sourceUrl))+'" target="_blank" rel="noopener noreferrer">查看原始網站</a>':'')+'</div></article>'
 ).join('')+'</div></section>';
}
function copyAnswer(result){
 const lines=[result.query,'模式：'+(INTENT_LABEL[result.intent]||result.intent),''];
 for(const s of result.sections){
  lines.push('## '+s.title);
  for(const i of s.items){
   if(s.kind==='steps')lines.push('- '+i.title+'：'+i.action+'｜產物：'+i.output+'｜驗收：'+i.check+'｜'+i.source?.href);
   else if(s.kind==='compare')lines.push('- '+i.title+'：'+i.purpose+'｜'+i.source?.href);
   else if(s.kind==='practice')lines.push('- 練習：'+i.task+'｜'+i.source?.href);
   else lines.push('- '+i.text+'（來源：'+i.source?.href+'）');
  }
  lines.push('');
 }
 if(result.gap)lines.push('資料缺口：'+result.gap);
 lines.push('資料界線：'+result.notice,'','## 已使用的收藏',...result.sources.map(s=>'- '+s.title+'：'+s.href));
 return lines.join('\n');
}
function render(result){
 state.result=result;
 const word=INTENT_LABEL[result.intent]||'檢索';
 const head='<header class="ask-head"><div><span class="ask-kicker">來源支持的內容整理 · '+esc(word)+'</span>'+
  '<h2>'+esc(result.query)+'</h2>'+
  '<p>根據目前收藏組織內容；所有重點皆可開啟來源紀錄核對。不同需求呈現的內容會不同。</p></div>'+
  (result.empty?'':'<button type="button" class="ask-copy" id="ask-copy">複製整理結果</button>')+'</header>';
 if(result.empty){
  $('#ask-output').innerHTML=head+'<div class="ask-gap" role="status"><strong>目前資料不足</strong><p>'+esc(result.missing)+'</p></div>'+
   '<div class="ask-panel"><h3>接下來可以做什麼？</h3><p class="ask-footer-note">改用更具體的技術名稱，或先到全部收藏核對是否有相關來源。未找到的內容不會被當成已收藏知識。</p><a href="index.html#/browse/all">開啟全部收藏</a></div>';
 }else{
  $('#ask-output').innerHTML=head+result.sections.map(renderSection).join('')+
   (result.gap?'<div class="ask-gap"><strong>目前仍有資料缺口</strong><p>'+esc(result.gap)+'</p></div>':'')+
   renderSources(result.sources)+'<p class="ask-footer-note">'+esc(result.notice)+'</p>';
  $('#ask-copy').addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText(copyAnswer(state.result));$('#ask-copy').textContent='已複製'}
   catch{$('#ask-copy').textContent='無法使用剪貼簿，請檢查權限'}
  });
 }
 $('#ask-output').scrollIntoView({block:'start',behavior:'smooth'});
}
async function getJson(url){
 let err;
 for(let attempt=0;attempt<3;attempt++){
  try{
   const response=await fetch(url,{cache:'no-store'});
   if(!response.ok)throw Error('HTTP '+response.status);
   return await response.json();
  }catch(error){err=error;if(attempt<2)await new Promise(r=>setTimeout(r,240*(attempt+1)))}
 }
 throw err;
}
async function initialize(){
 $('#ask-meta').textContent='載入全部收藏與 Knowledge Graph…';
 const [catalog,graph]=await Promise.all([
  getJson('data/catalog-v2.json'),
  getJson('data/knowledge-graph-v1.json')
 ]);
 if(!Array.isArray(catalog.resources)||!Array.isArray(graph.nodes))throw Error('收藏或知識索引格式不正確');
 state.catalog=catalog;
 state.problems=graph.nodes.filter(n=>n.type==='problem').map(p=>({
  id:p.id,title:p.title,question:p.question,description:p.summary,outcome:p.outcome,
  tags:p.tags,domain:p.domain
 }));
 state.ready=true;
 const count=['resources','skills','concepts','prompts','workflows','combinations'].reduce((sum,k)=>sum+(catalog[k]?.length||0),0);
 $('#ask-meta').textContent='已載入 '+count+' 筆原始收藏、'+state.problems.length+' 筆 Problem；不改動資料原件。';
 const incoming=new URLSearchParams(location.search).get('q');
 if(incoming){$('#ask-query').value=incoming.slice(0,350);await ask(incoming)}
}
async function relevantProblemDocs(query){
 const ranked=searchKnowledge(query,indexKnowledge(state.catalog,state.problems),{intent:classifyIntent(query),limit:22});
 const ids=ranked.filter(x=>x.record.type==='problem').slice(0,3).map(x=>x.record.id);
 // Dynamically load curated lessons only when matched, not for every query or every Problem.
 return Promise.all(ids.map(async id=>{
  if(state.docs.has(id))return state.docs.get(id);
  try{
   const doc=await getJson('data/problems/'+encodeURIComponent(id)+'.json');
   if(doc.id!==id||doc.schemaVersion!==1)throw Error('Problem id mismatch');
   state.docs.set(id,doc);return doc;
  }catch(error){console.warn('Could not load optional Problem detail',id,error);return null}
 }));
}
async function ask(query){
 const q=String(query??'').trim().slice(0,350);
 if(!q||!state.ready||state.busy)return;
 state.busy=true;state.query=q;
 $('#ask-submit').disabled=true;
 $('#ask-meta').textContent='正在從全部收藏找來源並整理…';
 try{
  const problems=state.problems.map(p=>state.docs.get(p.id)||p);
  let output=createAnswer(q,state.catalog,problems);
  const docs=await relevantProblemDocs(q);
  if(docs.some(Boolean))output=createAnswer(q,state.catalog,state.problems.map(p=>state.docs.get(p.id)||p));
  // Shareable URL is updated only on deliberate user searches. No external model calls.
  history.replaceState(null,'',location.pathname+'?q='+encodeURIComponent(q));
  render(output);
  $('#ask-meta').textContent='需求：'+INTENT_LABEL[output.intent]+' · 已找到 '+output.matchCount+' 筆相關候選 · 引用 '+output.sources.length+' 筆可檢視來源';
 }catch(error){
  console.error('Knowledge answer retrieval failed',error);
  $('#ask-meta').textContent='回答載入失敗';
  $('#ask-output').innerHTML='<div class="ask-error"><strong>無法讀取知識資料</strong><p>已保留你的問題；請重新搜尋。錯誤：'+esc(error.message||'未知錯誤')+'</p><button type="button" class="ask-retry" id="ask-retry">重試</button></div>';
  $('#ask-retry').addEventListener('click',()=>ask(q));
 }finally{state.busy=false;$('#ask-submit').disabled=false}
}
$('#ask-form').addEventListener('submit',e=>{e.preventDefault();ask($('#ask-query').value)});
document.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>{
 $('#ask-query').value=button.dataset.question;ask(button.dataset.question);
}));
initialize().catch(error=>{
 console.error('Collection initialization failed',error);
 $('#ask-meta').textContent='收藏資料載入失敗';
 $('#ask-output').innerHTML='<div class="ask-error"><strong>無法讀取完整收藏</strong><p>'+esc(error.message||'未知錯誤')+'</p><button type="button" id="ask-reload" class="ask-retry">重新載入</button></div>';
 $('#ask-reload').addEventListener('click',()=>location.reload());
});

