'use strict';
/* Cross-domain knowledge discovery. Text search never invents graph edges. */
const LABEL={problem:'Problem',concept:'Concept',resource:'Resource',skill:'Skill',workflow:'Workflow',prompt:'Prompt',combination:'Combination'};
const ROUTES={resource:'resources',skill:'skills',concept:'concepts',prompt:'prompts',combination:'combinations',workflow:'workflows'};
const REL={explained_by:'相關原理',supported_by:'適用工具／技能',guided_by:'相關流程／提示詞',combined_in:'工具組合',has_subproblem:'延伸問題',declared_reference:'原有資料引用'};
const KG={graph:null,byKey:new Map(),incoming:new Map(),outgoing:new Map(),problems:[],query:'',type:'all',limit:24,focusKey:null,selectedNode:null,scrollOnChange:false,catalog:null,recordIndex:new Map(),recipe:null,builder:null,builderSeed:null};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=u=>{try{const x=new URL(u);return /^https?:$/.test(x.protocol)?x.href:''}catch{return ''}};
const shorten=(s,n=130)=>{const t=String(s??'').trim().replace(/\s+/g,' ');return t.length>n?t.slice(0,n-1)+'…':t};
const nodeKey=(type,id)=>type+':'+id;
const typeName=node=>LABEL[node.type]||node.type;
const detailUrl=node=>node.type==='problem'?'#/problem/'+encodeURIComponent(node.id):'index.html#/'+ROUTES[node.type]+'/'+encodeURIComponent(node.id);
function setData(graph){
 if(graph?.schemaVersion!==1||!Array.isArray(graph.nodes)||!Array.isArray(graph.edges))throw Error('Unsupported knowledge graph');
 KG.graph=graph;KG.byKey=new Map(graph.nodes.map(n=>[n.key,n]));
 KG.problems=graph.nodes.filter(n=>n.type==='problem').sort((a,b)=>a.title.localeCompare(b.title,'zh-Hant'));
 KG.incoming=new Map();KG.outgoing=new Map();
 for(const edge of graph.edges){
  if(!KG.byKey.has(edge.from)||!KG.byKey.has(edge.to))throw Error('Invalid graph edge: '+edge.from+' → '+edge.to);
  if(!KG.outgoing.has(edge.from))KG.outgoing.set(edge.from,[]);
  if(!KG.incoming.has(edge.to))KG.incoming.set(edge.to,[]);
  KG.outgoing.get(edge.from).push(edge);KG.incoming.get(edge.to).push(edge);
 }
}
function routeKey(){
 const m=location.hash.match(/^#\/(problem|node)\/(.+)$/);
 if(!m)return null;
 try{
  const parts=m[2].split('/').map(decodeURIComponent);
  const key=m[1]==='problem'?'problem:'+parts[0]:(parts.length===2?nodeKey(parts[0],parts[1]):'');
  return KG.byKey.has(key)?key:null;
 }catch{return null}
}
const stop=new Set(['我','想','要','想要','我想','我想要','請問','如何','怎麼','怎樣','什麼','哪些','有沒有','是否','可以','學習','學','想學','找到','想找','幫我','推薦','相關','工具','有什麼','請','了解','知道','的']);
function tokens(query){
 const q=String(query||'').toLowerCase().trim().replace(/[？?！!，,。、：:；;（）()]/g,' ');
 const chunks=q.split(/\s+/).filter(Boolean);
 const result=[];
 for(const chunk of chunks){
  if(/[\u3400-\u9fff]/.test(chunk)&&typeof Intl.Segmenter==='function'){
   const parts=[...new Intl.Segmenter('zh-Hant',{granularity:'word'}).segment(chunk)]
    .filter(s=>s.isWordLike).map(s=>s.segment).filter(Boolean);
   result.push(...parts.filter(s=>s.length>=2&&!stop.has(s)));
  }else if(chunk.length>=2&&!stop.has(chunk))result.push(chunk);
 }
 return [...new Set(result.length?result:chunks.filter(s=>s.length>=2&&!stop.has(s)))];
}
function score(node,terms,full){
 const title=(node.title||'').toLowerCase(),tags=(node.tags||[]).join(' ').toLowerCase();
 const desc=(node.summary||'').toLowerCase(),hay=(node.searchText||[node.title,node.summary].join(' ')).toLowerCase();
 let s=full&&title.includes(full)?55:0;
 for(const term of terms){
  if(title.includes(term))s+=28;
  if(tags.includes(term))s+=14;
  if(desc.includes(term))s+=8;
  if(hay.includes(term))s+=3;
 }
 if(terms.length&&terms.every(t=>hay.includes(t)))s+=16;
 if(node.type==='problem'&&s>0)s+=5; // prioritize reviewed examples only when the query fits
 return s;
}
function found(){
 const all=KG.graph.nodes.filter(n=>KG.type==='all'||n.type===KG.type);
 const query=KG.query.trim().toLowerCase(),terms=tokens(query);
 if(query&&terms.length){
  return all.map(node=>({node,rank:score(node,terms,query)})).filter(x=>x.rank>0)
   .sort((a,b)=>b.rank-a.rank||a.node.title.localeCompare(b.node.title,'zh-Hant')).map(x=>x.node);
 }
 if(KG.type!=='all')return all.sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))||a.title.localeCompare(b.title,'zh-Hant'));
 const groups=['concept','resource','skill','workflow','prompt','combination','problem'];
 return groups.flatMap(type=>all.filter(n=>n.type===type)
    .sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))||a.title.localeCompare(b.title,'zh-Hant')).slice(0,3));
}
function renderFilters(){
 const totals=new Map();
 for(const node of KG.graph.nodes)totals.set(node.type,(totals.get(node.type)||0)+1);
 const arr=[['all','全部',KG.graph.nodes.length],...Object.entries(LABEL).map(([type,name])=>[type,name,totals.get(type)||0])];
 $('#kg-type-filters').innerHTML=arr.map(([type,name,count])=>
  '<button type="button" data-filter-type="'+esc(type)+'" aria-pressed="'+(KG.type===type)+'">'+esc(name)+' <small>'+count+'</small></button>').join('');
}
function renderExamples(){
 $('#kg-problems').innerHTML=KG.problems.map((p,i)=>
  '<button type="button" class="kg-problem-option" data-problem="'+esc(p.id)+'"><span>'+String(i+1).padStart(2,'0')+'</span><span>'+esc(p.title)+'</span></button>').join('')||'<p class="kg-empty">尚未建立經審查的問題範例。</p>';
}
function resultCard(node){
 const around=(KG.incoming.get(node.key)?.length||0)+(KG.outgoing.get(node.key)?.length||0);
 return '<button type="button" class="kg-result-card" data-open-node="'+esc(node.key)+'"><span class="kg-result-type">'+esc(typeName(node))+' · '+around+' 條資料引用</span><strong>'+esc(node.title)+'</strong><span class="kg-result-description">'+esc(shorten(node.summary||'尚未補充摘要',155))+'</span><span class="kg-result-explore">探索關聯 →</span></button>';
}
function renderExplore(){
 renderFilters();
 const rows=found(),display=rows.slice(0,KG.limit),query=KG.query.trim(),all=!query&&KG.type==='all';
 $('#kg-results-title').textContent=query?'搜尋結果':all?'跨領域知識預覽':LABEL[KG.type]||'探索知識';
 $('#kg-result-count').textContent=query?'找到 '+rows.length+' 筆文字相符的資料':all?'各資料類型的近期收藏，輸入需求可搜尋全部 '+KG.graph.nodes.length+' 筆':'共 '+rows.length+' 筆資料';
 $('#kg-results').innerHTML=display.length?display.map(resultCard).join(''):'<p class="kg-empty kg-no-results">目前沒有符合的內容。可改用其他關鍵字或切換資料類型；這不代表相關工具不存在。</p>';
 $('#kg-loadmore').hidden=display.length>=rows.length;
 $('#kg-loadmore').textContent='顯示更多（剩餘 '+Math.max(0,rows.length-display.length)+' 筆）';
}
function neighborButton(edge,dir){
 const key=dir==='in'?edge.from:edge.to,n=KG.byKey.get(key);
 return '<button type="button" class="kg-graph-node" data-node-key="'+esc(key)+'" aria-pressed="'+(KG.selectedNode===key)+'"><small>'+esc(typeName(n))+' · '+esc(edge.kind==='curated'?(REL[edge.relation]||edge.relation):'原始引用')+'</small><strong>'+esc(shorten(n.title,75))+'</strong></button>';
}
function graphColumn(edges,dir,title){
 const show=edges.slice(0,9);
 return '<div class="kg-graph-group"><h3 class="kg-graph-group-title">'+esc(title)+' · '+edges.length+'</h3>'+
 (show.length?show.map(e=>neighborButton(e,dir)).join(''):'<p class="kg-empty-group">尚未建立直接關聯</p>')+
 (edges.length>show.length?'<p class="kg-more-count">其餘 '+(edges.length-show.length)+' 條引用可在下方詳情查看</p>':'')+'</div>';
}
function graphView(){
 const center=KG.byKey.get(KG.focusKey);if(!center)return;
 const incoming=(KG.incoming.get(center.key)||[]).slice(),outgoing=(KG.outgoing.get(center.key)||[]).slice();
 const isProblem=center.type==='problem';
 const left=isProblem?outgoing.filter(e=>KG.byKey.get(e.to)?.type==='concept'):incoming;
 const right=isProblem?outgoing.filter(e=>!['concept','problem'].includes(KG.byKey.get(e.to)?.type)):outgoing;
 $('#kg-focus').innerHTML='<span class="kg-kicker">'+esc(typeName(center))+' / '+esc(center.id)+'</span><h2>'+esc(center.title)+'</h2><p>'+
 esc(isProblem?(center.question||center.summary):(center.summary||'尚未補充這個項目的摘要。'))+'</p>'+
 (isProblem?'<p class="kg-outcome"><strong>探索目標：</strong>'+esc(center.outcome||'')+'</p>':'');
 $('#kg-network').innerHTML='<svg class="kg-lines" id="kg-lines" aria-hidden="true"></svg>'+
 graphColumn(left,isProblem?'out':'in',isProblem?'相關概念':'有哪些項目引用它')+
 '<div class="kg-graph-root"><div class="kg-root-node"><small>'+esc(typeName(center))+'</small><h3>'+esc(center.title)+'</h3><p>'+esc(shorten(center.summary,125))+'</p></div></div>'+
 graphColumn(right,'out',isProblem?'工具、技能與方法':'它引用哪些項目');
 const subs=isProblem?outgoing.filter(e=>e.relation==='has_subproblem'):[];
 $('#kg-subproblems').innerHTML=subs.length?'<h3>相關問題</h3><div class="kg-subproblem-row">'+subs.map(e=>'<button class="kg-subproblem" type="button" data-problem="'+esc(KG.byKey.get(e.to).id)+'">'+esc(KG.byKey.get(e.to).title)+' ↗</button>').join('')+'</div>':'';
 requestAnimationFrame(drawConnections);
}
function drawConnections(){
 const box=$('#kg-network'),svg=$('#kg-lines'),root=box?.querySelector('.kg-root-node');if(!box||!svg||!root||box.closest('[hidden]'))return;
 const stage=box.getBoundingClientRect(),source=root.getBoundingClientRect();if(!stage.width||!stage.height)return;
 svg.replaceChildren();svg.setAttribute('viewBox','0 0 '+stage.width+' '+stage.height);
 for(const el of box.querySelectorAll('[data-node-key]')){
  const rect=el.getBoundingClientRect(),left=rect.left<source.left;
  const x1=(left?source.left:source.right)-stage.left,y1=source.top+source.height/2-stage.top;
  const x2=(left?rect.right:rect.left)-stage.left,y2=rect.top+rect.height/2-stage.top;
  const bend=(x1+x2)/2;
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d','M '+x1+' '+y1+' C '+bend+' '+y1+', '+bend+' '+y2+', '+x2+' '+y2);
  path.setAttribute('stroke',left?'#53758a':'#667c47');path.setAttribute('stroke-width','1.5');path.setAttribute('stroke-opacity','.75');path.setAttribute('fill','none');svg.appendChild(path);
 }
}
function neighborList(key,dir,title){
 const all=dir==='in'?(KG.incoming.get(key)||[]):(KG.outgoing.get(key)||[]);
 const view=all.slice(0,12);
 return '<div><h3>'+esc(title)+' · '+all.length+'</h3><div class="kg-neighbor-list">'+
 (view.length?view.map(e=>{
  const other=KG.byKey.get(dir==='in'?e.from:e.to);
  return '<button type="button" data-inspect-key="'+esc(other.key)+'" class="kg-neighbor">'+esc(shorten(other.title,92))+'<small>'+esc(typeName(other))+' · '+esc(e.kind==='curated'?(REL[e.relation]||e.relation):'原始資料引用')+'</small></button>';
 }).join(''):'<p class="kg-empty">尚未建立直接關聯</p>')+
 (all.length>view.length?'<span class="kg-more-count">其餘 '+(all.length-view.length)+' 條引用尚未展開</span>':'')+'</div></div>';
}
function inspect(){
 const section=$('#kg-inspector'),node=KG.byKey.get(KG.selectedNode||KG.focusKey);
 if(!node){section.innerHTML='';return;}
 const parentEdges=(KG.outgoing.get(KG.focusKey)||[]).concat(KG.incoming.get(KG.focusKey)||[]);
 const edge=parentEdges.find(e=>(e.to===node.key||e.from===node.key)&&e.kind==='curated');
 const official=safeUrl(node.url);
 const actions=node.type==='problem'?'':('<a class="kg-link" href="'+esc(detailUrl(node))+'">查看完整收藏詳情</a>');
 section.innerHTML='<span class="kg-kicker">'+esc(typeName(node))+' / NODE DETAIL</span><h2>'+esc(node.title)+'</h2><p>'+esc(node.summary||'目前尚未補充詳細內容。')+'</p>'+
 (edge?.why?'<p class="kg-reason"><strong>關聯依據：</strong>'+esc(edge.why)+'</p>':'')+
 '<div class="kg-node-actions">'+actions+(official?'<a class="kg-link" href="'+esc(official)+'" target="_blank" rel="noopener noreferrer">官方／原始來源</a>':'')+
 (node.key!==KG.focusKey?'<button type="button" class="kg-link kg-focus-action" data-center-key="'+esc(node.key)+'">以此節點繼續探索</button>':'')+'</div>'+
 '<div class="kg-related">'+neighborList(node.key,'in','哪些節點連到這裡')+neighborList(node.key,'out','此節點連到哪裡')+'</div>'+
 '<p class="kg-disclaimer-bottom">「原始資料引用」僅代表已建立資料關聯，不保證工具功能、最新狀態或相互替代性。</p>';
}

/* Knowledge-first reading experience; never replace original source material with a graph summary. */
function recordFor(node){return node?KG.recordIndex.get(node.key):null}
function renderList(values,limit=30){
 if(!values||!Array.isArray(values)||!values.length)return '';
 const rows=values.slice(0,limit).map(v=>{
  if(typeof v==='string')return '<li>'+esc(v)+'</li>';
  if(v&&typeof v==='object'){
   if(v.type&&v.id&&KG.byKey.has(nodeKey(v.type,v.id))){
    const n=KG.byKey.get(nodeKey(v.type,v.id));
    return '<li><button class="kg-inline-ref" data-read-node="'+esc(n.key)+'">'+esc(n.title)+'</button></li>';
   }
   const summary=v.title||v.name||v.description||v.summary||v.details||v.id;
   return '<li>'+esc(summary||JSON.stringify(v))+'</li>';
  }
  return '<li>'+esc(String(v))+'</li>';
 }).join('');
 return '<ul class="kg-reading-list">'+rows+'</ul>';
}
function readableText(value){
 if(typeof value==='string')return value.trim();
 if(value&&typeof value==='object'&&!Array.isArray(value))return value.summary||value.description||value.details||'';
 return '';
}
function knowledgeSection(title,value){
 if(value===undefined||value===null||value===''||Array.isArray(value)&&!value.length)return '';
 const inner=Array.isArray(value)?renderList(value):'<p>'+esc(readableText(value))+'</p>';
 if(!inner||inner==='<p></p>')return '';
 return '<section class="kg-reading-section"><h3>'+esc(title)+'</h3>'+inner+'</section>';
}
function renderWorkflowStages(record){
 if(!Array.isArray(record.stages)||!record.stages.length)return '';
 return '<section class="kg-reading-section"><h3>Workflow 階段與交付條件</h3><div class="kg-reading-steps">'+record.stages.map((stage,i)=>{
  const uses=renderList(stage.uses||[],8);
  return '<article class="kg-reading-step"><span class="kg-step-number">'+(i+1)+'</span><div><h4>'+esc(stage.title||stage.id)+'</h4>'+
  '<p>'+esc(stage.purpose||'尚未整理這一步的說明')+'</p>'+
  (uses?'<div class="kg-step-uses"><strong>使用的工具／Skill</strong>'+uses+'</div>':'')+
  (stage.outputs?.length?'<div class="kg-step-uses"><strong>預期產物</strong>'+renderList(stage.outputs)+'</div>':'')+
  (stage.gate?'<p class="kg-step-gate"><strong>驗收：</strong>'+esc(stage.gate)+'</p>':'')+'</div></article>';
 }).join('')+'</div></section>';
}
function renderKnowledge(){
 const section=$('#kg-knowledge');if(!section)return;
 const node=KG.byKey.get(KG.selectedNode||KG.focusKey),rec=recordFor(node);
 if(!node)return;
 if(node.type==='problem'){
  section.innerHTML='<div class="kg-panel-heading"><span class="kg-kicker">PROBLEM / LEARNING BRIEF</span><h2 id="kg-knowledge-heading">這個問題該如何開始？</h2></div>'+
  knowledgeSection('要解決的問題',node.question)+knowledgeSection('問題背景',node.summary)+knowledgeSection('期望成果',node.outcome)+
  '<p class="kg-source-note">Problem 關聯是已整理的探索線索；並不代表工具已實測可互相串接。請從上方 Graph 或右側工具選單繼續探索。</p>';
  return;
 }
 if(!rec){
  section.innerHTML='<h2 id="kg-knowledge-heading">知識與實作筆記</h2><p>正式原始資料讀取中；圖譜摘要不是完整知識內容。</p>';
  return;
 }
 let block='<div class="kg-panel-heading"><span class="kg-kicker">'+esc(typeName(node))+' / SOURCE KNOWLEDGE</span>'+
 '<h2 id="kg-knowledge-heading">知識與實作筆記</h2></div>';
 const byType={
  resource:[['主要用途',rec.purpose],['適合什麼情境',rec.recommendation],['核心能力',rec.features],['使用條件',rec.requirements],['使用限制',rec.limitations],['重要備註',rec.notes]],
  skill:[['它解決的問題',rec.problem],['用途',rec.purpose],['輸入／前置條件',rec.inputs],['預期輸出',rec.outputs],['操作方式',rec.execution]],
  concept:[['核心問題',rec.coreProblem],['概念定義',rec.definition],['解決方法',rec.solutionMethods],['取捨與限制',rec.tradeoffs],['適用訊號',rec.signals],['常見反模式',rec.antiPatterns],['已記錄的案例',rec.examples]],
  prompt:[['它解決的問題',rec.problem],['使用目標',rec.goal],['適用情境',rec.whenToUse],['需要提供什麼',rec.inputs],['預期輸出',rec.expectedOutput],['限制',rec.constraints]],
  workflow:[['目標',rec.goal],['主要問題',rec.problem],['流程策略',rec.solutionStrategy],['適用情境',rec.useCases],['備註',rec.notes]],
  combination:[['組合目標',rec.goal],['要解決的問題',rec.problem],['為什麼一起使用',rec.rationale],['適用情境',rec.useCases],['已記錄的替代方式',rec.alternatives]]
 };
 for(const [heading,value] of byType[node.type]||[])block+=knowledgeSection(heading,value);
 if(node.type==='workflow')block+=renderWorkflowStages(rec);
 if(node.type==='combination')block+=knowledgeSection('組合成員（無固定順序）',rec.members);
 if(node.type==='prompt'&&typeof rec.prompt==='string'&&rec.prompt.trim())
  block+='<section class="kg-reading-section"><div class="kg-copy-head"><h3>完整 Prompt（保留收藏原文）</h3><button type="button" class="kg-copy" data-copy-prompt>複製 Prompt</button></div><pre class="kg-prompt-source">'+esc(rec.prompt)+'</pre></section>';
 if(rec.security?.risks?.length)block+=knowledgeSection('安全與資料注意事項',rec.security.risks);
 if(rec.source){
  const original=safeUrl(rec.source.url),link=original?'<a class="kg-inline-source" href="'+esc(original)+'" target="_blank" rel="noopener noreferrer">開啟原始來源</a>':'';
  block+='<section class="kg-reading-section"><h3>來源與可信程度</h3><p>'+esc(rec.source.summary||rec.source.type||'已記錄來源，但未補充摘要')+'</p>'+link+'</section>';
 }
 block+='<p class="kg-source-note">收藏狀態：'+esc(rec.status||'未記錄')+' · 資料更新：'+esc(rec.updatedAt||'未記錄')+'。引用與原始資料不等於工具已安裝或驗證可用。</p>';
 section.innerHTML=block;
}

/* Composition suggestions are discovery only, never unverified "compatible" claims. */
function suggestionCandidates(seedKeys){
 const pool=new Map(),known=new Set(seedKeys);
 for(const seed of seedKeys){
  const center=KG.byKey.get(seed);if(!center)continue;
  const conceptIds=new Set();
  for(const edge of KG.outgoing.get(seed)||[])if(KG.byKey.get(edge.to)?.type==='concept')conceptIds.add(edge.to);
  for(const edge of KG.incoming.get(seed)||[])if(KG.byKey.get(edge.from)?.type==='concept')conceptIds.add(edge.from);
  for(const concept of conceptIds){
   for(const edge of KG.incoming.get(concept)||[]){
    if(edge.from===seed||known.has(edge.from))continue;
    const node=KG.byKey.get(edge.from);
    if(!node||!['resource','skill'].includes(node.type))continue;
    const prev=pool.get(node.key)||{node,weight:0,reason:'共同引用 Concept：'+KG.byKey.get(concept).title};
    prev.weight+=2;pool.set(node.key,prev);
   }
  }
  for(const wf of KG.catalog?.workflows||[]){
   const refs=[...(wf.stages||[]).flatMap(s=>s.uses||[]),...(wf.resourceRefs||[]),...(wf.skillRefs||[])];
   if(!refs.some(ref=>nodeKey(ref.type,ref.id)===seed))continue;
   for(const ref of refs){
    const key=nodeKey(ref.type,ref.id),node=KG.byKey.get(key);
    if(!node||known.has(key)||!['resource','skill'].includes(node.type))continue;
    const prev=pool.get(key)||{node,weight:0,reason:'共同出現在 Workflow：'+wf.title};
    prev.weight+=7;prev.reason='共同出現在 Workflow：'+wf.title;pool.set(key,prev);
   }
  }
 }
 return [...pool.values()].sort((a,b)=>b.weight-a.weight||a.node.title.localeCompare(b.node.title,'zh-Hant')).slice(0,8);
}
function resetComposerFor(node){
 if(!node||KG.builderSeed===node.key)return;
 KG.builderSeed=node.key;
 const preset=KG.recipe?.stages?.find(s=>s.candidates.some(c=>nodeKey(c.type,c.id)===node.key));
 const choices=KG.recipe?WorkflowEngine.defaultChoices(KG.recipe):{};
 if(preset)choices[preset.id]=node.key;
 KG.builder={
  mode:preset?'recipe':'draft',
  choices,
  draftKeys:['resource','skill','prompt'].includes(node.type)?[node.key]:[],
  fromRecordedWorkflow:false
 };
}
function composerIntro(){
 return '<div class="kg-panel-heading"><span class="kg-kicker">DYNAMIC WORKFLOW BUILDER</span><h2>組合你的 Workflow</h2>'+
 '<p>選擇工具、替換步驟、觀察缺少哪些產物。流程是規劃，不會執行第三方工具。</p></div>';
}
function renderRecipeComposer(){
 const recipe=KG.recipe,choices=KG.builder.choices;
 if(!recipe)return '<p class="kg-empty">目前沒有已核對的 Workflow 範本。</p>';
 const plan=WorkflowEngine.compose(recipe,choices);
 const slots=plan.steps.map((step,i)=>{
  const selected=step.candidates.find(c=>nodeKey(c.type,c.id)===step.selection);
  const label={planned:'結構可接續',skipped:'已略過',missing:'缺少必要步驟',blocked:'後續已阻塞'}[step.status];
  return '<article class="kg-work-step" data-stage-id="'+esc(step.id)+'" data-status="'+esc(step.status)+'">'+
   '<div class="kg-work-step-top"><span class="kg-step-index">'+String(i+1).padStart(2,'0')+'</span><strong>'+esc(step.title)+'</strong><span class="kg-step-state">'+esc(label)+'</span></div>'+
   '<p>'+esc(step.purpose)+'</p><label for="kg-step-'+esc(step.id)+'">這一步選擇的工具</label>'+
   '<select id="kg-step-'+esc(step.id)+'" data-select-stage="'+esc(step.id)+'">'+
   '<option value="" '+(step.selection===null?'selected':'')+'>'+(step.optional?'略過此步驟':'不選用（流程將不完整）')+'</option>'+
   step.candidates.map(c=>{
    const node=KG.byKey.get(nodeKey(c.type,c.id));
    const selected=nodeKey(c.type,c.id)===step.selection;
    return '<option value="'+esc(nodeKey(c.type,c.id))+'" '+(selected?'selected':'')+'>'+esc(node?.title||c.id)+'</option>';
   }).join('')+'</select>'+
   (selected?'<p class="kg-choice-reason">'+esc(selected.why)+'</p>':'')+
   (step.missingInputs.length?'<p class="kg-step-warning">缺少前置產物：'+esc(step.missingInputs.join('、'))+'</p>':'')+
   '<div class="kg-contract"><span>需要：'+esc(step.requires.join('、')||'無')+'</span><span>預期產出：'+esc(step.produces.join('、')||'未定義')+'</span></div>'+
   '<small class="kg-gate">驗收條件：'+esc(step.gate||'待定義')+'</small></article>';
 }).join('<div class="kg-work-connector" aria-hidden="true">↓</div>');
 return '<div class="kg-builder-mode"><strong>'+esc(recipe.title)+'</strong><p>'+esc(recipe.description)+'</p>'+
 '<button type="button" data-builder-mode="draft" class="kg-minor-action">改成自由組合草稿</button></div>'+
 '<div class="kg-workflow-stack">'+slots+'</div>'+
 '<div class="kg-plan-result" data-plan-valid="'+plan.structurallyPlanned+'"><strong>'+(plan.structurallyPlanned?'階段需求在規劃上完整':'此流程有缺口，不能視為可執行')+'</strong>'+
 (plan.gaps.length?renderList(plan.gaps):'<p>目前所選階段具備範本定義的前置產物；實際串接格式與執行結果仍未經驗證。</p>')+'</div>'+
 '<p class="kg-builder-disclaimer">'+esc(recipe.disclaimer)+'</p>';
}
function renderDraftComposer(){
 const selected=KG.builder.draftKeys,seed=KG.byKey.get(KG.builderSeed);
 const tools=selected.map((key,i)=>{
  const n=KG.byKey.get(key);if(!n)return '';
  return '<article class="kg-draft-item" data-draft-key="'+esc(key)+'"><span class="kg-step-index">'+String(i+1).padStart(2,'0')+'</span><div><strong>'+esc(n.title)+'</strong><small>'+esc(typeName(n))+' · 尚未確認輸入／輸出相容性</small></div>'+
   '<div class="kg-step-controls">'+(i>0?'<button type="button" data-move-draft="-1" data-draft-index="'+i+'" aria-label="向前移動 '+esc(n.title)+'">↑</button>':'')+
   (i<selected.length-1?'<button type="button" data-move-draft="1" data-draft-index="'+i+'" aria-label="向後移動 '+esc(n.title)+'">↓</button>':'')+
   '<button type="button" data-remove-draft="'+esc(key)+'" aria-label="移除 '+esc(n.title)+'">×</button></div></article>';
 }).join('<div class="kg-work-connector" aria-hidden="true">↓</div>');
 const suggestions=suggestionCandidates(selected.length?selected:[seed?.key].filter(Boolean));
 const suggestionHtml=suggestions.length?suggestions.map(item=>
  '<article class="kg-suggestion"><div><strong>'+esc(item.node.title)+'</strong><small>'+esc(item.reason)+'</small></div>'+
  '<button type="button" data-add-tool="'+esc(item.node.key)+'">加入草稿</button></article>').join(''):
  '<p class="kg-empty">目前沒有可依既有引用找到的候選工具。這不代表其他工具無法搭配。</p>';
 let fromWorkflow='';
 if(seed?.type==='workflow'){
  const raw=recordFor(seed);
  if(raw?.stages?.length)fromWorkflow='<button type="button" class="kg-minor-action" data-import-workflow>以這份已收藏 Workflow 的工具順序建立草稿</button>';
 }
 return '<div class="kg-builder-mode"><strong>自由組合｜'+esc(seed?.title||'尚未選擇')+'</strong>'+
 '<p>從你選的節點開始探索，再把候選工具加入。這些只是與現有資料有關聯的建議，不代表可直接串接。</p>'+fromWorkflow+
 (KG.recipe?'<button type="button" data-builder-mode="recipe" class="kg-minor-action">載入「網站建置」有輸入／輸出條件的範例</button>':'')+'</div>'+
 '<div class="kg-workflow-stack">'+(tools||'<p class="kg-empty">尚未加入工具。選擇下方候選項目開始建立流程草稿。</p>')+'</div>'+
 '<div class="kg-plan-result" data-plan-valid="unknown"><strong>這是未驗證的 Workflow 草稿</strong><p>目前沒有足夠資料證明各工具之間可直接接續；需要補上輸入、輸出及依賴關係後才能判斷是否可行。</p></div>'+
 '<div class="kg-suggestion-heading"><h3>可一起探索的工具</h3><span>來源為相同 Concept 或同一 Workflow</span></div>'+
 '<div class="kg-suggestions-list">'+suggestionHtml+'</div>';
}
function renderComposer(){
 const el=$('#kg-composer');if(!el||!KG.catalog)return;
 const focus=KG.byKey.get(KG.selectedNode||KG.focusKey);
 resetComposerFor(focus);
 el.innerHTML=composerIntro()+(KG.builder.mode==='recipe'?renderRecipeComposer():renderDraftComposer())+
 '<div class="kg-builder-footer"><button type="button" data-copy-plan>複製這份流程規劃</button><button type="button" data-reset-plan>重設</button></div>';
}
function planPlainText(){
 if(KG.builder.mode==='recipe'&&KG.recipe){
  const plan=WorkflowEngine.compose(KG.recipe,KG.builder.choices);
  return [KG.recipe.title,KG.recipe.disclaimer,...plan.steps.map((s,i)=>(i+1)+'. '+s.title+' → '+(KG.byKey.get(s.selection)?.title||'未選')+' ['+s.status+']'+(s.missingInputs.length?' 缺少：'+s.missingInputs.join('、'):'')),...plan.gaps,'注意：工具實際相容性和執行尚未驗證。'].join('\n');
 }
 return ['自由 Workflow 草稿（未驗證相容性）',...KG.builder.draftKeys.map((key,i)=>(i+1)+'. '+(KG.byKey.get(key)?.title||key)),'工具先後順序僅為使用者自行規劃，需確認輸入／輸出契約。'].join('\n');
}
async function copyToClipboard(text,button){
 try{await navigator.clipboard.writeText(text);if(button)button.textContent='已複製';}
 catch(error){console.warn('Clipboard permission unavailable',error);if(button)button.textContent='瀏覽器未授權複製';}
}
function onComposerClick(event){
 const btn=event.target.closest('button');if(!btn||!KG.builder)return;
 if(btn.hasAttribute('data-builder-mode')){
  KG.builder.mode=btn.dataset.builderMode;renderComposer();return;
 }
 if(btn.hasAttribute('data-add-tool')){
  const key=btn.dataset.addTool;
  if(KG.byKey.has(key)&&!KG.builder.draftKeys.includes(key))KG.builder.draftKeys.push(key);
  renderComposer();return;
 }
 if(btn.hasAttribute('data-remove-draft')){
  KG.builder.draftKeys=KG.builder.draftKeys.filter(k=>k!==btn.dataset.removeDraft);renderComposer();return;
 }
 if(btn.hasAttribute('data-move-draft')){
  const idx=Number(btn.dataset.draftIndex),next=idx+Number(btn.dataset.moveDraft);
  const items=KG.builder.draftKeys;
  if(Number.isInteger(idx)&&next>=0&&next<items.length){[items[idx],items[next]]=[items[next],items[idx]];}
  renderComposer();return;
 }
 if(btn.hasAttribute('data-import-workflow')){
  const record=recordFor(KG.byKey.get(KG.builderSeed));
  const keys=(record?.stages||[]).flatMap(s=>s.uses||[]).map(ref=>nodeKey(ref.type,ref.id)).filter(k=>KG.byKey.has(k));
  KG.builder.draftKeys=[...new Set(keys)];renderComposer();return;
 }
 if(btn.hasAttribute('data-reset-plan')){
  KG.builderSeed=null;renderComposer();return;
 }
 if(btn.hasAttribute('data-copy-plan')){copyToClipboard(planPlainText(),btn);return;}
}

function render(){
 if(!KG.graph)return;
 KG.focusKey=routeKey();
 const open=Boolean(KG.focusKey);
 $('#kg-explore').hidden=open;$('#kg-node-view').hidden=!open;
 if(open){
  KG.selectedNode=KG.selectedNode&&KG.byKey.has(KG.selectedNode)?KG.selectedNode:KG.focusKey;
  graphView();inspect();renderKnowledge();renderComposer();
 }else{
  KG.selectedNode=null;renderExplore();
 }
}
function navigateNode(key){
 if(!KG.byKey.has(key))return;
 KG.selectedNode=null;KG.scrollOnChange=true;
 const node=KG.byKey.get(key),hash=node.type==='problem'?'#/problem/'+encodeURIComponent(node.id):'#/node/'+encodeURIComponent(node.type)+'/'+encodeURIComponent(node.id);
 if(location.hash===hash){render();KG.scrollOnChange=false;requestAnimationFrame(bringFocusIntoView)}
 else location.hash=hash;
}
function bringFocusIntoView(){
 const el=$('#kg-focus');if(!el||el.closest('[hidden]'))return;
 el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'auto'});
}
function updateSearch(value){
 KG.query=value;KG.limit=24;$('#kg-search').value=value;
 if(KG.focusKey){location.hash='#/explore'}else renderExplore();
}
function bind(){
 $('#kg-knowledge').addEventListener('click',event=>{
  const ref=event.target.closest('[data-read-node]');
  if(ref){navigateNode(ref.dataset.readNode);return;}
  if(event.target.closest('[data-copy-prompt]')){
   const current=recordFor(KG.byKey.get(KG.selectedNode||KG.focusKey));
   if(current?.prompt)copyToClipboard(current.prompt,event.target.closest('button'));
  }
 });
 $('#kg-composer').addEventListener('click',onComposerClick);
 $('#kg-composer').addEventListener('change',event=>{
  const target=event.target.closest('[data-select-stage]');
  if(!target||!KG.builder||!KG.recipe)return;
  KG.builder.choices[target.dataset.selectStage]=target.value||null;renderComposer();
 });
 $('#kg-search').addEventListener('input',e=>updateSearch(e.target.value));
 $('#kg-type-filters').addEventListener('click',e=>{const x=e.target.closest('[data-filter-type]');if(!x)return;KG.type=x.dataset.filterType;KG.limit=24;if(KG.focusKey)location.hash='#/explore';else renderExplore()});
 $('#kg-suggestions').addEventListener('click',e=>{const x=e.target.closest('[data-suggest]');if(x)updateSearch(x.dataset.suggest)});
 $('#kg-problems').addEventListener('click',e=>{const x=e.target.closest('[data-problem]');if(x)navigateNode('problem:'+x.dataset.problem)});
 $('#kg-subproblems').addEventListener('click',e=>{const x=e.target.closest('[data-problem]');if(x)navigateNode('problem:'+x.dataset.problem)});
 $('#kg-results').addEventListener('click',e=>{const x=e.target.closest('[data-open-node]');if(x)navigateNode(x.dataset.openNode)});
 $('#kg-network').addEventListener('click',e=>{const x=e.target.closest('[data-node-key]');if(x)navigateNode(x.dataset.nodeKey)});
 $('#kg-inspector').addEventListener('click',e=>{
  const center=e.target.closest('[data-center-key]');if(center){navigateNode(center.dataset.centerKey);return;}
  const inspectKey=e.target.closest('[data-inspect-key]');if(!inspectKey)return;
  navigateNode(inspectKey.dataset.inspectKey);
 });
 $('#kg-loadmore').addEventListener('click',()=>{KG.limit+=24;renderExplore()});
 $('#kg-back').addEventListener('click',()=>{KG.scrollOnChange=false;location.hash='#/explore'});
 window.addEventListener('hashchange',()=>{KG.selectedNode=null;render();if(KG.scrollOnChange){KG.scrollOnChange=false;requestAnimationFrame(bringFocusIntoView)}});
 window.addEventListener('resize',()=>requestAnimationFrame(drawConnections));
}
async function init(){
 try{
  const [graphResponse,catalogResponse,recipeResponse]=await Promise.all([
   fetch('data/knowledge-graph-v1.json',{cache:'no-store'}),
   fetch('data/catalog-v2.json',{cache:'no-store'}),
   fetch('data/workflow-recipes/website-build-review.json',{cache:'no-store'})
  ]);
  if(!graphResponse.ok||!catalogResponse.ok)throw Error('Graph or source Catalog unavailable');
  const [data,catalog]=await Promise.all([graphResponse.json(),catalogResponse.json()]);
  setData(data);KG.catalog=catalog;
  KG.recordIndex=WorkflowEngine.indexCatalog(catalog);
  if(recipeResponse.ok){
   const recipe=await recipeResponse.json();
   WorkflowEngine.validateRecipe(recipe,catalog);
   KG.recipe=recipe;
  }
  bind();renderFilters();renderExamples();render();
  $('#kg-count').textContent=(data.counts.nodes-data.counts.problems)+' 筆正式知識 · '+data.counts.problems+' 個示範問題 · '+(data.counts.canonicalEdges+data.counts.curatedEdges)+' 條既有關聯';
 }catch(error){console.error('Knowledge Graph failed to load',error);
  $('#kg-count').textContent='知識圖譜載入失敗';
  $('#kg-results').innerHTML='<div class="kg-error">資料載入失敗，請檢查部署或稍後重新整理。</div>';
 }
}
init();