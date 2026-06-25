# Tool Map — 一般工具用途對照

定義工具在工作流中的用途與使用階段。
**這份是通用範本**，請依專案實際技術棧增刪，技術棧細節寫進 `docs/architecture.md`，不要硬寫死。

---

## 通用工具

| 工具 | 用途 | 使用階段 |
|---|---|---|
| git | 差異檢查、分支、提交紀錄 | 全階段 |
| terminal | 執行測試、build、lint、migration | 開發、測試 |
| rg (ripgrep) | 搜尋程式碼與文件 | 分析、開發、review |
| playwright | UI 自動化測試與截圖檢查 | UIUX、前端、QA |
| Open Design / Claude Design 類工具 | 產出 AI design artifact、HTML prototype、dashboard、deck | UIUX、AI design production |
| Figma MCP / Figma Console MCP | 建立 / 更新 Figma frame、component、token、prototype | UIUX、AI design production、前端交付 |

## 前端（依專案）

| 工具 | 用途 | 使用階段 |
|---|---|---|
| eslint / prettier | 格式與規範檢查 | 前端、QA |
| typescript | 型別檢查 | 前端、QA |
| vitest / jest | 前端單元測試 | 前端、QA |

## 後端（依專案）

| 工具 | 用途 | 使用階段 |
|---|---|---|
| phpunit / pest | Laravel 後端測試 | 後端、QA |
| larastan / phpstan | PHP 靜態分析 | 後端、QA |
| 各語言 test runner | 後端單元 / 整合測試 | 後端、QA |

---

## 使用原則

1. **Quality gate 工具（lint / type / test）在 Node 完成前必須跑過**，結果寫進 report。
2. 工具新增（尤其新依賴）必須在 Node 的 Quality Gates 與 `docs/architecture.md` 留紀錄。
3. 此表是「有哪些工具、何時用」，**具體指令**寫在各 `skills/*.skill.md` 的 Tools 段落或 `docs/`。

---

## 本專案技術棧填寫區

> 初始化新專案時，在此填入實際使用的工具與指令範例。

```text
前端：
後端：
DB / migration：
測試指令：
lint / format / type 指令：
build / deploy 指令：
```
