---
name: mingming-workflow
description: 在已導入 MingMing 工作流的專案中，依需求推進功能或修正，維護 Node、驗證證據、釐清紀錄與文件交接。使用者要求純討論或審查時僅交付該範圍。
---

# MingMing AI 開發工作流

本技能隨專案一起使用；角色細節在儲存庫的 skills/，不在此重複。從本檔往上三層找到專案根目錄，先遵守根目錄 [AGENTS.md](../../../AGENTS.md)。

1. 使用 [router](../../../ai-workflow/prompt-router.md)辨識範圍、風險及適用階段。
2. 新任務從 [intake](../../../docs/intake.md)開始；接續時讀 tasks/current/state.json、handoff.md。不要覆蓋另一個進行中的任務。
3. 使用 [skill-map](../../../ai-workflow/skill-map.md)按需載入角色，沿 [loop-map](../../../ai-workflow/loop-map.md)推進適用工作。
4. 先查證來源；重要缺口依 [clarification-policy](../../../ai-workflow/clarification-policy.md)詢問，等待期間只做不依賴答案的工作。
5. 每個 Node 依 [evidence-policy](../../../ai-workflow/evidence-policy.md)保存對應版本的測試、review 與文件證據，符合 DoD 才標 done。
6. 完成使用者範圍後交付成果、實際驗證與殘留事項。執行與授權邊界依 [autonomy-policy](../../../ai-workflow/autonomy-policy.md)，不因切階段或模型評估而例行要求人工確認。

同一 agent 可依序扮演各角色；獨立 reviewer 可用時有助減少盲點，未使用時如實記錄 self-review，不聲稱獨立審查。本技能不自行授權委派、發布或外部寫入。
