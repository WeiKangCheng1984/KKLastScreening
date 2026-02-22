'use client';

import { useEffect, useState, useRef } from 'react';
import { TransitionConfig, transitionEffects } from '@/lib/transitionEffects';
import { audioManager } from '@/lib/audioManager';

interface SceneTransitionProps {
  config: TransitionConfig;
  onComplete?: () => void;
  children: React.ReactNode;
  show?: boolean;
}

export default function SceneTransition({
  config,
  onComplete,
  children,
  show = true,
}: SceneTransitionProps) {
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) {
      setProgress(0);
      setIsTransitioning(false);
      return;
    }

    setIsTransitioning(true);
    setProgress(0);

    // 播放過渡音效
    if (config.type !== 'none') {
      // 過渡效果統一使用同一音效；置於 public/audio/sfx/kk_sfx_transition_soft.mp3
      const soundMap: Record<string, string> = {
        warp: '/audio/sfx/kk_sfx_transition_soft.mp3',
        portal: '/audio/sfx/kk_sfx_transition_soft.mp3',
        dissolve: '/audio/sfx/kk_sfx_transition_soft.mp3',
        flip: '/audio/sfx/kk_sfx_transition_soft.mp3',
      };
      
      const soundPath = soundMap[config.type];
      if (soundPath) {
        audioManager.playSFX(soundPath, 0.3);
      }
    }

    // 執行過渡動畫
    transitionEffects.executeTransition(config, (prog) => {
      setProgress(prog);
    }).then(() => {
      setIsTransitioning(false);
      onComplete?.();
    });
  }, [config, show, onComplete]);

  if (config.type === 'none' || !show) {
    return <>{children}</>;
  }

  const style = transitionEffects.getTransitionStyle(config, progress);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={style}
    >
      {children}
    </div>
  );
}
