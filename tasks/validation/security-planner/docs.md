# 文件與本機交付驗證

本次更新了角色索引、主線入口、intake、Ready/Done、狀態契約及 8 個協作角色，新增自包含 security-planner Skill、來源清冊、分級摘要、表單與操作指南。

完整檢查 61 項通過，0 失敗、0 跳過；原有 34 項及新增 27 項測試共用同一測試入口。repository 的兩個原生 Skill 與本機兩個 Skill 格式檢查通過。已安裝 snapshot 的文件與 active 狀態檢查通過。

本機實際執行四種等級初始化、普級 draft 驗證、Markdown 產生及 CSV 副本回填，62 項全部維持待確認，沒有把示範誤標符合。示範輸出保存在本次聊天 outputs/security-planner-demo，非官方表單。

本機安裝位置與備份記於 local-installation.json。全域 AGENTS 13,532 bytes，保留原合作規範、政府問答及工作流選擇。未發布 GitHub 新版，正式 VERSION 仍為 1.1.1。新擴充內容採獨立本機目錄，避免修改舊固定版本。

尚待實案：機關文件／契約與表單的適用性覆核；Word／Excel／PDF 原格式回填與版面驗證；必要正式檢測、簽章及機關驗收。這些不是本次合成測試能證明的結果。
