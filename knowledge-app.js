'use strict';
/* Cross-domain knowledge discovery. Text search never invents graph edges. */
const LABEL={problem:'Problem',concept:'Concept',resource:'Resource',skill:'Skill',workflow:'Workflow',prompt:'Prompt',combination:'Combination'};
const ROUTES={resource:'resources',skill:'skills',concept:'concepts',prompt:'prompts',combination:'combinations',workflow:'workflows'};
const REL={explained_by:'相關原理',supported_by:'適用工具／技能',guided_by:'相關流程／提示詞',combined_in:'工具組合',has_subproblem:'延伸問題',declared_reference:'原有資料引用'};
const KG={graph:null,byKey:new Map(),incoming:new Map(),outgoing:new Map(),problems:[],query:'',type:'all',limit:24,focusKey:null,selectedNode:null,scrollOnChange:false};
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
function render(){
 if(!KG.graph)return;
 KG.focusKey=routeKey();
 const open=Boolean(KG.focusKey);
 $('#kg-explore').hidden=open;$('#kg-node-view').hidden=!open;
 if(open){
  KG.selectedNode=KG.selectedNode&&KG.byKey.has(KG.selectedNode)?KG.selectedNode:KG.focusKey;
  graphView();inspect();
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
 $('#kg-search').addEventListener('input',e=>updateSearch(e.target.value));
 $('#kg-type-filters').addEventListener('click',e=>{const x=e.target.closest('[data-filter-type]');if(!x)return;KG.type=x.dataset.filterType;KG.limit=24;if(KG.focusKey)location.hash='#/explore';else renderExplore()});
 $('#kg-suggestions').addEventListener('click',e=>{const x=e.target.closest('[data-suggest]');if(x)updateSearch(x.dataset.suggest)});
 $('#kg-problems').addEventListener('click',e=>{const x=e.target.closest('[data-problem]');if(x)navigateNode('problem:'+x.dataset.problem)});
 $('#kg-subproblems').addEventListener('click',e=>{const x=e.target.closest('[data-problem]');if(x)navigateNode('problem:'+x.dataset.problem)});
 $('#kg-results').addEventListener('click',e=>{const x=e.target.closest('[data-open-node]');if(x)navigateNode(x.dataset.openNode)});
 $('#kg-network').addEventListener('click',e=>{const x=e.target.closest('[data-node-key]');if(x){KG.selectedNode=x.dataset.nodeKey;graphView();inspect()}});
 $('#kg-inspector').addEventListener('click',e=>{
  const center=e.target.closest('[data-center-key]');if(center){navigateNode(center.dataset.centerKey);return;}
  const inspectKey=e.target.closest('[data-inspect-key]');if(!inspectKey)return;
  const key=inspectKey.dataset.inspectKey;if(KG.byKey.get(key)?.type==='problem')navigateNode(key);
  else{KG.selectedNode=key;graphView();inspect();}
 });
 $('#kg-loadmore').addEventListener('click',()=>{KG.limit+=24;renderExplore()});
 $('#kg-back').addEventListener('click',()=>{KG.scrollOnChange=false;location.hash='#/explore'});
 window.addEventListener('hashchange',()=>{KG.selectedNode=null;render();if(KG.scrollOnChange){KG.scrollOnChange=false;requestAnimationFrame(bringFocusIntoView)}});
 window.addEventListener('resize',()=>requestAnimationFrame(drawConnections));
}
async function init(){
 try{
  const response=await fetch('data/knowledge-graph-v1.json',{cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);
  const data=await response.json();setData(data);bind();renderFilters();renderExamples();render();
  $('#kg-count').textContent=(data.counts.nodes-data.counts.problems)+' 筆正式知識 · '+data.counts.problems+' 個示範問題 · '+(data.counts.canonicalEdges+data.counts.curatedEdges)+' 條既有關聯';
 }catch(error){console.error('Knowledge Graph failed to load',error);
  $('#kg-count').textContent='知識圖譜載入失敗';
  $('#kg-results').innerHTML='<div class="kg-error">資料載入失敗，請檢查部署或稍後重新整理。</div>';
 }
}
init();