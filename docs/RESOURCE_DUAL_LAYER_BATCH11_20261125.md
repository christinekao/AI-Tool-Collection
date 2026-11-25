# Resource 雙層改善 Batch 11（2026-11-25）

基線 main `a3b1294eaf6b93466eb1886cd0192e42885577a8`；PR #75 四項 CI 已通過並合併 `9249e041d7b75490d9ca91810686be3dec3d1d86`，Catalog Sync 已確認。63/286 筆已合併審查（57 完成對應、6 deferred）。

| Resource | 人類應用 | 固定版本及查核範圍 | 審查 |
|---|---|---|---|
| opendatalab-mineru | 研究文件解析與搜尋 | 097de7f63f54722c9b805ee1c9a14a0c5b02e078；README、LICENSE.md、pyproject.toml、mineru/doclib/client.py、types.py 與公開 SDK | mapped；舊 parser 路徑 404，已定位現行 Doclib SDK，解析引擎、Tasks API、遠端及遙測仍未查 |
| openclaw-openclaw | 只讀個人研究助理 | 185313e988b954491cf05978bcc8e8bbc0dc9754；README、LICENSE、SECURITY.md、agent-run-handler.ts、agent.ts | mapped；sessions.ts 候選路徑 404；已確認任務入口與等待介面，完整沙盒及權限未查 |
| r0x0r-pywebview | 本機 HTML 筆記閱讀器 | 696dfe67edc7fa597ff5c7758b14e6dc461e5c9e；README、LICENSE、webview/__init__.py、webview/window.py | mapped；各 OS renderer、Bridge 安全、封裝及更新未查 |

三筆 mapped 候選，9 個人類用途、9 個局部能力及 3 個 design-only 案例。寫入前比對原 ID、URL、Repo、Tags、分類、features、requirements、limitations 與既有 Typed Refs，均不變。保留原 implementationKnowledge，新增歷史用途快照。不新增全域 Graph Entity 或 Edge。未安裝、執行、解析文件、啟動 Gateway、連接帳號或操作桌面視窗。

## 本輪重要發現

- MinerU 現行 LICENSE.md 採 Apache 2.0 加附加條款，關聯企業合併口徑 MAU 超過一億或月總營收超過 2,000 萬美元需商業授權；對第三方提供線上服務須標示使用 MinerU。4.1 API 已變更；本輪僅確認 Doclib SDK。
- OpenClaw 官方 SECURITY.md 明示不以共享 Gateway 作為敵對多租戶隔離方案，session ownership/visibility 不是安全界線；主 session 的工具預設在主機執行，需另配置 sandbox。
- pywebview 的主執行緒及視窗初始化、Bridge 暴露方法、來源控制均有明確契約；不代表所有 OS 或本機權限已驗證。

## Gate 與接續

新增 Catalog 等值、雙向解析、固定來源、授權／信任界線及四尺寸瀏覽器回歸。CI、Pages 依實際結果，不預先標 PASS。合併前 63/286；若通過合併則 66/286（60 完成對應、6 deferred），220 尚未改寫。六筆既有 deferred 與三筆來源阻塞維持追蹤。本批未要求使用者核准安裝或額外操作；下一批優先可查核的前端元件及開發資源，再依 manifest 處理未改寫項目。排程停用。
