import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clsx } from "clsx";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ScrollRevealAnimation =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "flip"
  | "flip-x"
  | "flip-y"
  | "blur-in"
  | "rotate";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Animation preset:
   * - `fade-up`: translates up and fades in
   * - `fade-down`: translates down and fades in
   * - `fade-left`: translates from right to left and fades in
   * - `fade-right`: translates from left to right and fades in
   * - `zoom-in`: scales up from 0.85 and fades in
   * - `zoom-out`: scales down from 1.15 and fades in
   * - `flip`: 3D perspective flip
   * - `flip-x`: 3D rotation flip on horizontal axis
   * - `flip-y`: 3D rotation flip on vertical axis
   * - `blur-in`: unblurs and fades in
   * - `rotate`: rotates slightly and fades in
   */
  animation?: ScrollRevealAnimation;

  /**
   * Initial delay in seconds before animation begins (default: 0)
   */
  delay?: number;

  /**
   * Stagger delay in seconds between child elements (default: 0.1)
   */
  stagger?: number;

  /**
   * Viewport trigger threshold: number between 0 and 1, or ScrollTrigger position string like "top 85%" (default: "top 85%")
   */
  threshold?: number | string;

  /**
   * Play animation only once (true) or re-trigger whenever entering viewport (false). Default: true
   */
  once?: boolean;

  /**
   * Duration of the animation in seconds (default: 0.8)
   */
  duration?: number;

  /**
   * Translation distance in pixels for fade/slide presets (default: 40)
   */
  distance?: number | string;

  /**
   * GSAP easing curve name (default: "power2.out")
   */
  ease?: string;

  /**
   * When true, applies the animation and stagger to all direct child elements instead of the container itself
   */
  cascade?: boolean;

  /**
   * HTML tag to render for the wrapper container (default: 'div')
   */
  as?: React.ElementType;

  /**
   * Children elements to animate
   */
  children?: React.ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: React.CSSProperties;
}

function getInitialProperties(animation: ScrollRevealAnimation, distNum: number): gsap.TweenVars {
  switch (animation) {
    case "fade-up":
      return { opacity: 0, y: distNum };
    case "fade-down":
      return { opacity: 0, y: -distNum };
    case "fade-left":
      return { opacity: 0, x: distNum };
    case "fade-right":
      return { opacity: 0, x: -distNum };
    case "zoom-in":
      return { opacity: 0, scale: 0.82 };
    case "zoom-out":
      return { opacity: 0, scale: 1.18 };
    case "flip":
    case "flip-x":
      return { opacity: 0, rotateX: 65, transformPerspective: 800, transformOrigin: "50% 50%" };
    case "flip-y":
      return { opacity: 0, rotateY: 65, transformPerspective: 800, transformOrigin: "50% 50%" };
    case "blur-in":
      return { opacity: 0, filter: "blur(16px)" };
    case "rotate":
      return { opacity: 0, rotate: -12, scale: 0.9 };
    default:
      return { opacity: 0, y: distNum };
  }
}

function getTargetProperties(animation: ScrollRevealAnimation): gsap.TweenVars {
  switch (animation) {
    case "fade-up":
    case "fade-down":
      return { opacity: 1, y: 0 };
    case "fade-left":
    case "fade-right":
      return { opacity: 1, x: 0 };
    case "zoom-in":
    case "zoom-out":
      return { opacity: 1, scale: 1 };
    case "flip":
    case "flip-x":
      return { opacity: 1, rotateX: 0 };
    case "flip-y":
      return { opacity: 1, rotateY: 0 };
    case "blur-in":
      return { opacity: 1, filter: "blur(0px)" };
    case "rotate":
      return { opacity: 1, rotate: 0, scale: 1 };
    default:
      return { opacity: 1, y: 0 };
  }
}

/**
 * ScrollReveal - Scroll-triggered entrance animation wrapper powered by GSAP ScrollTrigger
 */
export function ScrollReveal({
  animation = "fade-up",
  delay = 0,
  stagger = 0.1,
  threshold = "top 85%",
  once = true,
  duration = 0.8,
  distance = 40,
  ease = "power2.out",
  cascade = false,
  as: Component = "div",
  children,
  className,
  style,
  ...restProps
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: "all" });
      return;
    }

    const distNum = typeof distance === "number" ? distance : parseFloat(distance) || 40;
    const startProp =
      typeof threshold === "number" ? `top ${Math.round((1 - threshold) * 100)}%` : threshold;

    const targets = cascade && el.children.length > 0 ? Array.from(el.children) : el;
    const fromVars = getInitialProperties(animation, distNum);
    const toVars = getTargetProperties(animation);

    // Initial state setup
    gsap.set(targets, fromVars);

    const tween = gsap.to(targets, {
      ...toVars,
      duration,
      delay,
      ease,
      stagger: cascade ? stagger : 0,
      scrollTrigger: {
        trigger: el,
        start: startProp,
        toggleActions: once ? "play none none none" : "play reverse play reverse",
        invalidateOnRefresh: true,
      },
    });

    return () => {
      if (tween.scrollTrigger) {
        tween.scrollTrigger.kill();
      }
      tween.kill();
    };
  }, [animation, delay, stagger, threshold, once, duration, distance, ease, cascade]);

  return (
    <Component
      ref={containerRef}
      className={clsx("scroll-reveal-container", className)}
      style={style}
      {...restProps}
    >
      {children}
    </Component>
  );
}

/**
 * Higher-Order Component (HOC) wrapper for applying scroll-reveal animations to any component
 */
export function withScrollReveal<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultRevealProps?: Omit<ScrollRevealProps, "children">
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

  const WithScrollRevealComponent = (props: P & { reveal?: ScrollRevealProps }) => {
    const { reveal, ...componentProps } = props;
    const revealOptions = { ...defaultRevealProps, ...reveal };

    return (
      <ScrollReveal {...revealOptions}>
        <WrappedComponent {...(componentProps as P)} />
      </ScrollReveal>
    );
  };

  WithScrollRevealComponent.displayName = `withScrollReveal(${displayName})`;
  return WithScrollRevealComponent;
}
