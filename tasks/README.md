# 任務層

current 是一次一個功能的工作區；state.json 是唯一狀態。templates 保存可複用格式，current 的報告索引不寫個別結果。

## 工作目錄

- feature-spec.md／node-001.md：需求與節點詳細內容。
- state.json：mode、功能、階段、AC、Node、依賴、問題、驗證路徑。
- handoff.md：接續摘要。
- reports/{node-id}/{attempt-id}/：不可覆蓋的 test、review、completion、evidence 與 logs。
- iteration-log.md：決策與過程紀錄。

初始 mode=template 且無 Node。填真實規格後改 active，依 ai-workflow/state-contract.md 建立資料。不要把模板樣板的 Node 001 當成已存在工作。
想同時做另一功能時先明確指定獨立任務目錄並用 validator --state 指向它，不覆寫 current。

本 repository 的自身維護驗證保存於 tasks/validation，與使用者產品任務的 current／archive 分開。維護驗證完成不等於 GitHub 發布完成。
