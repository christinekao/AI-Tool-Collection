# Resource 雙層知識 Batch 38｜企業資料與 BI 語意

共同基線 `eb904646a4b86aaef129a133113fe2a859121021`；3 mapped 候選，9 用途、9 能力、3 design-only 案例；未實測，待 PR CI。

## onyx

- 版本 `f0e6c963b0b18bf814cce4511bcc6186a0ea8efd`；授權 MIT Expat（非 ee）；ee 依 Onyx Enterprise License；第三方各別授權
- 用途：把企業文件與應用的資訊整合成可檢索的知識來源，讓 AI 依使用者權限回答並附文件引用。
- 案例：規劃企業文件搜尋的權限與引用驗收；合成文件、兩種使用者角色、資料集與查詢 → 可讀範圍、搜尋結果及可回查引用 → 自有企業 RAG 與資料治理流程
- 局部能力及證據：
  - 建立使用者可讀取的文件範圍：backend/onyx/context/search/preprocessing/access_filters.py (build_access_filters_for_user,_build_cc_pair_access_filter)；不同配對模式可能回傳 None 或限制清單，不能把 None 解讀為普遍授權；需測試群組、匿名及撤權情境。
  - 依文件集與日期搜尋：backend/onyx/context/search/pipeline.py (apply_search_start_floor,_build_index_filters)；日期 floor 只能提高不能放寬；有 DB session 時檢查指定文件集權限，其他呼叫路徑須獨立驗證。
  - 將模型回答的引用連回文件：backend/onyx/chat/citation_processor.py (cited_documents,CitationMapping,CodeFenceTracker)；引用編號存在不代表語意支持結論；未知文件不應被當成已驗證來源，重要回答須回查原文。

## nvidia-auto-ontology

- 版本 `41425f48138c64e91638ee3496c82256021fa764`；授權 Apache-2.0
- 用途：將企業資料庫的欄位、表格與查詢關係整理成可供 AI 使用的資料知識，作為商業指標定義與查詢的基礎。
- 案例：規劃跨資料庫的商業資料語意與 Lineage；合成資料庫 Schema、欄位資料及已知 SQL 範例 → 目錄結構、表欄位關係與需人工確認的指標依據 → 自有企業 BI 與 Text-to-SQL 治理設計
- 局部能力及證據：
  - 檢查資料表是否具備完整欄位清單：auto_ontology/catalog/extract.py (IncompleteCatalogExtractionError,_validate_relation_column_coverage,create_dataframe)；列出的 relation 無欄位時拒絕；Connector 若同時漏報整張表仍可能看不出，須對照資料庫實際範圍。
  - 建立表、欄位與關係的結構：auto_ontology/catalog/model/schema.py (Schema)；正規化識別與 UUID 不等於業務定義正確；應驗證大小寫、同名欄位及來源 ID。
  - 解析 SQL 使用到的表欄位：auto_ontology/catalog/sql_parse.py (parse_query_slim,extract_tables_and_columns)；無法解析的表欄位可能略過；部分 Lineage 不可冒充完整，SQL 解析也不代表數值正確或已授權執行。

## wrenai

- 版本 `7ec42c34e26ae883d7a8dbed8423a936463b592d`；授權 core/sdk/skills/examples Apache-2.0；docs CC BY 4.0；其他路徑依 LICENSE
- 用途：讓 Agent 依已定義的商業資料語意產生查詢，並將結果用於分析與報表。
- 案例：規劃有商業指標定義的自然語言 BI 查詢；合成銷售資料、指定指標與維度、資料庫設定 → 資料來源契約、可驗證的語意及查詢執行紀錄 → 自有 BI 指標查詢與驗收流程
- 局部能力及證據：
  - 依資料來源選擇查詢介面：core/wren/src/wren/connector/factory.py (get_connector,_REGISTRY,_INSTALL_EXTRA)；支援清單不代表全部已安裝或相容；需依實際資料庫權限及方言測試。
  - 辨識查詢是否符合已宣告的語意：core/wren/src/wren/query_semantics.py (query_semantics,cubes_read_as_tables)；不支援的 Join、CTE、Window 或其他結構不得取得語意證明；None 不等於 SQL 錯誤，也不能當已驗證。
  - 為查詢設定可取消的執行生命週期：core/wren/src/wren/governed_query.py (QueryLifetime,QueryCancelled,require_platform)；受控 worker 要求 POSIX；終止本機 worker 不保證遠端資料庫停止查詢，須另測取消及最小權限。
