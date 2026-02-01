/**
 * SVG預加載策略
 * 在場景切換時預加載UI圖標和關鍵資源
 */

import { preloadSVG, preloadSVGBatch } from './svgLoader';

/**
 * UI圖標路徑列表（關鍵UI優先）
 */
const criticalUIIcons = [
  '/svg/ui/icons/icon_close_v1.svg',
  '/svg/ui/icons/icon_check_v1.svg',
  '/svg/ui/icons/icon_error_v1.svg',
  '/svg/ui/icons/icon_help_v1.svg',
  '/svg/ui/icons/icon_volume_on_v1.svg',
  '/svg/ui/icons/icon_volume_off_v1.svg',
  '/svg/ui/icons/icon_music_v1.svg',
  '/svg/ui/icons/icon_headphones_v1.svg',
  '/svg/ui/icons/icon_history_v1.svg',
  '/svg/ui/icons/icon_skip_v1.svg',
  '/svg/ui/icons/icon_chevron_right_v1.svg',
];

const secondaryUIIcons = [
  '/svg/ui/status/status_success_v1.svg',
  '/svg/ui/status/status_error_v1.svg',
  '/svg/ui/status/status_loading_v1.svg',
  '/svg/ui/status/status_warning_v1.svg',
  '/svg/ui/interactive/interactive_hover_v1.svg',
  '/svg/ui/interactive/interactive_click_v1.svg',
  '/svg/ui/interactive/interactive_drag_v1.svg',
];

/**
 * 預加載關鍵UI圖標（高優先級）
 */
export function preloadCriticalUIIcons(): void {
  preloadSVGBatch(criticalUIIcons);
}

/**
 * 預加載次要UI圖標（低優先級）
 */
export function preloadSecondaryUIIcons(): void {
  // 使用 requestIdleCallback 在瀏覽器空閒時加載
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadSVGBatch(secondaryUIIcons);
    }, { timeout: 2000 });
  } else {
    // 降級：使用 setTimeout
    setTimeout(() => {
      preloadSVGBatch(secondaryUIIcons);
    }, 1000);
  }
}

/**
 * 預加載所有UI圖標
 */
export function preloadAllUIIcons(): void {
  preloadCriticalUIIcons();
  preloadSecondaryUIIcons();
}

/**
 * 預加載場景相關的SVG資源
 * @param sceneSVGs 場景需要的SVG路徑列表
 * @param priority 優先級：'high' | 'low'
 */
export function preloadSceneSVGs(
  sceneSVGs: string[],
  priority: 'high' | 'low' = 'high'
): void {
  if (priority === 'high') {
    preloadSVGBatch(sceneSVGs);
  } else {
    // 低優先級：使用 requestIdleCallback
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        preloadSVGBatch(sceneSVGs);
      }, { timeout: 3000 });
    } else {
      setTimeout(() => {
        preloadSVGBatch(sceneSVGs);
      }, 2000);
    }
  }
}

/**
 * 初始化預加載（應在應用啟動時調用）
 */
export function initSVGPreloader(): void {
  // 立即預加載關鍵UI圖標
  preloadCriticalUIIcons();
  
  // 延遲預加載次要UI圖標
  if (typeof window !== 'undefined') {
    // 等待DOM就緒
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(preloadSecondaryUIIcons, 500);
      });
    } else {
      setTimeout(preloadSecondaryUIIcons, 500);
    }
  }
}

/**
 * 場景切換時的預加載策略
 * @param nextSceneSVGs 下一個場景需要的SVG列表
 */
export function preloadOnSceneChange(nextSceneSVGs: string[]): void {
  // 預加載下一個場景的關鍵資源
  if (nextSceneSVGs.length > 0) {
    // 優先加載前5個（假設是最重要的）
    const critical = nextSceneSVGs.slice(0, 5);
    const rest = nextSceneSVGs.slice(5);
    
    preloadSVGBatch(critical);
    
    // 其餘資源在空閒時加載
    if (rest.length > 0) {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          preloadSVGBatch(rest);
        }, { timeout: 2000 });
      } else {
        setTimeout(() => {
          preloadSVGBatch(rest);
        }, 1000);
      }
    }
  }
}
