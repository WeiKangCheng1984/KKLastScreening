'use client';

import { useState } from 'react';

interface SwitchSVGProps {
  id: string;
  initialState: boolean;
  onToggle?: (id: string, state: boolean) => void;
  className?: string;
  size?: number;
}

/**
 * 邏輯開關 SVG 組件
 * 用於邏輯開關謎題
 */
export default function SwitchSVG({
  id,
  initialState,
  onToggle,
  className = '',
  size = 80,
}: SwitchSVGProps) {
  const [isOn, setIsOn] = useState(initialState);

  const handleClick = () => {
    const newState = !isOn;
    setIsOn(newState);
    onToggle?.(id, newState);
  };

  const switchWidth = size;
  const switchHeight = size / 2;
  const toggleSize = switchHeight * 0.8;
  const padding = (switchHeight - toggleSize) / 2;
  const toggleX = isOn ? switchWidth - toggleSize - padding : padding;

  return (
    <svg
      width={switchWidth}
      height={switchHeight}
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
      viewBox={`0 0 ${switchWidth} ${switchHeight}`}
    >
      {/* 背景軌道 */}
      <rect
        x="0"
        y="0"
        width={switchWidth}
        height={switchHeight}
        rx={switchHeight / 2}
        fill={isOn ? '#10b981' : '#4b5563'}
        className="transition-colors duration-200"
      />

      {/* 切換按鈕 */}
      <circle
        cx={toggleX + toggleSize / 2}
        cy={switchHeight / 2}
        r={toggleSize / 2}
        fill="#ffffff"
        className="transition-all duration-200"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
        }}
      />
    </svg>
  );
}
