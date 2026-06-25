# Definition of Done (DoD)

一個功能要進入 **Release** 之前，必須通過這道閘門。任一項未達成，功能 **not done**。

---

## 檢查清單

一個功能完成，必須滿足：

1. [ ] 所有 Development Nodes 狀態為 `done`（見 `node-status.md`）。
2. [ ] 所有必要測試已通過（單元 / 整合 / 必要的 E2E）。
3. [ ] Lint / format / type check 已通過。
4. [ ] API 文件已更新（`docs/api.md` 或 OpenAPI）。
5. [ ] DB 文件與 migration 狀態已更新（`docs/database.md`，migration 可回滾）。
6. [ ] UIUX 文件已更新（`docs/uiux.md` / `docs/design-system.md`）。
7. [ ] AI design artifact、Figma frame URL、visual QA 結果已寫入 feature spec / docs。
8. [ ] Architecture Decision Record 已更新（`docs/architecture-decisions/`）。
9. [ ] changelog 已更新（`docs/changelog.md`）。
10. [ ] known issues 已更新（`docs/known-issues.md`）。
11. [ ] code-reviewer 已完成審查（`review-report.md` 無 blocking 項）。
12. [ ] 沒有未說明的架構偏移。

---

## 使用方式

- **由 release-manager 主導檢查**，逐項核對。
- 文件類項目（4–10）由 docs-maintainer 在 Docs Update 階段完成。
- 全部通過 → 產出 release notes，歸檔 `tasks/current/` 至 `tasks/archive/feature-{name}/`。

---

## 與 DoR 的關係

| | Definition of Ready | Definition of Done |
|---|---|---|
| 守的閘門 | Planning → Implementation | Implementation → Release |
| 主責 | product-planner | release-manager |
| 核心問題 | 「需求夠清楚可以開工了嗎？」 | 「功能與文件都閉環了嗎？」 |

> 核心精神：規劃有輸入，流程有節點，架構有邊界，資料有來源，UI 有依據，開發有檢查，測試有證據，文件有回寫，產品有下一輪。
