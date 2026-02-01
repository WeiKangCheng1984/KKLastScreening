# SVG 圖形化導入系統

本項目已實施完整的 SVG 圖形化導入優化方案，包含 5 個獨立方案。

## 文件結構

```
public/
  svg/
    items/          # 道具圖標
      item_rusty_wrench_v1.svg
      item_faded_photo_v1.svg
      ...
    hotspots/       # 交互區標記
      hotspot_door_v1.svg
      hotspot_drawer_v1.svg
      ...
    puzzles/        # 謎題組件
      ...
    decorations/    # 場景裝飾
      decoration_sparkle_v1.svg
      ...
```

## 已實施的方案

### ✅ 方案一：道具 SVG 圖標系統

- **組件**: `components/ItemIcon.tsx`
- **功能**: 為每個道具提供專屬 SVG 圖標
- **使用**: 已在 `components/Inventory.tsx` 中整合
- **類型擴展**: `types/game.ts` 中的 `Item` 接口已添加 `svgIcon` 和 `iconSize` 字段

**示例使用**:
```typescript
const item: Item = {
  id: 'rusty_wrench',
  name: '生鏽的扳手',
  svgIcon: '/svg/items/item_rusty_wrench_v1.svg',
  iconSize: 'medium',
  // ...
};
```

### ✅ 方案二：Hotspot 視覺化標記系統

- **組件**: `components/HotspotIcon.tsx`
- **功能**: 在場景中顯示可互動區域的 SVG 標記
- **使用**: 已在 `components/SceneView.tsx` 中整合
- **類型擴展**: `types/game.ts` 中的 `Hotspot` 接口已添加相關字段

**示例使用**:
```typescript
const hotspot: Hotspot = {
  id: 'door',
  shape: 'rect',
  coords: [0.7, 0.2, 0.9, 0.6],
  svgIcon: '/svg/hotspots/hotspot_door_v1.svg',
  iconPosition: 'center',
  showOnHover: true,
  // ...
};
```

### ✅ 方案三：謎題 SVG 組件化系統

- **組件庫**: `components/puzzle-svg/`
  - `WireConnectionSVG.tsx` - 線路連接謎題
  - `RotatingDialSVG.tsx` - 旋轉轉盤謎題
  - `SymbolSVG.tsx` - 符號組件
  - `SwitchSVG.tsx` - 邏輯開關組件
- **功能**: 用 SVG 渲染謎題的核心視覺元素

**示例使用**:
```typescript
import WireConnectionSVG from '@/components/puzzle-svg/WireConnectionSVG';

<WireConnectionSVG
  wires={wires}
  onWireConnect={(wireId, start, end) => {
    // 處理連接邏輯
  }}
/>
```

### ✅ 方案四：場景裝飾性 SVG 元素

- **組件**: `components/SceneDecoration.tsx`
- **功能**: 在場景背景上疊加動態 SVG 裝飾元素
- **使用**: 已在 `components/SceneView.tsx` 中整合
- **類型擴展**: `types/game.ts` 中的 `Scene` 接口已添加 `decorations` 字段

**示例使用**:
```typescript
const scene: Scene = {
  // ...
  decorations: [
    {
      id: 'sparkle1',
      svgPath: '/svg/decorations/decoration_sparkle_v1.svg',
      position: { x: 0.3, y: 0.2 },
      size: 24,
      animation: 'sparkle',
      zIndex: 1,
    },
  ],
};
```

### ✅ 方案五：動態互動 SVG 系統

- **基礎組件**: `components/InteractiveSVG.tsx`
- **拖動系統**: `lib/svgDragSystem.ts`
- **功能**: 創建可點擊、可拖動、可組合的 SVG 互動元素

**示例使用**:
```typescript
import InteractiveSVG from '@/components/InteractiveSVG';

<InteractiveSVG
  svgPath="/svg/items/item_rusty_wrench_v1.svg"
  draggable
  rotatable
  onDragEnd={(e) => {
    // 處理拖動結束
  }}
/>
```

## 通用組件

### SVGLoader

通用 SVG 載入組件，支援外部文件載入和內嵌 SVG。

```typescript
import SVGLoader from '@/components/SVGLoader';

<SVGLoader
  src="/svg/items/item_rusty_wrench_v1.svg"
  alt="扳手圖標"
  width={64}
  height={64}
/>
```

## CSS 動畫

已添加以下 CSS 動畫類（在 `app/globals.css` 中）：

- `.animate-float` - 浮動動畫
- `.animate-sparkle` - 閃爍動畫
- `.animate-spin-slow` - 慢速旋轉

## 命名規範

SVG 文件命名格式：`{category}_{id}_v{version}.svg`

- category: `item`、`hotspot`、`puzzle`、`decoration`
- id: 唯一標識符
- version: 版本號（如 `v1`）

## 技術規範

- **格式**: SVG 1.1 / SVG 2.0
- **尺寸**: 使用 `viewBox`，不固定寬高（響應式）
- **顏色**: 使用 `currentColor`，支援主題切換
- **文件大小**: 單個 SVG ≤ 10KB（複雜圖形可放寬到 20KB）

## 下一步

1. 為更多道具創建 SVG 圖標
2. 為關鍵互動點創建 hotspot 標記
3. 根據需要擴展謎題 SVG 組件
4. 添加更多場景裝飾元素

## 注意事項

- SVG 文件應優化（移除 metadata、註釋，壓縮路徑）
- 使用 `currentColor` 以支援主題切換
- 移動端會自動降低動畫複雜度以優化性能
