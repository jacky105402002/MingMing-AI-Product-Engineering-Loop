# Feature Spec — {feature name}

> 由 product-planner 產出。格式與規則見 `skills/product-planner.skill.md`。
> 進入開發前必須過 `ai-workflow/definition-of-ready.md`。

## Status
Draft | Ready | In Progress | Done

## Problem Statement
一句話：我們要解決誰的什麼問題。

## Target Users
- 角色 / 情境

## User Scenarios
1. 作為 {角色}，當 {情境}，我想要 {行為}，以便 {價值}。

## In Scope
- ...

## Out of Scope
- ...

## Acceptance Criteria
- [ ] AC1（Given … When … Then …，可驗證）
- [ ] AC2

## Data Shape Sketch（資料形狀草圖 — 必填）
> 不是完整 schema，但要在規劃階段就想清楚資料長相。細化交 data-modeler。
- 主要實體：{Entity}（代表什麼）
- 關鍵欄位：{欄位 — 型別 / 意義 / 是否必填}
- 關聯：{A 1—N B；B M—N C …}
- 生命週期：{建立 / 更新 / 軟刪除 / 封存；誰能改}
- 既有資料影響：{會不會動到現有表 / 既有資料如何遷移}

## Impact (初判)
| 面向 | 是否影響 | 下游 Skill |
|---|---|---|
| 流程 | 是/否 | flow-designer |
| 架構 / 模組 | 是/否 | system-architect |
| DB schema | 是/否 | data-modeler |
| API contract | 是/否 | backend-developer |
| UIUX | 是/否 | uiux-designer |

## Open Questions
- 待釐清項目（未解決前不可進入開發）

## Nodes
見 `tasks/current/nodes.md`
