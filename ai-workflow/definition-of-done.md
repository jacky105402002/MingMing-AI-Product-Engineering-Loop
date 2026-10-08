# Definition of Done

## Node Done

主線核對以下條件才把 state.json 的 Node 標 done：
- 目標與該 Node 的 AC 已由必要驗證覆蓋。
- 必要 test、review 及 docs check 均有結果與證據；不適用只可附具體理由，test 和 review 不可略過（文件任務可用文件驗證作為 test）。
- 測試含適用回歸，review 無未解 blocking；高風險部分明確檢查權限／資料／相容性。
- 證據綁定相同 revision 與實際 artifact hash；程式／spec／契約變更後重做受影響驗證。
- 文件同步完成；無須改文件記 not_applicable 與理由。
- 依賴 Node 均 done，沒有該 Node 的 open blocking question。
- 完成與交接報告可找到實際產物與剩餘風險。

## Feature Done

所有 Node done；每條 feature AC 至少對應一個完成 Node。跨 Node 的必要整合／回歸驗證以最後一個整合 Node 保存，不能只用各模組單測宣稱整體通過。
lint／type／build／API／DB／UI／ADR 等依適用性核對。沒有變更不必製造無意義更新，N/A 要理由。
機器檢查不能證明語意正確；主線仍須核對需求與證據。

## Release

feature.status=done 只表示開發完成。feature.release.status 分別為 not_requested、ready、released、verified、archived。
未要求發布可停在 done，交付成果；要求發布則依 release-policy 完成授權、實際發布與驗證。發布失敗不能宣稱 released；未驗證不能歸檔。
