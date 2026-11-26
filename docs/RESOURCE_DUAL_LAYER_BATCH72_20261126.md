# Resource 雙層知識 Batch 72｜動態圖示、視覺規格與媒體產物治理

固定版本局部查核；保留原始用途、分類領域、Tags 與關聯。未實測第三方工具。

## citypulso-pulsoicon

- 固定版本 `123b920e7cfc70cf9c911cc54d420f00a66b97e8`；授權：ISC 根授權；第三方圖示另有條款；mapped
- 用途：動畫圖示套件；本次限 Kotlin Compose 的播放、實心圖示動效及 Keyframe 插值。
- 案例：規劃動態圖示的播放狀態與無障礙驗收；合成圖示、動效設定與系統動畫偏好 → 播放停止狀態、實心替代與時間插值規格 → 自有前端元件設計測試區，經資料權利及人工覆核後使用。
- 來源證據：
  - 尊重系統關閉動畫設定：[kotlin/pulsoicon/src/main/java/com/citypulso/pulsoicon/PulsoIcon.kt](https://github.com/CityPulso/PulsoIcon-Package/blob/123b920e7cfc70cf9c911cc54d420f00a66b97e8/kotlin/pulsoicon/src/main/java/com/citypulso/pulsoicon/PulsoIcon.kt)（Player / start / stop / rest）；僅核對 Compose 實作；未驗證其他框架或系統設定變化。
  - 區分輪廓及實心圖示動效：[kotlin/pulsoicon/src/main/java/com/citypulso/pulsoicon/PulsoIconSpec.kt](https://github.com/CityPulso/PulsoIcon-Package/blob/123b920e7cfc70cf9c911cc54d420f00a66b97e8/kotlin/pulsoicon/src/main/java/com/citypulso/pulsoicon/PulsoIconSpec.kt)（IconMotion / tracks / solidTracks）；需獨立核對各圖示素材授權及呈現品質。
  - 以時間及 Keyframe 計算動效值：[kotlin/pulsoicon/src/main/java/com/citypulso/pulsoicon/Recipe.kt](https://github.com/CityPulso/PulsoIcon-Package/blob/123b920e7cfc70cf9c911cc54d420f00a66b97e8/kotlin/pulsoicon/src/main/java/com/citypulso/pulsoicon/Recipe.kt)（Track / valueAt / Curve）；假設合法時間及 Keyframe 資料；未實測邊界或效能。

## punk-skill

- 固定版本 `15b816cea5dcc7a3b028561d34604246369939b0`；授權：v2.0+ 個人非商業免費；商業需書面授權及費用，舊版 MIT 不適用目前版本；mapped
- 用途：視覺生成 Skill 的靜態封面與頭像契約檢查，並區分平台要求及模型生成比例。
- 案例：規劃非商業視覺提示詞庫的規格驗收；自有虛構主題、風格索引與比例需求 → 風格欄位、頭像規則及比例差異紀錄 → 非商業個人視覺學習工作區，經資料權利及人工覆核後使用。
- 來源證據：
  - 檢查封面規格必要檔案及欄位：[scripts/validate-punk-cover.mjs](https://github.com/adrianpunk/Punk-Posters/blob/15b816cea5dcc7a3b028561d34604246369939b0/scripts/validate-punk-cover.mjs)（requiredStyleFields / fencedYaml / fail）；字串檢查不是生成品質驗證；目前版本不得擅作商業使用。
  - 核對頭像風格清單與編譯規則：[scripts/validate-punk-avatar.mjs](https://github.com/adrianpunk/Punk-Posters/blob/15b816cea5dcc7a3b028561d34604246369939b0/scripts/validate-punk-avatar.mjs)（allowedStyleIds / catalogStyleIds / fail）；僅檢查靜態文件，未生成真人或影像；不使用真實肖像。
  - 區分封面需求與生成比例：[skills/punk-cover/references/platform-catalog.md](https://github.com/adrianpunk/Punk-Posters/blob/15b816cea5dcc7a3b028561d34604246369939b0/skills/punk-cover/references/platform-catalog.md)（Supported generation ratios / Platform choices）；文件為作者規格，未核對最新平台要求；需以自有素材驗收。

## openmontage

- 固定版本 `2e003e65fa99a0f329478a2c1cdcf26bc481933a`；授權：AGPL-3.0；素材與外部模型另查；mapped
- 用途：影音工作流的產物 Schema、媒體請求報價與非同步工作收據契約。
- 案例：規劃影音工作流的產物與付費請求驗收；合成產物、媒體請求與模擬工作狀態 → Schema 驗證、需報價狀態及工作收據規格 → 自有影音工作流測試區，經資料權利及人工覆核後使用。
- 來源證據：
  - 使用命名 Schema 驗證產物：[schemas/artifacts/__init__.py](https://github.com/OpenMontageInc/OpenMontage/blob/2e003e65fa99a0f329478a2c1cdcf26bc481933a/schemas/artifacts/__init__.py)（ARTIFACT_NAMES / load_schema / validate_artifact）；格式驗證不代表故事、素材或影片品質；只使用可信名稱。
  - 在付費媒體請求前要求報價：[tools/schema_media.py](https://github.com/OpenMontageInc/OpenMontage/blob/2e003e65fa99a0f329478a2c1cdcf26bc481933a/tools/schema_media.py)（SchemaMedia / estimate_cost / build_request）；未取得實際報價、未提交任何媒體生成；動態服務規格須另查。
  - 分離工作輪詢與重新提交：[tools/provider_jobs.py](https://github.com/OpenMontageInc/OpenMontage/blob/2e003e65fa99a0f329478a2c1cdcf26bc481933a/tools/provider_jobs.py)（poll / save_job）；本次只查狀態與寫檔契約；不得自動重送真實付費請求。
