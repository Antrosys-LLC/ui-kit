import React, { useState, useEffect, useContext } from "react";
import { clsx } from "clsx";
import { codeToHtml } from "shiki";
import { ThemeContext } from "../../../providers/ThemeProvider";

export interface CodeBlockProps extends React.ComponentPropsWithoutRef<"div"> {
  /** The source code string to display */
  code: string;
  /** Programming language identifier supported by Shiki (e.g., 'typescript', 'tsx', 'json') */
  lang?: string;
  /** Array of line numbers to visually highlight */
  highlightLines?: number[];
  /** Starting line number offset (default: 1) */
  startLineNumber?: number;
  /** Whether to show line numbers (default: true) */
  showLineNumbers?: boolean;
  /** Enable diff mode styling */
  diff?: boolean;
  /** Maximum height before collapsing long blocks (e.g., '300px') */
  maxHeight?: string;
  /** Optional filename or title to display in the header bar */
  filename?: string;
  /** Whether to wrap long lines instead of horizontal scrolling (default: false) */
  wrapLines?: boolean;
  /** Whether to show the copy button in the header (default: true) */
  showCopyButton?: boolean;
  /** Additional custom actions/buttons rendered in the header toolbar */
  actions?: React.ReactNode;
  /** Optional manual Shiki theme override (e.g., 'nord', 'one-dark-pro', 'github-dark') */
  customTheme?: string;
  /** Optional notification text shown upon successful copy (default: 'Copied!') */
  copySuccessText?: string;
}

export function CodeBlock({
  code,
  lang = "typescript",
  highlightLines = [],
  startLineNumber = 1,
  showLineNumbers = true,
  diff = false,
  maxHeight,
  filename,
  wrapLines = false,
  showCopyButton = true,
  actions,
  customTheme,
  copySuccessText = "Copied!",
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const themeCtx = useContext(ThemeContext);
  const isDark = themeCtx?.theme === "dark";

  useEffect(() => {
    let isMounted = true;
    async function highlightCode() {
      setIsLoading(true);
      try {
        const activeTheme = customTheme || (isDark ? "github-dark" : "github-light");
        const html = await codeToHtml(code, {
          lang: lang as any,
          theme: activeTheme as any,
        });
        if (isMounted) {
          setHighlightedHtml(html);
        }
      } catch (error) {
        console.error("Failed to highlight code with Shiki:", error);
        if (isMounted) {
          setHighlightedHtml(`<pre><code>${code}</code></pre>`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    highlightCode();
    return () => {
      isMounted = false;
    };
  }, [code, lang, isDark, customTheme]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const linesCount = code.trim().split("\n").length;
  const isCollapsible = maxHeight && linesCount > 12;

  const borderColor = isDark ? "var(--ant-color-neutral-700)" : "var(--ant-color-neutral-300)";
  const headerBg = isDark ? "var(--ant-color-neutral-800)" : "var(--ant-color-neutral-100)";
  const codeBg = isDark ? "var(--ant-color-neutral-900)" : "var(--ant-color-neutral-0)";
  const textColor = isDark ? "var(--ant-color-neutral-100)" : "var(--ant-color-neutral-900)";

  return (
    <div
      className={clsx("ant-code-block", className)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${borderColor}`,
        backgroundColor: codeBg,
        color: textColor,
        borderRadius: "0px",
        width: "100%",
        fontFamily: "var(--ant-font-family-mono, monospace)",
      }}
      {...props}
    >
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--ant-spacing-2) var(--ant-spacing-4)",
          backgroundColor: headerBg,
          borderBottom: `1px solid ${borderColor}`,
          fontSize: "var(--ant-typography-fontsize-xs, 12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--ant-spacing-2)" }}>
          {filename && <span style={{ fontWeight: 600 }}>{filename}</span>}
          <span
            style={{
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              opacity: filename ? 0.7 : 1,
            }}
          >
            {lang}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--ant-spacing-2)" }}>
          {actions}
          {showCopyButton && (
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: "transparent",
                border: `1px solid ${borderColor}`,
                color: textColor,
                padding: "2px 8px",
                borderRadius: "0px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 500,
              }}
            >
              {copied ? copySuccessText : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Code Container with Shiki Highlighting */}
      <div
        style={{
          maxHeight: isCollapsible && !isExpanded ? maxHeight : "none",
          overflow: wrapLines ? "visible" : "auto",
          padding: "var(--ant-spacing-3) var(--ant-spacing-4)",
          position: "relative",
          whiteSpace: wrapLines ? "pre-wrap" : "pre",
          wordBreak: wrapLines ? "break-word" : "normal",
        }}
      >
        {isLoading ? (
          <div style={{ padding: "var(--ant-spacing-4)", textAlign: "center", fontSize: "12px", opacity: 0.6 }}>
            Highlighting code...
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            style={{
              margin: 0,
              backgroundColor: "transparent !important",
            }}
          />
        )}
      </div>

      {/* Expand/Collapse Toggle */}
      {isCollapsible && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: "100%",
            padding: "var(--ant-spacing-2)",
            backgroundColor: headerBg,
            borderTop: `1px solid ${borderColor}`,
            borderBottom: "none",
            borderLeft: "none",
            borderRight: "none",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 500,
            textAlign: "center",
            color: "var(--ant-color-brand-primary, #2563eb)",
          }}
        >
          {isExpanded ? "Collapse code block" : "Expand code block"}
        </button>
      )}
    </div>
  );
}