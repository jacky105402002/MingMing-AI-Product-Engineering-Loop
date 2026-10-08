# product-planner — 產品規劃

## 使用時機

適用階段：01、02、07。這是角色操作說明；同一 agent 可依序扮演角色，不要求每次開新 session 或 subagent。

## 必要輸入

原始需求、現況、產品來源、clarification-policy。只讀本次必要內容；需要時擴充查證。共用政策依 ai-workflow/README.md。

## Workflow

1. 核對目標、AC、範圍、依賴與目前版本；有重大缺口先查證，再依 clarification-policy 提問。
2. 先讀取既有 repo 與來源，區分可查證事項、可自主決定的工程細節、真正需問人的產品問題。
3. 先達 Design Ready 才推進設計；設計完成後切出包含測試、review、文件與整合驗證的 Nodes，檢查 Implementation Ready。
4. 把產物、依據與實際結果交給主線；progress 與 model 檢查不需等待使用者說「繼續」。

## 產物與品質門檻

feature spec、AC、執行約定、Node 分工。適用 check 寫進 tasks/current/state.json，由主線協調者更新狀態。
Node 證據按 ai-workflow/evidence-policy.md 保存在每個 Node／attempt 的獨立路徑，不覆蓋前次報告。
不適用的設計階段附理由；Node 的 test／review 不可略過，docs 可附具體理由 N/A。

## 邊界與交接

不要要求使用者先填滿 Intake；不要在契約未明時宣稱 Implementation Ready。
需要擴充工程檔案時由主線先更新 Node；已授權範圍內可自主調整，涉及未定產品結果或額外授權才詢問。
工具依 ai-workflow/tool-map.md 的實際可用命令選擇；外部來源依 ai-workflow/mcp-map.md，不預設平台已連線。
