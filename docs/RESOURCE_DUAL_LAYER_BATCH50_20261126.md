# Resource 雙層知識 Batch 50｜個人反思、工程紀律與技術教材

1 mapped、2 evidence-linked 候選、9 用途、3 局部程式能力、6 文件證據、3 design-only 案例。固定版本查核；未執行第三方工具。原 ID、Tags、領域與關聯不變；文件型 Resource 校正 Content Format。

## kepano-40-questions

- 固定版本 `10e6de763e01eb00c7bd18a6cf02b90fbe1f239f`；根授權：未見獨立根 LICENSE；不重製原題庫
- 用途：以年度與十年反思題目維持固定回顧節奏，保存可跨期間比較的個人紀錄。
- 案例：規劃年度與十年個人反思紀錄的長期比較；自有年度日誌、先前回顧紀錄及可選個人目標。 → 分期回顧摘要、問題識別與資料保留規格。 → 私人知識庫，僅由本人決定哪些內容可分享。
- 來源證據：
  - 建立年度反思紀錄：[year.md](https://github.com/kepano/40-questions/blob/10e6de763e01eb00c7bd18a6cf02b90fbe1f239f/year.md)（題目 1–10、18–20、39–40）；原文是個人反思題目，不含計分或心理診斷；不要要求回答敏感題目。
  - 區分長期價值與短期事件：[decade.md](https://github.com/kepano/40-questions/blob/10e6de763e01eb00c7bd18a6cf02b90fbe1f239f/decade.md)（題目 1–8、18–24、35–40）；題目可能觸及隱私，允許跳過；沒有固定量尺或驗證過的測量效度。
  - 追蹤不同語言版本來源：[README.md](https://github.com/kepano/40-questions/blob/10e6de763e01eb00c7bd18a6cf02b90fbe1f239f/README.md)（About / Translations）；README 說明依 ISO 語言代碼維護翻譯，但不保證語意完全等同；沒有獨立根授權，勿大量重製。

## unclebob-ub-mode

- 固定版本 `3da62bf3fcfd2034de41f30d920d2739e566171f`；根授權：MIT；外部品質工具另行查核
- 用途：提供 Coding Agent 的工程紀律：先完成最小可驗證修改，再修正根因、驗證行為與重構，最後維持可追溯紀錄。
- 案例：規劃既有專案的最小修正與工程品質驗收；已授權的測試專案、缺陷案例與既有測試規格。 → 失敗重現、最小修正、行為回歸與品質門檻的驗收紀錄設計。 → 自有專案的 PR 審查流程，由維護者核准合併。
- 來源證據：
  - 先建立可驗證的最小修改：[SKILL.md](https://github.com/unclebob/ub-mode/blob/3da62bf3fcfd2034de41f30d920d2739e566171f/SKILL.md)（First Make it Work / TDD / Architecture）；先確認測試真能重現問題；若誠實測試不可行，不應造假測試；此文件本身不執行測試。
  - 檢查根因與行為品質：[SKILL.md](https://github.com/unclebob/ub-mode/blob/3da62bf3fcfd2034de41f30d920d2739e566171f/SKILL.md)（Then Make it Right / Crapper / Dryer / Mutator / Refactoring）；文件要求 CRAP 低於 10、處理相似度至少 0.8 的重複，實際工具位於其他 Repo；指標不可代替行為測試。
  - 保留可審核的工作紀錄：[SKILL.md](https://github.com/unclebob/ub-mode/blob/3da62bf3fcfd2034de41f30d920d2739e566171f/SKILL.md)（Practice / Keep a Log / Worktree Cleanup / Commit and Push）；清理工作樹須確認未使用且無未決變更；上游建議推主線不應覆蓋本專案的 PR 與 CI 門檻。

## qingyuna-answer-me-with-html

- 固定版本 `4ad397361bcb59b0791b84783ed99ef91d4b2f07`；根授權：MIT；內嵌資產與字型授權另查
- 用途：將 Markdown 解說稿轉為單頁 HTML，利用程式化版面與元件呈現內容，並提供部分來源引用檢查及瀏覽器安全政策。
- 案例：規劃可離線技術教材的引用與安全驗收；自撰 Markdown 技術稿、合成程式碼與引用測試案例。 → 來源警告清單、HTML 標記處理與離線安全政策的驗收規格。 → 自有 HTML 教材工作區，經來源與瀏覽器測試後交付。
- 來源證據：
  - 檢查教材內的程式碼引用：[src/refs.js](https://github.com/QingYunA/answer-me-with-html/blob/4ad397361bcb59b0791b84783ed99ef91d4b2f07/src/refs.js)（checkRefs / checkRef）；只檢查符合路徑行號形式的引用；缺漏為警告而非阻止輸出，外部或秘密路徑不檢查，不能宣稱所有引用正確。
  - 區分文字與原始 HTML 標記：[src/raw-html.js](https://github.com/QingYunA/answer-me-with-html/blob/4ad397361bcb59b0791b84783ed99ef91d4b2f07/src/raw-html.js)（kind / hide / mapTags）；依元素類型和上下文判斷；原始 HTML fence 另有處理，不能把此局部過濾當成完整安全保證。
  - 限制 HTML 頁面的腳本與外部內容：[src/csp.js](https://github.com/QingYunA/answer-me-with-html/blob/4ad397361bcb59b0791b84783ed99ef91d4b2f07/src/csp.js)（cspMeta / scriptHash / pinScript）；允許 inline style 與 data 資源，connect-src self；安全性仍依瀏覽器與整體渲染流程，不等於所有外部互動皆被阻斷。
