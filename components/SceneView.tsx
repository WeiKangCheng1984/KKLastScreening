'use client';

import { Scene, Hotspot } from '@/types/game';
import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import Image from 'next/image';
import { audioManager } from '@/lib/audioManager';
import { lightingManager, LightSource } from '@/lib/lightingManager';
import { getAnimationQuality, isMobileDevice } from '@/lib/performanceUtils';
import HoverGlow from './effects/HoverGlow';
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
      
      // 播放閃電音效
      audioManager.playSFX('/audio/sfx/sfx_lightning.mp3', 0.6);
      
      // 觸發強烈閃爍
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

  // 播放點擊音效
  useEffect(() => {
    if (clickedHotspot) {
      audioManager.playInteractionSFX('click');
    }
  }, [clickedHotspot]);

  const getHotspotStyle = (hotspot: Hotspot): React.CSSProperties => {
    if (hotspot.shape === 'rect' && hotspot.coords.length >= 4) {
      const [x, y, width, height] = hotspot.coords;
      // 計算中心點位置
      const centerX = (x + width) / 2;
      const centerY = (y + height) / 2;
      // 使用 clamp() 響應式大小：最小 40px，理想 4vw，最大 64px
      // 手機端會自動縮小，桌面端保持 64px
      const responsiveSize = 'clamp(40px, 4vw, 64px)';
      
      return {
        position: 'absolute',
        left: `${centerX * 100}%`,
        top: `${centerY * 100}%`,
        width: responsiveSize,
        height: responsiveSize,
        transform: 'translate(-50%, -50%)', // 以中心點定位
        cursor: 'pointer',
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

      {/* Hotspots */}
      {scene.hotspots.map(hotspot => {
        const isHovered = hoveredHotspot === hotspot.id;
        const isClicked = clickedHotspot === hotspot.id;
        
        return (
          <div
            key={hotspot.id}
            style={getHotspotStyle(hotspot)}
            onClick={(e) => handleHotspotClick(hotspot, e)}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            className={`
              transition-all duration-200 gpu-accelerated rounded-full
              ${debug ? 'border-4 border-orange-500 bg-orange-500/40' : 'border border-white/30 bg-white/5'}
              ${isHovered && !debug ? 'bg-white/10 border-white/50 shadow-lg shadow-white/20 scale-105' : ''}
              ${isClicked ? 'bg-white/15 border-white/60 scale-95' : ''}
            `}
            title={debug ? `${hotspot.id}: ${hotspot.description || ''}` : hotspot.hint}
          >
            {/* Debug 標籤 */}
            {debug && (
              <div className="absolute top-0 left-0 bg-orange-600 text-white text-xs px-1.5 py-0.5 rounded-br">
                {hotspot.id}
              </div>
            )}

            {/* Hover 提示浮動標籤 - 縮小50% */}
            {isHovered && !debug && hotspot.hint && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.75 bg-orange-950/95 backdrop-blur-md border border-orange-700/50 rounded text-[10px] leading-tight text-orange-100 whitespace-nowrap shadow-lg z-50 pointer-events-none animate-fade-float">
                {hotspot.hint}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                  <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-orange-700/50"></div>
                </div>
              </div>
            )}

            {/* 懸停發光效果 */}
            {isHovered && !debug && (
              <HoverGlow
                isActive={true}
                intensity="medium"
                color="#fb923c"
                size={80}
              />
            )}

            {/* 點擊波紋效果 - 使用 RippleEffect 組件 */}
            {showRipple && ripplePosition && ripplePosition.hotspotId === hotspot.id && (
              <RippleEffect
                show={true}
                position={{ x: ripplePosition.x, y: ripplePosition.y }}
                color="#fb923c"
                duration={600}
                size={120}
              />
            )}

            {/* 可互動脈衝效果 - 簡化版（保留微弱的提醒效果） */}
            {!debug && (
              <>
                {/* 外層脈衝動畫 - 非常微弱的向外擴散 */}
                <div className="absolute inset-[-6px] border border-white/10 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
                {/* 中心發光點 - 非常微弱（白色） */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full opacity-40"></div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
});

SceneView.displayName = 'SceneView';

export default SceneView;

