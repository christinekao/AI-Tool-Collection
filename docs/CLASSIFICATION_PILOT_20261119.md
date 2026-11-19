# 分類試行｜40 筆跨類型樣本（2026-11-19）

> **狀態：分類建議／尚未核准遷移。** 依現行 main 分支的 Catalog 與 `catalog-app.js` 分類 Regex 分析，採用 [分類規則 v0.1](CLASSIFICATION_RULES_V1.md) 試填。
> Catalog blob SHA：`eecd67795676e43cfdd8f77defee379816385eb8`。分類程式 blob SHA：`c7dbbb13f0fb209f7fd37b81e8ec8c6f66e9b53a`。
> **資料來源範圍：** 已收錄的 title、purpose／problem／goal、category、tags 與引用。未對 40 筆全部重新審查外部上游、安裝或執行 Tool／Skill；下列為**來源資料支持的暫定分類**，不是經獨立人工驗收後的金標資料。

## A. 試行目的與抽樣方式

- **有意抽樣（非隨機）** 40 筆，分布：Resource 15／Skill 9／Prompt 6／Concept 4／Combination 3／Workflow 3。包含偏少的雲端、金融、學習、內容、安全、資料，與主題容易誤命中的跨領域案例。
- 舊分類數字來自現有 `matchTopic` 的九主題 Regex；試行手動依記錄的問題與目的，指定唯一 Primary、0–2 Secondary，另標示 Format／Purpose。
- 因刻意選取邊界案例，此樣本**不能推算整個 548 筆的正式誤分類率**，也不能用來證明新方案實際搜尋體驗已改善。

## B. 指標對照

| 指標 | 試行結果 | 解讀 |
|---|---:|---|
| 選取項目 | 40 | 六類 Entity 都涵蓋 |
| 舊主題平均命中數 | 3.55 | Regex 會同時標示很多類，不代表一定是錯誤 |
| 舊主題至少命中四類 | 21 | 需要人工區分主要用途 |
| 舊主題未命中 | 2 | 未命中不代表沒有價值 |
| 新方案具有唯一 Primary | 40 | **規格層面的強制設定**，不是分類正確率 |
| 新方案另標 Secondary | 25 | 不必將所有相關技術列為主題 |
| 初步可判斷 | 32 | 根據現有 Canonical 欄位判斷，尚未確認實際上游 |
| 原始待複核 | 8 | 已在 D 節補上分類建議；6 筆不需阻擋分類，另 2 筆主要是後續 Combination／Workflow 結構問題 |

**重要：** 新分類的「40/40 有 Primary」是此次手動指定所致，不代表已將規則自動套用全部資料或達成 100% 品質。

## C. 40 筆新舊分類對照

> 「目前九主題」欄顯示**同時命中的所有標籤**，不是現在存在唯一的主分類。格式與閱讀用途是試行的資料 Facet，尚未寫入 Schema。

| # | Type | ID／原始資料 | 目前九主題（命中數） | 建議 Domain | 格式／目的 | 狀態 |
|---:|---|---|---|---|---|---|
| 1 | Resource | [`tip31812-ai-usage-bar`](../data/resources/tip31812-ai-usage-bar.json) | AI Agent 與 Skills、程式開發、前端與 UI 設計、安全與治理（4） | **AI 系統與 Agent**<br>次：程式開發與品質 | repository/application；implementation | 初步合理 |
| 2 | Resource | [`aiposthub-awesome-opensource-ai-cheat-sheets-guide`](../data/resources/aiposthub-awesome-opensource-ai-cheat-sheets-guide.json) | 學習與教材、AI Agent 與 Skills、程式開發、資料與分析、安全與治理（5） | **AI 系統與 Agent**<br>次：資料、分析與知識 | article/reference；learning、reference | 待複核 |
| 3 | Resource | [`alexyc9381-hiring-panel-skill`](../data/resources/alexyc9381-hiring-panel-skill.json) | AI Agent 與 Skills、資料與分析、求職與面試、安全與治理（4） | **職涯、招聘與面試** | repository/skill-distribution；implementation | 初步合理 |
| 4 | Resource | [`blader-humanizer`](../data/resources/blader-humanizer.json) | AI Agent 與 Skills、前端與 UI 設計、求職與面試、內容與創作（4） | **內容、媒體與行銷** | repository/skill-distribution；implementation | 初步合理 |
| 5 | Resource | [`agricidaniel-claude-seo`](../data/resources/agricidaniel-claude-seo.json) | AI Agent 與 Skills、前端與 UI 設計、資料與分析、求職與面試、內容與創作、安全與治理（6） | **內容、媒體與行銷**<br>次：資料、分析與知識 | repository/skill-distribution；implementation | 初步合理 |
| 6 | Resource | [`akas333-tysa`](../data/resources/akas333-tysa.json) | 學習與教材、AI Agent 與 Skills、前端與 UI 設計、資料與分析、自動化與流程（5） | **AI 系統與 Agent** | application/repository；learning、implementation | 待複核 |
| 7 | Resource | [`akseolabs-seo-cinematic-ui`](../data/resources/akseolabs-seo-cinematic-ui.json) | AI Agent 與 Skills、前端與 UI 設計、資料與分析、求職與面試、內容與創作、安全與治理（6） | **UI／UX 與前端**<br>次：內容、媒體與行銷 | repository/skill-distribution；implementation | 初步合理 |
| 8 | Resource | [`allanyiin-documa`](../data/resources/allanyiin-documa.json) | AI Agent 與 Skills、程式開發、前端與 UI 設計、資料與分析、安全與治理（5） | **資料、分析與知識**<br>次：AI 系統與 Agent | repository/library；implementation | 初步合理 |
| 9 | Resource | [`allanyiin-toolanything`](../data/resources/allanyiin-toolanything.json) | AI Agent 與 Skills、程式開發、資料與分析、自動化與流程、安全與治理（5） | **AI 系統與 Agent**<br>次：自動化與整合 | repository/library；implementation | 初步合理 |
| 10 | Resource | [`anti-gambling-trader-tw`](../data/resources/anti-gambling-trader-tw.json) | 學習與教材、程式開發、前端與 UI 設計、資料與分析、自動化與流程、安全與治理（6） | **商業與金融** | repository/application；learning、implementation | 初步合理 |
| 11 | Resource | [`code-graph`](../data/resources/code-graph.json) | 未命中（0） | **程式開發與品質**<br>次：資料、分析與知識 | reference/needs-review；reference | 待複核 |
| 12 | Resource | [`opendatalab-mineru`](../data/resources/opendatalab-mineru.json) | 資料與分析（1） | **資料、分析與知識** | repository/parser；implementation | 初步合理 |
| 13 | Resource | [`ai-video-drama-platform`](../data/resources/ai-video-drama-platform.json) | AI Agent 與 Skills、前端與 UI 設計、資料與分析、自動化與流程、內容與創作（5） | **內容、媒體與行銷**<br>次：自動化與整合 | repository/backend；implementation | 初步合理 |
| 14 | Resource | [`zeabur-oss-ai-agent-installer-guide`](../data/resources/zeabur-oss-ai-agent-installer-guide.json) | 學習與教材、AI Agent 與 Skills、程式開發、前端與 UI 設計、自動化與流程、安全與治理（6） | **雲端與基礎設施**<br>次：自動化與整合 | documentation/installation；reference、implementation | 初步合理 |
| 15 | Resource | [`ice1187-tw-security-and-ctf-resource`](../data/resources/ice1187-tw-security-and-ctf-resource.json) | 學習與教材、AI Agent 與 Skills、程式開發、資料與分析、內容與創作、安全與治理（6） | **安全與治理** | reference-index；learning、reference | 初步合理 |
| 16 | Skill | [`alexyc9381-hiring-panel`](../data/skills/alexyc9381-hiring-panel.json) | AI Agent 與 Skills、資料與分析、求職與面試、安全與治理（4） | **職涯、招聘與面試** | skill；implementation | 初步合理 |
| 17 | Skill | [`blader-humanizer`](../data/skills/blader-humanizer.json) | AI Agent 與 Skills、內容與創作（2） | **內容、媒體與行銷** | skill；implementation | 初步合理 |
| 18 | Skill | [`agricidaniel-claude-seo`](../data/skills/agricidaniel-claude-seo.json) | AI Agent 與 Skills、前端與 UI 設計、資料與分析、內容與創作、安全與治理（5） | **內容、媒體與行銷**<br>次：資料、分析與知識 | skill；implementation | 初步合理 |
| 19 | Skill | [`akas333-tysa-axiom-learn`](../data/skills/akas333-tysa-axiom-learn.json) | 學習與教材、AI Agent 與 Skills、資料與分析、安全與治理（4） | **資料、分析與知識**<br>次：AI 系統與 Agent | skill；implementation | 待複核 |
| 20 | Skill | [`akseolabs-seo-cinematic-ui`](../data/skills/akseolabs-seo-cinematic-ui.json) | AI Agent 與 Skills、前端與 UI 設計、資料與分析、求職與面試、內容與創作、安全與治理（6） | **UI／UX 與前端**<br>次：內容、媒體與行銷 | skill；implementation | 初步合理 |
| 21 | Skill | [`allanyiin-toolanything-mcp-router`](../data/skills/allanyiin-toolanything-mcp-router.json) | AI Agent 與 Skills、資料與分析、自動化與流程、安全與治理（4） | **AI 系統與 Agent**<br>次：自動化與整合 | skill；implementation | 初步合理 |
| 22 | Skill | [`anthropics-claude-api-prompt-audit`](../data/skills/anthropics-claude-api-prompt-audit.json) | AI Agent 與 Skills、前端與 UI 設計、安全與治理（3） | **AI 系統與 Agent** | skill；implementation | 初步合理 |
| 23 | Skill | [`cathrynlavery-diagram-design`](../data/skills/cathrynlavery-diagram-design.json) | AI Agent 與 Skills、前端與 UI 設計、資料與分析（3） | **UI／UX 與前端** | skill；implementation | 初步合理 |
| 24 | Skill | [`usestrix-strix-security-skills`](../data/skills/usestrix-strix-security-skills.json) | AI Agent 與 Skills、程式開發、資料與分析、內容與創作、安全與治理（5） | **安全與治理**<br>次：程式開發與品質 | skill；implementation | 初步合理 |
| 25 | Prompt | [`star-resume-experience-three-rewrites`](../data/prompts/star-resume-experience-three-rewrites.json) | 求職與面試、內容與創作（2） | **職涯、招聘與面試** | prompt；implementation | 初步合理 |
| 26 | Prompt | [`cv-jd-tailored-interview-questions-deep-followups`](../data/prompts/cv-jd-tailored-interview-questions-deep-followups.json) | 求職與面試、安全與治理（2） | **職涯、招聘與面試** | prompt；implementation | 初步合理 |
| 27 | Prompt | [`ibkr-weekly-risk-adjusted-performance`](../data/prompts/ibkr-weekly-risk-adjusted-performance.json) | 未命中（0） | **商業與金融**<br>次：資料、分析與知識 | prompt；implementation | 初步合理 |
| 28 | Prompt | [`google-maps-saved-places-cleanup-classification`](../data/prompts/google-maps-saved-places-cleanup-classification.json) | 資料與分析（1） | **自動化與整合**<br>次：資料、分析與知識 | prompt；implementation | 待複核 |
| 29 | Prompt | [`dashboard-three-frictions-two-layout-options`](../data/prompts/dashboard-three-frictions-two-layout-options.json) | 前端與 UI 設計、資料與分析（2） | **UI／UX 與前端**<br>次：資料、分析與知識 | prompt；implementation | 初步合理 |
| 30 | Prompt | [`role-reversal-meta-prompt-generator`](../data/prompts/role-reversal-meta-prompt-generator.json) | AI Agent 與 Skills、前端與 UI 設計、安全與治理（3） | **AI 系統與 Agent** | prompt；implementation | 初步合理 |
| 31 | Concept | [`agent-runtime-harness`](../data/concepts/agent-runtime-harness.json) | AI Agent 與 Skills、安全與治理（2） | **AI 系統與 Agent** | concept；reference | 初步合理 |
| 32 | Concept | [`codebase-knowledge-graph`](../data/concepts/codebase-knowledge-graph.json) | AI Agent 與 Skills、程式開發（2） | **程式開發與品質**<br>次：資料、分析與知識 | concept；reference | 初步合理 |
| 33 | Concept | [`data-ingestion-normalization`](../data/concepts/data-ingestion-normalization.json) | AI Agent 與 Skills、資料與分析、內容與創作（3） | **資料、分析與知識** | concept；reference | 初步合理 |
| 34 | Concept | [`point-in-time-retrieval`](../data/concepts/point-in-time-retrieval.json) | 資料與分析（1） | **資料、分析與知識**<br>次：商業與金融 | concept；reference | 初步合理 |
| 35 | Combination | [`agent-stack`](../data/combinations/agent-stack.json) | AI Agent 與 Skills、程式開發、自動化與流程（3） | **AI 系統與 Agent**<br>次：程式開發與品質 | combination；reference | 待複核 |
| 36 | Combination | [`voice-publish-evidence-social-content-loop`](../data/combinations/voice-publish-evidence-social-content-loop.json) | 學習與教材、自動化與流程、內容與創作（3） | **內容、媒體與行銷**<br>次：自動化與整合 | combination；reference | 待複核 |
| 37 | Combination | [`local-pii-ai-processing-loop`](../data/combinations/local-pii-ai-processing-loop.json) | 自動化與流程、安全與治理（2） | **安全與治理**<br>次：AI 系統與 Agent | combination；reference | 待複核 |
| 38 | Workflow | [`ibkr-weekly-export-risk-adjusted-review`](../data/workflows/ibkr-weekly-export-risk-adjusted-review.json) | 資料與分析、求職與面試、安全與治理（3） | **商業與金融**<br>次：資料、分析與知識 | workflow；implementation | 初步合理 |
| 39 | Workflow | [`multi-model-interview-followup-and-feedback-practice`](../data/workflows/multi-model-interview-followup-and-feedback-practice.json) | 學習與教材、資料與分析、自動化與流程、求職與面試、安全與治理（5） | **職涯、招聘與面試**<br>次：AI 系統與 Agent | workflow；implementation | 初步合理 |
| 40 | Workflow | [`zeabur-oss-ai-assisted-self-hosted-install-workflow`](../data/workflows/zeabur-oss-ai-assisted-self-hosted-install-workflow.json) | AI Agent 與 Skills、前端與 UI 設計、自動化與流程、安全與治理（4） | **雲端與基礎設施**<br>次：自動化與整合 | workflow；implementation | 初步合理 |

## D. 8 筆原「需複核」：白話決策建議

> **如何看這區：** 「需複核」代表分類方案或資料結構有值得確認的問題，**不是這筆資料分類錯誤**。此表是根據現有 Canonical 資料提出的建議，不是已獲使用者核准的正式 Schema 變更。**先讓收藏能被正確找到；是否更換 Entity Type／合併資料應另外驗證。**

| # | 收藏 | 我建議怎麼分？ | 真正需要留意什麼？ | 現階段處理 |
|---:|---|---|---|---|
| 1 | [AI Cheat Sheets](../data/resources/aiposthub-awesome-opensource-ai-cheat-sheets-guide.json) | **主要：AI 系統與 Agent**；另標記「學習／參考教材」，跨域主題另以內容搜尋 | 教材橫跨 RAG、模型、評估和安全；無需為涵蓋多主題而設定四五個主要領域 | **分類建議可採用**；不新增 Domain |
| 2 | [TYSA 學習工具](../data/resources/akas333-tysa.json) | **主要：AI 系統與 Agent**；另標記「學習工具／學習用途」 | 產品使用 Agent 技術教學；只用 Agent Domain 會讓找學習工具的讀者不容易找到 | **分類建議可採用**；需確保「學習」Facet 可被搜尋 |
| 3 | [Code Graph](../data/resources/code-graph.json) | **主要：程式開發與品質**；可選次要「資料、分析與知識」 | 原本 `category=03 Code Intelligence` 已合理。「舊主題未命中」只是 Regex 沒涵蓋詞彙；是否應改 Entity Type 是**另一項**來源／資料模型問題 | **分類建議可採用**；Resource 身分與原始 Category 暫時不變 |
| 4 | [TYSA axiom-learn](../data/skills/akas333-tysa-axiom-learn.json) | **主要：資料、分析與知識**；另標記「學習用途」及 Skill 類型 | 核心動作是唯讀查詢與分析學習歷史；使用在教學情境不代表必須增設教育 Domain | **分類建議可採用**；保留與 TYSA Resource 的關聯 |
| 5 | [Google Maps 收藏整理 Prompt](../data/prompts/google-maps-saved-places-cleanup-classification.json) | **主要：自動化與整合**；可選次要「資料、分析與知識」，另標記「個人生產力」用途 | 個人整理是使用情境，流程自動化是主要方法；重要的是日後能在個人整理用途下搜尋到 | **分類建議可採用**；先不新增個人生產力頂層 Domain |
| 6 | [多 Agent Stack（Combination）](../data/combinations/agent-stack.json) | **主要：AI 系統與 Agent** | 它列出多個互補工具；[同名 Workflow](../data/workflows/agent-stack.json) 則有分工、路由、平行執行、驗證等步驟；這兩個 Entity 目前有不同的資訊價值 | **分類建議可採用**；先保留兩筆，不合併 |
| 7 | [Social Content Loop（Combination）](../data/combinations/voice-publish-evidence-social-content-loop.json) | **主要：內容、媒體與行銷** | Combination 目前只引用一項 Resource，且描述的是步驟；[對應 Workflow](../data/workflows/voice-publish-evidence-social-content-loop.json) 已有明確階段。需確認 Combination 有沒有獨立的「工具互補」資訊 | **分類先採用；結構審查延後**，不自動刪除或合併 |
| 8 | [Local PII Loop（Combination）](../data/combinations/local-pii-ai-processing-loop.json) | **主要：安全與治理** | Combination 目前只引用一項 Resource，實際是本機遮罩→雲端處理→本機還原流程；[對應 Workflow](../data/workflows/local-pii-ai-processing-loop.json) 已定義步驟，需再確認兩筆分工 | **分類先採用；結構審查延後**，不自動刪除或合併 |

### 簡化決策規則

1. **只要新 Domain 能讓人找得到，分類就先採用候選值**；不必因舊版 Regex 未命中或命中過多而重做。
2. **用途／形式用 Facet 表示**：教學資源、個人生產力、Repo、Skill 不強迫新增頂層 Domain。
3. **Entity Type／重複資料是獨立問題**：改 Resource 為 Concept、移除 Combination 或更改 Workflow 引用都屬後續資料結構工作，不是本次分類驗收要做的決策。
4. **只有需要不可逆或大量結構調整時才請使用者決定**。此輪 6 筆建議分類可先沿用；另外 2 筆僅保留結構審查待辦。

## E. 從樣本學到的五點

1. 原有九類將「學習」放在領域，同時依 Regex 掃描 Category、Tag、問題敘述；這些字串常表示資料形式、平台或風險，而非主要問題領域。
2. 成對 Resource／Skill 應能保留兩個 Entity，但主領域應依**目標問題**一致，例如 Hiring Panel 主屬職涯、Humanizer 主屬內容文字編修，來源 Repo／Skill 的差別由 Entity Type 表示。
3. 從抽樣可見 Cloud 與 Business 需要明確入口：Zeabur OSS 屬雲端部署；IBKR、投資風險與金融資源屬商業金融。過去「程式／資料／安全」命中不等於使用者主要意圖。
4. 目前最不確定的是**跨領域個人學習／個人資訊管理**：TYSA、Google Maps 清單整理可能難以在十類中自然選 Primary；此問題應由後續樣本回饋處理，而不是硬把一切塞入 Agent 或 Automation。
5. 組合與流程的差異需要後續專門審查：部分同名 Stack 同時存在 Combination 與 Workflow，且名稱帶「Loop」的 Combination 可能在描述有順序的操作。此輪只註記，不合併或改動引用。

## F. 不要誤判的幾個案例

- **Code Graph**：原資料的 `resourceType` 是「架構概念」，但現行 Entity Type 是 Resource。暫時照舊呈現於 Resource，不在此階段改為 Concept；後續應核對是否有獨立工具／來源。
- **Hiring Panel／Humanizer**：Resource 與 Skill 各有自己 ID 與來源，不能因名稱相似就去重。此輪只指定相同的主要領域，維持其不同 Entity Type。
- **TYSA**：屬學習輔助產品，也採 Agent Harness 技術。應在 UI 允許「尋找學習工具」時可找到；不能只因為它使用 Agent 就讓教育用途失去入口。
- **Prompt/Skill 的安全標記**：如果只是使用者資料處理需隱私審查，該警示屬 Metadata，不能自動當成 Security Domain。
- **Combination 與 Workflow**：可有共用能力與引用，但不要以文字相似自動合併或宣稱組件相容。待全部較基礎的 Resource／Skill／Prompt 整理後再做語意重整。

## G. 可執行的下一階段（尚未套用）

1. **優先補明定義，不改資料**：為每個 Domain 增加 3–5 個正例／反例；特別評估是否需設立「個人學習／生產力」子領域或 Facet。
2. **將 40 筆作為 provisional review set**：每筆保存主要用途所引用的原始欄位，對待複核項目讀取上游來源，再形成採用／修改／拒絕的判定。
3. **制定受控別名表**：先整理常見 `skill/skills/agent-skill`、`mit/mit-license`、`security-review` 等，使 Domain、Tech、Format、Status 不互相污染；舊 Tags 保留。
4. **小範圍 UI 試驗再變更**：當 Primary、Secondary、Facet 與搜尋需求都通過人工檢查，才新增 Schema、Index 映射、網站篩選器與回歸測試。
5. **驗證範圍**：548 筆可搜尋，六 Entity 不變，原 ID／Typed Reference 不變；對比舊版主題、搜尋結果、375／430／768／1440px 介面與 JS 例外。

## H. 此次完成／未完成

| 檢查 | 結果 |
|---|---|
| 已讀現行 548 筆 Catalog 與分類程式 | PASS |
| 抽樣全部六種 Entity | PASS |
| 每筆以 Canonical purpose／problem／goal 等欄位為依據 | PASS |
| 舊九主題 Regex 命中數重新計算 | PASS |
| 新 Primary／Secondary 不超出十種候選 Domain 與二次要領域規則 | PASS |
| 修改 Canonical、Schema、網站、Graph、Workflow | **未修改** |
| 所有 40 筆外部上游獨立核對、人工盲審 | **未執行** |
| 新分類的 Live 搜尋／瀏覽器驗收 | **未執行** |
