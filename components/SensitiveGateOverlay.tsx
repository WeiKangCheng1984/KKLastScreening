'use client';

import type { DialogChoice } from '@/types/game';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-xl border-2 border-orange-700/40 bg-gradient-to-br from-gray-950/95 via-gray-900/95 to-gray-950/95 p-6 shadow-2xl text-gray-100"
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

          <p className="text-center text-lg leading-relaxed mb-6 pr-8 whitespace-pre-line">
            {text}
          </p>

          <div className="flex flex-col gap-3">
            {choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => onChoiceSelect(choice)}
                className="w-full text-left px-4 py-3.5 rounded-lg border border-orange-600/50 bg-orange-950/40 hover:bg-orange-900/50 hover:border-orange-500/60 text-orange-100 transition-colors text-base leading-snug"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
  );
}
