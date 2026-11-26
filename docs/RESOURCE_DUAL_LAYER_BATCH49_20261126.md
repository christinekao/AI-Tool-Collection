# Resource 雙層知識 Batch 49｜影音任務與分鏡製作

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。固定版本局部程式與根授權查核；未執行第三方工具。保留原 ID、Tags、分類及關聯。

## harry0703-moneyprinterturbo

- 固定版本 `2dc10e850d78c61264a64ea180def2b7f1f334d8`；根授權：MIT；素材及模型授權另查
- 用途：將自有主題或腳本轉為短影音，管理任務資料、素材與輸出，並可檢查部分影片方向異常。
- 案例：規劃知識短影音的任務清單與素材品質驗收；自撰教學稿、已授權的測試影片與輸出規格。 → 任務清單、素材方向檢查結果及輸出連結驗收規格。 → 自有影音製作流程，由人工檢查內容與授權後交付。
- 程式證據：
  - 保存可回查的任務清單：[app/services/task_artifacts.py](https://github.com/harry0703/MoneyPrinterTurbo/blob/2dc10e850d78c61264a64ea180def2b7f1f334d8/app/services/task_artifacts.py)（write_script_data / patch_script_data / _write_json_atomic）；同目錄暫存後以 os.replace 替換；補寫失敗回 False，不阻斷主流程；程序內鎖不等於跨程序交易。
  - 辨識方向異常的素材：[app/services/video_orientation.py](https://github.com/harry0703/MoneyPrinterTurbo/blob/2dc10e850d78c61264a64ea180def2b7f1f334d8/app/services/video_orientation.py)（SidewaysDetector.is_sideways / SidewaysDetector.is_sideways_video / _fetch_model）；至少三幀同方向才判定，衝突或例外回 False；模型下載驗證大小與 SHA-256，False 不代表所有畫面方向正確。
  - 將任務產物整理成可回查連結：[app/controllers/v1/video.py](https://github.com/harry0703/MoneyPrinterTurbo/blob/2dc10e850d78c61264a64ea180def2b7f1f334d8/app/controllers/v1/video.py)（_public_task_data / _task_file_to_uri）；已是 HTTP(S) 的值原樣返回；不安全本機路徑保留原值而不組 URL；路由驗證在 API key 未配置時可免認證，須另驗證權限。

## hbai-ltd-toonflow-app

- 固定版本 `eecf51547af47eb504822186bd3f2dee369125ff`；根授權：MIT；外部模型、素材及服務條款另查
- 用途：在視覺化工作區安排劇本、分鏡與媒體生成，讓圖片、影片及音訊工作可查詢與取消。
- 案例：規劃分鏡工作區的媒體生成與取消驗收；自有分鏡、合成圖片與已核准的測試工作區。 → 媒體任務 ID、狀態紀錄、取消及重試驗收規格。 → 自有影音工作台，產物與費用由使用者獨立覆核。
- 程式證據：
  - 啟動指定類型的媒體任務：[apps/server/src/routes/ai/media/generate.ts](https://github.com/HBAI-Ltd/Toonflow-app/blob/eecf51547af47eb504822186bd3f2dee369125ff/apps/server/src/routes/ai/media/generate.ts)（mediaGeneration.generateMedia / mediaTasks.start / mediaSchemas）；依類型驗證 schema，解析工作區與請求身分；帶任務 ID 時回傳任務識別而非生成完成；斷線處理不等於所有供應商工作已停止。
  - 查詢多筆媒體任務狀態：[apps/server/src/routes/ai/media/tasks/status.ts](https://github.com/HBAI-Ltd/Toonflow-app/blob/eecf51547af47eb504822186bd3f2dee369125ff/apps/server/src/routes/ai/media/tasks/status.ts)（mediaTasks.status / resolveWorkspace）；resume=true 傳入底層服務，不宣稱唯讀；no-store 防止快取，底層恢復與隔離尚未查核。
  - 提出一批媒體任務取消要求：[apps/server/src/routes/ai/media/tasks/cancel.ts](https://github.com/HBAI-Ltd/Toonflow-app/blob/eecf51547af47eb504822186bd3f2dee369125ff/apps/server/src/routes/ai/media/tasks/cancel.ts)（mediaTasks.cancel / requestIdentity）；路由傳遞工作區及身分，回應未逐筆證明外部工作停止；須查詢最終狀態與費用。

## chatfire-ai-huobao-drama

- 固定版本 `24d4c17612e71cf10c8eeb1a8b6439afa73e2c07`；根授權：CC BY-NC-SA 4.0；商業使用須另取得授權
- 用途：把自有劇本拆成角色、場景、道具與分鏡，保存媒體提示詞及生成任務的診斷資訊。
- 案例：規劃自有短劇的角色資產與分鏡提示詞驗收；自撰劇本、虛構角色與場景資料、核准的測試模型。 → 角色與場景提示詞清單、分鏡任務狀態和診斷驗收規格。 → 自有短劇原型工作區，供人工逐鏡覆核及權利審查。
- 程式證據：
  - 保存角色、場景與道具的提示詞：[backend/src/services/final-prompt.ts](https://github.com/chatfire-AI/huobao-drama/blob/24d4c17612e71cf10c8eeb1a8b6439afa73e2c07/backend/src/services/final-prompt.ts)（ensureCharacterFinalPrompt / ensureSceneFinalPrompt / ensurePropFinalPrompt）；預設重用既有值；force 才重做；Agent 上限 12 步，重新查資料庫，失敗回空字串，不能當成已成功生成圖片。
  - 批次補充分鏡影片提示詞：[backend/src/services/video-prompts.ts](https://github.com/chatfire-AI/huobao-drama/blob/24d4c17612e71cf10c8eeb1a8b6439afa73e2c07/backend/src/services/video-prompts.ts)（startVideoPromptBatch / getVideoPromptBatchStatus）；執行中不重啟；指定 ID 可重新生成；每鏡以資料庫非空提示詞計成功，並不驗證品質；程序重啟後狀態消失。
  - 回查生成任務的診斷資訊：[backend/src/routes/tasks.ts](https://github.com/chatfire-AI/huobao-drama/blob/24d4c17612e71cf10c8eeb1a8b6439afa73e2c07/backend/src/routes/tasks.ts)（/:id/diagnostics / safeTaskError）；回應只標示結果 URL 或本機路徑是否存在於資料列，不驗證檔案可讀或內容正確；錯誤處理與權限需獨立驗收。
