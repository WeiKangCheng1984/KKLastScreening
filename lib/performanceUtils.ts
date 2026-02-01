// 性能優化工具函數

// 節流函數
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      // 取消之前的延遲調用
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // 設置新的延遲調用
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeoutId = null;
      }, delay - (now - lastCall));
    }
  };
}

// 防抖函數
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

// 使用 requestAnimationFrame 的節流版本
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  const execute = () => {
    if (lastArgs) {
      func(...lastArgs);
      lastArgs = null;
    }
    rafId = null;
  };
  
  return (...args: Parameters<T>) => {
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(execute);
    }
  };
}

// 檢測是否為移動設備
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
}

// 檢測設備性能等級
export function getDevicePerformanceLevel(): 'low' | 'medium' | 'high' {
  if (typeof window === 'undefined') return 'medium';
  
  // 檢測硬件並發數（CPU 核心數）
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  
  // 檢測內存（如果可用）
  const memory = (navigator as any).deviceMemory || 4;
  
  // 檢測是否為移動設備
  const isMobile = isMobileDevice();
  
  // 綜合判斷
  if (isMobile || hardwareConcurrency <= 2 || memory <= 2) {
    return 'low';
  } else if (hardwareConcurrency >= 8 && memory >= 8) {
    return 'high';
  } else {
    return 'medium';
  }
}

// 根據性能等級調整動畫質量
export function getAnimationQuality(): {
  enableParticles: boolean;
  enableComplexEffects: boolean;
  reduceAnimations: boolean;
  frameRate: number;
} {
  const performanceLevel = getDevicePerformanceLevel();
  
  switch (performanceLevel) {
    case 'low':
      return {
        enableParticles: false,
        enableComplexEffects: false,
        reduceAnimations: true,
        frameRate: 30,
      };
    case 'medium':
      return {
        enableParticles: true,
        enableComplexEffects: true,
        reduceAnimations: false,
        frameRate: 60,
      };
    case 'high':
      return {
        enableParticles: true,
        enableComplexEffects: true,
        reduceAnimations: false,
        frameRate: 60,
      };
  }
}

// 批量 DOM 更新優化
export class BatchDOMUpdates {
  private updates: Array<() => void> = [];
  private rafId: number | null = null;
  
  add(update: () => void): void {
    this.updates.push(update);
    
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        // 執行所有更新
        this.updates.forEach(update => update());
        this.updates = [];
        this.rafId = null;
      });
    }
  }
  
  flush(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.updates.forEach(update => update());
      this.updates = [];
      this.rafId = null;
    }
  }
}

// 離屏渲染優化（使用 Canvas）
export class OffscreenRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private isInitialized = false;
  
  init(width: number, height: number): void {
    if (this.isInitialized) return;
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.isInitialized = true;
  }
  
  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }
  
  getContext(): CanvasRenderingContext2D | null {
    return this.ctx;
  }
  
  clear(): void {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  
  cleanup(): void {
    this.canvas = null;
    this.ctx = null;
    this.isInitialized = false;
  }
}

// 圖片預載入優化
export class ImagePreloader {
  private cache: Map<string, HTMLImageElement> = new Map();
  private loading: Set<string> = new Set();
  
  async preload(src: string): Promise<HTMLImageElement> {
    // 如果已緩存，直接返回
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }
    
    // 如果正在載入，等待完成
    if (this.loading.has(src)) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.cache.has(src)) {
            clearInterval(checkInterval);
            resolve(this.cache.get(src)!);
          }
        }, 50);
      });
    }
    
    // 開始載入
    this.loading.add(src);
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(src, img);
        this.loading.delete(src);
        resolve(img);
      };
      img.onerror = () => {
        this.loading.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  }
  
  preloadBatch(srcs: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(srcs.map(src => this.preload(src)));
  }
  
  clear(): void {
    this.cache.clear();
    this.loading.clear();
  }
}

// 單例實例
export const imagePreloader = new ImagePreloader();
export const batchDOMUpdates = new BatchDOMUpdates();
