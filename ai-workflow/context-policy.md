# Context Policy

以完整且足以判斷的最小上下文支援正確結果，不用固定 token 數當正確性門檻。

1. 先讀入口、政策摘要與當前狀態，再按角色讀 Required Inputs。
2. Optional Inputs、相關程式與測試可在需要時讀取；記錄擴充理由即可。Allowed Files 約束寫入，不是閱讀白名單。
3. 用 rg／檔案索引先定位；避免沒有目的讀入整庫。
4. 同一版本且仍在有效上下文的內容不重讀；檔案改變、其他 agent 更新或記憶不確定時重新讀相關片段。
5. 同一 agent 可依序執行角色。只在獨立探索／review 能帶來實際價值且環境允許時委派；不要每個 Skill 固定派新 agent。
6. Node 不是強制新 session。接近上下文負荷、長時間中斷或工作轉換時，先更新 state 與 handoff 再切 session。
7. 重啟後檢查實際工作區、未提交修改、當前 revision、問題與證據，不盲信過期摘要。
8. API prompt caching 與客戶端可控制設定不同，不在工作流硬編 TTL。模型政策見 model-routing-policy。

## 成本紀錄

每個功能可記 wall time、人工詢問數、嘗試次數、返工與所有 agent 的實際用量。不能取得的數據記 unknown，不估裝成實測。
上下文縮短不保證總成本下降；成本與品質優化須用 pilot-plan 的相同案例比較。刪除固定「每輪 2,000–4,000 token」保證。
