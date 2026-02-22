'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { prologueSlides } from '@/data/gameData';
import { getNextPath } from '@/data/flowConfig';
import DialogBox from '@/components/DialogBox';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black relative overflow-hidden px-4">
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
        />
      )}

      {/* 略過序章（置於畫面下方，不遮擋對話框） */}
      {!isTransitioning && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-auto">
          <button
            onClick={handleSkip}
            className="text-sm text-orange-200/60 hover:text-orange-200/80 underline underline-offset-2"
          >
            略過序章
          </button>
        </div>
      )}

      <p className="fixed bottom-12 left-0 right-0 text-center text-orange-200/40 text-sm z-30 pointer-events-none">
        {currentSlide + 1} / {prologueSlides.length}
      </p>
    </div>
  );
}
