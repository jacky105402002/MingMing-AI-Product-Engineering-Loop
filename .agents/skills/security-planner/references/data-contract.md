# 資安規劃資料契約

`security-plan.json` 是要求、證據與表單對照的唯一主表；Markdown／CSV 為可重建的檢視。MingMing Node 進度仍在 state.json，透過 `node_ids` 關聯，不另造第二套執行狀態。

## 欄位

- schema_version=1；catalog_version 記內建來源版本；每個內建控制項保留 baseline_requirement，等級改變時不可沿用舊基準。
- profile：government_project（yes/no/unknown）、level（high/medium/normal/unknown）、level_basis、policy_scope（extended/mandatory_only/assess）、system_scope、context（custom_development/core_system/contract_amount_twd 及其他本案條件）。level_basis 必須指出確認來源，不宣稱使用者口頭回答是機關核定。
- source_review：status（pending/complete）、reviewer、reviewed_at、artifact（專案相對路徑、sha256）。complete 表示已核對本案來源與契約，不是合規認證。
- sources：有唯一 id、title、url 或 local_path、version、checked_at 的來源；官方內建來源僅種子資料，補入個案契約與原始表單。
- controls：id、title、source_refs（source_id、locator）、requirement、applicability（pending/applicable/not_applicable）、rationale、owner、node_ids、measure、verification、progress（planned/implemented/verified）、conclusion（pending/conformant/nonconformant/partial/not_applicable）、evidence、input_files、exception_approval、external_required、external_evidence。
- evidence／input_files／external_evidence／exception_approval：`{path, sha256}` 陣列，指向專案內存在的檔案。input_files 列影響結論的程式、契約、設定；一併保存 hash，變動就需要重驗。外部環境版本／實際檢測範圍寫入報告。不把 report 本身當作唯一技術輸入。
- forms：id、original（path、sha256）、mappings（field、control_ids、column）。field 為 CSV 的鍵值、Word 表格定位或 Excel 儲存格等明確定位；column 為回填欄位。映射到多項要求時須全部評估，不因其中一項符合就勾整欄符合。

## 門檻

- draft：允許等級、適用性、措施尚未完成；檢查基本結構與來源／ID／檔案引用。草稿通過只表示可處理。
- planning：政府標案屬性與 level 已明確，有 system_scope、level_basis、已完成且有 hash 的來源覆核；27 個基準控制項、8 個委外情境項目及 27 個年度聯合稽核候選項目（共 62 項）均有適用性處置；適用項目有理由、責任、措施、驗證與本地／外部執行方式。MingMing 適用項目連到存在的 Node。
- delivery：額外要求所有適用項目 verified + conformant 且有實際證據及輸入 hash；外部執行項目另有外部證據；不適用有理由及來源／必要核准證據。交付檢查通過仍須語意覆核，不代替機關驗收。

無要求的附表十列也保留於總表：先確認其他來源有無追加義務，再決定 not_applicable 或適用措施。新查到的條款以新 ID 加入，不覆寫基準摘要。原條文若包含多款，measure／verification 要逐款交代，或新增細項 ID 與父項對應。

checks 的通過與表單「符合」分開；建置成功不自動代表任何資安控制項符合。檔案 hash 只能發現已列檔案變動；漏列依賴、報告造假或法律解讀錯誤仍須 reviewer 判斷。

forms.mappings 可指定 value_kind=conclusion／statement／evidence，預設 statement。CSV 不替自訂勾選字典推定語意，特殊欄位先確認再使用文件工具處理。context 顯示客製化且核心系統或金額達新臺幣一千萬元時，OUT-04 必須記 external_required=true 並保留機關自行或委託獨立第三方的檢測證據。
