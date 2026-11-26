# Resource 雙層知識 Batch 75｜決策模型、基礎設施與回測契約

公開來源已查核；固定版本或日期化網頁證據，第三方未實測。

## typesafe-ai-jev

- evidence-linked；公開產品或教學頁面於 2026-11-26 查閱；無可核對上游 Git SHA；未安裝、執行、登入、付費或實測第三方項目。
- 授權／條款：供應商 Terms 與 Privacy、價格及區域另查
- 用途：Vercel AI Gateway 的 Jev 模型頁說明型別化決策介面及供應商資訊，未發出 API 請求。
- 案例：規劃型別化客服決策的輸入與獨立驗收；虛構客服對話、布林問題與人工標註 → 決策結果契約、測試矩陣與費用前提 → 自有客服品質評估測試區，經人工覆核後採用。
- 來源證據：
  - 把案例狀態與決策問題分離：[experimental_decide / state / questions](https://vercel.com/ai-gateway/models/typesafe-ai/jev)；範例只是介面文件；未核對 API 執行或準確率。
  - 驗收布林問題的判定品質：[refunded / type: boolean](https://vercel.com/ai-gateway/models/typesafe-ai/jev)；不可把模型決策直接當作退款或其他業務操作授權。
  - 查閱模型供應商及服務條款：[Providers / Legal](https://vercel.com/ai-gateway/models/typesafe-ai/jev)；實際可用性、價格與資料政策可能變動；未登入或付費。

## zeabur-oss-ai-agent-installer-guide

- evidence-linked；公開產品或教學頁面於 2026-11-26 查閱；無可核對上游 Git SHA；未安裝、執行、登入、付費或實測第三方項目。
- 授權／條款：官方文件及實際開源元件授權須分別核對
- 用途：Zeabur OSS 安裝指南區分新伺服器及既有 Kubernetes，要求改動前同意，管理員通行密鑰由本人建立。
- 案例：規劃自有伺服器的安裝前檢查與授權閘道；合成伺服器清單、叢集現況及核准範圍 → 安裝路徑、人工核准與管理員交接清單 → 自有基礎設施設計測試區，經人工覆核後採用。
- 來源證據：
  - 依叢集現況選擇安裝路徑：[貼上這段提示 / Agent 會做的事](https://oss.zeabur.com/zh-TW/docs/zeabur/install/agent/)；未連線 SSH 或執行 Helm；版本及相依需另查。
  - 在伺服器改動前取得核准：[Agent 會做的事](https://oss.zeabur.com/zh-TW/docs/zeabur/install/agent/)；不直接修改真實伺服器，不執行具副作用的安裝。
  - 保留管理員身分建立的人工界線：[你自己要做的事 / 從 Zeabur 搬過來](https://oss.zeabur.com/zh-TW/docs/zeabur/install/agent/)；不開啟管理員建立連結、不收集通行密鑰；未實測遷移。

## tradingview-pine-screener-strategy-tester

- evidence-linked；公開產品或教學頁面於 2026-11-26 查閱；無可核對上游 Git SHA；未安裝、執行、登入、付費或實測第三方項目。
- 授權／條款：服務方案、行情資料權利及使用條款另查
- 用途：官方文件區分 Pine Screener 的指標掃描與策略模擬，保留回測假設和資料限制。
- 案例：規劃金融研究的篩選與回測證據核對；合成指標條件、觀察清單與歷史價格資料 → 篩選限制、模擬假設及偏差驗收清單 → 離線金融研究規格庫，經人工覆核後採用。
- 來源證據：
  - 區分指標掃描及策略模擬：[Selecting a source / Selecting an indicator](https://www.tradingview.com/support/solutions/43000742436-tradingview-pine-screener-key-features-and-requirements/)；Screener 不直接執行策略類型腳本；未掃描真實行情。
  - 保留掃描資料及執行限制：[Pine Screener requirements](https://www.tradingview.com/support/solutions/43000742436-tradingview-pine-screener-key-features-and-requirements/)；目前文件說明最近 500 根 K 線；未實測或保證未來不變。
  - 核對回測成交的模擬假設：[Broker emulator / Adjusting historical bar detail](https://www.tradingview.com/pine-script-docs/concepts/strategies/)；模擬不代表實際績效；未執行交易或提出買賣建議。
