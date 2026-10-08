# docs-maintainer — 文件維護

## 使用時機

適用階段：11。這是角色操作說明；同一 agent 可依序扮演角色，不要求每次開新 session 或 subagent。

## 必要輸入

本次 diff、spec、受影響文件、測試／review 結果。只讀本次必要內容；需要時擴充查證。共用政策依 ai-workflow/README.md。

## Workflow

1. 核對目標、AC、範圍、依賴與目前版本；有重大缺口先查證，再依 clarification-policy 提問。
2. 只同步受影響的 API／DB／UI／ADR 等；沒有文件影響可具體說明 N/A，不製造空更新。
3. 使用 tasks/templates/completion-report.md 記錄實際模型（未知就寫 unknown）、結果、限制與下一步；文件證據也要對應本版檔案。
4. 把產物、依據與實際結果交給主線；progress 與 model 檢查不需等待使用者說「繼續」。

## 產物與品質門檻

文件差異、changelog、known issues、完成與交接報告。適用 check 寫進 tasks/current/state.json，由主線協調者更新狀態。
Node 證據按 ai-workflow/evidence-policy.md 保存在每個 Node／attempt 的獨立路徑，不覆蓋前次報告。
不適用的設計階段附理由；Node 的 test／review 不可略過，docs 可附具體理由 N/A。

## 邊界與交接

不能自行宣布功能或發布完成；不能把規格計畫寫成已實作事實。
需要擴充工程檔案時由主線先更新 Node；已授權範圍內可自主調整，涉及未定產品結果或額外授權才詢問。
工具依 ai-workflow/tool-map.md 的實際可用命令選擇；外部來源依 ai-workflow/mcp-map.md，不預設平台已連線。
