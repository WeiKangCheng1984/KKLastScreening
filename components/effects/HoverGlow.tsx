'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { isMobileDevice } from '@/lib/performanceUtils';

interface HoverGlowProps {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'strong';
  color?: string; // 默認 '#fb923c' (orange-400)
  size?: number; // 光暈擴散範圍（px）
  className?: string;
}

export default function HoverGlow({
  isActive,
  intensity = 'medium',
  color = '#fb923c',
  size = 80,
  className = '',
}: HoverGlowProps) {
  // 移動端降低強度
  const isMobile = isMobileDevice();
  const intensityMap = {
    light: { shadow: '0 0 10px', opacity: 0.3, scale: 1.05 },
    medium: { shadow: '0 0 20px', opacity: 0.5, scale: 1.1 },
    strong: { shadow: '0 0 30px', opacity: 0.7, scale: 1.15 },
  };
  
  const currentIntensity = intensityMap[intensity];
  // 移動端降低強度
  const adjustedOpacity = isMobile ? currentIntensity.opacity * 0.6 : currentIntensity.opacity;
  const adjustedShadow = isMobile 
    ? currentIntensity.shadow.replace(/\d+/, (match) => String(Math.floor(parseInt(match) * 0.7)))
    : currentIntensity.shadow;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ 
            opacity: adjustedOpacity,
            scale: currentIntensity.scale,
          }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
          }}
          className={`absolute inset-0 pointer-events-none rounded-full ${className}`}
          style={{
            background: `radial-gradient(circle, ${color}40 0%, ${color}20 40%, transparent 70%)`,
            boxShadow: `${adjustedShadow} ${color}${Math.floor(adjustedOpacity * 255).toString(16).padStart(2, '0')}`,
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          {/* 外層光暈脈動 */}
          <motion.div
            animate={{
              opacity: [adjustedOpacity * 0.5, adjustedOpacity * 0.8, adjustedOpacity * 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}30 0%, transparent 60%)`,
              boxShadow: `0 0 ${size * 0.5}px ${color}${Math.floor(adjustedOpacity * 0.5 * 255).toString(16).padStart(2, '0')}`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
