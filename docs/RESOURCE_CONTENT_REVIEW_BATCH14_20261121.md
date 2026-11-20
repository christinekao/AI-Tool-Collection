# Phase 2｜Resources Batch 14 — 最後 10 筆來源識別與內容改善（2026-11-21）

## 範圍與結果
- 起始 main SHA：`b332d6ebf768d74a932726a29d791d8e1527997a`；前 13 批已合併 260 個獨立 Resource ID，剩餘 10 筆。
- 本批僅修改這 10 筆既有 Canonical Resource，更新 Generated Catalog／Graph、新增本報告和 rolling Handoff；**沒有新增、移除或合併任何 Entity**。
- 內容查核：**5 筆 source-checked、5 筆 partial（含原 Repo 重導向、來源失效或無唯一身分）**。全部 10 筆皆已檢視並補功能、使用條件、限制及來源／Gap，但 **不代表 10 筆來源全部完成確認**。
- ID、Title、原 Category、原 Tags、Primary Domain、Typed References 不變；資料集仍 270 Resources／549 Canonical／569 Graph Nodes／1816 Edges。
- 第三方 Build／Runtime／Integration／Security／完整 License 審查沒有執行；README 或外站的命令不是授權指示。

## 逐筆 Before → After
| # | ID | Features／Requirements／Limitations：Before → After | 來源辨識結果 | 審查層級 |
|---:|---|---|---|---|
| 1 | `alchaincy-huashu-design` | 0/0/0 → 3/2/2 | 原 ID 將作者拼為 alchaincy；官方 GitHub 帳號為 alchaincyf，補回正確 Repo 入口但保留穩定 ID 與原標題。 | source-checked |
| 2 | `code-graph` | 0/0/0 → 3/2/2 | 此筆是 Code Graph 架構概念而非特定 Repository；以獨立技術說明核對結構定義，不與同名專案混淆。 | source-checked |
| 3 | `codex-router` | 0/0/0 → 3/2/2 | 多個不同作者的 Repo 均使用 Codex Router／Codex Model Router 名稱；原始收藏僅有通用名稱，無法確定作者。 | partial |
| 4 | `irons163-orchestrate-sol-terra-luna` | 0/0/0 → 3/2/2 | 原 irons163/同名路徑目前重新導向 irons163/three-tier-agent-orchestrator（已另有 Canonical），而 mj-siew 也維護同名 Sol/Terra/Luna Repo；來源歸屬不可混為一談。 | partial |
| 5 | `land-book-design-inspiration` | 4/0/0 → 4/2/2 | 已有詳盡的官方授權與來源紀錄；本次不覆蓋有效內容，只補 Requirements／Limitations。 | source-checked |
| 6 | `particles-casberry` | 0/0/0 → 3/2/2 | 官方 AI Particle Simulator by Casberry India；在瀏覽器創作 WebGL 粒子、互動物理和不同格式的匯出。 | source-checked |
| 7 | `punk-skill` | 0/0/0 → 3/2/2 | 原 adrianpunk/Punk-Skill Repo 已指向目前 Punk-Posters；官方說明涵蓋 punk-cover、punk-avatar、punk-ip-video-cover，商用授權有明確限制。 | source-checked |
| 8 | `skillgodak-hgtv` | 0/0/0 → 3/2/2 | 曾有 2026-10-17 README／Release 查核紀錄，但今日原始 SkillGodAk/HGTV 返回 404；找到其他作者同名專案，不視為已確認接續版本。 | partial |
| 9 | `viral-hook-title` | 0/0/0 → 3/2/2 | 原始名稱僅為一般寫作 Skill 短名，未能確認原作者；相關案例支援 Hook／標題產生和排序的工作方法。 | partial |
| 10 | `whisper-ui` | 0/0/0 → 3/2/2 | 原始收藏自註『另一個 Whisper UI 專案』且截圖名稱未確認；公開 GitHub 上至少有多個不同 Whisper UI，不能自動指認特定 Repo。 | partial |

## 逐筆證據、使用前提與限制
### 1. `alchaincy-huashu-design`
- **來源與型態**：[已核查的正式或權威來源](https://github.com/alchaincyf/huashu-design)。
- **來源缺口**：無本次來源身分阻礙；此處僅完成文件層級查核。
- **Requirements**：需在支援 Agent Skills 的 Coding Agent 中核對 SKILL.md、腳本與所需的瀏覽器／輸出工具依賴。；開始前需指定受眾、交付格式、品牌規範及驗收環境；涉及可編輯 PPTX 時需實際開檔驗證。
- **Limitations**：官方 Repo 聲明主程式採 MIT，但所引用的外部圖片、品牌及部分示範素材仍可能另有權利限制。；README 的展示成果不能視為在本專案環境已成功安裝、效能良好或具備正式商用素材授權。
- **風險**：可執行第三方 Skills，安裝前需先檢查腳本與檔案權限。

### 2. `code-graph`
- **來源與型態**：[已核查的正式或權威來源](https://www.qodo.ai/glossary/what-is-a-code-graph/)。
- **來源缺口**：無本次來源身分阻礙；此處僅完成文件層級查核。
- **Requirements**：先明確定義語言、程式碼版本、節點／邊的型別與建圖方式。；對大規模變動及跨 Repo 依賴，需有更新索引的機制和測試／人工比對。
- **Limitations**：靜態分析可能漏掉反射、動態綁定、程式執行期生成的呼叫關係。；結構關係本身不能證明業務意圖或執行正確，也不是特定工具的性能實測。
- **風險**：此筆不是可安裝的 Repo；不要因同名直接與 neoand/codegraph 等產品合併。

### 3. `codex-router`
- **來源與型態**：[身分待確認的歷史來源／候選](https://github.com/alexei-led/codex-router)。
- **來源缺口**：原始收藏僅寫 codex router，無 URL、作者或版本；多個不同 GitHub 專案均符合名稱，尚不能判定哪個為原始來源。
- **Requirements**：先由原始收藏、截圖或作者資訊確認精確的 Repository 及版本，不能直接假設是哪一個。；取得 Router 的模型帳號與 API 設定前，需檢視金鑰處理、費用、資料流與 fallback 策略。
- **Limitations**：原始 Repo 未能識別；連結僅為相似候選，不應作為此筆產品的已查證功能來源。；不同 Codex Router 可能透過代理伺服器或本機攔截請求，存在憑證、成本、資料外傳與相容風險。
- **風險**：原始身分待查；不可直接推薦安裝任一候選或把其功能當作此筆事實。

### 4. `irons163-orchestrate-sol-terra-luna`
- **來源與型態**：[身分待確認的歷史來源／候選](https://github.com/irons163/orchestrate-sol-terra-luna)。
- **來源缺口**：原 irons163/orchestrate-sol-terra-luna URL 已重新導向先前已收錄的 irons163/three-tier-agent-orchestrator；另有 mj-siew 同名 Repo，未有足夠歷史證據釐清原收藏指涉何者及差異。
- **Requirements**：先確認要研究的是 irons163 重導向後的 Three-Tier 實作，或 mj-siew 的獨立同名版本。；實際使用前確認相容 Codex、模型及子代理工具可用，並先約定測試和成本界線。
- **Limitations**：原 URL 已重導向既有 Canonical Resource，存在語意重複風險；未核實先前版本與目前 Repository 的完整譜系。；不同版本的模型名稱、代理設定和效能主張不一定仍適用；不能將文件案例視作實測成本優勢。
- **風險**：潛在重複身分，保留 Canonical ID 和關聯待後續人工判定，這批不合併或刪除。

### 5. `land-book-design-inspiration`
- **來源與型態**：[已核查的正式或權威來源](https://land-book.com/)。
- **來源缺口**：無本次來源身分阻礙；此處僅完成文件層級查核。
- **Requirements**：以人工瀏覽官方 Gallery、篩選用途及視覺方向，保存參考連結而非批次抓取站內素材。；使用付費模板前需另核對模板作者的授權範圍、訂閱條款與實際商用權利。
- **Limitations**：官方條款禁止未經同意的爬蟲擷取、AI 訓練或商業性重用站內內容，展示畫面不代表已取得著作權。；Landing Page 的視覺案例不能替代效能、響應式、可存取性與真實轉換率驗收。
- **風險**：官方網站與第三方作品並非可任意鏡像或下載用於訓練的素材庫。

### 6. `particles-casberry`
- **來源與型態**：[已核查的正式或權威來源](https://particles.casberry.in/)。
- **來源缺口**：無本次來源身分阻礙；此處僅完成文件層級查核。
- **Requirements**：需支援 WebGL2 的現代瀏覽器與足夠的 GPU 資源；大量粒子請在目標裝置評估效能。；使用自訂程式或匯出檔前，檢查外部依賴、素材授權及實際互動行為。
- **Limitations**：官方展示的粒子數量與 FPS 是上游描述，不能當作個人裝置的效能保證。；匯出的程式碼或素材仍需安全、相容與授權審查；本批沒有執行或測量。
- **風險**：使用者貼入的動態公式／第三方程式需在隔離環境檢查。

### 7. `punk-skill`
- **來源與型態**：[已核查的正式或權威來源](https://github.com/adrianpunk/Punk-Posters)。
- **來源缺口**：無本次來源身分阻礙；此處僅完成文件層級查核。
- **Requirements**：依目標平台、內容、視覺風格與比例選擇需要的 Skill，不要將全部安裝視為必要。；若用於公司、客戶、廣告、營利內容或商業工作流，依作者 v2+ 授權先取得書面商業授權；另檢查素材與肖像權。
- **Limitations**：官方 v2.0.0 以後的免費範圍限個人非商用；不能將公開原始碼直接等同 MIT 商用授權。；圖像生成支援的比例有限、成品需人工排版驗收，第三方素材權利不由 Skill 授權涵蓋。
- **風險**：商用需額外書面授權；不能以開源形式誤判免費商用。

### 8. `skillgodak-hgtv`
- **來源與型態**：[身分待確認的歷史來源／候選](https://github.com/SkillGodAk/HGTV)。
- **來源缺口**：原 SkillGodAk/HGTV 現已在 GitHub API 返回 404；既有 2026-10-17 README／Release 快照有歷史證據，但無法本次重新檢查版本，其他作者同名 Repo 不可視為原專案。
- **Requirements**：必須先核實原作者的有效下載頁、Android 版本和 APK 簽章，不從不明鏡像安裝。；使用前需確認設備安全權限、影片來源授權與個資處理方式。
- **Limitations**：原 SkillGodAk/HGTV GitHub Repo 本次查詢為 404；不能把其他作者的同名專案當作已證實的接續。；只有歷史自述與發行資訊，未取得完整程式碼審核或影片授權證據，不能保證安全與合法片源。
- **風險**：禁止不明 APK 安裝與版權未證片源；供 UX 研究而非下載建議。

### 9. `viral-hook-title`
- **來源與型態**：[身分待確認的歷史來源／候選](https://creatorskills.co/create/viral-hook-title-engine)。
- **來源缺口**：原始收藏只有 viral-hook-title 的通用名稱與極簡用途；同名產品或社群 Skill 不只一個，來源頁是相近範例，不足以辨認最初收藏的實作。
- **Requirements**：先提供原文／影片主題、目標受眾、平台、禁止承諾事項和品牌語氣。；比較不同版本需有曝光、點擊或留存等有效測量方式，不能只靠主觀認定。
- **Limitations**：原始 Skill Repo／作者尚未查出；本次參考案例只是同類工作流，不是此 ID 的身分證據。；Hook 成效依演算法、受眾和曝光而變，生成的聳動標題可能失實，需要人工查核。
- **風險**：不以候選範例代替原始 Prompt，嚴防不實標題與版權引用。

### 10. `whisper-ui`
- **來源與型態**：[身分待確認的歷史來源／候選](https://github.com/schnoddelbotz/whisper-ui)。
- **來源缺口**：原收藏記錄『另一個 Whisper UI 專案』、截圖名稱尚未確認，無唯一 URL／Repo／作者；此 GitHub 連結只是一個候選例子。
- **Requirements**：先找回原始截圖、作者或安裝來源，確認選用的 Whisper UI 專案。；以取得授權的測試音檔，核對模型依賴、GPU／CPU 要求、語言及隱私設定。
- **Limitations**：同名專案有 Go/Fyne、Tauri/Svelte、Streamlit 等不同技術實作，不能混寫成單一產品功能。；ASR 會有錯誤及靜音幻覺，需人工校對字幕；本批沒有安裝或測試任一候選。
- **風險**：敏感音檔、模型來源與語音輸出隱私；候選不能視作原專案。


## 關鍵資料誠實性
- `irons163-orchestrate-sol-terra-luna` 舊 URL 目前導向 `irons163-three-tier-agent-orchestrator` 的 Repo；另有 `mj-siew` 同名實作。**保留兩筆 Canonical、不以未證實的關係刪除任何資料**，後續另做 Dedupe Review。
- `skillgodak-hgtv` 原始 Repo 查詢返回 404；其他作者同名 HGTV **不能證明是延續版本**。
- `codex-router`、`viral-hook-title`、`whisper-ui` 只有類別描述或名稱，候選連結不能視為原始來源。此批標記 partial、保留來源缺口，未將相似 Repo 冒充原作者。
- `code-graph` 原本就是概念型 Resource 而非某個特定可安裝 Repo；保留現有身份與 Concept 參照。
- `punk-skill` 原網址已指向 Punk-Posters；官方 v2+ 是個人非商用免費、商用需事先書面授權。不要誤判公開 GitHub 即可自由商用。

## 結構與 Release Gate
- 僅 10 個不同 Canonical ID 有內容變更，且原有分類、Tags、Title、Domain、References 不變；Graph Edge 不增減。
- PR 必須檢查最新 Head 的 Unified Intake Gate、V2 Data Validate、P1 Graph Tests；CI PASS 後才能 Merge。
- Merge 後另獨立核對 main Push、V2 Catalog Sync、Pages Build／Deploy、Live Smoke；注意 Smoke 是否早於實際 Deploy。
- **進度定義**：若 PR 合併成功，Resources **內容審查作業**到達 270/270；其中 partial 的來源仍保留待補，不可寫成全庫 270 筆都完成來源驗證或第三方實測。

## 下階段交接
- 工作分支：`resource-content-batch14-20261121`，起始 SHA `b332d6ebf768d74a932726a29d791d8e1527997a`。
- 合併後依已定順序啟動 **Skills（123 筆）品質改善**，再處理 Prompts（35）、Concepts（68）、Workflows／Combinations。Skills 先比對 Trigger／Input／Execution／Output／Risk／Gate，但須用真實來源，不強迫缺證據項目標 PASS。
