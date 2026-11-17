# P3｜Problem Curation & Standalone Workflow Playground

> 日期：2026-11-17 · 分支：`feature/workflow-playground-curation-20261117` · 狀態：待 CI 與瀏覽器驗收

## 核心決策

將「理解知識」與「規劃工作流」分開：

- `knowledge.html`：搜尋所有原始 V2 知識類型、閱讀完整內容、檢視正式引用及人工策展的 Problem；在所選節點上提供 Playground Deep Link。
- `playground.html`：先看推薦 Workflow，選用已人工策展的 Recipe，或建立不宣稱相容的自由草稿。
- `index.html`：維持原本主題入口與完整收藏，新增 Playground 導覽。
- **不引入第七種 V2 Canonical Entity，不搬移或覆寫既有 546 筆 Canonical Source，不將 Combination 自動等同 Workflow。**

## 已執行的全庫結構盤點

| 類型 | 筆數 | 發現 |
| --- | ---: | --- |
| Resource | 268 | 22 筆具有獨立 `limitations` 欄位；需補限制及來源新鮮度 |
| Skill | 123 | 5 筆 `status=unreviewed`；多數可讀取 inputs / outputs，但需要核對語意 |
| Concept | 68 | 可作為跨工具的持久知識主軸，不能直接視為工具串接合約 |
| Prompt | 34 | 26 筆 `unreviewed`、6 筆 `generated-draft`、2 筆 `active`；保留原文與審查狀態 |
| Workflow | 36 | 18 筆每個 stage 均沒有 `uses`；僅供階段方法參考，不應強迫填入工具 |
| Combination | 17 | 全部 `status=pattern`；能力組合不代表實際輸入輸出可接續 |
| Curated Problem | 原 5 → 20 | 新增 15 個跨領域 Problem，正式 V2 類型仍為上列六種 |
| Editable Recipe | 原 1 → 3 | 新增 Agent Delivery QA、Enterprise Knowledge QA 兩個來源可追溯範本 |

這是「**所有條目欄位、型態、連結及方法**」的初步結構審查，**不是** 268 個外部工具逐一的最新版本／授權／安全性實測。不能把所有 `active` 資料誤稱已驗證安裝可用。

Graph 由 551 nodes／1,735 edges 變成 **566 nodes／1,806 edges**，其中 Canonical 1,703 edges 保留，Curated 由 32 增加至 103。15 筆新 Problem 和 71 條人工連結皆使用既有 V2 ID、允許的 Relation、來源欄位及理由。Problem JSON 可維護欄位新增可選 `domain`，Graph 只作投影。

## Problem 覆蓋範圍（15 個新增）

- 網站與設計：建站規格到 QA、參考 UI 到互動介面。
- AI Agent／軟體開發：Spec → 多 Agent 開發、程式驗收、模型成本路由。
- 資料／知識管理：企業 RAG、網站研究、跨 Agent 記憶。
- 安全／隱私：本機個資遮罩、具授權的安全測試。
- 自動化／營運：可回復的信箱整理、AI 輔助自架部署。
- 內容／影音：社群內容與實際發布成效的回饋循環。
- 學習／職涯：面試追問、AI Engineering 目標到實作證據。
- 原本五個 AI 影片 Problem 保留；未被策展的主題仍可搜尋全庫。

## Recipe 與不確定性

`data/workflow-recipes/<id>.json` 以 `sourceWorkflowRef` 回指正式 Workflow，用各階段 `requires`、`produces`、`candidates`、`evidenceField`、`why`、`gate` 表示**規劃依據**。

已可編輯：
1. `website-build-review`（原有）— Scope → Visual（可選）→ Build → Review。
2. `agent-delivery-qa`（新增）— Spec → Tickets → Coding → Independent Review → QA → Evidence Delivery。
3. `enterprise-knowledge-qa`（新增）— Ingest → Index → Answer → Review。

所有 Workflow 均可閱讀，但尚缺候選工具／產物契約的 33 筆不能被偽裝成可執行 Recipe。

自由組合保留已加入工具，支援加入、刪除、排序、複製、選取 Resource/Skill Deep Link，瀏覽器 `localStorage` 保存草稿；它是單一裝置的暫存草稿，不代表已儲存至 GitHub／雲端。

所有 Recipe 皆明確維持 `verified:false`。只有使用者明確操作與工具驗證才能更改實際執行狀態；本次改版沒有執行第三方工具。

## 已設計的驗收測試

- `node scripts/build-v2.mjs`：重建 Catalog、Manifest、Graph。
- `node scripts/validate-v2.mjs`：Canonical／Graph 一致性與 Typed References。
- `node --test scripts/test-knowledge-graph.mjs`：Problem／引用驗證。
- `node --test scripts/test-workflow-engine.cjs`：三個 Recipe 的候選與依賴合約、缺必要步驟時阻塞下游。
- `node --check knowledge-app.js && node --check playground-app.js && node --check workflow-engine.js`。
- `node scripts/test-knowledge-browser.mjs`：Knowledge source reading、跳轉 Playground、三個 Recipe、問題導覽、自由草稿加入刪除、375／430／768／1440 px、無 JS 例外與水平溢出。

CI 配置已加入 PR 測試觸發。**實際 GitHub Actions 結果與公開 Pages 部署狀態必須分開確認，不可在未執行前標 PASS。**

## 後續資料品質工作（不混入此次 UI 改版）

1. Resource：優先稽核熱門工具的官方來源、版本／價錢、授權、隱私、安全、I/O 與限制；留稽核日期。
2. Workflow：逐筆找出缺 `uses`、`gate`、`outputs` 的必要階段；不可為了填滿而虛構 References。
3. Prompt：將 `unreviewed` 與 `generated-draft` 分流處理，保留使用者原文、不默認可執行。
4. Capability：建立工具能力與格式證據，再逐步評估替代性，不從共同 tags／Concept 推斷 `COMPLEMENTS`。
5. 在案例有真實資料後，分階段補足其他 Recipe；保留 `status`、驗證證據與安全 Release Gate。
