'use client';

import type { DialogChoice } from '@/types/game';
import { X } from 'lucide-react';
import { m } from 'framer-motion';

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
    <m.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-[640px] max-h-[65vh] pointer-events-auto"
    >
      <div className="hotspot-glass rounded-xl shadow-2xl w-full max-h-[65vh] flex flex-col relative px-5 py-4 text-white">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded text-white/75 hover:text-orange-400 hover:bg-white/10 transition-colors"
            aria-label="關閉"
          >
            <X size={20} />
          </button>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto pr-2">
          <p className="text-center text-sm md:text-base text-white leading-relaxed mb-5 pr-6 whitespace-pre-line">
            {text}
          </p>
        </div>

        <div className="mt-2 flex flex-col gap-2.5 hotspot-glass-choices">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onChoiceSelect(choice)}
              className="group w-full text-left px-3.5 py-3 rounded-lg border border-white/20 bg-black/30 hover:bg-black/45 hover:border-orange-400/50 transition-colors text-xs md:text-sm leading-snug"
            >
              <span className="dialog-hotspot-choice">{choice.text}</span>
            </button>
          ))}
        </div>
      </div>
    </m.div>
  );
}

