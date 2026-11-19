# Resources Batch 09 — 2026-11-19

## Scope
- 累積前八批 160 筆後，本批繼續 20 筆 Resources；逐筆查核官方 GitHub README／官方文件，原有正確內容不重寫。
- 270 Resources、549 Canonical、所有 ID、Category、Raw Tags、Typed References 不變；沒有建立新的 Graph Edge 或 Tag。
- 來源閱讀不是實際安裝、Build、Runtime、Security、License 或 Integration 驗收。

## Before → After
| Canonical ID | 原 Features/Requirements/Limitations | 新 Features/Requirements/Limitations | 本次補強 | 官方來源 |
|---|---|---|---|---|
| `agentic-system-lab-harness-relay` | 20/6/9 | 20/6/9 | 提供 Claude Code、Codex 等 Agent 的本機聊天室式協作與 Session 路由 | [官方文件](https://github.com/Agentic-System-Lab/harness-relay) |
| `gagansd-herdr-insights` | 5/3/0 | 5/3/1 | 彙整 Coding Agent Session 的 Token 用量與視覺洞察 | [官方文件](https://github.com/GaganSD/coding-agent-toolkit) |
| `graphify-labs-graphify` | 8/4/4 | 8/4/4 | 分析程式庫、文件與檔案結構以建立可查詢的知識圖譜 | [官方文件](https://github.com/Graphify-Labs/graphify) |
| `hao0321-editkin` | 8/0/5 | 8/1/5 | 本機 AI 協作剪輯器，處理可編輯影片時間軸與自動化控制 | [官方文件](https://github.com/Hao0321/Editkin) |
| `herdrdev-herdr` | 0/0/0 | 1/1/1 | 在單一桌面環境管理 Coding Agent 終端、工作階段與協作視窗 | [官方文件](https://github.com/herdrdev/herdr) |
| `humanlayer` | 0/0/0 | 1/1/1 | 在桌面與網頁介面統一檢視多個 Coding Agent 的任務、計畫及審核 | [官方文件](https://github.com/humanlayer/humanlayer) |
| `juneyaooo-rea-video` | 8/4/4 | 8/4/4 | 把影片逐鏡拆成製作技術、轉場與可重做的 VIDEO.md 規劃 | [官方文件](https://github.com/JuneYaooo/rea-video) |
| `kieiken-project-hub` | 9/0/0 | 9/1/1 | 集中管理本機專案、對話和 Claude Code／Codex 的交接狀態 | [官方文件](https://github.com/kieiken/project-hub) |
| `minchenlee-loadsketch` | 9/4/4 | 9/4/4 | 在可視覺化系統架構圖上模擬流量、延遲、重試與瓶頸 | [官方文件](https://github.com/minchenlee/loadsketch) |
| `mars-tw-freedom-erp-crm` | 6/0/0 | 6/1/1 | 以產業模板建構 ERP／CRM 模擬工作區並練習業務流程 | [官方文件](https://github.com/mars-tw/freedom-erp-crm) |
| `pingdotgg-t3code` | 0/0/0 | 1/1/1 | 以控制平面整合多種 Coding Agent 的工作階段與操作入口 | [官方文件](https://github.com/pingdotgg/t3code) |
| `twood2024-prelaunch-check-defense` | 7/4/5 | 7/4/5 | 提供 AI 開發網站上線前的防禦檢查清單與 Playbooks | [官方文件](https://github.com/Twood2024/prelaunch-check-defense) |
| `wquguru-cicada` | 6/0/0 | 6/1/1 | 提供會議與直播的語音辨識、即時字幕、翻譯和紀錄 | [官方文件](https://github.com/wquguru/cicada) |
| `zeabur-oss-ai-agent-installer-guide` | 7/5/4 | 7/5/4 | 提供自架服務平台的安裝參考，支援 Git、Docker Compose 和應用部署 | [官方文件](https://github.com/zeabur-oss/zeabur) |
| `lucide-icons` | 3/0/0 | 3/1/1 | 一致的開源 SVG 線條圖示及多種前端框架套件 | [官方文件](https://github.com/lucide-icons/lucide) |
| `pcottle-learn-git-branching` | 0/0/0 | 1/1/1 | 用 Git Commit Tree 沙盒及循序關卡教學 Branch 與 Merge | [官方文件](https://github.com/pcottle/learnGitBranching) |
| `lakris2407-herdr-agent-quota` | 5/0/0 | 5/1/1 | 在 Herdr 狀態列展示 Agent Provider 的用量或額度資訊 | [官方文件](https://github.com/Lakris2407/herdr-mods) |
| `google-fonts` | 3/0/0 | 3/1/1 | 提供字型預覽、篩選及網站字型 CSS API | [官方文件](https://developers.google.com/fonts/docs/getting_started) |
| `google-pagespeed-insights` | 4/0/0 | 4/1/1 | 用 Lighthouse 實驗室報告與 CrUX 真實使用者資料分析網站 | [官方文件](https://developers.google.com/speed/docs/insights/v5/about) |
| `openrouter-ai` | 0/0/0 | 1/1/1 | 提供不同模型供應商的 OpenAI 相容 API、路由與計費入口 | [官方文件](https://openrouter.ai/developers) |

## 使用步驟與風險
- **agentic-system-lab-harness-relay**：依上游 Quick Start 先在隔離環境確認各 CLI 與通訊服務條件。風險：跨 Agent 的權限、工具執行與檔案修改仍需由每個執行環境獨立驗證。
- **gagansd-herdr-insights**：依 Repo herdr-insights 子目錄和 Herdr Mods 安裝說明確認相容版本。風險：本機 Token 計數和成本估計不等於供應商實際帳單。
- **graphify-labs-graphify**：依官方安裝與 Prerequisites 先在小型非機密 Repo 索引。風險：圖譜關聯與搜尋命中不代表程式行為已完整理解或實際測試。
- **hao0321-editkin**：請區分 README 的 0.15 原始碼與 0.16 起另行發布的安裝程式。風險：作者標示 0.16 後為免費專有軟體，不可沿用 0.15 的 GPL 假設。
- **herdrdev-herdr**：依官方安裝入口與 Quick Start 確認平台需求。風險：Agent Session 權限與雲端模型費用需依各 Host 個別檢查。
- **humanlayer**：依 Repo Get started 確認 Bun、桌面客戶端及 Host Daemon 需求。風險：遠端操控 Agent 前應限制工作目錄、對外連線與核准權限。
- **juneyaooo-rea-video**：依官方 Quick start 先以有使用權的短片測試分析。風險：辨識實拍與 AI 生成屬推測，不能把重製計畫當成來源真相。
- **kieiken-project-hub**：依 Releases 選作業系統版本並核對本機 Agent 可用性。風險：本機桌面工作台不等於跨 Agent 的工具權限、資料或狀態完全同步。
- **minchenlee-loadsketch**：先用官方線上互動範例驗證負載假設，再決定是否本機安裝。風險：離散事件模型是教學近似，不能替代真實分散式系統壓力測試。
- **mars-tw-freedom-erp-crm**：先使用公開 Demo 的隔離工作區，或依 README 對應系統啟動範本。風險：模擬營運資料不可當正式財務或庫存紀錄，正式部署需另驗權限與備份。
- **pingdotgg-t3code**：依官方桌面或 CLI 安裝文件啟用，必要時另外登入模型 Host。風險：協作介面並不保證每種 Agent 的工具、模型與權限等價。
- **twood2024-prelaunch-check-defense**：先閱讀 Repo AGENTS.md 與各階段 Playbook，按技術堆疊選取檢查。風險：官方明示是防禦參考清單，不是一鍵安全掃描器或完整驗證工具。
- **wquguru-cicada**：依 README 依平台安裝並核對本機模型與選配 Ling API Key。風險：音訊錄製前須取得參與者適當同意；離線及雲端處理資料邊界不同。
- **zeabur-oss-ai-agent-installer-guide**：依原紀錄的繁體中文官方 AI Agent 安裝文件核對 SSH、環境需求及部署範圍。風險：SSH、伺服器安裝與憑證寫入屬高風險動作，需先明確核准。
- **lucide-icons**：依官方 Packages 文檔選 React、Vue、Svelte 等相容套件。風險：不同版本的 Icon 名稱或圖形可能調整，圖示語意與可及性須驗證。
- **pcottle-learn-git-branching**：先在官方互動網站完成關卡，再回到真實 Repo 演練。風險：互動沙盒是教學模擬，不包含真實協作 PR、權限與衝突處理全貌。
- **lakris2407-herdr-agent-quota**：先按官方 herdr-mods 文件確認 Herdr 相容版本與 Quota 模組設定。風險：供應商可能變動額度 API，UI 提示不可替代官方用量或收費紀錄。
- **google-fonts**：先於 Google Fonts 選字型，再依官方 Google Fonts API 文件使用 stylesheet。風險：需確認各字型所支援字集與授權，外部 CDN 請求亦有隱私及效能考量。
- **google-pagespeed-insights**：輸入網址後分別檢視行動與桌面結果，依官方文件解讀欄位。風險：CrUX 資料並非每個網址都有；實驗室數據受測試環境影響。
- **openrouter-ai**：依官方 Developer Platform 文件先建立 API Key 並確認 model ID 與路由設定。風險：不同模型及供應商費率、上下文、資料政策可能不同，不能將路由當成實測相容。

## Verification
- 官方來源、使用建議與限制已核對；Schema、Intake Gate、Graph／Catalog Sync、Browser Smoke 須由 PR 和 Main CI 確認。
- 未驗證的第三方執行結果不標示 PASS，未要求使用者提供任何 API 金鑰或執行官方腳本。
