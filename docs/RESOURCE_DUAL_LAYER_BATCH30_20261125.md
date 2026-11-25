# Resource 雙層知識 Batch 30｜Agent 用量與可觀測性

共同驗收基線 `fde96af41f63a655290afd95879f188d83167383`；Batch 29–35 集中同一 PR，逐組保存紀錄，不把候選計入已合併。

## bi0h4z4rd88-pi-sidebar-tui

- 版本 `38d2a33a3fdbd2f5f24c19d79805a62025ae7d41`；授權 package.json 宣告 MIT；未找到獨立根 LICENSE
- 用途：在 Pi Coding Agent 終端旁顯示 Context、Token、工作待辦、MCP 與 Git 工作區資訊。
- 案例：規劃 Pi 終端內的 Context 與任務資訊面板；合成 Session 用量、待辦、Git 及 MCP 連線狀態 → Context 預警、待辦及工作區概覽 → 自有 Agent 操作介面
- 局部能力及證據：
  - 估算 Context 剩餘空間：panels/session.ts (estimateCtxLeft,renderSessionPanel)；近期增長率只是假設；樣本不足顯示未知，不能保證剩餘回合或費用。
  - 呈現目前工作清單：panels/todos.ts (selectTodosToShow,renderTodosPanel)；工具回報的完成不等於獨立驗收；截斷時保留完整清單供追溯。
  - 查看工作區與 MCP 連線：panels/workspace.ts (renderWorkspacePanel,buildGitStatus)；Git 工作區顯示不是完整 Diff 審查，MCP Token 估算及連線不證明可安全執行。

## gagansd-herdr-insights

- 版本 `e3b5e20ca7ff156f650f983e82ab9e152b890ea0`；授權 MIT
- 用途：把不同 Coding Agent 的本機用量集中整理成模型、時間與活動趨勢，協助看出使用習慣。
- 案例：規劃跨 Coding Agent 的本機用量分析；合成 Pi、Codex、Claude Code 日誌與測試日期範圍 → 可查核的用量摘要、趨勢與資料品質警告 → 自有 AI 使用量儀表板
- 局部能力及證據：
  - 正規化不同 Agent 用量：herdr-insights/mods/insights/core/adapters.mjs (parsePi,parseClaude,codexEndsForkReplay)；Codex fork 邊界僅在可靠 UUIDv7 時可判定；不明記錄可能漏算或重算，應保留警告。
  - 建立可讀的本機統計快照：herdr-insights/mods/insights/collector.mjs (collectSnapshot,readCommittedSnapshot,DEFAULT_SCAN_BUDGET_MS)；分清已提交快照與未完成掃描；用量 metadata 不等於原始完整 Session。
  - 比較每日與各模型使用量：herdr-insights/mods/insights/analytics.js (PERIODS,HEATMAP_MODES,dayKey)；日期、快取統計與供應商格式不同；不得把 Token 直接換成未核實的費用。

## lakris2407-herdr-agent-quota

- 版本 `b6fdb2ffb1207f8f686dffdd6addc19fe696d435`；授權 MIT
- 用途：在 Herdr 狀態列看到不同 Coding Agent 的使用額度、重設時間與使用速度，避免工作中途才發現用量不足。
- 案例：規劃跨供應商使用額度與支出的提醒面板；合成供應商額度視窗、重設時間與美元使用紀錄 → 額度與使用節奏顯示、支出及錯誤提示 → 自有 AI 使用量與成本觀察介面
- 局部能力及證據：
  - 收集供應商額度資料：quota/mods/quota/quota-data.js (loadQuota,readQuota)；quota-axi 使用既有登入狀態，錯誤不應顯示為零用量；需另行核准查詢。
  - 區分五小時、每週與每月限制：quota/mods/quota/quota-windows.js (visibleWindows)；used-share 非獨立額度；時間進度與用量百分比不能推導硬性費用上限。
  - 獨立呈現 OpenRouter 支出：quota/mods/quota/openrouter.js (parseOpenRouter,KEYCHAIN_SERVICE)；程式涉及 Keychain 與外部服務；不得讀取或輸出真實憑證，美元支出不是百分比視窗。

3 mapped 候選；9 用途、9 能力、3 design-only 案例。來源已查閱，第三方未實測；共同 PR CI 待驗收。
