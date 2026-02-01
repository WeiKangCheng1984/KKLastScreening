/**
 * 響應式工具函數庫
 * 提供設備檢測、尺寸計算和SVG尺寸映射功能
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * 檢測是否為移動設備
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * 檢測是否為平板設備
 */
export function isTabletDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= 768 && width < 1024;
}

/**
 * 獲取設備類型
 */
export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * 響應式尺寸計算
 * @param baseSize 基礎尺寸
 * @param deviceType 設備類型（可選，不提供則自動檢測）
 */
export function getResponsiveSize(
  baseSize: number,
  deviceType?: DeviceType
): number {
  const type = deviceType || getDeviceType();
  
  switch (type) {
    case 'mobile':
      return Math.round(baseSize * 0.75); // 移動端縮小25%
    case 'tablet':
      return Math.round(baseSize * 0.9); // 平板縮小10%
    case 'desktop':
      return baseSize;
    default:
      return baseSize;
  }
}

/**
 * SVG尺寸映射
 */
export const responsiveSVGSizes = {
  mobile: { small: 16, medium: 24, large: 32 },
  tablet: { small: 20, medium: 32, large: 48 },
  desktop: { small: 24, medium: 48, large: 64 },
} as const;

/**
 * 獲取響應式SVG尺寸
 * @param size 尺寸類型
 * @param deviceType 設備類型（可選）
 */
export function getResponsiveSVGSize(
  size: 'small' | 'medium' | 'large',
  deviceType?: DeviceType
): number {
  const type = deviceType || getDeviceType();
  return responsiveSVGSizes[type][size];
}

/**
 * 最小觸控區域尺寸（iOS/Android標準：44x44px）
 */
export const MIN_TOUCH_SIZE = 44;

/**
 * 確保元素符合最小觸控區域
 * @param size 原始尺寸
 */
export function ensureMinTouchSize(size: number): number {
  return Math.max(size, MIN_TOUCH_SIZE);
}

/**
 * 響應式斷點
 */
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

/**
 * 監聽窗口大小變化
 * @param callback 回調函數
 * @returns 清理函數
 */
export function onResize(callback: (deviceType: DeviceType) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  let lastDeviceType = getDeviceType();
  
  const handleResize = () => {
    const currentDeviceType = getDeviceType();
    if (currentDeviceType !== lastDeviceType) {
      lastDeviceType = currentDeviceType;
      callback(currentDeviceType);
    }
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}
