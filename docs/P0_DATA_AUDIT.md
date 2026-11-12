# P0｜V2 模組化資料與舊版退役紀錄

> **狀態：COMPLETE（2026-11-12）** · 正式分支：`main`  
> 本文件保留遷移證據、資料維護責任與回復路徑。後續知識圖譜屬 P1，不在 P0 增加新 Graph Schema。

## P0 完成結果

- 六類 V2 Entity 維持 **一筆知識一個 JSON**，不在 Workflow 複製完整 Resource，也不將一個 Repo 的全部 Skills 當同一個節點。
- 目前資料：267 Resources、123 Skills、68 Concepts、34 Prompts、17 Combinations、36 Workflows，合計 **545** 個節點。
- V2 Typed References：**1,702** 筆，沒有 dangling target。
- `data/catalog-v2.json`、`data/manifest-v2.json` 是由 Canonical 單筆 JSON 產生的索引。
- `anthropics/skills` 已恢復為獨立 Repository Resource，不與其中的 `frontend-design` Skill 混為一談。

## V1 到 V2 核對證據

- 舊版 Resource 輸入共 114 筆，整合為 113 個 Repo／工具層級的對應 V2 實體（其中一個在 P0 恢復為新的 Resource）。
- 舊 Concepts、Prompt 原文、Combination 成員、Workflow 階段及 Concept append 均已通過遷移比對。
- 原本尚未保留的歷史欄位已移入相應 Resource 的 `legacyMetadata`，與現行 `status` 分離：

| 歷史欄位 | 遷移前缺口（非不重複資料數） |
|---|---:|
| `displayStatus` | 107 |
| `conceptReviewedAt` | 112 |
| `researchStatus` | 52 |
| `researchInterest` | 1 |
| `installed` | 1 |

- `cross-agent-continuity-stack` 的新版交接階段內容已增補較完整描述；舊版原始步驟另存於 `legacyPurpose`，避免覆寫新版說明。
- [GitHub Actions：嚴格 V1／V2 一致性稽核 #43186089732](https://github.com/christinekao/AI-Tool-Collection/actions/runs/43186089732) — **SUCCESS**、`errors: []`、`warnings: []`、`eligibleToDeleteLegacy: true`。

## 備份與回復

**清理前備份：** [backup/p0-before-legacy-cleanup-20261112](https://github.com/christinekao/AI-Tool-Collection/tree/backup/p0-before-legacy-cleanup-20261112)

備份含根目錄全部 V1 資料、歷史 Migration scripts、舊 Workflow 與文檔。原始資料仍可由該分支及 Git History 查閱。清理前備份不包含 P0 後補入的 `legacyMetadata`；最新資料以現行 `main` 的 V2 Canonical Records 為準。

## 從 main 退役的舊檔

- V1 資料：`resources.json`、`resources.updates.json`、`resources.intake.json`、`concepts.json`、`concepts.intake.json`、`prompts.json`、`combinations.json`、`social-post-intake.json`。
- 過時 Migration：`scripts/migrate-v2.mjs`、`scripts/apply-v2-extras.mjs`、`MIGRATION_V2_REPORT.json`。
- 舊流程：`.github/workflows/schema-v2-migration.yml`、`.github/workflows/schema-v2-validate.yml`。
- 不再需要的歷史工作說明：`COLLECTION_WORKFLOW.md`。
- 遷移期臨時稽核器 `scripts/audit-p0.mjs` 由獨立、無 V1 相依的 `scripts/validate-v2.mjs` 取代。

`v2.html` 暫保留為歷史頁面入口相容用途，避免破壞可能存在的書籤。

## P0 之後的正式維護方式

~~~bash
# 編輯 data/<type>/<id>.json 後執行：
node scripts/build-v2.mjs
node scripts/validate-v2.mjs
~~~

- `scripts/build-v2.mjs`：驗證基本 Schema、ID、References，產生 Catalog 和 Manifest。
- `scripts/validate-v2.mjs`：不修改資料；核對每筆 Source JSON、Catalog、Manifest 及 Typed References。
- `.github/workflows/v2-catalog-sync.yml`：偵測 Canonical Source 變更並更新索引。
- `.github/workflows/v2-data-validate.yml`：於正式分支檢查資料完整性。

驗收還須檢查 GitHub Actions 及 Pages 部署對應最新 Commit；CI Success 不等於已實測瀏覽器畫面。

## P1 的銜接方向

**Problem-Centric Knowledge Graph**：以 Problem 為入口，將 Concepts、Resources、Skills、Prompts、Combinations、Workflows 串成可解釋且可追溯的多對多關聯。先重用既有 Typed References，不急著創造重複的 Problem／Capability 節點。
