# Review Checklist

每個 Node 完成後，由 code-reviewer（架構 / 品質 / 資料 / API）與 qa-tester（測試）對照檢查。
結果寫入 `tasks/current/review-report.md`。標記 `blocking`（必須修）或 `non-blocking`（建議）。

---

## 11.1 架構
1. [ ] 是否符合既有架構分層。
2. [ ] 是否有跨模組不當依賴。
3. [ ] 是否把商業邏輯放錯位置。
4. [ ] 是否新增過度抽象。
5. [ ] 是否造成未來功能難以擴充。

## 11.2 程式品質
1. [ ] 命名是否一致。
2. [ ] 是否有重複邏輯。
3. [ ] 是否有過大的 function / component / class。
4. [ ] 是否有 magic number 或未命名常數。
5. [ ] 是否有未處理錯誤。

## 11.3 資料與 API
1. [ ] schema 是否符合資料生命週期。
2. [ ] migration 是否可回滾。
3. [ ] API request / response 是否穩定（向後相容）。
4. [ ] 權限與驗證是否完整。
5. [ ] 是否有 transaction 或資料一致性問題。

## 11.4 UIUX
1. [ ] 是否符合設計系統。
2. [ ] 是否有 loading / empty / error state。
3. [ ] 是否有 RWD 問題。
4. [ ] 是否與 Figma 或 wireframe 對齊。
5. [ ] 是否有可用性問題。

## 11.5 測試
1. [ ] 是否有單元測試。
2. [ ] 是否有整合測試。
3. [ ] 是否需要 E2E 測試。
4. [ ] 是否有回歸風險。
5. [ ] 是否有測試資料或 seed 問題。

---

## review-report 建議格式

```md
# Review Report — Node {number}

## Summary
通過 / 需修正 / 退回重做

## Blocking
- [架構] 商業邏輯寫進 controller，應移到 service（檔案:行）

## Non-blocking
- [品質] 此 function 偏長，建議下個 Node 拆分

## Tests
- 已執行：...（結果）
- 缺漏：...

## Decision
done / back-to-implementation
```

---

## 使用原則

1. 不是每項都要寫滿，但**每一類至少掃過一次**並在報告註明 N/A 與原因。
2. 只有 `blocking` 全清空，Node 才能標 `done`。
3. Node file 的 `Review Checklist` 欄可指定本 Node 特別關注的子項。
