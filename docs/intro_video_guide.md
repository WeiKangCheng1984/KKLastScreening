# 第一章導讀影片檔案指南

## 檔案規格建議

### 格式
- **推薦格式**：MP4 (H.264 編碼)
- **替代格式**：WebM (VP9 編碼，較小檔案但兼容性稍差)

### 尺寸
- **推薦尺寸**：1920×1080 (Full HD) 或 1280×720 (HD)
- **寬高比**：16:9
- **幀率**：24fps 或 30fps

### 檔案大小
- **目標大小**：< 10MB（建議壓縮）
- **最大大小**：< 20MB（避免載入過慢）

### 時長
- **建議時長**：30-60 秒
- **最長時長**：90 秒（避免玩家等待過久）

## 檔案命名

### 檔名格式
```
intro_ch1_animation_v1.mp4
```

### 命名規則
- `intro_` - 前綴，表示導讀影片
- `ch1` - 章節編號
- `animation` - 內容類型（可改為其他描述）
- `v1` - 版本號（更新時可改為 v2, v3...）

### 放置位置
```
/public/videos/intro_ch1_animation_v1.mp4
```

## 啟用方式

在 `data/gameData.ts` 中，找到第一章的 `intro` 配置，取消註釋 `introVideo` 行：

```typescript
intro: {
  title: 'ROOM 1：舊公寓・清晨後',
  subtitle: '一個爆炸事故多年後的老公寓',
  description: '生活仍在延續，但所有痕跡都在提醒：這裡曾經失去過什麼。',
  moodText: '',
  introVideo: '/videos/intro_ch1_animation_v1.mp4', // 取消註釋此行
},
```

## 壓縮建議

### 使用 FFmpeg 壓縮（推薦）
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k -movflags +faststart output.mp4
```

### 參數說明
- `-crf 28`：品質設定（18-28，數字越大檔案越小但品質越低）
- `-preset slow`：編碼速度（slow 品質較好但較慢）
- `-b:a 128k`：音訊位元率
- `-movflags +faststart`：優化網路串流

### 線上工具
- HandBrake（免費，GUI 介面）
- CloudConvert（線上轉換）
- Adobe Media Encoder（專業工具）

## 測試建議

1. 在不同瀏覽器測試（Chrome, Firefox, Safari, Edge）
2. 測試不同網路速度（3G, 4G, WiFi）
3. 測試移動設備播放
4. 確認自動播放和跳過功能正常

## 注意事項

- 影片會自動播放（無聲音，需用戶點擊繼續）
- 玩家可以點擊「跳過」按鈕跳過影片
- 影片結束後會自動進入第一個場景
- 建議使用無聲或背景音樂，避免突兀的音效
