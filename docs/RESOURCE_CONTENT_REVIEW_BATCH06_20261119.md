# Resources Batch 06 — Content Source Review（2026-11-19）

## 執行範圍
- 已逐筆查核 20 個正式 GitHub README，補充實際功能、使用前提與限制。保留既有正確的 `purpose`、`recommendation`，不為統一樣式而機械重寫。
- 每筆加入 `intakeReview` 記錄官方來源、重複／Tag／Capability／Concept 盤點與真實驗證狀態。
- 保留全部 270 Resources／549 Canonical、原始 Tags、分類、ID、Typed References；僅更新 Canonical 20 筆、派生 Catalog／Graph、本報告。
- 未執行第三方安裝、Build、Runtime、Integration、Security Test 或逐行原始碼稽核；來源查核不等於已實測。
- 原有 `openchatx` 與 `openmontage` 的 README API 回傳轉址而非正文，本批未假設已查核，優先選擇來源可讀的 20 筆。

## Before → After
下表格式依序為「功能／使用條件／限制」筆數：

| # | Resource | Before→After | 補上的主要限制／風險 | 官方來源 |
|---:|---|---|---|---|
| 1 | `michael-denyer-pstack-claude` | 0/0/0→2/2/2 | 不同 Host 的支援與 Session Hook 行為不一致；跨 Provider 請求與外部模型可能涉及成本、Context 和資料出站 | [README](https://github.com/michael-denyer/pstack-claude/blob/main/README.md) |
| 2 | `nanako0129-syrtis` | 0/0/0→2/2/2 | 用量與配額顯示取決於上游 Log 格式及 Provider 限制；本機 Session Log 可能包含敏感專案活動，應限制讀取與分享 | [README](https://github.com/Nanako0129/syrtis/blob/main/README.md) |
| 3 | `oh-my-mermaid` | 0/0/0→2/2/2 | 自動生成的架構關係仍需依真實 Code Review 驗證；層次圖可能省略執行時依賴或動態呼叫關係 | [README](https://github.com/oh-my-mermaid/oh-my-mermaid/blob/main/README.md) |
| 4 | `onetake` | 0/0/0→2/2/2 | 採 PolyForm Noncommercial 1.0.0，未另取得授權不得商用；連續效果與最終影片品質需逐畫格檢查，不是已實測保證 | [README](https://github.com/feitangyuan/onetake/blob/main/README.md) |
| 5 | `onyx` | 0/0/0→2/2/2 | Community Edition 與 Enterprise Edition 的功能和授權不同；檢索來源授權及使用者群組權限不當可能洩露內部資料 | [README](https://github.com/onyx-dot-app/onyx/blob/main/README.md) |
| 6 | `openhands-agent-canvas` | 0/0/0→2/2/2 | README 警告不使用 Sandbox 時 Agent 可完整存取本機檔案系統；多 Agent 外部工具與遠端 Backend 仍需認證、審計及資料隔離 | [README](https://github.com/OpenHands/OpenHands/blob/main/README.md) |
| 7 | `orca` | 0/0/0→2/2/2 | README 提醒 macOS Homebrew 必須使用完整套件名稱，裸 orca 指向另一軟體；平行 Agent 會增加權限、模型成本與 Merge 衝突風險 | [README](https://github.com/stablyai/orca/blob/main/README.md) |
| 8 | `paperclip` | 0/0/0→2/2/2 | Agent 可自動呼叫第三方工具與工作排程，需防止越權及無止境循環；官方功能清單不等於已驗證的安全性或完整企業合規 | [README](https://github.com/paperclipai/paperclip/blob/main/README.md) |
| 9 | `photo-riso-poster` | 0/0/0→2/2/2 | 生成海報不保證與原圖完全一致；原始照片及生成圖片須分別遵循平台政策和肖像／著作權 | [README](https://github.com/luckdvr/photo-riso-poster/blob/main/README.md) |
| 10 | `pii-guard` | 0/0/0→2/2/2 | 自動個資偵測有漏報風險，人工檢查不能省略；加強模式需要本機模型和平台依賴，Windows 部分功能會安全拒絕 | [README](https://github.com/danyuchn/pii-guard/blob/main/README.md) |
| 11 | `pomerado-pomerado` | 0/0/0→2/2/2 | README 指出 Integration Run 不會自動重新審核 Authority 和原始碼修改；登入憑證及跨站操作可能有外送、條款及重大副作用風險 | [README](https://github.com/Pomerado/pomerado/blob/main/README.md) |
| 12 | `pramoddutta-botskills` | 0/0/0→2/2/2 | 目錄中的 Bot 設定不代表已在目標環境執行成功；外部 Bot 權限、資料輸入與發布內容仍需個別審查 | [README](https://github.com/PramodDutta/botskills/blob/main/README.md) |
| 13 | `qingyuna-answer-me-with-html` | 0/0/0→2/2/2 | 作者列出的 Token 節省屬其測試樣本結果，不能保證相同模型都有效；生成的圖文教材仍需校驗事實、引用、互動和行動版可讀性 | [README](https://github.com/QingYunA/answer-me-with-html/blob/main/README.md) |
| 14 | `r0x0r-pywebview` | 0/0/0→2/2/2 | WebView 的引擎能力和系統依賴因 OS 而異；JavaScript 與 Python Bridge 需限制非預期內容存取本機資源 | [README](https://github.com/r0x0r/pywebview/blob/main/README.md) |
| 15 | `rea` | 0/0/0→2/2/2 | 動態或反編譯結果可能不完整，需要用獨立測試驗證行為；逆向工程應遵守智慧財產、軟體授權與目標平台法律限制 | [README](https://github.com/morluto/rea/blob/main/README.md) |
| 16 | `research-to-diagram` | 0/0/0→2/2/2 | Web Search 結果可能偏誤或過時，圖示不能取代原始來源；自動排版可能遺漏關係或錯置階層，需人工核對 | [README](https://github.com/wshuyi/research-to-diagram/blob/main/README.md) |
| 17 | `reverse-skill-2` | 0/0/0→2/2/2 | 資安工具具有高權限與雙重用途，不得用於未授權目標；上游路由測試覆蓋率不是實際滲透測試或安全保證 | [README](https://github.com/zhaoxuya520/reverse-skill/blob/main/README.md) |
| 18 | `rociiu-talorys` | 0/0/0→2/2/2 | 雖在個人 Cloudflare 帳戶執行，外部模型與搜尋仍可能產生資料外送及費用；授權／持久儲存與備份須自行管理 | [README](https://github.com/rociiu/talorys/blob/main/README.md) |
| 19 | `ryanhanwu-how-to-ask-questions-the-smart-way` | 0/0/0→2/2/2 | 這是溝通／問題診斷參考，不是會自動修復程式的工具；建議需依團隊文化及問題情境適度調整 | [README](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README.md) |
| 20 | `seokwoooo-lucian-uxui-prompt` | 0/0/0→2/2/2 | 範例 UI 片段不等於適用所有技術框架的正式元件庫；導入後需檢查鍵盤、響應式、效能及視覺一致性 | [README](https://github.com/Seokwoooo/lucian-uxui-prompt/blob/main/README.md) |

## 需特別留意
- `onetake`：PolyForm Noncommercial 1.0.0，不能視為允許商業使用。
- `openhands-agent-canvas`：無 Sandbox 的本機 Agent 可能完整存取電腦檔案。
- `pomerado-pomerado`：網站登入及寫入 Integration 有憑證、授權與副作用風險。
- `pii-guard`：個資遮罩需人工補標與還原測試，防止漏報。
- `onyx`：Community／Enterprise Edition 的功能與授權不同。
- `paperclip`：多 Agent 權限、預算上限及人工批准需另外配置。
- `rea`、`reverse-skill-2`：僅適用自有或授權分析目標。

## Release Gate
- 20 個不同 Resource ID；Graph 569 節點及既有所有 Graph Edge 完全保留。
- PR 需 Unified Intake Gate、V2 Data Validate、P1 Graph Unit Tests PASS；合併後需監測 Catalog、Pages Deployment、Live Smoke。
- 第三方 License／Runtime／Security 真實驗證仍屬未完成範圍。
