# Batch 87｜anomalyco-opencode 局部技術證據補強（2026-11-26）

固定版本：`e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91`。保留原 ID、分類、Tags、Typed References、原案例；維持 deferred。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [policy-composition](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/permission/policy.ts#L45-L112) | 普通 rules 採最後匹配，restrict 的拒絕不受 override/fallback 解除；fallback 只處理 ask，多資源合併 deny > ask > allow。 | 不可把普通規則描述成所有 deny 永遠優先；不是 OS 安全沙箱。 |
| [saved-approval](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/permission.ts#L178-L233) | 權限服務先評估 agent 與 session 規則，明確拒絕直接阻擋；再以 project 範圍保存的核准作 fallback。 | 尚未驗證所有執行工具皆經相同入口及非互動情境。 |
| [role-defaults](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/plugin/agent.ts#L53-L100) | Build 為 primary；General 為 subagent，預設禁止 question 和 subagent；Explore 為 subagent，預設拒絕萬用規則後列出 Shell、搜尋及讀取等許可。 | 此處未見 Plan 註冊；Explore 允許 Shell，不可稱為唯讀安全隔離。 |
| [subagent-gate](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/tool/plugin/subagent.ts#L118-L179) | 子代理入口檢查深度、拒絕 primary 角色，經 permission.assert 再建立或繼續 child session；模型可依顯式覆寫、角色設定及父 session 決定。 | 呼叫核准不等於子 session 每項工具權限繼承；生命週期及隔離仍須驗證。 |
| [policy-test](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/test/permission.test.ts#L174-L249) | 上游測試含 fallback 不覆蓋明確拒絕、多資源效果排序、restrict 在 override/fallback 下仍拒絕等反例。 | 僅閱讀測試，不宣稱已執行或實際環境安全。 |

## 讀者應用

驗收權限規則與子代理委派：建立 action/resource/effect 測試矩陣：一般規則覆寫、restrict 拒絕、saved approval 只能補 ask，以及 primary 角色不得當子代理。

## 下一步

定位 Plan 設定及 child session 權限組裝與 Shell/MCP 執行入口；以合成 Repo 驗證拒絕、取消、持久化核准及越權。

第三方未執行；局部來源不構成完整實作契約。
