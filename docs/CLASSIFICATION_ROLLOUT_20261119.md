# 全庫 Domain 分類首輪｜548 筆（2026-11-19）

> **狀態：已批次新增候選分類註記與網站領域篩選；尚未完成 548 筆人工核對。**
> 分類只影響「如何找到收藏」。不改動 Resource、Skill、Prompt、Concept、Combination、Workflow 的定義與既有引用；概念萃取與 Workflow 內容改寫留待後續。

## 一、覆蓋與試行結果

| 檢查 | 結果 |
|---|---:|
| 總數 | 548 |
| Resources／Skills／Concepts／Prompts／Combinations／Workflows | 270／123／68／34／17／36 |
| 40 筆先前試行的候選分類 | 40 |
| 額外以來源欄位指定的示範例外 | 70 |
| 規則推斷候選 | 277 |
| 需要內容複核（低證據或跨域難判） | 161 |

**四種狀態都只是分類候選**，不能等同來源已獨立查核、人工逐筆審核，或工具能力已經實測。需要複核的記錄仍會出現在對應暫定 Domain 與「全部收藏」，後續校正時保留歷史差異。

## 二、各主要 Domain 分布

| 主題 | 筆數 |
|---|---:|
| AI 系統與 Agent | 210 |
| 程式開發與品質 | 38 |
| UI／UX 與前端 | 98 |
| 資料、分析與知識 | 30 |
| 自動化與整合 | 9 |
| 雲端與基礎設施 | 6 |
| 安全與治理 | 22 |
| 內容、媒體與行銷 | 91 |
| 職涯、招聘與面試 | 16 |
| 商業與金融 | 28 |

**學習與教材**是跨領域的 `purposeFacets`，不是第十一種 Domain。每筆皆可同時擁有零到兩個有文字依據的次要領域。

## 三、資料變動界線

- 每筆 JSON 只新增 `classification` 物件：`primaryDomain`、`secondaryDomains`、`purposeFacets`、`reviewStatus`、`evidenceFields`、`classifiedAt`、`rulesVersion`。
- 原 `category`、`tags`、`schemaVersion`、`id`、`entityType`、`source`、`conceptRefs`、`workflowRefs`、Stages 等均不修改或移除。
- `data/catalog-v2.json` 同步由 548 個來源物件組成；`data/manifest-v2.json` 的 ID 不變；Knowledge Graph 的引用／索引所用欄位未更動。
- UI 十個 Domain 以新註記判斷；原「學習與教材」以用途篩選保留。舊 `#/explore/agents`／`coding`／`frontend` 路由相容對應新 Domain；原始每筆詳情頁路由不變。
- 新增或修正分類規則於 `scripts/domain-classifier-v1.mjs`，不要在多個地方重複維護 Category Map。

## 四、後續人工複核與 Release Gate

1. 從 `needs-review` 先檢查低分／資料不足的項目；具多種用途的 Resource／Skill 以使用者**核心問題**為 Primary，不以 Agent Host 或風險警語推斷領域。
2. 校正後可更新單筆 `classification`；是否新增 Concept／Workflow 或調整 Combination 另行決定。
3. 執行 `node scripts/build-v2.mjs`、`node scripts/validate-v2.mjs`、Knowledge Graph 與 Browser 回歸；無法實際重跑的項目不得標記 PASS。
4. GitHub Pages 正式部署需另外確認。分類首輪通過靜態 Source Integrity、數量、URL 保留、分類有效值與 JavaScript 語法檢查，不代表已通過獨立 Browser／Live QA。

## 五、架構原則

[知識層次與萃取原則](KNOWLEDGE_LAYERS_POLICY.md) 持續有效：**Problem → Concept → Workflow → Implementation Options**。本次僅做 Domain 分類，不因分類相同推定工具相容、Concept 等價或 Workflow 可執行；Combination 舊資料完全保留。
