'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { isMobileDevice } from '@/lib/performanceUtils';

interface BeamEffectProps {
  show: boolean;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  speed?: number; // 掃描速度（秒）
  color?: string; // 默認 '#fb923c'
  width?: number; // 光束寬度（px）
  intensity?: number; // 0-1，光束強度
  className?: string;
}

export default function BeamEffect({
  show,
  direction = 'right',
  speed = 2.5,
  color = '#fb923c',
  width = 200,
  intensity = 0.3,
  className = '',
}: BeamEffectProps) {
  const isMobile = isMobileDevice();
  // 移動端降低強度和寬度
  const adjustedIntensity = isMobile ? intensity * 0.6 : intensity;
  const adjustedWidth = isMobile ? width * 0.8 : width;

  // 將顏色轉換為 RGB 值用於漸變
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 251, g: 146, b: 60 }; // 默認橙色
  };

  const rgb = hexToRgb(color);
  const colorStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  
  // 根據方向計算初始和結束位置
  const getBeamPosition = () => {
    switch (direction) {
      case 'right':
        return {
          initial: { x: '-100%', y: '50%' },
          animate: { x: '200%', y: '50%' },
          gradient: `linear-gradient(90deg, transparent 0%, rgba(${colorStr}, 0) 20%, rgba(${colorStr}, ${adjustedIntensity}) 50%, rgba(${colorStr}, 0) 80%, transparent 100%)`,
        };
      case 'left':
        return {
          initial: { x: '200%', y: '50%' },
          animate: { x: '-100%', y: '50%' },
          gradient: `linear-gradient(270deg, transparent 0%, rgba(${colorStr}, 0) 20%, rgba(${colorStr}, ${adjustedIntensity}) 50%, rgba(${colorStr}, 0) 80%, transparent 100%)`,
        };
      case 'bottom':
        return {
          initial: { x: '50%', y: '-100%' },
          animate: { x: '50%', y: '200%' },
          gradient: `linear-gradient(180deg, transparent 0%, rgba(${colorStr}, 0) 20%, rgba(${colorStr}, ${adjustedIntensity}) 50%, rgba(${colorStr}, 0) 80%, transparent 100%)`,
        };
      case 'top':
        return {
          initial: { x: '50%', y: '200%' },
          animate: { x: '50%', y: '-100%' },
          gradient: `linear-gradient(0deg, transparent 0%, rgba(${colorStr}, 0) 20%, rgba(${colorStr}, ${adjustedIntensity}) 50%, rgba(${colorStr}, 0) 80%, transparent 100%)`,
        };
      default:
        return {
          initial: { x: '-100%', y: '50%' },
          animate: { x: '200%', y: '50%' },
          gradient: `linear-gradient(90deg, transparent 0%, rgba(${colorStr}, 0) 20%, rgba(${colorStr}, ${adjustedIntensity}) 50%, rgba(${colorStr}, 0) 80%, transparent 100%)`,
        };
    }
  };

  const beamPosition = getBeamPosition();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: adjustedIntensity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
          style={{ zIndex: 1 }}
        >
          {/* 主光束 */}
          <motion.div
            initial={beamPosition.initial}
            animate={beamPosition.animate}
            transition={{
              duration: speed,
              ease: 'linear',
            }}
            className="absolute"
            style={{
              width: direction === 'left' || direction === 'right' ? adjustedWidth : '100%',
              height: direction === 'top' || direction === 'bottom' ? adjustedWidth : '100%',
              background: beamPosition.gradient,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(20px)',
            }}
          />
          
          {/* 輔助光束（更寬但更淡） */}
          <motion.div
            initial={beamPosition.initial}
            animate={beamPosition.animate}
            transition={{
              duration: speed * 1.2,
              ease: 'linear',
              delay: 0.1,
            }}
            className="absolute"
            style={{
              width: direction === 'left' || direction === 'right' ? adjustedWidth * 1.5 : '100%',
              height: direction === 'top' || direction === 'bottom' ? adjustedWidth * 1.5 : '100%',
              background: beamPosition.gradient.replace(new RegExp(`${adjustedIntensity}`, 'g'), String(adjustedIntensity * 0.5)),
              transform: 'translate(-50%, -50%)',
              filter: 'blur(30px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
