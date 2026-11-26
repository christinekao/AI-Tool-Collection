# Resource 雙層知識 Batch 79｜對話交接、驗收契約與合法來源治理

固定版本局部查核；1 mapped、1 evidence-linked、1 deferred 候選。9 用途、9 局部證據、3 design-only 案例。第三方未實測。

## littlehole2025-token-saver

- mapped；固定版本 hooks/hooks.json、hooks/long-chat-reminder.js、hooks/session-group-reminder.js、skills/handoff/SKILL.md、LICENSE 局部查核；未安裝、執行或實測。
- 上游固定版本：`de0f42d747c1d678cfed4c0a628c13052b181197`。MIT；Claude 桌面工具及資料處理條件另查。
- 用途：依對話上下文用量發出長對話提示，並提供有確認及群組歸屬檢查的接續工作設計。
- 案例：規劃長對話工作交接的提示及狀態驗收；合成對話使用量、Session 名稱及工具事件 → 提示判斷表、交接契約及群組／封存驗收規格 → 自有 AI Cowork 設計工作區，經使用者明確核准後才操作真實 Session。（design-only）。
- 來源證據：
  - 依上下文用量判斷提醒：[LIMIT / STEP / process.stdin.on](https://github.com/littlehole2025/claude-saver/blob/de0f42d747c1d678cfed4c0a628c13052b181197/hooks/long-chat-reminder.js)；程式只從指定 transcript 尾端讀取可解析的 usage 並累加輸入與快取 Token；不等同完整費用統計；本機暫存需檢查權限。
  - 區分新任務與既有任務的交接提示：[HANDOFF_WORDS / RENAME_NOTE / MESSAGES](https://github.com/littlehole2025/claude-saver/blob/de0f42d747c1d678cfed4c0a628c13052b181197/hooks/long-chat-reminder.js)；Hook 僅輸出提示文字，不直接保證開啟新 Session；第三方提示不授權讀取或封存使用者對話。
  - 檢查接續工作群組與封存前置條件：[MESSAGES / process.stdin.on](https://github.com/littlehole2025/claude-saver/blob/de0f42d747c1d678cfed4c0a628c13052b181197/hooks/session-group-reminder.js)；Hook 產出附加提示而非直接執行群組操作；真實 Session 的移動或封存必須有獨立授權及驗收。

## rea

- deferred；固定版本三份驗收文件／Schema 局部查核；核心程式及完整授權未查；未安裝、執行或實測。
- 上游固定版本：`0aca049128687828bddc32e8c4c0a39d7544c1ff`。本批未核對完整授權與相依元件。
- 用途：參考 REA 的證據完整性、錯誤契約及客戶端驗收文件，規劃自有或明確授權軟體的獨立測試；核心實作仍待查核。
- 案例：規劃自有軟體的獨立證據驗收；自有合成測試產物、預期行為及失敗情境 → 驗收證據清單、錯誤分類及客戶端測試矩陣 → 自有測試工作區，不接觸未授權軟體或真實敏感資料。（design-only）。
- 來源證據：
  - 區分待驗證與已驗證的成果：[obligation ledger / retained history](https://github.com/morluto/rea/blob/0aca049128687828bddc32e8c4c0a39d7544c1ff/docs/development/reconstruction-readiness.md)；文件描述完整性條件；未執行驗證器，不能以狀態文字替代實際證據。
  - 分離客戶端註冊與實際整合驗收：[Launch environment verification / End-to-end, integration and golden evidence](https://github.com/morluto/rea/blob/0aca049128687828bddc32e8c4c0a39d7544c1ff/docs/development/client-verification.md)；上游文件中的歷史測試不代表本次測試或所有客戶端相容。
  - 建立結構化錯誤及重試分類：[oneOf / category / retryable / remediation](https://github.com/morluto/rea/blob/0aca049128687828bddc32e8c4c0a39d7544c1ff/docs/error-contract.schema.json)；僅讀取 Schema 局部契約，未核對每個實作錯誤路徑或實際回應。
- 未完成：已讀取固定版本的公開驗收文件及錯誤 Schema，尚未查核其核心實作、全部權限控制或完整授權；不宣稱可重建或可用。
- 下一步：針對自有合成測試產物定位錯誤 Schema 驗證器、證據紀錄與客戶端生命週期的實作及測試；確認適用授權及隔離條件後再升級。

## alsyundawy-microsoft-office-for-macos

- evidence-linked；原第三方 Repo 已封存；固定版本 README 標題及 GitHub 身分已核對，僅萃取來源治理風險；另於 2026-11-26 查閱 Microsoft 官方更新、部署及安裝文件；未安裝、執行或實測。
- 上游固定版本：`06227aaab780fd18763ae39c3eb79bad629db49e`。原第三方索引授權及安裝器來源未驗證；僅使用 Microsoft 官方授權渠道。
- 用途：把已封存的第三方 Office for Mac 索引當成來源治理與授權風險案例；版本核對及正式安裝一律以 Microsoft 文件為準。
- 案例：規劃企業 Mac Office 軟體來源與授權查核；虛構裝置版本、產品版本及合法授權類型 → 官方版本對照、授權核對及來源風險檢查表 → 企業 IT 軟體資產治理流程；不下載或使用第三方安裝器及金鑰。（design-only）。
- 來源證據：
  - 以官方更新歷程核對版本：[Update history for Office for Mac](https://learn.microsoft.com/en-us/officeupdates/update-history-office-for-mac)；封存第三方索引不能當作最新版、完整或官方支援的證據。
  - 查核合法授權及企業部署資格：[Deployment options for admins for Office for Mac](https://learn.microsoft.com/en-us/microsoft-365-apps/mac/deployment-options-for-office-for-mac)；不得採用來源不明序號、非官方授權工具或規避授權；本次未登入管理中心。
  - 核對官方來源與安裝前提：[登入以在 Mac 上下載 Microsoft 365 或 Office 2024](https://support.microsoft.com/zh-tw/office/lifecycle/officeinstall/download-install-or-reinstall-microsoft-365-or-office-2024-on-a-pc-or-mac)；原索引含高風險內容；不轉載第三方下載、金鑰、系統修改或授權繞過步驟。
