# Batch 92｜hindsight 固定版本契約補強（2026-11-26）

固定版本：`550ef5e304623be2a456913acbac1b1a834fb2c3`。維持 deferred，保留原 ID、分類、Tags、Typed References、原案例與既有證據。原 404 路徑已更正。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [bank-validator-coverage](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/tests/test_bank_validator_coverage.py#L71-L109) | 上游測試將拒絕驗證器注入引擎，遍歷 OpenAPI 含 bank_id 的路由並要求 4xx；空 retain 的 200 被視為無寫入例外。 | 這是未執行的上游測試，非預設 Bank RBAC 證明；4xx 不必然表示命中驗證器，也不涵蓋非 HTTP 入口。 |
| [reflect-cited-id-filter](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/hindsight_api/engine/reflect/agent.py#L2477-L2595) | done 的引用欄位不是 list 時回空集合，僅保留實際檢索集合中的字串 ID；長度重寫後另移除回答與文件中未見過的 ID。 | ID 存在不代表語意支持結論；結構化輸出及其他 synthesis 分支須另外核對。 |
| [missing-bank-delete-test](https://github.com/vectorize-io/hindsight/blob/550ef5e304623be2a456913acbac1b1a834fb2c3/hindsight-api-slim/tests/test_delete_missing_bank_store_owned.py#L98-L137) | 上游測試要求不存在的 Bank 在刪除、清空或按類型清空時回零計數且不呼叫未建立 namespace 的 store；現存 Bank 的正控制要求計數與刪除 storage。 | 測試未執行；不代表所有後端、附件、備份或保留期限皆已刪除。 |

## 讀者應用

驗收 Bank 拒絕、引用與刪除例外：設計拒絕驗證器、未檢索 ID、格式錯誤 ID 欄位、空 retain、缺失 Bank 與現存 Bank 的正反例，另驗證直接引擎呼叫及資料隔離。

## 缺口與下一步

原 404 路徑已更正；已補上 Bank 路由拒絕測試、Reflect 引用集合過濾與不存在 Bank 的刪除測試；仍須核對引擎直接呼叫的授權、跨 tenant/bank 隔離、所有輸出分支與完整資料保留／刪除契約。

核對引擎直接呼叫的 tenant/schema 與 Bank 授權、強制 synthesis 引用路徑、附件及備份刪除；以合成資料實測。

僅固定版本靜態查核；第三方與上游測試未執行，不增加正式完成率。
