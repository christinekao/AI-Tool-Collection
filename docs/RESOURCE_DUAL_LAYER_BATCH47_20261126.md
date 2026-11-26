# Resource 雙層知識 Batch 47｜語音與影音製作

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。固定版本局部來源與根授權查核，未執行第三方工具；保留原 ID、分類、Tags 與關聯。

## debpalash-voicestudio

- 版本 `d9061408c20406dfb1b1cbb80450549533c70b0a`；根授權：AGPL-3.0；模型權重另有條款
- 用途：把授權腳本或影片製成語音、配音及可回查的音訊，並在使用模型前辨識授權與部署限制。
- 案例：規劃雙語教學影片配音與音訊品質驗收；自行撰寫的雙語教學腳本、已授權的測試影片與模型清單。 → 模型授權確認表、配音背景保留條件與音訊品質驗收規格。 → 自有教學影音編輯流程，供人工覆核後決定是否發布。
- 程式證據：
  - 審查模型下載的授權證據：[backend/api/routers/model_licenses.py](https://github.com/debpalash/VoiceStudio/blob/d9061408c20406dfb1b1cbb80450549533c70b0a/backend/api/routers/model_licenses.py)（prepare_model_install / commit_model_install）；prepare 只讀內建證據；commit 先記錄確認再下載，原始碼明示目前沒有啟用的正式 reviewed rows，不宣稱可直接下載所有模型。
  - 保留配音影片的背景聲音：[backend/api/routers/dub_export.py](https://github.com/debpalash/VoiceStudio/blob/d9061408c20406dfb1b1cbb80450549533c70b0a/backend/api/routers/dub_export.py)（_preserved_background）；若沒有成功分離背景，會回退到僅人聲；若原始音訊或對話時間缺失會回傳 409，須驗收最終混音。
  - 檢查生成音訊品質：[backend/api/routers/generation.py](https://github.com/debpalash/VoiceStudio/blob/d9061408c20406dfb1b1cbb80450549533c70b0a/backend/api/routers/generation.py)（generated_audio_quality）；僅處理符合格式且存在的 WAV；分析失敗回 422；音訊指標不等於語意與發音正確。

## leemysw-yovoice

- 版本 `179e95bf7ec8a8722b80729a75b778e962149ae2`；根授權：Apache-2.0；模型及素材授權另查
- 用途：將文字轉為旁白、角色語音或音樂，管理生成版本與輸出音檔，適合反覆修改的本機音訊製作。
- 案例：規劃多版本旁白生成與本機音檔管理；自行撰寫的兩段旁白、作品名稱、合成模型及測試參數。 → 旁白版本、取消與錯誤行為，以及音檔與歷史紀錄的驗收規格。 → 自有教學影片或語言練習素材的人工選版工作流。
- 程式證據：
  - 檢查旁白與模型參數：[internal/schema/validate.go](https://github.com/leemysw/yovoice/blob/179e95bf7ec8a8722b80729a75b778e962149ae2/internal/schema/validate.go)（Validate / TextLen）；一般文字上限 12000 UTF-16 單位、標題上限 120；音樂與樂譜另走分支，不能套用相同規則。
  - 生成可回查的語音版本：[internal/workbench/generation.go](https://github.com/leemysw/yovoice/blob/179e95bf7ec8a8722b80729a75b778e962149ae2/internal/workbench/generation.go)（Synthesize / startGeneration / generateTake）；取消時等待操作收尾；未就緒或安裝中的模型會拒絕生成；檔案與歷史保存須另做實際測試。
  - 建立可辨認的音檔名稱：[internal/workbench/output_name.go](https://github.com/leemysw/yovoice/blob/179e95bf7ec8a8722b80729a75b778e962149ae2/internal/workbench/output_name.go)（outputFileName / outputSummary）；檔名會包含正文摘要，可能暴露敏感文字；不得把檔名當成匿名 ID 或唯一性保證。

## ath-maas-pixelle-video

- 版本 `848b054e4fae40dabc62ec58e960b573e83793ac`；根授權：Apache-2.0；模型、素材及外部服務條款另查
- 用途：把主題或自備文案轉成分鏡旁白、配圖規劃、語音與影片，能替換媒體生成工作流和版型。
- 案例：規劃自有知識短影音的分鏡與合成驗收；自撰知識短文、三個分鏡、授權素材及已核准的語音與媒體工作流。 → 旁白清單、語音檔時長及影片尺寸、檔案與人工品質驗收規格。 → 自有短影音製作流程，發布前由人工核對內容及權利。
- 程式證據：
  - 從主題生成分鏡旁白：[api/routers/content.py](https://github.com/ATH-MaaS/Pixelle-Video/blob/848b054e4fae40dabc62ec58e960b573e83793ac/api/routers/content.py)（generate_narration）；委派 LLM 生成，字數和分鏡內容仍須驗證；外部模型可能收到文字並產生費用。
  - 將旁白轉成音檔並取得時長：[api/routers/tts.py](https://github.com/ATH-MaaS/Pixelle-Video/blob/848b054e4fae40dabc62ec58e960b573e83793ac/api/routers/tts.py)（tts_synthesize）；voice_id 已標記 deprecated；程式記錄文字前 50 字，需注意日誌隱私與工作流可能外送資料。
  - 依模板合成完整影片：[api/routers/video.py](https://github.com/ATH-MaaS/Pixelle-Video/blob/848b054e4fae40dabc62ec58e960b573e83793ac/api/routers/video.py)（generate_video_sync / path_to_url）；同步流程要求 frame_template 並從模板取得媒體尺寸；長影片可能逾時；檔案 URL 不代表已完成權限或發布驗收。
