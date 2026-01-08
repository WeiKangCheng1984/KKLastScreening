'use client';

import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleStartGame = () => {
    // 清除所有遊戲記憶
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('gameState');
        console.log('遊戲記憶已清除');
      } catch (e) {
        console.warn('無法清除遊戲記憶:', e);
      }
    }
    
    // 導航到遊戲頁面
    router.push('/play/ch1/ch1_sc1');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg">
      <div className="text-center max-w-2xl px-4 animate-fade-float">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent animate-fade-float" style={{ animationDelay: '0.1s' }}>
          FME異物入侵
        </h1>
        <p className="text-lg text-orange-300/80 mb-8 animate-fade-float" style={{ animationDelay: '0.2s' }}>
          你不是來扮演誰的。你只是走進了一個還沒有被做出最後決定的地方。
        </p>
        <button
          onClick={handleStartGame}
          className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded-xl transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 animate-fade-float"
          style={{ animationDelay: '0.3s' }}
        >
          <Play size={24} />
          開始遊戲
        </button>
        <div className="mt-10 text-sm text-orange-200/60 animate-fade-float" style={{ animationDelay: '0.4s' }}>
          <p>使用滑鼠點擊場景中的物件進行互動</p>
        </div>
      </div>
    </div>
  );
}

