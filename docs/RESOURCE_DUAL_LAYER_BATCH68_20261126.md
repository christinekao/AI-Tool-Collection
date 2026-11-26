# Resource 雙層知識 Batch 68｜內容研究、簡報與企業整合

固定版本局部來源查核；保留原始用途、分類領域、Tags 與關聯。未實測第三方工具。

## blogger-distiller

- 固定版本 `1d787e721b4518e145dd829e29f1a5af175ed294`；授權：MIT；社群內容及個資另有權利；mapped
- 用途：內容研究工具的資料品質分級、評論身分欄位處理及完整性檢查；本次限自有合成資料。
- 案例：規劃內容研究資料的隱私與品質驗收；自行撰寫合成貼文、評論與缺漏欄位 → 欄位遮蔽、完整性分級及阻斷紀錄 → 私人內容研究測試區，經資料權利及人工覆核後使用。
- 來源證據：
  - 移除評論中的指定身分欄位：[scripts/utils/privacy.py](https://github.com/otter1101/blogger-distiller/blob/1d787e721b4518e145dd829e29f1a5af175ed294/scripts/utils/privacy.py)（anonymize_comments / _IDENTITY_FIELDS）；評論正文仍可能含個資，不能視為匿名化保證；僅用合成資料。
  - 依欄位完整性區分資料品質：[scripts/utils/quality.py](https://github.com/otter1101/blogger-distiller/blob/1d787e721b4518e145dd829e29f1a5af175ed294/scripts/utils/quality.py)（check_note_quality / merge_note_supplement）；資料欄位齊全不證明真實性；不擷取受限內容。
  - 設定正文完整性的阻斷門檻：[scripts/verify.py](https://github.com/otter1101/blogger-distiller/blob/1d787e721b4518e145dd829e29f1a5af175ed294/scripts/verify.py)（check_content_completeness / check_note_count）；字數門檻不等於內容品質；未驗證平台取得權利或實際分析。

## bobyu89-codex-ppt-style-expanded

- 固定版本 `8d759f5287e631623d6a9c86b2fee218a28804af`；授權：MIT；第三方範例與素材另查；mapped
- 用途：SlideWeave 簡報製作工具的離線風格檢索、版面座標驗證與原生可編輯物件組裝。
- 案例：規劃可編輯技術簡報的風格與版面驗收；自編技術簡報內容、樣式資料及授權圖片 → 風格候選、版面錯誤及可編輯簡報規格 → 自有技術交接簡報工作區，經資料權利及人工覆核後使用。
- 來源證據：
  - 離線檢索風格與模板：[skills/codex-ppt-style-expanded/scripts/search_styles.py](https://github.com/bobyu89/codex-ppt-style-expanded/blob/8d759f5287e631623d6a9c86b2fee218a28804af/skills/codex-ppt-style-expanded/scripts/search_styles.py)（records / main）；關鍵字匹配非語意最佳化；第三方模板授權須另查。
  - 檢查投影片版面座標：[skills/codex-ppt-style-expanded/scripts/assemble_editable.py](https://github.com/bobyu89/codex-ppt-style-expanded/blob/8d759f5287e631623d6a9c86b2fee218a28804af/skills/codex-ppt-style-expanded/scripts/assemble_editable.py)（box_coords / add_picture）；座標合法不代表沒有文字溢位或重疊；須實際渲染。
  - 區分原生文字與生成背景：[skills/codex-ppt-style-expanded/scripts/assemble_editable.py](https://github.com/bobyu89/codex-ppt-style-expanded/blob/8d759f5287e631623d6a9c86b2fee218a28804af/skills/codex-ppt-style-expanded/scripts/assemble_editable.py)（assemble / add_picture）；僅局部組裝契約；未建立檔案或確認 PowerPoint 播放。

## ecpay-ecpay-api-skill

- 固定版本 `e8cc595d7ca40b54ba8ccd4799f9fd3b0fe11f44`；授權：All Rights Reserved；有限閱讀與測試許可，不重製原文；evidence-linked
- 用途：綠界官方 API 整合指引；本次查核服務選擇、規格索引及測試與上線流程文件，非完整 SDK 審查。
- 案例：規劃企業金流與發票整合的測試驗收清單；虛構訂單、業務需求與官方規格索引 → 服務選擇、待核對 API 及測試清單 → 隔離的企業整合設計工作區，經資料權利及人工覆核後使用。
- 來源證據：
  - 依業務需求選擇整合服務：[SKILL.md](https://github.com/ECPay/ECPay-API-Skill/blob/e8cc595d7ca40b54ba8ccd4799f9fd3b0fe11f44/SKILL.md)（工作流程 / 步驟 1：需求釐清 / 步驟 2：方案推薦）；不進行付款或正式交易；服務資格及條款須向官方確認。
  - 按服務查閱官方規格：[references/README.md](https://github.com/ECPay/ECPay-API-Skill/blob/e8cc595d7ca40b54ba8ccd4799f9fd3b0fe11f44/references/README.md)（用途 / Payment / Invoice）；本次只查索引，未查所有端點與最新規格。
  - 區分測試驗證與正式上線：[SKILL.md](https://github.com/ECPay/ECPay-API-Skill/blob/e8cc595d7ca40b54ba8ccd4799f9fd3b0fe11f44/SKILL.md)（步驟 4：測試驗證 / 步驟 5：上線檢查）；未操作正式帳號、金流、發票或憑證；需獨立安全驗收。
