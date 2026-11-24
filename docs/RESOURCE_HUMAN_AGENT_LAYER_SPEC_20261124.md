# Resource Human / Agent 雙層閱讀規格（2026-11-24）

使用者回饋：網站應讓人快速理解資源能做什麼；完整技術深度留給 Agent 在需要實作時讀取。

## 一份 Canonical，兩種閱讀目的

- Human Layer：purpose 用一句白話回答用途；readerGuide 對新建／實質改寫 Resource 為必填欄位，依資源需要提供 useCases、example、comparison、start、limits。主要介面先顯示用途、實際案例（輸入→處理→輸出→用途）、採用理由及入門方式。避免用專有名詞開場，不以重新描述 README 充當案例。例子須標示自訂／實測；沒有實測不得暗示已完成。
- Agent Layer：保留既有 repoGuide、implementationKnowledge、source、intakeReview、版本、架構、檔案、依賴、契約、擴充、重建、權限、失敗模式與證據。Agent 按需讀 canonical JSON，不要求人類閱讀全部技術欄位。不得為簡化畫面而刪除知識，也不新增無證據的 Graph Edge。
- Learning 教材保留給人閱讀的教學內容及練習；與實作專用技術資料區分。Collection 以找、比較、挑選為主；Service 以使用情境、輸入輸出、採用與限制為主，非強制套版。
- 此處 Agent Layer 是資料與呈現分層，**不是保密隔離**。目前是 GitHub Pages 靜態網站，Canonical 與 Catalog 資料仍公開；只是不渲染技術指南。若未來需限制存取或保存機密，另建具權限的資料服務，不得將機密存入公開 Repo。

## Pilot

Pydantic AI：新增 readerGuide，改寫 purpose/recommendation，原 repoGuide 原樣保留。readerGuide 優先於 repoGuide 的人類頁面呈現。其他 Resource 仍使用既有版型，待人類閱讀確認後逐批改寫，避免全面隱藏舊資料而無替代內容。

驗收：5 秒內能說出用途；具體例子能辨識輸入／輸出／下一個系統；能說出何時採用或不採用；未實測明示；Agent 仍可讀完整原 repoGuide；手機與桌面呈現及回歸測試通過。

本規格補充既有 Phase 3 深度計畫：技術審查繼續進行，但不是前台閱讀長度的衡量指標。

## 雙向對應契約（使用者確認）

同一筆 Canonical Resource 維護局部穩定 ID，前台用途與底層技術可多對多，禁止依顯示名稱、陣列順序或檔名猜對應。

- `readerGuide.mappingVersion=1`：啟用對應驗證；`useCases[].id`、`example.id`、`example.steps[].id` 為資源內穩定識別。
- `readerGuide.useCases[].capabilityRefs` 與 `example.steps[].capabilityRefs` 指向同一筆 Resource 的 `repoGuide.capabilities[].id`（不建立正式 Graph Entity）。`example.useCaseRefs` 對應前台使用情境。
- 底層能力保存 `sourceFiles`、`symbols`、`input`、`output`、`gate`、`evidenceStatus`、`runtimeStatus`，共用 source.upstreamCommit。反向索引由同一組 References 即時推導，不另存一份容易不同步的資料。
- 無對應能力的案例步驟必須提供 `externalDependency`，例如 PDF 文字解析或企業 API 寫入，不可把第三方整合當成框架內建功能。僅 Agent 使用的能力可明示 `visibility: "agent-only"`。
- 技術資料及狀態保持 Agent 可讀，前台只渲染人類情境與案例，並透過 DOM 的 data-use-case-id、data-example-id 維持穩定對應。
- Build Gate 阻擋 dangling refs、重複 ID、無用途且未標記 agent-only 的能力、缺失來源錨點及無證據的 Runtime 宣告。

Pydantic AI 試作：4 個前台用途、5 個底層能力、1 個履歷示例與 4 個案例步驟（包含兩個外部整合依賴）。原 repoGuide 技術內容保留；擴充其 capabilities 及 workflow 的 readerExampleRef，不改 Tags、Classification 或 Graph Edge。

### Agent 按需查詢

```bash
node scripts/resource-layer-links.mjs pydantic-pydantic-ai --case document-extraction
node scripts/resource-layer-links.mjs pydantic-pydantic-ai --capability typed-output
```

前者回傳人類用途、相關案例、需用能力、固定版本來源 URL、外部依賴、驗證狀態及尚未查核的實作缺口。後者反向回傳所有對應的前台用途及案例步驟。Agent 必須先重新確認版本、權限、依賴及實際測試，再實作正式流程；設計示例不等於已經執行。

## 所有 Resource 的強制收錄契約

[Unified Intake Policy](UNIFIED_INTAKE_POLICY.md) 是唯一的收錄政策。所有新建或實質改寫 Resource 必須保存 intakeReview.layerReview，且不能省略 mappingVersion。原有未改寫資料不回溯強制。已完成映射的能力不能靜默刪除。

- mappingVersion=1：固定版本程式碼能力，使用 capabilityRefs；適用已完成來源深度查核的 Repo / SDK。layerReview.status=mapped。
- mappingVersion=2：文件或操作證據，使用 evidenceRefs 指向同一 Resource 的 agentEvidence 局部 ID；適用 Service、Collection、Learning、Dataset 等，或尚未取得足夠程式碼的 Repo。layerReview.status=evidence-linked 或 deferred。
- deferred 必須有具體 gap、nextAction，仍要保留已知用途與證據；來源完全無法取得則放 Pending Sources。它不是深度完成。
- agentEvidence 每筆保存 id、detail、locator（來源段落／操作位置）、evidenceFields（已存在的 Canonical 欄位）、limitations、evidenceStatus、runtimeStatus；不得為非程式資源虛構檔案或符號。readerGuide.useCases[].evidenceRefs 與 example.steps[].evidenceRefs 皆可追溯至局部 ID。
- 前台保留 useCases、start、limits、可用的案例；Learning Guide 章節繼續顯示。技術證據留在 Canonical，反向索引不另存。
- runtime-tested / verified 宣告須有各自證據且 intakeReview.verification.status=tested，具 testRun；不代表同一資源的其他功能也已實測。

非程式資源可使用同一個 resolver：`--case <useCaseId>` 正向查詢證據，`--capability <evidenceId>` 反向取得使用情境。這些均為局部參考，不直接形成正式知識圖譜的 Capability 或 Edge。

CI 能驗證欄位、引用、狀態和防止跳過檢查；五秒理解、實際語意及來源可信度仍由獨立審查確認。
