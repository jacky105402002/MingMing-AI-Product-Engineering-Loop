# Feature Specs — 功能規格與設計交付

此資料夾放每個功能的長期規格文件，命名建議：

```text
feature-{name}.md
```

在 AI design-driven loop 中，功能規格除了產品、資料、流程，也要保存設計交付證據。

---

## 建議章節

```md
# Feature: {name}

## Product Summary
- Problem:
- User:
- Goal:
- Acceptance criteria:

## Data Shape Sketch
- Entities:
- Fields:
- Relations:
- Lifecycle:

## Flow
- User flow:
- State flow:

## Design Brief
- Goal:
- Audience:
- Screens:
- Visual direction:
- Device targets:
- Required states:
- Design system constraints:

## AI Artifact
- Tool:
- Prompt / brief:
- Artifact URL / path:
- Screenshot:
- Known gaps:

## Figma Reconstruction
- Figma file:
- Page / frame:
- Components created / reused:
- Tokens used:
- Differences from artifact:

## Visual QA
| Viewport | Result | Evidence |
|---|---|---|
| Desktop | pass / fail | screenshot / note |
| Mobile | pass / fail | screenshot / note |

## Engineering Handoff
- Component spec:
- States:
- RWD:
- API notes:
- Frontend notes:
```

---

## 使用原則

1. `tasks/current/feature-spec.md` 是任務期間的工作檔；本資料夾保存長期規格。
2. AI artifact 必須留下 prompt、artifact URL / path 與已知偏差。
3. 需要 Figma 的功能必須記錄 Figma file / page / frame。
4. visual QA 未完成，不可標記 ready for implementation。
