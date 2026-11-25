# Resource 雙層改善 Batch 19（2026-11-25）

基線 main `1e0784455033bbc9b11c96899c278e81bfce9185`；PR #83 四項 CI 通過，合併 `259936a40063a05ca36bc8920e638900d7937b05`，Catalog Sync 通過，Pages 查核時進行中。90/286 已合併（84 完成對應、6 deferred）。

| Resource | 前台案例 | 固定版本與查核範圍 |
|---|---|---|
| electron | 規劃離線個人知識庫的桌面應用 | 9ea8e7da48401110ddebcc469ddd2312f3e1b021；固定版本 LICENSE、process-model、context-isolation、ipc、security 四份官方技術文件；未審查 C++／Chromium runtime 實作或打包流程。 |
| oh-my-mermaid | 規劃知識庫專案的可展開架構文件 | 38ccdb69298adec949177c92c88d6e3ddfb5bab7；固定版本 LICENSE、omm-scan、omm-view、omm-push 三份 SKILL.md 的局部文件契約；未核對 CLI 及雲端實作。 |
| abi-screenshot-to-code | 規劃履歷管理介面截圖的前端原型重建 | f2e5bbdd1dd5d93c259548d9bccf54e2a5f06a30；固定版本 README、LICENSE、backend/routes/generate_code.py 的 pipeline 與參數驗證、frontend/src/generateCode.ts 的 WebSocket 事件；未查全部模型 adapter、生成工具及預覽隔離。 |

三筆 mapped 候選、9 個用途、9 個局部能力、3 個 design-only 案例。保留原 ID、URL、Tags、分類、features、requirements、limitations、Typed Refs、歷史用途與推薦；不新增全域 Graph Edge。

## 重要界線

- electron：Electron 不等同普通瀏覽器；本機 API 權限擴大風險。 contextIsolation 不代表 IPC 自動安全，必須限縮可呼叫方法並驗證來源與輸入。 未核對原生 runtime、依賴漏洞、打包簽署及更新；未執行第三方程式。
- oh-my-mermaid：Agent 產生的圖仍須對照原始碼與實際行為，不保證完整。 本機 viewer 文件契約為唯讀；未確認監聽介面及實際存取範圍。 雲端推送會傳出架構文件，須獨立核准、檢查機密、服務條款及帳號權限。
- abi-screenshot-to-code：本機部署仍可能將素材與提示送至模型服務；不能推定離線。 WebSocket 正常結束或生成程式不等於功能驗收。 託管服務由 README 所述獨立業者經營；模型費用、權限、素材及預覽安全另查。

## Gate 與接續

新增 Catalog 等值、雙向解析、固定版本、案例欄位與四尺寸瀏覽器回歸。CI 尚待執行；未進行第三方實測。合併前 90/286；通過合併後 93/286（87 完成對應、6 deferred），193 尚未改寫。下一批優先其他前端與開發教材，含 react-frontend-backend-for-beginners；依 manifest 及 Canonical 查核。排程停用。
