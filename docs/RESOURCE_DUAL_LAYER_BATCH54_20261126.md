# Resource 雙層知識 Batch 54｜影音製作、任務可靠性與逐鏡分析

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。

## guizang-product-video-skill

- 固定版本 `18842e0f49a9eb2b8c00cc065ec37b314e235aaa`；根授權：AGPL-3.0；預設素材另有授權限制
- 用途：將產品更新與設計素材轉為可編輯的影片製作計畫，並以環境、影音同步及交付檢查輔助驗收。
- 案例：規劃自有產品更新影片的影音同步與交付驗收；自有產品更新摘要、合成分鏡、測試影音及已授權環境。 → 環境缺口清單、音效時間定位與畫面節奏檢查規格。 → 自有產品影片製作工作區，經內容與素材權利覆核後交付。
- 來源證據：
  - 核對影片製作環境：[scripts/check_environment.py](https://github.com/op7418/guizang-product-video-skill/blob/18842e0f49a9eb2b8c00cc065ec37b314e235aaa/scripts/check_environment.py)（main / hyperframes_failures / run）；腳本說明不安裝相依，但會呼叫本機程式；執行需核准可信環境，檢查通過不代表渲染品質。
  - 量測音效的實際起始與峰值：[scripts/sfx_landmarks.py](https://github.com/op7418/guizang-product-video-skill/blob/18842e0f49a9eb2b8c00cc065ec37b314e235aaa/scripts/sfx_landmarks.py)（samples / landmarks）；依 FFmpeg 解碼的單聲道樣本與相對峰值門檻估算；不代表感知響度或實際混音品質。
  - 檢查畫面節奏與開頭可見內容：[scripts/check_delivery.py](https://github.com/op7418/guizang-product-video-skill/blob/18842e0f49a9eb2b8c00cc065ec37b314e235aaa/scripts/check_delivery.py)（pacing_metrics / first_frame_metrics）；依縮小後的亮度差與固定門檻量測，無法判斷審美、內容正確性或字幕可讀性，須人工觀看。

## zhouxiaoka-autoclip

- 固定版本 `2f511907a72cbfbb8d86639f6441967b826acb6a`；根授權：MIT；來源影音及外部服務另查
- 用途：將已授權長影片轉成短影音；本次查核生成工作時間預算、取消控制與日誌敏感資料處理。
- 案例：規劃短影音生成工作的逾時取消與日誌安全驗收；自有合成影音、模擬模型請求及測試工作識別。 → 逾時與取消狀態、保留成片規格及敏感資訊遮罩驗收清單。 → 自有影音處理服務，在隔離環境驗證後整合。
- 來源證據：
  - 限制生成工作累積等待時間：[backend/core/job_budget.py](https://github.com/zhouxiaoka/autoclip/blob/2f511907a72cbfbb8d86639f6441967b826acb6a/backend/core/job_budget.py)（clip_job_read_timeout / bound_clip_job / clip_step_budget）；本機運算可能暫停此預算；不能把模型等待限制當成端到端完成時間保證。
  - 區分取消生成與刪除專案：[backend/core/project_cancellation.py](https://github.com/zhouxiaoka/autoclip/blob/2f511907a72cbfbb8d86639f6441967b826acb6a/backend/core/project_cancellation.py)（cancel / stop / restore）；取消與刪除的語意不同；stop 會清理暫存，涉及寫入及程序終止，須獨立授權及測試。
  - 遮罩工作日誌中的敏感資訊：[backend/core/log_redaction.py](https://github.com/zhouxiaoka/autoclip/blob/2f511907a72cbfbb8d86639f6441967b826acb6a/backend/core/log_redaction.py)（redact_text / RedactingFilter）；依規則匹配而非全面去識別化；不同日誌來源、例外與資料管道仍須獨立核對，不能保證不洩漏。

## juneyaooo-rea-video

- 固定版本 `c11f1bd8fd3edd26a40e8f45be828be685417700`；根授權：Apache-2.0；原影片及外部模型素材權利另查
- 用途：以逐鏡分析、容器 Metadata 與文字圖層量測產生影片製作方式的候選解讀及重製規劃。
- 案例：規劃自有影片的素材分析與原創分鏡製作規格；已授權測試影片、合成文字圖層與人工確認的鏡頭分類。 → 來源線索、文字時間區間與候選製作路徑的驗收規格。 → 自有影片研究與製作工作區，經素材權利及人工覆核後使用。
- 來源證據：
  - 區分影片來源線索與真偽證明：[rea_video/probe.py](https://github.com/JuneYaooo/rea-video/blob/c11f1bd8fd3edd26a40e8f45be828be685417700/rea_video/probe.py)（provenance / _flatten_tags / parse_aigc）；容器文字與 C2PA 標記存在不是簽章有效性證明；缺少 Metadata 不代表非 AI 生成，禁止作為單一真偽依據。
  - 追蹤文字圖層的時間區間：[rea_video/packaging.py](https://github.com/JuneYaooo/rea-video/blob/c11f1bd8fd3edd26a40e8f45be828be685417700/rea_video/packaging.py)（build_cues / _blocks / _similar）；位置與文字相似度為啟發式，快速字幕、模糊畫面與特殊排版需要人工覆核。
  - 依鏡頭類型規劃候選製作方式：[rea_video/plan.py](https://github.com/JuneYaooo/rea-video/blob/c11f1bd8fd3edd26a40e8f45be828be685417700/rea_video/plan.py)（Planner.plan_shot / LABEL_ROUTE / code_scene）；候選方案不是已完成影片；外部模型、真實素材與產出權利須另核准，對真人肖像與聲音不得擅自重製。
