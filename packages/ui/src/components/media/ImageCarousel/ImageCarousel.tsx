import React, { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { A11y, Autoplay, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

export interface CarouselImage {
  /** Full-size image URL */
  src: string;
  /** Accessible description of the image */
  alt: string;
  /** Optional text displayed over the image */
  caption?: string;
  /** Optional image used in the thumbnail strip */
  thumbnailSrc?: string;
}

export interface ImageCarouselProps {
  /** Images displayed in the carousel */
  images: CarouselImage[];
  /** Automatically advance between images */
  autoplay?: boolean;
  /** Time between automatic transitions in milliseconds */
  interval?: number;
  /** Display pagination dots */
  showDots?: boolean;
  /** Display previous and next controls */
  showArrows?: boolean;
  /** CSS aspect ratio, for example "16 / 9" */
  aspectRatio?: string;
  /** Display a thumbnail navigation strip */
  showThumbnails?: boolean;
  /** Stop autoplay after user interaction */
  stopOnInteraction?: boolean;
  /** Additional class names */
  className?: string;
  /** Called whenever the active slide changes */
  onSlideChange?: (index: number) => void;
}

interface ArrowIconProps {
  direction: "previous" | "next";
}

function ArrowIcon({ direction }: ArrowIconProps) {
  const path =
    direction === "previous"
      ? "m14.5 5-7 7 7 7"
      : "m9.5 5 7 7-7 7";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 sm:h-6 sm:w-6"
    >
      <path d={path} />
    </svg>
  );
}

function EmptyImageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4 17 4.5-4.5 3 3 2-2L20 20" />
    </svg>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

export function ImageCarousel({
  images,
  autoplay = false,
  interval = 5000,
  showDots = true,
  showArrows = true,
  aspectRatio = "16 / 9",
  showThumbnails = false,
  stopOnInteraction = false,
  className,
  onSlideChange,
}: ImageCarouselProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const hasMultipleImages = images.length > 1;
  const shouldShowDots = showDots && hasMultipleImages;
  const shouldShowArrows = showArrows && hasMultipleImages;

  const carouselStyle = useMemo(
    () =>
      ({
        aspectRatio,
        "--swiper-pagination-color":
          "var(--ant-color-brand-primary)",
        "--swiper-pagination-bullet-inactive-color":
          "var(--ant-color-neutral-0)",
        "--swiper-pagination-bullet-inactive-opacity": "0.65",
        "--swiper-pagination-bullet-size":
  "var(--ant-spacing-2)",
        "--swiper-pagination-bullet-horizontal-gap":
          "var(--ant-spacing-1)",
      }) as React.CSSProperties,
    [aspectRatio],
  );

  if (images.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={clsx(
          "flex min-h-48 w-full flex-col items-center justify-center",
          "gap-[var(--ant-spacing-3)] rounded-lg",
          "border border-dashed border-[var(--ant-color-neutral-200)]",
          "bg-[var(--ant-color-neutral-50)]",
          "px-[var(--ant-spacing-6)] py-[var(--ant-spacing-8)]",
          "text-center",
          className,
        )}
      >
        <div
          className={clsx(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "bg-[var(--ant-color-neutral-100)]",
            "text-[var(--ant-color-neutral-500)]",
          )}
        >
          <EmptyImageIcon />
        </div>

        <div className="flex flex-col gap-[var(--ant-spacing-1)]">
          <p
            className={clsx(
              "m-0 font-semibold",
              "text-[var(--ant-color-neutral-900)]",
            )}
          >
            No images available
          </p>

          <p
            className={clsx(
              "m-0 text-[length:var(--ant-typography-fontsize-sm)]",
              "text-[var(--ant-color-neutral-500)]",
            )}
          >
            Add images to display them in the carousel.
          </p>
        </div>
      </div>
    );
  }

  const goToPreviousSlide = () => {
    swiper?.slidePrev();
  };

  const goToNextSlide = () => {
    swiper?.slideNext();
  };

  return (
    <section
      aria-label="Image carousel"
      aria-roledescription="carousel"
      className={clsx("w-full", className)}
    >
      <div
        className={clsx(
          "group relative overflow-hidden rounded-lg",
          "bg-[var(--ant-color-neutral-900)]",
          "[&_.swiper-pagination]:bottom-[var(--ant-spacing-2)]",
          "[&_.swiper-pagination-bullet]:transition-all",
          "[&_.swiper-pagination-bullet]:duration-200",
          "[&_.swiper-pagination-bullet]:motion-reduce:transition-none",
          "[&_.swiper-pagination-bullet-active]:w-5",
          "[&_.swiper-pagination-bullet-active]:rounded-full",
        )}
        style={carouselStyle}
      >
        <Swiper
          modules={[A11y, Autoplay, Keyboard, Pagination]}
          className="h-full w-full"
          pagination={
            shouldShowDots
              ? {
                  clickable: true,
                  dynamicBullets: false,
                }
              : false
          }
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          autoplay={
            autoplay && hasMultipleImages && !prefersReducedMotion
              ? {
                  delay: Math.max(interval, 1000),
                  disableOnInteraction: stopOnInteraction,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          loop={hasMultipleImages}
          speed={prefersReducedMotion ? 0 : 450}
          onSwiper={setSwiper}
          onSlideChange={(instance) => {
            setActiveIndex(instance.realIndex);
            onSlideChange?.(instance.realIndex);
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={`${image.src}-${index}`}
              aria-label={`${index + 1} of ${images.length}`}
              aria-roledescription="slide"
            >
              <figure className="relative h-full w-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={clsx(
                    "h-full w-full object-cover",
                    "select-none",
                  )}
                  draggable={false}
                />

                {image.caption && (
                  <figcaption
                    className={clsx(
                      "absolute inset-x-0 bottom-0",
                      "bg-gradient-to-t",
                      "from-[var(--ant-color-neutral-900)]/95",
                      "via-[var(--ant-color-neutral-900)]/65",
                      "to-transparent",
                      "px-[var(--ant-spacing-4)] pt-[var(--ant-spacing-8)]",
                      shouldShowDots
                        ? "pb-[var(--ant-spacing-8)]"
                        : "pb-[var(--ant-spacing-4)]",
                      "text-[length:var(--ant-typography-fontsize-sm)]",
                      "font-medium leading-relaxed",
                      "text-[var(--ant-color-neutral-0)]",
                      "sm:px-[var(--ant-spacing-5)]",
                      "sm:text-[length:var(--ant-typography-fontsize-md)]",
                    )}
                  >
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>

        {shouldShowArrows && (
          <>
            <button
              type="button"
              aria-label="Show previous image"
              onClick={goToPreviousSlide}
              className={clsx(
                "absolute left-[var(--ant-spacing-2)] top-1/2 z-10",
                "-translate-y-1/2",
                "flex h-10 w-10 items-center justify-center rounded-full",
                "bg-[var(--ant-color-neutral-900)]/60",
                "text-[var(--ant-color-neutral-0)]",
                "shadow-md backdrop-blur-sm",
                "transition-all duration-200",
                "hover:scale-105",
                "hover:bg-[var(--ant-color-brand-primary)]",
                "active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[var(--ant-color-neutral-0)]",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[var(--ant-color-brand-primary)]",
                "motion-reduce:transition-none",
                "sm:left-[var(--ant-spacing-4)]",
                "sm:h-11 sm:w-11",
              )}
            >
              <ArrowIcon direction="previous" />
            </button>

            <button
              type="button"
              aria-label="Show next image"
              onClick={goToNextSlide}
              className={clsx(
                "absolute right-[var(--ant-spacing-2)] top-1/2 z-10",
                "-translate-y-1/2",
                "flex h-10 w-10 items-center justify-center rounded-full",
                "bg-[var(--ant-color-neutral-900)]/60",
                "text-[var(--ant-color-neutral-0)]",
                "shadow-md backdrop-blur-sm",
                "transition-all duration-200",
                "hover:scale-105",
                "hover:bg-[var(--ant-color-brand-primary)]",
                "active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[var(--ant-color-neutral-0)]",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[var(--ant-color-brand-primary)]",
                "motion-reduce:transition-none",
                "sm:right-[var(--ant-spacing-4)]",
                "sm:h-11 sm:w-11",
              )}
            >
              <ArrowIcon direction="next" />
            </button>
          </>
        )}
      </div>

      {showThumbnails && hasMultipleImages && (
        <div
          aria-label="Choose an image"
          className={clsx(
            "mt-[var(--ant-spacing-3)] flex",
            "gap-[var(--ant-spacing-2)] overflow-x-auto",
            "pb-[var(--ant-spacing-2)]",
            "overscroll-x-contain",
          )}
        >
          {images.map((image, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={`thumbnail-${image.src}-${index}`}
                type="button"
                aria-label={`Show image ${index + 1}: ${image.alt}`}
                aria-pressed={isActive}
                onClick={() => swiper?.slideToLoop(index)}
                className={clsx(
                  "relative shrink-0 overflow-hidden rounded-md border-2",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5 hover:opacity-100",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[var(--ant-color-brand-primary)]",
                  "focus-visible:ring-offset-2",
                  "motion-reduce:transition-none",
                  isActive
                    ? [
                        "border-[var(--ant-color-brand-primary)]",
                        "opacity-100 shadow-sm",
                      ]
                    : [
                        "border-[var(--ant-color-neutral-200)]",
                        "opacity-70",
                      ],
                )}
              >
                <img
                  src={image.thumbnailSrc ?? image.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className={clsx(
                    "h-14 w-20 object-cover",
                    "sm:h-16 sm:w-24",
                  )}
                />

                {isActive && (
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "absolute inset-x-0 bottom-0 h-1",
                      "bg-[var(--ant-color-brand-primary)]",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}