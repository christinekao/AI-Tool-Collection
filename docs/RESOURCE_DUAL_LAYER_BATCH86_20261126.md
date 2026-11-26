# Batch 86｜hindsight 局部技術證據補強（2026-11-26）

固定版本：`550ef5e304623be2a456913acbac1b1a834fb2c3`。保留原 ID、分類、Tags、Typed References、原案例；維持 deferred。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [document-version](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/hindsight_api/engine/memories/pg/retain.py#L87-L244) | 文件更新依 bank_id 與 document_id 查詢與鎖定；替換先清除舊 memory_units，並以內容雜湊區分版本與重試。 | 僅 Postgres 儲存輔助函式；尚未驗證交易整體原子性及全部失敗恢復。 |
| [hybrid-recall](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/hindsight_api/engine/memories/pg/recall.py#L29-L293) | 語意與 BM25 依 fact type 組合查詢，空詞彙省略 BM25；可套用分數門檻、bank_id 及 tags，返回兩路候選。 | 候選產生不等於最終融合排序、回答正確或隔離測試。 |
| [tenant-auth](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/hindsight_api/extensions/builtin/tenant.py#L8-L90) | 預設 TenantExtension 不要求認證；ApiKeyTenantExtension 核對配置金鑰並回傳配置 schema，MCP 可選擇略過認證。 | 單一 API key 不證明 bank 級 RBAC 或多租戶隔離；不得直接暴露預設部署。 |
| [reflect-budget](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/hindsight_api/engine/reflect/agent.py#L71-L172) | Reflect 以 retrieval tools 搜尋 mental models、observations 與原始記憶；並行工具請求按剩餘 context 分配 token ceiling，預設迭代上限常數為 10。 | 僅預算及工具集合證據；未核對完整生成、引用及終止分支。 |
| [bank-delete-test](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/tests/test_delete_bank_leaves_no_rows.py#L224-L272) | 上游測試先在 bank 相關資料表植入資料，再刪除目標 bank 並檢查殘留與旁觀 bank 計數；另測清除但保留 bank profile。 | 測試程式存在不表示已執行；故意保留的資料、備份及外部儲存另驗。 |

## 讀者應用

驗收記憶版本、檢索及租戶授權：以合成文件設計新舊版本、語意／關鍵字查詢、無效金鑰及刪除後旁觀 bank 不變的驗收；分開檢查檢索結果與生成答案。

## 下一步

核對 api/http.py 的端點與 engine/reflect/agent.py 完整迴圈、bank 層級授權及刪除保留例外；在隔離 Postgres 測試資料及跨租戶拒絕。

第三方未執行；局部來源不構成完整實作契約。
