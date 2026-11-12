'use strict';
const TYPES={resources:'Resources',skills:'Skills',concepts:'Concepts',prompts:'Prompts',combinations:'Combinations',workflows:'Workflows'};
const SINGULAR={resource:'resources',skill:'skills',concept:'concepts',prompt:'prompts',combination:'combinations',workflow:'workflows'};
const TOPICS=[
{id:'learning',name:'學習與教材',desc:'課程、教學文件、練習工具與知識整理',icon:'◉',rx:/學習|教學|教材|課程|教案|教練|練習|培訓|教育|訓練|入門|tutorial|course|curriculum|education|learning|teaching|training|study.guide|study.plan|learn.by|interview.practice|oncall.training|knowledge.transfer|flashcard/i},
{id:'agents',name:'AI Agent 與 Skills',desc:'Agent 架構、工具調用、協作與可重用技能',icon:'◇',rx:/agent|multi.agent|mcp|skill|harness|orchestrat|codex|claude.code|tool.use|context.engineer|代理|智能體|代理人|多代理/i},
{id:'coding',name:'程式開發',desc:'Coding Agent、測試、程式品質與開發流程',icon:'⌘',rx:/coding|codebase|code.review|software|develop|programming|\bgit\b|github|gitlab|debug|testing|test.automation|ci.cd|developer|程式|開發|除錯|測試|重構/i},
{id:'frontend',name:'前端與 UI 設計',desc:'網頁、React、CSS、元件與視覺設計',icon:'▣',rx:/frontend|front.end|web.design|web.platform|\bui\b|\bux\b|react|next.js|css|html|design.system|figma|tailwind|landing.page|網站|前端|介面|設計|視覺/i},
{id:'data',name:'資料與分析',desc:'資料工程、BI、研究、視覺化與分析工具',icon:'▥',rx:/\bdata\b|dataset|data.engineer|data.pipeline|analytics|analysis|dashboard|database|sql|etl|pipeline|visualization|research|\brag\b|search|資料|分析|研究|儀表板|向量/i},
{id:'automation',name:'自動化與流程',desc:'工作流程、Agent 協作、排程與整合',icon:'↗',rx:/automat|workflow|pipeline|integration|orchestrat|scheduled|cron|power.automat|n8n|自動化|工作流程|排程|串接|整合/i},
{id:'career',name:'求職與面試',desc:'履歷、職缺、面試與職涯能力提升',icon:'◎',rx:/career|resume|recruit|hiring|job.search|job.application|cv|interview|headhunt|portfolio|履歷|求職|面試|職涯|職缺|作品集/i},
{id:'content',name:'內容與創作',desc:'文章、影片、社群、影像與創作工作流',icon:'✧',rx:/content|video|youtube|social|post|media|image|illustrat|animation|writing|creative|marketing|seo|影片|社群|寫作|創作|圖片|影像|動畫/i},
{id:'security',name:'安全與治理',desc:'權限、隱私、風險、驗證與治理',icon:'⬡',rx:/secur|privacy|pii|credential|secret|permission|governance|audit|compliance|guardrail|risk|安全|隱私|權限|稽核|合規|治理/i}
];
const state={topic:'all',type:'all',query:'',limit:24,detail:null,returnHash:'#/explore',data:null,items:[],byType:{},aliases:new Map()};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=s=>typeof s==='string'?s.trim():'';
const short=(s,n=170)=>{const v=text(s).replace(/\s+/g,' ');return v.length>n?v.slice(0,n).replace(/[，,；;\s]+$/,'')+'…':v};
const list=a=>Array.isArray(a)?a:[];
const url=s=>{try{const u=new URL(s);return /^(https?:)$/.test(u.protocol)?u.href:''}catch{return ''}};
const link=(href,label)=>'<a href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+'</a>';
const routeFor=(type,id)=>'#/'+SINGULAR[type]+'/'+encodeURIComponent(id);
const kindLabel=x=>TYPES[SINGULAR[x.entityType]]||x.entityType;
function indexData(){
 state.items=[];state.byType={};state.aliases=new Map();
 for(const [plural,label] of Object.entries(TYPES)){
  const rows=list(state.data[plural]);
  const singular=Object.keys(SINGULAR).find(k=>SINGULAR[k]===plural);
  state.byType[singular]=new Map(rows.map(x=>[x.id,x]));
  for(const x of rows){
   state.items.push(x);
   if(singular==='resource'||singular==='skill'){
    for(const value of [x.id,x.title,x.canonicalName,x.repo]){
     const key=text(value).toLowerCase();if(!key)continue;
     if(!state.aliases.has(key))state.aliases.set(key,new Map());
     state.aliases.get(key).set(singular+':'+x.id,{type:singular,id:x.id});
    }
   }
  }
 }
}
function matchTopic(x,topic){
 if(topic==='all')return true;
 const t=TOPICS.find(t=>t.id===topic);if(!t)return true;
 const fields=[x.title,x.category,x.resourceType,...list(x.tags),x.purpose,x.goal,x.problem,x.coreProblem,x.recommendation].filter(Boolean).join(' ');
 if(topic==='learning'){
  const explicit=/學習|教學|教材|課程|教案|教練|練習|培訓|教育|訓練|入門|tutorial|course|curriculum|education|teaching|training|study.guide|study.plan|learn.by|interview.practice|oncall.training|knowledge.transfer|flashcard/i;
  if(explicit.test(fields))return true;
  return /\blearning\b/i.test(fields)&&!/machine.learning|deep.learning|reinforcement.learning|federated.learning|active.learning/i.test(fields);
 }
 return t.rx.test(fields);
}
function score(x,topic,terms){
 let n=0;
 const title=text(x.title).toLowerCase(),tags=list(x.tags).join(' ').toLowerCase();
 const desc=[x.purpose,x.goal,x.problem,x.coreProblem,x.recommendation,x.category].join(' ').toLowerCase();
 const t=TOPICS.find(t=>t.id===topic);
 if(t){if(t.rx.test(title))n+=12;if(t.rx.test(tags))n+=7;if(t.rx.test(desc))n+=2;}
 for(const term of terms){if(title.includes(term))n+=16;if(tags.includes(term))n+=7;if(desc.includes(term))n+=4;}
 if(x.entityType==='resource')n+=1;
 if(text(x.purpose).length>65)n+=2;
 if(text(x.recommendation).length>50)n+=3;
 if(list(x.features).length)n+=2;
 return n;
}
function filtered(){
 const terms=state.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
 const rows=state.items.filter(x=>(state.type==='all'||SINGULAR[x.entityType]===state.type)&&matchTopic(x,state.topic)&&terms.every(t=>JSON.stringify(x).toLowerCase().includes(t)));
 return rows.sort((a,b)=>score(b,state.topic,terms)-score(a,state.topic,terms)||String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))||a.title.localeCompare(b.title));
}
function summary(x){
 if(x.entityType==='resource')return {what:text(x.purpose)||text(x.resourceType)||'尚未補充用途說明',fit:text(x.recommendation)};
 if(x.entityType==='skill')return {what:text(x.purpose)||text(x.problem)||'尚未補充用途說明',fit:text(x.problem)};
 if(x.entityType==='concept')return {what:text(x.coreProblem)||'尚未補充核心問題',fit:list(x.solutionMethods)[0]||''};
 if(x.entityType==='prompt')return {what:text(x.problem)||text(x.goal)||'尚未補充用途說明',fit:text(x.goal)};
 if(x.entityType==='combination')return {what:text(x.goal)||text(x.problem)||'尚未補充組合目標',fit:text(x.rationale)};
 return {what:text(x.goal)||text(x.problem)||'尚未補充流程目標',fit:text(x.solutionStrategy)};
}
function tags(a,max=4){return list(a).slice(0,max).map(t=>'<span class="tag">'+esc(typeof t==='string'?t:t.label||t.id||'')+'</span>').join('')}
function card(x){
 const s=summary(x);
 return '<article class="card"><div class="card-top"><span class="type-label">'+esc(kindLabel(x))+'</span>'+(x.category?'<span class="category-label">'+esc(x.category.replace(/^\d+\s*/,''))+'</span>':'')+'</div>'+
 '<h3><a class="title-link" href="'+esc(routeFor(x.entityType,x.id))+'">'+esc(x.title)+'</a></h3>'+
 '<p class="card-summary">'+esc(short(s.what,180))+'</p>'+ (s.what.length<36&&!s.fit?'<p class="needs-description">用途說明待補充</p>':'')+
 (s.fit&&s.fit!==s.what?'<p class="card-fit"><strong>'+esc(({resource:'適合',skill:'解決問題',concept:'解法',prompt:'目標',combination:'搭配原因',workflow:'執行方式'})[x.entityType]||'補充')+'：</strong>'+esc(short(s.fit,130))+'</p>':'')+
 '<div class="card-footer"><div class="tag-row">'+tags(x.tags,3)+'</div><a class="view-link" href="'+esc(routeFor(x.entityType,x.id))+'">查看詳情 →</a></div></article>';
}
function refsHtml(refs){
 const r=list(refs);
 if(!r.length)return '<p class="muted">尚未建立關聯</p>';
 return '<div class="tag-row">'+r.map(item=>{
  if(!item||!item.type||!item.id||!SINGULAR[item.type])return '<span class="tag">'+esc(item?.label||item?.id||String(item))+'</span>';
  const target=state.byType[item.type]?.get(item.id);
  return target?'<a class="ref-link" href="'+esc(routeFor(item.type,item.id))+'"><span class="ref-type">'+esc(item.type)+'</span>'+esc(target.title)+'</a>':'<span class="tag" title="尚未收錄">'+esc(item.id)+' · 尚未收錄</span>';
 }).join('')+'</div>';
}
function examples(x){
 const rows=list(x.examples).map(e=>{
  if(e&&typeof e==='object'&&e.type&&e.id)return refsHtml([e]);
  const s=typeof e==='string'?e:text(e?.label||e?.title);
  const matched=state.aliases.get(s.toLowerCase());
  if(matched?.size===1)return refsHtml([[...matched.values()][0]]);
  const u=url(s);return u?link(u,s):esc(s);
 }).concat(list(x.exampleRefs).map(r=>refsHtml([r])));
 return rows.length?'<ul class="examples">'+rows.map(r=>'<li>'+r+'</li>').join('')+'</ul>':'<p class="muted">目前尚未補充案例</p>';
}
function section(label,content){return content?'<section class="detail-section"><h3>'+esc(label)+'</h3>'+content+'</section>':''}
function para(s){return text(s)?'<p>'+esc(s)+'</p>':''}
function bullets(a){return list(a).length?'<ul>'+a.map(v=>'<li>'+esc(typeof v==='string'?v:JSON.stringify(v))+'</li>').join('')+'</ul>':''}
function detail(x){
 const s=summary(x);
 let body=section('這是什麼？',para(s.what));
 if(x.entityType==='resource'){
  body+=section('適合什麼情境？',para(x.recommendation));
  body+=section('主要功能',bullets(x.features));
  body+=section('使用條件',bullets(x.requirements));
  body+=section('限制與注意事項',bullets(x.limitations));
  body+=section('相關概念',refsHtml(x.conceptRefs));
  body+=section('相關 Skills',refsHtml(x.skillRefs||x.relatedSkillRefs));
 }else if(x.entityType==='skill'){
  body+=section('解決的問題',para(x.problem));
  body+=section('如何使用',para(x.execution));
  body+=section('輸入',bullets(x.inputs));
  body+=section('輸出',bullets(x.outputs));
  body+=section('相關 Resources',refsHtml(x.resourceRefs));
  body+=section('相關 Concepts',refsHtml(x.conceptRefs));
 }else if(x.entityType==='concept'){
  body+=section('解決方法',bullets(x.solutionMethods));
  body+=section('實際案例與參考項目',examples(x));
  body+=section('取捨',bullets(x.tradeoffs));
  body+=section('反模式',bullets(x.antiPatterns));
 }else if(x.entityType==='prompt'){
  body+=section('使用目標',para(x.goal));
  body+=section('需要準備的資訊',bullets(x.inputs));
  body+=section('預期輸出',para(x.expectedOutput));
  body+=section('完整 Prompt','<div class="prompt-head"><span>可複製的完整提示詞</span><button class="copy-btn" data-copy="'+esc(x.id)+'">複製 Prompt</button></div><pre class="prompt">'+esc(x.prompt||'尚未提供 Prompt 內容')+'</pre>');
  body+=section('使用限制',bullets(x.constraints));
 }else if(x.entityType==='combination'){
  body+=section('搭配原因',para(x.rationale));
  body+=section('組合成員 Members',refsHtml(x.members));
  if(list(x.unresolvedMembers).length)body+=section('尚未建立正式收藏的成員',bullets(x.unresolvedMembers));
  body+=section('適用情境',bullets(x.useCases));
  body+=section('相關 Workflows',refsHtml(x.workflowRefs));
 }else if(x.entityType==='workflow'){
  body+=section('執行策略',para(x.solutionStrategy));
  const stages=list(x.stages);
  body+=section('工作流程',stages.length?'<ol class="steps">'+stages.map(stage=>'<li><strong>'+esc(stage.title||stage.purpose||stage.id)+'</strong>'+para(stage.purpose)+(list(stage.uses).length?'<div class="small-label">使用項目</div>'+refsHtml(stage.uses):'')+(list(stage.outputs).length?'<div class="small-label">輸出</div>'+bullets(stage.outputs):'')+(stage.gate?'<p class="gate">檢查條件：'+esc(stage.gate)+'</p>':'')+'</li>').join('')+'</ol>':'<p class="muted">尚未定義流程步驟</p>');
  body+=section('使用情境',bullets(x.useCases));
  body+=section('相關 Combinations',refsHtml(x.combinationRefs));
 }
 const urls=[{u:x.url||x.githubUrl,label:'開啟官方資源'},{u:x.source?.url,label:'查看原始來源'}].filter(a=>url(a.u));
 const unique=[...new Map(urls.map(a=>[a.u,a])).values()];
 return '<div class="detail"><div class="detail-back"><a href="'+esc(state.returnHash)+'">← 返回探索結果</a></div><article class="detail-panel"><div class="detail-header"><span class="type-label">'+esc(kindLabel(x))+'</span><h2>'+esc(x.title)+'</h2><p>'+esc(short(s.what,320))+'</p><div class="tag-row">'+tags(x.tags,12)+'</div>'+(unique.length?'<div class="external-links">'+unique.map(a=>link(a.u,a.label)).join('')+'</div>':'')+'</div>'+body+'</article></div>';
}
function navTo(hash){if(location.hash===hash){readRoute();render()}else location.hash=hash}
function readRoute(){
 const hash=location.hash||'#/explore';
 const m=hash.match(/^#\/(resources|skills|concepts|prompts|combinations|workflows)\/(.+)$/);
 if(m){let id;try{id=decodeURIComponent(m[2])}catch{id=m[2]}
  state.detail=state.byType[Object.keys(SINGULAR).find(k=>SINGULAR[k]===m[1])]?.get(id)||null;
  if(!state.detail)state.detailMissing=true;else state.detailMissing=false;
  return;
 }
 state.detail=null;state.detailMissing=false;
 const p=hash.match(/^#\/explore(?:\/([a-z]+))?$/);
 if(p&&p[1]&&TOPICS.some(t=>t.id===p[1]))state.topic=p[1];
 else if(hash==='#/explore')state.topic='all';
 const tab=hash.match(/^#\/browse\/(resources|skills|concepts|prompts|combinations|workflows)$/);
 if(tab){state.topic='all';state.type=tab[1]}
}
function topicCards(){
 return '<div class="topic-grid">'+TOPICS.map(t=>{
  const count=state.items.filter(x=>matchTopic(x,t.id)).length;
  return '<button class="topic-card'+(state.topic===t.id?' selected':'')+'" data-topic="'+t.id+'" aria-pressed="'+(state.topic===t.id)+'"><span class="topic-symbol">'+t.icon+'</span><strong>'+t.name+'</strong><span class="topic-desc">'+t.desc+'</span><span class="topic-count">'+count+' 筆相關收藏 →</span></button>';
 }).join('')+'</div>';
}
function render(){
 if(!state.data)return;
 const view=$('#app');
 if(state.detail){$('#discover').hidden=true;$('#filters').hidden=true;$('#result-header').hidden=true;$('#more').hidden=true;view.innerHTML=detail(state.detail);return}
 if(state.detailMissing){$('#discover').hidden=true;$('#filters').hidden=true;$('#result-header').hidden=true;$('#more').hidden=true;view.innerHTML='<p>找不到這筆收藏。<a href="#/explore">返回全部收藏</a></p>';return}
 $('#discover').hidden=false;$('#filters').hidden=false;$('#result-header').hidden=false;
 $('#topics').innerHTML=topicCards();
 $('#all-topic').setAttribute('aria-pressed',String(state.topic==='all'));
 $('#all-topic').classList.toggle('selected',state.topic==='all');
 $('#type-tabs').innerHTML='<button data-type="all" class="'+(state.type==='all'?'active':'')+'">全部類型</button>'+Object.entries(TYPES).map(([k,v])=>'<button data-type="'+k+'" class="'+(state.type===k?'active':'')+'">'+v+'</button>').join('');
 const rows=filtered(),shown=rows.slice(0,state.limit);
 const topicName=TOPICS.find(t=>t.id===state.topic)?.name||'全部收藏';
 $('#result-title').textContent=state.query?'搜尋結果':topicName;
 $('#result-count').textContent='符合條件：'+rows.length+' 筆 · 顯示 '+shown.length+' 筆';
 $('#active-filters').innerHTML=(state.topic!=='all'?'<button data-clear="topic">主題：'+esc(topicName)+' ×</button>':'')+(state.type!=='all'?'<button data-clear="type">類型：'+esc(TYPES[state.type])+' ×</button>':'')+(state.query?'<button data-clear="query">搜尋：'+esc(state.query)+' ×</button>':'');
 view.innerHTML=shown.length?'<div class="cards">'+shown.map(card).join('')+'</div>':'<div class="empty"><h3>沒有找到符合條件的收藏</h3><p>可以試試其他關鍵字，或清除主題與類型篩選。</p><button data-reset>清除全部篩選</button></div>';
 $('#more').hidden=shown.length>=rows.length;
 $('#more').textContent='顯示更多（剩餘 '+Math.max(0,rows.length-shown.length)+' 筆）';
}
function reset(){state.topic='all';state.type='all';state.query='';state.limit=24;$('#q').value='';navTo('#/explore')}
async function copyPrompt(id,button){
 const p=state.byType.prompt?.get(id)?.prompt;if(!p)return;
 try{
  if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(p);
  else{const ta=document.createElement('textarea');ta.value=p;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();if(!ok)throw Error('copy failed')}
  button.textContent='已複製';$('#status').textContent='Prompt 已複製到剪貼簿';
 }catch{$('#status').textContent='無法自動複製，請手動選取文字。'}
}
function wire(){
 $('#topics').addEventListener('click',e=>{const b=e.target.closest('[data-topic]');if(!b)return;state.topic=b.dataset.topic;state.type='all';state.limit=24;navTo('#/explore/'+state.topic)});
 $('#all-topic').addEventListener('click',()=>{state.topic='all';state.type='all';state.limit=24;navTo('#/explore')});
 $('#type-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-type]');if(!b)return;state.type=b.dataset.type;state.limit=24;render()});
 $('#q').addEventListener('input',e=>{state.query=e.target.value;state.limit=24;render()});
 $('#more').addEventListener('click',()=>{state.limit+=24;render()});
 $('#reset').addEventListener('click',reset);
 $('#active-filters').addEventListener('click',e=>{const b=e.target.closest('[data-clear]');if(!b)return;const k=b.dataset.clear;if(k==='topic'){state.topic='all';navTo('#/explore')}else if(k==='type'){state.type='all';render()}else{state.query='';$('#q').value='';render()}});
 $('#app').addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(b)copyPrompt(b.dataset.copy,b);else if(e.target.closest('[data-reset]'))reset();else if(e.target.closest('.title-link,.view-link'))state.returnHash=state.topic==='all'?'#/explore':'#/explore/'+state.topic});
 window.addEventListener('hashchange',()=>{readRoute();render();window.scrollTo({top:0,behavior:'auto'})});
}
async function init(){
 try{
  const res=await fetch('data/catalog-v2.json',{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);
  state.data=await res.json();indexData();wire();readRoute();render();
  $('#collection-count').textContent=state.items.length.toLocaleString('zh-TW')+' 筆收藏';
 }catch(e){console.error('Catalog load failed',e);$('#app').innerHTML='<div class="empty">收藏資料載入失敗，請重新整理頁面。</div>'}
}
init();