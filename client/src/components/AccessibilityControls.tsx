import React from "react";
import { useTheme } from "../hooks/useTheme";
import type { AccessibilityLevel } from "../theme";

export const AccessibilityControls: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const {
    accessibilityLevel,
    setAccessibilityLevel,
    fontSize,
    setFontSize,
    isReducedMotion,
    isHighContrast,
  } = useTheme();

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Accessibility Level
        </label>
        <div className="flex gap-2">
          {(
            [
              "standard",
              "high-contrast",
              "reduced-motion",
            ] as AccessibilityLevel[]
          ).map((level) => (
            <button
              key={level}
              onClick={() => setAccessibilityLevel(level)}
              className={`
                px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 capitalize
                ${
                  accessibilityLevel === level
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }
              `}
            >
              {level.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Font Size: {fontSize}px
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFontSize(Math.max(fontSize - 2, 12))}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-all duration-200"
            aria-label="Decrease font size"
          >
            -
          </button>
          <input
            type="range"
            min="12"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            aria-label="Font size slider"
          />
          <button
            onClick={() => setFontSize(Math.min(fontSize + 2, 24))}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-all duration-200"
            aria-label="Increase font size"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-xs text-white/60 space-y-1">
        <div>System preferences:</div>
        <div>• Reduced motion: {isReducedMotion ? "Yes" : "No"}</div>
        <div>• High contrast: {isHighContrast ? "Yes" : "No"}</div>
      </div>
    </div>
  );
};
