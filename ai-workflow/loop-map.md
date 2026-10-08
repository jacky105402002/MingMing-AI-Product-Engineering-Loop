# Loop Map

AI 依依賴自主推進。階段交接是產物檢查，不是固定人工核准點。

| 階段 | 主責 | 交付與判定 |
|---|---|---|
| 01 Input | planner | 原始需求、現況與來源 |
| 02 Planning | planner | 問題、範圍、AC、資料草圖、執行約定；Design Ready |
| 03 Flow | flow-designer | 操作／例外／狀態流程；無此需求可附理由略過 |
| 04 Architecture | architect | 影響範圍、必要 ADR；明確需求內可自主決定 |
| 05 Data | data-modeler | schema 計畫、生命週期、migration 與恢復設計 |
| 06 UI／Contract | UIUX、backend 契約設計 | 適用 UI、狀態與 API 契約，前後端共同依據 |
| 07 Breakdown | planner + architect | Node、依賴、範圍、測試與文件義務；Implementation Ready |
| 08 Implementation | developer | 本 Node 程式／測試／diff |
| 09 Test and Review | QA → reviewer | 對應版本的證據、AC 覆蓋與問題 |
| 10 Fix | developer | 修正後回 09，相關舊證據失效 |
| 11 Docs | docs-maintainer | 更新受影響文件或記 N/A 理由；Node 才可 done |
| 12 Release and Feedback | release-manager | DoD、授權、發布結果、smoke test、回復方式與後續觀察 |

08–11 是每個 Node 的內迴圈；完成後選下一個依賴已滿足的 Node。全部 done 再做功能級整合／回歸檢查及發布準備。
05 交付設計，migration 程式在 08 的明確 Node 實作。
設計衝突先查證，能在原範圍修正就更新 spec／Node；重大未知依 clarification-policy 詢問。不要因每次退回設計就要求人工「繼續」。

唯一執行狀態是 tasks/current/state.json。設計階段登記 feature.stages；nodes 只追蹤已切分的實作／驗證交付工作，不在尚未切 Node 前製造虛假完成紀錄。
