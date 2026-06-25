# MCP Map — 外部平台 source of truth 對照

定義哪個外部平台是哪類資訊的**唯一真實來源（source of truth）**。
這份是通用範本，依專案實際接入的 MCP / 平台調整。

---

## 對照表

| MCP / 平台 | Source of Truth | 適用 Skill |
|---|---|---|
| GitHub MCP | issue、PR、review、project board | product-planner、code-reviewer、release-manager |
| Figma MCP | UI frame、component、design token、prototype | uiux-designer、frontend-developer |
| Figma Console MCP | Figma node 建立、frame 重建、設計稿自動化產出 | ai-design-producer、uiux-designer |
| Open Design / AI design tool | AI design artifact、HTML prototype、設計探索稿 | ai-design-producer |
| draw.io / diagram source | system flow、architecture diagram、ERD | flow-designer、system-architect、data-modeler |
| Notion / Docs | 產品筆記、商業規劃、需求來源 | product-planner、docs-maintainer |
| OpenAPI / Postman | API contract | backend-developer、frontend-developer、qa-tester |
| Database schema | schema、migration、seed、ERD | data-modeler、backend-developer |
| Deployment platform | 環境變數、部署狀態、log | release-manager、backend-developer |

---

## 使用原則

1. MCP 不是越多越好，**要明確定義誰是 source of truth**。
2. **同一類資訊只能有一個主要 source of truth**。
3. 若 Figma、文件、程式碼衝突 → **回報衝突，不可自行猜測**。
4. AI design artifact 是探索與重建依據，不是正式 UI source of truth；需要正式設計稿時以 Figma frame 為準。
5. 每個 Skill 要明確定義它可使用哪些 MCP（見各 skill detail 的 Tools and MCP 段）。
6. 新 MCP 先在小專案試跑，再加入正式工作流。

---

## 衝突處理流程

```text
發現兩個來源不一致
  → 停下，不修改
  → 在 review-report.md / iteration-log.md 記錄衝突（哪兩個來源、各說什麼）
  → 依本表判斷誰是該類資訊的 source of truth
  → 若仍無法判斷 → 升級給人（PO / 架構負責人）
```

---

## 本專案 MCP 接入區

> 初始化時填入實際接入的 MCP 與帳號 / 專案範圍。

```text
已接入：
source of truth 指派：
尚未接入 / 計畫中：
```
