# Resource 雙層知識 Batch 48｜文字與介面品質

2 mapped、1 evidence-linked 候選、9 用途、6 局部程式能力、3 文件證據、3 design-only 案例。未執行第三方工具；保留原 ID、Tags、關聯和分類領域。

## blader-humanizer

- 固定版本 `a32f24407364c74c812b43c15926d638bee1e072`；根授權：MIT
- 用途：把冗長、制式或不符合讀者需求的文字改得更直接，同時保留原意、事實、引文及作者語氣。
- 案例：規劃技術文件與工作訊息的保真文字編輯；自有工作訊息、原始技術文件與可選作者風格範例。 → 改寫候選、保留的數字與引用核對清單、最後可供審閱的文稿。 → 自有文件及工作訊息的編輯流程，經內容擁有者確認後使用。
- 文件證據：
  - 辨識會干擾閱讀的制式句型：[SKILL.md](https://github.com/blader/humanizer/blob/a32f24407364c74c812b43c15926d638bee1e072/SKILL.md)（How to work / Mark the tells）；前五項強特徵與弱特徵門檻不同；口語訊息沒有足夠特徵時保留原文，不判定作者是不是 AI。
  - 依作者風格改寫並核對事實：[SKILL.md](https://github.com/blader/humanizer/blob/a32f24407364c74c812b43c15926d638bee1e072/SKILL.md)（How to work / Check the draft / Voice）；保留全部受支持的資訊，不能捏造細節；樣本優先於一般風格規則。
  - 依對話或檔案模式交付：[SKILL.md](https://github.com/blader/humanizer/blob/a32f24407364c74c812b43c15926d638bee1e072/SKILL.md)（What to return）；檔案模式會寫入指定文件，只能改散文，程式碼、路徑、YAML、資料和連結目標不動；改寫需有權限。

## heydamir-unslop

- 固定版本 `620163eedb3529d9cd23a3994ed8d287d06f760d`；根授權：CC BY 4.0（Damir Sokolovsky；改作需保留署名）
- 用途：找出介面過度裝飾與視覺不一致的問題，在保留功能、內容及順序的前提下規劃改善，並製作前後對照。
- 案例：規劃儀表板視覺改善與前後對照驗收；自有測試儀表板、合成資料、已核准設計方向與視覺變更範圍。 → 本機頁面副本、設計問題清單、前後畫面及操作回歸的驗收規格。 → 自有產品介面開發與設計評審，不自動發布。
- 程式證據：
  - 保存原始介面作為比較基準：[skills/unslop/scripts/snapshot.mjs](https://github.com/heydamir/unslop/blob/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/scripts/snapshot.mjs)（browserKit / inline / size）；需要 Playwright 與瀏覽器；會連網並嘗試內嵌小於 3 MB 的資源，失敗保留網址；本機副本不是完整網站功能，需核准讀取範圍。
  - 限制對照影片伺服器的檔案路徑：[skills/unslop/scripts/story-path.mjs](https://github.com/heydamir/unslop/blob/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/scripts/story-path.mjs)（resolveStoryFile）；以 realpath 與 relative 核對範圍，拒絕根目錄和外部符號連結；不代表整個伺服器已通過安全審查。
  - 驗證前後對照故事的畫面設定：[skills/unslop/scripts/story.mjs](https://github.com/heydamir/unslop/blob/620163eedb3529d9cd23a3994ed8d287d06f760d/skills/unslop/scripts/story.mjs)（meta / steps / frameRaw）；步驟不能為空，frame 必須三個數字且寬度大於零；警告不等於阻止輸出；輸出影片需要 ffmpeg，實際畫面與功能需另驗收。

## lieflat-less-ai-tone

- 固定版本 `fe77df00a27cf94428632ad449a4aecdcb83db41`；根授權：CC BY-NC 4.0；商業使用須另取得授權
- 用途：先量化並定位文章中的制式表達，再由人工確認修改範圍，保留原有事實和結構並產生改寫前後對照。
- 案例：規劃中文技術文章的分級審查與保真改寫；自行撰寫的中文 Markdown 文章、事實清單與可選寫作風格規範。 → 改前命中報告、人工確認範圍及前後對比文件的驗收規格。 → 自有中文技術知識庫的文章編輯與內容品質審查。
- 程式證據：
  - 保留可回查的文字特徵統計：[scripts/detect.py](https://github.com/larashero3-dotcom/lieflat-less-ai-tone/blob/fe77df00a27cf94428632ad449a4aecdcb83db41/scripts/detect.py)（REGEX_HITS / measure_docs / main）；僅偵測不改稿；已否決 X 類仍列入報告且不修改，閾值需針對語料重標；命中不能證明作者為 AI。
  - 抽取需要語意判斷的候選：[scripts/detect.py](https://github.com/larashero3-dotcom/lieflat-less-ai-tone/blob/fe77df00a27cf94428632ad449a4aecdcb83db41/scripts/detect.py)（extract_candidates）；候選須由另行語意判讀確認；不可把正則候選等同有效命中；修改須先得到作者同意。
  - 產生改寫前後的對照報告：[scripts/report.py](https://github.com/larashero3-dotcom/lieflat-less-ai-tone/blob/fe77df00a27cf94428632ad449a4aecdcb83db41/scripts/report.py)（metric_table / build_report / build_report_md）；報告的指標方向並不保證語意品質；使用者核准後才能改稿，繁中語料適用性及統計研究尚未獨立驗證。
