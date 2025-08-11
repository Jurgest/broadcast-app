// Advanced Theme System with Multiple Themes and Bonus Features
export type ThemeMode = "light" | "dark" | "auto";
export type ThemeVariant =
  | "default"
  | "ocean"
  | "forest"
  | "sunset"
  | "midnight"
  | "neon"
  | "minimal";
export type AccessibilityLevel =
  | "standard"
  | "high-contrast"
  | "reduced-motion";

export interface Theme {
  name: string;
  displayName: string;
  description: string;
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      overlay: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      accent: string;
    };
    glass: {
      background: string;
      border: string;
      shadow: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    gradients: {
      primary: string;
      secondary: string;
      background: string;
      card: string;
    };
  };
  effects: {
    blur: {
      light: string;
      medium: string;
      heavy: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
      glow: string;
    };
    animations: {
      duration: {
        fast: string;
        normal: string;
        slow: string;
      };
      easing: {
        ease: string;
        easeIn: string;
        easeOut: string;
        bounce: string;
      };
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
}

// Default Theme
export const defaultTheme: Theme = {
  name: "default",
  displayName: "Classic",
  description: "Clean and modern design with blue and purple gradients",
  colors: {
    primary: ["#3b82f6", "#2563eb", "#1d4ed8"],
    secondary: ["#8b5cf6", "#7c3aed", "#6d28d9"],
    accent: ["#06b6d4", "#0891b2", "#0e7490"],
    background: {
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      secondary: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      tertiary: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.8)",
      tertiary: "rgba(255, 255, 255, 0.6)",
      accent: "#60a5fa",
    },
    glass: {
      background: "rgba(255, 255, 255, 0.1)",
      border: "rgba(255, 255, 255, 0.2)",
      shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    status: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    gradients: {
      primary: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      secondary: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      card: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
    },
  },
  effects: {
    blur: {
      light: "blur(8px)",
      medium: "blur(16px)",
      heavy: "blur(24px)",
    },
    shadows: {
      small: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      medium: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      large: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      glow: "0 0 30px rgba(59, 130, 246, 0.6)",
    },
    animations: {
      duration: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
      },
      easing: {
        ease: "cubic-bezier(0.4, 0, 0.2, 1)",
        easeIn: "cubic-bezier(0.4, 0, 1, 1)",
        easeOut: "cubic-bezier(0, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  typography: {
    fontFamily: {
      primary:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      secondary: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      mono: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, monospace",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      xxl: "1.5rem",
      xxxl: "2rem",
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

// Ocean Theme
export const oceanTheme: Theme = {
  ...defaultTheme,
  name: "ocean",
  displayName: "Ocean Breeze",
  description: "Cool blues and teals inspired by ocean depths",
  colors: {
    ...defaultTheme.colors,
    primary: ["#0ea5e9", "#0284c7", "#0369a1"],
    secondary: ["#06b6d4", "#0891b2", "#0e7490"],
    accent: ["#14b8a6", "#0d9488", "#0f766e"],
    background: {
      primary: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
      secondary: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
      tertiary: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    gradients: {
      primary: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
      secondary: "linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)",
      background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
      card: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
    },
  },
};

// Forest Theme
export const forestTheme: Theme = {
  ...defaultTheme,
  name: "forest",
  displayName: "Forest Dreams",
  description: "Natural greens and earth tones for a calming experience",
  colors: {
    ...defaultTheme.colors,
    primary: ["#10b981", "#059669", "#047857"],
    secondary: ["#84cc16", "#65a30d", "#4d7c0f"],
    accent: ["#06b6d4", "#0891b2", "#0e7490"],
    background: {
      primary: "linear-gradient(135deg, #10b981 0%, #84cc16 100%)",
      secondary: "linear-gradient(135deg, #059669 0%, #65a30d 100%)",
      tertiary: "linear-gradient(135deg, #047857 0%, #4d7c0f 100%)",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    gradients: {
      primary: "linear-gradient(135deg, #10b981 0%, #84cc16 100%)",
      secondary: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
      background: "linear-gradient(135deg, #10b981 0%, #84cc16 100%)",
      card: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)",
    },
  },
};

// Sunset Theme
export const sunsetTheme: Theme = {
  ...defaultTheme,
  name: "sunset",
  displayName: "Sunset Glow",
  description: "Warm oranges and pinks like a beautiful sunset",
  colors: {
    ...defaultTheme.colors,
    primary: ["#f97316", "#ea580c", "#c2410c"],
    secondary: ["#ec4899", "#db2777", "#be185d"],
    accent: ["#f59e0b", "#d97706", "#b45309"],
    background: {
      primary: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
      secondary: "linear-gradient(135deg, #ea580c 0%, #db2777 100%)",
      tertiary: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    gradients: {
      primary: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
      secondary: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
      background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
      card: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)",
    },
  },
};

// Midnight Theme
export const midnightTheme: Theme = {
  ...defaultTheme,
  name: "midnight",
  displayName: "Midnight Purple",
  description: "Deep purples and indigos for the night owls",
  colors: {
    ...defaultTheme.colors,
    primary: ["#8b5cf6", "#7c3aed", "#6d28d9"],
    secondary: ["#3730a3", "#312e81", "#1e1b4b"],
    accent: ["#06b6d4", "#0891b2", "#0e7490"],
    background: {
      primary: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      secondary: "linear-gradient(135deg, #6d28d9 0%, #3730a3 100%)",
      tertiary: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      overlay: "rgba(0, 0, 0, 0.7)",
    },
    gradients: {
      primary: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      secondary: "linear-gradient(135deg, #3730a3 0%, #8b5cf6 100%)",
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      card: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
    },
  },
};

// Neon Theme
export const neonTheme: Theme = {
  ...defaultTheme,
  name: "neon",
  displayName: "Neon Cyber",
  description: "Bright neon colors for a futuristic cyberpunk feel",
  colors: {
    ...defaultTheme.colors,
    primary: ["#00ff88", "#00cc6a", "#009951"],
    secondary: ["#ff0080", "#cc0066", "#99004d"],
    accent: ["#00ffff", "#00cccc", "#009999"],
    background: {
      primary: "linear-gradient(135deg, #000000 0%, #1a0033 100%)",
      secondary: "linear-gradient(135deg, #1a0033 0%, #330066 100%)",
      tertiary: "linear-gradient(135deg, #00ff88 0%, #ff0080 100%)",
      overlay: "rgba(0, 0, 0, 0.8)",
    },
    text: {
      primary: "#00ff88",
      secondary: "#00ffff",
      tertiary: "#ff0080",
      accent: "#ffffff",
    },
    gradients: {
      primary: "linear-gradient(135deg, #00ff88 0%, #00ffff 100%)",
      secondary: "linear-gradient(135deg, #ff0080 0%, #00ff88 100%)",
      background: "linear-gradient(135deg, #000000 0%, #1a0033 100%)",
      card: "linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 255, 0.05) 100%)",
    },
  },
  effects: {
    ...defaultTheme.effects,
    shadows: {
      small: "0 4px 6px -1px rgba(0, 255, 136, 0.3)",
      medium: "0 10px 15px -3px rgba(0, 255, 136, 0.3)",
      large: "0 25px 50px -12px rgba(0, 255, 136, 0.4)",
      glow: "0 0 30px rgba(0, 255, 136, 0.8)",
    },
  },
};

// Minimal Theme
export const minimalTheme: Theme = {
  ...defaultTheme,
  name: "minimal",
  displayName: "Minimal Clean",
  description: "Clean and minimal design with subtle colors",
  colors: {
    ...defaultTheme.colors,
    primary: ["#6b7280", "#4b5563", "#374151"],
    secondary: ["#9ca3af", "#6b7280", "#4b5563"],
    accent: ["#3b82f6", "#2563eb", "#1d4ed8"],
    background: {
      primary: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      secondary: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
      tertiary: "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)",
      overlay: "rgba(0, 0, 0, 0.3)",
    },
    text: {
      primary: "#1f2937",
      secondary: "#4b5563",
      tertiary: "#6b7280",
      accent: "#3b82f6",
    },
    gradients: {
      primary: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
      secondary: "linear-gradient(135deg, #3b82f6 0%, #6b7280 100%)",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      card: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)",
    },
  },
};

// All available themes
export const themes: Record<ThemeVariant, Theme> = {
  default: defaultTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
  midnight: midnightTheme,
  neon: neonTheme,
  minimal: minimalTheme,
};

// Theme Context
export interface ThemeContextType {
  theme: Theme;
  themeVariant: ThemeVariant;
  themeMode: ThemeMode;
  accessibilityLevel: AccessibilityLevel;
  setThemeVariant: (variant: ThemeVariant) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setAccessibilityLevel: (level: AccessibilityLevel) => void;
  isReducedMotion: boolean;
  isHighContrast: boolean;
  fontSize: number;
  setFontSize: (size: number) => void;
  applyTheme: () => void;
}

// Utility functions
export const getThemeByVariant = (variant: ThemeVariant): Theme => {
  return themes[variant] || defaultTheme;
};

export const getSystemThemePreference = (): ThemeMode => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

export const detectReducedMotion = (): boolean => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return false;
};

export const detectHighContrast = (): boolean => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-contrast: high)").matches;
  }
  return false;
};

// CSS Custom Properties Generator
export const generateCSSCustomProperties = (
  theme: Theme
): Record<string, string> => {
  return {
    "--color-primary-500": theme.colors.primary[0],
    "--color-primary-600": theme.colors.primary[1],
    "--color-primary-700": theme.colors.primary[2],
    "--color-secondary-500": theme.colors.secondary[0],
    "--color-secondary-600": theme.colors.secondary[1],
    "--color-secondary-700": theme.colors.secondary[2],
    "--color-accent-500": theme.colors.accent[0],
    "--color-accent-600": theme.colors.accent[1],
    "--color-accent-700": theme.colors.accent[2],
    "--bg-primary": theme.colors.background.primary,
    "--bg-secondary": theme.colors.background.secondary,
    "--bg-tertiary": theme.colors.background.tertiary,
    "--bg-overlay": theme.colors.background.overlay,
    "--text-primary": theme.colors.text.primary,
    "--text-secondary": theme.colors.text.secondary,
    "--text-tertiary": theme.colors.text.tertiary,
    "--text-accent": theme.colors.text.accent,
    "--glass-bg": theme.colors.glass.background,
    "--glass-border": theme.colors.glass.border,
    "--glass-shadow": theme.colors.glass.shadow,
    "--gradient-primary": theme.colors.gradients.primary,
    "--gradient-secondary": theme.colors.gradients.secondary,
    "--gradient-background": theme.colors.gradients.background,
    "--gradient-card": theme.colors.gradients.card,
    "--blur-light": theme.effects.blur.light,
    "--blur-medium": theme.effects.blur.medium,
    "--blur-heavy": theme.effects.blur.heavy,
    "--shadow-small": theme.effects.shadows.small,
    "--shadow-medium": theme.effects.shadows.medium,
    "--shadow-large": theme.effects.shadows.large,
    "--shadow-glow": theme.effects.shadows.glow,
    "--duration-fast": theme.effects.animations.duration.fast,
    "--duration-normal": theme.effects.animations.duration.normal,
    "--duration-slow": theme.effects.animations.duration.slow,
    "--easing-ease": theme.effects.animations.easing.ease,
    "--easing-ease-in": theme.effects.animations.easing.easeIn,
    "--easing-ease-out": theme.effects.animations.easing.easeOut,
    "--easing-bounce": theme.effects.animations.easing.bounce,
    "--font-family-primary": theme.typography.fontFamily.primary,
    "--font-family-secondary": theme.typography.fontFamily.secondary,
    "--font-family-mono": theme.typography.fontFamily.mono,
  };
};

// Local Storage Keys
export const THEME_STORAGE_KEYS = {
  VARIANT: "collaboration-app-theme-variant",
  MODE: "collaboration-app-theme-mode",
  ACCESSIBILITY: "collaboration-app-accessibility-level",
  FONT_SIZE: "collaboration-app-font-size",
} as const;
