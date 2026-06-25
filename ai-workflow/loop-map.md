# Loop Map — 產品開發主流程

AI 用這份地圖判斷**目前走到哪個階段**、**上一階段該交付什麼給我**、**我做完要交給誰**。

---

## 兩條路徑

並非所有變更都跑完整 12 階段。先到 `prompt-router.md` 做**變更分級**：
- **Fast-Track**：bugfix / 微調 / 文件，走精簡序列（developer → code-reviewer →（必要時）docs）。
- **Full-Loop**：新功能 / 動架構 / **動資料模型** / 動公共契約，走完整下列 12 階段。

> 鐵則：只要動到資料模型或跨模組契約，一律 Full-Loop。

---

## 核心原則：資料是第一公民

對要活 3 年以上的產品，**資料模型是最貴、最難改的東西**。因此：

1. **資料形狀在 02 Planning 就要起草**，不等到 05。product-planner 的 feature-spec 必須附「資料形狀草圖」（主要實體、關鍵欄位、關聯、生命週期），它往往才是真正定義功能邊界的東西。
2. 05 Data Modeling 負責把草圖**細化成可落地的 schema / migration**，而不是從零開始想資料長相。
3. 任一階段發現資料草圖與後續設計衝突 → 回 02 重對齊，不在下游硬湊。

---

## 主流程

```text
01 Idea / Requirement Input
   ↓
02 Product Planning        (product-planner)
   ↓
03 Flow Design             (flow-designer)
   ↓
04 System Architecture     (system-architect)
   ↓
05 Data Modeling           (data-modeler)
   ↓
06 UIUX / AI Design        (uiux-designer + ai-design-producer)
   ↓
07 Task Breakdown          (product-planner + system-architect)
   ↓
08 Implementation Nodes    (frontend-developer / backend-developer)
   ↓
09 Test & Review           (qa-tester + code-reviewer)
   ↓
10 Fix & Refactor          (frontend/backend-developer)
   ↓
11 Docs Update             (docs-maintainer)
   ↓
12 Release / Next Iteration(release-manager)
```

流程**不一定線性**。常見回圈：
- 09 → 10 → 09（修正後重測）
- 04/05 發現需求不清 → 回 02
- 08 發現 scope 不足 → 停下回報，回 07 重切 Node

---

## 階段交接表

每個階段定義：**輸入（上一棒交什麼）→ 主責 Skill → 輸出（交給下一棒什麼）**。

| # | 階段 | 輸入 | 主責 Skill | 輸出（交付物） |
|---|---|---|---|---|
| 01 | Requirement Input | 原始想法 / issue / 客戶需求 | —（人/PO） | raw requirement、brief |
| 02 | Product Planning | raw requirement | product-planner | feature spec、acceptance criteria、**資料形狀草圖**、影響範圍初判 |
| 03 | Flow Design | feature spec | flow-designer | user flow、business flow、state / sequence notes |
| 04 | System Architecture | feature spec + flow | system-architect | ADR、module impact report |
| 05 | Data Modeling | 資料形狀草圖 + ADR + flow | data-modeler | DB change plan、ERD、migration 計畫（細化草圖，非從零） |
| 06 | UIUX / AI Design | feature spec + flow + design system | uiux-designer + ai-design-producer | design brief、AI artifact、Figma frame、component spec、互動狀態、visual QA |
| 07 | Task Breakdown | 02–06 全部產出 | product-planner + system-architect | development nodes（`tasks/current/nodes.md` + `node-00X.md`） |
| 08 | Implementation | node files | frontend / backend-developer | code、partial tests、partial docs |
| 09 | Test & Review | code + nodes | qa-tester + code-reviewer | test-report.md、review-report.md |
| 10 | Fix & Refactor | review/test 問題 | frontend / backend-developer | fix log、refactor notes |
| 11 | Docs Update | 全部變更 | docs-maintainer | 更新後的 docs、changelog、known-issues |
| 12 | Release | DoD 通過 | release-manager | release notes、next backlog |

---

## 進入下一階段的閘門

- **02 → 08**：必須通過 `definition-of-ready.md`（需求、邊界、驗收、影響、Node 切分都齊全）。
- **09 完成**：每個 Node 必須通過 `review-checklist.md`。
- **12 之前**：必須通過 `definition-of-done.md`（測試、文件、ADR、changelog 全部到位）。

---

## 給 AI 的判讀規則

1. 不確定自己在哪個階段時，看 `tasks/current/node-status.md` 的 Node 狀態。
2. 收到的輸入不足上表要求時 → **停下回報**，不要硬往下做。
3. 一次只推進一個階段；跨階段大跳要先說明理由。
