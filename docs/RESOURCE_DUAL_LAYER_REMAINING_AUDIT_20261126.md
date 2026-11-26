# Resource 雙層知識待補證據盤點（2026-11-26）

以 PR #111 已合併後的 main 與 Batch 77–79 候選核對；未改 ID、未移除舊來源、未新增 Graph Edge。未驗證第三方 runtime。

## 既有七筆 deferred（逐筆核對 Canonical layerReview）

| ID | 缺口 | 下一步 |
|---|---|---|
| microsoft-ai-agents-for-beginners | 剩餘課程未逐章查核 | 固定課程版本補章節與練習 |
| infiniflow-ragflow | 固定版本新核心的 ingestion、檢索、引用 I/O 未取得 | 從 Go 目錄定位、查程式契約 |
| toeverything-affine | 編輯器、同步、儲存、權限及部分授權未查 | 定位實作及 EE 邊界 |
| orca | 候選 Worktree 路徑 404 | 固定版本定位工作區、程序及權限 |
| hindsight | 候選 API／memory engine 路徑 404 | 定位 retain/recall/reflect、權限與刪除契約 |
| anomalyco-opencode | 角色及權限程式路徑 404 | 固定版本定位核准與工具權限 |
| hermes-snyk-plugin | 原 Repo 遷移；外部掃描器核心未查 | 新插件與 Snyk CLI 文件及授權 |

Batch 79 新增 `rea` deferred：只讀取固定版本驗收文件和錯誤 Schema；未查核心程式與完整授權，不計深度完成。

## 尚未改寫的 13 筆

| ID | 實際查核與下一步 |
|---|---|
| codex-router | 原始 URL、作者不明；候選名稱不能當成原始來源。待原始收藏證據。 |
| designed-to-scale | 官方頁僅 JavaScript 提示；未讀章節。待可讀課程或原始 Repo。 |
| irons163-orchestrate-sol-terra-luna | 舊路徑與已收錄 three-tier-agent-orchestrator 同 GitHub Repository ID 1321139753；保留兩個 ID，待歷史身分及關聯去重核准。 |
| land-book-design-inspiration | 官方首頁及 Pro 頁 403；索引摘要可讀，尚未確認完整功能與條款。 |
| letswrite-buzz-self-hosted-relay-guide | 原文 403；第一方索引摘要可讀，未逐節核對。 |
| particles-casberry | 官方頁 403；索引摘要可讀，未核對完整功能及使用授權。 |
| reverse-skill | 原始 URL 與 reverse-skill-2 相同；上游 GitHub ID 1237819660，保留兩個 ID，待去重與引用盤點。 |
| reverse-skill-2 | 同上；不得將同一來源算兩個獨立新工具。 |
| skillgodak-hgtv | 原 Repo 仍 404；不替換成其他作者同名 Repo。 |
| stitch-mcp | 官方頁無可讀正文；參數、授權及版本需補查。 |
| viral-hook-title | 原始 URL、作者不明，候選頁不等於原始收藏。 |
| wellmade | 官方首頁及分類頁逾時；索引摘要可讀，未查完整目錄。 |
| whisper-ui | 原始 URL、作者不明，候選 Repo 不等於原始收藏。 |

## 進度解讀

Batch 77–78 為 6 筆 evidence-linked 候選；Batch 79 為 1 mapped、1 evidence-linked、1 deferred 候選。所有 PR 四項 CI 通過並合併後才計為正式 273/286 已審查（265 完成映射、8 deferred）；13 筆未改寫。深度完成不包含 deferred；來源查核不代表實測。
