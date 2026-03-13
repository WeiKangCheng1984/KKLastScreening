import type { GameState } from '@/types/game';

export type NpcBehaviourType =
  | 'random_dialog'
  | 'sensitive_gate'
  | 'none';

export interface NpcBehaviourResult {
  type: NpcBehaviourType;
  payload?: any;
}

export interface NpcContext {
  state: GameState;
  npcId: string;
  sceneId: string;
  casualTalkCount: number;
}

export function getNpcClickBehaviour(chapterId: string, ctx: NpcContext): NpcBehaviourResult {
  const { npcId, state, sceneId, casualTalkCount } = ctx;
  const flags = state.flags || {};

  // 第一章四位 NPC：林瑞堂、阿順、小張、周姊
  if (chapterId === 'ch1') {
    if (npcId === 'npc_lin_ruitang') {
      const observed = !!flags.observed_any_ch1;
      const sensitiveDone = !!flags.npc_lin_sensitive_done;
      if (sensitiveDone) {
        return { type: 'random_dialog' };
      }
      if (observed && casualTalkCount >= 3) {
        return {
          type: 'sensitive_gate',
          payload: {
            npcId,
            text: '你覺得時機差不多了，可以試著往深一點問。',
            choices: [
              { id: 'lin_sensitive_ask', text: '我想問一些比較敏感的問題。' },
              { id: 'lin_sensitive_skip', text: '先不用，再聊聊就好。' },
            ],
          },
        };
      }
      return { type: 'random_dialog' };
    }

    if (npcId === 'npc_ashun') {
      const observed = !!flags.observed_any_ch1;
      const sensitiveDone = !!flags.npc_ashun_sensitive_done;
      if (sensitiveDone) {
        return { type: 'random_dialog' };
      }
      if (observed && casualTalkCount >= 3) {
        return {
          type: 'sensitive_gate',
          payload: {
            npcId,
            text: '你覺得時機差不多了，可以試著往深一點問。',
            choices: [
              { id: 'ashun_sensitive_ask', text: '我想問一些比較敏感的問題。' },
              { id: 'ashun_sensitive_skip', text: '先不用，再聊聊就好。' },
            ],
          },
        };
      }
      return { type: 'random_dialog' };
    }

    if (npcId === 'npc_xiaozhang') {
      const observed = !!flags.projection_room_observed && !!flags.projection_room_unlocked;
      const sensitiveDone = !!flags.npc_xiaozhang_sensitive_done;
      if (sensitiveDone) {
        return { type: 'random_dialog' };
      }
      if (observed && casualTalkCount >= 3) {
        return {
          type: 'sensitive_gate',
          payload: {
            npcId,
            text: '你覺得時機差不多了，可以試著往深一點問。',
            choices: [
              { id: 'xiaozhang_sensitive_ask', text: '我想問一些比較敏感的問題。' },
              { id: 'xiaozhang_sensitive_skip', text: '先不用，再聊聊就好。' },
            ],
          },
        };
      }
      return { type: 'random_dialog' };
    }

    if (npcId === 'npc_zhou_jie') {
      const observed = !!flags.observed_restroom_ch1;
      const sensitiveDone = !!flags.npc_zhou_jie_sensitive_done;
      if (sensitiveDone) {
        return { type: 'random_dialog' };
      }
      if (observed && casualTalkCount >= 3) {
        return {
          type: 'sensitive_gate',
          payload: {
            npcId,
            text: '你覺得時機差不多了，可以試著往深一點問。',
            choices: [
              { id: 'zhou_sensitive_ask', text: '我想問一些比較敏感的問題。' },
              { id: 'zhou_sensitive_skip', text: '先不用，再聊聊就好。' },
            ],
          },
        };
      }
      return { type: 'random_dialog' };
    }
  }

  // 第二章：阿蘇敏感對話入口（僅在 asu 電腦場景）
  if (chapterId === 'ch2' && npcId === 'npc_asu') {
    const sensitiveDone = !!flags.npc_asu_sensitive_done;
    if (sensitiveDone) {
      return { type: 'random_dialog' };
    }

    if (sceneId === 'scene_ch2_asu_desktop') {
      const coreDocFlags = [
        'ch2_pc_unknown_viewed',
        'ch2_pc_column_viewed',
        'ch2_pc_recording_viewed',
        'ch2_pc_location_viewed',
      ] as const;
      const coreDocsViewedCount = coreDocFlags.filter((f) => !!flags[f]).length;
      if (coreDocsViewedCount >= 3 && casualTalkCount >= 1) {
        return {
          type: 'sensitive_gate',
          payload: {
            npcId,
            text: '妳覺得氣氛已經沉到一個程度，可以試著往深一點問。',
            choices: [
              { id: 'asu_sensitive_ask', text: '我想問一些比較敏感的問題。' },
              { id: 'asu_sensitive_skip', text: '先看資料就好，暫時不問。' },
            ],
          },
        };
      }
    }

    return { type: 'random_dialog' };
  }

  // 第三章：顧乃謙敏感對話入口（僅在機房外走道）
  if (chapterId === 'ch3' && npcId === 'npc_gu_naiqian') {
    const sensitiveDone = !!flags.npc_gu_naiqian_sensitive_done;
    if (sensitiveDone) {
      return { type: 'random_dialog' };
    }

    if (sceneId === 'scene_ch3_server_corridor') {
      const coreDocFlags = [
        'ch3_cross_venue_viewed',
        'ch3_network_label_viewed',
        'ch3_remote_login_viewed',
      ] as const;
      const coreDocsViewedCount = coreDocFlags.filter((f) => !!flags[f]).length;
      if (coreDocsViewedCount >= 2 && casualTalkCount >= 1) {
        return {
          type: 'sensitive_gate',
          payload: {
            npcId,
            text: '顧乃謙的回答每次都點到邊緣就停下來。你覺得現在可以問一個他真的要好好回答的問題。',
            choices: [
              { id: 'gu_sensitive_ask', text: '我想問一個比較深的問題。' },
              { id: 'gu_sensitive_skip', text: '先看資料就好，暫時不問。' },
            ],
          },
        };
      }
    }

    return { type: 'random_dialog' };
  }

  // 第六章：林子睿最終對決（僅在記者會前廊）
  if (chapterId === 'ch6' && npcId === 'npc_lin_zirui') {
    const confrontationDone = !!flags.npc_lin_ch6_confrontation_done;
    if (confrontationDone) {
      return { type: 'random_dialog' };
    }

    if (sceneId === 'scene_ch6_press_corridor') {
      const coreDocFlags = [
        'ch6_press_draft_viewed',
        'ch6_zhang_brief_viewed',
      ] as const;
      const coreDocsViewedCount = coreDocFlags.filter((f) => !!flags[f]).length;
      if (coreDocsViewedCount >= 2 && casualTalkCount >= 1) {
        return {
          type: 'sensitive_gate',
          payload: {
            npcId,
            text: '你手上有發言稿、有修改版說帖、有五章積累下來的線索。林子睿在後台通道等著你。這是最後一次能問清楚的機會。',
            choices: [
              { id: 'lin_ch6_confront_ask', text: '我想問一個他無法用「管理落後」帶過的問題。' },
              { id: 'lin_ch6_confront_skip', text: '先不急，再觀察一下。' },
            ],
          },
        };
      }
    }

    return { type: 'random_dialog' };
  }

  // 第五章：高文傑敏感對話入口（僅在林子睿辦公室外圍）
  if (chapterId === 'ch5' && npcId === 'npc_gao_wenjie') {
    const sensitiveDone = !!flags.npc_gao_sensitive_done;
    if (sensitiveDone) {
      return { type: 'random_dialog' };
    }

    if (sceneId === 'scene_ch5_lin_office') {
      const coreDocFlags = [
        'ch5_lin_call_viewed',
        'ch5_unknown_msg_viewed',
      ] as const;
      const coreDocsViewedCount = coreDocFlags.filter((f) => !!flags[f]).length;
      if (coreDocsViewedCount >= 2 && casualTalkCount >= 1) {
        return {
          type: 'sensitive_gate',
          payload: {
            npcId,
            text: '高文傑說的每句話都精準到像排練過。你覺得現在可以問一個他真的得認真回答的問題。',
            choices: [
              { id: 'gao_sensitive_ask', text: '我想問一個比較直接的問題。' },
              { id: 'gao_sensitive_skip', text: '先不急，繼續觀察。' },
            ],
          },
        };
      }
    }

    return { type: 'random_dialog' };
  }

  // 第四章：陳佑誠敏感對話入口（僅在放映控制區）
  if (chapterId === 'ch4' && npcId === 'npc_chen_youcheng') {
    const sensitiveDone = !!flags.npc_chen_sensitive_done;
    if (sensitiveDone) {
      return { type: 'random_dialog' };
    }

    if (sceneId === 'scene_ch4_control_panel') {
      const coreDocFlags = [
        'ch4_control_plugin_viewed',
        'ch4_control_sync_viewed',
        'ch4_control_risk_viewed',
      ] as const;
      const coreDocsViewedCount = coreDocFlags.filter((f) => !!flags[f]).length;
      if (coreDocsViewedCount >= 2 && casualTalkCount >= 1) {
        return {
          type: 'sensitive_gate',
          payload: {
            npcId,
            text: '陳佑誠說完那句「消失得更對」之後沉默了一會。你覺得現在可以問一個他真的得好好回答的問題。',
            choices: [
              { id: 'chen_sensitive_ask', text: '我想問更深一點的問題。' },
              { id: 'chen_sensitive_skip', text: '先看資料就好，暫時不問。' },
            ],
          },
        };
      }
    }

    return { type: 'random_dialog' };
  }

  return { type: 'none' };
}

