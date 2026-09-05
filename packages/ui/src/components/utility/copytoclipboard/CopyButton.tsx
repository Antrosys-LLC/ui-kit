import React, { useState, useContext } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeContext } from "../../../providers/ThemeProvider";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface CopyButtonProps {
  /** The direct string value to copy to clipboard */
  value?: string;
  /** CSS selector to query text content from an element (alternative to value) */
  selector?: string;
  /** Optional button label text */
  label?: string;
  /** Duration in milliseconds before resetting the copied state (default: 2000) */
  timeout?: number;
  /** Callback fired upon successful copy */
  onCopy?: (text: string) => void;
  /** Additional wrapper CSS class names */
  className?: string;
}

export function CopyButton({
  value,
  selector,
  label,
  timeout = 2000,
  onCopy,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const themeCtx = useContext(ThemeContext);
  const isDark = themeCtx?.theme === "dark";

  const handleCopy = async () => {
    let textToCopy = value || "";

    if (!textToCopy && selector) {
      const element = document.querySelector(selector);
      if (element) {
        textToCopy = element.textContent || (element as HTMLInputElement).value || "";
      }
    }

    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopy?.(textToCopy);

      setTimeout(() => {
        setCopied(false);
      }, timeout);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Using CSS custom properties from @antrosys/tokens
  const bgColor = isDark ? "var(--ant-color-neutral-900)" : "var(--ant-color-neutral-0, #ffffff)";
  const textColor = isDark ? "var(--ant-color-neutral-100)" : "var(--ant-color-neutral-900)";
  const borderColor = isDark ? "var(--ant-color-neutral-700)" : "var(--ant-color-neutral-300)";
  const hoverBgColor = isDark ? "var(--ant-color-neutral-800)" : "var(--ant-color-neutral-100)";
  const iconColor = isDark ? "var(--ant-color-neutral-400)" : "var(--ant-color-neutral-600)";

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={handleCopy}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label={copied ? "Copied!" : "Copy to clipboard"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--ant-spacing-2)",
          padding: "var(--ant-spacing-2) var(--ant-spacing-3)",
          fontSize: "var(--ant-typography-fontsize-sm, 13px)",
          fontWeight: 500,
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          borderRadius: "0px", // 0px border radius per Antrosys spec
          cursor: "pointer",
          transition: "background-color 0.15s ease, border-color 0.15s ease",
          outline: isFocused ? "2px solid var(--ant-color-brand-primary, #2563eb)" : "none",
          outlineOffset: "2px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hoverBgColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = bgColor;
        }}
      >
        {/* Copy / Checkmark Icon Animation */}
        <span style={{ display: "inline-flex", alignItems: "center", color: iconColor }}>
          {copied ? (
            <svg
              style={{ width: "14px", height: "14px", color: "var(--ant-color-success, #10b981)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              style={{ width: "14px", height: "14px" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </span>

        {/* Label Display */}
        {label && <span>{copied ? "Copied!" : label}</span>}

        {/* Floating Tooltip Confirmation Bubble */}
        {copied && !label && (
          <span
            role="tooltip"
            style={{
              position: "absolute",
              top: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "2px var(--ant-spacing-2)",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "0px",
              backgroundColor: isDark ? "var(--ant-color-neutral-100)" : "var(--ant-color-neutral-900)",
              color: isDark ? "var(--ant-color-neutral-900)" : "var(--ant-color-neutral-0)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}