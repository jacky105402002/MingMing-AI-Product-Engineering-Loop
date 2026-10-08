# 任務歸檔

功能已完成且發布需求已滿足（verified，或明確 not_requested）才歸檔。整包保留 spec、Node、state、questions、decisions、handoff 與全部 attempts。

## 步驟

1. 選未存在的 feature-{id} 目的地，先複製 current，保留原檔。
2. 將新 state 的根目錄相對引用改為 archive 路徑；evidence 的搬移 artifact／spec 路徑也同步更新並重新計算檔案 hash。程式檔案 hash 不得改寫來掩蓋差異。
3. 執行 validator --state 新位置 --require-active。驗證成功後才標 archived。
4. 確認沒有未保存變更，再準備下一個 current 模板。歸檔內容保留歷史，不以新功能覆蓋。
5. 未要求發布時，release.record 保留 null，feature.release.status 保留 not_requested；於 handoff 記「開發完成，未要求發布」。不要改成已發布。

歸檔後程式會演進，驗證歷史時應使用當時的程式版本；目前 checkout 的 hash 差異不能反推當年測試沒有執行。
