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
import { CountUp, type CountUpOptions } from "countup.js";
import { ThemeContext } from "../../../providers/ThemeProvider";

export type AnimatedCounterSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

export type AnimatedCounterColor =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "muted";

export interface AnimatedCounterProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * The starting numerical value for the counter animation.
   * @default 0
   */
  start?: number;

  /**
   * The target numerical value to count to.
   */
  end: number;

  /**
   * Duration of the animation in seconds.
   * @default 2
   */
  duration?: number;

  /**
   * Text prepended to the counter result (e.g. "$", "€").
   * @default ""
   */
  prefix?: string;

  /**
   * Text appended to the counter result (e.g. "%", "+", "k").
   * @default ""
   */
  suffix?: string;

  /**
   * Number of decimal places to display.
   * @default 0
   */
  decimals?: number;

  /**
   * Controls easing behaviour.
   * Pass `true` for standard easeOutExpo, `false` for linear counting,
   * or provide a custom easing function `(t: number, b: number, c: number, d: number) => number`.
   * @default true
   */
  easing?: boolean | ((t: number, b: number, c: number, d: number) => number);

  /**
   * Character used as a thousands separator. Set to `""` to disable grouping.
   * @default ","
   */
  separator?: string;

  /**
   * Character used as the decimal point.
   * @default "."
   */
  decimal?: string;

  /**
   * Automatically trigger animation when the counter scrolls into viewport.
   * If false, the counter animates immediately on mount.
   * @default true
   */
  autoAnimate?: boolean;

  /**
   * When `autoAnimate` is enabled, whether to animate only once upon first entering the viewport.
   * @default true
   */
  autoAnimateOnce?: boolean;

  /**
   * Delay in milliseconds before beginning animation after the counter enters viewport.
   * @default 150
   */
  autoAnimateDelay?: number;

  /**
   * Size variant mapped to Antrosys typography tokens.
   * @default "2xl"
   */
  size?: AnimatedCounterSize;

  /**
   * Color variant mapped to Antrosys color tokens.
   * @default "default"
   */
  color?: AnimatedCounterColor;

  /**
   * Explicit theme mode override.
   * When omitted or set to "auto", inherits from ThemeContext or DOM data-theme.
   * @default "auto"
   */
  theme?: "light" | "dark" | "auto";

  /**
   * Optional background frame/container behind the counter to ensure high contrast across any surface.
   * @default false
   */
  frame?: boolean;

  /**
   * Callback invoked when the animation starts.
   */
  onStart?: () => void;

  /**
   * Callback invoked when the animation completes.
   */
  onComplete?: () => void;

  /**
   * Additional CSS class names to apply to the container.
   */
  className?: string;
}

/**
 * Formats a number into its string representation with prefix, suffix, separator, and decimals.
 * Used for initial server-side render, fallback, and accessibility labels.
 */
function formatCounterValue(
  value: number,
  decimals: number,
  prefix: string,
  suffix: string,
  separator: string,
  decimal: string
): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const fixed = absValue.toFixed(Math.max(0, decimals));
  const parts = fixed.split(".");

  const integerPart = separator
    ? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    : parts[0];
  const decimalPart = parts[1] ? `${decimal}${parts[1]}` : "";

  return `${isNegative ? "-" : ""}${prefix}${integerPart}${decimalPart}${suffix}`;
}

const sizeClasses: Record<AnimatedCounterSize, string> = {
  sm: "text-[length:var(--ant-typography-fontSize-base)] font-semibold tracking-tight leading-tight",
  md: "text-[length:var(--ant-typography-fontSize-md)] font-bold tracking-tight leading-tight",
  lg: "text-[length:var(--ant-typography-fontSize-xl)] font-bold tracking-tight leading-tight",
  xl: "text-[length:var(--ant-typography-fontSize-2xl)] font-bold tracking-tight leading-tight",
  "2xl": "text-[length:var(--ant-typography-fontSize-3xl)] font-bold tracking-tight leading-snug",
  "3xl": "text-[length:var(--ant-typography-fontSize-4xl)] font-bold tracking-tight leading-none",
  "4xl": "text-[length:var(--ant-typography-fontSize-4xl)] font-bold tracking-tighter leading-none",
};

const colorClasses: Record<AnimatedCounterColor, string> = {
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

const colorTokens: Record<
  AnimatedCounterColor,
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
 * AnimatedCounter Component
 *
 * Smooth, accessible number counter powered by CountUp.js 2.10.1 and Antrosys design tokens.
 * Supports decimal numbers, prefixes, suffixes, viewport triggering, reduced motion, and custom easing.
 */
export const AnimatedCounter = forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  (
    {
      start = 0,
      end,
      duration = 2,
      prefix = "",
      suffix = "",
      decimals = 0,
      easing = true,
      separator = ",",
      decimal = ".",
      autoAnimate = true,
      autoAnimateOnce = true,
      autoAnimateDelay = 150,
      size = "2xl",
      color = "default",
      theme = "auto",
      frame = false,
      onStart,
      onComplete,
      className,
      "aria-label": userAriaLabel,
      ...restProps
    },
    forwardedRef
  ) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const countUpRef = useRef<CountUp | null>(null);
    const prevEndRef = useRef<number>(end);

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

    // Keep callbacks current without breaking useEffect dependencies
    const onStartRef = useRef(onStart);
    onStartRef.current = onStart;

    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useImperativeHandle(forwardedRef, () => spanRef.current as HTMLSpanElement);

    // Check user preference for reduced motion
    const isReducedMotion = (): boolean =>
      typeof window !== "undefined" &&
      Boolean(
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
      );

    const prefersReducedMotion = isReducedMotion();

    const finalText = formatCounterValue(
      end,
      decimals,
      prefix,
      suffix,
      separator,
      decimal
    );

    const initialText = formatCounterValue(
      start,
      decimals,
      prefix,
      suffix,
      separator,
      decimal
    );

    const accessibleLabel = userAriaLabel ?? finalText;

    // Safe normal text: render final target value directly when reduced motion is preferred
    const displayText = prefersReducedMotion ? finalText : initialText;

    useEffect(() => {
      const element = spanRef.current;
      if (!element) return;

      const hasReducedMotion = isReducedMotion();

      // When reduced motion is preferred, completely bypass CountUp and its autoAnimate observer
      if (hasReducedMotion) {
        element.textContent = finalText;
        onCompleteRef.current?.();
        return;
      }

      const useEasingValue =
        typeof easing === "function" ? true : Boolean(easing);
      const easingFnValue =
        typeof easing === "function" ? easing : undefined;

      const countUpOptions: CountUpOptions = {
        startVal: start,
        decimalPlaces: Math.max(0, decimals),
        duration: Math.max(0, duration),
        prefix,
        suffix,
        separator,
        decimal,
        useEasing: useEasingValue,
        easingFn: easingFnValue,
        autoAnimate: Boolean(autoAnimate),
        autoAnimateOnce: Boolean(autoAnimateOnce),
        autoAnimateDelay: Math.max(0, autoAnimateDelay),
        onStartCallback: () => {
          onStartRef.current?.();
        },
        onCompleteCallback: () => {
          onCompleteRef.current?.();
        },
      };

      const instance = new CountUp(element, end, countUpOptions);
      countUpRef.current = instance;
      prevEndRef.current = end;

      if (instance.error) {
        // Fallback in case of target or numeric validation issue
        element.textContent = finalText;
        onCompleteRef.current?.();
        return;
      }

      if (!autoAnimate) {
        // Trigger manual start if autoAnimate viewport observer is not used
        instance.start();
      }

      return () => {
        instance.onDestroy();
        countUpRef.current = null;
      };
    }, [
      start,
      duration,
      prefix,
      suffix,
      decimals,
      easing,
      separator,
      decimal,
      autoAnimate,
      autoAnimateOnce,
      autoAnimateDelay,
      finalText,
    ]);

    // Handle dynamic updates to `end` value when other options stay unchanged
    useEffect(() => {
      if (prevEndRef.current !== end) {
        prevEndRef.current = end;
        if (isReducedMotion()) {
          if (spanRef.current) {
            spanRef.current.textContent = finalText;
          }
          onCompleteRef.current?.();
        } else if (countUpRef.current) {
          countUpRef.current.update(end);
        }
      }
    }, [end, finalText]);

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

    const frameClasses = frame
      ? isDark
        ? "bg-[var(--ant-color-neutral-800)] border border-[var(--ant-color-neutral-700)] rounded-[var(--ant-radius-md)] px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] shadow-[var(--ant-shadow-sm)]"
        : "bg-[var(--ant-color-neutral-100)] border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] shadow-[var(--ant-shadow-sm)]"
      : "";

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
          "inline-flex items-baseline font-sans tabular-nums select-none antialiased",
          sizeClasses[size],
          activeColorClass,
          frameClasses,
          className
        )}
      >
        {displayText}
      </span>
    );
  }
);

AnimatedCounter.displayName = "AnimatedCounter";
