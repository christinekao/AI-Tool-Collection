# Batch 90｜anomalyco-opencode 固定版本契約補強（2026-11-26）

固定版本：`e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91`。維持 deferred，保留原 ID、分類、Tags、Typed References、原案例與既有證據。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [plan-role](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/plugin/plan.ts#L22-L48) | Plan plugin 設定 primary 角色、允許 question、拒絕一般 edit，並允許指定 plan 目錄 edit；選中時指令要求不修改其他檔案或委派修改。 | 角色指令及 edit 規則不等於 OS 唯讀沙箱；尚未證明 Shell 或子代理均受同等限制。 |
| [session-policy](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/permission.ts#L190-L233) | 權限服務依呼叫的 sessionID 取得 session，解析指定 agent 或 session agent，組合 agent permissions 與 session permissions，再評估操作。 | 此處沒有證明父 session 的限制如何傳入新 child session；需另查建立流程。 |
| [shell-gate](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/tool/plugin/shell.ts#L330-L361) | Shell 解析目標工作目錄，依當前 agent/session 組合政策產生權限請求，逐一 assert，並在程序建立前重新檢查目錄。 | 尚未核對命令解析完整性、所有 shell 語法與 OS 沙箱；不可當作安全隔離保證。 |
| [mcp-tool-gate](https://github.com/anomalyco/opencode/blob/e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91/packages/core/src/tool/mcp.ts#L46-L88) | 註冊的 MCP tool 執行前先以 server/tool 正規化名稱、萬用 resource 與呼叫 context 執行 permission.assert，核准後才呼叫 MCP server。 | 此入口採工具層萬用 resource，並非參數級授權；不能推廣至所有 MCP 入口或遠端服務端安全。 |

## 讀者應用

驗收 Plan 與工具執行權限：在合成 Repo 比較 Plan 目錄內外 edit、child session 的規則、Shell 路徑權限與 MCP tool 核准；另設 OS 層隔離及遠端服務端授權。

## 缺口與下一步

已核對 Plan 註冊、session 權限組合、Shell 與 MCP 入口；尚需證明子 session 建立時的父規則限制、Shell 命令解析覆蓋與 MCP 其他入口。

追蹤 Session.create 的 child 權限、ShellPermissions.requests 解析與 MCP direct/resource 入口，驗證拒絕與越權反例。

僅固定版本靜態查核；第三方未執行，不增加正式完成率。
