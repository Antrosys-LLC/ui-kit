import React, { useState, useEffect, useContext } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeContext } from "../../../providers/ThemeProvider";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface ThemeToggleProps {
  /** Default theme fallback if not saved in storage (default: 'light') */
  defaultTheme?: "light" | "dark";
  /** LocalStorage key for persistence (default: 'antrosys-ui-theme') */
  storageKey?: string;
  /** Enable smooth CSS transition animation during toggle (default: true) */
  transition?: boolean;
  /** Whether to show the text label alongside the icon (default: true) */
  showLabel?: boolean;
  /** Additional wrapper CSS class names */
  className?: string;
}

export function ThemeToggle({
  defaultTheme,
  storageKey = "ant-theme",
  transition = true,
  showLabel = true,
  className,
}: ThemeToggleProps) {
  const context = useContext(ThemeContext);
  
  const [localTheme, setLocalTheme] = useState<"light" | "dark">(() => {
    if (defaultTheme) return defaultTheme;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") return saved;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  });

  const activeTheme = context ? context.theme : localTheme;

  useEffect(() => {
    // If ThemeProvider is present, it handles DOM updates!
    if (context) return; 

    const root = document.documentElement;
    if (transition) {
      root.style.setProperty("transition", "background-color 0.3s ease, color 0.3s ease");
    }
    root.setAttribute("data-theme", activeTheme);
    if (activeTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(storageKey, activeTheme);
  }, [activeTheme, storageKey, transition, context]);

  const toggleTheme = () => {
    if (context) {
      context.toggleTheme();
    } else {
      setLocalTheme((prev) => (prev === "light" ? "dark" : "light"));
    }
  };

  const isDark = activeTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center gap-[var(--ant-spacing-2)]",
        "px-[var(--ant-spacing-3)] py-[var(--ant-spacing-2)]",
        "bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-surface-text)]",
        "border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)]",
        "text-[var(--ant-typography-fontSize-sm)] font-[var(--ant-typography-fontWeight-medium)]",
        "cursor-pointer transition-colors shadow-sm",
        "hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-2",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="inline-flex items-center text-[var(--ant-color-surface-text-sub)]">
        {isDark ? (
          <svg
            className="w-4 h-4 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2m-4.22-7.78l-1.42 1.42M5.64 18.36l-1.42 1.42" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </span>
      {showLabel && <span>{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
}