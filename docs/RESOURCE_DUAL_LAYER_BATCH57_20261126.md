# Resource 雙層知識 Batch 57｜前端設計、元件與本機協作

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。

## madebypan-figcc

- 固定版本 `49ea5c744ad8e104e139776cb9a51a4a2fc17eac`；授權：MIT
- 用途：透過本機 Bridge 連接 Figma 與 Coding Agent；本次聚焦選取內容摘要、設定保存與授權寫入的驗收契約。
- 案例：規劃自有設計畫布的選取內容與權限驗收；合成畫布節點、測試設定及明確核准的工作區 → 選取摘要、設定結果及受限寫入驗收紀錄 → 自有設計工作區，經資料權利與人工覆核後使用。
- 來源證據：
  - 限制選取內容及預覽：[src/code.ts](https://github.com/madebypan/FigCC/blob/49ea5c744ad8e104e139776cb9a51a4a2fc17eac/src/code.ts)（buildSelectionContext / scheduleSelectionContext）；上限與匯出失敗不代表去識別化；舊版本回傳被忽略，資料外送須獨立核准。
  - 讀取本機執行設定：[src/code.ts](https://github.com/madebypan/FigCC/blob/49ea5c744ad8e104e139776cb9a51a4a2fc17eac/src/code.ts)（getSettings / DEFAULT_SETTINGS）；預設唯讀是初始配置而非完整安全保證；不得將 Token 寫入共享資料。
  - 以實際檔案核對受限寫入：[scripts/smoke-permissions.js](https://github.com/madebypan/FigCC/blob/49ea5c744ad8e104e139776cb9a51a4a2fc17eac/scripts/smoke-permissions.js)（finish / send）；此為作者的實際寫入 smoke 測試程式，非已取得測試證據；禁止直接操作真實畫布或帳號。

## lawpowen-ui-design-codex-bundle

- 固定版本 `b690c1b52f5809fa999fa8c3e085132fa4bcd3d4`；授權：根 MIT；第三方 Skills 另有授權
- 用途：整合 Codex 設計技能與設計資料搜尋；本次聚焦檢索輸出、資料完整性及非可執行決策規則。
- 案例：規劃設計知識庫的資料契約與決策規則驗收；合成設計需求、測試 CSV 及規則 JSON → 檢索輸出、資料錯誤及規則判定 → 自有設計知識庫，經資料權利與人工覆核後使用。
- 來源證據：
  - 整理設計檢索結果：[codex/skills/ui-ux-pro-max/scripts/search.py](https://github.com/lawpowen/agent-skills/blob/b690c1b52f5809fa999fa8c3e085132fa4bcd3d4/codex/skills/ui-ux-pro-max/scripts/search.py)（format_output）；本次只查局部輸出程式與 CLI 文件，未驗證 BM25 相關性及建議品質。
  - 核對設計資料的欄位與識別：[codex/skills/ui-ux-pro-max/scripts/validate_data.py](https://github.com/lawpowen/agent-skills/blob/b690c1b52f5809fa999fa8c3e085132fa4bcd3d4/codex/skills/ui-ux-pro-max/scripts/validate_data.py)（_check_file / _read_rows）；僅在有 No 欄位時檢查該識別的重複；不代表所有資料值正確。
  - 限制設計規則的可接受語法：[codex/skills/ui-ux-pro-max/scripts/reasoning_contract.py](https://github.com/lawpowen/agent-skills/blob/b690c1b52f5809fa999fa8c3e085132fa4bcd3d4/codex/skills/ui-ux-pro-max/scripts/reasoning_contract.py)（parse_decision_rules / _validate_action / apply_decision_rules）；使用允許條件與前綴，規則輸出仍須人工確認，不能替代實際 UI 測試。

## seokwoooo-lucian-uxui-prompt

- 固定版本 `8749838ddc0987a0f7356ba9e2968fe419e7e06a`；授權：MIT
- 用途：提供可試玩的原生前端元件及單檔 Gallery；固定版本 README 已列 480 個元件，本次僅查三個局部契約。
- 案例：規劃互動元件收藏庫的建置與操作驗收；合成元件 HTML、Metadata、操作示範與測試輸入 → 建置問題、互動狀態及驗收案例 → 自有前端設計收藏庫，經資料權利與人工覆核後使用。
- 來源證據：
  - 檢查元件描述及示範資料：[src/build.mjs](https://github.com/Seokwoooo/lucian-uxui-prompt/blob/8749838ddc0987a0f7356ba9e2968fe419e7e06a/src/build.mjs)（EXPECTED / DEMO_OPS / setOf）；固定版本預期 480 個；嚴格與局部建置模式不同，未執行建置及檢查全部元件。
  - 設計需持續確認的示範互動：[src/elements/003-hold-to-confirm.html](https://github.com/Seokwoooo/lucian-uxui-prompt/blob/8749838ddc0987a0f7356ba9e2968fe419e7e06a/src/elements/003-hold-to-confirm.html)（tick / complete / restore）；僅示範 DOM 狀態，沒有真正檔案刪除；持續按住不等於高風險操作授權。
  - 提供輸入長度與限制回饋：[src/elements/028-autogrow-textarea-counter.html](https://github.com/Seokwoooo/lucian-uxui-prompt/blob/8749838ddc0987a0f7356ba9e2968fe419e7e06a/src/elements/028-autogrow-textarea-counter.html)（grow / count）；以 Unicode code point 計數，不一定等於使用者感知字元；送出僅是本機示範，需驗證鍵盤及輔助技術。
