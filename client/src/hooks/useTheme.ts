import { useContext } from "react";
import type { ThemeContextType } from "../theme";

// Theme Context (will be set by ThemeProvider)
export let ThemeContext: React.Context<ThemeContextType | undefined>;

export const setThemeContext = (
  context: React.Context<ThemeContextType | undefined>
) => {
  ThemeContext = context;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
