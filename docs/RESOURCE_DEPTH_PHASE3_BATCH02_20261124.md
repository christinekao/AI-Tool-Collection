# Resource Phase 3 — Batch 02（2026-11-24）

Baseline: main `1cfb29ad6e664a7d2fd2e6a5fbfe3aa53a056537`，PR #63 的 Canonical 內容已完成 Catalog Sync。

本批 7 筆實際更新，非全站深度完成宣告。

| Resource | 路線 | 本批交付 | 尚未確認 |
|---|---|---|---|
| pydantic-pydantic-ai | Repo | Agent、Output、UsageLimits、TestModel 核心指南，固定 Commit | 完整模型 adapter、Harness、執行及整合 |
| huggingface-smolagents | Repo | CodeAgent／ToolCallingAgent、執行器、步數及結果契約，固定 Commit | 遠端 executor、安全隔離、執行 |
| microsoft-ai-agents-for-beginners | Learning（部分） | 第 01、04、06 章選讀教材、練習與驗收 | 其餘課程、Notebook 實測；保留 deferred |
| nirdiamant-genai-agents | Collection | 依迴圈、路由、進階模式挑選 Notebook；比較方法 | Notebook 逐份查核及實測 |
| anthropics-skills | Collection | template、skill-creator、webapp-testing 選讀及驗收 | 其他技能與個別授權 |
| openrouter-ai | Service | 供應商路由、政策、備援、實際採用門檻 | API、費用、政策與實際整合 |
| google-pagespeed-insights | Service | Field／Lab、CWV、前後驗收及 API 路徑 | 網站實際效能測試 |

修正三筆不合用途的 readingSpec（anthropics-skills、openrouter-ai、google-pagespeed-insights：repo/deferred → standard/applied）；不改 classification、ID、原始 URL、Tags 或 typed refs。既有 Guide renderer 未變更。Canonical 的 source.reviewScope 與 upstreamCommit（適用時）保留查閱範圍。第三方程式、憑證、帳號、付費 API 均未執行。

## 進度追蹤

- Phase 3 Pilot：4 筆（PR #63）。
- Batch 02：7 筆，其中 Microsoft 是部分教材，不列為整門課程深度完成。
- 累計 11 筆 Phase 3 內容改善；與 286 筆 Resource 總量不同，不等於 11 筆完整實作驗證。
- 原本兩筆既有專屬指南不重複計入 Phase 3 交付。
- 本批新增 7 頁各 375／430／768／1440px 瀏覽器回歸測試，並保留前四頁；驗收結果以 PR 最新 head CI 為準。

## 下一批

優先處理剩餘 readingSpec 路由待覆核（服務／工具與互動教材），再深入近期新增的 RAG、動畫與知識管理類資源。Designed to Scale 本次來源擷取不足，保留原記錄，不假裝讀完整課程。依來源與知識價值決定深度；不重複大量填寫同義文字，不新增未驗證的 Graph Edge。
