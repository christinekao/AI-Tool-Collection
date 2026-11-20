# Phase 2 Resources — 最新 Session 交接

> **Single source of handoff truth:** 本檔 → [AGENTS.md](../AGENTS.md) → [Unified Intake Policy](UNIFIED_INTAKE_POLICY.md) → [Batch 10 審查](RESOURCE_CONTENT_REVIEW_BATCH10_20261120.md)。每次開新 Session **先對照最新 main 與 GitHub PR／CI**；不要將未合併的分支進度誤報為 main 已完成。

## 進度快照（2026-11-20，Asia/Taipei）

| 項目 | 事實／狀態 |
| --- | --- |
| Repository / 主分支 | `christinekao/AI-Tool-Collection` / `main` |
| 最新確認的主分支 HEAD（本批起始） | `3a17bff37776b2b462ace7625c09fde7360ca0df`（PR #33 merged） |
| **已合併** | Batch 01–09，**180 / 270** Resources；剩餘 **90** |
| **本批候選** | Batch 10，**20 個新增審查的不同 Resource IDs**，已提交獨立 Branch，**尚未合併** |
| 若 Batch 10 合併並成功驗收 | **200 / 270 已完成，剩餘 70** |
| Batch 10 Branch | `resource-content-batch10-20261120` |
| 分支最新寫入時的 Commit | `c79fc45eb49362272b473cd7876a2e153d20aaad`（報告已寫入；後續 SHA 應再次確認） |
| Batch 10 PR | 待建立；必須查最新 GitHub PR 更新此狀態 |
| Batch 10 CI | **PENDING／未確認**（不能引用 Batch 09 或 PR #33 的檢查） |
| Batch 10 Pages Deployment / Live Smoke | **NOT TESTED**，只可在合併後確認 |
| 下一批 | Batch 11 **未開始**；Batch 10 合併後再選取剩餘 70 筆中的 20 筆 |

## Batch 10 本次提交

**Canonical IDs（20 筆）**：
1. `abi-screenshot-to-code`
2. `acheaisuiyimen-ache-life-to-comic-skill`
3. `anthropic-solving-code-review-at-anthropic`
4. `april-zhu-minicharts`
5. `arrow-2`
6. `brandonhimpfen-awesome-finance`
7. `cloudflare-cloudflare-os`
8. `codebase-index`
9. `cyyeh-agent-loop-visualizer`
10. `ecpay-ecpay-api-skill`
11. `gbro-collage-broll`
12. `gbro-cover-design`
13. `hesreallyhim-awesome-claude-code`
14. `irons163-three-tier-agent-orchestrator`
15. `landing-love`
16. `openai-codex-security`
17. `pythonanywhere`
18. `rive`
19. `vercel-ai-gateway`
20. `voltagent-awesome-openclaw-skills`

**變更檔案**：20 個 `data/resources/<id>.json`、`data/catalog-v2.json`、`data/knowledge-graph-v1.json`、[Batch 10 詳細審查報告](RESOURCE_CONTENT_REVIEW_BATCH10_20261120.md)、本交接檔。

**資料與驗證已完成**：逐項比對舊／新 Catalog：只變動 20 個不同 Resource，原有 270 Resources、549 Canonical、569 Graph Nodes／1816 Edges；既有 ID、Category、Tags、Domain 與 Typed References 保留。用同一投影公式重建 270 Resource Graph Nodes，與已更新 Graph 一致，**記憶體中檢查 PASS**。這不是官方 Node.js CI 或 Runtime 測試。

**來源查核層級**：閱讀官方 GitHub README／正式產品或文件頁，新增用途、功能、環境前提、限制、來源與 `intakeReview`；不代表已下載安裝、確認完整程式碼／安全／授權、或 Runtime／Integration 實測。若原內容已深入，保留有效原文再補缺。

**主要風險**：第三方 Skills 的 Prompt Injection／權限；ECPay 金流與密鑰；Cloudflare OS Gatekeeper 正式環境；影像／影片模型的 API Cost、隱私與素材版權；Codex Security 方案與 Token 計費；本機模型與 Agent 子任務的環境／相容性。詳細來源見 [Batch 10 報告](RESOURCE_CONTENT_REVIEW_BATCH10_20261120.md)。

## 歷史批次（均已合併）

| Batch | Resource 數量 | 詳細來源報告 | PR |
| --- | ---: | --- | --- |
| 01 | 20 | [Batch 01](RESOURCE_CONTENT_REVIEW_BATCH01_20261119.md) | [PR #23](https://github.com/christinekao/AI-Tool-Collection/pull/23) |
| 02 | 20 | [Batch 02](RESOURCE_CONTENT_REVIEW_BATCH02_20261119.md) | [PR #24](https://github.com/christinekao/AI-Tool-Collection/pull/24) |
| 03 | 20 | [Batch 03](RESOURCE_CONTENT_REVIEW_BATCH03_20261119.md) | [PR #25](https://github.com/christinekao/AI-Tool-Collection/pull/25) |
| 04 | 20 | [Batch 04](RESOURCE_CONTENT_REVIEW_BATCH04_20261119.md) | [PR #26](https://github.com/christinekao/AI-Tool-Collection/pull/26) |
| 05 | 20 | [Batch 05](RESOURCE_CONTENT_REVIEW_BATCH05_20261119.md) | [PR #27](https://github.com/christinekao/AI-Tool-Collection/pull/27) |
| 06 | 20 | [Batch 06](RESOURCE_CONTENT_REVIEW_BATCH06_20261119.md) | [PR #28](https://github.com/christinekao/AI-Tool-Collection/pull/28) |
| 07 | 20 | [Batch 07](RESOURCE_CONTENT_REVIEW_BATCH07_20261119.md) | [PR #29](https://github.com/christinekao/AI-Tool-Collection/pull/29) |
| 08 | 20 | [Batch 08](RESOURCE_CONTENT_REVIEW_BATCH08_20261119.md) | [PR #30](https://github.com/christinekao/AI-Tool-Collection/pull/30) |
| 09 | 20 | [Batch 09](RESOURCE_CONTENT_REVIEW_BATCH09_20261119.md) | [PR #32](https://github.com/christinekao/AI-Tool-Collection/pull/32) |

## Release Gate 與證據（不可沿用舊 PASS）

| Gate | Batch 10 狀態 | 下一個驗證動作 |
| --- | --- | --- |
| Canonical ID／不變欄位／Catalog Projection | **PASS（記憶體檢查）** | PR 上核對 Canonical Diff，20 個 IDs 不重複 |
| Graph Node Projection | **PASS（記憶體檢查）** | PR V2 Validate 正式重跑 |
| Unified Intake Gate | **PENDING** | PR 建立後查 workflow Run 的實際結論 |
| V2 Data Validate／Taxonomy／Tag Index | **PENDING** | PR 建立後確認一致性檢查 |
| P1 Graph Unit Tests | **PENDING** | PR 建立後確認實際測試 |
| V2 Catalog Sync | **NOT TESTED** | 合併後查 GitHub Actions 與是否新增同步 Commit |
| Pages Build／Deploy | **NOT TESTED** | 合併後新 main SHA 對應 workflow |
| Live Pages Smoke | **NOT TESTED** | 合併後新 main SHA 對應 workflow |
| Third-party Build／Runtime／Security／Integration | **NOT TESTED** | 不可因 CI 綠燈改標完成 |

依 [Unified Intake Policy](UNIFIED_INTAKE_POLICY.md)，正式執行：
```sh
node scripts/build-v2.mjs
node --test scripts/test-taxonomy-v1.mjs
node --test scripts/test-intake-gate.mjs
node scripts/validate-v2.mjs
node scripts/check-intake-gate.mjs --base 3a17bff37776b2b462ace7625c09fde7360ca0df --head HEAD
```

## 後續 Session 的第一個動作
1. 查 `main` 的最新 SHA、Batch 10 PR 和 CI，**若本文件過期以 GitHub 為準**。
2. 若 PR 尚未建立：從 `resource-content-batch10-20261120` 對 `main` 建立 PR，確保 20 Canonical + Catalog/Graph + Review Report + Handoff 同在 Diff。
3. 修正未通過 Gate，不可直接合併。完成獨立 Review 並看到必要 CI 通過才可合併；合併後檢查 Pages 與 Live Smoke，並將主分支進度及 PR／新 SHA／Run URLs 回寫**本交接檔**。
4. 只有 Batch 10 合併驗收後，才從尚未審查的 70 個 Resource ID 中選 Batch 11 的 20 個；保持每批 20 筆、逐筆來源、獨立 Batch Report + 本滾動交接檔。
5. 不修改分類架構、Raw Tags、Category、Typed References，禁止未授權安裝第三方程式或讀取憑證。

**交接為 DoD 必要交付。** 本檔是最新快照；歷史逐筆證據必須保存在獨立 Batch 報告，不得覆蓋或刪除。
