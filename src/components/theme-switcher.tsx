"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

const colorThemes = [
  { name: "blue", value: "blue", color: "#3b82f6" },
  { name: "green", value: "green", color: "#10b981" },
  { name: "purple", value: "purple", color: "#8b5cf6" },
  { name: "orange", value: "orange", color: "#f59e0b" },
  { name: "red", value: "red", color: "#ef4444" },
  { name: "black", value: "black", color: "#1f2937" },
  { name: "white", value: "white", color: "#f8fafc" },
] as const;

export function ThemeSwitcher() {
  const { theme, colorTheme, toggleTheme, setColorTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter themes based on current light/dark mode
  const availableThemes = colorThemes.filter(t => {
    if (theme === "dark" && t.value === "black") return false;
    if (theme === "light" && t.value === "white") return false;
    return true;
  });

  // Find current color index in available themes
  useEffect(() => {
    const index = availableThemes.findIndex(t => t.value === colorTheme);
    setCurrentIndex(index >= 0 ? index : 0);
  }, [colorTheme, theme, availableThemes]);

  const currentColor = availableThemes[currentIndex];
  const nextIndex = (currentIndex + 1) % availableThemes.length;
  
  // Calculate circle segments for proper donut display
  const segmentAngle = 360 / availableThemes.length;
  const radius = 14;
  const circumference = 2 * Math.PI * radius;

  const handleColorChange = () => {
    const nextTheme = availableThemes[nextIndex];
    setColorTheme(nextTheme.value);
  };

  // Create SVG path for donut segments
  const createSegmentPath = (index: number, isActive: boolean) => {
    const startAngle = index * segmentAngle - 90; // Start from top
    const endAngle = (index + 1) * segmentAngle - 90;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    const x1 = 18 + radius * Math.cos(startAngleRad);
    const y1 = 18 + radius * Math.sin(startAngleRad);
    const x2 = 18 + radius * Math.cos(endAngleRad);
    const y2 = 18 + radius * Math.sin(endAngleRad);
    
    const innerRadius = isActive ? 4 : 6;
    const x3 = 18 + innerRadius * Math.cos(endAngleRad);
    const y3 = 18 + innerRadius * Math.sin(endAngleRad);
    const x4 = 18 + innerRadius * Math.cos(startAngleRad);
    const y4 = 18 + innerRadius * Math.sin(startAngleRad);
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="flex items-center gap-3">
      {/* Light/Dark theme toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="w-9 h-9 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 hover:scale-110"
      >
        {theme === "light" ? (
          <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </Button>

      {/* Circular color theme switcher */}
      <button
        onClick={handleColorChange}
        className="relative w-9 h-9 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-themed/50 rounded-full"
        title={`Switch to ${availableThemes[nextIndex].name} theme`}
      >
        <svg width="36" height="36" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-neutral-200 dark:text-neutral-700"
            opacity="0.3"
          />
          
          {/* Color segments */}
          {availableThemes.map((themeColor, index) => (
            <path
              key={themeColor.value}
              d={createSegmentPath(index, index === currentIndex)}
              fill={themeColor.color}
              className={`transition-all duration-300 ${
                index === currentIndex 
                  ? "opacity-100 drop-shadow-lg" 
                  : "opacity-60 hover:opacity-80"
              }`}
            />
          ))}
        </svg>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
      </button>
    </div>
  );
}
