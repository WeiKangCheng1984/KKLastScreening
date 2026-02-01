'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { prologueSlides } from '@/data/gameData';
import { ChevronRight } from 'lucide-react';

export default function ProloguePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = useCallback(() => {
    if (currentSlide < prologueSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        router.push('/play/ch1/intro');
      }, 600);
    }
  }, [currentSlide, router]);

  const handleSkip = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('/play/ch1/intro');
    }, 600);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black relative overflow-hidden px-4">
      {/* 過場遮罩 */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-black animate-in fade-in duration-500" />
      )}

      <div
        className={`max-w-2xl w-full transition-all duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <p className="text-orange-100/95 text-lg md:text-xl leading-relaxed whitespace-pre-line text-center">
          {prologueSlides[currentSlide]}
        </p>

        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-orange-100 rounded-xl transition-all text-base font-medium"
          >
            {currentSlide < prologueSlides.length - 1 ? '下一段' : '進入第一章'}
            <ChevronRight size={20} />
          </button>
          <button
            onClick={handleSkip}
            className="text-sm text-orange-200/60 hover:text-orange-200/80 underline underline-offset-2"
          >
            略過序章
          </button>
        </div>

        <p className="mt-8 text-center text-orange-200/40 text-sm">
          {currentSlide + 1} / {prologueSlides.length}
        </p>
      </div>
    </div>
  );
}
