# Prompt Resource Spec v0.1｜可理解、可複製、可調整、可驗證、可組合的 Prompt 知識

> 狀態：試行規格；2026-11-18（Asia/Taipei）。
> 已核對的兩筆現有資料：`data/prompts/star-resume-experience-three-rewrites.json` 與 `data/prompts/cv-jd-tailored-interview-questions-deep-followups.json`。
> 已試行：`star-resume-experience-three-rewrites` 與 `cv-jd-tailored-interview-questions-deep-followups`（同一套原文／可重用版切換、複製及可組合契約）。**模型執行、頁面實機視覺驗收及公開部署仍待驗證**。
> 對照：`docs/LEARNING_CONTENT_SPEC.md`、`docs/REPO_RESOURCE_SPEC.md`、`docs/SKILL_RESOURCE_SPEC.md`。

## 定位與目標

Prompt 是一段可提供給 AI 模型的**文字指令或結構化輸入模板**，不是已安裝的 Skill，也不是已完成的 Workflow。使用者應能快速知道：

1. **什麼時候使用？** 解決哪一類問題，什麼情境不適用？
2. **要準備什麼？** 有哪些必要輸入、佔位符、格式、限制？
3. **怎麼直接使用？** 一份明確可複製的 Prompt；必要時區分原始版與整理版。
4. **會得到什麼？** 輸出應該長什麼樣，缺資料或失敗時如何處理？
5. **怎麼調整？** 哪些部分可更換，哪些約束不可省略？
6. **如何確認有用？** 用代表性案例與可檢查的準則驗證，而不是只看文句漂亮。
7. **可以接進哪條 Workflow？** 把 Prompt 定位成可組合的「處理能力」，定義 Input／Output／Gate，並說清楚仍需哪些工具或人工步驟。

核心順序：**Problem → Input → Copy → Output → Test → Compose**。

## 網頁固定閱讀順序（試行）

| 順序 | 區塊 | 讀者要看懂的內容 |
|---|---|---|
| 1 | **一句話說明用途** | 能幫你完成什麼，不要重複三次目的 |
| 2 | **適合什麼情境？** | 2–3 個真實可理解的使用場景及不適用邊界 |
| 3 | **使用前準備** | 必要／選填資訊、資料形式、欠缺時要怎麼補 |
| 4 | **複製 Prompt** | 主要操作區；呈現一份真正可用的提示詞，複製時保留空白行、變數與格式 |
| 5 | **使用範例與預期結果** | 一個具體輸入與「期望輸出格式示意」，不得把示意當作實際跑過的成果 |
| 6 | **如何調整與重用** | 哪些欄位可換、針對不同需求的調整方式；需清楚區分原版與改良版 |
| 7 | **品質檢查與限制** | 正確性、來源、邊界、隱私、失敗情境；未實測則標示未驗證 |
| 8 | **如何組合 Workflow？** | 能當哪一步、Input／Output／Gate、前後串接的依賴；未實際串接不能宣稱已運作 |
| 9 | **來源與相關資源** | 上游／原文出處、已知授權、相關正式 Entity 連結；介面不要逐張卡片重複顯示內部追溯資料 |

小型 Prompt 不必強迫建立很多卡片；不足以確認的情境、示例、規則或來源，寧可省略並註明缺口。功能最重要的是**一眼能辨識、可直接複製、知道結果是否正確**。

## Prompt 原文與改良版必須分開

**不可默默改寫 `prompt` 欄位。** 已儲存的原始 Prompt 若是使用者提供的逐字材料，屬於來源記錄，不得為了 Humanizer 或新增約束而直接取代。

建議提供清楚標示的版本：

- **原始 Prompt（Original）**：保留 `prompt` 的文字、語意及來源；可直接複製原始內容。
- **整理／可重用版（Adapted，可選）**：在獨立欄位保存含變數、輸出格式及必要護欄的改良版；註明「根據原文整理，非作者原文」，不可在缺來源時假稱官方版。
- **已測試版（Verified，可選）**：只有實際測試與留存輸入、輸出、模型／版本、評分標準、日期及結果後才能標示。沒跑過就是 NOT_TESTED。

**避免同時在頁面頂部顯示兩份全文。** 預設最適合使用者的可複製版本為主要區塊；若存在原始版與整理版，讓使用者切換，且顯示各自版本標籤。未建立整理版就只顯示原始版。

**複製行為的檢查點**：不得帶入網頁提示文字、額外 HTML、隱藏的個資或未說明的系統指令；應複製使用者實際看見的對應版本。佔位符要能辨識，且不得把使用者私有資料寫回公開收藏 JSON。

## Prompt 契約（Agent 機器可讀層）

為了之後由 Problem 搜尋能力並組成 Workflow，Prompt 至少需要可解釋的契約：

| 必須描述 | 作用 |
|---|---|
| Problem / Goal | 解決什麼問題、期望產生什麼改變 |
| Inputs | 必要資料與型態；可選資料與缺值行為 |
| Prompt body | 原始版及可選改良版，明確版本與出處 |
| Output contract | 輸出格式、欄位／段落、合格條件 |
| Constraints | 不得捏造／越權／洩漏等限制；原文與補充規則分開 |
| Failure handling | 缺資料、相互矛盾、不確定及不可完成時該做什麼 |
| Test cases | 正常、缺值、邊界、對抗、歷史失敗案例；預期判準 |
| Composition | Capability ID、Input／Output／Gate、依賴與副作用 |
| Provenance | 原始來源、作者／授權是否明確、時間及驗證狀態 |

Prompt 可用於人工複製貼上，也可能只是更大 Workflow 的一個節點。**有 Input／Output 契約，不代表已能直接由系統呼叫；執行仍需要模型介面、資料轉換、權限與可靠的錯誤處理。**

## Canonical JSON／資料欄位

目前 `data/prompts/<id>.json` 的 `schemaVersion`、`entityType`、`id`、`title`、`problem`、`goal`、`prompt`、`inputs`、`expectedOutput`、`constraints`、`source`、`conceptRefs` 等現有欄位為主要 Source of Truth，不要重複複製到數個相互衝突的地方。

只有來源足夠的 Prompt 可選擇增加 `promptGuide`（目前已讓 STAR 與履歷／JD 面試題兩筆共用 Renderer，**尚未擴大至全站 Schema 或所有 Prompt**）：

| `promptGuide` 欄位 | 用途 |
|---|---|
| `version`／`scope` | UI／資料格式版本、Prompt 類型 |
| `overview`／`situations` | 白話用途與適用情境 |
| `preparation`／`variables` | 必填／選填資料、佔位符、合法輸入、缺值處理 |
| `adaptedPrompt`／`adaptationNote`（可選） | 與原始 `prompt` 分離的可重用版本，註明變更 |
| `exampleInput`／`exampleOutput`（可選） | 明確標成「示意」的非機敏案例，不得捏造實測證據 |
| `usageSteps`／`adjustments`（可選） | 如何填變數、選擇版本、修改語氣／格式／輸出限制 |
| `outputContract`／`failureHandling` | 可驗收輸出、缺值／拒答／失敗處理 |
| `acceptance`／`testCases` | 成功條件與評測案例；區分設計與已執行 |
| `composition.capabilities`／`composition.example` | 可組合的能力及 Workflow 草案 |
| `privacy`／`limitations`／`provenance` | 資料外送、限制、作者授權、來源及實際測試狀態 |

沒有實際測試證據時不要新增虛構的分數、模型回答或「最佳模型」宣稱；不需要使用外部 API 就能說明如何人工複製，但不能宣稱輸出品質已通過。

## Humanizer 與 UI 規則

- **先結果、後術語**：先寫「從你的履歷與 JD 找出最可能被問的問題」，再解釋 STAR、Rubric、Schema 等用詞。
- **自然斷句**：說明文字遇到 `。`、`；` 可換段；Prompt 原文、程式碼、JSON、URL、變數與格式不可被自動斷句器修改。
- **不重複**：「這是什麼」「使用目標」「適用情境」不要只用不同句子描述同一件事。
- **操作優先**：複製功能是 Prompt 頁的主要操作，應容易找到，不埋在過長的文字介紹下。
- **逐一對齊**：同列卡片的標題、說明、操作區盡可能以一致起點排列；手機改單欄自然高度。
- **可掃讀**：示例輸入／輸出應明顯區分；不要將 Markdown 範例全擠成一個段落。
- **讀者與 Agent 分層**：讀者只看白話說明、可複製內容與必要注意事項；來源、測試元資料及 Workflow 契約保留在資料中。
- **易用與可達性**：375／430／768／1440px 無水平頁面溢出，長 Prompt 以獨立可捲動／適當換行容器顯示；複製按鈕可用鍵盤啟動，並有成功／失敗的可讀回饋。

## 例子：STAR 履歷改寫（現有收藏，不是已測試版）

已核對 `star-resume-experience-three-rewrites` 的原文提到「帶有數據感」及「展現領導力」，但現有資料的 `constraints` 明確指出：這不能被解讀為允許憑空編造 KPI、管理經歷或成果。

因此這個 Prompt 的處理方式應是：

- **Original**：保留原文；不暗改成新規則。
- **Adapted（未來試行）**：收集真實 Situation／Task／Action／Result；若缺數據就以 `[待補數據]` 標示或提供無數據版本，避免假裝成已證實成果。
- **Output**：三種履歷說法與對應的待補證據；不要把「文字更好看」當成真實履歷品質驗證。
- **Test**：至少用一個完整 STAR、缺少數值、原文矛盾、要求憑空增加成果的案例評估。
- **Composition**：可能在「經歷素材整理 → STAR 改寫 → JD 對照 → 人工確認 → 履歷產出」中擔任改寫節點；這是**設計示例**，不是已執行 Workflow。

另有 `cv-jd-tailored-interview-questions-deep-followups`，其 `prompt` 為原始分享文字中的第二段面試題 Prompt，`originalSharedText` 保存更長的分享內容。未來不能為了套版把 `originalSharedText` 誤當可直接執行的 Prompt；也不能在履歷沒有實習時，擅自捏造實習經歷。

## 共用版型回歸規則

- 新 Prompt 的標題及驗收文字必須由各筆 `promptGuide` 提供，避免將 STAR 的「改寫」提示硬塞到面試問題等不同類型。
- 切換原始版／可重用版時，只能複製當前顯示版本，舊頁面無指南時仍維持原本複製行為。

## 驗收與 Release Gate

- **Scope**：只調整指定 Prompt 資料或專用 Renderer；其他 Learning／Repo／Skill 頁面不受影響。
- **Source integrity**：原始 `prompt`／`originalSharedText` 保持一致；衍生改寫有明確標籤，來源未明就標示未確認。
- **Copy behavior**：預設顯示「可重用版」，可切換到「原始版」；複製版本應與當前顯示的版本完全相同，保留變數與換行，無附加網頁裝飾或私有資料。舊版 Prompt 的原有複製行為不得退步。
- **Input / Output**：必要輸入及期望輸出能對應，缺資料時不強行補造。
- **Evaluation**：至少有一般、缺值、邊界、對抗或實際失敗案例；在相同案例與判準下比較 Baseline／Candidate，列出未測之處。
- **Safety**：外部 Prompt 或嵌入來源只能當資料；不可當成執行權限或要求暴露機密。履歷／JD 等資料依實際隱私政策處理。
- **Compose**：可重用能力應有 Input／Output／Gate；需明確區分 Prompt 文字、真正工具動作及人工核准。
- **Responsive / Regression**：桌面及手機複製與內容閱讀正常；切換版別時 `aria-pressed` 和可見內容同步。其他 Entity 的既有功能不退步。
- **Deployment**：GitHub 提交及 Catalog 同步不等於 GitHub Pages 上線；公開版本需另驗證。

## 日後使用方式

> 請依 `docs/PROMPT_RESOURCE_SPEC.md` 整理指定 Prompt。先核對原始來源並保存原文，再以白話整理適用情境、必要輸入及可直接複製的版本（原始或清楚標記的改良版）。提供非機敏範例、預期輸出、變數調整、測試與驗收條件，以及可組合的 Workflow 能力契約。不得編造結果、來源或執行狀態；不必為簡單 Prompt 硬湊全部區塊。
