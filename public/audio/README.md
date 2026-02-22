# KK流程偵探 — 音訊檔清單（新版）

程式已改為使用以下路徑，請將製作好的配樂／音效放入對應資料夾，**檔名須與下表完全一致**。

---

## 資料夾結構

```
public/audio/
├── bgm/          # 背景音樂（循環播放）
│   ├── kk_bgm_title.mp3
│   ├── kk_bgm_prologue.mp3
│   ├── kk_bgm_intro_ch1.mp3
│   └── kk_bgm_ch1.mp3
└── sfx/          # 一次性音效
    ├── kk_sfx_ui_click.mp3
    ├── kk_sfx_ui_hover.mp3
    ├── kk_sfx_ui_collect.mp3
    ├── kk_sfx_ui_puzzle_ok.mp3
    ├── kk_sfx_ui_error.mp3
    ├── kk_sfx_ui_item_use.mp3
    ├── kk_sfx_scene_change.mp3
    ├── kk_sfx_broadcast.mp3
    ├── kk_sfx_transition_soft.mp3
    ├── kk_sfx_flashlight_on.mp3
    ├── kk_sfx_flashlight_off.mp3
    ├── kk_sfx_lightning.mp3
    └── （以下為劇情／互動用，可依章節需求製作）
        kk_sfx_recorder_click.mp3
        kk_sfx_glass_break.mp3
        kk_sfx_paper_rustle.mp3
        kk_sfx_rust_remover.mp3
        kk_sfx_drawer_open.mp3
        kk_sfx_bed_wheel.mp3
        kk_sfx_door_creak.mp3
        kk_sfx_toolbox_open.mp3
        kk_sfx_rope_tension.mp3
        kk_sfx_descend.mp3
        kk_sfx_box_drag.mp3
        kk_sfx_box_open.mp3
        kk_sfx_door_unlock.mp3
        kk_sfx_metal.mp3
        kk_sfx_wardrobe_open.mp3
        kk_sfx_monitor_on.mp3
        kk_sfx_window_open.mp3
```

---

## 一、BGM（public/audio/bgm/）

| 檔名 | 用途 | 建議長度 | 風格建議 |
|------|------|----------|----------|
| **kk_bgm_title.mp3** | 遊戲開場主選單 | 30–60 秒可循環 | 沉穩、懸疑、低調，不搶標題 |
| **kk_bgm_prologue.mp3** | 序章文案閱讀 | 30–60 秒可循環 | 敘事感、略帶緊張 |
| **kk_bgm_intro_ch1.mp3** | 第一章章節介紹（導讀頁） | 30–90 秒可循環 | 導讀／預告感，可稍緊湊 |
| **kk_bgm_ch1.mp3** | 第一章場景探索（放映廳／播映室／廁所共用） | 30–60 秒可循環 | 影城／放映廳氛圍，低頻、可帶輕微空調或人群餘韻 |

- 格式：MP3，128–192 kbps。
- 程式會設為循環播放，長度不必過長。

---

## 二、SFX — UI 與通用（public/audio/sfx/）

| 檔名 | 用途 | 建議長度 | 風格建議 |
|------|------|----------|----------|
| **kk_sfx_ui_click.mp3** | 按鈕、Hotspot 點擊 | 0.1–0.3 秒 | 輕脆、不刺耳 |
| **kk_sfx_ui_hover.mp3** | 滑鼠懸停（可選） | 0.1–0.2 秒 | 極輕提示 |
| **kk_sfx_ui_collect.mp3** | 取得道具 | 0.3–0.6 秒 | 短促確認感 |
| **kk_sfx_ui_puzzle_ok.mp3** | 謎題提交正確 | 0.3–0.5 秒 | 正向回饋 |
| **kk_sfx_ui_error.mp3** | 錯誤／失敗提示 | 0.2–0.4 秒 | 溫和提醒 |
| **kk_sfx_ui_item_use.mp3** | 背包中使用道具 | 0.2–0.5 秒 | 使用／觸發感 |

---

## 三、SFX — 場景與流程（public/audio/sfx/）

| 檔名 | 用途 | 建議長度 | 風格建議 |
|------|------|----------|----------|
| **kk_sfx_scene_change.mp3** | 切換場景（左右箭頭） | 0.5–1.5 秒 | 輕過場、不突兀 |
| **kk_sfx_broadcast.mp3** | 影城廣播／廣播類對話 | 1–2 秒 | 可帶 PA 感或輕微電流／雜訊，取代舊版純電流聲 |
| **kk_sfx_transition_soft.mp3** | 過渡效果（場景轉場動畫等） | 0.5–1 秒 | 柔和過渡 |
| **kk_sfx_lightning.mp3** | 閃爍／閃電效果（若場景使用） | 0.5–1 秒 | 短促電光感 |
| **kk_sfx_flashlight_on.mp3** | 手電筒開啟 | 0.2–0.4 秒 | 開關感 |
| **kk_sfx_flashlight_off.mp3** | 手電筒關閉 | 0.2–0.4 秒 | 開關感 |

---

## 四、SFX — 劇情／互動用（public/audio/sfx/）

以下為程式內特定劇情或互動觸發時使用，可依章節需求再製作；**第一章未用到的可先留空或沿用暫用檔**。

| 檔名 | 用途 |
|------|------|
| kk_sfx_recorder_click.mp3 | 錄音筆按鍵 |
| kk_sfx_glass_break.mp3 | 玻璃破碎 |
| kk_sfx_paper_rustle.mp3 | 紙張翻動 |
| kk_sfx_rust_remover.mp3 | 除鏽劑／噴劑使用 |
| kk_sfx_drawer_open.mp3 | 抽屜打開 |
| kk_sfx_bed_wheel.mp3 | 病床輪子 |
| kk_sfx_door_creak.mp3 | 門吱呀聲 |
| kk_sfx_toolbox_open.mp3 | 工具箱打開 |
| kk_sfx_rope_tension.mp3 | 繩索拉緊 |
| kk_sfx_descend.mp3 | 垂降 |
| kk_sfx_box_drag.mp3 | 箱子拖動 |
| kk_sfx_box_open.mp3 | 箱子打開 |
| kk_sfx_door_unlock.mp3 | 門解鎖 |
| kk_sfx_metal.mp3 | 金屬聲 |
| kk_sfx_wardrobe_open.mp3 | 衣櫃打開 |
| kk_sfx_monitor_on.mp3 | 監控螢幕開啟 |
| kk_sfx_window_open.mp3 | 窗戶打開 |

---

## 五、規格與注意事項

- **格式**：建議 MP3，相容性最佳。
- **BGM**：128–192 kbps，可循環、無明顯結尾爆音。
- **SFX**：128 kbps，短效、結尾可淡出避免啪聲。
- 檔案請放在 `public/audio/bgm/` 或 `public/audio/sfx/`，**檔名與上表一致**（含 `kk_` 前綴與副檔名 `.mp3`）。
- 若某音效尚未製作，程式播放時會靜默失敗，不影響遊戲進行；可先以靜音檔或舊檔暫代，再逐步抽換。
