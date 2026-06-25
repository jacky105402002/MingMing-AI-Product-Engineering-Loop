# AI Design Pipeline — AI 設計產線

這份文件定義「設計也由 AI 完成」版本的標準流程。目標不是只讓 AI 寫 UI 規格，而是讓 AI 產出可檢查、可重建、可交付給工程的設計成果。

---

## 核心定位

在本分支中，UIUX 不只是一份文字規格，而是一條可追蹤的設計產線：

```text
feature spec / flow
  -> design brief
  -> AI design artifact
  -> Figma reconstruction
  -> visual QA
  -> implementation handoff
```

設計交付物可以是 HTML prototype、mobile / web app mockup、dashboard、deck、screenshot、Figma frame，或可被前端工程師直接參考的 component spec。

---

## Source of Truth

| 類型 | 主要來源 | 備註 |
|---|---|---|
| 產品目標、使用者情境 | `tasks/current/feature-spec.md` | 由 product-planner 維護 |
| user flow / state flow | flow-designer 產物 | 用於排畫面與互動 |
| design brief | `docs/specs/feature-{name}.md` 的 Design Brief 段 | AI design-producer 產出 |
| AI prototype artifact | Open Design / HTML artifact / screenshot | 用於快速探索與視覺方向 |
| 可編輯設計稿 | Figma MCP / Figma Console MCP 建立的 frame | UI frame、component、token 的 source of truth |
| 工程交付規格 | component spec + states + RWD notes | frontend-developer 的實作依據 |

若 AI artifact、Figma、文件互相衝突，以 `ai-workflow/mcp-map.md` 指定的 source of truth 為準；無法判斷時停下回報。

---

## 標準流程

### 1. Design Brief

由 `uiux-designer` 或 `ai-design-producer` 依 feature spec 與 flow 產出：

- 目標使用者與核心任務
- 畫面清單與資訊層級
- 品牌語氣與視覺方向
- 裝置範圍：desktop / tablet / mobile / app frame
- 必要狀態：loading / empty / error / success / disabled
- 設計系統限制：token、元件庫、不可新增的 pattern
- 交付格式：HTML artifact、Figma frame、PPT / deck、screenshot

### 2. AI Design Artifact

使用 Open Design、Claude Design 類工具、v0、Gemini Canvas 或其他 AI design tool 產出 prototype。此階段允許快速探索，但每個 artifact 必須保留：

- prompt / brief
- 使用的 design system 或 style reference
- artifact URL / local path / screenshot
- 已知偏差與待修正點

### 3. Figma Reconstruction

若本功能需要正式設計稿，使用 Figma MCP / Figma Console MCP 將 artifact 重建為可編輯 frame：

- 建立 page / section / frame
- 建立文字、layout、component、variant
- 套用 color / spacing / typography tokens
- 對齊既有 Figma component library
- 記錄 Figma file / page / frame URL

注意：這是 AI 依 artifact 重建 Figma nodes，不是假設工具能完美匯出 `.fig`。

### 4. Visual QA

設計進入工程前必須完成視覺檢查：

- 桌機與手機 viewport 截圖
- 文字不溢出、不互相遮擋
- spacing、alignment、hierarchy 合理
- loading / empty / error 狀態有畫面
- Figma 與 prototype 的重大差異已記錄

### 5. Handoff

交給 frontend-developer 前，必須提供：

- Figma frame URL 或 artifact path
- component spec
- states table
- RWD notes
- design token 對照
- 視覺 QA 結果

---

## Output Template

```md
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
- Frontend notes:
```

---

## Quality Gates

1. AI artifact 不能取代 source of truth；正式進工程前仍要有可追蹤的 spec。
2. 需要 Figma 的功能，必須提供 Figma frame URL 或明確記錄「本次不需要 Figma」。
3. 每個動態區塊都必須有 loading / empty / error 狀態。
4. 視覺 QA 未完成，不可進入 frontend implementation。
5. 若工具輸出與設計系統衝突，回報衝突，不在下游硬湊。
