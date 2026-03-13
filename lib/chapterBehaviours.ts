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

  return { type: 'none' };
}

