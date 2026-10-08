# Known Issues — v1.1.0

| ID | 狀態 | 限制與下一步 |
|---|---|---|
| KI-001 | open | 尚未完成真實產品（UI／API／DB）試跑，依 pilot-plan 補實證。 |
| KI-002 | open | 未提供正式 LICENSE；需擁有者決定授權範圍，本版不代選。 |
| KI-003 | mitigated | validator 檢查結構、路徑、依賴與 hash，無法辨識捏造的語意或漏列依賴；review 必須對照實際 diff 與 AC。 |
| KI-004 | mitigated | 同 agent review 可能延續盲點，明示 self-review；高風險適合獨立審查，但不固定人工介入。 |
| KI-005 | open | 尚無跨模型與長期產品成效數據；成本／cache 效益需實測，禁止保證節省比例。 |
| KI-006 | mitigated | 不同 agent 客戶端的原生入口不同；Codex 提供標準 skill，其餘以 AGENTS 明確導入。 |

執行器不會自行切換無法控制的模型、排程背景工作、部署產品或繞過平台權限。那些操作由承載 agent 在已授權範圍與可用工具內執行。
