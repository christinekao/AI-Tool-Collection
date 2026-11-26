# Batch 95｜infiniflow-ragflow 固定版本契約補強（2026-11-26）

固定版本：`37b63fc3979365ea70f267f290c2f12d93fdbf50`。維持 deferred；保留 ID、分類、Tags、既有證據與應用案例。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [ingestion-task-state](https://github.com/infiniflow/ragflow/blob/37b63fc3979365ea70f267f290c2f12d93fdbf50/internal/dao/ingestion_task.go#L36-L94) | 匯入任務建立前查詢文件 ID，重複時回傳錯誤；條件式更新只在當前狀態屬允許集合時修改，並依 RowsAffected 回報是否成功。重試可解除舊 pipeline log 綁定。 | 此為 DAO 局部契約；未證明所有競爭情境、唯一索引、解析與外部索引一致性。 |
| [retrieval-dependency-permission](https://github.com/infiniflow/ragflow/blob/37b63fc3979365ea70f267f290c2f12d93fdbf50/internal/agent/component/retrieval_permission_test.go#L83-L122) | 上游測試對共享資料集與記憶預期允許、私有資料集及非雙方交集記憶預期拒絕；未啟用的資料來源綁定不參與此次驗證，缺 Canvas 身分預期報錯。 | 只閱讀 SQLite 測試，沒有執行；不能證明所有檢索入口或部署版隔離。 |
| [citation-marker-filter](https://github.com/infiniflow/ragflow/blob/37b63fc3979365ea70f267f290c2f12d93fdbf50/internal/agent/component/citation_sources.go#L46-L145) | 引用來源按順序與 token 預算截取，第一個有效來源可超出預算；引用標記只保留允許的 ID，串流緩衝跨 delta 的不完整標記。 | 超長或未閉合文字可能保留為字面文字；ID 合法不等於回答語意忠實，未核對全部輸出入口。 |

## 讀者應用

驗收 Go 檢索權限、引用及匯入狀態：以合成文件、不同身分、非授權引用 ID、重複匯入及競爭更新設計正反例；分別驗證來源忠實度及跨租戶隔離。

## 缺口與下一步

舊 Python parser、chunking、search 路徑於固定版本未找到（404）；現已定位 Go 匯入任務 DAO、Canvas 檢索依賴權限測試與引用標記過濾；仍缺解析至索引完整鏈、所有 API 授權與端到端語意引用品質。

追蹤 ingestion pipeline 執行器、parser/index I/O、檢索服務權限及引用產生呼叫鏈；另以合成資料驗證。

僅靜態查核；第三方及上游測試未執行，不增加正式完成率。
