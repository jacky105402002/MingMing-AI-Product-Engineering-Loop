# Project Intake — 專案導入填寫表

> **用途**：導入 MingMing AI Product Engineering Loop 的起點。
> **怎麼用**：把你手上的零散資料（筆記、對話、需求）丟給 AI，請它「依本檔每節的『填寫格式』整理」，回填後交給工作流。工作流會據此產出 `docs/` 骨架、填好 `tool-map` / `mcp-map`，並對第一個功能跑 product-planner。
>
> 標記說明：🔴 必填（不填無法開始）｜🟡 建議填（影響品質）｜⚪ 可後補。
> 不確定的欄位填 `TBD`，不要刪掉欄位。

---

## A1. 產品定義 🔴

**目的**：product-planner 的根輸入；定義產品邊界。

**填寫格式**
```md
### 產品定義
- 一句話定義：{產品是什麼，解決誰的什麼問題}
- 目標使用者：{主要角色 1}、{主要角色 2}
- 核心價值：{使用者為什麼用它，而非替代品}
- 產品階段：MVP 已驗證 / 全新未驗證 / 接手既有系統
- 商業模式（選填）：{如何產生價值或收入}
```

**範例**
```md
### 產品定義
- 一句話定義：給獨立音樂人管理發行企劃進度的工具
- 目標使用者：獨立音樂人、小型音樂廠牌企劃
- 核心價值：把分散在 Excel / 通訊軟體的發行流程集中追蹤
- 產品階段：MVP 已驗證
- 商業模式：月訂閱
```

---

## A2. 技術棧 🔴

**目的**：工作流刻意不寫死技術，由此提供；落地到 `docs/architecture.md` 與 `tool-map.md`。

**填寫格式**
```md
### 技術棧
- 前端：{框架 / 語言，例 React + TypeScript / 原生 HTML+JS}
- 後端：{框架 / 語言，例 Laravel / Node.js}
- 資料庫：{例 MSSQL / PostgreSQL}
- Server / 部署：{例 IIS / Vercel / Docker}
- 套件管理：{例 npm / pnpm / composer}
- 其他關鍵依賴：{快取、佇列、第三方服務…}
```

---

## A3. 既有系統現況 🔴

**目的**：判斷是全新建置還是接手既有 codebase；決定要不要先掃描現有結構。

**填寫格式**
```md
### 既有系統現況
- 類型：全新專案 / 接手既有 codebase / 既有系統加新模組
- 程式碼位置：{repo 路徑或網址，無則填 無}
- 既有模組概述：{若接手，列出主要模組 / 目錄，無則填 無}
- 已知技術債 / 痛點：{例 OpenCV 卡頓、後台縮放異常，無則填 無}
- 不可動的部分：{線上中、不可破壞相容的範圍}
```

---

## A4. 第一個要做的功能 🔴

**目的**：跑通整條 loop 的試跑題；工作流會把它細化成 `feature-spec.md`（含 Data Shape Sketch）。
這裡只需給「原始素材」，不必自己寫成完整 spec —— product-planner 會接手細化。

**填寫格式**
```md
### 第一個功能
- 功能名稱：{簡短名稱}
- 想解決的問題：{現在卡在哪 / 痛點}
- 使用者場景：{誰，在什麼情境，想完成什麼}
- 期望結果：{做完之後使用者能做到什麼}
- 明確不做：{這次先不處理的範圍，沒有則填 無}
- 資料概念（粗略）：{會牽涉哪些東西，例 訂單、會員、商品；不必是欄位}
- 已知限制：{時程、技術、相依，沒有則填 無}
```

**範例**
```md
### 第一個功能
- 功能名稱：發行專案建立與進度看板
- 想解決的問題：企劃進度散落各處，無法一眼看到卡在哪
- 使用者場景：音樂人建立一個新發行專案，設定各階段，拖拉更新狀態
- 期望結果：使用者能在一個看板看到所有專案的當前階段
- 明確不做：成員權限分級（下一輪再做）
- 資料概念：發行專案、階段、負責人
- 已知限制：兩週內要能 demo
```

---

## A5. 指令集 🔴

**目的**：Quality Gates 與 Definition of Done 要靠這些指令驗證；落地到 `tool-map.md` 填寫區。

**填寫格式**
```md
### 指令集
- 安裝依賴：{例 npm install / composer install}
- 啟動開發：{例 npm run dev / php artisan serve}
- 跑測試：{例 npm test / php artisan test}
- Lint / Format：{例 npm run lint / pint}
- 型別 / 靜態檢查：{例 tsc --noEmit / phpstan，無則填 無}
- Build：{例 npm run build}
- DB migration：{例 php artisan migrate，無則填 無}
```

---

## B6. 產品 Roadmap 🟡

**目的**：給 product-planner 排優先序；落地到 `docs/product-roadmap.md`。

**填寫格式**
```md
### Roadmap
| 優先序 | 功能 | 目標版本 / 時程 | 備註 |
|---|---|---|---|
| 1 | {功能} | {例 v1.0} | |
| 2 | {功能} | {例 v1.1} | |
```

---

## B7. Source of Truth 🟡

**目的**：定義各類資訊的唯一真實來源；落地到 `mcp-map.md`，避免來源衝突時亂猜。

**填寫格式**
```md
### Source of Truth
- 需求 / 產品筆記：{例 Notion 連結 / 本地文件，無則填 無}
- 設計稿：{例 Figma 連結，無則填 無}
- Issue / 任務：{例 GitHub Issues / Jira，無則填 無}
- API 契約：{例 OpenAPI 檔位置 / Postman，無則填 無}
- 架構 / 流程圖：{例 draw.io 檔，無則填 無}
- 已接入的 MCP：{列出，無則填 無}
```

---

## B8. 設計系統 / UI 規範 🟡

**目的**：給 uiux-designer / frontend-developer 對齊；落地到 `docs/design-system.md`。

**填寫格式**
```md
### 設計系統
- 是否有現成設計系統：有 / 無
- UI 元件庫：{例 shadcn/ui / Element Plus / 自製，無則填 無}
- 設計規範來源：{Figma / 文件，無則填 無}
- 品牌色 / 字體（選填）：{主色、字體}
- 既有 UI 慣例：{RWD 斷點、深色模式…，無則填 無}
```

---

## ⚪ 可後補（不阻塞啟動）

- 部署環境細節（環境變數、CI/CD）→ `docs/deployment.md`
- 編碼風格規範 → `docs/architecture.md` 或專屬 coding-style 文件
- 團隊協作慣例（分支策略、PR 規範）

---

## 填完之後

把整份回填好的內容交給工作流，AI 會：
1. 產出 `docs/` 骨架（product、architecture、modules、roadmap…）。
2. 填好 `ai-workflow/tool-map.md` 與 `mcp-map.md` 的專案填寫區。
3. 對 A4 跑 product-planner，產出第一份 `feature-spec.md` 並帶你過 Definition of Ready。
4. 依產品階段（A1）建議哪些變更走 Fast-Track、哪些走 Full-Loop。

> 最精簡啟動：只填 **A1 + A2 + A4** 也能跑通第一輪，其餘邊做邊補。
