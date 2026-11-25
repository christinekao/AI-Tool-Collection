# Resource 雙層知識 Batch 29｜多 Agent 協作與交接

共同驗收基線 `fde96af41f63a655290afd95879f188d83167383`；Batch 29–35 集中同一 PR，逐組保存紀錄，不把候選計入已合併。

## arumwu-agentrelay

- 版本 `d49ef59de1330209d93f6ade9dc38b83e66671e9`；授權 Apache-2.0；部分整合元件另有 MIT
- 用途：讓多個 Coding Agent 在同一專案接續工作，避免重複探索、重複領取任務或遺失交接資訊。
- 案例：規劃兩個 Coding Agent 的跨工作階段交接；合成 Git 專案、兩個 Agent 身分、任務與檔案範圍 → 任務租約、已嘗試方法、Git 狀態與交接文件 → 自有 Agent 協作工作台
- 局部能力及證據：
  - 避免重複領取工作：src/store.ts (ProjectStore,heartbeat,scopePatternsMayOverlap)；檔案 claim 是 advisory，不是 OS 強制鎖；租約過期或失聯需重新核對 Git 狀態。
  - 保留可接續的專案脈絡：src/git.ts (captureGitSnapshot,resolveWorkingDirectory)；工作目錄須在工作區內；Git 快照不是完整執行驗收，也不可把秘密寫入交接。
  - 在受信任終端間交接訊息：src/terminal.ts (TerminalTransport,read,resolvePane)；read-before-send 與遮蔽不是安全沙箱；只准已確認對象，不能把終端輸出當成授權。

## charonyuu-whatsmyagentdoing

- 版本 `0706fee33b7b9b84e809f57a7887075ca50ad70b`；授權 MIT
- 用途：在同一畫面看見多個本機 Coding Agent 是否正在思考、執行工具、等待人工處理或已結束。
- 案例：規劃多 Agent 等待人工處理的監控面板；匿名的本機 Session 事件、合成工具執行和核准紀錄 → 狀態面板、等待提醒及可回查的工作階段 → 自有開發監控及交接介面
- 局部能力及證據：
  - 統一不同 Agent 的事件狀態：src/parsers.js (newSession,applyClaude,applyCodex)；狀態是來源事件推導，Done 僅表示回合結束，非任務完成證明。
  - 追蹤新事件與檔案更新：src/watcher.js (Watcher,tick,readRange)；無法讀取的日誌可能被略過；應顯示資料新鮮度與缺漏，不把沒有事件當空閒。
  - 查看回合及 Token 概況：src/parsers.js (usage,countTurn,dayKey)；日誌可能有私人文字；僅供本機核准展示，用量不可當供應商帳單。

## kieiken-project-hub

- 版本 `f46d2f6bc593da98d65fc234622b3c103da1dd3d`；授權 MIT；第三方元件另查
- 用途：把個人開發專案、待辦與 AI 對話集中管理，在不同任務之間切換、排隊及交接。
- 案例：規劃個人專案與 AI 任務的工作台；合成專案、待辦、兩個 CLI Agent 與測試工作目錄 → 任務對話、排隊指令、交接及人工整合紀錄 → 自有專案管理與開發協作介面
- 局部能力及證據：
  - 集中查看專案與工作：README.en.md (Work conversation（文件介面）)；文件明列僅監聽 127.0.0.1 且無登入驗證，不得當共享服務。
  - 安排任務後續指令：hub/lib/engines/queue.js (ChatRunner,beforeQueued,endGate)；先核對是否仍適用與是否授權；不能把排隊成功當作實際執行完成。
  - 在交接前檢查工作區：hub/lib/handoff-admission.js (HandoffAdmission,HANDOFF_CHECK_UNAVAILABLE)；預設 Claude/Codex CLI 可能跳過核准或 sandbox；Windows 隔離限制不同，僅用合成工作區驗證。

3 mapped 候選；9 用途、9 能力、3 design-only 案例。來源已查閱，第三方未實測；共同 PR CI 待驗收。
