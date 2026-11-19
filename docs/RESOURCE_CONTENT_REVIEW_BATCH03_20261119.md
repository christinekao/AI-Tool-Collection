# Phase 2 — Resources Batch 03（2026-11-19）

## 查核範圍與資料邊界
- 從尚未進行 Phase 2 來源查核的正式 Resources 中選取 20 筆。**保留原始 Purpose／Recommendation 中沒有證據衝突的內容**；更新已過時的 Claude SEO／Diagram Design 數量。
- 對照官方 GitHub Repository README，另查看 Copywriting Skill 的 SKILL.md；只加入來源有記載的功能、使用準備及特定風險。
- 僅更新 Canonical Resource、派生 Catalog／Graph 與本報告。保留所有 ID、六類實體數量、分類、原始 Tags、Typed References 和原始來源。
- **不得把 Source Reviewed 說成已安裝或實際使用。** 原始碼逐檔追蹤、授權文件深度核對、第三方建置、Runtime／Integration／Security Test 尚未完成。
- Repo Guide 因不具完整程式碼與測試證據仍標為 deferred。

## Before → After
| # | ID | Before 用途 | After 用途 | 上游來源 |
|---:|---|---|---|---|
| 1 | `agricidaniel-claude-seo` | 將 SEO Audit、PageSpeed / Core Web Vitals、robots/sitemap、Schema.org、E-E-A-T、地方 SEO、電商 SEO、GEO/AI 搜尋可見度與 Agent Readiness 分類為 Cla | 以 Claude Code 專用 SEO Plugin 執行網站技術、內容、Schema、PageSpeed、GEO／AI 搜尋可見度等查核，官方現行 README 列出 29 個子技能及 20 個專業 Agents，產生依重要性排序的修正建議。 | [上游文件](https://github.com/AgriciDaniel/claude-seo/blob/main/README.md) |
| 2 | `ai-memory` | 替 AI coding agents 建立跨 Agent、跨機器、跨團隊的長期記憶與 handoff 基礎設施。透過 lifecycle hooks 自動擷取 prompts、tool calls 與 session boundaries，將記憶整理 | 替 AI coding agents 建立跨 Agent、跨機器、跨團隊的長期記憶與 handoff 基礎設施。透過 lifecycle hooks 自動擷取 prompts、tool calls 與 session boundaries，將記憶整理 | [上游文件](https://github.com/akitaonrails/ai-memory/blob/main/README.md) |
| 3 | `akas333-tysa` | 先診斷學習者已知與未知的概念，再建立依賴關係學習地圖，逐步教學、檢查理解並修復混淆，最後透過練習與知識圖譜支援跨 Session 學習。 | 先診斷學習者已知與未知的概念，再建立依賴關係學習地圖，逐步教學、檢查理解並修復混淆，最後透過練習與知識圖譜支援跨 Session 學習。 | [上游文件](https://github.com/Akas333/TYSA/blob/main/README.md) |
| 4 | `amp-agent-memory-protocol` | 讓多個 AI agents 跨 session 共用記憶與溝通，不需要獨立 vector database 或常駐 server。AMP 把 GitHub repository 當作 shared brain：Issues 是記憶單元與 inbox、 | 讓多個 AI agents 跨 session 共用記憶與溝通，不需要獨立 vector database 或常駐 server。AMP 把 GitHub repository 當作 shared brain：Issues 是記憶單元與 inbox、 | [上游文件](https://github.com/RxAi-Aus/amp/blob/main/README.md) |
| 5 | `anthropics-financial-services` | Anthropic 金融服務業專用的參考 Agent 與 Skills 集合，支援 Claude Cowork 插件、Claude Code Plugin Marketplace 及 Claude Managed Agents API 模板。涵蓋投資 | Anthropic 金融服務業專用的參考 Agent 與 Skills 集合，支援 Claude Cowork 插件、Claude Code Plugin Marketplace 及 Claude Managed Agents API 模板。涵蓋投資 | [上游文件](https://github.com/anthropics/financial-services/blob/main/README.md) |
| 6 | `anthropics-knowledge-work-plugins` | 以職能為單位提供可在 Claude Cowork／Claude Code 使用的知識工作插件。核心用途涵蓋 Productivity、Sales、Customer Support、Product Management、Marketing、Legal、 | 以職能為單位提供可在 Claude Cowork／Claude Code 使用的知識工作插件。核心用途涵蓋 Productivity、Sales、Customer Support、Product Management、Marketing、Legal、 | [上游文件](https://github.com/anthropics/knowledge-work-plugins/blob/main/README.md) |
| 7 | `anthropics-sandbox-runtime` | 提供獨立於完整 Container 的 Agent 執行權限邊界：以 macOS sandbox-exec/Seatbelt、Linux bubblewrap 和 Windows（Alpha）受限帳戶與 WFP 防火牆機制，限制 CLI 命令、Age | 提供獨立於完整 Container 的 Agent 執行權限邊界：以 macOS sandbox-exec/Seatbelt、Linux bubblewrap 和 Windows（Alpha）受限帳戶與 WFP 防火牆機制，限制 CLI 命令、Age | [上游文件](https://github.com/anthropics/sandbox-runtime/blob/main/README.md) |
| 8 | `anthropics-single-agent-loop-kit` | Anthropic 官方釋出的 Agent 架構精簡參考實作：盤點 Router、Planner 與 Subagents，先建立端到端 Eval Baseline，再逐一合併高度耦合的 Agent，或將專業規則拆成 Skills、API 動作拆成 T | Anthropic 官方釋出的 Agent 架構精簡參考實作：盤點 Router、Planner 與 Subagents，先建立端到端 Eval Baseline，再逐一合併高度耦合的 Agent，或將專業規則拆成 Skills、API 動作拆成 T | [上游文件](https://github.com/anthropics/single-agent-loop-kit/blob/main/README.md) |
| 9 | `arumwu-agentrelay` | 讓 Claude Code、Codex 與其他 Coding Agents 在同一個 Git Repo 或跨多 Repo 工作區協作，管理 Agent Sessions/Heartbeat、到期 Task Leases、檔案與 Glob Scope  | 讓 Claude Code、Codex 與其他 Coding Agents 在同一個 Git Repo 或跨多 Repo 工作區協作，管理 Agent Sessions/Heartbeat、到期 Task Leases、檔案與 Glob Scope  | [上游文件](https://github.com/arumwu/agentrelay/blob/main/README.md) |
| 10 | `ath-maas-pixelle-video` | 主題／文本到短影音的模組化 Python/Streamlit 工具：由 LLM 生成腳本、圖片與影片、TTS 配音、BGM、分鏡鏡頭剪輯合成，可配置 ComfyUI、RunningHub、本機或多家付費雲端圖片／影片 API；包含數位人、動作轉移、圖 | 主題／文本到短影音的模組化 Python/Streamlit 工具：由 LLM 生成腳本、圖片與影片、TTS 配音、BGM、分鏡鏡頭剪輯合成，可配置 ComfyUI、RunningHub、本機或多家付費雲端圖片／影片 API；包含數位人、動作轉移、圖 | [上游文件](https://github.com/ATH-MaaS/Pixelle-Video/blob/main/README.md) |
| 11 | `aws-samples-sample-agent-cost-bench` | 在相同程式開發任務與驗收條件下，比較多個 AI Coding CLI／模型的執行費用、原生額度或 Token、品質／測試通過率與耗時。提供 cli-compare（跨 Kiro、Claude Code、Codex、Copilot、Cursor、Ope | 在相同程式開發任務與驗收條件下，比較多個 AI Coding CLI／模型的執行費用、原生額度或 Token、品質／測試通過率與耗時。提供 cli-compare（跨 Kiro、Claude Code、Codex、Copilot、Cursor、Ope | [上游文件](https://github.com/aws-samples/sample-agent-cost-bench/blob/main/README.md) |
| 12 | `blader-humanizer` | 基於 Wikipedia Signs of AI Writing 的可觀察文字特徵，檢查並改寫 26 種常見 AI 文風習慣，包括空泛對比、單句結尾、三段式堆疊、過度強調、裝飾格式、缺乏明確主體或與讀者需求錯位等；保留來源可查證的事實、引文、專有名詞 | 基於 Wikipedia Signs of AI Writing 的可觀察文字特徵，檢查並改寫 26 種常見 AI 文風習慣，包括空泛對比、單句結尾、三段式堆疊、過度強調、裝飾格式、缺乏明確主體或與讀者需求錯位等；保留來源可查證的事實、引文、專有名詞 | [上游文件](https://github.com/blader/humanizer/blob/main/README.md) |
| 13 | `blave-agent` | 開源的 agentic quant workspace，可連接 Claude Code 或 Codex，讓 Agent 將交易想法轉成策略程式、執行回測與研究；實際排程與下單則由 deterministic code / scheduler 執行，而 | 開源的 agentic quant workspace，可連接 Claude Code 或 Codex，讓 Agent 將交易想法轉成策略程式、執行回測與研究；實際排程與下單則由 deterministic code / scheduler 執行，而 | [上游文件](https://github.com/Blave-TW/blave-agent/blob/main/README.md) |
| 14 | `block-buzz` | 讓人員與 Claude Code、Codex、Goose、Pi 等 Coding Agents 在同一個社群／專案頻道協作；支援 channels、threads、direct messages、Agent 身分、帶簽章的事件紀錄、搜尋、程式碼／Gi | 讓人員與 Claude Code、Codex、Goose、Pi 等 Coding Agents 在同一個社群／專案頻道協作；支援 channels、threads、direct messages、Agent 身分、帶簽章的事件紀錄、搜尋、程式碼／Gi | [上游文件](https://github.com/block/buzz/blob/main/README.md) |
| 15 | `cathrynlavery-diagram-design` | 以 45 種圖表類型及語意選型原則生成品牌化技術／資料／流程圖：包含系統架構、Sequence、Swimlane、Flowchart、ER、State、Gantt、Sankey 等；可將既有 Mermaid、draw.io、Excalidraw 重新 | 以品牌化 HTML + Inline SVG 生成技術架構、流程與資料圖，官方 README 現列 51 種圖表類型，可參考或轉繪 Mermaid、draw.io、Excalidraw、PlantUML 並輸出圖像。 | [上游文件](https://github.com/cathrynlavery/diagram-design/blob/main/README.md) |
| 16 | `charonyuu-whatsmyagentdoing` | 把本機 Claude Code、Codex、Gemini CLI 的 Session JSONL 事件即時轉成工作狀態，於 2D 手繪／3D 虛擬辦公室或清單檢視哪些 Agent 正在思考、執行工具、輸出回覆、等待人類批准、已完成、出錯或中斷；顯示當 | 把本機 Claude Code、Codex、Gemini CLI 的 Session JSONL 事件即時轉成工作狀態，於 2D 手繪／3D 虛擬辦公室或清單檢視哪些 Agent 正在思考、執行工具、輸出回覆、等待人類批准、已完成、出錯或中斷；顯示當 | [上游文件](https://github.com/Charonyuu/whatsmyagentdoing/blob/main/README.md) |
| 17 | `chatfire-ai-huobao-drama` | 一站式 TypeScript/Nuxt 3 + Hono + SQLite/Electron 短劇產生器：用四個 Mastra Agents 處理小說改劇本、角色／場景／道具萃取、鏡頭分解和圖片／影片提示，接多種文圖視模型批次出片，FFmpeg 合成 | 一站式 TypeScript/Nuxt 3 + Hono + SQLite/Electron 短劇產生器：用四個 Mastra Agents 處理小說改劇本、角色／場景／道具萃取、鏡頭分解和圖片／影片提示，接多種文圖視模型批次出片，FFmpeg 合成 | [上游文件](https://github.com/chatfire-AI/huobao-drama/blob/main/README.md) |
| 18 | `claude-mem` | 跨 Claude Code 與其他已支援 Coding Agent Session 保存有來源的 Prompt、工具觀察、決策與摘要；透過 Lifecycle Hooks／原生整合蒐集資料，以摘要壓縮、SQLite／Chroma 混合檢索及分層 co | 跨 Claude Code 與其他已支援 Coding Agent Session 保存有來源的 Prompt、工具觀察、決策與摘要；透過 Lifecycle Hooks／原生整合蒐集資料，以摘要壓縮、SQLite／Chroma 混合檢索及分層 co | [上游文件](https://github.com/thedotmack/claude-mem/blob/main/README.md) |
| 19 | `copywriting-skill` | 把網站與 landing page copywriting 變成有產品脈絡的 Agent workflow：先讀取持久化 product-marketing context，再補齊 page purpose、audience、offer、traffi | 把網站與 landing page copywriting 變成有產品脈絡的 Agent workflow：先讀取持久化 product-marketing context，再補齊 page purpose、audience、offer、traffi | [上游文件](https://github.com/coreyhaines31/marketingskills/blob/main/skills/copywriting/SKILL.md) |
| 20 | `coreyhaines31-marketingskills` | 將產品定位、受眾、文案、轉換優化、SEO、內容策略、廣告、成效衡量、實驗、成長、留存、定價與 Sales/RevOps 納入可複用的 52 個 Agent Skills。共用 `product-marketing` 產品脈絡（`.agents/pro | 將產品定位、受眾、文案、轉換優化、SEO、內容策略、廣告、成效衡量、實驗、成長、留存、定價與 Sales/RevOps 納入可複用的 52 個 Agent Skills。共用 `product-marketing` 產品脈絡（`.agents/pro | [上游文件](https://github.com/coreyhaines31/marketingskills/blob/main/README.md) |

## 本批重要差異
- `agricidaniel-claude-seo`：已依現行 README 更新為 29 子技能、20 專業 Agents；不把作者效果案例視為結果保證。
- `cathrynlavery-diagram-design`：README 的圖表數量已變為 51 種；保留舊資料中其他有根據的使用情境。
- `akas333-tysa`：新增 API Key、語音資料與 AGPL-3.0 注意事項。
- `amp-agent-memory-protocol`、`ai-memory`、`claude-mem`：明確說明記憶擷取的隱私、Hook 及憑證邊界。
- `anthropics-sandbox-runtime`：研究預覽與 Windows Alpha 不等於正式安全保證。
- `chatfire-ai-huobao-drama`：保留 CC BY-NC-SA 4.0 商業使用限制。
- `anthropics-financial-services`：範本不等於投資／會計建議及資料供應商授權。
- `aws-samples-sample-agent-cost-bench`、`anthropics-single-agent-loop-kit`：固定同一批樣本與驗收標準再評估差異。

## 驗收計畫
- 20 個不同 Canonical ID；Raw Tags、Category、Typed References、六類數量保持不變。
- 維持 Knowledge Graph 569 nodes 與既有連線數，僅重算 Resource summary/searchText。
- 依正式 CI 取得 Unified Intake Gate、V2 Data Validate、P1 Graph Unit Tests 的真實結果，合併後再查 GitHub Pages 部署及 Smoke Check。
- 未執行任何外部安裝、模型呼叫、私人資料傳輸或付費動作。
