'use client';

import { getNpcPortraitUrl } from '@/lib/characterPortrait';
import { Dialog, DialogChoice, NpcDialogChoice } from '@/types/game';
import { X, SkipForward } from 'lucide-react';
import { useCallback, useEffect, useState, useRef, useMemo, useId } from 'react';
import { useReducedMotion } from 'framer-motion';
import { dialogTextToEffectiveSegments } from '@/lib/dialogSegmentUtils';
import { stripRedundantSpeakerPrefix } from '@/lib/stripCharacterDialogAttribution';
import { formatNpcDisplayName } from '@/lib/formatNpcDisplayName';
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
  /**
   * 為 true 時外層改為 absolute inset-0 z-10（相對於已定位父層），供 HotspotZoomOverlay 等使用，
   * 讓同層的 NpcScenePortrait（較高 z）能穩定疊在對話框之上；預設 false 維持 fixed z-50 全螢幕。
   */
  containedInOverlay?: boolean;
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
  containedInOverlay = false,
}: DialogBoxProps) {
  const dialogTitleId = useId();
  const reduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const continueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearContinueTimer = useCallback(() => {
    if (continueTimerRef.current !== null) { clearTimeout(continueTimerRef.current); continueTimerRef.current = null; }
  }, []);

  /** 以內容為鍵，避免父層每次 render 傳新 textSegments 陣列參考導致 useMemo 失效、索引被重置 */
  const explicitSegmentsKey =
    dialog.textSegments && dialog.textSegments.length > 0
      ? dialog.textSegments.join('\u0001')
      : null;

  const effectiveTextSegments = useMemo(
    () => dialogTextToEffectiveSegments(dialog.text, dialog.textSegments),
    [dialog.text, explicitSegmentsKey]
  );

  /** 場景立繪時抬頭已顯示角色名，略過內文開頭重複的「某某說：」等 */
  const displaySegmentsOrText = useMemo(() => {
    const shouldStrip =
      portraitOnScene &&
      dialog.type === 'character' &&
      Boolean(dialog.characterName?.trim());
    const name = dialog.characterName ?? '';
    if (!shouldStrip) {
      return { segments: effectiveTextSegments as string[] | null, singleText: null as string | null };
    }
    if (effectiveTextSegments && effectiveTextSegments.length > 0) {
      const copy = [...effectiveTextSegments];
      copy[0] = stripRedundantSpeakerPrefix(copy[0], name);
      return { segments: copy, singleText: null };
    }
    const single = stripRedundantSpeakerPrefix(dialog.text ?? '', name);
    return { segments: null, singleText: single };
  }, [
    effectiveTextSegments,
    explicitSegmentsKey,
    portraitOnScene,
    dialog.type,
    dialog.characterName,
    dialog.text,
  ]);

  const effectiveTextSegmentsForDisplay = displaySegmentsOrText.segments;
  const singleTextForDisplay = displaySegmentsOrText.singleText;

  const currentSegmentText = effectiveTextSegmentsForDisplay
    ? effectiveTextSegmentsForDisplay[
        Math.min(currentSegmentIndex, effectiveTextSegmentsForDisplay.length - 1)
      ]
    : (singleTextForDisplay ?? dialog.text ?? '');

  /** 多段分頁閱讀時單段通常較短，不必再限制內文區高度造成雙重捲動 */
  const isPagedParagraphs = Boolean(
    effectiveTextSegmentsForDisplay && effectiveTextSegmentsForDisplay.length > 1
  );

  // 對話節點變更時重置分段索引
  useEffect(() => {
    setCurrentSegmentIndex(0);
  }, [dialog.text, explicitSegmentsKey]);

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
        clearContinueTimer();
        continueTimerRef.current = setTimeout(() => setShowContinue(true), 300);
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
      clearContinueTimer();
    };
  }, [currentSegmentText, typewriterSpeed]);

  const isLastSegment =
    !effectiveTextSegmentsForDisplay ||
    currentSegmentIndex >= effectiveTextSegmentsForDisplay.length - 1;
  const showSegmentContinue = Boolean(
    effectiveTextSegmentsForDisplay &&
      effectiveTextSegmentsForDisplay.length > 1 &&
      isComplete &&
      !isLastSegment
  );

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
    clearContinueTimer();
    continueTimerRef.current = setTimeout(() => setShowContinue(true), 100);
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

  /** 淺色銀灰玻璃（系統／道具／旁白等）；有場景立繪 NPC 時改深底 hotspot-glass-npc */
  const isHotspotLightGlass =
    variant === 'hotspot' && !(portraitOnScene && dialog.characterId);

  /* 建議三：統一暗色底 + 左側色條區分類型；variant=hotspot 時改為銀灰玻璃互動框（第一～六章統一） */
  const getTypeStyles = () => {
    if (variant === 'hotspot') {
      const glass =
        portraitOnScene && dialog.characterId ? 'hotspot-glass-npc' : 'hotspot-glass';
      return {
        container: `${glass} text-white w-[min(360px,calc(100vw-2rem))] max-h-[min(85vh,calc(100vh-2rem-env(safe-area-inset-bottom)))] min-h-[200px] rounded-lg p-3 md:p-4 shadow-2xl`,
        icon: isHotspotLightGlass ? 'text-white' : 'text-slate-500',
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

  const outerMotionClass = reduceMotion
    ? ''
    : 'transition-opacity duration-500 motion-safe-dialog-transition';
  const cardMotionClass = reduceMotion
    ? ''
    : 'transition-all duration-500 motion-safe-dialog-transition';
  const cardEnterClass = reduceMotion
    ? isVisible
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-100'
    : isVisible
      ? 'translate-y-0 opacity-100 scale-100'
      : 'translate-y-4 opacity-0 scale-95';

  const isEmbedded = embedInParent;
  const hotspotGlassShell =
    variant === 'hotspot' && portraitOnScene && dialog.characterId ? 'hotspot-glass-npc' : 'hotspot-glass';
  /** Hotspot 全螢幕框 + 立繪在場景上：與 play 頁 BottomDock 同寬度縮排，避免框與立繪重疊 */
  const hotspotScenePortraitLayout =
    variant === 'hotspot' && portraitOnScene && !!dialog.characterId && !embedInParent;
  const portraitSide: 'left' | 'right' = dialog.characterPosition === 'left' ? 'left' : 'right';

  const fullscreenShellClass = containedInOverlay
    ? 'absolute inset-0 z-10'
    : 'fixed inset-0 z-50';

  const embeddedCardClass =
    isEmbedded && variant === 'hotspot'
      ? `${hotspotGlassShell} text-white w-full h-full min-h-0 max-w-full max-h-full rounded-tl-xl rounded-br-none p-2 md:p-4 shadow-2xl`
      : isEmbedded
        ? 'bg-gradient-to-br from-gray-950/50 via-gray-900/50 to-gray-950/50 border-orange-700/30 text-gray-100 w-full h-full min-h-0 max-w-full max-h-full rounded-tl-xl rounded-br-none p-2 md:p-4'
        : variant === 'hotspot'
          ? styles.container
          : `${styles.container} w-[min(360px,calc(100vw-2rem))] max-h-[min(85vh,calc(100vh-2rem-env(safe-area-inset-bottom)))] min-h-[200px] rounded-lg p-3 md:p-4`;

  return (
    <div 
      className={`${outerMotionClass} ${
        isEmbedded
          ? 'w-full h-full flex items-end justify-end p-2 md:p-3 pointer-events-none'
          : hotspotScenePortraitLayout
          ? `${fullscreenShellClass} flex items-end pointer-events-none p-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6 md:pb-8 ${
              portraitSide === 'left' ? 'justify-end' : 'justify-start'
            }`
          : `${fullscreenShellClass} flex items-end justify-center p-4 pointer-events-none md:items-center md:p-8 md:pb-8 ${
              reserveBottomSpace
                ? 'pb-[calc(3.5rem+max(1rem,env(safe-area-inset-bottom)))] md:pb-8'
                : 'pb-[max(1rem,env(safe-area-inset-bottom))]'
            }`
      } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogTitleId}
      className={`flex flex-col rounded-lg pointer-events-auto shadow-2xl transform gpu-accelerated overflow-hidden ${cardMotionClass} ${
        variant === 'hotspot' ? '' : 'border-2 backdrop-blur-xl'
      } ${embeddedCardClass} ${cardEnterClass}`}
      style={
        hotspotScenePortraitLayout
          ? {
              /* 預留一側給場景立繪（約 38vw），與 play 頁 BottomDock 視覺一致 */
              maxWidth: 'min(360px, calc(100vw - 38vw - 1.25rem))',
            }
          : undefined
      }
      >
        {/* 標題欄：hotspot 字級由 dialog-hotspot-title 統一；舊版 default 嵌入仍用父層 em 縮放 */}
        <div
          className={`flex justify-between items-center border-b flex-shrink-0 gap-2 ${
            isHotspotLightGlass ? 'border-white/15' : 'border-white/10'
          } ${
            isEmbedded
              ? variant !== 'hotspot'
                ? 'pb-1 mb-1 gap-1.5 text-[0.6em] md:pb-1.5 md:mb-1.5 md:gap-2'
                : 'pb-1 mb-1 gap-1.5 md:pb-1.5 md:mb-1.5 md:gap-2'
              : 'mb-4 pb-3'
          }`}
        >
          <div
            id={dialogTitleId}
            className={`${styles.icon} flex items-center gap-2 min-w-0 flex-1 ${
              variant === 'hotspot'
                ? 'dialog-hotspot-title'
                : `text-ui-title uppercase tracking-widest ${
                    isEmbedded ? 'line-clamp-2 break-words' : 'text-xs break-words'
                  }`
            }`}
          >
            {dialog.type === 'broadcast' && (
              <span className={`w-2 h-2 bg-red-400 rounded-full ${styles.pulse}`}></span>
            )}
            {mode === 'npc' && 'NPC 對話'}
            {mode !== 'npc' && dialog.type === 'broadcast' && '廣播'}
            {mode !== 'npc' && dialog.type === 'item' && '道具'}
            {mode !== 'npc' && dialog.type === 'system' && '系統'}
            {mode !== 'npc' && dialog.type === 'choice' && '選擇'}
            {mode !== 'npc' && dialog.type === 'character' && (
              <span className="line-clamp-2 break-words whitespace-pre-line min-w-0">
                {formatNpcDisplayName(dialog.characterName || '角色')}
              </span>
            )}
            {mode !== 'npc' && !dialog.type && '旁白'}
          </div>
          <div className="flex items-center gap-2">
            {/* 快速跳過按鈕 */}
            {!isComplete && (
              <button
                type="button"
                onMouseDown={handleSkip}
                onMouseUp={handleSkipRelease}
                onMouseLeave={handleSkipRelease}
                onTouchStart={handleSkip}
                onTouchEnd={handleSkipRelease}
                className={
                  isHotspotLightGlass
                    ? 'text-white/75 hover:text-orange-400 transition-all duration-200 motion-reduce:transition-none p-1 hover:bg-white/10 rounded'
                    : 'text-gray-400 hover:text-orange-400 transition-all duration-200 motion-reduce:transition-none p-1 hover:bg-white/10 rounded'
                }
                aria-label="按住略過文字"
                title="按住快速跳過"
              >
                <SkipForward size={16} aria-hidden />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={
                isHotspotLightGlass
                  ? 'text-white/75 hover:text-white transition-all duration-200 motion-reduce:transition-none p-1 hover:bg-white/10 rounded hover:rotate-90 motion-reduce:hover:rotate-0'
                  : 'text-gray-400 hover:text-white transition-all duration-200 motion-reduce:transition-none p-1 hover:bg-white/10 rounded hover:rotate-90 motion-reduce:hover:rotate-0'
              }
              aria-label="關閉對話"
              title="關閉"
            >
              <X size={18} aria-hidden />
            </button>
          </div>
        </div>

        {dialog.title && (
          <div
            className={`text-ui-caption flex-shrink-0 ${
              variant === 'hotspot'
                ? isHotspotLightGlass
                  ? 'text-white/85'
                  : 'text-slate-500'
                : 'text-gray-300'
            } ${
              variant === 'hotspot'
                ? 'mb-1 md:mb-2 text-[0.6875rem] min-[380px]:text-xs sm:text-sm'
                : isEmbedded
                  ? 'mb-0.5 md:mb-1 text-[0.65em]'
                  : 'mb-2'
            }`}
          >
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
          className={`flex gap-3 min-h-0 flex-1 ${isPagedParagraphs && !isEmbedded ? 'overflow-y-visible' : 'overflow-y-auto'} ${isEmbedded ? 'gap-1.5 mb-0.5 md:gap-2 md:mb-1' : 'mb-3'} ${canClickToContinue ? 'cursor-pointer' : ''} ${
          portraitShownInline ? (
            dialog.characterPosition === 'left' ? 'flex-row' : 'flex-row-reverse'
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
          <div
            className={`flex-1 leading-relaxed min-h-[3rem] whitespace-pre-line ${
              variant === 'hotspot'
                ? `dialog-hotspot-body ${
                    isEmbedded
                      ? 'min-h-0 max-h-none overflow-y-auto'
                      : isPagedParagraphs
                        ? 'max-h-none overflow-visible md:max-h-none'
                        : 'overflow-y-auto max-h-[min(65vh,calc(100vh-7rem-env(safe-area-inset-bottom)))] md:max-h-none'
                  }`
                : isEmbedded
                  ? 'min-h-0 max-h-none overflow-y-auto text-[0.82em] md:text-[0.9em]'
                  : isPagedParagraphs
                    ? 'text-base md:text-lg max-h-none overflow-visible md:max-h-none'
                    : 'text-base md:text-lg overflow-y-auto max-h-[min(65vh,calc(100vh-7rem-env(safe-area-inset-bottom)))] md:max-h-none'
            } ${dialog.svgImage && (dialog.svgPosition === 'top' || dialog.svgPosition === 'bottom') ? 'order-2' : ''}`}
          >
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
                <div className="font-semibold text-sm text-blue-100 group-hover:text-white mb-1">{choice.label}</div>
                {choice.description && (
                  <div className="text-[0.6875rem] min-[380px]:text-xs text-blue-200/70 group-hover:text-blue-100 leading-snug">
                    {choice.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : dialog.choices && dialog.choices.length > 0 && isComplete && isLastSegment ? (
          // 僅單一「繼續」選項時不顯示按鈕，改為點擊內文繼續（見 canClickToContinue）
          isSingleChoiceNext ? null : (
          <div className={isHotspotLightGlass ? 'hotspot-glass-choices' : undefined}>
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
          </div>
          )
        ) : showContinue && mode !== 'npc' ? null : null}
        </div>
      </div>
    </div>
  );
}

