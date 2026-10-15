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


## [1.1.1] - 2026-10-08

### Added
- React 精選資源對照：shadcn/ui、ReUI、Magic UI、React Bits，並接入 UIUX、前端、架構、QA、review、文件角色。既有元件優先，按需採用；未安裝產品套件。

### Changed
- 將最新 AI 主導工作流與資源選型整合為 v1.1 系列主要版本，發布為 v1.1.1 並設為 Latest。
- VERSION、README、發布說明與完整 ZIP 同步；保留舊版本 tag 與歷史證據。

## Unreleased — 2026-10-13 資安規劃師

- 新增獨立 security-planner Skill 與第 12 個 MingMing 角色；政府案件從規劃到交付共用要求、Node、證據與表單映射。
- 依官方來源整理 62 項候選控制／委外／年度稽核摘要，高中普分別產生待評估清單，不自行定級或宣告適用。
- 新增草稿／規劃／交付驗證、SHA-256 證據及輸入變更檢查、CSV 副本回填；保留 Word／Excel／PDF 原格式處理規則。
- feature.security 與舊狀態相容；新增測試與本次維護證據。正式 VERSION 仍為 1.1.1，此擴充尚未發布。

## v1.1.1 — 2026-10-13 資安修訂

使用者指定維持工作流版本 1.1.1。上述資安規劃擴充納入本次發布，使用 v1.1.1-security-20261013 標籤識別修訂，保留原 v1.1.1；內容與驗證見 [修訂說明](releases/v1.1.1-security-20261013.md)。

## [1.1.2] — 2026-10-13

使用者最終指定正式版本 1.1.2，取代前述尚未發布的同版本修訂方案；v1.1.1-security-20261013 未建立。新增資安規劃師、分級來源清單、Node／證據／表單對照與 61 項驗證測試。詳見 [發布說明](releases/v1.1.2.md)。

## [1.1.2-r1] — 2026-10-15

工作流 VERSION 維持 1.1.2；修訂標籤 v1.1.2-r1，保留原 v1.1.2。

### 逐款資安規劃

改為群組／細項／表單三層，明確等級繼承與個別結論，補上完整列盤點、表單範圍覆蓋、來源及結論指紋、中文顯示與舊表安全遷移。未自動沿用 v1 群組符合判定。

### 資安代理執行補強

逐款執行任務、觀察與通過條件；命令執行紀錄及產物指紋；語意覆核與阻礙解除證據。新增隔離備份試辦及負面測試。保留舊 v2 計畫並提供明確升級；本機驗證不等於實際政府案件驗收。
