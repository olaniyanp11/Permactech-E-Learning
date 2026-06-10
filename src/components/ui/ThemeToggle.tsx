"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      suppressHydrationWarning
    >
      {!mounted ? (
        <span className="h-4 w-4" />
      ) : theme === "dark" ? (
        <IconSun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <IconMoon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
