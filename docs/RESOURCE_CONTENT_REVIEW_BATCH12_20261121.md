# Phase 2｜Resources Batch 12 — 20 筆來源查核與內容補強（2026-11-21）

## 範圍與來源
- Base main：`21f4226e04f7eb4f1e1841d6436749c820b7dce4`。以 PR #23–#30、#32、#34、#35 實際檔名排除已處理的 220 個不同 Resource ID，再從剩餘 50 筆挑選 20 筆。
- 20 筆皆有原始作者／產品官方頁／原始教學文章可讀來源；查核層級為 **Source Reviewed（文件層級）**。第三方 Build、Runtime、Security、License、Integration **沒有實測**。
- 僅更新既有 Canonical Resource 的 Features、Requirements、Limitations、Source、Intake Review 及必要的 Content Format，保留有效原有用途、詳盡的備註、ID、Title、Category、Raw Tags、Primary Domain、所有 Typed References／Capabilities。
- 不新增或刪除 Resource／Skill／Prompt／Concept／Workflow／Combination；Catalog、Graph 僅依 Canonical 同步投影。沒有新增 Tag、Graph Edge。

## 逐筆 Before → After
欄位數字為 **功能 / 使用前提 / 限制**。若原功能已有完整內容，保留原文，不強制改寫。

| # | Canonical ID | Before | After | 這次補強的重點 | 實際閱讀來源 |
|---:|---|---|---|---|---|
| 1 | `ai-code-acceptance-review-testing-rollout-guide` | 0/0/0 | 3/2/2 | 需求驗收、差異審查、上線及回復條件 | [來源](https://www.aiposthub.com/ai-code-acceptance-review-testing-rollout-guide/) |
| 2 | `better-me-notes-amie` | 0/0/0 | 3/2/2 | 作者文章、訂閱門檻及研究限制 | [來源](https://bettermenotes.substack.com/about) |
| 3 | `citypulso-pulsoicon` | 7/0/3 | 7/2/5 | 框架依賴、品牌授權及官方 GitHub 轉址 | [來源](https://github.com/CityPulso/PulsoIcon) |
| 4 | `fomofly-ai` | 0/0/0 | 3/2/2 | 長影片拆短片、人工複核與上傳隱私 | [來源](https://www.fomofly.ai/) |
| 5 | `higgsfield-ai` | 0/0/0 | 3/2/2 | 創作功能、費用與資料／素材權利 | [來源](https://higgsfield.ai/) |
| 6 | `hkuds-vimax` | 0/0/0 | 3/2/2 | Idea2Video／Script2Video、多模型 API 成本 | [來源](https://github.com/HKUDS/ViMax) |
| 7 | `ibkr-portfolioanalyst` | 0/0/0 | 3/2/2 | 績效報表、CSV 匯出與個資處理 | [來源](https://www.interactivebrokers.com/en/whyib/reporting.php) |
| 8 | `inspora` | 0/0/0 | 3/2/2 | 跨媒介設計搜尋、作品授權 | [來源](https://www.inspora.design/) |
| 9 | `kepano-obsidian-vault-template` | 4/0/3 | 4/2/5 | Vault 模板使用與資料匯入風險 | [來源](https://github.com/kepano/kepano-obsidian) |
| 10 | `letswrite-buzz-self-hosted-relay-guide` | 0/0/0 | 3/2/2 | Relay／Docker 操作前提與第三方教學更新 | [來源](https://www.letswrite.tw/buzz-install/) |
| 11 | `maxibestof` | 0/0/0 | 3/2/2 | 依網站領域與風格篩選 Portfolio、SaaS、品牌、電商和編輯式網站案例。 | [來源](https://maxibestof.one/) |
| 12 | `meigen-ai` | 0/0/0 | 3/2/2 | 提供圖片、影片、海報、品牌等類別的公開 AI Prompt Gallery。 | [來源](https://www.meigen.ai/) |
| 13 | `minimax-code` | 0/0/0 | 3/2/2 | 提供以任務為中心的 MiniMax Code Web 工作區與模型選擇入口。 | [來源](https://agent.minimax.io/) |
| 14 | `minimax-m3-1-flash` | 0/0/0 | 3/2/2 | 官方宣稱 M3.1 Flash 適合 Coding Agent、多步驟任務與視覺理解。 | [來源](https://agent.minimax.io/tools/m3.1-flash) |
| 15 | `motionsites-ai` | 0/0/0 | 3/2/2 | 提供針對 Landing Page、Dashboard、Hero、3D、Portfolio 等主題的網站設計 Prompt。 | [來源](https://motionsites.ai/) |
| 16 | `openchatx` | 0/0/0 | 3/2/2 | 透過 MCP Tunnel 讓 ChatGPT 連到使用者授權的本機工具、檔案與 Shell。 | [來源](https://github.com/XiaoPuOuO/openchatx-mcp) |
| 17 | `openmontage` | 0/0/0 | 3/2/2 | 提供多種影片 Pipeline，例如教學解說、短片再利用、在地化配音、訪談及 Screen Demo。 | [來源](https://github.com/calesthio/OpenMontage) |
| 18 | `recraft` | 0/0/0 | 3/2/2 | 提供品牌、插畫、攝影風格等 AI 影像生成入口與設計用途範例。 | [來源](https://www.recraft.ai/) |
| 19 | `remove-bg` | 0/0/0 | 3/2/2 | 透過網頁上傳圖片，自動移除背景並輸出透明背景或替換背景的素材。 | [來源](https://www.remove.bg/) |
| 20 | `sona-orbit-parroting` | 6/0/0 | 6/2/2 | 在 Mac 使用本機語音辨識輸入文字，並以詞典修正人名與專業術語。 | [來源](https://sona-orbit.github.io/parroting/) |

## 內容與風險驗收
- 原始 270 Resources／549 Canonical，Graph 569 Nodes／1816 Edges；分支預期仍不變。共 20 個不同 ID；原始 Tags、Category、Primary Domain 與 Typed References 保留。
- 官方 Repository 轉址：PulsoIcon → `CityPulso/PulsoIcon-Package`；OpenChatX → `WealthyV/openchatx-mcp`；OpenMontage → `OpenMontageInc/OpenMontage`。Canonical 原有連結未擅自覆蓋，來源仍可追蹤轉址。
- 安全重點：OpenChatX 具 Shell／本機高權限；Buzz Relay 涉及自架與環境憑證；ViMax／OpenMontage／Higgsfield 涉及影音素材、模型 API 費用與授權；IBKR 匯出含敏感交易資訊；Parroting 的本機辨識與外部改寫有不同資料傳輸邊界。
- Source Reviewed 不代表產品功能逐項可運作、第三方套件可信、商業授權通過，亦不表示任何帳戶或第三方工具已登入、安裝或執行。

## 驗證與 Release Gate
- Canonical 差異與 Graph Projection 需核對：只改上述 20 個 Resource，無 Graph Edge／Tag／Typed Reference 變動；派生 `data/catalog-v2.json` 與 `data/knowledge-graph-v1.json`。
- 必要 CI（以 PR 最新 Head 為準）：Unified Intake Gate、V2 Data Validate、P1 Graph Unit Tests。
- 當前建立階段 **CI／PR／合併／Pages 尚待實際查證，不能預先寫 PASS**。
- 合併後另查 main Push、Catalog Sync、Pages、Live Pages Smoke，將每項實際 Run URL 回填最新 Handoff。
- 第三方 Runtime、License、Security／Integration：**NOT TESTED**。

## Session Handoff
- 分支：`resource-content-batch12-20261121`，以 `21f4226e...` main HEAD 為基準。
- 本批完成 20 個 Candidate，只有 PR 合併且相應驗收通過後，正式數量才可從 **220 / 270** 改為 **240 / 270**；剩餘預期從 50 變 30。
- 下一批 Batch 13 需排除 Batch 01–12 共 240 個不同 ID，從剩餘 30 筆選 20 筆，並另外保存獨立報告與 rolling handoff。
