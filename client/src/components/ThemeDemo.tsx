import React from "react";
import { useTheme } from "../hooks/useTheme";

export const ThemeDemo: React.FC = () => {
  const { theme: currentTheme, themeVariant, themeMode } = useTheme();

  if (!currentTheme) {
    return <div>Loading theme...</div>;
  }

  return (
    <div className="theme-demo p-6 space-y-6">
      <div className="glass-card p-6 rounded-lg backdrop-blur-md border border-white/20">
        <h2 className="text-2xl font-bold mb-4">🎨 Theme Demo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Current Theme Info */}
          <div className="theme-info-card glass-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Current Theme</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {currentTheme.displayName}
              </div>
              <div>
                <span className="font-medium">Variant:</span> {themeVariant}
              </div>
              <div>
                <span className="font-medium">Mode:</span> {themeMode}
              </div>
              <div>
                <span className="font-medium">Description:</span>{" "}
                {currentTheme.description}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="color-palette-card glass-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Color Palette</h3>
            <div className="grid grid-cols-3 gap-2">
              {currentTheme.colors.primary.map(
                (color: string, index: number) => (
                  <div
                    key={index}
                    className="color-swatch h-8 rounded border border-white/20"
                    style={{ backgroundColor: color }}
                    title={`Primary ${index}: ${color}`}
                  />
                )
              )}
              {currentTheme.colors.secondary.map(
                (color: string, index: number) => (
                  <div
                    key={`sec-${index}`}
                    className="color-swatch h-8 rounded border border-white/20"
                    style={{ backgroundColor: color }}
                    title={`Secondary ${index}: ${color}`}
                  />
                )
              )}
              {currentTheme.colors.accent.map(
                (color: string, index: number) => (
                  <div
                    key={`acc-${index}`}
                    className="color-swatch h-8 rounded border border-white/20"
                    style={{ backgroundColor: color }}
                    title={`Accent ${index}: ${color}`}
                  />
                )
              )}
            </div>
          </div>

          {/* Gradients */}
          <div className="gradients-card glass-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Gradients</h3>
            <div className="space-y-2">
              {Object.entries(currentTheme.colors.gradients).map(
                ([name, gradient]) => (
                  <div
                    key={name}
                    className="gradient-swatch h-8 rounded border border-white/20"
                    style={{ background: gradient as string }}
                    title={`${name}: ${gradient}`}
                  >
                    <div className="flex items-center justify-center h-full text-xs font-medium text-white mix-blend-difference">
                      {name}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Typography */}
          <div className="typography-card glass-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Typography</h3>
            <div className="space-y-2">
              <div
                style={{
                  fontFamily: currentTheme.typography.fontFamily.primary,
                }}
              >
                <span className="text-xs">Primary Font</span>
              </div>
              <div
                style={{
                  fontFamily: currentTheme.typography.fontFamily.secondary,
                }}
              >
                <span className="text-xs">Secondary Font</span>
              </div>
              <div
                style={{ fontFamily: currentTheme.typography.fontFamily.mono }}
              >
                <span className="text-xs">Mono Font</span>
              </div>
            </div>
          </div>

          {/* Effects Demo */}
          <div className="effects-card glass-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Effects</h3>
            <div className="space-y-3">
              <div
                className="shadow-demo h-12 rounded bg-white/10 flex items-center justify-center text-xs"
                style={{ boxShadow: currentTheme.effects.shadows.medium }}
              >
                Medium Shadow
              </div>
              <div
                className="glow-demo h-12 rounded bg-white/10 flex items-center justify-center text-xs"
                style={{ boxShadow: currentTheme.effects.shadows.glow }}
              >
                Glow Effect
              </div>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="interactive-card glass-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Interactive</h3>
            <div className="space-y-3">
              <button
                className="btn-primary w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: currentTheme.colors.gradients.primary,
                  color: currentTheme.colors.text.primary,
                }}
              >
                Primary Button
              </button>
              <button
                className="btn-secondary w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 bg-white/10"
                style={{
                  color: currentTheme.colors.text.primary,
                }}
              >
                Secondary Button
              </button>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="status-indicators mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(currentTheme.colors.status).map(([status, color]) => (
            <div
              key={status}
              className="status-indicator p-3 rounded-lg text-center text-sm font-medium capitalize"
              style={{
                backgroundColor: color as string,
                color: status === "warning" ? "#000" : "#fff",
              }}
            >
              {status}
            </div>
          ))}
        </div>

        {/* Theme Features */}
        <div className="theme-features mt-6 glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            ✨ Theme System Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">🎨 Multiple Themes</h4>
              <ul className="space-y-1 text-xs opacity-80">
                <li>• 7 unique theme variants</li>
                <li>• Light/Dark/Auto modes</li>
                <li>• Real-time switching</li>
                <li>• System preference detection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">♿ Accessibility</h4>
              <ul className="space-y-1 text-xs opacity-80">
                <li>• High contrast support</li>
                <li>• Reduced motion respect</li>
                <li>• Font size scaling</li>
                <li>• Keyboard navigation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💾 Persistence</h4>
              <ul className="space-y-1 text-xs opacity-80">
                <li>• LocalStorage integration</li>
                <li>• Settings memory</li>
                <li>• Cross-session consistency</li>
                <li>• Preference restoration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">⌨️ Shortcuts</h4>
              <ul className="space-y-1 text-xs opacity-80">
                <li>• Ctrl+Shift+T: Toggle mode</li>
                <li>• +/-: Font size</li>
                <li>• Ctrl+Shift+A: Accessibility</li>
                <li>• Customizable hotkeys</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
