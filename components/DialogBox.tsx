'use client';

import { getNpcPortraitUrl } from '@/lib/characterPortrait';
import { Dialog, DialogChoice, NpcDialogChoice } from '@/types/game';
import { X, SkipForward } from 'lucide-react';
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
  /** 是否預留底部空間（如序章頁的略過按鈕），手機版對話框會上移 */
  reserveBottomSpace?: boolean;
  /** 立繪由場景顯示（玩法 A）：為 true 時對話框內不渲染角色立繪 */
  portraitOnScene?: boolean;
  /** 嵌在父層右下角（場景內 50% x 30%）：不佔滿全螢幕，由父層控制位置與大小 */
  embedInParent?: boolean;
  /** 熱點互動框模式：銀灰玻璃態、細淺色邊框、標題藍灰、內文白，第一～六章統一 */
  variant?: 'default' | 'hotspot';
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
  reserveBottomSpace = false,
  portraitOnScene = false,
  embedInParent = false,
  variant = 'default',
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

  // 點擊內文繼續（取代「繼續」按鈕）：多段時下一段、僅「繼續」選項時等同點擊繼續、否則關閉
  const isSingleChoiceNext =
    dialog.choices?.length === 1 && dialog.choices[0].id === 'choice_next' && isComplete && isLastSegment;
  const canClickToContinue =
    showSegmentContinue ||
    isSingleChoiceNext ||
    (showContinue && mode !== 'npc' && !(dialog.choices?.length && isComplete && isLastSegment) && !(npcChoices?.length && isComplete && isLastSegment));
  const handleContentClick = () => {
    // 還在打字機過程中：先補完本段，再由下一次點擊才推進
    if (!isComplete) {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
        typewriterIntervalRef.current = null;
      }
      setDisplayText(currentSegmentText);
      setIsComplete(true);
      setShowContinue(true);
      return;
    }

    if (!canClickToContinue) return;

    if (showSegmentContinue) handleSegmentContinue();
    else if (isSingleChoiceNext && onChoiceSelect) {
      onChoiceSelect(dialog.choices![0]);
      onClose();
    } else if (showContinue && mode !== 'npc') onClose();
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

  /* 建議三：統一暗色底 + 左側色條區分類型；variant=hotspot 時改為銀灰玻璃互動框（第一～六章統一） */
  const getTypeStyles = () => {
    if (variant === 'hotspot') {
      return {
        container: 'hotspot-glass text-gray-100 w-[min(360px,calc(100vw-2rem))] max-h-[min(85vh,calc(100vh-2rem-env(safe-area-inset-bottom)))] min-h-[200px] rounded-lg p-3 md:p-4 shadow-2xl',
        icon: 'text-slate-500',
        pulse: ''
      };
    }
    const baseContainer = 'bg-gradient-to-br from-slate-950/98 via-slate-900/95 to-slate-950/98 border border-slate-700/50 text-gray-100';
    if (mode === 'npc') {
      return {
        container: `${baseContainer} border-l-4 border-l-indigo-500`,
        icon: 'text-indigo-400',
        pulse: ''
      };
    }
    switch (dialog.type) {
      case 'broadcast':
        return { container: `${baseContainer} border-l-4 border-l-red-500`, icon: 'text-red-400', pulse: 'animate-pulse' };
      case 'item':
        return { container: `${baseContainer} border-l-4 border-l-orange-500`, icon: 'text-orange-400', pulse: '' };
      case 'system':
        return { container: `${baseContainer} border-l-4 border-l-amber-500`, icon: 'text-amber-400', pulse: '' };
      case 'choice':
        return { container: `${baseContainer} border-l-4 border-l-blue-500`, icon: 'text-blue-400', pulse: '' };
      case 'character':
        return { container: `${baseContainer} border-l-4 border-l-orange-400`, icon: 'text-orange-400', pulse: '' };
      default:
        return { container: `${baseContainer} border-l-4 border-l-slate-400`, icon: 'text-slate-300', pulse: '' };
    }
  };

  const styles = getTypeStyles();

  const isEmbedded = embedInParent;

  return (
    <div 
      className={`transition-opacity duration-500 ${
        isEmbedded
          ? 'w-full h-full flex items-end justify-end p-2 md:p-3 pointer-events-none'
          : `fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none md:items-center md:p-8 md:pb-8 ${
              reserveBottomSpace
                ? 'pb-[calc(3.5rem+max(1rem,env(safe-area-inset-bottom)))] md:pb-8'
                : 'pb-[max(1rem,env(safe-area-inset-bottom))]'
            }`
      } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
      className={`flex flex-col rounded-lg pointer-events-auto shadow-2xl transform transition-all duration-500 gpu-accelerated overflow-hidden ${
        variant === 'hotspot' ? '' : 'border-2 backdrop-blur-xl'
      } ${
        isEmbedded
          ? 'bg-gradient-to-br from-gray-950/50 via-gray-900/50 to-gray-950/50 border-orange-700/30 text-gray-100 w-full h-full min-h-0 max-w-full max-h-full rounded-tl-xl rounded-br-none p-2 md:p-4'
          : variant === 'hotspot'
            ? styles.container
            : `${styles.container} w-[min(360px,calc(100vw-2rem))] max-h-[min(85vh,calc(100vh-2rem-env(safe-area-inset-bottom)))] min-h-[200px] rounded-lg p-3 md:p-4`
      } ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
      }`}
      >
        {/* 標題欄 - 嵌在場景時縮小；手機 0.6em + 更小 padding/gap */}
        <div className={`flex justify-between items-center border-b border-white/10 flex-shrink-0 gap-2 ${
          isEmbedded ? 'pb-1 mb-1 gap-1.5 text-[0.6em] md:pb-1.5 md:mb-1.5 md:gap-2' : 'mb-4 pb-3'
        }`}>
          <div className={`text-ui-title uppercase tracking-widest ${styles.icon} flex items-center gap-2 min-w-0 flex-1 ${
            isEmbedded ? 'whitespace-nowrap overflow-hidden text-ellipsis' : 'text-xs break-words'
          }`}>
            {dialog.type === 'broadcast' && (
              <span className={`w-2 h-2 bg-red-400 rounded-full ${styles.pulse}`}></span>
            )}
            {mode === 'npc' && 'NPC 對話'}
            {mode !== 'npc' && dialog.type === 'broadcast' && '廣播'}
            {mode !== 'npc' && dialog.type === 'item' && '道具'}
            {mode !== 'npc' && dialog.type === 'system' && '系統'}
            {mode !== 'npc' && dialog.type === 'choice' && '選擇'}
            {mode !== 'npc' && dialog.type === 'character' && (
              <span>{isEmbedded ? (dialog.characterName || '角色') : (dialog.characterName || '角色').replace(/（/g, '\n（')}</span>
            )}
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

        {dialog.title && (
          <div className={`text-ui-caption flex-shrink-0 ${variant === 'hotspot' ? 'text-slate-500' : 'text-gray-300'} ${isEmbedded ? 'mb-0.5 md:mb-1 text-[0.65em]' : 'mb-2'}`}>
            {dialog.title}
          </div>
        )}

        {/* 對話內容容器 - 嵌在場景時手機略縮 gap */}
        {(() => {
          const portraitWebpUrl = dialog.characterId
            ? getNpcPortraitUrl(dialog.characterId, dialog.characterExpression ?? 1)
            : null;
          const hasCharacterPortrait = Boolean(portraitWebpUrl || dialog.characterPortrait);
          // 做法 A：有 characterId 時預設立繪在場景上，不畫在對話框內（除非明確 portraitOnScene=false）
          const portraitShownInline = hasCharacterPortrait && (
            dialog.characterId ? portraitOnScene === false : !portraitOnScene
          );
          return (
        <div
          role={canClickToContinue ? 'button' : undefined}
          tabIndex={canClickToContinue ? 0 : undefined}
          title={canClickToContinue ? '點擊繼續' : undefined}
          onClick={canClickToContinue ? handleContentClick : undefined}
          onKeyDown={canClickToContinue ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleContentClick(); } } : undefined}
          className={`flex gap-3 min-h-0 flex-1 overflow-y-auto ${isEmbedded ? 'gap-1.5 mb-0.5 md:gap-2 md:mb-1' : 'mb-3'} ${canClickToContinue ? 'cursor-pointer' : ''} ${
          portraitShownInline ? (
            dialog.characterPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
          ) : (
            dialog.svgImage && dialog.svgPosition === 'left' ? 'flex-row' :
            dialog.svgImage && dialog.svgPosition === 'right' ? 'flex-row-reverse' :
            'flex-col'
          )
        }`}>
          {/* 角色立繪（方案四）：立繪由場景顯示時不渲染 */}
          {portraitShownInline && portraitWebpUrl && (
            <div className="flex-shrink-0 flex items-end">
              <div className="relative w-32 h-[11rem] md:w-[10rem] md:h-[13rem] min-w-[8rem] min-h-[11rem] overflow-hidden rounded-xl bg-dark-surface/60 border border-orange-400/40 shadow-xl shadow-orange-500/10 ring-2 ring-orange-400/20">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-orange-950/20 to-transparent pointer-events-none" aria-hidden />
                <img
                  src={portraitWebpUrl}
                  alt={dialog.characterName || '角色'}
                  className="w-full h-full object-contain object-bottom relative"
                />
              </div>
            </div>
          )}
          {portraitShownInline && !portraitWebpUrl && dialog.characterPortrait && (
            <div className="flex-shrink-0 flex items-end">
              <div className="relative w-32 h-[11rem] md:w-[10rem] md:h-[13rem] min-w-[8rem] min-h-[11rem] overflow-hidden rounded-xl bg-dark-surface/60 border border-orange-400/40 shadow-xl shadow-orange-500/10 ring-2 ring-orange-400/20">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-orange-950/20 to-transparent pointer-events-none" aria-hidden />
                <SVGImage
                  src={dialog.characterPortrait}
                  alt={dialog.characterName || '角色'}
                  size="large"
                  lazy={false}
                  className="w-full h-full object-contain object-bottom relative"
                />
              </div>
            </div>
          )}
          
          {/* SVG 圖片（根據位置顯示，如果沒有角色立繪） */}
          {!portraitShownInline && dialog.svgImage && (dialog.svgPosition === 'left' || dialog.svgPosition === 'right') && (
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

          {/* 對話文字內容 - 建議一：手機 text-base 避免溢出，桌面 text-lg；max-h 預留安全區 */}
          <div className={`flex-1 leading-relaxed min-h-[3rem] whitespace-pre-line overflow-y-auto ${
            isEmbedded ? 'min-h-0 max-h-none text-[0.82em] md:text-[0.9em]' : 'text-base md:text-lg max-h-[min(50vh,calc(100vh-8rem-env(safe-area-inset-bottom)))] md:max-h-none'
          } ${dialog.svgImage && (dialog.svgPosition === 'top' || dialog.svgPosition === 'bottom') ? 'order-2' : ''}`}>
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
          );
        })()}

        {/* 選擇題區（無「繼續」按鈕：改為點擊內文繼續） */}
        <div className={`flex-shrink-0 mt-auto ${isEmbedded ? 'pt-0.5 md:pt-1' : 'pt-2'}`}>
        {showSegmentContinue ? null : (mode === 'npc' && npcChoices && npcChoices.length > 0 && isComplete && isLastSegment) ? (
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
          // 僅單一「繼續」選項時不顯示按鈕，改為點擊內文繼續（見 canClickToContinue）
          isSingleChoiceNext ? null : (
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
          )
        ) : showContinue && mode !== 'npc' ? null : null}
        </div>
      </div>
    </div>
  );
}

