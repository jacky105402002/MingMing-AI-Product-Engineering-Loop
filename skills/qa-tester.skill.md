# qa-tester — 品質驗證

## 使用時機

適用階段：09。這是角色操作說明；同一 agent 可依序扮演角色，不要求每次開新 session 或 subagent。

## 必要輸入

Node、AC、diff、相依與專案實際測試命令。只讀本次必要內容；需要時擴充查證。共用政策依 ai-workflow/README.md。

## React 資源使用

驗證使用 [React 精選資源](../ai-workflow/frontend-resource-map.md)的畫面時，依元件影響檢查手機／桌機、鍵盤焦點、loading／empty／error、減少動態效果與必要效能。進階資料元件須測實際排序、篩選、分頁及權限等適用行為，不能用展示資料成功代替 API 整合驗證。

## Workflow

1. 核對目標、AC、範圍、依賴與目前版本；有重大缺口先查證，再依 clarification-policy 提問。
2. 從 AC 與風險設計正向、負向與必要回歸；執行真正可用命令，區分未跑、失敗、環境阻塞與通過。
3. 偶發問題保存觀察、時間、環境、頻率與影響；不可因尚未穩定重現就斷言不是 bug。修復交給開發角色，修後重測。
4. 把產物、依據與實際結果交給主線；progress 與 model 檢查不需等待使用者說「繼續」。

## 產物與品質門檻

每次 attempt 的測試報告、log、test evidence。適用 check 寫進 tasks/current/state.json，由主線協調者更新狀態。
Node 證據按 ai-workflow/evidence-policy.md 保存在每個 Node／attempt 的獨立路徑，不覆蓋前次報告。
不適用的設計階段附理由；Node 的 test／review 不可略過，docs 可附具體理由 N/A。

## 邊界與交接

不以測試檔存在、模板勾選或另一版本結果宣稱通過。
需要擴充工程檔案時由主線先更新 Node；已授權範圍內可自主調整，涉及未定產品結果或額外授權才詢問。
工具依 ai-workflow/tool-map.md 的實際可用命令選擇；外部來源依 ai-workflow/mcp-map.md，不預設平台已連線。
