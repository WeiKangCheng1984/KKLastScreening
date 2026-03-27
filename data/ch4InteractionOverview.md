# 第四章互動框與 NPC 文案概述

> 對應 `gameDataCh4.ts`。頭像點擊使用 `randomDialogs`（`type: casual` 約每 NPC 每場景 10 條 + `hint` 若干）。

## 場景與互動框類型

| 場景 | 進場旁白 | 熱點事件（一次性／檢視） |
|------|----------|---------------------------|
| `scene_ch4_stairwell` 樓梯間 | `initialDialog` 旁白 | `talk_liu_ch4_task`、`talk_liang_ch4_stair`、`talk_chen_ch4_stair`；`inspect_ch4_light_diff`、`inspect_ch4_stair_wear`、`inspect_ch4_stair_monitor` |
| `scene_ch4_control_panel` 放映控制區 | `initialDialog` 旁白 | `talk_chen_ch4_control`、`talk_liang_ch4_control`；`inspect_ch4_plugin_version`、`inspect_ch4_sync_record`、`inspect_ch4_risk_report`（風險單給道具） |
| `scene_ch4_main_hall` 散場大廳 | `initialDialog` 旁白 | `talk_liang_ch4_hall`、`talk_chen_ch4_hall`；`inspect_ch4_crowd_timing`、`inspect_ch4_panel_trace` |

## NPC 頭像隨機對話（方案 A）

- **觸發**：右側頭像條點 NPC → `triggerRandomNpcDialog` 自該場景該 NPC 的 `randomDialogs` 加權抽選。
- **結構**：每 NPC 每場景約 **10 條 `casual`**（輕鬆、吐槽、無厘頭，不推進主線資訊）+ **數條 `hint`**（辦案提示）；`casual` 的 `weight` 略高於 `hint`，較常抽到閒聊。

### 樓梯間 `scene_ch4_stairwell`

| NPC | casual 主軸 | hint 主軸 |
|-----|-------------|-----------|
| **劉隊** | 辦案吐槽、對「公關結案」的冷幽默、筆記本與時間軸執念 | 引導看現場、找陳佑誠／抽屜 |
| **梁以安** | 導演／剪接哏、片尾字幕、記者會穿帮、跟觀眾一起罵集團的情緒自嘲 | 節能藉口、鏡頭死角、維護被推道歉 |
| **陳佑誠** | 工程師自嘲、燈控箱、制服與記者會、版本號地獄、咖啡／加班哏 | 去控制區、三館插件、授權樹 |

### 放映控制區 `scene_ch4_control_panel`

| NPC | casual 主軸 | hint 主軸 |
|-----|-------------|-----------|
| **陳佑誠** | 抽屜最深層、遠端推送、維護帳號像共用衣櫃、patch 地獄 | 同版插件、遠端燈控、三份回報 |
| **梁以安** | 片尾與 KPI、節能兩字、導演在機房的格格不入 | 三館同洞、集團敘事 vs 現場 |

### 散場大廳 `scene_ch4_main_hall`

| NPC | casual 主軸 | hint 主軸 |
|-----|-------------|-----------|
| **梁以安** | 側門、彩排哏、廣播慢半拍的人生類比、深色運動鞋時尚吐槽 | 目擊離場、順序錯拍、鞋印 |
| **陳佑誠** | 手動切換按鈕、鞋印與心虛、共用帳號、側門逃脫路線冷笑話 | 技術清單、流程上游、多館帳號 |

## 敏感樹與一次性主線

- **不在此表展開全文**：`npcDialogs.npc_chen_youcheng`、`npcDialogs.npc_liang_yian`（敏感深問）；內容仍為嚴肅推理，與頭像 casual 池分開。

## 一次性對話／旁白事件 ID（`events`）

| 場景 | 事件 id | 類型 |
|------|---------|------|
| 樓梯間 | `talk_liu_ch4_task` / `talk_liang_ch4_stair` / `talk_chen_ch4_stair` | 角色一次性 |
| 樓梯間 | `inspect_ch4_light_diff` / `inspect_ch4_stair_wear` / `inspect_ch4_stair_monitor` | 旁白檢視 |
| 控制區 | `talk_chen_ch4_control` / `talk_liang_ch4_control` | 角色一次性 |
| 控制區 | `inspect_ch4_plugin_version` / `inspect_ch4_sync_record` / `inspect_ch4_risk_report` | 旁白／給道具 |
| 大廳 | `talk_liang_ch4_hall` / `talk_chen_ch4_hall` | 角色一次性 |
| 大廳 | `inspect_ch4_crowd_timing` / `inspect_ch4_panel_trace` | 旁白檢視 |

## 頭像隨機對話 id 命名（與 `Temp.md` 附錄對照）

- **劉隊（僅樓梯間）**：`ch4_liu_casual_1`～`ch4_liu_casual_10`；提示 `ch4_liu_hint_1`～`ch4_liu_hint_4`（舊 `ch4_liu_idle_*` 已併入 hint）。
- **梁以安**：樓梯 `ch4_liang_stair_casual_1`～`10` + `ch4_liang_stair_hint_1`～`4`；控制區 `ch4_liang_control_casual_1`～`10` + `hint_1`～`4`；大廳 `ch4_liang_hall_casual_1`～`10` + `hint_1`～`4`。
- **陳佑誠**：樓梯 `ch4_chen_stair_casual_1`～`10` + `ch4_chen_stair_hint_1`～`4`；控制區 `ch4_chen_control_casual_1`～`10` + `hint_1`～`4`；大廳 `ch4_chen_hall_casual_1`～`10` + `hint_1`～`4`。
