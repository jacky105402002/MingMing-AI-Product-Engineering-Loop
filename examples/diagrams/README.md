# v1.1.4 隔離圖表試驗

2026-11-09，以 Next AI Draw.io MCP 0.4.11 實際建立兩頁合成圖；不是產品架構、不是政府案資料。

- [可編輯主檔](workflow.drawio)：包含流程與架構兩頁。
- [流程預覽](flow.png)、[架構預覽](architecture.png)：兩頁分別匯出且已目視。
- [操作檢查紀錄](../../tasks/validation/release-v1.1.4/diagram-check.json)、[修改前後及重載讀回](../../tasks/validation/release-v1.1.4/diagram-snapshots.json)。

圖表 ID：DIAG-114；revision：r1。來源為 [共用圖表規範](../../ai-workflow/diagram-policy.md)、[操作指南](../../docs/drawio.md)及本次發布 spec；對照 AC-1（角色／交接規則）、AC-2（工具操作），主線 Node 為 node-release。

| 頁面／主要 cell | 用途／來源對照 |
|---|---|
| flow：3、4、7 | 查證來源、重要缺口詢問及無依賴工作繼續；對照 diagram-policy 的先定義內容 |
| flow：5、6 | 繪圖、檢查及主檔／預覽／交接；對照 diagram-policy 的操作與交付 |
| architecture：3、4、5 | 主線角色、MCP、畫布責任示意；不代表任何產品部署 |
| architecture：6 | 專案保存產物；對照 diagram-policy 的驗收與證據 |

實際操作：新 session 建圖 → get_diagram → 只更新 flow 的 cell 6 標籤 → 讀回 → 完整 .drawio 與逐頁 PNG 匯出 → 新 session 載入主檔 → get_diagram 比對。兩頁共 25 個 cell（含 root），只改一個目標 cell，其餘 24 個保留；重載後所有 cell 的屬性、內容、幾何及連線一致。

兩張已匯出 PNG 由同一 agent 目視，未發現裁字、遮擋或穿越非目標節點的連線。主檔已完成重新載入；正式版本以此目錄檔案為準，沒有待匯出的人工作業。再次編輯前仍應核對最新來源與編輯者。

這次未由真人手動修改、未換聊天、未接入真實產品；這些仍在 [產品試跑計畫](../../docs/pilot-plan.md)，不能把新 session 測試寫成跨聊天驗證。公開成果不含 session URL、個人路徑或存取資訊。
