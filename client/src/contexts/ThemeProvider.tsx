import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Theme,
  ThemeMode,
  ThemeVariant,
  AccessibilityLevel,
  ThemeContextType,
} from "../theme";
import {
  getThemeByVariant,
  getSystemThemePreference,
  detectReducedMotion,
  detectHighContrast,
  generateCSSCustomProperties,
  THEME_STORAGE_KEYS,
} from "../theme";
import { setThemeContext } from "../hooks/useTheme";

// Create Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Set the context for the hook
setThemeContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  defaultVariant?: ThemeVariant;
  defaultMode?: ThemeMode;
  enableAutoTheme?: boolean;
  enableAccessibility?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultVariant = "default",
  defaultMode = "auto",
  enableAutoTheme = true,
  enableAccessibility = true,
}) => {
  // Theme state
  const [themeVariant, setThemeVariantState] =
    useState<ThemeVariant>(defaultVariant);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultMode);
  const [accessibilityLevel, setAccessibilityLevelState] =
    useState<AccessibilityLevel>("standard");
  const [fontSize, setFontSizeState] = useState<number>(16);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  // Get current theme
  const theme: Theme = getThemeByVariant(themeVariant);

  // Apply theme to DOM
  const applyTheme = useCallback(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const currentTheme = getThemeByVariant(themeVariant);

    // Generate CSS custom properties
    const cssProperties = generateCSSCustomProperties(currentTheme);

    // Apply CSS custom properties
    Object.entries(cssProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value as string);
    });

    // Apply accessibility settings
    if (enableAccessibility) {
      // Reduced motion
      if (isReducedMotion || accessibilityLevel === "reduced-motion") {
        root.style.setProperty("--animation-duration", "0.01ms");
        root.classList.add("reduce-motion");
      } else {
        root.classList.remove("reduce-motion");
      }

      // High contrast
      if (isHighContrast || accessibilityLevel === "high-contrast") {
        root.classList.add("high-contrast");
      } else {
        root.classList.remove("high-contrast");
      }

      // Font size scaling
      root.style.setProperty("--base-font-size", `${fontSize}px`);
      root.style.fontSize = `${fontSize}px`;
    }

    // Apply theme mode
    const effectiveMode =
      themeMode === "auto" ? getSystemThemePreference() : themeMode;
    root.classList.remove("light", "dark");
    root.classList.add(effectiveMode);
    root.setAttribute("data-theme", themeVariant);
    root.setAttribute("data-mode", effectiveMode);

    // Apply theme variant background and colors to body
    const body = document.body;

    // Apply text color and background adjustments based on mode and theme
    if (effectiveMode === "light") {
      // Light mode: brighten the theme's background and use dark text
      body.style.color = currentTheme.colors.text.primary;
      if (currentTheme.colors.gradients?.background) {
        // Lighten the existing theme background
        const lightBg = currentTheme.colors.gradients.background.replace(
          /rgba?\([^)]+\)/g,
          (match) => {
            // Make backgrounds lighter and more transparent
            if (match.includes("rgba")) {
              return match.replace(/,\s*0\.[0-9]+\)/, ", 0.3)");
            }
            return match;
          }
        );
        body.style.background = lightBg;
      } else {
        body.style.background =
          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
      }
      // Add light mode filter to make everything brighter
      body.style.filter = "brightness(1.1) saturate(0.9)";
    } else if (effectiveMode === "dark") {
      // Dark mode: darken the theme's background and use light text
      body.style.color = "#f7fafc";
      if (currentTheme.colors.gradients?.background) {
        // Darken the existing theme background
        const darkBg = currentTheme.colors.gradients.background.replace(
          /rgba?\([^)]+\)/g,
          (match) => {
            // Make backgrounds darker and more opaque
            if (match.includes("rgba")) {
              return match.replace(/,\s*0\.[0-9]+\)/, ", 0.8)");
            }
            return match;
          }
        );
        body.style.background = darkBg;
      } else {
        body.style.background =
          "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)";
      }
      // Add dark mode filter to make everything darker
      body.style.filter = "brightness(0.8) saturate(1.2)";
    } else {
      // Auto mode - use the theme's original background and colors
      if (currentTheme.colors.gradients?.background) {
        body.style.background = currentTheme.colors.gradients.background;
      }
      body.style.color = currentTheme.colors.text.primary;
      body.style.filter = "none";
    }

    console.log("Theme applied:", {
      themeVariant,
      effectiveMode,
      background: body.style.background,
    });

    // Announce theme change to screen readers
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = `Theme changed to ${currentTheme.displayName}`;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, [
    themeVariant,
    themeMode,
    accessibilityLevel,
    fontSize,
    isReducedMotion,
    isHighContrast,
    enableAccessibility,
  ]);

  // Load saved preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVariant = localStorage.getItem(
        THEME_STORAGE_KEYS.VARIANT
      ) as ThemeVariant;
      const savedMode = localStorage.getItem(
        THEME_STORAGE_KEYS.MODE
      ) as ThemeMode;
      const savedAccessibility = localStorage.getItem(
        THEME_STORAGE_KEYS.ACCESSIBILITY
      ) as AccessibilityLevel;
      const savedFontSize = localStorage.getItem(THEME_STORAGE_KEYS.FONT_SIZE);

      if (savedVariant) {
        setThemeVariantState(savedVariant);
      }
      if (savedMode) {
        setThemeModeState(savedMode);
      }
      if (savedAccessibility) {
        setAccessibilityLevelState(savedAccessibility);
      }
      if (savedFontSize) {
        setFontSizeState(parseInt(savedFontSize));
      }
    }
  }, []);

  // Detect system preferences
  useEffect(() => {
    if (!enableAccessibility) return;

    setIsReducedMotion(detectReducedMotion());
    setIsHighContrast(detectHighContrast());

    // Listen for system preference changes
    const mediaQueryReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const mediaQueryHighContrast = window.matchMedia(
      "(prefers-contrast: high)"
    );
    const mediaQueryColorScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    const handleColorSchemeChange = () => {
      if (themeMode === "auto" && enableAutoTheme) {
        applyTheme();
      }
    };

    mediaQueryReducedMotion.addListener(handleReducedMotionChange);
    mediaQueryHighContrast.addListener(handleHighContrastChange);
    mediaQueryColorScheme.addListener(handleColorSchemeChange);

    return () => {
      mediaQueryReducedMotion.removeListener(handleReducedMotionChange);
      mediaQueryHighContrast.removeListener(handleHighContrastChange);
      mediaQueryColorScheme.removeListener(handleColorSchemeChange);
    };
  }, [themeMode, enableAutoTheme, enableAccessibility, applyTheme]);

  // Theme change handlers
  const setThemeVariant = useCallback((variant: ThemeVariant) => {
    setThemeVariantState(variant);
    localStorage.setItem(THEME_STORAGE_KEYS.VARIANT, variant);
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(THEME_STORAGE_KEYS.MODE, mode);
  }, []);

  const setAccessibilityLevel = useCallback((level: AccessibilityLevel) => {
    setAccessibilityLevelState(level);
    localStorage.setItem(THEME_STORAGE_KEYS.ACCESSIBILITY, level);
  }, []);

  const setFontSize = useCallback((size: number) => {
    setFontSizeState(size);
    localStorage.setItem(THEME_STORAGE_KEYS.FONT_SIZE, size.toString());
  }, []);

  // Apply theme on mount and when dependencies change
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // Add keyboard shortcuts for theme switching
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + T: Toggle theme mode
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "T"
      ) {
        event.preventDefault();
        const newMode =
          themeMode === "dark"
            ? "light"
            : themeMode === "light"
            ? "auto"
            : "dark";
        setThemeMode(newMode);
      }

      // Ctrl/Cmd + Shift + Plus: Increase font size
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "+"
      ) {
        event.preventDefault();
        setFontSize(Math.min(fontSize + 2, 24));
      }

      // Ctrl/Cmd + Shift + Minus: Decrease font size
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "-"
      ) {
        event.preventDefault();
        setFontSize(Math.max(fontSize - 2, 12));
      }

      // Ctrl/Cmd + Shift + 0: Reset font size
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "0"
      ) {
        event.preventDefault();
        setFontSize(16);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [themeMode, fontSize, setThemeMode, setFontSize]);

  const contextValue: ThemeContextType = {
    theme,
    themeVariant,
    themeMode,
    accessibilityLevel,
    setThemeVariant,
    setThemeMode,
    setAccessibilityLevel,
    isReducedMotion,
    isHighContrast,
    fontSize,
    setFontSize,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
