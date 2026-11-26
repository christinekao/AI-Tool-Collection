# Resource 雙層知識 Batch 67｜生活紀錄、設計方向與色彩知識

固定版本局部來源查核；保留原始用途、分類領域、Tags 與關聯。未實測第三方工具。

## acheaisuiyimen-ache-life-to-comic-skill

- 固定版本 `bcc35f487a838cf8d86e6a2624553a1c1a59029e`；授權：PolyForm Noncommercial 1.0.0；素材授權另查；mapped
- 用途：將生活紀錄組織為漫畫手帳；本次聚焦有界上下文、圖片素材契約及原始照片驗收。
- 案例：規劃非商業生活漫畫手帳的素材與原文保真驗收；自有合成紀錄、測試照片與封面資料 → 上下文包、素材檢查及照片一致性紀錄 → 非商業個人手帳測試區，經資料權利及人工覆核後使用。
- 來源證據：
  - 限制手帳上下文讀取：[scripts/context-pack.mjs](https://github.com/acheAIsuiyimen/ache-life-to-comic-skill/blob/bcc35f487a838cf8d86e6a2624553a1c1a59029e/scripts/context-pack.mjs)（buildContextPack / appendBounded / DEFAULT_LIMITS）；字元預算不是模型 Token 保證，也不是隱私遮蔽；須核准外送資料。
  - 定義圖片角色及尺寸契約：[scripts/asset-contract.mjs](https://github.com/acheAIsuiyimen/ache-life-to-comic-skill/blob/bcc35f487a838cf8d86e6a2624553a1c1a59029e/scripts/asset-contract.mjs)（pngSize / jpegSize / svgSize / ASSET_CONTRACT_VERSION）；只查圖片尺寸辨識與角色常數，不宣稱安全解析所有檔案；未實際產生圖像。
  - 比對原始照片與保留版本：[scripts/validate-entry.mjs](https://github.com/acheAIsuiyimen/ache-life-to-comic-skill/blob/bcc35f487a838cf8d86e6a2624553a1c1a59029e/scripts/validate-entry.mjs)（validateEntry / hashFile）；雜湊相同是位元一致，不等於內容適合公開；素材權利另核對。

## alchaincy-huashu-design

- 固定版本 `59065698ad63f87ea1532c126c87f488d4f93fd6`；授權：MIT；外部素材與字型另查；evidence-linked
- 用途：以 HTML 設計原型、簡報與動效的工作方法；本次查核設計上下文、方向選擇與截圖打磨文件，不把 Skill 當成已實測應用。
- 案例：規劃自有前端原型的設計方向與畫面驗收；自有產品需求、設計規範及已授權參考 → 設計依據、方向初稿與逐輪畫面驗收紀錄 → 自有設計收藏與產品原型工作區，經資料權利及人工覆核後使用。
- 來源證據：
  - 從既有設計系統提取規格：[references/design-context.md](https://github.com/alchaincyf/huashu-design/blob/59065698ad63f87ea1532c126c87f488d4f93fd6/references/design-context.md)（Design Context / Step 3 / Step 4）；沒有原始系統時明確標為 fallback；不得冒用品牌資產。
  - 先選方向再深入製作：[SKILL.md](https://github.com/alchaincyf/huashu-design/blob/59065698ad63f87ea1532c126c87f488d4f93fd6/SKILL.md)（description / 兩種走法）；此為 Skill 規範；不保證生成品質，也不適用於需後端的正式產品。
  - 逐輪截圖定位主要問題：[references/polish-loop.md](https://github.com/alchaincyf/huashu-design/blob/59065698ad63f87ea1532c126c87f488d4f93fd6/references/polish-loop.md)（改什么 / 看几轮 / 没有看图能力时）；沒有看圖能力時如實揭露；未執行畫面驗收。

## ayueh0102-ronnier-skill

- 固定版本 `098782f116d86fdc4ab60ca3ab3ba235a5fce5b5`；授權：固定版本根目錄未見授權檔；不重製課程筆記；evidence-linked
- 用途：非官方色彩科學學習筆記；本次聚焦課堂與標準說法的區分、名詞歧義及原始論文索引。
- 案例：規劃色彩科學學習筆記的名詞與證據核對；自編色彩學問題、量測情境及文獻索引 → 名詞對照、課堂與標準差異及待查原始文獻 → 私人色彩學習知識庫，經資料權利及人工覆核後使用。
- 來源證據：
  - 區分課堂說法與實務標準：[SKILL.md](https://github.com/Ayueh0102/Ronnier-skill/blob/098782f116d86fdc4ab60ca3ab3ba235a5fce5b5/SKILL.md)（回答問題的原則 / 永遠分清）；學生整理非官方內容；未獨立核對 CIE 標準與所有公式。
  - 拆解中文色彩詞彙歧義：[references/00-terminology-traps.md](https://github.com/Ayueh0102/Ronnier-skill/blob/098782f116d86fdc4ab60ca3ab3ba235a5fce5b5/references/00-terminology-traps.md)（第一把刀 / 第二把刀）；教學分類不是完整量測定義；實作需查官方標準。
  - 追溯色貌模型的研究來源：[references/00-primary-sources.md](https://github.com/Ayueh0102/Ronnier-skill/blob/098782f116d86fdc4ab60ca3ab3ba235a5fce5b5/references/00-primary-sources.md)（Li et al. (2017) / CIECAM02）；原始 PDF 未隨附，本次僅閱讀整理筆記，不宣稱已查閱論文全文。
