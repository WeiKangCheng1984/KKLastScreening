# 遊戲圖片清單（WebP 設定）

程式已改為使用 **WebP**。請將既有 PNG 轉成 WebP 後，依下列路徑放置（或保留檔名改副檔名為 `.webp`）。

---

## 一、開頭畫面（首頁 `/`）

| 檔案名稱 | 程式路徑 | 實際放置位置 | 說明 |
|----------|----------|--------------|------|
| `main_bg_placeholder.webp` | `/images/main_bg_placeholder.webp` | `public/images/main_bg_placeholder.webp` | 主選單底圖。建議 1080×1920（9:16），≤250KB |

**引用位置**：`app/page.tsx`、`data/flowConfig.ts`（main_menu 的 background）

---

## 二、序章（`/play/prologue`）

| 檔案名稱 | 程式路徑 | 實際放置位置 | 說明 |
|----------|----------|--------------|------|
| `prologue_bg.webp` | `/images/prologue_bg.webp` | `public/images/prologue_bg.webp` | 序章背景圖。建議 828×1284 或 1080×1920（直式），可選 |

**引用位置**：`app/play/prologue/page.tsx`

序章文案為純文字（`data/chapters.ts` 的 `prologueSlides`），無其他圖片。

---

## 三、第一章（城市影城）

### 3.1 第一章導讀（`/play/ch1/intro`）

| 檔案名稱 | 程式路徑 | 實際放置位置 | 說明 |
|----------|----------|--------------|------|
| （可選）`intro_ch1_bg.webp` | `/images/intro_ch1_bg.webp` | `public/images/intro_ch1_bg.webp` | 導讀背景圖；目前程式內為註解，若要使用需在 `chapters.ts` 的 ch1.intro 取消註解並設 `backgroundImage` |
| `intro_ch1_animation_v1.mp4` | `/videos/intro_ch1_animation_v1.mp4` | `public/videos/intro_ch1_animation_v1.mp4` | 導讀影片（影片非圖片，保留 MP4） |

**引用位置**：`data/chapters.ts`（ch1.intro）、場景背景為 `data/gameDataCh1.ts` 的 scenes

### 3.2 第一章場景背景（三個場景）

| 檔案名稱 | 程式路徑 | 實際放置位置 | 說明 |
|----------|----------|--------------|------|
| `bg_ch1_cinema_a_hall_v1.webp` | `/images/bg_ch1_cinema_a_hall_v1.webp` | `public/images/bg_ch1_cinema_a_hall_v1.webp` | 場景：城市影城 放映廳 |
| `bg_ch1_projection_room_v1.webp` | `/images/bg_ch1_projection_room_v1.webp` | `public/images/bg_ch1_projection_room_v1.webp` | 場景：放映室 |
| `bg_ch1_restroom_v1.webp` | `/images/bg_ch1_restroom_v1.webp` | `public/images/bg_ch1_restroom_v1.webp` | 場景：洗手間 |

**引用位置**：`data/gameDataCh1.ts`（scenes 的 `background`）

### 3.3 第一章道具圖（目前為 SVG）

第一章道具在程式裡使用 **SVG**（`svgImage`），未使用 PNG/WebP 點陣圖：

- `item_ticket_stub` → `/svg/items/ticket_stub.svg`
- `item_schedule_modified` → `/svg/items/schedule_modified.svg`
- `item_projector_notes` → `/svg/items/projector_notes.svg`
- `item_black_plastic_fragment`、`item_cleaning_note` 等 → 各自對應 `/svg/items/*.svg`

若之後要改成 WebP 道具圖，需在 `data/gameDataCh1.ts`（或該章 gameDataChX）的 items 改用 `image: '/images/item_xxx_v1.webp'` 並放置於 `public/images/`。

---

## 四、其他（全遊戲共用）

| 檔案名稱 | 程式路徑 | 實際放置位置 | 說明 |
|----------|----------|--------------|------|
| `ending_image.webp` | `/images/ending_image.webp` | `public/images/ending_image.webp` | 結局畫面圖片（遊戲後段顯示） |

**引用位置**：`app/play/[chapterId]/[sceneId]/page.tsx`

---

## 五、角色頭像（WebP，已有規範）

路徑：`public/images/characters/`  
檔名：`{角色ID}_{1|2|3}.webp`（例：`npc_lin_ruitang_1.webp`）。  
第一章可能用到的角色依 `characterConversations` / NPC 設定而定。

---

## 總結：開頭／序章／第一章「會用到的圖片」一覽

- **開頭畫面**：`main_bg_placeholder.webp` → `public/images/`
- **序章**：`prologue_bg.webp` → `public/images/`
- **第一章**：  
  - 導讀可選背景：`intro_ch1_bg.webp` → `public/images/`（目前未啟用）  
  - 場景背景：`bg_ch1_cinema_a_hall_v1.webp`、`bg_ch1_projection_room_v1.webp`、`bg_ch1_restroom_v1.webp` → `public/images/`  
  - 第一章道具目前為 SVG，位於 `public/svg/items/`

請將上述 PNG 檔轉成 WebP 後放到對應的 `public/` 路徑，或直接將現有檔名改為 `.webp` 並轉檔。
