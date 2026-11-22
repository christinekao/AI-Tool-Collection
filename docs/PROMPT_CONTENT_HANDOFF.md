# Phase 2 Prompts — Session Handoff（2026-11-22）

## Batch 01｜第 1–20 筆（PR／CI／Merge／Deploy 待驗證）

- Base main：`3be8b0ecc395e368492e531468808f943a3f06eb`，工作分支：`prompt-content-batch01-20261122`。
- **20/20 Prompt 已寫入分支並完成文件與可重用契約設計**：19 新 Prompt Guide＋1 原有 Guide 保留、20 筆 Intake Review。全庫文件覆蓋率候選為 **21/35 Guide、21/35 Intake Review**；已合併計數仍須以 main 查核。
- **Source**：3 筆已讀上游方法 README／SKILL.md；其他 17 筆僅使用者提供／既有收藏，原始作者或完整素材未必能追溯。來源已查 ≠ 可執行或無授權風險。
- 原始 Prompt／原始分享文字／分類／Tags／Typed Refs 原封不動；Derived Catalog／Graph 由現行 Canonical 同步，Graph 569 Nodes／1816 Edges，未新增正式 Graph 關係。
- 特別風險：OneTake PolyForm Noncommercial；Google Maps 大量刪除／分類寫入需另核准；API Key 不可進入 Chat／公開檔；IBKR 沒有逐日資料不能造 Rolling 指標；舊 Claude/Jev Router 參數有版本差異。
- 本次不測第三方 Prompt 的模型輸出／整合／客觀品質；UI 範例為手寫且全標 `NOT_TESTED`。後續須透過模型 Baseline／Candidate 配對案例再另做正式評估。
- [Batch 01 逐筆審查](PROMPT_CONTENT_REVIEW_BATCH01_20261122.md)。**PR、CI、Merge、main Gate、Pages Deploy、Live Smoke 尚未填真實結果**；不可提前宣稱通過。

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

1. 查 Batch 01 PR Head 及必需 CI（Unified Intake／Data Validate／P1 Graph & Browser）成功後才合併。
2. main Gate、Pages Deploy 完成後重跑部署後 Live Smoke；報告與本 Handoff 回填精確 Run／Commit 與風險。
3. Batch 02 僅在核對最新 main 後開始，仍保留所有原文、原分類與 Typed Refs。
4. 35/35 全部完成後，才做 Prompts 全庫回歸與 Phase 2 Prompts 封帳總結。
