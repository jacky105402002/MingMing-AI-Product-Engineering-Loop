# Known Issues

已知問題、技術債、暫時的權衡。由 docs-maintainer 維護。
**誠實記錄是專業** —— 藏起來的債最貴(見 `skills/docs-maintainer.skill.md`)。

每筆狀態:`open`(未解) / `mitigated`(已緩解未根治) / `resolved`(已解,保留紀錄) / `wontfix`(決定不修)。

---

## 格式
```md
### ISSUE-{n}: {標題}
- 狀態:open / mitigated / resolved / wontfix
- 類型:bug / 技術債 / 效能 / 安全 / 暫時權衡
- 描述:現象 / 影響範圍
- 重現(若是 bug):
- 暫時對策:(若有)
- 根治計畫:(或標 wontfix 的理由)
- 來源:feature / node / report / 日期
```

---

## Open / Mitigated

> 目前無紀錄。開發中發現問題時依上方格式追加。

## Resolved / Wontfix(留痕)

> 解決後從上方移到此區,保留紀錄不刪。
