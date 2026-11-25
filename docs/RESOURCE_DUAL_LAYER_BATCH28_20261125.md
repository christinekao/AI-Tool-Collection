# Resource 雙層知識 Batch 28｜Agent 治理、Context 與應用整合

基線：`7844730d676201d1856a74526a756aabcdbef1a5`。只修改既有 Canonical，保留 ID、原分類、Tags、知識關係及舊用途快照。Freehire 的舊來源說法另存歷史快照，更新現行驗證與登入契約。

## paperclip

- 固定上游版本：`5347c01de5bc00f4933a975b28d280ea9001339b`
- 授權：MIT（上游 LICENSE）
- 查核範圍：固定版本 README、LICENSE、heartbeat protocol、costs and budgets、heartbeat.ts、budgets.ts、approvals.ts 局部契約；未執行 Agent 或服務。
- Human Layer：把多個 AI Agent 組成有目標、角色及任務的團隊，集中查看分工、工作進度、支出與待核准事項。
- 案例：規劃 AI Cowork 團隊的任務派發與預算治理；自有測試專案、兩個 Agent 角色、明確任務與合成成本事件。 → 目標與任務分工、執行狀態、預算事件及審查紀錄。 → 用於自有 AI Cowork 控制台的任務協調、成本監控與人工驗收。
- 局部能力：
  - 派發任務及追蹤執行：可追蹤的工作領取、進度及狀態紀錄；來源 docs/guides/agent-developer/heartbeat-protocol.md、server/src/services/heartbeat.ts；Gate：先 checkout 再執行，409 衝突不得重試；Run liveness 與 Issue status 是不同狀態，均不能代替成果驗收。
  - 設定分層成本及預算限制：成本摘要、警示及依政策執行的停止條件；來源 server/src/services/budgets.ts、docs/guides/board-operator/costs-and-budgets.md；Gate：預算計量是 billed_cents，不是 Token 或訂閱額度；subscription_included 記為零元，須另管訂閱配額及核對供應商帳單。
  - 讓重要決策留下核准紀錄：核准、要求修訂或取消等狀態及相關評論；來源 server/src/services/approvals.ts、docs/guides/agent-developer/heartbeat-protocol.md；Gate：重要計畫核准應綁定最新修訂；狀態變更需核對權限，核准並不證明實作已完成。
- 缺口：Agent 執行狀態、Issue 狀態與成果驗收不能混用。；訂閱內用量記為零元，美元預算不能直接限制訂閱 Token 或配額。；跨 Agent 的權限、資料存取、Adapter 相容性與實際預算停止行為須獨立查核。；未實測服務、資料庫、執行及成本治理。

## graft

- 固定上游版本：`31681a19c10afcead60d44af0db3587874df630b`
- 授權：Apache-2.0（上游 LICENSE）
- 查核範圍：固定版本 README、LICENSE、safe-read.ts、receipt.ts、workspace-authorizations.ts、read-governor.ts；局部程式與工作區路由契約。
- Human Layer：讓 Coding Agent 先讀取程式碼的結構與必要片段，而非每次把整個大型檔案塞進 Context，並留下讀取決策與用量紀錄。
- 案例：規劃大型專案的結構化讀取與 Context 控制；自有測試 Repo、小型與大型程式檔、合成敏感檔及明確讀取政策。 → 受控完整讀取、結構摘要、拒絕原因與 Context 用量紀錄。 → 用於自有 Coding Agent 的程式探索、Context 管理及讀取驗收。
- 局部能力：
  - 依檔案大小與政策選擇讀取方式：content、outline、refused 或 error 及原因；來源 src/operations/safe-read.ts、README.md；Gate：政策基於已觀察的資料；不支援解析器時可能回空 outline，不能視為檔案沒有符號，需另查適當片段。
  - 保留讀取決策與估算用量：帶有 projection、reason 與用量資訊的 Receipt；來源 src/mcp/receipt.ts、README.md；Gate：estimatedBytesAvoided 不是實際模型 Token 或成本；拒絕與摘要仍須保留必要證據，不能用來宣稱程式完整查核。
  - 限制工作區並確認讀取入口：工作區授權資訊與受政策約束的讀取入口；來源 src/mcp/tools/workspace-authorizations.ts、src/hooks/read-governor.ts、README.md；Gate：Daemon 共享 Session 時須明確確認 worktree 與 actor；政策僅涵蓋實際經過 Graft 的入口，不能推定其他工具也被限制。
- 缺口：不支援的語言可能缺少結構摘要；需有針對性地核對原始片段。；位元組節省是估算，不等於模型計費或整體任務品質。；Graft 讀取政策不是 OS 級安全沙箱；Hook、MCP、Daemon 的涵蓋範圍須分開查核。；未實測解析器、政策逃逸、工作區隔離或 Context 節省。

## strelov1-freehire-mcp

- 固定上游版本：`883c9cdbe85c1f6e80f8b969218fe69fba7e2ce5`
- 授權：MIT（客戶端上游 LICENSE；Hosted 服務與資料使用條款另查）
- 查核範圍：固定版本 README、LICENSE、src/tools.ts、src/client.ts、src/config.ts；本機客戶端與 Hosted 文件契約，未查服務端或登入執行。
- Human Layer：讓 AI Agent 搜尋職缺、比較需求與履歷證據、建立客製 CV，並在同一求職服務中管理收藏與面試進度。
- 案例：規劃 JD 搜尋、證據式履歷與求職進度管理；合成職缺描述、匿名履歷素材、候選職缺識別及已確認的追蹤狀態。 → 職缺篩選結果、證據對應的客製履歷版本及求職追蹤規格。 → 用於自有 Career OS 的 JD、CV 版本、履歷證據與面試管理設計。
- 局部能力：
  - 按職缺需求查詢並篩選：職缺列表、完整描述、總數及忽略條件資訊；來源 src/tools.ts、src/client.ts、README.md；Gate：忽略的參數可能放寬結果，地理條件採 OR 群組；先檢查 ignored／ignored_values，不能把總數當成原始條件完全符合。
  - 建立職缺專屬履歷並保存證據：客製 CV ID、fit context、修訂紀錄與 PDF 輸出契約；來源 src/tools.ts、src/client.ts、README.md；Gate：cv_tailor 首次建立消耗 AI credit，需先核准；missing_gap 不能當已有證據，缺口須向候選人查證。
  - 追蹤收藏、申請與面試階段：收藏、已申請標記、階段與筆記紀錄；來源 src/tools.ts、src/client.ts、src/config.ts、README.md；Gate：本機 apply 只標記已申請，不代表向雇主送件；真正送件另需 OAuth、帳號權限及明確核准。現行 Hosted 文件明列所有工具需 OAuth，不再視為免登入。
- 缺口：Hosted README 目前明列所有工具需要 OAuth；舊版免登入敘述僅保留為歷史快照，不能當現行能力。；客製履歷首次建立會使用 credit，個人資料與實際送件需明確核准。；本機 apply 與真正雇主送件不同；未驗證 Hosted 實際 schema、服務端權限與職缺即時性。；外部服務資料使用、費用、保存及刪除政策需另查；未登入或傳送真實履歷。

## 驗收

3 mapped 候選；9 個用途與能力局部雙向對應、3 個設計示例。新增 Catalog 等值、雙向查詢、前台呈現及瀏覽器回歸；本地未執行測試，PR CI 待驗收。未安裝、執行第三方工具或使用真實敏感資料。117/286 已合併；本批通過後 120/286，尚未改寫 166 筆。
