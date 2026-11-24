# Resource Human / Agent 雙層閱讀規格（2026-11-24）

使用者回饋：網站應讓人快速理解資源能做什麼；完整技術深度留給 Agent 在需要實作時讀取。

## 一份 Canonical，兩種閱讀目的

- Human Layer：purpose 用一句白話回答用途；readerGuide 為選用欄位，依資源需要提供 useCases、example、comparison、start、limits。主要介面先顯示用途、實際案例（輸入→處理→輸出→用途）、採用理由及入門方式。避免用專有名詞開場，不以重新描述 README 充當案例。例子須標示自訂／實測；沒有實測不得暗示已完成。
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

此版 resolver 先支援 Repo Guide 能力契約；Service、Collection、Learning 的映射可沿用穩定 ID 與引用原則，但應依實際證據設計對應單元，不能為了統一硬造程式碼符號。
