# Workflow Improvement Log

記錄本工作流模板**偏離 / 強化原始規範**（`mingming-ai-product-engineering-loop.md`）的決策。
每筆說明：改了什麼、為什麼、影響哪些檔案。

---

## 2026-06-16 — v0.2 三項強化

### 1. 流程隨規模縮放（Fast-Track / Full-Loop）

**Changed**：`prompt-router.md` 新增「變更分級」，分出 Fast-Track（bugfix / 微調 / 文件）與 Full-Loop（新功能 / 動架構 / 動資料 / 動契約）兩條路徑；任務型態表加「路徑」欄；`loop-map.md` 開頭加「兩條路徑」。

**Reason**：原規範對所有變更套用同一條 12 階段流程。對一人 / 小型工作室，每個小改都跑完整閉環，overhead 會超過收益，導致流程被偷偷繞過、最終空轉。流程的重量必須隨變更大小縮放。

**Impact**：`prompt-router.md`、`loop-map.md`、`README.md`。
**鐵則**：動到資料模型或跨模組契約一律 Full-Loop，不論改動多小。

### 2. 資料升為第一公民

**Changed**：`loop-map.md` 新增核心原則「資料是第一公民」，要求資料形狀在 02 Planning 就起草，05 只做細化；階段交接表 02 輸出、05 輸入對應更新。`product-planner.skill.md` 的 feature-spec 新增必填 `Data Shape Sketch`，並加進 Workflow / Quality Gates。`definition-of-ready.md` 第 5 項改為要求資料形狀草圖。

**Reason**：對要活 3 年以上的產品，資料模型是最貴、最難改的東西，且「資料長怎樣」往往才真正定義功能邊界。原規範把 Data Modeling 排在 05（Flow / Architecture 之後），主決策太晚。

**Impact**：`loop-map.md`、`skills/product-planner.skill.md`、`definition-of-ready.md`。

### 3. 每個 Skill 補「品質判準」段

**Changed**：約定每個 `skills/*.skill.md` 在原 9 段外，額外含 `Quality Heuristics（品質判準）`。已在 `product-planner.skill.md` 建立樣板，`README.md` 記下此擴充慣例。

**Reason**：原 Skill 格式偏重 process（做什麼 / 禁止什麼），缺 substance（怎麼判斷做得好）。補上品質判準，讓 framework 從「容器」帶有「內容物」的判準。

**Impact**：`README.md`、`skills/product-planner.skill.md`（樣板），後續所有 Skill 比照。

---

## 2026-06-16 — 執行層 Skills 完成

**Changed**：產出其餘 10 個 `skills/*.skill.md`（flow-designer、system-architect、data-modeler、uiux-designer、frontend-developer、backend-developer、qa-tester、code-reviewer、docs-maintainer、release-manager）。11 個 Skill 全數到位。

**一致性確認**：每個 Skill 皆 (a) 含 Quality Heuristics 段；(b) 標注 loop 階段與 Fast-Track/Full-Loop 路徑；(c) data-modeler 明確「細化草圖而非從零」；(d) release-manager 納入「不可逆動作須人確認」。

**Impact**：`skills/`（10 檔新增）。

---

## 2026-06-16 — 新增 Context Policy（token 政策）

**Changed**：新增 `ai-workflow/context-policy.md`，把省 token 從原則變成執行規則：最小上下文白名單、Subagent 隔離執行（skill = subagent）、Node = session 邊界（檔案即記憶）、模型分級、prompt caching 擺放、skill 精簡紀律、每輪 self-check、反模式清單。README 加入清單、設計主軸第 3 點、最小讀取路徑指向。

**Reason**：工作流檔案數量變多（總控層 + 11 skill + docs），若 AI 執行時把整套讀進來，反而比 vibe coding 更燒 token。需明確規則確保「只讀必要」真的被遵守，工作流才划算。

**Impact**：`context-policy.md`（新增）、`README.md`。

---

## 2026-06-16 — 任務層 tasks/ 建立

**Changed**：建 `tasks/` 任務層 —— `current/`（feature-spec、nodes、node-001、test-report、review-report、iteration-log）+ `archive/` 結構 + 兩份 README。皆為實例化既有格式的空白可填模板（feature-spec ← product-planner；node ← node-template；report ← review-checklist / qa-tester）。

**Reason**：工作流到處引用 `tasks/current/*`，但檔案不存在，AI 執行時無輸出落點。tasks/ 是讓工作流能開跑的基礎地板，且零猜測風險（純實例化既有格式）。

**Impact**：`tasks/`（新增）。

---

## 2026-06-16 — 知識層 docs/ 骨架(分類處理)

**Changed**:依「性質三分類」建 docs/ 的安全部分,A 類押後:
- 建 `docs/README.md`(知識層契約):定義每份 doc 裝什麼 / 誰維護 / source of truth / 屬 A/B/C 類 + 內容管線(intake → docs-maintainer)。
- 建 B 類 append-only 日誌:`changelog.md`、`known-issues.md`(格式 + 範例)。
- 建 C 類範本:`architecture-decisions/adr-template.md`。
- **A 類 9 份參考文件押後**:屬專案專屬內容,等導入專案填完 intake 再種出有料初版,不憑空建空模板。

**Reason**:docs/ 混了三種性質(專案內容 / append 日誌 / per-feature 產物)。只有 B、C 適合預先建;A 類的內容管線(intake → 種 → docs-maintainer 回寫)已存在,中間不該再疊空模板。

**Impact**:`docs/`(README + changelog + known-issues + adr-template 新增)。

---

## 2026-06-16 — Autonomy Policy v0.1

**Changed**:新增 `ai-workflow/autonomy-policy.md`(v0.1 draft)。核心:監督式自治。內容含自治分級 L0–L3(依 blast radius)、三種檢查點(硬停/軟停/自動)、強制人類確認的不可逆動作清單、既有強制停下回報情境、路徑×自治對照、階段檢查點地圖、放行模式建議、subagent 與自治、待修正清單。README 加入清單。

**Reason**:使用者提出「資料齊全 + 完全放行 = 自己跑完」的期待,與工作流 §17 目標及 §13.3 停下規則衝突。需明文界定自治邊界,讓「自動的部分能真自動、會擴散的決策留檢查點」。標 v0.1,待試跑修正粒度。

**Impact**:`autonomy-policy.md`(新增)、`README.md`。

---

## 待辦 / 後續

- [ ] 用真功能試跑，驗證 Skill 交接契約（feature-spec → flow → schema → impl → test → review → docs）是否順暢，並實測 token 消耗。
- [ ] 試跑後修正 autonomy-policy 的檢查點粒度(見該檔 §9)。
- [ ] 導入真專案時:填 `docs/intake.md` → 種出 A 類 9 份參考文件初版。
- [ ] 把 Fast-Track 最小檢查做成 checklist 範本放進 `tasks/`。

---

## 2026-06-25 — AI design-driven loop 分支

**Changed**:新增 `ai-workflow/ai-design-pipeline.md` 與 `skills/ai-design-producer.skill.md`，把設計產出納入正式工作流。第 06 階段由 `UIUX Design` 升級為 `UIUX / AI Design`，交付物擴充為 design brief、AI artifact、Figma frame、component spec、visual QA、engineering handoff。同步更新 router、skill-map、tool-map、mcp-map、DoR、DoD、docs/specs 範本。

**Reason**:原版本把 Figma 視為 UI source of truth，但沒有定義「AI 如何產生設計稿、如何重建到 Figma、如何進工程前驗證」。本分支目標是和 main 區隔，形成設計也由 AI 驅動的產品工程 loop。

**Impact**:`ai-workflow/`、`skills/`、`docs/specs/`、README。
