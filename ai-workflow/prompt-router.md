# Prompt Router — 任務描述 → Skill 序列

AI 收到任務時，先用這份判斷**走哪條路徑、要啟用哪些 Skill、依什麼順序**。判斷後再去 `skill-map.md` 取摘要、讀對應 detail file。

---

## 第一步：變更分級（決定走哪條路徑）

流程的重量必須隨變更大小縮放。先判斷這次變更屬於哪一級，再決定走 **Fast-Track** 還是 **Full-Loop**。
**一條鐵則優先於分級：只要動到「資料模型」或「公共/跨模組契約」，一律走 Full-Loop，不論改動看起來多小。**

| | Fast-Track（輕量路徑） | Full-Loop（完整閉環） |
|---|---|---|
| 適用 | bugfix、文案 / 樣式微調、單檔小邏輯、設定值調整、文件更新 | 新功能、新模組、動架構、動資料模型、動公共 API / 契約 |
| 動到資料模型？ | **否**（動到就升級 Full-Loop） | 是 / 可能 |
| 動到跨模組契約？ | 否 | 是 / 可能 |
| 影響檔案 | 少、集中、可一眼看完 | 多、跨層、跨模組 |
| 流程 | 直接到對應 developer → code-reviewer →（必要時）docs-maintainer | 走完整 12 階段 loop |
| 仍必須 | 通過 review-checklist 對應子項、跑該動的測試、回寫 changelog/known-issues | DoR → 全流程 → DoD |

**判斷不確定時，往重的走（選 Full-Loop）。** Fast-Track 是為了不被儀式拖死，不是為了跳過檢查。

### Fast-Track 仍不可省的最小檢查
1. [ ] 確認沒有暗中動到資料模型或公共契約（動了就升級）。
2. [ ] 跑過受影響範圍的測試 + lint / type check。
3. [ ] code-reviewer 至少掃過 review-checklist 的「架構」「程式品質」兩類。
4. [ ] 有對外行為改變 → 回寫 `changelog.md`；有已知殘留 → 回寫 `known-issues.md`。

---

## 第二步：判讀 Skill 序列（主要針對 Full-Loop）

1. 先分類任務型態（見下表）。
2. 取得建議 Skill 序列。
3. 確認進入點是否符合 `definition-of-ready.md`；不符合就回到 product-planner。
4. 依序啟用，每個 Skill 完成後依 `loop-map.md` 交接。

---

## 任務型態對照表

| 任務描述關鍵字 | 型態 | 路徑 | 建議 Skill 序列 |
|---|---|---|---|
| 「我想做一個新功能 / 新模組」 | 全新功能 | Full-Loop | product-planner → flow-designer → system-architect → data-modeler → uiux-designer → (task breakdown) → frontend/backend-developer → qa-tester → code-reviewer → docs-maintainer |
| 「這個需求還很模糊 / 幫我釐清」 | 需求釐清 | Full-Loop | product-planner |
| 「畫面 / 互動 / 元件怎麼設計」 | 純 UIUX | 視範圍 | uiux-designer → frontend-developer |
| 「用 AI 做設計稿 / prototype / app mockup / web mockup」 | AI 設計產出 | 視範圍 | uiux-designer → ai-design-producer → frontend-developer |
| 「輸出到 Figma / 用 Figma MCP 重建」 | Figma 設計重建 | 視範圍 | ai-design-producer → uiux-designer → frontend-developer |
| 「加 / 改一張資料表 / 欄位」 | 資料變更 | **Full-Loop**（動資料模型必走） | data-modeler → backend-developer → qa-tester → docs-maintainer |
| 「加 / 改一支 API」 | API 變更 | Full-Loop（動公共契約必走） | system-architect（影響評估）→ backend-developer → qa-tester → docs-maintainer |
| 「修一個 bug」 | 修正 | Fast-Track（未動資料/契約時） | qa-tester（重現）→ frontend/backend-developer → code-reviewer → docs-maintainer（known-issues / changelog） |
| 「文案 / 樣式 / 設定微調」 | 微調 | Fast-Track | frontend/backend-developer → code-reviewer |
| 「重構 / 整理這段程式」 | 重構 | 視範圍（跨模組則 Full-Loop） | system-architect（確認邊界）→ frontend/backend-developer → code-reviewer |
| 「幫我檢查 / review 這段」 | 審查 | Fast-Track | code-reviewer |
| 「要發版 / 部署」 | 發布 | Full-Loop | release-manager（前置需 DoD 通過） |
| 「文件對不上 / 幫我更新文件」 | 文件同步 | Fast-Track | docs-maintainer |

---

## 路由原則

1. **入口幾乎都是 product-planner**：除非任務明確只屬於單一下游 Skill（如純 review、純文件），否則先讓 product-planner 確認邊界與驗收條件。
2. **一次一個主責 Skill**：不要同一步驟同時扮演多角色（設計原則 2.3）。
3. **scope 不足就停**：執行中發現需求 / 範圍不足，停下回報，回 product-planner 或 task breakdown。
4. **衝突不猜測**：Figma / 文件 / 程式碼衝突時回報，依 `mcp-map.md` 的 source of truth 原則處理。
5. **AI design artifact 不是最終真相**：Open Design / Claude Design 類工具產出的 artifact 必須經過 component spec、Figma reconstruction（若需要）與 visual QA 才能交給工程。

---

## 進入點檢查（給 AI 的 self-check）

開工前回答：
- [ ] 這次變更是 Fast-Track 還是 Full-Loop？（先過變更分級）
- [ ] 有沒有暗中動到資料模型或公共契約？（有 → 強制 Full-Loop）
- [ ] 我知道這個任務屬於上表哪一型？第一個要啟用的 Skill 是哪個？
- [ ] 這個 Skill 要讀的最小文件我清楚嗎？（看 skill-map）
- [ ] 走 Full-Loop 且進入開發前，`definition-of-ready.md` 通過了嗎？

任一項為否 → 先補齊，不要開始改程式。
