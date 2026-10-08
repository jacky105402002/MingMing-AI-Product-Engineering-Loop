# Node Template

複製 tasks/current/node-001.md 或以下欄位。Node 應有單一可驗證結果；不要用固定檔案數代替風險判斷。每個 Node 依序實作、QA、review、修正重測、文件與完成交接。

## 必填欄位

- Goal：可驗證結果。
- AC IDs：對應 feature AC；整合 Node 可覆蓋多條 AC。
- Scope / Out of Scope：本 Node 的範圍。
- Inputs：實際來源與版本；缺口先查證。
- Allowed Files：允許修改的具體檔案或資料夾。
- Forbidden Changes：明確禁止範圍。
- Tasks：可執行工作。
- Tests：指令／案例／環境／成功條件；含適用回歸與失敗路徑。
- Review：正確性、架構、權限、資料、UI 等適用項。
- Docs：應更新文件或無需更新理由。
- Output / Handoff：證據、產物與下一步。

依賴、owner、狀態、revision、evidence_files、check 結果統一記於 state.json，不在 Node 文件重複維護狀態。
Allowed Files 不夠時先按自治政策重切／更新計畫；不得默默越界。重要缺口才詢問，明確且在授權範圍的調整自行處理。
