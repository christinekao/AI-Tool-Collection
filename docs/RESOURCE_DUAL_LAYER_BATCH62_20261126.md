# Resource 雙層知識 Batch 62｜短劇生成與影音資料契約

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。

## forget-c-jellyfish

- 固定版本 `ddafcf997d7d50f48051972003aedcaa5ff29d83`；授權：Apache-2.0；影音素材與模型另查
- 用途：AI 短劇工作室提供章節、資產與非同步生成管理；本次聚焦章節查詢、固定資源任務與生成紀錄。
- 案例：規劃短劇專案的章節與生成任務驗收；合成章節、媒體任務及目標識別 → 章節清單、任務接受紀錄及歷史輸出 → 自有影音製作測試區，經資料權利與人工覆核後使用。
- 來源證據：
  - 以專案範圍查詢章節：[backend/app/api/v1/routes/studio/chapters.py](https://github.com/Forget-C/Jellyfish/blob/ddafcf997d7d50f48051972003aedcaa5ff29d83/backend/app/api/v1/routes/studio/chapters.py)（list_chapters / CHAPTER_ORDER_FIELDS）；查詢範圍不等於身分授權；未測資料庫、分頁及權限隔離。
  - 以資源路徑綁定媒體生成：[backend/app/api/v1/routes/studio/generation_tasks.py](https://github.com/Forget-C/Jellyfish/blob/ddafcf997d7d50f48051972003aedcaa5ff29d83/backend/app/api/v1/routes/studio/generation_tasks.py)（_require_image_request / _submit_async_task）；提交回傳 task id 不代表生成完成；需測試 Worker 及實際資料寫入。
  - 分開查詢任務與輸出歷史：[backend/app/api/v1/routes/film/task_status.py](https://github.com/Forget-C/Jellyfish/blob/ddafcf997d7d50f48051972003aedcaa5ff29d83/backend/app/api/v1/routes/film/task_status.py)（list_tasks / list_task_outputs）；此為路由層；實際採用與取消由其他服務處理，未驗證底層狀態一致性。

## waooai-waoowaoo

- 固定版本 `dfec20e32298ed675050329e4a41477024148399`；授權：Elastic License 2.0；託管服務等限制另查
- 用途：AI 影音工作區提供畫布與模型選擇；本次聚焦能力目錄、媒體正規化及資源寫入的檢查腳本。
- 案例：規劃影音工作區的模型與資料寫入規則驗收；合成模型能力設定及測試原始碼 → 欄位契約、媒體路徑與寫入規則檢查規格 → 自有影音工作區的靜態檢查，經資料權利與人工覆核後使用。
- 來源證據：
  - 明確定義不同模型類型的能力欄位：[scripts/check-capability-catalog.mjs](https://github.com/waooAI/waoowaoo/blob/dfec20e32298ed675050329e4a41477024148399/scripts/check-capability-catalog.mjs)（CAPABILITY_NAMESPACE_ALLOWED_FIELDS / parseModelKeyStrict）；只查固定版本欄位契約；未測模型服務實際能力與目錄完整性。
  - 檢查媒體讀取的一致入口：[scripts/check-media-normalization.ts](https://github.com/waooAI/waoowaoo/blob/dfec20e32298ed675050329e4a41477024148399/scripts/check-media-normalization.ts)（extractFetchArg / isSafeFetchArg / main）；以字串及正規表示式檢查，不能當成完整 URL 安全驗證；未執行腳本。
  - 限制工作區資源寫入位置：[scripts/check-workspace-resource-writer.mjs](https://github.com/waooAI/waoowaoo/blob/dfec20e32298ed675050329e4a41477024148399/scripts/check-workspace-resource-writer.mjs)（resourceMutationCount / listSourceFiles）；靜態模式可能漏掉動態行為；不等於執行期資料隔離，須獨立測試。

## ai-video-drama-platform

- 固定版本 `c5889ea7130839cbd03eb83bc34e98bad27c560a`；授權：未找到根授權檔；不授權複製程式
- 用途：短劇後端骨架以結構化分鏡、模型輸出及 FFmpeg 組合圖片；本次核對資料與組裝契約。
- 案例：規劃文字故事至分鏡及測試影片的契約驗收；自有虛構故事、合成分鏡及測試圖片 → 結構化分鏡、生成錯誤及組合影片規格 → 自有短劇原型測試區，經資料權利與人工覆核後使用。
- 來源證據：
  - 定義分鏡資料結構：[app/models/storyboard.py](https://github.com/dc-tw/ai-video-drama-platform/blob/c5889ea7130839cbd03eb83bc34e98bad27c560a/app/models/storyboard.py)（StrictModel / Scene / Storyboard / StoryboardRequest）；欄位型別與範圍不保證角色參照正確或時長合計一致，須加驗跨欄位規則。
  - 處理模型未回傳可解析分鏡：[app/services/storyboard_generator.py](https://github.com/dc-tw/ai-video-drama-platform/blob/c5889ea7130839cbd03eb83bc34e98bad27c560a/app/services/storyboard_generator.py)（StoryboardGenerator.generate / SYSTEM_PROMPT）；Prompt 的角色一致性要求不是已驗證行為；外部模型須核准且不可傳機密內容。
  - 檢查圖片與影片時長的組合輸入：[app/integrations/ffmpeg/composer.py](https://github.com/dc-tw/ai-video-drama-platform/blob/c5889ea7130839cbd03eb83bc34e98bad27c560a/app/integrations/ffmpeg/composer.py)（FFmpegComposer.compose_slideshow）；會寫入檔案且可能覆寫輸出；僅為圖片串接，不代表已完成短劇敘事或音訊品質驗收。
