'use client';

import { useEffect, useState } from 'react';
import SVGLoader from './SVGLoader';
import { getResponsiveSVGSize, getDeviceType, ensureMinTouchSize, type DeviceType } from '@/lib/responsiveUtils';

interface HotspotIconProps {
  hotspotId: string;
  svgIcon?: string;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  isHovered?: boolean;
  responsive?: boolean;
}

const positionClasses = {
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full',
  bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full',
  left: 'left-0 top-1/2 -translate-x-full -translate-y-1/2',
  right: 'right-0 top-1/2 translate-x-full -translate-y-1/2',
};

/**
 * Hotspot 視覺化標記組件
 * 在場景中顯示可互動區域的 SVG 標記
 * 支持響應式尺寸和觸控優化
 */
export default function HotspotIcon({
  hotspotId,
  svgIcon,
  position = 'center',
  className = '',
  isHovered = false,
  responsive = true,
}: HotspotIconProps) {
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

  if (!svgIcon) {
    return null;
  }

  // 計算響應式尺寸（移動端更大，方便觸控）
  const baseSize = responsive ? getResponsiveSVGSize('medium', deviceType) : 48;
  const iconSize = responsive && deviceType === 'mobile' 
    ? ensureMinTouchSize(baseSize) 
    : baseSize;

  return (
    <div
      className={`absolute ${positionClasses[position]} pointer-events-none z-10 transition-all duration-200 text-orange-400 touch-manipulation ${
        isHovered ? 'opacity-100 scale-110' : 'opacity-60 scale-100'
      } ${className}`}
      style={{
        width: iconSize,
        height: iconSize,
        minWidth: iconSize,
        minHeight: iconSize,
      }}
    >
      <SVGLoader
        src={svgIcon}
        alt={`${hotspotId} hotspot`}
        width={iconSize}
        height={iconSize}
        className="drop-shadow-lg w-full h-full"
      />
    </div>
  );
}
