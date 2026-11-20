# Phase 2｜Resources Batch 10 — 20 筆官方來源與內容改善（2026-11-20）

## 交付摘要
- 先核對 `main` 的 [Session Handoff](RESOURCE_CONTENT_HANDOFF.md) 與前九批；選出 **20 個尚未在 Batch 01–09 更新過的 Resource ID**。工作基準 SHA：`3a17bff37776b2b462ace7625c09fde7360ca0df`。
- 在 `resource-content-batch10-20261120` 分支逐筆修改 `data/resources/<id>.json`，再將派生 `data/catalog-v2.json` 與 `data/knowledge-graph-v1.json` 同步。沒有改動 Tag Index／Manifest（原始 Tags 與 ID 沒變）。
- 每筆依可閱讀之上游 README 或官方產品／技術頁補：功能、採用建議、至少 2 個前提、至少 2 個限制、來源及 `intakeReview`。若原用途與推薦已充足，則原文保留，不用較短摘要取代。
- 來源查核日期：2026-11-20；**Source Reviewed 不等於安裝、Runtime、Security、Integration 或 License 全面測試。**
- 所有 ID、Entity Type、Category、原始 Tags、既有 Typed References、Domain 及其他五類實體原樣保留；零新增 Tag、Capability、Graph Edge、Entity。

## 20 筆 Before → After 與官方證據

| # | Canonical ID | Before（原用途） | After（改善後用途） | 本批處理方式 | 來源 |
| ---: | --- | --- | --- | --- | --- |
| 1 | `abi-screenshot-to-code` | Screenshot → React / HTML / Tailwind 等 | 把畫面截圖、Figma 版型或網站操作錄影轉成可修改的 HTML、React、Vue 等前端程式碼，供原型重建與 UI 實作參考。 | 改善用途及使用情境；補功能、前提、限制與審查證據 | [官方來源](https://github.com/abi/screenshot-to-code/blob/main/README.md) |
| 2 | `acheaisuiyimen-ache-life-to-comic-skill` | 長期資料累積、source preservation、內容衍生 | 把持續提供的日常文字、照片、會議筆記與長文整理成可續寫的月份漫畫手帳，保存原始內容並產出分頁、封面及可分享的閱讀成果。 | 改善用途及使用情境；補功能、前提、限制與審查證據 | [官方來源](https://github.com/acheAIsuiyimen/ache-life-to-comic-skill/blob/main/README.md) |
| 3 | `anthropic-solving-code-review-at-anthropic` | 整理 Anthropic Claude Code 團隊在大量 Agent 生成 PR 情境下的多層品質管線：變更前自動驗證、fresh-context Agent Diff Review、每 PR AI／安全審查、Lint／Typecheck／跨平台 CI、依變更風險分級的人工核准、commit-bound approval、Merge Queue、Feature Flags 與快速回滾；並以 incidents/reverts 建立 reviewer eval set、以人工耗時與事故率評估流程效果。 | 整理 Anthropic Claude Code 團隊在大量 Agent 生成 PR 情境下的多層品質管線：變更前自動驗證、fresh-context Agent Diff Review、每 PR AI／安全審查、Lint／Typecheck／跨平台 CI、依變更風險分級的人工核准、commit-bound approval、Merge Queue、Feature Flags 與快速回滾；並以 incidents/reverts 建立 reviewer eval set、以人工耗時與事故率評估流程效果。 | 保留原本用途；補功能、使用前提、限制與 Intake Review | [官方來源](https://claude.dev/blog/solving-code-review-at-anthropic/) |
| 4 | `april-zhu-minicharts` | 把使用者提供的 CSV、Excel、試算表內容或數值，轉化成與主題相關的手繪互動圖表；使用真實數值比例呈現派餅、長條、Treemap 等視覺形式，適合敘事、解說與可互動的前端展示。 | 把使用者提供的 CSV、Excel、試算表內容或數值，轉化成與主題相關的手繪互動圖表；使用真實數值比例呈現派餅、長條、Treemap 等視覺形式，適合敘事、解說與可互動的前端展示。 | 保留原本用途；補功能、使用前提、限制與 Intake Review | [官方來源](https://april-zhu.com/minicharts) |
| 5 | `arrow-2` | QuiverAI 的向量設計模型，可從文字或圖片生成精確、可編輯的 SVG，並支援 vectorization、editing 與 animation 工作流；可透過 App、API、MCP、Codex/Cursor plugins 與 CLI 整合到 Agent 流程。 | QuiverAI 的向量設計模型，可從文字或圖片生成精確、可編輯的 SVG，並支援 vectorization、editing 與 animation 工作流；可透過 App、API、MCP、Codex/Cursor plugins 與 CLI 整合到 Agent 流程。 | 保留原本用途；補功能、使用前提、限制與 Intake Review | [官方來源](https://quiver.ai/) |
| 6 | `brandonhimpfen-awesome-finance` | 彙整金融領域的工具、資料來源、服務與學習參考，涵蓋金融市場與商品、個人理財、企業財務、FinTech／支付、銀行基礎設施、風險管理、會計與財務報導、金融資料 API、分析工具、金融法規及教育資源。 | 彙整金融領域的工具、資料來源、服務與學習參考，涵蓋金融市場與商品、個人理財、企業財務、FinTech／支付、銀行基礎設施、風險管理、會計與財務報導、金融資料 API、分析工具、金融法規及教育資源。 | 保留原本用途；補功能、使用前提、限制與 Intake Review | [官方來源](https://github.com/brandonhimpfen/awesome-finance/blob/main/README.md) |
| 7 | `cloudflare-cloudflare-os` | Gatekeeper、Agent credential isolation | 以 Cloudflare Workers 提供企業情境的 Agent 工作區：讓 Agent 使用公司知識、建立與分享小型 Gadgets，並透過 Gatekeepers 管理外部系統能力與核准邊界。 | 改善用途及使用情境；補功能、前提、限制與審查證據 | [官方來源](https://github.com/cloudflare/cloudflare-os/blob/main/README.md) |
| 8 | `codebase-index` | 大型 codebase indexing，協助 Agent 找相關程式 | 在本機為程式碼建立可查詢的符號與依賴索引，幫助 Coding Agent 以檔案行號證據搜尋實作、追蹤呼叫路徑與預估修改影響。 | 改善用途及使用情境；補功能、前提、限制與審查證據 | [官方來源](https://github.com/denfry/codebase-index/blob/main/README.md) |
| 9 | `cyyeh-agent-loop-visualizer` | 以左側對話介面與右側 Step-by-Step 迴圈圖，展示 Coding/Tool-using Agent 的「Context → LLM Token Generation → Tool Call Parsing / Schema Validation → Harness Approval / Execution → Tool Result → Next Context → Stop」完整流程；可在本機切換 Gemma 4 E2B 與 Qwen3.5 0.8B，檢視 Prompt/Tool Schema、逐 Token Probability/Rank/Top-k/Top-p、特殊 Token、Prefill 和解碼速率，以及 14 階段程式碼說明。 | 以左側對話介面與右側 Step-by-Step 迴圈圖，展示 Coding/Tool-using Agent 的「Context → LLM Token Generation → Tool Call Parsing / Schema Validation → Harness Approval / Execution → Tool Result → Next Context → Stop」完整流程；可在本機切換 Gemma 4 E2B 與 Qwen3.5 0.8B，檢視 Prompt/Tool Schema、逐 Token Probability/Rank/Top-k/Top-p、特殊 Token、Prefill 和解碼速率，以及 14 階段程式碼說明。 | 保留原本用途；補功能、使用前提、限制與 Intake Review | [官方來源](https://github.com/cyyeh/agent-loop-visualizer) |
| 10 | `ecpay-ecpay-api-skill` | API documentation → Agent 可用整合知識 | 綠界官方提供給 Coding Agent 的 API 整合知識 Skill，涵蓋金流、物流、電子發票、加解密、Callback 驗證、錯誤排查及上線檢查。 | 改善用途及使用情境；補功能、前提、限制與審查證據 | [官方來源](https://github.com/ECPay/ECPay-API-Skill/blob/master/README.md) |
| 11 | `gbro-collage-broll` | 文稿 → B-roll / collage | 將約 5 秒口播文案轉化為半調紙拼貼風格的直式 B-roll 動畫，透過視覺隱喻、靜幀與影片三道人工核准關卡控制生成。 | 改善用途及使用情境；補功能、前提、限制與審查證據 | [官方來源](https://github.com/pyang5166/gbro-collage-broll/blob/main/README.md) |
| 12 | `gbro-cover-design` | 社群封面 | Agent Skill 讀取文章後以三輪詢問整理主題、構圖與風格，輸出可複製的 3:4 直式封面生成提示詞與標題建議。 | 改善用途及使用情境；補功能、前提、限制與審查證據 | [官方來源](https://github.com/pyang5166/gbro-cover-design/blob/main/README.md) |
| 13 | `hesreallyhim-awesome-claude-code` | Claude Code 生態資源 | 社群維護的 Claude Code 工具與學習資源索引，整理官方文件、Agent Skills、Hooks、Plugins、工作流、工具和安全相關參考。 | 改善用途及使用情境；補功能、前提、限制與審查證據 | [官方來源](https://github.com/hesreallyhim/awesome-claude-code/blob/main/README.md) |
| 14 | `irons163-three-tier-agent-orchestrator` | 三層 Agent coordinator / worker routing 架構 | 將 Coding Agent 任務分成主協調者、視覺／操作子任務與可重複執行工作，由主線程負責目標、派工、整合與驗收的 Codex Skill。 | 改善用途及使用情境；補功能、前提、限制與審查證據 | [官方來源](https://github.com/irons163/three-tier-agent-orchestrator/blob/main/README.md) |
| 15 | `landing-love` | 以完整頁面錄影保存 landing page 的 scroll、hover、loading、3D 與 motion 行為，讓動態設計參考不只停留在靜態截圖。 | 以完整頁面錄影保存 landing page 的 scroll、hover、loading、3D 與 motion 行為，讓動態設計參考不只停留在靜態截圖。 | 保留原本用途；補功能、使用前提、限制與 Intake Review | [官方來源](https://www.landing.love/) |
| 16 | `openai-codex-security` | 檢查 GitHub 或本機程式碼庫中的潛在漏洞，結合專案特定 Threat Model、攻擊路徑分析、隔離驗證與供人員審核的修補建議。 | 檢查 GitHub 或本機程式碼庫中的潛在漏洞，結合專案特定 Threat Model、攻擊路徑分析、隔離驗證與供人員審核的修補建議。 | 保留原本用途；補功能、使用前提、限制與 Intake Review | [官方來源](https://help.openai.com/en/articles/20001107-codex-security) |
| 17 | `pythonanywhere` | 直接透過瀏覽器使用雲端 Python 開發環境、Bash Console、檔案編輯與 Web App Hosting，不必在本機安裝完整開發工具。可用於小型 Python 網頁應用的程式碼修改、部署、重新載入與逐輪檢查；也可搭配 ChatGPT／Claude 等 AI 產生的程式碼做人工整合。 | 直接透過瀏覽器使用雲端 Python 開發環境、Bash Console、檔案編輯與 Web App Hosting，不必在本機安裝完整開發工具。可用於小型 Python 網頁應用的程式碼修改、部署、重新載入與逐輪檢查；也可搭配 ChatGPT／Claude 等 AI 產生的程式碼做人工整合。 | 保留原本用途；補功能、使用前提、限制與 Intake Review | [官方來源](https://www.pythonanywhere.com/) |
| 18 | `rive` | 設計 production-ready 的互動式向量動畫，透過 State Machine 把 animation 與互動邏輯帶進 Web、React、Flutter、iOS、Android、Unity 等 runtime。 | 設計 production-ready 的互動式向量動畫，透過 State Machine 把 animation 與互動邏輯帶進 Web、React、Flutter、iOS、Android、Unity 等 runtime。 | 保留原本用途；補功能、使用前提、限制與 Intake Review | [官方來源](https://rive.app/) |
| 19 | `vercel-ai-gateway` | 在 Vercel 的單一 Gateway 使用不同供應商的模型、BYOK、Provider Routing/Fallback、API Key/OIDC、統一計費與使用統計；截圖中 Needle 的 Jev 呼叫即透過此 Gateway。 | 在 Vercel 的單一 Gateway 使用不同供應商的模型、BYOK、Provider Routing/Fallback、API Key/OIDC、統一計費與使用統計；截圖中 Needle 的 Jev 呼叫即透過此 Gateway。 | 保留原本用途；補功能、使用前提、限制與 Intake Review | [官方來源](https://vercel.com/docs/ai-gateway/models-and-providers/provider-options) |
| 20 | `voltagent-awesome-openclaw-skills` | OpenClaw Skills 索引 | 從 OpenClaw 社群技能登錄來源整理並分類大量第三方 Skills 的資源索引，可按任務類型查找候選技能與原始連結。 | 改善用途及使用情境；補功能、前提、限制與審查證據 | [官方來源](https://github.com/VoltAgent/awesome-openclaw-skills/blob/main/README.md) |

## 風險與未驗證範圍
- **OpenClaw Skills 索引、Awesome Claude Code、Agent Skills：** 上游清單是入口，不是第三方工具的安全／授權背書。不得自動安裝或以清單收錄推斷可信任。
- **ECPay：** 付款協定、回呼及加解密需依最新官方 API 逐項比對；需測試帳號、商家資格、憑證與正式上線核准。
- **Cloudflare OS：** Gatekeeper 是作者描述的能力控制設計，未對企業部署／授權流程做滲透測試。本機 Quick Start 不等於正式環境。
- **Screenshot-to-Code、B-roll、QuiverAI、Vercel Gateway、PythonAnywhere：** 可能依賴外部 API／帳號與計費；沒有提交任何私人 API Key 或對外上傳使用者資料。
- **Codex Security：** 官方頁與說明文件已核對，實際可用方案、掃描權限及費用仍以產品現況為準；不等於第三方安全驗證。
- **Rive、Minicharts、Landing Love：** 設計／圖表／動畫內容可能牽涉平台授權、素材版權及可存取性；沒有下載或執行 Skill 或資產。
- **Agent Loop Visualizer：** Repo 入口重新導向／版本可能變更；保留原始深入敘述，但沒有重新下載模型或檢查逐 Token 解碼實際結果。
- **所有 Repo：** 未逐檔審查第三方原始碼或相依漏洞，亦未執行外部服務；深度 `repoGuide`、可組裝的 Capability I/O 契約均標為待完成。

## 驗收與可回查證據
- 執行前基準：180 / 270 Resources（Batch 01–09），Batch 10 20 筆更新後目標累計 200 / 270、剩餘 70。
- 本批已做**記憶體中獨立一致性檢查**：比較原本與更新後 Catalog，僅 20 個不同 Resource；549 Canonical 總數及 270 Resource 不變。逐項比較不可變欄位，重建 270 Resource 的 Graph Node 投影後比對，結果 **PASS**（20 / 20，Graph 569 nodes／1816 edges）。這是資料結構檢查，不是 Node.js 正式測試。
- 正式 Release Gate 需由 PR 的 `Unified Intake Gate`、`V2 Data Validate`、`P1 Graph Unit Tests` 完成並有可核對的 GitHub Actions Run。尚未得到 CI 結果前不可寫 PASS。
- 應在本批 PR 上執行或由 CI 檢查：
  ```sh
  node scripts/build-v2.mjs
  node --test scripts/test-taxonomy-v1.mjs
  node --test scripts/test-intake-gate.mjs
  node scripts/validate-v2.mjs
  node scripts/check-intake-gate.mjs --base 3a17bff37776b2b462ace7625c09fde7360ca0df --head HEAD
  ```
- **GitHub Pages 部署與 Live Smoke** 必須在合併後以新 `main` SHA 另行核對，不能沿用 Batch 09／PR #33 結果。

## 給下一個 Session 的接手點
1. 先閱讀 [最新 Session Handoff](RESOURCE_CONTENT_HANDOFF.md)，取得當前 `main`、PR 與新 SHA；確定本批 CI 與部署 Gate 真實結果。
2. **只有合併 Batch 10 後**才將累計標為 200 / 270，並從剩下的 70 個未審查 Resources 選 Batch 11 的 20 個 ID。
3. 繼續保留既有詳細材料、來源權限與限制；不要因某一個原始 README 不可讀而用推測資訊覆蓋。

## 合併後正式 Release Gate（2026-11-20）

- **PR #34：已合併**：https://github.com/christinekao/AI-Tool-Collection/pull/34
- Batch 10 內容合併 SHA：`597fb894c528cb976e6bb6641e2fce895712ecce`；20 個 Resource 的正式 main 進度更新為 **200 / 270，剩餘 70**。
- PR 最新 Head `bdf290169b7be33b064d82e864cae85295ee77e1`：
  - [Unified Intake Gate — SUCCESS](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44698970866)
  - [V2 Data Validate — SUCCESS](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44698970842)
  - [P1 Graph Unit Tests — SUCCESS](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44698970837)
- 合併後原內容 SHA `597fb894...` 的主分支驗證：
  - [Unified Intake Gate — SUCCESS](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44699148380)
  - [V2 Data Validate — SUCCESS](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44699148369)
  - [V2 Catalog Sync — SUCCESS](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44699148381)
  - [Pages Build & Deployment — SUCCESS](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44699147433)
  - [Live Pages Smoke — SUCCESS](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44699148327)
- 上述 PASS 僅證明本專案的 CI、派生資料與公開頁面 Gate；**第三方工具 Runtime、Security、License、Integration 仍為 NOT TESTED**。
