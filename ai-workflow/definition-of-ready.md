# Definition of Ready

## Design Ready

planner 能確認問題、目標使用者、初步範圍與可驗證 AC，已有來源和重要未知清單，即可進入設計。非阻塞未知可隨設計查證；不要求設計開始前已切完 Node。

## Implementation Ready

每個適用條件須有來源／產物。可用 N/A，但須說明理由。

- 需求、範圍與 AC 足夠明確，沒有影響該 Node 的 open blocking question。
- 適用流程、架構、資料及 UI 設計完整，重要決策有理由。
- API 需要時已有共用契約：授權、validation、成功／失敗回應、版本與相容性，以及適用的分頁、冪等或併發語意。
- 資料變更已有來源、生命週期、遷移和恢復計畫；不把 down 的存在當資料可恢復證明。
- Node 目標、AC、依賴、Allowed Files、Forbidden Changes、驗證及文件義務已定義。
- 必要工具與測試指令已確認可執行，或已明確區分本 Node 可做工作與環境阻塞。
- 執行與外部操作範圍符合使用者授權。

planner 檢查後把 feature.status 設 ready，Node 依條件設 ready。Fast-Track 可用精簡 spec，但上述適用條件不可跳過。Ready 是 AI 根據證據作出的判斷，不要求例行人工簽核。
