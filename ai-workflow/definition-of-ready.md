# Definition of Ready (DoR)

一個功能要從 **Planning 進入 Implementation** 之前，必須通過這道閘門。
未通過代表還在 Planning / Design 階段，不可開始寫實作程式。

---

## 檢查清單

一個功能可以進入開發，必須滿足：

1. [ ] 已定義使用者場景（誰、在什麼情境、要達成什麼）。
2. [ ] 已定義功能邊界（做什麼 / 不做什麼，Out of Scope 明確）。
3. [ ] 已定義驗收條件（可驗證、可測試的 acceptance criteria）。
4. [ ] 已確認會影響哪些模組（module impact 初判）。
5. [ ] 已完成**資料形狀草圖**（主要實體、關鍵欄位、關聯、生命週期、對既有資料的影響）——「這個功能的資料長怎樣」答得出來。
6. [ ] 已確認是否需要 API contract（要 / 不要，要的話有大致 request/response）。
7. [ ] 已確認是否需要 UIUX / AI 設計產出（要 / 不要，要的話有 design brief、wireframe / AI artifact / Figma frame）。
8. [ ] 若需要正式設計稿，已提供 Figma frame URL 或記錄本次不需要 Figma 的理由。
9. [ ] 已完成必要的 visual QA（desktop / mobile、文字溢出、主要狀態）。
10. [ ] 已拆成 Development Nodes（`tasks/current/nodes.md` 存在且依賴清楚）。
11. [ ] 已定義每個 Node 的測試方式。
12. [ ] 已確認不應修改的範圍（Forbidden Changes）。

---

## 使用方式

- **由 product-planner 主導檢查**，必要項目向 system-architect / data-modeler / uiux-designer 確認。
- 任一項為否 → 功能 **not ready**，回對應 Skill 補齊。
- 全部通過 → 在 `feature-spec.md` 標記 `Status: Ready`，進入 Implementation。

---

## 常見不通過原因

- 驗收條件寫成「做得好用」這種無法驗證的描述。
- Out of Scope 空白，導致開發中無限擴張。
- Node 切太大（一個 Node 等於整個功能）。
- 資料形狀草圖跳過，實作到一半才發現要改 schema 或遷移既有資料。
- AI design artifact 沒有 Figma / component spec / visual QA，導致前端只能憑截圖猜。
