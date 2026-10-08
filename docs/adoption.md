# 導入、執行與升級

## 新專案

將 ai-workflow、skills、tasks/templates、scripts、tests、.agents/skills/mingming-workflow、AGENTS.md 與必要文件導入專案。若要沿用本 repo 的文件驗證器，保留本套文件相對路徑；只採用執行狀態檢查時加 --state-only。CI 另按專案合併。
有同名檔案先比較與合併；保留原有 AGENTS、產品規格與未完成任務。不要把此 repo 的 VERSION 覆蓋產品版本。

Codex 的原生入口在 .agents/skills/mingming-workflow/SKILL.md；依目前官方文件，專案技能可由此位置發現。其他 agent 可明確讀 AGENTS.md，再按角色按需讀文件；不宣稱所有客戶端都會自動載入。
參考：[Codex Skills](https://learn.chatgpt.com/docs/build-skills)、[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。

## 開始真實任務

1. 提供期望結果與限制，AI 依 intake 查證現況。
2. 由 planner 寫 feature-spec 與明確 AC；只將關鍵未知列為 blocking question。
3. 把 state.json 改 mode=active，依 [狀態契約](../ai-workflow/state-contract.md)填 feature、stages、nodes、questions、decisions。不可把模板空白當 done。
4. 通過適用設計檢查後，自主完成每個 Node 的實作→測試／review→修正→文件，保存每次 attempt。
5. 完成報告與 handoff 記實際模型、證據、風險與下一步；主線更新唯一狀態。

最小結構見 [範例](../examples/README.md)。

## 命令與證據

需要 Node.js 22，無第三方套件。

```sh
node scripts/validate-workflow.mjs
node --test tests/*.test.mjs
node scripts/validate-workflow.mjs --require-active
node scripts/validate-workflow.mjs --state tasks/archive/example/state.json --require-active --state-only
```

最後一個是路徑用法示例，必須換成實際存在的任務檔案。

先建立 active Node 的 revision、spec、evidence_files（實際受影響程式、契約、設定），再執行：

```sh
node scripts/record-evidence.mjs --node node-001 --kind test --out tasks/current/reports/node-001/attempt-01/test.json -- node --test tests/example.test.mjs
node scripts/record-evidence.mjs --node node-001 --kind review --out tasks/current/reports/node-001/attempt-01/review.json --artifact tasks/current/reports/node-001/attempt-01/review.md --result pass --reviewer-mode self-review
```

測試路徑換成專案的真實測試。工具執行命令並從退出碼決定 pass/fail，review/docs 是先完成報告再人工或 AI 判讀。工具不自動宣告 Node done：檢視結果後將 check.evidence 指向新 JSON，再驗證。失敗或重跑用新 attempt，不覆蓋舊檔。
Windows 下 recorder 使用 shell=false；需要 npm.cmd 等 shell 命令時明確使用已確認的 shell，例如命令部分為 powershell -NoProfile -Command "npm test"。命令參數不可包含 secrets。

檔案與報告 SHA-256 能檢查證據是否過期，不能證明測試完整或 review 語意正確。相關依賴需列入 evidence_files；平台版本等非檔案來源記入報告。

## v1.1 → v1.1.0

1. 保存原版本與未完成任務的 Git 狀態；比較新舊檔案，不整目錄強制覆蓋。
2. 合併本次自治、釐清、路由、狀態、證據政策與角色說明；舊 Model Checkpoint 不再是例行人工核准。
3. 舊 node-status 表轉成 state.json。舊報告沒有版本證據的 Node 標 review_needed，按實際變更重驗，不能直接轉 done。
4. 將舊單一 test/review report 保存為歷史，再啟用每 Node／attempt 證據。
5. 原專案權限、正式環境限制、產品需求與自訂規範保留，解決衝突後才替換規則。
6. 驗證 state 與實際專案測試；第一個功能先觀察詢問品質與完成可靠度。

本次保留舊 v1.1 tag，新增 v1.1.0，不改寫歷史 tag。恢復工作流版本可還原此版本提交中的工作流檔案；產品與資料變更有自己的恢復方案。

## 授權與相容性

目前 repository 未定義 LICENSE，本版不代替擁有者選擇開源授權，也不宣稱已授予第三方商業再散布權利。授權選擇列入追蹤，與工作流技術驗證分開處理。
本版是 agent 可執行的規範與輔助檢查工具，並非常駐排程器、模型 API 編排服務或平台權限繞過工具。
