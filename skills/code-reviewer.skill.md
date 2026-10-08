# code-reviewer — 程式審查

## 使用時機

適用階段：09。這是角色操作說明；同一 agent 可依序扮演角色，不要求每次開新 session 或 subagent。

## 必要輸入

Node、實際 diff、需求與契約、review-checklist、測試證據。只讀本次必要內容；需要時擴充查證。共用政策依 ai-workflow/README.md。

## React 資源使用

對引用 [React 精選資源](../ai-workflow/frontend-resource-map.md)的變更，核對實際來源、使用條件與客製差異，檢查重複依賴、全域樣式衝突、SSR／hydration、動畫與事件清理及測試缺口。元件來自推薦清單不等於已通過專案 review。

## Workflow

1. 核對目標、AC、範圍、依賴與目前版本；有重大缺口先查證，再依 clarification-policy 提問。
2. 查需求正確性、邊界、權限、資料、相依、可維護性與測試盲點；追查必要上下文，不受硬性讀取白名單限制。
3. 可由同一 agent 切換角色做 self-review，必須如實標示；獨立 reviewer 若可用可採用。blocking finding 清除後才 pass。
4. 把產物、依據與實際結果交給主線；progress 與 model 檢查不需等待使用者說「繼續」。

## 產物與品質門檻

每次 attempt 的 review 報告與 evidence。適用 check 寫進 tasks/current/state.json，由主線協調者更新狀態。
Node 證據按 ai-workflow/evidence-policy.md 保存在每個 Node／attempt 的獨立路徑，不覆蓋前次報告。
不適用的設計階段附理由；Node 的 test／review 不可略過，docs 可附具體理由 N/A。

## 邊界與交接

review pass 不直接等於 Node done；文件與其他適用 checks 仍由主線核對。
需要擴充工程檔案時由主線先更新 Node；已授權範圍內可自主調整，涉及未定產品結果或額外授權才詢問。
工具依 ai-workflow/tool-map.md 的實際可用命令選擇；外部來源依 ai-workflow/mcp-map.md，不預設平台已連線。
