# Nodes — {feature name}

> Task Breakdown 產出（product-planner + system-architect）。
> Node 切分原則見 `ai-workflow/node-template.md`；狀態同步到 `ai-workflow/node-status.md`。

## Feature
`{feature name}` — 一句話。關聯：`feature-spec.md`

## Node 總覽

| Node | Title | Owner Skill | Depends on | 路徑 | Status |
|---|---|---|---|---|---|
| 001 | {title} | product-planner | — | Full-Loop | pending |
| 002 | {title} | data-modeler | 001 | Full-Loop | pending |
| 003 | {title} | backend-developer | 002 | Full-Loop | pending |
| 004 | {title} | frontend-developer | 003 | Full-Loop | pending |

> Status 定義見 `ai-workflow/node-status.md`：pending / in_progress / blocked / review_needed / done。

## 依賴關係

```text
001 → 002 → 003 → 004
```

## 切分檢查（給 product-planner / system-architect）

- [ ] 每個 Node 有單一、可獨立驗證的 Goal。
- [ ] 每個 Node 的 Allowed Files 範圍可控（非「整個模組」）。
- [ ] 沒有 Node 同時跨 DB + API + UI 三層（太大要再切）。
- [ ] Node 之間依賴明確、無循環。
- [ ] 每個 Node 對應到 feature-spec 的某些 Acceptance Criteria。
