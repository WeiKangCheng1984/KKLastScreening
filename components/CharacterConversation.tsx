'use client';

import { getNpcPortraitUrl } from '@/lib/characterPortrait';
import { DialogChoice, ConversationTurn } from '@/types/game';
import { useEffect, useState, useRef, useCallback } from 'react';
import SVGImage from './SVGImage';
import DialogChoiceComponent from './DialogChoice';
import { motion } from 'framer-motion';
import { ChevronRight, User } from 'lucide-react';

export interface CharacterConversationProps {
  conversation: ConversationTurn[];
  onComplete?: () => void;
  onChoiceSelect?: (choice: DialogChoice) => void;
  finalChoices?: DialogChoice[]; // 最後的選擇題
  typewriterSpeed?: number;
  className?: string;
}

export default function CharacterConversation({
  conversation,
  onComplete,
  onChoiceSelect,
  finalChoices,
  typewriterSpeed = 30,
  className = '',
}: CharacterConversationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTurn = conversation[currentIndex];

  // 打字機效果
  useEffect(() => {
    if (!currentTurn) return;

    setIsVisible(true);
    setDisplayText('');
    setIsComplete(false);

    // 清除之前的 interval
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
    }

    // 如果有延遲，先等待
    const delay = currentTurn.delay || 0;
    
    const startTypewriter = () => {
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < currentTurn.text.length) {
          setDisplayText(currentTurn.text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(typeInterval);
          typewriterIntervalRef.current = null;
        }
      }, typewriterSpeed);

      typewriterIntervalRef.current = typeInterval;

      return () => {
        clearInterval(typeInterval);
      };
    };

    if (delay > 0) {
      const timeout = setTimeout(startTypewriter, delay);
      return () => clearTimeout(timeout);
    } else {
      startTypewriter();
    }

    return () => {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
      }
    };
  }, [currentTurn, typewriterSpeed, conversation.length]);

  // 處理下一段對話
  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev < conversation.length - 1) {
        return prev + 1;
      } else {
        // 對話結束
        if (onComplete) {
          setTimeout(() => onComplete(), 0);
        }
        return prev;
      }
    });
  }, [conversation.length, onComplete]);

  // 處理選擇
  const handleChoice = (choice: DialogChoice) => {
    if (onChoiceSelect) {
      onChoiceSelect(choice);
    }
    if (onComplete) {
      onComplete();
    }
  };

  if (!currentTurn) {
    return null;
  }

  const isPlayer = currentTurn.speaker === 'player';
  const isLastTurn = currentIndex === conversation.length - 1;
  const showChoices = isLastTurn && finalChoices && finalChoices.length > 0;
  // 繼續按鈕顯示條件：對話完成 + 不是最後一段 + 沒有選擇題
  const showContinue = isComplete && !isLastTurn && !showChoices;

  // 固定人像框尺寸；優先使用 WEBP（characterId + characterExpression），其次 characterPortrait（SVG）
  const portraitWebpUrl = currentTurn.characterId
    ? getNpcPortraitUrl(currentTurn.characterId, currentTurn.characterExpression ?? 1)
    : null;
  const hasPortrait = Boolean(portraitWebpUrl || currentTurn.characterPortrait);
  const portraitSize = 'w-[8rem] h-40 md:w-40 md:h-48'; // 128px×160px / 160px×192px

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${className}`}>
      <div className="pointer-events-auto w-full max-w-2xl px-4">
        {/* 不依 currentTurn.id 重掛載整張卡片，只更新內容，避免人像框位移 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-dark-card/95 backdrop-blur-md border border-dark-border rounded-lg shadow-2xl p-6"
        >
          {/* 方案 4：可下一句時點擊整區（人像+對話+繼續）觸發下一句，保留繼續按鈕 */}
          <div
            role={showContinue ? 'button' : undefined}
            tabIndex={showContinue ? 0 : undefined}
            onClick={showContinue ? handleNext : undefined}
            onKeyDown={showContinue ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNext(); } } : undefined}
            className={showContinue ? 'cursor-pointer outline-none rounded-lg -m-2 p-2 focus-visible:ring-2 focus-visible:ring-orange-400/50' : ''}
          >
            {/* 角色立繪 + 對話：固定左側人像框寬高，右側 min-w-0 防止擠壓重疊 */}
            <div className={`flex items-stretch gap-4 mb-4 ${currentTurn.characterPosition === 'right' ? 'flex-row-reverse' : ''}`}>
            {/* 方案 2：人像框層次（陰影/邊框）+ 無立繪時替身（首字或圖示） */}
            <div
              className={`flex-shrink-0 ${portraitSize} overflow-hidden rounded-lg bg-dark-surface/50 border shadow-lg ring-1 ring-white/10 ${
                isPlayer ? 'border-blue-500/30' : 'border-orange-400/30'
              }`}
              style={{ minWidth: '8rem', minHeight: '10rem' }}
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

            {/* 對話框：flex-1 + min-w-0 避免壓到人像 */}
            <div className={`flex-1 min-w-0 flex flex-col ${isPlayer ? 'bg-blue-900/30' : 'bg-gray-900/30'} rounded-lg p-4 border ${isPlayer ? 'border-blue-500/30' : 'border-gray-500/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isPlayer ? 'bg-blue-400' : 'bg-orange-400'}`} />
                <span className="text-sm font-medium text-gray-300 truncate">
                  {currentTurn.characterName}
                </span>
                {isPlayer && (
                  <span className="text-xs text-gray-500 flex-shrink-0">（你）</span>
                )}
              </div>
              <div className="text-sm text-gray-200 leading-relaxed min-h-[60px] break-words">
                {displayText}
                {!isComplete && (
                  <span className="inline-block w-2 h-5 bg-orange-400 ml-1 animate-pulse align-middle" />
                )}
              </div>
            </div>
          </div>

          {/* 繼續按鈕（保留，與點擊整區並存） */}
          {showContinue && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="px-6 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/50 rounded-lg transition-colors text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center gap-2 cursor-pointer hover:border-orange-400"
              >
                <span>繼續</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          </div>

          {/* 選擇題 */}
          {showChoices && isComplete && (
            <div className="mt-4 space-y-2">
              {finalChoices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="w-full px-4 py-3 text-left bg-dark-surface/50 hover:bg-dark-surface border border-dark-border hover:border-orange-400/50 rounded-lg transition-colors text-sm text-gray-300 hover:text-orange-400"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
