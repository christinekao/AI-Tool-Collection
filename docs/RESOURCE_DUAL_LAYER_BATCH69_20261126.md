# Resource 雙層知識 Batch 69｜影音生成、封面與媒體契約

固定版本局部來源查核；保留原始用途、分類領域、Tags 與關聯。未實測第三方工具。

## gbro-collage-broll

- 固定版本 `a1a4ee2e2abf7d44e460026b706d0c72c2cf8a91`；授權：MIT；模型費用及素材權利另查；mapped
- 用途：紙拼貼風 B-roll 製作工具的環境檢查、影片輸入正規化及首尾影格請求契約。
- 案例：規劃自有教學短片的首尾影格生成驗收；自編旁白、合成首尾影格及測試參數 → 環境檢核、媒體參數及請求驗收規格 → 自有短影音製作測試工作區，經資料權利及人工覆核後使用。
- 來源證據：
  - 檢查模型執行環境前提：[scripts/check_setup.sh](https://github.com/pyang5166/gbro-collage-broll/blob/a1a4ee2e2abf7d44e460026b706d0c72c2cf8a91/scripts/check_setup.sh)（VENV_PY / FAIL / ok / bad）；不執行安裝、不讀取真實 API Key；存在檢查不等於服務可用。
  - 正規化模型媒體參照：[scripts/generate_video.py](https://github.com/pyang5166/gbro-collage-broll/blob/a1a4ee2e2abf7d44e460026b706d0c72c2cf8a91/scripts/generate_video.py)（is_file_uri / normalize_file_uri / slugify）；URI 正規化不是權限或來源驗證；不得上傳私密媒體。
  - 設定首尾影格與輸出需求：[scripts/generate_veo_first_last.py](https://github.com/pyang5166/gbro-collage-broll/blob/a1a4ee2e2abf7d44e460026b706d0c72c2cf8a91/scripts/generate_veo_first_last.py)（image_from_path / main）；腳本有外部服務及寫檔相依；未執行或產生影片。

## gbro-cover-design

- 固定版本 `8d1a0a5487e9ee6539b2b0a471b58469aadfedd6`；授權：MIT；衍生範本來源及人物肖像另查；evidence-linked
- 用途：由文章產出固定直式比例的封面提示詞；本次查核配置、三輪選擇及構圖規格。
- 案例：規劃文章封面提示詞與素材權利驗收；自有文章、虛構人物描述及自有素材 → 標題候選、構圖選擇及封面提示詞 → 自有文章封面設計工作區，經資料權利及人工覆核後使用。
- 來源證據：
  - 確認參考圖與模型支援：[SKILL.md](https://github.com/pyang5166/gbro-cover-design/blob/8d1a0a5487e9ee6539b2b0a471b58469aadfedd6/SKILL.md)（首次使用 / 首次配置）；配置可能保存照片路徑；需明確同意且不傳送真實肖像。
  - 先確定標題與構圖：[SKILL.md](https://github.com/pyang5166/gbro-cover-design/blob/8d1a0a5487e9ee6539b2b0a471b58469aadfedd6/SKILL.md)（第一轮 / 第二轮 / 第三轮）；提示詞方向非實際生成品質，不能保證觀看或轉換成效。
  - 依參考範例細化空間關係：[references/examples.md](https://github.com/pyang5166/gbro-cover-design/blob/8d1a0a5487e9ee6539b2b0a471b58469aadfedd6/references/examples.md)（示例提示词库 / 示例1 / 示例3）；原資源僅輸出提示詞；未執行生成，不複製第三方範例。

## hkuds-vimax

- 固定版本 `fd4b72e7731be6e5f88486206d25ea59849b0285`；授權：MIT；外部模型與影音素材另查；mapped
- 用途：Agentic Video Generation 的媒體後端配置、圖片回應解析及方向檢查契約。
- 案例：規劃影片生成後端的圖片格式與配置驗收；合成 YAML 設定、測試圖片及模型回應 → 後端配置規格、圖片解析及比例判定 → 自有影音生成原型測試區，經資料權利及人工覆核後使用。
- 來源證據：
  - 以配置選擇影像與影片後端：[tools/render_backend.py](https://github.com/HKUDS/ViMax/blob/fd4b72e7731be6e5f88486206d25ea59849b0285/tools/render_backend.py)（RenderBackend.from_config / _build_rate_limiter）；動態載入須限制可信模組；未建立或呼叫任何模型服務。
  - 解析模型回傳的圖片資料：[tools/image_response.py](https://github.com/HKUDS/ViMax/blob/fd4b72e7731be6e5f88486206d25ea59849b0285/tools/image_response.py)（image_from_response_part / _value）；資料解析可能拋錯；不是惡意檔案或內容安全檢查。
  - 核對圖片方向要求：[tools/image_orientation.py](https://github.com/HKUDS/ViMax/blob/fd4b72e7731be6e5f88486206d25ea59849b0285/tools/image_orientation.py)（landscape_guard_requested / ensure_not_portrait / _parse_size）；方向驗證不等於影像品質；容忍值和外部生成重試需獨立驗證。
