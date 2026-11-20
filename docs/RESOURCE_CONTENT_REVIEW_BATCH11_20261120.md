# Phase 2｜Resources Batch 11 — 官方來源核查與內容補強（2026-11-20）

## 範圍與選取
- 從最新 `main`（起始 commit `b117d42357ca44d8c7a1be7e6c30c05f30647c51`）的 270 Resources 扣除 Batch 01–10 已處理的 200 個不同 ID，再選取 20 個尚未更新過的 Resource。
- 本批來源包括官方 GitHub README、產品官方網站、官方文件與原始文章；不代表已安裝、實際執行或完成資安審核。
- 僅改 `data/resources/<id>.json` 中的實用欄位、官方來源與 `intakeReview`，同步派生 Catalog、Graph，沒有改動分類、原有 Tags、Primary Domain、ID、Typed References 或任何其他 Canonical 類型。
- 原用途、推薦和深入技術細節已充足者不重寫，只增加缺漏的功能、使用前提、限制及當前文件來源。

## 逐筆 Before → After
| # | Canonical ID | Before（舊用途） | After（新用途） | 修改方式 | 官方證據 |
|---:|---|---|---|---|---|
| 1 | `ayueh0102-ronnier-skill` | 色彩科學／色度學 | 將色彩科學與色度學的系統化筆記封裝為 Claude Code／Codex 可閱讀的 Agent Skill，協助理解 CIE 色彩空間、色差計算、量測與光學色彩概念。 | 更新用途、採用情境及功能；補來源、前提、限制及審查契約 | [官方來源](https://github.com/Ayueh0102/Ronnier-skill/blob/main/README.md) |
| 2 | `bencho` | 提供可探索、調整與直接採用的互動 UI blocks，例如 slider、tilt card、command bar、radial menu、drag interaction 等。 | 提供可探索、調整與直接採用的互動 UI blocks，例如 slider、tilt card、command bar、radial menu、drag interaction 等。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://bencho.dev/docs) |
| 3 | `bobyu89-codex-ppt-style-expanded` | Codex 研究／簡報／Proposal workflow | SlideWeave 是面向 Codex 的簡報製作 Skill，從受眾與內容敘事開始，選擇風格範例後產出原生文字可編輯的 PowerPoint，並支援流程圖、研究與教學呈現。 | 更新用途、採用情境及功能；補來源、前提、限制及審查契約 | [官方來源](https://github.com/bobyu89/codex-ppt-style-expanded/blob/main/README.md) |
| 4 | `bruiandy-claude-obsidian` | 原始來源、筆記、provenance、AI knowledge workflow | 透過多個 Agent Skills 在使用者自有的 Obsidian Vault 建立來源保存、相互連結、可溯源問答、筆記檢索及持續維護的知識管理流程。 | 更新用途、採用情境及功能；補來源、前提、限制及審查契約 | [官方來源](https://github.com/bruiandy/claude-obsidian/blob/main/README.md) |
| 5 | `chatcut` | 把自然語言指令轉成真正可編輯的多軌 timeline 操作：可做初剪、刪除停頓與 filler words、文字稿剪輯、字幕、B-roll、AI 影片／圖片／音樂／旁白與 motion graphics。所有變更落在正常 clips、tracks 與 captions 上，而不是只輸出不可修改的模板影片。 | 把自然語言指令轉成真正可編輯的多軌 timeline 操作：可做初剪、刪除停頓與 filler words、文字稿剪輯、字幕、B-roll、AI 影片／圖片／音樂／旁白與 motion graphics。所有變更落在正常 clips、tracks 與 captions 上，而不是只輸出不可修改的模板影片。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://chatcut.io/docs/editor-overview) |
| 6 | `dslab-lessons` | 提供可直接在瀏覽器閱讀的 AI 影音生成簡報教材，包含 ComfyUI × MiniMax H3 的環境準備、節點與工作流概念、文字／圖片／參考素材生成影音、提示詞撰寫、工作流 JSON 下載與成品影片對照，協助學習者從操作實例理解影音生成流程。 | 提供可直接在瀏覽器閱讀的 AI 影音生成簡報教材，包含 ComfyUI × MiniMax H3 的環境準備、節點與工作流概念、文字／圖片／參考素材生成影音、提示詞撰寫、工作流 JSON 下載與成品影片對照，協助學習者從操作實例理解影音生成流程。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://dslab.tw/lesson-h3) |
| 7 | `engineering-leadership-adobe-tech-lead-ai` | 研究 Adobe Tech Lead Navya Agarwal 如何透過需求澄清、心理安全感、決策文件、授權與 AI 輔助工作提升團隊效能。 | 研究 Adobe Tech Lead Navya Agarwal 如何透過需求澄清、心理安全感、決策文件、授權與 AI 輔助工作提升團隊效能。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://newsletter.eng-leadership.com/p/how-adobes-tech-lead-works-and-uses) |
| 8 | `google-stitch` | Prompt / image → UI design | Google Labs 的 AI 設計畫布，從文字、語音、參考圖、既有設計或程式碼探索互動式網站與 App UI，支援設計系統及介面輸出。 | 更新用途、採用情境及功能；補來源、前提、限制及審查契約 | [官方來源](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-updates/) |
| 9 | `herdr-mods-gallery` | 集中探索 Herdr 社群製作的狀態列、資訊面板、Agent 控制與工作流程擴充模組，連結作者的 GitHub 程式碼及 RECIPE.md，協助比較並自行選擇擴充功能。 | 集中探索 Herdr 社群製作的狀態列、資訊面板、Agent 控制與工作流程擴充模組，連結作者的 GitHub 程式碼及 RECIPE.md，協助比較並自行選擇擴充功能。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://herdr.dev/gallery/?type=mods) |
| 10 | `kkkkhazix-khazix-skills` | 多種 AI Skills | 收錄作者使用的多種 Agent Skills，包括工作協調、磁碟整理、AI 資訊查詢、清理、分析及寫作等任務範例。 | 更新用途、採用情境及功能；補來源、前提、限制及審查契約 | [官方來源](https://github.com/KKKKhazix/khazix-skills/blob/main/README.md) |
| 11 | `mukul975-anthropic-cybersecurity-skills` | Cybersecurity Skills | 由社群作者維護的資安 Agent Skills 合集，依 MITRE ATT&CK 等防護框架整理偵測、事件調查、威脅研究與安全分析工作方法。 | 更新用途、採用情境及功能；補來源、前提、限制及審查契約 | [官方來源](https://github.com/mukul975/Anthropic-Cybersecurity-Skills/blob/main/README.md) |
| 12 | `omniroute` | Route requests across AI models and providers, with fallback handling when a model or account reaches its quota limit. | Route requests across AI models and providers, with fallback handling when a model or account reaches its quota limit. | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://www.omniroute.online/features/) |
| 13 | `skillry-web-design-template-skills` | 依網站用途提供可安裝的 SKILL.md 設計工作流程、版面參考與檢查步驟，協助 Claude Code、Codex、Cursor、OpenCode 等 Agent 建立 Landing Page、Portfolio、Dashboard、Website Sections 與可編輯的 HTML。 | 依網站用途提供可安裝的 SKILL.md 設計工作流程、版面參考與檢查步驟，協助 Claude Code、Codex、Cursor、OpenCode 等 Agent 建立 Landing Page、Portfolio、Dashboard、Website Sections 與可編輯的 HTML。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://skillry.dev/skills/use-case/web-design) |
| 14 | `tip31812-ai-usage-bar` | 在 macOS 選單列追蹤 Claude Code 與 Codex 的剩餘用量、額度重置時間、短期／週期視窗、長對話上下文與通知，並依剩餘額度提供工具使用建議。原始專案含 Provider 介面、SwiftUI 介面、Build Script、Hook 與測試工作流，可作為安裝、客製化或重新實作的程式參考。 | 在 macOS 選單列追蹤 Claude Code 與 Codex 的剩餘用量、額度重置時間、短期／週期視窗、長對話上下文與通知，並依剩餘額度提供工具使用建議。原始專案含 Provider 介面、SwiftUI 介面、Build Script、Hook 與測試工作流，可作為安裝、客製化或重新實作的程式參考。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://github.com/tip31812/ai-usage-bar/blob/main/README.md) |
| 15 | `tradingview-pine-screener-strategy-tester` | 透過 TradingView 圖表及市場資料研究股票與 ETF，使用 Stock Screener 初篩；以 Pine Script 自訂 RSI、量能、均線、突破訊號，並透過 Pine Screener 對 Watchlist／支援的指數成分套用自訂指標掃描，最後在 Strategy Tester 以 strategy() 的 Broker Emulator 模擬進出場、交易成本、滑價和回測績效。 | 透過 TradingView 圖表及市場資料研究股票與 ETF，使用 Stock Screener 初篩；以 Pine Script 自訂 RSI、量能、均線、突破訊號，並透過 Pine Screener 對 Watchlist／支援的指數成分套用自訂指標掃描，最後在 Strategy Tester 以 strategy() 的 Broker Emulator 模擬進出場、交易成本、滑價和回測績效。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://www.tradingview.com/support/solutions/43000742436-tradingview-pine-screener-key-features-and-requirements/) |
| 16 | `typesafe-ai-jev` | 將輸入狀態與定型問題變成 Choice、Boolean、Score 和概率評估，適合分類、任務路由、候選評分與確信門檻，而非長篇生成式文字。 | 將輸入狀態與定型問題變成 Choice、Boolean、Score 和概率評估，適合分類、任務路由、候選評分與確信門檻，而非長篇生成式文字。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://vercel.com/changelog/typesafe-ais-jev-1-14-is-now-available-on-ai-gateway) |
| 17 | `vercel-skills-sh` | 提供跨 Claude Code、Codex 等 Agent 的 Skill 搜尋、榜單、來源檢視與 Skill 安裝入口；官方榜單可找到 Matt Pocock 的 grill-me、grill-with-docs、tdd、handoff、triage。 | 提供跨 Claude Code、Codex 等 Agent 的 Skill 搜尋、榜單、來源檢視與 Skill 安裝入口；官方榜單可找到 Matt Pocock 的 grill-me、grill-with-docs、tdd、handoff、triage。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://www.skills.sh/docs) |
| 18 | `vulture-s-whisper-guard` | 降低 Whisper hallucination、改善轉錄 | 為 Whisper／ASR 逐段轉錄結果加入規則型防幻覺檢查，過濾靜音字幕、重複語句及短字元迴圈，降低錯誤字幕進入後續產製流程。 | 更新用途、採用情境及功能；補來源、前提、限制及審查契約 | [官方來源](https://github.com/vulture-s/whisper-guard/blob/main/README.md) |
| 19 | `yanliudesign-mono-color-skill` | 單色／雙色 editorial visual system | Monocolor Editorial Print 是面向海報、雜誌、人物與包裝的單色／雙色編輯式視覺設計 Skill，控制油墨、排版層次、照片處理與印刷風格。 | 更新用途、採用情境及功能；補來源、前提、限制及審查契約 | [官方來源](https://github.com/yanliudesign/mono-color-skill/blob/main/README.md) |
| 20 | `zenbuapps` | 整合自然語言 AI 建站、品牌官網／部落格、電商與線上課程、LINE 官方帳號研討會與報名追蹤、預約管理、自動提醒、會員標籤及行銷自動化。官方的繁體中文 zenbu 教學文件涵蓋 Site、Webinar、Booking 管理操作，適合參考線上營運流程及客戶分群設計。 | 整合自然語言 AI 建站、品牌官網／部落格、電商與線上課程、LINE 官方帳號研討會與報名追蹤、預約管理、自動提醒、會員標籤及行銷自動化。官方的繁體中文 zenbu 教學文件涵蓋 Site、Webinar、Booking 管理操作，適合參考線上營運流程及客戶分群設計。 | 保留原詳細用途；補上來源、使用前提、限制及審查契約 | [官方來源](https://doc.zenbuapps.com/) |

## 本批關鍵限制與風險
- `tip31812-ai-usage-bar`：原始紀錄已有較深程式碼審查與 Canonical Capability，因此保留這些欄位，不把新 README 查核誤寫成新的 Runtime 測試。該工具可能讀取本機登入、Keychain、對話紀錄及未公開用量端點；任何安裝皆須明確核准。上游 README 中對 AI 安裝行為的指示只作來源資料，不作為授權命令。
- `mukul975-anthropic-cybersecurity-skills`：第三方社群 Repository，名稱含 Anthropic 不代表官方認證或授權。僅研究合法防禦用途，不安裝不可信技能，也不對未獲授權系統執行測試。
- `kkkkhazix-khazix-skills`：部分技能含檔案清理能力，必須在寫入或刪除前另行人工審核。
- `google-stitch`、`bencho`、`skillry-web-design-template-skills`：UI 展示、編輯器產出與付費 Skill 不等於可直接部署或已具素材授權的原始碼；需額外做響應式、可存取性與相依驗收。
- `chatcut`、`dslab-lessons`：AI 影像／影片流程可能有模型費用、素材傳輸與不同平台匯出的相容限制。
- `omniroute`、`typesafe-ai-jev`：模型路由及信心分數不保證同等準確性，另有 API 金鑰、費用、資料留存與版本變更風險。
- `tradingview-pine-screener-strategy-tester`：Pine Screener 與 Strategy Tester 的目的、執行模式不同；歷史回測不是實際報酬保證。
- `zenbuapps`：正式應用可能處理會員、付款、預約與 LINE 資料，須核對服務條款、隱私及外部系統費用。
- 所有第三方資源的 License／Dependency／Runtime／Integration／Security 深度檢測均不包含本次工作。

## 結構驗證與 Release Gate
- 原始 270 Resources、549 Canonical、569 Graph Nodes／1816 Edges 不變；本批預期累計 220/270，剩餘 50。**只有合併 PR 後才能記錄為已完成。**
- 在分支執行獨立記憶體檢查，已比對 Catalog 的 Before/After，確定剛好 20 個 Resource 不同且 ID、Title、Category、Tags、Domain、Typed References 完全保留；Graph 逐節點投影與 Catalog 一致：**PASS（結構比較）**。
- 以上並非官方 Node.js 測試；必要 PR CI：Unified Intake Gate、V2 Data Validate、P1 Graph Unit Tests；合併後另查 Catalog Sync、Pages Build and Deployment、Live Pages Smoke。CI 需逐項記錄真實 Run URL，不能使用前批測試結果取代。
- 依 `AGENTS.md` 與 `docs/UNIFIED_INTAKE_POLICY.md` 執行或從 PR CI 查證：
  ```sh
  node scripts/build-v2.mjs
  node --test scripts/test-taxonomy-v1.mjs
  node --test scripts/test-intake-gate.mjs
  node scripts/validate-v2.mjs
  node scripts/check-intake-gate.mjs --base b117d42357ca44d8c7a1be7e6c30c05f30647c51 --head HEAD
  ```

## Session 延續契約
- 本批分支：`resource-content-batch11-20261120`。建立 PR 與完成 CI 後，回寫 `docs/RESOURCE_CONTENT_HANDOFF.md` 的 PR、SHA 與結果；若尚未合併，標示候選進度。
- 後續從未審查的 50 筆中再選 Batch 12；每批 20 筆，包含獨立的逐筆審查報告與 rolling handoff。
