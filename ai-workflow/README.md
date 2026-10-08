# ai-workflow 總控層

現行規則服務於 AI 主導執行：查證優先、重要未知才詢問、Gate 由證據放行。

| 檔案 | 使用時機 |
|---|---|
| [autonomy-policy](autonomy-policy.md) | 開始、範圍或授權變更 |
| [clarification-policy](clarification-policy.md) | 資料缺口、歧義或來源衝突 |
| [prompt-router](prompt-router.md) | 選路徑與適用角色 |
| [loop-map](loop-map.md) | 階段與 Node 內迴圈 |
| [skill-map](skill-map.md) | 按需讀一個角色 |
| [context-policy](context-policy.md) | 讀取、委派與恢復 |
| [model-routing-policy](model-routing-policy.md) | 能力需求或設定變化 |
| [definition-of-ready](definition-of-ready.md) | 設計／實作前 |
| [definition-of-done](definition-of-done.md) | Node／功能完成 |
| [node-template](node-template.md) | 切 Node |
| [node-status](node-status.md) | 唯一狀態契約 |
| [evidence-policy](evidence-policy.md) | 實際驗證與失效規則 |
| [review-checklist](review-checklist.md) | review |
| [release-policy](release-policy.md) | 發布、回復、觀察與歸檔 |
| [tool-map](tool-map.md) | 專案驗證工具 |
| [frontend-resource-map](frontend-resource-map.md) | React UI 選型、整合與驗證；其他任務不需載入 |
| [mcp-map](mcp-map.md) | 實際來源與權限 |
| [workflow-improvement-log](workflow-improvement-log.md) | 歷史決策 |

不要一次載入全部文件；主線先讀自治、路由、當前狀態，按工作讀相應契約。
原始方法論與 improvement log 是歷史，不是與現行政策競爭的另一套指令。
