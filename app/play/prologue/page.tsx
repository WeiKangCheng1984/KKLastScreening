'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { prologueSlides } from '@/data/chapters';
import { getNextPath } from '@/data/flowConfig';
import { audioManager, GAME_BGM } from '@/lib/audioManager';
import MuteAllButton from '@/components/MuteAllButton';
import FadeIn from '@/components/animations/FadeIn';

/** 序章背景圖：置於 public/images/prologue_bg.webp（建議尺寸 828×1284 或 1080×1920，直式） */
const PROLOGUE_BG = '/images/prologue_bg.webp';

/** 一頁顯示的段落數（一頁多段） */
const PARAGRAPHS_PER_PAGE = 4;

/** 將序章文案依 PARAGRAPHS_PER_PAGE 分組成多頁 */
function chunkProloguePages(slides: string[], perPage: number): string[][] {
  const pages: string[][] = [];
  for (let i = 0; i < slides.length; i += perPage) {
    pages.push(slides.slice(i, i + perPage));
  }
  return pages;
}

export default function ProloguePage() {
  const router = useRouter();
  const pages = useMemo(() => chunkProloguePages(prologueSlides, PARAGRAPHS_PER_PAGE), []);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 若尚未播放 BGM 則播放（從書籤/直連進入時也有音樂），不中斷
  useEffect(() => {
    if (!audioManager.getCurrentAmbientPath()) {
      audioManager.playAmbient(GAME_BGM, 0.4);
    }
    return () => {};
  }, []);

  const handleContinue = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setIsTransitioning(true);
      const nextPath = getNextPath('prologue_text');
      setTimeout(() => router.push(nextPath), 600);
    }
  }, [currentPage, pages.length, router]);

  const handleSkip = useCallback(() => {
    setIsTransitioning(true);
    const nextPath = getNextPath('prologue_text');
    setTimeout(() => router.push(nextPath), 600);
  }, [router]);

  const currentParagraphs = pages[currentPage] ?? [];

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      {/* 桌面版：手機型窄版置中（與遊戲內一致） */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black relative overflow-hidden px-4 md:max-w-[clamp(428px,42vw,600px)] md:mx-auto md:min-h-screen md:shadow-2xl md:rounded-[2rem] md:border md:border-dark-border/50 md:[transform:translateZ(0)]">
        <MuteAllButton />
        {/* 序章背景圖（可選：放置 prologue_bg.webp 即顯示） */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${PROLOGUE_BG})` }}
          aria-hidden
        />
        {isTransitioning && (
          <div className="fixed inset-0 z-[60] bg-black animate-in fade-in duration-500" />
        )}

        {/* 一頁多段：無打字機，整頁一次顯示多段文案 */}
        {!isTransitioning && (
          <FadeIn delay={0} duration={0.4}>
            <div className="relative z-10 w-full max-w-[360px] mx-auto">
              <div className="bg-dark-surface/80 border border-dark-border/50 rounded-xl p-6 shadow-xl text-left space-y-4 min-h-[280px] flex flex-col justify-between">
                <div className="space-y-4">
                  {currentParagraphs.map((line, i) => (
                    <p key={i} className="text-gray-200 leading-relaxed text-base md:text-lg">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleContinue}
                    className="px-5 py-2.5 bg-gradient-to-r from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
                  >
                    {currentPage < pages.length - 1 ? '繼續' : '進入第一章'}
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* 略過序章：固定在最底下，留安全區 */}
        {!isTransitioning && (
          <div className="fixed left-0 right-0 bottom-0 flex flex-col items-center z-[60] pointer-events-auto pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <p className="text-orange-200/40 text-xs mb-1 pointer-events-none">
              {currentPage + 1} / {pages.length}
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
