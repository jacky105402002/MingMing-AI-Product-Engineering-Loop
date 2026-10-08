# node-001 — 完成 AI 主導工作流與執行驗證

Owner：system-architect（主線依序執行 planner／開發／QA／review／docs）。
AC：AC-001、AC-002、AC-003。依賴：無。Revision：v1.1.0-r2。

Allowed Files：本 repo 工作流、角色、文件、tasks 模板、scripts、tests、AGENTS、VERSION、.agents、.github、.gitattributes。
Forbidden：改寫 v1.1 tag、產品正式資料、將未做產品試跑標完成、擅自決定授權條款。

Tests：node scripts/check.mjs；必要負向案例由 tests/workflow.test.mjs 覆蓋。
Review：自治一致性、狀態 gate、證據 hash／命令來源、路徑邊界、發布 JSON 契約與對外聲明。
Docs：追蹤表、導入升級、release notes、known issues、completion 與 handoff。
Output：來源檔案與 attempt-01 證據；主線可進行 GitHub CI 與版本發布。
