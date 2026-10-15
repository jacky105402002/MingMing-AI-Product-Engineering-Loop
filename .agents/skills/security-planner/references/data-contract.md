# 資安規劃資料契約 v2

security-plan.json 是逐款要求、證據與表單對照的唯一主表。MingMing Node 執行進度仍在 state.json，以 node_ids 關聯。schema_version=2；v1 不自動放行，須保留原檔再 migrate。

## 三層識別

1. 構面 group：例如 BASE-10「資料備份」，只用來分組與擴展欄位範圍，不能保存符合結論。
2. 細項 control：例如 BASE-10-N01、N02、M01、H01、H02，各自有措施、責任、驗證、結果與證據。這些是內部 ID，官方條款位置在 source_refs。
3. 表單 field：一個原始欄位可對應多個細項，所有應涵蓋細項都完成才能匯總為符合。

## 來源與繼承

assets/clauses.json 保存 62 個原始群組及 185 個內部檢查細項。附表十 27 個構面拆為 83 項；普級展開 48 項，中級 65 項，高級 83 項。另有 102 個委外／年度稽核情境候選，是否適用逐案確認。數量是此工具的拆項方式，不是官方表單列數或保證全部法規義務。

每個群組保存官方 inheritance 引用／合併欄位。程式依群組繼承關係展開，不複製三份摘要，也不只憑等級排序猜測。shared 直接共用；normal／medium／high 表示原始等級來源；context 為情境候選。未知等級產生全部候選且不可通過 planning。

內建 requirement、condition、origin、parent_id、source_refs 與 baseline_requirement 不得改寫或刪除；本案補充填 project_requirement。契約額外要求以 PROJECT- 開頭的新細項加入並標來源。某等級原列無要求的構面會在輸出說明；不能因此免除其他來源義務。

## 計畫欄位

- profile：government_project=yes/no/unknown；level=normal/medium/high/unknown；level_basis、system_scope、policy_scope=extended/mandatory_only/assess；context 記 custom_development、core_system、contract_amount_twd。文件顯示「普／中／高」，不顯示內部英文代碼。
- sources：id、title、url／local_path、version、checked_at；本機來源還需 sha256，檔案改變即失效。
- source_review：status、reviewer、reviewed_at、artifact={path,sha256}、binding_sha256。綁定來源、系統範圍、等級、要求與適用性；必須實際完成語意覆核才填 complete。
- controls：每款 id、parent_id、origin、requirement、condition、source_refs、project_requirement；applicability=pending/applicable/not_applicable 與 rationale；owner、node_ids、measure、verification；progress=planned/implemented/verified；conclusion=pending/conformant/nonconformant/partial/not_applicable。
- evidence／input_files／exception_approval／external_evidence 均為 {path,sha256} 陣列。input_files 包含真正影響結果的程式、設定、契約，不只放報告本身。
- external_required 標示須外部證據；OUT-04-C02 對符合客製化核心或金額條件者不能省略。高級核心認定亦依施行細則第十條處理，不能以 false 標記繞過。
- conclusion_binding_sha256：符合與不適用結論綁定本款措施、驗證、責任、輸入、證據及 profile／sources。改寫措施後須重驗，不能只沿用舊報告 hash。

## 表單欄位與完整性

forms 每份包含 id、kind=csv/document、original={path,sha256}、rows、mappings、coverage。CSV 另記 key、result_column；register-csv 自動盤點每一列，含原始文字，不跳過預勾選欄位。

rows 每列有 field、source_text、disposition=pending/mapped/excluded、scope_groups、required_ids、reason。scope_groups 將相關構面展開成本案所有細項；只涵蓋個別款時用 required_ids。選擇範圍必須對照原表語意覆核，不由相似字詞自動決定。排除列須記理由並納入覆核。

mappings 包含 field、column、control_ids、value_kind=conclusion/statement/evidence。control_ids 只接受細項，不能用 BASE-10 一筆代替五款。每個結果欄位必須包含該列 scope 定義的全部細項；不能把少掉的款放到備註就當結果完整。

coverage 包含 status、reviewer、reviewed_at、artifact、binding_sha256，綁定原檔、列盤點、範圍及映射。所有原始 CSV 列都須存在；漏列、未對照、無理由排除或映射變動會阻擋 planning/final。Word／Excel／PDF 的列盤點仍由文件工具及人工／AI 覆核提供，JSON 檢查不能自行證明原格式完整。

## 門檻與誠實交付

- draft：允許需求與適用性待確認，仍擋刪款、錯誤映射、過期證據及無依據的正面結論。
- planning：等級／來源／政策明確，每個選入細項有適用性處置；適用者有措施、責任、驗證與 Node，已匯入表單的列及映射完成覆核。
- delivery：所有適用細項 verified+conformant，檔案與結論綁定有效，必要外部證據具備；不適用有個別理由、證據及結論綁定。只代表工具與證據完整性門檻，仍非機關驗收。

bindings 指令只計算目前資料指紋，不執行來源審查、測試或簽核；未完成實際工作前不得拿指紋回填成通過。遷移保留舊表與自訂要求待辦，不能直接把舊群組符合分發成每款符合。

## 執行契約補強

2026-10-15 起新計畫預設 execution_required=true，execution.schema_version=1；缺少必要執行資料、語意覆核或仍有相關阻礙，不得把細項標符合。原 v2 格式保留相容性，但沒有 execution 的舊表不能宣稱已啟用代理執行門檻。欄位、升級與操作見 [代理執行](execution.md)。
