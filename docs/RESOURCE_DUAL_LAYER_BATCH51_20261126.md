# Resource 雙層知識 Batch 51｜教學 Agent、工程學習與履歷審查

2 mapped、1 evidence-linked 候選、9 用途、6 局部程式能力、3 文件證據、3 design-only 案例。原分類領域、Tags、關聯保留；文件型 Resource 校正 Content Format。

## thu-maic-openmaic

- 固定版本 `a2aa17e9afdb281debb0d2d5ddc33fad0a2cfe2c`；根授權：MIT；模型及教材授權另查
- 用途：以需求與教材建立 AI 互動教室，支援非同步生成、按擁有者查詢進度與人工確認課程大綱。
- 案例：規劃 AI 互動教室的教材生成與大綱確認；自撰課程需求、合成教材與已授權測試模型。 → 教室任務識別、大綱確認紀錄、生成狀態與教材驗收規格。 → 自有學習平台，經人工教學及事實覆核後使用。
- 來源證據：
  - 建立教室生成工作：[app/api/generate-classroom/route.ts](https://github.com/THU-MAIC/OpenMAIC/blob/a2aa17e9afdb281debb0d2d5ddc33fad0a2cfe2c/app/api/generate-classroom/route.ts)（POST / parseClassroomJobBody / startGenerationRun）；此相容入口自動確認大綱；需人工大綱審查時使用不同的 generation-run 流程；202 不是完成。
  - 回查教室及媒體進度：[app/api/generate-classroom/[jobId]/route.ts](https://github.com/THU-MAIC/OpenMAIC/blob/a2aa17e9afdb281debb0d2d5ddc33fad0a2cfe2c/app/api/generate-classroom/[jobId]/route.ts)（GET / readGenerationRunWithMedia / classroomJobView）；依擁有者查詢；未知或不屬於擁有者的工作同為 404；資料隔離仍須實測。
  - 以版本及命令識別確認大綱：[app/api/generation-runs/[id]/confirm-outline/route.ts](https://github.com/THU-MAIC/OpenMAIC/blob/a2aa17e9afdb281debb0d2d5ddc33fad0a2cfe2c/app/api/generation-runs/[id]/confirm-outline/route.ts)（POST / parseConfirmOutline / confirmGenerationRunOutline）；路由檢查模型授權、擁有者、版本及配額；註解規定命令識別冪等，實際重送行為仍須測試。

## jit-learning-loop

- 固定版本 `4734228591b159727044ea4afb0ebad2196b14db`；根授權：Apache-2.0；專案執行環境另核准
- 用途：把真實工程任務轉為逐步交還認知工作的學習流程，輔以已安裝版本查詢、學習紀錄檢索及格式檢查腳本。
- 案例：規劃工程任務的學習檢查與可轉移知識紀錄；合成程式專案、套件名稱、既有學習紀錄及一份待驗收的學習條目。 → 版本證據、學習程度建議與可審查的學習紀錄條目。 → 私人學習庫及自有專案，經本人確認後保留紀錄。
- 來源證據：
  - 查詢專案實際使用的套件版本：[skills/jit-learning-loop/scripts/installed.mjs](https://github.com/cyyeh/jit-learning-loop/blob/4734228591b159727044ea4afb0ebad2196b14db/skills/jit-learning-loop/scripts/installed.mjs)（findNode / pythonInterpreter / probePython）；鎖檔不代表實際安裝；Python 探查會啟動解譯器，須使用可信專案與核准環境，不執行第三方專案。
  - 回查既有學習主題：[skills/jit-learning-loop/scripts/learning-log.mjs](https://github.com/cyyeh/jit-learning-loop/blob/4734228591b159727044ea4afb0ebad2196b14db/skills/jit-learning-loop/scripts/learning-log.mjs)（find / matcher / parseLog）；關鍵字搜尋不理解語意；僅最佳匹配包含全部搜尋詞且為最新匹配時提供程度建議。
  - 驗證並保存學習條目：[skills/jit-learning-loop/scripts/learning-log.mjs](https://github.com/cyyeh/jit-learning-loop/blob/4734228591b159727044ea4afb0ebad2196b14db/skills/jit-learning-loop/scripts/learning-log.mjs)（checkEntry / check / add）；check 不寫入；add 檢查格式、重複與無日期標題，暫存後替換檔案；格式通過不代表知識正確，寫入須經同意。

## alexyc9381-hiring-panel-skill

- 固定版本 `3ec597eb85a904efd17f9171e18f1b8d9dfe4e1a`；根授權：MIT；履歷資料使用須另行核准
- 用途：提供多角色履歷審查與重寫流程，依職缺模擬文字可讀性、主管判斷及獨立讀者觀點，最後重新檢查改寫結果。
- 案例：規劃職缺客製履歷的多角色審查與事實驗收；本人授權的履歷、職缺內容及已確認的工作經歷。 → 多角色審查摘要、問題清單、保真改寫稿及前後模擬結果。 → 自有履歷與投遞管理系統，經本人確認後才投遞。
- 來源證據：
  - 模擬履歷文字與職缺關鍵字檢查：[skills/hiring-panel/SKILL.md](https://github.com/alexyc9381/hiring-panel-skill/blob/3ec597eb85a904efd17f9171e18f1b8d9dfe4e1a/skills/hiring-panel/SKILL.md)（1. Get the resume and the job / 2. The automated screen）；模型模擬不是企業真正的 ATS；缺少職缺時先確認角色，不捏造資訊。
  - 從獨立角色收集履歷問題：[skills/hiring-panel/SKILL.md](https://github.com/alexyc9381/hiring-panel-skill/blob/3ec597eb85a904efd17f9171e18f1b8d9dfe4e1a/skills/hiring-panel/SKILL.md)（3. The hiring manager / 4. Five readers, alone / 5. What is wrong）；來源要求獨立審查、不可互見筆記；需要執行環境真的支援子 Agent，且模型判斷仍有主觀性。
  - 保真改寫與再次模擬檢查：[skills/hiring-panel/SKILL.md](https://github.com/alexyc9381/hiring-panel-skill/blob/3ec597eb85a904efd17f9171e18f1b8d9dfe4e1a/skills/hiring-panel/SKILL.md)（6. Rebuild it / 7. Write the result / Rules）；缺資料須留待補標記；指定目錄寫入須經授權，模擬通過不保證面試或錄取。
