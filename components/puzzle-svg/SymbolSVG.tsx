'use client';

interface SymbolSVGProps {
  symbol: string;
  size?: number;
  className?: string;
  color?: string;
}

/**
 * 符號 SVG 組件
 * 用於符號配對謎題
 */
export default function SymbolSVG({
  symbol,
  size = 64,
  className = '',
  color = 'currentColor',
}: SymbolSVGProps) {
  // 簡單的符號渲染，可以根據實際需求擴展
  const renderSymbol = () => {
    switch (symbol) {
      case 'circle':
        return <circle cx={size / 2} cy={size / 2} r={size / 3} fill="none" stroke={color} strokeWidth="2" />;
      case 'square':
        return <rect x={size / 4} y={size / 4} width={size / 2} height={size / 2} fill="none" stroke={color} strokeWidth="2" />;
      case 'triangle':
        return (
          <polygon
            points={`${size / 2},${size / 4} ${size * 0.75},${size * 0.75} ${size / 4},${size * 0.75}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
        );
      case 'star':
        return (
          <polygon
            points={`${size / 2},${size / 6} ${size * 0.6},${size * 0.4} ${size * 0.9},${size * 0.4} ${size * 0.65},${size * 0.6} ${size * 0.75},${size * 0.9} ${size / 2},${size * 0.7} ${size * 0.25},${size * 0.9} ${size * 0.35},${size * 0.6} ${size * 0.1},${size * 0.4} ${size * 0.4},${size * 0.4}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
        );
      default:
        return (
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size / 2}
            fill={color}
          >
            {symbol}
          </text>
        );
    }
  };

  return (
    <svg width={size} height={size} className={className} viewBox={`0 0 ${size} ${size}`}>
      {renderSymbol()}
    </svg>
  );
}
