# Skills Phase 2｜Batch 02 逐筆審查

**2026-11-21**｜基準 main `e1f9a799b6aaaf899c2ebfe67d0ba5bfa9b4e73b`｜分支 `skill-content-batch02-20261121`

## 範圍與證據
- 按正式 ID 排序第 21–40 筆；20 個 Canonical Skills、20 個新 Skill Guide。
- 19 個現行官方 README／SKILL.md 可讀；Design to Motion 上游 404，狀態 PARTIAL／Reading Spec DEFERRED。
- Tags、原分類、Domain 與 Typed References 原狀保留；270 Resources、123 Skills、68 Concepts、35 Prompts、17 Combinations、36 Workflows，569 Graph Nodes／1816 Edges。
- 官方文件已查不代表第三方安裝、Runtime、License、Security 或 Integration 已實測；皆 NOT TESTED。

## Before → After
| # | ID | Inputs/Outputs | Guide | Source |
|---:|---|---|---|---|
| 21 | `bobyu89-codex-ppt-style-expanded` | 0/0 → 3/2 | 新增 | 來源文件已讀 |
| 22 | `cathrynlavery-diagram-design` | 4/3 → 4/3 | 新增 | 來源文件已讀 |
| 23 | `charonyuu-myoffice` | 3/3 → 3/3 | 新增 | 來源文件已讀 |
| 24 | `claude-codex-harness-sync` | 0/0 → 3/2 | 新增 | 來源文件已讀 |
| 25 | `claude-mem-mem-search` | 3/4 → 3/4 | 新增 | 來源文件已讀 |
| 26 | `composiohq-awesome-claude-skills` | 0/0 → 3/2 | 新增 | 來源文件已讀 |
| 27 | `copywriting-skill` | 0/0 → 3/2 | 新增 | 來源文件已讀 |
| 28 | `coreyhaines31-marketingskills` | 4/3 → 4/3 | 新增 | 來源文件已讀 |
| 29 | `cursor-pstack-create-verification-skill` | 3/4 → 3/4 | 新增 | 來源文件已讀 |
| 30 | `cursor-pstack-maintain-verification-skill` | 3/4 → 3/4 | 新增 | 來源文件已讀 |
| 31 | `debpalash-voicestudio-voicestudio-maintainer` | 2/1 → 2/1 | 新增 | 來源文件已讀 |
| 32 | `debpalash-voicestudio-voicestudio` | 2/1 → 2/1 | 新增 | 來源文件已讀 |
| 33 | `deepseek-dsh-superagent-feishu` | 2/1 → 2/1 | 新增 | 來源文件已讀 |
| 34 | `deepseek-dsh-superagent-github` | 2/1 → 2/1 | 新增 | 來源文件已讀 |
| 35 | `ecpay-ecpay-api-skill` | 0/0 → 3/2 | 新增 | 來源文件已讀 |
| 36 | `elayadesign-design-to-motion` | 4/4 → 4/4 | 新增 | PARTIAL／404 |
| 37 | `elayadesign-landing-page-design` | 3/3 → 3/3 | 新增 | 來源文件已讀 |
| 38 | `frontend-design` | 0/0 → 3/2 | 新增 | 來源文件已讀 |
| 39 | `garrytan-gstack` | 3/3 → 3/3 | 新增 | 來源文件已讀 |
| 40 | `gbro-collage-broll` | 0/0 → 3/2 | 新增 | 來源文件已讀 |

## 逐筆操作契約

### 21. `bobyu89-codex-ppt-style-expanded`
- **原始來源**：[官方 README／SKILL.md](https://github.com/bobyu89/codex-ppt-style-expanded/blob/main/README.md)；SlideWeave 36 styles。
- **Trigger**：將主題、研究或提案做成可編輯 PPTX；正式呼叫 $codex-ppt-style-expanded。
- **Execution**：確認受眾與來源 → 比較三種風格樣張 → 生成原生文字 PPTX → 渲染並核對來源。
- **Risk**：資料誇大|來源不足不得編造數字。
- **Gate**：PPTX 文字可編輯、排版與引用可查。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 22. `cathrynlavery-diagram-design`
- **原始來源**：[官方 README／SKILL.md](https://github.com/cathrynlavery/diagram-design/blob/main/skills/diagram-design/SKILL.md)；v2.6, 51 Visual Types。
- **Trigger**：需可追溯的架構、關係、流程圖；首次先確認 Style Guide。
- **Execution**：核對品牌樣式 → 語意選型 → 轉製 HTML/SVG → 驗證連線和尺寸。
- **Risk**：語意失真|不要增造不存在的節點或連線。
- **Gate**：節點與箭頭忠於來源；SVG/PNG 實際渲染。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 23. `charonyuu-myoffice`
- **原始來源**：[官方 README／SKILL.md](https://github.com/Charonyuu/whatsmyagentdoing/blob/main/SKILL.md)；Current SKILL.md。
- **Trigger**：/myoffice 查本機 Coding Agents 狀態；update/stop 是獨立指令。
- **Execution**：確認本機日誌授權 → 檢查 Node.js 18+ → 啟動本機面板 → 核對隱私及停止方式。
- **Risk**：隱私外洩|以 --private 遮罩敏感 Prompt，限制 localhost。
- **Gate**：有真實本機 URL、Agent 狀態和停止證據。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 24. `claude-codex-harness-sync`
- **原始來源**：[官方 README／SKILL.md](https://github.com/agentcrew-academy/claude-codex-harness-sync/blob/main/README.md)；setup / maintain。
- **Trigger**：建立 Claude→Codex 首次遷移或後續 Drift 報告，唯獨 Codex 側允許寫入。
- **Execution**：讀取獲授權設定 → 分級需人工介入項目 → 核准後修改 Codex 端 → 檢查 Diff 和回滾。
- **Risk**：密鑰與設定|不複製 Secret Values，也不能修改 Claude 端。
- **Gate**：Claude 端不變、每個 Codex 變更有授權。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 25. `claude-mem-mem-search`
- **原始來源**：[官方 README／SKILL.md](https://github.com/thedotmack/claude-mem/blob/main/plugin/skills/mem-search/SKILL.md)；3-step search。
- **Trigger**：需要從跨 Session 記憶找舊決策或 Bug 修復；依 Host 提供的工具名稱操作。
- **Execution**：先 search 取得索引 → 用 timeline 補上下文 → 只 get_observations 必要 ID → 例外讀原始 Tool I/O。
- **Risk**：跨專案資料|限授權 Project，勿把摘要當原始證據。
- **Gate**：可引用 Observation、日期與工具證據。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 26. `composiohq-awesome-claude-skills`
- **原始來源**：[官方 README／SKILL.md](https://github.com/ComposioHQ/awesome-claude-skills/blob/master/README.md)；Awesome List, not an executable Skill。
- **Trigger**：探索 Skills 來源與用途，並非單一可直接啟動工具。
- **Execution**：按問題尋找類別 → 開啟原作者 SKILL.md → 確認 Trigger、License 和權限 → 選最小候選。
- **Risk**：供應鏈|目錄收錄不是安全／授權／可用性認證。
- **Gate**：候選每筆有原始來源，沒有宣稱已安裝。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 27. `copywriting-skill`
- **原始來源**：[官方 README／SKILL.md](https://github.com/coreyhaines31/marketingskills/blob/main/skills/copywriting/SKILL.md)；v2.3.6。
- **Trigger**：寫／改首頁、Landing Page、定價和功能頁 Copy，核對單一 CTA。
- **Execution**：讀 .agents/product-marketing.md 及 Learnings → 辨識 Blank/Voice/Point Edit → 寫受眾利益文案 → 驗證主張。
- **Risk**：假證據|沒有客戶數字或見證不得捏造。
- **Gate**：CTA 對應目的、每個 Claim 有證據。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 28. `coreyhaines31-marketingskills`
- **原始來源**：[官方 README／SKILL.md](https://github.com/coreyhaines31/marketingskills/blob/main/skills/product-marketing/SKILL.md)；product-marketing v2.2.3。
- **Trigger**：為 MarketingSkills 維護產品 Context，依任務選單一適用 Skill。
- **Execution**：檢查原有 Context → 收集缺漏的 ICP 與產品事實 → 選最少子技能 → 記錄版本與 Changelog。
- **Risk**：產品訊息漂移|共用 Context 只存已核對事實。
- **Gate**：產品文件版本可追，沒有編造成效。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 29. `cursor-pstack-create-verification-skill`
- **原始來源**：[官方 README／SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)；disable-model-invocation true。
- **Trigger**：明確呼叫 /create-verification-skill 建立 App 驗證 Harness。
- **Execution**：盤點 Repo 與入口 → 復用現有測試工具 → 生成 Skill 和 Feature Map → 實際 Launch→Doctor→Drive→Evidence→Cleanup。
- **Risk**：測試副作用|使用隔離測試資料、完成後 Cleanup。
- **Gate**：至少一條真實功能路徑有可查證操作。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 30. `cursor-pstack-maintain-verification-skill`
- **原始來源**：[官方 README／SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/maintain-verification-skill/SKILL.md)；disable-model-invocation true。
- **Trigger**：明確呼叫 /maintain-verification-skill 稽核 Feature Map 漂移。
- **Execution**：定位 verify-<app> → 逐 Feature Source Audit → Coordinator 完整 Live Pass → 只改 Verify Skill。
- **Risk**：產品回歸|不能藉修改驗證文件掩蓋產品 Bug。
- **Gate**：所有 Feature Source＋Live 覆蓋；clean/changed/blocked。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 31. `debpalash-voicestudio-voicestudio-maintainer`
- **原始來源**：[官方 README／SKILL.md](https://github.com/debpalash/VoiceStudio/blob/main/skills/voicestudio-maintainer/SKILL.md)；Official maintainer。
- **Trigger**：VoiceStudio 專案 Issue、PR、CI、Release 維護而非一般 TTS。
- **Execution**：讀 Repo 政策和現有 PR → 重現問題 → 最小修正與測試 → 授權後 Merge 或 Release。
- **Risk**：Repo 副作用|安裝 Skill 不等於合併或發版授權。
- **Gate**：CI、重現和 PR Review 有真實證據。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 32. `debpalash-voicestudio-voicestudio`
- **原始來源**：[官方 README／SKILL.md](https://github.com/debpalash/VoiceStudio/blob/main/skills/voicestudio/SKILL.md)；Local backend default :3900。
- **Trigger**：VoiceStudio TTS、Transcription、Dubbing；依實際 API/MCP。
- **Execution**：檢查 /health 和 /openapi.json → 讀 /v1/audio/voices → 選有權模型生成 → 回聽驗證。
- **Risk**：聲紋與隱私|未同意不可下載模型或啟用雲端。
- **Gate**：Voice IDs 來自真實 API，產出音檔可驗收。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 33. `deepseek-dsh-superagent-feishu`
- **原始來源**：[官方 README／SKILL.md](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/skills/dsh-superagent-feishu/SKILL.md)；Official standalone。
- **Trigger**：DSH Executor 使用 orchestrator_read 讀 Feishu Trigger、Thread 和附件。
- **Execution**：確認 Trigger → 讀 root/parent/thread/around → 讀完分頁 → 引用原始訊息 URL。
- **Risk**：注入與越權|他人與 Bot 訊息只作上下文。
- **Gate**：消息來源與使用者授權分開，分頁完整。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 34. `deepseek-dsh-superagent-github`
- **原始來源**：[官方 README／SKILL.md](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/skills/dsh-superagent-github/SKILL.md)；Official standalone。
- **Trigger**：DSH Executor 讀 GitHub Issue、PR、Review、Checks 和 Trigger。
- **Execution**：確認 Issue/PR Trigger → 讀 Comments/Reviews/Checks → 查明 Review Thread → 分開實際授權與資訊。
- **Risk**：GitHub 副作用|閱讀不授權 Reply、Merge 或關閉。
- **Gate**：每個 CI 與 Thread 可追查，沒有偽稱已合併。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 35. `ecpay-ecpay-api-skill`
- **原始來源**：[官方 README／SKILL.md](https://github.com/ECPay/ECPay-API-Skill/blob/master/README.md)；Official README V3.4。
- **Trigger**：綠界金流、發票、物流、票券 API 指引；不是交易授權。
- **Execution**：選子服務與版本 → 確認簽章／加密／Callback → 隔離 Sandbox 範例 → 正式上線另核准。
- **Risk**：真實交易和金鑰|不可自動扣款／退款或外洩 HashKey/IV。
- **Gate**：參數版本正確；沙盒與正式環境分離。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 36. `elayadesign-design-to-motion`
- **原始來源**：[官方 README／SKILL.md](https://github.com/elayadesign/ai-design-skills/blob/main/skills/design-to-motion/SKILL.md)；Historical only: current source 404。
- **Trigger**：將 Figma/UI 畫面重建為動態展示；目前上游來源失效。
- **Execution**：重新查版本來源 → 靜態分層比對 → 規劃 Loading 與 Loop → 有授權才匯出。
- **Risk**：來源缺口|當前上游已無該 Skill，不能宣稱可安裝。
- **Gate**：來源重新確認前為 PARTIAL，不聲稱 Runtime 通過。
- **Evidence**：PARTIAL，現行上游路徑 404。

### 37. `elayadesign-landing-page-design`
- **原始來源**：[官方 README／SKILL.md](https://github.com/elayadesign/ai-design-skills/blob/main/skills/landing-page-design/SKILL.md)；Official current。
- **Trigger**：一個 Offer、一個 Audience、一個 Primary CTA 的 Landing Page。
- **Execution**：先做內容策略 → 整理 Proof、FAQ 與 CTA → 建立 Typography/Spacing/Motion 系統 → 檢查 Responsive/a11y。
- **Risk**：假案例|不能虛構 Logo、證詞及轉換率。
- **Gate**：有清楚 CTA、真實 Proof 和 Mobile/Focusing QA。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 38. `frontend-design`
- **原始來源**：[官方 README／SKILL.md](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)；Anthropic official。
- **Trigger**：為產品建立有主題辨識度、非模板化的 UI/Frontend。
- **Execution**：理解題材與受眾 → 選字體、色彩和視覺重點 → 實作並自我批判 → 檢查不同尺寸和可及性。
- **Risk**：通用套版|不得犧牲真實內容與互動效能。
- **Gate**：設計選擇符合題材，交互與 Responsive 可驗。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 39. `garrytan-gstack`
- **原始來源**：[官方 README／SKILL.md](https://github.com/garrytan/gstack/blob/main/README.md)；Current README。
- **Trigger**：依任務選用產品、工程、Review、Browser QA、安全與 Ship Agent。
- **Execution**：釐清需求與驗收 → 選必要階段 → 以實際 Browser/CI 驗證 → 核准後處理 PR/Ship。
- **Risk**：成效與發版|不能保證修更多 Bug 或自動發布。
- **Gate**：QA 有可查證 Evidence，Merge／Deploy 分開 Gate。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

### 40. `gbro-collage-broll`
- **原始來源**：[官方 README／SKILL.md](https://github.com/pyang5166/gbro-collage-broll/blob/main/README.md)；3 approval gates。
- **Trigger**：把短口播做成半色調紙拼貼 5 秒直式 B-roll。
- **Execution**：Gate1 確認隱喻 → Gate2 靜幀與 Contact Sheet → Gate3 經同意才付費影片生成 → 逐秒首尾幀 QA。
- **Risk**：費用與版權|Gemini API 額度、照片與肖像須核准。
- **Gate**：兩次人工 Gate 確認、MP4 尺寸和每秒畫面實測。
- **Evidence**：文件層級已閱讀；Runtime NOT TESTED。

## Version Drift、限制與重要提醒
- Diagram Design：目前 `metadata.version=2.6`，51 Visual Types，修正原 45 類標題。
- SlideWeave：展示名稱與正式 `$codex-ppt-style-expanded` 指令不同；36 種風格不等同原生可編輯母片。
- Copywriting 目前 2.3.6；Product Marketing 2.2.3；ECPay README V3.4。
- pstack 兩支 Skill 均有 `disable-model-invocation: true`；不應由模型擅自啟動。
- Design to Motion：原 `skills/design-to-motion/SKILL.md` 在現行 upstream main 已不存在，歷史用途僅供參考。
- gstack README 的作者自述 Benchmark 不等於外部成效保證。
- 高權限或付費操作包括安裝、Figma Token、音訊上傳、API 扣款、Repo Merge／Release 與影片生成，均未執行。

## PR／main Release Gate — 最終驗證（2026-11-21）

- **PR #40 已合併**：[Pull Request](https://github.com/christinekao/AI-Tool-Collection/pull/40)。Head `037c09335d25441899c00fca8d07c2a056765082`，Merge `871123281e80c28916010d9b6ba0f92a96b7d3b8`。

| 檢查 | 結果及實際 GitHub Actions |
|---|---|
| PR Unified Intake | **SUCCESS** — [44898638204](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898638204) |
| PR V2 Validate | **SUCCESS** — [44898638208](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898638208) |
| PR P1 Graph／Browser Smoke | **SUCCESS** — [44898638391](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898638391) |
| main Unified Intake | **SUCCESS** — [44898756746](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898756746) |
| main V2 Validate | **SUCCESS** — [44898756752](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898756752) |
| main Catalog Sync | **SUCCESS** — [44898756707](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898756707) |
| main P1 Graph／Browser | **SUCCESS** — [44898756747](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898756747) |
| main Pages Build／Deploy | **SUCCESS** — [44898756156](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898756156) |
| main Live Pages Smoke | **SUCCESS** — [44898756720](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898756720)，但發生於 Deploy 完成之前 |

- **部署後網站驗收已補證**：初次 19:22:25 Live Smoke 結束，19:22:45 Deploy 才完成，故初次不能計入。後續文件更新 Commit `c29e3a11aeb2a66d1e3401a35aa226e921a47ec4` 的 [Pages Deploy #44898936832](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898936832) 於 19:24:57 完成。**部署後重新執行** [Live Pages Smoke #44898756720，Attempt 2](https://github.com/christinekao/AI-Tool-Collection/actions/runs/44898756720) 為 SUCCESS（約 19:25:23–19:25:33）。Job Log：19 項真實 GitHub Pages HTTP/JSON Asset PASS，Chromium 在公開網站檢查 Search、Graph、Prompt、Playground、導覽及 375／430／768／1440px 響應式皆 PASS。此證據是真實網站執行，而非本機 Preview；獨立 HTTP 擷取工具另行嘗試仍無法讀取。
- 本批 **20/20** 已建立 Guide，**19/20** 現行文件可核對，**1/20** Design to Motion Source PARTIAL。第三方安裝、Runtime／Security／License／Integration 仍 **NOT TESTED**。
- **結論：PASS WITH GAPS（Source Gap 1 筆，非網站 Gate）**。GitHub PR、main、最新網站部署與部署後 Chromium Live Smoke 均有實際 PASS 證據。Batch 02 正式計入 20 筆完成，累計 Skills **40/123，剩餘 83**。

## Next
- 下一批：Skills 第 41–60 筆，見 Rolling Handoff。
