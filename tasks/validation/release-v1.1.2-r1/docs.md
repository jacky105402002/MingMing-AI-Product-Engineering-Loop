# v1.1.2-r1 文件核對

已新增 docs/releases/v1.1.2-r1.md，更新 README 的最新修訂及 release notes 連結、changelog 與導入說明。VERSION 仍為 1.1.2。原 docs/releases/v1.1.2.md 及歷史任務證據保留，屬當時版本的紀錄。

完整文件檢查及 99 項測試通過；git diff --check 未發現格式問題。新版 security-plan 要求與操作指南含 schema v1 遷移、舊 v2 enable-execution、安全回填及證據限制。可執行的隔離備份試辦保留，不將合成資料當成正式驗收。

發布套件將從最終 Git commit 匯出並核對 ZIP／VERSION／有效證據；遠端成功後才切換本機入口到正式 v1.1.2-r1 快照並保存可還原 ZIP。已授權發布，不需重複詢問。GitHub 舊版保留，不強制升級既有產品。
