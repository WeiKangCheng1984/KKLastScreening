'use client';

import { useState } from 'react';

interface Dial {
  id: string;
  segments: number;
  target: number;
  current?: number;
}

interface RotatingDialSVGProps {
  dials: Dial[];
  onDialRotate?: (dialId: string, value: number) => void;
  className?: string;
  size?: number;
}

/**
 * 旋轉轉盤謎題 SVG 組件
 * 用 SVG 繪製轉盤和刻度，支援點擊旋轉
 */
export default function RotatingDialSVG({
  dials,
  onDialRotate,
  className = '',
  size = 120,
}: RotatingDialSVGProps) {
  const [dialStates, setDialStates] = useState<Record<string, number>>(
    dials.reduce((acc, dial) => {
      acc[dial.id] = dial.current ?? 0;
      return acc;
    }, {} as Record<string, number>)
  );

  const handleDialClick = (dialId: string) => {
    const dial = dials.find((d) => d.id === dialId);
    if (!dial) return;

    const current = dialStates[dialId] ?? 0;
    const next = (current + 1) % dial.segments;
    setDialStates((prev) => ({ ...prev, [dialId]: next }));

    if (onDialRotate) {
      onDialRotate(dialId, next);
    }
  };

  const renderDial = (dial: Dial) => {
    const currentValue = dialStates[dial.id] ?? 0;
    const rotation = (360 / dial.segments) * currentValue;
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;

    return (
      <g key={dial.id} className="cursor-pointer">
        {/* 外圈 */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#4a5568"
          strokeWidth="3"
          className="hover:stroke-gray-500 transition-colors"
          onClick={() => handleDialClick(dial.id)}
        />

        {/* 刻度線 */}
        {Array.from({ length: dial.segments }).map((_, i) => {
          const angle = (360 / dial.segments) * i - 90;
          const rad = (angle * Math.PI) / 180;
          const x1 = centerX + (radius - 15) * Math.cos(rad);
          const y1 = centerY + (radius - 15) * Math.sin(rad);
          const x2 = centerX + radius * Math.cos(rad);
          const y2 = centerY + radius * Math.sin(rad);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i === dial.target ? '#f59e0b' : '#718096'}
              strokeWidth="2"
            />
          );
        })}

        {/* 指針 */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + (radius - 20) * Math.cos(((rotation - 90) * Math.PI) / 180)}
          y2={centerY + (radius - 20) * Math.sin(((rotation - 90) * Math.PI) / 180)}
          stroke="#e53e3e"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${rotation} ${centerX} ${centerY})`}
        />

        {/* 中心點 */}
        <circle
          cx={centerX}
          cy={centerY}
          r="5"
          fill="#2d3748"
          onClick={() => handleDialClick(dial.id)}
        />

        {/* 當前值顯示 */}
        <text
          x={centerX}
          y={centerY + 5}
          textAnchor="middle"
          fill="#cbd5e0"
          fontSize="12"
          className="pointer-events-none"
        >
          {currentValue}
        </text>
      </g>
    );
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      {dials.map((dial) => (
        <svg
          key={dial.id}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transition-transform"
        >
          {renderDial(dial)}
        </svg>
      ))}
    </div>
  );
}
