# Resource 雙層知識 Batch 59｜影音素材、剪輯可靠性與字幕驗收

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。

## storytold-artcraft

- 固定版本 `ac0e3695209a055a4fb55eb2dcafc0ef01e1600f`；授權：MIT 或 Apache-2.0；第三方素材另查
- 用途：創作工作台整合 AI 素材與工作狀態；本次查核素材參照類型、工作清單及媒體快取。
- 案例：規劃影音創作工作台的素材與生成狀態驗收；合成素材路徑、生成工作與預覽影格 → 素材分類、待處理工作與快取行為規格 → 自有創作工作區，經資料權利與人工覆核後使用。
- 來源證據：
  - 分類可附加的參照媒體：[artcraft-native/src/prompt_box/refs.rs](https://github.com/storytold/artcraft/blob/ac0e3695209a055a4fb55eb2dcafc0ef01e1600f/artcraft-native/src/prompt_box/refs.rs)（RefKind::from_path / RefMedia::uploading）；副檔名不是內容驗證；上傳前核准資料與外部服務。
  - 建立生成工作的待處理狀態：[artcraft-native/src/feed/store.rs](https://github.com/storytold/artcraft/blob/ac0e3695209a055a4fb55eb2dcafc0ef01e1600f/artcraft-native/src/feed/store.rs)（FeedStore::add_enqueued / FeedStore::apply_jobs）；顯示預估秒數不代表真實完成時間；未核對外部生成服務。
  - 管理預覽媒體快取：[artcraft-native/src/backend/media_cache.rs](https://github.com/storytold/artcraft/blob/ac0e3695209a055a4fb55eb2dcafc0ef01e1600f/artcraft-native/src/backend/media_cache.rs)（MediaCache::poll / lookup）；依快取項目及未使用影格數清理，不是硬性記憶體保證；需要實測裝置效能。

## storytold-filmcraft

- 固定版本 `f731571277192072a78eb8fec56eb8ab723b7217`；授權：MIT 或 Apache-2.0；素材與商標另查
- 用途：跨平台非線性影片剪輯器；本次查核網頁復原政策、下載節奏與本機副檔名過濾。
- 案例：規劃影片剪輯專案的復原與匯出可靠性驗收；合成專案版本、下載請求與副檔名 → 快照動作、下載排程及檔案篩選規格 → 自有剪輯系統測試工作區，經資料權利與人工覆核後使用。
- 來源證據：
  - 依專案修改版本安排復原快照：[apps/filmcraft-web/src/recovery_policy.rs](https://github.com/storytold/filmcraft/blob/f731571277192072a78eb8fec56eb8ab723b7217/apps/filmcraft-web/src/recovery_policy.rs)（Policy::tick / Policy::written / Policy::cleaned）；純政策不等於實際 OPFS 寫入成功；需測試故障與恢復。
  - 分隔多檔下載的開始時間：[apps/filmcraft-web/src/download_pacing.rs](https://github.com/storytold/filmcraft/blob/f731571277192072a78eb8fec56eb8ab723b7217/apps/filmcraft-web/src/download_pacing.rs)（Pacer::reserve / GAP_MS）；固定間隔不保證所有瀏覽器成功下載；須核對實際檔案數量。
  - 適配不同平台的檔案篩選：[apps/filmcraft/src/file_filters.rs](https://github.com/storytold/filmcraft/blob/f731571277192072a78eb8fec56eb8ab723b7217/apps/filmcraft/src/file_filters.rs)（extensions / all_files）；只提供選檔篩選，不是媒體格式或內容驗證。

## lemomo-ai-lemo-opuscar

- 固定版本 `8ca0dd805e214bcc1d30714cd5b9d21cc02a454b`；授權：程式 MIT；文件 CC BY-NC 4.0 與額外有限許可；示範影片 CC BY 4.0，第三方例外
- 用途：以程式碼製作影片；固定版本 README 列 99 種風格，本次僅查影音事件、閱讀時間與字幕匯出。
- 案例：規劃程式影片的文字可讀性與字幕時間驗收；合成文字區塊、音效事件及字幕時間資料 → 事件 JSON、文字可讀性檢查規格及 SRT → 自有影片製作工作區，經資料權利與人工覆核後使用。
- 來源證據：
  - 匯出頁面中的音效事件：[core/render/events.mjs](https://github.com/lemomo-ai/lemo-opuscar/blob/8ca0dd805e214bcc1d30714cd5b9d21cc02a454b/core/render/events.mjs)（window.DUR / window.EV / openDemo）；腳本開啟頁面並寫檔，未測實際音效同步，執行須隔離及核准。
  - 設定文字在畫面上的閱讀時間契約：[core/render/readcheck.mjs](https://github.com/lemomo-ai/lemo-opuscar/blob/8ca0dd805e214bcc1d30714cd5b9d21cc02a454b/core/render/readcheck.mjs)（window.TEXTS(t) / Reading-time self-check）；本次查閱腳本所定義的閱讀時間契約；採樣與閱讀速度假設不取代真人觀賞。
  - 由字幕時間軸匯出 SRT：[core/render/srt.py](https://github.com/lemomo-ai/lemo-opuscar/blob/8ca0dd805e214bcc1d30714cd5b9d21cc02a454b/core/render/srt.py)（fmt / cues）；縮短前一段重疊時間，不保證所有非法時間被拒絕；需核對實際畫面與語音。
