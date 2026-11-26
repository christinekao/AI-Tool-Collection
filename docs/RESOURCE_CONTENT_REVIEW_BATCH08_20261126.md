# Resource 內容品質稽核 Batch 08｜20 筆（2026-11-26）

## Scope / Evidence
基於 PR #128 Head fa0ae2bc5880928bbc6234963c4c34b60f88e0de；開始時 main 59e24fa8b1ab8ebb03675e6ff717347a9ee37ba0。#128 V2 Data Validate 45778020065、Unified Intake 45778020017、Live Pages Smoke 45778019993 PASS；P1 45778019882 四尺寸 Browser Smoke 尚執行。#127 合併後 Catalog Sync 45778041922、Pages 45778069505 PASS；比對共同祖先後確認 main 端僅生成 catalog 與 graph 變更。正式 deployed Chromium 未驗收。

依 main 的 286 個 Canonical ID 排序讀取第 141–160 筆完整 JSON。核對用途、useCases、example I/O/steps/destination、start、limits、來源範圍及證據與 runtime 狀態。沿用既有證據，未重讀全部上游或執行第三方。先準備本批，待 #128 合併後指向 main 並驗收四項 CI。

| ID | 結果 | 修正或保留理由 | 既有來源錨點 |
|---|---|---|---|
| kepano-obsidian-minimal | P1 修正 | 專注閱讀、卡片、明暗與實際 DOM/可及性 | focus-mode.scss / cards.scss / flexoki.scss |
| kepano-obsidian-vault-template | P1 修正 | 日誌、剪藏、專案欄位與既有知識架構 | Daily Note / Clipping / Project Template |
| kerr20801-taiwan-stock-ai-analyzer | P1 修正 | 白話用途、0.5 回退、隨機新聞分數與掃描候選，不當成市場證據 | technical_indicators.py / market_sentiment_engine.py / market_scanner.py |
| kieiken-project-hub | P1 修正 | 雙專案排隊、交接、工作區及本機服務邊界 | queue.js / handoff-admission.js / README.en.md |
| kkkkhazix-khazix-skills | P1 修正 | 按工作需求獨立選擇技能，磁碟刪除與事實核對 | leader / storage-analyzer / khazix-writer |
| kokonut-ui | 保留 | controlled/demo、核准回呼、真實事件與焦點已具體 | ai-tool-approval.tsx / gradient-button.tsx |
| kubai087-kubai-icons | P1 修正 | React、HTML、靜態 SVG 選型及不同授權 | packages/react / core / static / LICENSE-ICONS |
| lakris2407-herdr-agent-quota | P1 修正 | 額度時間窗、美元支出、錯誤與憑證界線 | quota-data.js / quota-windows.js / openrouter.js |
| land-book-design-inspiration | Deferred 保留 | 既有指引已涵蓋來源限制、作者、權利與人工驗收；直連仍受限 | 2026-01 條款索引 / Submission Guidelines |
| landing-love | 保留 | 首頁互動問題、少量參考與自有動效規格已具體 | 官方目錄 |
| langgenius-dify | 保留 | 最短流程、逐節點驗收及多租戶授權已具體 | workflow_entry.py / LICENSE |
| lawpowen-ui-design-codex-bundle | P1 修正 | 白話檢索、CSV 欄位、重複識別及非可執行規則 | search.py / validate_data.py / reasoning_contract.py |
| laya | P1 修正 | 白話本機選項判斷、標籤、序列預算、校準與標註驗收 | schema.cpp / sequence.cpp / Calibration.cs |
| leemysw-yovoice | P1 修正 | 旁白版本、取消、Draft ID、檔名隱私及人工聆聽 | validate.go / generation.go / output_name.go |
| lemomo-ai-lemo-opuscar | P1 修正 | 白話時間軸、閱讀時間、字幕及實際播放 | events.mjs / readcheck.mjs / srt.py |
| leonxlnx-taste-skill | P1 修正 | 產品內容、設計規格、具理由的 waiver 及瀏覽器證據 | SKILL.md / gate.mjs |
| letswrite-buzz-self-hosted-relay-guide | P1 修正 | 端點、身分、健康檢查及最小權限；不套用不安全示例 | 原作者 DEV 轉載部署／連線／Agent 章節 |
| lieflat-less-ai-tone | P1 修正 | 繁中改稿、事實清單、語意判讀及差異證據 | detect.py / report.py |
| littlehole2025-token-saver | P1 修正 | usage 門檻、群組與交接提示，不直接操作 Session | long-chat-reminder.js / session-group-reminder.js / handoff |
| llm | 保留 | 相同題目、插件、日誌及資料保留已具體 | models.py / plugins.py / cli.py |

## Change Integrity / Verification
- 20/20 已讀取；15 筆候選修正、5 筆保留（含 Land-book deferred）。更新 readerGuide.start 15 筆、purpose 4 筆。逐筆還原允許欄位後完整 JSON 一致；案例、來源、Evidence、ID、分類、Tags、Typed References、Graph 關係及 mapping/runtime 狀態不變。
- 新增 15 筆單元與瀏覽器文字回歸，另驗證 Land-book deferred 及股市模擬資料不可作市場證據。四項 CI 通過才可合併。未重新查證時效性資料，未測第三方或提升 deferred。
- P2：保留部分片段式 useCase.detail、重複 limits 與歷史措辭。Khazix 合集與 Kubai 多種介面情境為可分別採用的候選，既有案例為合併示意，不代表所有路徑必須實作；本輪在 start 明確區分。

## Progress / Next
- 起始正式審查 120/286，含 #128 及本批候選累計 160/286；映射基準 268/286、14 deferred、4 source-blocked 不變。下一批 loopagentteams 起，按 main 確認第 161–180 筆。
- 依序完成合併、Catalog Sync、Pages 及獨立正式網站 Chromium 驗收。
