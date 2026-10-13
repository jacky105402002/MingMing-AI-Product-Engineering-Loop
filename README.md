# MingMing AI Product Engineering Loop

明明工作室的 AI 主導開發工作流。**v1.1 系列主要版本：v1.1.2**，將需求、設計、實作、測試、審查、文件與發布串成可追蹤流程。

**AI 在明確範圍內完成每個 Node 的完整 workflow；先查證資料，只有缺口、歧義或授權不足會影響結果時才詢問。** 人工不用介入例行的角色切換、測試重跑或節點交接。

## 立即開始

1. 將本套工作流導入產品專案；有同名檔時先合併，切勿覆蓋原專案規則與任務。見 [導入與升級](docs/adoption.md)。
2. 開啟專案，讓 AI 讀 [AGENTS.md](AGENTS.md)，提供需求與已知限制。資料不完整也能先開始查證與規劃。
3. AI 依 [intake](docs/intake.md)檢查現況並建立必要資料，不要求你先填完全部文件。
4. AI 初始化 tasks/current/state.json，通過適用的 Ready Gate 後連續推進。進度與阻塞寫入 [交接](tasks/current/handoff.md)。
5. 請求示例：「依 MingMing 工作流完成此功能。先查證現況，重要資訊不足時詢問，其餘工作自主推進到測試、審查與文件完成。」

本套包含 MingMing 與 security-planner 兩個 Codex Skill，位於 .agents/skills/；12 個角色文件是按需讀取的專業規範，不必部署 12 個 agent。其他客戶端可明確讀取 AGENTS.md，見 [相容性與導入](docs/adoption.md)。

## 四層結構

| 層 | 內容 | 用途 |
|---|---|---|
| ai-workflow/ | 路由、自治、釐清、Ready／Done、證據契約 | 決定如何執行與何時詢問 |
| skills/ | 12 個角色 | 標準化專業產物與品質 |
| docs/ | 專案來源、知識、決策、版本與問題 | 保存長期知識 |
| tasks/ | 唯一狀態、節點、各次證據、交接與歸檔 | 支援可恢復的執行 |

完整導覽見 [總控層](ai-workflow/README.md)。

## v1.1.0 的改變

v1.1.2 已整合下列基礎能力與 [React 精選資源](ai-workflow/frontend-resource-map.md)：shadcn/ui、ReUI、Magic UI、React Bits，供六個相關角色按需選型與驗證。

- 模型評估與進度通知不再是人工閘門；以重要不確定性與實際授權判斷是否詢問。
- Fast-Track 與 Full-Loop 共用驗證底線，依風險選擇適用階段；不適用要記理由。
- state.json 是唯一狀態來源，報告按 Node／attempt 保存並綁定版本與檔案 SHA-256。
- 補齊 API 契約、migration 恢復、發布驗證與產品成效回饋。
- 提供無第三方依賴的 validator、測試、CI 與情境範例。

## 執行檢查

需要 Node.js 22 或更新的相容版本：

```sh
node scripts/validate-workflow.mjs
node --test tests/*.test.mjs
```

預設 current 是空白模板，檢查器會明示 TEMPLATE；這不代表真實功能完成。實際任務可執行：

```sh
node scripts/validate-workflow.mjs --state tasks/current/state.json --require-active
```

檢查器驗證結構、依賴、來源、hash 與證據關聯；無法替代實際產品測試與語意 review。首次真產品試跑與成效量測仍待完成，見 [試跑計畫](docs/pilot-plan.md)及 [已知限制](docs/known-issues.md)。

## 發布與歷史

本次主要版本為 v1.1.2（v1.1 系列）。[取得最新正式版本](https://github.com/jacky105402002/MingMing-AI-Product-Engineering-Loop/releases/latest)，或閱讀 [本次 release notes](docs/releases/v1.1.2.md)與 [changelog](docs/changelog.md)。既有 v1.1、v1.1.0、v1.1.1 tag 與歷史紀錄保留。

[原始方法論](mingming-ai-product-engineering-loop.md)作為歷史背景；現行操作以 AGENTS.md 與 ai-workflow/ 為準。

## v1.1.2 資安規劃更新

v1.1.2 的 2026-10-13 修訂加入 [資安規劃師](.agents/skills/security-planner/SKILL.md)；工作流版本為 1.1.2，發布標籤為 `v1.1.2`。確認政府標案為是後即啟動；高／中／普決定基準草稿，未知時先盤點，不自行定級。

62 項候選來源包含 27 列防護基準、8 款委外要求及 27 項年度聯合稽核項目；逐項評估適用性，不代表每案皆必須適用。個案契約追加要求與匯入表單一起登錄，依證據回填副本。操作見 [資安規劃操作](.agents/skills/security-planner/references/operations.md)。
