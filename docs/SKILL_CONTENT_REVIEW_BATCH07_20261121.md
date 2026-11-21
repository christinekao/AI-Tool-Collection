# Skills Phase 2 — Batch 07 來源審查與最後三筆交付

2026-11-21（Asia/Taipei）｜Base main `7f55d27fd1e8a70074965e3e84da70cf26a3750e`｜Branch `skill-content-batch07-20261121`

## 範圍、查核方式、未驗證界線

- 排序第 **121–123 筆**：`yusufkaraaslan-skill-seekers`、`zhouxiaoka-autoclip-autoclip`、`zhouxiaoka-autoclip-product-board`。三筆皆為**既有** Canonical Skill；本批只補強 Purpose、Problem、I/O、Execution、Trigger、Risk、Gate、`skillGuide` 與 `intakeReview`。
- **官方來源 3/3 已閱讀**：Skill Seekers 官方 README；AutoClip `skills/autoclip/SKILL.md`；AutoClip `skills/product-board/SKILL.md`。另讀兩個 Repo 各自官方 LICENSE，均標示 MIT。**這只證明主儲存庫授權聲明，不能取代依賴、素材、影片、模型、商業授權與執行安全審查**。
- **原始 ID、Title、Tags、Primary Domain、Classification、resourceRefs、conceptRefs 均不變**；兩個 AutoClip Skills 對應同 Repo 不等於同一操作契約。沒有新增假定 Graph 關係，衍生 Catalog 只覆寫三筆；Graph 預期維持 569 Nodes／1816 Edges。
- 第三方 Skill **均未安裝、執行、存取私人資料、使用模型、付費、實際剪片、寫入社群，亦未執行 Runtime、Security Scanner、獨立 License 法律審查或 Integration Test**。文件中的原始命令僅當作研究資料。

## Before／After

| # | ID | I/O（Before → After） | 來源 |
|---:|---|---|---|
| 121 | `yusufkaraaslan-skill-seekers` | 0/0 → 2/2 | 官方 README＋MIT LICENSE |
| 122 | `zhouxiaoka-autoclip-autoclip` | 2/1 → 2/2 | 官方個別 SKILL.md＋MIT LICENSE |
| 123 | `zhouxiaoka-autoclip-product-board` | 2/1 → 2/2 | 官方個別 SKILL.md＋MIT LICENSE |

## 三筆逐項契約

### 121. `yusufkaraaslan-skill-seekers`

- Source：[官方來源](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/README.md)；[主 Repo LICENSE](https://github.com/yusufkaraaslan/Skill_Seekers/blob/main/LICENSE)。官方 README 標示 v3.9.0、18 類來源、22 個 Target；這些是文件陳述，非本次實測。主 Repo LICENSE 為 MIT；第三方內容、模型另計。
- **Trigger**：需要把有權讀取的網站文件、程式庫、PDF 或其他來源轉為結構化 Agent Skill／RAG 知識包，而非只做一次摘要。
- **Not Trigger**：只有一般問答或未授權的付費／內部來源時不抓取；沒有相容執行環境、Python、來源與合法存取權時不宣稱完成轉換。
- **Host／Command**：Python 3.10+；範例 CLI：skill-seekers detect <source> --json；skill-seekers create <source>；skill-seekers quality output/<name>/；skill-seekers package output/<name> --target claude。需另行核准安裝。
- **Inputs**：有權處理的網站 URL、GitHub Repo、本地文件或匯出資料，以及可合法儲存的範圍；輸出目標（Agent Skill、RAG、平台）、抓取深度、排除內容、預算與資料敏感程度
- **Outputs**：依選定 Target 產生的 SKILL.md、references 或可供 Agent 讀取的結構化內容（需真實執行）；打包的平台產物或檢索資料與品質檢查報告（有執行並產出時）
- **Execution**：確認來源與權限（查明來源權限、robots／平台條款、資料範圍、需排除的機密及目標格式） → 預覽與擷取（先 detect 確認來源，再選對應 create 流程萃取資料） → 整理與品質檢查（檢視生成的 SKILL.md、引用、過時內容及隱私；必要時 quality 檢查） → 輸出與封裝（只在工具實際可用時執行 package --target，確認成果路徑）。
- **Risk**：資料與網站權限：不能繞過登入、授權或 robots／平台限制；不得將私人程式碼、憑證、個資直接送交外部模型。；成本與依賴：OCR、影片轉錄、雲端 LLM、Playwright 等是可選依賴且可能產生成本；不自動安裝。；授權範圍：Repo LICENSE 為 MIT，但來源文件、截圖、程式碼、影片、模型與依賴授權需另行審查。
- **Acceptance**：生成的內容能追溯到具體來源，引用、時間與敏感資訊經檢查；只有 CLI 真正輸出檔案、品質檢查可追蹤時才回報建置成功；未執行標為 NOT TESTED
- **Verification**：SOURCE DOCUMENTS REVIEWED；EXTERNAL RUNTIME／SECURITY／INDEPENDENT LICENSE／INTEGRATION NOT TESTED。

### 122. `zhouxiaoka-autoclip-autoclip`

- Source：[官方來源](https://github.com/zhouxiaoka/autoclip/blob/main/skills/autoclip/SKILL.md)；[主 Repo LICENSE](https://github.com/zhouxiaoka/autoclip/blob/main/LICENSE)。官方 SKILL.md 說明 7 個平台 id、五種風格、狀態輪詢與 ZIP 導出；版本應查 get_version，未實測。Repo 主 LICENSE 為 MIT。
- **Trigger**：使用者提供合法影片來源，明確希望產出平台短片、封面、文案與發布包。
- **Not Trigger**：只要原始片段或舊片段 Upload-Post 應走 references/legacy.md；只問安裝或未提供來源不開始製片，未核准不得代替使用者發布。
- **Host／Command**：優先已存在的 AutoClip MCP（get_version → start_quick_output → get_quick_output_status）；無 MCP 但有授權 Shell 時使用 autoclip produce <source> --json；無環境時僅提供文件說明。
- **Inputs**：使用者有權處理的 YouTube／B 站 HTTPS URL 或本機影片絕對路徑、目標平台；選擇性字幕 SRT、風格（editorial／street／news／cinema／classic）、輸出存放處、模型費用授權
- **Outputs**：依平台裁切渲染的影片、封面及發布文案（實際完成的平台）；ZIP 發布包、project_id、逐平台狀態與完整檔案路徑（若實際導出）
- **Execution**：確認版本與素材（呼叫 get_version 或 autoclip --version；確認影片權限、平台和現有工具） → 提交單筆任務（用 start_quick_output 或 autoclip produce；取得 project_id；批量時一次一筆） → 輪詢到終態（依 poll_after_sec 查狀態，區分 completed／partial／failed／interrupted／cancelled／unknown） → 導出與逐平台驗收（終態後以 export_kits=true 重新查詢，確認影片／封面／文案／ZIP 完整路徑）。
- **Risk**：著作權與肖像：原片、音樂、訪談人物、字幕與各平台再利用需有授權；MIT 不涵蓋第三方素材。；費用與憑證：雲端模型可能按量計費；API Key 僅能放安全設定或環境變數，不寫進對話／工具參數。；執行與狀態真實性：partial 不重送整筆成功項目；interrupted 待使用者決定；unknown 不能宣稱完成；不擅自發布。
- **Acceptance**：逐平台檢查實際影片、封面、文案與 ZIP；任何缺失分別列出，不將 partial 當 completed；任務有 project_id、版本、終態與檔案路徑，無下載／渲染／發布權限時明確標為未執行
- **Verification**：SOURCE DOCUMENTS REVIEWED；EXTERNAL RUNTIME／SECURITY／INDEPENDENT LICENSE／INTEGRATION NOT TESTED。

### 123. `zhouxiaoka-autoclip-product-board`

- Source：[官方來源](https://github.com/zhouxiaoka/autoclip/blob/main/skills/product-board/SKILL.md)；[主 Repo LICENSE](https://github.com/zhouxiaoka/autoclip/blob/main/LICENSE)。來源契約強制先讀 COMMUNITY_BOARD.md；先唯讀再依人員批准寫入，Shipped 需 release notes；Repo 主 LICENSE 為 MIT。
- **Trigger**：使用者明確要分析 AutoClip 社群回饋、功能需求、重複問題，或指定將已確認項目移入 Roadmap。
- **Not Trigger**：不適用一般 Repo Issue 分類、沒有 AutoClip Repo 資料的推測排序，或未經明確許可就建立 Issue／升級 Project 狀態。
- **Host／Command**：AutoClip Repo 中 scripts/feature_signals.py --days 30 --json（只讀）；寫入時依 docs/COMMUNITY_BOARD.md 及 docs/community/issue-body.md，需有受權 GitHub 身分。
- **Inputs**：可讀取的 AutoClip Discussions／Issues、30 天觀察區間與實際來源連結；已有 status:* Issue 和 Project 狀態；若要求寫入，需人員明確指定操作與狀態欄位
- **Outputs**：主題分群、重複需求、熱度證據／未知數、排序與建議欄位（唯讀）；僅在授權後建立或更新的 GitHub Issue／Project 狀態與回覆討論之連結
- **Execution**：擷取真實訊號（以 feature_signals.py --days 30 --json 彙整（具權限時），沒有資料不可編造票數） → 人工語意分類與查重（用語意分群需求，對照現有 status:* Issue，將 Q&A／Bug 排除） → 提出排序建議（區分 Exploring／Researching 候選與較後階段；僅建議不寫入） → 取得授權再更新（人員說明『開 Issue』或指定『放進某欄』後才按模板寫入；Shipped 以發版說明為準）。
- **Risk**：外部寫入與聲譽：GitHub Issue、Project 與 Discussions 是持久公開副作用，沒有明確人員許可不能寫。；來源證據：不得捏造投票數或需求規模；腳本的字詞重疊只是提示，需人工核對。；錯誤狀態升級：PR 合併不等於 Shipped，沒有發版說明不可將卡片標示已交付。
- **Acceptance**：每條排序建議能回指討論／Issue 與時間範圍，重複項與 Bug／Q&A 清楚區分；未核准時 GitHub 零寫入；已核准時僅執行指定動作，狀態符合發版證據
- **Verification**：SOURCE DOCUMENTS REVIEWED；EXTERNAL RUNTIME／SECURITY／INDEPENDENT LICENSE／INTEGRATION NOT TESTED。


## Repo 資料與正式站驗收

- Canonical Skills：123 筆；具 `skillGuide`：**123/123**；具 `intakeReview`：**123/123**。
- Review Source Status：`source-checked` 115、`partial` 8。此計數代表**來源審查狀態**，非第三方 Runtime 可用性或授權保證。
- Graph：**569 nodes／1816 edges**；六類 Canonical 數量與原 Tags／Typed Refs 不變。Build、Schema、Graph、Browser、PR CI、正式 Deploy、Live Smoke 的真實結果如下。
### PR #45／main／正式站驗收證據

| Gate | Run ID／結果 |
|---|---|
| [PR Unified Intake](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44916449441) | SUCCESS |
| [PR V2 Data Validate](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44916449471) | SUCCESS |
| [PR P1 Graph／Browser](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44916449427) | SUCCESS |
| [main Unified Intake](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44916530785) | SUCCESS |
| [main Data Validate](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44916530746) | SUCCESS |
| [main Catalog Sync](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44916530745) | SUCCESS |
| [main P1 Graph／Browser](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44916530738) | SUCCESS |
| [Pages Deploy](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44916529919) | SUCCESS，14:57:25Z |
| [Live Pages Smoke Attempt 2](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44916530773) | SUCCESS，14:58:23Z；部署完成**之後** |

- [PR #45](https://github.com/christinekao/AI-Tool-Collection/pull/45) 已 Squash Merge；PR Head `7bd6f4be8c522d77e69bcde18ea0e73bfc5ac590`；main 合併 Commit `a3a4b2ce6651208a61f794bd366915f373ecad57`。
- 14:57:58Z 19/19 GitHub Pages 真實 HTTP／JSON Assets PASS；Chromium 14:58:07–14:58:15Z 通過知識搜尋、Graph、Prompt、Playground、六類 Entity 及 375／430／768／1440px 響應式測試。
- Live Smoke Attempt 1 雖 SUCCESS，但其完成時間 14:57:05Z **早於** Pages Deploy 14:57:25Z；不能用它驗收新版本，已於部署後重跑 Attempt 2 且 SUCCESS。
- **PASS WITH GAPS** 僅適用於此 Repo 的 Canonical 資料、CI、Catalog／Graph 與已部署的 GitHub Pages；不代表第三方 123 Skills 安裝、Runtime、安全、完整 License 或 Integration 已 PASS。
- **Docs-only 最終交接更新將再次觸發 Pages Deploy**。須等該最後版本部署完成後重跑 Live Smoke；最終證據可記在 PR #45 最新留言，避免本文件再次改動引發循環部署。

## Skills 123 筆收尾回歸與缺口追蹤

1. 所有 123 筆已具 Guide／Intake Review；不表示 123 筆上游都 100% 完整。依每筆 `intakeReview.sourceStatus` 和前六批報告保留 PARTIAL、404、資料不足與實際來源不明名單。
2. 原有 `reverse-skill`／`reverse-skill-2` 同源但保留 ID，另開 Dedupe Review；`viral-hook-title` 來源身分 PARTIAL，不得以相似網站冒充。
3. OneTake（PolyForm Noncommercial）、Punk Skill（v2+ 商用書面授權）應保持授權警示；來源 Repo MIT 不代表模型、輸出素材、第三方依賴皆可商用。
4. 外部第三方 Skills 的 Trigger、Functional、Trajectory、Runtime、Security、完整授權、Integration 尚無跨全庫實測。欲稱「可直接安裝使用」，必須另有隔離環境與取得授權後的驗收。

## 後續追蹤

第三方 Skill Runtime／Security／License／Integration 的缺口需獨立研究與受控驗證；8 筆 PARTIAL 來源逐筆回補；同源 ID 另作去重 Review。最後文件更新所觸發的新 Deploy，應於完成後獨立重跑 Live Smoke，證據記於 PR #45 最新留言。
