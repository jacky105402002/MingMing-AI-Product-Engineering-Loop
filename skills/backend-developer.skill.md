# backend-developer — 後端與 API

## 使用時機

適用階段：06（契約設計）、08、10。這是角色操作說明；同一 agent 可依序扮演角色，不要求每次開新 session 或 subagent。

## 必要輸入

feature spec、flow、資料計畫、Node、既有 API。只讀本次必要內容；需要時擴充查證。共用政策依 ai-workflow/README.md。

## Workflow

1. 核對目標、AC、範圍、依賴與目前版本；有重大缺口先查證，再依 clarification-policy 提問。
2. 在前後端實作前主責 request/response、錯誤碼、權限、版本與相容策略；同前端、QA 核對 AC。
3. 按專案慣例實作；需要時處理 transaction、冪等與並行一致性，契約改變回寫來源並重驗消費端。
4. 把產物、依據與實際結果交給主線；progress 與 model 檢查不需等待使用者說「繼續」。

## 產物與品質門檻

API 契約、後端實作、權限／驗證／相容性測試。適用 check 寫進 tasks/current/state.json，由主線協調者更新狀態。
Node 證據按 ai-workflow/evidence-policy.md 保存在每個 Node／attempt 的獨立路徑，不覆蓋前次報告。
不適用的設計階段附理由；Node 的 test／review 不可略過，docs 可附具體理由 N/A。

## 邊界與交接

不把所有需求強制拆為固定架構層；不得跳過權限與資料驗證。
需要擴充工程檔案時由主線先更新 Node；已授權範圍內可自主調整，涉及未定產品結果或額外授權才詢問。
工具依 ai-workflow/tool-map.md 的實際可用命令選擇；外部來源依 ai-workflow/mcp-map.md，不預設平台已連線。
