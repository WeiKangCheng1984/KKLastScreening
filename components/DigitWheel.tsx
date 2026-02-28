'use client';

import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ITEM_HEIGHT = 44;
const VISIBLE_HEIGHT = 88;

interface DigitWheelProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  ariaLabel?: string;
  accent?: boolean;
}

export default function DigitWheel({
  value,
  onChange,
  min = 0,
  max = 9,
  ariaLabel = '選擇數字',
  accent = false,
}: DigitWheelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingFromUser = useRef(false);
  const scrollLockRef = useRef(false);

  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const n = options.length;
  const optionsTripled = [...options, ...options, ...options];

  /** 捲動到「中間區塊」的某個邏輯索引，視覺上就像環狀連續 */
  const scrollToLogicalIndex = useCallback(
    (logicalIdx: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const targetScroll = (n + logicalIdx) * ITEM_HEIGHT;
      el.scrollTo({ top: targetScroll, behavior: 'smooth' });
    },
    [n]
  );

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = options.indexOf(value);
    if (idx >= 0) {
      el.scrollTop = (n + idx) * ITEM_HEIGHT;
    }
  }, []);

  useEffect(() => {
    if (isScrollingFromUser.current || scrollLockRef.current) return;
    const idx = options.indexOf(value);
    if (idx >= 0) scrollToLogicalIndex(idx);
  }, [value, options.join(','), scrollToLogicalIndex]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || scrollLockRef.current) return;
    const rawIndex = Math.round(el.scrollTop / ITEM_HEIGHT);
    if (rawIndex < n) {
      const logicalIdx = rawIndex;
      isScrollingFromUser.current = true;
      onChange(options[logicalIdx]);
      scrollLockRef.current = true;
      requestAnimationFrame(() => {
        el.scrollTo({ top: (n + logicalIdx) * ITEM_HEIGHT, behavior: 'auto' });
        scrollLockRef.current = false;
        setTimeout(() => {
          isScrollingFromUser.current = false;
        }, 50);
      });
      return;
    }
    if (rawIndex >= 2 * n) {
      const logicalIdx = rawIndex - 2 * n;
      isScrollingFromUser.current = true;
      onChange(options[logicalIdx]);
      scrollLockRef.current = true;
      requestAnimationFrame(() => {
        el.scrollTo({ top: (n + logicalIdx) * ITEM_HEIGHT, behavior: 'auto' });
        scrollLockRef.current = false;
        setTimeout(() => {
          isScrollingFromUser.current = false;
        }, 50);
      });
      return;
    }
    const logicalIdx = rawIndex - n;
    const newValue = options[logicalIdx];
    if (newValue !== value) {
      isScrollingFromUser.current = true;
      onChange(newValue);
      setTimeout(() => {
        isScrollingFromUser.current = false;
      }, 100);
    }
  }, [onChange, value, options, n]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = options.indexOf(value);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (idx + 1) % n;
        onChange(options[nextIdx]);
        scrollToLogicalIndex(nextIdx);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const nextIdx = (idx - 1 + n) % n;
        onChange(options[nextIdx]);
        scrollToLogicalIndex(nextIdx);
      }
    },
    [value, options, onChange, scrollToLogicalIndex, n]
  );

  const goUp = useCallback(() => {
    const idx = options.indexOf(value);
    const nextIdx = (idx - 1 + n) % n;
    onChange(options[nextIdx]);
    scrollToLogicalIndex(nextIdx);
  }, [value, options, onChange, scrollToLogicalIndex, n]);

  const goDown = useCallback(() => {
    const idx = options.indexOf(value);
    const nextIdx = (idx + 1) % n;
    onChange(options[nextIdx]);
    scrollToLogicalIndex(nextIdx);
  }, [value, options, onChange, scrollToLogicalIndex, n]);

  const halfPad = (VISIBLE_HEIGHT - ITEM_HEIGHT) / 2;

  const btnBase =
    'flex h-11 min-h-[44px] w-full items-center justify-center rounded-lg border transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-dark-surface select-none touch-manipulation';
  const btnAccent =
    'border-industrial-orange/40 bg-industrial-orange/10 text-industrial-orange hover:bg-industrial-orange/20 hover:border-industrial-orange/60 focus-visible:ring-industrial-orange/50';
  const btnNormal =
    'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 hover:border-white/30 focus-visible:ring-white/30';

  return (
    <div className="flex w-12 flex-col items-center gap-1 sm:w-14">
      <button
        type="button"
        onClick={goUp}
        aria-label={`${ariaLabel}：增加（可循環）`}
        className={`${btnBase} ${accent ? btnAccent : btnNormal}`}
      >
        <ChevronUp className="h-6 w-6 sm:h-5 sm:w-5" strokeWidth={2.5} />
      </button>

      {/* 轉盤：環狀視覺 */}
      <div className="relative w-full">
        {/* 上下漸層：營造圓柱邊緣淡出 */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[28px] rounded-t-xl bg-gradient-to-b from-dark-surface via-dark-surface/80 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[28px] rounded-b-xl bg-gradient-to-t from-dark-surface via-dark-surface/80 to-transparent"
          aria-hidden
        />
        {/* 左右極淡陰影：環的弧度感 */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-3 bg-gradient-to-r from-dark-surface/90 to-transparent rounded-l-xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-3 bg-gradient-to-l from-dark-surface/90 to-transparent rounded-r-xl"
          aria-hidden
        />
        {/* 中央高亮：密碼鎖對齊線 */}
        <div
          className="pointer-events-none absolute left-0 right-0 z-10 flex h-[44px] items-center justify-center"
          style={{ top: halfPad }}
          aria-hidden
        >
          <div
            className={`
              h-full w-full rounded
              border-y-2 border-industrial-orange/50
              bg-industrial-orange/5
              shadow-[0_0_24px_rgba(234,88,12,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]
              ${accent ? 'border-industrial-orange/70 bg-industrial-orange/10' : ''}
            `}
          />
        </div>

        <div
          ref={scrollRef}
          role="listbox"
          aria-label={ariaLabel}
          aria-valuenow={value}
          tabIndex={0}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className={`
            relative z-0 flex flex-col items-center overflow-x-hidden overflow-y-auto
            rounded-xl border bg-dark-surface/90
            shadow-[inset_0_0_28px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.2)]
            backdrop-blur-sm
            scrollbar-hide
            snap-y snap-mandatory
            touch-pan-y
            [-webkit-overflow-scrolling:touch]
            ${accent
              ? 'border-industrial-orange/40 ring-1 ring-industrial-orange/15'
              : 'border-white/10 ring-1 ring-white/5'
            }
          `}
          style={{
            scrollSnapType: 'y mandatory',
            height: VISIBLE_HEIGHT,
          }}
        >
          <div style={{ height: halfPad, flexShrink: 0 }} aria-hidden />
          {optionsTripled.map((num, i) => {
            const isSelected = num === value;
            return (
              <div
                key={`${i}-${num}`}
                className={`
                  flex flex-shrink-0 items-center justify-center snap-center
                  text-xl font-semibold tabular-nums tracking-[0.2em]
                  transition-colors duration-150
                  ${isSelected
                    ? accent
                      ? 'text-industrial-orange drop-shadow-[0_0_8px_rgba(234,88,12,0.45)]'
                      : 'text-gray-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]'
                    : 'text-gray-500'
                  }
                `}
                style={{ height: ITEM_HEIGHT }}
                role="option"
                aria-selected={isSelected}
              >
                {num}
              </div>
            );
          })}
          <div style={{ height: halfPad, flexShrink: 0 }} aria-hidden />
        </div>
      </div>

      <button
        type="button"
        onClick={goDown}
        aria-label={`${ariaLabel}：減少（可循環）`}
        className={`${btnBase} ${accent ? btnAccent : btnNormal}`}
      >
        <ChevronDown className="h-6 w-6 sm:h-5 sm:w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
