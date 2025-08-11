import React from "react";
import { useTheme } from "../hooks/useTheme";
import type { ThemeMode } from "../theme";

export const ThemeSwitch: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { themeMode, setThemeMode } = useTheme();

  const modes: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: "light", label: "Light", icon: "☀️" },
    { mode: "dark", label: "Dark", icon: "🌙" },
    { mode: "auto", label: "Auto", icon: "⚡" },
  ];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {modes.map(({ mode, label, icon }) => (
        <button
          key={mode}
          onClick={() => setThemeMode(mode)}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${
              themeMode === mode
                ? "bg-white/20 text-white shadow-glow"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }
          `}
          title={`Switch to ${label} mode`}
          aria-label={`Switch to ${label} mode`}
        >
          <span className="mr-1">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
};
