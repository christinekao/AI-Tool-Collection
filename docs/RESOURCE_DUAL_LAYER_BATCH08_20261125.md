# Resource 雙層改善 Batch 08（2026-11-25）

基線 main `2858a1b5814b4c09eca5f4aaa768c9e03a5a6ffb`；PR #72 四項 CI 通過並合併 `22388bcad52ef1f39f09244d87775da7e418be89`，Catalog Sync 確認。49/286 筆已合併雙層審查（46 完成對應、3 deferred）。

| Resource | 人類應用 | 固定版本與範圍 | 審查 |
|---|---|---|---|
| llm | 比較三個模型的摘要表現 | 46f0461d9b1ea9e898cac8a1d7333ab9bc6c8f7f；models.py、cli.py、plugins.py、README、LICENSE | mapped；模型、Plugin 與 LogStore 完整內部未查 |
| ollama-ollama | 本機研究筆記摘要 | 924cc286cc592f49c481fa84e15fa60dbc75989e；api/types.go、server/routes.go、README、LICENSE | mapped；完整 runner、Cloud、權限未查 |
| playwright | 申請表單儲存驗收 | b0e0b7b555e637cc8c0ce94dd98c3be153861333；locator.ts、browserContext.ts、README、LICENSE | mapped；server actionability、瀏覽器與 runner 未測 |
| n8n-io-n8n | 每日報表整理流程 | ba34719a31a9117002efb3db579f9aaf45bab4f5；workflow-execute.ts、workflow.ts、README、LICENSE.md、LICENSE_EE.md | mapped；節點、憑證、Webhook、佇列與授權適用性待查 |
| orca | 分開開發網頁與回歸測試 | a9ccd3042c4373579d5a48ccf045b0139deeb50d；README、LICENSE | deferred；兩個候選 Worktree 實作路徑 404 |
| hindsight | 跨任務研究記憶測試 | 550ef5e304623be2a456913acbac1b1a834fb2c3；README、LICENSE | deferred；兩個候選核心 Python 路徑 404 |

六筆改寫，4 mapped、2 deferred；18 個用途、18 個能力／證據單元、6 個 design-only 案例。逐筆寫入前比對原 ID、URL、Repo、Tags、分類、features、requirements、limitations 與全部 Typed Refs，保持不變。保留既有 implementationKnowledge。無新增全域 Graph Entity 或 Edge。

重要限制：LLM logs off 不會刪除舊紀錄；Ollama 本機入口不等於全部推論留在本機；Playwright storageState 可能含登入資料；n8n 的 SUL 與 EE 授權須依檔案及用途核對；Orca Worktree 不等於資安沙箱；Hindsight 的 bank 隔離只是 README 所述，尚未實測。全部第三方工具未安裝、執行或連接正式資料。

## Gate 與接續

新增 Catalog 等值、雙向映射、版本、缺口、未實測與四尺寸瀏覽器回歸。CI 及 Pages 依真實狀態，不事先標 PASS。合併前 49/286；若本批通過合併，55/286（50 完成對應、5 deferred），231 未改寫。待補：Microsoft AI Agents for Beginners、RAGFlow、AFFiNE、Orca、Hindsight；既有 Wellmade、Land-book、Designed to Scale 來源阻塞不計入已改寫。下一批優先 Codex、OpenUI 與其他來源可確認的 Agent/CLI 資源，排程維持停用。
