'use client';

import { useEffect, useState, useRef } from 'react';
import { ImageOff } from 'lucide-react';
import { loadSVG } from '@/lib/svgLoader';

interface SVGImageProps {
  src: string;
  alt?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const sizeClasses = {
  small: 'w-12 h-12',
  medium: 'w-24 h-24',
  large: 'w-48 h-48',
};

export default function SVGImage({
  src,
  alt = '',
  className = '',
  size = 'medium',
  lazy = true,
  onLoad,
  onError,
}: SVGImageProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const containerRef = useRef<HTMLDivElement>(null);

  // 懶加載：使用 IntersectionObserver
  useEffect(() => {
    if (!lazy || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // 提前 50px 開始載入
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy, shouldLoad]);

  // 載入 SVG
  useEffect(() => {
    if (!shouldLoad) return;

    setIsLoading(true);
    setHasError(false);

    loadSVG(src)
      .then((content) => {
        setSvgContent(content);
        setIsLoading(false);
        onLoad?.();
      })
      .catch((error) => {
        console.error('Failed to load SVG:', src, error);
        setHasError(true);
        setIsLoading(false);
        onError?.();
      });
  }, [src, shouldLoad, onLoad, onError]);

  // 錯誤狀態：顯示 fallback 圖標
  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-dark-card border border-dark-border rounded-lg`}
        title={alt || '圖片載入失敗'}
      >
        <ImageOff size={size === 'small' ? 16 : size === 'medium' ? 24 : 32} className="text-gray-500" />
      </div>
    );
  }

  // 載入中狀態
  if (isLoading || !svgContent) {
    return (
      <div
        ref={containerRef}
        className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-dark-card border border-dark-border rounded-lg animate-pulse`}
      >
        <div className="w-1/2 h-1/2 bg-gray-700 rounded"></div>
      </div>
    );
  }

  // 渲染 SVG（使用 dangerouslySetInnerHTML 以支持主題化）
  return (
    <div
      ref={containerRef}
      className={`${sizeClasses[size]} ${className} flex items-center justify-center`}
      title={alt}
    >
      <div
        className="w-full h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:max-w-full [&_svg]:max-h-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}
