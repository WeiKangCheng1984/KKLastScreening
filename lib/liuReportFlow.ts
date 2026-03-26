import type { Dialog } from '@/types/game';
import type { GameEngine } from '@/lib/gameEngine';
import { shouldAllowAction } from '@/lib/flowController';
import { liuReportFlowByChapter } from '@/data/chapterBehaviourConfigs';

export type LiuNpcClickResult =
  | { kind: 'dialog'; dialog: Dialog }
  | { kind: 'random_liu' }
  | { kind: 'noop' };

const LIU_BASE_DIALOG: Pick<Dialog, 'type' | 'characterId' | 'characterName' | 'characterExpression' | 'characterPosition'> = {
  type: 'character',
  characterId: 'npc_liu',
  characterName: '劉隊',
  characterExpression: 1,
  characterPosition: 'right',
};

/**
 * 點擊劉隊頭像時：依章節／旗標決定要顯示的對話，或改走隨機閒聊。
 * play 頁僅負責套用結果（setCurrentDialog / triggerRandomNpcDialog）。
 */
export function resolveLiuNpcClick(params: {
  chapterId: string;
  sceneId: string;
  engine: GameEngine;
}): LiuNpcClickResult {
  const { chapterId, engine } = params;
  const st = engine.getState();
  const flags = st.flags || {};
  const devLiu = !!flags.dev_unlock_liu_report;

  const cfg = liuReportFlowByChapter[chapterId];
  if (!cfg) return { kind: 'random_liu' };

  // ch1 特殊：依 flowController 的 shouldAllowAction 判斷報告入口
  if (chapterId === 'ch1') {
    const canReport = shouldAllowAction(st, 'ch1', 'show_liu_report_entry');
    const stepIdx = canReport ? 1 : 0;
    const step = cfg.steps[Math.min(stepIdx, cfg.steps.length - 1)];
    return {
      kind: 'dialog',
      dialog: {
        ...LIU_BASE_DIALOG,
        text: step.text,
        choices: step.choices?.map((c) => ({ id: c.id, text: c.text })),
      },
    };
  }

  // ch2：兩段報告（第一輪填空 → 阿蘇電腦／背包手機謎 → 第二輪結案）
  if (chapterId === 'ch2') {
    const asuBlock = cfg.steps.find((s) => s.blockIfMissing?.includes('npc_asu_sensitive_done'));
    if (!flags.npc_asu_sensitive_done && !devLiu && asuBlock) {
      return {
        kind: 'dialog',
        dialog: { ...LIU_BASE_DIALOG, text: asuBlock.text },
      };
    }
    if (flags.ch2_reasoning_done) {
      return { kind: 'random_liu' };
    }
    if (!flags.ch2_report_fill_done) {
      const reportStep = cfg.steps.find((s) => !s.blockIfMissing?.length);
      const choices =
        reportStep?.choices?.map((c) => ({ id: c.id, text: c.text })) ?? [
          { id: 'ch2_liu_keep_exploring', text: '我再多看一下現場。' },
          { id: 'ch2_liu_open_qa_conclusion', text: '我試著把版本說清楚。' },
        ];
      return {
        kind: 'dialog',
        dialog: {
          ...LIU_BASE_DIALOG,
          text: reportStep?.text ?? cfg.steps[cfg.steps.length - 1]?.text ?? '',
          choices,
        },
      };
    }
    if (!flags.ch2_phone_riddle_done) {
      return {
        kind: 'dialog',
        dialog: {
          ...LIU_BASE_DIALOG,
          text:
            '劉隊：「你剛那版先擱著。」\n\n' +
            '「阿蘇手邊還扣著一支機子——她點頭前，我不會催她交。」\n' +
            '「你去把該讀的讀完，再回來跟我把話收乾淨。」',
        },
      };
    }
    return {
      kind: 'dialog',
      dialog: {
        ...LIU_BASE_DIALOG,
        text:
          '劉隊：「手機裡壓著的那層，你看見了？」\n\n' +
          '「行。抬頭別空著；對得上，我就敢往上遞。」',
        choices: [
          { id: 'ch2_liu_keep_exploring', text: '我再對一次。' },
          { id: 'ch2_liu_report_finalize', text: '就這版，往上送。' },
        ],
      },
    };
  }

  // noop guard: 若前置旗標不滿足且非 dev 模式
  if (cfg.noopUnlessFlags && cfg.noopUnlessFlags.length > 0) {
    const hasAny = cfg.noopUnlessFlags.some((f) => !!flags[f]);
    if (!hasAny && !devLiu) return { kind: 'noop' };
  }

  // 已完成：走 random_liu
  if (cfg.doneFlags.some((f) => !!flags[f])) {
    return { kind: 'random_liu' };
  }

  // 依序掃 steps：第一個 blockIfMissing 不滿足的就回傳該步驟（擋人對話）
  for (const step of cfg.steps) {
    if (step.blockIfMissing && step.blockIfMissing.length > 0 && !devLiu) {
      // ch6 的 PR 選擇：任一旗標成立即算通過
      const anyMet = step.blockIfMissing.some((f) => !!flags[f]);
      if (!anyMet) {
        return {
          kind: 'dialog',
          dialog: { ...LIU_BASE_DIALOG, text: step.text },
        };
      }
      continue;
    }
    // 無 block 條件 = 最終可報告步驟
    return {
      kind: 'dialog',
      dialog: {
        ...LIU_BASE_DIALOG,
        text: step.text,
        choices: step.choices?.map((c) => ({ id: c.id, text: c.text })),
      },
    };
  }

  return { kind: 'random_liu' };
}
