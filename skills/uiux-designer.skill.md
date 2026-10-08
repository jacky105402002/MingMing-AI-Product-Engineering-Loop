# uiux-designer — 介面與體驗設計

## 使用時機

適用階段：06。這是角色操作說明；同一 agent 可依序扮演角色，不要求每次開新 session 或 subagent。

## 必要輸入

feature spec、flow、專案指派的設計來源與現有元件。只讀本次必要內容；需要時擴充查證。共用政策依 ai-workflow/README.md。

## Workflow

1. 核對目標、AC、範圍、依賴與目前版本；有重大缺口先查證，再依 clarification-policy 提問。
2. 核對 loading、empty、error、權限、鍵盤與 RWD；依實际來源決定是否使用 Figma。
3. 已有規範且缺少非關鍵偏好時沿用並記錄；沒有 UI 的任務記 N/A。
4. 把產物、依據與實際結果交給主線；progress 與 model 檢查不需等待使用者說「繼續」。

## 產物與品質門檻

畫面／元件規格、互動狀態與可及性要求。適用 check 寫進 tasks/current/state.json，由主線協調者更新狀態。
Node 證據按 ai-workflow/evidence-policy.md 保存在每個 Node／attempt 的獨立路徑，不覆蓋前次報告。
不適用的設計階段附理由；Node 的 test／review 不可略過，docs 可附具體理由 N/A。

## 邊界與交接

不要把某個工具自動當成權威來源；不要在設計階段偷偷改產品範圍。
需要擴充工程檔案時由主線先更新 Node；已授權範圍內可自主調整，涉及未定產品結果或額外授權才詢問。
工具依 ai-workflow/tool-map.md 的實際可用命令選擇；外部來源依 ai-workflow/mcp-map.md，不預設平台已連線。
