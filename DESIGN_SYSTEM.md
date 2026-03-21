# KK 流程偵探（章節 UI/UX）設計系統

本文件用來統一「各章節章尾回報/結算覆蓋層」與「章節相關覆蓋 UI」的視覺語系，確保 Ch1~Ch6 在卡片外框、標題漸層、按鈕層級、以及文字層級上保持一致。

## 1. 主色與層級規則

- 主色（強調/CTA）：橙紅工業（`industrial`）
- 背景分層：深色卡片底（dark-card / dark-surface）+ 橙紅描邊
- 文字層級：以 `text-gray-*` 為主，僅在強調句/CTA 才使用橙紅

## 2. 章尾/回報共用樣式（`app/globals.css`）

已提供以下共用 class：

- `.report-card`：章尾/結算卡片外框（深色底 + 橙紅邊框 + 圓角 + 陰影 + backdrop blur）
- `.report-title`：章尾標題漸層字（橙紅到紅）
- `.report-subtitle`：章尾副標/說明（`text-gray-400`，小字級）
- `.btn-report-primary`：章尾主按鈕（沿用 `.btn-industrial`）
- `.btn-report-secondary`：章尾次按鈕（深色底 + 橙紅 hover 邊框）

### 建議使用方式

- 章尾/結算內容外層優先用 `.report-card`
- 任何章尾標題都用 `.report-title`（避免每章自訂漸層）
- 章尾主/次操作按鈕分別使用 `.btn-report-primary` / `.btn-report-secondary`

## 3. 例外與保留

- 場景內 HUD／進度條／洞察維度若日後新增元件，可保留語意色（藍/粉/橙等），但「章尾卡片外框、標題、主次按鈕」仍應使用 `report-*`，以免整體視覺突兀。

## 4. 需要避免的做法

- 不要在章尾 UI 重新發明 `neutral/white` 外框或白字按鈕（會破壞整體一致性）
- 不要在章尾卡片使用 `amber/slate/stone` 作為主背景/邊框色（改用 `report-*` 統一）

