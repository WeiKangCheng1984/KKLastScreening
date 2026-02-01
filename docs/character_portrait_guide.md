# 角色立繪系統使用指南

## 系統概述

已實作角色立繪系統，支援在對話框中顯示角色立繪。系統已整合到現有的對話系統中。

## 檔案結構

### SVG 立繪檔案位置
```
/public/svg/characters/
  shadow_person.svg      # 客廳的模糊人影
  kitchen_voice.svg      # 廚房的聲音（無實體角色）
  bedroom_shadow.svg     # 臥室的模糊人影
```

## 第一章角色配置

### 場景 1：客廳（ch1_sc1）
- **角色 HOTSPOT ID**: `character_shadow_1`
- **位置**: 客廳中央（coords: [0.4, 0.4, 0.6, 0.6]）
- **角色 ID**: `shadow_person`
- **角色名稱**: `模糊的人影`
- **立繪路徑**: `/svg/characters/shadow_person.svg`
- **立繪位置**: 左側

**對話事件**:
- `talk_to_character_1`: 第一次對話
- `character_1_second_talk`: 第二次對話

### 場景 2：廚房（ch1_sc2）
- **角色 HOTSPOT ID**: `character_voice_2`
- **位置**: 廚房上方（coords: [0.3, 0.1, 0.7, 0.3]）
- **角色 ID**: `kitchen_voice`
- **角色名稱**: `聲音`
- **立繪路徑**: `/svg/characters/kitchen_voice.svg`
- **立繪位置**: 右側

**對話事件**:
- `talk_to_character_2`: 第一次對話
- `character_2_second_talk`: 第二次對話

### 場景 3：臥室（ch1_sc3）
- **角色 HOTSPOT ID**: `person_shadow`（已存在）
- **位置**: 臥室中央（coords: [0.4, 0.5, 0.6, 0.7]）
- **角色 ID**: `bedroom_shadow`
- **角色名稱**: `模糊的人影`
- **立繪路徑**: `/svg/characters/bedroom_shadow.svg`
- **立繪位置**: 左側

**對話事件**:
- `talk_to_person`: 第一次對話（已更新為使用立繪）
- `person_second_talk`: 第二次對話（已更新為使用立繪）

## 立繪 SVG 規格建議

### 尺寸
- **建議尺寸**: 寬 200-300px，高 300-400px
- **寬高比**: 約 2:3（適合人物立繪）
- **顯示尺寸**: 對話框中會自動縮放為 `w-32 h-40`（手機）或 `w-40 h-48`（桌面）

### 設計建議
- 使用簡約的線條風格，符合遊戲的暗色工業風格
- 可以是不完整的人影、輪廓、或抽象圖形
- 保持與遊戲整體視覺風格一致

### 範例 SVG 結構
```svg
<svg width="250" height="400" viewBox="0 0 250 400" xmlns="http://www.w3.org/2000/svg">
  <!-- 模糊人影的簡約設計 -->
  <g opacity="0.6">
    <!-- 人物輪廓 -->
  </g>
</svg>
```

## 使用方式

### 在 gameData.ts 中添加角色對話

```typescript
{
  type: 'showDialog',
  dialog: {
    text: '對話內容',
    type: 'character',
    characterId: 'character_id',
    characterName: '角色名稱',
    characterPortrait: '/svg/characters/character_portrait.svg',
    characterPosition: 'left', // 或 'right'
  },
}
```

### 對話類型
- `type: 'character'`: 角色對話，會顯示角色名稱和立繪
- 其他類型保持不變

### 立繪位置
- `characterPosition: 'left'`: 立繪顯示在對話框左側
- `characterPosition: 'right'`: 立繪顯示在對話框右側

## 技術細節

### Dialog 類型擴展
已添加以下字段到 `Dialog` 接口：
- `characterId?: string` - 角色 ID
- `characterName?: string` - 角色名稱（顯示在標題欄）
- `characterPortrait?: string` - 立繪圖片/SVG 路徑
- `characterPosition?: 'left' | 'right'` - 立繪位置

### DialogBox 組件更新
- 支援顯示角色立繪（優先於普通 SVG）
- 立繪顯示在對話框左側或右側
- 角色名稱顯示在標題欄
- 響應式尺寸調整

## 下一步

1. **創建立繪 SVG**: 在 `/public/svg/characters/` 目錄下創建三個角色的 SVG 檔案
2. **測試對話**: 在遊戲中點擊角色 HOTSPOT 測試對話顯示
3. **調整對話內容**: 根據需要修改 `gameData.ts` 中的對話文本
4. **擴展功能**: 可以添加更多角色、表情切換等功能

## 注意事項

- 立繪 SVG 檔案需要放置在正確的路徑
- 如果 SVG 不存在，對話框仍會正常顯示，只是沒有立繪
- 角色對話會自動記錄到對話歷史中
- 支援多輪對話和選擇分支
