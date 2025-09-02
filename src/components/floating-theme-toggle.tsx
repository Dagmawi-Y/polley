"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Only show floating toggle on home page when navbar is hidden
  const shouldShowFloating = isHomePage && !isScrolled;

  if (!shouldShowFloating) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="w-12 h-12 p-0 rounded-full bg-white/90 backdrop-blur-xl border border-neutral-200/30 hover:bg-white hover:scale-110 shadow-lg hover:shadow-xl dark:bg-neutral-900/90 dark:border-neutral-700/30 dark:hover:bg-neutral-900 transition-all duration-300"
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </Button>
    </div>
  );
}
