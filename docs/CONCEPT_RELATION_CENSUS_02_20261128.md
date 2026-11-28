# Knowledge Relationship Census 02｜55 個無直接 Concept 關聯的 Resource（2026-11-28）

基準 main `ba856abb4af6e82b5eff4c77ac9cac82325cebeb`（#140 已合併）。PR #140 P1 Graph Unit Tests [45879094798](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45879094798)，Job 140113553317 實際輸出 CONCEPT_RELATION_CENSUS；9 個 Graph tests、全庫回歸及四種 viewport 通過。以下非 Graph promotion，不修改 Canonical。

## 1. 真實全庫統計

| 指標 | 數量 |
|---|---:|
| 六類 Canonical | 565 |
| 涉及 Concept 的引用欄位次數 | 1252 |
| 不重複有向 Concept 配對 | 1248 |
| Resource–Concept 有向配對 | 733 |
| Resource–Concept 去方向配對 | 712 |
| 雙向配對 | 21 |
| 有直接 Concept 關聯 Resource | 231 / 286 |
| 無直接 Concept 關聯 Resource | 55 / 286 |
| 無直接 Resource 關聯 Concept | 1 / 68 |
| 無任何 Canonical 關聯 Concept | 0 |

| Resource layer status | 總數 | 有直接 Concept 關聯 | 無直接關聯 |
|---|---:|---:|---:|
| mapped | 178 | 146 | 32 |
| evidence-linked | 90 | 71 | 19 |
| deferred | 14 | 10 | 4 |
| source-blocked | 4 | 4 | 0 |

入向 Concept 有向配對：Resource 709、Skill 330、Prompt 96、Workflow 71、Combination 9、Concept 7；Concept 出向 Resource 24、Skill 1、Workflow 1、Concept 7。方向與欄位次數不得混用；這是結構，不是語意驗證。

## 2. 55 筆固定佇列與判定

本輪直接讀取 50 個 Canonical Resource 的 source、purpose、features、既有能力/證據 locator 及範圍；另 5 筆沿用 Review 01 / Census 01 既有審查（明列於表）。以實際 CI 佇列比對，55/55 ID 一致且無重複，所有候選 Concept ID 皆存在。累計 83/286 Resource 局部語意證據對照（33 + 50），不是全部邊或完整上游驗證。

- 既有 Concept 候選 34：已有可觀察機制可對照；可能僅支持該原理的某個切面，需再確認對應原始欄位/來源，尚未成為正式 Typed Reference。
- 保留 Resource 17：基礎工具、目錄、教材等可獨立保存，或作 Workflow 實作選項，不為達成 100% 關聯率硬連。
- 來源缺口待解 4：原 deferred，維持原狀；若列 Concept 僅是待查方向。

| Resource | 判定 | 候選 Concept | 既有局部證據 | 限制／下一步 |
|---|---|---|---|---|
| [agentic-system-lab-harness-relay](../data/resources/agentic-system-lab-harness-relay.json) | 既有 Concept 候選 | [vendor-agnostic-orchestration](../data/concepts/vendor-agnostic-orchestration.json) | team / worktree；orchestrator.ts、角色及 Relay/Parallel | 跨 CLI 隔離、權限及交換輸出未測 |
| [alchaincyf-huashu-motion](../data/resources/alchaincyf-huashu-motion.json) | 既有 Concept 候選 | [agentic-media-pipeline](../data/concepts/agentic-media-pipeline.json) | source / frames；check.js、frames.js；HTML 影片來源及渲染前驗收 | 成片品質與相依階段未實測 |
| [alexyc9381-hiring-panel-skill](../data/resources/alexyc9381-hiring-panel-skill.json) | 既有 Concept 候選 | [quality-gates-verification](../data/concepts/quality-gates-verification.json) | screen / panel；SKILL.md 的履歷、JD、模擬審查與重寫後驗收 | 角色模擬不是獨立模型、人類或真實 ATS；不預測錄取 |
| [allanyiin-documa](../data/resources/allanyiin-documa.json) | 既有 Concept 候選 | [retrieval-grounded-knowledge-layer](../data/concepts/retrieval-grounded-knowledge-layer.json) | ir / bounded；DocumentIR、bounded_window、citation.py | 引用支持性、權限與多格式解析完整性未測 |
| [alsyundawy-microsoft-office-for-macos](../data/resources/alsyundawy-microsoft-office-for-macos.json) | 保留 Resource | — | version / license；歷史封存索引及 Microsoft 正式文件 | 保留來源治理案例，不把第三方安裝索引包裝成 AI Concept |
| [anomalyco-opencode](../data/resources/anomalyco-opencode.json) | 來源缺口待解 | [agent-runtime-harness](../data/concepts/agent-runtime-harness.json) | Review/Census 01；plan/build/general、子 session 規則、Shell/MCP | 原缺角色繼承與全部入口授權，不提升狀態 |
| [april-zhu-minicharts](../data/resources/april-zhu-minicharts.json) | 保留 Resource | — | data / type；主題與數值圖表選型 | 數值編碼及比例要獨立驗收；非研究實體關係圖或已驗證生成圖 |
| [better-me-notes-amie](../data/resources/better-me-notes-amie.json) | 保留 Resource | — | scope / select；文章出版目錄 | 未讀個別研究，不能用個人成長目錄支持 Agent learning |
| [bi0h4z4rd88-pi-sidebar-tui](../data/resources/bi0h4z4rd88-pi-sidebar-tui.json) | 既有 Concept 候選 | [context-governance](../data/concepts/context-governance.json) | context / todo；estimateCtxLeft、renderSessionPanel | Context 使用率觀察是治理的一部分，非載入／壓縮政策已驗證 |
| [blender-blender](../data/resources/blender-blender.json) | 保留 Resource | — | scene-settings / render-still；Scene frame range、render operator | 專業產製工具可作 Workflow option；未證明 Agent 串接 |
| [citypulso-pulsoicon](../data/resources/citypulso-pulsoicon.json) | 既有 Concept 候選 | [motion-interaction-layer](../data/concepts/motion-interaction-layer.json) | player / solid；Player start/stop/rest 與 IconMotion tracks | 局部 Kotlin 契約，非所有 Web/跨平台動效已驗證 |
| [comfy-org-comfyui](../data/resources/comfy-org-comfyui.json) | 既有 Concept 候選 | [agentic-media-pipeline](../data/concepts/agentic-media-pipeline.json) | node-contract / validate-queue；/object_info、validate_prompt、PromptQueue | 支持媒體生成階段的節點契約；不等於完整 Agent 影音產線 |
| [danyuchn-claude-work-mode](../data/resources/danyuchn-claude-work-mode.json) | 既有 Concept 候選 | [security-as-workflow-gate](../data/concepts/security-as-workflow-gate.json) | mode / gate；tempo.ts、tempo-auto.sh、decision-label-guard.py | Hook 模式及決策回報不能代替 OS 或所有路徑授權 |
| [designed-to-scale](../data/resources/designed-to-scale.json) | 來源缺口待解 | — | Census 01；作者作品集課程範圍 | 原課程章節不可讀，不強制歸入 AI Concept |
| [df3011212-codex-local-board](../data/resources/df3011212-codex-local-board.json) | 既有 Concept 候選 | [long-running-agent-operations](../data/concepts/long-running-agent-operations.json) | report / sync；validateSemanticState、mergeSummaries | 進度、證據、下一步觀測；未證明 heartbeat 或恢復全部機制 |
| [engineering-leadership-adobe-tech-lead-ai](../data/resources/engineering-leadership-adobe-tech-lead-ai.json) | 保留 Resource | — | clarity / risk；技術主管訪談 | 需求澄清與團隊提報有獨立參考價值；缺具體 Agent runtime 或評估機制 |
| [ffmpeg](../data/resources/ffmpeg.json) | 保留 Resource | — | select-stream / transform-media；-map、streamcopy/filtergraph | 可作影音流程實作選項，非 Agent orchestration 證據 |
| [gagansd-herdr-insights](../data/resources/gagansd-herdr-insights.json) | 既有 Concept 候選 | [agent-organization-control-plane](../data/concepts/agent-organization-control-plane.json) | parse / collect；跨 Provider parser、collectSnapshot | 只支持用量歸因與觀測切面，不證明預算硬停止、RBAC |
| [google-fonts](../data/resources/google-fonts.json) | 保留 Resource | — | select-font / web-css；字型目錄、CSS 引用 | 視覺系統實作選項，非完整設計規則；個別授權及實際載入待查 |
| [google-pagespeed-insights](../data/resources/google-pagespeed-insights.json) | 既有 Concept 候選 | [quality-gates-verification](../data/concepts/quality-gates-verification.json) | field-metrics / lab-diagnosis；CrUX 與 Lighthouse | 實測與診斷證據分離可重用；未測本庫網址，不宣稱網站 CWV PASS |
| [googlechrome-modern-web-guidance](../data/resources/googlechrome-modern-web-guidance.json) | 既有 Concept 候選 | [progressive-context-recall](../data/concepts/progressive-context-recall.json) | guide-search / drawer；SKILL.md Search/Retrieve | 支持按需取得指引，非持久記憶或 CLI 本身已實測 |
| [herdr-mods-gallery](../data/resources/herdr-mods-gallery.json) | 保留 Resource | — | browse / recipe；社群預覽及 RECIPE.md | 目錄不等於每個 Mod 已安裝、安全或可重現 |
| [huggingface-smolagents](../data/resources/huggingface-smolagents.json) | 既有 Concept 候選 | [agent-runtime-harness](../data/concepts/agent-runtime-harness.json) | agent-loop / named-tool-calling；MultiStepAgent、execute_tool_call | 固定原始碼支持執行迴圈及工具；遠端 executor、權限未證 |
| [ice1187-tw-security-and-ctf-resource](../data/resources/ice1187-tw-security-and-ctf-resource.json) | 保留 Resource | — | basic / practice；分類學習索引 | 合法學習資源，不等於各掃描器或防禦措施驗收 |
| [kepano-40-questions](../data/resources/kepano-40-questions.json) | 保留 Resource | — | annual / decade；固定反思問題 | 個人回顧不等於 Agent 反思或基於 outcome 召回 |
| [kepano-obsidian-minimal](../data/resources/kepano-obsidian-minimal.json) | 既有 Concept 候選 | [explicit-visual-system](../data/concepts/explicit-visual-system.json) | focus / cards；focus-mode.scss、cards.scss、flexoki.scss | 局部可重用排版規則，未測跨頁及裝置 |
| [kepano-obsidian-vault-template](../data/resources/kepano-obsidian-vault-template.json) | 既有 Concept 候選 | [data-ingestion-normalization](../data/concepts/data-ingestion-normalization.json) | daily / clipping；固定 metadata 欄位 | 支持輸入欄位規格，無自動去重、轉換或檢索實測 |
| [kubai087-kubai-icons](../data/resources/kubai087-kubai-icons.json) | 既有 Concept 候選 | [component-primitives-design-system](../data/concepts/component-primitives-design-system.json) | react / web；create.js、element.js；共用圖示元件與 props | 只支持圖示 primitive，不等於完整 design system；遵守分項授權 |
| [lakris2407-herdr-agent-quota](../data/resources/lakris2407-herdr-agent-quota.json) | 既有 Concept 候選 | [agent-organization-control-plane](../data/concepts/agent-organization-control-plane.json) | fetch / windows；loadQuota、visibleWindows | 額度與重設視圖，不證明路由或停止機制 |
| [land-book-design-inspiration](../data/resources/land-book-design-inspiration.json) | 來源缺口待解 | [reference-application-pattern-mining](../data/concepts/reference-application-pattern-mining.json) | Census 01；filter/page/quality 第一方索引 | 個別作品、作者與授權未確認；目錄不等於已萃取模式 |
| [lottiefiles-dotlottie-web](../data/resources/lottiefiles-dotlottie-web.json) | 既有 Concept 候選 | [motion-interaction-layer](../data/concepts/motion-interaction-layer.json) | load-animation / playback-control；play/pause/setFrame | 播放器生命週期與跨框架支援未全面查核 |
| [lucide-icons](../data/resources/lucide-icons.json) | 保留 Resource | — | component / visual-style；createLucideIcon、Icon.ts | 成熟圖示套件留為 implementation option；不為了覆蓋率硬連 |
| [manimcommunity-manim](../data/resources/manimcommunity-manim.json) | 既有 Concept 候選 | [continuity-driven-motion-design](../data/concepts/continuity-driven-motion-design.json) | scene-sequence / object-transform；Scene.play、Transform | 僅支持可控制順序與物件延續；沒有自動 continuity gate 實測 |
| [mars-tw-freedom-erp-crm](../data/resources/mars-tw-freedom-erp-crm.json) | 保留 Resource | — | world / storage；createWorld、validateWorld、workspace state | ERP/CRM 模擬實例與儲存機制獨立有用，不等同 AI 架構或正式財務系統 |
| [microsoft-ai-agents-for-beginners](../data/resources/microsoft-ai-agents-for-beginners.json) | 既有 Concept 候選 | [workflow-agent-system-agent-os-three-layer-architecture](../data/concepts/workflow-agent-system-agent-os-three-layer-architecture.json) | agent-intro / tool-contract / deployment-gate；01、04、16 章 | 跨章提供流程、Agent、部署治理的對照；不是同名三層框架的官方主張，Notebook 未實測 |
| [microsoft-autogen](../data/resources/microsoft-autogen.json) | 既有 Concept 候選 | [long-running-agent-operations](../data/concepts/long-running-agent-operations.json) | round-robin / termination-limits；GroupChatManager、MaxMessageTermination | 支持協作輪次與停止切面，不等於持久恢復；封存版本 |
| [minchenlee-loadsketch](../data/resources/minchenlee-loadsketch.json) | 既有 Concept 候選 | [quality-gates-verification](../data/concepts/quality-gates-verification.json) | rng / hist；makeRng、Histogram.quantile | 模擬假設、延遲及 SLO 可驗收；不把模擬數值當成生產量測 |
| [mrdoob-three-js](../data/resources/mrdoob-three-js.json) | 保留 Resource | — | scene-render / animation-loop；render、setAnimationLoop | 通用渲染實作選項；未證明完整互動狀態或跨鏡連續 |
| [nirdiamant-genai-agents](../data/resources/nirdiamant-genai-agents.json) | 既有 Concept 候選 | [agent-runtime-harness](../data/concepts/agent-runtime-harness.json) | loop-index / router-index；README 指向 Notebook | 課程索引僅為選讀入口，實作機制仍須開啟 Notebook 核對 |
| [nvidia-auto-ontology](../data/resources/nvidia-auto-ontology.json) | 既有 Concept 候選 | [semantic-layer-for-ai](../data/concepts/semantic-layer-for-ai.json) | catalog / schema；_validate_relation_column_coverage、Schema、SQL parse | metadata/關係不等於商業指標正確；需人工驗收及 DB 權限 |
| [openai-codex-security](../data/resources/openai-codex-security.json) | 既有 Concept 候選 | [security-as-workflow-gate](../data/concepts/security-as-workflow-gate.json) | threat-model / scan-validation；官方威脅模型、重現與人工修補 | 產品文件契約；未登入、掃描或證明所有漏洞被發現 |
| [openclaw-openclaw](../data/resources/openclaw-openclaw.json) | 既有 Concept 候選 | [agent-runtime-harness](../data/concepts/agent-runtime-harness.json) | turn-admission / run-observation；agentRunHandler、agentWaitHandler | 支持 Gateway/Runtime 切面；全工具策略及沙盒未查核，不宣稱完整 Agent OS |
| [pydantic-pydantic-ai](../data/resources/pydantic-pydantic-ai.json) | 既有 Concept 候選 | [agent-runtime-harness](../data/concepts/agent-runtime-harness.json) | typed-output / function-tools；output_type、Agent.tool、RunContext | 具型別的工具與輸出驗證是 runtime 契約切面；型別不等於語意真實或授權 |
| [react-frontend-backend-for-beginners](../data/resources/react-frontend-backend-for-beginners.json) | 保留 Resource | — | responsibility / request；原文前後端責任及請求 | 基礎教材，不等同桌面 IPC 或 Agent OS |
| [roocodeinc-roo-code](../data/resources/roocodeinc-roo-code.json) | 既有 Concept 候選 | [security-as-workflow-gate](../data/concepts/security-as-workflow-gate.json) | mode-tool-selection / approval-interaction；getToolsForMode、Task.ask | 封存版模式、工具核准局部證據；auto-approval 完整策略未查 |
| [ryanhanwu-how-to-ask-questions-the-smart-way](../data/resources/ryanhanwu-how-to-ask-questions-the-smart-way.json) | 保留 Resource | — | prepare / reproduce；最小重現及描述症狀 | 技術提問本身有價值；未證明 Agent 調查全流程，原文授權未核對 |
| [skillry-web-design-template-skills](../data/resources/skillry-web-design-template-skills.json) | 保留 Resource | — | select / spec；用途目錄及版型聲明 | Skill 目錄不等於可執行版本及生成設計一致性 |
| [systran-faster-whisper](../data/resources/systran-faster-whisper.json) | 保留 Resource | — | speech-transcription / speech-timing；Segment、restore_speech_timestamps | 音訊轉錄是 media pipeline 的可選元件；不證明整體品質 Gate |
| [theatlasteam-motion-design-skill](../data/resources/theatlasteam-motion-design-skill.json) | 既有 Concept 候選 | [motion-interaction-layer](../data/concepts/motion-interaction-layer.json) | motion-curves / interactive-controls；spring/bezier、renderAt、setValue | 時序與互動實作局部證據，未執行所有渲染及 reduced motion |
| [thu-maic-openmaic](../data/resources/thu-maic-openmaic.json) | 既有 Concept 候選 | [long-running-agent-operations](../data/concepts/long-running-agent-operations.json) | Review 01；start/poll/outline | 僅支持任務狀態及人工大綱核准；heartbeat、預算、resume 未證 |
| [toeverything-affine](../data/resources/toeverything-affine.json) | 來源缺口待解 | — | Census 01；documents-canvas、local-collaboration、局部 update merge/auth | 協作同步候選，不硬塞敏感資料處理；client/衝突驗收與第二來源未齊 |
| [vercel-labs-skills-cli](../data/resources/vercel-labs-skills-cli.json) | 既有 Concept 候選 | [reusable-agent-skills](../data/concepts/reusable-agent-skills.json) | discovery / target；parseSkillMd、installSkillForAgent、isPathSafe | 支援 Skill discovery/安裝路徑；不證明語意可攜、安全下載或每個 Host 相容 |
| [wquguru-cicada](../data/resources/wquguru-cicada.json) | 既有 Concept 候選 | [data-ingestion-normalization](../data/concepts/data-ingestion-normalization.json) | search / format；TranscriptSearch、FolderExportFormat.frontmatter | 會議資料正規化及匯出可重用；本機搜尋不等同完整 RAG 或隱私保證 |
| [zeabur-oss-ai-agent-installer-guide](../data/resources/zeabur-oss-ai-agent-installer-guide.json) | 既有 Concept 候選 | [security-as-workflow-gate](../data/concepts/security-as-workflow-gate.json) | path / approve；既有 Kubernetes 與新伺服器分流、改動前同意 | 文件安全前提；未安裝、未測拒絕及回滾 |
| [zed-industries-zed](../data/resources/zed-industries-zed.json) | 既有 Concept 候選 | [agent-runtime-harness](../data/concepts/agent-runtime-harness.json) | threads / permissions；agent-panel、tool_permissions.rs、Agent profiles | 局部 Agent 執行與權限介面；多人協作的同步演算法不在來源查核範圍 |

## 3. 唯一無直接 Resource 關聯的 Concept

`workflow-agent-system-agent-os-three-layer-architecture` 的定義與 solutionMethods 已重讀；已有 Concept-to-Concept 引用 Harness、Vendor-Agnostic Orchestration、Security Gate，並非孤立節點。Microsoft AI Agents for Beginners 固定版本 3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e 的 01、04、16 章，及其 agent-intro/tool-contract/deployment-gate 證據，可作跨層比較的候選教學來源。Smolagents 的 MultiStepAgent/tool calling 是 Agent System 實作切面；OpenClaw 的 agentRunHandler/agentWaitHandler 是 Runtime 與入口治理切面；不宣稱三個工具實際整合或任一產品完整採用同名三層架構。若要正式建立 refs，需審查原始章節、說明各來源支持哪一層及其限制，保留架構示意非官方強制拓撲。

## 4. Concept Gap Analysis

- **Typed Agent Tool & Output Contracts（待研究）**：Pydantic AI 的 output_type/function tools 與 Smolagents 的 named tool calls，以及 Microsoft 04 章工具驗證，形成可比較的 schema、參數驗證、錯誤與重試切面。既有 agent-native-tool-abstraction 著重 Provider Adapter 統一 I/O，agent-runtime-harness 著重執行責任，deterministic-execution-boundary 著重實際高風險 action，system-1-decision-layer 著重快速分類。先考慮補強 Harness 的 typed contract 及反例，而非立即新增 Concept。需要原始 validator 路徑及跨來源負例；型別通過不代表真實性或執行權限。
- **Agent Usage / State Observability（補強既有）**：Pi Sidebar 的 Context 估計、Herdr Insights 的跨 Provider parser、Herdr Quota 的使用窗、Codex Local Board 的 task/evidence 與狀態驗證是不同觀測層。已有 agent-organization-control-plane、long-running-agent-operations、context-governance、capability-cost-routing 可容納。待有實際跨 Provider 計量語意、重複事件與歸因證據後，再判斷是否值得獨立 Concept。
- **Collaborative State Synchronization（延續待研究）**：AFFiNE 有既有局部合併與授權證據；Zed 的 Canonical features 提及多人協作，但此輪證據聚焦 Agent threads/permissions，並未核對 CRDT 或同步實作。Freedom ERP/CRM 的 workspace storage 也不證明跨端衝突解決。維持研究候選，不充作兩個已核實獨立來源，不新增 ID。

## 5. 停止條件與下一步

55/55 無直接關聯的 Resource 已完成初步逐筆分類；尚有 203/286 Resource 待此階段局部語意核對，包含已有關聯的紀錄。下一輪先處理已連結 231 筆中尚未審查的部分，尤其多關聯、單一來源 Concept、涉及安全／授權的連結；分清每條關聯是否由可觀察機制支持。可將本報告候選轉成逐邊證據審查，而非直接升格或反覆撰寫相同內容。

不新增或刪除 Canonical、Tags、Graph、Schema、權限、外部執行；不要求 Resource 必須連 Concept。既有 14 deferred / 4 source-blocked 不因本輪關聯審查而結案。所有實際第三方整合與 Runtime 未測。
