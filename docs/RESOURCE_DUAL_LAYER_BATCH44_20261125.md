# Resource 雙層整理 Batch 44

日期：2026-11-25。三筆既有 Resource，僅查核固定來源；未執行第三方工具。保留既有 ID、關聯及標籤。設計案例非實測。CI 待驗收。

## twood2024-prelaunch-check-defense
- 來源：https://github.com/Twood2024/prelaunch-check-defense
- 固定版本：`8483cad5af7a1982ef133e3f91c1cce203dc1b57`
- 授權：自訂授權；限防禦用途與引用，禁止轉售為掃描服務
- 狀態：evidence-linked；Runtime 未驗證
- 案例：規劃網站與 AI 應用的上線前防禦檢查
- 核對瀏覽器安全政策：`playbooks/01-headers-csp.md`（Checklist）；需核對實際回應與業務需求，不以設定存在推論防護有效。
- 檢查部署與機密邊界：`playbooks/02-config-secrets.md`（Checklist）；只在授權範圍覆核，不收集或記錄真實金鑰，修正後需重新驗收。
- 核對 AI 指令與工具權限：`playbooks/03-prompt-injection.md`（Checklist）；文字規則不等於執行時安全，另驗證伺服器權限、拒絕行為及資料邊界。

## agricidaniel-claude-seo
- 來源：https://github.com/AgriciDaniel/claude-seo
- 固定版本：`468ed5b0d9e3249394783710e54abb02837e326b`
- 授權：MIT
- 狀態：mapped；Runtime 未驗證
- 案例：規劃網站內容與 SEO 變更驗收
- 核對 HTML 結構：`scripts/page_checks.py`（run_checks）；長度門檻屬啟發式規則，不是搜尋引擎正式限制；缺標頭時不宣稱已檢查。
- 找出可能缺引用的陳述：`scripts/content_verify.py`（extract_claims,verify）；主要主張樣式針對英文；繁體中文覆蓋有限，附近引用不代表支持主張。
- 比較基準與目前頁面：`scripts/drift_compare.py`（load_baseline,run_comparison）；基準須存在並有效；外部請求、效能資料及真實排名須另核對。

## kkkkhazix-khazix-skills
- 來源：https://github.com/KKKKhazix/khazix-skills
- 固定版本：`76fc0f8e8245b40a809d8eed89b27f04cbcf81bb`
- 授權：MIT
- 狀態：evidence-linked；Runtime 未驗證
- 案例：規劃個人工作協作、磁碟盤點與文章整理
- 定義任務及獨立驗收：`leader/SKILL.md`（任務、驗收與進度規則）；只整理流程指引；分工與測試獨立性需以自有實例驗收。
- 盤點磁碟空間：`storage-analyzer/SKILL.md`（唯讀掃描、估算與刪除授權）；掃描與刪除分開，父子目錄不得重複加總；估算不保證實際可回收容量。
- 整理有來源的文章：`khazix-writer/SKILL.md`（真實經驗與事實核對）；不可虛構第一人稱經歷，時間與數字需核實；未取得素材時保留缺口。
