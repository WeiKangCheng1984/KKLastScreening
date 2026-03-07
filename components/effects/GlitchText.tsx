'use client';

import { m } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  duration?: number; // 故障效果持續時間（毫秒）
  style?: React.CSSProperties;
}

export default function GlitchText({
  text,
  className = '',
  intensity = 'medium',
  duration = 300,
  style,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      setIsGlitching(true);
      const timer = setTimeout(() => {
        setIsGlitching(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const intensityMap = {
    light: { offset: 2, blur: 1 },
    medium: { offset: 4, blur: 2 },
    strong: { offset: 6, blur: 3 },
  };

  const { offset, blur } = intensityMap[intensity];

  return (
    <m.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ fontFamily: 'inherit', ...style }}
    >
      {/* 主文字 */}
      <span className="relative z-10 block" style={style}>{text}</span>

      {/* 故障效果層 */}
      {isGlitching && (
        <>
          {/* 紅色陰影層 */}
          <m.span
            className="absolute inset-0 z-0 block"
            style={{
              color: '#ef4444',
              textShadow: `${offset}px 0 #ef4444, -${offset}px 0 #00ffff`,
              clipPath: 'inset(0 0 0 0)',
              filter: `blur(${blur}px)`,
              ...style,
            }}
            animate={{
              x: [0, -offset, offset, 0],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 0.1,
              repeat: 3,
              ease: 'linear',
            }}
          >
            {text}
          </m.span>

          {/* 青色陰影層 */}
          <m.span
            className="absolute inset-0 z-0 block"
            style={{
              color: '#00ffff',
              textShadow: `-${offset}px 0 #00ffff, ${offset}px 0 #ef4444`,
              clipPath: 'inset(0 0 0 0)',
              filter: `blur(${blur}px)`,
              ...style,
            }}
            animate={{
              x: [0, offset, -offset, 0],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 0.1,
              repeat: 3,
              delay: 0.05,
              ease: 'linear',
            }}
          >
            {text}
          </m.span>
        </>
      )}
    </m.div>
  );
}
