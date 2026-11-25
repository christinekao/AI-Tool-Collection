# Resource 雙層知識 Batch 36｜Agent 記憶與交接

基線 `a6287904d570519ea7642a361b97e1a272d7e8ff`；PR #94 四項 CI 已通過並合併，Catalog Sync 與最新 Pages 部署通過。

## ai-memory

- 版本 `78370da511b012f8410359df6ecf1fc7c6c39f21`；授權 MIT
- 用途：讓不同 Coding Agent 在同一專案接續先前的工作，保存已確認的決策、未解問題與交接資訊，不必反覆描述背景。
- 案例：規劃跨 Coding Agent 的持久記憶與交接；兩個測試 Agent、合成專案、可保存的決策與未解問題 → 範圍受控的記憶、待接收交接及可查回的來源 → 自有知識庫與開發協作工作流
- 局部能力及證據：
  - 先決定哪些專案與事件可以保存：crates/ai-memory-hooks/src/capture_policy.rs (CaptureMode,repository_admits_capture,CaptureDisposition,CaptureConfig)；預設 Denylist 在缺少 marker 時仍允許擷取；敏感專案應採明確 Allowlist 並測試所有事件類型，而非只測工具事件。
  - 交接尚未完成的工作：crates/ai-memory-core/src/handoff.rs (NewHandoff,HandoffState,HandoffAcceptance)；owner 為空可能發布到整個專案；型別不證明原子領取成功，須另測競態、授權與過期。
  - 依工作範圍檢索相關記憶：crates/ai-memory-web/src/recall.rs (Recall,RecallResult,search_scopes)；呼叫端須先解析允許的 scopes；embedding 與 reranker 是可選服務，啟用可能產生資料傳輸或費用，檢索命中不等於事實。

## amp-agent-memory-protocol

- 版本 `3b669c9b59f5fab030d1329c403eecfdedd9642a`；授權 AGPL-3.0-or-later 或商業授權；LICENSE 另含專利聲明
- 用途：以私有 GitHub Repo 的 Issues、留言及索引，讓多個 Agent 共享經驗、決策和待辦，不另建向量資料庫。
- 案例：規劃多 Agent 的 GitHub 記憶索引與按需讀取；合成 Issue 記憶、成功與失敗回饋、專案名稱及查詢 → 權重索引、相關記憶摘要及公開前隱私檢查 → 自有受控知識庫的記憶導航與交接流程
- 局部能力及證據：
  - 依使用結果整理記憶優先級：compile_index.ts (computeIssueWeight,computeCommentDelta,resolveInvalidations)；權重反映回饋與時間衰減而非真實性或統計信心；固定 lifefact 不自動衰減，仍須核實與修正。
  - 只讀取與目前專案及任務相關的記憶：adapters/lib/amp-recall.mjs (projectIdentifiers,matchPrompt,buildRepoRecall,buildPromptRecall,excerptOf)；名稱比對可能漏掉相關紀錄；快取可能過期，摘要不等於完整內容，必要時回查原 Issue。
  - 在公開前檢查秘密與個人資料：scripts/secret-scan.mjs (scanContent,scanPublicationArtifact,runScan)；私有模式會略過部分 Issue 衍生投影，公開模式另檢；掃描不是 DLP 保證，也不會清除已存在的 Git 歷史，不能將真實記憶寫到公開 Repo。

## hermes-memory-wiki

- 版本 `69436fad33b257f8ff41eec510299b5ade1fe1f5`；授權 MIT（封存版）
- 用途：將 Hermes 本機對話紀錄整理成可瀏覽的主題、每日工作摘要與長期記憶檢視頁，方便回查歷史。此原始 Repo 已封存並遷移。
- 案例：規劃個人 Agent 歷史對話的唯讀知識索引；合成 SessionDB 資料、記憶文件與不同 profile 測試資料 → 主題索引、日期活動、來源對話及記憶檢視 → 自有個人知識系統的唯讀記憶稽核介面
- 局部能力及證據：
  - 將對話按主題建立索引：dashboard/memory_wiki_core.py (extract_subject_candidates,build_memory_subjects,slugify_subject)；主題來自 deterministic heuristics，可能合併不相關名稱或漏掉語意；原始對話仍是證據。
  - 回查每日工作與長期記憶：dashboard/memory_wiki_core.py (build_daily_logs,build_memory_notes,build_memory_overview)；唯讀展示不會修正記憶；日期或擷取規則可能不完整，內容含私人資料時不得公開。
  - 依使用者 profile 讀取記憶頁面：dashboard/plugin_api.py (_open_db,_with_db,get_overview,get_subjects)；原始版本依賴 Host 認證及 profile scoping；read-only 只限制寫入，不代表能防止資料洩漏；新版插件契約尚未查核。

Hermes Memory Wiki 原 README 明示封存及遷移，保留舊 ID 與固定版本；新庫尚未查核。3 mapped 候選、9 用途、9 局部能力、3 design-only 案例；第三方未實測，PR CI 待驗收。原分類與既有知識關係不變。
