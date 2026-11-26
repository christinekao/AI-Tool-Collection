# Batch 96｜toeverything-affine 固定版本契約補強（2026-11-26）

固定版本：`81da59d63d535d72ba677a097d9a0cc9a5871ade`。維持 deferred；保留 ID、分類、Tags、既有證據與應用案例。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [markdown-doc-write](https://github.com/toeverything/AFFiNE/blob/81da59d63d535d72ba677a097d9a0cc9a5871ade/packages/backend/server/src/core/doc/writer.ts#L97-L147) | 將 Markdown、標題及 actor 轉為 y-octo 二進位更新，寫入 storage 並發布事件；其後更新文件屬性及必要的 root doc 註冊，失敗回報 DocCreateIncompleteError。 | 文件已寫入與工作區註冊完成是不同階段；未證明重試入口、權限或失敗補償完整。 |
| [native-update-merge](https://github.com/toeverything/AFFiNE/blob/81da59d63d535d72ba677a097d9a0cc9a5871ade/packages/backend/server/src/core/doc/merge-updates.ts#L51-L97) | 合併介面將 Uint8Array 更新轉 Buffer 後交給 native codec；記錄成功／失敗耗時，失敗重新拋出，慢速呼叫另有計數。 | 只確認 wrapper；未證明 native 合併演算法、離線衝突收斂、保存或傳輸契約。 |
| [workspace-doc-permission](https://github.com/toeverything/AFFiNE/blob/81da59d63d535d72ba677a097d9a0cc9a5871ade/packages/backend/server/src/core/permission/service.ts#L32-L114) | 工作區與文件操作分別交給 authorize；can 方法依第一筆 decision.allowed 判定，缺該判定時預設 false，assert 方法拒絕時拋出對應例外。 | 未核對底層 native 權限規則與各呼叫端覆蓋；程式閱讀不代表可依 MIT 使用 EE 目錄。 |

## 讀者應用

驗收文件寫入、合併及權限邊界：以合成工作區測試 Markdown 建立、部分註冊失敗、二進位更新合併、工作區與文件權限拒絕；另驗證離線、還原及適用授權。

## 缺口與下一步

已定位後端 Markdown 文件寫入、native 更新合併與工作區／文件授權介面；尚缺 BlockSuite client、端到端同步衝突、儲存及匯出還原；根授權對後端與 native 目錄另有 EE 條件。

追蹤 client BlockSuite、同步 gateway 與 native 授權規則；另查備份還原、匯出及具體部署授權。

僅靜態查核；第三方及上游測試未執行，不增加正式完成率。
