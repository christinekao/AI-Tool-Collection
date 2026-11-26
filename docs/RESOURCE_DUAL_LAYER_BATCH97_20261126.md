# Batch 97｜hermes-snyk-plugin 固定版本契約補強（2026-11-26）

固定版本：`8937d2e90d04f7c91a14ababb0dd5175b3c4d4ed`。維持 deferred；保留 ID、分類、Tags、既有證據與應用案例。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [migrated-manifest-pin](https://github.com/NousResearch/hermes-official-plugins/blob/8937d2e90d04f7c91a14ababb0dd5175b3c4d4ed/snyk/mcp.json#L1-L22) | 新庫 manifest 仍固定 snyk@1.1306.0，透過 npx 以 stdio、full profile 啟動，並設定停用 analytics 的參數及環境變數。 | 此為配置而非實際安裝結果；固定版本不等於驗證套件內容或所有網路傳輸。 |
| [migrated-network-boundary](https://github.com/NousResearch/hermes-official-plugins/blob/8937d2e90d04f7c91a14ababb0dd5175b3c4d4ed/snyk/README.md#L63-L80) | 新庫文件指出 SAST 會上傳程式碼、SCA 會傳送依賴圖；feedback 須選擇加入，folder trust 僅限指定目標，版本更新走審查流程。 | 僅文件聲明；停用 analytics 不代表掃描離線，未實測資料範圍、保留或傳輸。 |
| [migrated-scan-procedure](https://github.com/NousResearch/hermes-official-plugins/blob/8937d2e90d04f7c91a14ababb0dd5175b3c4d4ed/snyk/skills/snyk-security-scan/SKILL.md#L100-L121) | 新版 Skill 文件要求絕對路徑、指定資料夾信任、私有 Repo 先詢問、避免秘密檔案、核對版本與合成 fixture 的掃描前後差異。 | 這些是給 Agent 的流程指引，不是強制隔離機制；尚未驗證實際工具 schema、拒絕與掃描結果。 |

## 讀者應用

驗收掃描插件版本與外送邊界：比較舊庫與新庫 manifest、驗證固定版本及工具 schema；僅設計合成 fixture 的授權、信任路徑、掃描與重掃，正式外送須另核准。

## 缺口與下一步

原 Repo 已封存遷移；現已查核新官方庫固定版本 manifest、README 與 Skill；仍未核對外部 Snyk CLI MCP 即時 schema、掃描器核心實作、資料保留及實際網路行為。

另查官方 CLI 版本及資料處理條款；取得核准後以合成資料執行 handshake、掃描及拒絕外送驗收。

僅靜態查核；第三方及上游測試未執行，不增加正式完成率。
