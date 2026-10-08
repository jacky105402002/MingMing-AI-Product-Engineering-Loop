# Node Status 契約

唯一機器狀態：[tasks/current/state.json](../tasks/current/state.json)。本檔只定義規則，不再保存第二份狀態表。nodes.md 僅索引規格與依賴。

## Node 轉換

pending → ready → in_progress → review_needed → done。
in_progress／review_needed 可轉 blocked；阻塞解除後回 ready 或 in_progress。review 未過回 in_progress；已 done 的依賴／產物失效要重開，不可保留舊 done。
blocked 要能從 questions 或 handoff 找到原因與解除條件。

## 更新責任

主線是 state.json 的唯一寫入協調者。各角色交付產物與結果，由主線檢查 DoD 後更新。新 session 先核對檔案與證據，再繼續；state 的字面值不能蓋過事實。
每次有重要更新同步 handoff。歸檔時保存整個 current（含 state、所有 attempts、證據與決議）；不得搬走後不更新相對引用。見 tasks/archive/README.md。
