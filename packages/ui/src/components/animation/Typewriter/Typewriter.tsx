import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useContext,
  useState,
  useCallback,
  HTMLAttributes,
} from "react";
import { clsx } from "clsx";
import TypeIt, { type Options } from "typeit";
import { ThemeContext } from "../../../providers/ThemeProvider";

export type TypewriterSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

export type TypewriterColor =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "muted";

export interface TypewriterProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * Array of string phrases to type, delete, and cycle through.
   */
  strings: string[];

  /**
   * Typing speed in milliseconds per character.
   * Lower values type faster.
   * @default 60
   */
  speed?: number;

  /**
   * Deleting speed in milliseconds per character.
   * Lower values delete faster.
   * @default 40
   */
  deleteSpeed?: number;

  /**
   * Whether to loop through the strings continuously.
   * @default true
   */
  loop?: boolean;

  /**
   * Delay in milliseconds after typing a string before deleting it.
   * @default 1500
   */
  pauseDuration?: number;

  /**
   * Delay in milliseconds before starting the typewriter animation.
   * @default 200
   */
  startDelay?: number;

  /**
   * Delay in milliseconds before restarting the loop from the first string.
   * @default 1000
   */
  loopDelay?: number;

  /**
   * Whether to display the cursor, or a custom string character for the cursor (e.g. "|", "_", "▋").
   * Pass `false` to hide the cursor entirely.
   * @default true
   */
  cursor?: boolean | string;

  /**
   * Blink speed of the cursor in milliseconds.
   * @default 500
   */
  cursorSpeed?: number;

  /**
   * Color variant for the cursor. If omitted, matches the text color.
   */
  cursorColor?: TypewriterColor;

  /**
   * Whether the strings contain HTML markup to be parsed.
   * When true, tags are rendered natively rather than typed out as literal text.
   * @default false
   */
  html?: boolean;

  /**
   * Whether to break lines on new strings instead of deleting and replacing.
   * @default false
   */
  breakLines?: boolean;

  /**
   * Typography size preset mapped to Antrosys tokens.
   * @default "2xl"
   */
  size?: TypewriterSize;

  /**
   * Text color variant mapped to Antrosys tokens.
   * @default "default"
   */
  color?: TypewriterColor;

  /**
   * Explicit theme mode override ("light" | "dark" | "auto").
   * When omitted or "auto", automatically detects theme from context and DOM.
   * @default "auto"
   */
  theme?: "light" | "dark" | "auto";

  /**
   * Callback invoked when typing starts.
   */
  onStart?: () => void;

  /**
   * Callback invoked when a complete cycle of strings finishes (if loop is false).
   */
  onComplete?: () => void;

  /**
   * Additional custom CSS classes.
   */
  className?: string;
}

const sizeClasses: Record<TypewriterSize, string> = {
  sm: "text-[length:var(--ant-typography-fontSize-base)] font-semibold tracking-tight leading-tight",
  md: "text-[length:var(--ant-typography-fontSize-md)] font-bold tracking-tight leading-tight",
  lg: "text-[length:var(--ant-typography-fontSize-xl)] font-bold tracking-tight leading-tight",
  xl: "text-[length:var(--ant-typography-fontSize-2xl)] font-bold tracking-tight leading-tight",
  "2xl": "text-[length:var(--ant-typography-fontSize-3xl)] font-bold tracking-tight leading-snug",
  "3xl": "text-[length:var(--ant-typography-fontSize-4xl)] font-bold tracking-tight leading-none",
  "4xl": "text-[length:var(--ant-typography-fontSize-4xl)] font-bold tracking-tighter leading-none",
};

const colorClasses: Record<TypewriterColor, string> = {
  default:
    "text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-0)] [.dark_&]:text-[var(--ant-color-neutral-0)]",
  brand: "text-[var(--ant-color-brand-primary)]",
  success: "text-[var(--ant-color-semantic-success)]",
  warning: "text-[var(--ant-color-semantic-warning)]",
  error: "text-[var(--ant-color-semantic-error)]",
  info: "text-[var(--ant-color-semantic-info)]",
  muted:
    "text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)]",
};

const cursorColorClasses: Record<TypewriterColor, string> = {
  default:
    "[&_.ti-cursor]:text-[var(--ant-color-surface-text)] [[data-theme=dark]_&_.ti-cursor]:text-[var(--ant-color-neutral-0)] [.dark_&_.ti-cursor]:text-[var(--ant-color-neutral-0)]",
  brand: "[&_.ti-cursor]:text-[var(--ant-color-brand-primary)]",
  success: "[&_.ti-cursor]:text-[var(--ant-color-semantic-success)]",
  warning: "[&_.ti-cursor]:text-[var(--ant-color-semantic-warning)]",
  error: "[&_.ti-cursor]:text-[var(--ant-color-semantic-error)]",
  info: "[&_.ti-cursor]:text-[var(--ant-color-semantic-info)]",
  muted:
    "[&_.ti-cursor]:text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&_.ti-cursor]:text-[var(--ant-color-neutral-400)] [.dark_&_.ti-cursor]:text-[var(--ant-color-neutral-400)]",
};

const colorTokens: Record<
  TypewriterColor,
  { light: string; dark: string }
> = {
  default: {
    light: "var(--ant-color-surface-text)",
    dark: "var(--ant-color-neutral-0)",
  },
  brand: {
    light: "var(--ant-color-brand-primary)",
    dark: "var(--ant-color-brand-primary)",
  },
  success: {
    light: "var(--ant-color-semantic-success)",
    dark: "var(--ant-color-semantic-success)",
  },
  warning: {
    light: "var(--ant-color-semantic-warning)",
    dark: "var(--ant-color-semantic-warning)",
  },
  error: {
    light: "var(--ant-color-semantic-error)",
    dark: "var(--ant-color-semantic-error)",
  },
  info: {
    light: "var(--ant-color-semantic-info)",
    dark: "var(--ant-color-semantic-info)",
  },
  muted: {
    light: "var(--ant-color-surface-text-sub)",
    dark: "var(--ant-color-neutral-400)",
  },
};

/**
 * Typewriter Component
 *
 * Polished, accessible text typing animation powered by TypeIt and Antrosys design tokens.
 * Features multi-phrase cycling, customizable speeds, custom cursors, HTML parsing, and reduced-motion safety.
 */
export const Typewriter = forwardRef<HTMLSpanElement, TypewriterProps>(
  (
    {
      strings = [],
      speed = 60,
      deleteSpeed = 40,
      loop = true,
      pauseDuration = 1500,
      startDelay = 200,
      loopDelay = 1000,
      cursor = true,
      cursorSpeed = 500,
      cursorColor,
      html = false,
      breakLines = false,
      size = "2xl",
      color = "default",
      theme = "auto",
      onStart,
      onComplete,
      className,
      "aria-label": userAriaLabel,
      ...restProps
    },
    forwardedRef
  ) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const typeItRef = useRef<TypeIt | null>(null);

    const themeCtx = useContext(ThemeContext);
    const checkDomTheme = useCallback((): "light" | "dark" => {
      if (typeof document === "undefined") return "light";
      const themedAncestor = spanRef.current?.closest(
        "[data-theme], .dark"
      );
      if (themedAncestor) {
        if (
          themedAncestor.classList.contains("dark") ||
          themedAncestor.getAttribute("data-theme") === "dark"
        ) {
          return "dark";
        }
        if (themedAncestor.getAttribute("data-theme") === "light") {
          return "light";
        }
      }
      if (themeCtx?.theme) {
        return themeCtx.theme;
      }
      const isDocDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark");
      return isDocDark ? "dark" : "light";
    }, [themeCtx?.theme]);

    const [domTheme, setDomTheme] = useState<"light" | "dark">(() => {
      if (typeof document === "undefined") return "light";
      if (themeCtx?.theme) return themeCtx.theme;
      const isDocDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark");
      return isDocDark ? "dark" : "light";
    });

    const useIsomorphicLayoutEffect =
      typeof window !== "undefined" ? useLayoutEffect : useEffect;

    useIsomorphicLayoutEffect(() => {
      setDomTheme(checkDomTheme());
    }, [checkDomTheme]);

    useEffect(() => {
      setDomTheme(checkDomTheme());

      if (typeof document !== "undefined") {
        const observer = new MutationObserver(() => {
          setDomTheme(checkDomTheme());
        });
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["data-theme", "class"],
        });
        if (spanRef.current) {
          let current: HTMLElement | null = spanRef.current.parentElement;
          while (current && current !== document.body) {
            observer.observe(current, {
              attributes: true,
              attributeFilter: ["data-theme", "class"],
            });
            current = current.parentElement;
          }
        }
        return () => observer.disconnect();
      }
    }, [checkDomTheme]);

    const isDark =
      theme === "dark" ||
      (theme !== "light" && domTheme === "dark");

    const onStartRef = useRef(onStart);
    onStartRef.current = onStart;

    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useImperativeHandle(forwardedRef, () => spanRef.current as HTMLSpanElement);

    const isReducedMotion = (): boolean =>
      typeof window !== "undefined" &&
      Boolean(
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
      );

    const prefersReducedMotion = isReducedMotion();

    const sanitizedStrings = Array.isArray(strings) ? strings : [strings];
    const initialText = sanitizedStrings[0] ?? "";
    const accessibleLabel = userAriaLabel ?? sanitizedStrings.join(", ");
    const stringsKey = sanitizedStrings.join("\u0000");

    useEffect(() => {
      const element = spanRef.current;
      if (!element || sanitizedStrings.length === 0) return;

      const hasReducedMotion = isReducedMotion();

      if (hasReducedMotion) {
        if (html) {
          element.innerHTML = sanitizedStrings[0] || "";
        } else {
          element.textContent = sanitizedStrings[0] || "";
        }
        onStartRef.current?.();
        onCompleteRef.current?.();
        return;
      }

      element.innerHTML = "";
      onStartRef.current?.();

      const isCursorActive = cursor !== false;
      const cursorChar = typeof cursor === "string" ? cursor : "|";

      const typeItOptions: Options = {
        strings: sanitizedStrings,
        speed: Math.max(1, speed),
        deleteSpeed: Math.max(1, deleteSpeed),
        loop: Boolean(loop),
        breakLines: Boolean(breakLines),
        html: Boolean(html),
        cursor: isCursorActive,
        cursorChar,
        cursorSpeed: Math.max(50, cursorSpeed),
        nextStringDelay: Math.max(0, pauseDuration),
        loopDelay: Math.max(0, loopDelay),
        startDelay: Math.max(0, startDelay),
        afterComplete: () => {
          onCompleteRef.current?.();
        },
      };

      const instance = new TypeIt(element, typeItOptions);
      typeItRef.current = instance;
      instance.go();

      return () => {
        instance.destroy();
        typeItRef.current = null;
      };
    }, [
      stringsKey,
      speed,
      deleteSpeed,
      loop,
      pauseDuration,
      startDelay,
      loopDelay,
      cursor,
      cursorSpeed,
      html,
      breakLines,
    ]);

    const activeColorClass =
      color === "default"
        ? isDark
          ? "text-[var(--ant-color-neutral-0)]"
          : "text-[var(--ant-color-surface-text)]"
        : color === "muted"
        ? isDark
          ? "text-[var(--ant-color-neutral-400)]"
          : "text-[var(--ant-color-surface-text-sub)]"
        : colorClasses[color];

    const resolvedColor =
      colorTokens[color]
        ? isDark
          ? colorTokens[color].dark
          : colorTokens[color].light
        : undefined;

    const activeCursorClass = cursorColor
      ? cursorColorClasses[cursorColor]
      : "[&_.ti-cursor]:text-current";

    const resolvedStyle: React.CSSProperties = {
      ...(resolvedColor ? { color: resolvedColor } : {}),
      ...restProps.style,
    };

    return (
      <span
        ref={spanRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={accessibleLabel}
        {...restProps}
        style={resolvedStyle}
        className={clsx(
          "inline-flex items-baseline font-sans select-none antialiased [&_.ti-cursor]:font-normal",
          sizeClasses[size],
          activeColorClass,
          activeCursorClass,
          className
        )}
      >
        {prefersReducedMotion ? (
          html ? (
            <span dangerouslySetInnerHTML={{ __html: initialText }} />
          ) : (
            initialText
          )
        ) : null}
      </span>
    );
  }
);

Typewriter.displayName = "Typewriter";
