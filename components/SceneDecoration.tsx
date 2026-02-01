'use client';

import SVGLoader from './SVGLoader';

interface SceneDecorationProps {
  decoration: {
    id: string;
    svgPath: string;
    position: { x: number; y: number };
    size?: number;
    animation?: 'float' | 'pulse' | 'rotate' | 'sparkle';
    zIndex?: number;
  };
}

const animationClasses = {
  float: 'animate-float',
  pulse: 'animate-pulse',
  rotate: 'animate-spin-slow',
  sparkle: 'animate-sparkle',
};

/**
 * 場景裝飾性 SVG 元素組件
 * 在場景背景上疊加動態 SVG 裝飾元素
 */
export default function SceneDecoration({ decoration }: SceneDecorationProps) {
  const { id, svgPath, position, size = 32, animation, zIndex = 1 } = decoration;

  return (
    <div
      className={`absolute pointer-events-none ${animation ? animationClasses[animation] : ''}`}
      style={{
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
        width: size,
        height: size,
        zIndex,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <SVGLoader
        src={svgPath}
        alt={`decoration ${id}`}
        width={size}
        height={size}
        className="opacity-60"
      />
    </div>
  );
}
