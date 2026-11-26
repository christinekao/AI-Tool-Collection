# Batch 89｜hindsight 固定版本契約補強（2026-11-26）

固定版本：`550ef5e304623be2a456913acbac1b1a834fb2c3`。維持 deferred，保留原 ID、分類、Tags、Typed References、原案例與既有證據。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [http-precheck](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/hindsight_api/api/http.py#L4937-L4974) | 有配置 OperationValidator 時，HTTP precheck 先認證 tenant，再帶 bank_id、operation、request context 與內容長度呼叫驗證器；拒絕轉 HTTP 錯誤。 | 未配置驗證器會直接返回；這段不是預設 bank RBAC，也未涵蓋所有端點。 |
| [reflect-http](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/hindsight_api/api/http.py#L5808-L5939) | Reflect API 透過 precheck 與 admission 依賴，把 bank、查詢、預算、tags 等傳入 reflect_async；斷線取消執行，按請求回傳 based_on、trace、結構化輸出與使用量。 | HTTP 包裝層不保證證據正確、bank 授權或模型輸出忠於原文。 |
| [reflect-finish](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/hindsight_api/engine/reflect/agent.py#L967-L1030) | 停止檢索後透過 done 取得回答；空回答可重問，沒有 done 時可轉獨立 synthesis；已拒絕的結構化文件不可靜默改成自由文字，超過重試上限會失敗。 | 尚未核對完整檢索迴圈、引用驗證函式與所有 fallback 分支；未執行。 |

## 讀者應用

驗收 Reflect 回答與操作授權：以合成記憶驗證操作驗證器拒絕、用戶端斷線取消、空回答重試、結構化輸出拒絕及引用回傳；分開驗證 tenant 與 bank 權限。

## 缺口與下一步

已核對 HTTP precheck、Reflect API 與終止分支；仍缺引擎 bank 級授權完整鏈、引用驗證與刪除例外，不能宣稱跨 bank 隔離。

追蹤引擎 tenant/schema 與 bank 授權、_process_done_tool 的引用驗證及刪除保留例外，再以隔離環境驗證。

僅固定版本靜態查核；第三方未執行，不增加正式完成率。
