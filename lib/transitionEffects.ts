// 過渡效果庫 - 提供多種場景切換過渡效果

export type TransitionType = 
  | 'fade' 
  | 'slide' 
  | 'dissolve' 
  | 'portal' 
  | 'warp' 
  | 'flip' 
  | 'none';

export interface TransitionConfig {
  type: TransitionType;
  duration?: number; // 毫秒
  direction?: 'left' | 'right' | 'up' | 'down';
  easing?: string; // CSS easing 函數
}

export class TransitionEffects {
  private static instance: TransitionEffects;
  private activeTransition: TransitionConfig | null = null;

  static getInstance(): TransitionEffects {
    if (!TransitionEffects.instance) {
      TransitionEffects.instance = new TransitionEffects();
    }
    return TransitionEffects.instance;
  }

  // 淡入淡出
  fade(duration: number = 500): TransitionConfig {
    return {
      type: 'fade',
      duration,
      easing: 'ease-in-out',
    };
  }

  // 滑動切換
  slide(direction: 'left' | 'right' | 'up' | 'down' = 'right', duration: number = 600): TransitionConfig {
    return {
      type: 'slide',
      duration,
      direction,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    };
  }

  // 溶解過渡（像素化）
  dissolve(duration: number = 800): TransitionConfig {
    return {
      type: 'dissolve',
      duration,
      easing: 'ease-in-out',
    };
  }

  // 傳送門效果（圓形擴散）
  portal(duration: number = 1000): TransitionConfig {
    return {
      type: 'portal',
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    };
  }

  // 時空扭曲
  warp(duration: number = 1200): TransitionConfig {
    return {
      type: 'warp',
      duration,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    };
  }

  // 翻頁效果
  flip(duration: number = 800): TransitionConfig {
    return {
      type: 'flip',
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    };
  }

  // 無過渡
  none(): TransitionConfig {
    return {
      type: 'none',
      duration: 0,
    };
  }

  // 根據場景類型自動選擇過渡效果
  getTransitionForRoom(roomNumber: number, fromRoom?: number): TransitionConfig {
    // ROOM 1 → ROOM 2：時空扭曲（象徵規則的轉變）
    if (fromRoom === 1 && roomNumber === 2) {
      return this.warp(1200);
    }
    
    // ROOM 2 → ROOM 3：傳送門（從非正式到正式）
    if (fromRoom === 2 && roomNumber === 3) {
      return this.portal(1000);
    }
    
    // ROOM 3 → ROOM 4：快速切換（地震效果）
    if (fromRoom === 3 && roomNumber === 4) {
      return this.slide('up', 400);
    }
    
    // ROOM 4 → ROOM 5：溶解過渡（壓力釋放）
    if (fromRoom === 4 && roomNumber === 5) {
      return this.dissolve(800);
    }
    
    // 同一 ROOM 內切換：平滑淡入淡出
    if (fromRoom === roomNumber) {
      return this.fade(500);
    }
    
    // 默認：淡入淡出
    return this.fade(500);
  }

  // 獲取過渡的 CSS 類名
  getTransitionClassName(config: TransitionConfig): string {
    const baseClass = 'transition-effect';
    const typeClass = `transition-${config.type}`;
    const directionClass = config.direction ? `transition-${config.direction}` : '';
    
    return [baseClass, typeClass, directionClass].filter(Boolean).join(' ');
  }

  // 獲取過渡的 CSS 樣式
  getTransitionStyle(config: TransitionConfig, progress: number): React.CSSProperties {
    const { type, duration = 500, direction, easing = 'ease-in-out' } = config;
    
    const baseStyle: React.CSSProperties = {
      transition: `all ${duration}ms ${easing}`,
    };

    switch (type) {
      case 'fade':
        return {
          ...baseStyle,
          opacity: progress,
        };
      
      case 'slide':
        const slideMap = {
          left: { transform: `translateX(${(1 - progress) * 100}%)` },
          right: { transform: `translateX(${-(1 - progress) * 100}%)` },
          up: { transform: `translateY(${(1 - progress) * 100}%)` },
          down: { transform: `translateY(${-(1 - progress) * 100}%)` },
        };
        return {
          ...baseStyle,
          ...(direction ? slideMap[direction] : slideMap.right),
          opacity: progress,
        };
      
      case 'dissolve':
        // 像素化溶解效果（使用 filter）
        return {
          ...baseStyle,
          opacity: progress,
          filter: `blur(${(1 - progress) * 10}px)`,
        };
      
      case 'portal':
        // 圓形擴散（使用 clip-path）
        const radius = progress * 150;
        return {
          ...baseStyle,
          clipPath: `circle(${radius}% at 50% 50%)`,
          opacity: progress,
        };
      
      case 'warp':
        // 時空扭曲（使用 transform 和 filter）
        return {
          ...baseStyle,
          transform: `scale(${0.8 + progress * 0.2}) rotate(${(1 - progress) * 10}deg)`,
          filter: `blur(${(1 - progress) * 5}px) brightness(${0.5 + progress * 0.5})`,
          opacity: progress,
        };
      
      case 'flip':
        // 3D 翻轉
        return {
          ...baseStyle,
          transform: `rotateY(${(1 - progress) * 180}deg)`,
          opacity: progress,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        };
      
      case 'none':
      default:
        return {
          opacity: 1,
        };
    }
  }

  // 執行過渡動畫
  async executeTransition(
    config: TransitionConfig,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const { duration = 500 } = config;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        onProgress?.(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }
}

// 導出單例實例
export const transitionEffects = TransitionEffects.getInstance();
