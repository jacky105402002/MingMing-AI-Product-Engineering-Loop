# Review Checklist

review 使用 tasks/templates/review-report.md，放入本 Node／attempt 路徑。標示 self-review 或 independent；每項 finding 有嚴重度、實際位置、影響與處理。

| 類別 | 必查問題 |
|---|---|
| 需求 | 實際行為符合哪些 AC？有沒有擅自補產品規則或漏掉重要問題？ |
| 架構 | 符合專案慣例、依賴可理解、沒有無益抽象或非必要固定分層？ |
| 程式 | 邊界、錯誤、並行、重複邏輯、可維護性與相容性？ |
| API／權限 | 契約版本、request/response、驗證、授權與消費端同步？ |
| 資料 | 資料生命周期、NULL 語意、migration 與實際恢復方式？ |
| UI | 適用 loading／empty／error、RWD、鍵盤與可及性？ |
| 測試 | AC／負向／回歸覆蓋、真正執行的命令與版本、是否以 mock 代替未跑整合？ |
| 證據 | Node／revision／hash 正確？有無漏列實際變更或依賴？報告是否誇大？ |
| 自治 | AI 是否查證後才詢問？是否在資訊充分時無謂等待？是否超出授權？ |

不適用的類別附原因。blocking 清空才能 review pass；主線還需核對 test、docs、依賴與所有適用 check 才能 Node done。不要讓 reviewer 直接跳過完整 DoD。
