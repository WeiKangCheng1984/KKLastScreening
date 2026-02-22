'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { prologueSlides } from '@/data/gameData';
import { getNextPath } from '@/data/flowConfig';
import DialogBox from '@/components/DialogBox';

/** 序章背景圖：置於 public/images/prologue_bg.webp（建議尺寸 828×1284 或 1080×1920，直式） */
const PROLOGUE_BG = '/images/prologue_bg.webp';

export default function ProloguePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleContinue = useCallback(() => {
    if (currentSlide < prologueSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setIsTransitioning(true);
      const nextPath = getNextPath('prologue_text');
      setTimeout(() => router.push(nextPath), 600);
    }
  }, [currentSlide, router]);

  const handleSkip = useCallback(() => {
    setIsTransitioning(true);
    const nextPath = getNextPath('prologue_text');
    setTimeout(() => router.push(nextPath), 600);
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      {/* 桌面版：手機型窄版置中（與遊戲內一致） */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black relative overflow-hidden px-4 md:max-w-[428px] md:mx-auto md:min-h-screen md:shadow-2xl md:rounded-[2rem] md:border md:border-dark-border/50 md:[transform:translateZ(0)]">
        {/* 序章背景圖（可選：放置 prologue_bg.webp 即顯示） */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${PROLOGUE_BG})` }}
          aria-hidden
        />
        {isTransitioning && (
          <div className="fixed inset-0 z-[60] bg-black animate-in fade-in duration-500" />
        )}

        {/* 與遊戲內同風格：使用 DialogBox 呈現序章文案 */}
      {!isTransitioning && (
        <DialogBox
          dialog={{
            text: prologueSlides[currentSlide],
            type: 'narrator',
          }}
          onClose={handleContinue}
          typewriterSpeed={30}
          reserveBottomSpace
        />
      )}

      {/* 略過序章：固定在最底下，留安全區；對話框已預留空間故不重疊 */}
      {!isTransitioning && (
        <div className="fixed left-0 right-0 bottom-0 flex flex-col items-center z-[60] pointer-events-auto pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <p className="text-orange-200/40 text-xs mb-1 pointer-events-none">
            {currentSlide + 1} / {prologueSlides.length}
          </p>
          <button
            onClick={handleSkip}
            className="text-sm text-orange-200/60 hover:text-orange-200/80 underline underline-offset-2"
          >
            略過序章
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
