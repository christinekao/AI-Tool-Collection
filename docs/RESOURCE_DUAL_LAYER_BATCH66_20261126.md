# Resource 雙層知識 Batch 66｜視覺設計與文字交付

固定版本局部查核；原分類領域、Tags、關聯保留。文件型資源校正 Content Format 並留存原分類。未執行第三方工具。

## photo-riso-poster

- 固定版本 `79564228948fd393ecf58ee9aeb74fbc3c1f1deb`；授權：MIT；evidence-linked
- 用途：以可觀察照片事實或自訂文字主題轉為少色孔版印刷風海報的操作規格。
- 案例：規劃自有照片的證據式抽象海報設計；自有照片或明確虛構主題及抽象程度 → 視覺證據清單、構圖規格與生成提示 → 個人設計練習；生成需另有工具，經資料權利與人工覆核後使用。
- 來源證據：
  - 提取可觀察的視覺事實：[SKILL.md](https://github.com/luckdvr/photo-riso-poster/blob/79564228948fd393ecf58ee9aeb74fbc3c1f1deb/SKILL.md)（Input / Deconstruct）；無日期或地點證據時省略；虛構主題與真實照片須分開。
  - 將事實轉成視覺符號：[SKILL.md](https://github.com/luckdvr/photo-riso-poster/blob/79564228948fd393ecf58ee9aeb74fbc3c1f1deb/SKILL.md)（Abstraction level / Map facts to marks and type）；設計規則不保證生成精準；需人工比較來源與成果。
  - 建立文字生成規格：[SKILL.md](https://github.com/luckdvr/photo-riso-poster/blob/79564228948fd393ecf58ee9aeb74fbc3c1f1deb/SKILL.md)（Generate）；需可用影像生成工具及使用者授權；本次未生成圖像。

## copywriting-skill

- 固定版本 `8fd2fcade2fd6629026e9dfe6d133b55b36968b9`；授權：MIT；evidence-linked
- 用途：Marketing Skills 的文案子技能，先診斷情境與產品脈絡，再依證據調整頁面文字。
- 案例：規劃自有產品頁文案的主張與保真驗收；自有產品資料、受眾需求及可查證成果 → 主張證據清單、文案候選與修訂理由 → 自有作品集及產品頁文字，經資料權利與人工覆核後使用。
- 來源證據：
  - 讀取產品脈絡並辨識修訂範圍：[skills/copywriting/SKILL.md](https://github.com/coreyhaines31/marketingskills/blob/8fd2fcade2fd6629026e9dfe6d133b55b36968b9/skills/copywriting/SKILL.md)（Before Writing / Diagnose the Situation First）；不可補造產品成果或測試結果；只改任務要求範圍。
  - 建立可核對的頁面主張：[skills/copywriting/references/copy-frameworks.md](https://github.com/coreyhaines31/marketingskills/blob/8fd2fcade2fd6629026e9dfe6d133b55b36968b9/skills/copywriting/references/copy-frameworks.md)（Headline Formulas / Page Structure Templates）；公式不是轉換率保證；主張須有原始依據。
  - 檢查重複制式寫法：[skills/copywriting/references/ai-tells.md](https://github.com/coreyhaines31/marketingskills/blob/8fd2fcade2fd6629026e9dfe6d133b55b36968b9/skills/copywriting/references/ai-tells.md)（Structural Patterns / Rewrite Rules / The Self-Check）；文字自然度主觀，不當成 AI 作者鑑定或成效保證。

## akseolabs-seo-cinematic-ui

- 固定版本 `1052c2cead980a9f8a0f219381373910ceedbc30`；授權：MIT；外部素材及相依另查；mapped
- 用途：Cinematic UI 的應用狀態、捲動時間軸與畫面驗收工具。
- 案例：規劃自有網站與工作台的動效及狀態驗收；自製產品頁、合成路由與畫面狀態 → 可重現畫面狀態、時間軸與驗收規格 → 自有前端產品展示與工作台，經資料權利與人工覆核後使用。
- 來源證據：
  - 建立可重現的應用狀態：[kit/app.js](https://github.com/akseolabs-seo/cinematic-ui/blob/1052c2cead980a9f8a0f219381373910ceedbc30/kit/app.js)（createApp / STATES / listNav）；需實際頁面與無障礙驗收；合成資料不是產品證據。
  - 將捲動對應統一時間軸：[kit/reel.js](https://github.com/akseolabs-seo/cinematic-ui/blob/1052c2cead980a9f8a0f219381373910ceedbc30/kit/reel.js)（createReel / directed / audit）；需要 GSAP；需另測效能及 reduced motion。
  - 建立多狀態畫面驗收矩陣：[scripts/app-screening.mjs](https://github.com/akseolabs-seo/cinematic-ui/blob/1052c2cead980a9f8a0f219381373910ceedbc30/scripts/app-screening.mjs)（appProbes）；截圖與機械旗標非完整可用性驗證；本次未啟動瀏覽器。
