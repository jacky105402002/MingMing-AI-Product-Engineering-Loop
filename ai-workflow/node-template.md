# Node Template — Development Node 標準格式

大型功能不可一次做完，必須拆成多個 Development Node。每個 Node 都能**獨立執行、檢查、測試、回寫**。

複製下方模板到 `tasks/current/node-00X.md`，逐欄填寫。空欄位代表沒想清楚，不要留白就開工。

---

```md
# Node {number}: {node title}

## Goal
本節點要完成什麼。一句話講清楚可驗證的結果。

## Background
為什麼需要這個節點。它在 feature 裡的位置。

## Scope
允許處理的範圍。

## Out of Scope
本節點明確不處理的範圍。

## Inputs
需要讀取的文件、設計、issue、程式碼（列出具體路徑）。

## Allowed Files
允許新增 / 修改的檔案或資料夾（盡量精確到目錄或檔名）。

## Forbidden Changes
明確禁止修改的範圍（例如：不可動 DB schema、不可改公共元件）。

## Tasks
1. 任務一
2. 任務二
3. 任務三

## Quality Gates
1. 架構符合 docs/architecture.md
2. 命名符合既有慣例 / docs 規範
3. 無新增未紀錄的相依套件
4. 無跨模組直接依賴內部實作
5. 無未處理的錯誤狀態

## Tests
需要執行的測試（單元 / 整合 / E2E）與通過標準。

## Review Checklist
引用 ai-workflow/review-checklist.md，標出本 Node 特別需要看的項目。

## Output
完成後要更新哪些文件 / 產出哪些報告。

## Handoff
下一個 Node 或下一個 Skill。
```

---

## Node 切分原則（給 AI）

**一個 Node 的合理大小**：
- 可在單一上下文視窗內完成，不需中途遺忘前面需求。
- 修改檔案數量可控（建議 ≤ 5～8 個核心檔，視專案而定）。
- 有明確、可獨立驗證的產出。

**太大的徵兆**（要再切）：
- Allowed Files 列出整個模組或「全部」。
- Tasks 超過 ~7 項且彼此跨層（同時動 DB + API + UI）。
- 無法寫出單一可驗證的 Goal。

**太小的徵兆**（可合併）：
- Node 之間必須共享大量上下文才看得懂。
- 單一 Node 改動只有 1～2 行且無獨立測試價值。

**切分後**：在 `tasks/current/nodes.md` 列出所有 Node 與依賴順序，並在 `node-status.md` 登記狀態。

---

## 執行時的鐵則

1. 只改 `Allowed Files` 範圍內的檔案。
2. 碰到 `Forbidden Changes` 需求 → 停下回報，不自行突破。
3. 發現 scope 不足 → 停下回報，回 task breakdown 重切。
4. 文件與程式衝突 → 記錄，不猜測。
5. 優先沿用既有架構與命名，不為單一功能引入大型依賴。
