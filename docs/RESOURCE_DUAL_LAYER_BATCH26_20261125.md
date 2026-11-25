# Resource 雙層知識 Batch 26｜Agent 開發與自動化

基線：`09517cccfa2ebc9e549acd48699f554f8c534910`。只修改既有 Canonical，保留 ID、原分類、Tags、知識關係及舊用途快照。

## anthropics-single-agent-loop-kit

- 固定上游版本：`c43796287b83bec847db923f07131d1cc8de750d`
- 授權：Apache-2.0；參考實作，官方不承諾維護
- 查核範圍：固定版本 README、LICENSE、compare.py、chain_coverage.py、reference loop、as-tool 步驟；局部程式與文件契約，未執行模型或測試。
- Human Layer：評估現有多 Agent 系統是否過度複雜，把經常一起工作的子 Agent 合併，或改成主 Agent 按需使用的 Skills 和 Tools，並逐次比較改動前後的品質及成本。
- 案例：規劃客服 Agent 架構精簡與逐次驗收；自有測試客服系統、匿名合成對話、現有子 Agent 呼叫紀錄及已確認的評分標準。 → 子 Agent 處置表、同一評估集的前後比較與保留或回退的決策紀錄。 → 用於自有 Agent Harness 重構決策與持續品質管理。
- 局部能力：
  - 建立可比較的端到端評估：共同案例的品質、延遲、Token 及成本比較；來源 skill/scripts/compare.py、skill/scripts/chain_coverage.py、README.md；Gate：先檢查被改動的呼叫鏈是否有完整測試；只比較共同案例，缺少測試覆蓋不得宣稱品質維持。
  - 保留真正需要獨立 Context 的子 Agent：主 Agent 可讀的結論、證據、動作及限制；來源 skill/steps/04-as-tool.md、README.md；Gate：逐一修改並重跑評估，主 Agent 應核對結論；保留獨立研究或驗證需求，不以減少 Agent 數量當成目標。
  - 限制單一 Agent 迴圈的執行與寫入：受限執行結果與停止原因；來源 reference_loop/loop.py、README.md；Gate：寫入工具必須有核准閘門；子 Agent 用量計入預算；fake model smoke 僅檢查流程，不代表模型品質。
- 缺口：參考實作不承諾維護；官方僅報告部分示例的真實模型結果，不能外推全部遷移步驟。；Fake model smoke 不是品質評估；同一批任務、呼叫鏈覆蓋及人工確認評分不可省略。；正式模型評估可能產生費用並外送資料，須先核准；未實測。

## agentic-system-lab-harness-relay

- 固定上游版本：`70bcd3744faa3b7f772c2d62f9ef6fb5774edfb2`
- 授權：Sustainable Use License 1.0；限內部業務或非商業／個人使用，對外提供僅限免費且非商業；第三方元件另計
- 查核範圍：固定版本 README、LICENSE、orchestrator.ts、approvals.ts、user-guide 與 sandboxing 文件局部；未測各 CLI 的隔離及外部工具。
- Human Layer：把多種 Coding Agent 放進同一個本機聊天室，依角色安排接力、輪流討論或平行修改，再比較各自的成果與程式差異。
- 案例：規劃多 Agent 平行修正與人工選擇最佳方案；自有測試 Repo、已知失敗測試、兩個 Agent 角色及明確允許的操作範圍。 → 各 Agent 解法、分離的 Worktree 差異及人工核准紀錄。 → 用於自有 AI Cowork 開發流程的平行比較、成果選擇與回歸驗收。
- 局部能力：
  - 選擇 Agent 團隊及協作順序：Roundtable、Parallel 或 Relay 的工作安排；來源 README.md、docs/user-guide.md、src/server/orchestrator.ts；Gate：先確認角色、模型費用與停止條件；不同 CLI 支援能力及即時插話不同，不能視為等價。
  - 比較平行 Agent 的程式變更：各自變更與可供選擇的 Diff；來源 src/server/orchestrator.ts、docs/user-guide.md、README.md；Gate：Worktree 不是安全隔離；同一回合人工修改可能被歸入 Agent，須以完整 Git 差異與獨立測試驗收。
  - 限制並審查 Agent 的操作：依允許規則判斷的操作與人工核准流程；來源 src/server/approvals.ts、docs/sandboxing.md、docs/user-guide.md；Gate：核准規則不等於 OS 隔離；固定版本文件明列部分 CLI 沒有 OS sandbox，須按實際平台驗證，外部操作另行核准。
- 缺口：Worktree 不是安全沙箱；回合差異不是嚴格的個別 Agent 歸因。；各 CLI 權限及 OS 隔離不同；部分 CLI 在 Harness Relay 中沒有 OS sandbox。；使用自己的模型帳號及額度；外部分享與郵件等工具須核對資料外送及核准。；Sustainable Use License 限制商業對外提供；不將源碼當作無限制開源元件重製。；未實測第三方 CLI、遠端連線、隔離或資料同步。

## humanlayer

- 固定上游版本：`fb899cd8cba767f0392708efc20d00938dec6a87`
- 授權：Apache-2.0；部分 vendored 元件為 MIT（README；逐件再查）
- 查核範圍：固定版本 README、LICENSE、tasks、workflow-phases、workspace-model、remote-daemons 文件及 run-session、git-diff-parsers 局部程式；未核對完整雲端權限及同步實作。
- Human Layer：把同一項開發工作的研究、設計、計畫、實作及審查集中在一個 Task，讓不同 Agent 或工作站能接續執行並查看共同文件與變更。
- 案例：規劃跨 Session 的履歷系統功能開發與審查；自有測試專案、功能需求、研究與計畫文件、工作站權限及預定審查者。 → Task 對應的分階段 Session、共享設計資料、工作區配置與審查紀錄。 → 用於自有開發任務的跨 Agent 交接、計畫審核與 PR 驗收。
- 局部能力：
  - 將多個 Session 組成一個開發 Task：共享任務資料及可供審查的文件與評論；來源 apps/docs/explanation/tasks.md、apps/docs/explanation/workflow-phases.md、README.md；Gate：Task 文件同步不是完整 Repo 備份；支援的 Agent 檔案操作才觸發文件同步，敏感資料不得未核准上傳。
  - 為跨 Repo 任務建立獨立工作區：各 Repo 的 task Worktree 與有效設定；來源 apps/docs/explanation/workspace-model.md、README.md；Gate：先核對各 Repo 基準及本機覆寫；本機設定可能含敏感路徑或命令，不應提交。Worktree 不是安全隔離。
  - 跨工作站執行 Session 並查核變更：執行事件、Session 狀態及可解析的變更資料；來源 apps/docs/explanation/remote-daemons.md、apps/riptide-daemon/src/agents/shared/run-session.ts、apps/riptide-daemon/src/effects/services/task-diff/git-diff-parsers.ts；Gate：Daemon 會接觸主機資源；限制檔案及網路權限。Session 執行完成或 Diff 存在不等於功能驗收。
- 缺口：Task 與 Session 不同；文件同步只涵蓋支援的檔案操作，不是 Repo 或主機備份。；共享及本機工作區設定有合併規則，須避免洩漏敏感本機資訊。；遠端 Daemon 涉及主機權限、登入憑證與雲端資料；不得把遠端執行視為安全隔離。；自架僅參考部署，非官方支援的安裝；預設簡易密碼需更換。；未實測同步、遠端權限、工作區建立及 RPI 流程。

## 驗收

3 mapped 候選；9 個用途與能力局部雙向對應、3 個設計示例。新增 Catalog 等值、雙向查詢、前台呈現及瀏覽器回歸；本地未執行測試，PR CI 待驗收。未安裝、執行第三方工具或使用真實敏感資料。111/286 已合併；本批通過後 114/286，尚未改寫 172 筆。
