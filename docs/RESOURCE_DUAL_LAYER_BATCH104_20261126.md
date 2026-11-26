# Batch 104｜reverse-skill 歷史身分與候選來源（2026-11-26）

## 身分判定

原始 V2 無 URL、Repo、作者；現行兩筆 URL 相同且 Repo ID 1237819660，但不能證明原收藏身分。已補候選文件的信任及唯讀範圍，仍缺歷史歸屬及引用遷移核准。

- [原始 V2](https://github.com/christinekao/AI-Tool-Collection/blob/951dd4cf7353f0270f630f24286ad4e677fcc6d6/data/resources/reverse-skill.json)
- 現行候選：`reverse-skill-2`；固定版本 `b972ad0e90f26d8f044828f004da22a4a585da12`，僅作對照，不是舊收藏身分證明。
- 保留原 ID、分類、Tags、引用、既有證據；不新增別名、不刪除、不遷移引用，維持 deferred。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [candidate-trust-boundary](https://github.com/zhaoxuya520/reverse-skill/blob/b972ad0e90f26d8f044828f004da22a4a585da12/SECURITY.md#L7-L14) | 上游安全文件區分可執行與被動研究資料，並明示外部客戶端不受 repo 自有入口的技術控制涵蓋。 | 文件聲明不等於控制實測或完整安全審計；不是早期收藏的身分證據。 |
| [candidate-readonly-scope](https://github.com/zhaoxuya520/reverse-skill/blob/b972ad0e90f26d8f044828f004da22a4a585da12/skills/case-review/SKILL.md#L6-L21) | 候選審查 Skill 以既有授權案例為限，檢查範圍、證據引用、產物完整性及交接報告；不操作目標。 | 為候選程序文件，未執行工具或驗證強制控制；不得推論舊收藏身分。 |

## 讀者應用

區分來源身分與候選證據審查邊界：比對歷史收藏、現行 Repo 身分與候選唯讀審查文件，標示可核對的來源與未解歸屬；保留兩筆 ID，僅用自有合成證據規劃驗收。

## 待解

取得原收藏網址／可辨識截圖；若核准別名或整併，先逐一驗收入向引用並保留歷史記錄。

第三方、上游測試未執行。
