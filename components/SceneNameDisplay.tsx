'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import BeamEffect from './effects/BeamEffect';
import GlitchText from './effects/GlitchText';

interface SceneNameDisplayProps {
  sceneName: string;
  sceneDescription?: string; // 保留但不顯示
  show: boolean;
  duration?: number; // 總顯示時長（毫秒），預設 2000ms
  onComplete?: () => void;
}

export default function SceneNameDisplay({
  sceneName,
  show,
  duration = 2000, // 場景名稱大字顯示時長（2 秒）
  onComplete,
}: SceneNameDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showGlitch, setShowGlitch] = useState(true);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setShowGlitch(true);
      
      // 故障效果持續 0.3 秒後停止
      const glitchTimer = setTimeout(() => {
        setShowGlitch(false);
      }, 300);
      
      // 總時長後觸發完成回調
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(() => onComplete(), 300); // 等待淡出動畫完成
        }
      }, duration);

      return () => {
        clearTimeout(timer);
        clearTimeout(glitchTimer);
      };
    } else {
      setIsVisible(false);
      setShowGlitch(false);
    }
  }, [show, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          className="fixed inset-0 z-[70] flex items-center justify-center"
        >
          {/* 全螢幕背景遮罩 - 阻止下層交互 */}
          <div className="absolute inset-0 bg-black/20 pointer-events-auto" />
          
          {/* 光束背景層 */}
          <BeamEffect
            show={isVisible}
            direction="right"
            speed={duration / 1000} // 將毫秒轉換為秒，與場景名稱顯示同步
            color="#fb923c"
            width={300}
            intensity={0.4}
          />
          
          {/* 大文字特效 - 全屏居中 */}
          <div className="text-center px-4 relative z-10 w-full pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -30 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                duration: 0.6,
              }}
              className="w-full"
            >
              {/* 使用故障文字效果 */}
              <div
                className="text-[clamp(1.95rem,7.8vw,5.2rem)] md:text-[clamp(2.6rem,9.75vw,6.5rem)] font-black text-orange-400 tracking-wider leading-none"
                style={{
                  textShadow: `
                    0 0 20px rgba(251, 146, 60, 0.5),
                    0 0 40px rgba(251, 146, 60, 0.3),
                    0 0 60px rgba(251, 146, 60, 0.2),
                    0 0 80px rgba(251, 146, 60, 0.1)
                  `,
                  WebkitTextStroke: '1px rgba(251, 146, 60, 0.3)',
                }}
              >
                <GlitchText
                  text={sceneName}
                  intensity="medium"
                  duration={showGlitch ? 300 : 0}
                  className="block"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
