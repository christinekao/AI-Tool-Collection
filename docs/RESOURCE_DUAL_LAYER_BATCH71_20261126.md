# Resource 雙層知識 Batch 71｜本機 Agent 執行、程式索引與職缺資料

固定版本局部查核；保留原始用途、分類領域、Tags 與關聯。未實測第三方工具。

## openchatx

- 固定版本 `99d013263bd8bdda7abbce9b28ca0ad0e7f55b67`；授權：MIT；mapped
- 用途：本機 Agent 工作流的載入去重、程序環境過濾及 Session 上下文計量。
- 案例：規劃本機 Agent 的 Session 隔離與資源計量驗收；合成 Agent 識別、載入鍵、環境變數及計量 → 載入重用狀態、過濾欄位及上下文計量規格 → 自有 Agent 執行測試工作區，經資料權利及人工覆核後使用。
- 來源證據：
  - 依 Agent 識別去重載入：[src/agent/load-deduper.ts](https://github.com/WealthyV/openchatx-mcp/blob/99d013263bd8bdda7abbce9b28ca0ad0e7f55b67/src/agent/load-deduper.ts)（createAgentLoadDeduper / loadOnce）；沒有識別不去重，失敗會清除重試；不保證底層資料隔離。
  - 過濾指定內部環境欄位：[src/child-environment.ts](https://github.com/WealthyV/openchatx-mcp/blob/99d013263bd8bdda7abbce9b28ca0ad0e7f55b67/src/child-environment.ts)（INTERNAL_ENV_KEYS / childProcessEnvironment / childStringEnvironment）；只處理指定清單，不能視為全面秘密清除；禁止真實憑證測試。
  - 限制上下文警示門檻輸入：[src/mcp/context-budget.ts](https://github.com/WealthyV/openchatx-mcp/blob/99d013263bd8bdda7abbce9b28ca0ad0e7f55b67/src/mcp/context-budget.ts)（ContextBudgetGuard / setWarningThreshold / initialize）；警示與實際模型上下文上限不同；未測計量準確或寫入復原。

## rankupgames-spectra

- 固定版本 `13eb96d8df7c4f2f94714e4a07c7a1443c97e3e9`；授權：MIT；mapped
- 用途：本機程式碼索引與 Agent 上下文供應工具；本次聚焦證據交付、Git Hook 同步及 Python 語法分類。
- 案例：規劃本機程式碼索引的增量證據與同步驗收；合成程式、版本快照及 Git Hook 測試資料 → 證據交付規格、Hook 變更及語法關聯 → 自有程式碼知識庫測試區，經資料權利及人工覆核後使用。
- 來源證據：
  - 區分完整與增量證據交付：[crates/spectra-cli/src/context_state.rs](https://github.com/rankupgames/Spectra/blob/13eb96d8df7c4f2f94714e4a07c7a1443c97e3e9/crates/spectra-cli/src/context_state.rs)（deliver / DeliveryRequest / DeliveryResult）；無來源時回退完整交付；未實測節省量或資料一致性。
  - 用標記區塊管理 Git Hook：[crates/spectra-cli/src/git_sync.rs](https://github.com/rankupgames/Spectra/blob/13eb96d8df7c4f2f94714e4a07c7a1443c97e3e9/crates/spectra-cli/src/git_sync.rs)（install / remove / HOOKS）；涉及檔案修改，需明確核准與備份；未在任何本機 repo 安裝。
  - 由 Python 語法節點辨識符號關聯：[crates/spectra-core/src/adapters/python.rs](https://github.com/rankupgames/Spectra/blob/13eb96d8df7c4f2f94714e4a07c7a1443c97e3e9/crates/spectra-core/src/adapters/python.rs)（PythonAdapter / classify / relations）；語法分析不是完整執行期呼叫圖；需驗證動態 import 與解析錯誤。

## strelov1-freehire

- 固定版本 `70422c2fcec8460785c6ddd20f1a399fcc2d470b`；授權：MIT；職缺資料權利另查；mapped
- 用途：職缺搜尋系統的企業名稱正規化、職稱清理與查詢參數契約。
- 案例：規劃自有職缺追蹤系統的搜尋與資料正規化；虛構公司名稱、職稱與搜尋參數 → 清理結果、企業合併候選及忽略參數提示 → 自有職缺管理資料庫測試區，經資料權利及人工覆核後使用。
- 來源證據：
  - 正規化企業名稱以產生候選：[internal/dict/normalize/company.go](https://github.com/strelov1/freehire/blob/70422c2fcec8460785c6ddd20f1a399fcc2d470b/internal/dict/normalize/company.go)（CompanySlug / legalSuffixes / trimTail）；可能誤合併不同企業，需人工確認；不是公司真實性驗證。
  - 清理影響搜尋的不可見字元：[internal/dict/normalize/title.go](https://github.com/strelov1/freehire/blob/70422c2fcec8460785c6ddd20f1a399fcc2d470b/internal/dict/normalize/title.go)（CleanTitle / isFormat）；零寬空格轉成空格；語言語意與多語顯示仍須核對。
  - 區分可讀取與忽略的搜尋參數：[internal/api/handler/search_params.go](https://github.com/strelov1/freehire/blob/70422c2fcec8460785c6ddd20f1a399fcc2d470b/internal/api/handler/search_params.go)（jobSearchParams / ignoredParams）；前端需呈現忽略原因；未查職缺即時性或實際搜尋結果。
