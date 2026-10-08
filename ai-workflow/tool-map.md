# Tool Map

命令必須從專案設定與實際環境查證，不能把下表工具舉例當成已安裝。

| 類型 | 用途 | 適用性 |
|---|---|---|
| git / rg / terminal | 讀取現況、差異、查證與執行 | 按可用性 |
| test runner | AC、負向與回歸驗證 | 每個 Node 必須有實際驗證 |
| lint / type / build | 專案品質檢查 | 依技術棧與變更判定，N/A 記原因 |
| browser / UI testing | UI 狀態、操作、可及性 | 有 UI 影響時 |
| migration / DB tools | 升級、資料驗證與恢復 | 有資料變更時 |

## 本工作流 repository

- Runtime：Node.js 22，僅標準函式庫，無 npm install 步驟。
- 模板與連結驗證：`node scripts/validate-workflow.mjs`。
- 自動測試：`node --test tests/*.test.mjs`。
- 真實任務狀態：`node scripts/validate-workflow.mjs --require-active`。
- 本 repo 不含產品 UI、資料庫或部署服務，不能宣稱跑過產品 E2E。

## 導入專案時替換

記錄每類檢查的實際命令、工作目錄、runtime／lockfile、必要環境、成功條件與 N/A 原因。執行失敗或環境不可用記 blocked／fail，不能用預計命令代替執行結果。不要把 secrets 寫入檔案或 log。
