# 《FME異物入侵》

一個基於 Next.js 14 的沉浸式互動遊戲，講述一個關於規則、選擇與身份的故事。

> 你不是來扮演誰的。  
> 你只是走進了一個還沒有被做出最後決定的地方。

## 故事簡介

這裡的人都很努力。他們守規則、照程序、相信只要撐過去，一切就會變好。

但有些時候，規則來不及。

當時間不夠、錢不夠、運氣不夠，人就會開始尋找別的答案——不是因為那是對的，而是因為那是唯一還在運作的東西。

你會看到火。你會看到秩序。你會看到一個人，在兩套系統之間，被慢慢擠壓。

這不是一個關於犯錯的故事。這是一個關於——人是從哪一步開始，覺得自己其實沒有選擇。

## 技術棧

- **Next.js 14** (App Router) - 章節/場景路由系統
- **TypeScript 5** - 型別安全，鎖住內容結構
- **Tailwind CSS 3** - 沉浸式暗色 UI
- **Lucide React** - 輕量圖示系統
- **Vercel** - 部署平台

## 專案結構

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首頁
│   ├── globals.css              # 全域樣式
│   └── play/
│       └── [chapterId]/
│           └── [sceneId]/
│               └── page.tsx     # 遊戲主頁面
│
├── components/                   # React 組件
│   ├── SceneView.tsx            # 場景視圖（含閃爍效果）
│   ├── DialogBox.tsx            # 對話框系統
│   ├── Inventory.tsx            # 道具欄
│   ├── DeveloperPanel.tsx       # 開發者面板
│   └── [各種謎題組件]           # 15+ 種謎題類型
│
├── data/
│   └── gameData.ts              # 遊戲資料（場景、道具、事件）
│
├── lib/                          # 核心邏輯
│   ├── gameEngine.ts            # 遊戲引擎
│   └── audioManager.ts          # 音效管理
│
├── types/
│   └── game.ts                   # TypeScript 型別定義
│
├── docs/                         # 文件
│   ├── game_content_all_rooms.md # 完整遊戲內容資料
│   └── [其他文件]
│
└── public/                       # 靜態資源
    ├── images/                   # 場景背景圖（15張）
    └── audio/                    # 音效檔案
        ├── ambient/              # 環境音
        ├── broadcast/            # 廣播音效
        ├── horror/               # 恐怖音效
        └── sfx/                  # 音效
```

## 遊戲架構

### 5個 ROOM，15個空間

- **ROOM 1：舊公寓・清晨後** (ch1)
  - SPACE 1-1：客廳・第一眼
  - SPACE 1-2：廚房・責任的開始
  - SPACE 1-3：臥室・被默認

- **ROOM 2：財神廟・火還在燒** (ch2)
  - SPACE 2-1：廟前・初次接觸
  - SPACE 2-2：金爐・第一次嘗試
  - SPACE 2-3：後殿・動搖的開始

- **ROOM 3：核能電廠・訓練與程序** (ch3)
  - SPACE 3-1：訓練室・學習規則
  - SPACE 3-2：測驗室・適應規則
  - SPACE 3-3：控制室・認同制度

- **ROOM 4：電廠・災後與異物事件** (ch4)
  - SPACE 4-1：地震後・程序開始動搖
  - SPACE 4-2：異物事件・規則與時間衝突
  - SPACE 4-3：壓力點・自我說服

- **ROOM 5：反應爐核心・抉擇** (ch5)
  - SPACE 5-1：核心入口・承認兩套系統
  - SPACE 5-2：核心操作・做出選擇
  - SPACE 5-3：後果・承擔

### 核心功能

- **場景切換**：左右箭頭按鈕 + 場景選擇器
- **道具系統**：收集、查看、使用道具
- **事件系統**：基於條件的互動觸發
- **謎題系統**：支援 15+ 種謎題類型
- **音效系統**：環境音、廣播、恐怖音效
- **視覺效果**：場景閃爍、燈光效果
- **狀態管理**：localStorage 自動保存

## 安裝與運行

### 1. 安裝依賴

```bash
npm install
```

### 2. 準備圖片資源

在 `public/images/` 目錄下放置場景背景圖：

```
public/images/
├── bg_ch1_sc1_v1.png  # ROOM 1, SPACE 1
├── bg_ch1_sc2_v1.png  # ROOM 1, SPACE 2
├── bg_ch1_sc3_v1.png  # ROOM 1, SPACE 3
├── bg_ch2_sc1_v1.png  # ROOM 2, SPACE 1
├── ... (共15張)
└── bg_ch5_sc3_v1.png  # ROOM 5, SPACE 3
```

**圖片規範：**
- 尺寸：**540×540px**（固定比例）
- 格式：PNG
- 大小：≤ 250KB（超過需壓縮）

### 3. 開發模式

```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

### 4. 生產建置

```bash
npm run build
npm start
```

## 遊戲玩法

### 基本操作

1. **點擊場景中的物件**進行互動
2. **使用左右箭頭**切換同一 ROOM 的空間
3. **點擊場景選擇器**（左上角地圖圖示）查看所有可訪問場景
4. **收集道具**並在背包中查看
5. **閱讀對話**了解故事背景
6. **解決謎題**推進劇情

### 場景切換

- **左右箭頭**：快速切換同一 ROOM 的前後場景
- **場景選擇器**：查看並切換當前 ROOM 的所有場景
- **自動解鎖**：進入任一 ROOM 時，該 ROOM 的三個空間自動可訪問

### Debug 模式

在 URL 後加上 `?debug=1` 可顯示互動區域（hotspots）

例如：`http://localhost:3000/play/ch1/ch1_sc1?debug=1`

### 開發者模式

在 URL 後加上 `?dev=1` 可啟用開發者面板

例如：`http://localhost:3000/play/ch1/ch1_sc1?dev=1`

啟用後：
- 按 `Ctrl+D` (Windows) 或 `Cmd+D` (Mac) 開啟/關閉開發者面板
- 或點擊右上角的紫色按鈕（Code 圖示）

## 開發規範

### Hotspot（互動區域）

- **座標系統**：使用比例值 (0~1)，不使用 px
- **形狀**：優先使用矩形 (rect)，不規則才用多邊形 (poly)
- **最小尺寸**：手機至少等效 44×44px
- **禁止重疊**：預設不允許重疊（避免複雜規則）

### 背景圖命名

- **格式**：`bg_ch{章}_sc{場}_v{版}.png`
- **範例**：`bg_ch1_sc1_v1.png`（ROOM 1, SPACE 1, 版本1）
- **尺寸**：540×540px
- **大小**：≤ 250KB

### 道具圖命名

- **格式**：`item_{id}_v{版}.webp/png`
- **尺寸**：長邊 384px（特寫 512px）
- **大小**：≤ 80KB（特寫 ≤ 120KB）

### 一致性規則

- **背景改版**：只允許調色/光影/霧感，不允許移動可互動物件位置
- **移動物件**：必須同步更新 hotspots（當作新版本處理）

## 謎題類型

支援以下謎題類型：

- `input` - 文字輸入
- `arrangement` - 排列謎題
- `visual_selection` - 視覺選擇
- `combination_lock` - 密碼鎖
- `word_scramble` - 拼字遊戲
- `wire_connection` - 顏色線對接
- `jigsaw` - 拼圖
- `rotating_dial` - 旋轉轉盤
- `sequence_memory` - 序列記憶
- `sliding_puzzle` - 滑塊拼圖
- `symbol_matching` - 符號配對
- `maze_path` - 迷宮路徑
- `logic_switches` - 邏輯開關

## 音效系統

### 環境音 (Ambient)

- `ambient_hospital.mp3` - 醫院環境音
- `ambient_room702.mp3` - 702病房環境音
- `ambient_balcony.mp3` - 陽台環境音
- `ambient_terrace.mp3` - 露台環境音

### 廣播音效 (Broadcast)

- `broadcast_static.mp3` - 廣播靜電音

### 恐怖音效 (Horror)

- `horror_breathing.mp3` - 呼吸聲
- `horror_heartbeat.mp3` - 心跳聲
- `horror_wind.mp3` - 風聲

### 音效 (SFX)

- `sfx_door_unlock.mp3` - 門解鎖
- `sfx_metal.mp3` - 金屬聲
- 其他音效...

## 文件

- **[完整遊戲內容資料](docs/game_content_all_rooms.md)** - 所有5個ROOM、15個空間的完整內容
- **[開發指南](DEVELOPMENT.md)** - 詳細的開發說明

## 部署

### Vercel

1. 推送代碼到 GitHub
2. 在 Vercel 中導入專案
3. 自動部署完成

或使用 Vercel CLI：

```bash
npm i -g vercel
vercel
```

## 授權

本專案為個人作品，僅供學習與展示使用。

---

**門已經開了。你可以走進去。**
