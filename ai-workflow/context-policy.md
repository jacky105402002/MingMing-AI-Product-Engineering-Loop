# Context Policy — 脈絡與 Token 政策

這套工作流號稱省 token，但**只有真的遵守最小上下文，它才划算**。
否則 AI 每輪把整個 `skills/` + `docs/` 讀進來，會比 vibe coding 還貴。

本檔把省 token 從「原則」變成「AI 執行時必須遵守的規則」。

---

## 0. 核心心法

> 索引先行，按需展開。能用摘要就不讀全文，能隔離就不污染主線，能存檔就不背歷史。

---

## 1. 最小上下文規則（讀入白名單）

每一輪，AI 允許讀入的內容**上限**：

```text
✅ skill-map.md（索引，小）
✅ 當前要執行的 1 個 skill detail file
✅ 當前 1 個 node-00X.md
✅ 該 skill 在 Required Inputs 宣告的最小 docs
✅ 實際要改的程式碼檔（按需）
```

**硬規則**：
1. **一次只讀 1 個 skill detail**，不要把 12 個 skill 全讀。
2. 每個 skill 的 `Required Inputs` 就是它的**讀入白名單**，不在白名單的 docs 不讀。
3. **禁止**「為了保險」把整個 `docs/` 或整個 codebase 讀進來。
4. 不確定要讀哪個檔 → 先用 Grep / Glob 定位，只讀命中片段，不整檔吞。
5. 已經讀過的檔同一 session 內不重複讀（harness 會記住檔案狀態）。

> 量化參考：壞做法每輪數萬 token；好做法每輪約 2,000–4,000 token，差一個數量級。

---

## 2. Subagent 隔離執行（最大省 token 槓桿）

**每個 skill 就是一個 subagent。** 讓它在自己的上下文視窗做完工作，只回傳摘要給主線。

```text
主線（orchestrator，保持精簡）
  → 派 subagent 執行某 skill / node
       subagent 自己讀 schema、api doc、寫 code、跑測試（燒它自己的 context）
  → 只回傳：完成報告 + 改了哪些檔 + 殘留風險
主線收到摘要，派下一個
```

**何時一定要用 subagent**：
- 需要讀很多檔才能完成的 skill（backend / frontend / data-modeler）。
- 大範圍搜尋 / 探索（用 Explore 類 subagent，只回結論不回檔案內容）。
- 任何「過程很長、結論很短」的工作。

**何時不必**：
- 純路由判斷（讀 skill-map 決定走哪個 skill）。
- 一兩行的 Fast-Track 微調。

**效果**：一個功能跑 10 個 Node，主線可能只累積 10 份短摘要，而非 10 個 Node 的全部讀檔歷史。

---

## 3. Node = Session 邊界（檔案即記憶）

狀態存在檔案（`node-status.md` + 各 report），所以**不要在一個對話裡跑完整個功能**。

規則：
1. 一個 Node 做完 → `/clear` 或開新 session。
2. 新 session 只重載：`node-status.md` + 下一個 `node-00X.md` + 該 Node 依賴的產出。
3. **不背負前面所有 Node 的對話歷史** —— 那是長專案最大的 token 黑洞。
4. 跨 session 的交接靠檔案，不靠對話記憶。

> 對應 loop-map：每完成一個階段 / Node 是天然的 checkpoint，也是天然的 session 切點。

---

## 4. 模型分級（Model Tiering）

不是每個 skill 都需要最強模型。派 subagent 時指定模型：

| 工作性質 | 建議模型 | 對應 Skill |
|---|---|---|
| 需判斷力：架構、資料建模、審查、設計方向 | Opus | system-architect、data-modeler、code-reviewer、product-planner、ai-design-producer（方向收斂時） |
| 一般實作：CRUD、串接、測試案例、設計重建 | Sonnet | frontend/backend-developer、qa-tester、ai-design-producer（Figma 重建 / visual QA 時） |
| 機械性：文件回寫、changelog、格式整理 | Haiku | docs-maintainer、release notes 草稿 |

> 機械性回寫用 Haiku，成本是 Opus 的零頭。判斷錯了會擴散的決策才用 Opus。

---

## 5. Prompt Caching 擺放

Anthropic prompt cache 會快取**穩定前綴**（TTL 約 5 分鐘），重複讀同內容只算極低的命中價。

配合方式：
1. **穩定的放前面**：CLAUDE.md、skill 檔、loop-map（不變）。
2. **變動的放後面**：當前 node、diff、即時輸出。
3. **別頻繁切換 skill**：同一 skill 連續跑多個 node，skill 檔會命中快取。
4. 連續操作盡量在 5 分鐘內，避免快取過期重算。

---

## 6. Skill / 文件精簡紀律

1. 每個 `skills/*.skill.md` 控制在**約 150 行內**。skill 每長一倍，每次路由就多燒一倍。
2. skill 寫「判準與邊界」，不寫教學 / 範例堆疊。
3. docs 寫「為什麼與現況」，可由程式碼推得的（結構、歷史）不重複寫。
4. 報告（test / review / completion）用結構化短格式，不長篇敘述。

---

## 7. 每輪 Self-Check（開工前問自己）

- [ ] 這一輪我只讀了 1 個 skill detail 嗎？
- [ ] 我讀的 docs 都在該 skill 的 Required Inputs 白名單內嗎？
- [ ] 這個工作「過程長、結論短」嗎？是 → 該派 subagent。
- [ ] 這是新 Node 嗎？是 → 是否該開新 session 而非延續長對話？
- [ ] 這個 skill 該用哪一級模型？
- [ ] 我有沒有「為了保險」讀了用不到的東西？

任一項讓你多燒 token 而無對應價值 → 修正再開工。

---

## 8. 反模式清單（看到就停）

| 反模式 | 為什麼貴 | 改成 |
|---|---|---|
| 一次讀完所有 skill / docs | 數量級的浪費 | 只讀 skill-map + 1 skill |
| 在一個對話跑完整功能 | 對話歷史無限膨脹 | Node 間切 session |
| 主線親自做大量讀檔工作 | 污染 orchestrator 脈絡 | 派 subagent，只收摘要 |
| 整檔讀取只為找一段 | 讀入大量無關內容 | Grep / Glob 定位後讀片段 |
| 所有工作都用最強模型 | 機械工作付旗艦價 | 模型分級 |
| 重複讀同一個檔 | 重複計費 | 同 session 不重讀 |

---

## 落地優先序

前三項是最大收益，且正好貼合本工作流結構：
1. **最小上下文**（skill = 索引按需展開）
2. **Subagent 隔離**（skill = subagent）
3. **Node = session 邊界**（檔案即記憶）

先守住這三項，token 成本即可從「燒得很快」降到「可長期運作」。
