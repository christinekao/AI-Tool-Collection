# AI Tool Collection｜知識層次與萃取原則 v0.1

> 2026-11-19 記錄。**保留現行六種 V2 Entity 及既有 Problem Layer／Knowledge Graph／Workflow Playground**。本文件釐清長期方向，不是遷移或刪除核准。

## 核心目標

AI 工具更新和淘汰速度快，因此知識庫不能只停留在「收藏工具」。要從已核實的來源中留存可跨工具重用的 **Concept（原理與模式）**，進一步找到可能的問題情境和 **Workflow（解決流程）**，最後再把目前可用的 Resource／Skill／Prompt 掛回每一步。

**Problem → Concept → Workflow → Implementation Options**
以上是使用與學習的主要路徑，不是強制每筆資料都有四個獨立檔案，也不取代現有六個 V2 Entity。

## 六種 Entity 的保留邊界

| Entity | 目的 | 什麼時候獨立存在 |
|---|---|---|
| Resource | 保存工具、Repo、應用、文章、教材、SDK／服務、來源證據、功能、限制與版本 | 有可核實的獨立來源或值得保存的具體物件 |
| Skill | 可供 Agent 呼叫的獨立能力、執行規程或可重用 Skill | 有獨立執行／復用價值；不能只因 Resource 介紹了 Skill 就複製一份內容 |
| Prompt | 可單獨複製、調整和使用的指令或範本 | 本身有獨立重用價值；原始內容與適配版必須分開 |
| **Concept** | 解決問題的長期原理、架構選擇、限制、Trade-off、反例 | 不依賴特定產品；來源被替換後概念仍成立；有跨項目共通的獨立知識 |
| **Workflow** | 遇到問題時的階段、Input／Output、依賴、驗收、例外與執行前提 | 有可重複套用的步驟或決策；明確標記哪些僅為規劃、哪些已實測 |
| Combination | 工具／能力如何互補或互換、相容條件及其證據 | **選用**：跨多個 Workflow 有獨立重用價值、能說清接口／依賴／替代條件時才獨立 |

**不強制把一篇來源拆出六個 Entity。** 既有六類及 ID 保留；是否整併重複的 Combination 是未來另行審查的資料治理工作，不在分類作業中刪改。

## Combination 特別決策

原始設計的 Combination 問「哪些工具互補／可替換、為什麼搭配」，Workflow 問「工作怎麼依序完成」。
如果一筆 Combination 只是在重述同名 Workflow 使用的工具名稱，或只有單一工具且沒有獨立的協作契約，優先考慮未來把它的資訊放到 Workflow 的 **Implementation Options**；但沒有審核前一律保留現有 Combination 及 Typed References。

只有在以下條件都滿足時，才建議持續獨立維護 Combination：
1. 清楚說出每個元件負責的能力及互補／替代原因。
2. 有可核對的 Input／Output／相容性、風險、條件或限制，沒有證據的部分明確標未驗證。
3. 能在多個 Workflow 或情境重用，而不只是某流程工具名單的複製。

現況檢查（2026-11-19）：17 筆 Combination 均與一筆 Workflow 同 ID；14 筆 `rationale` 為空、`alternatives` 全數未填。**這是重整候選訊號，不表示應自動刪除 17 筆。**

## 每次收錄與重新整理的萃取步驟

1. **Source／Evidence**：保留來源、原始功能、版本、限制與安全狀態；分清作者宣稱和實際測試。
2. **Problem**：說明使用者真正遇到什麼困難，以及這筆資料幫助解決哪一部分。
3. **Concept**：從原理解釋為何有效、必要條件、Trade-off、失敗情境；先查有沒有現有 Concept 可連結，避免重複。
4. **Potential Applications**：辨識原理還能應用在哪些問題與場景，標示為候選，不把文字相似當證據。
5. **Workflow**：僅對具有獨立重用價值的方法建立或更新流程；每步用能力、輸入、輸出、Gate 表達。
6. **Implementation Options**：讓 Resource／Skill／Prompt 對應 Workflow 所需能力，注明模型、Host、成本、授權、資料格式、安全與相容性；不因同 Tag 就宣稱可直接互換。
7. **Review**：逐一驗證原始文件、Concept 來源依據、階段依賴、工具替代、未測試與實測區分。

### 例子：跨 Agent 的工作連續性

- **Problem**：更換 Agent／Session 後丟失專案背景、決策與失敗紀錄。
- **Concept**：持久記憶、來源可追溯、按需檢索、工作交接。
- **Workflow**：紀錄有效決策 → 建立檢索索引 → 新 Session 載入相關上下文 → 核對版本／來源。
- **Implementation Options**：依實際來源與相容性選擇記憶工具、GitHub、索引器與 Agent Host；某個工具停更可以替換。
- **Combination**：僅當記憶服務＋檢索工具＋Host 的協作契約真正值得跨流程重用時，才獨立保存。

## 與重新分類的關係

分類是「如何找到一筆知識」，**不是**「把每一筆 Resource 都轉成 Concept／Workflow」。
Domain／Format／Capability／Metadata 是交叉的分類維度。六種 Entity 只回答知識的本體類型。
目前重新分類**不改變 Entity Type、Schema V2、ID、Typed References、原始 Category 與 Tags**。Concept／Combination／Workflow 的深入內容改寫留待已收錄的 Resource／Skill／Prompt 先完成後處理；可先新增有來源的候選關聯，但不得以分類推導出已驗證可執行 Workflow。

## 驗收與決策界線

- 任何分類候選均可修正，不得將機械推斷標為已人工或上游查核。
- 不自動產生重複 Concept／Workflow，也不移除／合併 Combination。
- 修改資料結構、舊 ID、路由、權限、高成本或不可逆行動須另行確認。
- 每筆分類與萃取能回查來源；測試需包含 Source Integrity、Typed References、全庫可搜尋、UI 行為及 Regression。
