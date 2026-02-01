'use client';

import { useState, useRef, ReactNode } from 'react';
import SVGLoader from './SVGLoader';

interface InteractiveSVGProps {
  children?: ReactNode;
  svgPath?: string;
  onDragStart?: (e: React.DragEvent) => void;
  onDrag?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  onRotate?: (angle: number) => void;
  draggable?: boolean;
  rotatable?: boolean;
  className?: string;
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
}

/**
 * 互動 SVG 基礎組件
 * 封裝拖動、點擊、旋轉邏輯
 */
export default function InteractiveSVG({
  children,
  svgPath,
  onDragStart,
  onDrag,
  onDragEnd,
  onClick,
  onRotate,
  draggable = false,
  rotatable = false,
  className = '',
  width,
  height,
  disabled = false,
}: InteractiveSVGProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || (!draggable && !rotatable)) return;

    if (rotatable && e.shiftKey) {
      // Shift + 點擊 = 旋轉
      const rect = elementRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const newRotation = (angle * 180) / Math.PI;
        setRotation(newRotation);
        onRotate?.(newRotation);
      }
    } else if (draggable) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      onDragStart?.(e as any);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current || disabled) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPosition((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    onDrag?.(e as any);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      onDragEnd?.(e as any);
    }
  };

  const content = svgPath ? (
    <SVGLoader src={svgPath} alt="interactive svg" width={width} height={height} />
  ) : (
    children
  );

  return (
    <div
      ref={elementRef}
      className={`
        ${draggable ? 'cursor-move' : ''}
        ${rotatable ? 'cursor-grab' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isDragging ? 'opacity-80' : ''}
        transition-transform
        ${className}
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={onClick}
    >
      {content}
    </div>
  );
}
