import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Palette } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { themes, type ThemeVariant, type ThemeMode } from "../theme";

export const ThemeToggle: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme, themeVariant, themeMode, setThemeVariant, setThemeMode } =
    useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeVariants = Object.keys(themes) as ThemeVariant[];
  const themeModes: ThemeMode[] = ["light", "dark", "auto"];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
        aria-label="Theme selector"
      >
        <Palette size={16} />
        <span className="text-sm font-medium capitalize">
          {theme.displayName}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-[60] overflow-hidden">
          {/* Theme Mode Selector */}
          <div className="p-4 border-b border-gray-200/30 dark:border-gray-700/30">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3">
              Mode
            </h4>
            <div className="flex gap-2">
              {themeModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setThemeMode(mode)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
                    themeMode === mode
                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-400/30 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/30 border-gray-300/30 dark:border-gray-600/30 hover:border-gray-400/50 dark:hover:border-gray-500/50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>
                      {mode === "auto" ? "🌓" : mode === "light" ? "☀️" : "🌙"}
                    </span>
                    <span className="capitalize">{mode}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Variants */}
          <div className="p-4">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3">
              Themes
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto theme-dropdown-scroll">
              {themeVariants.map((variant) => {
                const variantTheme = themes[variant];
                return (
                  <button
                    key={variant}
                    onClick={() => {
                      setThemeVariant(variant);
                      setShowDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 border ${
                      themeVariant === variant
                        ? "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-400/30 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/30 border-gray-300/30 dark:border-gray-600/30 hover:border-gray-400/50 dark:hover:border-gray-500/50"
                    }`}
                  >
                    {/* Color Preview */}
                    <div className="flex gap-1">
                      {variantTheme.colors.primary
                        .slice(0, 3)
                        .map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                    </div>

                    {/* Theme Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {variantTheme.displayName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {variantTheme.description}
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {themeVariant === variant && (
                      <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
