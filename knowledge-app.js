'use strict';
/* Source-backed Problem Explorer: no automatic keyword edges, no external libraries. */
const LABEL={problem:'問題',concept:'Concept',resource:'Resource / 工具',skill:'Skill',workflow:'Workflow',prompt:'Prompt',combination:'Combination'};
const ROUTES={resource:'resources',skill:'skills',concept:'concepts',prompt:'prompts',combination:'combinations',workflow:'workflows'};
const REL={explained_by:'解釋原理',supported_by:'適用工具／技能',guided_by:'實作流程／提示詞',combined_in:'相關工具組合',has_subproblem:'延伸問題',declared_reference:'原始資料引用'};
const KG={graph:null,byKey:new Map(),incoming:new Map(),outgoing:new Map(),problems:[],selectedProblem:'video-production',selectedNode:null,filter:''};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=u=>{try{const x=new URL(u);return /^https?:$/.test(x.protocol)?x.href:''}catch{return ''}};
const shorten=(s,n=130)=>{const t=String(s??'').trim().replace(/\s+/g,' ');return t.length>n?t.slice(0,n-1)+'…':t};
const detailUrl=node=>node.type==='problem'?'#/problem/'+encodeURIComponent(node.id):'index.html#/'+ROUTES[node.type]+'/'+encodeURIComponent(node.id);
const typeName=node=>LABEL[node.type]||node.type;
function setData(graph){
 if(graph?.schemaVersion!==1||!Array.isArray(graph.nodes)||!Array.isArray(graph.edges))throw Error('Unsupported knowledge graph');
 KG.graph=graph;KG.byKey=new Map(graph.nodes.map(n=>[n.key,n]));
 KG.problems=graph.nodes.filter(n=>n.type==='problem').sort((a,b)=>a.id==='video-production'?-1:b.id==='video-production'?1:a.title.localeCompare(b.title,'zh-Hant'));
 KG.incoming=new Map();KG.outgoing=new Map();
 for(const edge of graph.edges){
  if(!KG.byKey.has(edge.from)||!KG.byKey.has(edge.to))throw Error('Invalid graph edge');
  if(!KG.outgoing.has(edge.from))KG.outgoing.set(edge.from,[]);
  if(!KG.incoming.has(edge.to))KG.incoming.set(edge.to,[]);
  KG.outgoing.get(edge.from).push(edge);KG.incoming.get(edge.to).push(edge);
 }
}
function currentProblem(){
 const match=location.hash.match(/^#\/problem\/([^?]+)/);
 if(match){let id;try{id=decodeURIComponent(match[1])}catch{id=match[1]}
  if(KG.byKey.has('problem:'+id))return id;
 }
 return 'video-production';
}
function problemList(){
 const search=KG.filter.toLowerCase().trim();
 const visible=KG.problems.filter(p=>[p.title,p.question,p.summary,...(p.tags||[])].join(' ').toLowerCase().includes(search));
 $('#kg-problems').innerHTML=visible.map((p,i)=>'<button type="button" class="kg-problem-option" data-problem="'+esc(p.id)+'" aria-current="'+(p.id===KG.selectedProblem?'page':'false')+'"><span>'+String(i+1).padStart(2,'0')+'</span><span>'+esc(p.title)+'</span></button>').join('')||'<p class="kg-empty">找不到符合的問題。請使用其他關鍵字。</p>';
}
function nodeButton(edge){
 const n=KG.byKey.get(edge.to);
 return '<button type="button" class="kg-graph-node" data-node-key="'+esc(n.key)+'" aria-pressed="'+(KG.selectedNode===n.key)+'" title="'+esc(edge.why||'查看這筆收藏的詳細資訊')+'"><small>'+esc(typeName(n))+' · '+esc(REL[edge.relation]||edge.relation)+'</small><strong>'+esc(shorten(n.title,72))+'</strong></button>';
}
function graphColumn(edges,title){
 return '<div class="kg-graph-group"><h3 class="kg-graph-group-title">'+esc(title)+'</h3>'+(edges.length?edges.map(nodeButton).join(''):'<p class="kg-empty-group">尚未建立這類關聯</p>')+'</div>';
}
function graphView(){
 const problem=KG.byKey.get('problem:'+KG.selectedProblem);
 const links=(KG.outgoing.get(problem.key)||[]).filter(e=>e.kind==='curated');
 const concept=links.filter(e=>KG.byKey.get(e.to)?.type==='concept');
 const others=links.filter(e=>!['concept','problem'].includes(KG.byKey.get(e.to)?.type));
 $('#kg-focus').innerHTML='<span class="kg-kicker">PROBLEM / '+esc(problem.id)+'</span><h2>'+esc(problem.title)+'</h2><p>'+esc(problem.question)+'</p><p class="kg-outcome"><strong>學習目標：</strong>'+esc(problem.outcome||'')+'</p>';
 $('#kg-network').innerHTML='<svg class="kg-lines" id="kg-lines" aria-hidden="true"></svg>'+
 graphColumn(concept,'為什麼？｜CONCEPTS')+
 '<div class="kg-graph-root"><div class="kg-root-node"><small>你想解決的問題</small><h3>'+esc(problem.title)+'</h3><p>'+esc(shorten(problem.summary,130))+'</p></div></div>'+
 graphColumn(others,'怎麼做？｜TOOLS & METHODS');
 const sub=links.filter(e=>e.relation==='has_subproblem');
 $('#kg-subproblems').innerHTML=sub.length?'<h3>依目標繼續探索</h3><div class="kg-subproblem-row">'+sub.map(e=>'<button type="button" class="kg-subproblem" data-problem="'+esc(KG.byKey.get(e.to).id)+'">'+esc(KG.byKey.get(e.to).title)+' ↗</button>').join('')+'</div>':'';
 requestAnimationFrame(drawConnections);
}
function drawConnections(){
 const box=$('#kg-network'),svg=$('#kg-lines'),root=box?.querySelector('.kg-root-node');if(!box||!svg||!root)return;
 const stage=box.getBoundingClientRect(),source=root.getBoundingClientRect();
 if(!stage.width||!stage.height)return;
 svg.replaceChildren();svg.setAttribute('viewBox','0 0 '+stage.width+' '+stage.height);
 for(const el of box.querySelectorAll('[data-node-key]')){
  const rect=el.getBoundingClientRect(),left=rect.left<source.left;
  const x1=(left?source.left:source.right)-stage.left,y1=source.top+source.height/2-stage.top;
  const x2=(left?rect.right:rect.left)-stage.left,y2=rect.top+rect.height/2-stage.top;
  const bend=(x1+x2)/2,edge=KG.outgoing.get('problem:'+KG.selectedProblem)?.find(e=>e.to===el.dataset.nodeKey);
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d','M '+x1+' '+y1+' C '+bend+' '+y1+', '+bend+' '+y2+', '+x2+' '+y2);
  path.setAttribute('stroke',edge?.relation==='explained_by'?'#53758a':'#667c47');path.setAttribute('stroke-width','1.5');path.setAttribute('stroke-opacity','.72');path.setAttribute('fill','none');
  svg.appendChild(path);
 }
}
function neighbor(edge,dir){
 const other=KG.byKey.get(dir==='in'?edge.from:edge.to);
 return '<button type="button" data-inspect-key="'+esc(other.key)+'" class="kg-neighbor">'+esc(shorten(other.title,90))+'<small>'+esc(typeName(other))+' · '+esc(edge.kind==='curated'?(REL[edge.relation]||edge.relation):'已建立資料引用')+'</small></button>';
}
function relationList(key,dir,title){
 const all=dir==='in'?(KG.incoming.get(key)||[]):(KG.outgoing.get(key)||[]);
 const selected=all.slice().sort((a,b)=>(a.kind==='curated'?-1:0)-(b.kind==='curated'?-1:0)).slice(0,8);
 return '<div><h3>'+esc(title)+' · '+all.length+'</h3><div class="kg-neighbor-list">'+(selected.length?selected.map(e=>neighbor(e,dir)).join(''):'<p class="kg-empty">尚未建立直接關聯</p>')+(all.length>selected.length?'<span class="kg-more-count">另有 '+(all.length-selected.length)+' 條引用，請開啟資料詳情查看。</span>':'')+'</div></div>';
}
function inspect(){
 const section=$('#kg-inspector');
 if(!KG.selectedNode){section.innerHTML='<span class="kg-kicker">EXPLORE THE GRAPH</span><h2>選擇任一個節點</h2><p>點選上方的 Concept、Resource、Skill、Workflow、Prompt 或 Combination，查看它為什麼與問題有關，以及有哪些資料引用這個節點。</p>';return;}
 const node=KG.byKey.get(KG.selectedNode);if(!node){KG.selectedNode=null;inspect();return;}
 const edge=(KG.outgoing.get('problem:'+KG.selectedProblem)||[]).find(e=>e.to===node.key&&e.kind==='curated');
 const official=safeUrl(node.url),actions=node.type==='problem'?'':('<a class="kg-link" href="'+esc(detailUrl(node))+'">查看完整收藏詳情</a>');
 section.innerHTML='<span class="kg-kicker">'+esc(typeName(node))+' / NODE DETAIL</span><h2>'+esc(node.title)+'</h2><p>'+esc(node.summary||'目前尚未整理詳細內容。')+'</p>'+
 (edge?.why?'<p class="kg-reason"><strong>為什麼與此問題有關？</strong> '+esc(edge.why)+'</p>':'')+
 '<div class="kg-node-actions">'+actions+(official?'<a class="kg-link" href="'+esc(official)+'" target="_blank" rel="noopener noreferrer">原始來源</a>':'')+'</div>'+
 '<div class="kg-related">'+relationList(node.key,'in','有哪些項目指向它')+relationList(node.key,'out','它引用了哪些項目')+'</div>'+
 '<p style="margin-top:14px">「原始資料引用」僅代表收錄資料存在關聯，不代表已實測、可替代或能解決全部問題。</p>';
}
function render(){
 if(!KG.graph)return;
 KG.selectedProblem=currentProblem();
 if(KG.selectedNode&&!KG.byKey.has(KG.selectedNode))KG.selectedNode=null;
 problemList();graphView();inspect();
}
function chooseProblem(id){
 if(!KG.byKey.has('problem:'+id))return;
 KG.selectedNode=null;
 const hash='#/problem/'+encodeURIComponent(id);
 if(location.hash===hash){render();scrollTo({top:0,behavior:'auto'})}
 else location.hash=hash;
}
function bind(){
 $('#kg-search').addEventListener('input',e=>{KG.filter=e.target.value;problemList()});
 $('#kg-problems').addEventListener('click',e=>{const el=e.target.closest('[data-problem]');if(el)chooseProblem(el.dataset.problem)});
 $('#kg-subproblems').addEventListener('click',e=>{const el=e.target.closest('[data-problem]');if(el)chooseProblem(el.dataset.problem)});
 $('#kg-network').addEventListener('click',e=>{const el=e.target.closest('[data-node-key]');if(el){KG.selectedNode=el.dataset.nodeKey;graphView();inspect()}});
 $('#kg-inspector').addEventListener('click',e=>{const el=e.target.closest('[data-inspect-key]');if(!el)return;const n=KG.byKey.get(el.dataset.inspectKey);if(!n)return;if(n.type==='problem')chooseProblem(n.id);else{KG.selectedNode=n.key;graphView();inspect()}});
 window.addEventListener('hashchange',()=>{KG.selectedNode=null;render()});
 window.addEventListener('resize',()=>requestAnimationFrame(drawConnections));
}
async function init(){
 try{
  const response=await fetch('data/knowledge-graph-v1.json',{cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);
  const data=await response.json();setData(data);bind();render();
  $('#kg-count').textContent=data.counts.problems+' 個問題 · '+(data.counts.nodes-data.counts.problems)+' 筆現有知識 · '+(data.counts.canonicalEdges+data.counts.curatedEdges)+' 條關聯';
 }catch(error){console.error('Knowledge Graph failed to load',error);$('#kg-focus').innerHTML='<div class="kg-error">知識圖譜載入失敗。請檢查資料檔與 GitHub Pages 部署狀態。</div>'}
}
init();