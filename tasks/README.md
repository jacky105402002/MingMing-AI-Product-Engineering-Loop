# tasks/ — 任務層

當前正在開發的功能，其 spec、node、report 都放這裡。功能完成後整包移到 `archive/`。

```text
tasks/
  current/                 ← 當前功能的工作區（一次一個功能）
    feature-spec.md        ← 功能規格（product-planner 產出）
    nodes.md               ← Node 切分總覽與依賴
    node-001.md            ← 各 Node 細節（用 ai-workflow/node-template.md）
    node-002.md
    test-report.md         ← qa-tester 產出
    review-report.md       ← code-reviewer 產出
    iteration-log.md       ← 本功能開發過程的決策 / 卡點流水帳
  archive/
    feature-{name}/        ← 完成功能歸檔（release-manager 搬移）
```

## 與其他層的關係

- 格式來源：`feature-spec` ← product-planner；`node-00X` ← `ai-workflow/node-template.md`；report ← `ai-workflow/review-checklist.md` 與 qa-tester。
- 狀態總表：各 Node 的狀態同步登記到 `ai-workflow/node-status.md`。
- 這層是 AI 執行時的**主要讀寫落點**（見 `ai-workflow/context-policy.md` 的最小上下文白名單）。

## 使用規則

1. **一次只開發一個功能**：`current/` 內只放當前功能。
2. 功能完成（過 Definition of Done）→ release-manager 把 `current/` 內容搬到 `archive/feature-{name}/`，清空 `current/` 重置。
3. 每個 Node 完成更新 `node-status.md`；過程中的決策 / 卡點記在 `iteration-log.md`。

> 本資料夾現有的檔案皆為**空白模板**，導入新功能時直接填寫或複製。
