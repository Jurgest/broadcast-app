import React, { useState } from "react";
import { Palette, Settings, Accessibility } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { themes, type ThemeVariant } from "../theme";
import { ThemeSwitch } from "./ThemeSwitch";
import { AccessibilityControls } from "./AccessibilityControls";

export const ThemeSelector: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { themeVariant, setThemeVariant } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "themes" | "modes" | "accessibility"
  >("themes");

  const themeVariants = Object.keys(themes) as ThemeVariant[];

  return (
    <div className={`card-glass p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Customize Experience
          </h3>
          <p className="text-sm text-white/70">
            Personalize your dashboard with themes and accessibility options
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 p-1 bg-white/5 rounded-xl">
          <button
            onClick={() => setActiveTab("themes")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                activeTab === "themes"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }
            `}
          >
            <Palette size={16} />
            Themes
          </button>
          <button
            onClick={() => setActiveTab("modes")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                activeTab === "modes"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }
            `}
          >
            <Settings size={16} />
            Modes
          </button>
          <button
            onClick={() => setActiveTab("accessibility")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                activeTab === "accessibility"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }
            `}
          >
            <Accessibility size={16} />
            Accessibility
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          {activeTab === "themes" && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Choose Theme</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {themeVariants.map((variant) => {
                  const theme = themes[variant];
                  return (
                    <button
                      key={variant}
                      onClick={() => setThemeVariant(variant)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-200 text-left group
                        ${
                          themeVariant === variant
                            ? "border-white/40 bg-white/10 shadow-lg"
                            : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/8"
                        }
                      `}
                    >
                      {/* Theme Preview */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex gap-1">
                          {theme.colors.primary
                            .slice(0, 3)
                            .map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                        </div>
                        {themeVariant === variant && (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                      </div>

                      <h5 className="font-semibold text-white mb-1">
                        {theme.displayName}
                      </h5>
                      <p className="text-xs text-white/70">
                        {theme.description}
                      </p>

                      {/* Gradient Preview */}
                      <div
                        className="mt-3 h-2 rounded-full"
                        style={{ background: theme.colors.gradients.primary }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "modes" && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">
                Light/Dark Mode
              </h4>
              <p className="text-sm text-white/70 mb-4">
                Choose how the interface appears. Auto mode follows your system
                preference.
              </p>
              <ThemeSwitch />

              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <h5 className="font-medium text-white mb-2">
                  Keyboard Shortcuts
                </h5>
                <div className="text-xs text-white/70 space-y-1">
                  <div>
                    •{" "}
                    <kbd className="px-1 py-0.5 bg-white/10 rounded text-white">
                      Ctrl/Cmd + Shift + T
                    </kbd>{" "}
                    - Toggle theme mode
                  </div>
                  <div>
                    •{" "}
                    <kbd className="px-1 py-0.5 bg-white/10 rounded text-white">
                      Ctrl/Cmd + Shift + +
                    </kbd>{" "}
                    - Increase font size
                  </div>
                  <div>
                    •{" "}
                    <kbd className="px-1 py-0.5 bg-white/10 rounded text-white">
                      Ctrl/Cmd + Shift + -
                    </kbd>{" "}
                    - Decrease font size
                  </div>
                  <div>
                    •{" "}
                    <kbd className="px-1 py-0.5 bg-white/10 rounded text-white">
                      Ctrl/Cmd + Shift + 0
                    </kbd>{" "}
                    - Reset font size
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "accessibility" && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">
                Accessibility Options
              </h4>
              <p className="text-sm text-white/70 mb-4">
                Customize the interface for better accessibility and comfort.
              </p>
              <AccessibilityControls />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
