# Resource 雙層知識 Batch 37｜跨 Agent 記憶與時點研究

共同基線 `eb904646a4b86aaef129a133113fe2a859121021`；3 mapped 候選，9 用途、9 能力、3 design-only 案例；未實測，待 PR CI。

## garrytan-gbrain

- 版本 `897e1120d14e87461c9cceecd99197b9f9bf20d4`；授權 MIT
- 用途：讓不同 AI Agent 共用可查詢的事實、決策與專案文件，並可校正或撤回過時記憶。
- 案例：規劃跨 Agent 的專案決策記憶與修正；合成專案決策、相關實體、來源與待撤回事實 → 事實連結、相關記憶及撤回範圍驗收紀錄 → 自有知識庫的決策追蹤與查詢
- 局部能力及證據：
  - 把零散事實連到相關實體：src/commands/facts.ts (factsHelpText,parseRelinkArgs)；dry-run 不寫入也不呼叫模型；模型階段可計費，include-private 另有外送風險；不會自行建立頁面或取代事實。
  - 依實體或時間查回記憶：src/commands/recall.ts (ParsedFlags,parseFlags)；include-expired 會納入已過期資訊，查詢命中不表示事實仍有效；thin client 的遠端權限須另測。
  - 區分記憶撤回及實際清除：src/commands/forget-purge.ts (PURGE_FAMILY_HELP,renderPurgeReceipt,invoker)；撤回保留歷史與備份；purge 只處理 live stores，不代表物理抹除，須依收據核對殘留與明確核准。

## claude-mem

- 版本 `11b47f9f4b8dc3614fab7452647f578886468849`；授權 Apache-2.0（現行 LICENSE）
- 用途：保存 Coding Agent 的工作紀錄，讓後續工作階段依需要查回之前的觀察、摘要與修改脈絡。
- 案例：規劃跨開發 Session 的分層記憶檢索；合成專案、測試 Prompt、工作觀察與歷史摘要 → 擷取狀態、可搜尋索引及按需取得的觀察明細 → 自有 Agent 工作紀錄與交接介面
- 局部能力及證據：
  - 在工作開始時建立可追蹤紀錄：src/cli/handlers/session-init.ts (sessionInitHandler,recordSessionPrompt,SessionPromptNotRecordedError)；Hook fail-open 可能未保存；transcript watcher 對暫時失敗另有重試，排除專案與私人 Prompt 不應被補寫。
  - 先查看候選記憶再讀取詳細內容：src/services/worker/ProgressiveMemorySearch.ts (ProgressiveMemorySearch,indexRow,run)；Prompt 索引不一定可當明細錨點，排序與候選上限可能漏掉相關內容，須回查原紀錄。
  - 保存結構化工作紀錄與同步版本：src/services/sqlite/SessionStore.ts (SYNC_ENTITY_HEADS_DDL,SYNC_CONTENT_OUTBOX_DDL)；資料包含私人工作內容；同步 ledger 不證明資料已完整同步或已刪除，需另測去重、權限及復原。

## hermes-backsearch

- 版本 `477d81446c856a39021c069a88a047e9c89fbba3`；授權 MIT
- 用途：讓 Agent 查詢指定歷史日期之前已被封存的新聞與網頁，而非使用今天更新後的內容。
- 案例：規劃歷史研究的時點資料檢索與驗收；合成研究問題、截止日及公開來源網址 → 截至指定日期的候選資料、封存內容及缺漏清單 → 自有歷史研究與可重現評估流程
- 局部能力及證據：
  - 依截止日搜尋封存資料：backsearch_tools.py (handle_backsearch,BACKSEARCH_SCHEMA,_PREVIEW_WINDOW_HINT)；as_of 依 crawl_date 而非文章自述發布日；文件聲明預覽範圍 2025-12 至 2026-07，空結果不等於事件不存在。
  - 取得截止日前的網頁版本：backsearch_tools.py (handle_backfetch,BACKFETCH_SCHEMA,_FETCH_TEXT_CAP)；全文回傳有 15000 字元上限，摘要不等同原文；第三方封存完整性與服務端日期規則未實測。
  - 控制歷史搜尋工具的可用性：__init__.py (register,check_backsearch_available,_TOOLS)；無金鑰時工具不進模型 Schema；成功請求可能計費，401、403、402 與 404 意義不同，須另核准。
