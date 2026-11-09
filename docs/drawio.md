# Draw.io 接入與操作

本指南配合 [共用圖表規範](../ai-workflow/diagram-policy.md)。Draw.io 是外部可選工具，不是本 repo 的 runtime 依賴；本版沒有隨包安裝 MCP、修改全域設定或內嵌第三方編輯器。

## 環境與版本

2026-11-09 本機參考套件為 Next AI Draw.io MCP 0.4.11；實際操作需探索工具並核對版本，固定專案已驗證的版本，不以 latest 保證相容。Node 需求依選定套件與本機檢查規範核對；本 repo 的 Node 22 要求與外部工具分開。

有 drawio-local Skill 時可依其檢查步驟確認入口、設定、版本與握手；沒有時依官方文件核對實際 MCP。Skill 存在、握手成功、當前聊天有工具、畫布可用與圖表驗收是不同結果。安裝或修復不在繪圖選擇的隱含授權內。

本機套件可附帶編輯器，但設定、替代來源或缺少資源可能改變網路依賴；政府案或敏感資料依本案要求確認編輯器、圖示／外部圖片及 AI 服務資料流，不因 localhost 就宣稱全程離線。升級時核對工具參數與資料保存方式。

## 典型操作

| 目的 | 工具與順序 |
|---|---|
| 全新圖 | start_session → 讀回傳繪圖規範 → create_new_diagram |
| 接續檔案 | start_session → load_diagram(path 或 xml 擇一) → get_diagram → edit_diagram |
| 人剛修改 | get_diagram；指定選取範圍時 get_selection；再 edit_diagram |
| 新增一頁 | add_page；不使用會清空文件的 create_new_diagram |
| 保存完整主檔 | export_diagram，format=drawio，不加頁面篩選 |
| 各頁預覽 | list_pages → export_diagram，format=png 或 svg，明確指定 page_id 或從 0 起算的 page_index |
| 核對畫面 | screenshot_diagram 或預覽匯出圖，修正重疊／錯誤箭頭 |
| 可重新編輯檢查 | 保存目前內容後開新 session → load_diagram 主檔 → get_diagram 比對 |

依工具回傳的完整 Browser URL 開畫布，不猜 port 或複用舊 URL。這台機器的路徑及 session 不應寫進共用模板。export 使用專案允許寫入的絕對路徑；交接文件則以產品根目錄相對路徑引用。修改 .drawio／.drawio.svg 檔也使用 load → edit → export，不繞過工具直接改 XML。

edit 的 update 需完整 new_xml 且 ID 一致；先讀目前內容，不以過期 ID 操作。雲端、網路或 BPMN 圖示先讀工具圖庫；若交付有正式語法要求，仍需另做語意檢查，漂亮圖示不等於標準符合。

## 失敗與交接

PNG／SVG／截圖依賴瀏覽器渲染；逾時先查對應畫布及前景狀態，有新證據再重試，不反覆無限等待。環境受阻時保留可用主檔及未完成預覽項目；不得聲稱已目視。

Desktop 修改需先存檔，再交 MCP load／get 讀回；兩者不自動同步。跨聊天以最新主檔＋圖表交接文件接續，autosave 不作唯一備份。需要復原時先確認版本與範圍，不終止其他使用中的程序。

## Ming-design loop

流程／架構圖不會自動啟用獨立 UIUX 工作流。已選 Ming-design loop 時，引用既有使用者流程、畫面 ID 與 design-handoff；Draw.io 可補導覽關係，Figma 等介面產物沿原流程管理，不另重畫完整設計。MingMing 主線維護開發狀態，設計流程保留其細節。

## 驗證邊界與來源

本版操作試驗見 [圖表範例](../examples/diagrams/README.md)。工具試驗與真實產品試跑分開；真實人工改圖／跨聊天／工程變更追蹤依 [試跑計畫](pilot-plan.md)執行。

- [Next AI Draw.io MCP 上游](https://github.com/DayuanJiang/next-ai-draw-io/tree/main/packages/mcp-server)：工具及版本說明以當前套件為準。
- [官方 draw.io Desktop](https://github.com/jgraph/drawio-desktop)：獨立桌面編輯器，非 MCP 工作階段。

來源核對日期：2026-11-09；本地 0.4.11 套件及已載入工具參數為本次操作依據。第三方套件未隨本版再散布，採用時核對實際版本與授權。
