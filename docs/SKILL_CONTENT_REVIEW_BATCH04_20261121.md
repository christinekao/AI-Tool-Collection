# Skills Phase 2 — Batch 04 原始來源與內容審查

2026-11-21（Asia/Taipei）｜Base main `5b30be7aeda7df09ff99c546e75b9fd8b79ed39c`｜Branch `skill-content-batch04-20261121`

## Scope／Source Evidence
- 第 61–80 筆，20/20 Canonical Skill，按檔名排序不重複；全部補 Skill Guide、Input/Output/Steps/Risk/Gate 與 Intake Review。
- **20/20 個官方目前可讀的 README／SKILL.md 查核完成**，包含 JIT/Taste/LAT 等目前非根目錄的 SKILL.md，並核對 Kubai 原始 LICENSE。
- 保留 ID、原始 Tags、Primary/Secondary Domains、全部 Typed Resource/Concept/Workflow Refs。Derived Catalog 及 Graph 只同步這 20 筆，沿用最新 main 的其餘 Records。
- 集合計數不變：270 Resources／123 Skills／68 Concepts／35 Prompts／17 Combinations／36 Workflows；Graph 569 Nodes／1816 Edges。
- **嚴格區分** SOURCE REVIEWED 和 RUNTIME/SECURITY/INTEGRATION/INDEPENDENT LICENSE NOT TESTED；不執行第三方 Skill、下載模型或接觸 User Keys。

## 逐筆 Before / After
| # | Canonical Skill | Inputs/Outputs | Source |
|---:|---|---|---|
| 61 | `jakeschincariol-day-trader-skill-trader-risk` | 2/1 → 3/3 | Official README/SKILL.md |
| 62 | `jakeschincariol-day-trader-skill-trader-scanner` | 2/1 → 3/3 | Official README/SKILL.md |
| 63 | `jakeschincariol-day-trader-skill-trader-timemachine` | 2/1 → 3/3 | Official README/SKILL.md |
| 64 | `jit-learning-loop` | 0/0 → 3/3 | Official README/SKILL.md |
| 65 | `juneyaooo-rea-video` | 4/4 → 4/4 | Official README/SKILL.md |
| 66 | `k-dense-ai-scientific-agent-skills` | 0/0 → 3/3 | Official README/SKILL.md |
| 67 | `kkkkhazix-khazix-skills` | 0/0 → 3/3 | Official README/SKILL.md |
| 68 | `kubai087-kubai-icons-skill` | 3/2 → 3/2 | Official README/SKILL.md |
| 69 | `lawpowen-ui-chat-desktop-interactions` | 3/3 → 3/3 | Official README/SKILL.md |
| 70 | `lawpowen-ui-design-standards` | 3/3 → 3/3 | Official README/SKILL.md |
| 71 | `lawpowen-ui-feedback-patterns` | 3/3 → 3/3 | Official README/SKILL.md |
| 72 | `lawpowen-ui-ux-pro-max` | 3/3 → 3/3 | Official README/SKILL.md |
| 73 | `leemysw-yovoice-yovoice` | 2/1 → 3/3 | Official README/SKILL.md |
| 74 | `lemomo-ai-lemo-opuscar` | 5/4 → 5/4 | Official README/SKILL.md |
| 75 | `leonxlnx-taste-skill` | 5/4 → 5/4 | Official README/SKILL.md |
| 76 | `lieflat-less-ai-tone` | 0/0 → 3/3 | Official README/SKILL.md |
| 77 | `littlehole2025-token-saver-handoff` | 3/3 → 3/3 | Official README/SKILL.md |
| 78 | `loopagentteams` | 0/0 → 3/3 | Official README/SKILL.md |
| 79 | `lucasmarkes-hairline-adopt` | 3/2 → 3/2 | Official README/SKILL.md |
| 80 | `lucasmarkes-hairline-create` | 3/3 → 3/3 | Official README/SKILL.md |

## 逐筆可重用操作契約

### 61. `jakeschincariol-day-trader-skill-trader-risk`
- Source：[正式上游文件](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-risk/SKILL.md)。版本證據：官方 Risk Manager；交易風控 PASS/BLOCK，不代表策略必然賺錢。
- **Trigger**：使用者準備審查美股交易提案是否符合每日／單筆風險、交易時窗與帳戶限制。
- **Not Trigger／停止邊界**：只有交易提案才審核；離場平倉不應因當日新開倉限額被阻止。
- **Host／Command**：在已授權的 Day Trader Host 使用 `/trader-risk [orders.json]`，執行 check.py；PASS 是交給 Broker 的必要條件，不是下單許可。
- **Inputs**：trader/orders.json 的待驗訂單與今日對應指紋；trader/config.json 的單筆及每日風險、股數、標的排除規則；Portfolio／已用風險、最新報價、NYSE 日期及交易窗口。
- **Outputs**：每張提案 PASS 或 BLOCK、具體規則與量化原因；trader/state/risk.json 的當日審核紀錄及相符指紋；Broker 只可讀取該日該筆 PASS；BLOCK 不可送出。
- **Execution**：讀取委託與風險設定，確認有效 Entry/Stop/Target → 以 Entry 與新鮮報價的較高者估算潛在虧損，並計算回報風險比 → 檢查每日風險、時段、重複、禁止標的、現金和委託格式 → 逐張輸出 PASS/BLOCK 及當日 Fingerprint，保留可檢查日誌。
- **Risks**：Broker 權限：即使 PASS 仍需逐單使用者確認和 Host Allow；市場變動：風控使用的報價可能變舊，委託更動需重新檢查；平倉限制：退出既有曝險不能誤套禁止新倉的規則。
- **Acceptance**：同日指紋和送單參數完全相符；每條 BLOCK 有機械可查核理由且無券商呼叫；平倉／新開倉的 Gate 不混用。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 62. `jakeschincariol-day-trader-skill-trader-scanner`
- Source：[正式上游文件](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-scanner/SKILL.md)。版本證據：官方市場掃描：Nasdaq Trader 股票池、Yahoo Daily/5m、Daily 和 ORB。
- **Trigger**：需要建立美股當日監看清單，篩選突破、旗型、超賣或盤中 Opening Range 走勢。
- **Not Trigger／停止邊界**：篩選命中只是符合形態，並不代表推薦買進、實際入場訊號或有效策略驗證。
- **Host／Command**：已授權 Host 使用 `/trader-scanner daily|orb`，可設 `--at HH:MM`、`--min-price`、`--no-write`。
- **Inputs**：Nasdaq Trader 股票清單與指定 Tickers 或選股 Universe；合法 Yahoo K 線資料、New York 時間和 Session 時段；價格／流動性門檻、掃描模式及是否允許寫入檔案。
- **Outputs**：trader/watchlist.json 的 mode、as_of、scanned／failed 和 hits[]；命中形態、價格／成交量證據與資料時間；未取得資料的代碼清單與需後續確認的個股。
- **Execution**：由 Nasdaq Trader 或授權清單建置可掃描股票池 → Daily 模式以歷史收盤價／成交量判斷候選形態 → ORB 模式使用交易日已完成 5 分鐘 K 線確認 Opening Range → 保存 watchlist.json 並交給 News/Entry 作後續人工查驗。
- **Risks**：資料負擔：批量網路查詢有限速、延遲和市場休市風險；選樣偏誤：掃描預設門檻會排除部分標的且並非預測工具。
- **Acceptance**：Universe、失敗數及每個 Hit 的 as_of 清楚；未收盤 K 棒不冒充已確定突破；不向券商送委託或宣稱保證勝率。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 63. `jakeschincariol-day-trader-skill-trader-timemachine`
- Source：[正式上游文件](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-timemachine/SKILL.md)。版本證據：官方時間機器：60 天 5 分鐘棒、10,000 次重抽與歷史形態對照。
- **Trigger**：已有 Entry／Stop／Target，想在配資前評估歷史情境中先觸 Stop、先觸 Target 或收盤無觸發的比例。
- **Not Trigger／停止邊界**：回放與蒙地卡羅是假設性分析，不能稱為經過前瞻驗證的真實未來機率。
- **Host／Command**：在已授權環境使用 `/trader-timemachine [plan.json|TICKER]`；支援 `--replays`、`--seed`、`--offline`。
- **Inputs**：trader/plan.json 的 Entry、Stop、Target、時間與交易標的；可用的歷史 5 分鐘 K 棒、回放區間及種子設定；模擬次數、時間到期與交易成本／滑價假設。
- **Outputs**：Target-first／Stop-first／Neither 的模擬比例；交易結束價格、平均 R、歷史相似觸發比較；按需 trader/timemachine.json 或 ASCII Fan Chart。
- **Execution**：確認交易計畫及歷史資料有可比期間 → 按設定抽樣／重組歷史 K 棒 10,000 次或指定次數 → 對照歷史相同入場模式，輸出結果分布與假設 → 解讀偏誤、資料窗與風險，再交由 Budget 建立提案。
- **Risks**：回測偏誤：隨機重抽保留不了所有時間依存與黑天鵝風險；成本假設：滑價、交易費與流動性會改變結果。
- **Acceptance**：清楚列出日期窗、次數、種子與情境假設；模擬機率不得解釋成實際勝率保證；只回放，不提交交易單。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 64. `jit-learning-loop`
- Source：[正式上游文件](https://github.com/cyyeh/jit-learning-loop/blob/main/skills/jit-learning-loop/SKILL.md)。版本證據：官方 Apache-2.0；三級 Guided／Shared／Review 與兩個學習檢查點。
- **Trigger**：使用者希望在完成工程任務時真正理解 API、Codebase、設計取捨與錯誤模式。
- **Not Trigger／停止邊界**：使用者只求立即交付且無學習需求時不要強制提問；重大事故先修復再回顧。
- **Host／Command**：在 Agent Skills 相容 Host 啟用 `jit-learning-loop` 學習模式；只在預測與遷移理解兩個檢查點暫停。
- **Inputs**：具體工作需求與目前程式碼／錯誤現象；學習者對本主題的程度 1/2/3，或讓 Agent 校準；可以實際驗證的測試、實驗環境及任務期限。
- **Outputs**：Concept／API／Codebase／Behavior 四類 Knowledge Gap Map；3–5 個核心概念的最小 Mental Model、預測與實驗；最終工程變更、Diff 的 Invariants／Failure Modes 與 1–3 個 Lessons。
- **Execution**：校準學習級別與任務緊急度，選出本次要保留的認知工作 → 盤點已知／未知並建立最小模型，不擴張成整堂課 → 在實驗前要求使用者提出預測並記錄可推翻條件 → 實作、讀 Diff、請使用者回答遷移問題，依正確性漸進收回協助。
- **Risks**：認知替代：Agent 不應在 Shared/Review Level 越權重寫所有答案；事故延誤：發生阻斷或 Outage 時先恢復服務，再做理解回顧。
- **Acceptance**：真實任務完成有 Build/Test 證據；學習者能回答新的 Transfer Question，而非只複述講解；只在兩個指定檢查點要求互動。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 65. `juneyaooo-rea-video`
- Source：[正式上游文件](https://github.com/JuneYaooo/rea-video/blob/main/skills/rea-video/SKILL.md)。版本證據：官方逐鏡拆解 Skill；離線工具／可選 VLM、Shot Review、可追溯影格報告。
- **Trigger**：有合法參考影片，希望判斷逐鏡製法、字幕、聲音、素材和原創重製方案。
- **Not Trigger／停止邊界**：不能從單一畫面斷言真實的 AI 生成來源、鏡頭器材或影片著作權；不保證一鍵重製成片。
- **Host／Command**：獲授權且已安裝後 `rea-video decompose input.mp4 -o output`，再 summary、review、apply-review；VLM 必須額外允許。
- **Inputs**：擁有檢視權限的參考影片檔案，例如 MP4；偏好的報告語言（支援 zh/en，後續回答應使用使用者語言）；可選的模型 API Key 和合法可用的 VLM；未配置時可使用離線工具與 Agent 看圖；是否希望提出拍攝／AI 生成／Remotion 的重製方案，以及是否擁有原始素材或發布授權。
- **Outputs**：逐鏡製作方式結論、概率或不確定性，和可定位的證據；分鏡與時序摘要、文字／字幕 SRT/ASS、音訊／拍攝分析及素材清單；breakdown.json、storyboard.jpg、report.html/Markdown 等具體本地檔案（只在實際執行成功後產生）；按實拍場次、AI 生成單元、程式碼動效劃分的重製工作項及未確認事項。
- **Execution**：先以工具/人工確認影片長度、切鏡候選與關鍵影格 → 分拆逐鏡底層類別、後製疊加、聲音和字幕 → 優先複核不確定片段，必要時合併人工 Review 答案 → 按證據交付分鏡報告並清楚列出無法核實來源。
- **Risks**：版權與二創：參考影片可看不等於可商用重製或複製素材；隱私與成本：遠端 VLM 會接收影格且可能計費；分類推測：影格分析不是 AI 生成偵測或鑑識保證。
- **Acceptance**：每鏡有時間碼、分類來源與信心／待確認標記；資產與聲音來源明確分離；未執行 CLI 不得宣稱輸出檔案存在。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 66. `k-dense-ai-scientific-agent-skills`
- Source：[正式上游文件](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/README.md)。版本證據：現行官方 README v2.72.0，177 個 Skill、100+ 資料庫；Agent Skills 合集而非單一 Skill。
- **Trigger**：要為生物、化學、醫學、物理、工程或研究資料查詢選用可重用研究工作流程。
- **Not Trigger／停止邊界**：不可直接將整包當成經過安全或科學有效性驗證；醫療用途不能取代專業診斷與研究倫理。
- **Host／Command**：先在 177 Skills 清單定位特定子 Skill，再查其 SKILL.md 與依賴；Source README 不構成一個通用 Slash Command。
- **Inputs**：研究問題、資料型態、科學領域與原始文獻；選定子 Skill 的依賴、資料庫帳戶與科學方法；研究倫理、敏感資料與可接受的模型／API 成本。
- **Outputs**：與研究任務對應的精確子 Skill／資料庫來源；適用的研究步驟、輸入輸出與方法限制；引用、重現性、缺口和獨立領域驗證計畫。
- **Execution**：先將問題映射到生醫／化學／計算／論文等領域 → 對選中的子 Skill 再讀上游原始契約、License 和依賴 → 用受控資料源查核假設、版本、研究方法 → 紀錄引用與重現步驟並由領域專家驗收。
- **Risks**：生醫高風險：研究指引不能視為診斷、治療或臨床安全認證；依賴與授權：各資料庫需遵守存取、隱私、License 和 API 條款。
- **Acceptance**：實際選用的每個子 Skill 有原始 SKILL.md 與版本；研究結論標示資料與方法誤差及可重現性；177 是來源當下快照，不當作永遠固定數量。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 67. `kkkkhazix-khazix-skills`
- Source：[正式上游文件](https://github.com/KKKKhazix/khazix-skills/blob/main/README.md)。版本證據：作者官方 README：6 個技能 leader、storage-analyzer、aihot、neat-freak、hv-analysis、khazix-writer。
- **Trigger**：希望從個人 Agent Skill 合集選擇任務定義、儲存空間分析、資訊整理或寫作技能。
- **Not Trigger／停止邊界**：合集不應無條件觸發所有 6 個；磁碟清理或文件整理不可在缺少授權時修改資料。
- **Host／Command**：先根據目的選唯一適合的子 Skill，再核對其 SKILL.md；合集本身不是單一正式 Command。
- **Inputs**：目標任務及是否涉及本機檔案／遠端資訊；選定子 Skill 的版本和環境要求；清理範圍、可刪項目及是否只讀 Preview。
- **Outputs**：依問題選擇六種子 Skill 的對照表；子技能特有的輸入、輸出與風險說明；需要實際執行時的預覽差異與手動核准清單。
- **Execution**：按需求分類 Leader／Storage／AIHOT／Neat-Freak／Analysis／Writer → 打開原子 Skill 文檔，先確認環境與權限 → 先用只讀或 Preview 模式，產出差異和危險動作清單 → 經核准才執行個別 Skill，逐筆檢查成果。
- **Risks**：刪檔風險：Storage／Neat-Freak 可能移動／刪除使用者檔案；遠端查詢：AIHOT 的資訊與流量來源需核對並明示。
- **Acceptance**：六子技能數與官方目錄一致；每個實際操作有獨立准入與恢復方案；未安裝執行時不冒稱整理已完成。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 68. `kubai087-kubai-icons-skill`
- Source：[正式上游文件](https://github.com/kubai087/kubai-icons/blob/master/SKILL.md)。版本證據：官方 v2.0.0：分層動態／16 網格雙色面性；Kubai Icons License 為 Source-Available、不是開源。
- **Trigger**：需要製作與品牌一致的 SVG 功能圖示及可選 Hover 動態。
- **Not Trigger／停止邊界**：既有授權範例圖示不可另行包裝成可販售圖示庫；不得將 Source-Available 誤寫為 MIT 或自由再散布。
- **Host／Command**：在有授權的 Kubai Icons 專案選 `kubai-icons` 分層動態或獨立 `kubai-duotone`；Check/Export 腳本執行需權限。
- **Inputs**：功能列表或產品程式碼；圖示交付模式（動態／靜態）；目標專案與設計要求。
- **Outputs**：一致風格的圖示定義、動態圖示或獨立 SVG；自檢截圖與檢查結果。
- **Execution**：根據用途選分層立體或雙色小尺寸模式 → 依該模式文件與範例定義圖示幾何／色彩／動作 → 執行 check.mjs，檢查 findings 和截圖，僅有理由才標示 allow → 使用 export.mjs 匯出 SVG 並確認平台視覺。
- **Risks**：授權：Skill 是 Source-Available，禁止未允許的 Skill 再散布或商業轉售；效能與動態：小尺寸可辨識、減少動態偏好與 SVG 可及性要檢查。
- **Acceptance**：選定模式與原文件版本一致（v2.0.0）；每張圖示的 Check／Preview 問題確實排除；授權與圖像再散布範圍逐項確認。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 69. `lawpowen-ui-chat-desktop-interactions`
- Source：[正式上游文件](https://github.com/lawpowen/agent-skills/blob/main/codex/skills/ui-chat-desktop-interactions/SKILL.md)。版本證據：官方 Codex 專項 UI Skill；IME／Streaming／Split Pane／檔名辨識。
- **Trigger**：修正聊天輸入法 Enter 誤發、Streaming 讓閱讀跳動或分割視窗拖曳問題。
- **Not Trigger／停止邊界**：不適用純後端聊天服務，也不應將示例 500ms／40px／120px 當跨產品通用標準。
- **Host／Command**：透過 ui-design-standards 按需載入 `ui-chat-desktop-interactions`，以當前 UI 的事件與狀態模型實作。
- **Inputs**：實際聊天／桌面版 UI 及其輸入法與瀏覽器環境；發送快捷鍵、滾動及分欄元件的既有實作；可重現的互動問題與可觀察驗收標準。
- **Outputs**：IME 提交守衛、重複提交防護及焦點復原策略；跟隨最新／閱讀歷史／返回最新的狀態機；可拖曳分隔器與截斷檔名的內容可及性方案。
- **Execution**：先從 Bug 和元件找最小修改範圍 → 處理 isComposing 與必要的 fallback，不全域禁用 Enter → 將跟隨底部和閱讀歷史分成明確狀態並處理 Streaming → 驗證 Splitter PointerCancel／Keyboard 與檔名可查。
- **Risks**：輸入法：誤防護會吞掉使用者合法快速 Enter；狀態與無障礙：自行設距離與延遲必須有實測，不能抄示例。
- **Acceptance**：跨中文輸入法確認候選不發送訊息；User 閱讀歷史時不強制跳回底部；分欄能取消／鍵盤操作且完整檔名可及。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 70. `lawpowen-ui-design-standards`
- Source：[正式上游文件](https://github.com/lawpowen/agent-skills/blob/main/codex/skills/ui-design-standards/SKILL.md)。版本證據：官方 UI 入口 Router；專案原有標準與使用者需求優先。
- **Trigger**：修改 Web、Mobile 或 Desktop UI 時需要按問題選合適的設計子 Skill。
- **Not Trigger／停止邊界**：只有後端變更不要啟用；減少次級標籤是作者偏好，不得刪除重要單位／警告／無障礙名稱。
- **Host／Command**：先遵循現有 Project Design Rules，再依需求導向 ui-ux-pro-max、ui-feedback-patterns、ui-chat-desktop-interactions 或 Visual-Motion Reference。
- **Inputs**：現有 UI 與真實使用者主要任務；已定義的產品設計系統、可及性規範、用戶偏好；本次需要改善的問題、界線及允許修改範圍。
- **Outputs**：按任務選擇應讀的具體 Skill 與參考資料；保留必要欄位標示、操作回饋與可及性的 UI 改善建議；實作後需檢查的狀態、回應式、鍵盤／焦點驗收項目。
- **Execution**：先讀現有 Project Rules 和實際介面 → 判定是視覺、交互、回饋或聊天桌面專項 → 只查所需子 Skill 或參考資料，不重複拉入全部 → 確認重要標籤、焦點與數值資訊仍清楚。
- **Risks**：規範衝突：外部 Skill 偏好不能凌駕已批准的專案準則；可及性：移除文字標籤時仍須保留易理解的欄位與互動名稱。
- **Acceptance**：路由選擇與當次問題有直接關聯；未擴張至無關頁面或替換既有技術；行動版和鍵盤操作皆可驗。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 71. `lawpowen-ui-feedback-patterns`
- Source：[正式上游文件](https://github.com/lawpowen/agent-skills/blob/main/codex/skills/ui-feedback-patterns/SKILL.md)。版本證據：官方 UI Feedback 專項：Tooltip、Toast、Alert、Modal、Drawer、Bottom Sheet 等。
- **Trigger**：需要決定提示、確認、編輯或錯誤訊息應使用哪種互動元件。
- **Not Trigger／停止邊界**：不可把所有警告塞進短暫 Toast 或所有操作都開 Modal；不能只憑組件名稱認定具體 API。
- **Host／Command**：在既有 ui-design-standards 下按需載入 `ui-feedback-patterns`，依任務風險和可逆性選元件。
- **Inputs**：目標使用者操作及其後果；既有元件庫／平台行為和可用狀態；能否取消／撤銷、錯誤原因及保留輸入需求。
- **Outputs**：元件選型理由、可用替代元件、關閉與鍵盤互動規則；高風險操作的確認及撤銷策略；可及性與錯誤狀態的驗證清單。
- **Execution**：辨別訊息嚴重性、可逆性與上下文需求 → 挑合適 Tooltip／Toast／Alert／Modal／Drawer／Sheet → 實作取消與焦點回復、錯誤時保留表單內容 → 測試 Esc、鍵盤、閱讀器和不可逆操作確認。
- **Risks**：誤導：Toast 消失可能隱藏失敗或補救方式；損失資料：關閉 Dialog 前未確認未儲存輸入。
- **Acceptance**：高風險操作有明確確認或可逆保護；焦點與 Esc 規範經可及性驗證；失敗狀態持續可見且能重試。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 72. `lawpowen-ui-ux-pro-max`
- Source：[正式上游文件](https://github.com/lawpowen/agent-skills/blob/main/codex/skills/ui-ux-pro-max/SKILL.md)。版本證據：現行官方快照：79 Styles（50 Active）、192 Palettes、74 Fonts、119 UX Guidelines、105 Icons、17 GSAP Presets、25 Charts、22 Stacks。
- **Trigger**：需要按產品情境查可用的 Design Tokens、Charts、Typography、無障礙或技術堆疊建議。
- **Not Trigger／停止邊界**：本機搜尋資料庫的數量與規則不是跨產品通用標準，也不是原作者已做視覺驗證的證據。
- **Host／Command**：按需用 `scripts/search.py <query> --domain <domain>` 等官方本機檢索契約；安裝與執行 Python 需另授權。
- **Inputs**：專案的使用者、任務與介面截圖或程式碼；目標平台、螢幕尺寸及技術堆疊；只需查詢的 Domain／既有 design tokens。
- **Outputs**：適用的可選設計原則、版型及可及性建議；具體元件／技術棧選擇與待驗證條件；如果有明確執行權限才做本機查詢與環境驗證。
- **Execution**：先明確 UI 類型、受眾與現有視覺系統 → 選最小查詢 Domain，只取相關資料 → 對照 Product／Platform 選用而不是全數套用 → 用真實 UI Screenshot、鍵盤與響應式檢查。
- **Risks**：版本與來源：本包是本地快照，別把過時資料當官方最新準則；授權：包含來自他處的設計資料與 MIT Notice，需保留來源。
- **Acceptance**：檢索 Domain、版本及選用理由可追查；不憑資料庫數值宣稱標準化優勢；實作結果需 Browser QA 才能 PASS。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 73. `leemysw-yovoice-yovoice`
- Source：[正式上游文件](https://github.com/leemysw/yovoice/blob/main/skills/yovoice/SKILL.md)。版本證據：官方 yovoice：本地 CLI 或遠端 HTTP/MCP；App Apache-2.0，不代表模型權重均可商用。
- **Trigger**：需要透過授權的本地或遠端 yovoice 服務合成旁白、歌曲、音效、字幕或 MIDI。
- **Not Trigger／停止邊界**：未取得聲音本人同意不能做音色複製；遠端失敗不得自動切到本機安裝、反之亦然。
- **Host／Command**：先尊重用戶選擇 Local CLI／Remote MCP；Local 用 `yovoice status --json`、models list、voices list 查真實 ID。
- **Inputs**：使用者提供的腳本、語言、音樂或音訊需求；合法授權的 Speaker／參考音色與模型清單；已存在的 Local CLI 或 HTTPS/MCP Endpoint 和成本限制。
- **Outputs**：TTS、音效或歌曲音檔及生成參數；字幕／分軌／MIDI（按功能選擇）；來源、模型、Voice ID 與授權／實測結果。
- **Execution**：先確認本地或遠端執行方式，不能自行切換 → 核對 status、models/voices ID 與引用音色授權 → 選對語音/歌曲/分軌模式並在准許環境執行 → 聽檢輸出內容、版權、語音品質和存檔位置。
- **Risks**：聲音權利：未經許可不可模仿真人聲音或進行身分欺騙；遠端隱私：API/MCP 可能接觸音檔或傳輸文字；模型授權：部分權重限制非商業用途。
- **Acceptance**：選定服務的真實 Model/Voice ID 可查；同意證據、輸入音檔與輸出授權清楚；未實際生成不可標示音檔已完成。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 74. `lemomo-ai-lemo-opuscar`
- Source：[正式上游文件](https://github.com/lemomo-ai/lemo-opuscar/blob/main/plugin/skills/lemo-opuscar/SKILL.md)。版本證據：官方 Code-Rendered Film Skill；59 種 Styles 是風格不是 59 個技能。
- **Trigger**：使用者要以指定 Style 或自訂美術方向製作新的程式化短片或資料解說。
- **Not Trigger／停止邊界**：純剪輯、裁切現有影片不屬本 Skill 主流程；不應自動執行會下載依賴的 setup.sh。
- **Host／Command**：在使用者授權安裝後調用 `lemo-opuscar`，先讀 DIRECTOR／TECHNIQUE／STYLE 和設計 Treatment，再產出影片。
- **Inputs**：影片主題、長度、語言、畫面比例與品牌素材；指定 STYLE.md 或自訂的美術方向；合法擁有的音樂、語音、資料與影片素材；是否先預覽分鏡；可用且獲授權的本機 Node、Python、FFmpeg、Browser 工具。
- **Outputs**：TREATMENT.md、可選分鏡與 Look Frame；可審查的 Frame Rendering／Timeline／音樂／配音／字幕素材；僅在真正產製時才有的 MP4 與 QA 報告；可選經同意建立的自訂 Style 資料夾。
- **Execution**：先確認影片種類、Style 和必備素材權利 → 建立 Treatment、鏡頭節奏與可檢驗畫面規格 → 按獲准方案使用 Frame Renderer、音效、TTS、FFmpeg → 驗收鏡頭順序、字幕、音畫同步與檔案。
- **Risks**：安裝與成本：setup.sh 會 Clone/Install/Download，不能默認執行；授權分層：程式 MIT、示範作品 CC BY、部分語音不包含授權。
- **Acceptance**：Style／Treatment 與鏡頭符合使用者需求；影片和字幕實際播放檢查通過；第三方圖像、音樂及語音權利清楚。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 75. `leonxlnx-taste-skill`
- Source：[正式上游文件](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md)。版本證據：官方 tasteskill 2.5.1，舊 v2 摘要與安裝實體路徑已變；Source 含 Stop Hook、Browser Finish Gate。
- **Trigger**：針對公司官網、Landing Page、SaaS 產品或行銷頁，實作有產品特性且經瀏覽器驗收的設計。
- **Not Trigger／停止邊界**：不適用未授權重設計整個 App 的情境；Stop Hook 可能讀寫專案及強制 Gate，安裝前必須審核。
- **Host／Command**：現行目錄 `skills/taste-skill/SKILL.md`、名稱 `design-taste-frontend`；先讀 2.5.1 原始規則，再明確批准安裝與 Hook。
- **Inputs**：網站／產品用途、使用者、內容與品牌方向；既有前端 Repo 或新專案技術棧；可使用的品牌圖片／Logo／產品截圖及其授權條件；必須呈現的頁面區塊、資料與互動功能；可供腳本測試的 Node.js 22+、Chrome／Edge／Chromium 環境。
- **Outputs**：根據主體內容選擇的 Art Direction、版型及設計決策；已實作的 HTML／CSS／React 等前端頁面；三種寬度的瀏覽器截圖與缺陷清單；修復迭代與尚未解決／無法驗證的項目。
- **Execution**：按業務類型定內容和視覺結構，避免固定 Template → 使用真實產品圖、授權照片並建立統一 Layout → 在原技術棧實作，維持動效與排版節制 → 啟用獲核准的 Browser Checker 並逐輪修復。
- **Risks**：Hook 副作用：Stop Hook 可啟動 Node／新增 .taste-skill 證據，須先審查權限；素材權利：參考圖與品牌 Logo 要查 Copyright／License；產品適配：作者的站點設計策略不是所有 Dashboard 的 UI 規範。
- **Acceptance**：安裝的 Skill 實體路徑與版本 2.5.1 一致；每個審查結論有瀏覽器真實頁面證據；無未核准的 Hook 執行或遠端素材存取。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 76. `lieflat-less-ai-tone`
- Source：[正式上游文件](https://github.com/larashero3-dotcom/lieflat-less-ai-tone/blob/main/SKILL.md)。版本證據：官方 v2：A/B/C/X/F 級檢查、Script＋Semantic、先交報告待同意再改；CC BY-NC 4.0。
- **Trigger**：已完成文章，想有依據地檢查並最小化修正 AI 化語句而保留作者風格。
- **Not Trigger／停止邊界**：不能直接全篇強制改寫；C 只報告、X 已否決規則不得執行；原作者自述研究數字未獨立複核。
- **Host／Command**：先 `detect.py --json` 和語義候選判讀，交付報告；**收到使用者修改指示後**才改寫並重跑檢查。
- **Inputs**：經授權的最終原稿（非尚在寫的草稿）；文字格式、作者聲音及修改範圍限制；本地 detect.py 環境和必要授權，商業用途需另外核實。
- **Outputs**：改前 Rule Hit 分級與原句／修改建議報告；使用者同意範圍內的最小 Diff 改稿；改後測試 JSON 與 Before/After Markdown／HTML。
- **Execution**：先執行正規表示式和結構層檢測，保存 JSON → 以封閉判據進行語義候選辨識和人工判斷 → 向使用者呈現分級命中／例句／替代方案後等待批准 → 只改允許命中處，復測保存前後對照。
- **Risks**：著作權：公開版為 CC BY-NC，商業使用須另外取得適合授權；改寫越界：未命中或 X 級禁用規則的句子不可亂改；研究限制：官方自述統計結果不等於已獨立重現。
- **Acceptance**：改前／改後評估可比對、來源文本可追溯；沒有授權前只交付審查報告不改原文；作者立場、數字及引用未被誤改。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 77. `littlehole2025-token-saver-handoff`
- Source：[正式上游文件](https://github.com/littlehole2025/claude-saver/blob/main/skills/handoff/SKILL.md)。版本證據：原 token-saver 已更名 claude-saver；專用 Claude Desktop Code Session 管理工具。
- **Trigger**：使用者明確要求在支援的 Host 建立新 Session、保存上下文並成功後封存舊對話。
- **Not Trigger／停止邊界**：非 Claude Desktop Code 或沒有 get_session／start_session／archive_session 時，只能產出手動 Handoff；不可宣稱已開新並封存。
- **Host／Command**：在具工具的 Host 使用 `/handoff` 或使用者單獨輸入切換詞；每次必先 get_session(self) 讀當下名稱與群組。
- **Inputs**：使用者要求切換 Session 的明確意圖；當前 Session 名稱及其可核實的專案進度；已授權且真正可用的 get_session、start_session、archive_session 工具。
- **Outputs**：可獨立理解的 Handoff Brief（Done、Pending、Next、Rules、Repo/Commit 等）；若環境具備 Session 管理工具：建立的新 Session 與完成後的舊 Session 封存結果；若缺少必要工具：無操作副作用的手動交接摘要及限制說明。
- **Execution**：每次開新前重新讀取 Session 真實名稱 → 依最後數字遞增建立新標題，產生獨立可讀交接摘要 → start_session，檢查新對話真的建立並保留 Group → 確認成功後才 archive_session，若失敗原 Session 保持正常。
- **Risks**：資料損失：新 Session 建立失敗時禁止封存舊 Session；平台邊界：來源的工具名稱不代表 ChatGPT／Terminal 可用；權限：對話封存和群組搬移需 Host 明確支援。
- **Acceptance**：New Session 成功回應可追溯；原對話只在完成切換後封存；工具欠缺時未發生任何冒充的封存動作。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 78. `loopagentteams`
- Source：[正式上游文件](https://github.com/ouob-tw/LoopAgentTeams/blob/main/skills/local/lat/SKILL.md)。版本證據：正式 Skill 路徑 `skills/local/lat/SKILL.md`；User Confirmed Spec 後分 Tickets／獨立 Review／QA。
- **Trigger**：使用者明確要求 LAT／LoopAgentTeams 以多 Agent 對正式 Spec 的工程任務進行協作交付。
- **Not Trigger／停止邊界**：普通任務不可自動召喚多 Agent；Spec 未確認、Repo 權限未明或缺少工具時不能假裝已派工。
- **Host／Command**：透過相容 Host 啟動 `lat`，先讀 project config／issue tracker；Spec 核准後由 Orchestrator 協調 Designer／Implementer／QA。
- **Inputs**：明確需求、確認過的 Spec、Tickets 和 Acceptance Criteria；Repo 工作樹、Issue Tracker、Agent/Model Permissions；平行工作時的 Worktree／Port／資源 Ownership 邊界。
- **Outputs**：Spec、Tickets、Owner 與相依關係；各票實作、獨立 Code Review、整合版本與 QA 結果；PASS／FAIL／UNPROVEN／NOT_EXECUTED 和完整 Session Handoff。
- **Execution**：Designer 釐清需求並以已確認 Spec 定義範圍 → Orchestrator 檢查工作樹、Model、Cost 與任務相依後派 Tickets → Implementer 實作／測試，另一審查方核對 Diff 與變更完整性 → 合併後 QA 對需求與實際執行路徑操作測試，交付可查證結果。
- **Risks**：跨 Agent 權限：技能層決策規則不等於底層工具 ACL 強制 Gate；資料外送：公開 Repo 的 Issue 可能暴露私人路徑／機密，須選私有 Tracker；衝突成本：共用檔案和自動模型切換不得破壞既有授權。
- **Acceptance**：沒有 Spec 核准不自動擴大 Scope；每張 Ticket 有 Reviewer／QA 獨立證據；真實整合版本才能 PASS，未驗一律 UNPROVEN/NOT_EXECUTED。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 79. `lucasmarkes-hairline-adopt`
- Source：[正式上游文件](https://github.com/lucasmarkes/hairline/blob/main/skills/hairline-adopt/SKILL.md)。版本證據：官方 Hairline Adopt Skill；依賴 hairline-create，不直接動畫原 SVG。
- **Trigger**：將已有合法 SVG Logo／Icon 的可辨識物件重新建成可互動的等角線條圖形。
- **Not Trigger／停止邊界**：如果沒有合法來源 SVG 或未確認商標使用權，不要擅自轉譯；不能只動畫原 SVG 路徑。
- **Host／Command**：已安裝 Host 使用 `/hairline-adopt <file.svg> [gesture]`，轉交 Hairline Create 先做 Step 0 物件拆解。
- **Inputs**：一份授權使用的原始 .svg；可選的游標操作意圖；使用者對來源物件／保留部分的確認。
- **Outputs**：保留來源主要物件特徵的 Hairline 互動圖形；一份由 hairline-create 流程產生的單檔 HTML 與明確驗證限制。
- **Execution**：讀取 SVG 的物件、比例、幾何分層 → 提出重建後的立體形狀與游標 Gesture → 依賴 hairline-create 完成可互動 Figure 工程 → 用真實瀏覽器檢查形狀、可及性及輸出檔。
- **Risks**：商標授權：改建不會消除原 SVG/Logo 權利限制；互動誤判：必須實際重建輪廓，非直接追蹤原線條。
- **Acceptance**：原始 SVG 的辨識部件在新圖中可見；單檔 HTML 確實存在且可互動；無授權時只提供設計方案不執行。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

### 80. `lucasmarkes-hairline-create`
- Source：[正式上游文件](https://github.com/lucasmarkes/hairline/blob/main/skills/hairline-create/SKILL.md)。版本證據：官方 Hairline Create；固定 kernel.js/bench.html，單一 Figure、單檔 HTML 產出。
- **Trigger**：需要創作全新的互動式等角線條 SVG 圖形，用於產品／網站畫面。
- **Not Trigger／停止邊界**：不能直接改 Engine 或重新發明 Kernel；原文中的範例 Figures 數量不等於本專案 2026-10 早期快照的套件數。
- **Host／Command**：在已安裝 Host 使用 `/hairline-create [idea]`；提 2–3 個候選互動概念，經選擇後用 build/validate/look 流程。
- **Inputs**：圖像主題或視覺概念；使用者選擇的兩至三個候選方案，或既有 SVG 作為來源；已明確允許的工作目錄和 Node／Browser 環境（實作時）。
- **Outputs**：一份 hairline-<name>.html 無額外執行時相依的展示頁；驗證與檢查報告；如未執行 Node 或瀏覽器須註明未測；交付圖形的動態隱喻、Tour 停靠點及所依循規則。
- **Execution**：先從概念拆出物件與 2–3 個互動點子 → 依作者 rules/API 實作 Figure，不修改 Kernel/Bench → 執行 Build/Validate/Look，確認線條、立體角度與 Hover → 修正缺陷並交付單檔 HTML 與互動說明。
- **Risks**：安裝副作用：look.mjs 可能需要 Playwright-core／Chromium，須先同意；網站品質：純裝飾性圖形不能取代文字和資訊；著作權：品牌資產或外部 Logo 需獨立核對。
- **Acceptance**：Kernel/Bench 原樣保留，只有 Figure 內容新增；真實 Browser Look 與 Reduced Motion 已驗證；HTML 單檔自包含並能操作。
- **Source／Test**：OFFICIAL SOURCE READ；THIRD-PARTY NOT EXECUTED。

## 版本差異、授權與執行邊界
1. **Kubai Icons**：現行 `SKILL.md` v2.0.0 有分層動態及雙色面性兩個模式。原始 LICENSE 明示 **Source-Available、不是 Open Source**；允許用 Skill 創作的內容與再散布 Skill 本身是不同權利，不得宣稱原專案 MIT。
2. **Taste Skill**：目前 `skills/taste-skill/SKILL.md` 的版本 **tasteskill 2.5.1**。原始 YAML 宣告 Stop Hook；下載/安裝可執行 Gate Scripts 且對專案造成副作用。此版本不是舊版 v2 的同一路徑，應獨立驗證 Hook 安全及瀏覽器結果。
3. **Lieflat Less AI Tone**：目前是 **v2**，A/B/C/X/F 的規則層級，執行 Script 與語義分析後必須**先交付報告，收到使用者回覆才改寫**，並再檢查前後 Diff；原 LICENSE **CC BY-NC 4.0**，商業使用需另外處理授權。作者宣稱的 629＋270 配對研究未獨立重現。
4. **K-Dense Scientific Agent Skills**：官方目前 v2.72.0，**177 個 Skill**；部分原捆綁文件 Skills 已移除，README 的 Skills 數與 API/Database 數是來源當日快照。醫療/研究的結果不可代替診斷、治療或科學方法驗證。
5. **Khazix Skills**：官方合集目前列 6 種子 Skill；Storage/Neat-Freak 涉及清理磁碟及文件，未經授權不得移動或刪檔。
6. **Day Trader**：Risk、Scanner、Timemachine 是分析與門檻，**不會下單**；Risk PASS 不是 Broker 下單同意。歷史模擬不代表未來勝率。
7. **yovoice**：Local CLI 與 Remote MCP/API 的執行路徑、模型 ID、Voice ID 不互通；聲音複製必須有本人授權，模型權重授權可能比 App License 嚴格。
8. **claude-saver Handoff**：舊 token-saver Repo 更名。獨立開新 Session 成功前不得封存原對話，尤其不可把 Claude Desktop Code 的工具契約誤認為 ChatGPT 或一般 CLI 已有。
9. **LoopAgentTeams**：現行主要 Skill 在 `skills/local/lat/SKILL.md`；Spec 正式確認、Agent Ownership、Reviewer 與 QA 實際測試是必備條件。技能級規則不等於工具層 ACL。
10. **Rea-video／Lemo／Hairline**：文件能證明 CLI/Build 的設計，不構成已經產出影片、HTML 或擁有任何第三方媒體商用權利的證據。

## Release Gate（提交後填入實際 GitHub Actions）
- PR 最新 Head：Unified Intake Gate、V2 Data Validate、P1 Graph Unit Tests（含 Browser Smoke）。
- Merge main 後：Unified Intake、Validate、Catalog Sync、P1 Graph／Browser 及 GitHub Pages Build／Deploy。
- Live Pages Smoke 必須在 **最新 GitHub Pages 部署完成後** 重新執行，核對正式 URL 與真實 Browser。
- 原始第三方 Runtime／Security／Integration／完整 License 法律審查均未執行，不得用 GitHub CI PASS 取代。

## 下一批 Batch 05
- 第 81–100 筆精確 ID 已同步在 `docs/SKILL_CONTENT_HANDOFF.md`。
