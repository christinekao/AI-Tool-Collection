# Resource 雙層知識 Batch 61｜資料工作區、資訊分類與備份

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。

## mars-tw-freedom-erp-crm

- 固定版本 `439e376fcc34c22ddba55e5ac736285d42971530`；授權：MIT
- 用途：以合成資料提供 ERP／CRM 流程練習；本次查核模擬資料驗證、分段儲存與備份傳輸契約。
- 案例：規劃模擬 ERP 工作區的資料一致性與備份驗收；合成產業範本、工作區狀態與備份片段 → 模擬資料驗證、儲存雜湊及備份狀態 → 自有業務流程示範工作區，經資料權利與人工覆核後使用。
- 來源證據：
  - 檢查模擬工作區資料契約：[src/engine.ts](https://github.com/mars-tw/freedom-erp-crm/blob/439e376fcc34c22ddba55e5ac736285d42971530/src/engine.ts)（createWorld / validateWorld）；明確 SIM 與非真實金融；只驗模擬結構及部分不變條件，不等於企業會計合規。
  - 驗證分段儲存完整性：[src/workspace-storage.ts](https://github.com/mars-tw/freedom-erp-crm/blob/439e376fcc34c22ddba55e5ac736285d42971530/src/workspace-storage.ts)（readWorkspaceState / writeWorkspaceState）；雜湊是完整性檢查，不是加密；實際 Durable Object 交易與故障復原須驗證。
  - 限制備份匯入工作狀態：[src/workspace-backup.ts](https://github.com/mars-tw/freedom-erp-crm/blob/439e376fcc34c22ddba55e5ac736285d42971530/src/workspace-backup.ts)（readStage / remember / backupStatus）；過期會清理暫存；同一操作識別不得用不同內容，完整匯入及覆寫行為未測。

## zichuanlan-freebie-radar

- 固定版本 `35a8298c7d614ed237761355825b050655c4ec7f`；授權：MIT；資訊來源與取得條件另查
- 用途：自架資訊聚合與分類雷達；本次查核標題去重、內容線索及證據優先的分類契約。
- 案例：規劃資訊雷達的去重與分類證據驗收；合成資訊標題、摘要及分類欄位 → 合併候選、內容線索及可追溯分類規格 → 自有資訊收藏工作區，經資料權利與人工覆核後使用。
- 來源證據：
  - 從標題萃取合併候選：[src/server/enrich/dedup.ts](https://github.com/ZiChuanLan/freebie-radar/blob/35a8298c7d614ed237761355825b050655c4ec7f/src/server/enrich/dedup.ts)（extractMergeKeys / mergeKey）；正規化與語言啟發式可能誤合併；合併候選須保留來源與人工覆核。
  - 區分宣稱免費與具體取得線索：[src/server/enrich/evidence.ts](https://github.com/ZiChuanLan/freebie-radar/blob/35a8298c7d614ed237761355825b050655c4ec7f/src/server/enrich/evidence.ts)（contentSignals）；文字規則不證明優惠有效或價格正確；需核對官方來源與期限。
  - 建立證據優先的分類入口：[src/server/enrich/classify.ts](https://github.com/ZiChuanLan/freebie-radar/blob/35a8298c7d614ed237761355825b050655c4ec7f/src/server/enrich/classify.ts)（hasRepoUrl / KindContext / KindDecision）；僅查局部證據契約；網域匹配不證明內容真實，未測分類完整性。

## hirakujira-pokeep

- 固定版本 `c42ecb05866ac7971e5d0521d77c28f5e537458d`；授權：未找到根授權檔；不授權複製程式或重用素材
- 用途：本機 Pokémon GO 收藏整理助手；本次查核備份資料、收藏排序及建議分類，不執行手機操作。
- 案例：規劃本機收藏資料的備份與建議可追溯驗收；虛構收藏資料、測試圖片參照及分類條件 → 備份格式、排序理由及分類紀錄 → 本機合成收藏資料測試區，經資料權利與人工覆核後使用。
- 來源證據：
  - 備份收藏紀錄與影格參照：[src/lib/backup.ts](https://github.com/hirakujira/Pokeep/blob/c42ecb05866ac7971e5d0521d77c28f5e537458d/src/lib/backup.ts)（backupSchema / exportBackup）；影格讀取錯誤可被略過；備份可能不完整且含私人資料，須核對。
  - 比較收藏代表：[src/lib/evaluation/collection.ts](https://github.com/hirakujira/Pokeep/blob/c42ecb05866ac7971e5d0521d77c28f5e537458d/src/lib/evaluation/collection.ts)（quality / pickCollectibles）；權重為作者規則，不是客觀價值；不可據此自動清除收藏。
  - 附加建議理由與比較紀錄：[src/lib/evaluation/categorize.ts](https://github.com/hirakujira/Pokeep/blob/c42ecb05866ac7971e5d0521d77c28f5e537458d/src/lib/evaluation/categorize.ts)（categorize / keepReasonRank）；僅為建議資料；不代表實際遊戲操作授權，未連線或執行任何移除。
