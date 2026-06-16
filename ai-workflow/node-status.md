# Node Status

> 這份檔案追蹤**目前功能**的所有 Node 狀態。每次開工先看、收工後更新。
> 功能完成歸檔時，整份移到 `tasks/archive/feature-{name}/`。

---

## Current Feature

`{feature-name}` — 一句話描述。

關聯文件：
- Spec：`tasks/current/feature-spec.md`
- Nodes 總覽：`tasks/current/nodes.md`

---

## Nodes

| Node | Title | Status | Owner Skill | Depends on | Notes |
|---|---|---|---|---|---|
| 001 | {title} | pending | product-planner | — | |
| 002 | {title} | pending | data-modeler | 001 | |
| 003 | {title} | pending | backend-developer | 002 | |

---

## Status Definition

| 狀態 | 意義 |
|---|---|
| `pending` | 尚未開始 |
| `in_progress` | 進行中 |
| `blocked` | 被依賴 / 外部因素卡住（Notes 註明原因） |
| `review_needed` | 實作完成，等待 review / test |
| `done` | 通過 review checklist 與測試 |

---

## 更新規則

1. 開始一個 Node → 設為 `in_progress`。
2. 卡住 → 設為 `blocked`，並在 Notes 寫明卡在什麼、需要誰。
3. 實作完 → `review_needed`，交給 qa-tester / code-reviewer。
4. 通過審查與測試 → `done`。
5. 全部 `done` 且 `definition-of-done.md` 通過 → 功能可進入 Release。
