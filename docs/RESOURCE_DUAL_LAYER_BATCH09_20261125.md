# Resource 雙層改善 Batch 09（2026-11-25）

基線 main `be4dfae6633245715e4d506c5aae9b28d0080134`；PR #73 四項 CI 通過、合併 `402e0dda7e37c8822e257b3fa4ce04829bc65476`，Catalog Sync 已確認。55/286 筆已合併（50 完成對應、5 deferred）。

| Resource | 人類用途案例 | 固定版本及查核範圍 | 結果 |
|---|---|---|---|
| openai-codex | 修正表單儲存錯誤 | ebd0765aafa255d63ebf690ebdffe0164dc14a0c；protocol.rs 的核准及中止事件、exec.rs 的命令與執行契約、README、LICENSE | mapped；未查完整 agent loop、沙盒與核准執行策略 |
| openui | 呈現研究摘要與來源卡片 | 2465d2bda7eb470cf5a29618d123d0940a8ca731；library.ts、parser/parser.ts、parser/prompt.ts、react-lang/exports.ts、README、LICENSE | mapped；Renderer 只核對匯出，完整 action、telemetry 及跨框架實作未查 |
| vercel-labs-skills-cli | 專案專用程式審查技能 | 57217cf86ba38148a57af9e90d14a4c049558330；src/skills.ts、src/installer.ts、src/cli.ts、README、LICENSE | mapped；下載、完整 symlink 防護、鎖定、移除及遙測待查 |
| browser-use-browser-use | 公開文件指定欄位整理 | 94784c1f7ecb6b0a5f565b7f9fba59e395b7e048；browser_use/agent/service.py、README、LICENSE | mapped；舊 browser/session.py 404，已取得 Agent 入口，底層 harness、CDP、REPL 安全待查 |
| anomalyco-opencode | 先分析再修正網頁顯示問題 | e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91；README、LICENSE | deferred；兩個角色及權限候選路徑 404，已保留文件證據 |

五筆已改寫，4 mapped、1 deferred；15 個用途、15 個局部能力／文件證據、5 個 design-only 案例。逐筆寫入前核對原 ID、Repo、URL、Tags、分類、features、requirements、limitations 與所有既有 Typed Refs 不變；既有 implementationKnowledge 保留。無新增全域 Graph Entity 或 Edge。

重要限制：Codex Interrupt 不會終止背景終端；OpenUI 元件 schema 不是業務權限；Skills CLI 格式檢查不是安全驗證；Browser Use timeout 不含瀏覽器啟動與收尾，同一 Browser 不允許平行 run；OpenCode 角色名稱不構成沙箱。全部工具未安裝或實測。

## Gate 與接續

新增 Catalog 等值、雙向解析、固定版本來源、未實測與四尺寸瀏覽器回歸。CI 與 Pages 狀態依實際結果，不事先標 PASS。合併前 55/286；本批若通過並合併，60/286（54 完成對應、6 deferred），226 未改寫。OpenCode 加入 deferred，其他既有缺口保留。Dify 尚未改寫，不計入本批。下一批優先 Dify、Open WebUI、Crawl4AI 等未改寫資源；排程維持停用。
