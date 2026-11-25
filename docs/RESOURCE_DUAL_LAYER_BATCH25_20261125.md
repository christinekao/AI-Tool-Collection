# Resource 雙層知識 Batch 25｜開發自動化與 Agent 治理

基線：`e8798c7587afb86d13b42ccc0fbcca56e7f09dbc`。只修改既有 Canonical，保留 ID、原分類、Tags、Concept 關係及舊用途快照。

## rtk

- 固定上游版本：`97e68d5358aa5d91d1540ea64df58c9688bcf83d`
- 授權：核心 Apache-2.0；選配 Proxy 為 BUSL-1.1（README 說明，未查完整商用條款）
- 查核範圍：固定版本 README、LICENSE、runner、tracking、gain、pipeline schema 與 savings 文件；只核對局部程式與文件契約。
- Human Layer：在 AI 寫程式時，把冗長的測試、Git 差異與終端日誌縮成較短的輸出，讓 Agent 不必把所有原始文字都讀進對話。
- 案例：規劃 Coding Agent 的終端輸出與除錯回溯；自有測試專案、固定的一組測試命令、Git 差異及合成失敗日誌。 → 壓縮前後的輸出比較、可回溯的錯誤紀錄與估算節省報表。 → 用於自有 Agent Harness 的 Context 預算規劃、除錯流程與使用量評估。
- 局部能力：
  - 縮短重複終端輸出：保留關鍵訊息的縮短輸出與原始退出狀態；來源 src/core/runner.rs、README.md；Gate：比較原始及過濾後退出碼、失敗斷言和關鍵路徑；有疑義以原始日誌或 bypass 核對，不以摘要取代驗收。
  - 估算終端輸出節省量：rtk gain 統計及可供分析的估算值；來源 src/analytics/gain.rs、src/core/tracking.rs、docs/guide/resources/savings-explained.md；Gate：bytes/4 是估算，不等於供應商實際 Token 或總帳單節省；同一命令集與原始輸出比較。
  - 評估額外壓縮與模型路由：受設定控制的額外處理規則；來源 engine/src/pipeline/schema.rs、README.md；Gate：Pipeline 可能改寫命令或將內容交給其他模型；Proxy 獨立授權，資料外送、憑證及費用須另行核准。
- 缺口：壓縮可能省略除錯細節，必須保留可查回完整輸出的途徑。；bytes/4 統計只是估算；不代表總 Context 或成本同比下降。；選配 Pipeline／Proxy 可能改寫命令、經手 API 流量或向其他模型送出內容；授權與隱私須分開審查。；未實測 Hook 相容性、各命令過濾結果、Proxy 安全及成本。

## github-agentic-workflows

- 固定上游版本：`66b508cd43f2ca20c9e623d573633b78f7f85fda`
- 授權：MIT（上游 LICENSE；模型及外部服務另查）
- 查核範圍：固定版本 README、LICENSE、compile orchestrator、compiler、safe outputs job 及 validation；局部編譯與權限契約，未驗證執行時安全。
- Human Layer：把需要 AI 判斷的 GitHub 工作，例如整理 Issue、分析 CI 失敗或草擬 PR 審查，寫成可隨事件觸發的 GitHub Actions 流程。
- 案例：規劃 CI 失敗分析與受控 Issue 回報流程；自有測試 Repository、合成 CI 失敗日誌、事件條件及允許的回報範圍。 → 可審查的 Markdown 定義、編譯後 Workflow 及限定的診斷回報規格。 → 用於自有 GitHub 專案的 CI 失敗分析與 Issue 分流，供維護者核對後處理。
- 局部能力：
  - 將 AI 任務轉成 GitHub Actions：經驗證並產生的 .lock.yml Workflow；來源 pkg/cli/compile_orchestrator.go、pkg/workflow/compiler.go、README.md；Gate：審查生成的 Workflow、事件、工具及權限；編譯成功不代表 Agent 任務正確或可安全部署。
  - 把 Agent 判斷與寫入分離：獨立的受控寫入 Job 與驗證契約；來源 pkg/workflow/compiler_safe_outputs_job.go、pkg/workflow/safe_outputs_validation.go、README.md；Gate：僅允許明確目標與必要權限；不得把 safe-outputs 當成任意寫入授權，須驗證不受信任 Issue 內容的影響。
  - 保留確定性 CI 並獨立核對回報：可供維護者查證的診斷及審核流程；來源 README.md、pkg/workflow/compiler.go；Gate：Build、Test、Lint、Deploy 繼續由一般 Actions 驗收；AI 回報不得自動視為通過或核准。
- 缺口：Agent 可能受到 Issue、PR 或 Repository 內容的提示注入影響。；唯讀與沙箱是文件所述預設路徑，設定、生成檔及第三方 Actions 仍需審查。；README 記錄 0.83.3 至未滿 0.85.4 的歷史安全公告；正式採用前另核對版本及修補狀態。；未執行 gh-aw、模型、Actions 或安全測試。

## anthropics-sandbox-runtime

- 固定上游版本：`0bbebed0aa9a8e628dc4df8bc30293550a1988eb`
- 授權：Apache-2.0（上游 LICENSE）
- 查核範圍：固定版本 README、LICENSE、CLI、sandbox-manager、sandbox-schemas；僅局部設定與呼叫契約，未執行平台隔離或安全測試。
- Human Layer：讓 AI Agent 或 MCP Server 在受限制的環境執行命令，明確規定它能讀寫哪些資料夾、可以連到哪些網站。
- 案例：規劃 MCP Server 的檔案與網路最小權限；自有測試資料夾、假敏感檔案、允許與拒絕的網路目標及明確核准政策。 → 檔案與網路權限設定、拒絕案例測試規格及平台限制紀錄。 → 用於自有 Agent Harness 的 MCP 啟動權限審查、負面測試與安全驗收。
- 局部能力：
  - 限制 Agent 可讀寫的資料夾：交由作業系統套用的檔案存取限制；來源 README.md、src/sandbox/sandbox-manager.ts、src/cli.ts；Gate：預設讀取廣泛允許；明訂敏感檔案拒絕規則，讀寫優先順序不同，需測試重疊規則與負面案例。
  - 限制 Agent 對外連線：經網路代理與作業系統限制的連線路徑；來源 README.md、src/sandbox/sandbox-manager.ts；Gate：空 allowedDomains 表示預設拒絕網路；驗證實際 OS、代理、允許與拒絕目標，不以設定存在推定隔離有效。
  - 啟動沙箱並核對設定更新：受限子程序及依版本契約生效的設定更新；來源 src/cli.ts、src/sandbox/sandbox-manager.ts、README.md；Gate：control-fd 是完整設定替換而非 patch；多數檔案規則在啟動時固定，不能依賴執行中更新撤銷檔案存取。
- 缺口：讀取預設廣泛開放，寫入與網路則依允許規則限制。；設定檔不存在與設定檔存在但無效的處理不同；後者應報錯而非靜默套預設。；執行中 control-fd 更新並不等於重新套用檔案隔離。；研究預覽，Windows Alpha 與 OS 特定限制須查核；未實測隔離、憑證或網路安全。

## 驗收

3 mapped 候選；9 個用途與能力局部雙向對應、3 個設計示例。新增 Catalog 等值、雙向查詢、前台呈現及瀏覽器回歸；本次未在本地執行測試，PR CI 待驗收。未安裝、執行第三方工具或使用真實敏感資料。108/286 已合併；本批通過後 111/286，尚未改寫 175 筆。
