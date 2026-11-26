# Batch 82｜同源紀錄與唯讀證據驗收

2 筆候選，6 用途／6 局部證據、2 設計案例；第三方未實測。

## reverse-skill-2

- mapped；固定版本 case-review 文件、唯讀 Python 審查程式的相關函式、合成案例測試及根 MIT 授權已局部閱讀；只涵蓋此模組，不涵蓋全套資安工具。未執行第三方程式或測試。
- 用途：參考 Reverse Skill 的唯讀案例審查模組，為已獲授權的自有測試資料建立證據、引用與檔案完整性驗收。
- 案例（design-only）：規劃自有測試案例的證據完整性驗收；自編案例資料夾、合成證據與驗收規格 → 授權範圍檢查、引用完整性報告與雜湊驗收結果規格 → 自有品質驗收工作區；只使用合成資料，不對第三方目標操作。
- 來源證據：
  - 核對案例範圍與授權紀錄：[parse_scope / review_case](https://github.com/zhaoxuya520/reverse-skill/blob/b972ad0e90f26d8f044828f004da22a4a585da12/skills/case-review/scripts/review_case.py)；欄位檢查不代表真實授權有效；須獨立核對實際權限。
  - 驗證證據與報告引用：[review_case / build_traceability / parse_reports](https://github.com/zhaoxuya520/reverse-skill/blob/b972ad0e90f26d8f044828f004da22a4a585da12/skills/case-review/scripts/review_case.py)；只檢查結構與引用，不證明原始結論正確；上游測試未執行。
  - 核對案例檔案完整性：[verify_artifact / sha256_file / is_within](https://github.com/zhaoxuya520/reverse-skill/blob/b972ad0e90f26d8f044828f004da22a4a585da12/skills/case-review/scripts/review_case.py)；雜湊只能核對檔案一致性，不代表來源真實、合法或安全。
- 局部原始碼契約；未執行上游測試，不宣稱整套工具可重建。

## reverse-skill

- deferred；目前兩筆 Canonical URL 同為 zhaoxuya520/reverse-skill；GitHub Repository ID 1237819660，固定版本 case-review 文件可讀。最早 V2 紀錄無 URL、Repo；不能證明初始收藏與現行來源完全相同。僅查閱來源與紀錄，未執行。
- 用途：保留早期 Reverse Skill 收藏的來源身分與證據審查概念；目前連結和較完整的 Reverse Skill 2 指向同一 Repo，但早期原收藏缺少網址。
- 案例（design-only）：規劃重複資安工具收藏的引用保留與證據驗收；兩筆既有 Resource ID、來源身分、合成案例資料 → 來源比對、引用保留及唯讀證據驗收規格 → 個人知識庫，經去重決策及引用回歸驗收後才調整。
- 來源證據：
  - 比對歷史與現行來源：[原始 V2 JSON：url、repo、purpose](https://github.com/christinekao/AI-Tool-Collection/blob/951dd4cf7353f0270f630f24286ad4e677fcc6d6/data/resources/reverse-skill.json)；目前同 URL 不證明原始收藏同一身分。
  - 保留已存在的 Skill 引用：[PR #114 圖譜入向引用盤點](https://github.com/christinekao/AI-Tool-Collection/pull/114)；兩筆各有 Skill 指向，不直接刪除或重寫。
  - 參考現行來源的唯讀證據審查：[Scope／Traceability／Fixity verification](https://github.com/zhaoxuya520/reverse-skill/blob/b972ad0e90f26d8f044828f004da22a4a585da12/skills/case-review/SKILL.md)；是現行候選文件，不代表已辨認原始工具或完成資安驗收。
- 缺口：原始收藏無網址及作者；現行兩筆同源但各有 Skill 引用，原始身分與去重決策仍待確認。
- 下一步：保留兩個 ID，優先參考 reverse-skill-2 的固定程式契約；取得原始收藏或核准受控別名／引用遷移後再驗收。
