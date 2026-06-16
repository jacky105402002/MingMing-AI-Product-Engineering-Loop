# tasks/archive/ — 已完成功能歸檔

功能通過 `ai-workflow/definition-of-done.md` 後，由 release-manager 把 `tasks/current/` 整包搬到這裡。

## 結構

```text
archive/
  feature-{name}/
    feature-spec.md
    nodes.md
    node-001.md ...
    test-report.md
    review-report.md
    iteration-log.md
```

## 歸檔規則

1. 一個完成的功能 = 一個 `feature-{name}/` 資料夾。
2. 搬移後清空 `tasks/current/`、重置 `ai-workflow/node-status.md`，準備下一個功能。
3. 歸檔內容是**留痕**：未來除錯、回顧決策、新功能參考都靠它，不要刪。

> 歸檔由 release-manager 在 12 Release 階段執行，見 `skills/release-manager.skill.md` 的 Handoff。
