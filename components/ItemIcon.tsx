'use client';

import { useState, useEffect } from 'react';
import SVGLoader from './SVGLoader';
import { Sparkles } from 'lucide-react';
import { getResponsiveSVGSize, getDeviceType, ensureMinTouchSize, type DeviceType } from '@/lib/responsiveUtils';
import UIIcon from './UIIcon';

interface ItemIconProps {
  itemId: string;
  svgIcon?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showFallback?: boolean;
  responsive?: boolean;
  touchOptimized?: boolean;
}

const sizeMap = {
  small: 32,
  medium: 48,
  large: 64,
};

/**
 * 道具圖標組件
 * 支援 SVG 圖標和 Lucide 圖標回退
 * 支持響應式尺寸和觸控優化
 */
export default function ItemIcon({
  itemId,
  svgIcon,
  size = 'medium',
  className = '',
  showFallback = true,
  responsive = true,
  touchOptimized = false,
}: ItemIconProps) {
  const [error, setError] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType());

  // 監聽設備類型變化
  useEffect(() => {
    if (!responsive) return;

    const handleResize = () => {
      setDeviceType(getDeviceType());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsive]);

  // 計算響應式尺寸
  const baseSize = responsive 
    ? getResponsiveSVGSize(size, deviceType)
    : sizeMap[size];
  
  const iconSize = touchOptimized 
    ? ensureMinTouchSize(baseSize)
    : baseSize;

  // 如果有 SVG 圖標且未出錯，使用 SVG
  if (svgIcon && !error) {
    return (
      <div
        className={`${className} transition-all touch-manipulation inline-flex items-center justify-center`}
        style={{
          width: iconSize,
          height: iconSize,
          minWidth: iconSize,
          minHeight: iconSize,
        }}
      >
        <SVGLoader
          src={svgIcon}
          alt={`${itemId} icon`}
          width={baseSize}
          height={baseSize}
          className="w-full h-full"
          onError={() => setError(true)}
          fallback={
            showFallback ? (
              <Sparkles size={baseSize * 0.5} className="text-gray-500" />
            ) : null
          }
        />
      </div>
    );
  }

  // 回退到 Lucide 圖標
  if (showFallback) {
    return (
      <div
        className={`text-gray-500 ${className} inline-flex items-center justify-center touch-manipulation`}
        style={{
          width: iconSize,
          height: iconSize,
          minWidth: iconSize,
          minHeight: iconSize,
        }}
      >
        <Sparkles size={baseSize * 0.5} />
      </div>
    );
  }

  return null;
}
