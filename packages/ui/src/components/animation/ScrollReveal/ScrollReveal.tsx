import React, {
  useEffect,
  useRef,
  useCallback,
  useContext,
  ElementType,
  ReactNode,
  HTMLAttributes,
  forwardRef,
} from "react";
import { clsx } from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThemeContext } from "../../../providers/ThemeProvider";

// Ensure GSAP plugins are registered safely in browser environments
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Supported animation presets for scroll reveal.
 */
export type ScrollRevealAnimation =
  "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "zoom-out" | "flip" | "fade";

/**
 * Props for the ScrollReveal component.
 */
export interface ScrollRevealProps extends HTMLAttributes<HTMLElement> {
  /**
   * Animation preset to trigger when the element scrolls into view.
   * @default "fade-up"
   */
  animation?: ScrollRevealAnimation;

  /**
   * Delay before the animation begins, in seconds.
   * @default 0
   */
  delay?: number;

  /**
   * Duration of the reveal animation, in seconds.
   * @default 0.7
   */
  duration?: number;

  /**
   * Stagger delay between sequential child elements in seconds.
   * When greater than 0, targets direct children or items matching `childSelector`.
   * @default 0
   */
  stagger?: number;

  /**
   * ScrollTrigger threshold defining when the animation begins.
   * Accepts a number between 0 and 1 (ratio of element into viewport, e.g., 0.2 = top 80%)
   * or a custom ScrollTrigger start position string (e.g. "top 85%", "top center").
   * @default 0.2
   */
  threshold?: number | string;

  /**
   * If true, the animation plays once and remains visible.
   * If false, the animation resets/reverses when scrolled out of view.
   * @default true
   */
  once?: boolean;

  /**
   * Movement offset distance in pixels for directional presets (fade-up, fade-down, fade-left, fade-right).
   * @default 32
   */
  distance?: number;

  /**
   * GSAP easing equation.
   * @default "power2.out"
   */
  ease?: string;

  /**
   * When true, renders an accessible skeleton loading placeholder state.
   * @default false
   */
  loading?: boolean;

  /**
   * When true, disables animations and renders children in their visible state immediately.
   * @default false
   */
  disabled?: boolean;

  /**
   * The underlying HTML element or React component to render as the container.
   * @default "div"
   */
  as?: ElementType;

  /**
   * Optional CSS selector to target specific descendant elements for staggered animations.
   * When omitted and `stagger` > 0, targets direct children.
   */
  childSelector?: string;

  /**
   * Callback fired immediately when the reveal trigger is entered.
   */
  onReveal?: () => void;

  /**
   * Child elements or content to reveal.
   */
  children?: ReactNode;

  /**
   * Additional CSS classes.
   */
  className?: string;
}

/**
 * Converts numeric threshold (0..1) or custom string into a GSAP ScrollTrigger `start` value.
 */
function resolveStartThreshold(threshold: number | string): string {
  if (typeof threshold === "string") {
    return threshold;
  }
  const clamped = Math.max(0, Math.min(1, threshold));
  const percentage = Math.round((1 - clamped) * 100);
  return `top ${percentage}%`;
}

/**
 * Returns the GSAP from/to property objects based on the chosen animation preset.
 */
function getAnimationVars(
  preset: ScrollRevealAnimation,
  distance: number
): { from: gsap.TweenVars; to: gsap.TweenVars } {
  switch (preset) {
    case "fade-up":
      return {
        from: { opacity: 0, y: distance },
        to: { opacity: 1, y: 0 },
      };
    case "fade-down":
      return {
        from: { opacity: 0, y: -distance },
        to: { opacity: 1, y: 0 },
      };
    case "fade-left":
      return {
        from: { opacity: 0, x: distance },
        to: { opacity: 1, x: 0 },
      };
    case "fade-right":
      return {
        from: { opacity: 0, x: -distance },
        to: { opacity: 1, x: 0 },
      };
    case "zoom-in":
      return {
        from: { opacity: 0, scale: 0.85 },
        to: { opacity: 1, scale: 1 },
      };
    case "zoom-out":
      return {
        from: { opacity: 0, scale: 1.15 },
        to: { opacity: 1, scale: 1 },
      };
    case "flip":
      return {
        from: { opacity: 0, rotateX: 55, transformPerspective: 800 },
        to: { opacity: 1, rotateX: 0 },
      };
    case "fade":
    default:
      return {
        from: { opacity: 0 },
        to: { opacity: 1 },
      };
  }
}

/**
 * ScrollReveal is a high-performance scroll-triggered animation wrapper powered by GSAP and ScrollTrigger.
 * It animates content or staggered lists as they enter the viewport, with built-in accessibility
 * motion preference detection, theme token compatibility, and accessible skeleton loading states.
 */
export const ScrollReveal = forwardRef<HTMLElement, ScrollRevealProps>(function ScrollReveal(
  {
    animation = "fade-up",
    delay = 0,
    duration = 0.7,
    stagger = 0,
    threshold = 0.2,
    once = true,
    distance = 32,
    ease = "power2.out",
    loading = false,
    disabled = false,
    as: Component = "div",
    childSelector,
    onReveal,
    children,
    className,
    style,
    ...rest
  },
  forwardedRef
) {
  const containerRef = useRef<HTMLElement | null>(null);
  const themeCtx = useContext(ThemeContext);
  const isDark = themeCtx?.theme === "dark";

  // Merge forwarded ref and local ref
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [forwardedRef]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || loading || disabled) return;

    // Check if user prefers reduced motion for accessibility
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Render final visible state immediately without animation
      gsap.set(container, { opacity: 1, clearProps: "all" });
      return;
    }

    // Create isolated GSAP context for automatic cleanup
    const ctx = gsap.context(() => {
      const { from, to } = getAnimationVars(animation, distance);

      let targets: Element[] | HTMLElement = container;

      if (stagger > 0) {
        const elements = childSelector
          ? container.querySelectorAll(childSelector)
          : container.children;

        if (elements.length > 0) {
          targets = Array.from(elements);
        }
      }

      const startThreshold = resolveStartThreshold(threshold);

      gsap.fromTo(targets, from, {
        ...to,
        duration,
        delay,
        stagger: stagger > 0 ? stagger : undefined,
        ease,
        scrollTrigger: {
          trigger: container,
          start: startThreshold,
          toggleActions: once ? "play none none none" : "play reverse play reverse",
          onEnter: () => {
            if (onReveal) {
              onReveal();
            }
          },
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [
    animation,
    delay,
    duration,
    stagger,
    threshold,
    once,
    distance,
    ease,
    loading,
    disabled,
    childSelector,
    onReveal,
  ]);

  // Accessible loading skeleton state
  if (loading) {
    return (
      <Component
        ref={setRef}
        role="status"
        aria-label="Loading content"
        className={clsx(
          "rounded-[var(--ant-radius-lg)] p-[var(--ant-spacing-6)] border",
          isDark
            ? "bg-[var(--ant-color-neutral-800)] border-[var(--ant-color-neutral-700)] text-[var(--ant-color-neutral-100)]"
            : "bg-[var(--ant-color-surface-bg-card)] border-[var(--ant-color-surface-border)] text-[var(--ant-color-surface-text)]",
          "shadow-[var(--ant-shadow-sm)] font-[family-name:var(--ant-typography-fontFamily-sans)]",
          className
        )}
        style={style}
        {...rest}
      >
        <div className="space-y-[var(--ant-spacing-4)] animate-pulse" aria-hidden="true">
          <div
            className={clsx(
              "h-[var(--ant-spacing-6)] w-1/3 rounded-[var(--ant-radius-md)]",
              isDark ? "bg-[var(--ant-color-neutral-700)]" : "bg-[var(--ant-color-neutral-200)]"
            )}
          />
          <div className="space-y-[var(--ant-spacing-2)]">
            <div
              className={clsx(
                "h-[var(--ant-spacing-4)] w-full rounded-[var(--ant-radius-sm)]",
                isDark ? "bg-[var(--ant-color-neutral-700)]" : "bg-[var(--ant-color-neutral-200)]"
              )}
            />
            <div
              className={clsx(
                "h-[var(--ant-spacing-4)] w-5/6 rounded-[var(--ant-radius-sm)]",
                isDark ? "bg-[var(--ant-color-neutral-700)]" : "bg-[var(--ant-color-neutral-200)]"
              )}
            />
            <div
              className={clsx(
                "h-[var(--ant-spacing-4)] w-2/3 rounded-[var(--ant-radius-sm)]",
                isDark ? "bg-[var(--ant-color-neutral-700)]" : "bg-[var(--ant-color-neutral-200)]"
              )}
            />
          </div>
        </div>
        <span className="sr-only">Loading content...</span>
      </Component>
    );
  }

  return (
    <Component
      ref={setRef}
      aria-disabled={disabled ? "true" : undefined}
      className={clsx(
        "font-[family-name:var(--ant-typography-fontFamily-sans)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-2",
        isDark
          ? "focus-visible:ring-offset-[var(--ant-color-neutral-900)]"
          : "focus-visible:ring-offset-[var(--ant-color-neutral-0)]",
        disabled && "opacity-100 transform-none",
        className
      )}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
});

/**
 * Options accepted when using the withScrollReveal HOC.
 */
export type ScrollRevealHocOptions = Omit<ScrollRevealProps, "children">;

/**
 * Higher-Order Component (HOC) that wraps any React component with scroll-reveal animation capability.
 *
 * @example
 * ```tsx
 * const AnimatedCard = withScrollReveal(Card, { animation: "fade-up", delay: 0.1 });
 * <AnimatedCard title="Hello" />
 * ```
 */
export function withScrollReveal<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultOptions: ScrollRevealHocOptions = {}
) {
  const ComponentWithReveal = forwardRef<
    HTMLElement,
    P & { scrollReveal?: ScrollRevealHocOptions }
  >((props, ref) => {
    const { scrollReveal, ...rest } = props;
    const combinedOptions = { ...defaultOptions, ...scrollReveal };

    return (
      <ScrollReveal {...combinedOptions} ref={ref}>
        <WrappedComponent {...(rest as P)} />
      </ScrollReveal>
    );
  });

  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
  ComponentWithReveal.displayName = `withScrollReveal(${displayName})`;

  return ComponentWithReveal;
}
