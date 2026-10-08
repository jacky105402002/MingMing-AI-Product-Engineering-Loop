# State Contract

state.json 使用 schema_version=1。路徑以專案根目錄為準，不能是絕對路徑或越出專案。細節由 scripts/validate-workflow.mjs 檢查。

## 功能

- mode：template／active。template 只能是尚未初始化、無 nodes／questions／decisions。
- feature：id、route（fast-track／full-loop）、risk（low／medium／high）、status（draft／ready／in_progress／blocked／done）、spec。
- acceptance_criteria：[id、description]；必須可驗證，不能有重複 ID。
- stages：[id、status（applicable／complete／not_applicable）、reason、artifact]；not_applicable 要理由，complete 要存在的 artifact。
- release：status（not_requested／ready／released／verified／archived）、record（根目錄相對 JSON 路徑或 null）。

## Node

id、goal、owner（11 個角色之一）、status、depends_on、ac_ids、spec、allowed_files、evidence_files、revision、checks。
- 狀態見 node-status.md。
- evidence_files 列行為相關程式、契約與設定；required evidence 另包含自己與所有依賴的 spec。
- checks：[id、kind（test／review／docs／build／lint／type／migration）、result（pass／fail／blocked／not_run／not_applicable）、reason、evidence]。
- done 的必要 test／review／docs 都要存在，test／review 必須 pass，docs 可附理由 N/A；其餘已列入的適用 check 亦須 pass。

## Questions 與 Decisions

questions：[id、question、impact、blocking、node_ids、status（open／resolved）、sources_checked、answer、resolution_source]。
空 node_ids 的 blocking question 影響整個功能。resolved 需要明確答案與來源；沒有回應不是答案。
decisions：[id、decision、reason、source]，保存 AI 依據或使用者授權來源。

## 最小 active 範例

參考 examples/README.md 的初始化與演練方式。真實任務不可複製範例通過結果當成證據。
