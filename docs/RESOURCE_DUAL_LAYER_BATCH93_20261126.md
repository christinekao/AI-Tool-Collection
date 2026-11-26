# Batch 93｜anomalyco-opencode 固定版本契約補強（2026-11-26）

固定版本：`e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91`。維持 deferred，保留原 ID、分類、Tags、Typed References、原案例與既有證據。原 404 路徑已更正。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [child-session-admission](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/tool/plugin/subagent.ts#L125-L190) | 子代理先檢查角色及 permission.assert；重用既有 session 時要求 parentID 等於目前 session，建立子 session 時傳 parentID、agent 與 model，未顯式傳 permissions。 | 既有 child 可切換 agent；未證明原父角色規則、後續更新或所有其他建立入口均維持相同限制。 |
| [child-permission-inheritance](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/session.ts#L303-L353) | Session.create 查找父 session 並繼承位置；metadata 與 permissions 採 input 值優先、未提供時使用父 session 值。 | 這是建立時的預設繼承而非強制父子政策交集；不能推論父 agent 的所有規則自動繼承或後續變更同步。 |
| [shell-unverifiable-policy](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/shell/permissions.ts#L17-L57) | ShellPermissions.requests 使用 ShellParse.scan；無法解析且政策有 shell deny 時回 UnverifiableError，否則要求萬用 external_directory 與完整命令核准，不保存核准模式；成功時解析目錄與命令資源。 | 仍須核對 ShellParse 支援語法及實際作業系統行為；非通用沙箱保證。 |
| [mcp-direct-service-boundary](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/mcp/index.ts#L1096-L1185) | MCP.callTool 選擇 attached client 或 configured server 並轉發；MCP.prompt、resources、readResource 走連線及對應讀取方法，這些服務方法本段未見 permission.assert。 | 不能僅據此認定可繞過授權；需查所有外部呼叫入口、上游檢查與遠端 server 的授權。 |

## 讀者應用

驗收子代理繼承與工具邊界：測試指定子 session 是否屬於父 session、未指定與顯式設定 permissions、切換 agent、無法解析的 Shell 指令，以及 MCP 直接呼叫與 resource 讀取；以 OS 層限制補強。

## 缺口與下一步

原 404 路徑已更正；已核對子 session 建立時的規則預設繼承、Shell 無法解析時的拒絕或額外核准，以及 MCP 直接服務入口；仍須證明父角色的限制是否持續有效、各入口呼叫者的權限與 OS 沙箱。

追蹤 agent 切換、顯式 permissions 覆寫、MCP callTool/readResource 的所有呼叫者及 ShellParse 支援語法；以合成 Repo 測試拒絕及越權反例。

僅固定版本靜態查核；第三方與上游測試未執行，不增加正式完成率。
