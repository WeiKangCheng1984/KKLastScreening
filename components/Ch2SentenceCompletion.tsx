'use client';

import { useMemo, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { DialogChoice, Effect, GameState, NpcDialogNode } from '@/types/game';
import { buildFilledSentence, evaluateSelection, type FillBlankConfig } from '@/components/FloatingFillBlankCore';

type QKey = 'q1' | 'q2' | 'q3' | 'q4' | 'q5';

export interface Ch2SentenceCompletionProps {
  engine: {
    getState: () => GameState;
    handleDialogChoice: (choice: DialogChoice) => void;
  };
  ch2QuestionConfigs: Record<string, FillBlankConfig>;
  ch2NpcDialogs: Record<string, Record<string, NpcDialogNode>>;
  currentIndex: number;
  onIndexChange: (nextIndex: number) => void;
  selectedChoiceId: string | null;
  onSelectedChoiceChange: (choiceId: string | null) => void;
  onComplete: () => void;
  onClose: () => void;
}

export default function Ch2SentenceCompletion({
  engine,
  ch2QuestionConfigs,
  ch2NpcDialogs,
  currentIndex,
  onIndexChange,
  selectedChoiceId,
  onSelectedChoiceChange,
  onComplete,
  onClose,
}: Ch2SentenceCompletionProps) {
  const QUESTIONS = useMemo(() => {
    const getChoices = (groupKey: string, nodeKey: string) =>
      ch2NpcDialogs?.[groupKey]?.[nodeKey]?.choices ?? [];
    return [
      {
        key: 'q1' as QKey,
        title: '草稿那句（記事本）',
        choices: getChoices('npc_asu_q1', 'node_asu_q1_start'),
        doneFlag: 'ch2_q1_done' as keyof GameState['flags'],
        answerFlag: 'ch2_q1_answer' as keyof GameState['flags'],
      },
      {
        key: 'q2' as QKey,
        title: '那句「她也在場」（Unknown）',
        choices: getChoices('npc_asu_q2', 'node_asu_q2_start'),
        doneFlag: 'ch2_q2_done' as keyof GameState['flags'],
        answerFlag: 'ch2_q2_answer' as keyof GameState['flags'],
      },
      {
        key: 'q3' as QKey,
        title: '三個節點那句（代號聯絡人）',
        choices: getChoices('npc_asu_q3', 'node_asu_q3_start'),
        doneFlag: 'ch2_q3_done' as keyof GameState['flags'],
        answerFlag: 'ch2_q3_answer' as keyof GameState['flags'],
      },
      {
        key: 'q4' as QKey,
        title: '他在等什麼（定位）',
        choices: getChoices('npc_asu_q4', 'node_asu_q4_start'),
        doneFlag: 'ch2_q4_done' as keyof GameState['flags'],
        answerFlag: 'ch2_q4_answer' as keyof GameState['flags'],
      },
      {
        key: 'q5' as QKey,
        title: '他們會怎麼收尾（錄音）',
        choices: getChoices('npc_asu_q5', 'node_asu_q5_start'),
        doneFlag: 'ch2_q5_done' as keyof GameState['flags'],
        answerFlag: 'ch2_q5_answer' as keyof GameState['flags'],
      },
    ] as Array<{
      key: QKey;
      title: string;
      choices: Array<{ id: string; label: string; effects?: Effect[]; insightEffects?: DialogChoice['insightEffects'] }>;
      doneFlag: keyof GameState['flags'];
      answerFlag: keyof GameState['flags'];
    }>;
  }, [ch2NpcDialogs]);

  const [flagsSnapshot, setFlagsSnapshot] = useState<GameState['flags']>(() => engine.getState().flags ?? {});
  const [currentCorrect, setCurrentCorrect] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const progress = useMemo(() => {
    const doneCount = QUESTIONS.filter((q) => Boolean(flagsSnapshot?.[q.doneFlag as string])).length;
    return { doneCount, total: QUESTIONS.length };
  }, [flagsSnapshot, QUESTIONS]);

  const current = QUESTIONS[Math.min(currentIndex, QUESTIONS.length - 1)];
  const currentConfig = ch2QuestionConfigs[current.key];
  const canFinish = progress.doneCount === progress.total;

  useEffect(() => {
    setCurrentCorrect(false);
    setFeedback(null);
  }, [currentIndex]);

  const handleConfirm = () => {
    if (!selectedChoiceId || !currentConfig) return;

    const evalResult = evaluateSelection(currentConfig, selectedChoiceId);
    if (!evalResult.hasSelection) return;

    if (!evalResult.isCorrect) {
      setCurrentCorrect(false);
      setFeedback(evalResult.feedback);
      return;
    }

    const choice = current.choices.find((c) => c.id === selectedChoiceId);
    if (choice) {
      engine.handleDialogChoice({
        id: choice.id,
        text: choice.label,
        effects: choice.effects,
        insightEffects: choice.insightEffects,
      });
      const nextState = engine.getState();
      setFlagsSnapshot(nextState.flags ?? {});
    }

    setCurrentCorrect(true);
    const reply =
      evalResult.feedback ??
      '阿蘇看著你選的那一行，像是把某個答案收進抽屜。';
    setFeedback(reply);

    const nextIndex = currentIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      onIndexChange(nextIndex);
      onSelectedChoiceChange(null);
    }
  };

  if (!currentConfig) return null;

  return (
    <div className="report-card p-6 md:p-7 flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-orange-500/30">
        <div className="min-w-0">
          <h2 className="report-title">
            把話補齊
          </h2>
          <p className="report-subtitle">
            劉隊把這幾句話攤開，要你把空格補齊，說出你看到的版本。
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
          <div className="text-sm text-gray-200 font-medium">{current.title}</div>
        </div>

        <div className="p-4 rounded-xl bg-dark-surface/40 border border-orange-500/25 text-gray-100 text-sm whitespace-pre-line mb-4">
          {buildFilledSentence(currentConfig, selectedChoiceId, '______')}
        </div>

        {/* 題目框內同步顯示七個選項，確保即使看不到場景上的卡片也能操作 */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {currentConfig.options.map((opt) => {
            const isSelected = selectedChoiceId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectedChoiceChange(opt.id)}
                className={`text-left px-3 py-2 rounded-lg border text-xs md:text-sm transition-all ${
                  isSelected
                    ? 'bg-orange-500/20 border-orange-400 text-orange-50'
                    : 'bg-dark-surface/40 border-orange-500/25 text-gray-200 hover:bg-orange-500/10 hover:border-orange-400/50 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className="mt-4 p-3 rounded-xl bg-orange-950/30 border border-orange-500/30 text-orange-50/90 text-xs whitespace-pre-line">
            {feedback}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedChoiceId}
          className="btn-report-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          就用這個說法
        </button>

        <button
          type="button"
          disabled={!canFinish}
          onClick={() => {
            onComplete();
          }}
          className="btn-report-primary disabled:opacity-30 disabled:cursor-not-allowed"
          title={canFinish ? '把話說清楚' : '請先把空格補齊'}
        >
          好，這樣就夠了
        </button>
      </div>
    </div>
  );
}
