# Resource 雙層知識 Batch 32｜工程工作流程

共同驗收基線 `fde96af41f63a655290afd95879f188d83167383`；Batch 29–35 集中同一 PR，逐組保存紀錄，不把候選計入已合併。

## mattpocock-skills

- 版本 `d65391149dbb5fe76478e76fa8d5122b2aa5a70e`；授權 MIT
- 用途：把釐清需求、領域建模、測試優先與除錯拆成可分別採用的工程工作指引。
- 案例：規劃從模糊需求到可驗證的功能修正；合成需求、既有程式行為與可重現的失敗案例 → 詞彙與 ADR、獨立預期值的測試及除錯證據 → 自有 AI Cowork 的需求、實作與驗收流程
- 局部文件證據：
  - 釐清需求與領域詞彙：skills/engineering/grill-with-docs/SKILL.md (skills/engineering/domain-modeling/SKILL.md,skills/productivity/grilling/SKILL.md)；依相依關係分輪訪談，查證事實與使用者決策分開；未確認前不實作。
  - 先寫可失敗的行為測試：skills/engineering/tdd/SKILL.md ()；測試應針對外部行為，預期值來自獨立來源；一次一個切片，不以覆蓋率代替正確。
  - 建立可重現的除錯迴圈：skills/engineering/diagnosing-bugs/SKILL.md ()；先建立能失敗的迴圈再最小化；真實請求要先去識別，不能任意保存憑證。

## garrytan-gstack

- 版本 `2eb3e5ad12a743ed83e0863d670b2e027f6c63a5`；授權 MIT
- 用途：把產品構想、規格審查、程式審查及實際 QA 分成不同角色，讓開發者在合併前取得較完整的檢查證據。
- 案例：規劃功能需求、程式審查與 QA 證據的交付流程；合成設計文件、測試 Repo 差異及授權的本機測試 → 設計評審紀錄、版本綁定審查與 QA 收據 → 自有工程交付與 PR 驗收
- 局部能力及證據：
  - 讓設計經過有界評審：bin/gstack-office-hours-review (main,probe,verifyOfficeHoursVerdictReceipt)；評審輪數受限、只允許定義的 probe；設計文件與 reviewer 意見仍需人員確認。
  - 將審查證據綁定變更版本：bin/gstack-review-log (--start,--finish,REVIEW_STATUS_MISMATCH)；審查完成／收斂為 reviewer 回報，非模型確實讀過程式的證明；工作樹變更後重審。
  - 保存可驗證的 QA 輸出：lib/qa-evidence.ts (readQaCaptureRecord,readQaCapture,qaEvidenceRoot)；只允許完整且非敏感的 capture 發布；雜湊證明輸出完整性，不保證測試涵蓋需求。

## affaan-m-ecc

- 版本 `4adeee6732a12d1540f49a4d50a38ce8c97f9a53`；授權 MIT
- 用途：為 Coding Agent 提供可選的 Hooks、工作階段摘要與驗收指引，將常用工程規則固定下來。
- 案例：規劃 Agent 工作階段保存與交付驗收；合成 Session 紀錄、兩個 worktree 及測試專案 → 隔離的摘要、學習提醒與多階段驗收規格 → 自有 Agent Harness 的規則與交付治理
- 局部能力及證據：
  - 依 Agent 事件掛接規則：hooks/hooks.json (PreToolUse（設定欄位）,matcher（設定欄位）,hooks（設定欄位）)；Hooks 可能執行程式並修改環境；需按 Host 與最小權限審查，不將匹配器視為沙箱。
  - 在 Context 壓縮前保存摘要：scripts/hooks/pre-compact.js (selectActiveSessionPath,normalizePath,generateSessionSummary)；摘要可能呼叫模型且傳送內容；嚴格避免跨 worktree 誤寫，失敗不冒充完整摘要。
  - 從 Session 找可重用經驗：scripts/hooks/evaluate-session.js (main,DELIVERY_MARKER_PREFIX,stop_nudge_opt_in)；Stop nudge 預設關閉且需 opt-in；不能自動保存秘密，最終仍須執行 verification-loop 的真實測試。

2 mapped、1 evidence-linked；Matt Pocock 主要為 Skill 集合，僅校正 Content Format，其他分類及關係維持 候選；9 用途、3 design-only 案例。第三方未實測；共同 PR CI 待驗收。
