'use client';

import type { DialogChoice } from '@/types/game';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import OverlayCard from './OverlayCard';

export interface SensitiveGateOverlayProps {
  /** 旁白／提示文字 */
  text: string;
  /** 兩個選項（問敏感/再聊聊 或 敏感一/敏感二） */
  choices: DialogChoice[];
  /** 選擇後回調 */
  onChoiceSelect: (choice: DialogChoice) => void;
  /** 關閉（可選，例如點 X 或背景） */
  onClose?: () => void;
}

export default function SensitiveGateOverlay({
  text,
  choices,
  onChoiceSelect,
  onClose,
}: SensitiveGateOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-[640px] max-h-[65vh] pointer-events-auto"
    >
      <OverlayCard
        tone="decision"
        size="sm"
        className="w-full max-h-[65vh] flex flex-col relative"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="關閉"
          >
            <X size={20} />
          </button>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto pr-2">
          <p className="text-center text-sm md:text-base leading-relaxed mb-5 pr-6 whitespace-pre-line">
            {text}
          </p>
        </div>

        <div className="mt-2 flex flex-col gap-2.5">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onChoiceSelect(choice)}
              className="w-full text-left px-3.5 py-3 rounded-lg border border-orange-600/60 bg-orange-950/40 hover:bg-orange-900/60 hover:border-orange-400/80 text-orange-100 transition-colors text-xs md:text-sm leading-snug"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </OverlayCard>
    </motion.div>
  );
}

