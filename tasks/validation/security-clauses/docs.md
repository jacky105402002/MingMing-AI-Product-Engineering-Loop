# 文件與本機使用驗證

2026-10-13。已更新資安 Skill、資料契約、來源拆項紀錄、操作及表單指南、MingMing 狀態說明、導入與未發布變更紀錄。新計畫採 schema v2，MingMing 主狀態 schema 仍為 v1；現有計畫須保留原檔後 migrate，再重新覆核。

完整模板文件／程式檢查及 75 項測試通過，證據見 attempt-02。兩個本機 Skill 均通過 quick_validate.py（UTF-8 模式）；本機資安 Skill 逐檔與儲存庫比對一致，MingMing 入口相對連結存在。使用安裝路徑的 CLI 實際 init 中級、validate draft、render 成功，附表十展開 65 款且顯示中文等級。

示範在本次工作區 outputs/security-clauses-demo/規劃與表單對照示範.md，提供普／中／高待確認清單、備份五款規劃、原 CSV 與回填草稿。草稿第一列為待覆核，第二列為待對照。全部為合成案例，未偽造符合證據。

本機入口採 .codex/workflows/MingMing/local-security-clauses-2026-10-13，共用來源不存真實產品狀態。本機原 Skill、入口及全域 AGENTS 已備份在 .codex/workflows/MingMing/backups/security-clauses-2026-10-13。正式 v1.1.2 目錄／ZIP 保留。本輪不發布至 GitHub，也不自動升級既有產品。
