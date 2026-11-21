# Skills Phase 2 — Batch 06 逐筆來源與內容審查

2026-11-21（Asia/Taipei）｜Base main `e31929c4f61d0cec965030d430e4c44ed0eadd30`｜Branch `skill-content-batch06-20261121`

## Scope／邊界
- `data/skills` 排序第 101–120 筆 **20/20** Canonical Skill，補 `skillGuide` 與 `intakeReview`；依 Trigger → Input → Execution → Output → Risk → Gate。
- **19/20 官方 README 或 SKILL.md 可直接查閱**；`viral-hook-title` 的原作者／Repo／原始 SKILL.md 無法核實，現有 CreatorSkills 網頁只能視為同類方法參考，標為 `sourceStatus=partial`、`readingSpec.status=deferred`，不得暗示它是原始來源。
- **來源去重缺口**：`reverse-skill` 與 `reverse-skill-2` 是兩個既有 Skill ID，但同指 `zhaoxuya520/reverse-skill`。為遵守保留歷史 ID 的已核准邊界，本批**不刪除、不合併**，只在兩筆 Intake 與本報告註明；未來獨立去重需檢引用與使用情境。
- 原有 Tags、Primary／Secondary Domains、Typed Refs、分類全數保留。Derived Catalog 只同步該 20 筆；Graph 僅同步 20 個 Node 文字／日期，預期維持 **569 Nodes、1816 Edges**；不從 Tags 自動新增任何 Graph Link。
- 全部第三方 Skills **沒有實際安裝、執行、模型外送、Security Scanner、Runtime、License 法律審查或 Integration Test**；文件審查不可視為全面安全及可商用保證。

## Before／After
| # | Canonical Skill | Inputs/Outputs | 上游證據 |
|---:|---|---|---|
| 101 | `oh-my-mermaid-omm-scan` | 3/3 → 3/3 | 官方文件已讀 |
| 102 | `oh-my-mermaid-omm-view` | 2/2 → 2/2 | 官方文件已讀 |
| 103 | `onetake` | 0/0 → 2/2 | 官方文件已讀 |
| 104 | `photo-riso-poster` | 0/0 → 2/2 | 官方文件已讀 |
| 105 | `punk-skill` | 0/0 → 2/2 | 官方文件已讀 |
| 106 | `qingyuna-answer-me-with-html-skill` | 3/4 → 3/4 | 官方文件已讀 |
| 107 | `rea-reverse-engineer-anything` | 4/4 → 4/4 | 官方文件已讀 |
| 108 | `research-to-diagram` | 0/0 → 2/2 | 官方文件已讀 |
| 109 | `reverse-skill` | 0/0 → 2/2 | 官方文件已讀 |
| 110 | `reverse-skill-2` | 0/0 → 2/2 | 官方文件已讀 |
| 111 | `seokwoooo-lucian-uxui` | 4/4 → 4/4 | 官方文件已讀 |
| 112 | `social-post` | 0/0 → 2/2 | 官方文件已讀 |
| 113 | `stitch-skills` | 0/0 → 2/2 | 官方文件已讀 |
| 114 | `thu-maic-openmaic-skill` | 3/2 → 3/2 | 官方文件已讀 |
| 115 | `unclebob-ub-mode` | 4/4 → 4/4 | 官方文件已讀 |
| 116 | `usestrix-strix-security-skills` | 5/4 → 5/4 | 官方文件已讀 |
| 117 | `viral-hook-title` | 0/0 → 2/2 | PARTIAL：來源身分不明 |
| 118 | `voltagent-awesome-agent-skills` | 0/0 → 2/2 | 官方文件已讀 |
| 119 | `voltagent-awesome-openclaw-skills` | 0/0 → 2/2 | 官方文件已讀 |
| 120 | `yanliudesign-mono-color-skill` | 0/0 → 2/2 | 官方文件已讀 |

## 逐筆 Trigger／I/O／Execution／Safety／Acceptance
### 101. `oh-my-mermaid-omm-scan`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/oh-my-mermaid/oh-my-mermaid/blob/main/skills/omm-scan/SKILL.md)｜官方 SKILL.md：Perspective-based Recursive Architecture；omm config language 與獨立 omm write 欄位。
- **Trigger**：使用者明確希望用 /omm-scan 分析已有授權的程式庫並產生／更新架構。
- **Not Trigger**：沒有可讀 Repo 或不希望改 .omm/ 時不執行；不得盲目全域安裝 omm CLI。
- **Host／Command**：Agent Skill /omm-scan；先查 omm config language，CLI 缺失需請使用者核准安裝。
- **Inputs**：已授權讀取的 Repo、Manifest、Entry Points；要研究的 Perspective、文件語言、.omm/ 寫入範圍。
- **Outputs**：.omm/<perspective>/diagram.mmd 與各節點描述；可展開子目錄、context/constraint/concern/todo/note。
- **Execution**：閱讀程式 → 選 Perspective → 逐層寫入 → 核對一致性。
- **Risk**：資料外洩：架構圖可能含內部服務與憑證，保留本機並禁止自動 Cloud Push；檔案修改：omm write 會改 .omm/，需先有授權、預覽及回復方案。
- **Acceptance**：每個節點都有來源程式位置且 Node ID 可對應檔名；沒有多餘 Perspective 或未核准的資料傳輸。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 102. `oh-my-mermaid-omm-view`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/oh-my-mermaid/oh-my-mermaid/blob/main/skills/omm-view/SKILL.md)｜官方 SKILL.md：本機唯讀 Viewer，預設 3000 Port。
- **Trigger**：使用者想開啟既有的 .omm/ 架構圖，或指定 /omm-view。
- **Not Trigger**：omm list 無資料應建議先 /omm-scan，不啟動空 Viewer；Viewer 不應改 .omm/。
- **Host／Command**：/omm-view [--port <port>]；需 omm CLI 與本機可啟動的 Server。
- **Inputs**：現有的 .omm/ 架構文件與專案路徑；可用 CLI、Port 和本機服務權限。
- **Outputs**：本機 Viewer URL（若真正啟動）；可展開 Mermaid Perspective、檢視階層及自動刷新狀態。
- **Execution**：確認文件 → 確認環境 → 啟動 Viewer → 核對唯讀。
- **Risk**：本機服務風險：端口綁定可能被局域網存取，不能將架構文件公開；誤報啟動：無 CLI 或沒有啟動 Server 時不能憑官方範例宣稱網址可用。
- **Acceptance**：omm list 確認內容非空，Viewer 可實際打開；不修改 .omm/ 且未公開局域網。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 103. `onetake`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/feitangyuan/onetake/blob/main/SKILL.md)｜官方 SKILL.md + README；PolyForm Noncommercial 1.0.0，商用另需授權。
- **Trigger**：需要連續單鏡頭的產品宣傳、功能 Demo 或 10–30 秒 Motion Film。
- **Not Trigger**：不適合單純套片頭與多張卡片切換；原始碼非商用授權，客戶、商業宣傳要先核對 Pro 許可。
- **Host／Command**：Claude Agent Skill onetake；所需 Python Playwright、FFmpeg、音效與 Motion Library 依環境另行核准。
- **Inputs**：真實產品功能、分鏡 Beats、UI 截圖及動作方向；長度、比例、合法影音素材、音效與商用授權。
- **Outputs**：連續鏡頭的 HTML 合成、逐格影像和影片（真正渲染後）；Continuity Oracle 的跨 Beat Score、影音檢查與失敗明細。
- **Execution**：確認授權與真實 UI → 設計 Beat Continuity → 可重現 Render → 連續性驗收。
- **Risk**：商用授權：README 明列 PolyForm Noncommercial，不能視為 MIT 或任意接案可用；高額運算與依賴：渲染、語音、音樂素材可能涉及外部工具、成本和版權。
- **Acceptance**：每個 Beat Boundary 都有可追踪 Carry，不是換張幻燈片；實際影片播放、字幕音畫與授權核對完成才標 PASS。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 104. `photo-riso-poster`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/luckdvr/photo-riso-poster/blob/main/SKILL.md)｜官方單一 SKILL.md 與 README；MIT（示例照片與輸出模型條款另計）。
- **Trigger**：要把提供的照片或文字主題抽象成 2–3 色 Riso 風格檔案海報。
- **Not Trigger**：只有文字規則，必須由有影像生成能力的 Host 執行；使用者要求精確照片複製時不能擅自改主體。
- **Host／Command**：Codex $photo-riso-poster，或將原始 SKILL.md 提供給可看圖與生圖的 Assistant；無獨立腳本。
- **Inputs**：有權使用的單張照片或文字主題；希望 likeness 忠實／標準／極簡及輸出比例。
- **Outputs**：依觀察事實整理的文字 Evidence 和生成 Prompt；一張有文字、油墨層次與適切紙色的海報圖。
- **Execution**：萃取事實 → 映射印刷 → 生成視覺 → 自行校驗。
- **Risk**：照片與人像權：原始照片、人物、品牌與 Output Platform 條款需檢查；事實憑空補造：照片模式無 EXIF 時不捏造日期；文字主題的虛構 Archive Facts 要標示為設計設定。
- **Acceptance**：可追溯每個重要圖像符號對應觀察到的事實；海報清晰、文字可讀且確實輸出，未生成不可寫完成。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 105. `punk-skill`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/adrianpunk/Punk-Posters/blob/main/README.md)｜Punk Skill v2.0.0+ Source-Public；個人非商用免費、商業需書面授權及付費。
- **Trigger**：需要社群文章封面、人物／寵物 Avatar 或個人品牌影片封面，想從 Punk 子技能選一種。
- **Not Trigger**：沒有使用者選定用途時不呼叫整包；v2.0.0+ 不能宣稱 MIT 可商用，歷史 MIT 僅對舊版本有效。
- **Host／Command**：Punk-Posters 上游三項：punk-cover、punk-avatar、punk-ip-video-cover；依實際子 SKILL.md 調用。
- **Inputs**：文章主題或可合法使用的人物／寵物／物件素材；平台、比例、風格選擇、授權用途及是否只要 Prompt。
- **Outputs**：與選定子 Skill 相符的封面／Avatar／影片封面（需真實生成）；Style ID、尺寸轉換、著作權與原圖忠實度說明。
- **Execution**：確認授權版本 → 路由子技能 → 素材與 Prompt → 生成並審核。
- **Risk**：License Gate：v2.0.0+ 非商用免費但商用需書面授權，不可沿用舊 MIT；權利和平台尺寸：真人肖像、寵物照片、品牌及 Aspect Ratio 可能不相容。
- **Acceptance**：上游版本與授權用途清楚；商業用途未授權不執行；只有成功生成並驗收的成品才宣稱完成。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 106. `qingyuna-answer-me-with-html-skill`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/QingYunA/answer-me-with-html/blob/main/skills/answer-me-with-html/SKILL.md)｜官方單一 HTML 生成 Skill；Node >=20，am.mjs render。
- **Trigger**：要把流程、技術架構、決策或複雜解說變成單頁可離線閱讀的 HTML。
- **Not Trigger**：簡單問答不需要生成 HTML；不得自動寫 AGENTS.md/CLAUDE.md 設 Always-On；影片需明確指定。
- **Host／Command**：Skill answer-me-with-html；先寫 Markdown Draft，使用 node <skill-dir>/scripts/am.mjs render - 產 HTML。
- **Inputs**：要解釋的問題、可信原始資料與語言；可用 Node >=20、Skill CLI、HTML 交付目錄、是否要求影片。
- **Outputs**：可離線檢視的單頁 HTML 與來源、Markdown Draft；CLI Output Path／錯誤行號、選配影片的真實產出。
- **Execution**：整理 Draft → 受權渲染 → 檢查渲染 → 延伸交付。
- **Risk**：全域設定與副作用：INSTALL.md 不是對修改 Agents 規範或自動安裝的授權；機密與不正確圖表：HTML 可能保存原始內部資料，需審查可分享邊界。
- **Acceptance**：CLI 真的有 HTML 輸出並通過瀏覽器視覺與錨點檢查；沒有默認啟用 Always-On 或生成未要求的影片。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 107. `rea-reverse-engineer-anything`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/morluto/rea/blob/main/.agents/skills/reverse-engineer-anything/SKILL.md)｜官方 SKILL.md metadata version 63；REA 插件與 MCP 安裝邊界已有更新。
- **Trigger**：要分析缺乏原始碼的已授權執行檔、包裝程式、Electron 或請求的 Runtime Evidence。
- **Not Trigger**：對完整可讀 Source Repo 的一般架構分析直接使用原生程式碼工具；無權限不觸碰第三方應用。
- **Host／Command**：reverse-engineer-anything；Skill 與 REA MCP／CLI 不等價；Marketplace Plugin 可能額外註冊 MCP，按真實 Handshake 判斷。
- **Inputs**：明確的合法調查目標、版本、問題與允許的測試方式；已授權的 Runtime／MCP Tools、Evidence 保存位置和不允許的行為。
- **Outputs**：選定具體調查路徑及靜態／動態原始證據；Observations／Inferences／Unknowns、重建規格及驗證限制。
- **Execution**：限制 Scope → 工具現況檢查 → 依目標調查 → 驗證推論。
- **Risk**：未授權逆向：侵權、繞過安全或蒐集第三方機密均不得執行；MCP／執行權限：安裝 Plugin 和額外分析工具會產生本機修改或執行副作用。
- **Acceptance**：調查問題可連到真實版本、時間點、檔案和工具輸出；不虛構反編譯結果；每個結論標註 Confidence 和缺口。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 108. `research-to-diagram`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/wshuyi/research-to-diagram/blob/main/skills/research-to-diagram/SKILL.md)｜官方 v1.0 SKILL.md；多輪 WebSearch + Graphviz DOT + Vector PDF。
- **Trigger**：需要從沒有已整理資料的主題開始研究，並產出人物、概念或技術關係 PDF 圖。
- **Not Trigger**：已具完整結構化資料且只想轉圖可選 structure-to-pdf；沒有網路或可靠來源不能編造關係。
- **Host／Command**：Skill research-to-diagram；需要研究工具、Graphviz，本機輸出位置與安裝需先核准。
- **Inputs**：研究問題、範圍、重點對象和可信來源偏好；可用研究工具／Graphviz、輸出位置和引用要求。
- **Outputs**：可編輯的 Graphviz DOT、向量 PDF 和來源清單；關係抽取依據、未知／爭議連結及圖表 QA。
- **Execution**：多輪研究 → 建立結構 → 繪製 DOT → 產生 PDF 與驗證。
- **Risk**：來源錯誤：研究結果會過時，單一資料來源可能偏誤；渲染與授權：依賴 Graphviz 且可能使用有版權人物圖，須確認用法。
- **Acceptance**：每個有爭議的 Edge 可指回出處或列未確認；輸出 PDF 可讀、不截字、DOT 可重產。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 109. `reverse-skill`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/zhaoxuya520/reverse-skill/blob/main/README.md)｜官方 Reverse Skill Router v1.0.1；本 ID 與 reverse-skill-2 指向同一 Repo（待去重審核）。
- **Trigger**：需要從合法逆向或資安調查任務挑選專門工具與調查路徑。
- **Not Trigger**：本 ID 與 reverse-skill-2 是同源候選重複，不應當成兩個可獨立執行的產品；無資產授權不作主動測試。
- **Host／Command**：reverse-skill 是路由／操作合集；MASTER-ROUTING、RULES、各情境子技能，不存在通用 /reverse-skill 安裝後所有任務通過的保證。
- **Inputs**：授權的 APK、Binary、Web／API 或其他調查案例；已確認允許掃描的範圍、工具版本和網路政策。
- **Outputs**：具體 Scenario Skill、工具檢查與安全 Scope Gate；Evidence／Finding／Timeline 的候選調查流程。
- **Execution**：查同源 → Scope Gate → 情境路由 → 保留證據。
- **Risk**：重複收錄：同 Repo 多 ID 可能造成搜尋重複、數量錯認，需另案去重；攻擊與工具執行：不可把來源說明變成對未知 IP 的掃描授權。
- **Acceptance**：本 ID 明記為與 reverse-skill-2 同源、未建立兩條獨立產品聲明；Scope 和工具未核准時只有文件分析，不執行掃描。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 110. `reverse-skill-2`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/zhaoxuya520/reverse-skill/blob/main/README.md)｜官方 reverse-skill Router v1.0.1；與 reverse-skill 相同上游 GitHub Repo。
- **Trigger**：已授權的逆向工程／應用安全專案，需要在多種檔案類型與工具中選擇可重現的調查流程。
- **Not Trigger**：同源的 reverse-skill ID 不表示另一套產品；未清楚確認資產、測試網路與安全邊界前不能執行工具。
- **Host／Command**：先 RULES.md → MASTER-ROUTING 或 scripts → case-init/scope.md → Scenario Skill → Evidence/Report。
- **Inputs**：合法授權的 APK、Binary、JS、Web／API、CTF 或其他具體目標；測試資產、網路 Profile、已可用工具、測試限制和所需證據。
- **Outputs**：選定特定 Scenario Skill 及工具依賴與 Role；包含 Evidence→Finding→Path、Timeline 與 Field Journal 的報告。
- **Execution**：安全範圍 → 路由情境 → 受控調查 → 整合結論。
- **Risk**：雙重用途：資安／逆向工具有侵入與資訊外洩風險，未授權不得執行；同源重複：與 reverse-skill 為相同 Repo，勿算成兩個已獨立驗證的套件。
- **Acceptance**：每項工具／目標皆有 Scope 與任務授權；每個 Finding 有版本、原始 Evidence，與未測路徑清楚。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 111. `seokwoooo-lucian-uxui`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/Seokwoooo/lucian-uxui/blob/main/skills/lucian-uxui/SKILL.md)｜官方 lucian-uxui；動態元件庫，不應推定固定 Element Count。
- **Trigger**：使用者要從 Lucian UX/UI 的現成互動元件製作網站、頁面或前端組件。
- **Not Trigger**：非後端通用 UI 工具；不得憑記憶臆造元件 ID；沒有授權外連不應執行元件 GET。
- **Host／Command**：Node CLI <skill-dir>/scripts/lucian-uxui.mjs search/get/tokens/info；讀 references/porting.md 後移植。
- **Inputs**：元件功能／指定 Element ID、專案技術框架與 Styles；已授權的元件來源、Theme、內容與可及性要求。
- **Outputs**：官方 Element ID 與取回的 HTML/CSS/JS／Tokens；移植到現有 Framework 的元件和來源註記、QA 結果。
- **Execution**：先讀專案 → 逐部件搜尋 → 只取必要元件 → 測試與歸屬。
- **Risk**：遠端套件：CLI 會從 Lucian 站／GitHub Mirror 抓取 JS，需安全審查；版權與可及性：保留原始 License Comment，不能把示例文字當真實產品資訊。
- **Acceptance**：所有 ID 與原始碼來自實際 get 而非推測；雙 Theme、鍵盤、行動寬與來源註記均合格。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 112. `social-post`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/Hao0321/claude-skill-social-post/blob/main/social-post/SKILL.md)｜官方 social-post v2.5.1 README；留言自動化是分平台／分能力 Gate，非全面 Live PASS。
- **Trigger**：想規劃社群貼文、學習個人聲線、寫文案、記錄表現或在核准後管理平台留言。
- **Not Trigger**：沒有私人 voice source 不能宣稱已學會口吻；P5 送出與三平台批次仍受限，沒有明確核准不能操作實帳號。
- **Host／Command**：官方 Skill social-post；路由 P0–P4/Workbench；P5 browser/comment actuation 預設關閉，需依逐平台真實驗收與授權。
- **Inputs**：真實貼文或聲線簡卡、目標平台和本次內容目標；發布權限、既有 F 寫作契約、觀測成效與可用的本機工具。
- **Outputs**：依指定 Voice／F 格式的可審查文案與排程；核准後的發布證據和成效／互動紀錄、候選 Pattern。
- **Execution**：判斷 Mode → 保持 Voice Contract → 人員批准 → 成效迴圈。
- **Risk**：帳號外送與誤發：評論瀏覽器操作有登入、重複送出及平台政策風險；聲線和隱私：私人 Voice、成效、Cookie／Token 不可上傳公開 Repo。
- **Acceptance**：任何發文有精確平台、內容、核准與送出回讀證據；未驗證的 FB/IG/Threads 批次能力不寫成 Production 已啟用。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 113. `stitch-skills`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/google-labs-code/stitch-skills/blob/main/README.md)｜Google Labs Stitch Skills：stitch-design／stitch-build／stitch-utilities 三組 Plugins；集合不是單一 Skill。
- **Trigger**：使用 Stitch MCP 產生設計畫面、由設計轉實作，或依現有程式碼管理可重用 UI 資產。
- **Not Trigger**：沒有 Stitch 專案／MCP 或設計授權時不能假定已可用；不能用一個泛用 stitch 指令假裝整合集合。
- **Host／Command**：官方 Plugin Marketplace（Codex）或 npx plugins（其他支援 Host），依 task 選 stitch-design、stitch-build、stitch-utilities 子技能。
- **Inputs**：Stitch Project／Design System、目標頁面或前端 Repo；可用的 Stitch MCP、Host 權限、目標 Framework 與使用限制。
- **Outputs**：選中的正式 Stitch 子技能、設計檔或實作方案；來源、Prompt、Design Tokens、可驗證前端輸出與改動記錄。
- **Execution**：選子插件 → 確認連線 → 依契約操作 → 跨端驗收。
- **Risk**：雲端設計資料：Stitch MCP 可能上傳素材／Design、涉及帳號與 API 配額；錯誤身分：此 ID 為合集，子技能路徑／Host 介面需按當次文件查證。
- **Acceptance**：選定子技能及專案 ID 存在、MCP 可用；最終設計／程式有實際原始文件、對照與測試，未執行不標已完成。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 114. `thu-maic-openmaic-skill`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/THU-MAIC/OpenMAIC/blob/main/skills/openmaic/SKILL.md)｜官方 OpenMAIC Skill：逐階段確認；Provider Keys 只依伺服器 openmaic.yml。
- **Trigger**：使用者想在 OpenMAIC 使用 Demo、本機部署、產生互動課堂或二次開發。
- **Not Trigger**：沒有選定模式和權限前不得 Clone、改設定或啟動服務；不可假設 Agent 自身的模型金鑰會提供給 OpenMAIC。
- **Host／Command**：官方 openmaic Skill，依 SOP Phase 0–5（Mode、Repo、Startup、Provider、Verify、Generate）。
- **Inputs**：Live Demo／Local／Development 模式和可合法取得的 OpenMAIC 服務；本機環境、已存在設定、後端模型供應商及資料權限。
- **Outputs**：選定模式所需的具體設定與狀態檢查；若明確要求，已受權的互動課堂生成工作及結果路徑。
- **Execution**：選 Mode → 確認既有環境 → 設定 Provider → 驗證再生成。
- **Risk**：Secrets：不要索取或在對話寫入模型 API Keys；本機修改與服務成本：每個 State Change 前確認，避免重複 Clone／覆寫配置。
- **Acceptance**：選定模式、已存狀態及所有有副作用動作均獲核准；只有服務與課堂產生真實成功才標 PASS。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 115. `unclebob-ub-mode`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/unclebob/ub-mode/blob/master/SKILL.md)｜官方 root SKILL.md，無獨立確認版本；crapper/dryer/mutator 工具需獨立審查。
- **Trigger**：使用者明確指定 /ub-mode 或要求以 First Make it Work → Make it Right → Practice 修正程式。
- **Not Trigger**：上游『Push main』不是 Git 操作許可；沒有實測測量工具時不能填 CRAP／Duplication／Mutation PASS。
- **Host／Command**：ub-mode 三段式：測試先行、根因修復、量化品質工具、紀錄／小批次提交。
- **Inputs**：已核准 Issue、Repo、既有測試和公開介面行為；可用的品質測量工具與允許變更／Commit／Push 範圍。
- **Outputs**：可重現 Red／Green Test、最小 Diff 和根因修正；CRAP／Duplications／Mutation 證據（真的執行時）、安全交接與 Log。
- **Execution**：Work → Right → Practice。
- **Risk**：未授權 Push：上游指示不能凌駕 Git Branch Protection 與使用者權限；失實指標：未安裝第三方品質工具時必須標示 NOT TESTED。
- **Acceptance**：每項可驗證行為有實際測試與前後證據；沒有超出指定分支／檔案／Push 權限。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 116. `usestrix-strix-security-skills`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/usestrix/strix/blob/main/skills/penetration-testing-with-strix/SKILL.md)｜官方 Strix Apache-2.0；九個 Agent Skills 合集，所引子技能為正式上游。
- **Trigger**：具備書面測試授權的 AppSec／Code Security／Web／API 安全評估、修補及重測。
- **Not Trigger**：沒有授權標的、Scope／時間／Rate Limits，禁止任何 Live URL 掃描；CLI 安裝不等於已可執行 Scan。
- **Host／Command**：九個官方 Skills 的路由合集；自架 CLI 或 Strix Managed Cloud 可選，需各自核准網路與程式存取。
- **Inputs**：受測 IP／URL／Repo 的所有權證明、Allowlist、時間與預算；隔離測試環境、必要權限、模型／Cloud 方案、報告格式。
- **Outputs**：只在實際掃描後才有的 PoC／Severity／SARIF 或 JSON Findings；受核准修補 Diff、獨立重測結果和盲區。
- **Execution**：先批准 Scope → 選 Skill／Mode → 受控檢測 → 修復重測。
- **Risk**：侵入風險：自主測試可能執行 Exploit，僅限明確允許的自有／授權環境；原始碼上傳：Managed Cloud 上傳 Code 或雲端資產需獨立外送許可與檔案清單。
- **Acceptance**：每張 Finding 有 Scope、證據和可重現 PoC／誤報審核；修復、回歸、重掃皆真實通過才能宣稱驗收完成。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 117. `viral-hook-title`
- Source：[正式上游或明確標示為相似來源的資料](https://creatorskills.co/create/viral-hook-title-engine)｜相關類型範例網站；**非原收藏的確定作者或正式 SKILL.md**。
- **Trigger**：想對文章或短影音題目產生多種 Hook 與標題作內容 A/B 比較。
- **Not Trigger**：原始 Skill ID／作者／正式 Repo 來源無法驗證；不得假稱此網頁為同一 Skill 或已安裝插件。
- **Host／Command**：無已核實的正式 /viral-hook-title 指令；僅整理一般可用的文案 Workflow。
- **Inputs**：題目、主要訊息、受眾、平台與內容原始事實；可接受的口吻、禁止誇張的承諾及可用真實成效資料。
- **Outputs**：多組明確區分情緒／利益／懸念的 Hook 和標題候選；A/B 假設、預期衡量指標與平台限制。
- **Execution**：固定事實 → 產生變體 → 品質篩選 → 建立測試。
- **Risk**：來源身分：現有連結只是同類方法參照，原始 Package 與 License 未確認；誤導流量：Clickbait 不得捏造承諾或不實數字。
- **Acceptance**：明確標示候選為設計示例而非原作者完整契約；來源未找到以前維持 PARTIAL、Runtime NOT TESTED。
- **Test**：SOURCE PARTIAL；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 118. `voltagent-awesome-agent-skills`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/VoltAgent/awesome-agent-skills/blob/main/README.md)｜官方 awesome-agent-skills Curated Directory；README 顯示 1497+ 索引快照，非單一可執行 Skill。
- **Trigger**：需要跨多平台查可用 Agent Skills、比對原作者、用途和 Host。
- **Not Trigger**：索引項目不一定安全或可商用；不能因收錄在目錄就認定是 VoltAgent 原創／已安裝。
- **Host／Command**：GitHub Curated Directory；先找到子技能原始 Repo、SKILL.md、License，再決定是否安裝。
- **Inputs**：要解決的問題、使用的 Agent Host 與操作邊界；願意審核的候選 Repo、平台權限和 License 限制。
- **Outputs**：候選原子 Skill、原作者與官方來源對照；Trigger／I/O／安全／授權的後續確認清單。
- **Execution**：按問題檢索 → 逐一追原始專案 → 評估風險 → 實測後收錄。
- **Risk**：供應鏈：被列在第三方目錄不代表通過審核或安全；過時資料：數量、名稱、版本會改變，1497+ 是來源當下快照。
- **Acceptance**：每個推薦均附原始 Repo／SKILL.md 而非僅目錄名稱；未安裝或掃描不宣稱相容與安全。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 119. `voltagent-awesome-openclaw-skills`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/VoltAgent/awesome-openclaw-skills/blob/main/README.md)｜官方 OpenClaw 社群索引；README 標示 5300+，Badge 5200，屬動態快照而非固定數量。
- **Trigger**：要從 OpenClaw／ClawHub 的社群 Skills 中按需求找到候選。
- **Not Trigger**：索引不是單一 Skill，列名不等於安全；不在沒有確認前安裝存取裝置的高權限技能。
- **Host／Command**：GitHub 索引與 ClawHub 類別導航；OpenClaw／ClawHub CLI 的安裝建議需核對版本與授權。
- **Inputs**：需求場景、OpenClaw Host、執行邊界和可用環境；候選原子 Skill 的原始連結、版本與 Review 條件。
- **Outputs**：分門別類的 Skills 候選與來源；需進行的 Permission／License／Security／Runtime 驗收清單。
- **Execution**：定位分類 → 審查原子 Skill → 隔離驗證 → 採用決策。
- **Risk**：OpenClaw 高權限：社群 Skill 可能讀寫本機資料或網路與帳戶；總數變動：README 5300+ 與 Badge 5200 不能當精確同步數。
- **Acceptance**：每個實際採用子 Skill 都有獨立 Scope、來源及安全驗證；目錄索引與已安裝執行的狀態明確區分。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

### 120. `yanliudesign-mono-color-skill`
- Source：[正式上游或明確標示為相似來源的資料](https://github.com/yanliudesign/mono-color-skill/blob/main/SKILL.md)｜Monocolor Editorial Print v1.2.0；原始 MIT、示例作品不自動包含於 MIT。
- **Trigger**：需要單色／雙色 Editorial Poster、Zine、商品視覺或孔版印刷風格的原創圖片。
- **Not Trigger**：不是對既有品牌或參考圖照抄；只有想要 Prompt 時不必生成圖片；沒有 Image Tool 不可假裝已出圖。
- **Host／Command**：官方 mono-color SKILL.md；可對主題或合法照片輸出 Prompt＋Image＋Recipe Note。
- **Inputs**：主題、文字／照片、目標用途與辨識需求；單色或雙色、紙色、Ratio、排版與模仿界線。
- **Outputs**：最終影像生成 Prompt 與 Raster Image（實際生成時）；簡短 Recipe：Palette、Layout、Typography 和 Print Process。
- **Execution**：確定設計意圖 → 建立視覺系統 → 生成圖像 → 視覺 QA。
- **Risk**：參考素材版權：作者示例照片／第三方研究參考不屬自動 MIT License 範圍；持久副作用：官方預設 Desktop Save Path 不能視為本環境可存取；應先確認輸出位置。
- **Acceptance**：新構圖不複製參考的圖像／文字／Logo，印刷墨色符合指定；產出圖片或明確回報 Prompt-only；真實檔案通過圖像檢查。
- **Test**：SOURCE READ；RUNTIME／SECURITY／INTEGRATION／INDEPENDENT LICENSE **NOT TESTED**。

## 主要差異和保留缺口

1. **授權**：OneTake 上游為 **PolyForm Noncommercial 1.0.0**，商業影音需另取得合法授權；Punk Skill **v2.0.0 起**個人非商用免費、商業／團隊／客戶工作需書面商業授權（歷史 MIT 不溯及新版本）；Monocolor 的 MIT 不自動涵蓋作者示例照片和第三方參考。
2. **外部副作用**：`omm-scan` 會寫入 `.omm/`，而 `omm-view` 啟動本機 Server 且按官方宣稱不改檔；這兩個皆不是 `omm-push` 的外部 Cloud Upload。Stitch 與 Lucian 需要對官方元件來源／Stitch MCP 與存取權限作獨立確認。
3. **前置及驗收**：REA Skill 與 MCP 安裝不是相同事；Research to Diagram 的 Graphviz 輸出須核對來源及字型。OpenMAIC 的金鑰要放在使用者本機安全設定，不透過聊天，且使用 Server-side Provider；UB Mode 上游指示不構成對主分支的 Push 授權。
4. **資安與社群媒體**：Strix 9 個技能涉及實際滲透測試，只能對明確受權且隔離的目標執行，Cloud 外送原始碼須經核准。Social Post README v2.5.1 的平台留言與自動送出能力分階段／分平台啟用，不能用上游離線測試冒稱所有 Live Comment Ops 已驗收。
5. **索引不是可執行 Skill**：VoltAgent 兩個 Awesome Repo 是子技能的搜尋目錄，不是裝上合集即可直接調用所有 Skills；OpenClaw 目錄 README 5300+ 與 Badge 5200 並存，數字只當當下來源快照。
6. **待驗來源**：`viral-hook-title` 仍欠原始作者、正式 SKILL.md、License 和 Trigger；不得以功能相近的網站替代來源身分。Reverse Skill 兩筆同源需另設 Dedupe Review。

## GitHub Gate／正式環境驗收

- **[PR #44](https://github.com/christinekao/AI-Tool-Collection/pull/44) MERGED**；Squash Merge Commit `47ba5d48c7b0b97b07ac28b7c6552ddf3ad1a831`，共 24 檔案（20 Canonical Skills、Catalog、Graph、Report、Handoff）。
- PR Head 三項 Gate **SUCCESS**：Unified Intake [44913338307](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44913338307)、V2 Data Validate [44913338287](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44913338287)、P1 Graph Unit／Browser [44913338317](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44913338317)。
- Main 四項 Gate **SUCCESS**：Unified Intake [44913481516](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44913481516)、V2 Data Validate [44913481528](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44913481528)、P1 Graph／Browser [44913481526](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44913481526)、Catalog Sync [44913481547](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44913481547)。
- Pages Deploy **SUCCESS**：[44913480240](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44913480240)，14:21:54Z 發布 main `47ba5d48`。
- [Live Pages Smoke #44913481627](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44913481627)：Attempt 1 **SUCCESS 但早於新版部署完成，不能用來驗收新版本**；於部署後重新執行 Attempt 2 **SUCCESS**，Log 14:22:30Z 19 個資產有效，14:22:46Z–14:22:51Z Browser／Responsive 375／430／768／1440px PASS。
- **PASS WITH GAPS**：本 Repo 的資料、Graph、Browser、Pages／Live Smoke 有真實證據；外部第三方 Skill 安裝、Runtime、獨立安全與完整 License 審查／Integration 未執行；`viral-hook-title` 原始來源 PARTIAL、Reverse Skill 同源重複待決。Docs-only 最終交接更新觸發的新 Deploy 須在完成後另跑 Smoke，記錄於 PR #44 最新驗收留言。

## 下一批
Batch 07 為最後 3 筆（121–123）：`yusufkaraaslan-skill-seekers`、`zhouxiaoka-autoclip-autoclip`、`zhouxiaoka-autoclip-product-board`。須先確認 Batch 06 真正合併和正式站驗收後，才可計入 120/123。
