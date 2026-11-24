# Resource Phase 3｜深度內容與模板路由盤點（2026-11-24）

**狀態：資料盤點完成，深度內容 Batch 尚未開始。** Baseline Main：`b5ed6953704f25853f779df0012376173dc5786a`。此次只讀 `data/catalog-v2.json` 的 **270 個 Resource**，未改任何 Canonical／Tags／Graph／Typed Refs／Schema／正式網站 UI。不可將本報告解讀為 Resource 深度改寫已完成。

## 盤點結果

| 指標 | 精確數量 | 如何解讀 |
|---|---:|---|
| Resource 總數／Phase 2 基礎內容審查 | 270／270 | 已有 features、requirements、limitations 和 intakeReview；不是 270 份可重建的深入教材 |
| `learningGuide` 已有深度章節 | 1 | AI 工程決策速查表，10 個教學模組 |
| `repoGuide` 已有原始碼／重建深度指南 | 1 | AI Usage Bar |
| 尚無上面兩種專屬深度 Guide | 268 | 並非要求全部寫長篇；需依資源類型與實際證據挑適當深度 |
| `source-checked` | 264 | 僅證明資料來源層級審查，不代表實作、Runtime、API、Security、License 實測 |
| `partial` | 6 | 必須先解決來源識別／版本缺口，不能無依據延伸成深入教程 |
| 初步 Content Format 與 Reading Spec 路由不同 | 11 | **待人審**，不表示既有分類必然錯誤，亦不能自動修改正式值 |

### 現有 Reading Spec 實際進度

| 當前 Reading Spec | 筆數 | 實際含義 |
|---|---:|---|
| `repo:deferred` | 215 | 原始來源僅完成基礎查核，尚未提供詳細 Repo Guide |
| `learning:deferred` | 3 | 教材閱讀規格已被識別，但尚未編寫深入教材 |
| `standard:applied` | 50 | 基礎 Resource 呈現完成，不是深度知識內容已完成 |
| `repo:applied` | 1 | AI Usage Bar 來源審查／深度指南 |
| `learning:applied` | 1 | AI 工程決策速查表 |

**來源分級與閱讀模板是兩個獨立維度。** `repo:applied` 不等於 Repository 安裝／安全／API 互通已實測；`source-checked` 不代表資料可直接重建。

## 依 Content Format 暫分為四條閱讀路線

**此為閱讀版型候選，不是更新 Canonical 的分類或新建 Entity Type。** Content Format 有時只是收錄格式，不是實際產品形態；進入實質改寫前仍需逐筆覆核。

| 候選閱讀路線 | 目前 Format 對應筆數 | 應讓讀者完成的事情 |
|---|---:|---|
| `code-repository` | 207 | Understand → Rebuild → Compose（架構、來源檔、I/O、重建與風險） |
| `tool-product-service` | 33 | Decide → Try → Verify（採用條件、實際操作路徑、輸入輸出、費用與風險） |
| `curated-collection` | 15 | Browse → Compare → Select（內容範圍、篩選方法、項目可信度、挑選條件） |
| `learning-reference` | 15 | Explain → Practice → Check（核心原理、例子、練習、驗收） |

**四類合計：270**。其中 207 個 Repository 結構佔多數，應重用現有 [Repo Resource Spec](REPO_RESOURCE_SPEC.md)；教材沿用 [Learning Content Spec](LEARNING_CONTENT_SPEC.md)。產品／工具與收藏索引目前只使用 `standard`，應補齊更有決策價值的呈現契約，但**不是每項都要加入新的 Guide 欄位**。

## 如何提高 Resource 的實際可用性

- **程式碼專案**：先說能解決的問題與資料／狀態流；有版本化來源時再提核心模組、擴充點、必要權限及可重建路徑。若未查到 Code、LICENSE 或 Build，標明缺口，不編造可執行命令。
- **產品／服務／模型**：讀者需要知道適用與不適用情境、需要準備的輸入、操作過程會發生什麼、可交出的結果、限制、替代方案與費用／權限風險。不得假設都有 Public API、可用帳號或定價。
- **策展與目錄**：價值在於如何篩選、比較、選擇，不要以 Repo 重建教程替代索引導覽；不自動聲稱名單內每個項目都已逐項驗證。
- **文章／教材／文件**：內容足以教學時才提供核心因果、決策依據、具體例子、動手練習與檢查結果；不要因類型是 Documentation 就硬塞 10 章。
- **不可重複**：Summary 回答是什麼；正文回答怎麼選／怎麼運作；案例回答怎麼用；驗收回答何時算完成。避免每區換句話說重述同一用途。
- **保留分層**：Agent 需要檔名、契約、來源、版本、權限與技術限制；讀者需要能理解與行動的介面。兩者共用 Canonical，不能為了精簡 UI 刪掉機器要用的資料。

## 11 個 Format／Reading Spec 路由待覆核（非自動判錯）

| Resource ID | Content Format | 既有 Reading Spec | 原始審查理由摘要 |
|---|---|---|---|
| `anthropics-skills` | `collection` | `repo` | 僅核對 README，尚未逐項追溯版本化程式碼、執行契約與完整測試，不可宣稱完成 Repo Guide。 |
| `artlist` | `service` | `repo` | 只有官方網站／README 來源檢視，尚未完成版本化程式碼重建與實測，未建立深度 Repo Guide。 |
| `coolors` | `application` | `repo` | 只有官方網站／README 來源檢視，尚未完成版本化程式碼重建與實測，未建立深度 Repo Guide。 |
| `davinci-resolve` | `application` | `repo` | 只有官方網站／README 來源檢視，尚未完成版本化程式碼重建與實測，未建立深度 Repo Guide。 |
| `frontend-design` | `repository` | `standard` | 僅更新此 Skill 的 Resource 來源閱讀與操作注意事項；未建立或宣稱完成完整 Repo Guide。 |
| `google-flow` | `application` | `repo` | 只有官方網站／README 來源檢視，尚未完成版本化程式碼重建與實測，未建立深度 Repo Guide。 |
| `google-fonts` | `service` | `repo` | 僅完成官方文件核對，沒有逐檔程式分析、執行驗收或版本化 I/O 契約。 |
| `google-pagespeed-insights` | `service` | `repo` | 僅完成官方文件核對，沒有逐檔程式分析、執行驗收或版本化 I/O 契約。 |
| `openrouter-ai` | `service` | `repo` | 僅完成官方文件核對，沒有逐檔程式分析、執行驗收或版本化 I/O 契約。 |
| `pcottle-learn-git-branching` | `interactive-tutorial` | `repo` | 僅完成官方文件核對，沒有逐檔程式分析、執行驗收或版本化 I/O 契約。 |
| `zeabur-oss-ai-agent-installer-guide` | `documentation` | `repo` | 僅完成官方文件核對，沒有逐檔程式分析、執行驗收或版本化 I/O 契約。 |

**判斷原則**：例如官方網站服務不等於可重新建置的 Repo；而 GitHub Repo 也可能只是一份可直接使用的 Skill 或文件。進行深度寫作前，先依使用目的與來源重新選讀法，不直接批次更改分類或 `intakeReview`。

## 6 個來源仍需補證據（禁止猜測）

| Resource ID | Source Gap 原始紀錄摘要 |
|---|---|
| `codex-router` | 原始收藏僅寫 codex router，無 URL、作者或版本；多個不同 GitHub 專案均符合名稱，尚不能判定哪個為原始來源。 |
| `irons163-orchestrate-sol-terra-luna` | 原 irons163/orchestrate-sol-terra-luna URL 已重新導向先前已收錄的 irons163/three-tier-agent-orchestrator；另有 mj-s |
| `skillgodak-hgtv` | 原 SkillGodAk/HGTV 現已在 GitHub API 返回 404；既有 2026-10-17 README／Release 快照有歷史證據，但無法本次重新檢查版本，其他作者同名 Repo |
| `stitch-mcp` | 官方 Stitch MCP Setup 頁面本次無法完整擷取正文，工具參數及當前授權流程未逐段核實。 |
| `viral-hook-title` | 原始收藏只有 viral-hook-title 的通用名稱與極簡用途；同名產品或社群 Skill 不只一個，來源頁是相近範例，不足以辨認最初收藏的實作。 |
| `whisper-ui` | 原收藏記錄『另一個 Whisper UI 專案』、截圖名稱尚未確認，無唯一 URL／Repo／作者；此 GitHub 連結只是一個候選例子。 |

若尚無唯一原作者、Repo 或可讀版本，保持 `partial` 並阻擋任何帶有「已確認 API／架構／授權」口吻的深度實作。補證據前可保留基礎介紹，不刪除舊紀錄。

## 建議 Phase 3 實際交付順序

### Pilot｜每種閱讀類型各一筆（先確認內容品質，而非大量改寫）

| 類型 | 初選 Resource | 本輪應完成的讀者任務 |
|---|---|---|
| Repo | `agent-reach` | 說明多平台讀取通道的基本資料流、權限／例外、核心接線與實測缺口 |
| Product／Service | `arrow-2` | 判斷何時採用向量 SVG 生成、輸入／輸出、適用介面及限制 |
| Collection | `addyosmani-agent-skills` | 依工作任務找到合適 Skill、辨認原作者／來源與使用邊界 |
| Learning | `ai-code-acceptance-review-testing-rollout-guide` | 能從規格比對到程式測試、人工審查、證據與回退檢查清單 |

這四筆只是**已收錄且來源標示 `source-checked` 的優先審查候選**。實際深度內容必須重新核對上游檔案與版本；若缺關鍵來源，改為具體的 Gap，不以既有 `purpose` 及三個 feature 拼成「完整教材」。

### Pilot 驗收後才批次進行

1. **原始資料覆核**：每筆先比對原本的 `url`／`repo`／原始資料／版本／授權／來源是否仍有效；不能把 Source Checked 當 Runtime Passed。
2. **選一個真適用的版型**：允許簡短但完整的 Standard、深入 Repo、具練習的 Learning；Collection 與 Product 類型以對照選型和使用方式為主。
3. **真正寫入內容與 UI**：使讀者不需跳開源頁即可理解用途、運作、上手步驟和驗證缺口；原文與 GitHub 原始碼連結仍可查核。
4. **逐筆驗收與追蹤**：Before/After、原始來源、所選模板、內容去重、可交付任務、桌面／手機版、Source/Runtime/License/Integration 各自狀態。明確標示 `Basic Reviewed` 和 `Deep Content Ready`，不得只用同一個「完成」數字。
5. **執行邊界**：任何正式 Resource 變更遵守 [Unified Intake Policy](UNIFIED_INTAKE_POLICY.md)，保留 IDs、Tags、分類、Typed References、原始 URL；更新必要的 Canonical、衍生 Catalog／Graph、CI／正式站驗證；不能新增沒證據的 Capability 與 Graph Edge。

## 本階段的決策

**先驗四個不同形態的 Resource，再決定何者適合批次整理。** 目前不能用 268 個「無專屬 Guide」作為 268 個內容錯誤或有待寫成長篇的證據，也不應將 `readingSpec.repo:deferred` 批次升級為 Applied。先讓使用者從網站真正獲得「選擇 → 理解 → 使用 → 驗收」的價值。
