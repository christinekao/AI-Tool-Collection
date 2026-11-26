# Batch 94｜orca 固定版本契約補強（2026-11-26）

固定版本：`a9ccd3042c4373579d5a48ccf045b0139deeb50d`。維持 deferred，保留原 ID、分類、Tags、Typed References、原案例與既有證據。原 404 路徑已更正。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [mobile-e2ee-auth](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/main/runtime/rpc/mobile/e2ee/mobile-e2ee-auth-validation.ts#L100-L143) | 認證入口分流 token 與 device-key；token 需與解析裝置相符，key 需可用 v2 session、裝置 registry 結果及綁定 transcript 的 proof；失敗以明確代碼回傳。 | 這是 mobile E2EE 入口，尚未證明所有 relay、websocket、unix transport 或 RPC scope 注入都使用相同授權。 |
| [paired-device-scope](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/main/runtime/rpc/server/pairing/device-principal.ts#L15-L34) | 裝置 principal 含 ID、scope、client ID、credential fingerprint 與 revision；callerScopeOf 區分 mobile delegated 與 runtime-paired grants。 | 轉換本身不驗證憑證；需核對 transport 何時傳入已驗證 DeviceEntry 與撤銷檢查。 |
| [worker-stop-transaction](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/main/runtime/orchestration/db/worker-dispatch/worker-dispatch-stop.ts#L60-L125) | beginWorkerStop 在交易中處理不存在、context-only、已結算及不允許停止情況；更新 worker 為 stopping、撤銷 dispatch capability、重新結算 task 並關閉問題，錯誤時回滾。 | 狀態標記與權限撤銷不代表實際程序已結束或 Git worktree 已清理。 |
| [exited-terminal-release](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/main/runtime/orchestration/terminal-authority/release/stopped-worker-terminal-release.ts#L105-L148) | terminal 清理逐一檢查 process incarnation 的存活性；只接受 exited，無法確認或仍存活則保留；記錄 output 後批次結算並重新核對 owner、incarnation 及 archive。 | 這是已退出程序的資源回收，不保證所有程序會被終止，也不證明 Git 分支或工作樹刪除。 |

## 讀者應用

驗收遠端認證與 Worker 停止回收：設計無效 credential、撤銷裝置、不同 caller scope、重複 stop、保留開啟中的 worker、程序仍存活或不可驗證的反例；另外檢查 Git 資源清理。

## 缺口與下一步

原 404 路徑已更正；已核對 mobile E2EE 認證、配對裝置 scope、worker stop 狀態與 terminal 回收；仍缺各 transport 到 RPC caller 的完整綁定、程序停止及 Git 工作樹清理的端到端契約。

追蹤配對裝置解析、撤銷與 RPC scope 注入、worker-stop RPC 到程序終止、工作樹及未合併分支保護；以隔離 Repo 驗證。

僅固定版本靜態查核；第三方與上游測試未執行，不增加正式完成率。
