'use client';

import { m, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { isMobileDevice } from '@/lib/performanceUtils';

interface RippleEffectProps {
  show: boolean;
  position: { x: number; y: number }; // 點擊位置（相對於容器）
  color?: string; // 默認 '#fb923c'
  duration?: number; // 動畫時長（毫秒）
  size?: number; // 最大擴散尺寸（px）
  onComplete?: () => void;
}

export default function RippleEffect({
  show,
  position,
  color = '#fb923c',
  duration = 600,
  size = 120,
  onComplete,
}: RippleEffectProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = isMobileDevice();
  
  // 移動端降低尺寸
  const adjustedSize = isMobile ? size * 0.8 : size;

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(onComplete, 100);
        }
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* 主波紋 */}
          <m.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: 'easeOut',
            }}
            className="absolute rounded-full"
            style={{
              width: adjustedSize,
              height: adjustedSize,
              border: `2px solid ${color}`,
              boxShadow: `0 0 ${adjustedSize * 0.3}px ${color}40`,
            }}
          />
          
          {/* 第二層波紋（延遲） */}
          <m.div
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: 'easeOut',
              delay: 0.1,
            }}
            className="absolute rounded-full"
            style={{
              width: adjustedSize,
              height: adjustedSize,
              border: `1.5px solid ${color}60`,
              boxShadow: `0 0 ${adjustedSize * 0.2}px ${color}30`,
            }}
          />
          
          {/* 第三層波紋（最外層，更淡） */}
          <m.div
            initial={{ scale: 0, opacity: 0.3 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: 'easeOut',
              delay: 0.2,
            }}
            className="absolute rounded-full"
            style={{
              width: adjustedSize,
              height: adjustedSize,
              border: `1px solid ${color}40`,
            }}
          />
          
          {/* 中心點 */}
          <m.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 0, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000 * 0.3,
              ease: 'easeOut',
            }}
            className="absolute rounded-full"
            style={{
              width: adjustedSize * 0.2,
              height: adjustedSize * 0.2,
              backgroundColor: color,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 ${adjustedSize * 0.1}px ${color}`,
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
