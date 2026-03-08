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

  // 整張卡片固定總高度，手機上略加寬、加高以提升可讀性
  const cardWidth = 'min(380px, calc(100vw - 1rem))';
  const cardHeight = '29rem'; // 桌面
  const cardHeightMobile = '29.87rem'; // 手機：外框高度 +3%（29 * 1.03）
  const textAreaHeight = '11rem'; // 對應提高文字區高度
  const buttonAreaHeight = '3.5rem'; // 56px，固定按鈕區

  return React.createElement(CharacterConversationCard, {
    // 由父層（play page 全域互動層）負責決定定位與對齊，這裡只提供基礎寬度與 pointer-events 行為
    wrapperClassName: `w-full pointer-events-none ${className}`,
    cardWidth,
    cardHeight,
    cardHeightMobile,
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
