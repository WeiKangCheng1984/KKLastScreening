'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { lightingManager, LightSource } from '@/lib/lightingManager';
import { audioManager } from '@/lib/audioManager';
import { rafThrottle, isMobileDevice } from '@/lib/performanceUtils';

interface FlashlightProps {
  enabled?: boolean;
  batteryLevel?: number; // 0-100
  onBatteryDepleted?: () => void;
  intensity?: number; // 0-1
  range?: number; // 0-1
  color?: string;
  onToggle?: (enabled: boolean) => void;
}

export default function Flashlight({
  enabled: initialEnabled = false,
  batteryLevel: initialBatteryLevel = 100,
  onBatteryDepleted,
  intensity = 0.8,
  range = 0.4,
  color = '#fff8dc',
  onToggle,
}: FlashlightProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [batteryLevel, setBatteryLevel] = useState(initialBatteryLevel);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lightIdRef = useRef('flashlight_main');
  const batteryDrainIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 更新手電筒位置（跟隨滑鼠）- 使用 RAF 節流優化
  const updateMousePositionRaw = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // 更新光源位置
    lightingManager.updateLight(lightIdRef.current, {
      position: { x, y },
    });
  }, []);

  // 使用 RAF 節流優化滑鼠移動
  const updateMousePosition = useRef(rafThrottle(updateMousePositionRaw)).current;

  // 更新觸控位置 - 移動端優化
  const updateTouchPositionRaw = useCallback((e: TouchEvent) => {
    if (!containerRef.current || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // 更新光源位置
    lightingManager.updateLight(lightIdRef.current, {
      position: { x, y },
    });
  }, []);

  // 移動端使用更低的更新頻率
  const updateTouchPosition = useRef(
    isMobileDevice() 
      ? rafThrottle(updateTouchPositionRaw)
      : updateTouchPositionRaw
  ).current;

  // 切換手電筒
  const toggleFlashlight = useCallback(() => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    
    // 更新光源狀態
    lightingManager.setLightEnabled(lightIdRef.current, newEnabled);
    
    // 通知父組件
    onToggle?.(newEnabled);
  }, [enabled, onToggle]);

  // 初始化手電筒光源
  useEffect(() => {
    const light: LightSource = {
      id: lightIdRef.current,
      type: 'spotlight',
      position: mousePosition,
      color: color,
      intensity: intensity,
      range: range,
      attenuation: 1.5,
      animation: 'none',
      enabled: enabled,
    };
    
    lightingManager.addLight(light);
    
    return () => {
      lightingManager.removeLight(lightIdRef.current);
    };
  }, []); // 只在掛載時初始化

  // 更新光源屬性
  useEffect(() => {
    lightingManager.updateLight(lightIdRef.current, {
      color: color,
      intensity: intensity * (batteryLevel / 100), // 電量影響強度
      range: range,
      enabled: enabled,
    });
  }, [color, intensity, range, enabled, batteryLevel]);

  // 監聽滑鼠移動
  useEffect(() => {
    if (!enabled) return;
    
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('touchmove', updateTouchPosition, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('touchmove', updateTouchPosition);
    };
  }, [enabled, updateMousePosition, updateTouchPosition]);

  // 電池消耗系統
  useEffect(() => {
    if (!enabled || batteryLevel <= 0) {
      if (batteryDrainIntervalRef.current) {
        clearInterval(batteryDrainIntervalRef.current);
        batteryDrainIntervalRef.current = null;
      }
      return;
    }
    
    // 每秒消耗 0.5% 電量
    batteryDrainIntervalRef.current = setInterval(() => {
      setBatteryLevel(prev => {
        const newLevel = Math.max(0, prev - 0.5);
        
        // 電量耗盡
        if (newLevel <= 0) {
          setEnabled(false);
          lightingManager.setLightEnabled(lightIdRef.current, false);
          onBatteryDepleted?.();
          onToggle?.(false);
        }
        
        return newLevel;
      });
    }, 1000);
    
    return () => {
      if (batteryDrainIntervalRef.current) {
        clearInterval(batteryDrainIntervalRef.current);
        batteryDrainIntervalRef.current = null;
      }
    };
  }, [enabled, batteryLevel, onBatteryDepleted, onToggle]);

  // 渲染手電筒光照效果（使用 CSS clip-path）
  const getFlashlightStyle = (): React.CSSProperties => {
    if (!enabled || batteryLevel <= 0) {
      return { display: 'none' };
    }
    
    const angle = Math.atan2(
      mousePosition.y - 0.5,
      mousePosition.x - 0.5
    ) * (180 / Math.PI);
    
    // 計算圓錐形光照區域
    const coneWidth = range * 100;
    const coneHeight = range * 60;
    
    return {
      position: 'absolute',
      left: `${mousePosition.x * 100}%`,
      top: `${mousePosition.y * 100}%`,
      width: `${coneWidth}%`,
      height: `${coneHeight}%`,
      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      background: `radial-gradient(ellipse at center, ${color}40 0%, ${color}20 40%, transparent 70%)`,
      pointerEvents: 'none',
      mixBlendMode: 'screen',
      filter: `brightness(${intensity * (batteryLevel / 100)})`,
      transition: 'opacity 0.2s ease-out',
    };
  };

  return (
    <>
      {/* 手電筒光照效果層 */}
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={getFlashlightStyle()}
      />
      
      {/* 手電筒控制按鈕（可選，如果需要 UI 控制） */}
      {/* 可以通過外部組件控制，這裡不渲染 UI */}
    </>
  );
}

// 導出控制函數
export function useFlashlight() {
  const [enabled, setEnabled] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  
  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);
  
  const recharge = useCallback((amount: number = 100) => {
    setBatteryLevel(prev => Math.min(100, prev + amount));
  }, []);
  
  return {
    enabled,
    batteryLevel,
    toggle,
    recharge,
    setEnabled,
    setBatteryLevel,
  };
}
