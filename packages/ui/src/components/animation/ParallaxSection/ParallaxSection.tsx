import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from "react";
import { clsx } from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Module-level Lenis instance management to prevent multiple conflicting instances
let sharedLenis: Lenis | null = null;
let lenisRefCount = 0;
let lenisTickerCallback: ((time: number) => void) | null = null;
let lenisScrollCallback: (() => void) | null = null;

/**
 * Individual depth layer configuration for ParallaxSection.
 */
export interface ParallaxLayer {
  /** Unique key or identifier for the layer */
  id?: string;

  /** Content rendered inside the layer (background shapes, cards, text, images) */
  children?: ReactNode;

  /**
   * Speed multiplier for this specific layer.
   * Positive values move in the direction of scroll; negative values move counter-scroll.
   * 0 keeps the layer stationary relative to the container.
   * @default 1
   */
  speed?: number;

  /**
   * Layer-specific mouse tilt multiplier or toggle.
   * Set to `true` or a number to scale the tilt intensity for this layer.
   */
  mouseTilt?: boolean | number;

  /** Z-index layer order */
  zIndex?: number;

  /** Additional CSS class names for layer wrapper */
  className?: string;

  /** Additional inline styles for layer wrapper */
  style?: CSSProperties;
}

/**
 * Public props for ParallaxSection.
 */
export interface ParallaxSectionProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Array of parallax depth layers */
  layers: ParallaxLayer[];

  /**
   * Global parallax speed multiplier applied across all layers.
   * @default 1
   */
  speed?: number;

  /**
   * Whether to enable 3D mouse tracking tilt effect across layers.
   * Can be a boolean or configuration object `{ max?: number; perspective?: number }`.
   * @default false
   */
  mouseTilt?: boolean | { max?: number; perspective?: number };

  /**
   * Whether to enable Lenis smooth scrolling for this section.
   * Automatically synchronizes Lenis scroll events with GSAP ScrollTrigger updates.
   * @default false
   */
  smoothScroll?: boolean;

  /** Foreground children rendered in front of parallax layers */
  children?: ReactNode;
}

/**
 * ParallaxSection Component
 *
 * Depth-layered scroll parallax and 3D interactive mouse-tilt section
 * powered by GSAP, ScrollTrigger, and Lenis smooth scrolling.
 *
 * Utilizes a decoupled two-tier DOM architecture so scroll transforms
 * and mouse-tilt 3D rotations never collide. Fully supports accessibility
 * and respects `prefers-reduced-motion`.
 */
export const ParallaxSection = forwardRef<HTMLDivElement, ParallaxSectionProps>(
  (
    {
      layers,
      speed = 1,
      mouseTilt = false,
      smoothScroll = false,
      children,
      className,
      style,
      ...restProps
    },
    forwardedRef
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const tiltLayerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useImperativeHandle(
      forwardedRef,
      () => containerRef.current as HTMLDivElement
    );

    const isReducedMotion = useCallback((): boolean => {
      if (typeof window === "undefined") return false;
      return Boolean(
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
      );
    }, []);

    const safeLayers = layers ?? [];

    // ── 1. GSAP ScrollTrigger & Scroll Parallax ──────────────────────────────
    useEffect(() => {
      const container = containerRef.current;
      if (!container || typeof window === "undefined") return;

      const prefersReduced = isReducedMotion();
      if (prefersReduced) return;

      // Ensure ScrollTrigger plugin is registered
      gsap.registerPlugin(ScrollTrigger);

      // Scoped GSAP context ensures automatic cleanup on unmount
      const ctx = gsap.context(() => {
        safeLayers.forEach((layer, idx) => {
          const scrollEl = scrollLayerRefs.current[idx];
          if (!scrollEl) return;

          const layerSpeed = typeof layer.speed === "number" ? layer.speed : 1;
          const effectiveSpeed = layerSpeed * speed;

          if (effectiveSpeed === 0) return;

          // Compute scrub travel range based on speed multiplier
          const distance = 28 * effectiveSpeed;

          gsap.fromTo(
            scrollEl,
            { yPercent: -distance },
            {
              yPercent: distance,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        // Immediately refresh ScrollTrigger so trigger positions are calculated
        ScrollTrigger.refresh();
      }, container);

      return () => {
        ctx.revert();
      };
    }, [layers, speed, isReducedMotion]);

    // ── 2. Lenis Smooth-Scroll Integration ───────────────────────────────────
    useEffect(() => {
      if (!smoothScroll || typeof window === "undefined") return;

      const prefersReduced = isReducedMotion();
      if (prefersReduced) return;

      lenisRefCount += 1;

      if (!sharedLenis) {
        sharedLenis = new Lenis({
          lerp: 0.1,
          smoothWheel: true,
        });

        lenisScrollCallback = () => {
          ScrollTrigger.update();
        };
        sharedLenis.on("scroll", lenisScrollCallback);

        lenisTickerCallback = (time: number) => {
          sharedLenis?.raf(time * 1000);
        };
        gsap.ticker.add(lenisTickerCallback);
        gsap.ticker.lagSmoothing(0);
      }

      return () => {
        lenisRefCount = Math.max(0, lenisRefCount - 1);

        if (lenisRefCount === 0 && sharedLenis) {
          if (lenisTickerCallback) {
            gsap.ticker.remove(lenisTickerCallback);
            lenisTickerCallback = null;
          }

          if (lenisScrollCallback) {
            sharedLenis.off("scroll", lenisScrollCallback);
            lenisScrollCallback = null;
          }

          sharedLenis.destroy();
          sharedLenis = null;

          // Restore default GSAP ticker lagSmoothing so global state remains unaffected
          gsap.ticker.lagSmoothing(500, 33);
        }
      };
    }, [smoothScroll, isReducedMotion]);

    // ── 3. Interactive 3D Mouse Tilt ─────────────────────────────────────────
    useEffect(() => {
      const container = containerRef.current;
      if (!container || !mouseTilt || typeof window === "undefined") return;

      const prefersReduced = isReducedMotion();
      if (prefersReduced) return;

      const maxTilt =
        typeof mouseTilt === "object" && typeof mouseTilt.max === "number"
          ? mouseTilt.max
          : 12;

      const perspective =
        typeof mouseTilt === "object" && typeof mouseTilt.perspective === "number"
          ? mouseTilt.perspective
          : 1000;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Normalized mouse offsets from center (-0.5 to 0.5)
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        safeLayers.forEach((layer, idx) => {
          const tiltEl = tiltLayerRefs.current[idx];
          if (!tiltEl) return;

          const layerTiltFactor =
            typeof layer.mouseTilt === "number"
              ? layer.mouseTilt
              : layer.mouseTilt === false
              ? 0
              : 1;

          if (layerTiltFactor === 0) return;

          const rotX = -normY * maxTilt * layerTiltFactor;
          const rotY = normX * maxTilt * layerTiltFactor;
          // Dual translation + 3D rotation creates perceptible multi-layer depth parallax
          const moveX = normX * (maxTilt * 2.5) * layerTiltFactor;
          const moveY = normY * (maxTilt * 2.5) * layerTiltFactor;

          gsap.to(tiltEl, {
            rotationX: rotX,
            rotationY: rotY,
            x: moveX,
            y: moveY,
            transformPerspective: perspective,
            ease: "power2.out",
            duration: 0.4,
            overwrite: "auto",
          });
        });
      };

      const handleMouseLeave = () => {
        safeLayers.forEach((_, idx) => {
          const tiltEl = tiltLayerRefs.current[idx];
          if (!tiltEl) return;

          gsap.to(tiltEl, {
            rotationX: 0,
            rotationY: 0,
            x: 0,
            y: 0,
            ease: "power2.out",
            duration: 0.6,
            overwrite: "auto",
          });
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);

        // Clean up all active mouse-tilt tweens and clear inline transform properties on unmount
        tiltLayerRefs.current.forEach((tiltEl) => {
          if (tiltEl) {
            gsap.killTweensOf(tiltEl);
            gsap.set(tiltEl, { clearProps: "transform,transformPerspective" });
          }
        });
      };
    }, [layers, mouseTilt, isReducedMotion]);

    const containerPerspective =
      typeof mouseTilt === "object" && typeof mouseTilt.perspective === "number"
        ? `${mouseTilt.perspective}px`
        : mouseTilt
        ? "1000px"
        : undefined;

    return (
      <div
        ref={containerRef}
        {...restProps}
        style={{
          perspective: containerPerspective,
          ...style,
        }}
        className={clsx(
          "relative w-full overflow-hidden select-none min-h-[calc(var(--ant-spacing-24)*3)] bg-[var(--ant-color-surface-bg)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)]",
          className
        )}
      >
        {/* Two-tier Layer Structure: Outer for Scroll Parallax, Inner for 3D Tilt */}
        {safeLayers.map((layer, index) => (
          <div
            key={layer.id ?? index}
            ref={(el) => {
              scrollLayerRefs.current[index] = el;
            }}
            data-parallax-layer={index}
            className={clsx(
              "absolute -inset-x-0 -top-[15%] w-full h-[130%] pointer-events-none will-change-transform",
              layer.className
            )}
            style={{
              zIndex: layer.zIndex ?? index,
              ...layer.style,
            }}
          >
            <div
              ref={(el) => {
                tiltLayerRefs.current[index] = el;
              }}
              data-parallax-tilt={index}
              className="w-full h-full pointer-events-auto will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {layer.children}
            </div>
          </div>
        ))}

        {/* Foreground Content */}
        {children && (
          <div className="relative z-[var(--ant-zIndex-raised)] w-full h-full pointer-events-auto">
            {children}
          </div>
        )}
      </div>
    );
  }
);

ParallaxSection.displayName = "ParallaxSection";
