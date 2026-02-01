'use client';

import { useState, useRef } from 'react';

interface Wire {
  id: string;
  color: string;
  start: number;
  end: number;
}

interface WireConnectionSVGProps {
  wires: Wire[];
  onWireConnect?: (wireId: string, start: number, end: number) => void;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * 線路連接謎題 SVG 組件
 * 用 SVG 繪製可拖動的線路和連接點
 */
export default function WireConnectionSVG({
  wires,
  onWireConnect,
  className = '',
  width = 400,
  height = 300,
}: WireConnectionSVGProps) {
  const [draggingWire, setDraggingWire] = useState<string | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const startPoints = Array.from({ length: 5 }, (_, i) => ({
    x: 50,
    y: 50 + i * 50,
    id: i,
  }));

  const endPoints = Array.from({ length: 5 }, (_, i) => ({
    x: width - 50,
    y: 50 + i * 50,
    id: i,
  }));

  const handleMouseDown = (wireId: string, startId: number) => {
    setDraggingWire(wireId);
    const wire = wires.find((w) => w.id === wireId);
    if (wire) {
      const endPoint = endPoints[wire.end];
      setDragEnd({ x: endPoint.x, y: endPoint.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingWire || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragEnd({ x, y });
  };

  const handleMouseUp = () => {
    if (draggingWire && dragEnd) {
      // 找到最近的終點
      const nearestEnd = endPoints.reduce((prev, curr) => {
        const prevDist = Math.sqrt(
          Math.pow(prev.x - dragEnd.x, 2) + Math.pow(prev.y - dragEnd.y, 2)
        );
        const currDist = Math.sqrt(
          Math.pow(curr.x - dragEnd.x, 2) + Math.pow(curr.y - dragEnd.y, 2)
        );
        return currDist < prevDist ? curr : prev;
      });

      const wire = wires.find((w) => w.id === draggingWire);
      if (wire && onWireConnect) {
        onWireConnect(draggingWire, wire.start, nearestEnd.id);
      }
    }
    setDraggingWire(null);
    setDragEnd(null);
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 背景 */}
      <rect width={width} height={height} fill="transparent" />

      {/* 已連接的線路 */}
      {wires.map((wire) => {
        const start = startPoints[wire.start];
        const end = endPoints[wire.end];
        return (
          <line
            key={wire.id}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={wire.color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}

      {/* 拖動中的線路 */}
      {draggingWire && dragEnd && (() => {
        const wire = wires.find((w) => w.id === draggingWire);
        if (!wire) return null;
        const start = startPoints[wire.start];
        return (
          <line
            x1={start.x}
            y1={start.y}
            x2={dragEnd.x}
            y2={dragEnd.y}
            stroke={wire.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="5,5"
            opacity="0.7"
          />
        );
      })()}

      {/* 起點 */}
      {startPoints.map((point) => (
        <circle
          key={`start-${point.id}`}
          cx={point.x}
          cy={point.y}
          r="8"
          fill="#4a5568"
          stroke="#2d3748"
          strokeWidth="2"
          className="cursor-pointer hover:fill-gray-600 transition-colors"
        />
      ))}

      {/* 終點 */}
      {endPoints.map((point) => (
        <circle
          key={`end-${point.id}`}
          cx={point.x}
          cy={point.y}
          r="8"
          fill="#4a5568"
          stroke="#2d3748"
          strokeWidth="2"
          className="cursor-pointer hover:fill-gray-600 transition-colors"
        />
      ))}
    </svg>
  );
}
