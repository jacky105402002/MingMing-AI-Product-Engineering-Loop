# Evidence Policy

## 唯一狀態與路徑

tasks/current/state.json 是唯一執行狀態；mode=template 不是有效功能，不能用模板通過宣稱開發完成。
state.spec、node.spec、evidence_files 與 check.evidence 都以專案根目錄為基準。歸檔到新位置後更新路徑及證據 hash，再驗證；不能沿用已移動的相對引用。

## 每次 attempt

把測試、review、完成報告與 log 放到 tasks/current/reports/{node-id}/{attempt-id}/。不可覆蓋先前 attempt。
每個 Node 有 test、review、docs check；必要時加 build、lint、type、migration。文件任務的 test 可以是連結／格式／內容驗證，但不能把 test 或 review 設 N/A。
test 與 review 都需通過；docs 若沒有受影響的文件可記 not_applicable + 理由。

每份 evidence JSON 包含 node_id、revision、kind、result、created_at、command、exit_code、ac_ids、artifacts 及 files（path、sha256）。review 另記 reviewer_mode=self-review／independent 與發現／修正結果。
files 必須涵蓋 feature spec、Node 的 spec、evidence_files，以及所有遞移依賴 Node 的 spec／evidence_files。主線應把行為相關程式、契約與設定加入 evidence_files，不能只列報告而漏掉程式。
執行紀錄工具同時保存 artifacts 的 hash，報告被改動也會使證據失效。

## 建立證據

使用 scripts/record-evidence.mjs，命令見 docs/adoption.md。測試／build／lint／type 由工具實際執行指令、保存輸出與退出碼；review／docs 先寫人工可讀的內容檢查報告，再記錄為人工／AI review 證據，不能聲稱有跑不存在的測試。

結果為 pass／fail／blocked／not_run；只有適用 check 的 pass 能放行，not_applicable 另有理由且不可用於 test／review。
每個 check 的 kind 與 evidence.kind、result、node、revision 必須一致。test evidence 的 ac_ids 應覆蓋該 Node 的 ac_ids。

## 失效與恢復

改變程式、spec、契約或相關依賴後，重開受影響 Node，給新 revision／attempt，重跑受影響驗證。先前 attempt 保留，state 只指向最新有效證據。
validator 可辨識已列入檔案的 hash 不符，但不能自行發現漏列的相依或判定證據語意真偽；review 必須核對實際 diff、AC、執行範圍與品質。
