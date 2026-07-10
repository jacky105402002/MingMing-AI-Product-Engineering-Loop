# MingMing AI Product Engineering Loop

> 讓 AI 從 **vibe coding** 升級為 **vibe engineering** 的長期產品開發作業系統。
> 工作室:明明工作室 / MingMing Studio｜狀態:**結構完成,待真功能試跑驗證**

一套針對 AI 輔助產品開發的閉環工作流。不是讓 AI 依 prompt 快速產生功能,而是把 AI coding 轉化成**可追蹤、可審查、可測試、可回寫文件、可持續迭代**的產品工程系統。

適用場景:MVP / POC 已完成市場測試,準備進入可維護 3 年以上的主版本開發。

---

## 四條設計主軸(在原始規範上強化)

1. **流程隨規模縮放** — 小改走 Fast-Track,不必每次跑完整 12 階段(`ai-workflow/prompt-router.md`)。
2. **資料是第一公民** — 資料形狀在規劃階段就起草,動資料模型一律走 Full-Loop(`ai-workflow/loop-map.md`)。
3. **最小上下文省 token** — skill 當索引、subagent 隔離、Node 間切 session、模型分級(`ai-workflow/context-policy.md`)。
4. **每步確認模型與推理強度** — 使用 Codex 時，每個階段、Skill、Node 與修正回圈開始前先顯示 Model Checkpoint，確認後才執行(`ai-workflow/model-routing-policy.md`)。

---

## 目錄結構

```text
.
├── mingming-ai-product-engineering-loop.md   # 原始方法論文件(大方向)
│
├── ai-workflow/          # 總控層:AI 的入口與政策(只讀這層判斷怎麼走)
│   ├── README.md             # 總控層導覽 + 最小讀取路徑
│   ├── loop-map.md           # 12 階段主流程 + 階段交接 + 資料第一公民
│   ├── skill-map.md          # 11 個 Skill 路由摘要(入口)
│   ├── prompt-router.md      # 任務 → 路徑(Fast-Track/Full-Loop)→ Skill 序列
│   ├── model-routing-policy.md # Codex 每步模型 / 推理強度提醒與升級規則
│   ├── node-template.md      # Development Node 格式 + 切分原則
│   ├── node-status.md        # 當前功能 Node 狀態表
│   ├── definition-of-ready.md   # 進場閘門
│   ├── definition-of-done.md    # 出場閘門
│   ├── review-checklist.md   # 5 類審查清單
│   ├── tool-map.md           # 工具用途對照(依專案調整)
│   ├── mcp-map.md            # 外部平台 source of truth
│   ├── context-policy.md     # 脈絡與 token 政策
│   ├── autonomy-policy.md    # 自治與檢查點政策(v0.1)
│   └── workflow-improvement-log.md  # 偏離原規範的決策紀錄
│
├── skills/               # 執行層:11 個角色 Skill(每個只負責一種專業)
│   ├── product-planner.skill.md     # 產品規劃(入口)
│   ├── flow-designer.skill.md       # 流程設計
│   ├── system-architect.skill.md    # 系統架構
│   ├── data-modeler.skill.md        # 資料建模
│   ├── uiux-designer.skill.md       # UIUX 設計
│   ├── frontend-developer.skill.md  # 前端
│   ├── backend-developer.skill.md   # 後端
│   ├── qa-tester.skill.md           # 測試
│   ├── code-reviewer.skill.md       # 審查
│   ├── docs-maintainer.skill.md     # 文件維護
│   └── release-manager.skill.md     # 發布管理
│
├── docs/                 # 知識層:產品長期文件
│   ├── README.md             # 知識層契約(A/B/C 分類)
│   ├── intake.md             # 專案導入填寫表(附參考格式)
│   ├── changelog.md          # 版本變更(append-only)
│   ├── known-issues.md       # 已知問題 / 技術債
│   └── architecture-decisions/
│       └── adr-template.md   # ADR 範本
│
└── tasks/                # 任務層:當前功能的工作區
    ├── current/              # feature-spec / nodes / node-00X / reports / log
    └── archive/              # 完成功能歸檔
```

---

## 怎麼開始用(導入新專案)

1. **填 `docs/intake.md`** — 把零散需求丟給 AI,請它依每節「填寫格式」整理回填。
2. **種知識層** — AI 依 intake 產出 `docs/` A 類參考文件初版。
3. **跑第一個功能** — 從 `ai-workflow/skill-map.md` 入口,product-planner 產出 `tasks/current/feature-spec.md`,過 Definition of Ready,沿 loop 推進。

使用 Codex 推進 Loop 時，每次切換階段、Skill、Implementation Node 或進入修正重測回圈，Codex 都會先輸出 Model Checkpoint。請先調整或確認建議的模型與推理強度，再回覆「繼續」。

> AI 執行時只讀:`skill-map.md` + 當前 1 個 skill + 當前 node + 該 skill 宣告的最小 docs。詳見 `ai-workflow/context-policy.md`。

---

## 完成度

| 層 / 政策 | 狀態 |
|---|---|
| 總控層 `ai-workflow/` | ✅ 15 檔 |
| 執行層 `skills/` | ✅ 11 個 Skill |
| 任務層 `tasks/` | ✅ 模板完成 |
| 知識層 `docs/` | ✅ 骨架(A 類待 intake 種) |
| 四大政策(loop / context / autonomy / model routing) | ✅ |
| **真功能試跑驗證** | ⬜ 待進行 |

---

## 核心精神

> 規劃有輸入,流程有節點,架構有邊界,資料有來源,UI 有依據,開發有檢查,測試有證據,文件有回寫,產品有下一輪。
