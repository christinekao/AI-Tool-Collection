# Resource 雙層知識 Batch 63｜金融研究的資料品質、成本與證據

固定版本局部查核；原分類領域、Tags、關聯保留。文件型資源校正 Content Format 並留存原分類。未執行第三方工具。

## blave-agent

- 固定版本 `2924d0adab1a7c655f9c32e39900116b0c0e4b52`；授權：Apache-2.0；mapped
- 用途：金融研究工作台的成本假設、損益拆解與匯出程式靜態檢查。
- 案例：規劃歷史研究成本與損益證據核對；自建合成價格、持倉變動及成本假設 → 成本假設、損益拆解及匯出檢查結果 → 離線金融研究資料品質檢查，經資料權利與人工覆核後使用。
- 來源證據：
  - 區分市場成本假設：[lib/costs.py](https://github.com/Blave-TW/blave-agent/blob/2924d0adab1a7c655f9c32e39900116b0c0e4b52/lib/costs.py)（DEFAULT_FEES / us_members）；預設費率為研究假設，非即時券商報價；來源及實際費用需另核對。
  - 拆解持倉變動與損益：[lib/analysis.py](https://github.com/Blave-TW/blave-agent/blob/2924d0adab1a7c655f9c32e39900116b0c0e4b52/lib/analysis.py)（precise_pnl）；計算契約不證明獲利能力；須核對價格調整、時間與成本。
  - 檢查匯出程式的靜態問題：[lib/lint_export.py](https://github.com/Blave-TW/blave-agent/blob/2924d0adab1a7c655f9c32e39900116b0c0e4b52/lib/lint_export.py)（Report）；僅靜態檢查，非編譯器或交易驗證。

## kerr20801-taiwan-stock-ai-analyzer

- 固定版本 `49667cfa2813bedbe5b6ef23235f299f2e14a61b`；授權：MIT；mapped
- 用途：台股分析原型的技術分數、情緒分數與掃描股票池；部分新聞分數為模擬資料。
- 案例：規劃台股分析分數的缺值與模擬資料辨識；合成價格序列、空資料與測試股票池 → 分數來源、缺值行為及模擬標記 → 離線資料品質稽核，經資料權利與人工覆核後使用。
- 來源證據：
  - 辨識技術分數的預設回退：[realtime_trading_system/core/technical_indicators.py](https://github.com/kerr20801/taiwan-stock-ai-analyzer/blob/49667cfa2813bedbe5b6ef23235f299f2e14a61b/realtime_trading_system/core/technical_indicators.py)（get_technical_score / calculate_simple_rsi / calculate_simple_macd）；不足資料或錯誤可回退 0.5，不應當成已觀測中性；非交易訊號驗證。
  - 區分模擬情緒與外部新聞：[realtime_trading_system/core/market_sentiment_engine.py](https://github.com/kerr20801/taiwan-stock-ai-analyzer/blob/49667cfa2813bedbe5b6ef23235f299f2e14a61b/realtime_trading_system/core/market_sentiment_engine.py)（get_market_sentiment_score / _get_news_sentiment）；新聞分數使用模擬隨機值；不可宣稱已取得真實新聞或可預測股價。
  - 核對掃描股票池的來源：[realtime_trading_system/core/market_scanner.py](https://github.com/kerr20801/taiwan-stock-ai-analyzer/blob/49667cfa2813bedbe5b6ef23235f299f2e14a61b/realtime_trading_system/core/market_scanner.py)（_load_stock_pool）；資料庫清單與補充邏輯須分開標記；未核對實際資料及交易結果。

## zhulinsen-daily-stock-analysis

- 固定版本 `1a9117115bb2636919f4863798cd4e877394b321`；授權：MIT；mapped
- 用途：股票分析介面的資料供應能力、歷史紀錄與模型用量 API 映射。
- 案例：規劃分析儀表板的資料來源與歷史追溯；合成 API 回應、歷史紀錄 ID 與用量資料 → 來源狀態、歷史清單與用量顯示規格 → 研究儀表板的 API 驗收，經資料權利與人工覆核後使用。
- 來源證據：
  - 映射資料供應與品質欄位：[apps/dsa-web/src/api/dataCapability.ts](https://github.com/ZhuLinsen/daily_stock_analysis/blob/1a9117115bb2636919f4863798cd4e877394b321/apps/dsa-web/src/api/dataCapability.ts)（mapProvider / mapDataset / mapPriority）；前端映射不等於供應商資料已驗證；需獨立核對時間與來源。
  - 依紀錄識別追溯分析：[apps/dsa-web/src/api/history.ts](https://github.com/ZhuLinsen/daily_stock_analysis/blob/1a9117115bb2636919f4863798cd4e877394b321/apps/dsa-web/src/api/history.ts)（getList / getDetail / getNews）；僅 API 契約，未查證新聞與分析結論。
  - 呈現模型使用紀錄：[apps/dsa-web/src/api/usage.ts](https://github.com/ZhuLinsen/daily_stock_analysis/blob/1a9117115bb2636919f4863798cd4e877394b321/apps/dsa-web/src/api/usage.ts)（usageApi）；需核對後端計量及供應商帳單；未執行請求。
