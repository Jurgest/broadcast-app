import type {
  Theme,
  ThemeVariant,
  ThemeMode,
  AccessibilityLevel,
} from "../theme";
import { THEME_CONFIG } from "../config/theme-config";

/**
 * Utility class for managing CSS custom properties and theme application
 */
export class CSSVariableManager {
  private static readonly ROOT_ELEMENT = document.documentElement;

  /**
   * Apply theme variables to CSS custom properties
   */
  static applyTheme(
    theme: Theme,
    mode: ThemeMode,
    variant: ThemeVariant
  ): void {
    const root = this.ROOT_ELEMENT;

    // Apply color variables
    Object.entries(theme.colors).forEach(([category, colors]) => {
      if (colors && typeof colors === "object") {
        if (Array.isArray(colors)) {
          // Handle array colors (primary, secondary, accent)
          colors.forEach((color, index) => {
            root.style.setProperty(`--color-${category}-${index}`, color);
          });
        } else {
          // Handle object colors (background, text, glass, status, gradients)
          Object.entries(colors).forEach(([shade, value]) => {
            if (typeof value === "string") {
              root.style.setProperty(`--color-${category}-${shade}`, value);
            }
          });
        }
      }
    });

    // Apply effects (shadows, blur, animations)
    if (theme.effects) {
      // Apply shadows
      Object.entries(theme.effects.shadows).forEach(([name, shadow]) => {
        if (typeof shadow === "string") {
          root.style.setProperty(`--shadow-${name}`, shadow);
        }
      });

      // Apply blur effects
      Object.entries(theme.effects.blur).forEach(([name, blur]) => {
        if (typeof blur === "string") {
          root.style.setProperty(`--blur-${name}`, blur);
        }
      });

      // Apply animation durations and easings
      if (theme.effects.animations) {
        Object.entries(theme.effects.animations.duration).forEach(
          ([name, duration]) => {
            if (typeof duration === "string") {
              root.style.setProperty(`--duration-${name}`, duration);
            }
          }
        );

        Object.entries(theme.effects.animations.easing).forEach(
          ([name, easing]) => {
            if (typeof easing === "string") {
              root.style.setProperty(`--easing-${name}`, easing);
            }
          }
        );
      }
    }

    // Apply typography
    if (theme.typography) {
      Object.entries(theme.typography.fontFamily).forEach(([name, font]) => {
        if (typeof font === "string") {
          root.style.setProperty(`--font-family-${name}`, font);
        }
      });

      Object.entries(theme.typography.fontSize).forEach(([name, size]) => {
        if (typeof size === "string") {
          root.style.setProperty(`--font-size-${name}`, size);
        }
      });

      Object.entries(theme.typography.fontWeight).forEach(([name, weight]) => {
        if (typeof weight === "number") {
          root.style.setProperty(`--font-weight-${name}`, weight.toString());
        }
      });
    }

    // Apply spacing
    Object.entries(theme.spacing).forEach(([size, value]) => {
      if (typeof value === "string") {
        root.style.setProperty(`--spacing-${size}`, value);
      }
    });

    // Apply theme-specific CSS classes
    this.updateThemeClasses(mode, variant);
  }

  /**
   * Update font size based on scaling factor
   */
  static updateFontSize(scale: number): void {
    const baseSize = 16; // Base font size in pixels
    const scaledSize = Math.round(baseSize * scale);
    this.ROOT_ELEMENT.style.setProperty("--base-font-size", `${scaledSize}px`);

    // Update document font size for em/rem calculations
    document.body.style.fontSize = `${scaledSize}px`;
  }

  /**
   * Apply accessibility preferences
   */
  static applyAccessibilitySettings(
    level: AccessibilityLevel,
    reducedMotion: boolean
  ): void {
    const root = this.ROOT_ELEMENT;

    // Apply accessibility level
    root.classList.remove(
      "standard-contrast",
      "high-contrast-contrast",
      "reduced-motion-contrast"
    );
    root.classList.add(`${level}-contrast`);

    // Apply reduced motion preference
    if (reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Update CSS custom properties for accessibility
    switch (level) {
      case "high-contrast":
        root.style.setProperty("--focus-ring-width", "3px");
        root.style.setProperty("--focus-ring-offset", "3px");
        break;
      case "reduced-motion":
        root.style.setProperty("--focus-ring-width", "4px");
        root.style.setProperty("--focus-ring-offset", "4px");
        break;
      default:
        root.style.setProperty("--focus-ring-width", "2px");
        root.style.setProperty("--focus-ring-offset", "2px");
        break;
    }
  }

  /**
   * Update theme-related CSS classes on the root element
   */
  private static updateThemeClasses(
    mode: ThemeMode,
    variant: ThemeVariant
  ): void {
    const root = this.ROOT_ELEMENT;

    // Remove existing theme classes
    const existingClasses = Array.from(root.classList).filter(
      (className) =>
        className.startsWith("theme-") || className.startsWith("variant-")
    );
    existingClasses.forEach((className) => root.classList.remove(className));

    // Add new theme classes
    root.classList.add(`theme-${mode}`);
    root.classList.add(`variant-${variant}`);
  }

  /**
   * Get current CSS custom property value
   */
  static getCSSVariable(propertyName: string): string {
    return getComputedStyle(this.ROOT_ELEMENT)
      .getPropertyValue(propertyName)
      .trim();
  }

  /**
   * Set CSS custom property value
   */
  static setCSSVariable(propertyName: string, value: string): void {
    this.ROOT_ELEMENT.style.setProperty(propertyName, value);
  }

  /**
   * Remove CSS custom property
   */
  static removeCSSVariable(propertyName: string): void {
    this.ROOT_ELEMENT.style.removeProperty(propertyName);
  }

  /**
   * Reset all theme-related CSS variables to defaults
   */
  static resetToDefaults(): void {
    const root = this.ROOT_ELEMENT;

    // Reset font size
    this.updateFontSize(THEME_CONFIG.DEFAULTS.FONT_SIZE);

    // Reset accessibility classes
    root.classList.remove(
      "high-contrast",
      "enhanced-contrast",
      "reduce-motion"
    );
    root.classList.add("standard-contrast");

    // Reset focus ring styles
    root.style.setProperty("--focus-ring-width", "2px");
    root.style.setProperty("--focus-ring-offset", "2px");
  }

  /**
   * Create a CSS animation with theme-aware timing
   */
  static createAnimation(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions & {
      respectMotionPreference?: boolean;
    } = {}
  ): Animation {
    const { respectMotionPreference = true, ...animationOptions } = options;

    // Check for reduced motion preference
    if (respectMotionPreference) {
      const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        this.ROOT_ELEMENT.classList.contains("reduce-motion");

      if (reducedMotion) {
        animationOptions.duration = 1; // Effectively disable animation
      }
    }

    return element.animate(keyframes, animationOptions);
  }
}

/**
 * Hook for accessing CSS variable utilities in React components
 */
export const useCSSVariables = () => {
  return {
    getCSSVariable: CSSVariableManager.getCSSVariable,
    setCSSVariable: CSSVariableManager.setCSSVariable,
    removeCSSVariable: CSSVariableManager.removeCSSVariable,
    createAnimation: CSSVariableManager.createAnimation,
  };
};

/**
 * Utility function to generate CSS classes for theme variants
 */
export const generateThemeClasses = (
  variant: ThemeVariant,
  mode: ThemeMode
): string[] => {
  return [`theme-${mode}`, `variant-${variant}`, `theme-${mode}-${variant}`];
};

/**
 * Utility function to create CSS-in-JS styles with theme variables
 */
export const createThemedStyles = (
  styles: Record<string, unknown>
): Record<string, unknown> => {
  return Object.entries(styles).reduce((acc, [key, value]) => {
    if (typeof value === "string" && value.startsWith("var(")) {
      acc[key] = value;
    } else if (typeof value === "object" && value !== null) {
      acc[key] = createThemedStyles(value as Record<string, unknown>);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, unknown>);
};
