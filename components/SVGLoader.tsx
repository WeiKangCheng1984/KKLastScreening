'use client';

import { useState, useEffect, ReactNode } from 'react';

interface SVGLoaderProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  fallback?: ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 通用 SVG 載入組件
 * 支援外部 SVG 文件載入和內嵌 SVG
 */
export default function SVGLoader({
  src,
  alt = '',
  className = '',
  width,
  height,
  fallback,
  onLoad,
  onError,
}: SVGLoaderProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 如果是內嵌 SVG（以 <svg 開頭），直接使用
    if (src.trim().startsWith('<svg')) {
      setSvgContent(src);
      setLoading(false);
      onLoad?.();
      return;
    }

    // 載入外部 SVG 文件
    fetch(src)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.statusText}`);
        }
        return response.text();
      })
      .then((text) => {
        setSvgContent(text);
        setLoading(false);
        onLoad?.();
      })
      .catch((err) => {
        console.error('Error loading SVG:', err);
        setError(true);
        setLoading(false);
        onError?.();
      });
  }, [src, onLoad, onError]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !svgContent) {
    return (
      <div
        className={`flex items-center justify-center bg-dark-card border border-dark-border rounded ${className}`}
        style={{ width, height }}
      >
        {fallback || (
          <span className="text-xs text-gray-500">{alt || 'SVG 載入失敗'}</span>
        )}
      </div>
    );
  }

  // 使用 dangerouslySetInnerHTML 渲染 SVG
  // 確保 SVG 能繼承 currentColor，如果沒有設置顏色則使用默認顏色
  return (
    <div
      className={className}
      style={{ 
        width, 
        height, 
        display: 'inline-block',
        color: 'currentColor',
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      aria-label={alt}
      role="img"
    />
  );
}
