# P0｜資料架構盤點與 V1 安全退役

> 狀態：IN PROGRESS · 盤點日期：2026-11-12 · 分支：main  
> 未通過完整內容保留與流程相依檢查前，不刪除 V1。

## 目標與邊界

- 一筆實體只維護一個 Canonical JSON：`data/<type>/<id>.json`。
- Resource、Skill、Concept、Prompt、Combination、Workflow 獨立維護；使用 Typed Reference 關聯，不複製完整資料。
- 保留原始來源、歷史研究狀態、審查日期、未解決項目與已知限制。
- 聚合的 `data/catalog-v2.json`、`data/manifest-v2.json` 必須能從單筆 JSON 完整重建。
- P0 不建立新 Graph Schema、不改 UI，不因 Resource／Skill 同名而合併。

## 現有正式資料來源

| 類型 | Canonical 路徑 | 筆數 |
|---|---|---:|
| Resource | `data/resources/*.json` | 266 |
| Skill | `data/skills/*.json` | 123 |
| Concept | `data/concepts/*.json` | 68 |
| Prompt | `data/prompts/*.json` | 34 |
| Combination | `data/combinations/*.json` | 17 |
| Workflow | `data/workflows/*.json` | 36 |
| **合計** | | **544** |

- 六種資料的單筆檔、Catalog 與 Manifest 的 ID 清單一致。
- Catalog 共含 1,701 個可辨識 Typed References；靜態檢查沒有發現指向不存在節點的引用。
- V2 聚合檔是 Build Artifact，不是手動維護的原始檔。
- Resource/Skill 同名有時代表不同實體，不可僅以標題去重。

## P0 Audit 實際執行結果（2026-11-12）

[GitHub Actions：P0 Data Audit #43184395258](https://github.com/christinekao/AI-Tool-Collection/actions/runs/43184395258)：**SUCCESS**（只讀結構稽核）。

- V2 Source / Catalog / Manifest 一致，544 筆、1,701 個引用、0 個 dangling reference、0 個結構錯誤。
- 舊 V1 的 Resource、Concept、Prompt、Combination **沒有找不到對應實體**；主要內容及 Concept append 初步檢查沒有缺口。
- 歷史 metadata 仍有差異（以下為 V1 每筆欄位缺值的數量，**不可加總當成不重複項目數**）：

| 歷史欄位 | V2 尚未保留的欄位筆數 |
|---|---:|
| `displayStatus` | 107 |
| `conceptReviewedAt` | 112 |
| `researchStatus` | 52 |
| `researchInterest` | 1 |
| `installed` | 1 |

**結論：P0 結構驗證 PASS；Legacy 完整退役門檻 NOT MET。** 暫不刪舊資料。

## V1 盤點與內容保留

仍存在根目錄的舊資料檔：

- `resources.json`、`resources.updates.json`、`resources.intake.json`
- `concepts.json`、`concepts.intake.json`
- `prompts.json`、`combinations.json`、`social-post-intake.json`

初步比對：舊 Resources 共 114 筆輸入、合併後 112 個不重複身分；在 V2 均可找到對應項目。舊 Concepts、Prompts、Combinations 及 Concept append 補丁也有 V2 對應。**這是身分及核心內容比對，不代表歷史 metadata 全部保留。**

仍待處理的歷史欄位：

- `displayStatus`、`researchStatus`：舊版收藏／研究狀態，與 V2 `status` 不一定等價。
- `conceptReviewedAt`：歷史 Concept 關聯的審查日期。
- `researchInterest`、`installed`：少數收藏的個別備註／狀態，須判斷是否仍有效。
- `flow`、`components`、`concepts`、`promptContent`：已映射至其他 V2 欄位，應核對轉換後的值。

`MIGRATION_V2_REPORT.json` 是 2026-10-02 的舊快照（當時 Resources 113 筆），不能代表今天 544 筆的完整性。

## 只讀稽核工具

在 Repo 根目錄執行：

~~~bash
node scripts/audit-p0.mjs
~~~

稽核項目：單筆檔與聚合檔內容、Manifest ID、Typed Reference、舊資料身分覆蓋、核心欄位與歷史 metadata 差異。

考慮移除舊檔之前，先執行：

~~~bash
node scripts/audit-p0.mjs --strict-legacy
node scripts/build-v2.mjs
node scripts/validate-v2.mjs
~~~

`--strict-legacy` 只做檢查：舊內容或 metadata 遺漏時回報未通過；**不會刪除任何檔案**。

## 不能直接刪除的原因

- `scripts/migrate-v2.mjs` 會**先清空六個 V2 目錄，再從舊版 JSON 重建**；不可再用於現行 main 日常同步。
- `.github/workflows/schema-v2-migration.yml` 仍存在，指向 `schema-v2-migration` 分支；不能誤當 main 的正式 Pipeline。
- `scripts/apply-v2-extras.mjs` 使用歷史聚合檔修補資料，重跑可能覆蓋較新的 V2 內容。
- `COLLECTION_WORKFLOW.md` 仍記載 V1 舊作法。衝突時以 README、SCHEMA_V2.md 和現行 V2 程式碼為準。
- `v2.html` 與 `index.html` 目前內容相同；尚未確認外部書籤及連結，先不刪除。

## P0 驗收條件

- [x] 確認 V2 已拆成 544 個單筆 JSON。
- [x] 對照單筆檔、Manifest、Catalog 的 ID 清單。
- [x] 盤點 V1 原始資料檔、相依工具與遷移覆寫風險。
- [x] 加入只讀 P0 稽核工具。
- [x] 在 GitHub Actions 完成 P0 結構稽核並取得結果。
- [ ] 處理舊版資料與 metadata 差異，讓 strict legacy parity 通過。
- [ ] 停用／封存舊 Migration 流程，排除重新清空 V2 的風險。
- [ ] 更新含 V1 過時指示的文件。
- [ ] 建立可還原的 Git Tag／備份，確認正式程式不再依賴 V1。
- [ ] `--strict-legacy` 通過後，才移除已確認不再使用的舊檔。
- [ ] 驗證 V2 Catalog Sync、網站載入及主要功能沒有回歸問題。

## P1 方向（不屬於本階段）

**Problem-Centric Knowledge Graph**：Problem 保存長期存在的需求；Concept 解釋原理；Workflow/Prompt 保存可執行方法；Resource/Skill 是可更換的實作；Combination 表示互補組合。

現行六類 V2 Entity 先保留。新增 Problem、Capability、Graph Edge 前，必須定義與既有 Goal、Concept、Typed Reference 的責任邊界，避免再次製造重複資料來源。
