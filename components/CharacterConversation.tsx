'use client';

import { getNpcPortraitUrl } from '@/lib/characterPortrait';
import { DialogChoice, ConversationTurn } from '@/types/game';
import React, { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';
import CharacterConversationCard from './CharacterConversationCard';

export interface CharacterConversationProps {
  conversation: ConversationTurn[];
  onComplete?: () => void;
  onChoiceSelect?: (choice: DialogChoice) => void;
  onTurnChange?: (currentIndex: number, currentTurn: ConversationTurn) => void;
  finalChoices?: DialogChoice[]; // 最後的選擇題
  typewriterSpeed?: number;
  className?: string;
}

export default function CharacterConversation({
  conversation,
  onComplete,
  onChoiceSelect,
  onTurnChange,
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

  // 通知父層當前 turn（供 play 頁在場景上繪製立繪）；用 useLayoutEffect 在繪製前更新，避免閃爍
  useLayoutEffect(() => {
    if (currentTurn && onTurnChange) {
      onTurnChange(currentIndex, currentTurn);
    }
  }, [currentIndex, currentTurn, onTurnChange]);

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
  const showChoices = Boolean(isLastTurn && finalChoices && finalChoices.length > 0);
  // 繼續按鈕顯示條件：對話完成 + 不是最後一段 + 沒有選擇題
  const showContinue = isComplete && !isLastTurn && !showChoices;

  // 優先使用 WEBP（characterId + characterExpression），其次 characterPortrait（SVG）
  const portraitWebpUrl = currentTurn.characterId
    ? getNpcPortraitUrl(currentTurn.characterId, currentTurn.characterExpression ?? 1)
    : null;
  // 方案四：胸上立繪放大區（約 1.75x）、object-bottom 對齊
  const portraitSize = 'w-32 h-[11rem] md:w-[10rem] md:h-[13rem]'; // 約 128×176 / 160×208

  // 整張卡片固定總高度，配合放大立繪略增
  const cardWidth = 'min(360px, calc(100vw - 2rem))';
  const cardHeight = '21rem'; // 配合立繪區增高
  const textAreaHeight = '7rem'; // 112px，約 4～5 行
  const buttonAreaHeight = '3.5rem'; // 56px，固定按鈕區

  return React.createElement(CharacterConversationCard, {
    wrapperClassName: `fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${className}`,
    cardWidth,
    cardHeight,
    textAreaHeight,
    buttonAreaHeight,
    showContinue,
    showChoices,
    isComplete,
    finalChoices,
    onNext: handleNext,
    onChoice: handleChoice,
    onClose: onComplete,
    currentTurn,
    isPlayer,
    portraitWebpUrl,
    portraitSize,
    displayText,
  });
}
