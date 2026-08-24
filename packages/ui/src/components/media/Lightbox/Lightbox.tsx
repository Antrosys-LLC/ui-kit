import { AnimatePresence, motion } from "framer-motion";
import FocusTrap from "focus-trap-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";

export interface LightboxProps {
  /** Controls whether the lightbox is mounted; defaults to true when uncontrolled */
  isOpen?: boolean;
  /** URL of the image to display */
  src: string;
  /** Alt text describing the image for screen readers */
  alt?: string;
  /** Optional list of image URLs to browse between; falls back to src alone */
  thumbnails?: string[];
  /** Enables click-to-zoom interaction on the main image */
  zoomEnabled?: boolean;
  /** Automatically advances through thumbnails at autoPlayInterval */
  autoPlay?: boolean;
  /** Delay in milliseconds between autoplay transitions */
  autoPlayInterval?: number;
  /** Callback fired when the lightbox requests to close (Escape, backdrop, or close button) */
  onClose: () => void;
}

type Direction = "prev" | "next";

interface NavigationButtonProps {
  direction: Direction;
  pressed: boolean;
  onClick: () => void;
  onPressedChange: (pressed: boolean) => void;
}

function NavigationButton({
  direction,
  pressed,
  onClick,
  onPressedChange,
}: NavigationButtonProps) {
  const isPrevious = direction === "prev";

  const style: CSSProperties = {
    position: "absolute",
    [isPrevious ? "left" : "right"]:
      "clamp(var(--ant-spacing-4), 3vw, var(--ant-spacing-12))",
    top: "50%",
    zIndex: "var(--ant-zIndex-modal)",
    width: "var(--ant-spacing-12)",
    height: "var(--ant-spacing-12)",
    minWidth: "var(--ant-spacing-12)",
    minHeight: "var(--ant-spacing-12)",
    padding: "var(--ant-spacing-0)",
    margin: "var(--ant-spacing-0)",
    border: "var(--ant-spacing-0)",
    borderRadius: "var(--ant-radius-full)",
    background: pressed
      ? "var(--ant-color-brand-primary)"
      : "var(--ant-color-neutral-900)",
    color: "var(--ant-color-neutral-0)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--ant-typography-fontFamily-sans)",
    fontSize: "var(--ant-typography-fontSize-3xl)",
    fontWeight: "var(--ant-typography-fontWeight-bold)",
    lineHeight: 1,
    boxShadow: "var(--ant-shadow-lg)",
  };

  return (
    <motion.button
      type="button"
      aria-label={isPrevious ? "Previous image" : "Next image"}
      aria-pressed={pressed}
      onPointerDown={(event) => {
        event.stopPropagation();
        onPressedChange(true);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        onPressedChange(false);
      }}
      onPointerCancel={() => onPressedChange(false)}
      onPointerLeave={() => onPressedChange(false)}
      onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onPressedChange(false);
        onClick();
      }}
      whileHover={{
        scale: 1.12,
        x: isPrevious ? -4 : 4,
        backgroundColor: "var(--ant-color-brand-primary)",
        color: "var(--ant-color-neutral-0)",
      }}
      whileTap={{
        scale: 0.92,
        backgroundColor: "var(--ant-color-brand-primary)",
        color: "var(--ant-color-neutral-0)",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
      style={style}
    >
      <span
        aria-hidden="true"
        style={{
          display: "block",
          fontFamily: "var(--ant-typography-fontFamily-sans)",
          fontWeight: "var(--ant-typography-fontWeight-bold)",
          lineHeight: 1,
        }}
      >
        {isPrevious ? "‹" : "›"}
      </span>
    </motion.button>
  );
}

function LightboxBase({
  src,
  alt = "Image",
  thumbnails = [],
  zoomEnabled = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onClose,
}: LightboxProps) {
  const images = thumbnails.length > 0 ? thumbnails : [src];
  const initialIndex = Math.max(images.indexOf(src), 0);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [pressedButton, setPressedButton] =
    useState<Direction | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const currentImage = images[currentIndex];

  useEffect(() => {
    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElementRef.current?.focus();
      previouslyFocusedElementRef.current = null;
    };
  }, []);

  const goToImage = (index: number, resumeAutoPlay = true) => {
    setCurrentIndex(index);
    setScale(1);

    if (resumeAutoPlay) {
      setIsPaused(false);
    }
  };

  const nextImage = () => {
    goToImage((currentIndex + 1) % images.length);
  };

  const previousImage = () => {
    goToImage((currentIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (
      !autoPlay ||
      images.length <= 1 ||
      isPaused ||
      autoPlayInterval <= 0
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentIndex(
        (previousIndex) => (previousIndex + 1) % images.length,
      );
      setScale(1);
    }, autoPlayInterval);

    return () => {
      window.clearInterval(interval);
    };
  }, [autoPlay, autoPlayInterval, images.length, isPaused]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextImage();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousImage();
        return;
      }

      if (!zoomEnabled) {
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setIsPaused(true);
        setScale((previousScale) =>
          Math.min(previousScale + 0.25, 3),
        );
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        setIsPaused(true);
        setScale((previousScale) =>
          Math.max(previousScale - 0.25, 1),
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomEnabled, onClose, currentIndex, images.length]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog || !zoomEnabled) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      setIsPaused(true);

      setScale((previousScale) => {
        const nextScale =
          previousScale - event.deltaY * 0.001;

        return Math.min(Math.max(nextScale, 1), 3);
      });
    };

    dialog.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      dialog.removeEventListener("wheel", handleWheel);
    };
  }, [zoomEnabled]);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType !== "touch") {
      return;
    }

    touchStartXRef.current = event.clientX;
    touchStartYRef.current = event.clientY;
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.pointerType !== "touch" ||
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      images.length <= 1 ||
      scale > 1
    ) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }

    const deltaX =
      event.clientX - touchStartXRef.current;
    const deltaY =
      event.clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (
      Math.abs(deltaX) < 50 ||
      Math.abs(deltaX) < Math.abs(deltaY)
    ) {
      return;
    }

    if (deltaX < 0) {
      nextImage();
    } else {
      previousImage();
    }
  };

  return (
    <FocusTrap
      focusTrapOptions={{
        initialFocus: () => closeButtonRef.current,
        clickOutsideDeactivates: false,
        escapeDeactivates: false,
        returnFocusOnDeactivate: false,
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        tabIndex={-1}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: "var(--ant-zIndex-modal)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--ant-spacing-4)",
          padding: "var(--ant-spacing-8)",
          overflow: "hidden",
          background: "var(--ant-color-neutral-900)",
          touchAction: "none",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={`background-${currentImage}`}
            src={currentImage}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              inset: "calc(var(--ant-spacing-4) * -1)",
              width:
                "calc(100% + var(--ant-spacing-8))",
              height:
                "calc(100% + var(--ant-spacing-8))",
              objectFit: "cover",
              filter: "blur(var(--ant-spacing-4))",
              opacity: "0.5",
              transform: "scale(1.08)",
              pointerEvents: "none",
            }}
          />
        </AnimatePresence>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: "var(--ant-zIndex-raised)",
            background:
              "color-mix(in srgb, var(--ant-color-neutral-900) 35%, transparent)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(event: ReactMouseEvent<HTMLDivElement>) => event.stopPropagation()}
          style={{
            position: "absolute",
            top: "var(--ant-spacing-5)",
            left: "var(--ant-spacing-5)",
            right: "var(--ant-spacing-5)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: "var(--ant-zIndex-toast)",
          }}
        >
          <div
            style={{
              padding:
                "var(--ant-spacing-2) var(--ant-spacing-3)",
              borderRadius: "var(--ant-radius-full)",
              color: "var(--ant-color-neutral-0)",
              background:
                "color-mix(in srgb, var(--ant-color-neutral-900) 60%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--ant-color-neutral-0) 20%, transparent)",
              backdropFilter:
                "blur(var(--ant-spacing-4))",
              fontSize:
                "var(--ant-typography-fontSize-xs)",
              fontWeight:
                "var(--ant-typography-fontWeight-semibold)",
              boxShadow: "var(--ant-shadow-lg)",
            }}
          >
            Image {currentIndex + 1} / {images.length}
          </div>

          <motion.button
            ref={closeButtonRef}
            type="button"
            aria-label="Close image viewer"
            onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              onClose();
            }}
            whileHover={{
              scale: 1.08,
              rotate: 3,
            }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: "var(--ant-spacing-10)",
              height: "var(--ant-spacing-10)",
              borderRadius: "var(--ant-radius-full)",
              border:
                "1px solid color-mix(in srgb, var(--ant-color-neutral-0) 20%, transparent)",
              background:
                "color-mix(in srgb, var(--ant-color-neutral-900) 60%, transparent)",
              color: "var(--ant-color-neutral-0)",
              backdropFilter:
                "blur(var(--ant-spacing-4))",
              fontSize:
                "var(--ant-typography-fontSize-xl)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--ant-shadow-lg)",
            }}
          >
            ×
          </motion.button>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          onClick={(event: ReactMouseEvent<HTMLDivElement>) => event.stopPropagation()}
          style={{
            position: "relative",
            zIndex: "var(--ant-zIndex-raised)",
            padding: "var(--ant-spacing-2)",
            borderRadius: "var(--ant-radius-xl)",
            background:
              "color-mix(in srgb, var(--ant-color-neutral-0) 8%, transparent)",
            border:
              "1px solid color-mix(in srgb, var(--ant-color-neutral-0) 20%, transparent)",
            backdropFilter:
              "blur(var(--ant-spacing-4))",
            boxShadow: "var(--ant-shadow-lg)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`image-${currentImage}`}
              src={currentImage}
              alt={alt}
              drag={zoomEnabled && scale > 1}
              dragConstraints={{
                top: Infinity,
                bottom: Infinity,
                left: Infinity,
                right: Infinity,
              }}
              dragElastic={0.2}
              onDoubleClick={() => {
                if (!zoomEnabled) {
                  return;
                }

                setIsPaused(true);
                setScale((previousScale) =>
                  previousScale === 1 ? 2 : 1,
                );
              }}
              initial={{
                opacity: 0,
                x: 35,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale,
              }}
              exit={{
                opacity: 0,
                x: -35,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              style={{
                display: "block",
                maxWidth: "88vw",
                maxHeight: "68vh",
                objectFit: "contain",
                borderRadius: "var(--ant-radius-lg)",
                userSelect: "none",
                touchAction:
                  zoomEnabled && scale > 1
                    ? "none"
                    : "pan-y",
                cursor: !zoomEnabled
                  ? "default"
                  : scale > 1
                    ? "grab"
                    : "zoom-in",
              }}
            />
          </AnimatePresence>
        </motion.div>

        {images.length > 1 && (
          <>
            <NavigationButton
              direction="prev"
              pressed={pressedButton === "prev"}
              onClick={previousImage}
              onPressedChange={(pressed) =>
                setPressedButton(
                  pressed ? "prev" : null,
                )
              }
            />

            <NavigationButton
              direction="next"
              pressed={pressedButton === "next"}
              onClick={nextImage}
              onPressedChange={(pressed) =>
                setPressedButton(
                  pressed ? "next" : null,
                )
              }
            />
          </>
        )}

        {images.length > 1 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            onClick={(event: ReactMouseEvent<HTMLDivElement>) => event.stopPropagation()}
            style={{
              position: "relative",
              zIndex: "var(--ant-zIndex-raised)",
              display: "flex",
              gap: "var(--ant-spacing-2)",
              padding: "var(--ant-spacing-2)",
              maxWidth: "90vw",
              overflowX: "auto",
              borderRadius: "var(--ant-radius-lg)",
              background:
                "color-mix(in srgb, var(--ant-color-neutral-900) 60%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--ant-color-neutral-0) 20%, transparent)",
              backdropFilter:
                "blur(var(--ant-spacing-4))",
            }}
          >
            {images.map((image, index) => (
              <motion.button
                key={`${image}-${index}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-current={
                  index === currentIndex
                    ? "true"
                    : undefined
                }
                onClick={() => goToImage(index)}
                whileHover={{
                  scale: 1.06,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                style={{
                  padding: "var(--ant-spacing-0)",
                  border:
                    index === currentIndex
                      ? "2px solid var(--ant-color-brand-primary)"
                      : "2px solid transparent",
                  background: "transparent",
                  borderRadius: "var(--ant-radius-md)",
                  cursor: "pointer",
                  opacity:
                    index === currentIndex ? 1 : 0.55,
                  overflow: "hidden",
                  transition:
                    "border-color 0.2s ease, opacity 0.2s ease",
                }}
              >
                <img
                  src={image}
                  alt=""
                  style={{
                    width:
                      "calc(var(--ant-spacing-20) + var(--ant-spacing-2))",
                    height:
                      "calc(var(--ant-spacing-12) - var(--ant-spacing-1))",
                    display: "block",
                    objectFit: "cover",
                    borderRadius: "var(--ant-radius-sm)",
                  }}
                />
              </motion.button>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {isPaused && autoPlay && (
            <motion.div
              initial={{
                opacity: 0,
                y: 8,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 8,
                scale: 0.9,
              }}
              onClick={(event: ReactMouseEvent<HTMLDivElement>) =>
                event.stopPropagation()
              }
              style={{
                position: "absolute",
                bottom: "var(--ant-spacing-4)",
                zIndex: "var(--ant-zIndex-raised)",
                padding:
                  "var(--ant-spacing-1) var(--ant-spacing-3)",
                borderRadius: "var(--ant-radius-full)",
                background:
                  "color-mix(in srgb, var(--ant-color-neutral-900) 60%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--ant-color-neutral-0) 20%, transparent)",
                backdropFilter:
                  "blur(var(--ant-spacing-4))",
                color: "var(--ant-color-neutral-0)",
                fontSize:
                  "var(--ant-typography-fontSize-xs)",
                fontWeight:
                  "var(--ant-typography-fontWeight-medium)",
              }}
            >
              Ⅱ Paused • Click Next / Previous to continue
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </FocusTrap>
  );
}

/**
 * Responsive image lightbox with navigation, thumbnails, zoom,
 * autoplay, keyboard controls, focus trapping, and body scroll locking.
 *
 * Keyboard controls:
 * Escape closes the lightbox.
 * ArrowLeft and ArrowRight navigate between images.
 * Plus or Equal zooms in.
 * Minus zooms out.
 */
export function Lightbox({ isOpen = true, ...props }: LightboxProps) {
  return (
    <AnimatePresence>
      {isOpen && <LightboxBase {...props} />}
    </AnimatePresence>
  );
}