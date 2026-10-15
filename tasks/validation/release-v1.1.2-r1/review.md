# v1.1.2-r1 發布 self-review

最終來源包含先前完成的逐款資安與代理執行改善；本輪僅整合發布文件與驗證證據。99 項工具測試通過，來源已綁定本次 attempt-01，不以先前舊來源證據冒稱新版本通過。審查為同一 agent self-review。

VERSION 保持 1.1.2，README／changelog／導入／發布文件明確區分 v1.1.2-r1 與原 v1.1.2。升級保留原始表單與證據，舊符合不自動帶入新的執行門檻。已知限制如實揭露：沒有真實政府標案驗收、正式表單驗證或獨立第三方檢測，執行器不是 sandbox。

使用者已明確選擇新增 r1 標籤並保留原版。遠端 main 與 v1.1.2 都是 cc730bbd643b85600117e45f423c3a1776449f4a，新 r1 ref 尚不存在。原 ZIP 已備份並比對 SHA-256；發布工具不提供移動／刪除原標籤或資產的操作。只在確切 commit 的 Windows／Ubuntu CI 成功後建立新 release、核對套件雜湊並設為 Latest。

本報告是發布準備 review；實際推送、CI、發布、下載與本機安裝回條另存 outputs/security-publication-2026-10-15，不提前宣稱發布成功。
