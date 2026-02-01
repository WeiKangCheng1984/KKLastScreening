// 光照管理器 - 統一管理所有光源和光照效果

export type LightType = 'point' | 'directional' | 'spotlight' | 'ambient';
export type LightAnimation = 'flicker' | 'pulse' | 'fade' | 'random' | 'none';

export interface LightSource {
  id: string;
  type: LightType;
  position: { x: number; y: number }; // 比例座標 (0-1)
  color: string; // CSS 顏色值
  intensity: number; // 0-1
  range?: number; // 影響範圍 (0-1)
  attenuation?: number; // 衰減係數
  animation?: LightAnimation;
  animationSpeed?: number; // 動畫速度倍數
  enabled: boolean;
}

export class LightingManager {
  private lights: Map<string, LightSource> = new Map();
  private animationFrameId: number | null = null;
  private lastUpdateTime: number = 0;
  private animationStates: Map<string, number> = new Map(); // 動畫狀態

  // 添加光源
  addLight(light: LightSource): void {
    this.lights.set(light.id, light);
    this.animationStates.set(light.id, 0);
    this.startAnimationLoop();
  }

  // 移除光源
  removeLight(lightId: string): void {
    this.lights.delete(lightId);
    this.animationStates.delete(lightId);
    if (this.lights.size === 0) {
      this.stopAnimationLoop();
    }
  }

  // 更新光源屬性
  updateLight(lightId: string, updates: Partial<LightSource>): void {
    const light = this.lights.get(lightId);
    if (light) {
      this.lights.set(lightId, { ...light, ...updates });
    }
  }

  // 啟用/禁用光源
  setLightEnabled(lightId: string, enabled: boolean): void {
    this.updateLight(lightId, { enabled });
  }

  // 獲取所有光源
  getLights(): LightSource[] {
    return Array.from(this.lights.values());
  }

  // 獲取啟用的光源
  getEnabledLights(): LightSource[] {
    return this.getLights().filter(light => light.enabled);
  }

  // 獲取指定光源
  getLight(lightId: string): LightSource | undefined {
    return this.lights.get(lightId);
  }

  // 清除所有光源
  clear(): void {
    this.lights.clear();
    this.animationStates.clear();
    this.stopAnimationLoop();
  }

  // 計算光照強度（考慮動畫）
  getLightIntensity(lightId: string, time: number = Date.now()): number {
    const light = this.lights.get(lightId);
    if (!light || !light.enabled) return 0;

    const baseIntensity = light.intensity;
    const animation = light.animation || 'none';
    const speed = light.animationSpeed || 1;

    switch (animation) {
      case 'flicker':
        // 快速閃爍
        return baseIntensity * (0.5 + 0.5 * Math.sin(time * 0.02 * speed));
      
      case 'pulse':
        // 緩慢脈衝
        return baseIntensity * (0.7 + 0.3 * Math.sin(time * 0.001 * speed));
      
      case 'fade':
        // 淡入淡出
        return baseIntensity * (0.5 + 0.5 * Math.sin(time * 0.0005 * speed));
      
      case 'random':
        // 隨機變化
        const state = this.animationStates.get(lightId) || 0;
        return baseIntensity * (0.5 + 0.5 * Math.random());
      
      case 'none':
      default:
        return baseIntensity;
    }
  }

  // 計算點的光照值（考慮所有光源）
  calculateLightingAt(x: number, y: number, time: number = Date.now()): number {
    let totalLight = 0;
    
    for (const light of this.getEnabledLights()) {
      const intensity = this.getLightIntensity(light.id, time);
      
      switch (light.type) {
        case 'ambient':
          // 環境光：均勻照亮
          totalLight += intensity;
          break;
        
        case 'point':
          // 點光源：距離衰減
          const distance = Math.sqrt(
            Math.pow((x - light.position.x) * 100, 2) +
            Math.pow((y - light.position.y) * 100, 2)
          );
          const range = (light.range || 0.5) * 100;
          const attenuation = light.attenuation || 1;
          const falloff = Math.max(0, 1 - (distance / range) * attenuation);
          totalLight += intensity * falloff;
          break;
        
        case 'directional':
          // 方向光：均勻照亮（簡化版）
          totalLight += intensity * 0.5;
          break;
        
        case 'spotlight':
          // 聚光燈：圓錐形光照
          const spotDistance = Math.sqrt(
            Math.pow((x - light.position.x) * 100, 2) +
            Math.pow((y - light.position.y) * 100, 2)
          );
          const spotRange = (light.range || 0.3) * 100;
          const spotAttenuation = light.attenuation || 1.5;
          const spotFalloff = Math.max(0, 1 - (spotDistance / spotRange) * spotAttenuation);
          totalLight += intensity * spotFalloff;
          break;
      }
    }
    
    // 限制在 0-1 範圍
    return Math.min(1, totalLight);
  }

  // 啟動動畫循環
  private startAnimationLoop(): void {
    if (this.animationFrameId !== null) return;
    
    const animate = (currentTime: number) => {
      if (this.lights.size === 0) {
        this.stopAnimationLoop();
        return;
      }
      
      // 更新動畫狀態
      for (const light of this.getEnabledLights()) {
        if (light.animation && light.animation !== 'none') {
          const currentState = this.animationStates.get(light.id) || 0;
          this.animationStates.set(light.id, currentState + 1);
        }
      }
      
      this.lastUpdateTime = currentTime;
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }

  // 停止動畫循環
  private stopAnimationLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // 清理資源
  cleanup(): void {
    this.stopAnimationLoop();
    this.clear();
  }
}

// 單例實例
export const lightingManager = new LightingManager();
