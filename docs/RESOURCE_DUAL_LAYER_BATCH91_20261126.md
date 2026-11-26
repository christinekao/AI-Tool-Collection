# Batch 91｜orca 固定版本契約補強（2026-11-26）

固定版本：`a9ccd3042c4373579d5a48ccf045b0139deeb50d`。維持 deferred，保留原 ID、分類、Tags、Typed References、原案例與既有證據。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [git-worktree-add](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/main/git/worktrees/creation/worktree-add.ts#L230-L299) | 建立前檢查未完成刪除的路徑與分支衝突；依是否重用分支組合 git worktree add，新增分支使用 --no-track 與 -b；執行設逾時並在 finally 更新 WSL 路由快取。 | 此段不是遠端 Git 授權或完整失敗回滾；逾時後的實際工作樹狀態須重新查核。 |
| [git-worktree-remove](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/main/git/worktrees/removal/worktree-removal.ts#L69-L150) | 移除時讀取 worktree 與 branch/head，強制檢查鎖定，進入刪除限流區重新確認；移除 checkout 後依選項決定是否進行序列化分支清理。 | 不能推論 force 操作無資料遺失；分支保護、Windows/WSL 與 worker 清理須另驗。 |
| [rpc-admission](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/main/runtime/rpc/dispatch/rpc-request-admission-prologue.ts#L31-L96) | RPC handler 前先檢查 caller scope 與 method permission，再檢查來源及遷移 fence、peer admission、caller resolution、參數及 transport 支援。 | callerScope 的 transport 認證與預設 owner scope 安全性不在本段證明範圍。 |
| [worker-settlement](https://github.com/stablyai/orca/blob/a9ccd3042c4373579d5a48ccf045b0139deeb50d/src/cli/orchestration/workers/orchestration-worker-settlement.ts#L4-L48) | worker_done 若無 lifecycle verdict，會核對 dispatch、task 狀態與報告身分；無法確認則回 operation_unknown 並要求保留原 mutation identity。 | 結算回讀不是 worker 程序終止、Git 清理或遠端一致性保證。 |

## 讀者應用

驗收 Worktree 生命週期與 RPC 結算：在合成 Repo 設計路徑衝突、建立逾時、鎖定 worktree、未合併分支、RPC 拒絕及 worker_done 結算不明的案例；分開驗證 Git、程序與遠端認證。

## 缺口與下一步

已核對 Git add/remove、RPC admission 與 worker_done 結算；仍缺遠端 transport 身分認證、worker 取消到程序及 Git 清理的完整鏈。

追蹤 transport callerScope 身分綁定、worker cancellation/cleanup、分支保護及未合併資料保留測試。

僅固定版本靜態查核；第三方未執行，不增加正式完成率。
