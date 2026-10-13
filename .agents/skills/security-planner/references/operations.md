# 操作指南

Node.js 22+，在**產品專案根目錄**執行；下面 `<skill>` 替換為此技能的實際絕對路徑，`<plan>` 替換為專案相對 JSON 路徑。工具的輸入／輸出檔案均限制在產品根目錄內，禁止覆蓋已有輸出。

```text
node <skill>/scripts/security-plan.mjs init --level normal --out tasks/current/security-plan.json
node <skill>/scripts/security-plan.mjs validate --plan <plan> --gate draft
node <skill>/scripts/security-plan.mjs validate --plan <plan> --gate planning
node <skill>/scripts/security-plan.mjs render --plan <plan> --out tasks/current/security-checklist.md
node <skill>/scripts/security-plan.mjs fill-csv --plan <plan> --form FORM-01 --key 項次 --out tasks/current/filled-checklist.csv
node <skill>/scripts/security-plan.mjs validate --plan <plan> --gate delivery
```

level 可用 high、medium、normal、unknown（亦接受高、中、普、尚未確認）。init 只建立未完成的草稿；不執行檢測、不讀取外部帳號、不宣告符合。政府身分預設 yes 是此工具已被標案分流啟動的前提，使用者明確要求非政府適用時自行更正 profile 並記理由。

等級確認或改變後，產生另一份新檔作比較，再合併個案追加要求、既有證據及表單映射；不要重新 init 到進行中檔案。重驗受影響措施，完整保留舊版記錄。

以應用程式讀寫 JSON 補足資料；hash 可用 SHA-256 工具取得。source_review.artifact 為實際來源與適用性覆核報告。完成規劃前，逐款核對原始法規表與個案要求，並補足 8 個委外查核項目的適用性。

MingMing 使用 `feature.security = { government_project: "yes", plan: "tasks/current/security-plan.json" }`。active 任務可填 yes/no/unknown；未知時只做不依賴答案的調查與規劃。標案 active 任務準備實作前以 planning 門檻檢查；feature done 前以 delivery 檢查。若工作僅為規劃，獨立交付 planning 結果即可，不宣稱產品已通過資安驗收。

所有必要條款完整性、機關核定與第三方結果仍需按來源確認。工具不能發現完全未登錄的契約，不能證明外部簽章真實。

內建另有 27 個年度聯合稽核候選項目，共 62 項須處置；非本案適用者記理由及支持來源，不刪列。來源覆核完成後將 policy_scope 從 assess 改為已確認的選擇。
