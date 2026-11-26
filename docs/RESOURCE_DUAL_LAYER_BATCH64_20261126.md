# Resource 雙層知識 Batch 64｜風險閘道與工具執行邊界

固定版本局部查核；原分類領域、Tags、關聯保留。文件型資源校正 Content Format 並留存原分類。未執行第三方工具。

## anti-gambling-trader-tw

- 固定版本 `fc6d6f4b52b91e11f7606c1567b0f26b9fe76103`；授權：MIT；mapped
- 用途：交易紀錄可靠性指標、損益兩平假設與反詐檢核。
- 案例：規劃交易紀錄可信度與反詐證據稽核；合成交易紀錄及虛構推廣文案 → 可靠性標記、兩平假設及風險提醒 → 離線金融素養與資料稽核，經資料權利與人工覆核後使用。
- 來源證據：
  - 辨識績效指標的資料前提：[core/metrics/performance.py](https://github.com/mars-tw/anti-gambling-trader-tw/blob/fc6d6f4b52b91e11f7606c1567b0f26b9fe76103/core/metrics/performance.py)（PerformanceMetrics / as_dict）；欄位定義不證明資料有效；缺少前提應標示不可計算。
  - 核對損益兩平的假設：[core/metrics/breakeven.py](https://github.com/mars-tw/anti-gambling-trader-tw/blob/fc6d6f4b52b91e11f7606c1567b0f26b9fe76103/core/metrics/breakeven.py)（compute_break_even）；依樣本及固定條件計算，不代表未來勝率或實際投資建議。
  - 整理反詐風險警訊：[core/antiscam/checklist.py](https://github.com/mars-tw/anti-gambling-trader-tw/blob/fc6d6f4b52b91e11f7606c1567b0f26b9fe76103/core/antiscam/checklist.py)（CHECK_ITEMS / ScamCheckResult / evaluate）；非經校準的機率；須核對官方監管資訊。

## jakeschincariol-day-trader-skill

- 固定版本 `3d0f4ef6986f4984b7c6bd46f7ff4f87744c3abd`；授權：MIT；mapped
- 用途：日內交易工具組的離線提案、風險檢查與歷史重播；不作下單或投資推薦。
- 案例：規劃合成交易提案的風險與回放測試；虛構計畫、限制與歷史合成資料 → 提案拒絕原因、風險檢查及回放限制 → 離線風險控制測試環境，經資料權利與人工覆核後使用。
- 來源證據：
  - 檢查提案與限制的輸入契約：[trader-budget/size.py](https://github.com/Jakeschincariol/day-trader-skill/blob/3d0f4ef6986f4984b7c6bd46f7ff4f87744c3abd/trader-budget/size.py)（size_trade / run_plan）；只研究提案與拒絕行為；不產生真實下單，停損不能保證實際損失上限。
  - 區分風險審查與實際執行：[trader-risk/check.py](https://github.com/Jakeschincariol/day-trader-skill/blob/3d0f4ef6986f4984b7c6bd46f7ff4f87744c3abd/trader-risk/check.py)（check / fingerprint）；審查通過不是獲利保證或交易授權；不連接券商。
  - 辨識歷史回放的資料篩選：[trader-timemachine/timemachine.py](https://github.com/Jakeschincariol/day-trader-skill/blob/3d0f4ef6986f4984b7c6bd46f7ff4f87744c3abd/trader-timemachine/timemachine.py)（full_sessions / build_pool）；排除短時段及缺漏樣本；回放僅模擬，非真實機率或預測。

## pomerado-pomerado

- 固定版本 `a4dfda15b151eb05c905255ccf77a69541df2957`；授權：MIT；第三方元件另有條款；mapped
- 用途：網站 MCP 整合的執行環境說明、敏感資訊遮蔽政策及工具輸入驗證。
- 案例：規劃已授權網站整合的安全邊界驗收；自有測試站點、合成工具參數及虛構敏感值 → 環境限制、遮蔽檢核及參數驗證規格 → 隔離的網站整合測試環境，經資料權利與人工覆核後使用。
- 來源證據：
  - 辨識執行環境的權限邊界：[typescript/src/guardian/execution-policy.ts](https://github.com/Pomerado/pomerado/blob/a4dfda15b151eb05c905255ccf77a69541df2957/typescript/src/guardian/execution-policy.ts)（nativeExecutionEnvironment / guardianExecutionPolicy）；本機 worker 非隔離安全沙箱；政策文字不是強制隔離證明；僅限已授權站點。
  - 核對敏感值遮蔽政策：[typescript/src/privacy/credential-policy.ts](https://github.com/Pomerado/pomerado/blob/a4dfda15b151eb05c905255ccf77a69541df2957/typescript/src/privacy/credential-policy.ts)（credentialPolicy / isCredentialAssignmentKey）；規則可能漏辨識，不能保證完全去識別；不用真實憑證測試。
  - 驗證工具輸入的結構：[typescript/src/mcp/schema.ts](https://github.com/Pomerado/pomerado/blob/a4dfda15b151eb05c905255ccf77a69541df2957/typescript/src/mcp/schema.ts)（standard）；結構驗證不等同權限審查；不執行網站或寫入操作。
