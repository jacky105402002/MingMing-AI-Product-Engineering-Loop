# MingMing AI Product Engineering Loop

版本：v0.1 draft  
工作室：明明工作室 / MingMing Studio  
用途：提供給 Codex、Claude Code 或其他 AI coding agent 深化為可執行的長期產品開發工作流  
適用場景：MVP / POC 已完成市場測試，準備進入可維護 3 年以上的主要版本開發

---

## 1. 核心定位

MingMing AI Product Engineering Loop 是一套針對 AI 輔助產品開發的閉環工作流。

它不是單純讓 AI 依照 prompt 快速產生功能，而是把 AI coding 轉化成一套可追蹤、可審查、可測試、可回寫文件、可持續迭代的產品工程系統。

核心目標：

1. 讓 AI 在固定架構、固定規範、固定流程中高速產出。
2. 避免 MVP / POC 進入正式產品後，因為功能快速堆疊導致大量重構。
3. 透過 Skill Map、Tool Map、MCP Map 降低 AI 每次讀取上下文的 token 成本。
4. 將大型需求切分成多個 Development Node，讓每個節點都能獨立執行、檢查、測試與修正。
5. 建立從規劃到開發再到文件回寫的完整閉環。

一句話定義：

> MingMing AI Product Engineering Loop 是讓 AI 從「vibe coding」升級為「vibe engineering」的長期產品開發作業系統。

---

## 2. 設計原則

### 2.1 架構優先，而不是功能優先

AI 不應該在尚未理解產品邊界、系統架構、資料流、UIUX 規範前直接開始寫程式。

每個新功能都必須先經過：

1. 需求理解
2. 影響範圍分析
3. 架構檢查
4. 資料結構確認
5. UIUX 對齊
6. 任務切分
7. 分批實作
8. 測試與審查
9. 文件回寫

### 2.2 AI 只讀取當前階段需要的最小上下文

不讓 AI 每次都讀完整專案文件。

文件應分為：

1. 總控層：讓 AI 判斷現在要走哪個流程、啟用哪個 Skill。
2. 執行層：每個 Skill 的詳細規則、工具、輸出格式。
3. 任務層：當前 feature / node 的規格與狀態。
4. 回寫層：執行後產生的 decision、report、changelog、test result。

### 2.3 每個 Skill 是角色，不是萬能 prompt

每個 Skill 只負責一種專業角色，例如產品規劃、架構設計、資料建模、UIUX、前端、後端、測試、審查、文件維護。

AI 不應該在同一個步驟同時扮演所有角色。

### 2.4 每個節點都要可檢查

大型功能必須切成 Development Nodes。

每個 Node 都要有：

1. Goal
2. Scope
3. Inputs
4. Tasks
5. Allowed Files
6. Forbidden Changes
7. Check
8. Tests
9. Output
10. Next Node

### 2.5 文件必須隨程式一起演進

AI 工作流最容易失控的原因，是文件與程式不同步。

因此每次完成開發節點後，都必須回寫：

1. feature spec
2. architecture decision
3. API doc
4. database doc
5. UIUX doc
6. testing report
7. changelog
8. known issues

---

## 3. 建議專案結構

以下結構可作為新產品專案的初始化模板：

```text
project-root/
  docs/
    product.md
    product-roadmap.md
    architecture.md
    modules.md
    database.md
    api.md
    uiux.md
    design-system.md
    testing.md
    deployment.md
    changelog.md
    known-issues.md

  docs/specs/
    current.md
    feature-{feature-name}.md

  docs/architecture-decisions/
    adr-0001-template.md
    adr-{feature-name}.md

  ai-workflow/
    README.md
    loop-map.md
    skill-map.md
    tool-map.md
    mcp-map.md
    node-template.md
    node-status.md
    review-checklist.md
    prompt-router.md
    definition-of-ready.md
    definition-of-done.md

  skills/
    product-planner.skill.md
    flow-designer.skill.md
    system-architect.skill.md
    data-modeler.skill.md
    uiux-designer.skill.md
    frontend-developer.skill.md
    backend-developer.skill.md
    qa-tester.skill.md
    code-reviewer.skill.md
    docs-maintainer.skill.md
    release-manager.skill.md

  tasks/
    current/
      feature-spec.md
      nodes.md
      node-001.md
      node-002.md
      test-report.md
      review-report.md
      iteration-log.md

    archive/
      feature-{feature-name}/
        feature-spec.md
        nodes.md
        test-report.md
        review-report.md
        iteration-log.md
```

---

## 4. Product Development Loop Map

### 4.1 主流程

```text
01. Idea / Requirement Input
↓
02. Product Planning
↓
03. Flow Design
↓
04. System Architecture
↓
05. Data Modeling
↓
06. UIUX Design
↓
07. Task Breakdown
↓
08. Implementation Nodes
↓
09. Test & Review
↓
10. Fix & Refactor
↓
11. Docs Update
↓
12. Release / Next Iteration
```

### 4.2 每個階段的產出物

| 階段 | 主要目標 | 主要產出 |
|---|---|---|
| Idea / Requirement Input | 收斂需求來源 | raw requirement、issue、brief |
| Product Planning | 定義產品價值與使用者場景 | feature spec、acceptance criteria |
| Flow Design | 定義操作流程、資料流、狀態流 | user flow、business flow、sequence notes |
| System Architecture | 判斷架構影響與模組邊界 | ADR、module impact report |
| Data Modeling | 設計資料表、欄位、關聯、migration | database change plan、ERD |
| UIUX Design | 設計畫面、元件、互動狀態 | wireframe、component spec、Figma notes |
| Task Breakdown | 將功能拆成可執行節點 | development nodes |
| Implementation Nodes | 分批實作 | code、tests、docs partial update |
| Test & Review | 驗證功能與架構品質 | test report、review report |
| Fix & Refactor | 修正問題與小範圍重構 | fix log、refactor notes |
| Docs Update | 回寫所有受影響文件 | changelog、updated docs |
| Release / Next Iteration | 發布或進入下一輪 | release notes、next backlog |

---

## 5. Skill Map 設計

### 5.1 Skill Map 的目的

`ai-workflow/skill-map.md` 是 AI 的技能路由表。

AI 一開始只需要讀取 Skill Map，判斷當前任務應該啟用哪個 Skill，而不是直接讀完整的所有 Skill 文件。

### 5.2 Skill Map 格式

每個 Skill 在 Skill Map 中只保留摘要資訊：

```md
## skill-name

Purpose:
- 這個 Skill 負責什麼。

When to use:
- 什麼情況要啟用。

Read:
- 需要讀哪些最小文件。

Output:
- 需要產出或更新哪些文件。

Tools / MCP:
- 可以使用哪些工具或 MCP。

Do not:
- 不允許做什麼。

Detail file:
- /skills/{skill-name}.skill.md
```

### 5.3 建議 Skill 清單

| Skill | 角色 | 主要職責 |
|---|---|---|
| product-planner | 產品規劃師 | 需求釐清、產品邊界、使用者場景、驗收條件 |
| flow-designer | 流程設計師 | user flow、business flow、state flow、sequence |
| system-architect | 系統架構師 | 模組邊界、架構決策、相依性、技術風險 |
| data-modeler | 資料架構師 | DB schema、migration、ERD、資料生命週期 |
| uiux-designer | UIUX 設計師 | 畫面結構、元件規格、互動狀態、設計系統對齊 |
| frontend-developer | 前端工程師 | UI 實作、狀態管理、API 串接、RWD、前端測試 |
| backend-developer | 後端工程師 | API、service、repository、permission、validation、backend test |
| qa-tester | 測試工程師 | 測試案例、回歸測試、E2E、錯誤紀錄 |
| code-reviewer | Code Reviewer | 架構偏移、重複邏輯、安全風險、可維護性 |
| docs-maintainer | 文件維護者 | 文件回寫、changelog、ADR、API / DB / UIUX doc 同步 |
| release-manager | 發布管理者 | release checklist、版本紀錄、部署檢查 |

---

## 6. Skill 文件標準格式

每個 `*.skill.md` 建議使用以下格式：

```md
# {Skill Name}

## Responsibility

這個 Skill 的責任。

## When to Use

什麼情境要使用。

## Required Inputs

必須讀取的文件、設計稿、issue、程式碼範圍。

## Optional Inputs

有的話會更好的補充資料。

## Tools and MCP

可使用的工具與 MCP。

## Workflow

1. 步驟一
2. 步驟二
3. 步驟三

## Output Format

必須輸出的格式與檔案。

## Quality Gates

完成前必須通過的檢查。

## Forbidden Actions

不允許做的事情。

## Handoff

完成後要交給哪個 Skill 或哪個流程節點。
```

---

## 7. Tool Map 與 MCP Map

### 7.1 Tool Map 的目的

`ai-workflow/tool-map.md` 用來定義一般工具在工作流中的用途。

例如：

| 工具 | 用途 | 使用階段 |
|---|---|---|
| git | 差異檢查、分支、提交紀錄 | 全階段 |
| terminal | 執行測試、build、lint、migration | 開發、測試 |
| rg | 搜尋程式碼與文件 | 分析、開發、review |
| playwright | UI 自動化測試與截圖檢查 | UIUX、前端、QA |
| phpunit / pest | Laravel 後端測試 | 後端、QA |
| eslint / prettier | 前端格式與規範檢查 | 前端、QA |
| typescript | 型別檢查 | 前端、QA |
| larastan / phpstan | PHP 靜態分析 | 後端、QA |

### 7.2 MCP Map 的目的

`ai-workflow/mcp-map.md` 用來定義外部平台作為 source of truth 的位置。

| MCP / 平台 | Source of Truth | 適用 Skill |
|---|---|---|
| GitHub MCP | issue、PR、review、project board | product-planner、code-reviewer、release-manager |
| Figma MCP | UI frame、component、design token、prototype | uiux-designer、frontend-developer |
| draw.io / diagram source | system flow、architecture diagram、ERD | flow-designer、system-architect、data-modeler |
| Notion / Docs | 產品筆記、商業規劃、需求來源 | product-planner、docs-maintainer |
| OpenAPI / Postman | API contract | backend-developer、frontend-developer、qa-tester |
| Database schema | schema、migration、seed、ERD | data-modeler、backend-developer |
| Deployment platform | 環境變數、部署狀態、log | release-manager、backend-developer |

### 7.3 MCP 使用原則

1. MCP 不是越多越好，而是要明確定義誰是 source of truth。
2. 同一類資訊只能有一個主要 source of truth。
3. 如果 Figma、文件、程式碼衝突，必須回報衝突，不可自行猜測。
4. 每個 Skill 要明確定義它可以使用哪些 MCP。
5. 新 MCP 的導入應先從小專案試跑，再加入正式工作流。

---

## 8. Development Node 設計

### 8.1 為什麼要切 Node

正式產品不能用「幫我完成整個會員系統」這種方式開發。

大型功能必須拆成多個節點，每個節點都能獨立完成、檢查、測試與回寫。

這樣可以避免：

1. AI 一次修改太多檔案。
2. 上下文過長導致遺漏需求。
3. 架構偏移無法及早發現。
4. 測試範圍過大導致失控。
5. 後期才發現需要大重構。

### 8.2 Node Template

```md
# Node {number}: {node title}

## Goal

本節點要完成什麼。

## Background

為什麼需要這個節點。

## Scope

允許處理的範圍。

## Out of Scope

本節點不處理的範圍。

## Inputs

需要讀取的文件、設計、issue、程式碼。

## Allowed Files

允許修改的檔案或資料夾。

## Forbidden Changes

明確禁止修改的範圍。

## Tasks

1. 任務一
2. 任務二
3. 任務三

## Quality Gates

1. 架構符合 docs/architecture.md
2. 命名符合 docs/coding-style.md
3. 無新增未紀錄的相依套件
4. 無跨模組直接依賴內部實作
5. 無未處理的錯誤狀態

## Tests

需要執行的測試。

## Review Checklist

需要檢查的項目。

## Output

完成後要更新哪些文件或產出哪些報告。

## Handoff

下一個節點或下一個 Skill。
```

### 8.3 Node 狀態

`ai-workflow/node-status.md` 建議維護目前節點狀態：

```md
# Node Status

## Current Feature

feature-name

## Nodes

| Node | Title | Status | Owner Skill | Notes |
|---|---|---|---|---|
| 001 | Requirement clarification | done | product-planner |  |
| 002 | Data model design | in_progress | data-modeler |  |
| 003 | Backend API implementation | pending | backend-developer |  |

## Status Definition

- pending
- in_progress
- blocked
- review_needed
- done
```

---

## 9. Definition of Ready

在進入開發前，需求必須符合 Definition of Ready。

```md
# Definition of Ready

一個功能可以進入開發，必須滿足：

1. 已定義使用者場景。
2. 已定義功能邊界。
3. 已定義驗收條件。
4. 已確認會影響哪些模組。
5. 已確認是否需要 DB schema 變更。
6. 已確認是否需要 API contract。
7. 已確認是否需要 UIUX 設計。
8. 已拆成 Development Nodes。
9. 已定義每個 Node 的測試方式。
10. 已確認不應修改的範圍。
```

---

## 10. Definition of Done

一個功能完成必須符合 Definition of Done。

```md
# Definition of Done

一個功能完成，必須滿足：

1. 所有 Development Nodes 狀態為 done。
2. 所有必要測試已通過。
3. Lint / format / type check 已通過。
4. API 文件已更新。
5. DB 文件與 migration 狀態已更新。
6. UIUX 文件已更新。
7. Architecture Decision Record 已更新。
8. changelog 已更新。
9. known issues 已更新。
10. code-reviewer.skill.md 已完成審查。
11. 沒有未說明的架構偏移。
```

---

## 11. Review Checklist

每次節點完成後，至少需要檢查：

### 11.1 架構

1. 是否符合既有架構分層。
2. 是否有跨模組不當依賴。
3. 是否把商業邏輯放錯位置。
4. 是否新增過度抽象。
5. 是否造成未來功能難以擴充。

### 11.2 程式品質

1. 命名是否一致。
2. 是否有重複邏輯。
3. 是否有過大的 function / component / class。
4. 是否有 magic number 或未命名常數。
5. 是否有未處理錯誤。

### 11.3 資料與 API

1. schema 是否符合資料生命週期。
2. migration 是否可回滾。
3. API request / response 是否穩定。
4. 權限與驗證是否完整。
5. 是否有 transaction 或資料一致性問題。

### 11.4 UIUX

1. 是否符合設計系統。
2. 是否有 loading / empty / error state。
3. 是否有 RWD 問題。
4. 是否與 Figma 或 wireframe 對齊。
5. 是否有可用性問題。

### 11.5 測試

1. 是否有單元測試。
2. 是否有整合測試。
3. 是否需要 E2E 測試。
4. 是否有回歸風險。
5. 是否有測試資料或 seed 問題。

---

## 12. 文件回寫規則

每個 Node 完成後都要判斷是否需要回寫文件。

### 12.1 必須回寫的情況

| 變更類型 | 回寫文件 |
|---|---|
| 產品行為改變 | docs/product.md、docs/specs/*.md |
| 新增或修改流程 | docs/flow.md 或 docs/specs/*.md |
| 架構改變 | docs/architecture.md、docs/architecture-decisions/*.md |
| DB 改變 | docs/database.md |
| API 改變 | docs/api.md 或 OpenAPI |
| UI 改變 | docs/uiux.md、docs/design-system.md |
| 測試策略改變 | docs/testing.md |
| 部署設定改變 | docs/deployment.md |
| 已知問題 | docs/known-issues.md |
| 對外版本改變 | docs/changelog.md |

### 12.2 文件回寫格式

建議每次回寫都包含：

```md
## {date} - {feature or node}

Changed:
- 變更內容

Reason:
- 為什麼需要變更

Impact:
- 影響哪些模組或流程

Related:
- issue / PR / node / ADR
```

---

## 13. AI Agent 執行規則

### 13.1 開始任務前

AI 必須先讀：

1. `ai-workflow/loop-map.md`
2. `ai-workflow/skill-map.md`
3. 當前任務相關的 Skill detail file
4. 當前 feature spec 或 node file
5. Skill 指定的最小必要文件

AI 不應該一開始就讀完整 docs 與完整 codebase。

### 13.2 實作前

AI 必須先輸出：

```md
## Implementation Plan

Skill:
- 使用哪個 Skill

Node:
- 目前執行哪個 Node

Files to read:
- 預計讀取哪些檔案

Files to modify:
- 預計修改哪些檔案

Risk:
- 可能風險

Tests:
- 預計執行哪些測試
```

### 13.3 實作中

AI 必須遵守：

1. 只修改 Node 允許的範圍。
2. 發現 scope 不足時先停下並回報。
3. 發現文件與程式衝突時先記錄，不自行猜測。
4. 優先沿用既有架構與命名。
5. 不因單一功能任意引入大型依賴。

### 13.4 實作後

AI 必須輸出：

```md
## Completion Report

Node:
- 完成的節點

Changed:
- 修改摘要

Tests:
- 已執行測試與結果

Docs:
- 已更新文件

Risks:
- 剩餘風險

Next:
- 下一個建議節點
```

---

## 14. 建議的第一個小專案試跑

為了讓 MingMing AI Product Engineering Loop 自我修正，建議先用一個小但完整的產品試跑。

可選小專案：

1. AI 音樂企劃管理工具
2. 個人減肥與健身監控工具
3. 專案進度表匯入與分類工具
4. 小型 CRM / 任務管理工具
5. 作品集內容管理工具

試跑目標不是快速做出產品，而是驗證工作流：

1. Skill Map 是否清楚。
2. Tool Map 是否足夠。
3. MCP Map 是否合理。
4. Node 切分是否太大或太小。
5. 文件回寫是否可維持。
6. AI 是否能在 token 限制內跑完一輪。
7. 哪些流程需要自動化。

---

## 15. 給 Codex / Claude Code 的深化任務

請 AI coding agent 依照本文件，將 MingMing AI Product Engineering Loop 深化為可實際放入專案使用的工作流模板。

### 15.1 任務目標

請建立一套可複製到任何產品專案的 AI 工作流模板，包含：

1. `ai-workflow/` 文件。
2. `skills/` 文件。
3. `docs/` 基礎文件模板。
4. `tasks/current/` 節點模板。
5. review checklist。
6. definition of ready / done。
7. prompt router。
8. MCP / tool 使用對照。

### 15.2 請優先產出的檔案

```text
ai-workflow/
  README.md
  loop-map.md
  skill-map.md
  tool-map.md
  mcp-map.md
  node-template.md
  node-status.md
  review-checklist.md
  prompt-router.md
  definition-of-ready.md
  definition-of-done.md

skills/
  product-planner.skill.md
  flow-designer.skill.md
  system-architect.skill.md
  data-modeler.skill.md
  uiux-designer.skill.md
  frontend-developer.skill.md
  backend-developer.skill.md
  qa-tester.skill.md
  code-reviewer.skill.md
  docs-maintainer.skill.md
  release-manager.skill.md

docs/
  product.md
  product-roadmap.md
  architecture.md
  modules.md
  database.md
  api.md
  uiux.md
  design-system.md
  testing.md
  deployment.md
  changelog.md
  known-issues.md
```

### 15.3 深化規則

1. 先建立模板，不要直接假設特定技術棧。
2. 每個 Skill 文件要有明確責任、讀取文件、輸出文件、工具、禁止事項、完成條件。
3. 每個 Skill 不要過長，避免 AI 每次讀取耗費過多 token。
4. `skill-map.md` 必須能作為 AI 的入口路由。
5. `prompt-router.md` 必須能根據任務描述判斷要啟用哪些 Skill。
6. 所有模板都要能支援 Laravel、Next.js、React、Node.js 這類常見 web product stack。
7. 若需要補充技術棧細節，請放在專案自己的 `docs/architecture.md`，不要硬寫死在 workflow core。
8. 每個 Node 都必須可以獨立執行、測試、review、回寫文件。
9. 每個文件要使用清楚的 Markdown heading，方便 AI 搜尋與局部讀取。
10. 若發現本文件有缺口，請建立 `docs/known-issues.md` 或 `ai-workflow/workflow-improvement-log.md` 記錄。

### 15.4 驗收標準

完成後應該能做到：

1. 新專案複製這套模板後，可以開始用 AI 進行產品開發。
2. AI 可以只讀 `skill-map.md` 和當前 Skill，而不需要讀完整文件庫。
3. 一個新功能可以被拆成多個 Development Nodes。
4. 每個 Node 可以明確知道要讀什麼、改什麼、測什麼、回寫什麼。
5. 文件、架構、資料結構、UIUX、開發、測試、修正能形成閉環。
6. 工作流本身可以透過小專案試跑持續修正。

---

## 16. 未來可延伸方向

### 16.1 工作流自動化

未來可以開發 CLI，例如：

```text
mingming init
mingming new-feature "member login"
mingming create-node
mingming run-review
mingming update-docs
```

### 16.2 Workflow Health Check

建立定期檢查：

1. 文件是否過期。
2. Skill 是否過長。
3. Node 是否過大。
4. 測試覆蓋是否不足。
5. 架構決策是否未記錄。
6. MCP source of truth 是否衝突。

### 16.3 專案模板產品化

此工作流未來可以成為明明工作室的一套內部開發標準，也可以延伸成：

1. 一人公司產品開發模板。
2. AI coding agent 專案啟動包。
3. 顧問服務交付方法論。
4. 教學課程或知識產品。

---

## 17. 最終目標

MingMing AI Product Engineering Loop 的最終目標，是讓明明工作室能用 AI 以更低成本、更高速度、更穩定品質開發長期產品。

不是追求 AI 一次把所有程式寫完，而是讓 AI 在清楚的產品工程閉環中持續推進。

核心精神：

> 規劃有輸入，流程有節點，架構有邊界，資料有來源，UI 有依據，開發有檢查，測試有證據，文件有回寫，產品有下一輪。

