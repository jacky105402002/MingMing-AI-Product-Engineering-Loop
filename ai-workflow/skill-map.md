# Skill Map

依 prompt-router 選擇路線，再讀當前角色的 detail。同一 agent 可以完成全部適用角色，切換角色不代表等待人工。

| 角色 | 主責／交付 | 說明 |
|---|---|---|
| product-planner | feature spec、AC、執行約定、Node 分工 | [產品規劃](../skills/product-planner.skill.md) |
| flow-designer | 正常／例外流程、狀態轉換與不變條件 | [流程設計](../skills/flow-designer.skill.md) |
| system-architect | 影響分析、必要 ADR、依賴與整合策略 | [系統架構](../skills/system-architect.skill.md) |
| data-modeler | schema 計畫、migration 設計、恢復與驗證計畫 | [資料設計](../skills/data-modeler.skill.md) |
| uiux-designer | 畫面／元件規格、互動狀態與可及性要求 | [介面與體驗設計](../skills/uiux-designer.skill.md) |
| frontend-developer | 前端實作、必要測試、契約相容性與交接資料 | [前端開發](../skills/frontend-developer.skill.md) |
| backend-developer | API 契約、後端實作、權限／驗證／相容性測試 | [後端與 API](../skills/backend-developer.skill.md) |
| qa-tester | 每次 attempt 的測試報告、log、test evidence | [品質驗證](../skills/qa-tester.skill.md) |
| code-reviewer | 每次 attempt 的 review 報告與 evidence | [程式審查](../skills/code-reviewer.skill.md) |
| docs-maintainer | 文件差異、changelog、known issues、完成與交接報告 | [文件維護](../skills/docs-maintainer.skill.md) |
| release-manager | release record、發布與驗證證據、後續觀察與歸檔 | [發布管理](../skills/release-manager.skill.md) |

backend-developer 在 06 主責 API 契約，frontend-developer 與 QA 共同核對。主線協調者唯一更新 state.json；roles 不各自建立第二份狀態表。
