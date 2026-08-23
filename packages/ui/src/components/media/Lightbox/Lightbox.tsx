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
  /** Determines if the lightbox is currently open and visible. */
  isOpen?: boolean;

  /** Image URL displayed when the lightbox opens. */
  src: string;

  /** Accessible alternative text for the currently displayed image. */
  alt?: string;

  /** Optional list of image URLs used for navigation and thumbnails. */
  thumbnails?: string[];

  /** Enables zoom controls using double-click, mouse wheel, and keyboard shortcuts. Defaults to true. */
  zoomEnabled?: boolean;

  /** Enables automatic image rotation. Defaults to false. */
  autoPlay?: boolean;

  /** Interval in milliseconds between automatically displayed images. Defaults to 3000ms. */
  autoPlayInterval?: number;

  /** Callback invoked when the lightbox is closed. */
  onClose: () => void;
}

type Direction = "prev" | "next";

interface NavigationButtonProps {
  direction: Direction;
  pressed: boolean;
  onClick: () => void;
  onPressedChange: (pressed: boolean) => void;
}

function NavigationButton({ direction, pressed, onClick, onPressedChange }: NavigationButtonProps) {
  const isPrevious = direction === "prev";

  const style: CSSProperties = {
    position: "absolute",
    [isPrevious ? "left" : "right"]: "clamp(var(--ant-spacing-4), 3vw, var(--ant-spacing-12))",
    top: "50%",
    zIndex: "var(--ant-zIndex-raised)",
    width: "calc(var(--ant-spacing-16) - var(--ant-spacing-2))",
    height: "calc(var(--ant-spacing-16) - var(--ant-spacing-2))",
    minWidth: "calc(var(--ant-spacing-16) - var(--ant-spacing-2))",
    minHeight: "calc(var(--ant-spacing-16) - var(--ant-spacing-2))",
    padding: "var(--ant-spacing-0)",
    margin: "var(--ant-spacing-0)",
    borderRadius: "var(--ant-radius-full)",
    border: pressed
      ? "2px solid var(--ant-lightbox-accentActive)"
      : "2px solid var(--ant-lightbox-arrowBackground)",
    background: pressed
      ? "var(--ant-lightbox-accentActive)"
      : "var(--ant-lightbox-arrowBackground)",
    color: "var(--ant-lightbox-arrowColor)",
    fontSize: "var(--ant-typography-fontSize-3xl)",
    fontWeight: 700,
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: pressed
      ? "0 0 0 var(--ant-spacing-1) var(--ant-lightbox-accentGlow), var(--ant-shadow-lg)"
      : "var(--ant-shadow-lg)",
  };

  return (
    <motion.button
      type="button"
      aria-label={isPrevious ? "Previous image" : "Next image"}
      aria-pressed={pressed}
      onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onPressedChange(true);
      }}
      onPointerUp={(event: ReactPointerEvent<HTMLButtonElement>) => {
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
        backgroundColor: "var(--ant-lightbox-accentHover)",
        borderColor: "var(--ant-lightbox-accentHover)",
        color: "var(--ant-lightbox-arrowColor)",
        boxShadow:
          "0 0 0 var(--ant-spacing-1) var(--ant-lightbox-accentGlow), var(--ant-shadow-lg)",
      }}
      whileTap={{
        scale: 0.92,
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
          transform: isPrevious
            ? "translateX(calc(var(--ant-spacing-0) - 1px))"
            : "translateX(1px)",
          fontFamily: "var(--ant-typography-fontFamily-sans)",
          fontWeight: 700,
        }}
      >
        {isPrevious ? "‹" : "›"}
      </span>
    </motion.button>
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
function LightboxBase({
  src,
  alt = "Image",
  thumbnails = [],
  zoomEnabled = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onClose,
}: Omit<LightboxProps, "isOpen">) {
  const images = thumbnails.length > 0 ? thumbnails : [src];
  const initialIndex = Math.max(images.indexOf(src), 0);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [pressedButton, setPressedButton] = useState<Direction | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const currentImage = images[currentIndex];

  useEffect(() => {
    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

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
    goToImage((currentIndex + 1) % images.length, true);
  };

  const previousImage = () => {
    goToImage((currentIndex - 1 + images.length) % images.length, true);
  };

  useEffect(() => {
    if (!autoPlay || images.length <= 1 || isPaused || autoPlayInterval <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % images.length);
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
        setScale((previousScale) => Math.min(previousScale + 0.25, 3));
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        setIsPaused(true);
        setScale((previousScale) => Math.max(previousScale - 0.25, 1));
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
        const nextScale = previousScale - event.deltaY * 0.001;

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

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") {
      return;
    }

    touchStartXRef.current = event.clientX;
    touchStartYRef.current = event.clientY;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
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

    const deltaX = event.clientX - touchStartXRef.current;

    const deltaY = event.clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) {
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
        transition={{
          duration: 0.25,
        }}
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
          background: "var(--ant-lightbox-background)",
          touchAction: "none",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={`background-${currentImage}`}
            src={currentImage}
            alt=""
            aria-hidden="true"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            style={{
              position: "absolute",
              inset: "calc(var(--ant-spacing-2) * -1)",
              width: "calc(100% + var(--ant-spacing-4))",
              height: "calc(100% + var(--ant-spacing-4))",
              objectFit: "cover",
              filter: "blur(var(--ant-lightbox-backgroundBlur))",
              opacity: "var(--ant-lightbox-backgroundOpacity)",
              transform: "scale(1.04)",
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
            background: "var(--ant-lightbox-overlay)",
            pointerEvents: "auto",
          }}
        />

        <motion.div
          initial={{
            opacity: 0,
            y: -12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
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
              padding: "var(--ant-spacing-2) var(--ant-spacing-3)",
              borderRadius: "var(--ant-radius-full)",
              color: "var(--ant-lightbox-foreground)",
              background: "var(--ant-lightbox-glass)",
              border: "1px solid var(--ant-lightbox-border)",
              backdropFilter: "blur(var(--ant-lightbox-backgroundBlur))",
              fontSize: "var(--ant-typography-fontSize-xs)",
              fontWeight: "var(--ant-typography-fontWeight-semibold)",
              boxShadow: "var(--ant-lightbox-shadow)",
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
            whileTap={{
              scale: 0.9,
            }}
            style={{
              width: "var(--ant-spacing-10)",
              height: "var(--ant-spacing-10)",
              borderRadius: "var(--ant-radius-full)",
              border: "1px solid var(--ant-lightbox-border)",
              background: "var(--ant-lightbox-glass)",
              color: "var(--ant-lightbox-foreground)",
              backdropFilter: "blur(var(--ant-lightbox-backgroundBlur))",
              fontSize: "var(--ant-typography-fontSize-xl)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--ant-lightbox-shadow)",
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
            background: "var(--ant-lightbox-glass)",
            border: "1px solid var(--ant-lightbox-border)",
            backdropFilter: "blur(var(--ant-lightbox-backgroundBlur))",
            boxShadow: "var(--ant-lightbox-shadow)",
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

                setScale((previousScale) => (previousScale === 1 ? 2 : 1));
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
                touchAction: zoomEnabled && scale > 1 ? "none" : "pan-y",
                cursor: !zoomEnabled ? "default" : scale > 1 ? "grab" : "zoom-in",
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
              onPressedChange={(pressed) => setPressedButton(pressed ? "prev" : null)}
            />

            <NavigationButton
              direction="next"
              pressed={pressedButton === "next"}
              onClick={nextImage}
              onPressedChange={(pressed) => setPressedButton(pressed ? "next" : null)}
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
              background: "var(--ant-lightbox-glass)",
              border: "1px solid var(--ant-lightbox-border)",
              backdropFilter: "blur(var(--ant-lightbox-backgroundBlur))",
            }}
          >
            {images.map((image, index) => (
              <motion.button
                key={`${image}-${index}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-current={index === currentIndex ? "true" : undefined}
                onClick={() => {
                  goToImage(index, true);
                }}
                whileHover={{
                  scale: 1.06,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                style={{
                  padding: 0,
                  border:
                    index === currentIndex
                      ? "2px solid var(--ant-lightbox-accent)"
                      : "2px solid transparent",
                  background: "transparent",
                  borderRadius: "var(--ant-radius-md)",
                  cursor: "pointer",
                  opacity: index === currentIndex ? 1 : 0.55,
                  overflow: "hidden",
                  transition: "border-color 0.2s ease, opacity 0.2s ease",
                }}
              >
                <img
                  src={image}
                  alt=""
                  style={{
                    width: "calc(var(--ant-spacing-20) + var(--ant-spacing-2))",
                    height: "calc(var(--ant-spacing-12) - var(--ant-spacing-1))",
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
              onClick={(event: ReactMouseEvent<HTMLDivElement>) => event.stopPropagation()}
              style={{
                position: "absolute",
                bottom: "var(--ant-spacing-4)",
                zIndex: "var(--ant-zIndex-raised)",
                padding: "var(--ant-spacing-1) var(--ant-spacing-3)",
                borderRadius: "var(--ant-radius-full)",
                background: "var(--ant-lightbox-glass)",
                border: "1px solid var(--ant-lightbox-border)",
                backdropFilter: "blur(var(--ant-lightbox-backgroundBlur))",
                color: "var(--ant-lightbox-foreground)",
                fontSize: "var(--ant-typography-fontSize-xs)",
                fontWeight: "var(--ant-typography-fontWeight-medium)",
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

