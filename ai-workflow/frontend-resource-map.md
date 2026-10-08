# React 前端精選資源

適用於採用 React 的產品專案，供 [UIUX](../skills/uiux-designer.skill.md)、[前端](../skills/frontend-developer.skill.md) 與相關審查角色按需查閱。這是候選資源清單，不是每個專案的必裝依賴，也不替代產品需求或設計規範。

官方資料最後查核：2026-10-08。以下優先序為工作流的選型建議；尚未在導入者的產品中完成整合測試。採用時重新核對所選元件的文件與實際專案版本。

## 四項候選

| 資源與官方來源 | 使用時機 | 主責／協作 | 採用條件 |
|---|---|---|---|
| [shadcn/ui](https://ui.shadcn.com/docs/installation) | Button、表單、Dialog、選單等共用介面；React／Tailwind 專案缺少適合的基礎元件時優先評估 | frontend-developer 主責；uiux-designer 對齊規格 | 優先沿用既有設計系統；依實際 Next.js、Vite 等框架讀對應安裝文件，不因範例而更換框架 |
| [ReUI](https://reui.io/docs/get-started) | 後台資料表格、篩選、日曆、看板等進階操作，基礎元件不足時再評估 | frontend-developer 主責；UIUX 與 architect 協作 | 查核時官方要求 React 19、Tailwind v4；不為單一元件自動升級整個專案。區分免費元件與付費項目 |
| [Magic UI](https://magicui.design/docs/installation) | 官網、SaaS 首頁或產品展示的文字、背景與卡片動效 | uiux-designer 選擇用途；frontend-developer 實作 | 官方沿用 shadcn 安裝流程；限於有明確用途的區域，核對所選元件依賴及樣式，區分免費與 Pro 內容 |
| [React Bits](https://github.com/DavidHDev/react-bits) | 需要特定文字、背景或互動效果，現有元件無法合適表達時 | uiux-designer 選型；frontend-developer 實作 | 依專案選 JS／TS、CSS／Tailwind 版本；逐元件核對動畫依賴與效能，選用當下確認免費／Pro 及使用條件 |

## AI 選用順序

1. 先確認需求、目前框架、React／Tailwind 版本、現有元件與設計規範。非 React 任務不載入此清單；既有元件足夠時直接使用。
2. 缺少共用基礎介面才評估 shadcn/ui；後台進階操作不足才評估 ReUI。資料表格外觀不等於已完成排序、分頁、權限或 API 整合。
3. 有明確展示或互動目的才評估動效。一般官網展示先看 Magic UI，特定效果可查 React Bits；比較適用元件即可，不固定要求同時安裝兩套。
4. 技術相容、需求與既有授權足夠時，由 AI 自主完成選型與整合。若候選不相容，優先使用相容替代方案；只有無法滿足需求，或需要未授權費用、重大遷移／產品取捨時才詢問。
5. 依目前官方元件文件取得必要程式碼，檢查將新增的檔案、套件與全域樣式。不要直接覆蓋已客製化元件；記錄來源與差異。推薦清單不表示套件、CLI、MCP 或付費帳號已可用。
6. 使用實際專案命令驗證整合，保存本次 Node 的證據。僅看展示頁或安裝成功，不足以宣稱功能完成。

## 角色交付

| 角色 | 本次需要交付的資訊 |
|---|---|
| uiux-designer | 使用區域、選定元件、選擇理由、互動狀態；動效說明目的與減少動態效果時的替代呈現 |
| frontend-developer | 實際元件與程式變更、套件／樣式影響、資料與狀態串接、適用測試結果 |
| system-architect | 有主要依賴、框架升級或設計系統更換時，評估相容性、SSR／client 邊界及維護取捨；既有相容元件不必另開架構閘門 |
| qa-tester | 適用桌機／手機、鍵盤焦點、loading／empty／error、減少動態效果與必要效能驗證；表格另核對真實資料操作 |
| code-reviewer | 依賴重複、全域樣式衝突、SSR／hydration、事件與動畫資源清理、來源及使用條件、測試缺口 |
| docs-maintainer | 在專案設計／前端文件記錄採用項目、來源、版本或取得日期、客製內容與維護方式 |

## 最小選型紀錄

寫進既有設計文件或 Node，避免另建重複狀態表：

- 使用區域與目標：
- 資源、實際元件名稱及官方來源：
- 選用理由／是否已檢查既有元件：
- 專案版本、相容性、必要依賴：
- 使用條件／付費授權是否已具備：
- 取得版本或日期、客製修改：
- 互動／可及性／效能驗證與證據位置：

版本、套件大小與效能以實際查核或量測記錄；未知寫明 unknown，不填推測值。這份清單只提供選型依據，功能完成仍依 [DoD](definition-of-done.md) 與 [證據政策](evidence-policy.md)。
