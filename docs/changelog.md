# Changelog

對外的版本變更紀錄。由 docs-maintainer / release-manager 維護。
**Append-only**:只往後追加,不改寫歷史。

格式參考 [Keep a Changelog](https://keepachangelog.com/) 與語意化版本。

---

## [Unreleased]
> 累積中、尚未發版的變更。發版時搬到新版本區塊。

### Added
-

### Changed
-

### Fixed
-

### Deprecated / Removed
-

---

## [1.1] - 2026-07-10

### Added
- 新增 Codex `model-routing-policy.md`，定義 Sol、Terra、Luna 與推理強度的分級路由。
- 新增每個 Loop 階段、Skill、Implementation Node 與修正重測回圈開始前的 Model Checkpoint。
- 新增模型升級、fallback 與執行紀錄規則。

### Changed
- `prompt-router.md`、`loop-map.md` 與 `context-policy.md` 正式接入 Model Checkpoint Gate。
- README 與工作流導覽更新為四條設計主軸，並標示 v1.1。
- Codex 模型分級取代舊的 Opus、Sonnet、Haiku 路由摘要。

### Migration / 部署注意
- 無程式碼、資料庫或部署變更。
- 使用 Codex 執行 Loop 時，依 Model Checkpoint 提醒確認模型與推理強度。

---

<!-- 發版範例(發版時依此格式新增區塊):

## [1.0.0] - 2026-01-01

### Added
- 功能 X

### Fixed
- 修正 Y

### Migration / 部署注意
- 需執行 migration ...(含回滾方式)

-->
