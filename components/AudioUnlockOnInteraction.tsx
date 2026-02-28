'use client';

import { useEffect } from 'react';
import { audioManager } from '@/lib/audioManager';

/**
 * 在第一次使用者點擊/觸控時嘗試播放暫存的 BGM，
 * 解決手機瀏覽器 autoplay 政策導致 BGM 不播的問題。
 */
export function AudioUnlockOnInteraction() {
  useEffect(() => {
    const tryUnlock = () => {
      if (audioManager.getPendingAmbientPath()) {
        audioManager.tryPlayPendingAmbient();
      }
    };

    const opts = { once: true, passive: true } as AddEventListenerOptions;
    document.addEventListener('click', tryUnlock, opts);
    document.addEventListener('touchstart', tryUnlock, opts);

    return () => {
      document.removeEventListener('click', tryUnlock);
      document.removeEventListener('touchstart', tryUnlock);
    };
  }, []);

  return null;
}
