# ai-workflow — 總控層

這個資料夾是 MingMing AI Product Engineering Loop 的**總控層**。

AI agent 開始任何任務前，只讀這層，不讀完整文件庫。總控層負責回答四個問題：

1. **現在走到哪個階段？** → `loop-map.md`
2. **這個任務該啟用哪個 Skill？** → `skill-map.md` / `prompt-router.md`
3. **這個 Node 要怎麼切、怎麼算完成？** → `node-template.md` / `definition-of-ready.md` / `definition-of-done.md` / `review-checklist.md`
4. **設計要怎麼由 AI 產出與驗證？** → `ai-design-pipeline.md`
5. **能用哪些工具與 source of truth？** → `tool-map.md` / `mcp-map.md`

---

## 檔案清單

| 檔案 | 角色 | 何時讀 |
|---|---|---|
| `loop-map.md` | 12 階段主流程與階段交接 | 判斷目前在哪個階段 |
| `skill-map.md` | 12 個 Skill 的路由摘要 | 決定啟用哪個 Skill |
| `ai-design-pipeline.md` | AI 設計產線、artifact / Figma / visual QA 規則 | 需要 AI 產出設計或 Figma 重建時 |
| `prompt-router.md` | 從任務描述判斷要啟用的 Skill 序列 | 收到新需求時 |
| `node-template.md` | Development Node 的標準格式 | 切分任務時 |
| `node-status.md` | 目前功能的所有 Node 狀態 | 每次開工 / 收工 |
| `definition-of-ready.md` | 進入開發的閘門 | Planning → Implementation 之前 |
| `definition-of-done.md` | 功能完成的閘門 | Release 之前 |
| `review-checklist.md` | 每個 Node 完成後的審查項目 | Test & Review 階段 |
| `tool-map.md` | 一般工具用途對照（依專案技術棧調整） | 需要執行工具時 |
| `mcp-map.md` | 外部平台 source of truth 對照 | 需要外部資料時 |
| `context-policy.md` | 脈絡與 token 政策（最小上下文 / subagent / session 邊界 / 模型分級） | 每輪開工前 |
| `autonomy-policy.md` | 自治與檢查點政策（哪裡可自動 / 哪裡必須停下找人） | 放行 / 自動執行前 |
| `workflow-improvement-log.md` | 偏離原始規範的決策紀錄 | 修改工作流時 |

---

## AI Agent 的最小讀取路徑

```text
新任務進來
  → 讀 prompt-router.md   （判斷 Skill 序列）
  → 讀 skill-map.md       （取得 Skill 摘要與 detail file 路徑）
  → 讀 對應 skills/{skill}.skill.md
  → 讀 loop-map.md        （確認階段交接）
  → 讀 當前 feature spec / node file
  → 開工
```

**禁止**：一開始就讀完整 `docs/` 與完整 codebase。每個 Skill 只讀自己宣告的最小必要文件。

> 讀入量、subagent 隔離、session 邊界、模型分級的完整規則見 `context-policy.md` —— 它是 token 成本的總約束。

---

## 與其他資料夾的關係

```text
ai-workflow/   ← 總控層（你在這裡）
skills/        ← 執行層：每個 Skill 的詳細規則
docs/          ← 知識層：產品 / 架構 / 資料 / API / UIUX 等長期文件
tasks/         ← 任務層：當前 feature 的 spec、nodes、report
```

> 維護原則：總控層改動要謹慎，它是所有 Skill 的共同契約。技術棧細節寫進 `docs/architecture.md`，不要硬寫進總控層。

---

## 本工作流的四條設計主軸（v0.3 強化）

在原始規範之上，本套模板強化四件事，避免淪為「漂亮但跑不動的流程儀式」：

1. **流程隨規模縮放**：`prompt-router.md` 先做變更分級，小改走 Fast-Track，不必每次跑完整 12 階段。
2. **資料是第一公民**：資料形狀在 02 Planning 就起草（見 `loop-map.md` 核心原則 + product-planner 的 Data Shape Sketch），動資料模型一律走 Full-Loop。
3. **最小上下文省 token**：`context-policy.md` 把「只讀必要、skill 當 subagent、Node 間切 session、模型分級」訂成執行規則 —— 這是工作流划不划算的關鍵。
4. **設計也由 AI 產出但要被驗證**：`ai-design-pipeline.md` 定義 design brief、AI artifact、Figma reconstruction、visual QA 與 engineering handoff。

> 偏離原始規範的決策都記在 `workflow-improvement-log.md`。

## Skill 文件擴充格式

每個 `skills/*.skill.md` 在原規範 9 段之外，**必須額外含一段 `Quality Heuristics（品質判準）`**：
- Quality Gates 回答「有沒有做」（可勾選）。
- Quality Heuristics 回答「做得好不好」（供自我審查與 code-reviewer 參考）。

以 `skills/product-planner.skill.md` 為樣板，其餘 Skill 比照辦理。
