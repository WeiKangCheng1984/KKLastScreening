import type { GameState } from '@/types/game';
import { sensitiveGatesByChapter } from '@/data/chapterBehaviourConfigs';

export type NpcBehaviourType = 'random_dialog' | 'sensitive_gate';

export interface NpcBehaviourResult {
  type: NpcBehaviourType;
  payload?: { npcId: string; text: string; choices: { id: string; text: string }[] };
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
  const configs = sensitiveGatesByChapter[chapterId];
  if (!configs) return { type: 'random_dialog' };

  const cfg = configs.find((c) => c.npcId === npcId);
  if (!cfg) return { type: 'random_dialog' };

  if (flags[cfg.doneFlag]) {
    return { type: 'random_dialog' };
  }

  if (cfg.allowedScenes && cfg.allowedScenes.length > 0 && !cfg.allowedScenes.includes(sceneId)) {
    return { type: 'random_dialog' };
  }

  const minObs = cfg.minObservedCount ?? 1;
  const observedCount = cfg.observedFlags.filter((f) => !!flags[f]).length;
  if (observedCount >= minObs && casualTalkCount >= cfg.casualTalkThreshold) {
    return {
      type: 'sensitive_gate',
      payload: {
        npcId,
        text: cfg.gateText,
        choices: [cfg.choices.ask, cfg.choices.skip],
      },
    };
  }

  return { type: 'random_dialog' };
}
