# Phase 2｜Resources Batch 02 — 20 筆來源核對與內容改善（2026-11-19）

## 範圍與方法
- 根據 `main` 上已合併的 [Batch 01](RESOURCE_CONTENT_REVIEW_BATCH01_20261119.md)，排除前批 20 筆，選出 20 筆官方來源可讀且補齊使用知識有價值的 Resources。
- 本批核對上游 GitHub README；`frontend-design` 另閱讀官方 `SKILL.md`。來源屬第三方作者自述，**只屬 Source Reviewed，不是安裝、建置、執行或安全實測**。
- 只編輯單筆 Canonical JSON 和其 Generated Catalog／Graph；保持 270 Resources、549 六類 Canonical、所有 ID、Category、Raw Tags、Typed References，**無新增 Tag**。
- 每筆加入繁體中文的用途、採用建議、3 個主要功能、2 個使用前提、2 個限制，以及可追溯的來源查核與 Intake Review。
- `data/manifest-v2.json` 因 ID 不變而無需更新；`data/tag-index-v1.json` 因 Raw Tags 不變而無需更新。
- 不新增深度 `repoGuide`，亦不建立推測性的 Capability 或 Graph Links。

## 逐筆 Before → After
| # | Canonical ID | Before（舊用途） | After（新用途） | 官方依據 |
|---:|---|---|---|---|
| 1 | `agency-agents` | 蒐集具專業角色、工作流程、個性與交付標準的專用 AI agents，可安裝到 Claude Code、Cursor、Codex、Gemini 等工具。 | 以不同職能的 AI Agent 角色檔案提供工作方式、交付格式與品質檢查參考；可由專用桌面應用或指令整合至支援的 Coding Agent。 | [README / Skill](https://github.com/msitarzewski/agency-agents) |
| 2 | `agent-reach` | 替 AI Agent 統一選型、安裝、健康檢查與路由各種網頁／社群平台存取後端，涵蓋 web、Twitter/X、Reddit、YouTube、GitHub、小紅書等來源。 | 為 CLI Agent 安裝並管理多種社群與影音平台的搜尋、讀取和資料擷取通道，提供通道健康檢查及優先／備援後端。 | [README / Skill](https://github.com/Panniantong/Agent-Reach) |
| 3 | `ai-video-drama-platform` | 將故事大綱轉為經 Pydantic 驗證的分鏡，再以本機 ComfyUI 生成逐場圖片並透過 FFmpeg 組成 MP4。 | 將文字故事轉成具資料驗證的分鏡，呼叫本機 ComfyUI 產生圖片，再透過 FFmpeg 合成影片；提供 CLI、容器與測試路徑。 | [README / Skill](https://github.com/dc-tw/ai-video-drama-platform) |
| 4 | `anthropics-skills` | Agent Skill 設計參考與範例 | Anthropic 公開的 Agent Skills 規格、範例與文件類技能，示範 SKILL.md 如何封裝任務指示、輔助檔案與逐步載入。 | [README / Skill](https://github.com/anthropics/skills) |
| 5 | `awesome-agentic-ai-zh` | 繁體中文 Agentic AI 學習路線與資源彙整 | 繁體中文 Agentic AI 學習地圖，從 LLM／API／Git 基礎，分流至 CLI Agent 使用者及自行開發 Agent，並安排可靠性與評估練習。 | [README / Skill](https://github.com/WenyuChiou/awesome-agentic-ai-zh) |
| 6 | `awesome-gpt-image-2` | 提供附預覽圖的影像生成 Prompt 範例，依使用情境、風格、主題分類，供視覺創作、設計參考與 Prompt 比較。 | 以圖片預覽和分類索引整理 GPT Image 2 的影像 Prompt，協助找到人物、插畫、商業視覺及資訊圖等可修改的提示詞範例。 | [README / Skill](https://github.com/YouMind-OpenLab/awesome-gpt-image-2) |
| 7 | `browser-use-browser-use` | 讓具備 LLM 的 Agent 在瀏覽器中觀察網站狀態、操作頁面、執行多步搜尋、填表與測試任務；可在本機跑 Python／CLI，也可選用 Browser Use Cloud 的代管瀏覽器與 Agent API。 | 提供 Browser Use Cloud、CLI 與 Python Library 三條途徑，讓 Agent 透過瀏覽器執行網頁任務；目前 README 的 1.0 路徑使用持續性 Python REPL 和 Chrome CDP。 | [README / Skill](https://github.com/browser-use/browser-use) |
| 8 | `claude-codex-harness-sync` | 盤點 Claude Code 與 Codex 的全域及專案設定，規劃首次遷移並追蹤後續 drift；將可安全同步的設定轉譯為 Codex 格式，高風險變更須人工確認，秘密值由使用者自行處理。 | 盤點 Claude Code 與 Codex 的規則、Skill、設定和漂移差異；先審查，再轉譯低風險設定，不整包搬移。 | [README / Skill](https://github.com/agentcrew-academy/claude-codex-harness-sync) |
| 9 | `codebase-memory-mcp` | 替 codebase 建立本機索引與知識圖譜，透過 MCP 提供程式結構、關聯與可持續查詢的 code memory，並可搭配背景 watcher 維持索引。 | 在本機解析程式碼建立符號、呼叫與依賴知識圖譜，透過 MCP、CLI 與選配的視覺化工具提供 Coding Agent 結構化程式脈絡。 | [README / Skill](https://github.com/DeusData/codebase-memory-mcp) |
| 10 | `frontend-design` | Create distinctive, production-grade frontend interfaces with high design quality. | Anthropic Skills Repo 內的 frontend-design 單一技能，透過先規劃視覺方向、檢查設計 Brief、實作與自我批判來減少模板化介面。 | [README / Skill](https://github.com/anthropics/skills) |
| 11 | `graft` | 位在 coding agent 與檔案系統之間，依程式結構回傳較小且正確的 code view，避免 Agent 把整個大型檔案、lockfile 或無關內容塞進 context。 | 在 Coding Agent 讀取專案前提供結構化且較小的程式碼視圖，依 AST 給出安全讀取、符號與變更脈絡，減少將大型檔案直接塞入 Context。 | [README / Skill](https://github.com/flyingrobots/graft) |
| 12 | `harry0703-moneyprinterturbo` | 依主題或關鍵詞用 AI 產生短影音腳本、檢索／匹配素材、生成字幕、背景音樂並合成短影音，提供 WebUI、API 與 Docker/CLI 部署。 | 依主題產生 AI 短影音腳本，結合模型、素材、語音、字幕與背景音樂合成直橫式影片，提供介面、套件及容器部署。 | [README / Skill](https://github.com/harry0703/MoneyPrinterTurbo) |
| 13 | `infiniflow-ragflow` | 將複雜文件、掃描內容、表格與多來源資料解析、切塊、索引、檢索，提供具來源引用的知識問答與 Agent context layer。 | 以文件解析、切塊和索引建立具引用的檢索問答與 Agent 資料基礎，支援多來源文件和可配置知識檢索。 | [README / Skill](https://github.com/infiniflow/ragflow) |
| 14 | `langgenius-dify` | 以可視化編排、知識庫/RAG、模型與工具接入建立聊天機器人、AI 應用和 Agent Workflow；支援從原型到上線的 API、協作空間與 Cloud／VPC／self-hosted 部署。 | 透過視覺化畫布、知識庫、工具與模型接入建立 AI App、RAG、Agent 和多步 Workflow，可自架或選用代管服務。 | [README / Skill](https://github.com/langgenius/dify) |
| 15 | `llm` | 從 command line 或 Python 呼叫多種 LLM，支援 plugins、tools、embeddings，並可把 prompts 與 responses 記錄到 SQLite，方便搜尋與回顧過去對話。 | Simon Willison 的 LLM CLI 與 Python Library，透過插件呼叫多種雲端或本機模型，並可記錄 Prompt、輸出、Embedding 與模型操作。 | [README / Skill](https://github.com/simonw/llm) |
| 16 | `n8n-io-n8n` | 用可視化節點、JavaScript／Python 邏輯與外部連接器把排程、Webhook、API、資料整合及 AI Agent 的多步操作串成可觀測、可管理的自動化流程，支援自架與商用 Cloud。 | 用可視化流程與自訂程式串接 Webhook、排程、API、資料服務和 AI Agent，提供雲端或自行託管的自動化平台。 | [README / Skill](https://github.com/n8n-io/n8n) |
| 17 | `open-webui-open-webui` | 以可在瀏覽器使用的自架 AI 工作區串接 Ollama、本機推論服務與 OpenAI 相容雲端 API，支援聊天、使用者／群組權限、知識庫／RAG、工具與 MCP 擴充、筆記、Agent 設定及多模型工作流程。 | 提供可自架的多模型 AI 對話工作區，支援本機推論與 OpenAI 相容 API，以及使用者、知識資料和擴充整合。 | [README / Skill](https://github.com/open-webui/open-webui) |
| 18 | `openui` | 以 compact、streaming-first 的 OpenUI Lang 與 renderer/runtime，讓模型輸出可被限制在已定義的 component library，並逐步渲染成互動 UI。 | 以 OpenUI Lang 讓 LLM 依允許的元件集合串流產生結構化 UI，支援 React、Vue、Svelte、Angular 與現成聊天介面。 | [README / Skill](https://github.com/thesysdev/openui) |
| 19 | `reactive-resume` | 免費開源的履歷建立器，提供即時預覽、PDF/JSON/DOCX 匯出、15 種模板、自訂樣式、JSON Resume 匯入、分享連結與 self-hosting；目前也整合 OpenAI、Gemini、Claude 等 AI 能力。 | 開源履歷與求職文件編輯器，提供模板、即時預覽、匯出和分享，也支援自架及可選的 AI 功能。 | [README / Skill](https://github.com/reactive-resume/reactive-resume) |
| 20 | `rtk` | 位在 Agent 與 shell/CLI 之間，執行命令後先過濾與壓縮輸出，再把較精簡的結果送回 Agent context，降低大量 lint、test、git diff、process list 等輸出的 token 消耗。 | 在 Coding Agent 讀取 Shell 輸出前壓縮大量測試、Diff 和日誌資訊，並提供 Token 節省統計及選配的處理 Pipeline。 | [README / Skill](https://github.com/rtk-ai/rtk) |

## 需特別保留的使用限制
- `agent-reach`：官方文件說明登入 Session 複製及平台帳號存取，導入前須做憑證與平台條款檢查。
- `browser-use-browser-use`：官方 README 描述 v1.0 的 REPL／CDP 路徑，舊版 0.x 使用方式不得直接混用。
- `n8n-io-n8n`、`rtk`、`open-webui-open-webui`：不得將不同版本或授權條款統一稱為無限制 MIT 開源。
- `reactive-resume`：共享履歷含個人資料；自架需管理 Secrets 和服務依賴。
- `graft`、`codebase-memory-mcp`：安裝和 Hook／Agent 設定可能改變本機環境，本批未執行。

## Gate／回歸檢查
- 已於內容變更前核對 Graph 569 nodes、270 Resources。提交時檢查 20 個不同 ID 皆存在且來源欄位有效。
- 實際 Gate 仍以 CI 的 Unified Intake Gate、V2 Data Validate、P1 Graph Tests 與 Pages 部署結果為準。
- 尚未核對上游原始碼逐檔實作、Dependency Security、License 文件、實際執行輸出與 API 整合，不可將 README 主張標為 Runtime PASS。
