export const THEME_CONFIG = {
  // Animation durations
  TRANSITION_DURATION: {
    FAST: "0.15s",
    NORMAL: "0.3s",
    SLOW: "0.5s",
  },

  // Breakpoints for responsive design
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px",
    LG: "1024px",
    XL: "1280px",
    "2XL": "1536px",
  },

  // Font size scaling factors
  FONT_SCALE: {
    MIN: 0.75,
    MAX: 1.5,
    STEP: 0.125,
  },

  // Local storage keys
  STORAGE_KEYS: {
    THEME_MODE: "broadcast-app-theme-mode",
    THEME_VARIANT: "broadcast-app-theme-variant",
    FONT_SIZE: "broadcast-app-font-size",
    ACCESSIBILITY_LEVEL: "broadcast-app-accessibility-level",
    REDUCED_MOTION: "broadcast-app-reduced-motion",
  },

  // Keyboard shortcuts
  SHORTCUTS: {
    TOGGLE_THEME: ["ctrl+shift+t", "cmd+shift+t"],
    INCREASE_FONT: ["+", "="],
    DECREASE_FONT: ["-", "_"],
    RESET_FONT: ["0"],
    TOGGLE_ACCESSIBILITY: ["ctrl+shift+a", "cmd+shift+a"],
  },

  // Default settings
  DEFAULTS: {
    THEME_MODE: "auto" as const,
    THEME_VARIANT: "default" as const,
    FONT_SIZE: 1,
    ACCESSIBILITY_LEVEL: "standard" as const,
    REDUCED_MOTION: false,
  },

  // Animation presets
  ANIMATIONS: {
    BOUNCE: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    SMOOTH: "cubic-bezier(0.4, 0, 0.2, 1)",
    SPRING: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },

  // Glass morphism presets
  GLASS: {
    LIGHT: {
      background: "rgba(255, 255, 255, 0.1)",
      border: "rgba(255, 255, 255, 0.2)",
      blur: "12px",
    },
    MEDIUM: {
      background: "rgba(255, 255, 255, 0.15)",
      border: "rgba(255, 255, 255, 0.25)",
      blur: "16px",
    },
    HEAVY: {
      background: "rgba(255, 255, 255, 0.2)",
      border: "rgba(255, 255, 255, 0.3)",
      blur: "20px",
    },
  },

  // Shadow presets
  SHADOWS: {
    SOFT: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    MEDIUM:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    STRONG:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    GLOW: "0 0 20px rgba(59, 130, 246, 0.5)",
  },
} as const;

export type ThemeConfig = typeof THEME_CONFIG;
