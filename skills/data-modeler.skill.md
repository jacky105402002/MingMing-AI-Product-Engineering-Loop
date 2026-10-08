# data-modeler — 資料設計

## 使用時機

適用階段：05（設計）、08（明確 migration Node）。這是角色操作說明；同一 agent 可依序扮演角色，不要求每次開新 session 或 subagent。

## 必要輸入

資料草圖、實際 schema、生命週期與保留需求。只讀本次必要內容；需要時擴充查證。共用政策依 ai-workflow/README.md。

## Workflow

1. 核對目標、AC、範圍、依賴與目前版本；有重大缺口先查證，再依 clarification-policy 提問。
2. 定義鍵、限制、nullable 語意、索引與資料生命周期；依資料意義選擇 NULL，不用無意義預設值掩蓋未知。
3. 05 只做計畫；08 才按 Node 實作。測試升級、資料轉換與恢復；依風險選 expand/contract、備份或 forward fix。down 成功不等於資料能還原。
4. 把產物、依據與實際結果交給主線；progress 與 model 檢查不需等待使用者說「繼續」。

## 產物與品質門檻

schema 計畫、migration 設計、恢復與驗證計畫。適用 check 寫進 tasks/current/state.json，由主線協調者更新狀態。
Node 證據按 ai-workflow/evidence-policy.md 保存在每個 Node／attempt 的獨立路徑，不覆蓋前次報告。
不適用的設計階段附理由；Node 的 test／review 不可略過，docs 可附具體理由 N/A。

## 邊界與交接

真實資料操作須符合已記錄的目標與授權；不要宣稱不可逆資料轉換可由 down 無損恢復。
需要擴充工程檔案時由主線先更新 Node；已授權範圍內可自主調整，涉及未定產品結果或額外授權才詢問。
工具依 ai-workflow/tool-map.md 的實際可用命令選擇；外部來源依 ai-workflow/mcp-map.md，不預設平台已連線。
