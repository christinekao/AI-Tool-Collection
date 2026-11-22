# Phase 2 Concepts — Session Handoff（2026-11-22）

## 目前進度與目標
- 最新起始 main：`ddf890b7dc7b262934f84fe29e009eb9adaa4a68`。
- Working branch：`concept-content-batch01-20261122`。本批依 ID 第 1–20 筆（**20/68 候選完成，剩餘 48**）。
- 前 20 筆的更動、來源和限制見 [Batch 01 逐筆審查](CONCEPT_CONTENT_REVIEW_BATCH01_20261122.md)。
- 20 筆均保留舊有內容與 Typed Refs；補概念定義、適用訊號、取捨、反例、跨領域示意、驗證問題及 Intake Review。沒有新增正式 Concept／Capability／Workflow。
- Source Review 為既有資料整理（provided-material），非已獨立查核上游。實際外部執行、模型輸出、整合與全面授權審查均 NOT_TESTED。

## 交付 Gate — 尚未驗證，不得冒稱 PASS
- PR Unified Intake、V2 Validate、P1 Graph／Browser＋Concept Static Tests：PENDING。
- main CI／Catalog Sync、GitHub Pages Deploy、部署後 Live Smoke：PENDING。
- 在驗收完成後，以 GitHub PR/Commit/Action Run ID 補此交接；保留首次失敗與修復證據。
- Canonical 全庫基準：270 Resources／123 Skills／68 Concepts／35 Prompts／17 Combinations／36 Workflows；Graph 基準 569 Nodes／1816 Edges，新增正式邊預期 0（待 CI 核實）。
- 禁止以 CI PASS 宣稱真實模型、外部服務或來源授權通過。

## Batch 02 — 第 21–40 筆確切 ID
21. `cross-agent-memory-portability`
22. `cross-agent-shared-memory`
23. `cross-layer-software-reconstruction`
24. `data-ingestion-normalization`
25. `design-to-code-loop`
26. `deterministic-execution-boundary`
27. `editable-agentic-timeline`
28. `editable-generative-assets`
29. `episodic-character-asset-consistency`
30. `eval-gated-subagent-consolidation`
31. `evidence-backed-agent-investigation`
32. `evidence-before-execution`
33. `evidence-preserving-visual-abstraction`
34. `explicit-visual-system`
35. `file-first-memory-source-of-truth`
36. `heterogeneous-model-review`
37. `lease-based-agent-task-coordination`
38. `local-first-sensitive-data-processing`
39. `long-running-agent-operations`
40. `memory-observability`

## 開始下一批前
讀取新的 main、此 Handoff、Batch 01 審查與 PR 證據；若有尚未完成的 CI／部署／Smoke，先收尾再開始第 21 筆。每批皆需 GitHub PR、逐筆報告與可續接交接。
