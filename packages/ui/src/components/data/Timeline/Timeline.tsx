import React, {
  useMemo,
  useContext,
  useRef,
  useState,
  useEffect,
  HTMLAttributes,
  ReactNode,
} from "react";
import { clsx } from "clsx";
import { ThemeContext } from "../../../providers/ThemeProvider";

export type TimelineOrientation = "vertical" | "horizontal";

export type TimelineItemStatus =
  | "completed"
  | "current"
  | "upcoming"
  | "warning"
  | "error";

export type TimelineLineVariant = "solid" | "dashed" | "dotted";

export interface TimelineItem {
  /** Unique identifier for the timeline item */
  id: string;
  /** Primary headline or title */
  title: ReactNode;
  /** Date, time, or timestamp indicator */
  date?: ReactNode;
  /** Grouping key (e.g. year '2026', quarter 'Q1', phase 'Phase 1') */
  group?: string;
  /** Secondary narrative or explanatory text */
  description?: ReactNode;
  /** Custom icon or badge component for the node */
  icon?: ReactNode;
  /** Lifecycle / progress state of this event */
  status?: TimelineItemStatus;
  /** Optional custom React node or card content */
  content?: ReactNode;
  /** Optional badge, tag, or metadata chip */
  tag?: ReactNode;
  /** Disabled or inactive state */
  disabled?: boolean;
  /** Optional custom CSS class for the item card */
  className?: string;
}

export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** List of chronological items to render */
  items: TimelineItem[];
  /** Layout direction. Default: "vertical" */
  orientation?: TimelineOrientation;
  /** In vertical mode, alternate items between left and right of center track. Default: false */
  alternating?: boolean;
  /** Automatically group consecutive items by their group or date property. Default: false */
  groupByDate?: boolean;
  /** Enable scroll-triggered reveal animation. Default: true */
  animated?: boolean;
  /** Render animated skeleton loading state. Default: false */
  loading?: boolean;
  /** Number of placeholder items to render when loading is true. Default: 3 */
  loadingCount?: number;
  /** Line styling connecting nodes. Default: "solid" */
  lineVariant?: TimelineLineVariant;
  /** Compact dense mode with reduced spacing. Default: false */
  dense?: boolean;
  /** Explicit theme mode override */
  theme?: "light" | "dark" | "auto";
  /** Accessible label for the timeline region / list */
  "aria-label"?: string;
}

/** Hook to detect scroll reveal with reduced-motion fallback */
function useScrollReveal(enabled: boolean) {
  const ref = useRef<HTMLLIElement>(null);
  const [isVisible, setIsVisible] = useState(() => !enabled);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true);
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  return { ref, isVisible };
}

/** Default Node Icon Renderer */
function DefaultNodeIcon({
  status = "upcoming",
  isDark = false,
}: {
  status?: TimelineItemStatus;
  isDark?: boolean;
}) {
  switch (status) {
    case "completed":
      return (
        <svg
          className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );

    case "current":
      return (
        <span
          className="w-[var(--ant-spacing-3)] h-[var(--ant-spacing-3)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-neutral-0)]"
          aria-hidden="true"
        />
      );

    case "warning":
      return (
        <svg
          className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );

    case "error":
      return (
        <svg
          className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );

    case "upcoming":
    default:
      return (
        <span
          className={clsx(
            "w-[var(--ant-spacing-2)] h-[var(--ant-spacing-2)] rounded-[var(--ant-radius-full)]",
            isDark
              ? "bg-[var(--ant-color-neutral-500)]"
              : "bg-[var(--ant-color-neutral-400)]"
          )}
          aria-hidden="true"
        />
      );
  }
}

/** Loading Skeleton for Timeline */
function TimelineLoadingSkeleton({
  orientation = "vertical",
  alternating = false,
  count = 3,
  isDark = false,
  dense = false,
}: {
  orientation: TimelineOrientation;
  alternating?: boolean;
  count: number;
  isDark: boolean;
  dense?: boolean;
}) {
  const skeletonItems = Array.from({ length: count });

  const spinner = (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[var(--ant-zIndex-sticky)]">
      <div
        className={clsx(
          "flex items-center justify-center p-[var(--ant-spacing-3)] rounded-[var(--ant-radius-full)] backdrop-blur-xs shadow-[var(--ant-shadow-md)]",
          isDark
            ? "bg-[var(--ant-color-neutral-800)]/90 border border-[var(--ant-color-neutral-700)]"
            : "bg-[var(--ant-color-neutral-0)]/90 border border-[var(--ant-color-neutral-200)]"
        )}
      >
        <svg
          className="w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)] animate-spin text-[var(--ant-color-brand-primary)]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  );

  if (orientation === "horizontal") {
    return (
      <div className="relative w-full flex items-center py-[var(--ant-spacing-4)]">
        <div
          className="w-full flex items-start gap-[var(--ant-spacing-6)] overflow-x-auto pb-[var(--ant-spacing-4)] animate-pulse"
          role="status"
          aria-label="Loading timeline"
        >
          {skeletonItems.map((_, idx) => (
            <div key={idx} className="flex flex-col gap-[var(--ant-spacing-3)] w-[calc(var(--ant-spacing-24)*3)] shrink-0">
              <div className="flex items-center gap-[var(--ant-spacing-2)]">
                <div
                  className={clsx(
                    "w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)] rounded-[var(--ant-radius-full)] shrink-0",
                    isDark
                      ? "bg-[var(--ant-color-neutral-700)]"
                      : "bg-[var(--ant-color-neutral-200)]"
                  )}
                />
                {idx < count - 1 && (
                  <div
                    className={clsx(
                      "flex-1 border-t-2 border-solid",
                      isDark
                        ? "border-[var(--ant-color-neutral-700)]"
                        : "border-[var(--ant-color-neutral-200)]"
                    )}
                  />
                )}
              </div>
              <div
                className={clsx(
                  "h-[var(--ant-spacing-3)] w-[var(--ant-spacing-20)] rounded-[var(--ant-radius-sm)]",
                  isDark
                    ? "bg-[var(--ant-color-neutral-700)]"
                    : "bg-[var(--ant-color-neutral-200)]"
                )}
              />
              <div
                className={clsx(
                  "h-[var(--ant-spacing-4)] w-[calc(var(--ant-spacing-24)*2)] rounded-[var(--ant-radius-md)]",
                  isDark
                    ? "bg-[var(--ant-color-neutral-700)]"
                    : "bg-[var(--ant-color-neutral-200)]"
                )}
              />
              <div
                className={clsx(
                  "h-[var(--ant-spacing-8)] w-full rounded-[var(--ant-radius-md)]",
                  isDark
                    ? "bg-[var(--ant-color-neutral-800)]"
                    : "bg-[var(--ant-color-neutral-100)]"
                )}
              />
            </div>
          ))}
        </div>
        {spinner}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "relative w-full flex flex-col animate-pulse",
        dense ? "gap-[var(--ant-spacing-4)]" : "gap-[var(--ant-spacing-8)]"
      )}
      role="status"
      aria-label="Loading timeline"
    >
      {/* Central or side track line */}
      <div
        className={clsx(
          "absolute top-[var(--ant-spacing-4)] bottom-[var(--ant-spacing-4)] border-l-2 border-solid pointer-events-none",
          alternating
            ? "left-[var(--ant-spacing-4)] md:left-1/2 md:-translate-x-1/2"
            : "left-[var(--ant-spacing-4)]",
          isDark
            ? "border-[var(--ant-color-neutral-700)]"
            : "border-[var(--ant-color-neutral-200)]"
        )}
      />

      {skeletonItems.map((_, idx) => {
        const isOdd = idx % 2 === 1;
        return (
          <div
            key={idx}
            className={clsx(
              "relative flex items-start gap-[var(--ant-spacing-4)]",
              alternating && "md:gap-[var(--ant-spacing-8)]",
              alternating && isOdd && "md:flex-row-reverse"
            )}
          >
            {/* Node */}
            <div
              className={clsx(
                "w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)] rounded-[var(--ant-radius-full)] shrink-0 z-[var(--ant-zIndex-raised)]",
                alternating
                  ? "ml-0 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2"
                  : "",
                isDark
                  ? "bg-[var(--ant-color-neutral-700)]"
                  : "bg-[var(--ant-color-neutral-200)]"
              )}
            />

            {/* Card Content Skeleton */}
            <div
              className={clsx(
                "flex-1 flex flex-col gap-[var(--ant-spacing-2)] p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-lg)] border",
                alternating && (isOdd ? "md:mr-[calc(50%+var(--ant-spacing-6))]" : "md:ml-[calc(50%+var(--ant-spacing-6))]"),
                isDark
                  ? "bg-[var(--ant-color-neutral-900)] border-[var(--ant-color-neutral-800)]"
                  : "bg-[var(--ant-color-neutral-0)] border-[var(--ant-color-neutral-200)]"
              )}
            >
              <div
                className={clsx(
                  "h-[var(--ant-spacing-3)] w-[var(--ant-spacing-24)] rounded-[var(--ant-radius-sm)]",
                  isDark
                    ? "bg-[var(--ant-color-neutral-700)]"
                    : "bg-[var(--ant-color-neutral-200)]"
                )}
              />
              <div
                className={clsx(
                  "h-[var(--ant-spacing-4)] w-[calc(var(--ant-spacing-24)*2)] rounded-[var(--ant-radius-md)]",
                  isDark
                    ? "bg-[var(--ant-color-neutral-700)]"
                    : "bg-[var(--ant-color-neutral-200)]"
                )}
              />
              <div
                className={clsx(
                  "h-[var(--ant-spacing-8)] w-full rounded-[var(--ant-radius-md)]",
                  isDark
                    ? "bg-[var(--ant-color-neutral-800)]"
                    : "bg-[var(--ant-color-neutral-100)]"
                )}
              />
            </div>
          </div>
        );
      })}
      {spinner}
    </div>
  );
}

/**
 * Timeline Component
 * A flexible, responsive, theme-aware timeline component supporting vertical, horizontal, alternating, grouped, and animated views.
 */
export function Timeline({
  items,
  orientation = "vertical",
  alternating = false,
  groupByDate = false,
  animated = true,
  loading = false,
  loadingCount = 3,
  lineVariant = "solid",
  dense = false,
  theme: themeOverride,
  "aria-label": ariaLabel = "Timeline",
  className,
  ...props
}: TimelineProps) {
  const themeCtx = useContext(ThemeContext);

  // Theme resolution (prop override > ThemeContext > DOM data-theme)
  const activeTheme =
    themeOverride && themeOverride !== "auto"
      ? themeOverride
      : themeCtx?.theme ||
        (typeof document !== "undefined" &&
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light");
  const isDark = activeTheme === "dark";

  // Group items if groupByDate is true
  const groupedData = useMemo(() => {
    if (!groupByDate || !items || items.length === 0) {
      return [{ groupKey: null, items: items || [] }];
    }

    const groups: { groupKey: string; items: TimelineItem[] }[] = [];
    let currentGroup = "";
    let currentBucket: TimelineItem[] = [];

    items.forEach((item) => {
      const g = item.group || (typeof item.date === "string" ? item.date : "General");
      if (g !== currentGroup) {
        if (currentBucket.length > 0) {
          groups.push({ groupKey: currentGroup, items: currentBucket });
        }
        currentGroup = g;
        currentBucket = [item];
      } else {
        currentBucket.push(item);
      }
    });

    if (currentBucket.length > 0) {
      groups.push({ groupKey: currentGroup, items: currentBucket });
    }

    return groups;
  }, [items, groupByDate]);

  if (loading) {
    return (
      <TimelineLoadingSkeleton
        orientation={orientation}
        alternating={alternating}
        count={loadingCount}
        isDark={isDark}
        dense={dense}
      />
    );
  }

  if (!items || items.length === 0) {
    return (
      <div
        className={clsx(
          "w-full flex flex-col items-center justify-center p-[var(--ant-spacing-8)] text-[length:var(--ant-typography-fontSize-sm)] rounded-[var(--ant-radius-lg)] border",
          isDark
            ? "bg-[var(--ant-color-neutral-900)] border-[var(--ant-color-neutral-800)] text-[var(--ant-color-neutral-400)]"
            : "bg-[var(--ant-color-neutral-0)] border-[var(--ant-color-neutral-200)] text-[var(--ant-color-neutral-500)]",
          className
        )}
        role="region"
        aria-label={ariaLabel}
        {...props}
      >
        <svg
          className="w-[var(--ant-spacing-10)] h-[var(--ant-spacing-10)] mb-[var(--ant-spacing-2)] opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>No timeline events recorded</span>
      </div>
    );
  }

  // ── HORIZONTAL TIMELINE ──────────────────────────────────────────────────────
  if (orientation === "horizontal") {
    return (
      <div
        className={clsx(
          "w-full overflow-x-auto overflow-y-hidden pb-[var(--ant-spacing-4)] pt-[var(--ant-spacing-2)] select-none",
          className
        )}
        role="region"
        aria-label={ariaLabel}
        {...props}
      >
        <ol className="flex items-start gap-[var(--ant-spacing-6)] min-w-max list-none p-0 m-0">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const status = item.status || "upcoming";

            return (
              <HorizontalTimelineItemView
                key={item.id || idx}
                item={item}
                isLast={isLast}
                status={status}
                isDark={isDark}
                animated={animated}
                lineVariant={lineVariant}
                dense={dense}
              />
            );
          })}
        </ol>
      </div>
    );
  }

  // ── VERTICAL TIMELINE ────────────────────────────────────────────────────────
  let runningIndex = 0;

  return (
    <div
      className={clsx("relative w-full", className)}
      role="region"
      aria-label={ariaLabel}
      {...props}
    >
      {groupedData.map((group, groupIdx) => {
        return (
          <div
            key={group.groupKey || groupIdx}
            className={clsx(
              "relative flex flex-col",
              groupIdx > 0 && "mt-[var(--ant-spacing-8)]"
            )}
          >
            {/* Group Header Badge */}
            {group.groupKey && (
              <div
                className={clsx(
                  "sticky top-[var(--ant-spacing-2)] z-[var(--ant-zIndex-sticky)] flex items-center mb-[var(--ant-spacing-6)]",
                  alternating ? "justify-start md:justify-center" : "justify-start pl-[var(--ant-spacing-1)]"
                )}
              >
                <span
                  className={clsx(
                    "inline-flex items-center gap-[var(--ant-spacing-1)] px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)]",
                    "rounded-[var(--ant-radius-full)] text-[length:var(--ant-typography-fontSize-xs)] font-bold tracking-wider uppercase shadow-[var(--ant-shadow-sm)] backdrop-blur-xs",
                    isDark
                      ? "bg-[var(--ant-color-neutral-800)] text-[var(--ant-color-brand-primary)] border border-[var(--ant-color-neutral-700)]"
                      : "bg-[var(--ant-color-neutral-0)] text-[var(--ant-color-brand-primary)] border border-[var(--ant-color-neutral-200)]"
                  )}
                >
                  <svg
                    className="w-[var(--ant-spacing-3)] h-[var(--ant-spacing-3)] text-[var(--ant-color-brand-primary)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {group.groupKey}
                </span>
              </div>
            )}

            {/* Connecting Track Line */}
            <div
              className={clsx(
                "absolute top-[var(--ant-spacing-4)] bottom-[var(--ant-spacing-4)] pointer-events-none",
                alternating
                  ? "left-[var(--ant-spacing-4)] md:left-1/2 md:-translate-x-1/2"
                  : "left-[var(--ant-spacing-4)]",
                lineVariant === "dashed" && "border-l-2 border-dashed",
                lineVariant === "dotted" && "border-l-2 border-dotted",
                lineVariant === "solid" && "border-l-2 border-solid",
                isDark
                  ? "border-[var(--ant-color-neutral-700)]"
                  : "border-[var(--ant-color-neutral-200)]"
              )}
            />

            {/* List of items */}
            <ol
              className={clsx(
                "relative flex flex-col list-none p-0 m-0",
                dense ? "gap-[var(--ant-spacing-4)]" : "gap-[var(--ant-spacing-8)]"
              )}
            >
              {group.items.map((item) => {
                const itemIndex = runningIndex++;
                const isEven = itemIndex % 2 === 0;
                const status = item.status || "upcoming";

                return (
                  <VerticalTimelineItemView
                    key={item.id || itemIndex}
                    item={item}
                    status={status}
                    isEven={isEven}
                    alternating={alternating}
                    isDark={isDark}
                    animated={animated}
                    dense={dense}
                  />
                );
              })}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

// ── SUB-COMPONENT: VERTICAL ITEM VIEW ─────────────────────────────────────────

interface VerticalItemViewProps {
  item: TimelineItem;
  status: TimelineItemStatus;
  isEven: boolean;
  alternating: boolean;
  isDark: boolean;
  animated: boolean;
  dense: boolean;
}

function VerticalTimelineItemView({
  item,
  status,
  isEven,
  alternating,
  isDark,
  animated,
  dense,
}: VerticalItemViewProps) {
  const { ref, isVisible } = useScrollReveal(animated);

  // Status node styling
  const nodeStyles = useMemo(() => {
    switch (status) {
      case "completed":
        return isDark
          ? "bg-[var(--ant-color-semantic-success)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-success)]/25"
          : "bg-[var(--ant-color-semantic-success)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-success)]/20";

      case "current":
        return isDark
          ? "bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-brand-primary)]/35"
          : "bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-brand-primary-lt)]";

      case "warning":
        return isDark
          ? "bg-[var(--ant-color-semantic-warning)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-warning)]/25"
          : "bg-[var(--ant-color-semantic-warning)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-warning)]/20";

      case "error":
        return isDark
          ? "bg-[var(--ant-color-semantic-error)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-error)]/25"
          : "bg-[var(--ant-color-semantic-error)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-error)]/20";

      case "upcoming":
      default:
        return isDark
          ? "bg-[var(--ant-color-neutral-800)] border-2 border-[var(--ant-color-neutral-600)] text-[var(--ant-color-neutral-400)]"
          : "bg-[var(--ant-color-neutral-0)] border-2 border-[var(--ant-color-neutral-300)] text-[var(--ant-color-neutral-500)]";
    }
  }, [status, isDark]);

  return (
    <li
      ref={ref}
      className={clsx(
        "relative flex items-start gap-[var(--ant-spacing-4)] transition-all duration-[var(--ant-motion-duration-slower)]",
        alternating && "md:gap-0",
        animated && (isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[var(--ant-spacing-4)]"),
        item.disabled && "opacity-50 pointer-events-none"
      )}
      aria-current={status === "current" ? "step" : undefined}
    >
      {/* Node (Indicator / Icon) */}
      <div
        className={clsx(
          "flex items-center justify-center w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)] rounded-[var(--ant-radius-full)] shrink-0 z-[var(--ant-zIndex-raised)] transition-transform shadow-[var(--ant-shadow-sm)]",
          nodeStyles,
          alternating
            ? "ml-0 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-[var(--ant-spacing-2)]"
            : "mt-[var(--ant-spacing-1)]",
          status === "current" && "scale-[1.05]"
        )}
      >
        {item.icon ? (
          <span className="flex items-center justify-center text-[length:var(--ant-typography-fontSize-sm)]">{item.icon}</span>
        ) : (
          <DefaultNodeIcon status={status} isDark={isDark} />
        )}
      </div>

      {/* Event Card Content */}
      <div
        className={clsx(
          "flex-1 flex flex-col rounded-[var(--ant-radius-lg)] border shadow-[var(--ant-shadow-sm)] hover:shadow-[var(--ant-shadow-md)] hover:border-[var(--ant-color-brand-primary)]/40 transition-all duration-[var(--ant-motion-duration-normal)]",
          dense ? "p-[var(--ant-spacing-3)]" : "p-[var(--ant-spacing-4)]",
          alternating && (
            isEven
              ? "md:w-[calc(50%-var(--ant-spacing-6))] md:mr-auto md:pr-[var(--ant-spacing-4)]"
              : "md:w-[calc(50%-var(--ant-spacing-6))] md:ml-auto md:pl-[var(--ant-spacing-4)]"
          ),
          isDark
            ? "bg-[var(--ant-color-neutral-900)] border-[var(--ant-color-neutral-800)] text-[var(--ant-color-neutral-0)]"
            : "bg-[var(--ant-color-neutral-0)] border-[var(--ant-color-neutral-200)] text-[var(--ant-color-neutral-900)]",
          item.className
        )}
      >
        {/* Header: Date + Tag */}
        <div className="flex items-center justify-between gap-[var(--ant-spacing-2)] mb-[var(--ant-spacing-1)]">
          {item.date && (
            <time
              className={clsx(
                "text-[length:var(--ant-typography-fontSize-xs)] font-medium tracking-tight",
                isDark
                  ? "text-[var(--ant-color-neutral-400)]"
                  : "text-[var(--ant-color-neutral-500)]"
              )}
            >
              {item.date}
            </time>
          )}
          {item.tag && (
            <div className="shrink-0 text-[length:var(--ant-typography-fontSize-xs)]">
              {item.tag}
            </div>
          )}
        </div>

        {/* Title */}
        <h4
          className={clsx(
            "font-semibold leading-snug text-[length:var(--ant-typography-fontSize-base)]",
            isDark
              ? "text-[var(--ant-color-neutral-0)]"
              : "text-[var(--ant-color-neutral-900)]"
          )}
        >
          {item.title}
        </h4>

        {/* Description */}
        {item.description && (
          <p
            className={clsx(
              "mt-[var(--ant-spacing-1)] text-[length:var(--ant-typography-fontSize-sm)] leading-relaxed",
              isDark
                ? "text-[var(--ant-color-neutral-400)]"
                : "text-[var(--ant-color-neutral-600)]"
            )}
          >
            {item.description}
          </p>
        )}

        {/* Custom Body Content */}
        {item.content && (
          <div
            className={clsx(
              "mt-[var(--ant-spacing-3)] pt-[var(--ant-spacing-2)] border-t",
              isDark
                ? "border-[var(--ant-color-neutral-800)]"
                : "border-[var(--ant-color-neutral-200)]"
            )}
          >
            {item.content}
          </div>
        )}
      </div>
    </li>
  );
}

// ── SUB-COMPONENT: HORIZONTAL ITEM VIEW ───────────────────────────────────────

interface HorizontalItemViewProps {
  item: TimelineItem;
  isLast: boolean;
  status: TimelineItemStatus;
  isDark: boolean;
  animated: boolean;
  lineVariant: TimelineLineVariant;
  dense: boolean;
}

function HorizontalTimelineItemView({
  item,
  isLast,
  status,
  isDark,
  animated,
  lineVariant,
  dense,
}: HorizontalItemViewProps) {
  const { ref, isVisible } = useScrollReveal(animated);

  const nodeStyles = useMemo(() => {
    switch (status) {
      case "completed":
        return isDark
          ? "bg-[var(--ant-color-semantic-success)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-success)]/25"
          : "bg-[var(--ant-color-semantic-success)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-success)]/20";

      case "current":
        return isDark
          ? "bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-brand-primary)]/35"
          : "bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-brand-primary-lt)]";

      case "warning":
        return isDark
          ? "bg-[var(--ant-color-semantic-warning)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-warning)]/25"
          : "bg-[var(--ant-color-semantic-warning)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-warning)]/20";

      case "error":
        return isDark
          ? "bg-[var(--ant-color-semantic-error)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-error)]/25"
          : "bg-[var(--ant-color-semantic-error)] text-[var(--ant-color-neutral-0)] ring-4 ring-[var(--ant-color-semantic-error)]/20";

      case "upcoming":
      default:
        return isDark
          ? "bg-[var(--ant-color-neutral-800)] border-2 border-[var(--ant-color-neutral-600)] text-[var(--ant-color-neutral-400)]"
          : "bg-[var(--ant-color-neutral-0)] border-2 border-[var(--ant-color-neutral-300)] text-[var(--ant-color-neutral-500)]";
    }
  }, [status, isDark]);

  return (
    <li
      ref={ref}
      className={clsx(
        "flex flex-col gap-[var(--ant-spacing-3)] w-[calc(var(--ant-spacing-24)*3)] shrink-0 transition-all duration-[var(--ant-motion-duration-slower)]",
        animated && (isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[var(--ant-spacing-4)]"),
        item.disabled && "opacity-50 pointer-events-none"
      )}
      aria-current={status === "current" ? "step" : undefined}
    >
      {/* Node + Line header */}
      <div className="flex items-center w-full">
        <div
          className={clsx(
            "flex items-center justify-center w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)] rounded-[var(--ant-radius-full)] shrink-0 z-[var(--ant-zIndex-raised)] shadow-[var(--ant-shadow-sm)]",
            nodeStyles,
            status === "current" && "scale-[1.05]"
          )}
        >
          {item.icon ? (
            <span className="flex items-center justify-center text-[length:var(--ant-typography-fontSize-sm)]">{item.icon}</span>
          ) : (
            <DefaultNodeIcon status={status} isDark={isDark} />
          )}
        </div>

        {/* Track Line to next node */}
        {!isLast && (
          <div
            className={clsx(
              "flex-1 h-0",
              lineVariant === "dashed" && "border-t-2 border-dashed",
              lineVariant === "dotted" && "border-t-2 border-dotted",
              lineVariant === "solid" && "border-t-2 border-solid",
              isDark
                ? "border-[var(--ant-color-neutral-700)]"
                : "border-[var(--ant-color-neutral-200)]"
            )}
          />
        )}
      </div>

      {/* Card Body */}
      <div
        className={clsx(
          "flex flex-col rounded-[var(--ant-radius-lg)] border shadow-[var(--ant-shadow-sm)] hover:shadow-[var(--ant-shadow-md)] hover:border-[var(--ant-color-brand-primary)]/40 transition-all duration-[var(--ant-motion-duration-normal)]",
          dense ? "p-[var(--ant-spacing-3)]" : "p-[var(--ant-spacing-4)]",
          isDark
            ? "bg-[var(--ant-color-neutral-900)] border-[var(--ant-color-neutral-800)] text-[var(--ant-color-neutral-0)]"
            : "bg-[var(--ant-color-neutral-0)] border-[var(--ant-color-neutral-200)] text-[var(--ant-color-neutral-900)]",
          item.className
        )}
      >
        <div className="flex items-center justify-between gap-[var(--ant-spacing-2)] mb-[var(--ant-spacing-1)]">
          {item.date && (
            <time
              className={clsx(
                "text-[length:var(--ant-typography-fontSize-xs)] font-medium tracking-tight",
                isDark
                  ? "text-[var(--ant-color-neutral-400)]"
                  : "text-[var(--ant-color-neutral-500)]"
              )}
            >
              {item.date}
            </time>
          )}
          {item.tag && (
            <div className="shrink-0 text-[length:var(--ant-typography-fontSize-xs)]">
              {item.tag}
            </div>
          )}
        </div>

        <h4
          className={clsx(
            "font-semibold leading-snug text-[length:var(--ant-typography-fontSize-base)] truncate",
            isDark
              ? "text-[var(--ant-color-neutral-0)]"
              : "text-[var(--ant-color-neutral-900)]"
          )}
        >
          {item.title}
        </h4>

        {item.description && (
          <p
            className={clsx(
              "mt-[var(--ant-spacing-1)] text-[length:var(--ant-typography-fontSize-sm)] leading-relaxed line-clamp-3",
              isDark
                ? "text-[var(--ant-color-neutral-400)]"
                : "text-[var(--ant-color-neutral-600)]"
            )}
          >
            {item.description}
          </p>
        )}

        {item.content && (
          <div
            className={clsx(
              "mt-[var(--ant-spacing-3)] pt-[var(--ant-spacing-2)] border-t",
              isDark
                ? "border-[var(--ant-color-neutral-800)]"
                : "border-[var(--ant-color-neutral-200)]"
            )}
          >
            {item.content}
          </div>
        )}
      </div>
    </li>
  );
}
