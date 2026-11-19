# Resources Batch 08 — 2026-11-19

## 改善邊界
- 排除已完成 Batch 01–07 的 140 筆，另外核對 20 個正式 Repo 的 README；原本已正確的用途與功能保留，必要時只補 Requirements、Limitations。
- 不修改 ID、Category、Tags、Typed References；549 Canonical／270 Resources 不變，不增加新 Tags 或 Graph 關聯。
- 本批僅為 Source Reviewed；未執行安裝、Build、Runtime、Security、License、Integration。

## Before／After 逐筆差異
| Resource | 原 Features/Requirements/Limitations | 新 Features/Requirements/Limitations | 新查核內容 | 上游來源 |
|---|---|---|---|---|
| `akseolabs-seo-cinematic-ui` | 5/0/0 | 5/1/1 | 電影導演式網站視覺設計，分鏡、鏡位與實際畫面檢查 | [README](https://github.com/akseolabs-seo/cinematic-ui/blob/main/README.md) |
| `alchaincyf-huashu-motion` | 6/0/0 | 6/1/1 | 用 HTML 與 GSAP、Canvas、SVG 製作可編輯的產品影片 | [README](https://github.com/alchaincyf/huashu-motion/blob/main/README.md) |
| `alexyc9381-hiring-panel-skill` | 6/4/4 | 6/4/4 | 以多角色模擬履歷審查並依證據修訂 | [README](https://github.com/alexyc9381/hiring-panel-skill/blob/main/README.md) |
| `allanyiin-documa` | 7/0/4 | 7/1/4 | 本機文件解析、結構化 IR、區塊檢索與引用 | [README](https://github.com/AllanYiin/Documa/blob/main/README.md) |
| `allanyiin-toolanything` | 9/3/4 | 9/3/4 | 一次定義 Python Tool Contract，重用於 MCP、CLI 與 OpenAI | [README](https://github.com/AllanYiin/ToolAnything/blob/main/README.md) |
| `anomalyco-opencode` | 6/0/0 | 6/1/1 | 多模型 Coding Agent、終端及桌面工作區 | [README](https://github.com/anomalyco/opencode/blob/main/README.md) |
| `bi0h4z4rd88-pi-sidebar-tui` | 5/3/0 | 5/3/1 | Pi 終端顯示 Context、Token、MCP 與 Git 工作區狀態 | [README](https://github.com/bi0h4z4rd88/pi-sidebar-tui/blob/main/README.md) |
| `googlechrome-modern-web-guidance` | 7/3/4 | 7/3/4 | Coding Agent 可檢索現代 Web API 指引並掃描過時用法 | [README](https://github.com/GoogleChrome/modern-web-guidance/blob/main/README.md) |
| `heydamir-unslop` | 6/0/4 | 6/1/4 | 用設計審查改善缺乏特色的 AI 產生介面 | [README](https://github.com/heydamir/unslop/blob/main/README.md) |
| `kepano-40-questions` | 4/0/3 | 4/1/3 | 以固定年度／十年提問進行長期反思 | [README](https://github.com/kepano/40-questions/blob/main/README.md) |
| `openclaw-openclaw` | 6/0/0 | 6/1/1 | 自架 AI Agent Gateway 串接聊天、模型、工具及技能 | [README](https://github.com/openclaw/openclaw/blob/main/README.md) |
| `vercel-labs-skills-cli` | 5/0/0 | 5/1/1 | 跨 Agent 搜尋、安裝、更新及管理 SKILL.md | [README](https://github.com/vercel-labs/skills/blob/main/README.md) |
| `thu-maic-openmaic` | 7/0/0 | 7/1/1 | 以 AI 教師與 AI 同學組成互動教材、測驗及投影片 | [README](https://github.com/THU-MAIC/OpenMAIC/blob/main/README.md) |
| `nvidia-auto-ontology` | 7/0/4 | 7/1/4 | 從資料庫中建構語意模型、Business Metric 與可信 SQL 工作流 | [README](https://github.com/NVIDIA/auto-ontology/blob/main/README.md) |
| `zichuanlan-freebie-radar` | 8/3/4 | 8/3/4 | 自架多主題訊息雷達，規則加 AI 分類及 Telegram 通知 | [README](https://github.com/ZiChuanLan/freebie-radar/blob/main/README.md) |
| `kepano-obsidian-minimal` | 5/0/3 | 5/1/3 | Obsidian 低干擾主題、字體配色與版面延伸 | [README](https://github.com/kepano/obsidian-minimal/blob/main/README.md) |
| `nutlope-hallmark` | 9/3/4 | 9/3/4 | 以視覺設計系統、主題與 Lint 檢查改善網站 | [README](https://github.com/Nutlope/hallmark/blob/main/README.md) |
| `zed-industries-zed` | 6/0/0 | 6/1/1 | 高效能多人協作程式編輯器與 AI 開發入口 | [README](https://github.com/zed-industries/zed/blob/main/README.md) |
| `kubai087-kubai-icons` | 5/0/0 | 5/1/1 | 用固定形狀與動畫規則製作跨框架 SVG Icons | [README](https://github.com/kubai087/kubai-icons/blob/main/README.md) |
| `danyuchn-claude-work-mode` | 7/2/3 | 7/2/3 | Claude Code auto、out、wrap 工作模式及選配 Hook Gate | [README](https://github.com/danyuchn/claude-work-mode/blob/main/README.md) |

## 使用方式與限制
- **akseolabs-seo-cinematic-ui**：依官方 README 選擇 Agent Skill 安裝方式並提供產品 Brief；動態設計仍需通過可讀性、效能及可及性檢查。
- **alchaincyf-huashu-motion**：先確認渲染、瀏覽器及音效的使用條件；影片生成及音樂素材的授權和效能須另外驗證。
- **alexyc9381-hiring-panel-skill**：依官方方式載入 Skill，附上履歷及目標職缺；多次子 Agent 呼叫會耗用模型額度，模擬結果非真實 ATS。
- **allanyiin-documa**：README 需要 Python 3.10 以上；依文件選 CLI、MCP 或 Python；下游 Agent 仍可能外送擷取文字，複雜 PDF 需抽樣檢查。
- **allanyiin-toolanything**：依 README 建立 Tool Contract 並用 doctor 或 inspect 檢查；不是完整 Agent Framework，API 和 SQL 權限需獨立治理。
- **anomalyco-opencode**：依 README 選擇安裝方式，在測試 Repo 驗證工具權限；具備讀寫程式碼及執行指令能力，須備份和最小權限。
- **bi0h4z4rd88-pi-sidebar-tui**：依 README 核對 Pi Host 版本與 Extension 安裝方式；用量與額度是 UI 估算資訊，並非官方帳單證據。
- **googlechrome-modern-web-guidance**：依 README 先 search 或 retrieve，再核對目標瀏覽器；自動掃描不可替代跨瀏覽器、無障礙或資安實測。
- **heydamir-unslop**：依官方 Skill 文件導入 Agent Host，提供原始 UI 與 Brief；視覺改善須另驗證無障礙、效能及品牌一致性。
- **kepano-40-questions**：依 README 選年度或十年清單，保留答案供未來比較；私人回答不應公開；清單不能代替心理健康評估。
- **openclaw-openclaw**：先依官方 Security／Quickstart 審查設備和權限範圍；連接 Shell、外部服務和 Skills 可能造成資料外送及副作用。
- **vercel-labs-skills-cli**：以 npx skills 找候選，確認上游來源、Host 及權限；不可信第三方 Skill 可能含提示注入及腳本風險。
- **thu-maic-openmaic**：依 README 安裝套件、設定模型憑證與資料庫；生成教學內容可能出錯；部署時需管控費用和使用者資料。
- **nvidia-auto-ontology**：依 Quickstart 選 Connector，在非敏感資料集驗證；自動產生的業務語意與關聯需人工覆核及權限約束。
- **zichuanlan-freebie-radar**：依 Docker Compose 或 Node.js 流程設定管理 Token；需要登入網站時可能接觸 Cookie，來源優惠有期限限制。
- **kepano-obsidian-minimal**：在 Obsidian 主題選單啟用，另選安裝設定插件；是 UI 主題而非資料備份方案，插件和手機相容性需檢查。
- **nutlope-hallmark**：先依 README 安裝 Skill，渲染檢查須有 Chrome 環境；靜態 Lint 不等於實際可及性與品牌品質驗收。
- **zed-industries-zed**：依官方下載頁選擇 macOS、Linux 或 Windows 版本；Repo 核心主要為 GPL-3.0-or-later，其他元件條款另確認。
- **kubai087-kubai-icons**：依官方 Icon 套件與 Skill 指引選擇 React、Vue 或 Web 元件；動態圖示需測試效能、鍵盤操作與減少動態效果偏好。
- **danyuchn-claude-work-mode**：依 README 安裝插件，額外 Gate 先確認 bash、jq、Git、Python；不得越過安裝、憑證、資料外送、付款等重大授權邊界。

## Gate
- 合併前確認 Unified Intake、V2 Data Validate 與 Graph Unit Tests 皆 PASS；合併後確認 Main Sync、Smoke 和 Pages Deploy。
- 來源宣稱不等同已執行或授權，未建立深度 Repo Guide 與未知的 Capability。
