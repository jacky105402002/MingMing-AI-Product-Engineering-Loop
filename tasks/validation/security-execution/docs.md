# 文件與安裝紀錄

2026-10-15。Skill 的 references/execution.md 說明新的逐款任務、驗證標準、執行收據、輸出 JSON、語意覆核、外部責任、阻礙解除與資料失效。新計畫預設啟用，舊 v2 可 enable-execution 另存，舊符合重設為待確認並保留證據。

已更新操作與資料契約、導入指南、角色入口、README 未發布段落及 changelog。試辦成果可在本次工作區 outputs/security-execution-pilot-2026-10-15/試辦結果.md 查看，含真實失敗與修正紀錄、覆核、查核副本及預期交付阻擋原因。

本機新快照為 .codex/workflows/MingMing/local-security-execution-2026-10-15；先逐檔核對已安裝 Skill 與上次快照一致，再備份至 .codex/workflows/MingMing/backups/security-execution-2026-10-15，最後更新 Skill 與 MingMing 入口。未改全域 AGENTS.md，既有入口仍依 Skill 指向生效。正式 v1.1.2 與前次 2026-10-13 快照保留，無 GitHub 發布。

驗證：99 項測試通過、git diff --check 通過、兩個已安裝 Skill 的 quick_validate 通過、入口連結存在、安裝檔案與儲存庫一致。已用安裝後 CLI 跑第三次隔離備份並得到 passed=true，draft 結構檢查通過；並未宣稱整案 delivery 通過。
