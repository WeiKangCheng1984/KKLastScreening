'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';

/** 正上方一鍵靜音／取消靜音，簡單呈現，三頁共用 */
export default function MuteAllButton() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(audioManager.getMuted());
    const t = setInterval(() => setIsMuted(audioManager.getMuted()), 300);
    return () => clearInterval(t);
  }, []);

  const handleToggle = () => {
    audioManager.toggleMute();
    setIsMuted(audioManager.getMuted());
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="fixed top-4 left-[70%] -translate-x-1/2 z-30 flex items-center justify-center w-[2.2rem] h-[2.2rem] rounded-full bg-black/40 border border-white/20 text-white/90 hover:bg-black/60 hover:text-white transition-colors shadow-lg"
      title={isMuted ? '開啟聲音' : '關閉所有聲音'}
      aria-label={isMuted ? '開啟聲音' : '關閉所有聲音'}
    >
      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
