# MingMing v1.1.0 改善追蹤

依 2026-10-08 使用者決議：AI 在明確範圍自主完成各 Node workflow；會影響結果的重要缺口先查證，仍無法解決才詢問。取代先前逐項等待決議的暫定狀態。

「已實作」表示模板／規則／工具已落地並接受本版驗證，不代表所有真實產品情境已試跑。原始審查細節保留在本機詳細追蹤表。

| ID | 項目 | 本版狀態 | 實作證據／剩餘事項 |
|---|---|---|---|
| WF-001 | 統一自治與模型確認 | 已實作 | [autonomy-policy、model-routing-policy；例行 progress/model 自主推進](../ai-workflow/autonomy-policy.md) |
| WF-002 | 唯一 Node 狀態 | 已實作 | [state.json 唯一狀態；node-status 改成狀態契約](../ai-workflow/state-contract.md) |
| WF-003 | Node／attempt 證據 | 已實作 | [revision、SHA-256、命令退出碼、報告與依賴綁定](../ai-workflow/evidence-policy.md) |
| WF-004 | 風險分流與裁剪 | 已實作 | [Fast-Track 僅 low risk，設計階段 N/A 需理由](../ai-workflow/prompt-router.md) |
| WF-005 | 規劃設計與 DoR | 已實作 | [Design Ready 與 Implementation Ready 分開](../ai-workflow/definition-of-ready.md) |
| WF-006 | API 契約責任 | 已實作 | [backend 於 06 主責，frontend／QA 核對](../skills/backend-developer.skill.md) |
| WF-007 | Agent 啟動與技能 | 已實作 | [AGENTS 與 Codex 原生 skill，其他客戶端明確讀取](../AGENTS.md) |
| WF-008 | 上下文與恢復 | 已實作 | [必要資料先讀、按需擴充、無強制換 session／agent](../ai-workflow/context-policy.md) |
| WF-009 | 模型可用性 | 已實作 | [能力分級、即時可用性、無固定過期模型名稱](../ai-workflow/model-routing-policy.md) |
| WF-010 | 成本與快取假設 | 部分完成 | [移除保證節省說法；真實 token／費用量測待產品試跑](pilot-plan.md) |
| WF-011 | migration 恢復 | 已實作 | [計畫與實作分開，down 不等同資料恢復](../skills/data-modeler.skill.md) |
| WF-012 | DoD 適用與放行 | 已實作 | [test／review 不可略過，docs N/A 要理由](../ai-workflow/definition-of-done.md) |
| WF-013 | 發布狀態區分 | 已實作 | [ready／released／verified／archived，驗證證據不可省](../ai-workflow/release-policy.md) |
| WF-014 | 產品成效回饋 | 部分完成 | [完成欄位與量測方法；真實產品發布後結果待實測](pilot-plan.md) |
| WF-015 | 文件契約與 CI | 已實作 | [驗證器、負向測試、Windows／Ubuntu CI；遠端結果另核對](releases/v1.1.0-validation.md) |
| WF-016 | 代表性功能試跑 | 待完成 | [本次 repo 維護不替代 UI／API／DB 產品試跑；需選定產品與功能](pilot-plan.md) |
| WF-017 | Fast-Track 模板 | 已實作 | [最小 scope、AC、驗證與完成記錄](../tasks/templates/fast-track.md) |
| WF-018 | 完成與交接 | 已實作 | [completion 模板、handoff、每次 attempt 報告](../tasks/templates/completion-report.md) |
| WF-019 | 模型紀錄入模板 | 已實作 | [requested／actual／reason；取不到記 unknown](../tasks/templates/completion-report.md) |
| WF-020 | Intake 最低條件 | 已實作 | [AI 先查證；非關鍵缺漏不阻塞，重要未知不靠 TBD 過關](intake.md) |
| WF-021 | 來源契約 | 已實作 | [位置、版本、Owner、取不到的處理與衝突查證](../ai-workflow/mcp-map.md) |
| WF-022 | 過度絕對判準 | 已實作 | [NULL 依語意、偶發 bug 留觀察、不強制架構層](../ai-workflow/review-checklist.md) |
| WF-023 | 文件與版本責任 | 已實作 | [歷史標示非現行，導覽與角色責任一致](../ai-workflow/README.md) |
| WF-024 | 分享與升級 | 部分完成 | [已補導入／合併／版本遷移；LICENSE 仍需擁有者決定](adoption.md) |

下一輪優先：WF-016 真實產品試跑，同時收集 WF-010／WF-014 成效；WF-024 授權由擁有者選擇。這些尚未完成的項目已如實列入發布限制，不以日期壓力勾選完成。
