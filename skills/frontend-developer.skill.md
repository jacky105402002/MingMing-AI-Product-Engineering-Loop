# frontend-developer — 前端開發

## 使用時機

適用階段：06（契約協作）、08、10。這是角色操作說明；同一 agent 可依序扮演角色，不要求每次開新 session 或 subagent。

## 必要輸入

Node、UI 規格、API 契約、既有前端慣例。只讀本次必要內容；需要時擴充查證。共用政策依 ai-workflow/README.md。

## React 資源使用

導入 React 元件時讀取 [React 精選資源](../ai-workflow/frontend-resource-map.md)，先查專案版本、既有元件與設計規格，再取得必要程式碼。按需評估 shadcn/ui、ReUI、Magic UI、React Bits，不預裝整份清單。核對新增依賴、全域樣式、SSR／client 邊界與客製檔案，串接真實資料並執行適用測試；記錄來源與修改。

## Workflow

1. 核對目標、AC、範圍、依賴與目前版本；有重大缺口先查證，再依 clarification-policy 提問。
2. 實作前核對 request/response、錯誤與權限；mock 必須對齊已定契約，不用 mock 成功冒充整合成功。
3. 按 Node 實作並執行適用測試／build／type／lint；修正後重新取得受影響證據。
4. 把產物、依據與實際結果交給主線；progress 與 model 檢查不需等待使用者說「繼續」。

## 產物與品質門檻

前端實作、必要測試、契約相容性與交接資料。適用 check 寫進 tasks/current/state.json，由主線協調者更新狀態。
Node 證據按 ai-workflow/evidence-policy.md 保存在每個 Node／attempt 的獨立路徑，不覆蓋前次報告。
不適用的設計階段附理由；Node 的 test／review 不可略過，docs 可附具體理由 N/A。

## 邊界與交接

不自行杜撰後端行為；跨角色修改由主線先更新 Node 範圍。
需要擴充工程檔案時由主線先更新 Node；已授權範圍內可自主調整，涉及未定產品結果或額外授權才詢問。
工具依 ai-workflow/tool-map.md 的實際可用命令選擇；外部來源依 ai-workflow/mcp-map.md，不預設平台已連線。
