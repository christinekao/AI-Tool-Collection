# Batch 100｜stitch-mcp 固定版本契約補強（2026-11-26）

固定版本：`f6aa86cde10c3f490acf09a63cc044582a50821d`。維持 deferred，保留原 ID、分類、Tags、既有案例及證據。Stitch 的固定版本僅代表 SDK，不代表服務端。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [sdk-auth-header](https://github.com/google-labs-code/stitch-sdk/blob/f6aa86cde10c3f490acf09a63cc044582a50821d/packages/sdk/src/auth.ts#L75-L101) | SDK header helper 優先採 API key，其次 Bearer token，可附 quota project；兩者皆無則拋錯。 | 只證明 SDK helper 行為，不代表服務端授權、OAuth scope 或所有呼叫端的 header 合併安全。 |
| [sdk-tool-envelope](https://github.com/google-labs-code/stitch-sdk/blob/f6aa86cde10c3f490acf09a63cc044582a50821d/packages/sdk/src/client.ts#L100-L147) | 工具回應 isError 時分類並拋 StitchError；非錯誤時優先 structuredContent，再嘗試解析文字 JSON，失敗可回傳原文字。另宣告 get/list 為可重試模式。 | 型別轉換非實際 schema 驗證；本段未查完整 retry 呼叫鏈或服務端是否冪等。 |
| [sdk-expired-download-test](https://github.com/google-labs-code/stitch-sdk/blob/f6aa86cde10c3f490acf09a63cc044582a50821d/packages/sdk/test/unit/download-hardening.test.ts#L101-L132) | 上游 mock 測試模擬 HTML 簽署 URL 回傳 403，預期總體 success 仍為 true，但下載畫面數為零並回傳警告，錯誤正文不得保存成 HTML 產物。 | 只閱讀 mock 測試，未執行；成功旗標不代表所有畫面下載完整或正式服務可用。 |

## 讀者應用

驗收 SDK 認證、回應與部分下載：以合成資料設計缺少憑證、不同認證類別、錯誤封套、非 JSON 回應、逾時及下載 URL 失效等測試；另驗證實際服務端授權與產物完整性。

## 缺口與下一步

原 MCP Setup 頁無可讀正文；已查固定版本 SDK 認證 header、工具回應解析及下載失敗的上游測試；仍未查核正式服務端版本、即時 schema、OAuth 核准流程、配額及真實產物。

取得正式 Setup 文件，經核准後以合成專案查即時工具 schema、服務端授權與輸出完整性；不可將 SDK commit 當成服務端版本。

僅靜態查核；第三方及上游測試未執行，不增加正式完成率。
