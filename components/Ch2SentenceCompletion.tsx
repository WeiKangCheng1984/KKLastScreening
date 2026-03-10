'use client';

import { useMemo, useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import OverlayCard from '@/components/OverlayCard';
import { npcDialogs as ch2NpcDialogs } from '@/data/gameDataCh2';
import type { DialogChoice, Effect, GameState } from '@/types/game';

type QKey = 'q1' | 'q2' | 'q3' | 'q4' | 'q5';

const QUESTIONS: Array<{
  key: QKey;
  title: string;
  nodeText: string;
  choices: Array<{ id: string; label: string; effects?: Effect[]; insightEffects?: DialogChoice['insightEffects'] }>;
  doneFlag: keyof GameState['flags'];
  answerFlag: keyof GameState['flags'];
}> = [
  {
    key: 'q1',
    title: '草稿那句（記事本）',
    nodeText: ch2NpcDialogs.npc_asu_q1.node_asu_q1_start.text,
    choices: ch2NpcDialogs.npc_asu_q1.node_asu_q1_start.choices,
    doneFlag: 'ch2_q1_done',
    answerFlag: 'ch2_q1_answer',
  },
  {
    key: 'q2',
    title: '那句「她也在場」（Unknown）',
    nodeText: ch2NpcDialogs.npc_asu_q2.node_asu_q2_start.text,
    choices: ch2NpcDialogs.npc_asu_q2.node_asu_q2_start.choices,
    doneFlag: 'ch2_q2_done',
    answerFlag: 'ch2_q2_answer',
  },
  {
    key: 'q3',
    title: '三個節點那句（代號聯絡人）',
    nodeText: ch2NpcDialogs.npc_asu_q3.node_asu_q3_start.text,
    choices: ch2NpcDialogs.npc_asu_q3.node_asu_q3_start.choices,
    doneFlag: 'ch2_q3_done',
    answerFlag: 'ch2_q3_answer',
  },
  {
    key: 'q4',
    title: '他在等什麼（定位）',
    nodeText: ch2NpcDialogs.npc_asu_q4.node_asu_q4_start.text,
    choices: ch2NpcDialogs.npc_asu_q4.node_asu_q4_start.choices,
    doneFlag: 'ch2_q4_done',
    answerFlag: 'ch2_q4_answer',
  },
  {
    key: 'q5',
    title: '他們會怎麼收尾（錄音）',
    nodeText: ch2NpcDialogs.npc_asu_q5.node_asu_q5_start.text,
    choices: ch2NpcDialogs.npc_asu_q5.node_asu_q5_start.choices,
    doneFlag: 'ch2_q5_done',
    answerFlag: 'ch2_q5_answer',
  },
];

export interface Ch2SentenceCompletionProps {
  engine: {
    getState: () => GameState;
    handleDialogChoice: (choice: DialogChoice) => void;
  };
  onComplete: () => void;
  onClose: () => void;
}

export default function Ch2SentenceCompletion({ engine, onComplete, onClose }: Ch2SentenceCompletionProps) {
  const [idx, setIdx] = useState(0);
  const state = engine.getState();
  const flags = state.flags ?? {};

  const progress = useMemo(() => {
    const doneCount = QUESTIONS.filter((q) => Boolean(flags[q.doneFlag as string])).length;
    return { doneCount, total: QUESTIONS.length };
  }, [flags]);

  const current = QUESTIONS[Math.min(idx, QUESTIONS.length - 1)];
  const selectedAnswer = flags[current.answerFlag as string] as string | undefined;

  const canFinish = progress.doneCount === progress.total;

  const handlePick = (c: (typeof current.choices)[number]) => {
    engine.handleDialogChoice({
      id: c.id,
      text: c.label,
      effects: c.effects,
      insightEffects: c.insightEffects,
    });
  };

  const handleNext = () => setIdx((i) => Math.min(i + 1, QUESTIONS.length - 1));
  const handlePrev = () => setIdx((i) => Math.max(i - 1, 0));

  return (
    <OverlayCard
      tone="system"
      size="lg"
      className="w-full max-w-4xl max-h-[90vh] min-h-[70vh] p-6 md:p-8 flex flex-col"
    >
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-amber-500/30">
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
            把話補齊
          </h2>
          <p className="text-xs text-amber-100/70 mt-1">
            阿蘇把句子放大，你只要把空格填回去。
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded"
          aria-label="關閉"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm text-amber-100/90 font-medium">{current.title}</div>
          {selectedAnswer ? (
            <div className="text-xs text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded">
              已選：{selectedAnswer}
            </div>
          ) : (
            <div className="text-xs text-amber-200/70 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
              還沒選
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-black/30 border border-amber-500/20 text-amber-50/90 text-sm whitespace-pre-line mb-4">
          {current.nodeText}
        </div>

        <div className="space-y-2">
          {current.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handlePick(c)}
              className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all bg-dark-surface border-amber-500/30 text-amber-50/90 hover:border-amber-300 hover:bg-amber-500/10"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={idx === 0}
            className="px-3 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg disabled:opacity-30 disabled:pointer-events-none"
          >
            上一題
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={idx >= QUESTIONS.length - 1}
            className="px-3 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
          >
            下一題
            <ChevronRight size={16} />
          </button>
        </div>

        <button
          type="button"
          disabled={!canFinish}
          onClick={() => {
            onComplete();
          }}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium"
          title={canFinish ? '把話說清楚' : '請先把空格補齊'}
        >
          好，這樣就夠了
        </button>
      </div>
    </OverlayCard>
  );
}

