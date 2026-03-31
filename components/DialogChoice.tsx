'use client';

import { DialogChoice as DialogChoiceType } from '@/types/game';
import { m } from 'framer-motion';
import { Check } from 'lucide-react';

interface DialogChoiceProps {
  choices: DialogChoiceType[];
  onSelect: (choice: DialogChoiceType) => void;
  className?: string;
}

const COMPACT_CHOICE_IDS = new Set(['choice_done']);
const LIU_REPORT_CHOICE_RE = /liu_(keep_exploring|report_now|report_finalize|try_reasoning)$/;

type ChoiceSizeVariant = 'default' | 'compact' | 'liu';

function getChoiceSizeVariant(id: string): ChoiceSizeVariant {
  if (COMPACT_CHOICE_IDS.has(id)) return 'compact';
  if (LIU_REPORT_CHOICE_RE.test(id)) return 'liu';
  return 'default';
}

function ChoiceButton({
  choice,
  variant,
  index,
  onSelect,
}: {
  choice: DialogChoiceType;
  variant: ChoiceSizeVariant;
  index: number;
  onSelect: (c: DialogChoiceType) => void;
}) {
  const isCompact = variant === 'compact';
  const isLiu = variant === 'liu';

  const btnClass = isCompact
    ? 'mx-auto block w-[60%] max-w-[min(60vw,14rem)] text-left px-2.5 py-[0.45rem] bg-dark-surface/80 hover:bg-dark-surface border-2 border-dark-border hover:border-orange-500/50 rounded-md transition-all duration-200 group relative overflow-hidden'
    : isLiu
      ? 'flex-1 min-w-0 text-center px-2 py-2 bg-dark-surface/80 hover:bg-dark-surface border border-dark-border hover:border-orange-500/50 rounded-md transition-all duration-200 group relative overflow-hidden'
      : 'w-full text-left px-4 py-3 bg-dark-surface/80 hover:bg-dark-surface border-2 border-dark-border hover:border-orange-500/50 rounded-lg transition-all duration-200 group relative overflow-hidden';

  const textClass = isCompact
    ? 'dialog-hotspot-choice text-[0.865rem] md:text-sm text-gray-200 group-hover:text-white transition-colors'
    : isLiu
      ? 'dialog-hotspot-choice text-[0.748rem] md:text-[0.865rem] text-gray-300 group-hover:text-white transition-colors'
      : 'dialog-hotspot-choice text-gray-200 group-hover:text-white transition-colors';

  const checkSize = isCompact ? 11 : isLiu ? 0 : 18;

  return (
    <m.button
      key={choice.id}
      initial={{ opacity: 0, x: isLiu ? 0 : -20, y: isLiu ? 6 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.25 }}
      onClick={() => onSelect(choice)}
      className={btnClass}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className={`relative flex items-center ${isLiu ? 'justify-center' : 'justify-between'} gap-1`}>
        <span className={textClass}>{choice.text}</span>
        {checkSize > 0 && (
          <Check size={checkSize} className="shrink-0 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      <m.div
        className="absolute inset-0 bg-orange-500/20 rounded-lg"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </m.button>
  );
}

export default function DialogChoice({ choices, onSelect, className = '' }: DialogChoiceProps) {
  const variants = choices.map((c) => getChoiceSizeVariant(c.id));
  const allLiu = variants.length >= 2 && variants.every((v) => v === 'liu');

  if (allLiu) {
    return (
      <div className={`flex items-stretch gap-2 ${className}`}>
        {choices.map((choice, index) => (
          <ChoiceButton key={choice.id} choice={choice} variant="liu" index={index} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {choices.map((choice, index) => (
        <ChoiceButton key={choice.id} choice={choice} variant={variants[index]} index={index} onSelect={onSelect} />
      ))}
    </div>
  );
}
