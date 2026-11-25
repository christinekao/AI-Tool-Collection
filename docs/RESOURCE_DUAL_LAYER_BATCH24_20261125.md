# Resource 雙層改善 Batch 24（2026-11-25）

基線 main `9a1c108797185587749558abffa965da6e85633e`；PR #88 四項 CI 通過合併 `f19175b1096eee049171f7a4844d6a9183892cb7`。105/286 已合併（99 完成對應、6 deferred）。

| Resource | 前台案例 | 查核範圍 |
|---|---|---|
| pingdotgg-t3code | 規劃多個 Coding Agent 的分支與遠端核准流程 | 226113fee0682579155702b9e182c5a893aabbcf；固定版本 README、LICENSE、permission-modes、source-control、outside-agents、remote-access 文件；本批僅查文件契約，未追查服務端授權與 Git 執行實作。 |
| claude-codex-harness-sync | 規劃 Claude Code 與 Codex 的共用開發規則維護 | 1652082d36017d89729d17d517d1012556739fb2；固定版本 README、LICENSE、SKILL.md 及 inventory.py、classify_drift.py、validate_codex.py 的入口與局部實作；未核對現行兩平台所有設定語意，未執行本機掃描。 |
| df3011212-codex-local-board | 規劃多專案 Agent 工作進度與驗收看板 | 6b7080bf079b6fafb6f3b9ba34521cee2beee198；固定版本 README、LICENSE、agent_report.mjs、sync-all.mjs、board-node.mjs、chatgpt-pilot.mjs 的局部契約；未啟動本機看板、讀取私人對話或測試遠端入口。 |

3 mapped 候選；9 個用途、9 個局部能力、3 個 design-only 案例。保留分類、Tags、Typed Refs、原欄位、歷史用途及推薦，不新增 Graph Edge。

## 重要界線

- pingdotgg-t3code：不同 provider 權限語意不完全等價；文件所述初始預設為 Full access，需先調整。 單一 turn 的 Diff 不含純 Git pull、merge、rebase 帶入的變更；須另看完整分支比較。 外部 MCP 的授權可能涵蓋環境中所有專案；遠端連線須另核准並核對存取範圍。 未實測權限、遠端安全、Git 寫入及第三方 Agent 相容性；原始碼 MIT 不授予品牌權利。
- claude-codex-harness-sync：預設 dry-run；不得直接修改 Claude 端資料。 classify 以 Skill 名稱及部分路徑做差異分類，不代表內容等價或安全。 Hooks、MCP、memory、imports 需人工判斷；密鑰及帳號授權不得複製。 語法檢查與敏感字串掃描不能證明執行語意正確或沒有憑證；實際環境尚未測試。
- df3011212-codex-local-board：工具呼叫與執行中事件不是已完成工作；無明確驗收分母不可編造進度百分比。 非空 evidence 僅是回報格式條件，不是獨立驗證。 舊對話同步有容量及時間限制，可能消耗 Codex 額度；失敗或省略項目不能當完成。 對話摘要及本機路徑可能敏感；本批未測試遮蔽、手機存取或本機安全。

## Gate 與接續

新增雙向對應、Catalog 等值、固定版本與四尺寸回歸。CI 待執行；未執行第三方工具。合併前 105/286；通過後 108/286（102 完成對應、6 deferred），178 尚未改寫。下一批從尚未改寫的開發及自動化資源選擇；codex-router 原身分未確認，不擅自連結候選。排程停用。
