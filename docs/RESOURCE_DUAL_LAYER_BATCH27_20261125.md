# Resource 雙層知識 Batch 27｜Agent 工作流程與開發工具

基線：`1013a13ad9d7f37bbd0292b7f507bdd79d0f6249`。只修改既有 Canonical，保留 ID、原分類、Tags、知識關係及舊用途快照。

## zed-industries-zed

- 固定上游版本：`f38d614b4b58bb44cc19d08ef5dd3efba918f9a3`
- 授權：主要 GPL-3.0-or-later，標示的元件 Apache-2.0；逐件查核
- 查核範圍：固定版本 README、LICENSE-GPL、LICENSE-APACHE、agent-panel、agent-profiles、tool_permissions.rs、edit_file_tool.rs；局部介面與實作契約。
- Human Layer：在程式碼編輯器中直接讓 AI 閱讀專案、修改程式及執行工具，並在多個獨立對話間切換與檢查變更。
- 案例：規劃編輯器內的 AI 程式修改與權限審查；自有測試 Repo、待修正的功能、明確可讀寫範圍及已配置的模型。 → 分離的 Agent Threads、工具權限設定、修改差異與回歸測試規格。 → 用於自有專案的程式閱讀、實作及人工驗收。
- 局部能力：
  - 分開多個開發任務：獨立對話、歷史與工作區安排；來源 docs/src/ai/agent-panel.md、README.md；Gate：外部 Agent 的歷史、Token 顯示及即時插話功能因整合而異；Worktree 不等於安全隔離。
  - 分離工具可用性與操作核准：工具可用集合及 allow、deny、confirm 判斷；來源 docs/src/ai/agent-profiles.md、crates/agent/src/tool_permissions.rs；Gate：Profile 決定工具是否可用，Tool Permissions 決定受控呼叫如何核准；外部 Agent 與終端 Thread 不一定受同一 Profile 約束。
  - 檢查 Agent 提出的程式修改：編輯工具輸出與可供審查的修改；來源 crates/agent/src/tools/edit_file_tool.rs、docs/src/ai/agent-panel.md；Gate：先核對修改範圍、完整 Diff 與測試結果；工具授權或串流編輯完成不代表功能通過。
- 缺口：Profile 與工具權限是兩套控制；外部 Agent 不一定遵守 Zed 的 Profile。；不同 Agent 功能及模型服務成本不同。；GPL 與 Apache 元件須逐件查核後才可重用或分發。；未實測編輯器、模型、工具核准或工作區。

## herdrdev-herdr

- 固定上游版本：`e8d7d9705a7a2c89cef4dd42079379f05685af87`
- 授權：Apache-2.0（上游 LICENSE）
- 查核範圍：固定版本 README、LICENSE、agent_resume.rs、API agents schema、app agents API 與 remote attach 局部程式；未執行終端與 SSH。
- Human Layer：把多個 Coding Agent 的終端集中在同一介面，查看誰正在工作、等待輸入或閒置，並在中斷連線後接回原本的工作。
- 案例：規劃多主機 Coding Agent 終端與交接監控；自有測試主機、兩個已登入的 CLI Agent、獨立任務及核准的 SSH 設定。 → 終端配置、Agent 狀態、重連與恢復行為的驗收紀錄。 → 用於 AI Cowork 工作台的操作協調、待人工處理提醒與中斷恢復。
- 局部能力：
  - 中斷連線後接回工作：可重連的終端或支援的 Agent 恢復計畫；來源 src/agent_resume.rs、README.md；Gate：Client detach 不停止背景終端；server 或主機重啟後原程序不會存活，只能依支援情況恢復 Session 與配置。
  - 查看 Agent 狀態並交接：Agent 清單、狀態及提示交接操作；來源 src/api/schema/agents.rs、src/app/api/agents.rs、README.md；Gate：working、blocked、idle 不是驗收結果；不可將狀態當成完成證據，交接前核對權限與目標。
  - 集中管理跨主機終端：可管理的遠端連線及終端入口；來源 src/remote/attach.rs、README.md；Gate：先核對遠端主機身分、憑證、Socket 存取與版本；終端多工並非安全沙箱，未核准不得暴露服務。
- 缺口：背景 Server 存活與主機重啟後的恢復是不同機制。；Agent 狀態不證明實際成果已通過測試。；SSH、Socket API 及外部 CLI 各有權限和相依條件。；未實測狀態判斷、主機重啟、SSH 或插件。

## microsoft-tokeneconomizer

- 固定上游版本：`fa5604a3673fb3fa8c9932b942dd210e7afb18f3`
- 授權：MIT（上游 LICENSE）
- 查核範圍：固定版本 README、LICENSE、ARCHITECTURE、envfacts.py、toolprune/stage.py、loopguard/turn.py；局部程式及研究報告契約，未重跑實驗。
- Human Layer：讓 Coding Agent 從同一專案的歷次工作學習，減少重複摸索環境、載入不常用工具及反覆嘗試失敗方法造成的成本。
- 案例：規劃重複開發任務的成本與品質對照實驗；自有測試 Repo、匿名化歷史 Session、固定任務與相同模型的成本及品質基準。 → 可查證的環境知識、工具保留／移除紀錄、迴圈提醒及成本品質比較。 → 用於自有 Agent Harness 的 Context 管理、成本優化與回歸決策。
- 局部能力：
  - 記住已確認的專案環境知識：符合注入條件的專案 Micro-skills；來源 tokeneconomizer/microskills/envfacts.py、README.md；Gate：README 說明經三個 Session 確認後才注入，矛盾後應更新或移除；先核對知識是否過期，不保存敏感內容。
  - 移除長期未使用的工具定義：依 Host 契約產生的工具或能力裁剪設定；來源 tokeneconomizer/toolprune/stage.py、docs/ARCHITECTURE.md、README.md；Gate：Claude Code／Copilot 與 Codex 的裁剪方式不同；未使用不代表永遠不需要，須保留恢復機制並驗證任務品質。
  - 辨識重複失敗並提醒改變策略：迴圈判斷、策略提醒或通知人工停止；來源 tokeneconomizer/loopguard/turn.py、docs/ARCHITECTURE.md、README.md；Gate：Loop guard 不會自行停止回合；判斷模型可能出錯且有成本，須以品質、全部模型費用及實際結果比較。
- 缺口：作者報告特定 SWE-Bench 實驗平均成本降低 18.4–30.9%，不是普遍保證；一組模型的 Pass@1 下降。；歷史 Session 可能含敏感資訊，雖然學習資料保存在本機，judge 與知識提議仍可能透過 Agent 呼叫模型。；工具裁剪依 Host 而異；須測試缺少工具時能否恢復。；Loop guard 提醒不等於強制停止；未重跑研究實驗或驗證插件。

## 驗收

3 mapped 候選；9 個用途與能力局部雙向對應、3 個設計示例。新增 Catalog 等值、雙向查詢、前台呈現及瀏覽器回歸；本地未執行測試，PR CI 待驗收。未安裝、執行第三方工具或使用真實敏感資料。114/286 已合併；本批通過後 117/286，尚未改寫 169 筆。Agent Loop Visualizer 原上游重新導向，保留原紀錄待查新身分，不算入本批。
