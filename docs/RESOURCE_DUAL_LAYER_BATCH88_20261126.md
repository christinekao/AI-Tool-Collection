# Batch 88｜orca 局部技術證據補強（2026-11-26）

固定版本：`a9ccd3042c4373579d5a48ccf045b0139deeb50d`。保留原 ID、分類、Tags、Typed References、原案例；維持 deferred。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [worktree-ipc](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/main/ipc/worktrees/create/register-worktree-create-handlers.ts#L38-L94) | 建立 IPC 先找 repoId，透過 project worktree create 包裝建立流程，並在本機 Git 操作前解析 SSH execution host ownership；不受服務的主機回錯。 | 尚未核對實際 git worktree add、刪除及路徑衝突處理。 |
| [launch-capability](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/cli/workspaces/worktree-create-agent-launch.ts#L42-L108) | CLI 先檢查 host 能力；較舊 host 可用 worktree.create 啟動，但不支援指定 model/effort 或 surface 時明確回錯；重播要求回原 execution host。 | 客戶端相容性檢查不等於遠端認證或程序隔離。 |
| [pty-process](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/main/daemon/pty-subprocess/native-pty-spawn.ts#L47-L95) | PTY 啟動前檢查取消訊號、WSL distro allowlist、可選 create admission；nodePty.spawn 接收 shell、參數與 cwd。 | 可選 admission 不是完整安全邊界；環境、秘密及 OS 權限另查。 |
| [worker-launch](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/cli/orchestration/workers/worker-launch-handler.ts#L30-L106) | worker-start 拒絕 Agent Server route，檢查 runtime model/effort 能力，呼叫 workerStart mutation；timeout 路徑嘗試 reconciliation 而非盲目重啟。 | 僅 CLI 入口；未核對 host 授權實作、程序取消、Git 清理。 |

## 讀者應用

驗收 Worktree 啟動與執行主機邊界：以測試 Repo 設計 host 不相容、啟動重播、取消與超時後查詢既有 worker 的驗收；核對分支、程序及清理狀態。

## 下一步

追蹤 IPC 建立與 Git 執行器下游、remote runtime RPC 權限、worker settlement/cleanup；以合成 Repo 驗證錯誤復原與清理。

第三方未執行；局部來源不構成完整實作契約。
