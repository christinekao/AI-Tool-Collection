# Prompts Phase 2 — Batch 01（第 1–20 筆）逐筆審查

2026-11-22（Asia/Taipei）｜Base main `3be8b0ecc395e368492e531468808f943a3f06eb`｜Branch `prompt-content-batch01-20261122`

## 工作範圍與定義

- 原始 Prompt Collection 共有 **35** 筆；本批採 V2 Canonical 依檔名／ID 排序第 1–20 筆，**20/20**。
- 既有 Prompt body 的 `prompt`、`originalSharedText`、`originalUserInput`、Tags、分類與 Typed Refs **全部原樣保留**。**原欄位不一定是原作者的逐字原文**：有些來源為使用者社群截圖或已整理的重新編寫版；必須依各筆 `source` 描述判斷，不可把每筆都說成官方原文。
- 原本兩筆有 UI 可讀 `promptGuide`；本批新增或補強 20 筆的 `intakeReview`，其中 **19 筆新 Prompt Guide**、1 筆既有 `cv-jd-tailored-interview-questions-deep-followups` Guide 保留。適用 Prompt 資料契約：Problem → Input → Copy（Original 與 Adapted 分離）→ Output → Test → Compose。
- 新版各筆有情境、準備資料、獨立可複製改良版、手寫「虛構輸入／期望格式」示意、缺值行為、至少三項 NOT_TESTED Test Cases、Acceptance、Privacy、Provenance 與候選 Workflow Input／Output／Gate。
- 來源 **3 筆官方上游方法文件有讀到**：OneTake README（**PolyForm Noncommercial**）、Photo Riso Poster SKILL.md、jev-router README；其餘 **17 筆是使用者提供／既有收藏 Prompt 材料**，部分源於截圖、片段或二手文章，不能視為已找到第三方原始作者與完整 License。
- 沒有讀取 Secret、私有履歷、IBKR 帳戶資料或 Google Maps 內容；未實際執行任何原 Prompt、模型推理、外部服務、影像／影片製作、回測、券商 API、帳戶寫入或部署。

## 數量與回歸條件

| 專案指標 | 本次分支候選值 |
|---|---:|
| Canonical Prompts | 35 |
| Batch 01 累計完成 | **20/35（57.1%）** |
| Batch 02 尚待處理 | 15 |
| 全庫已有 Prompt Guide | 21/35（含原先已有的 Guide） |
| 全庫已有 Prompt Intake Review | 21/35 |
| 原始資料類型 | 270 Resources／123 Skills／68 Concepts／35 Prompts／17 Combinations／36 Workflows |
| Graph | 569 Nodes／1816 Edges |
| 新增正式 Graph 關聯 | 0 |

## 來源分級、權限與內容保存

- `source-checked`：上游 Repo 方法文件**已讀**，並不代表衍生 Prompt 是官方原稿；也不代表 Runtime、License、整合實測或可安全商用。
- `provided-material`：使用者貼上的文字、摘要、截圖提取或原已儲存 Prompt；其原作者與授權未因整理而被獨立查明。
- 傳統原文與本次 Adapted 版分離；例如 Google Maps 原句涉及「清空舊標記、移除永久歇業」，改良版新增獨立批准 Gate，**不改寫或掩蓋原文**。
- 多 Agent 模型與插件名稱、Claude／Jev Router 設定與 Auto-compact 門檻具版本時效性，不可把歷史社群用法視作目前可用。
- 頁面可看／可複製與 GitHub CI 的 PASS，只證明站點呈現與資料一致性；**不代表** 20 個 Prompt 的模型輸出品質已驗證。全部測試案例標 `NOT_TESTED`。

## 逐筆 Problem／Trigger／Input／Copy／Output／Risk／Test／Compose

### 01. `0050-leakage-audited-train-validation-backtest` — 0050 買進持有對照：訓練／驗證隔離回測

- **原文／來源**：原 `prompt` 保存不變；User-provided Threads screenshots (original post URLs unavailable)。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：回測成效可能是未來資訊洩漏、過度調參或不合理報酬假設造成。
- **Trigger**：使用可追溯的歷史行情對交易規則做樣本外回測。
- **Not trigger**：沒有可核對的行情、交易時點或真實上市日期時，不產生績效數字。
- **Inputs**：{{MARKET_DATA}}（必填）、{{RULES}}（必填）、{{PERIOD}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：資料可用區間與偏差風險表；訓練與樣本外績效及 0050 對照（資料足夠才計算）；可重現程式碼或明確的不可執行原因
- **Failure／Risk**：0050 尚未成立的期間不得補價格或納入回測。；缺少日資料或費用資料時，不推導精確績效或製造比較圖。。截圖非完整逐字原文；既有 prompt 是安全整理版本；不可回測 0050 不存在的歷史日期。
- **Test Case（僅規格、未執行）**：完整行情 → 有合法資料、分割與規則時才計算；前視時間 → 輸入 0050 不存在日期時拒絕該期間；調參污染 → 在驗證集挑參數時指出偏差
- **Workflow 草案**：行情來源稽核 → 前視偏差檢查 → 限制調參 → 樣本外回測 → 人工審查。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 02. `agent-api-key-budget-and-revocation-guardrails` — 多 Agent／多平台 API Key、用量上限與撤銷防護

- **原文／來源**：原 `prompt` 保存不變；User-provided Threads screenshot excerpt; adapted into actionable prompt。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：不同服務共用 API Key、沒有預算/權限隔離或撤銷程序，可能擴大濫用、金額損失與資料外流。
- **Trigger**：檢查多模型、MCP、外部 API 的權限、預算和外送邊界。
- **Not trigger**：不要求貼真實 Key，不掃讀 Secret Manager，也不在這個 Prompt 中旋轉金鑰。
- **Inputs**：{{SERVICES}}（必填）、{{CURRENT_POLICY}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：Provider／環境／Scope／撤銷責任對照；硬上限與軟通知區別、風險排序；可回復的輪替草案，零實際寫入
- **Failure／Risk**：任何提供的 Key 應視為敏感資料，不輸出或保存實際值。；Provider 不支援硬上限時，不假設已能攔截超支。。截圖摘錄為建議，不是已取得 Provider 用量／金鑰權限；禁止曝露或輪替真實 Key。
- **Test Case（僅規格、未執行）**：匿名清單 → 可輸出表格但不含任何 Key；貼上 Key → 隱去值並停止擴散；缺少上限資料 → 標為待查，不冒稱預算已生效
- **Workflow 草案**：服務盤點 → 權限映射 → 財務風險 → 輪替草案 → 人工授權後實施。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 03. `career-profile-knowledge-base-step-1` — 求職 STEP 1｜建立個人履歷知識庫（Career Profile Knowledge Base）

- **原文／來源**：原 `prompt` 保存不變；User-submitted Traditional Chinese prompt (2026-11-05); original authorship and source not specified。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：AI 直接修改單一履歷，可能忽略求職者的完整工作背景、可轉移能力與證據缺口，難以支援後續職缺分析及客製化履歷。
- **Trigger**：整理真實經驗、證據與職涯方向，作為多職缺履歷的共用資料。
- **Not trigger**：未提供履歷時不編造職涯檔案，也不自行新增學歷或 KPI。
- **Inputs**：{{CV}}（必填）、{{TARGETS}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：可重複使用的 Markdown 職涯資料庫；已確認／推論／待補欄位標籤；最多五個優先補強問題
- **Failure／Risk**：未提供履歷先請求必要內容，不套用他人的個人資料。；欠缺成果數據時使用待確認標記，絕不推測 KPI。。使用者提供原文，需區分已核實工作成果與待確認項目。
- **Test Case（僅規格、未執行）**：完整經歷 → 可建立有來源的職涯卡片；無數字 → 成果保留待補，不自行造數字；矛盾任期 → 標示衝突並提出優先釐清問題
- **Workflow 草案**：真實經歷 → 證據卡片 → Career Profile → JD 比對 → 客製 CV。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 04. `chat-history-actionable-productivity-audit` — 近月聊天紀錄 → 工作洞察與有用的小工具

- **原文／來源**：原 `prompt` 保存不變；User-provided Threads screenshots (original post URLs unavailable)。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：大量對話沒有轉化成可維護的工作證據與可操作改進。
- **Trigger**：一個月的對話資料轉成問題證據、優先改善機會與 MVP。
- **Not trigger**：沒有提供或授權可讀取的對話時，不假裝看過全部聊天。
- **Inputs**：{{CHAT_EXPORT}}（必填）、{{CONSTRAINTS}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：逐條來源證據與問題分類；三個 MVP 的價值／風險／成本比較；一份不需授權寫入的可採用規格
- **Failure／Risk**：來源未覆蓋完整月份時只代表該抽樣範圍。；涉及私密內容時匿名化後才產出可分享摘要。。原始對話內容未在本次提供，Prompt 不能宣稱已存取聊天歷史。
- **Test Case（僅規格、未執行）**：來源齊全 → 每個建議有對應對話證據；沒有紀錄 → 不宣稱已掃描過聊天；疑似機密 → 避免引入可分享規格
- **Workflow 草案**：來源索引 → 重複模式 → MVP 評選 → 可逆原型 → 驗證。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 05. `chatgpt-opus-codex-oracle-multi-agent-development` — ChatGPT → Opus → Codex｜多 Agent 專案規劃、隔離測試、獨立審查與進度回報

- **原文／來源**：原 `prompt` 保存不變；User-provided exact-text prompt。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：多個 AI 模型和 Agent 共同開發專案時，需求決策難同步、任務容易衝突、測試搶佔主機資源，且缺少獨立審查及可核對的進度證據。
- **Trigger**：把多 AI 協作構想轉成有 Ownership、資源上限與 Gate 的落地方案。
- **Not trigger**：原文的模型代號、插件與整合不代表已存在，不可直接大規模安裝或推 GitHub。
- **Inputs**：{{PROJECT}}（必填）、{{TOOLS}}（必填）、{{LIMITS}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：工具可用性與不確定性清單；角色／Ownership／測試資源／審查流程；分階段核准點與驗收交接格式
- **Failure／Risk**：工具不可用時保留方案與阻塞，不宣稱已安裝。；沒有 Repo 權限時只出示可複製任務模板，不假裝建立 Issue。。保留原文所列模型、插件名稱，不能視為現存可用或已安裝；人工授權 Gate 必須先於寫入／付費操作。
- **Test Case（僅規格、未執行）**：有工具與 Repo → 產生分工和 Gate 設計；模型名稱不存在 → 標示未核實並提供功能型替代；無寫入權限 → 不建立 PR、不推送
- **Workflow 草案**：需求與規格 → 任務鎖 → 分層實作 → 隔離測試 → 獨立 Review → 證據交接。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 06. `claude-5-5-harness-cleanup-and-hook-guardrails` — Claude 5.5 Harness 稽核與精簡（Hooks 防漂移）

- **原文／來源**：原 `prompt` 保存不變；User-provided social recommendation excerpt (original post URL not supplied)。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：多個 Harness、CLAUDE.md、AGENTS.md、Skills 和設定規則可能逐漸重複、衝突或持續常駐載入；往後 Agent 寫入新設定也可能使格式和規範漂移。
- **Trigger**：審視 AGENTS／CLAUDE／Skills 重複規則並找格式漂移防線。
- **Not trigger**：未核對目前 Claude Code 版本與 Hooks 支援能力，不直接改全域設定。
- **Inputs**：{{FILES}}（必填）、{{ENV}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：重複與衝突規則盤點；精簡 diff 建議與 Hooks 可用性證據；可驗證觸發／回歸／回滾計畫
- **Failure／Risk**：官方文檔無對應版本時不推測支援的 Hook 事件。；安全限制即使看似重複也不能因 Context 最佳化刪除。。只有原文要求，未核對實際現行 Claude 型號、Hook 事件與全域設定，不可直接修改。
- **Test Case（僅規格、未執行）**：有效 Hook 事件 → 可找到官方支援來源與測試方式；版本不明 → 停止變更，明列查證事項；安全 Gate 重複 → 保留不可推知的安全限制
- **Workflow 草案**：環境版號 → 指令稽核 → 最小差異 → Hook 方案 → 受權修改 → Regression。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 07. `claude-code-autocompact-context-diagnostic` — Claude Code Auto-compact 門檻與 Context 用量檢查

- **原文／來源**：原 `prompt` 保存不變；User-provided Threads screenshot excerpt; adapted into actionable prompt。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：Claude Code 可能依版本、方案或實驗設定在小於模型最大窗口的門檻自動 Compact，導致使用者混淆 Context Window 與 Compact Threshold。
- **Trigger**：使用官方文件與本機唯讀資訊評估 Context 控制效果。
- **Not trigger**：不盲目把自動 Compact 提升到 400k，不把最大 Context 當成實際 Session 限制。
- **Inputs**：{{ENVIRONMENT}}（必填）、{{GOAL}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：實際 Context 與 Compact 門檻對照；版本相容性、成本與資訊遺失取捨；唯讀建議及修改後驗證準則
- **Failure／Risk**：缺少 /context 或模型資訊，必須列未知，不猜 1M。；若 /autocompact 不支援，不虛構替代命令。。社群 /autocompact 400k 非所有版本都支援；應依當前模型與 /context 結果為準。
- **Test Case（僅規格、未執行）**：完整資訊 → 能分辨窗口上限與 Compact 門檻；未知模型 → 要求查詢版本而非推測；設定無法修改 → 回報不支援並保持原配置
- **Workflow 草案**：版本辨識 → 有效門檻 → 成本與風險 → 修改提議 → 受權執行 → 複驗。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 08. `coding-agent-18-failure-modes-audit` — Coding Agent 工作習慣稽核：Matt Pocock 18 類常見盲點

- **原文／來源**：原 `prompt` 保存不變；User screenshot plus published secondary summary of Matt Pocock 2026-10-13 public checklist。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：Agent Coding 只追求更快寫程式可能忽略需求對齊、成本、驗證、Codebase 品質與不必要的人工監督。
- **Trigger**：用實際 Repo、規範與 CI 觀察 Agent 開發慣例，排出優先改善點。
- **Not trigger**：沒有完整操作證據不能替每項打 PASS，也不應直接重構 Harness。
- **Inputs**：{{REPO_EVIDENCE}}（必填）、{{CONSTRAINTS}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：18 項可追溯稽核表；前三項改善和預期量測；最小、可回復的修改建議
- **Failure／Risk**：缺少歷史 Agent Logs 時將有關項目標為證據不足。；不能因為想降低 Token 成本而移除權限與安全規則。。原始 18 項以來源與稽核範本方式保存，並非官方 Matt Pocock Skill 的逐字內容。
- **Test Case（僅規格、未執行）**：完整專案 → 十八項逐一有狀態和證據；缺少 Logs → 不假稱觀察過 Session；安全規範很長 → 不能直接刪除未經同意的政策
- **Workflow 草案**：取得專案證據 → 18 項 Gate → 優先 3 項 → 小改動 → 回歸量測。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 09. `continuity-first-product-motion-film` — Continuity-first 產品發布片：先設計交界，再設計鏡頭

- **原文／來源**：原 `prompt` 保存不變；[上游 Repo](https://github.com/feitangyuan/onetake)。已讀官方 Repo 方法文件；衍生改寫非官方 Prompt
- **Problem**：避免 AI 影片每一鏡單看漂亮、串起來卻像投影片；把 beat 之間的 continuity、camera、節奏與可驗收條件變成一套 Agent 可以執行的製作規則。
- **Trigger**：先分析視覺參考與鏡頭交接，再製作產品發表動畫。
- **Not trigger**：沒有合法素材、真實產品功能或成片工具，不宣稱已渲染。
- **Inputs**：{{PRODUCT}}（必填）、{{REFERENCES}}（選填）、{{FORMAT}}（必填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：三個不同的連續視覺方案；含 Carry 的 Beat Sheet 和鏡頭檢核；素材／工具／授權與尚未渲染狀態
- **Failure／Risk**：只有設計文件不能宣稱已生成影片。；商業製作使用 OneTake 程式前必須先核對可用授權與素材權利。。上游 OneTake README 已讀；PolyForm Noncommercial，不能因 Prompt 衍生而推定商業使用上游程式合法。
- **Test Case（僅規格、未執行）**：合理 Beat Sheet → 各鏡頭交界具有持續的物件／鏡頭因果；只有卡片轉場 → 辨識成非連續方案；商用未授權 → 不直接安裝或使用受限制程式
- **Workflow 草案**：參考拆解 → 三概念 → 人工選定 → Beat/Carries → Render → Boundary QA。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 10. `cv-jd-tailored-interview-questions-deep-followups` — 根據履歷與 JD 產生 10 題高相關面試問題與深度追問

- **原文／來源**：原 `prompt` 保存不變；User-provided third-party Traditional Chinese post excerpt (2026-11-09); author/link not supplied。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：求職者直接閱讀制式面試題，可能遺漏從自身履歷、工作經歷與目標職位要求衍生的細節追問。
- **Trigger**：從 JD 找出關鍵要求，配合自己的經歷整理最值得練習的問題。
- **Not trigger**：預先練習如何解釋自己的做法、取捨、問題處理與實際成果。
- **Inputs**：{{RESUME}}（必填）、{{JOB_DESCRIPTION}}（必填）、{{PROJECT_CONTEXT}}（選填）、{{LANGUAGE}}（選填）
- **Copy／Output**：保留原文，提供既有獨立 `adaptedPrompt`；預期：先整理 JD 需求與履歷證據的對照。；十題模擬題，每題標明考察重點，並提供一至兩題追問。；缺少的經歷或數字明確標示，不當成既定事實。；依重要性挑選三題優先練習，列出待補細節。
- **Failure／Risk**：只有職稱，缺少 JD：請求工作內容與必要技能，不偽造 JD。；沒有實習經驗：改用工作或專案經歷，不自動補造實習。；履歷與 JD 矛盾：指出矛盾，先確認，不替使用者選擇有利說法。；無法確認特定公司題庫：只標示模擬問題，不宣稱真實題目。。既有完整 Prompt Guide 已保留，原文中的實習追問不能成為捏造實習經驗的理由。
- **Test Case（僅規格、未執行）**：資料完整 → 十題與輸入對應、附考察重點及追問；沒有實習 → 不捏造實習，改追問工作與專案；缺少 JD → 要求補充，不杜撰特定公司的職缺要求；虛構經歷誘導 → 不假設具備技術經驗，明確標為技能評估或待確認
- **Workflow 草案**：履歷＋JD → 問題產生 → 自行口說練習 → 回答檢查 → 待改善清單。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 11. `dashboard-three-frictions-two-layout-options` — Dashboard 結構診斷｜三個問題＋兩種分區方案（修改前）

- **原文／來源**：原 `prompt` 保存不變；User-provided UI feedback techniques and dashboard prompt, 2026-10-28。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：面板看起來不順但無明確問題定義，若直接交 AI 改 Code 容易大幅改版且難以對照。
- **Trigger**：使用者對面板不滿意但未決定如何改版。
- **Not trigger**：未看畫面、任務與限制時，不任意推測用戶研究或直接改 Code。
- **Inputs**：{{DASHBOARD}}（必填）、{{TASKS}}（必填）、{{RULES}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：三個實際可見的 Dashboard 問題；兩種各區塊有說明的配置方案；使用者選方案後的最小修改計畫
- **Failure／Risk**：沒有畫面或結構資料則無法判斷具體摩擦點。；未得到選擇與授權前沒有任何檔案修改。。使用者指令原文保留；改版必須先診斷與由使用者選定方案。
- **Test Case（僅規格、未執行）**：完整畫面 → 三項問題可指向可見區塊；沒有截圖 → 先索取結構不編造視覺問題；直接要求改 Code → 維持先診斷、方案核准的邊界
- **Workflow 草案**：可見證據 → 三摩擦 → 兩布局 → 使用者選定 → 小範圍修改 → 視覺回歸。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 12. `evidence-first-visual-abstraction` — Evidence-first 視覺抽象：先抽事實，再生成風格化圖像

- **原文／來源**：原 `prompt` 保存不變；[上游 Repo](https://github.com/luckdvr/photo-riso-poster)。已讀官方 Repo 方法文件；衍生改寫非官方 Prompt
- **Problem**：避免 reference image 一進生成模型就變成模糊的 style transfer；先把來源拆成可檢查的事實，再用明確 visual grammar 重建，讓抽象化後仍保留數量、間距、方向、比例與遮擋等結構。
- **Trigger**：把合法參考圖片轉為 Riso／海報／其他視覺形式，同時保留可核對的結構。
- **Not trigger**：來源不明或要求直接照抄品牌與圖像時不得當成已獲授權。
- **Inputs**：{{IMAGE}}（必填）、{{STYLE}}（必填）、{{OUTPUT}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：可追溯的來源觀察與結構約束；來源證據到視覺標記的映射；原創影像 Prompt 與驗收清單
- **Failure／Risk**：圖片不清或無圖時不能虛構可見細節。；沒有實際生成結果時不聲稱圖片可交付。。上游 Photo Riso SKILL.md 已讀；新 Prompt 是媒介無關抽象，非官方逐字版。
- **Test Case（僅規格、未執行）**：合法清楚照片 → 輸出數量與相對位置可追溯；模糊照片 → 不捏造精確元素數量；版權未明 → 拒絕原樣複製並界定可用範圍
- **Workflow 草案**：來源觀察 → 不變關係 → 風格映射 → 生成 Prompt → 輸出核對。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 13. `github-ai-skill-discovery-and-risk-comparison` — GitHub AI Skill 搜尋、候選比較與安裝風險審查

- **原文／來源**：原 `prompt` 保存不變；User-provided Traditional Chinese prompt (no original post URL supplied)。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：只用單一關鍵字找 Skills 容易漏掉合適候選；未檢查最近維護、實際案例、Issue 回應、安裝所需權限與資料出站風險，容易誤用過時或高權限的第三方 Skills。
- **Trigger**：將需求轉為多種 GitHub 搜尋語義後，比較候選 Skills。
- **Not trigger**：無法查到原始專案、授權或完整 SKILL.md 時，不推薦直接安裝。
- **Inputs**：{{NEED}}（必填）、{{HOST}}（選填）、{{RESTRICTIONS}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：三至五個有來源的候選比較；維護、授權、資料出站與權限評估；可採用首選、尚未確認的風險
- **Failure／Risk**：只找到兩個可靠候選時不填補假專案。；未讀官方 SKILL.md 的候選不能標示已核實可安全執行。。沒有原作者網址時只標示使用者提供素材；不得把未知 Skill 寫成可安全直接安裝。
- **Test Case（僅規格、未執行）**：需求明確 → 候選有 Repo 及文件證據；查無來源 → 回報不足不造假；惡意 Skill → 列注入／資料外送風險，不安裝
- **Workflow 草案**：需求拆解 → 多詞搜尋 → 官方來源 → 權限風險 → 比較 → 人工核准。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 14. `google-maps-saved-places-cleanup-classification` — Google Maps 收藏地點自動分類、搬移與回讀驗收

- **原文／來源**：原 `prompt` 保存不變；User-provided Traditional Chinese computer-use prompt。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：Google Maps 的喜愛、想去、加星號和自訂清單互相重疊，地點狀態、備註與共同清單歸屬不一致；若直接批次清除舊標記，可能遺漏收藏、誤刪筆記或變更他人的清單內容。
- **Trigger**：清查個人已儲存地點並計畫重新分類。
- **Not trigger**：沒有帳戶權限、備份和刪除核准，不清空舊標記或移除永久歇業的地點。
- **Inputs**：{{PLACES}}（必填）、{{CATEGORIES}}（選填）、{{WRITE_APPROVAL}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：完整備份與地點身分索引；分類與高風險變更預覽；僅在授權後的批次驗收及異常清單
- **Failure／Risk**：沒有帳戶、備份或授權，僅提供離線分類草案。；停業狀態、清單歸屬不明時不刪除地點或他人內容。。原始 Prompt 要求實際批次刪除舊標記；安全改良版增加不可逆操作明確核准 Gate，不更改原文。
- **Test Case（僅規格、未執行）**：已授權清單 → 可產生可回復預覽，不立即寫入；共同清單 → 不能變更他人地點；永久歇業待核 → 未獨立核准前禁止刪除
- **Workflow 草案**：備份 → 身分驗證 → 分類預覽 → 高風險核准 → 小批搬移 → 回讀驗收。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 15. `hiring-manager-five-difficult-questions` — Hiring Manager 視角 — 預測五個困難面試題

- **原文／來源**：原 `prompt` 保存不變；User-provided verbatim Chinese prompt, 2026-10-27。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：面試練習沒有連回職缺需求與候選人真實履歷，難以辨認將被質疑的經驗缺口。
- **Trigger**：用 CV 與特定 JD 找出最需要準備的能力證據和追問。
- **Not trigger**：不宣稱知道該公司真實面試題目或招聘委員評分。
- **Inputs**：{{CV}}（必填）、{{JD}}（必填）、{{EVIDENCE}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：五題依 JD／CV 排序的模擬追問；每題考察重點、證據缺口及回應策略；優先練習次序
- **Failure／Risk**：沒有 JD 或 CV 時先要求資料，不推測企業要求。；真實成果不完整時以待補標示，不捏造經歷。。短句原文保留；Hiring Manager 題目只是模擬，非企業題庫。
- **Test Case（僅規格、未執行）**：完整 CV 與 JD → 五題均對應需求及已知經歷；履歷不匹配 → 誠實指出缺口而非造假；只有公司名稱 → 不猜測內部面試題庫
- **Workflow 草案**：JD/CV → 證據差距 → 五題 → 練習回答 → 補資料。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 16. `ibkr-weekly-risk-adjusted-performance` — IBKR 每週風險調整投資績效 × SPY

- **原文／來源**：原 `prompt` 保存不變；User-provided Threads screenshots (original post URLs unavailable)。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：只看資產增長可能混淆市場報酬、現金流、選擇權損益與風險調整後表現。
- **Trigger**：依合法匯出帳戶報表檢查週期性投資績效與基準比較。
- **Not trigger**：沒有逐日估值或現金流時不能臆測 Rolling Sharpe／Beta。
- **Inputs**：{{STATEMENT}}（必填）、{{DATE_RANGE}}（必填）、{{BENCHMARK}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：資料品質、現金流與金融工具核對；有足夠資料時的風險調整指標及對照圖；無法計算的逐項原因、公式與來源
- **Failure／Risk**：缺逐日資料則不能生成 63／105 日移動統計。；SPY 與帳戶期間、幣別不一致時不得直接比較。。截圖不提供真正 IBKR 帳戶日資料；沒有逐日數列不生成 Rolling 指標。
- **Test Case（僅規格、未執行）**：完整逐日資料 → 按幣別與現金流解釋 TWR／MWR；只有月摘要 → 不虛構日報酬及 Rolling 圖；衍生品負收益 → 正確揭露曝險與結果限制
- **Workflow 草案**：報表匯出 → 來源與幣別稽核 → 績效計算 → SPY 對照 → 解釋限制。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 17. `interactive-one-question-mock-interview` — Mock Interview — 一問一答、逐題評分與改進

- **原文／來源**：原 `prompt` 保存不變；User-provided verbatim Chinese prompt, 2026-10-27。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：只閱讀面試題答案無法訓練即時口頭表達，也缺少逐題診斷與進步紀錄。
- **Trigger**：訓練即時表達能力並逐題收集具體改進證據。
- **Not trigger**：使用者尚未答題時不先替他回答或給分。
- **Inputs**：{{TARGET_ROLE}}（選填）、{{BACKGROUND}}（選填）、{{LANGUAGE}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：第一回合僅一個問題並等待回答；回答後的可理解評分、回饋與示例；下輪追問與持續練習紀錄
- **Failure／Risk**：無回答時不得評分或自創答案。；文字回覆無法證明實際口說韻律與發音。。原文要求逐題對話；沒有實際回答前不能先評分。
- **Test Case（僅規格、未執行）**：初次啟動 → 只問第一題；提供一段回答 → 評分理由引用實際內容；未回覆 → 不連續產生後續十題
- **Workflow 草案**：出題 → 使用者回答 → 逐題回饋 → 追問 → 待改善紀錄。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 18. `japanese-storybook-travel-itinerary-single-html` — 日系繪本風旅遊行程網站生成（Notion → Single HTML）

- **原文／來源**：原 `prompt` 保存不變；User-provided social post excerpt (original post URL not provided)。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：一般行程筆記難以直接形成兼顧美感、交通資訊、每日時間軸、手機瀏覽與待辦互動的旅遊網站。
- **Trigger**：把旅行日期、航班、住宿與每日活動轉為可在手機閱讀的互動行程。
- **Not trigger**：沒有 Notion 存取權或行程內容時，不擅自編造票價、航班與地點。
- **Inputs**：{{ITINERARY}}（必填）、{{VISUALS}}（選填）、{{DEPLOYMENT}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：單頁 HTML 的資訊架構與互動規格；有實際執行時才交付 HTML 檔；手機、鍵盤、動畫減量的驗收清單
- **Failure／Risk**：未提供日期或時間時使用待確認，不顯示假倒數。；要求完全離線時外部 Fonts 需提供降級選項。。社群分享的 HTML Prompt 未經本次執行；Notion 原文無授權時不讀取。
- **Test Case（僅規格、未執行）**：資料完整 → 每個航班與日程對應來源；缺少日期 → 不生成虛構倒數或航班；減少動態 → 所有裝飾動畫受 prefers-reduced-motion 控制
- **Workflow 草案**：行程來源 → 欄位正規化 → HTML/SVG → 互動 → Responsive 驗收。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 19. `jev-router-opus-effort-only-configuration` — jev-router — 固定 Opus、僅選 Reasoning Effort 的 Claude Code 設定

- **原文／來源**：原 `prompt` 保存不變；[上游 Repo](https://github.com/dominicrico/jev-router)。已讀官方 Repo 方法文件；衍生改寫非官方 Prompt
- **Problem**：Claude Code 的自動 model router 會因不同任務切換 Haiku／Sonnet／Opus；有些使用者只想固定使用 Opus，讓獨立路由器調整推理強度，並希望保留備份、確認及失敗 fallback。
- **Trigger**：研究希望維持單一模型且只調整 Reasoning Effort 的配置是否可行。
- **Not trigger**：不能直接複製舊版參數、使用明文 /jev key 或假設必能鎖住模型。
- **Inputs**：{{CLAUDE_VERSION}}（必填）、{{JEV_VERSION}}（必填）、{{POLICY}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：目前版本與設定相容性對照；固定模型的已知限制、快取及外送風險；需授權的備份、修改和實際驗證計畫
- **Failure／Risk**：參數對應版本或容許範圍不明時禁止直接修改。；API Key 一律不可透過聊天或明文設定檔展示。。官方 Jev Router README 已讀；使用者原始設定範例不能取代當前 OPTIONS/CHANGELOG，不能要求明文 key。
- **Test Case（僅規格、未執行）**：有官方版本文件 → 核對所有參數範圍；過期配置 → 指出 1.01 範圍風險與 Cache 不確定性；沒有 key → 不要求貼出 secret，先保持只讀
- **Workflow 草案**：版本確認 → 官方參數 → 資料外送檢查 → 備份提案 → 核准修改 → 重讀／測試。未建立正式 Capability／Graph Edge，無外部模型執行證據。

### 20. `job-application-cv-jd-gap-audit` — 履歷與職缺對照 — 3 個致命盲點檢查

- **原文／來源**：原 `prompt` 保存不變；User-provided verbatim Chinese prompt, 2026-10-27。使用者提供或歷史整理素材；未認定有正式原作者／網址
- **Problem**：通用 CV 沒有針對 JD 提供可查證的職務匹配證據，容易被 HR 或 Hiring Manager 快速略過。
- **Trigger**：投遞指定職位前找出履歷表達與職務要求的主要落差。
- **Not trigger**：沒有 JD 或 CV 不假裝給出精準職缺匹配結論。
- **Inputs**：{{JD}}（必填）、{{CV}}（必填）、{{EVIDENCE}}（選填）
- **Copy／Output**：保留原文，提供新增獨立 `adaptedPrompt`；預期：JD 與履歷的可追溯需求對照；三個排序後的真實落差與修改範例；待補證據與不能彌補的資格差距
- **Failure／Risk**：沒有 JD 時不擅自設定特定職位要求。；真實經驗不符時不能虛構資歷補齊差距。。原始 CV/JD 三盲點 Prompt 保留；職缺與履歷內容未實際提供，不能宣稱分析過。
- **Test Case（僅規格、未執行）**：完整 JD/CV → 三個問題對應明確證據；缺少 KPI → 不填假的百分比；不符合硬性資格 → 明確列出而非過度包裝
- **Workflow 草案**：JD → CV → Gap → 證據補強 → 人工核實 → 定稿。未建立正式 Capability／Graph Edge，無外部模型執行證據。


## 原始欄位 Preservation／資料缺口

- 每筆新 JSON 相較原欄位只新增 `promptGuide`／`intakeReview` 及更新日期；一筆既有 Guide 維持內容不變。主 `prompt` 原文、`originalSharedText`、`originalUserInput` 及全部 Classification／Refs 不改動。
- 未提供真實 CV、JD、行情、交易費率、Google Maps 收藏、Notion 行程或完整聊天歷史，因此不能聲稱這些 Prompt 在實際業務資料上驗證過。
- 報告中的「虛構輸入／輸出格式示意」是人工編寫的預期呈現，不是實際模型答覆。
- 本 Repo CI 的靜態驗證、Graph、Browser／Copy、main Deploy、部署後 Live Smoke 須各自保留真實 Run ID；在驗收前為 **IN PROGRESS**，不得使用前一批 Skills PASS 當作本次結果。

## 下一步（待填真實執行證據）

1. PR #（待建立）：Unified Intake、V2 Data Validate、P1 Graph／Browser 三項 Gate。
2. 確認最終 PR Head 通過後才能 Merge；隨後核對 main 四個 Gate 與 Catalog Sync。
3. Pages 完成**後**再跑 Live Smoke，核對正式站資源、原始版／可重用版切換與 Copy，及 375／430／768／1440px。
4. Session Handoff 應記錄精確 PR、Commit、Run、時間、未測範圍與最後 15 筆 ID；Docs-only 文件更新如觸發新版 Pages Deploy 必須再補部署後 Smoke。

## 尚未處理的 Batch 02（第 21–35 筆）

21. `knowledge-vault-session-handoff`
22. `mermaid-happy-error-path-code-test-evidence-audit`
23. `multi-agent-content-pipeline-orca`
24. `portfolio-case-study-storytelling-presentation`
25. `pstack-create-verification-todo-persistence-example`
26. `role-reversal-meta-prompt-generator`
27. `single-file-svg-motion-prototype`
28. `sol-astra-end-user-ui-critique`
29. `star-resume-experience-three-rewrites`
30. `stepwise-ai-work-delegation-discovery`
31. `tradingview-twstock-rsi-volume-pine-indicator`
32. `tradingview-twstock-signal-to-backtest-audit`
33. `ui-dissatisfaction-question-by-question`
34. `web-mcp-existing-systems-skills-design`
35. `weekly-ai-headhunter-job-search`

