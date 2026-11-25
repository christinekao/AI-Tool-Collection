# Resource 雙層改善 Batch 10（2026-11-25）

基線 main `6b89ce4a89ce56e3817a1ee1656ee25291c63b3f`；PR #74 四項 CI 已通過並合併。60/286 筆已合併審查（54 完成對應、6 deferred）。本批基於合併 commit 建立分支，Catalog Sync 與 Pages 另行查核。

| Resource | 人類應用 | 固定版本及查核範圍 | 審查 |
|---|---|---|---|
| langgenius-dify | 每週報表摘要流程 | 409387a1b8d6c9eab3ab788a282b894a67a7fe8e；README、LICENSE、api/core/workflow/workflow_entry.py 的流程、單節點及變數契約 | mapped；舊 LLM node 路徑 404，底層 Graph Engine、模型、RAG、沙盒未完整審查 |
| open-webui-open-webui | 本機模型聊天介面 | 0666e59d26a4d056e0bacee41742486badd71cf8；README、LICENSE、backend/open_webui/routers/ollama.py 與 openai.py 的連線、設定、模型清單 | mapped；完整聊天、RAG、憑證及隔離未查 |
| unclecode-crawl4ai | 公開文件知識庫匯入 | 4e4bab5d44a7557eb403f137ec589833368a3e38；README、LICENSE、async_webcrawler.py、models.py、async_configs.py | mapped；完整瀏覽器、robots、Cloud API、安全驗證未查 |

三筆 mapped 候選、9 個前台用途、9 個局部能力及 3 個 design-only 案例。寫入前比對原 ID、Repo、URL、Tags、分類、features、requirements、limitations 與所有 Typed Refs，均不變；保留 implementationKnowledge，新增歷史用途快照。無新增全域 Graph Entity 或 Edge。未安裝、呼叫模型、擷取網站、部署或使用付費服務。

## 重要限制

- Dify 採修改版 Apache 2.0 授權，對多租戶（workspace）服務、前端品牌及著作權標示有額外條件。
- Open WebUI 授權第 4 條的滾動 30 日 50 人條件是品牌修改限制的例外之一，不是一般使用人數上限；其他例外為書面許可或明確允許的企業授權。
- Crawl4AI 的 Markdown 與引用提示不等於事實驗證；Cloud 與本機路徑分開核對，不繞過網站限制。

## 驗收及使用者決策

新增 Catalog 等值、雙向映射、固定來源、授權及四尺寸瀏覽器回歸測試。CI 與 Pages 依實際結果，不預先宣告 PASS。合併前 60/286，若本批通過合併後 63/286（57 完成對應、6 deferred），223 尚未改寫。

一般內容改寫、來源查核、測試修正與合併不需逐筆請使用者核准。只有前台閱讀方向、無法取得且使用者持有的來源、架構重大變更、刪除、權限或付費等決策需提出。既有六筆 deferred 與三筆來源阻塞維持追蹤，不冒充完成。下一批續查 MinerU、OpenClaw 與其他尚未改寫資源。排程維持停用。
