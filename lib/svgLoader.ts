// SVG 載入器：實現預載入、緩存、批量載入優化

interface SVGCache {
  [key: string]: {
    content: string;
    timestamp: number;
  };
}

class SVGLoader {
  private cache: SVGCache = {};
  private loadingPromises: Map<string, Promise<string>> = new Map();
  private readonly CACHE_EXPIRY = 1000 * 60 * 60; // 1 小時

  /**
   * 載入單個 SVG 文件
   */
  async loadSVG(src: string): Promise<string> {
    // 檢查緩存
    const cached = this.cache[src];
    if (cached && Date.now() - cached.timestamp < this.CACHE_EXPIRY) {
      return cached.content;
    }

    // 檢查是否正在載入
    const existingPromise = this.loadingPromises.get(src);
    if (existingPromise) {
      return existingPromise;
    }

    // 創建新的載入 Promise
    const loadPromise = this.fetchSVG(src);
    this.loadingPromises.set(src, loadPromise);

    try {
      const content = await loadPromise;
      // 存入緩存
      this.cache[src] = {
        content,
        timestamp: Date.now(),
      };
      return content;
    } finally {
      // 清除載入 Promise
      this.loadingPromises.delete(src);
    }
  }

  /**
   * 批量載入 SVG 文件
   */
  async loadSVGBatch(srcs: string[]): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    const promises = srcs.map(async (src) => {
      try {
        const content = await this.loadSVG(src);
        results[src] = content;
      } catch (error) {
        console.error(`Failed to load SVG: ${src}`, error);
      }
    });

    await Promise.all(promises);
    return results;
  }

  /**
   * 預載入 SVG（不等待結果）
   */
  preloadSVG(src: string): void {
    this.loadSVG(src).catch((error) => {
      console.warn(`Preload failed for SVG: ${src}`, error);
    });
  }

  /**
   * 預載入多個 SVG
   */
  preloadSVGBatch(srcs: string[]): void {
    srcs.forEach((src) => this.preloadSVG(src));
  }

  /**
   * 清除緩存
   */
  clearCache(): void {
    this.cache = {};
  }

  /**
   * 清除過期緩存
   */
  clearExpiredCache(): void {
    const now = Date.now();
    Object.keys(this.cache).forEach((key) => {
      if (now - this.cache[key].timestamp >= this.CACHE_EXPIRY) {
        delete this.cache[key];
      }
    });
  }

  /**
   * 獲取緩存統計
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: Object.keys(this.cache).length,
      keys: Object.keys(this.cache),
    };
  }

  /**
   * 實際獲取 SVG 內容
   */
  private async fetchSVG(src: string): Promise<string> {
    // 如果是絕對路徑，直接使用
    // 如果是相對路徑，確保從 public 目錄載入
    const url = src.startsWith('/') ? src : `/${src}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load SVG: ${response.statusText}`);
    }

    const text = await response.text();
    
    // 驗證是否為有效的 SVG
    if (!text.trim().startsWith('<svg')) {
      throw new Error('Invalid SVG format');
    }

    return text;
  }
}

// 導出單例實例
export const svgLoader = new SVGLoader();

// 導出便捷函數
export const loadSVG = (src: string) => svgLoader.loadSVG(src);
export const loadSVGBatch = (srcs: string[]) => svgLoader.loadSVGBatch(srcs);
export const preloadSVG = (src: string) => svgLoader.preloadSVG(src);
export const preloadSVGBatch = (srcs: string[]) => svgLoader.preloadSVGBatch(srcs);
