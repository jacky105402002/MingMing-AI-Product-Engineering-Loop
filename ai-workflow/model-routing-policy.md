# Model Routing Policy — Codex 模型與推理強度檢查點

> 狀態：**v0.1 draft** — 先以真功能試跑驗證，再依品質、成本與等待時間調整。

本政策定義使用 **Codex** 執行 MingMing AI Product Engineering Loop 時，如何在每個階段、Skill 與 Implementation Node 開始前提醒使用者確認模型與推理強度。

---

## 0. 核心原則

> 模型依風險與不確定性分派；推理強度依任務難度調整。每一步先確認，再執行。

模型路由不只看目前位於哪個階段，還要同時評估：

```text
風險 × 不確定性 × 影響範圍 × 規格成熟度 × 失敗後返工成本
```

階段表是預設值，不是不可覆寫的永久綁定。若實際風險高於階段預設，必須升級；若已有完整規格、低影響且可快速驗證，可在說明理由後降級。

---

## 1. Codex 的 Step-Start Model Checkpoint

下列任一事件發生時，Codex 都必須先輸出 **Model Checkpoint**：

1. 開始新的 Loop 階段。
2. 切換主責 Skill。
3. 開始新的 Implementation Node。
4. 進入 `09 → 10 → 09` 的修正重測回圈。
5. 任務風險、範圍或不確定性發生變化。

### 必須使用的提醒格式

```md
## Model Checkpoint

- 下一步：08 Implementation / node-003
- 路徑與風險：Full-Loop / Medium
- 建議模型：GPT-5.6 Terra
- 建議推理強度：medium
- 原因：Node 已通過 DoR、輸入輸出與 Allowed Files 明確
- 目前設定：若 Codex 無法可靠讀取，寫「無法確認」，不得猜測
- 請確認：已調整後回覆「繼續」；若要沿用或改用其他設定，請明確告知
```

### Gate 行為

- Codex **不得只在整個功能開始時提醒一次**；每個上述切點都要重新判斷。
- 根 Task 需要人工調整模型時，Checkpoint 後先停下，收到確認再執行該步驟。
- 若專案已用 `.codex/agents/*.toml` 為自訂 Agent 固定 `model` 與 `model_reasoning_effort`，仍要顯示 Checkpoint；設定吻合時可標示 `status: satisfied`，不需重複要求人工切換。
- Checkpoint 只處理模型選擇，不取代 `autonomy-policy.md` 的 L0/L1 人類確認點。
- 使用者可覆寫建議，但 Codex 必須記錄覆寫結果與風險，不得假裝已自行切換根 Task 的模型。

---

## 2. Model Tier 與推理強度

### Tier A — Decision / Review

預設：**GPT-5.6 Sol**

適用：
- 需求模糊或互相衝突。
- 產品範圍、架構、資料模型、跨模組契約。
- Node 切分與高風險 Review。
- 權限、資安、資料一致性、交易或重大發布 Gate。

推理強度：
- `high`：預設。
- `xhigh`：複雜架構、資料與高風險 Review。
- `max`：只保留給最困難、品質優先且已證明有收益的工作。

### Tier B — Implementation

預設：**GPT-5.6 Terra**

適用：
- 已通過 Definition of Ready。
- 輸入輸出、Acceptance Criteria 與 Allowed Files 明確。
- 逐 Node 實作、測試建立、一般除錯與明確問題修正。

推理強度：
- `medium`：一般實作預設。
- `high`：複雜除錯、一般 Code Review 或較多邊界條件。
- `low`：低風險、可快速驗證且規格完全明確的工作。

### Tier C — Utility

預設：**GPT-5.6 Luna**

適用：
- 格式整理、固定模板回填、批次改名。
- 已有明確來源的機械式文件同步。
- 大量、低判斷成本的轉換工作。

推理強度：`low` 或 `medium`。

> ADR、API 契約、資料定義、Release Gate 等具有語意決策的文件，不得因為輸出格式是 Markdown 就自動降為 Luna。

---

## 3. 12 階段預設路由

| 階段 | 預設模型 | 推理強度 | 升級條件 |
|---|---|---|---|
| 01 Requirement Input | Terra | medium | 來源衝突、需求模糊 → Sol high |
| 02 Product Planning | Sol | high | 高風險或多方衝突 → xhigh |
| 03 Flow Design | Terra | high | 複雜狀態機、跨系統流程 → Sol high |
| 04 System Architecture | Sol | high | 長期或跨模組重大決策 → xhigh |
| 05 Data Modeling | Sol | high | Migration、交易、一致性風險 → xhigh |
| 06 UIUX Design | Terra | high | 產品體驗探索或高不確定性 → Sol high |
| 07 Task Breakdown | Sol | high | 跨模組、高相依性 → xhigh |
| 08 Implementation | Terra | medium | 權限、併發、Migration、跨模組重構 → Sol high |
| 09 Test Execution | Terra | medium | 難以重現、複雜整合或未知失敗 → high / Sol high |
| 09 Code Review | Sol | high | Fast-Track、低風險小改可用 Terra high |
| 10 Fix & Refactor | Terra | medium | 根因不明、重複修正失敗 → Sol high |
| 11 Docs Update | Luna | low / medium | 語意契約、ADR、資料/API 文件 → Terra medium 或 Sol high |
| 12 Release | Terra | medium | 重大版本最終風險審查 → Sol high；部署仍遵守 L0 |

---

## 4. 強制升級與停止規則

Terra 或 Luna 遇到以下情況必須停止目前步驟，重新輸出 Model Checkpoint，建議升級 Sol：

1. Node 輸入不足或 Definition of Ready 實際未通過。
2. Acceptance Criteria 互相衝突。
3. 需要修改資料模型、Migration 或公共 API 契約。
4. 修改超出 Node Scope、Allowed Files 或碰到 Forbidden Changes。
5. 發現既有架構無法支援需求。
6. 測試失敗原因不明或同一問題重複修正仍失敗。
7. 出現資安、權限、金流、交易或資料一致性風險。
8. 原本的低風險判斷已不成立。

需求或 source of truth 衝突時，即使切換 Sol 也不能自行猜測；仍須依 `autonomy-policy.md` 停下回報。

---

## 5. 執行紀錄

每個階段或 Node 的 report / iteration log 至少記錄：

```yaml
model_checkpoint:
  recommended_model: gpt-5.6-terra
  recommended_reasoning_effort: medium
  selected_model: gpt-5.6-terra
  selected_reasoning_effort: medium
  override: false
  escalation_reason: null
```

真功能試跑時額外觀察：完成時間、token、返工次數、Review 發現數、漏出缺陷與升級原因。模型路由應依這些證據修正，不只依主觀感受固定。

---

## 6. 模型版本與可用性

- 模型名稱、可用的推理強度與帳號權限可能變動；開始前以 Codex 當下可選設定與 OpenAI 官方文件為準。
- 若建議模型不可用，保留 Tier 的語意，改選當下最接近的 Decision、Implementation 或 Utility 模型，並在 Checkpoint 記錄 fallback。
- `model_reasoning_effort` 的可用值依模型而異；不得要求介面中不存在的強度後假裝已套用。
- 官方參考：[GPT-5.6 model guidance](https://developers.openai.com/api/docs/guides/latest-model)、[Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)。
