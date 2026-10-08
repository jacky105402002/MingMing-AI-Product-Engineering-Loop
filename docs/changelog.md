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


## [1.1.0] - 2026-10-08

### Added
- 釐清政策、唯一 state.json、版本與 SHA-256 綁定證據、驗證器與 CI。
- AGENTS／原生 Skill、缺少的報告模板、導入升級與真實產品試跑計畫。

### Changed
- AI 自主完成節點內迴圈；progress 與模型評估不再固定要求人工确认。
- Ready／Done／發布各自有明確門檻，11 個角色與來源政策一致。
- 移除固定模型、硬性上下文白名單與未實測的成本保證。

### Migration / Limitations
- 保留既有 v1.1 tag，以 v1.1.0 發布 AI 主導版；不覆蓋使用者專案規則。
- 舊任務需轉 state 與重驗證據。真實產品試跑、成效數據與 LICENSE 仍待完成。
- 舊版記錄僅供追溯；現行自治政策取代舊 Model Checkpoint 人工閘門。
