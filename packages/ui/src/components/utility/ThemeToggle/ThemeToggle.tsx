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
  defaultTheme = "light",
  storageKey = "antrosys-ui-theme",
  transition = true,
  showLabel = true,
  className,
}: ThemeToggleProps) {
  const context = useContext(ThemeContext);
  
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Prioritize explicit defaultTheme prop if provided, else check storage
    if (defaultTheme) return defaultTheme;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") return saved;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return context?.theme === "dark" ? "dark" : "light";
  });

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (defaultTheme) {
      setTheme(defaultTheme);
    }
  }, [defaultTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (transition) {
      root.style.setProperty("transition", "background-color 0.3s ease, color 0.3s ease");
    }
    root.setAttribute("data-theme", theme);
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey, transition]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const isDark = theme === "dark";

  const wrapperBg = isDark ? "#0f172a" : "#ffffff";
  const wrapperColor = isDark ? "#f8fafc" : "#0f172a";
  const bgColor = isDark ? "var(--ant-color-neutral-900, #111827)" : "var(--ant-color-neutral-0, #ffffff)";
  const textColor = isDark ? "var(--ant-color-neutral-100, #f3f4f6)" : "var(--ant-color-neutral-900, #0f172a)";
  const borderColor = isDark ? "var(--ant-color-neutral-700, #374151)" : "var(--ant-color-neutral-300, #cbd5e1)";
  const hoverBgColor = isDark ? "var(--ant-color-neutral-800, #1f2937)" : "var(--ant-color-neutral-100, #f1f5f9)";
  const iconColor = isDark ? "var(--ant-color-neutral-300, #9ca3af)" : "var(--ant-color-neutral-700, #4b5563)";

  return (
    <div
      style={{
        backgroundColor: wrapperBg,
        color: wrapperColor,
        padding: "24px",
        transition: transition ? "background-color 0.3s ease, color 0.3s ease" : "none",
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
        minHeight: "100px",
      }}
    >
      <div className={cn("relative inline-flex", className)}>
        <button
          type="button"
          onClick={toggleTheme}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--ant-spacing-2, 8px)",
            padding: "var(--ant-spacing-2, 6px) var(--ant-spacing-3, 12px)",
            fontSize: "var(--ant-typography-fontsize-sm, 13px)",
            fontWeight: 500,
            backgroundColor: bgColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
            borderRadius: "0px",
            cursor: "pointer",
            transition: "background-color 0.15s ease, border-color 0.15s ease",
            outline: isFocused ? "2px solid var(--ant-color-brand-primary, #2563eb)" : "none",
            outlineOffset: "2px",
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = hoverBgColor;
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = bgColor;
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", color: iconColor }}>
            {isDark ? (
              <svg
                style={{ width: "16px", height: "16px", transition: "transform 0.2s ease" }}
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
                style={{ width: "16px", height: "16px", transition: "transform 0.2s ease" }}
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
      </div>
    </div>
  );
}