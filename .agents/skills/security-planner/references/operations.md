# 操作指南（逐款版）

在產品專案根目錄使用 Node.js 22+ 執行。<skill> 為安裝技能的絕對路徑，所有資料路徑限於產品根目錄內；輸出必須新檔，不覆蓋原表。

```text
node <skill>/scripts/security-plan.mjs init --level 高 --out tasks/current/security-plan.json
node <skill>/scripts/security-plan.mjs validate --plan tasks/current/security-plan.json --gate draft
node <skill>/scripts/security-plan.mjs render --plan tasks/current/security-plan.json --out tasks/current/security-checklist.md
node <skill>/scripts/security-plan.mjs register-csv --plan tasks/current/security-plan.json --form FORM-01 --file sources/checklist.csv --key 項次 --column 結果 --out tasks/current/security-with-form.json
node <skill>/scripts/security-plan.mjs bindings --plan tasks/current/security-with-form.json
node <skill>/scripts/security-plan.mjs validate --plan tasks/current/security-with-form.json --gate planning
node <skill>/scripts/security-plan.mjs fill-csv --plan tasks/current/security-with-form.json --form FORM-01 --key 項次 --mode draft --out outputs/checklist-draft.csv
node <skill>/scripts/security-plan.mjs fill-csv --plan tasks/current/security-with-form.json --form FORM-01 --key 項次 --mode final --out outputs/checklist-final.csv
```

init 只產生待確認項目。政府預設 yes 僅基於既有分流；非政府明確要求使用時另記 profile 與理由。等級可用普／中／高／尚未確認或 normal/medium/high/unknown。

register-csv 盤點完整原表，不自動判斷每列的範圍。AI 依原始問題填 scope_groups 或 required_ids，再映射結果欄。自行補足來源、條件、措施、驗證與責任。完成來源與表單語意覆核後，保存報告及 hash，再用 bindings 的 source/forms 值回填對應 binding_sha256。

執行實際驗證，為每款填 evidence、input_files 及結果。只有符合／不適用需要 bindings 的 conclusions 值回填 conclusion_binding_sha256；這一步只能鎖定已完成的判斷，不能代替實際檢查。

fill-csv 預設草稿模式：未對照列的結果欄改成待對照，不保留原表範例的符合勾選；未覆核時不產生符合。final 需整個計畫通過 delivery。自訂正式選項不是上述文字時，改用文件工具按正式格式回填並檢查，不擅改選項。

## 舊版計畫

```text
node <skill>/scripts/security-plan.mjs migrate --plan tasks/current/security-plan-v1.json --out tasks/current/security-plan-v2.json
```

migrate 只保存舊檔指紋及待接續資訊，所有新款結果回到待確認；舊措施及證據留在原檔，由 AI 逐款檢視再登錄。所有舊表單須重登錄，舊自訂要求須在 migration.project_mappings 指向新細項。不能跳過未移轉的表單或業務條款。

完成比對後再把 MingMing feature.security.plan 指向新表。變更等級時也先產生新檔比較，保留 PROJECT 要求、表單及歷史證據；不可只改 level。當前資料、措施或映射有變更時，重新覆核受影響項目，不重寫舊驗證報告。

新計畫除了逐款規劃，還須依 [代理執行](execution.md)安排檢查與覆核；run 不自動批准結果。舊 v2 用 enable-execution 明確升級，保留原計畫後重新判斷證據。
