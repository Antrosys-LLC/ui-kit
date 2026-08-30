import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
  useContext,
} from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { clsx } from "clsx";
import { ThemeContext } from "../../../providers/ThemeProvider";

/**
 * Definition for an individual tab item.
 */
export interface Tab {
  /** Unique value/identifier for the tab */
  value: string;
  /** Tab label rendered inside the tab trigger button */
  label: React.ReactNode;
  /** Tab panel content displayed when active */
  content: React.ReactNode;
  /** Whether the tab trigger is disabled */
  disabled?: boolean;
  /** Optional icon rendered alongside the tab label */
  icon?: React.ReactNode;
}

/**
 * Props for the Tabs component.
 */
export interface TabsProps {
  /** Available tab definitions */
  tabs: Tab[];
  /** Initially active tab value for uncontrolled mode */
  defaultTab?: string;
  /** Currently active tab value for controlled mode */
  value?: string;
  /** Callback fired when the active tab changes */
  onValueChange?: (value: string) => void;
  /** Tab layout orientation: "horizontal" (default) or "vertical" */
  orientation?: "horizontal" | "vertical";
  /** Whether tab content should be loaded lazily (only mounted after tab is first activated) */
  lazy?: boolean;
  /** Additional CSS class names for the root container */
  className?: string;
  /** Accessible label for the tab list */
  "aria-label"?: string;
}

interface IndicatorStyle {
  left?: number;
  width?: number;
  top?: number;
  height?: number;
  opacity: number;
}

/**
 * Accessible, design-token-powered Tabs component built with Radix UI.
 *
 * Supports horizontal and vertical orientations, smooth animated active indicator,
 * horizontal scrolling on mobile viewports, and lazy mounting of tab panels.
 */
export function Tabs({
  tabs,
  defaultTab,
  value: controlledValue,
  onValueChange,
  orientation = "horizontal",
  lazy = false,
  className,
  "aria-label": ariaLabel = "Tabs",
}: TabsProps) {
  const themeCtx = useContext(ThemeContext);
  const isDark = themeCtx?.theme === "dark";

  const generatedId = useId();
  const firstEnabledTab = tabs.find((t) => !t.disabled)?.value ?? tabs[0]?.value ?? "";
  const initialTab = controlledValue ?? defaultTab ?? firstEnabledTab;

  const [uncontrolledValue, setUncontrolledValue] = useState<string>(initialTab);
  const isControlled = controlledValue !== undefined;
  const currentTab = isControlled ? controlledValue : uncontrolledValue;

  // Track visited tab values for lazy-loading support
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(() => new Set(initialTab ? [initialTab] : []));

  // Refs for tab trigger buttons and the tab list container
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // State for the animated active indicator
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    opacity: 0,
  });

  const handleTabChange = useCallback(
    (newTab: string) => {
      if (!isControlled) {
        setUncontrolledValue(newTab);
      }
      onValueChange?.(newTab);

      if (lazy) {
        setVisitedTabs((prev) => {
          if (prev.has(newTab)) return prev;
          const next = new Set(prev);
          next.add(newTab);
          return next;
        });
      }
    },
    [isControlled, onValueChange, lazy]
  );

  // Keep visited tabs in sync if controlled value changes externally
  useEffect(() => {
    if (currentTab && lazy) {
      setVisitedTabs((prev) => {
        if (prev.has(currentTab)) return prev;
        const next = new Set(prev);
        next.add(currentTab);
        return next;
      });
    }
  }, [currentTab, lazy]);

  // Recalculate indicator position and dimensions
  const updateIndicator = useCallback(() => {
    const listEl = listRef.current;
    const activeTriggerEl = triggerRefs.current.get(currentTab);

    if (!listEl || !activeTriggerEl) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    if (orientation === "horizontal") {
      setIndicatorStyle({
        left: activeTriggerEl.offsetLeft,
        width: activeTriggerEl.offsetWidth,
        opacity: 1,
      });

      // Auto-scroll active tab into view in scrollable tab list on mobile/compact viewports
      activeTriggerEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    } else {
      setIndicatorStyle({
        top: activeTriggerEl.offsetTop,
        height: activeTriggerEl.offsetHeight,
        opacity: 1,
      });
    }
  }, [currentTab, orientation]);

  // Update indicator when tab, orientation, or tabs change
  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  // Listen to resize events on the tab list to keep indicator aligned
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => {
        updateIndicator();
      });
      resizeObserver.observe(listEl);
      return () => {
        resizeObserver.disconnect();
      };
    } else {
      window.addEventListener("resize", updateIndicator);
      return () => {
        window.removeEventListener("resize", updateIndicator);
      };
    }
  }, [updateIndicator]);

  const isVertical = orientation === "vertical";

  return (
    <TabsPrimitive.Root
      value={currentTab}
      onValueChange={handleTabChange}
      orientation={orientation}
      className={clsx(
        "w-full font-[family-name:var(--ant-typography-fontFamily-sans)]",
        isDark
          ? "text-[var(--ant-color-neutral-100)]"
          : "text-[var(--ant-color-surface-text)]",
        isVertical
          ? "flex flex-col sm:flex-row gap-[var(--ant-spacing-6)] items-start"
          : "flex flex-col gap-[var(--ant-spacing-4)]",
        className
      )}
    >
      {/* Tab List */}
      <TabsPrimitive.List
        ref={listRef}
        aria-label={ariaLabel}
        className={clsx(
          "relative",
          isVertical
            ? "flex flex-col shrink-0 w-48 sm:w-52 border-r border-[var(--ant-color-surface-border)] gap-[var(--ant-spacing-1)] pr-[var(--ant-spacing-2)]"
            : "flex items-center border-b border-[var(--ant-color-surface-border)] gap-[var(--ant-spacing-2)] overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-nowrap"
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.value === currentTab;

          return (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              ref={(el) => {
                if (el) {
                  triggerRefs.current.set(tab.value, el);
                } else {
                  triggerRefs.current.delete(tab.value);
                }
              }}
              id={`tab-trigger-${generatedId}-${tab.value}`}
              aria-controls={`tab-panel-${generatedId}-${tab.value}`}
              className={clsx(
                "group relative inline-flex items-center gap-[var(--ant-spacing-2)] transition-colors select-none",
                "text-[length:var(--ant-typography-fontSize-sm)] leading-[var(--ant-typography-lineHeight-normal)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-2",
                isDark
                  ? "focus-visible:ring-offset-[var(--ant-color-neutral-900)]"
                  : "focus-visible:ring-offset-[var(--ant-color-neutral-0)]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
                isVertical
                  ? "w-full text-left px-[var(--ant-spacing-3)] py-[var(--ant-spacing-2)] rounded-[var(--ant-radius-md)]"
                  : "shrink-0 whitespace-nowrap px-[var(--ant-spacing-3)] py-[var(--ant-spacing-2)] pb-[var(--ant-spacing-3)] rounded-t-[var(--ant-radius-sm)]",
                isActive
                  ? isVertical
                    ? isDark
                      ? "font-semibold text-[var(--ant-color-brand-primary-lt)] bg-[var(--ant-color-neutral-800)]"
                      : "font-semibold text-[var(--ant-color-brand-primary-dk)] bg-[var(--ant-color-brand-primary-lt)]"
                    : isDark
                      ? "font-semibold text-[var(--ant-color-brand-primary-lt)]"
                      : "font-semibold text-[var(--ant-color-brand-primary-dk)]"
                  : isDark
                    ? "font-medium text-[var(--ant-color-neutral-300)] hover:text-[var(--ant-color-neutral-0)] hover:bg-[var(--ant-color-neutral-800)]"
                    : "font-medium text-[var(--ant-color-neutral-600)] hover:text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)]"
              )}
            >
              {tab.icon && (
                <span
                  className={clsx(
                    "inline-flex shrink-0 items-center justify-center transition-colors",
                    isActive
                      ? isDark
                        ? "text-[var(--ant-color-brand-primary-lt)]"
                        : "text-[var(--ant-color-brand-primary-dk)]"
                      : isDark
                        ? "text-[var(--ant-color-neutral-300)] group-hover:text-[var(--ant-color-neutral-0)]"
                        : "text-[var(--ant-color-neutral-600)] group-hover:text-[var(--ant-color-surface-text)]"
                  )}
                  aria-hidden="true"
                >
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
            </TabsPrimitive.Trigger>
          );
        })}

        {/* Smooth Animated Active Indicator */}
        <span
          aria-hidden="true"
          className={clsx(
            "absolute pointer-events-none z-10 transition-all motion-reduce:transition-none",
            isDark
              ? "bg-[var(--ant-color-brand-accent)]"
              : "bg-[var(--ant-color-brand-primary)]",
            "duration-[var(--ant-motion-duration-normal)] ease-[var(--ant-motion-easing-default)]",
            isVertical
              ? "-right-px w-0.5 rounded-r-[var(--ant-radius-full)]"
              : "-bottom-px h-0.5 rounded-t-[var(--ant-radius-full)]"
          )}
          style={{
            ...(isVertical
              ? {
                  top: indicatorStyle.top !== undefined ? `${indicatorStyle.top}px` : undefined,
                  height: indicatorStyle.height !== undefined ? `${indicatorStyle.height}px` : undefined,
                }
              : {
                  left: indicatorStyle.left !== undefined ? `${indicatorStyle.left}px` : undefined,
                  width: indicatorStyle.width !== undefined ? `${indicatorStyle.width}px` : undefined,
                }),
            opacity: indicatorStyle.opacity,
          }}
        />
      </TabsPrimitive.List>

      {/* Tab Panels */}
      <div className="flex-1 min-w-0">
        {tabs.map((tab) => {
          // If lazy-loading is enabled, only mount content once the tab has been visited
          if (lazy && !visitedTabs.has(tab.value)) {
            return null;
          }

          return (
            <TabsPrimitive.Content
              key={tab.value}
              value={tab.value}
              id={`tab-panel-${generatedId}-${tab.value}`}
              aria-labelledby={`tab-trigger-${generatedId}-${tab.value}`}
              className={clsx(
                "w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-2 rounded-[var(--ant-radius-md)]",
                "text-[length:var(--ant-typography-fontSize-base)]",
                isDark
                  ? "focus-visible:ring-offset-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-100)]"
                  : "focus-visible:ring-offset-[var(--ant-color-neutral-0)] text-[var(--ant-color-surface-text)]",
                "data-[state=inactive]:hidden"
              )}
            >
              {tab.content}
            </TabsPrimitive.Content>
          );
        })}
      </div>
    </TabsPrimitive.Root>
  );
}
