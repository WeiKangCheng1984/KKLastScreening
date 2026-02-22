'use client';

import { getNpcPortraitUrl } from '@/lib/characterPortrait';
import { DialogChoice, ConversationTurn } from '@/types/game';
import SVGImage from './SVGImage';
import { motion } from 'framer-motion';
import { ChevronRight, User, X } from 'lucide-react';

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
  portraitWebpUrl,
  portraitSize,
  displayText,
}: CharacterConversationCardProps) {
  return (
    <div className={wrapperClassName}>
      <div className="pointer-events-auto w-full max-w-2xl px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-dark-card/95 backdrop-blur-md border border-dark-border rounded-lg shadow-2xl p-6 flex flex-col flex-1 min-h-0"
          style={{ width: cardWidth, height: cardHeight }}
        >
          {/* 右上角：繼續（在左） + X 關閉（在右） */}
          <div className="flex-shrink-0 flex justify-end items-center gap-2 mb-3 -mt-1">
            {showContinue && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="px-4 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/50 rounded-lg transition-colors text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span>繼續</span>
                <ChevronRight size={14} />
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
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
            onKeyDown={showContinue ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNext(); } } : undefined}
            className={`flex-shrink-0 flex flex-col ${showContinue ? 'cursor-pointer outline-none rounded-lg -m-1 p-1 focus-visible:ring-2 focus-visible:ring-orange-400/50' : ''}`}
          >
            <div className={`flex items-stretch gap-4 ${currentTurn.characterPosition === 'right' ? 'flex-row-reverse' : ''}`} style={{ minHeight: '10rem' }}>
              <div
                className={`flex-shrink-0 ${portraitSize} overflow-hidden rounded-lg bg-dark-surface/50 border shadow-lg ring-1 ring-white/10 ${
                  isPlayer ? 'border-blue-500/30' : 'border-orange-400/30'
                }`}
                style={{ minWidth: '6rem', minHeight: '7.5rem' }}
              >
                {portraitWebpUrl ? (
                  <img
                    src={portraitWebpUrl}
                    alt={currentTurn.characterName}
                    className="w-full h-full object-contain"
                  />
                ) : currentTurn.characterPortrait ? (
                  <SVGImage
                    src={currentTurn.characterPortrait}
                    alt={currentTurn.characterName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark-card/60 text-white/70" aria-hidden>
                    {currentTurn.characterName?.trim() ? (
                      <span className="text-4xl md:text-5xl font-medium select-none" aria-hidden>
                        {currentTurn.characterName.trim().charAt(0)}
                      </span>
                    ) : (
                      <User className="w-16 h-16 md:w-20 md:h-20 text-white/50" aria-hidden />
                    )}
                  </div>
                )}
              </div>

              <div
                className={`flex-1 min-w-0 flex flex-col ${isPlayer ? 'bg-blue-900/30' : 'bg-gray-900/30'} rounded-lg p-4 border ${isPlayer ? 'border-blue-500/30' : 'border-gray-500/30'}`}
                style={{ minHeight: '10rem' }}
              >
                <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isPlayer ? 'bg-blue-400' : 'bg-orange-400'}`} />
                  <span className="text-sm font-medium text-gray-300 break-words min-w-[6em] whitespace-pre-line">
                    {currentTurn.characterName.replace(/（/g, '\n（')}
                  </span>
                  {isPlayer && (
                    <span className="text-xs text-gray-500 flex-shrink-0">（你）</span>
                  )}
                </div>
                <div
                  className="text-sm text-gray-200 leading-relaxed break-words overflow-y-auto overflow-x-hidden pr-1"
                  style={{ height: textAreaHeight }}
                >
                  {displayText}
                  {!isComplete && (
                    <span className="inline-block w-2 h-5 bg-orange-400 ml-1 animate-pulse align-middle" />
                  )}
                </div>
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
    </div>
  );
}
