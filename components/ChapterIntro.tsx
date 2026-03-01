'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Play, ChevronLeft, ChevronRight, RotateCcw, Pause } from 'lucide-react';
import { ChapterIntro as ChapterIntroType } from '@/types/game';
import { audioManager, GAME_BGM } from '@/lib/audioManager';
import { getChapterIntroContinuePath } from '@/data/flowConfig';
import { scenes as scenesMap } from '@/data/gameData';
import FadeIn from './animations/FadeIn';
import SlideIn from './animations/SlideIn';
import ParticleEffect from './animations/ParticleEffect';

interface ChapterIntroProps {
  chapter: {
    id: string;
    name: string;
    intro: ChapterIntroType;
    scenes: string[];
  };
}

export default function ChapterIntro({ chapter }: ChapterIntroProps) {
  const router = useRouter();
  const [currentLayer, setCurrentLayer] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  
  const mediaType = chapter.intro.mediaType || 'image';
  const slides = chapter.intro.slides || [];
  const hasSlides = slides.length > 0;
  const introVideo = chapter.intro.introVideo;

  // 方案二：導讀頁預載該章第一個場景背景圖，點「開始探索」時已進快取
  useEffect(() => {
    const firstSceneId = chapter.scenes?.[0];
    if (!firstSceneId) return;
    const firstScene = scenesMap[firstSceneId];
    const bg = firstScene?.background;
    if (!bg) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = bg;
    document.head.appendChild(link);
    const img = new Image();
    img.onload = () => {
      if (link.parentNode) document.head.removeChild(link);
    };
    img.onerror = () => {
      if (link.parentNode) document.head.removeChild(link);
    };
    img.src = bg;
  }, [chapter.scenes]);

  // 分層顯示動畫 - 各章節一致
  useEffect(() => {
    if (!audioManager.getCurrentAmbientPath()) {
      audioManager.playAmbient(GAME_BGM, 0.5);
    }

    const timers = [
      setTimeout(() => setCurrentLayer(1), 500),
      setTimeout(() => setCurrentLayer(2), 2000),
      setTimeout(() => setCurrentLayer(3), 3500),
      setTimeout(() => setIsReady(true), 5000),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const handleContinue = () => {
    // 如果有導讀影片且尚未播放，先播放影片
    if (introVideo && !showVideo && !videoEnded) {
      setShowVideo(true);
      // 確保影片自動播放
      setTimeout(() => {
        if (introVideoRef.current) {
          introVideoRef.current.play().catch(() => {
            // 如果自動播放失敗，手動觸發
            console.warn('影片自動播放失敗，需要用戶互動');
          });
        }
      }, 100);
      return;
    }
    
    // 影片播放完畢或沒有影片，進入場景
    navigateToScene();
  };

  const navigateToScene = () => {
    setIsTransitioning(true);
    
    // 標記已看過導讀
    if (typeof window !== 'undefined') {
      localStorage.setItem(`chapter_${chapter.id}_intro_seen`, 'true');
    }
    
    // 不停止 BGM，讓音樂持續到結局
    
    // 由流程設定決定：ch1 進第一景，ch2 進 hub 等
    const nextPath = getChapterIntroContinuePath(chapter.id) || `/play/${chapter.id}/${chapter.scenes[0]}`;
    setTimeout(() => {
      router.push(nextPath);
    }, 500);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowContinueButton(true);
    // 不再自動進入，等待玩家點擊繼續
  };

  const handleReplayVideo = () => {
    if (introVideoRef.current) {
      introVideoRef.current.currentTime = 0;
      introVideoRef.current.play();
      setVideoEnded(false);
      setShowContinueButton(false);
    }
  };

  const handleTogglePause = () => {
    if (introVideoRef.current) {
      if (introVideoRef.current.paused) {
        introVideoRef.current.play();
        setVideoPaused(false);
      } else {
        introVideoRef.current.pause();
        setVideoPaused(true);
      }
    }
  };

  const handleContinueAfterVideo = () => {
    setShowVideo(false);
    setVideoEnded(false);
    setShowContinueButton(false);
    navigateToScene();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg relative overflow-hidden">
      {/* 過場遮罩 */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-black transition-opacity duration-500 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-orange-300 text-lg">載入中...</p>
          </div>
        </div>
      )}

      {/* 背景媒體 */}
      {mediaType === 'image' && chapter.intro.backgroundImage && (
        <FadeIn delay={0} duration={1}>
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${chapter.intro.backgroundImage})` }}
          />
        </FadeIn>
      )}

      {mediaType === 'video' && chapter.intro.backgroundVideo && (
        <div className="absolute inset-0 opacity-20">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={chapter.intro.backgroundVideo} type="video/mp4" />
          </video>
        </div>
      )}

      {mediaType === 'slideshow' && hasSlides && (
        <div className="absolute inset-0 opacity-20">
          {slides.map((slide, index) => (
            <FadeIn
              key={index}
              delay={0}
              duration={1}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {slide.video ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              ) : slide.image ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              ) : null}
            </FadeIn>
          ))}
          
          {/* 輪播控制 */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              <button
                onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-orange-400 w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 背景粒子效果：各章節一致 */}
      <ParticleEffect count={15} color="rgba(251, 146, 60, 0.5)" />

      {/* 導讀影片播放 - 方形框架（響應式） */}
      {showVideo && introVideo && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
            {/* 外框 - 符合遊戲風格 */}
            <div className="absolute inset-0 border-2 sm:border-4 border-dark-border/50 rounded-lg bg-dark-surface/20 backdrop-blur-md shadow-2xl">
              {/* 內框裝飾 */}
              <div className="absolute inset-1 sm:inset-2 border border-orange-500/30 sm:border-2 rounded-md"></div>
              {/* 角落裝飾 */}
              <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-4 h-4 sm:w-6 sm:h-6 border-t border-l border-orange-500/50 sm:border-t-2 sm:border-l-2"></div>
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 border-t border-r border-orange-500/50 sm:border-t-2 sm:border-r-2"></div>
              <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-4 h-4 sm:w-6 sm:h-6 border-b border-l border-orange-500/50 sm:border-b-2 sm:border-l-2"></div>
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 border-b border-r border-orange-500/50 sm:border-b-2 sm:border-r-2"></div>
            </div>
            
            {/* 影片容器 - 方形（響應式） */}
            <div className="relative w-[calc(100%-16px)] sm:w-[440px] aspect-square rounded-md overflow-hidden bg-black">
              <video
                ref={introVideoRef}
                autoPlay
                controls={false}
                playsInline
                className="w-full h-full object-cover"
                onEnded={handleVideoEnd}
                onPlay={() => setVideoPaused(false)}
                onPause={() => setVideoPaused(true)}
              >
                <source src={introVideo} type="video/mp4" />
              </video>
              
              {/* 影片結束後的覆蓋層 */}
              {showContinueButton && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center space-y-3 sm:space-y-4 px-4">
                    <p className="text-white text-sm sm:text-lg mb-3 sm:mb-4">影片播放完畢</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center w-full">
                      <button
                        onClick={handleReplayVideo}
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-dark-surface/90 hover:bg-dark-surface border border-dark-border/50 hover:border-orange-500/50 text-white rounded transition-all duration-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={14} className="sm:w-4 sm:h-4" />
                        重播
                      </button>
                      <button
                        onClick={handleContinueAfterVideo}
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded transition-all duration-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Play size={14} className="sm:w-4 sm:h-4" />
                        繼續
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 控制按鈕組（響應式） */}
            <div className="absolute bottom-2 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
              {/* 暫停/播放按鈕 */}
              {!showContinueButton && (
                <button
                  onClick={handleTogglePause}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-dark-surface/90 hover:bg-dark-surface border border-dark-border/50 hover:border-orange-500/50 text-gray-300 hover:text-white rounded transition-all duration-200 text-[10px] sm:text-xs font-medium backdrop-blur-sm flex items-center gap-1 sm:gap-1.5"
                  title={videoPaused ? '播放' : '暫停'}
                >
                  {videoPaused ? <Play size={12} className="sm:w-3.5 sm:h-3.5" /> : <Pause size={12} className="sm:w-3.5 sm:h-3.5" />}
                </button>
              )}
              
              {/* 重播按鈕 */}
              {!showContinueButton && (
                <button
                  onClick={handleReplayVideo}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-dark-surface/90 hover:bg-dark-surface border border-dark-border/50 hover:border-orange-500/50 text-gray-300 hover:text-white rounded transition-all duration-200 text-[10px] sm:text-xs font-medium backdrop-blur-sm flex items-center gap-1 sm:gap-1.5"
                  title="重播"
                >
                  <RotateCcw size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
              )}
              
              {/* 跳過按鈕 */}
              {!showContinueButton && (
                <button
                  onClick={handleContinueAfterVideo}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-dark-surface/90 hover:bg-dark-surface border border-dark-border/50 hover:border-orange-500/50 text-gray-300 hover:text-white rounded transition-all duration-200 text-[10px] sm:text-xs font-medium backdrop-blur-sm"
                >
                  跳過
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 內容層 */}
      <div className={`relative z-10 text-center max-w-4xl px-6 transition-opacity duration-500 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}>
        {/* 第一層：標題 */}
        {currentLayer >= 1 && (
          <SlideIn direction="up" delay={0.5} duration={1}>
            <h1 className="text-[2.7rem] md:text-[4.05rem] font-bold mb-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent text-center whitespace-pre-line">
              {chapter.intro.title.replace(/：/g, '\n')}
            </h1>
            <p className="text-xl md:text-2xl text-orange-300/80 mb-8">
              {chapter.intro.subtitle}
            </p>
          </SlideIn>
        )}

        {/* 第二層：描述 */}
        {currentLayer >= 2 && (
          <SlideIn direction="up" delay={0.3} duration={1}>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              {chapter.intro.description}
            </p>
          </SlideIn>
        )}

        {/* 第三層：心理文字；無內容時不顯示區塊 */}
        {currentLayer >= 3 && chapter.intro.moodText?.trim() && (
          <SlideIn direction="up" delay={0.5} duration={1}>
            <p className="text-base md:text-lg text-orange-200/70 leading-relaxed whitespace-pre-line mb-12">
              {chapter.intro.moodText}
            </p>
          </SlideIn>
        )}

        {/* 繼續按鈕 */}
        {isReady && (
          <FadeIn delay={0.3} duration={0.5}>
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded-xl transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              <Play size={24} />
              {introVideo && !showVideo && !videoEnded ? '觀看影片' : '開始探索'}
            </button>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
