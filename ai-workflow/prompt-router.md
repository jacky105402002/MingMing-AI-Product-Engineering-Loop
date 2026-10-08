# Prompt Router

先確認使用者要規劃、實作、審查或發布；只完成該範圍。純討論不自行進入程式實作。

## 分流

| 路徑 | 條件 | 必要流程 |
|---|---|---|
| Fast-Track | 局部修正／文件；無資料模型、公共契約或高風險變更 | 最小 spec → 實作 → 適用測試 → review → 文件 → 狀態與交接 |
| Full-Loop | 新功能、資料模型、公共契約、跨模組、高風險權限／資料／正式環境變更 | 評估全部階段，完成適用階段與每 Node 的完整驗證 |

檔案少不代表低風險。資料模型或公共／跨模組契約變更一律 Full-Loop。高風險 bugfix 亦走 Full-Loop。
Full-Loop 不強迫沒有 UI 的功能產生 UI 設計；在 state.json 的 feature.stages 記 not_applicable 與理由，不能因此省略必要測試、review 或發布驗證。

## 角色順序

- 新功能：planner → 適用 flow／architecture／data／API contract／UI 設計 → task breakdown → 各 Node 的 developer → QA → reviewer → 必要 fix／retest → docs。
- 資料變更：planner 確認語意 → architect 視影響 → data-modeler → backend／migration Node → QA → reviewer → docs。
- API：planner → architect 視影響 → backend 契約設計 → 必要 UI／資料設計 → 實作 Node → QA → reviewer → docs。
- Bug：先重現與風險判斷，走對應路徑；偶發缺陷可先保留觀測證據，不因無法穩定重現就丟棄。
- 純 review／文件：直接到指定角色，執行對應驗證，不擴大成新功能。
- 發布：核對既有功能證據與 DoD，進入 release-manager；不重做所有需求設計。

## 開工

讀 autonomy-policy、當前 state、skill-map 與下一角色必要來源。模型評估是自動判斷，只有重要資訊或授權不足才問。
新功能先達 Design Ready，適用設計與 Node 完成後才檢查 Implementation Ready；兩者見 definition-of-ready。
Fast-Track 以 tasks/templates/fast-track.md 建立最小紀錄，仍登記 state 與證據。
