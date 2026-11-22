# Phase 2 Prompts — Session Handoff（2026-11-22）

## Batch 01｜已合併，Repo 與正式站驗收通過（2026-11-22）

- Base main：`3be8b0ecc395e368492e531468808f943a3f06eb`，工作分支：`prompt-content-batch01-20261122`。
- **20/20 Prompt 已合併至 main**，完成文件與可重用契約設計：19 新 Prompt Guide＋1 原有 Guide 保留、20 筆 Intake Review。全庫文件覆蓋率為 **21/35 Guide、21/35 Intake Review**；尚餘 15 筆未完成本階段內容整理。
- **Source**：3 筆已讀上游方法 README／SKILL.md；其他 17 筆僅使用者提供／既有收藏，原始作者或完整素材未必能追溯。來源已查 ≠ 可執行或無授權風險。
- 原始 Prompt／原始分享文字／分類／Tags／Typed Refs 原封不動；Derived Catalog／Graph 由現行 Canonical 同步，Graph 569 Nodes／1816 Edges，未新增正式 Graph 關係。
- 特別風險：OneTake PolyForm Noncommercial；Google Maps 大量刪除／分類寫入需另核准；API Key 不可進入 Chat／公開檔；IBKR 沒有逐日資料不能造 Rolling 指標；舊 Claude/Jev Router 參數有版本差異。
- 本次不測第三方 Prompt 的模型輸出／整合／客觀品質；UI 範例為手寫且全標 `NOT_TESTED`。後續須透過模型 Baseline／Candidate 配對案例再另做正式評估。
- [Batch 01 逐筆審查](PROMPT_CONTENT_REVIEW_BATCH01_20261122.md)。**本 Repo 的 PR／main／Pages／正式站驗收已通過，判定 PASS WITH GAPS**；外部 Prompt 模型輸出與安全／完整授權未測。

## GitHub PR、CI、正式站驗收證據（2026-11-22）

- **[PR #46](https://github.com/christinekao/AI-Tool-Collection/pull/46) 已 Squash Merge**：最終 PR Head `d77e6a71e4227c7d4c38838438afdc6fbd956d98`，Merge Commit `9c21130232dc5a07ec6da195189152e878cdf7d9`。
- **PR Gates PASS**：[Unified Intake #44999030064](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44999030064)、[V2 Data Validate #44999030072](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44999030072)、[P1 Graph／Browser #44999030052](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44999030052)。PR [Live-site Check #44999030034](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44999030034) 亦 SUCCESS，但 PR 版只檢查當時**已部署的舊正式站**，不可當作本次 Prompt 新版驗收。
- **main Gates PASS**：[Unified Intake #44999148648](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44999148648)、[Data Validate #44999148672](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44999148672)、[Catalog Sync #44999148646](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44999148646)、[P1 Graph／Browser #44999148652](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44999148652)。
- **[main Pages Deploy #44999147768](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44999147768) SUCCESS**，2026-11-22 07:39:02Z。
- **[Live Pages Smoke #44999148650 — Attempt 2](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44999148650) SUCCESS**，07:41:44Z，在上述部署後真正驗收。19/19 HTTP／JSON Assets 正常；Chromium 驗證原始 Prompt／可重用 Prompt 字串、Switch／Copy Version 狀態、375px Prompt 詳情頁、Graph、Playground、六種類型與 375／430／768／1440px Responsive。
- **Live Attempt 1 FAIL（早於部署）**：07:38:46Z，新版 Browser 測試要求 0050 Prompt Guide，但正式站仍是舊版，故 Timeout。此為部署先後競賽，於新版 Pages Deploy 後重新執行 Attempt 2 SUCCESS。保留失敗紀錄，不將 Attempt 1 當作新版驗收。
- **首次 PR Unified Intake FAIL 已修復**：[44998520132](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44998520132) 指出 `cv-jd-tailored-interview-questions-deep-followups` 與 `ibkr-weekly-risk-adjusted-performance` 的原有 `classification.capabilities` 與新 `capabilityReview=none` 衝突；修正成 `mapped`，**保留原有 canonical-described 映射，沒有新增能力或 Graph Edge**，其餘原文與分類無變動；回歸 CI PASS。
- **新增預防性回歸**：`scripts/test-prompt-guides.mjs`（20 筆 Guide、原文／Adapted 分離、變數一致、NOT_TESTED、敏感邊界）；`scripts/test-knowledge-browser.mjs` 增加三種 Prompt 的字串／切換／375px 實測；P1 Workflow 已將 `data/prompts/**` 列入 PR 與 main 觸發範圍。

**Status：PASS WITH GAPS**。只表示本 Repo Canonical 內容、Catalog／Graph、靜態與瀏覽器／正式站發布驗收已過；不是 20 個第三方 Prompt 的模型輸出、外部資料執行、資安或完整授權實測。模型 Baseline／Candidate／Functional／Trajectory 評估仍 **NOT_TESTED**。

**版本邊界**：這次回填 GitHub 驗收文件的 Docs-only Commit 會再觸發 Pages Deploy；最後文件版部署完成後還須跑一次 Live Smoke。為避免修改文件造成新的循環部署，最後一次的 Deploy／Smoke 證據另記在 [PR #46 最新驗收留言](https://github.com/christinekao/AI-Tool-Collection/pull/46)。

## Batch 02｜剩餘第 21–35 筆（尚未開始）

21. `knowledge-vault-session-handoff`
22. `mermaid-happy-error-path-code-test-evidence-audit`
23. `multi-agent-content-pipeline-orca`
24. `portfolio-case-study-storytelling-presentation`
25. `pstack-create-verification-todo-persistence-example`
26. `role-reversal-meta-prompt-generator`
27. `single-file-svg-motion-prototype`
28. `sol-astra-end-user-ui-critique`
29. `star-resume-experience-three-rewrites`
30. `stepwise-ai-work-delegation-discovery`
31. `tradingview-twstock-rsi-volume-pine-indicator`
32. `tradingview-twstock-signal-to-backtest-audit`
33. `ui-dissatisfaction-question-by-question`
34. `web-mcp-existing-systems-skills-design`
35. `weekly-ai-headhunter-job-search`

## 下一步

1. 開始 Batch 02 前先核對最新 main 是否為本次 Docs-only 交接更新，並以 PR #46 最新留言確認最終文件版 Pages Deploy／Live Smoke。
2. Batch 02 只整理第 21–35 筆，保留原始 Prompt 與原作者身分不確定性；每筆原始版／可重用版及安全 Gate 分離。
3. 完成 35/35 後執行來源分級、原文 Preservation、Model Evaluation Gaps 與 Repo/Browser 全庫回歸，保留最終 Phase 2 Prompt 封帳與最新交接文件。
