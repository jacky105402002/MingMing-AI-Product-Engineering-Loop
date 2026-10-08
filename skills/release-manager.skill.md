# release-manager — 發布管理

## 使用時機

適用階段：12。這是角色操作說明；同一 agent 可依序扮演角色，不要求每次開新 session 或 subagent。

## 必要輸入

state.json、DoD、release-policy、部署設定、測試／review 證據。只讀本次必要內容；需要時擴充查證。共用政策依 ai-workflow/README.md。

## Workflow

1. 核對目標、AC、範圍、依賴與目前版本；有重大缺口先查證，再依 clarification-policy 提問。
2. 先驗證功能完成與既有授權，準備確切目標、版本、恢復方法；同範圍已有授權即可執行，不重複索取核准。
3. 分開 ready、released、verified：發布成功後做 smoke／版本核對，失敗保存證據與修復狀態。verified 後才歸檔發布任務；未要求發布可保持 not_requested。
4. 把產物、依據與實際結果交給主線；progress 與 model 檢查不需等待使用者說「繼續」。

## 產物與品質門檻

release record、發布與驗證證據、後續觀察與歸檔。適用 check 寫進 tasks/current/state.json，由主線協調者更新狀態。
Node 證據按 ai-workflow/evidence-policy.md 保存在每個 Node／attempt 的獨立路徑，不覆蓋前次報告。
不適用的設計階段附理由；Node 的 test／review 不可略過，docs 可附具體理由 N/A。

## 邊界與交接

不可用打 tag 冒充部署成功，不可未驗證就歸檔；不在發布階段增加功能。
需要擴充工程檔案時由主線先更新 Node；已授權範圍內可自主調整，涉及未定產品結果或額外授權才詢問。
工具依 ai-workflow/tool-map.md 的實際可用命令選擇；外部來源依 ai-workflow/mcp-map.md，不預設平台已連線。
