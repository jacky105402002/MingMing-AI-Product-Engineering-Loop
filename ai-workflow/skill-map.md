# Skill Map — AI 技能路由表

這是 AI 的**入口路由**。收到任務時先讀這份，判斷該啟用哪個 Skill，再去讀對應的 `skills/{skill}.skill.md` detail file。

> 不要一次讀完所有 skill detail。只讀本表 + 你要啟用的那一個 detail file。

對照「任務描述 → Skill 序列」請看 `prompt-router.md`。

---

## product-planner
- **Purpose**：需求釐清、產品邊界、使用者場景、驗收條件。
- **When to use**：新需求進來、需求模糊、要寫 feature spec、要切 Node。
- **Read**：`docs/product.md`、`docs/product-roadmap.md`、`tasks/current/feature-spec.md`。
- **Output**：feature spec、acceptance criteria、`tasks/current/nodes.md`。
- **Tools / MCP**：GitHub（issue）、Notion / Docs。
- **Do not**：設計資料表、寫程式、決定技術實作細節。
- **Detail**：`skills/product-planner.skill.md`

## flow-designer
- **Purpose**：user flow、business flow、state flow、sequence。
- **When to use**：feature spec 完成、要定義操作 / 資料 / 狀態流。
- **Read**：feature spec、`docs/product.md`。
- **Output**：flow 圖 / 說明、state machine、sequence notes。
- **Tools / MCP**：draw.io / diagram source。
- **Do not**：定義資料庫欄位、寫程式。
- **Detail**：`skills/flow-designer.skill.md`

## system-architect
- **Purpose**：模組邊界、架構決策、相依性、技術風險。
- **When to use**：新功能會動到架構、要評估影響範圍、要寫 ADR。
- **Read**：`docs/architecture.md`、`docs/modules.md`、feature spec、flow。
- **Output**：ADR、module impact report。
- **Tools / MCP**：rg、git、GitHub。
- **Do not**：實作功能、改 UI。
- **Detail**：`skills/system-architect.skill.md`

## data-modeler
- **Purpose**：DB schema、migration、ERD、資料生命週期。
- **When to use**：需求需要新增 / 修改資料表或關聯。
- **Read**：`docs/database.md`、ADR、flow。
- **Output**：DB change plan、ERD、可回滾的 migration 計畫。
- **Tools / MCP**：Database schema、migration 工具。
- **Do not**：寫 API 邏輯、改前端。
- **Detail**：`skills/data-modeler.skill.md`

## uiux-designer
- **Purpose**：畫面結構、元件規格、互動狀態、設計系統對齊。
- **When to use**：功能有畫面 / 互動需求。
- **Read**：`docs/uiux.md`、`docs/design-system.md`、feature spec、flow。
- **Output**：wireframe、component spec、loading / empty / error state 定義。
- **Tools / MCP**：Figma（source of truth）、playwright（截圖檢查）。
- **Do not**：定義後端 API、改資料表。
- **Detail**：`skills/uiux-designer.skill.md`

## ai-design-producer
- **Purpose**：用 AI 產出 web / app / dashboard / deck prototype，並整理成可重建到 Figma 與可交付工程的設計成果。
- **When to use**：需要 AI 生成設計稿、Open Design / Claude Design 類 artifact、Figma MCP 重建、視覺 QA。
- **Read**：feature spec、flow、`docs/design-system.md`、`ai-workflow/ai-design-pipeline.md`。
- **Output**：design brief、AI artifact、Figma frame URL、visual QA、engineering handoff。
- **Tools / MCP**：Open Design、Figma MCP / Figma Console MCP、playwright。
- **Do not**：把 AI artifact 當正式 source of truth、跳過 visual QA、定義 API / DB。
- **Detail**：`skills/ai-design-producer.skill.md`

## frontend-developer
- **Purpose**：UI 實作、狀態管理、API 串接、RWD、前端測試。
- **When to use**：執行前端類 Implementation Node。
- **Read**：node file、component spec、`docs/api.md`、`docs/design-system.md`。
- **Output**：前端 code、前端測試、partial docs。
- **Tools / MCP**：eslint / prettier、typescript、playwright、OpenAPI / Postman。
- **Do not**：改後端商業邏輯、改 DB schema。
- **Detail**：`skills/frontend-developer.skill.md`

## backend-developer
- **Purpose**：API、service、repository、permission、validation、後端測試。
- **When to use**：執行後端類 Implementation Node。
- **Read**：node file、`docs/api.md`、`docs/database.md`、ADR。
- **Output**：後端 code、後端測試、API / DB partial docs。
- **Tools / MCP**：phpunit / pest、larastan / phpstan、Database schema、OpenAPI。
- **Do not**：自行改架構決策、改 UI 樣式。
- **Detail**：`skills/backend-developer.skill.md`

## qa-tester
- **Purpose**：測試案例、回歸測試、E2E、錯誤紀錄。
- **When to use**：Node 實作完成、進入 Test & Review。
- **Read**：feature spec、acceptance criteria、node file。
- **Output**：`tasks/current/test-report.md`、bug 紀錄。
- **Tools / MCP**：playwright、phpunit / pest、terminal。
- **Do not**：修改功能程式（只回報）。
- **Detail**：`skills/qa-tester.skill.md`

## code-reviewer
- **Purpose**：架構偏移、重複邏輯、安全風險、可維護性。
- **When to use**：Node 實作完成、PR 審查。
- **Read**：diff、`docs/architecture.md`、`review-checklist.md`、node file。
- **Output**：`tasks/current/review-report.md`。
- **Tools / MCP**：git、rg、GitHub（PR / review）。
- **Do not**：直接大改程式（提出建議）。
- **Detail**：`skills/code-reviewer.skill.md`

## docs-maintainer
- **Purpose**：文件回寫、changelog、ADR、API / DB / UIUX doc 同步。
- **When to use**：Node 或功能完成、有任何文件需同步。
- **Read**：本次變更、受影響的 `docs/*.md`。
- **Output**：更新後的 docs、`docs/changelog.md`、`docs/known-issues.md`。
- **Tools / MCP**：git、Notion / Docs。
- **Do not**：改功能程式邏輯。
- **Detail**：`skills/docs-maintainer.skill.md`

## release-manager
- **Purpose**：release checklist、版本紀錄、部署檢查。
- **When to use**：功能通過 DoD、準備發布。
- **Read**：`definition-of-done.md`、`docs/deployment.md`、changelog。
- **Output**：release notes、next backlog、部署檢查結果。
- **Tools / MCP**：git、GitHub、Deployment platform。
- **Do not**：在發布階段新增功能。
- **Detail**：`skills/release-manager.skill.md`
