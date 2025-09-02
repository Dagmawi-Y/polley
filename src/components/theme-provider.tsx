"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ColorTheme = "blue" | "green" | "purple" | "orange" | "red" | "black" | "white";

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue");

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedColorTheme = localStorage.getItem("colorTheme") as ColorTheme;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
    }
    
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.setAttribute("data-color-theme", colorTheme);
    
    // Handle black/white themes based on light/dark mode
    if (colorTheme === "black" && theme === "light") {
      root.setAttribute("data-color-theme", "black");
    } else if (colorTheme === "white" && theme === "dark") {
      root.setAttribute("data-color-theme", "white");
    }
    
    localStorage.setItem("theme", theme);
    localStorage.setItem("colorTheme", colorTheme);
  }, [theme, colorTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    
    // Auto-switch problematic color themes
    if (newTheme === "dark" && colorTheme === "white") {
      setColorTheme("blue"); // Switch to default blue when going to dark mode with white theme
    } else if (newTheme === "light" && colorTheme === "black") {
      setColorTheme("blue"); // Switch to default blue when going to light mode with black theme
    }
    
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, setTheme, setColorTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
