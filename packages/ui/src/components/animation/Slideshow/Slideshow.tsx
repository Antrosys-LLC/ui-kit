import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { clsx } from "clsx";
import gsap from "gsap";

export type SlideshowTransition = "fade" | "slide" | "zoom";

export interface SlideData {
  /** Unique identifier for the slide */
  id?: string | number;
  /** Optional slide title or headline */
  title?: React.ReactNode;
  /** Main slide content */
  content: React.ReactNode;
  /** Optional presenter notes for this slide */
  notes?: React.ReactNode;
  /** Optional custom background style or CSS token */
  background?: string;
  /** Optional additional CSS classes for this slide */
  className?: string;
  /** Optional accessible aria label for the slide */
  ariaLabel?: string;
}

export interface SlideshowProps {
  /** Array of slide items to render */
  slides: SlideData[];
  /** Transition animation preset between slides */
  transition?: SlideshowTransition;
  /** Whether to show the presentation progress bar */
  showProgress?: boolean;
  /** Whether to enable keyboard navigation (arrows, Home, End, F, S) */
  allowKeyboard?: boolean;
  /** Initial slide index to display (uncontrolled) */
  initialSlide?: number;
  /** Controlled active slide index */
  currentSlide?: number;
  /** Callback fired when the active slide changes */
  onSlideChange?: (index: number) => void;
  /** Whether navigation loops around from last to first slide and vice versa */
  loop?: boolean;
  /** Whether to show the bottom navigation toolbar */
  showControls?: boolean;
  /** Whether speaker notes panel is initially visible */
  defaultNotesOpen?: boolean;
  /** Additional CSS classes for the outer slideshow container */
  className?: string;
  /** Accessible label for the slideshow presentation region */
  ariaLabel?: string;
}

const focusRingClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ant-color-surface-bg-card)]";

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}

/**
 * Slideshow / Presentation Mode component for Antrosys UI Kit.
 * Built with React + GSAP with smooth transitions, keyboard controls,
 * speaker notes, fullscreen mode, progress tracking, and print support.
 */
export function Slideshow({
  slides,
  transition = "slide",
  showProgress = true,
  allowKeyboard = true,
  initialSlide = 0,
  currentSlide,
  onSlideChange,
  loop = false,
  showControls = true,
  defaultNotesOpen = false,
  className,
  ariaLabel = "Presentation Slideshow",
}: SlideshowProps) {
  const totalSlides = slides.length;
  const isControlled = currentSlide !== undefined;
  const initialIndex = Math.min(
    Math.max(0, initialSlide),
    Math.max(0, totalSlides - 1),
  );

  const [internalIndex, setInternalIndex] = useState(initialIndex);
  const activeIndex = isControlled
    ? Math.min(Math.max(0, currentSlide), Math.max(0, totalSlides - 1))
    : internalIndex;

  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isNotesOpen, setIsNotesOpen] = useState(defaultNotesOpen);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideDeckRef = useRef<HTMLDivElement>(null);
  const currentSlideElRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const prefersReducedMotion = usePrefersReducedMotion();
  const slideshowId = useId();

  const activeSlideData = slides[activeIndex];
  const hasNotes = Boolean(activeSlideData?.notes);

  // Navigation handlers
  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (totalSlides === 0) return;

      let nextIdx = targetIndex;
      if (loop) {
        if (nextIdx < 0) nextIdx = totalSlides - 1;
        if (nextIdx >= totalSlides) nextIdx = 0;
      } else {
        if (nextIdx < 0) nextIdx = 0;
        if (nextIdx >= totalSlides) nextIdx = totalSlides - 1;
      }

      if (nextIdx === activeIndex) return;

      setDirection(nextIdx > activeIndex ? "next" : "prev");

      if (!isControlled) {
        setInternalIndex(nextIdx);
      }
      onSlideChange?.(nextIdx);
    },
    [activeIndex, isControlled, loop, onSlideChange, totalSlides],
  );

  const nextSlide = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;

    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // Graceful fallback if fullscreen is rejected by browser permissions
    }
  }, []);

  // Listen to native fullscreen changes
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const handleFullscreenChange = () => {
      const isFull = Boolean(
        document.fullscreenElement &&
          containerRef.current &&
          document.fullscreenElement === containerRef.current,
      );
      setIsFullscreen(isFull);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!allowKeyboard || typeof window === "undefined") return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (isInput) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          prevSlide();
          break;
        case "Home":
          e.preventDefault();
          goToSlide(0);
          break;
        case "End":
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "s":
        case "S":
        case "n":
        case "N":
          e.preventDefault();
          setIsNotesOpen((prev) => !prev);
          break;
        case "Escape":
          if (isNotesOpen && !document.fullscreenElement) {
            e.preventDefault();
            setIsNotesOpen(false);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    allowKeyboard,
    goToSlide,
    isNotesOpen,
    nextSlide,
    prevSlide,
    toggleFullscreen,
    totalSlides,
  ]);

  // GSAP Animation effect on slide change
  useEffect(() => {
    const el = currentSlideElRef.current;
    if (!el) return undefined;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(el, { opacity: 1, xPercent: 0, scale: 1, clearProps: "transform" });
      return undefined;
    }

    if (prefersReducedMotion) {
      gsap.killTweensOf(el);
      gsap.set(el, { opacity: 1, xPercent: 0, scale: 1 });
      return undefined;
    }

    // Cancel active tweens on the slide element to prevent conflicts on rapid clicks
    gsap.killTweensOf(el);

    if (transition === "fade") {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
      );
    } else if (transition === "slide") {
      const startX = direction === "next" ? 40 : -40;
      gsap.fromTo(
        el,
        { opacity: 0, x: startX },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          ease: "power3.out",
        },
      );
    } else if (transition === "zoom") {
      const startScale = direction === "next" ? 0.92 : 1.08;
      gsap.fromTo(
        el,
        { opacity: 0, scale: startScale },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
        },
      );
    }

    return () => {
      gsap.killTweensOf(el);
    };
  }, [activeIndex, direction, prefersReducedMotion, transition]);

  const canGoPrev = loop || activeIndex > 0;
  const canGoNext = loop || activeIndex < totalSlides - 1;
  const progressPercent =
    totalSlides > 0 ? ((activeIndex + 1) / totalSlides) * 100 : 0;

  if (totalSlides === 0) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center p-[var(--ant-spacing-8)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-surface-bg-card)] border border-[var(--ant-color-surface-border)] text-[var(--ant-color-surface-text-sub)]",
          className,
        )}
      >
        No slides provided
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={slideshowId}
      tabIndex={0}
      role="region"
      aria-roledescription="slideshow"
      aria-label={ariaLabel}
      className={clsx(
        "relative flex flex-col w-full overflow-hidden transition-all duration-[var(--ant-motion-duration-normal)] select-none",
        "bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-surface-text)]",
        "border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-2xl)] shadow-[var(--ant-shadow-lg)]",
        isFullscreen
          ? "fixed inset-0 z-[var(--ant-zIndex-modal)] rounded-[var(--ant-radius-none)] border-none h-screen w-screen"
          : "min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]",
        focusRingClass,
        "ant-slideshow-container",
        className,
      )}
    >
      {/* Embedded print styles for seamless presentation PDF export */}
      <style>{`
        @media print {
          .ant-slideshow-container {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            overflow: visible !important;
            display: block !important;
            height: auto !important;
            min-height: auto !important;
          }
          .ant-slideshow-screen-only {
            display: none !important;
          }
          .ant-slideshow-print-deck {
            display: block !important;
          }
          .ant-slideshow-print-slide {
            page-break-after: always !important;
            break-after: page !important;
            min-height: 100vh !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            padding: 40px !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            border-bottom: 2px solid #e2e8f0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .ant-slideshow-print-notes {
            margin-top: 24px !important;
            padding: 16px !important;
            background-color: #f8fafc !important;
            border-left: 4px solid #7c3aed !important;
            font-size: 13px !important;
            color: #475569 !important;
          }
        }
        @media screen {
          .ant-slideshow-print-deck {
            display: none;
          }
        }
      `}</style>

      {/* Screen Presentation View */}
      <div className="ant-slideshow-screen-only flex flex-col flex-1 relative w-full h-full min-h-0">
        {/* Top Progress Bar (if enabled) */}
        {showProgress && (
          <div
            role="progressbar"
            aria-valuenow={activeIndex + 1}
            aria-valuemin={1}
            aria-valuemax={totalSlides}
            aria-valuetext={`Slide ${activeIndex + 1} of ${totalSlides}`}
            className="w-full h-[var(--ant-spacing-1)] bg-[var(--ant-color-neutral-200)]/60 relative overflow-hidden"
          >
            <div
              className="h-full bg-[var(--ant-color-brand-primary)] transition-all duration-[var(--ant-motion-duration-slow)] ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Live Slide Viewport */}
        <div
          ref={slideDeckRef}
          aria-live="polite"
          className="relative flex-1 w-full flex items-center justify-center p-[var(--ant-spacing-6)] sm:p-[var(--ant-spacing-10)] overflow-hidden"
        >
          <div
            ref={currentSlideElRef}
            key={activeSlideData?.id ?? activeIndex}
            role="group"
            aria-roledescription="slide"
            aria-label={
              activeSlideData?.ariaLabel ||
              `Slide ${activeIndex + 1} of ${totalSlides}${
                typeof activeSlideData?.title === "string"
                  ? `: ${activeSlideData.title}`
                  : ""
              }`
            }
            className={clsx(
              "w-full h-full flex flex-col justify-center items-center text-center max-w-4xl mx-auto",
              activeSlideData?.className,
            )}
            style={
              activeSlideData?.background
                ? { background: activeSlideData.background }
                : undefined
            }
          >
            {activeSlideData?.title && (
              <h2 className="text-[var(--ant-typography-fontSize-2xl)] sm:text-[var(--ant-typography-fontSize-3xl)] font-bold text-[var(--ant-color-surface-text)] mb-[var(--ant-spacing-4)] tracking-tight">
                {activeSlideData.title}
              </h2>
            )}
            <div className="w-full text-[var(--ant-typography-fontSize-base)] sm:text-[var(--ant-typography-fontSize-lg)] text-[var(--ant-color-surface-text)] leading-[var(--ant-typography-lineHeight-loose)]">
              {activeSlideData?.content}
            </div>
          </div>
        </div>

        {/* Speaker Notes Overlay Panel */}
        {isNotesOpen && (
          <aside
            role="region"
            aria-label="Speaker notes"
            className={clsx(
              "absolute bottom-[var(--ant-spacing-16)] left-[var(--ant-spacing-4)] right-[var(--ant-spacing-4)] sm:left-[var(--ant-spacing-6)] sm:right-auto sm:w-[380px] max-h-[220px]",
              "p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-xl)]",
              "bg-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-0)] shadow-[var(--ant-shadow-xl)] border border-[var(--ant-color-neutral-700)]",
              "flex flex-col z-[var(--ant-zIndex-overlay)] backdrop-blur-md transition-all duration-[var(--ant-motion-duration-normal)]",
            )}
          >
            <div className="flex items-center justify-between border-b border-[var(--ant-color-neutral-700)] pb-[var(--ant-spacing-2)] mb-[var(--ant-spacing-2)]">
              <div className="flex items-center gap-[var(--ant-spacing-2)]">
                <svg
                  aria-hidden="true"
                  className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)] text-[var(--ant-color-brand-primary-lt)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold uppercase tracking-wider text-[var(--ant-color-brand-primary-lt)]">
                  Speaker Notes (Slide {activeIndex + 1}/{totalSlides})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsNotesOpen(false)}
                className={clsx(
                  "p-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-color-neutral-400)] hover:text-[var(--ant-color-neutral-0)] hover:bg-[var(--ant-color-neutral-800)] transition-colors",
                  focusRingClass,
                )}
                aria-label="Close speaker notes"
              >
                <svg
                  aria-hidden="true"
                  className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-[var(--ant-typography-fontSize-sm)] text-[var(--ant-color-neutral-300)] leading-relaxed pr-[var(--ant-spacing-1)]">
              {hasNotes ? (
                activeSlideData.notes
              ) : (
                <span className="italic text-[var(--ant-color-neutral-500)]">
                  No speaker notes for this slide.
                </span>
              )}
            </div>
          </aside>
        )}

        {/* Bottom Control Toolbar */}
        {showControls && (
          <div className="flex items-center justify-between px-[var(--ant-spacing-4)] sm:px-[var(--ant-spacing-6)] py-[var(--ant-spacing-3)] border-t border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)]/80 backdrop-blur-sm z-[var(--ant-zIndex-raised)]">
            {/* Left group: Previous / Next & Counter */}
            <div className="flex items-center gap-[var(--ant-spacing-2)] sm:gap-[var(--ant-spacing-3)]">
              {/* Previous Button */}
              <button
                type="button"
                onClick={prevSlide}
                disabled={!canGoPrev}
                className={clsx(
                  "inline-flex items-center justify-center p-[var(--ant-spacing-2)] rounded-[var(--ant-radius-lg)] text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-200)]/60 active:bg-[var(--ant-color-neutral-300)]/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
                  focusRingClass,
                )}
                aria-label="Previous slide"
              >
                <svg
                  aria-hidden="true"
                  className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Slide Counter Indicator */}
              <div
                aria-label={`Slide ${activeIndex + 1} of ${totalSlides}`}
                className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-surface-bg-card)] border border-[var(--ant-color-surface-border)] text-[var(--ant-typography-fontSize-xs)] sm:text-[var(--ant-typography-fontSize-sm)] font-medium tabular-nums text-[var(--ant-color-surface-text-sub)] select-none shadow-[var(--ant-shadow-sm)]"
              >
                <span className="font-semibold text-[var(--ant-color-surface-text)]">
                  {activeIndex + 1}
                </span>{" "}
                / {totalSlides}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={nextSlide}
                disabled={!canGoNext}
                className={clsx(
                  "inline-flex items-center justify-center p-[var(--ant-spacing-2)] rounded-[var(--ant-radius-lg)] text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-200)]/60 active:bg-[var(--ant-color-neutral-300)]/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
                  focusRingClass,
                )}
                aria-label="Next slide"
              >
                <svg
                  aria-hidden="true"
                  className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Right group: Speaker Notes, Fullscreen */}
            <div className="flex items-center gap-[var(--ant-spacing-2)]">
              {/* Speaker Notes Toggle */}
              <button
                type="button"
                onClick={() => setIsNotesOpen((prev) => !prev)}
                className={clsx(
                  "relative inline-flex items-center gap-[var(--ant-spacing-1.5)] px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1.5)] rounded-[var(--ant-radius-lg)] text-[var(--ant-typography-fontSize-xs)] sm:text-[var(--ant-typography-fontSize-sm)] font-medium transition-colors",
                  isNotesOpen
                    ? "bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-neutral-0)] hover:bg-[var(--ant-color-brand-primary-dk)]"
                    : "text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-200)]/60 border border-[var(--ant-color-surface-border)]",
                  focusRingClass,
                )}
                aria-label={
                  isNotesOpen ? "Hide speaker notes" : "Show speaker notes"
                }
                aria-pressed={isNotesOpen}
              >
                <svg
                  aria-hidden="true"
                  className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span className="hidden sm:inline">Notes</span>
                {hasNotes && !isNotesOpen && (
                  <span
                    aria-hidden="true"
                    className="w-[var(--ant-spacing-2)] h-[var(--ant-spacing-2)] rounded-full bg-[var(--ant-color-brand-accent)]"
                  />
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className={clsx(
                  "inline-flex items-center justify-center p-[var(--ant-spacing-2)] rounded-[var(--ant-radius-lg)] text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-200)]/60 active:bg-[var(--ant-color-neutral-300)]/60 transition-colors border border-[var(--ant-color-surface-border)]",
                  focusRingClass,
                )}
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
                aria-pressed={isFullscreen}
              >
                {isFullscreen ? (
                  <svg
                    aria-hidden="true"
                    className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9L4 4m0 0l5 0m-5 0l0 5m11 0l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0-5m11 0l5 5m0 0l-5 0m5 0l0-5"
                    />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Print Deck Layout for Ctrl+P / Cmd+P browser export */}
      <div className="ant-slideshow-print-deck">
        {slides.map((slide, idx) => (
          <article
            key={slide.id ?? idx}
            className="ant-slideshow-print-slide"
            style={slide.background ? { background: slide.background } : undefined}
          >
            <div className="text-xs uppercase tracking-widest text-slate-400 mb-4">
              Slide {idx + 1} of {totalSlides}
            </div>
            {slide.title && (
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {slide.title}
              </h2>
            )}
            <div className="text-base text-slate-700 leading-relaxed">
              {slide.content}
            </div>
            {slide.notes && (
              <div className="ant-slideshow-print-notes">
                <strong>Speaker Notes:</strong> {slide.notes}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
