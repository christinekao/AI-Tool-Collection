# Resource 雙層知識 Batch 80｜協作部署、架構學習及設計整合

1 evidence-linked、2 deferred；9 用途、同數局部證據、3 design-only 案例；不等同深度完成。所有第三方均未實測。

## letswrite-buzz-self-hosted-relay-guide

- 狀態：evidence-linked。原站直接擷取 403；2026-11-26 完整讀取原作者 Let's Write 於 DEV Community 的同篇轉載，包含原文連結、部署、連線、Agent 設定及測試章節。未執行；完整學習教材另待建立。
- 用途：參考原作者自架 Relay 與 Agent 接入經驗，設計部署、連線及權限驗收，避免將教學中的本機設定直接用於正式環境。
- 案例（design-only）：規劃隔離的 Buzz 協作工作台部署驗收；合成團隊需求、隔離環境與核准範圍 → 部署前置條件、連線診斷與權限驗收矩陣 → 自有 AI Cowork 測試規格庫，未核准前不部署。
- 來源證據：
  - 規劃 Relay 與服務健康檢查：[安裝 Buzz Relay／啟動與測試 Relay](https://dev.to/letswrite/buzz-zi-jia-jiao-xue-shi-yong-docker-jia-she-relay-yu-she-ding-ai-agent-zi-dong-hui-fu-2b09)；作者的版本及本機設定不等於目前正式環境，不能為了通過健康檢查而停用安全控制。
  - 比對 Desktop、Relay 與 Agent 的連線身分：[登入 Buzz／確認 Community 網址相同](https://dev.to/letswrite/buzz-zi-jia-jiao-xue-shi-yong-docker-jia-she-relay-yu-she-ding-ai-agent-zi-dong-hui-fu-2b09)；未安裝或連線；不得將本機示例的非加密或免驗證設定暴露於網路。
  - 驗收 Agent 回應及最小權限：[使用 AI Agents 功能／實際測試](https://dev.to/letswrite/buzz-zi-jia-jiao-xue-shi-yong-docker-jia-she-relay-yu-she-ding-ai-agent-zi-dong-hui-fu-2b09)；原作者示例擴大 Agent 接收範圍，不應直接套用；避免公開憑證、未授權執行與來源不明安裝器。
- 原作者轉載與原網址並存；不等同已完成部署或完整學習教材。

## designed-to-scale

- 狀態：deferred。2026-11-26 原課程可讀文字僅有 JavaScript 提示；原作者 Dilum Sanjaya 官方作品集明確連結該課程並列出主題。僅查課程範圍，未瀏覽實際動畫、逐章閱讀或執行。
- 用途：利用作者提供的動畫式系統設計課程規劃學習路線，先理解架構取捨，再用自有案例驗證；尚未讀取互動章節。
- 案例（design-only）：規劃系統設計課程的自學與應用驗收；自訂服務需求、容量假設及作者課程主題 → 閱讀路線、架構草圖與待驗證問題 → 個人系統設計教材區，逐章讀取後再形成正式筆記。
- 來源證據：
  - 比較負載均衡與快取的學習目標：[Primers／Software architecture System Design](https://dilum.dev/)；僅核對作者介紹列出主題；不宣稱教材已讀或提供實際容量數字。
  - 規劃分片、共識與訊息佇列的比較：[Primers／Software architecture System Design](https://dilum.dev/)；作者只列出課程範圍；實際演示及技術取捨需逐章確認。
  - 選取服務設計作為學習後的練習：[Primers／Software architecture System Design](https://dilum.dev/)；這是自訂學習規劃，未完成任何課程專案或效能測試。
- 缺口：原課程互動內容未能擷取；各章實際例子、參數、練習與原始碼未確認。
- 下一步：以支援 JavaScript 的瀏覽器或原作者提供的可讀教材逐章核對，補重點、獨立練習及驗收證據。

## stitch-mcp

- 狀態：deferred。2026-11-26 官方 Setup 頁無可讀正文；Google Labs 官方公告確認 MCP／SDK 關聯，另查 Google Labs SDK 固定版本 README f6aa86cde10c3f490acf09a63cc044582a50821d。固定版本只屬 SDK 文件，不代表 MCP 服務端版本；SDK README 聲明非正式支援產品。未連線。
- 用途：參考 Google 公開的 Stitch MCP 與 SDK 文件，規劃工具探索、畫面輸出及錯誤驗收；正式設定及伺服器權限仍待核對。
- 案例（design-only）：規劃作品集設計 Agent 的工具與產物驗收；合成畫面需求、測試專案識別及權限規格 → 工具清單、畫面產物契約與錯誤驗收表 → 自有前端設計工作區，僅在核准的測試專案使用。
- 來源證據：
  - 建立可使用工具與權限清單：[Tool Client (Agent Usage)／Configuration](https://github.com/google-labs-code/stitch-sdk/blob/f6aa86cde10c3f490acf09a63cc044582a50821d/README.md)；SDK 記錄 listTools 與 callTool；未查即時服務端工具，API 金鑰及 OAuth 必須隔離。
  - 區分畫面生成與可交付檔案：[Working with Projects and Screens／API Reference: Screen](https://github.com/google-labs-code/stitch-sdk/blob/f6aa86cde10c3f490acf09a63cc044582a50821d/README.md)；文件說明 getHtml 與 getImage 回傳下載 URL，而非可直接執行或已驗證的產品；未建立畫面。
  - 建立失敗、澄清與重試驗收：[Error Handling／Answering a clarifying question](https://github.com/google-labs-code/stitch-sdk/blob/f6aa86cde10c3f490acf09a63cc044582a50821d/README.md)；僅為 SDK 文件描述，未實際觸發任何錯誤或驗證服務端行為。
- 缺口：原 Setup 頁無正文；即時工具 Schema、正式授權流程、方案限制及服務端版本未核對。
- 下一步：取得可讀正式 Setup 文件後，在明確核准測試環境比對即時工具清單與權限，再以合成畫面驗收。
