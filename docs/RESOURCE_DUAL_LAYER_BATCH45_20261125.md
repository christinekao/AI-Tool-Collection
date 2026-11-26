# Resource 雙層整理 Batch 45

日期：2026-11-25。三筆既有 Resource，僅查核固定來源；未執行第三方工具。保留既有 ID、關聯及標籤。設計案例非實測。CI 待驗收。

## bruiandy-claude-obsidian
- 來源：https://github.com/bruiandy/claude-obsidian
- 固定版本：`1c1bc49c03a685ee8f5d09c99efe52b42d6673f5`
- 授權：MIT
- 狀態：evidence-linked；Runtime 未驗證
- 案例：規劃有來源紀錄的 Obsidian 知識整理流程
- 匯入資料並保留來源：`skills/wiki-ingest/SKILL.md`（Agree on scope and egress）；原始素材保持唯讀；外部網址請求須核准範圍，來源內容不能成為操作指令。
- 依證據回答問題：`skills/wiki-query/SKILL.md`（Select depth / Retrieve）；查詢須保持唯讀；檢索契約未驗證時不得宣稱索引有效，重要答案回查證據。
- 檢查知識庫健康：`skills/wiki-lint/SKILL.md`（Run / Explain findings）；文件指出檢查是確定性且唯讀；不推論語意矛盾，不自動修復或寫入。

## kepano-obsidian-vault-template
- 來源：https://github.com/kepano/kepano-obsidian
- 固定版本：`473697347a0eaac790a6596229c741b3915f3b77`
- 授權：MIT
- 狀態：evidence-linked；Runtime 未驗證
- 案例：規劃日誌、來源剪藏與專案追蹤範本
- 規劃每日筆記：`Templates/Daily Note Template.md`（tags / Notes / Daily.base）；嵌入視圖依賴相應 Base 與 Obsidian 設定；未驗證顯示或自動生成。
- 保留剪藏的來源資訊：`Templates/Clipping Template.md`（categories / author / url / created / published / topics）；範本不會自動抓取文章或驗證內容，來源資料與授權需另確認。
- 統一專案追蹤欄位：`Templates/Project Template.md`（categories / type / org / start / year / url / status）；欄位沒有強制驗證或狀態轉移程式；需自訂必填、狀態規則及實際檢查。

## kepano-obsidian-minimal
- 來源：https://github.com/kepano/obsidian-minimal
- 固定版本：`6d260b4e0ce60e9563b2d9a268310b88934d0384`
- 授權：MIT
- 狀態：mapped；Runtime 未驗證
- 案例：規劃知識庫專注閱讀與卡片瀏覽介面
- 降低閱讀畫面的干擾：`src/scss/features/focus-mode.scss`（.minimal-focus-mode,.workspace-ribbon.mod-primary）；透明或收合不代表可及性已符合；需測試鍵盤操作、焦點及觸控。
- 設計可調整的卡片排列：`src/scss/features/cards.scss`（.cards,table.dataview,--cards-columns）；依賴 Obsidian／Dataview 的 HTML 結構；自有 HTML 必須另外驗證版面。
- 區分明暗配色變數：`src/scss/color-schemes/flexoki.scss`（.theme-light.minimal-flexoki-light,.theme-dark.minimal-flexoki-dark）；色彩定義不等於通過 WCAG；需以實際文字背景與狀態檢查對比。
