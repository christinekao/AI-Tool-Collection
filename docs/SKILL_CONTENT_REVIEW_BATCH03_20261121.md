# Skills Phase 2｜Batch 03 逐筆品質審查

2026-11-21（Asia/Taipei）｜基準 main `4ead1d0942d39a61ef6037e1ae044a0b66fa100b`｜分支 `skill-content-batch03-20261121`

## 範圍與證據
- 依 `data/skills/` 檔名排序處理第 41–60 筆，共 20 個不重複 ID；新增 20 份 Skill Guide，補齊 Trigger／Input／Execution／Output／Risk／Gate。
- **19/20 現行官方 README／SKILL.md 已讀**；`irons163-orchestrate-sol-terra-luna` 來源身分混淆，標示 PARTIAL 與 readingSpec DEFERRED。
- 原分類、Tags、Typed References 一律保留；Catalog 270 Resources、123 Skills、68 Concepts、35 Prompts、17 Combinations、36 Workflows；Graph 569 Nodes／1816 Edges。
- 上游程式未安裝或執行，Runtime／Security／License／Integration **NOT TESTED**。

## Before → After
| # | Skill ID | Inputs/Outputs | Guide | Source |
|---:|---|---|---|---|
| 41 | `gbro-cover-design` | 0/0 → 3/3 | 新增 | 文件已讀 |
| 42 | `googlechrome-modern-web-guidance` | 3/3 → 3/3 | 新增 | 文件已讀 |
| 43 | `graphify-labs-graphify-v3` | 4/5 → 4/5 | 新增 | 文件已讀 |
| 44 | `gsap-skills` | 0/0 → 3/3 | 新增 | 文件已讀 |
| 45 | `guizang-product-video-skill` | 0/0 → 3/3 | 新增 | 文件已讀 |
| 46 | `gzh-design-skill` | 0/0 → 3/3 | 新增 | 文件已讀 |
| 47 | `herdr-agent-terminal-skill` | 3/2 → 3/2 | 新增 | 文件已讀 |
| 48 | `hesreallyhim-awesome-claude-code` | 0/0 → 3/3 | 新增 | 文件已讀 |
| 49 | `heydamir-unslop-skill` | 3/4 → 3/4 | 新增 | 文件已讀 |
| 50 | `heygen-com-hyperframes-agent-skills` | 5/4 → 5/4 | 新增 | 文件已讀 |
| 51 | `impeccable` | 0/0 → 3/3 | 新增 | 文件已讀 |
| 52 | `irons163-orchestrate-sol-terra-luna` | 0/0 → 3/3 | 新增 | PARTIAL／身分待查 |
| 53 | `jakeschincariol-day-trader-skill-trader-alerts` | 2/1 → 3/3 | 新增 | 文件已讀 |
| 54 | `jakeschincariol-day-trader-skill-trader-analyst` | 2/1 → 3/3 | 新增 | 文件已讀 |
| 55 | `jakeschincariol-day-trader-skill-trader-broker` | 2/1 → 3/3 | 新增 | 文件已讀 |
| 56 | `jakeschincariol-day-trader-skill-trader-budget` | 2/1 → 3/3 | 新增 | 文件已讀 |
| 57 | `jakeschincariol-day-trader-skill-trader-entry` | 2/1 → 3/3 | 新增 | 文件已讀 |
| 58 | `jakeschincariol-day-trader-skill-trader-exit` | 2/1 → 3/3 | 新增 | 文件已讀 |
| 59 | `jakeschincariol-day-trader-skill-trader-news` | 2/1 → 3/3 | 新增 | 文件已讀 |
| 60 | `jakeschincariol-day-trader-skill-trader-pelosi` | 2/1 → 3/3 | 新增 | 文件已讀 |

## 逐筆 Trigger、執行與驗收

### 41. `gbro-cover-design`
- **Source**：[官方來源／候選 URL](https://github.com/pyang5166/gbro-cover-design/blob/main/README.md)；版本：三輪提問、10 種構圖、3:4 直式封面。
- **Trigger**：需要將文章主旨整理成可供生圖模型使用的社群封面提示詞。
- **正式指令／授權邊界**：已安裝後向 Agent 提供文章並使用 gbro-cover-design；此 Skill 主要交付 Prompt，非直接生成圖片。
- **Steps**：閱讀內容萃取主張 → 三輪確認構圖與風格 → 選擇十種範例構圖之一 → 輸出可複製 Prompt。
- **Risk**：肖像隱私：不得自動公開或上傳使用者頭像；產物誤認：提示詞完成不等於圖片已生成。
- **Gate**：Prompt 清楚描述主張及 3:4 安全區；圖片與文字正式渲染仍需另外驗收；未自動發布或使用未授權素材。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 42. `googlechrome-modern-web-guidance`
- **Source**：[官方來源／候選 URL](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/SKILL.md)；版本：官方 Modern Web Guidance；示例版本 2026_11_10-47b4c80e。
- **Trigger**：開發 HTML/CSS、原生 Web API、Web UI 或 client-side JS 前確認現代指引。
- **正式指令／授權邊界**：在已安裝環境用 `modern-web-guidance search` 進行 2–5 字聚焦查詢，接著 retrieve Guide ID；不是無權限 npx 安裝授權。
- **Steps**：將需求縮成單一 Web 能力查詢 → Search 再 Retrieve 匹配 Guide → 沒匹配時改寫查詢，不硬套 → 檢查瀏覽器相容及無障礙。
- **Risk**：外部套件：npx 可執行第三方程式須另授權；錯誤指南：空結果不代表可以硬用不相干指引。
- **Gate**：Guide ID 與選用理由可回查；無故不掃全 Repo；Fallback 與實際 Browser 行為經驗證。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 43. `graphify-labs-graphify-v3`
- **Source**：[官方來源／候選 URL](https://github.com/Graphify-Labs/graphify/blob/v3/graphify/skill.md)；版本：官方 v3 分支，並非宣稱 main 最新。
- **Trigger**：需要把指定 Codebase／文件／媒體轉成帶證據的持久 Knowledge Graph。
- **正式指令／授權邊界**：在適用 Host 使用 `/graphify <path>`，加 `--update` 僅做增量；安裝 CLI 或外部 LLM 語意擷取需明確批准。
- **Steps**：先查權限與本機依賴 → 依 AST／選用 LLM 做來源擷取 → 整合 Graph、分群與報告 → 對輸出及推論來源做一致性審查。
- **Risk**：機密外送：語意擷取可能調用雲端模型；安裝副作用：禁止未核准 pip、Hooks 或 AGENTS.md 覆寫。
- **Gate**：所有推論邊保留證據等級；Graph、HTML、報告關係一致；未核准不執行安裝或外部模型。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 44. `gsap-skills`
- **Source**：[官方來源／候選 URL](https://github.com/greensock/gsap-skills/blob/main/README.md)；版本：GSAP 官方 8 個子 Skill。
- **Trigger**：前端需要 GSAP Tweens／Timeline／ScrollTrigger／React 或 Vue/Svelte 動畫。
- **正式指令／授權邊界**：依 Host 使用 gsap-core、gsap-timeline、gsap-scrolltrigger、gsap-react 等特定 Skill；不是單一萬用指令。
- **Steps**：按動畫用途選最小 Skill → 建立可控制 Timeline 和 Trigger → 處理卸載與 Resize Refresh → 檢查互動、效能及 Reduced Motion。
- **Risk**：大量動畫：可能傷害讀取與可及性；生命週期：React/ScrollTrigger 未 Cleanup 會重複執行。
- **Gate**：選用子 Skill 與任務相符；實際重掛載不洩漏 Trigger；Mobile 與減少動態設定可用。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 45. `guizang-product-video-skill`
- **Source**：[官方來源／候選 URL](https://github.com/op7418/guizang-product-video-skill/blob/main/README.md)；版本：官方 README；Repo AGPL-3.0，部分素材另有 Business Source License。
- **Trigger**：用真實產品 Repo／Release Notes 製作產品功能宣傳短片。
- **正式指令／授權邊界**：獲授權後使用 guizang-product-video-skill；相關 skills CLI 安裝是獨立操作。
- **Steps**：從產品和 Release 取真實賣點 → 建立文案與視覺敘事 → 優先掛載實際 UI 元件並配音效 → 透過 Contact Sheet／FFmpeg 驗收。
- **Risk**：License：程式碼 AGPL 與素材商用授權需分開；企業機密：不可擅自將產品 Repo 上傳影音服務。
- **Gate**：所有賣點可追溯原始功能；音樂和圖像使用權單獨確認；實際 Render 和音畫同步 QA 通過。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 46. `gzh-design-skill`
- **Source**：[官方來源／候選 URL](https://github.com/isjiamu/gzh-design-skill/blob/main/README.md)；版本：官方 README：6 套主題、雙重品質檢查、AGPL-3.0。
- **Trigger**：把 Markdown 轉成可貼入微信公眾號的內聯樣式 HTML。
- **正式指令／授權邊界**：已安裝 Host 選 gzh-design-skill 主題；產生可貼上 HTML 不等於已發布文章。
- **Steps**：依文章型別選擇主題 → 輸出避開平台過濾的內聯 CSS → 執行元件與 HTML 兩道檢查 → 在正式編輯器貼上核對。
- **Risk**：授權：AGPL 義務與圖片權利需核對；貼上失真：Browser 預覽不等於平台編輯器保真。
- **Gate**：雙 Gate 有實際檢查證據；標題／圖片／程式碼貼上不跑版；不把產出 HTML 寫成已公開發文。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 47. `herdr-agent-terminal-skill`
- **Source**：[官方來源／候選 URL](https://github.com/herdrdev/herdr/blob/master/skills/herdr/SKILL.md)；版本：官方 SKILL.md；HERDR_ENV=1 是必要 Gate。
- **Trigger**：使用者明確要求在 Herdr 中檢查或控制 Panes、Agents 和工作區。
- **正式指令／授權邊界**：先驗證 `HERDR_ENV=1` 再 `herdr --help`；非 Herdr Pane 必須停止。
- **Steps**：確認 HERDR_ENV 與使用者指定範圍 → 從當前 CLI 查命令與 Pane ID → 執行明確允許的最小控制 → 區分已送出與真正執行完畢。
- **Risk**：越權：其他 Pane 可能包含私有日誌；誤報：Queue 成功不代表 Shell 執行成功。
- **Gate**：不在 Herdr 內不使用任何控制命令；Pane ID 從 CLI 真實取得；提交、執行、完成分別標示。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 48. `hesreallyhim-awesome-claude-code`
- **Source**：[官方來源／候選 URL](https://github.com/hesreallyhim/awesome-claude-code/blob/main/README.md)；版本：社群精選索引；不是可安裝的單一 Skill。
- **Trigger**：需要尋找 Claude Code Skills、Hooks、Plugins、Security 或 Workflow 資源。
- **正式指令／授權邊界**：先用 README 類別定位，再到原作者 Repo/Skill 文檔個別核對；沒有單一 Slash Command。
- **Steps**：依需求瀏覽精選類別 → 打開原作者正式來源 → 核對版本、適用觸發與授權 → 提出最小試用候選。
- **Risk**：第三方供應鏈：列入精選不代表安全；授權：清單 License 不能繼承至所有子專案。
- **Gate**：每個候選附原始 Repo；不把索引當成可執行 Skill；未測試事項清楚。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 49. `heydamir-unslop-skill`
- **Source**：[官方來源／候選 URL](https://github.com/heydamir/unslop/blob/main/skills/unslop/SKILL.md)；版本：官方 CC-BY-4.0；九階段 UI 改善。
- **Trigger**：改善目前 Dashboard、Landing Page 或 App 的模板化設計並保留品牌特性。
- **正式指令／授權邊界**：相容 Host 使用 unslop；不是未經允許全站重構或生成素材的授權。
- **Steps**：先按 signs.md 做 Light/Heavy/No Slop Audit → 根據產品確認視覺方向 → 依 Spacing→Color→Icons→Copy→Type→Layout→Details→Visuals→Motion 修復 → 再做 Responsive/Interaction QA。
- **Risk**：品牌偏離：不能因美觀破壞原功能；素材與署名：CC-BY 與生圖權利分開確認。
- **Gate**：每個問題有可定位證據；UI 改善有 Before/After 對照；鍵盤及 375/430/768/1440px 可驗。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 50. `heygen-com-hyperframes-agent-skills`
- **Source**：[官方來源／候選 URL](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)；版本：現行官方 9 Skills：6 Core + 3 Optional（舊版 7 已過時）。
- **Trigger**：以 HTML、媒體及可 Seek 時間軸製作、修改和渲染影片。
- **正式指令／授權邊界**：依官方 Host 載入 /hyperframes；6 Core、3 Optional 按需要安裝，使用 beacon 遙測須先核對隱私設定。
- **Steps**：先從 9 Skills 選 6 Core 或需要的 Optional → 依 clip/start/duration 建可 Seek 時間軸 → 以 Check、Snapshot、Studio 預覽修正 → 確認後 Render 並逐格檢查。
- **Risk**：遙測：原 Skill usage beacon 會送出事件資訊；覆寫：Checkout 內專案安裝可能覆寫未提交檔案。
- **Gate**：現行 Skill 數量 9=6+3；實際 Seek／時間軸檢查通過；未渲染不能宣稱已交付影片。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 51. `impeccable`
- **Source**：[官方來源／候選 URL](https://github.com/pbakaus/impeccable/blob/main/README.md)；版本：24 Commands、Browser Live、PRODUCT.md、DESIGN.md。
- **Trigger**：用有產品脈絡與確定性檢查方式改善 UI 設計。
- **正式指令／授權邊界**：安裝後用 `/impeccable init`（Codex `$impeccable init`），再依任務選 critique/audit/polish/live。
- **Steps**：先讀或建立 PRODUCT.md → 另用 DESIGN.md 記錄視覺系統 → 選最小命令並局部修改 → 執行 Browser 與規則／人工審查。
- **Risk**：網路：停用遙測仍可能存取設計目錄；寫入：Live 模式會改原始碼與建立專案文件。
- **Gate**：產品事實與設計 Tokens 分離；外部連線與檔案寫入經授權；Detectors／Browser 證據分明。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 52. `irons163-orchestrate-sol-terra-luna`
- **Source**：[官方來源／候選 URL](https://github.com/irons163/orchestrate-sol-terra-luna)；版本：PARTIAL：舊 URL 來源歸屬未核實；另有 irons163/three-tier-agent-orchestrator 及 mj-siew 同名專案。
- **Trigger**：比較 Sol/Terra/Luna 三層 Agent 協作架構及不同候選專案來源。
- **正式指令／授權邊界**：沒有可靠的正式 Slash Command；在核實原作者歷史 Commit 前不安裝，也不合併 Canonical。
- **Steps**：核實作者與 Repo 身分 → 逐候選比對原始文件 → 將實際來源和概念假設分開 → 維持待覆核狀態不擅合併。
- **Risk**：來源錯置：不可把其他作者內容冒充 irons163 正式版；重複實體：未核實前不可自動刪除或合併。
- **Gate**：sourceStatus 必須 PARTIAL；沒有未證實可執行指令；保留原 ID、Tags、Typed Refs。
- **Evidence**：PARTIAL — 來源身分無法獨立核對。 

### 53. `jakeschincariol-day-trader-skill-trader-alerts`
- **Source**：[官方來源／候選 URL](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-alerts/SKILL.md)；版本：官方 Price Alerts，NYSE 時段與報價可能延遲。
- **Trigger**：要依指定股票價位、停損、目標或 Flat-by 時間建立資訊提醒。
- **正式指令／授權邊界**：已安裝後 `/trader-alerts [ticker] [price]`；提醒不等於已下單或成交。
- **Steps**：從 plan 或價位設規則 → 核對 NYSE 美東時鐘與假日 → 依授權設提醒和輪詢 → 回報時間戳與訊號狀態。
- **Risk**：延遲：免費報價與排程可能失效；誤用：警報不是已成交 Stop Order。
- **Gate**：每則提醒有 Symbol、Time 與資料來源；不冒稱風險保護或下單；未執行不宣稱持續監控已啟用。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 54. `jakeschincariol-day-trader-skill-trader-analyst`
- **Source**：[官方來源／候選 URL](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-analyst/SKILL.md)；版本：官方 SEC EDGAR XBRL 10-Q／10-K／8-K 分析。
- **Trigger**：以公司申報比較收入、毛利、EPS 與同季／TTM 趨勢。
- **正式指令／授權邊界**：已安裝後 `/trader-analyst [tickers]`；SEC 請求必須設定合法 SEC_USER_AGENT。
- **Steps**：從 CIK 定位報告 → 讀 XBRL 與 8-K 原始數據 → 用一致口徑計算季度與 TTM → 標註 Data Lag 和其他事件來源。
- **Risk**：隱私：SEC User-Agent 身分資料需安全設定；時效：公司 Facts API 可能落後最新申報。
- **Gate**：每個數字附報表期別和來源；計算可重做；不將財報分析當交易建議或保證。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 55. `jakeschincariol-day-trader-skill-trader-broker`
- **Source**：[官方來源／候選 URL](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-broker/SKILL.md)；版本：唯一可送出委託的 Skill，預設 paper，三道 Gate。
- **Trigger**：使用者明確要求送出或平倉單一已準備好的券商委託。
- **正式指令／授權邊界**：已授權 `/trader-broker [order number]`；Risk Fingerprint PASS + 使用者逐單文字同意 + Host Tool Allow 三道 Gate；Live 更需明確確認。
- **Steps**：確認 Risk Fingerprint 與實際訂單完全一致 → 展示 Qty/Stop/Target 與 Paper/Live → 取得逐筆文字同意和 Host Allow → 只提交被同意的委託並核對券商回應。
- **Risk**：財務損失：不得因研究完成自動送單；Secret：券商 API Key 禁止在聊天或 Repo 明文儲存。
- **Gate**：缺任一 Gate 不可送單；Paper/Live 分開核對；下單接受與成交回應不可混為一談。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 56. `jakeschincariol-day-trader-skill-trader-budget`
- **Source**：[官方來源／候選 URL](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-budget/SKILL.md)；版本：四道限制、整股數 Bracket Order 提案。
- **Trigger**：根據單筆最大損失、停損、現金和部位限制決定股數。
- **正式指令／授權邊界**：已安裝後 `/trader-budget`；只寫提案，不能送至券商。
- **Steps**：記錄四類資金約束 → 由 Stop 距離推算風險股數 → 只建立一筆 Bracket Proposal → 交 trader-risk 而非自行下單。
- **Risk**：滑價：Stop 不保證最大實際損失；隱私：資金與部位資料限授權處理。
- **Gate**：可重算四道限制與股數；風險超額必須拒絕；只生成提案不送單。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 57. `jakeschincariol-day-trader-skill-trader-entry`
- **Source**：[官方來源／候選 URL](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-entry/SKILL.md)；版本：Opening Range，1m/5m 已收盤 K 線，僅 Long。
- **Trigger**：追蹤 ORB 或指定價位，等待已完成 K 線收在突破門檻上方。
- **正式指令／授權邊界**：已安裝後 `/trader-entry [TICKER] --setup orb|level --interval 5m|1m`；只產生訊號。
- **Steps**：先確認交易日與開盤區間 → 只檢查已完成的 K 線 → 區分等待、觸發與過期 → 只有需求明確才寫 Entry。
- **Risk**：行情延遲：不能稱為即時成交；錯誤觸發：未完成 K 棒的瞬間突破不算訊號。
- **Gate**：訊號來自已收盤 K 棒；有來源與時區；絕無 Buy/Sell 下單 API。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 58. `jakeschincariol-day-trader-skill-trader-exit`
- **Source**：[官方來源／候選 URL](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-exit/SKILL.md)；版本：Long Entry、Stop 和 1R／2R Target 於進場前確定。
- **Trigger**：先定義交易失敗時停損與止盈目標和 Risk/Reward。
- **正式指令／授權邊界**：已安裝後 `/trader-exit`，可用 `--stop or-mid|or-low|price:X|pct:X|atr:K`、`--target 2R|1R|price:X`。
- **Steps**：確認 Entry 和 Long Side → 依 Range 或 ATR 選有效 Stop → 計算 Target 與風險報酬 → 保存計畫供後續 Gate。
- **Risk**：滑價：預設停損不是成交保證；價位錯誤：Stop≥Entry 或 Target≤Entry 必須拒絕。
- **Gate**：Stop、Entry、Target 順序有效；R 值可重算；未向券商送出 Stop/Limit Order。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 59. `jakeschincariol-day-trader-skill-trader-news`
- **Source**：[官方來源／候選 URL](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-news/SKILL.md)；版本：Yahoo RSS／SEC 8-K；News State 去重。
- **Trigger**：查詢美股 Watchlist 的近期重大新聞與 SEC 事件。
- **正式指令／授權邊界**：已安裝後 `/trader-news [tickers]`；SEC 查詢需要合規 User-Agent。
- **Steps**：讀股票清單和來源 → 取得 RSS 與官方 8-K → 事件分類並過濾重複 → 回到重大原始來源核查。
- **Risk**：延遲：免費新聞來源不等於毫秒級資訊；缺漏：SEC 失敗不能宣稱沒有申報。
- **Gate**：新聞有原文 URL 與時間；重複消息不冒充新消息；不由新聞直接送交易單。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

### 60. `jakeschincariol-day-trader-skill-trader-pelosi`
- **Source**：[官方來源／候選 URL](https://github.com/Jakeschincariol/day-trader-skill/blob/main/trader-pelosi/SKILL.md)；版本：House Clerk PTR、國會交易申報延遲數週。
- **Trigger**：閱讀國會議員公開 PTR 並比較交易日與申報日。
- **正式指令／授權邊界**：已安裝後 `/trader-pelosi [member name] [--read]`；Senate 需依正式手動路徑。
- **Steps**：查 House Clerk 公開索引 → 核對申報人與實際交易者 → 計算交易日至公開日延遲 → 僅對新揭露紀錄提醒。
- **Risk**：時效：PTR 非當日即時買賣資訊；身份：配偶交易與議員本人交易不能混淆。
- **Gate**：每筆有原始 PDF/Doc ID；Lag 清楚；不推論未揭露交易或直接下單。
- **Evidence**：官方文件閱讀完成；第三方 Runtime NOT TESTED。 

## Version Drift／例外
1. HyperFrames 官方 README 與目錄現行 **9 Skills＝6 Core＋3 Optional**；舊 7/4+3 記載過時。原始 Skill 包含 usage beacon／外部連線說明，不得無授權執行。
2. Sol/Terra/Luna：`irons163` 舊路徑與 `irons163/three-tier-agent-orchestrator` 既有項目重疊，另有 `mj-siew` 同名 Repo；未證實歷史來源歸屬，不刪除、不合併、不改原 Typed References。
3. Day Trader：八個子技能分別是 Alerts、SEC Analyst、Broker、Budget、Entry、Exit、News、PTR；**Broker 能真實送單**，其餘不能因研究／Risk PASS 擅自交易。Broker 每筆須當日指紋 Risk PASS、使用者明確文字確認、Host 工具 Allow。
4. GoogleChrome 的 npx Search/Retrieve、Graphify 的資料擷取與安裝、Herdr 的 Pane 控制及 Impeccable 的遠端目錄查詢都可能有副作用；本批僅記錄來源文件。
5. Gzh 與 Guizang 上游標示 AGPL-3.0，Unslop 有 CC-BY-4.0 標示；本批未做完整附帶素材或商用授權法律審核。

## Release Gate 最終驗證及 Fail → Fix → Retest

- **PR #41 MERGED**：[GitHub PR](https://github.com/christinekao/AI-Tool-Collection/pull/41)。最新 Head `2181c0c9969e4d0c945b38719e1d02f635409f95`，Merge `58ad31d05802923329bc42b56b8514503d8eca1c`。
- **首版缺陷（保留）**：V2 Validate [44904995216](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44904995216) **FAIL**，因首次以舊 Catalog／Graph Base 改寫本批 20 筆，回歸覆蓋前一批 20 Skill 的已合併內容；症狀為 Catalog Copy 與 Canonical 不同。根因是衍生資料的 Base 過時，不是本批新 Skill Guide 的 Schema 不合法。修復為讀取最新 main Catalog／Graph 作基準、僅覆蓋第 41–60 筆；重新執行所有 Gate 成功，原失敗作未來回歸案例。
 
| GitHub Actions Gate | 結果 |
|---|---|
| PR Unified Intake | [SUCCESS #44905209547](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44905209547) |
| PR V2 Data Validate | [SUCCESS #44905209613](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44905209613) |
| PR P1 Graph／Browser Smoke | [SUCCESS #44905209533](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44905209533) |
| main Unified Intake | [SUCCESS #44905304086](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44905304086) |
| main V2 Validate | [SUCCESS #44905304050](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44905304050) |
| main Catalog Sync | [SUCCESS #44905304079](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44905304079) |
| main P1 Graph／Browser | [SUCCESS #44905304088](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44905304088) |
| main Pages Build／Deploy | [SUCCESS #44905303818](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44905303818) |
| main Live Pages Smoke | [SUCCESS #44905304112 Attempt 2](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44905304112) |

- **正式網站部署後驗收**：Pages Deploy 於 2026-11-21 20:43:52（Asia/Taipei）成功，接著重新執行 Attempt 2 Live Pages Smoke，在 20:44:41 讀取正式公開網站 19/19 HTTP／JSON 資產並通過，20:44:44–20:44:51 Chromium 實際導覽、搜尋、Graph、Prompt、Playground 和 375／430／768／1440px 視覺響應檢查成功。這是 Deploy 後的正式網站測試，非本機 Preview。
- **結論：PASS WITH GAPS**，Batch 03 正式完成，Skills 累計 **60/123（48.8%），剩餘 63**。缺口只在上游身分的 Source PARTIAL 與第三方 Runtime／Security／License／Integration **NOT TESTED**；GitHub Actions 及 Pages 驗收均有實證。本報告更新將產生後續文件版部署，需再確認最新 Deploy 與 Live Smoke。

## 下一批
- Batch 04 第 61–80 筆精確 ID 已列在 Rolling Handoff。
