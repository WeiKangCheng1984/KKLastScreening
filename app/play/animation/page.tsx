'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { getStep, getNextPath } from '@/data/flowConfig';

const STEP_ID = 'animation_1';

export default function AnimationPage() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const step = getStep(STEP_ID);
  const videoSrc = step?.type === 'animation' ? step.video : undefined;

  const goNext = useCallback(() => {
    setIsTransitioning(true);
    const nextPath = getNextPath(STEP_ID);
    setTimeout(() => router.push(nextPath), 500);
  }, [router]);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      goNext();
    }
  }, [goNext]);

  const handleEnded = useCallback(() => {
    goNext();
  }, [goNext]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      {/* 桌面版：手機型窄版置中（與遊戲內一致） */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden p-3 sm:p-4 md:max-w-[428px] md:mx-auto md:min-h-screen md:shadow-2xl md:rounded-[2rem] md:border md:border-dark-border/50 md:[transform:translateZ(0)]">
        {isTransitioning && (
          <div className="fixed inset-0 z-50 bg-black animate-in fade-in duration-500 flex items-center justify-center">
            <p className="text-orange-300">載入中...</p>
          </div>
        )}

        {/* 動畫框架：正方形 1:1、手機可完整呈現、雅致細框 */}
        <div className="relative aspect-square w-[min(85vw,75vh)] max-w-[380px] overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 shadow-xl shadow-black/40 ring-1 ring-inset ring-white/5">
        {videoSrc ? (
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              className="h-full w-full object-contain"
              playsInline
              onEnded={handleEnded}
            />
            {/* 未播放時顯示播放按鈕 */}
            {!isPlaying && (
              <button
                type="button"
                onClick={handlePlay}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                aria-label="播放"
              >
                <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-orange-500/90 shadow-lg hover:bg-orange-500 transition-colors">
                  <Play size={28} className="ml-0.5 text-white sm:size-8" fill="currentColor" />
                </span>
              </button>
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-orange-200/80">
            <p className="mb-4 text-sm sm:text-base">無動畫設定</p>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 hover:bg-white/20"
            >
              <Play size={18} />
              繼續
            </button>
          </div>
        )}
      </div>

        {/* 略過（與序章文案同風格：置於畫面下方中央） */}
        {videoSrc && (
          <div className="fixed left-0 right-0 flex justify-center z-20 pointer-events-auto pb-[max(0.5rem,env(safe-area-inset-bottom))] bottom-6">
            <button
              type="button"
              onClick={goNext}
              className="text-sm text-orange-200/60 hover:text-orange-200/80 underline underline-offset-2"
            >
              略過
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
