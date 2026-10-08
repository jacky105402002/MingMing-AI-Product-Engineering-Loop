# Model Routing Policy

模型是執行配置，模型評估不等於人工核准。優先使用使用者選定或目前可用、足以完成工作的模型；不要因例行切角色中斷。

## 能力層級

| Tier | 工作 | 選擇依據 |
|---|---|---|
| decision | 模糊需求、重要資料／架構、複雜 review | 推理、工具使用、辨識歧義與驗證能力 |
| implementation | 範圍明確的實作、測試、除錯 | 任務成功率與整體耗時 |
| utility | 有來源的機械整理、格式轉換 | 正確性已易於檢查，成本合理 |

不把世代名稱寫入每個角色。初始沿用可用設定；專案如需固定對照，在 docs/model-profile.md 記 model ID、實際支持的 effort、來源、查核日期、fallback 與試跑結果。
官方參考：[Models](https://learn.chatgpt.com/docs/models)、[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)。配置前重新查核，不假設帳號與客戶端均可用。

## 評估時機

任務開始、風險或能力需求改變、重複失敗缺乏進展。設定足夠就記沿用並繼續；低風險小改不必輸出大段 Checkpoint。
根對話不能可靠自動切換時不得聲稱已切換。需要升級才能可靠完成且不能由現有工具做到時，說明具體原因再詢問；重要資料缺口不能靠升級模型解決。
自訂 agent 只有在工具實際可用、設定可靠且委派獲允許時使用；沒有自訂 agent 仍可執行本流程。

## 紀錄

在每次 attempt 的 completion 報告記錄：
- tier、recommended_model、recommended_effort；
- actual_model、actual_effort（無法確認則 unknown）；
- decision：retain／change／fallback；原因、覆寫來源；
- 是否需要人工動作與其結果。

同一設定未變可引用前次紀錄。效益由總用量、耗時、缺陷與返工驗證，不假定較新或較強一定更划算。
