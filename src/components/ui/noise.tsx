'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  className?: string;
  useThemeColor?: boolean;
  themeColorIntensity?: number;
}

export function Noise({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
  className,
  useThemeColor = false,
  themeColorIntensity = 0.1,
}: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animationId: number;

    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) return;

    const patternData = patternCtx.createImageData(patternSize, patternSize);
    const patternPixelDataLength = patternSize * patternSize * 4;

    // Get theme color from CSS variables
    const getThemeColor = () => {
      if (!useThemeColor) return null;
      
      const root = document.documentElement;
      const isDark = document.documentElement.classList.contains('dark');
      const primaryColor = getComputedStyle(root).getPropertyValue(
        isDark ? '--primary-color-dark' : '--primary-color'
      ).trim();
      
      if (primaryColor) {
        // Parse RGB values from CSS variable (format: "r g b")
        const [r, g, b] = primaryColor.split(' ').map(Number);
        return { r: r || 59, g: g || 130, b: b || 246 }; // fallback to blue
      }
      
      return { r: 59, g: 130, b: 246 }; // fallback
    };

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(patternScaleX, patternScaleY);
    };

    const updatePattern = () => {
      const themeColor = getThemeColor();
      
      for (let i = 0; i < patternPixelDataLength; i += 4) {
        const noise = Math.random();
        
        if (themeColor && useThemeColor) {
          // Mix noise with theme color
          const intensity = noise * themeColorIntensity;
          const baseValue = noise * 255;
          
          patternData.data[i] = Math.min(255, baseValue + (themeColor.r * intensity));     // R
          patternData.data[i + 1] = Math.min(255, baseValue + (themeColor.g * intensity)); // G
          patternData.data[i + 2] = Math.min(255, baseValue + (themeColor.b * intensity)); // B
          patternData.data[i + 3] = patternAlpha; // A
        } else {
          // Standard grayscale noise
          const value = noise * 255;
          patternData.data[i] = value;
          patternData.data[i + 1] = value;
          patternData.data[i + 2] = value;
          patternData.data[i + 3] = patternAlpha;
        }
      }
      patternCtx.putImageData(patternData, 0, 0);
    };

    const drawGrain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        updatePattern();
        drawGrain();
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    const handleResize = () => {
      resize();
    };

    window.addEventListener('resize', handleResize);
    resize();
    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        window.cancelAnimationFrame(animationId);
      }
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha, useThemeColor, themeColorIntensity]);

  return (
    <canvas
      className={cn('absolute inset-0 w-full h-full', className)}
      ref={grainRef}
    />
  );
}
