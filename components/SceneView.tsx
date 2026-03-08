'use client';

import { Scene, Hotspot } from '@/types/game';
import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import Image from 'next/image';
import { audioManager } from '@/lib/audioManager';
import { lightingManager, LightSource } from '@/lib/lightingManager';
import { getAnimationQuality, isMobileDevice } from '@/lib/performanceUtils';
import RippleEffect from './effects/RippleEffect';

interface SceneViewProps {
  scene: Scene;
  onHotspotClick: (hotspotId: string) => void;
  debug?: boolean;
  interactionCount?: number; // 互動次數，用於判斷是否接近解謎
}

export interface SceneViewRef {
  triggerFlicker: (intensity?: 'light' | 'strong' | 'intense' | 'red' | 'electric') => void;
  triggerLightning: () => void;
  setAmbientLight: (intensity: number) => void;
}

const SceneView = forwardRef<SceneViewRef, SceneViewProps>(
  ({ scene, onHotspotClick, debug = false, interactionCount = 0 }, ref) => {
  const [imageError, setImageError] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [clickedHotspot, setClickedHotspot] = useState<string | null>(null);
  // 波紋效果狀態
  const [ripplePosition, setRipplePosition] = useState<{x: number, y: number, hotspotId: string} | null>(null);
  const [showRipple, setShowRipple] = useState(false);
  const [lightFlicker, setLightFlicker] = useState(false);
  const [redFlicker, setRedFlicker] = useState(false);
  const [electricFlicker, setElectricFlicker] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [flickerKey, setFlickerKey] = useState(0);
  const [flickerType, setFlickerType] = useState<'white' | 'red' | 'electric'>('white');
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.3);
  const [lightningActive, setLightningActive] = useState(false);
  const ambientLightIdRef = useRef('scene_ambient');
  const lightningLightIdRef = useRef('scene_lightning');
  const animationQualityRef = useRef(getAnimationQuality());

  // 初始化環境光照
  useEffect(() => {
    // 環境光
    const ambientLight: LightSource = {
      id: ambientLightIdRef.current,
      type: 'ambient',
      position: { x: 0.5, y: 0.5 },
      color: '#ffffff',
      intensity: ambientLightIntensity,
      enabled: true,
    };
    
    // 閃電光源（初始禁用）
    const lightningLight: LightSource = {
      id: lightningLightIdRef.current,
      type: 'directional',
      position: { x: 0.5, y: 0 },
      color: '#ffffff',
      intensity: 0,
      enabled: false,
    };
    
    lightingManager.addLight(ambientLight);
    lightingManager.addLight(lightningLight);
    
    return () => {
      lightingManager.removeLight(ambientLightIdRef.current);
      lightingManager.removeLight(lightningLightIdRef.current);
    };
  }, []);

  // 更新環境光強度
  useEffect(() => {
    lightingManager.updateLight(ambientLightIdRef.current, {
      intensity: ambientLightIntensity,
    });
  }, [ambientLightIntensity]);

  // 觸發閃爍的外部方法
  useImperativeHandle(ref, () => ({
    triggerFlicker: (intensity: 'light' | 'strong' | 'intense' | 'red' | 'electric' = 'light') => {
      const durations = {
        light: 100,
        strong: 200,
        intense: 300,
        red: 150,
        electric: 50,
      };
      
      if (intensity === 'red') {
        setFlickerType('red');
        setRedFlicker(true);
        setFlickerKey(prev => prev + 1);
        setTimeout(() => setRedFlicker(false), durations[intensity]);
      } else if (intensity === 'electric') {
        setFlickerType('electric');
        setFlickerKey(prev => prev + 1);
        // 電流特效：快速閃爍多次
        let flashCount = 0;
        const electricFlash = () => {
          setElectricFlicker(prev => {
            flashCount++;
            if (flashCount >= 6) {
              return false;
            }
            return !prev;
          });
          if (flashCount < 6) {
            setTimeout(electricFlash, 50);
          }
        };
        electricFlash();
      } else {
        setFlickerType('white');
        setLightFlicker(true);
        setFlickerKey(prev => prev + 1);
        setTimeout(() => setLightFlicker(false), durations[intensity]);
      }
    },
    triggerLightning: () => {
      setLightningActive(true);
      // 啟用閃電光源
      lightingManager.setLightEnabled(lightningLightIdRef.current, true);
      lightingManager.updateLight(lightningLightIdRef.current, {
        intensity: 1.5,
      });
      
      // 觸發強烈閃爍（不再播放音效）
      setFlickerType('white');
      setLightFlicker(true);
      setFlickerKey(prev => prev + 1);
      
      // 快速衰減
      setTimeout(() => {
        lightingManager.updateLight(lightningLightIdRef.current, {
          intensity: 0.8,
        });
      }, 50);
      
      setTimeout(() => {
        lightingManager.updateLight(lightningLightIdRef.current, {
          intensity: 0.3,
        });
      }, 150);
      
      setTimeout(() => {
        lightingManager.setLightEnabled(lightningLightIdRef.current, false);
        setLightningActive(false);
        setLightFlicker(false);
      }, 300);
    },
    setAmbientLight: (intensity: number) => {
      setAmbientLightIntensity(Math.max(0, Math.min(1, intensity)));
    },
  }));

  // 背景閃爍邏輯 - 已取消閃爍效果
  // 只保留環境光調整（不閃爍）
  useEffect(() => {
    // 動態調整環境光（根據互動次數）- 性能優化：移動端降低更新頻率
    const updateInterval = animationQualityRef.current.reduceAnimations ? 3000 : 2000;
    const ambientAdjustTimer = setInterval(() => {
      // 互動次數越多，環境光稍微變暗（營造緊張感）
      const targetIntensity = Math.max(0.1, 0.3 - (interactionCount * 0.02));
      setAmbientLightIntensity(prev => {
        const diff = targetIntensity - prev;
        return prev + diff * 0.1; // 平滑過渡
      });
    }, updateInterval);

    return () => {
      clearInterval(ambientAdjustTimer);
    };
  }, [interactionCount]);

  const handleHotspotClick = (hotspot: Hotspot, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    // 計算點擊位置（相對於 hotspot 容器）
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 設置波紋效果
    setRipplePosition({ x, y, hotspotId: hotspot.id });
    setShowRipple(true);
    
    // 保留原有的 clickedHotspot 狀態用於其他邏輯
    setClickedHotspot(hotspot.id);
    setTimeout(() => setClickedHotspot(null), 300);
    
    // 波紋動畫完成後重置
    setTimeout(() => {
      setShowRipple(false);
      setRipplePosition(null);
    }, 600);
    
    onHotspotClick(hotspot.id);
  };

  // 播放點擊音效（目前停用，僅保留 BGM）
  useEffect(() => {
    if (clickedHotspot) {
      // 音效已全局關閉，不再播放
    }
  }, [clickedHotspot]);

  const getHotspotStyle = (hotspot: Hotspot): React.CSSProperties => {
    if (hotspot.shape === 'rect' && hotspot.coords.length >= 4) {
      const [x, y, width, height] = hotspot.coords;
      // 計算中心點位置（圓心）
      const centerX = (x + width) / 2;
      const centerY = (y + height) / 2;
      // 圓形直徑：基礎尺寸 × (0.6 + 半徑比例)，讓 coords 的 width/height 影響圓的大小
      const sizeFactor = 0.6 + (width + height) / 2 * 0.8; // 約 0.64 ~ 1.0
      const responsiveSize = `calc(clamp(40px, 4vw, 44px) * ${sizeFactor})`;

      return {
        position: 'absolute',
        left: `${centerX * 100}%`,
        top: `${centerY * 100}%`,
        width: responsiveSize,
        height: responsiveSize,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }
    return {};
  };

  return (
    <div className="relative w-full h-full bg-dark-bg">
      {/* 閃爍效果已取消 */}
      
      {/* 環境光照層（整合光照管理器） */}
      <div 
        className="absolute inset-0 pointer-events-none z-9"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, ${ambientLightIntensity * 0.1}) 0%, transparent 70%)`,
          mixBlendMode: 'screen',
          transition: 'opacity 0.5s ease-out',
        }}
      />
      
      {/* 背景圖 */}
      <div className="relative w-full h-full gpu-accelerated">
        {!imageError ? (
          <Image
            src={scene.background}
            alt={scene.name}
            fill
            className="object-contain gpu-accelerated"
            onError={() => setImageError(true)}
            priority
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-surface text-gray-500">
            <div className="text-center">
              <div className="text-lg mb-2">{scene.name}</div>
              <div className="text-sm">{scene.description}</div>
            </div>
          </div>
        )}
      </div>

      {/* Hotspots - 方案一：完全隱藏，僅點擊/觸控當下有回饋（無 hover 提示、無游標變化） */}
      {scene.hotspots.map(hotspot => {
        const isClicked = clickedHotspot === hotspot.id;
        const isHovered = hoveredHotspot === hotspot.id;
        
        return (
          <div
            key={hotspot.id}
            style={getHotspotStyle(hotspot)}
            onClick={(e) => handleHotspotClick(hotspot, e)}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            className={`
              transition-all duration-200 gpu-accelerated rounded-full
              ${
                debug
                  ? `cursor-pointer border border-orange-400/25 bg-orange-400/10 ${
                      isHovered ? 'border-orange-400/70 bg-orange-400/20' : ''
                    }`
                  : 'border-transparent bg-transparent cursor-default'
              }
              ${isClicked && debug ? 'scale-95' : ''}
            `}
            title={debug ? `${hotspot.id}: ${hotspot.description || ''}` : ''}
          >
            {/* Debug 標籤 */}
            {debug && isHovered && (
              <div className="absolute top-0 left-0 bg-orange-600/80 text-white text-xs px-1.5 py-0.5 rounded-br">
                {hotspot.id}
              </div>
            )}

            {/* 點擊波紋效果 - 點擊當下唯一視覺回饋 */}
            {showRipple && ripplePosition && ripplePosition.hotspotId === hotspot.id && (
              <RippleEffect
                show={true}
                position={{ x: ripplePosition.x, y: ripplePosition.y }}
                color="#fb923c"
                duration={600}
                size={120}
              />
            )}
          </div>
        );
      })}
    </div>
  );
});

SceneView.displayName = 'SceneView';

export default SceneView;

