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
const state={topic:'all',type:'all',query:'',limit:24,detail:null,returnHash:'#/explore',data:null,items:[],byType:{},aliases:new Map(),focusResultsOnRoute:false};
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
  const technicalTraining=/machine.learning|deep.learning|reinforcement.learning|federated.learning|active.learning|model.training|training.model/i;
  const teachingEvidence=/學習資源|教學|教材|課程|教案|教練|練習|培訓|教育|入門|tutorial|course|curriculum|education|teaching|study.guide|study.plan|learn.by|interview.practice|oncall.training|knowledge.transfer|flashcard/i;
  if(technicalTraining.test(fields)&&!teachingEvidence.test(fields))return false;
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
 }).join('');
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
/* Optional, source-cited study guide; original canonical metadata remains visible below. */
/* A complete, readable lesson lives on this page. Upstream links are optional citations only. */
function learningGuideHtml(g,hideOverview=false){
 if(!g||!list(g.outcomes).length||!list(g.modules).length)return '';
 const sourceLink=(href,label)=>url(href)?'<a href="'+esc(url(href))+'" target="_blank" rel="noopener noreferrer">'+esc(label)+'</a>':'';
 const outcomes=list(g.outcomes).map((o,i)=>
  '<article class="learn-outcome"><span class="learn-number">'+String(i+1).padStart(2,'0')+'</span><div><h4>'+esc(o.title)+'</h4><p>'+esc(o.detail)+'</p><div class="learn-check"><strong>學會的標準</strong><span>'+esc(o.check)+'</span></div></div></article>'
 ).join('');
 const path=list(g.readingPath).map((p,i)=>
  '<li><span class="learn-number">'+String(i+1).padStart(2,'0')+'</span><div><strong>'+esc(p.title)+'</strong><p>'+esc(p.why)+'</p></div></li>'
 ).join('');
 const guides=list(g.modules).slice().sort((a,b)=>(a.group==='先學'?0:1)-(b.group==='先學'?0:1));
 const modules=guides.map((m,i)=>{
  const points=list(m.essentials);
  const checks=list(m.decisionChecks);
  // Keep each Agent self-check beside its corresponding principle instead of repeating a second box.
  const lessonItems=points.map((point,i)=>'<li>'+esc(point)+(checks[i]?'<p class="learn-principle-check">檢查：'+esc(checks[i])+'</p>':'')+'</li>');
  if(checks.length>points.length)lessonItems.push(...checks.slice(points.length).map(check=>'<li class="learn-principle-check">檢查：'+esc(check)+'</li>'));
  const lessons=lessonItems.length?'<ol class="learn-essentials">'+lessonItems.join('')+'</ol>':'<p>'+esc(m.learn)+'</p>';
  const decisionTable=list(m.decisionTable).length?'<div class="learn-decision"><h5>'+esc(m.decisionTitle||'先依需求選方案')+'</h5><div class="learn-decision-scroll"><table><thead><tr><th scope="col">'+esc(m.decisionHeaders?.need||'需求特性')+'</th><th scope="col">'+esc(m.decisionHeaders?.start||'優先選擇')+'</th></tr></thead><tbody>'+list(m.decisionTable).map(row=>'<tr><td>'+esc(row.need)+'</td><td>'+esc(row.start)+'</td></tr>').join('')+'</tbody></table></div></div>':'';
  return '<article class="learn-module learn-module-inline"><header class="learn-module-heading"><span class="learn-module-meta">'+esc(m.group||'補充學習')+' · '+String(i+1).padStart(2,'0')+'</span><h4>'+esc(m.title)+'</h4><p class="learn-module-question">'+esc(m.question)+'</p></header>'+
   '<div class="learn-module-body"><div class="learn-decision-slot">'+decisionTable+'</div><div class="learn-principles"><h5>三個判斷原則</h5>'+lessons+'</div>'+
   '<div class="learn-example"><strong>情境例子</strong><p>'+esc(m.example)+'</p></div>'+
   (m.apply?'<div class="learn-apply"><strong>自己試試看</strong><p>'+esc(m.apply)+'</p></div>':'<div class="learn-apply-placeholder" aria-hidden="true"></div>')+
   '<div class="learn-deliverable"><strong>學完能產出</strong><span>'+esc(m.output)+'</span></div></div></article>';
 }).join('');
 const practice=g.practice;
 const practiceHtml=practice?'<section class="learn-practice"><h3>'+esc(practice.title)+'</h3><p>'+esc(practice.scenario)+'</p><ol>'+list(practice.tasks).map(t=>
  '<li><strong>'+esc(t.action)+'</strong><p>'+esc(t.deliverable)+'</p></li>'
 ).join('')+'</ol><p class="learn-acceptance"><strong>自我驗收：</strong>'+esc(practice.check)+'</p></section>':'';
 const sources='<details class="learn-reference"><summary>原始資料與版本（選讀／查核用）</summary><p>上述重點已整理在本頁，不需跳轉才能學習；需要完整規格時可逐一查看不同來源章節。</p><ol>'+
  guides.map(m=>'<li>'+sourceLink(m.sourceUrl,m.title)+'</li>').join('')+'</ol></details>';
 return '<div class="learning-guide" id="learning-guide">'+
  (hideOverview?'':'<section class="learn-section"><h3>學完能掌握什麼？</h3><div class="learn-outcomes">'+outcomes+'</div></section>')+
  (!hideOverview&&path?'<section class="learn-section"><h3>先看哪裡？</h3><ol class="learn-path">'+path+'</ol></section>':'')+
  '<section class="learn-section" id="learn-chapters"><h3>十個主題的重點筆記</h3><p class="learn-helper">每章直接列出核心知識、情境例子與小練習，不需展開或另開網頁。可以優先讀標示「先學」的主題。</p><div class="learn-modules">'+modules+'</div></section>'+
  practiceHtml+sources+'<p class="learn-caveat">'+esc(g.caveat||'')+'</p></div>';
}
/* Pure source-code repository page. All content comes from the optional canonical repoGuide field. */
function repoGuideHtml(x){
 const g=x.repoGuide;
 if(!g||!list(g.features).length)return '';
 const revision=text(x.source?.upstreamCommit);
 const repoName=text(x.repo);
 const readable=(value)=>{
  const parts=(text(value).match(/[^。；;]+[。；;]?/g)||[]).map(t=>t.trim()).filter(Boolean);
  return '<div class="repo-readable">'+parts.map(t=>'<p>'+esc(t)+'</p>').join('')+'</div>';
 };
 const repoList=(items)=>list(items).length?'<ul class="repo-plain-list">'+list(items).map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':'';
 const meta=list(g.facts).map(p=>'<div class="repo-fact"><dt>'+esc(p.label)+'</dt><dd>'+esc(p.value)+'</dd></div>').join('');
 const states=list(g.status).map(p=>'<div class="repo-state"><strong>'+esc(p.label)+'</strong><span>'+esc(p.value)+'</span></div>').join('');
 const shots=list(g.screenshots).map(p=>'<figure class="repo-shot"><img loading="lazy" decoding="async" src="'+esc('https://raw.githubusercontent.com/'+repoName+'/'+revision+'/'+p.path)+'" alt="'+esc(p.label)+'"><figcaption>'+esc(p.label)+'</figcaption></figure>').join('');
 const features=list(g.features).map((p,i)=>'<article class="repo-feature"><span class="repo-ordinal">'+String(i+1).padStart(2,'0')+'</span><h4>'+esc(p.title)+'</h4><p>'+esc(p.detail)+'</p></article>').join('');
 const flow=list(g.architecture?.nodes).map((p,i)=>'<li class="repo-flow-node"><div class="repo-flow-index">'+String(i+1).padStart(2,'0')+'</div><div><h4>'+esc(p.readerTitle||p.title)+'</h4>'+readable(p.readerText||p.detail)+(p.technicalNote?'<p class="repo-tech-note">'+esc(p.technicalNote)+'</p>':'')+'</div></li>').join('');
 const rules=list(g.implementationRules).map(p=>'<article class="repo-rule"><h4>'+esc(p.readerTitle||p.name)+'</h4>'+readable(p.readerText||p.rule)+(p.readerNote?'<p class="repo-rule-note">'+esc(p.readerNote)+'</p>':'')+'</article>').join('');
 const uses=list(g.usage).map((p,i)=>{
  const groups=list(p.commandGroups).length?p.commandGroups:(list(p.commands).length?[{label:'操作指令',commands:p.commands}]:[]);
  const commands=groups.map(group=>'<div class="repo-command-group"><strong>'+esc(group.label)+'</strong><pre class="repo-commands"><code>'+esc(list(group.commands).join('\n'))+'</code></pre></div>').join('');
  return '<article class="repo-option"><div class="repo-option-heading"><span class="repo-ordinal">'+String(i+1).padStart(2,'0')+'</span><h4>'+esc(p.readerTitle||p.title)+'</h4></div><div class="repo-option-copy">'+readable(p.readerText||p.description)+(p.approval?'<p class="repo-approval">'+esc(p.approvalNote||'安裝或移除前，必須先確認影響並取得同意。')+'</p>':'')+'</div><div class="repo-option-commands">'+commands+'</div></article>';
 }).join('');
 const extension=list(g.extension).map((p,i)=>'<li><span class="repo-step-num">'+String(i+1).padStart(2,'0')+'</span><div><h4>'+esc(p.readerTitle||p.title)+'</h4>'+readable(p.readerText||p.detail)+(p.technicalNote?'<p class="repo-tech-note">'+esc(p.technicalNote)+'</p>':'')+'</div></li>').join('');
 const caps=list(g.capabilities).map(c=>'<article class="repo-capability" id="cap-'+esc(c.id)+'"><div class="repo-cap-heading"><span class="repo-ordinal">'+esc(c.id)+'</span><h4>'+esc(c.readerName||c.name)+'</h4></div>'+readable(c.readerProblem||c.problem)+'<dl><div><dt>需要什麼</dt><dd>'+esc(c.readerInput||c.input)+'</dd></div><div><dt>會得到什麼</dt><dd>'+esc(c.readerOutput||c.output)+'</dd></div><div><dt>使用前確認</dt><dd>'+esc(c.readerGate||c.gate)+'</dd></div></dl></article>').join('');
 const steps=list(g.workflow?.steps).map((p,i)=>'<li><span class="repo-step-num">'+String(i+1).padStart(2,'0')+'</span><div><strong>'+esc(list(g.capabilities).find(c=>c.id===p.capability)?.name||p.capability)+'</strong><p>'+esc(p.action)+'</p><a href="#cap-'+esc(p.capability)+'">查看能力契約</a></div></li>').join('');
 const rebuild=list(g.rebuild?.stages).map(p=>'<article class="repo-rebuild-stage"><h4>'+esc(p.readerTitle||p.title)+'</h4>'+readable(p.readerText||p.detail)+'<div><strong>完成後會有</strong><span>'+esc(p.readerDeliverable||p.deliverable)+'</span></div></article>').join('');
 const risks=list(g.risks).map(p=>'<article class="repo-risk"><div class="repo-risk-title"><strong>'+esc(p.title)+'</strong><span>'+esc(p.severity)+'</span></div>'+readable(p.issue)+'<div class="repo-risk-control"><strong>怎麼處理</strong>'+readable(p.control)+'</div></article>').join('');
 const verify=list(g.verification).map(p=>'<tr><th scope="row">'+esc(p.item)+'</th><td>'+esc(p.state)+'</td><td>'+esc(p.evidence)+'</td></tr>').join('');
 return '<div class="repo-guide">'+
  '<section class="repo-lead" aria-label="專案概覽"><div class="repo-lead-content"><div class="repo-kicker">REPO RESOURCE · UNDERSTAND / REBUILD / COMPOSE</div><h3>這個專案能做什麼？</h3><p class="repo-lead-text">'+esc(g.overview)+'</p><dl class="repo-facts">'+meta+'</dl><div class="repo-status">'+states+'</div></div><div class="repo-shots">'+shots+'</div></section>'+
  '<nav class="repo-toc" aria-label="此頁章節"><a href="#repo-features">主要功能</a><a href="#repo-architecture">如何運作</a><a href="#repo-usage">怎麼使用</a><a href="#repo-extension">如何擴充</a><a href="#repo-compose">組合 Workflow</a><a href="#repo-rebuild">重新建立</a><a href="#repo-risk">風險與驗證</a></nav>'+
  '<section class="repo-section" id="repo-features"><div class="repo-section-head"><span>01 · UNDERSTAND</span><h3>主要功能</h3><p>整理專案的實際功能與使用價值。</p></div><div class="repo-feature-grid">'+features+'</div></section>'+
  '<section class="repo-section" id="repo-architecture"><div class="repo-section-head"><span>02 · ARCHITECTURE</span><h3>如何運作？</h3><p>'+esc(g.architecture?.readerSummary||g.architecture?.summary)+'</p></div><ol class="repo-flow">'+flow+'</ol><h4 class="repo-subtitle">這個 App 怎麼決定顯示什麼？</h4><div class="repo-rule-grid">'+rules+'</div></section>'+
  '<section class="repo-section" id="repo-usage"><div class="repo-section-head"><span>03 · USE</span><h3>怎麼使用？</h3><p>可以先閱讀或只編譯程式，確認沒問題後再決定是否安裝。</p></div><div class="repo-option-grid">'+uses+'</div></section>'+
  '<section class="repo-section" id="repo-extension"><div class="repo-section-head"><span>04 · EXTEND</span><h3>能不能擴充？</h3><p>想支援其他 AI 工具，可以參考以下步驟。資料來源與使用權限仍要先確認。</p></div><ol class="repo-step-list">'+extension+'</ol></section>'+
  '<section class="repo-section" id="repo-compose"><div class="repo-section-head"><span>05 · COMPOSE</span><h3>如何用這些知識解決問題、建立 Workflow？</h3><p>可以將這個專案拆成幾個獨立能力，未來依照需求組合成新的流程。</p></div><div class="repo-cap-grid">'+caps+'</div><h4 class="repo-subtitle">'+esc(g.workflow?.title)+'</h4><p class="repo-problem">'+esc(g.workflow?.problem)+'</p><ol class="repo-workflow">'+steps+'</ol><p class="repo-footnote">'+esc(g.workflow?.gate)+'</p></section>'+
  '<section class="repo-section" id="repo-rebuild"><div class="repo-section-head"><span>06 · REBUILD</span><h3>是否能依這些知識重新建立？</h3><p>'+esc(g.rebuild?.verdict)+'</p></div><div class="repo-rebuild-grid">'+rebuild+'</div><h4 class="repo-subtitle">重建前仍缺少的證據</h4>'+repoList(g.rebuild?.gaps)+'</section>'+
  '<section class="repo-section" id="repo-risk"><div class="repo-section-head"><span>07 · SAFETY & VERIFICATION</span><h3>有哪些風險？目前驗證到哪裡？</h3><p>來源閱讀、實際編譯和真實服務測試不能混為一談。</p></div><div class="repo-risk-grid">'+risks+'</div><div class="repo-table-scroll"><table class="repo-verify-table"><thead><tr><th scope="col">檢查項目</th><th scope="col">狀態</th><th scope="col">證據／缺口</th></tr></thead><tbody>'+verify+'</tbody></table></div></section>'+
 '</div>';
}

/* Human-readable skill guide; source/agent execution knowledge stays in canonical data. */
function skillGuideHtml(x){
 const g=x.skillGuide;
 if(!g||!list(g.process).length)return '';
 const readable=s=>'<p>'+esc(s)+'</p>';
 const facts=list(g.facts).map(f=>'<div class="skill-fact"><dt>'+esc(f.label)+'</dt><dd>'+esc(f.value)+'</dd></div>').join('');
 const situations=list(g.situations).map((s,i)=>'<article class="skill-situation"><span class="skill-num">'+String(i+1).padStart(2,'0')+'</span><h4>'+esc(s.title)+'</h4>'+readable(s.description)+'</article>').join('');
 const preparation=list(g.preparation).map((p,i)=>'<article class="skill-prep"><span class="skill-num">'+String(i+1).padStart(2,'0')+'</span><h4>'+esc(p.title)+'</h4>'+readable(p.detail)+'</article>').join('');
 const readers=list(g.reviewers).map(p=>'<article class="skill-reviewer"><h5>'+esc(p.title)+'</h5>'+readable(p.focus)+'</article>').join('');
 const stages=list(g.process).map((s,i)=>'<li class="skill-stage"><span class="skill-step">'+esc(s.number||String(i+1).padStart(2,'0'))+'</span><div class="skill-stage-content"><div class="skill-stage-top"><h4>'+esc(s.title)+'</h4><span>'+esc(s.label)+'</span></div>'+readable(s.detail)+(i===2?'<div class="skill-five-readers"><h5>五個角色各自看什麼？</h5><div class="skill-reviewer-grid">'+readers+'</div></div>':'')+'<div class="skill-stage-result"><strong>這一步得到</strong><span>'+esc(s.result)+'</span></div></div></li>').join('');
 const setup=list(g.howToUse?.setup).map((s,i)=>'<article class="skill-setup"><h4>'+esc(s.title)+'</h4>'+readable(s.description)+(list(s.commands).length?'<pre class="skill-code"><code>'+esc(s.commands.join('\n'))+'</code></pre>':'')+'</article>').join('');
 const outputs=list(g.deliverables).map(o=>'<article class="skill-output"><div class="skill-output-icon">MD</div><div><h4><code>'+esc(o.name)+'</code></h4>'+readable(o.description)+'</div></article>').join('');
 const caps=list(g.composition?.capabilities).map((cap,i)=>'<article class="skill-capability"><div class="skill-cap-head"><span class="skill-num">'+String(i+1).padStart(2,'0')+'</span><h4>'+esc(cap.title)+'</h4></div><dl><div><dt>需要什麼</dt><dd>'+esc(cap.input)+'</dd></div><div><dt>會得到什麼</dt><dd>'+esc(cap.output)+'</dd></div><div><dt>使用前確認</dt><dd>'+esc(cap.gate)+'</dd></div></dl></article>').join('');
 const risks=list(g.safety).map(r=>'<article class="skill-risk"><h4>'+esc(r.title)+'</h4>'+readable(r.risk)+'<div class="skill-risk-action"><strong>建議做法</strong>'+readable(r.action)+'</div></article>').join('');
 const acceptance=list(g.acceptance).map((v,i)=>'<li><span class="skill-num">'+String(i+1).padStart(2,'0')+'</span><span>'+esc(v)+'</span></li>').join('');
 const steps=list(g.composition?.capabilities).map((cap,i)=>'<li><span>'+String(i+1).padStart(2,'0')+'</span><strong>'+esc(cap.title)+'</strong></li>').join('');
 return '<div class="skill-guide">'+
  '<section class="skill-lead" aria-label="Skill 概覽"><div class="skill-kicker">SKILL · WHEN TO USE / HOW IT WORKS / WORKFLOW</div><div class="skill-lead-grid"><div><h3>先找出履歷可能被淘汰的原因，再有根據地修改</h3><p>'+esc(g.overview)+'</p><p class="skill-lead-note">'+esc(g.introNote)+'</p></div><dl class="skill-facts">'+facts+'</dl></div></section>'+
  '<nav class="skill-toc" aria-label="本頁章節"><a href="#skill-fit">適用情境</a><a href="#skill-prepare">事前準備</a><a href="#skill-process">執行流程</a><a href="#skill-use">如何使用</a><a href="#skill-output">會產出什麼</a><a href="#skill-compose">組合 Workflow</a><a href="#skill-risk">風險與驗收</a></nav>'+
  '<section class="skill-section" id="skill-fit"><div class="skill-section-heading"><span>01 · FIT</span><h3>什麼時候適合用？</h3><p>把它當成投履歷前的第二次檢查，而不是求職結果預測器。</p></div><div class="skill-situation-grid">'+situations+'</div></section>'+
  '<section class="skill-section" id="skill-prepare"><div class="skill-section-heading"><span>02 · INPUT</span><h3>開始前要準備什麼？</h3><p>最重要的是履歷和目標職務；缺少證據的成果不能自行填補。</p></div><div class="skill-prep-grid">'+preparation+'</div></section>'+
  '<section class="skill-section" id="skill-process"><div class="skill-section-heading"><span>03 · EXECUTION</span><h3>它會怎麼審查履歷？</h3><p>先做兩輪初步判斷，再由五種角色各自審查，最後整合、改寫並重新檢查。</p></div><ol class="skill-stages">'+stages+'</ol></section>'+
  '<section class="skill-section" id="skill-use"><div class="skill-section-heading"><span>04 · USE</span><h3>如何使用？</h3><p>這是 Claude Code 的 Skill，必須先安裝並啟用，才能使用以下指令。</p></div><div class="skill-command-card"><div><h4>在 Claude Code 內輸入</h4><p>'+esc(g.howToUse?.meaning)+'</p></div><pre class="skill-code"><code>'+esc(g.howToUse?.command||g.howToUse?.trigger)+'</code></pre></div><details class="skill-install-details"><summary>第一次使用：查看安裝方式</summary><div class="skill-setup-grid">'+setup+'</div></details><p class="skill-use-note">'+esc(g.howToUse?.usageNote)+'</p></section>'+
  '<section class="skill-section" id="skill-output"><div class="skill-section-heading"><span>05 · OUTPUT</span><h3>跑完會產出什麼？</h3><p>輸出會保存在執行目錄下的 <code>'+esc(g.savePath)+'</code>，不會直接改寫原始履歷。</p></div><div class="skill-output-grid">'+outputs+'</div></section>'+
  '<section class="skill-section" id="skill-compose"><div class="skill-section-heading"><span>06 · COMPOSE</span><h3>如何把這個 Skill 用在其他 Workflow？</h3><p>不需要複製整套七人審查；也能依問題選擇其中的能力，再搭配其他流程。</p></div><div class="skill-workflow-strip"><ol>'+steps+'</ol></div><div class="skill-capability-grid">'+caps+'</div><p class="skill-caution">'+esc(g.composition?.note)+'</p></section>'+
  '<section class="skill-section" id="skill-risk"><div class="skill-section-heading"><span>07 · SAFETY & QUALITY</span><h3>使用前注意什麼？如何判斷結果有用？</h3><p>重點是保護履歷資料、避免捏造經歷，並檢查修改是否有真實依據。</p></div><div class="skill-risk-grid">'+risks+'</div><h4 class="skill-check-heading">檢查完成品質</h4><ol class="skill-acceptance">'+acceptance+'</ol></section>'+
 '</div>';
}

function detail(x){
 const s=summary(x);
 const isCheatSheetsGuide=x.entityType==='resource'&&x.id==='aiposthub-awesome-opensource-ai-cheat-sheets-guide';
 const isAiUsageBar=x.entityType==='resource'&&x.id==='tip31812-ai-usage-bar'&&Boolean(x.repoGuide);
 const isHiringPanelSkill=x.entityType==='skill'&&x.id==='alexyc9381-hiring-panel'&&Boolean(x.skillGuide);
 // This learning resource introduces scope, features, prerequisites and caveats before the lesson.
 // Other resource detail pages keep their existing rendering order.
 let body='';
 if(!isCheatSheetsGuide&&!isAiUsageBar&&!isHiringPanelSkill){
  body+=x.entityType==='resource'?learningGuideHtml(x.learningGuide,false):'';
  body+=section('這是什麼？',para(s.what));
 }
 if(x.entityType==='resource'){
  if(isAiUsageBar){
   body+=repoGuideHtml(x);
   body+=section('相關概念',refsHtml(x.conceptRefs));
  }else{
  body+=section('適合什麼情境？',para(x.recommendation));
  body+=section('主要功能',bullets(x.features));
  body+=section('使用條件',bullets(x.requirements));
  body+=section('限制與注意事項',bullets(x.limitations));
  if(isCheatSheetsGuide)body+=learningGuideHtml(x.learningGuide,true);
  body+=section('相關概念',refsHtml(x.conceptRefs));
  body+=section('相關 Skills',refsHtml(x.skillRefs||x.relatedSkillRefs));
  if(x.implementationKnowledge){
   const im=x.implementationKnowledge;
   const readiness=im.executionStatus==='NOT_EXECUTED'?'尚未執行／尚未在實際環境驗證':'請檢視來源證據與執行狀態';
   body+=section('實作準備狀態',para(readiness));
   const files=[...list(im.directFiles),...Object.values(im.architecture||{})].filter(v=>typeof v==='string');
   body+=section('可以查閱的原始檔案與架構',bullets(files));
   body+=section('從這份知識開始實作',bullets(im.extensionPath||im.extensionInstructions));
   body+=section('建置與驗收參考',bullets([...list(im.build),...list(im.verification)]));
  }
  }
 }else if(x.entityType==='skill'){
  if(isHiringPanelSkill){
   body+=skillGuideHtml(x);
   body+=section('相關 Resources',refsHtml(x.resourceRefs));
  }else{
  body+=section('解決的問題',para(x.problem));
  body+=section('如何使用',para(x.execution));
  body+=section('輸入',bullets(x.inputs));
  body+=section('輸出',bullets(x.outputs));
  body+=section('相關 Resources',refsHtml(x.resourceRefs));
  body+=section('相關 Concepts',refsHtml(x.conceptRefs));
  }
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
 const urls=[{u:x.url||x.githubUrl,label:'開啟原始收藏'},{u:x.homepage,label:'專案網站／官方 Repo'},{u:x.source?.upstream,label:'上游原始專案'},{u:x.source?.url,label:'查看原始來源'}].filter(a=>url(a.u));
 const unique=[...new Map(urls.map(a=>[a.u,a])).values()];
 return '<div class="detail"><div class="detail-back"><a href="'+esc(state.returnHash)+'">← 返回探索結果</a></div><article class="detail-panel"><div class="detail-header"><span class="type-label">'+esc(kindLabel(x))+'</span><h2>'+esc(x.title)+'</h2>'+(isCheatSheetsGuide||isAiUsageBar||isHiringPanelSkill?'':'<p>'+esc(short(s.what,320))+'</p>')+'<div class="tag-row">'+tags(x.tags,12)+'</div>'+(unique.length?'<div class="external-links">'+unique.map(a=>link(a.u,a.label)).join('')+'</div>':'')+'</div>'+body+'</article></div>';
}
// Equal-count decision tables also share row baselines; dissimilar tables keep natural row heights.
let lessonRowAlignFrame=0;
function alignLessonDecisionRows(){
 const grid=document.querySelector('.learn-modules');if(!grid)return;
 const cards=[...grid.querySelectorAll(':scope > .learn-module-inline')];
 const desktop=window.matchMedia('(min-width:781px)').matches;
 for(let i=0;i<cards.length;i+=2){
  const pair=cards.slice(i,i+2);
  const groups=pair.map(card=>[...card.querySelectorAll('.learn-decision h5, .learn-decision thead tr, .learn-decision tbody tr')]);
  for(const group of groups)for(const el of group)el.style.height='';
  if(!desktop||groups.length!==2||groups[0].length!==groups[1].length||groups[0].length<3)continue;
  const heights=groups[0].map((el,j)=>Math.ceil(Math.max(el.getBoundingClientRect().height,groups[1][j].getBoundingClientRect().height)));
  for(const group of groups)group.forEach((el,j)=>{el.style.height=heights[j]+'px'});
 }
}
function scheduleLessonDecisionRowAlignment(){
 if(lessonRowAlignFrame)cancelAnimationFrame(lessonRowAlignFrame);
 lessonRowAlignFrame=requestAnimationFrame(()=>{lessonRowAlignFrame=0;alignLessonDecisionRows()});
}
function scrollToResults(){
 const header=$('#result-header');
 if(!header||header.hidden)return;
 header.focus({preventScroll:true});
 header.scrollIntoView({block:'start',behavior:'instant'});
}
function scheduleScrollToResults(){
 // Browser hash navigation can restore the previous scroll position after hashchange.
 // Wait until navigation and layout settle, then move to the filtered results.
 requestAnimationFrame(()=>requestAnimationFrame(scrollToResults));
}
function navTo(hash){
 if(location.hash===hash){
  readRoute();render();
  if(state.focusResultsOnRoute){state.focusResultsOnRoute=false;scheduleScrollToResults()}
 }else location.hash=hash;
}
function selectTopic(topic){
 state.topic=topic;
 state.type='all';
 state.limit=24;
 state.focusResultsOnRoute=true;
 navTo(topic==='all'?'#/explore':'#/explore/'+topic);
}
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
 if(hash==='#/browse/all'){
  state.topic='all';state.type='all';state.query='';state.limit=24;
  const q=$('#q');if(q)q.value='';
 }
 const tab=hash.match(/^#\/browse\/(resources|skills|concepts|prompts|combinations|workflows)$/);
 if(tab){state.topic='all';state.type=tab[1]}
}
function topicCards(){
 return TOPICS.map(t=>{
  const count=state.items.filter(x=>matchTopic(x,t.id)).length;
  return '<button class="topic-card'+(state.topic===t.id?' selected':'')+'" data-topic="'+t.id+'" aria-pressed="'+(state.topic===t.id)+'"><span class="topic-symbol">'+t.icon+'</span><strong>'+t.name+'</strong><span class="topic-desc">'+t.desc+'</span><span class="topic-count">'+count+' 筆相關收藏 →</span></button>';
 }).join('');
}
function render(){
 if(!state.data)return;
 const hero=$('.hero');if(hero)hero.hidden=Boolean(state.detail||state.detailMissing);
 const view=$('#app');
 if(state.detail){$('#discover').hidden=true;$('#filters').hidden=true;$('#result-header').hidden=true;$('#more').hidden=true;view.innerHTML=detail(state.detail);scheduleLessonDecisionRowAlignment();return}
 if(state.detailMissing){$('#discover').hidden=true;$('#filters').hidden=true;$('#result-header').hidden=true;$('#more').hidden=true;view.innerHTML='<p>找不到這筆收藏。<a href="#/explore">返回全部收藏</a></p>';return}
 $('#discover').hidden=location.hash==='#/browse/all';$('#filters').hidden=false;$('#result-header').hidden=false;
 $('#topics').innerHTML=topicCards();
 $('#all-topic').setAttribute('aria-pressed',String(state.topic==='all'));
 $('#all-topic').classList.toggle('selected',state.topic==='all');
 $('#type-tabs').innerHTML='<button data-type="all" class="'+(state.type==='all'?'active':'')+'">全部類型</button>'+Object.entries(TYPES).map(([k,v])=>'<button data-type="'+k+'" class="'+(state.type===k?'active':'')+'">'+v+'</button>').join('');
 const rows=filtered(),shown=rows.slice(0,state.limit);
 const topicName=TOPICS.find(t=>t.id===state.topic)?.name||'全部收藏';
 const feedback=$('#topic-selection-feedback');
 feedback.hidden=state.topic==='all';
 feedback.textContent=feedback.hidden?'':'目前主題：'+topicName+' · '+rows.length+' 筆符合條件的收藏；下方顯示篩選結果。';
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
 $('#topics').addEventListener('click',e=>{const b=e.target.closest('[data-topic]');if(b)selectTopic(b.dataset.topic)});
 $('#all-topic').addEventListener('click',()=>selectTopic('all'));
 $('#type-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-type]');if(!b)return;state.type=b.dataset.type;state.limit=24;render()});
 $('#q').addEventListener('input',e=>{state.query=e.target.value;state.limit=24;render()});
 $('#more').addEventListener('click',()=>{state.limit+=24;render()});
 $('#reset').addEventListener('click',reset);
 $('#active-filters').addEventListener('click',e=>{const b=e.target.closest('[data-clear]');if(!b)return;const k=b.dataset.clear;if(k==='topic'){state.topic='all';navTo('#/explore')}else if(k==='type'){state.type='all';render()}else{state.query='';$('#q').value='';render()}});
 $('#app').addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(b)copyPrompt(b.dataset.copy,b);else if(e.target.closest('[data-reset]'))reset();else if(e.target.closest('.title-link,.view-link'))state.returnHash=location.hash==='#/browse/all'?'#/browse/all':state.topic==='all'?'#/explore':'#/explore/'+state.topic});
 window.addEventListener('resize',scheduleLessonDecisionRowAlignment);
 if(document.fonts?.ready)document.fonts.ready.then(scheduleLessonDecisionRowAlignment);
 window.addEventListener('hashchange',()=>{
  readRoute();render();
  if(state.focusResultsOnRoute){state.focusResultsOnRoute=false;scheduleScrollToResults()}
  else window.scrollTo({top:0,behavior:'auto'});
 });
}
async function init(){
 try{
  const res=await fetch('data/catalog-v2.json',{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);
  state.data=await res.json();indexData();wire();readRoute();render();
  const countBadge=$('#collection-count');if(countBadge)countBadge.textContent=state.items.length.toLocaleString('zh-TW')+' 筆收藏';
 }catch(e){console.error('Catalog load failed',e);$('#app').innerHTML='<div class="empty">收藏資料載入失敗，請重新整理頁面。</div>'}
}
init();