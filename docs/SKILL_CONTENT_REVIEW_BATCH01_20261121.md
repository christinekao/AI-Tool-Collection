# Phase 2 Skills Batch 01 — Trigger／Input／Execution／Output／Risk／Gate 逐筆品質改善

**日期：2026-11-21（Asia/Taipei）**｜**基準 main：** `31a3f888249803137d674b15f0e45ccc03d188c2`｜**分支：** `skill-content-batch01-20261121`

## 定義與範圍
- **20/123 Skills**：選定 `data/skills/` 依檔名排序的前 20 個不重複 ID；Phase 2 Resources **270/270** 保持不變。
- 20 筆實際查閱官方 README 或 SKILL.md；`source-checked` 表示**文件層級核對**，不代表來源作者信用背書、安全審查、安裝或 Runtime PASS。
- 補上缺少的 Trigger／Input／Execution／Output／Risk／Gate 與 `intakeReview`；**新建 18 份完整 Skill Guide，保留 2 份既有完整 Guide**。
- 不修改原 ID、Title、Tags、Category、Primary Domain、ResourceRefs、ConceptRefs 或 WorkflowRefs；Graph 邊保持不變；不安裝來源 Skill，也不取用憑證。
- Catalog 全庫保持 **270 Resources、123 Skills、68 Concepts、35 Prompts、17 Combinations、36 Workflows；569 Graph Nodes／1816 Graph Edges**。

## 逐筆 Before → After

| # | Skill ID | Inputs／Outputs | Skill Guide | 官方來源與觸發邊界 |
| ---: | --- | --- | --- | --- |
| 1 | `acheaisuiyimen-ache-life-to-comic-skill` | 0/0 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/acheAIsuiyimen/ache-life-to-comic-skill/blob/main/SKILL.md)；使用者要把生活紀錄、照片、會議筆記長期續寫為漫畫月冊；單次主題漫畫不適用 |
| 2 | `addyosmani-agent-skills` | 0/0 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/addyosmani/agent-skills/blob/main/README.md)；軟體開發需要規格、規劃、實作、測試、審查或發布時，依階段選取 /spec、/plan、/build、/test、/review、/ship 等 Skill；並非單一自動執行指令 |
| 3 | `agricidaniel-claude-seo` | 3/3 → 3/3 | 新增 Trigger→Gate Guide | [來源](https://github.com/AgriciDaniel/claude-seo/blob/main/skills/seo/SKILL.md)；在已安裝的 Host 使用 /seo <command> <url>；僅 SEO 需求明確但子類型尚未決定時使用 Router |
| 4 | `akas333-tysa-axiom-learn` | 3/2 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/Akas333/TYSA/blob/main/skills/axiom-learn/SKILL.md)；使用者要依自己的 TYSA 學習歷史解釋、回顧或找出知識關聯時 |
| 5 | `akseolabs-seo-cinematic-ui` | 4/4 → 4/4 | 新增 Trigger→Gate Guide | [來源](https://github.com/akseolabs-seo/cinematic-ui/blob/master/SKILL.md)；使用者要電影感、導演式網站、Landing Page、Dashboard 或有分鏡的互動式 App；需確認是否啟用 /cinematic-ui |
| 6 | `alchaincy-huashu-design` | 0/0 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/alchaincyf/huashu-design/blob/master/SKILL.md)；要求製作 HTML 原型、App mockup、可編輯簡報、動效、資訊圖或視覺評審時；首次設計需先給三個方向供選擇 |
| 7 | `alchaincyf-huashu-motion-skill` | 3/2 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/alchaincyf/huashu-motion/blob/main/skills/huashu-motion/SKILL.md)；產品發表片、品牌動態、可編輯 HTML 動畫，或想按影片時間點／畫面位置迭代時 |
| 8 | `alexyc9381-hiring-panel` | 3/3 → 3/3 | 保留既有完整 Guide | [來源](https://github.com/alexyc9381/hiring-panel-skill/blob/main/skills/hiring-panel/SKILL.md)；/hiring-panel <resume> [job posting or role] |
| 9 | `allanyiin-documa-codegraph` | 0/0 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/AllanYiin/Documa/blob/main/plugins/codex-documa/skills/documa-codegraph/SKILL.md)；需要找程式符號、追蹤 callers/callees、imports、依賴循環或影響範圍時；不適用 Runtime Profiling |
| 10 | `allanyiin-documa-evidence` | 0/0 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/AllanYiin/Documa/blob/main/plugins/codex-documa/skills/documa-evidence/SKILL.md)；需要在長篇 PDF、Office、HTML、Email 或 Markdown 中搜尋、比較與引用證據時；純視覺排版檢查不適用 |
| 11 | `allanyiin-documa-maintenance` | 0/0 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/AllanYiin/Documa/blob/main/plugins/codex-documa/skills/documa-maintenance/SKILL.md)；Documa 索引、Schema、Benchmark、升級或正式發布驗證時；不是一般文件問答 |
| 12 | `allanyiin-documa-skill-loader` | 0/0 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/AllanYiin/Documa/blob/main/plugins/codex-documa/skills/documa-skill-loader/SKILL.md)；需要依使用者實際任務選擇、載入特定 Skill，或全讀 SKILL.md 會浪費 Context 時 |
| 13 | `allanyiin-toolanything-mcp-router` | 3/4 → 3/4 | 新增 Trigger→Gate Guide | [來源](https://github.com/AllanYiin/ToolAnything/blob/main/skills/toolanything-mcp-router/SKILL.md)；要把 Python 函式、HTTP API、SQL 或模型封裝成 MCP／OpenAI 工具時；一次性單函式應比較更簡單方案 |
| 14 | `allanyiin-toolanything-platform-ops` | 4/4 → 4/4 | 新增 Trigger→Gate Guide | [來源](https://github.com/AllanYiin/ToolAnything/blob/main/skills/toolanything-platform-ops/SKILL.md)；使用者明確要求 ToolAnything Wheel 安裝、跨 Host Skills 同步、AGENTS.md 更新、Shared MCP Server 或 Auto-start；必須先經 Router 決策 |
| 15 | `anthropics-claude-api-prompt-audit` | 2/2 → 2/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/anthropics/skills/blob/main/skills/claude-api/shared/prompt-audit.md)；在有官方 claude-api Skill 的環境使用 /claude-api prompt-audit；不是獨立內建指令 |
| 16 | `anthropics-single-agent-loop` | 3/4 → 3/4 | 新增 Trigger→Gate Guide | [來源](https://github.com/anthropics/single-agent-loop-kit/blob/release/skill/SKILL.md)；希望盤點、減少或重組多 Agent 系統，並依成效決定哪些 Subagents 應 Merge／Fold／Keep 時 |
| 17 | `ayueh0102-ronnier-skill` | 0/0 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/Ayueh0102/Ronnier-skill/blob/main/README.md)；詢問色彩科學、CIE 色彩空間、光度／色度、色差計算或希望複習色彩原理時 |
| 18 | `baoyu-skill` | 0/0 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/JimLiu/baoyu-skills/blob/main/README.md)；需要文章處理、封面／圖卡／資訊圖生成或授權後的跨平台內容發布時，選用 baoyu-skills 的特定 Skill |
| 19 | `blader-humanizer` | 3/3 → 3/3 | 保留既有完整 Guide | [來源](https://github.com/blader/humanizer/blob/main/SKILL.md)；對文章進行自然化改寫，同時保留原文事實與作者語氣 |
| 20 | `blogger-distiller` | 0/0 → 3/2 | 新增 Trigger→Gate Guide | [來源](https://github.com/otter1101/blogger-distiller/blob/main/README.md)；想從公開社群創作者內容歸納選題、鉤子、結構和讀者互動模式時 |

## 逐筆 Source、實際工作流與驗收

### 1. `acheaisuiyimen-ache-life-to-comic-skill`
- **官方文件**：[SKILL／README](https://github.com/acheAIsuiyimen/ache-life-to-comic-skill/blob/main/SKILL.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：使用者要把生活紀錄、照片、會議筆記長期續寫為漫畫月冊；單次主題漫畫不適用
- **Execution**：確認是長期連載 → 保存原始來源 → 編排漫畫手帳 → 核對與交付。
- **Risk／停止條件**：私人素材：照片與日常記錄可能包含人臉、住址和工作資料，控制：只使用明確授權的素材，避免將原始檔公開提交；歷史覆寫：把修正誤當成新章或用單檔分享版反寫主版本，控制：先比較章節索引和差異並保留備份。
- **驗收 Gate**：新增內容依正確日期進入同一月冊，修正不產生重複章節。；每筆來源可回查，HTML／assets 主版本保留且未被分享副本覆寫。；人物、照片、中文字和版面經使用者目視確認。。
- **歷史／版本例外**：無。

### 2. `addyosmani-agent-skills`
- **官方文件**：[SKILL／README](https://github.com/addyosmani/agent-skills/blob/main/README.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：軟體開發需要規格、規劃、實作、測試、審查或發布時，依階段選取 /spec、/plan、/build、/test、/review、/ship 等 Skill；並非單一自動執行指令
- **Execution**：選擇必要階段 → 確認範圍與完成條件 → 產生階段成果 → 驗證與交接。
- **Risk／停止條件**：高權限程式操作：所選 Skill 可能建議安裝、執行命令或提交程式，控制：預先審核命令、權限、機密和版本控制副作用；自動化過度：完整 Skill 組合不一定適用小修正，控制：只載入所需階段，避免無必要的檔案和流程擴張。
- **驗收 Gate**：所選 Skill 的產物和目前開發階段一致。；測試與 Review 有實際執行結果，沒有將建議冒充 PASS。；不可逆的部署、合併或權限變更取得核准。。
- **歷史／版本例外**：無。

### 3. `agricidaniel-claude-seo`
- **官方文件**：[SKILL／README](https://github.com/AgriciDaniel/claude-seo/blob/main/skills/seo/SKILL.md)；來源查核時間 2026-11-21。本次可見上游版本 `2.6.2`。
- **Trigger**：在已安裝的 Host 使用 /seo <command> <url>；僅 SEO 需求明確但子類型尚未決定時使用 Router
- **Execution**：確認網站與授權 → 選擇 SEO 子技能 → 執行授權範圍內的檢查 → 彙整優先級。
- **Risk／停止條件**：網站與 API 權限：SEO 抓取和第三方 API 可能涉及 SSRF、金鑰和費用，控制：限定合法目標、憑證最小權限和額度；SEO 成效誇大：作者案例或排名估計不能證明修正帶來成長，控制：區分量測、推估與未驗證的建議。
- **驗收 Gate**：每項重大問題對應可重查的頁面、檢查結果或規範。；沒有未授權存取分析帳號、外部 API 或超出抓取範圍。；輸出按嚴重程度排序並說明未測項目與未確定性。。
- **歷史／版本例外**：既有詳細描述舊版 2.5.0；目前上游 2.6.2，保留歷史說明。

### 4. `akas333-tysa-axiom-learn`
- **官方文件**：[SKILL／README](https://github.com/Akas333/TYSA/blob/main/skills/axiom-learn/SKILL.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：使用者要依自己的 TYSA 學習歷史解釋、回顧或找出知識關聯時
- **Execution**：確認資料權限與路徑 → 唯讀列出學習紀錄 → 整理證據 → 回饋學習者。
- **Risk／停止條件**：個人學習資料：回答、信心及筆記可能具有個人隱私，控制：限定本機讀取，不上傳或任意外傳；推論誤差：歷史信心低不必然等於目前不懂，控制：指出時間和證據限制，不擅自替使用者評分。
- **驗收 Gate**：所有讀取限於授權資料目錄且無寫入。；關鍵分析可追溯到已讀取的 Session／命題。；不把缺少紀錄寫成使用者沒有能力或沒有學習。。
- **歷史／版本例外**：無。

### 5. `akseolabs-seo-cinematic-ui`
- **官方文件**：[SKILL／README](https://github.com/akseolabs-seo/cinematic-ui/blob/master/SKILL.md)；來源查核時間 2026-11-21。本次可見上游版本 `2.8.0`。
- **Trigger**：使用者要電影感、導演式網站、Landing Page、Dashboard 或有分鏡的互動式 App；需確認是否啟用 /cinematic-ui
- **Execution**：企劃與研究 → 設計鏡頭表 → 實作網站或 App → Screening 驗收。
- **Risk／停止條件**：影像與字體著作權：視覺研究不代表擁有素材商用權，控制：標明來源與授權並避免直接複製範例；重視視覺忽略可用性：過度動畫可能影響效能、可存取性和 SEO，控制：測試鍵盤、響應式、Reduced Motion 及載入表現。
- **驗收 Gate**：有可回查的設計方向及真實素材授權。；網站／App 實際渲染，至少涵蓋關鍵路由、狀態與視窗。；不破壞原有功能與內容，並記錄效能及可存取性限制。。
- **歷史／版本例外**：無。

### 6. `alchaincy-huashu-design`
- **官方文件**：[SKILL／README](https://github.com/alchaincyf/huashu-design/blob/master/SKILL.md)；來源查核時間 2026-11-21。本次可見上游版本 `3.4.2`。
- **Trigger**：要求製作 HTML 原型、App mockup、可編輯簡報、動效、資訊圖或視覺評審時；首次設計需先給三個方向供選擇
- **Execution**：建立三個設計方向 → 確定方向與素材 → 建立可編輯成果 → 體檢與交付。
- **Risk／停止條件**：外部素材與技術：字型、圖片及多媒體可能有授權或第三方腳本，控制：先檢查授權及必要依賴，不直接執行來源的 Shell 指令；產品性質混淆：漂亮原型不等同具正式後端的產品，控制：標明 Demo／Prototype，功能需另做整合與測試。
- **驗收 Gate**：提供三個可比較的設計方向並取得明確選擇。；交付檔案可開啟和編輯，主要內容、字體及尺寸正確。；沒有將僅為 UI 的示意頁宣稱為可上線系統。。
- **歷史／版本例外**：無。

### 7. `alchaincyf-huashu-motion-skill`
- **官方文件**：[SKILL／README](https://github.com/alchaincyf/huashu-motion/blob/main/skills/huashu-motion/SKILL.md)；來源查核時間 2026-11-21。本次可見上游版本 `0.5.1`。
- **Trigger**：產品發表片、品牌動態、可編輯 HTML 動畫，或想按影片時間點／畫面位置迭代時
- **Execution**：蒐集真實產品資訊 → 建立動畫主版本 → Studio 迭代 → 加入音訊與渲染。
- **Risk／停止條件**：瀏覽器／命令副作用：依賴 CLI、Chrome 與可能的本機檔案寫入，控制：安裝和執行命令前核對權限、工具與輸出路徑；素材版權與成本：使用音樂、配音、品牌影像可能受不同授權約束，控制：確認配樂、字體、圖片與模型的商用權限和輸出成本。
- **驗收 Gate**：影片主張能以真實產品資訊佐證。；有 Studio 或實際畫面檢查證據；不只用成功編譯代替視覺驗收。；成片、音訊與字幕同步，並保留可編輯原始檔。。
- **歷史／版本例外**：無。

### 8. `alexyc9381-hiring-panel`
- **官方文件**：[SKILL／README](https://github.com/alexyc9381/hiring-panel-skill/blob/main/skills/hiring-panel/SKILL.md)；來源查核時間 2026-11-21。本次可見上游版本 `1.0.0`。
- **Trigger**：/hiring-panel <resume> [job posting or role]
- **Execution**：檢查履歷。
- **Risk／停止條件**：個資：履歷包含個人資料，控制：不公開提交。
- **驗收 Gate**：完整審查無造假。
- **歷史／版本例外**：無。

### 9. `allanyiin-documa-codegraph`
- **官方文件**：[SKILL／README](https://github.com/AllanYiin/Documa/blob/main/plugins/codex-documa/skills/documa-codegraph/SKILL.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：需要找程式符號、追蹤 callers/callees、imports、依賴循環或影響範圍時；不適用 Runtime Profiling
- **Execution**：確認 Graph 就緒 → 選擇分析意圖 → 回到程式碼驗證 → 陳述不確定性。
- **Risk／停止條件**：掃描越界：同步 Repository 可能讀取未允許路徑，控制：僅使用核准的根目錄，絕不掃描其他專案；Graph 不完整：動態程式呼叫不一定能被靜態追蹤，控制：回到實際原始碼及測試確認。
- **驗收 Gate**：Graph workspace 對應正確的 Repo／版本。；查詢結論能指到真實符號與原始碼，沒有憑空擴大影響範圍。；未把 CodeGraph 說成 Runtime Profiling 或 Taint Analysis。。
- **歷史／版本例外**：無。

### 10. `allanyiin-documa-evidence`
- **官方文件**：[SKILL／README](https://github.com/AllanYiin/Documa/blob/main/plugins/codex-documa/skills/documa-evidence/SKILL.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：需要在長篇 PDF、Office、HTML、Email 或 Markdown 中搜尋、比較與引用證據時；純視覺排版檢查不適用
- **Execution**：取得文件與索引 → 搜尋區塊 → 有限閱讀 → 彙整與引用。
- **Risk／停止條件**：機密文件：檔案可能含個資、公司內部文件和郵件，控制：限制可讀資料、輸出和索引存放位置；擷取遺漏：IR 不一定保留圖面、排版與表格脈絡，控制：視覺相關問題應另查原始頁面，不虛構未讀內容。
- **驗收 Gate**：重要結論均有文件／頁碼或 Block 證據。；實際讀取範圍符合權限和問題需求。；明示未解析的圖片、表格或衝突處，不以摘要冒充全文驗證。。
- **歷史／版本例外**：無。

### 11. `allanyiin-documa-maintenance`
- **官方文件**：[SKILL／README](https://github.com/AllanYiin/Documa/blob/main/plugins/codex-documa/skills/documa-maintenance/SKILL.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：Documa 索引、Schema、Benchmark、升級或正式發布驗證時；不是一般文件問答
- **Execution**：確認管理模式 → 診斷優先 → 受控修復 → 驗證發布。
- **Risk／停止條件**：高權限改動：Admin Profile、索引重建可能修改大型資料庫，控制：先備份並確認停止條件、最小權限與回滾方案；誤判發布成功：Doctor 通過不等於完整端到端服務正常，控制：需有真實 Benchmark／Schema 測試紀錄。
- **驗收 Gate**：所有修改有事先授權和可還原的備份。；診斷、Schema 驗證及 Benchmark 有實際證據。；任一 Critical Gate 失敗即停止發布，不以口頭聲明放行。。
- **歷史／版本例外**：無。

### 12. `allanyiin-documa-skill-loader`
- **官方文件**：[SKILL／README](https://github.com/AllanYiin/Documa/blob/main/plugins/codex-documa/skills/documa-skill-loader/SKILL.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：需要依使用者實際任務選擇、載入特定 Skill，或全讀 SKILL.md 會浪費 Context 時
- **Execution**：確認管理邊界 → 依任務路由 → 控制載入量 → 處理失敗與風險。
- **Risk／停止條件**：指令注入：外部 SKILL.md 可能要求越權執行或讀取機密，控制：Skill 內容視為資料，實際行動仍遵守授權與政策；來源衝突：Managed Roots 和原生掃描路徑重疊會重複載入，控制：拆分根目錄並測試可發現的 Skill 列表。
- **驗收 Gate**：載入來源來自已批准的 Managed Roots。；只載入實際任務需要的 Skill 且未超出 Token Budget。；來源文字未自動取得安裝、讀取機密或網路存取權。。
- **歷史／版本例外**：無。

### 13. `allanyiin-toolanything-mcp-router`
- **官方文件**：[SKILL／README](https://github.com/AllanYiin/ToolAnything/blob/main/skills/toolanything-mcp-router/SKILL.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：要把 Python 函式、HTTP API、SQL 或模型封裝成 MCP／OpenAI 工具時；一次性單函式應比較更簡單方案
- **Execution**：評估最小方案 → 決定註冊方式 → 設計最小測試 → 移交部署。
- **Risk／停止條件**：資料與認證：封裝外部 API、SQL 或模型可能外送資料與金鑰，控制：最小權限、明確資料流與 Secret Store；工具權限擴張：MCP tool 可觸發真實副作用，控制：先檢查 Schema 與讀寫邊界，使用安全測試資料。
- **驗收 Gate**：選擇 ToolAnything 有具體理由，非強制安裝。；工具 Input／Output 和 Side Effect 清楚且可測。；正式測試以執行證據為準；目前僅為文件查核。。
- **歷史／版本例外**：無。

### 14. `allanyiin-toolanything-platform-ops`
- **官方文件**：[SKILL／README](https://github.com/AllanYiin/ToolAnything/blob/main/skills/toolanything-platform-ops/SKILL.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：使用者明確要求 ToolAnything Wheel 安裝、跨 Host Skills 同步、AGENTS.md 更新、Shared MCP Server 或 Auto-start；必須先經 Router 決策
- **Execution**：確認必要性與權限 → 建立備份 → 執行受控部署 → 驗證與回滾。
- **Risk／停止條件**：不可逆與設定覆寫：安裝腳本可能 force reinstall 或覆寫 AGENTS.md，控制：人工確認完整 Diff、備份並取得明確核准；共享伺服器暴露：MCP Server、Port 9092 和自動啟動可能開放權限，控制：預設 127.0.0.1，限制身份與權限，不設定未授權自啟。
- **驗收 Gate**：有 Router 決策與明確使用者授權。；所有變更、檔案備份及還原路徑完整。；本機實際診斷、健康檢查與工具呼叫通過才可聲稱部署完成。。
- **歷史／版本例外**：無。

### 15. `anthropics-claude-api-prompt-audit`
- **官方文件**：[SKILL／README](https://github.com/anthropics/skills/blob/main/skills/claude-api/shared/prompt-audit.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：在有官方 claude-api Skill 的環境使用 /claude-api prompt-audit；不是獨立內建指令
- **Execution**：限定模型和範圍 → 收集指令證據 → 提出最小修正 → 獨立驗收。
- **Risk／停止條件**：機密提示與工具資訊：Prompt 可能含私有設計或敏感路徑，控制：僅讀取授權範圍，不外傳內容；誤刪重要規則：過時語句中可能仍有唯一的安全約束，控制：保留 Single Source of Truth，提出 Diff 而非直接覆寫。
- **驗收 Gate**：每個主要 Findings 都有可定位的原始行和理由。；同時交付稽核報告與 proposed diff。；未經授權不修改文件、不移除安全 Gate。。
- **歷史／版本例外**：無。

### 16. `anthropics-single-agent-loop`
- **官方文件**：[SKILL／README](https://github.com/anthropics/single-agent-loop-kit/blob/release/skill/SKILL.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：希望盤點、減少或重組多 Agent 系統，並依成效決定哪些 Subagents 應 Merge／Fold／Keep 時
- **Execution**：00 盤點 → 01 基準評估 → 02–04 單點改動 → 比較並決策 → 05 維護。
- **Risk／停止條件**：代理責任混淆：直接刪除 Subagent 可能損失隔離或專長，控制：一次變動一項並保留 Regression 與獨立 Review；成本與執行環境：真實 Eval 可能消耗大量 Token 和需要私有資料，控制：先訂預算與授權，無 Baseline 則不宣稱效果提升。
- **驗收 Gate**：Baseline 和 Candidate 使用一致的任務與量測規則。；關鍵負案例與安全限制未因 Fold 而退化。；無實證優勢時允許 Keep Subagent，保留回滾可能性。。
- **歷史／版本例外**：無。

### 17. `ayueh0102-ronnier-skill`
- **官方文件**：[SKILL／README](https://github.com/Ayueh0102/Ronnier-skill/blob/main/README.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：詢問色彩科學、CIE 色彩空間、光度／色度、色差計算或希望複習色彩原理時
- **Execution**：先理解問題 → 查閱原始筆記 → 逐步解釋與驗算 → 指出實務限制。
- **Risk／停止條件**：數值使用情境：錯用白點或色空間會改變色差判斷，控制：標示公式、單位、色彩條件並用獨立工具重算；量測權威誤用：筆記講解不能取代校正後的實驗室量測，控制：正式印刷或驗收仍需合格儀器與專業程序。
- **驗收 Gate**：每個數值例子保留公式、輸入、單位與假設。；結論能對應原始筆記章節，不以直覺替代量測。；未把教學內容宣稱為儀器認證或正式檢定報告。。
- **歷史／版本例外**：無。

### 18. `baoyu-skill`
- **官方文件**：[SKILL／README](https://github.com/JimLiu/baoyu-skills/blob/main/README.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：需要文章處理、封面／圖卡／資訊圖生成或授權後的跨平台內容發布時，選用 baoyu-skills 的特定 Skill
- **Execution**：選擇最小必要技能 → 檢查環境與權限 → 生成內容草稿 → 審核後決定發布。
- **Risk／停止條件**：帳號與平台：發布功能可能需要 API Key、Cookie 或持久登入，控制：不要在未核准狀態使用憑證或發布；版權和模型素材：圖像、文字及第三方素材有不同授權，控制：依素材與使用平台逐項確認商用及引用權利。
- **驗收 Gate**：只使用與當次目標直接相關的 Skill。；成品經事實、版權、格式與清晰度人工確認。；沒有用『生成完成』代替『已發布』，發布需實際操作證據。。
- **歷史／版本例外**：無。

### 19. `blader-humanizer`
- **官方文件**：[SKILL／README](https://github.com/blader/humanizer/blob/main/SKILL.md)；來源查核時間 2026-11-21。本次可見上游版本 `4.0.0`。
- **Trigger**：對文章進行自然化改寫，同時保留原文事實與作者語氣
- **Execution**：閱讀。
- **Risk／停止條件**：改動事實：不應捏造，控制：保留原文。
- **驗收 Gate**：無新增事實。
- **歷史／版本例外**：既有 Guide 是 v3.1 歷史內容；v4.0 已標版本差異。

### 20. `blogger-distiller`
- **官方文件**：[SKILL／README](https://github.com/otter1101/blogger-distiller/blob/main/README.md)；來源查核時間 2026-11-21。未宣稱有正式版本編號。
- **Trigger**：想從公開社群創作者內容歸納選題、鉤子、結構和讀者互動模式時
- **Execution**：確認合法資料範圍 → 收集代表樣本 → 匿名與整理 → 提煉內容模式。
- **Risk／停止條件**：平台合規與成本：TikHub API 有授權、流量和商用條件；研究範圍不得延伸私密內容，控制：只分析公開來源，先確認條款與費用；著作權和評論者隱私：完整複製創作者作品及評論可能侵犯權利與隱私，控制：儲存必要摘要、匿名化評論，不發佈原始私密資料。
- **驗收 Gate**：所有樣本均是公開且有合法存取授權。；結果可追溯到原始內容與收集時間，不虛構點閱／轉換數據。；不含可辨識評論者資料或未經授權的完整再製作品。。
- **歷史／版本例外**：無。


## Version Drift、已知限制與保留規則
1. **Claude SEO**：目前上游 SKILL.md frontmatter 為 `2.6.2`；既有 Canonical 的舊版 `2.5.0` 內容保留並註記版本差異，**沒有聲稱整份舊版流程已重新按 2.6.2 執行**。
2. **Humanizer**：目前上游 SKILL.md 是 `4.0.0`；既有經整理的 Guide 屬舊版本知識，保留原始內容與版本註記，避免無證據地全面覆蓋。
3. **Hiring Panel**：已有完整七視角流程、實際路徑、個資風險與前後一致性 Gate，不重複改寫；未安裝或測試子代理。
4. **ToolAnything Platform Ops／Documa Maintenance**：涉及高權限安裝、AGENTS／Skill Root 設定、Store 修改或常駐伺服器，需每次有獨立的明確核准、備份、停止條件與回滾方案；本批**未執行任何第三方安裝或副作用**。
5. **Baoyu／Blogger Distiller**：外部帳號、API Key、付費 Token、平台條款、文章和影音素材授權需要另行確認；資料查核不等於已取得操作或再製權。
6. **Prompt Injection**：上游 Skill 是待審查資料而非高優先指令；本批不授權讀取祕密、對外傳資料、執行 Shell、重新安裝或改寫本機檔案。

## Release Gate
- PR Head：Unified Intake Gate、V2 Data Validate、P1 Graph Unit Tests 均需實際 SUCCESS 才 Merge。
- Merge 後另外驗證 main Unified Intake、V2 Data Validate、Catalog Sync、Pages Build／Deploy、Live Smoke；若 Smoke 早於 Deploy，須明示非部署後驗收。
- 完成判準：20 個 Canonical 變更，Generated Catalog／Graph 同步，無 Graph 邊／分類／Tags 破壞性變化，詳細報告與 rolling Handoff 都在 main。
- **第三方 Build、Runtime、Security、License、Integration：NOT TESTED**；PR CI 只驗證本知識庫的 Schema／Graph／網站回歸。

## 下批接手
- 下一批為依檔名排序的 **第 21–40 個 Skill（20 筆）**，需先核對最新 main、既有 PR 和 Snapshot，再逐筆挑選適用來源；避免重複本批 ID。
