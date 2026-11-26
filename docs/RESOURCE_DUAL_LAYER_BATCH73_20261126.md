# Resource 雙層知識 Batch 73｜模型目錄、模型評估與 Agent 開發

公開來源已查核；固定版本或日期化網頁證據，第三方未實測。

## omniroute

- mapped；固定版本局部查核 176919ddb80754ad24922790dde53a85f21249d5；未安裝、執行、登入、付費或實測第三方項目。
- 授權／條款：MIT；模型供應商條款另查
- 用途：以本次固定版本程式碼說明模型清單新鮮度、快取與篩選規則，不推定整體服務品質。
- 案例：規劃模型路由目錄的新鮮度與快取驗收；合成模型目錄、時間欄位及篩選條件 → 模型清單狀態、快取限制及篩選結果 → 自有模型路由測試環境，經人工覆核後採用。
- 來源證據：
  - 檢查模型版本時間：[freshWindowDaysToMs / isFreshModel](https://github.com/cheaper-inference/OmniRoute/blob/176919ddb80754ad24922790dde53a85f21249d5/@omniroute/opencode-plugin-v2/src/catalog-freshness.ts)；此為目錄判定而非模型可用性保證；未連線測試。
  - 辨識不合格的目錄快照：[DEFAULT_MODEL_CACHE_TTL_MS / UNREACHABLE_COOLDOWN_MS / isStaleSnapshotModel](https://github.com/cheaper-inference/OmniRoute/blob/176919ddb80754ad24922790dde53a85f21249d5/@omniroute/opencode-plugin-v2/src/cache.ts)；僅核對常數及局部檢查；不保證完整快取恢復或實際服務可用。
  - 限制模型清單的匹配範圍：[compileModelListFilter](https://github.com/cheaper-inference/OmniRoute/blob/176919ddb80754ad24922790dde53a85f21249d5/@omniroute/opencode-plugin-v2/src/model-filter.ts)；僅局部篩選契約，不等於供應商權限或安全隔離。

## minimax-m3-1-flash

- evidence-linked；公開產品或教學頁面於 2026-11-26 查閱；無可核對上游 Git SHA；未安裝、執行、登入、付費或實測第三方項目。
- 授權／條款：MiniMax Community License；完整條款及服務定價另核對
- 用途：官方模型卡描述多模態模型、推論參數與部署途徑；僅整理採用及驗收前提。
- 案例：規劃多模態模型的離線評估與部署前提；合成程式任務、圖片與標註答案 → 模型評估規格、參數紀錄及資源需求 → 自有模型評估工作區，經人工覆核後採用。
- 來源證據：
  - 設計文字與圖片測試案例：[Model card / Image-Text-to-Text](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash)；官方模型描述不代表個別任務實測效果。
  - 紀錄推論設定以便重現：[Inference Settings](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash)；官方建議設定並非所有任務最佳值；長上下文受硬體及服務配置限制。
  - 核對本機部署的相依前提：[How to Use / Local Deployment](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash)；未下載權重、未執行遠端程式；資源需求及授權須另驗證。

## minimax-code

- evidence-linked；公開產品或教學頁面於 2026-11-26 查閱；無可核對上游 Git SHA；未安裝、執行、登入、付費或實測第三方項目。
- 授權／條款：產品服務條款、帳號權限與費用另查
- 用途：整理官方 Coding Agent 介紹的專案操作、權限及結果覆核，不推定可任意存取本機。
- 案例：規劃 Coding Agent 的變更範圍與交付驗收；合成專案、任務規格與允許修改範圍 → 計畫、差異檢視及測試證據規格 → 自有隔離開發工作區，經人工覆核後採用。
- 來源證據：
  - 把開發目標轉成可驗收工作：[AI Coding Agent / Workflow](https://code.minimax.io/tools/ai-coding-agent)；未連接實際專案或帳號；產品描述不等於已執行。
  - 限定專案與工具授權：[permissions / approve permission requests](https://code.minimax.io/tools/ai-coding-agent)；不提供憑證或擅自啟動遠端操作。
  - 依差異及測試覆核交付：[review / test feedback](https://code.minimax.io/tools/ai-coding-agent)；未進行實際開發或測試；獨立檢查後才採用。
