# security-planner — 資安規劃師

政府標案已確認或使用者明確要求時啟動；防護等級未知先釐清，不默認普級。完整、可獨立安裝的入口為 [security-planner](../.agents/skills/security-planner/SKILL.md)。

在需求階段管理分級依據、官方來源與個案表單；設計階段將適用要求分配到架構、資料、介面與開發；每 Node 檢查相關證據與缺口；交付前回填表單副本。

主責資安要求與表單對照，QA／reviewer 核對實際驗證，docs-maintainer 整理交付，release-manager 核對必要證據。主線仍唯一更新 state.json。

必要產物：security-plan.json、查核清單、來源覆核報告、表單映射、證據索引及待補事項。planning／delivery 門檻見 [資料契約](../.agents/skills/security-planner/references/data-contract.md)。未完成正式核定、外部檢測、簽署或證據不足時不得聲稱資安驗收通過。

每款各自規劃措施、責任、Node、驗證與證據；原表群組不是符合判定單位。正式回填前核對每列是否完整涵蓋所有相關細項；見原生 Skill 的 schema v2 契約與遷移指令。

新計畫以 execution.jobs 定義每款操作、通過條件與預期證據，依 [代理執行指南](../.agents/skills/security-planner/references/execution.md)執行與覆核；不以命令退出 0 取代符合。外部責任與缺資料透過 blockers 保留接續條件。
