# Release Policy

1. 先通過功能 DoD；記錄本次 release 的 target、版本、環境、影響範圍與操作授權。
2. 有 migration 時分開檢查 schema 回退、資料恢復、相容部署順序、備份／還原證據、回填重跑與失敗處理。
3. 準備 release notes、已知限制、可執行 smoke test 與回復條件。資訊不足先查證，會影響正確性才詢問。
4. 已明確授權的發布，在工具允許時自主執行；沒有授權則等待；human_only 交接給人並等待結果。只準備材料不等於已發布。
5. released 需要實際發布證據；verified 需要 smoke／版本或健康檢查結果。用 tasks/templates/release-record.md 保存人可讀報告，另依 tasks/templates/release.json 建立機器記錄，以 state 的 release.record 指向 JSON；其中 deployment_evidence／verification_evidence 指向實際報告或 log。
6. 失敗保存錯誤、實際狀態與恢復結果；不能先標 verified，不能盲目重複非冪等操作。
7. verified 後才歸檔；若需求明確不含發布則以 not_requested 歸檔，記錄開發交付完成而非發布完成。為保留來源，歸檔使用複製後驗證，保留原檔直到成功。
8. 有產品價值目標的功能在 spec 設觀察指標／期間／來源；結果回寫已知問題與下一輪需求。未觀察不能宣稱有效。

模板本身的 release 驗證是檔案契約與工具測試，不等於產品的正式使用成功。
