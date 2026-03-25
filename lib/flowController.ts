export type ChapterId = 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'ch6';

export interface ChapterMilestones {
  ch1: {
    coreSensitivesDone: boolean;
    canEnterReport: boolean;
    reasoningDone: boolean;
  };
  ch2: {
    qaAllDone: boolean;
    canLeaveWithAsu: boolean;
    reasoningDone: boolean;
  };
}

import type { GameState } from '@/types/game';

export type ChapterAction =
  | 'show_liu_report_entry'
  | 'open_report_editor'
  | 'show_asu_discuss_case_entry'
  | 'start_ch2_qa';

function getFlags(state: GameState): Record<string, any> {
  return state.flags || {};
}

export function getMilestones(state: GameState): ChapterMilestones {
  const flags = getFlags(state);

  const ch1SensitiveFlags = [
    'npc_lin_sensitive_done',
    'npc_ashun_sensitive_done',
    'npc_xiaozhang_sensitive_done',
    'npc_zhou_jie_sensitive_done',
  ];
  const ch1SensitiveCount = ch1SensitiveFlags.filter((key) => !!flags[key]).length;
  const ch1CoreSensitivesDone = ch1SensitiveCount >= 3;

  const ch1CanEnterReport = ch1CoreSensitivesDone && !!flags.ch1_liu_mid_shown;
  const ch1ReasoningDone = !!flags.ch1_reasoning_done;

  /**
   * ch2 章尾：兩題雙格填空 + 手機省電謎。
   * 新規則：ch2_q1_done && ch2_q2_done && ch2_phone_riddle_done
   * 舊存檔相容：曾以「五題全滿」通關者，仍視為 QA 段落已完成。
   */
  const ch2NewQaDone =
    !!flags.ch2_q1_done && !!flags.ch2_q2_done && !!flags.ch2_phone_riddle_done;
  const ch2LegacyFiveDone = ['ch2_q3_done', 'ch2_q4_done', 'ch2_q5_done'].every((k) => !!flags[k]);
  const ch2LegacyAllFiveFill =
    !!flags.ch2_q1_done &&
    !!flags.ch2_q2_done &&
    ch2LegacyFiveDone;
  const ch2QaAllDone = ch2NewQaDone || ch2LegacyAllFiveFill;

  const ch2CanLeaveWithAsu = ch2QaAllDone && !!flags.ch2_qa_reviewed_with_liu;
  const ch2ReasoningDone = !!flags.ch2_reasoning_done;

  return {
    ch1: {
      coreSensitivesDone: ch1CoreSensitivesDone,
      canEnterReport: ch1CanEnterReport,
      reasoningDone: ch1ReasoningDone,
    },
    ch2: {
      qaAllDone: ch2QaAllDone,
      canLeaveWithAsu: ch2CanLeaveWithAsu,
      reasoningDone: ch2ReasoningDone,
    },
  };
}

export function shouldAllowAction(
  state: GameState,
  chapterId: ChapterId,
  action: ChapterAction,
): boolean {
  const milestones = getMilestones(state);

  switch (action) {
    case 'show_liu_report_entry':
    case 'open_report_editor':
      if (chapterId !== 'ch1') return false;
      // 已經結算過 ch1 的話，不再顯示報告入口
      if (milestones.ch1.reasoningDone) return false;
      if (!!getFlags(state).dev_unlock_liu_report) return true;
      return milestones.ch1.canEnterReport;

    case 'show_asu_discuss_case_entry':
      if (chapterId !== 'ch2') return false;
      // 只有阿蘇敏感對話完成後，才顯示「談案情」入口；完成整章後就不再出現
      if (milestones.ch2.reasoningDone) return false;
      if (!!getFlags(state).dev_unlock_liu_report) return true;
      return !!getFlags(state).npc_asu_sensitive_done;

    case 'start_ch2_qa':
      if (chapterId !== 'ch2') return false;
      // 只要還沒標記 ch2_reasoning_done，就允許重新進入 QA（可重試設計）
      return !milestones.ch2.reasoningDone;

    default:
      return false;
  }
}

/**
 * 流程控制器：依 flowConfig 提供「下一步」路徑，供各頁面 router.push 使用。
 * 實際步驟與路徑對應定義於 data/flowConfig.ts。
 */
import {
  getNextPath as getNextPathFromConfig,
  getChapterIntroContinuePath as getChapterIntroContinuePathFromConfig,
} from '@/data/flowConfig';

/**
 * 依當前步驟 id 回傳應導向的 Next.js 路徑。
 * @param stepId 當前步驟 id（如 'prologue_text', 'ch1_intro'）
 */
export function getNextPath(stepId: string, sceneId?: string): string {
  return getNextPathFromConfig(stepId, sceneId);
}

/**
 * 從章節 id 取得該章節 intro 頁「繼續」按鈕應導向的路徑。
 */
export function getChapterIntroContinuePath(chapterId: string): string {
  return getChapterIntroContinuePathFromConfig(chapterId);
}

/**
 * 未來可擴充：依 GameState 決定分支（例如依 flag 回傳不同 nextPath）。
 */
export function getNextPathFromState(stepId: string, _state?: GameState): string {
  return getNextPathFromConfig(stepId);
}
