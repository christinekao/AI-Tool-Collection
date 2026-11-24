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
