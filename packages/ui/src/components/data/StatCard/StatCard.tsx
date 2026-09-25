import React, { useEffect, useRef, useId, useContext } from "react";
import { clsx } from "clsx";
import { CountUp } from "countup.js";
import { ThemeContext } from "../../../providers/ThemeProvider";

/**
 * Props for the StatCard component.
 */
export interface StatCardProps {
  /** Metric label describing what the number represents */
  label: string;
  /** Current numerical metric value */
  value: number;
  /** Trend direction ("up" | "down") */
  trend?: "up" | "down";
  /** Numerical data points used to render the sparkline chart */
  sparklineData?: number[];
  /** Content displayed before the value (e.g. "$", "€") */
  prefix?: string;
  /** Content displayed after the value (e.g. "%", "k", "ms") */
  suffix?: string;
  /** Whether the card is in an animated skeleton loading state */
  loading?: boolean;
  /** Trend comparison value or percentage text (e.g. "+12.5%", "8.2%") */
  trendValue?: string | number;
  /** Period description for the trend comparison (e.g. "vs last month", "vs previous period") */
  period?: string;
  /** Additional CSS class names for the card container */
  className?: string;
}

interface SparklineProps {
  data: number[];
  trend?: "up" | "down";
  isDark: boolean;
  id: string;
}

function Sparkline({ data, trend, isDark, id }: SparklineProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const padding = 2;
  const usableHeight = height - padding * 2;

  const step = data.length > 1 ? width / (data.length - 1) : width;
  const points = data.map((val, idx) => {
    const x = idx * step;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  const pathD = points.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
    ""
  );
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const strokeColor =
    trend === "up"
      ? "var(--ant-color-semantic-success)"
      : trend === "down"
        ? "var(--ant-color-semantic-error)"
        : "var(--ant-color-brand-primary)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-8 overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sparkline-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={isDark ? "0.35" : "0.2"} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sparkline-grad-${id})`} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Reusable dashboard metric card with animated number counter, trend indicator,
 * sparkline mini-chart, period comparison badge, and accessible skeleton loading state.
 */
export function StatCard({
  label,
  value,
  trend,
  sparklineData,
  prefix,
  suffix,
  loading = false,
  trendValue,
  period,
  className,
}: StatCardProps) {
  const themeCtx = useContext(ThemeContext);
  const isDark = themeCtx?.theme === "dark";

  const sparklineId = useId().replace(/:/g, "_");
  const countUpRef = useRef<HTMLSpanElement>(null);
  const instanceRef = useRef<CountUp | null>(null);

  // Decimal count
  const decimals = Number.isInteger(value)
    ? 0
    : value.toString().split(".")[1]?.length || 2;

  const formattedInitial = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  useEffect(() => {
    if (loading || !countUpRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (instanceRef.current && instanceRef.current.el === countUpRef.current) {
      instanceRef.current.update(value);
    } else {
      const countUp = new CountUp(countUpRef.current, value, {
        duration: prefersReducedMotion ? 0 : 1.2,
        decimalPlaces: decimals,
        useGrouping: true,
      });

      if (!countUp.error) {
        countUp.start();
        instanceRef.current = countUp;
      }
    }
  }, [value, decimals, loading]);

  if (loading) {
    return (
      <div
        role="status"
        aria-label={`Loading ${label} metric`}
        className={clsx(
          "flex flex-col justify-between rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] p-[var(--ant-spacing-4)] sm:p-[var(--ant-spacing-5)]",
          isDark
            ? "bg-[var(--ant-color-neutral-800)] text-[var(--ant-color-neutral-100)]"
            : "bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-surface-text)]",
          "shadow-[var(--ant-shadow-sm)]",
          "font-[family-name:var(--ant-typography-fontFamily-sans)]",
          className
        )}
      >
        <div className="space-y-[var(--ant-spacing-3)]">
          {/* Label skeleton */}
          <div className="flex items-center justify-between">
            <div
              className={clsx(
                "h-[var(--ant-spacing-4)] w-24 rounded-[var(--ant-radius-sm)] animate-pulse",
                isDark ? "bg-[var(--ant-color-neutral-700)]" : "bg-[var(--ant-color-neutral-200)]"
              )}
            />
            {sparklineData && (
              <div
                className={clsx(
                  "h-6 w-20 rounded-[var(--ant-radius-sm)] animate-pulse",
                  isDark ? "bg-[var(--ant-color-neutral-700)]" : "bg-[var(--ant-color-neutral-200)]"
                )}
              />
            )}
          </div>

          {/* Value skeleton */}
          <div
            className={clsx(
              "h-8 sm:h-9 w-36 rounded-[var(--ant-radius-md)] animate-pulse",
              isDark ? "bg-[var(--ant-color-neutral-700)]" : "bg-[var(--ant-color-neutral-200)]"
            )}
          />

          {/* Trend / period skeleton */}
          <div className="flex items-center gap-[var(--ant-spacing-2)] pt-[var(--ant-spacing-1)]">
            <div
              className={clsx(
                "h-5 w-16 rounded-[var(--ant-radius-sm)] animate-pulse",
                isDark ? "bg-[var(--ant-color-neutral-700)]" : "bg-[var(--ant-color-neutral-200)]"
              )}
            />
            <div
              className={clsx(
                "h-4 w-20 rounded-[var(--ant-radius-sm)] animate-pulse",
                isDark ? "bg-[var(--ant-color-neutral-700)]" : "bg-[var(--ant-color-neutral-200)]"
              )}
            />
          </div>
        </div>
        <span className="sr-only">Loading {label} metric...</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex flex-col justify-between rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] p-[var(--ant-spacing-4)] sm:p-[var(--ant-spacing-5)]",
        isDark
          ? "bg-[var(--ant-color-neutral-800)] text-[var(--ant-color-neutral-100)]"
          : "bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-surface-text)]",
        "shadow-[var(--ant-shadow-sm)] transition-shadow hover:shadow-[var(--ant-shadow-md)]",
        "font-[family-name:var(--ant-typography-fontFamily-sans)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-[var(--ant-spacing-2)] mb-[var(--ant-spacing-2)]">
        <h3
          className={clsx(
            "text-[length:var(--ant-typography-fontSize-sm)] font-medium leading-[var(--ant-typography-lineHeight-normal)] truncate",
            isDark ? "text-[var(--ant-color-neutral-400)]" : "text-[var(--ant-color-surface-text-sub)]"
          )}
        >
          {label}
        </h3>
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-24 sm:w-28 shrink-0 ml-auto">
            <Sparkline
              data={sparklineData}
              trend={trend}
              isDark={isDark}
              id={sparklineId}
            />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 my-[var(--ant-spacing-1)]">
        {prefix && (
          <span
            className={clsx(
              "text-[length:var(--ant-typography-fontSize-xl)] font-semibold select-none",
              isDark ? "text-[var(--ant-color-neutral-300)]" : "text-[var(--ant-color-surface-text-sub)]"
            )}
          >
            {prefix}
          </span>
        )}
        <span
          ref={countUpRef}
          className={clsx(
            "text-[length:var(--ant-typography-fontSize-3xl)] sm:text-[length:var(--ant-typography-fontSize-4xl)] font-bold tracking-tight leading-none",
            isDark ? "text-[var(--ant-color-neutral-0)]" : "text-[var(--ant-color-surface-text)]"
          )}
        >
          {formattedInitial}
        </span>
        {suffix && (
          <span
            className={clsx(
              "text-[length:var(--ant-typography-fontSize-lg)] sm:text-[length:var(--ant-typography-fontSize-xl)] font-semibold select-none",
              isDark ? "text-[var(--ant-color-neutral-300)]" : "text-[var(--ant-color-surface-text-sub)]"
            )}
          >
            {suffix}
          </span>
        )}
      </div>

      {(trend || trendValue !== undefined || period) && (
        <div className="flex items-center gap-[var(--ant-spacing-2)] mt-[var(--ant-spacing-2)] flex-wrap">
          {trend && (
            <span
              className={clsx(
                "inline-flex items-center gap-1 px-[var(--ant-spacing-2)] py-0.5 rounded-[var(--ant-radius-sm)] text-[length:var(--ant-typography-fontSize-xs)] font-medium",
                trend === "up"
                  ? "text-[var(--ant-color-semantic-success)] bg-[var(--ant-color-semantic-success)]/10"
                  : "text-[var(--ant-color-semantic-error)] bg-[var(--ant-color-semantic-error)]/10"
              )}
            >
              {trend === "up" ? (
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              )}
              <span>{trendValue ?? (trend === "up" ? "Up" : "Down")}</span>
              <span className="sr-only">
                {trend === "up" ? "Trending up" : "Trending down"}
              </span>
            </span>
          )}
          {period && (
            <span
              className={clsx(
                "text-[length:var(--ant-typography-fontSize-xs)] leading-tight",
                isDark ? "text-[var(--ant-color-neutral-400)]" : "text-[var(--ant-color-surface-text-sub)]"
              )}
            >
              {period}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
