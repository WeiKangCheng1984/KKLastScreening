'use client';

import { DialogChoice, ConversationTurn } from '@/types/game';
import { motion } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';

export interface CharacterConversationCardProps {
  wrapperClassName: string;
  cardWidth: string;
  cardHeight: string;
  textAreaHeight: string;
  buttonAreaHeight: string;
  showContinue: boolean;
  showChoices: boolean;
  isComplete: boolean;
  finalChoices: DialogChoice[] | undefined;
  onNext: () => void;
  onChoice: (choice: DialogChoice) => void;
  onClose?: () => void;
  currentTurn: ConversationTurn;
  isPlayer: boolean;
  portraitWebpUrl: string | null;
  portraitSize: string;
  displayText: string;
}

/**
 * 方案 B：立繪由 play 頁落在場景上，此卡僅負責對話框（姓名 + 內文 + 繼續/關閉/選項）
 */
export default function CharacterConversationCard({
  wrapperClassName,
  cardWidth,
  cardHeight,
  textAreaHeight,
  buttonAreaHeight,
  showContinue,
  showChoices,
  isComplete,
  finalChoices,
  onNext,
  onChoice,
  onClose,
  currentTurn,
  isPlayer,
  displayText,
}: CharacterConversationCardProps) {
  return (
    <div className={`${wrapperClassName} flex items-end justify-end md:justify-center pb-4 md:pb-6`} data-scheme="b-dialog-only">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-auto relative z-10 bg-dark-card/95 backdrop-blur-md border border-dark-border rounded-lg shadow-2xl p-6 flex flex-col min-h-0"
        style={{
          width: cardWidth,
          maxWidth: 'calc(100vw - 1rem)',
          height: cardHeight,
        }}
      >
        {/* 右上角：繼續 + X 關閉 */}
        <div className="flex-shrink-0 flex justify-end items-center gap-2 mb-3 -mt-1">
          {showContinue && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="px-4 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/50 rounded-lg transition-colors text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <span>繼續</span>
              <ChevronRight size={14} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="關閉"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div
          role={showContinue ? 'button' : undefined}
          tabIndex={showContinue ? 0 : undefined}
          onClick={showContinue ? onNext : undefined}
          onKeyDown={
            showContinue
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNext();
                  }
                }
              : undefined
          }
          className={`flex-shrink-0 flex flex-col ${showContinue ? 'cursor-pointer outline-none rounded-lg -m-1 p-1 focus-visible:ring-2 focus-visible:ring-orange-400/50' : ''}`}
        >
          <div
            className={`flex-1 min-w-0 flex flex-col ${isPlayer ? 'bg-blue-900/30' : 'bg-gray-900/30'} rounded-lg p-4 border ${isPlayer ? 'border-blue-500/30' : 'border-gray-500/30'}`}
            style={{ minHeight: textAreaHeight }}
          >
            <div className="flex items-center gap-2 mb-2 flex-shrink-0">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${isPlayer ? 'bg-blue-400' : 'bg-orange-400'}`}
              />
              <span className="text-sm font-medium text-gray-300 break-words min-w-[6em] whitespace-pre-line">
                {currentTurn.characterName.replace(/（/g, '\n（')}
              </span>
              {isPlayer && (
                <span className="text-xs text-gray-500 flex-shrink-0">（你）</span>
              )}
            </div>
            <div
              className="text-sm text-gray-200 leading-relaxed break-words overflow-y-auto overflow-x-hidden pr-1 flex-1 min-h-0"
              style={{ height: textAreaHeight }}
            >
              {displayText}
              {!isComplete && (
                <span className="inline-block w-2 h-5 bg-orange-400 ml-1 animate-pulse align-middle" />
              )}
            </div>
          </div>
        </div>

        <div
          className="flex-shrink-0 flex flex-col items-stretch overflow-hidden"
          style={{ height: buttonAreaHeight, minHeight: buttonAreaHeight }}
        >
          {showChoices && isComplete && finalChoices && (
            <div className="w-full space-y-2 overflow-y-auto overflow-x-hidden pr-1 min-h-0 flex-1">
              {finalChoices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => onChoice(choice)}
                  className="w-full px-4 py-2.5 text-left bg-dark-surface/50 hover:bg-dark-surface border border-dark-border hover:border-orange-400/50 rounded-lg transition-colors text-sm text-gray-300 hover:text-orange-400"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
