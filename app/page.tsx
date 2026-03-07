'use client';

import { useRouter } from 'next/navigation';
import { Play, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { audioManager, GAME_BGM } from '@/lib/audioManager';
import MuteAllButton from '@/components/MuteAllButton';
import PasswordLoadModal from '@/components/PasswordLoadModal';

export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // 方案一：全遊戲一首 BGM，開頭頁若尚未播放則播放，離開時不中斷
  useEffect(() => {
    if (audioManager.getCurrentAmbientPath() !== GAME_BGM) {
      audioManager.playAmbient(GAME_BGM, 0.4);
    }
    return () => {};
  }, []);

  const handleStartGame = () => {
    setIsTransitioning(true);
    // 不停止 BGM，讓音樂一路播到結局
    // 清除所有遊戲記憶
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('gameState');
        console.log('遊戲記憶已清除');
      } catch (e) {
        console.warn('無法清除遊戲記憶:', e);
      }
    }

    // 等待過場動畫完成後導航到序章，再進入第一章導讀
    setTimeout(() => {
      router.push('/play/prologue');
    }, 800);
  };

  const handlePasswordSuccess = (chapterId: string, sceneId?: string) => {
    setShowPasswordModal(false);
    setIsTransitioning(true);
    setTimeout(() => {
      if (sceneId) {
        router.push(`/play/${chapterId}/${sceneId}`);
      } else {
        router.push(`/play/${chapterId}/intro`);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      {/* 桌面版：手機型窄版置中（與遊戲內一致） */}
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg relative overflow-hidden md:max-w-[clamp(428px,42vw,600px)] md:mx-auto md:min-h-screen md:shadow-2xl md:rounded-[2rem] md:border md:border-dark-border/50 md:[transform:translateZ(0)]">
        <MuteAllButton />
        {/* 主選單底圖 WEBP：以手機直式滿版為主。建議 1080×1920（9:16），≤250KB，置於 /images/main_bg_placeholder.webp */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: 'url(/images/main_bg_placeholder.webp)' }}
        />
        {/* 背景粒子效果：用 index 產生固定數值，避免 SSR 與 client 的 Math.random() 不一致造成 hydration 錯誤 */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float"
            style={{
              left: `${((i * 7 + 13) % 97) + 1}%`,
              top: `${((i * 11 + 31) % 97) + 1}%`,
              animationDelay: `${(i * 0.17) % 3}s`,
              animationDuration: `${3 + (i % 20) / 10}s`,
            }}
          />
        ))}
      </div>

      {/* 過場遮罩 */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-black transition-opacity duration-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-orange-300 text-lg">載入中...</p>
          </div>
        </div>
      )}

      <div className={`text-center max-w-2xl px-4 transition-all duration-800 ${
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        <h1 className="text-[2.7rem] md:text-[3.375rem] font-bold mb-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent animate-fade-float text-center" style={{ animationDelay: '0.1s' }}>
          KK流程偵探<br />最後一場放映
        </h1>
        <p className="text-lg text-orange-300/80 mb-8 animate-fade-float" style={{ animationDelay: '0.2s' }}>
          不要凌晨 00:39，一通沒有顯示來電的電話。城市影城，散場後五分鐘，有人死在 H 排 12 號。散場的燈，延後三分鐘亮起，你不是警察，你只是 KK。
        </p>
        <button
          onClick={handleStartGame}
          className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded-xl transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 animate-pulse-slow"
          style={{ animationDelay: '0.3s' }}
        >
          <Play size={24} />
          開始遊戲
        </button>
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="mt-4 inline-flex items-center gap-2 px-8 py-3 bg-dark-surface/80 hover:bg-dark-surface border border-dark-border/50 text-gray-200 hover:text-white rounded-xl transition-all duration-200 text-base font-medium"
          style={{ animationDelay: '0.35s' }}
        >
          <BookOpen size={20} />
          從章節繼續
        </button>
        <PasswordLoadModal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordSuccess}
        />
        <div className="mt-10 text-sm text-orange-200/60 animate-fade-float" style={{ animationDelay: '0.4s' }}>
          <p>使用滑鼠點擊場景中的物件進行互動</p>
        </div>
      </div>
      </div>
    </div>
  );
}

