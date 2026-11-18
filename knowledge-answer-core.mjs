/* Evidence-backed, intent-aware synthesis over the existing Canonical V2 collection.
 * No remote LLM or claims of live execution. Safe for Node.js tests and static GitHub Pages. */
const KINDS=['resources','skills','concepts','prompts','workflows','combinations'];
const SINGULAR={resources:'resource',skills:'skill',concepts:'concept',prompts:'prompt',workflows:'workflow',combinations:'combination'};
const PLURAL=Object.fromEntries(Object.entries(SINGULAR).map(([k,v])=>[v,k]));
const COMMON=new Set(['ai','i','me','my','the','a','an','and','or','to','of','for','in','on','with','how','what','please','want','learn','about','some','use','using','best','related','project','tools','tool','data','我','想','要','的','是','有','可以','如何','怎麼','請','幫','我想','一下','哪些','什麼','這個','那個','關於','相關','知識','資料','內容','介紹','一些','了解','學習','使用','工具','比較','差異','不同','做','實作','建立','開發','教學','可以嗎','呢','一下子']);
const EXPANSIONS={
 security:['資安','安全','防護','治理','權限','credential','secrets','prompt injection','sandbox','guardrail'],
 資安:['security','安全','防護','權限','隱私'],安全:['security','資安','privacy','security-as-workflow-gate'],
 agent:['agents','agentic','代理','mcp','tool calling'],agents:['agent','agentic','mcp'],代理:['agent','agents','agentic'],
 framework:['frameworks','框架','smolagents','langgraph'],框架:['framework','frameworks','agent framework'],
 github:['repository','repo','git','readme'],git:['github','版本控制','repository'],
 rag:['retrieval','檢索','知識問答'],檢索:['rag','retrieval','search','搜尋'],向量:['embedding','vector','retrieval'],
 automation:['automate','自動化','workflow'],自動化:['automation','workflow','power automate'],
 quota:['usage','額度','用量','usage-bar'],額度:['quota','usage','用量'],用量:['quota','usage','額度'],
 mac:['macos','swift'],macos:['mac','swift','選單列'],swift:['macos','swiftui'],
 smolagents:['agent','framework','code agent'],pydantic:['agent','framework','python'],
 測試:['testing','evals','evidence','驗收'],驗收:['verification','testing','evidence','quality gate'],
 interview:['面試','問答','story'],面試:['interview','resume','recruiter'],
 video:['影片','shorts','剪輯'],影片:['video','短影音','剪輯']
};
const MODE_WORDS={
 compare:/(比較|差異|差別|選哪個|選擇|對比| vs\.? | versus |比較一下|優缺點)/i,
 implement:/(實作|開發|建置|安裝|部署|改寫|客製|修改|build|implement|install|setup|deploy|customiz|做一個|自己做)/i,
 learn:/(學|理解|了解|入門|原理|概念|教我|learning|learn|study|explain|基礎)/i,
 find:/(找|推薦|有哪些|列出|搜尋|search|find|resource|收藏)/i
};
const text=v=>typeof v==='string'?v.trim():'';
const joined=v=>Array.isArray(v)?v.map(x=>typeof x==='string'?x:(x?.title||x?.label||x?.id||'')).join(' '):text(v);
const short=(v,n=450)=>{const t=text(v).replace(/\s+/g,' ');return t.length>n?t.slice(0,n-1).replace(/[，,、；;\s]+$/,'')+'…':t};
const refKey=(type,id)=>type+':'+id;
const makeRef=(r)=>({type:r.type||r.entityType,id:r.id,title:r.title,href:r.type==='problem'?'knowledge.html#/problem/'+encodeURIComponent(r.id):'index.html#/'+PLURAL[r.type||r.entityType]+'/'+encodeURIComponent(r.id),sourceUrl:text(r.url||r.githubUrl||r.homepage||r.source?.url)});
function normalize(s){return String(s??'').normalize('NFKC').toLowerCase().replace(/[＿_]+/g,' ').replace(/\s+/g,' ').trim()}
function lexicalTerms(s){
 const q=normalize(s);
 const raw=q.match(/[a-z][a-z0-9.+/#-]*|[\p{Script=Han}]+/gu)||[];
 const terms=[];
 for(const t of raw){
  if(/^[\p{Script=Han}]+$/u.test(t)){
   if(t.length<=5)terms.push(t);
   if(typeof Intl!=='undefined'&&Intl.Segmenter){
    for(const part of new Intl.Segmenter('zh-Hant',{granularity:'word'}).segment(t))if(part.isWordLike)terms.push(part.segment);
   }
   for(const term of Object.keys(EXPANSIONS))if(/[\p{Script=Han}]/u.test(term)&&t.includes(term))terms.push(term);
  }else terms.push(t);
 }
 return [...new Set(terms.filter(t=>t.length>1&&!COMMON.has(t)))].slice(0,12);
}
export function classifyIntent(query){
 const q=' '+normalize(query)+' ';
 if(MODE_WORDS.compare.test(q))return 'compare';
 if(MODE_WORDS.implement.test(q))return 'implement';
 if(MODE_WORDS.learn.test(q))return 'learn';
 if(MODE_WORDS.find.test(q))return 'find';
 return 'understand';
}
export function indexKnowledge(catalog,problems=[]){
 const out=[];
 for(const plural of KINDS){
  const records=Array.isArray(catalog?.[plural])?catalog[plural]:[];
  for(const r of records)out.push({...r,type:SINGULAR[plural]});
 }
 for(const r of problems||[])if(r?.id&&r?.title)out.push({...r,type:'problem'});
 return out;
}
function fields(record){
 return {
  title:normalize([record.title,record.canonicalName].filter(Boolean).join(' ')),
  slug:normalize(record.id.replace(/[-_]/g,' ')),
  tags:normalize(joined(record.tags)),
  main:normalize([record.coreProblem,record.purpose,record.problem,record.goal,record.question,record.description,record.definition,record.recommendation].filter(Boolean).join(' ')),
  details:normalize([
   joined(record.features),joined(record.solutionMethods),joined(record.requirements),joined(record.limitations),
   joined(record.useCases),joined(record.inputs),joined(record.outputs),
   (record.stages||[]).map(s=>[s.title,s.purpose].join(' ')).join(' '),
   record.learning?.takeaway,(record.learning?.principles||[]).map(p=>p.title).join(' '),
   record.implementationKnowledge?.projectType,record.implementationKnowledge?.language,
   record.resourceType,record.category
  ].filter(Boolean).join(' '))
 };
}
function distinct(a){return [...new Set(a)]}
function scorer(record,terms,phrase,intent){
 const f=fields(record),q=normalize(phrase);
 let score=0,matched=0;
 // No match means zero. A generic category label cannot become evidence.
 for(const term of terms){
  const original=term.toLowerCase();
  const alts=distinct([original,...(EXPANSIONS[original]||[])]);
  let best=0;
  for(const alt of alts){
   const same=alt===original;
   if(!alt||alt.length<2)continue;
   const w=same?1:0.35;
   if(f.title.includes(alt))best=Math.max(best,26*w);
   if(f.slug.includes(alt))best=Math.max(best,19*w);
   if(f.tags.includes(alt))best=Math.max(best,17*w);
   if(f.main.includes(alt))best=Math.max(best,9*w);
   if(f.details.includes(alt))best=Math.max(best,3.5*w);
  }
  if(best>0){score+=best;matched++}
 }
 if(q.length>=4&&(f.title.includes(q)||f.slug.includes(q)))score+=35;
 if(terms.length>1&&matched===terms.length)score+=16;
 if(matched<Math.min(terms.length,2)&&terms.length>=3)score*=0.48;
 if(record.type==='problem'&&intent==='learn')score*=1.22;
 if(record.type==='concept'&&(intent==='learn'||intent==='understand'))score*=1.23;
 if(record.type==='resource'&&(intent==='find'||intent==='implement'||intent==='compare'))score*=1.25;
 if(record.type==='workflow'&&intent==='implement')score*=1.18;
 return score;
}
export function searchKnowledge(query,records,{intent=classifyIntent(query),limit=20}={}){
 const terms=lexicalTerms(query);
 if(!terms.length)return [];
 return records.map(record=>({record,score:scorer(record,terms,query,intent)}))
  .filter(x=>x.score>=3.5)
  .sort((a,b)=>b.score-a.score||a.record.title.localeCompare(b.record.title,'zh-Hant'))
  .slice(0,limit);
}
const fact=(value,source,label)=>({text:short(value,420),source:makeRef(source),label});
const pick=(arr,max=3)=>arr.filter(x=>x?.text).slice(0,max);
function simpleFacts(r,intent){
 const f=[];
 const add=(value,label)=>{if(text(value))f.push(fact(value,r,label))};
 switch(r.type){
  case 'concept':
   add(r.coreProblem||r.definition,'核心問題');
   for(const p of (r.solutionMethods||[]).slice(0,3))add(p,'解決方法');
   if(intent==='compare')for(const p of (r.tradeoffs||[]).slice(0,1))add(p,'取捨');
   break;
  case 'resource':
   add(r.purpose,'用途');
   for(const p of (r.features||[]).slice(0,2))add(p,'能力');
   break;
  case 'skill':
   add(r.purpose||r.problem,'適用情境');
   add(r.execution,'執行方式');
   break;
  case 'workflow':
   add(r.goal||r.solutionStrategy,'流程目標');
   if(intent==='implement')for(const p of (r.stages||[]).slice(0,2))add([p.title,p.purpose].filter(Boolean).join('：'),'流程步驟');
   break;
  case 'problem':
   add(r.learning?.takeaway||r.outcome||r.description,'整理重點');
   for(const p of (r.learning?.principles||[]).slice(0,2))add(p.title+'：'+p.explanation,'核心觀念');
   break;
  case 'prompt':add(r.goal||r.problem,'用途');break;
  case 'combination':add(r.rationale||r.goal,'搭配方式');break;
 }
 return f;
}
const gatherReferences=(ranked)=>ranked.map(x=>makeRef(x.record));
function byKind(ranked,type,count){return ranked.filter(x=>x.record.type===type).slice(0,count).map(x=>x.record)}
function relevantFacts(ranked,intent,{maxRecords=6,maxFacts=7}={}){
 const sourceMix=ranked.slice(0,maxRecords).map(x=>x.record);
 const chosen=[],seen=new Set();
 // Prefer one source-backed fact per record before adding extra facts.
 for(const record of sourceMix){
  const first=simpleFacts(record,intent).find(x=>!seen.has(x.text));
  if(first){chosen.push(first);seen.add(first.text)}
 }
 for(const record of sourceMix){
  for(const item of simpleFacts(record,intent)){
   if(chosen.length>=maxFacts)break;
   if(!seen.has(item.text)){chosen.push(item);seen.add(item.text)}
  }
 }
 return chosen.slice(0,maxFacts);
}
function firstWorkflow(ranked){
 return ranked.map(x=>x.record).find(x=>x.type==='workflow'&&Array.isArray(x.stages)&&x.stages.length)||
 ranked.map(x=>x.record).find(x=>x.type==='problem'&&x.learning?.steps?.length);
}
function stepsFor(r){
 if(!r)return [];
 if(r.type==='workflow')return (r.stages||[]).slice(0,7).map(s=>({
  title:s.title||s.id,action:s.purpose||'原始資料未提供這一步的做法。',
  output:joined(s.outputs)||'未定義',check:s.gate||'尚未定義驗收條件',source:makeRef(r)
 }));
 return (r.learning?.steps||[]).slice(0,7).map(s=>({
  title:s.title,action:s.action,output:s.output||'未定義',check:s.check||'尚未定義',source:makeRef(r)
 }));
}
function implementationSteps(ranked){
 const resource=byKind(ranked,'resource',4).find(x=>x.implementationKnowledge?.extensionInstructions?.length||x.implementationKnowledge?.extensionPath?.length||x.installationNotes)||null;
 if(resource){
  const im=resource.implementationKnowledge;
  const items=im?.extensionInstructions||im?.extensionPath||[];
  if(Array.isArray(items)&&items.length)return items.slice(0,7).map((s,i)=>({title:'步驟 '+(i+1),action:short(s,450),output:'原始資料未指定',check:'尚未在使用者環境執行',source:makeRef(resource)}));
  if(text(resource.installationNotes))return [{title:'來源安裝說明',action:short(resource.installationNotes,450),output:'未執行',check:'必須在核准的環境驗證',source:makeRef(resource)}];
 }
 return stepsFor(firstWorkflow(ranked));
}
function risksFor(ranked){
 const records=ranked.slice(0,8).map(x=>x.record),res=[],seen=new Set();
 for(const r of records){
  const statements=[...(r.limitations||[]),...(r.constraints||[]),...(r.tradeoffs||[])];
  if(text(r.security))statements.push(r.security);
  for(const s of statements){if(res.length>=4)break;if(!text(s)||seen.has(s))continue;seen.add(s);res.push(fact(s,r,'限制'))}
 }
 return res;
}
function practiseFor(ranked){const p=ranked.map(x=>x.record).find(r=>r.type==='problem'&&r.learning?.practice?.task);return p?{...p.learning.practice,source:makeRef(p)}:null}
function comparisonTargets(query){
 const input=normalize(query).replace(/^.*?(?:比較|對比)\s*/u,'');
 const parts=input.split(/\s*(?:與|和|跟|\bvs\.?\b|\bversus\b)\s*/iu);
 if(parts.length!==2)return null;
 const clean=t=>t.replace(/[，,。？?：:；;].*$/u,'').replace(/(?:的)?(?:差異|差別|優缺點|取捨|有什麼|有哪些).*$/u,'').trim();
 const targets=parts.map(clean).filter(x=>x.length>=2);
 return targets.length===2?targets:null;
}
function comparisonChoice(query,records,used){
 const terms=lexicalTerms(query);
 const results=searchKnowledge(query,records,{intent:'understand',limit:40});
 const exact=results.filter(x=>{
  const r=x.record,f=fields(r);
  return !used.has(refKey(r.type,r.id))&&terms.some(t=>f.title.includes(t)||f.slug.includes(t)||f.tags.includes(t));
 });
 const isBroadConcept=/^(?:rag|ai\s*agent|agent|agents|retrieval|檢索|代理)$/i.test(query);
 return exact.sort((a,b)=>
   (isBroadConcept&&a.record.type==='concept'?-60:0)-
   (isBroadConcept&&b.record.type==='concept'?-60:0)||
   b.score-a.score
 )[0]?.record||null;
}
function comparisonCard(r){
 const concept=r.type==='concept';
 return {
  title:r.title,
  purpose:short(concept?(r.coreProblem||r.definition):r.purpose||r.goal||r.problem,420),
  features:(concept?r.solutionMethods:r.features||r.stages?.map(s=>s.purpose)||[]).slice(0,3).map(x=>short(x,320)),
  limitations:(concept?r.tradeoffs:r.limitations||[]).slice(0,2).map(x=>short(x,320)),
  source:makeRef(r)
 };
}
function comparisons(ranked,records,query){
 const targets=comparisonTargets(query);
 if(targets){
  const used=new Set(),selected=[];
  for(const name of targets){
   const record=comparisonChoice(name,records,used);
   if(record){used.add(refKey(record.type,record.id));selected.push(record)}
  }
  // The cards stay titled with the actual records, never fabricated category names.
  return {items:selected.map(comparisonCard),scoped:true,targets};
 }
 const options=byKind(ranked,'resource',5).filter(r=>r.purpose);
 return {items:options.slice(0,3).map(comparisonCard),scoped:false,targets:null};
}
function exactCoverageGaps(query,ranked){
 const tokens=lexicalTerms(query).filter(t=>/^[a-z]/.test(t)&&t.length>=5);
 const missing=tokens.filter(t=>!ranked.some(x=>{
  const f=fields(x.record);return [f.title,f.slug,f.tags,f.main,f.details].some(v=>v.includes(t));
 }));
 return missing.length?'沒有找到直接提及「'+missing.slice(0,3).join('、')+'」的相關收藏；列出的其他項目只能作為背景參考。':'';
}
function uniqueSources(ranked){const used=new Set();return ranked.filter(x=>!used.has(x.record.type+':'+x.record.id)&&used.add(x.record.type+':'+x.record.id)).slice(0,12).map(x=>({...makeRef(x.record),reason:short(simpleFacts(x.record,'understand')[0]?.text||'',125)}))}
export function createAnswer(query,catalog,problems=[]){
 const input=text(query).slice(0,350);
 const intent=classifyIntent(input),records=indexKnowledge(catalog,problems), ranked=searchKnowledge(input,records,{intent,limit:22});
 const base={query:input,intent,matchCount:ranked.length,complete:false,sections:[],sources:[],notice:'僅從目前已收藏的資料整理；未連線到外部 AI 或即時驗證來源。'};
 if(!ranked.length)return {...base,empty:true,missing:'目前收藏中找不到足以支持這個問題的內容。請嘗試較具體的技術名稱，或先補充可信來源。'};
 // Prevent generic query terms yielding a random strong assertion.
 const sourceRecords=ranked.slice(0,9);
 const section=(kind,title,items)=>{if(items?.length)base.sections.push({kind,title,items})};
 const main=relevantFacts(sourceRecords,intent);
 const risks=risksFor(sourceRecords);
 if(intent==='compare'){
  const comparison=comparisons(sourceRecords,records,input);
  for(const option of comparison.items){
   const match=records.find(r=>r.type===option.source.type&&r.id===option.source.id);
   if(match&&!sourceRecords.some(x=>x.record.type===match.type&&x.record.id===match.id))sourceRecords.push({record:match,score:0});
  }
  section('compare',comparison.scoped?'對照主題相關的原始資料':'已收錄方案的差異',comparison.items);
  section('facts','比較前需要先理解',main.slice(0,5));
  section('risk','選擇前需核對',risks);
  if(comparison.items.length<2)base.gap='目前沒有足夠的獨立且與兩個比較主題直接相關的來源，不會強行選出最佳工具。';
  else base.gap=comparison.scoped?'目前是分別針對兩個主題找到的來源紀錄，不是完整的端對端技術比較；仍需核對各方案的實際能力與取捨。':'這是已收藏資料的並列比較，不代表最新版本、效能、價格或整合相容性已實測。';
 }else if(intent==='implement'){
  section('facts','目前收藏提供的實作依據',main.slice(0,6));
  const steps=implementationSteps(sourceRecords);
  section('steps','可參考的實作順序',steps);
  if(!steps.length)base.gap='相關收藏沒有足夠的安裝／實作步驟，不能直接宣稱可以執行。';
  section('risk','執行前應確認',risks);
  base.notice='這是依已收藏資料整理的 Preflight／實作參考，沒有執行任何命令、安裝或測試。';
 }else if(intent==='learn'||intent==='understand'){
  section('facts','先理解這些重點',main);
  const concepts=byKind(sourceRecords,'concept',4).flatMap(r=>(r.solutionMethods||[]).slice(0,1).map(s=>fact(s,r,'原理／方法')));
  section('methods','方法與核心概念',concepts.slice(0,4));
  const guide=firstWorkflow(sourceRecords);
  if(guide){const steps=stepsFor(guide);section('steps','收藏中的操作或學習路徑',steps.slice(0,6))}
  const practice=practiseFor(sourceRecords);if(practice)section('practice','已有的練習題',[practice]);
  section('risk','限制與注意事項',risks.slice(0,3));
  if(!concepts.length&&!guide)base.gap='目前多為工具介紹，缺少完整的核心原理或可重現教學。';
 }else{
  section('facts','找到的相關知識',main);
  section('risk','可能的使用限制',risks.slice(0,3));
 }
 const uncovered=exactCoverageGaps(input,ranked);
 if(uncovered)base.gap=base.gap?uncovered+' '+base.gap:uncovered;
 base.sources=uniqueSources(sourceRecords);
 base.complete=Boolean(base.sections.length&&base.sources.length&&!base.gap);
 return base;
}
export const INTENT_LABEL={learn:'理解與學習',compare:'比較與選擇',implement:'實作與應用',find:'搜尋收藏',understand:'知識探索'};

