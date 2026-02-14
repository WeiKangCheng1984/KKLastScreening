'use client';

import { Dialog, DialogChoice, NpcDialogChoice } from '@/types/game';
import { X, ChevronRight, SkipForward } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import SVGImage from './SVGImage';
import DialogChoiceComponent from './DialogChoice';

interface DialogBoxProps {
  dialog: Dialog;
  onClose: () => void;
  autoClose?: boolean;
  typewriterSpeed?: number;
  onChoiceSelect?: (choice: DialogChoice) => void; // 選擇回調
  mode?: 'normal' | 'npc'; // 新增：NPC 模式
  npcChoices?: NpcDialogChoice[]; // 新增：NPC 對話選項
  onNpcChoiceSelect?: (choiceId: string) => void; // 新增：NPC 選擇回調
}

export default function DialogBox({ 
  dialog, 
  onClose,
  autoClose = false,
  typewriterSpeed = 30,
  onChoiceSelect,
  mode = 'normal',
  npcChoices,
  onNpcChoiceSelect,
}: DialogBoxProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const textSegments = dialog.textSegments && dialog.textSegments.length > 0 ? dialog.textSegments : null;
  const currentSegmentText = textSegments
    ? textSegments[Math.min(currentSegmentIndex, textSegments.length - 1)]
    : dialog.text;

  // 對話節點變更時重置分段索引
  useEffect(() => {
    setCurrentSegmentIndex(0);
  }, [dialog.text, dialog.textSegments?.[0]]);

  useEffect(() => {
    setIsVisible(true);
    let currentIndex = 0;
    let shouldSkip = false;
    setDisplayText('');
    setIsComplete(false);
    setShowContinue(false);
    setIsSkipping(false);
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
    }
    const typeInterval = setInterval(() => {
      if (shouldSkip) {
        setDisplayText(currentSegmentText);
        setIsComplete(true);
        setShowContinue(true);
        clearInterval(typeInterval);
        typewriterIntervalRef.current = null;
        return;
      }
      if (currentIndex < currentSegmentText.length) {
        setDisplayText(currentSegmentText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        setTimeout(() => setShowContinue(true), 300);
        clearInterval(typeInterval);
        typewriterIntervalRef.current = null;
      }
    }, typewriterSpeed);
    typewriterIntervalRef.current = typeInterval;
    const skipCheckInterval = setInterval(() => {
      if (isSkipping) {
        shouldSkip = true;
      }
    }, 50);
    return () => {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
        typewriterIntervalRef.current = null;
      }
      clearInterval(skipCheckInterval);
    };
  }, [currentSegmentText, typewriterSpeed]);

  const isLastSegment = !textSegments || currentSegmentIndex >= textSegments.length - 1;
  const showSegmentContinue = Boolean(textSegments && textSegments.length > 1 && isComplete && !isLastSegment);

  const handleSegmentContinue = () => {
    setCurrentSegmentIndex((prev) => prev + 1);
    setDisplayText('');
    setIsComplete(false);
    setShowContinue(false);
  };

  // 快速跳過功能（按住跳過）：完成當前段
  const handleSkip = () => {
    setIsSkipping(true);
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
      typewriterIntervalRef.current = null;
    }
    setDisplayText(currentSegmentText);
    setIsComplete(true);
    setTimeout(() => setShowContinue(true), 100);
  };

  const handleSkipRelease = () => {
    setIsSkipping(false);
  };

  // 自動播放音訊（如果有）
  useEffect(() => {
    if (dialog.audio) {
      const audio = new Audio(dialog.audio);
      audio.play().catch(() => {});
      return () => audio.pause();
    }
  }, [dialog.audio]);

  // 移除自動關閉功能 - 所有訊息都需要手動關閉

  const getTypeStyles = () => {
    // NPC 模式使用特殊樣式
    if (mode === 'npc') {
      return {
        container: 'bg-gradient-to-br from-indigo-950/95 via-purple-950/90 to-indigo-950/95 border-indigo-700/50 text-indigo-100',
        icon: 'text-indigo-400',
        pulse: ''
      };
    }
    
    switch (dialog.type) {
      case 'broadcast':
        return {
          container: 'bg-gradient-to-br from-red-950/90 via-orange-950/80 to-red-950/90 border-red-700/60 text-orange-100',
          icon: 'text-orange-400',
          pulse: 'animate-pulse'
        };
      case 'item':
        return {
          container: 'bg-gradient-to-br from-orange-950/90 via-amber-950/80 to-orange-950/90 border-orange-700/60 text-orange-100',
          icon: 'text-amber-400',
          pulse: ''
        };
      case 'system':
        return {
          container: 'bg-gradient-to-br from-amber-950/90 via-orange-950/80 to-amber-950/90 border-amber-700/60 text-amber-100',
          icon: 'text-amber-400',
          pulse: ''
        };
      case 'choice':
        return {
          container: 'bg-gradient-to-br from-blue-950/90 via-indigo-950/80 to-blue-950/90 border-blue-700/60 text-blue-100',
          icon: 'text-blue-400',
          pulse: ''
        };
      default:
        return {
          container: 'bg-gradient-to-br from-gray-950/95 via-gray-900/90 to-gray-950/95 border-orange-700/30 text-gray-100',
          icon: 'text-orange-400/70',
          pulse: ''
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none md:items-center md:p-8 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
      className={`w-[min(360px,calc(100vw-2rem))] max-h-[85vh] min-h-[200px] flex flex-col p-4 rounded-lg border-2 backdrop-blur-xl ${styles.container} pointer-events-auto shadow-2xl transform transition-all duration-500 gpu-accelerated overflow-hidden ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
      }`}
      >
        {/* 標題欄 - 添加圖示動畫 */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10 flex-shrink-0">
          <div className={`text-xs uppercase tracking-widest font-semibold ${styles.icon} flex items-center gap-2`}>
            {dialog.type === 'broadcast' && (
              <span className={`w-2 h-2 bg-red-400 rounded-full ${styles.pulse}`}></span>
            )}
            {mode === 'npc' && 'NPC 對話'}
            {mode !== 'npc' && dialog.type === 'broadcast' && '廣播'}
            {mode !== 'npc' && dialog.type === 'item' && '道具'}
            {mode !== 'npc' && dialog.type === 'system' && '系統'}
            {mode !== 'npc' && dialog.type === 'choice' && '選擇'}
            {mode !== 'npc' && dialog.type === 'character' && (dialog.characterName || '角色')}
            {mode !== 'npc' && !dialog.type && '旁白'}
          </div>
          <div className="flex items-center gap-2">
            {/* 快速跳過按鈕 */}
            {!isComplete && (
              <button
                onMouseDown={handleSkip}
                onMouseUp={handleSkipRelease}
                onMouseLeave={handleSkipRelease}
                onTouchStart={handleSkip}
                onTouchEnd={handleSkipRelease}
                className="text-gray-400 hover:text-orange-400 transition-all duration-200 p-1 hover:bg-white/10 rounded"
                title="按住快速跳過"
              >
                <SkipForward size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-all duration-200 p-1 hover:bg-white/10 rounded hover:rotate-90"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 對話內容容器 - 可捲動、最大高度，支持 SVG 和角色立繪佈局 */}
        <div className={`flex gap-3 mb-3 min-h-0 flex-1 overflow-y-auto ${
          // 優先顯示角色立繪
          dialog.characterPortrait ? (
            dialog.characterPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
          ) : (
            dialog.svgImage && dialog.svgPosition === 'left' ? 'flex-row' :
            dialog.svgImage && dialog.svgPosition === 'right' ? 'flex-row-reverse' :
            'flex-col'
          )
        }`}>
          {/* 角色立繪（優先顯示） */}
          {dialog.characterPortrait && (
            <div className="flex-shrink-0 flex items-end">
              <div className="w-32 h-40 md:w-40 md:h-48 relative">
                <SVGImage
                  src={dialog.characterPortrait}
                  alt={dialog.characterName || '角色'}
                  size="large"
                  lazy={false}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
          
          {/* SVG 圖片（根據位置顯示，如果沒有角色立繪） */}
          {!dialog.characterPortrait && dialog.svgImage && (dialog.svgPosition === 'left' || dialog.svgPosition === 'right') && (
            <div className="flex-shrink-0">
              <SVGImage
                src={dialog.svgImage}
                alt=""
                size="medium"
                lazy={false}
              />
            </div>
          )}

          {/* SVG 圖片（頂部） */}
          {dialog.svgImage && dialog.svgPosition === 'top' && (
            <div className="mb-3 flex justify-center">
              <SVGImage
                src={dialog.svgImage}
                alt=""
                size="medium"
                lazy={false}
              />
            </div>
          )}

          {/* 對話文字內容 - 手機字體加大方便閱讀 */}
          <div className={`flex-1 text-lg sm:text-base leading-relaxed min-h-[3rem] whitespace-pre-line overflow-y-auto max-h-[50vh] sm:max-h-none ${
            dialog.svgImage && (dialog.svgPosition === 'top' || dialog.svgPosition === 'bottom') ? 'order-2' : ''
          }`}>
          {displayText.split('').map((char, index) => {
            // 高亮顯示當前字符（打字機效果增強）
            const isCurrentChar = index === displayText.length - 1 && !isComplete;
            return (
              <span
                key={index}
                className={isCurrentChar ? 'text-orange-300 font-semibold' : ''}
              >
                {char}
              </span>
            );
          })}
          {!isComplete && (
            <span className="inline-block w-0.5 h-5 bg-current ml-1 animate-blink"></span>
          )}
          </div>

          {/* SVG 圖片（底部） */}
          {dialog.svgImage && dialog.svgPosition === 'bottom' && (
            <div className="mt-3 flex justify-center order-3">
              <SVGImage
                src={dialog.svgImage}
                alt=""
                size="medium"
                lazy={false}
              />
            </div>
          )}
        </div>

        {/* 選擇題或繼續提示 - 固定於底部 */}
        <div className="flex-shrink-0 mt-auto pt-2">
        {showSegmentContinue ? (
          <button
            type="button"
            onClick={handleSegmentContinue}
            className="flex items-center justify-end gap-2 text-sm opacity-70 hover:opacity-100 transition-all duration-200 cursor-pointer ml-auto group mt-3"
          >
            <span className="group-hover:translate-x-1 transition-transform">繼續</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (mode === 'npc' && npcChoices && npcChoices.length > 0 && isComplete && isLastSegment) ? (
          <div className="mt-3 space-y-2">
            {npcChoices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => {
                  if (onNpcChoiceSelect) {
                    onNpcChoiceSelect(choice.id);
                  }
                }}
                className="w-full text-left p-3 bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-700/50 hover:border-blue-500 rounded-lg text-blue-100 hover:text-white transition-all duration-200 group"
              >
                <div className="font-semibold text-sm mb-1">{choice.label}</div>
                {choice.description && (
                  <div className="text-xs text-blue-200/70 group-hover:text-blue-100">
                    {choice.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : dialog.choices && dialog.choices.length > 0 && isComplete && isLastSegment ? (
          <DialogChoiceComponent
            choices={dialog.choices}
            onSelect={(choice) => {
              if (onChoiceSelect) {
                onChoiceSelect(choice);
              }
              onClose();
            }}
            className="mt-3"
          />
        ) : showContinue && mode !== 'npc' ? (
          <button
            onClick={onClose}
            className="flex items-center justify-end gap-2 text-sm opacity-70 hover:opacity-100 transition-all duration-200 cursor-pointer ml-auto group"
          >
            <span className="group-hover:translate-x-1 transition-transform">繼續</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        ) : null}
        </div>
      </div>
    </div>
  );
}

