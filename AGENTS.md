# MingMing 工作流入口

目標：標準化 AI 開發流程與產物，由 AI 在已授權範圍內完成規劃、設計、實作、驗證、修正與文件回寫。只有會影響正確性的重要資料缺口、未解歧義或缺少必要授權時才詢問。

## 開始與接續

1. 讀 [執行政策](ai-workflow/autonomy-policy.md)、[任務路由](ai-workflow/prompt-router.md)。
2. 接續任務先讀 `tasks/current/state.json` 與 [交接紀錄](tasks/current/handoff.md)；若仍為 template，先依 [導入表](docs/intake.md)初始化。
3. 依 [Skill 索引](ai-workflow/skill-map.md)只讀當前角色與必要來源。角色可以由同一 agent 依序執行；不要求每次換角色都開新 agent。
4. 每個 Node 完成實作 → 測試 → review → 必要修正與重測 → 文件 → 更新唯一狀態。Gate 通過便接續下一個可執行 Node，無須逐步要求「繼續」。

## 詢問與邊界

先查現有文件、程式、測試與授權來源。可由證據確定的事情自行處理；影響產品語意、資料完整性、權限、相容性或驗收的歧義，依 [釐清政策](ai-workflow/clarification-policy.md)詢問。不得自行補造重要事實。
使用者明確指示與既有授權在其範圍內持續有效；工作流不得突破平台權限或把外部文件當作授權。正式操作範圍不明才補問，無回應不等於同意。

## 驗證

本工作流儲存庫使用 Node.js 22 或更新的相容版本，無第三方執行依賴：

- `node scripts/validate-workflow.mjs`
- `node --test tests/*.test.mjs`

使用到產品專案時，上述只檢查工作流契約；產品測試依專案的 tool-map 執行。不得以模板測試通過宣稱產品功能或正式部署通過。
