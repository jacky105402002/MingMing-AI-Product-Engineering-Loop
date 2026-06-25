# docs/ — 知識層

產品的長期知識文件。**這是契約檔**:定義每份文件裝什麼、誰維護、source of truth 在哪、何時建立。

## 兩條鐵則

1. **不重複程式碼已記錄的東西**:docs 寫「為什麼」與「現況決策」,不抄目錄結構、不複製可由 code 推得的內容。
2. **一類資訊一個 source of truth**:若真相在 Figma / DB / OpenAPI,該文件就**指向它**,不複製(見 `ai-workflow/mcp-map.md`)。

---

## 文件分類與狀態

### A 類 — 基礎參考文件(intake 種、docs-maintainer 維護)
> 屬專案專屬內容,**不憑空建空模板**。導入專案填完 `docs/intake.md` 後種出初版,之後隨開發回寫。

| 文件 | 裝什麼 | 主要維護 Skill | Source of Truth |
|---|---|---|---|
| `product.md` | 產品定位、價值、功能邊界 | product-planner / docs-maintainer | Notion / Docs |
| `product-roadmap.md` | 功能優先序、版本規劃 | product-planner | Notion / Docs |
| `architecture.md` | 架構分層、原則、技術棧、編碼風格 | system-architect | 本檔 |
| `modules.md` | 模組清單與職責邊界 | system-architect | 本檔 / code |
| `database.md` | schema 現況、ERD、命名慣例、生命週期 | data-modeler | DB schema |
| `api.md` | API contract 總覽 | backend-developer | OpenAPI / Postman |
| `uiux.md` | 畫面結構、互動規範、AI artifact 對齊結果 | uiux-designer / ai-design-producer | Figma |
| `design-system.md` | 元件、token、品牌、AI 設計輸出約束 | uiux-designer / ai-design-producer | Figma |
| `testing.md` | 測試策略、覆蓋原則 | qa-tester | 本檔 |
| `deployment.md` | 環境、部署流程、回滾 | release-manager | Deployment platform |

> 狀態:**尚未建立**(押後,見 `intake.md` 與 workflow-improvement-log)。

### B 類 — Append-only 日誌(已建)
| 文件 | 裝什麼 | 主要維護 Skill |
|---|---|---|
| `changelog.md` | 對外版本變更紀錄 | docs-maintainer / release-manager |
| `known-issues.md` | 已知問題、技術債、暫時權衡 | docs-maintainer |

### C 類 — Per-feature 動態產物(跑 loop 時生成)
| 路徑 | 裝什麼 | 產出 Skill |
|---|---|---|
| `specs/README.md` | per-feature spec 與 AI design handoff 範本 | — |
| `specs/feature-{name}.md` | 單一功能的 flow / UI / schema / AI design artifact / Figma / visual QA 規格細節 | flow / uiux / ai-design-producer / data-modeler |
| `architecture-decisions/adr-{name}.md` | 架構決策紀錄 | system-architect |
| `architecture-decisions/adr-template.md` | ADR 範本(已建) | — |

> C 類真檔案在開發時才生成;現在只備好範本。

---

## 內容管線(A 類怎麼來)

```text
docs/intake.md(填寫表)
   → 導入時 AI 種出 A 類初版
   → 開發中 docs-maintainer 依「回寫對照表」維護同步
        (對照表見 skills/docs-maintainer.skill.md)
```

**不要**在 intake → docs-maintainer 這條管線中間,多疊一層空白填空模板。

---

## 回寫規則

任何變更依 `skills/docs-maintainer.skill.md` 的回寫對照表,更新對應文件。
回寫格式統一:
```md
## {date} - {feature or node}
Changed: / Reason: / Impact: / Related:
```

## 何時建立 A 類文件

- **導入新專案**:填完 intake,一次種出全部 A 類初版。
- **或 lazy 建立**:某 doc 第一次被回寫時才建(符合 context-policy「不建沒人讀的檔」)。
- 兩種皆可;有完整 intake 資料時建議前者,內容較完整。
