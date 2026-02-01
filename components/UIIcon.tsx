'use client';

import { useEffect, useState } from 'react';
import { loadSVG } from '@/lib/svgLoader';
import { getResponsiveSVGSize, getDeviceType, type DeviceType } from '@/lib/responsiveUtils';

export type IconName =
  | 'close'
  | 'check'
  | 'error'
  | 'help'
  | 'volume-on'
  | 'volume-off'
  | 'music'
  | 'headphones'
  | 'history'
  | 'skip'
  | 'chevron-right'
  | 'success'
  | 'loading'
  | 'warning'
  | 'hover'
  | 'click'
  | 'drag';

export type IconSize = 'small' | 'medium' | 'large';

interface UIIconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  color?: string;
  responsive?: boolean;
  deviceType?: DeviceType;
}

const iconPathMap: Record<IconName, string> = {
  'close': '/svg/ui/icons/icon_close_v1.svg',
  'check': '/svg/ui/icons/icon_check_v1.svg',
  'error': '/svg/ui/icons/icon_error_v1.svg',
  'help': '/svg/ui/icons/icon_help_v1.svg',
  'volume-on': '/svg/ui/icons/icon_volume_on_v1.svg',
  'volume-off': '/svg/ui/icons/icon_volume_off_v1.svg',
  'music': '/svg/ui/icons/icon_music_v1.svg',
  'headphones': '/svg/ui/icons/icon_headphones_v1.svg',
  'history': '/svg/ui/icons/icon_history_v1.svg',
  'skip': '/svg/ui/icons/icon_skip_v1.svg',
  'chevron-right': '/svg/ui/icons/icon_chevron_right_v1.svg',
  'success': '/svg/ui/status/status_success_v1.svg',
  'loading': '/svg/ui/status/status_loading_v1.svg',
  'warning': '/svg/ui/status/status_warning_v1.svg',
  'hover': '/svg/ui/interactive/interactive_hover_v1.svg',
  'click': '/svg/ui/interactive/interactive_click_v1.svg',
  'drag': '/svg/ui/interactive/interactive_drag_v1.svg',
};

export default function UIIcon({
  name,
  size = 'medium',
  className = '',
  color,
  responsive = true,
  deviceType,
}: UIIconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentDeviceType, setCurrentDeviceType] = useState<DeviceType>(
    deviceType || getDeviceType()
  );

  // 監聽設備類型變化（僅在響應式模式下）
  useEffect(() => {
    if (!responsive || deviceType) return;

    const handleResize = () => {
      setCurrentDeviceType(getDeviceType());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsive, deviceType]);

  // 載入 SVG
  useEffect(() => {
    const iconPath = iconPathMap[name];
    if (!iconPath) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    loadSVG(iconPath)
      .then((content) => {
        // 替換 currentColor 為指定顏色（如果提供）
        let processedContent = content;
        if (color) {
          processedContent = content.replace(/currentColor/g, color);
        }
        setSvgContent(processedContent);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load UI icon:', name, error);
        setHasError(true);
        setIsLoading(false);
      });
  }, [name, color]);

  // 計算尺寸
  const iconSize = responsive
    ? getResponsiveSVGSize(size, deviceType || currentDeviceType)
    : size === 'small'
    ? 16
    : size === 'medium'
    ? 24
    : 32;

  if (hasError || !svgContent) {
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: iconSize, height: iconSize }}
        title={`Icon ${name} failed to load`}
      >
        <div
          className="bg-gray-700 rounded"
          style={{ width: iconSize * 0.5, height: iconSize * 0.5 }}
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: iconSize, height: iconSize }}
      title={name}
    >
      <div
        className="w-full h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:max-w-full [&_svg]:max-h-full"
        style={{ color: color || 'currentColor' }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
