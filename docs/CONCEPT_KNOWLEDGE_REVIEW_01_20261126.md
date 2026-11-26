# Concept 知識關聯｜Review 01：盤點與優先辨識（2026-11-26）

基準 c2cfd5ed5f1c3aaf48e6a4c87192756104feb1f9。已盤點 data/concepts 全部 68 個 ID；CONCEPT_CONTENT_HANDOFF.md 記錄 11/23 的 68/68 內容整理、PR #48–#51 與部署驗收。此輪不是重做內容整理。實際讀取下列 20 個 Concept 的定義／方法及八個 Resource 的局部證據、既有 conceptRefs；未重新查核全部上游，尚未完成其餘 48 個 Concept 的語意及全庫入向／出向引用盤點。以下皆為審查結果或候選，不新增正式關聯。

## 1. 可能重疊概念：先辨識不同決策，而非依名稱合併

| Concept 群 | 核心差異 | 本輪處置 |
|---|---|---|
| persistent-agent-memory / cross-agent-shared-memory / cross-agent-memory-portability | 跨 Session 存續／多 Agent 同時共享可見知識／跨 Harness 交接交換契約 | 保留三筆；反例：單一 Agent 可持久、共享 DB 不等於可移植 |
| file-first-memory-source-of-truth / memory-observability | 正式儲存權威與衍生索引／來源、歷史、影響與過期可觀察 | 保留；DB 亦可設計可觀察記憶，File-first 本身不證明可觀察 |
| progressive-context-recall / context-governance | 分層按需召回／總體 Context 載入與治理政策 | 保留；前者是可重用機制，後者另包含 CLI 輸出及交接 |
| outcome-weighted-agent-memory / reflective-agent-learning | 根據可驗證結果調整召回權重／從經驗歸納可修訂規則 | 保留；召回排序不等於形成新規則，反思不等於事實 |
| reference-application-pattern-mining / reference-backed-pattern-mining / reference-as-prompt-evidence | 拆解成熟應用模式／多案例交叉比較原理／參考物可觀察訊號轉成 Prompt | 保留，前兩者仍有交集，待其餘引用與案例查核後決定是否需層級化；不自動合併 |
| quality-gates-verification / security-as-workflow-gate / evidence-before-execution / confidence-gated-automation | 交付證據／授權及安全放行／先驗核心效果／校準不確定性後決策 | 保留；功能通過不能替代授權，人工大綱核准不等於信心閾值 |

## 2. Resource 證據對照（八筆）

| Resource | 局部來源證據／既有 Concept | 處置與缺口 |
|---|---|---|
| wrenai | semantics / execution；已連 semantic-layer-for-ai、data-ingestion-normalization | 語意證明支持前者；None 不代表 SQL 無效，實際指標與資料庫取消另驗。資料 ingestion 關聯只見既有正式 ref，這次局部來源不足以獨立證明整個 ingestion，列後續覆核。 |
| zichuanlan-freebie-radar | dedup / signals / classification；已連 data-ingestion-normalization | 保留既有 ref；候選補強來源保留、誤合併及取得條件，不另建「免費資訊分類」Concept；網域不證明真實。 |
| thu-maic-openmaic | start / poll / outline；未見 conceptRefs | 候選對照 long-running-agent-operations、quality-gates-verification；非同步狀態及擁有者查詢、人工大綱版本與重送是可查契約，未證明 heartbeat/budget/resume 全部機制；先審局部關聯，不用 confidence-gated-automation。 |
| vulture-s-whisper-guard | segments / repeat / benchmark；已連 content-production-pipeline、quality-gates-verification | 候選補強品質驗收的誤刪、漏判、原文及獨立標註；未獨立查核完整 pipeline，不擴大既有關聯。 |
| nvidia-skillspector | input / ledger / llm；已連 reusable-agent-skills、security-as-workflow-gate、quality-gates-verification | 具體補強掃描覆蓋、部分完成與外送界線；零 findings 不代表安全。 |
| hindsight | retain / document-version / hybrid-recall / tenant-auth / reflect 等；既有 persistent-agent-memory、reflective-agent-learning、cross-agent-memory-portability、memory-observability、retrieval-grounded-knowledge-layer | deferred：儲存與召回局部證據不證明跨 Harness 移植、全租戶隔離或完整引用，既有 portability ref 需後續來源覆核，不提升狀態。 |
| orca | worker-stop-transaction / exited-terminal-release；已連 long-running-agent-operations 等 | deferred：狀態結算、實際程序終止與 Git 清理分離；可用作長任務取消驗收候選，非端到端證明。 |
| reactive-resume | version / tailor / track；已連 reference-application-pattern-mining | 版本、JD、已投遞文件與職缺關聯可供應用模式拆解；match score 寫入不等於錄取機率。 |

另已讀 agent-credential-isolation、semantic-layer-for-ai、data-ingestion-normalization、long-running-agent-operations 的定義／方法。上表各 Resource 來源位置詳見其 Canonical 中對應 local evidence ID 與 source.upstreamCommit；只引用已有證據，不宣稱執行過。

## 3. 下一輪固定範圍與停止條件

- 68 ID 已盤點，20 定義已對照，剩餘 48 定義待對照；下一輪先按 Agent architecture / orchestration / skill routing、再設計／媒體與資料安全分組。核對所有 Concept 的入向及出向 Typed References（Resource、Skill、Prompt、Combination、Workflow）；只記候選缺口，已有好內容不重寫。
- 對每一重疊組：問題、機制、輸入輸出、反例、至少一個不同決策；真正等價才提出遷移方案，未經使用者核准不執行。
- 對每一新候選：先找現有最接近 Concept；只有無法納入且跨至少兩個獨立來源有可驗收的共通原理時，才提出新增候選。單工具 feature、一般名詞、同義改寫不能成為新 Concept。
- 保留先前 Relationship Audit 06–08 的 17 Combo/36 Workflow 結論，不重新製造相同提案。第三方 Runtime、跨工具互通、完整授權均未實測。
