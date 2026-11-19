/**
 * AI Tool Collection domain classifier (proposal, 2026-11-19).
 * Runs against existing Canonical fields. Does not change entityType, ID,
 * original category/tags, graph links, capabilities, or status.
 * All output is PROVISIONAL until actual content is reviewed.
 */
import fs from 'node:fs';
const taxonomy=JSON.parse(fs.readFileSync(new URL('../data/taxonomy-v1.json',import.meta.url),'utf8'));
export const DOMAIN_DEFS=Object.freeze(taxonomy.domains);
const known = new Set(DOMAIN_DEFS.map(x=>x.id));
/* Explicitly selected sample from docs/CLASSIFICATION_PILOT_20261119.md.
 * These are proposals, not independently verified classification labels. */
export const PILOT = Object.freeze({
'resource:tip31812-ai-usage-bar':['ai-agent','software'],
'resource:aiposthub-awesome-opensource-ai-cheat-sheets-guide':['ai-agent','data'],
'resource:alexyc9381-hiring-panel-skill':['career'],
'resource:blader-humanizer':['content'],
'resource:agricidaniel-claude-seo':['content','data'],
'resource:akas333-tysa':['ai-agent'],
'resource:akseolabs-seo-cinematic-ui':['design','content'],
'resource:allanyiin-documa':['data','ai-agent'],
'resource:allanyiin-toolanything':['ai-agent','automation'],
'resource:anti-gambling-trader-tw':['business'],
'resource:code-graph':['software','data'],
'resource:opendatalab-mineru':['data'],
'resource:ai-video-drama-platform':['content','automation'],
'resource:zeabur-oss-ai-agent-installer-guide':['cloud','automation'],
'resource:ice1187-tw-security-and-ctf-resource':['security'],
'skill:alexyc9381-hiring-panel':['career'],
'skill:blader-humanizer':['content'],
'skill:agricidaniel-claude-seo':['content','data'],
'skill:akas333-tysa-axiom-learn':['data','ai-agent'],
'skill:akseolabs-seo-cinematic-ui':['design','content'],
'skill:allanyiin-toolanything-mcp-router':['ai-agent','automation'],
'skill:anthropics-claude-api-prompt-audit':['ai-agent'],
'skill:cathrynlavery-diagram-design':['design'],
'skill:usestrix-strix-security-skills':['security','software'],
'prompt:star-resume-experience-three-rewrites':['career'],
'prompt:cv-jd-tailored-interview-questions-deep-followups':['career'],
'prompt:ibkr-weekly-risk-adjusted-performance':['business','data'],
'prompt:google-maps-saved-places-cleanup-classification':['automation','data'],
'prompt:dashboard-three-frictions-two-layout-options':['design','data'],
'prompt:role-reversal-meta-prompt-generator':['ai-agent'],
'concept:agent-runtime-harness':['ai-agent'],
'concept:codebase-knowledge-graph':['software','data'],
'concept:data-ingestion-normalization':['data'],
'concept:point-in-time-retrieval':['data','business'],
'combination:agent-stack':['ai-agent','software'],
'combination:voice-publish-evidence-social-content-loop':['content','automation'],
'combination:local-pii-ai-processing-loop':['security','ai-agent'],
'workflow:ibkr-weekly-export-risk-adjusted-review':['business','data'],
'workflow:multi-model-interview-followup-and-feedback-practice':['career','ai-agent'],
'workflow:zeabur-oss-ai-assisted-self-hosted-install-workflow':['cloud','automation']
});

const RULES = Object.freeze({
 career:[/\b(?:resume|cv|recruit(?:er|ment|ing)?|hiring|interview|headhun(?:t|ter)|job.search|job.application|career|cover.letter|ats)\b|履歷|求職|面試|職涯|招募|招聘|職缺|獵頭/i,/\bportfolio\b.*\b(?:case.study|resume|job)\b|作品集.*(?:求職|面試)/i],
 business:[/\b(?:ibkr|tradingview|pine.script|spy|finance|financial|fintech|invest(?:ment|ing|or)?|stock(?:s)?|equity|trading|trader|backtest|portfolio.risk|quantitative.finance|monte.carlo|market.risk|personal.finance|accounting)\b|金融|理財|投資|股票|台股|股市|交易策略|回測|風險報酬|財務|營收|加密貨幣/i],
 security:[/\b(?:cybersecurity|security.scan|security.audit|security.review|security.tool|vulnerab|pentest|penetration.test|threat.model|credential.isolat|pii|privacy|data.protection|secret.management|authn|authz|zero.trust|prompt.injection|sandbox.isolation|compliance|anti.fraud)\b|資安|安全檢測|漏洞|滲透測試|隱私|個資|敏感資料|憑證隔離|權限控管|防詐|資料保護/i,/\bsecurity\b|安全治理|安全防護/i],
 cloud:[/\b(?:azure|aws|kubernetes|k8s|terraform|container.platform|cloudflare|cloud.infra|devops|serverless|self.host(?:ed|ing)?|vps|ssh.install|linux.server|cloud.deploy|hosting|paas|gpu.cluster|docker.compose|infra.ops)\b|雲端|基礎設施|自架|部署平台|伺服器安裝|容器化|叢集管理/i],
 design:[/\b(?:front.?end|react|next\.?js|figma|design.system|ui.design|ux.design|user.interface|user.experience|web.design|landing.page|svg.motion|css|tailwind|shadcn|typography|accessibility|wireframe|html.layout|dashboard.layout)\b|前端|介面設計|網頁設計|網站設計|互動設計|視覺設計|設計系統|排版|使用者體驗|元件庫/i,/\b(?:ui|ux|figma|design|visualization)\b|圖表設計|視覺化設計/i],
 content:[/\b(?:seo|geo.search|content.creation|content.pipeline|content.marketing|social.post|social.media|video|reels?|shorts|podcast|youtube|tiktok|ffmpeg|comfyui|storyboard|script.to.video|voice.over|tts|copywriting|writing.edit|humaniz|motion.design|image.generat|illustrat|animation|creative.asset|film|cinematic.video|content.strategy|marketing|blogg)\b|影片|短影音|短劇|社群|文案|內容創作|影像|配音|剪輯|廣告|圖片生成|寫作|文字改寫|媒體製作|影像生成/i],
 data:[/\b(?:sql|database|dataset|data.pipeline|data.engineering|data.analysis|analytics|dashboard|business.intelligence|etl|elt|ingest|normaliz|parser|document.ir|pdf.extract|rag|retriev|knowledge.graph|knowledge.base|search.index|vector.database|embedding.search|data.quality|visualization|excel|power.bi|bigquery|dataverse|data.lake)\b|資料處理|資料分析|資料品質|資料工程|資料整合|知識圖譜|知識庫|資料庫|資料擷取|資料治理|語意搜尋|檢索|結構化文件|報表分析|儀表板/i],
 automation:[/\b(?:automation|automate|integration|integrat|n8n|zapier|power.automate|rpa|webhook|scheduled.job|scheduler|cron|email.triage|browser.automat|browser.use|workflow.automat|web.scrap|crawler|tool.connector|connector.build)\b|自動化|工作自動化|流程整合|串接|排程|批次整理|批次處理|網站爬取|資料搬運|工作排程/i],
 software:[/\b(?:coding|codebase|code.review|code.graph|software.engineering|software.develop|developer.tool|debug|git(?:hub|lab)?|repository|repo.audit|test.coverage|unit.test|integration.test|ci\/cd|commit|refactor|code.intelligence|programming|code.verification|tdd|build.system|source.code)\b|程式碼|程式開發|軟體工程|程式測試|除錯|測試涵蓋|版本控制|程式品質|工程驗收|系統重構/i],
 'ai-agent':[/\b(?:agent(?:ic|s)?|multi.agent|mcp|llm|language.model|model.routing|model.gateway|model.infer|agent.harness|agent.runtime|context.engineer|prompt.engineer|skills?\.md|tool.call|claude.code|codex|openai.api|anthropic|evals?|ai.model)\b|智能代理|模型路由|代理人|多代理|模型推論|提示詞工程|大型語言模型|代理協作|Agent 架構/i]
});
// Legacy Category is evidence, but not the identity of the new Domain.
/* Clear examples from stored descriptions; proposals, not external verification. */
const EXAMPLE_OVERRIDES=Object.freeze({
'resource:acheaisuiyimen-ache-life-to-comic-skill':["content"],
'resource:anime-js':["design"],
'resource:ayueh0102-ronnier-skill':["design"],
'resource:arrow-2':["design","content"],
'resource:better-me-notes-amie':["content"],
'resource:bruiandy-claude-obsidian':["data","ai-agent"],
'resource:cathrynlavery-diagram-design':["design"],
'resource:coreyhaines31-marketingskills':["content"],
'resource:electron':["software","design"],
'resource:gsap-skills':["design"],
'resource:hao0321-editkin':["content"],
'resource:hermes-snyk-plugin':["security","ai-agent"],
'resource:impeccable':["design"],
'resource:infiniflow-ragflow':["data","ai-agent"],
'resource:kepano-40-questions':["data"],
'resource:kepano-obsidian-vault-template':["data"],
'resource:kubai087-kubai-icons':["design"],
'resource:lawpowen-ui-design-codex-bundle':["design"],
'resource:leonxlnx-taste-skill':["design"],
'resource:lieflat-less-ai-tone':["content"],
'resource:mars-tw-freedom-erp-crm':["business"],
'resource:minchenlee-loadsketch':["software","cloud"],
'resource:motion-dev-animations-skill':["design"],
'resource:onetake':["content"],
'resource:photo-riso-poster':["content"],
'resource:playwright':["software","automation"],
'resource:pramoddutta-botskills':["ai-agent"],
'resource:qingyuna-answer-me-with-html':["design","ai-agent"],
'resource:r0x0r-pywebview':["software","design"],
'resource:recraft':["design","content"],
'resource:remove-bg':["content","automation"],
'resource:research-to-diagram':["design"],
'resource:reverse-skill':["security"],
'resource:shubhamsaboo-needle':["data"],
'resource:sona-orbit-parroting':["content"],
'resource:usestrix-strix':["security","ai-agent"],
'resource:viral-hook-title':["content"],
'resource:wquguru-cicada':["content"],
'skill:acheaisuiyimen-ache-life-to-comic-skill':["content"],
'skill:debpalash-voicestudio-voicestudio':["content"],
'skill:googlechrome-modern-web-guidance':["software","design"],
'skill:graphify-labs-graphify-v3':["data","software"],
'skill:gsap-skills':["design"],
'skill:heydamir-unslop-skill':["design"],
'skill:kubai087-kubai-icons-skill':["design"],
'skill:leemysw-yovoice-yovoice':["content"],
'skill:lieflat-less-ai-tone':["content"],
'skill:lucasmarkes-hairline-adopt':["design"],
'skill:lucasmarkes-hairline-create':["design"],
'skill:motion-dev-animations-skill':["design"],
'skill:nvidia-auto-ontology-setup':["data","cloud"],
'skill:nvidia-skillspector':["security","ai-agent"],
'skill:photo-riso-poster':["content"],
'skill:research-to-diagram':["design"],
'skill:viral-hook-title':["content"],
'skill:yanliudesign-mono-color-skill':["design"],
'skill:zhouxiaoka-autoclip-autoclip':["content"],
'concept:constraint-bounded-editing':["content"],
'concept:cross-layer-software-reconstruction':["software"],
'concept:editable-generative-assets':["design"],
'concept:evidence-preserving-visual-abstraction':["design"],
'concept:motion-interaction-layer':["design"],
'concept:outcome-first-minimal-brief-ai-web-design':["design"],
'concept:reference-as-prompt-evidence':["design","ai-agent"],
'concept:security-as-workflow-gate':["security","software"],
'concept:closed-loop-social-content-system':["content","automation"],
'workflow:agentic-video-production-stack':["content"],
'workflow:evidence-gated-trading-automation':["business","automation"],
'combination:agentic-video-production-stack':["content"],
'combination:goal-build-evidence-learning-loop':["ai-agent"]
});
const CATEGORY_HINTS = Object.freeze([
[/^(?:01 Agent Runtime|02 Agent Orchestration|Agent Engineering|Agentic|AI Agent)/i,'ai-agent',2.5],
[/^(?:03 Code Intelligence|12 Developer Tools|Software Engineering|AI-assisted Code)/i,'software',4.0],
[/^(?:05 Data & Ingestion|Data |Database|RAG|Knowledge)/i,'data',4.0],
[/^(?:07 Security & Governance|Developer Security|Cybersecurity)/i,'security',5.0],
[/^(?:08 UI & Design Engineering|Frontend|UI\/UX|Design System|Web Design)/i,'design',4.5],
[/^(?:09 Content & Artifact Generation|11 Media \/ Video|Media|Content)/i,'content',3.0],
[/^(?:04 Career|Career |Job |Hiring|Recruiting)/i,'career',4.0],
[/^(?:Finance|Trading|Investment|Quantitative)/i,'business',5.0],
[/^(?:Cloud|DevOps|Infrastructure|Hosting)/i,'cloud',5.0],
[/^(?:Automation|Integration|Workflow Automation)/i,'automation',3.5]
]);
function normalized(v){return typeof v==='string'?v:'';}
function scoreText(s,re,weight){if(!s)return 0;return re.test(s)?weight:0;}
function evidenceRecord(x){
 const purpose=normalized(x.purpose||x.coreProblem||x.problem||x.goal);
 const goal=normalized(x.goal||x.problem||x.coreProblem||x.purpose);
 return {
  title:normalized(x.title)+" "+normalized(x.canonicalName),
  id:normalized(x.id),
  legacy:normalized(x.category),
  purpose:purpose.slice(0,650),
  goal:goal.slice(0,300),
  type:normalized(x.resourceType),
  tags:Array.isArray(x.tags)?x.tags.filter(t=>typeof t==='string').join(' ').slice(0,380):''
 };
}
function sortedScores(x){
 const e=evidenceRecord(x);
 return DOMAIN_DEFS.map(d=>{
   const patterns=RULES[d.id],sp=patterns[0],weak=patterns[1];
   const title=scoreText(e.title,sp,7)+scoreText(e.title,weak||sp,weak?1.5:0);
   const id=scoreText(e.id,sp,4.5);
   const purpose=scoreText(e.purpose,sp,3)+scoreText(e.purpose,weak||sp,weak?0.5:0);
   const goal=scoreText(e.goal,sp,2);
   const typ=scoreText(e.type,sp,1.4);
   const tags=scoreText(e.tags,sp,0.6);
   const category=CATEGORY_HINTS.filter(h=>h[1]===d.id&&h[0].test(e.legacy)).reduce((n,h)=>Math.max(n,h[2]),0);
   return {id:d.id,score:+(title+id+purpose+goal+typ+tags+category).toFixed(2),
    evidence:(title>0?'title;':'')+(purpose>0?'purpose;':'')+(goal>0?'goal;':'')+(category>0?'category;':'')};
 }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
function inferFacets(x){
 const type=normalized(x.resourceType), title=normalized(x.title),category=normalized(x.category);
 const context=[title,type,normalized(x.purpose).slice(0,280),category].join(' ');
 const learning=/(?:學習資源|教學|教材|課程|教案|練習題|教練|培訓|教育|自適應學習|入門|速查表|基礎指南|教學參考|\bcourse\b|\btutorial\b|\bcurriculum\b|\bcheat.sheet\b|\blearning.resource\b|\blearning.guide\b|\bCTF resource\b|\btraining.guide\b)/i.test(context);
 const reference=/(?:參考資料|官方文件|參考手冊|資料索引|速查表|\breference\b|\bdocumentation\b|\bawesome.list\b|\bcheat.sheet\b)/i.test([title,type,category].join(' '));
 return [...(learning?['learning']:[]),...(reference?['reference']:[])];
}
export function classifyRecord(x){
 // AI-reviewed stored descriptions are not independently source-verified.
 // Respect their classification during future automated reclassification.
 if (x.classification?.reviewStatus==='ai-description-reviewed'){
   const c=x.classification;
   return {primaryDomain:c.primaryDomain, secondaryDomains:c.secondaryDomains,
     purposeFacets:c.purposeFacets, reviewStatus:c.reviewStatus,
     evidenceFields:c.evidenceFields};
 }

 const key=x.entityType+':'+x.id;
 const scored=sortedScores(x),pilot=PILOT[key]||EXAMPLE_OVERRIDES[key];
 const top=scored[0],next=scored[1];
 const primary=pilot?pilot[0]:top.id;
 const secondary=pilot?pilot.slice(1):scored.filter(s=>s.id!==primary&&s.score>=5.5&&s.score>=top.score*0.67).slice(0,2).map(s=>s.id);
 const margin=(top.score-next.score);
 const requiresReview=!pilot&&(top.score<5.5||margin<3.2);
 if(!known.has(primary)||secondary.length>2||secondary.some(s=>s===primary||!known.has(s)))throw Error('Invalid domain '+key);
 const evidence=[x.coreProblem?'coreProblem':null,x.problem?'problem':null,x.goal?'goal':null,x.purpose?'purpose':null,x.category?'category':null].filter(Boolean);
 return {
  primaryDomain:primary,
  secondaryDomains:secondary,
  purposeFacets:inferFacets(x),
  reviewStatus:PILOT[key]?'pilot-proposed':EXAMPLE_OVERRIDES[key]?'example-proposed':requiresReview?'needs-review':'rule-proposed',
  evidenceFields:evidence.slice(0,4)
 };
}
