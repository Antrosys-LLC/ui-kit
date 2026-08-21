import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export interface LightboxProps {
  src: string;
  alt?: string;
  thumbnails?: string[];
  zoomEnabled?: boolean;
  onClose: () => void;
}

export function Lightbox({
  src,
  alt = "Image",
  thumbnails = [],
  zoomEnabled = true,
  onClose,
}: LightboxProps) {
  const images = thumbnails.length > 0 ? thumbnails : [src];

  const initialIndex = Math.max(images.indexOf(src), 0);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [pressedButton, setPressedButton] = useState<
    "prev" | "next" | null
  >(null);

  const currentImage = images[currentIndex];

  /* ── Change image ─────────────────────────────────────────────── */

  const goToImage = (index: number, resume = true) => {
    setCurrentIndex(index);
    setScale(1);

    if (resume) {
      setIsPaused(false);
    }
  };

  const nextImage = () => {
    goToImage((currentIndex + 1) % images.length, true);
  };

  const previousImage = () => {
    goToImage(
      (currentIndex - 1 + images.length) % images.length,
      true,
    );
  };

  /* ── Automatic slider ────────────────────────────────────────── */

  useEffect(() => {
    if (images.length <= 1 || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setScale(1);
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [images.length, isPaused]);

  /* ── Keyboard controls ───────────────────────────────────────── */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowRight") {
        nextImage();
        return;
      }

      if (event.key === "ArrowLeft") {
        previousImage();
        return;
      }

      if (!zoomEnabled) {
        return;
      }

      if (event.key === "+" || event.key === "=") {
        setIsPaused(true);
        setScale((prev) => Math.min(prev + 0.25, 3));
      }

      if (event.key === "-") {
        setIsPaused(true);
        setScale((prev) => Math.max(prev - 0.25, 1));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomEnabled, onClose, currentIndex, images.length]);

  /* ── Mouse wheel zoom ────────────────────────────────────────── */

  const handleWheel = (event: React.WheelEvent) => {
    if (!zoomEnabled) {
      return;
    }

    event.preventDefault();
    setIsPaused(true);

    setScale((prev) => {
      const nextScale = prev - event.deltaY * 0.001;

      return Math.min(Math.max(nextScale, 1), 3);
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          overflow: "hidden",
          background: "var(--lightbox-background)",
        }}
      >
        {/* ── Dynamic blurred background ─────────────────────────── */}

        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              inset: "-20px",
              width: "calc(100% + 40px)",
              height: "calc(100% + 40px)",
              objectFit: "cover",
              filter:
                "blur(var(--lightbox-background-blur))",
              opacity:
                "var(--lightbox-background-opacity)",
              transform: "scale(1.04)",
              pointerEvents: "none",
            }}
          />
        </AnimatePresence>

        {/* ── Soft overlay ───────────────────────────────────────── */}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--lightbox-overlay)",
            pointerEvents: "none",
          }}
        />

        {/* ── Top bar ────────────────────────────────────────────── */}

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(event) => event.stopPropagation()}
          style={{
            position: "absolute",
            top: "1.25rem",
            left: "1.25rem",
            right: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 5,
          }}
        >
          {/* Counter */}

          <motion.div
            style={{
              padding: "0.45rem 0.8rem",
              borderRadius: "999px",
              color: "var(--lightbox-foreground)",
              background: "var(--lightbox-glass)",
              border:
                "1px solid var(--lightbox-border)",
              backdropFilter: "blur(12px)",
              fontSize: "0.8rem",
              fontWeight: 600,
              boxShadow:
                "0 8px 25px var(--lightbox-shadow)",
            }}
          >
            Image {currentIndex + 1} / {images.length}
          </motion.div>

          {/* Close */}

          <motion.button
            type="button"
            aria-label="Close image viewer"
            onClick={(event) => {
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
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "50%",
              border:
                "1px solid var(--lightbox-border)",
              background: "var(--lightbox-glass)",
              color: "var(--lightbox-foreground)",
              backdropFilter: "blur(12px)",
              fontSize: "1.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 8px 25px var(--lightbox-shadow)",
            }}
          >
            ×
          </motion.button>
        </motion.div>

        {/* ── Main image ─────────────────────────────────────────── */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          onClick={(event) => event.stopPropagation()}
          style={{
            position: "relative",
            zIndex: 2,
            padding: "0.5rem",
            borderRadius: "1rem",
            background:
              "var(--lightbox-glass)",
            border:
              "1px solid var(--lightbox-border)",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 25px 80px var(--lightbox-shadow)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={currentImage}
              alt={alt}
              drag={zoomEnabled && scale > 1}
              dragConstraints={{
                top: 200,
                bottom: 200,
                left: 200,
                right: 200,
              }}
              onWheel={handleWheel}
              onClick={() => {
                setIsPaused(true);
              }}
              onDoubleClick={() => {
                if (!zoomEnabled) {
                  return;
                }

                setIsPaused(true);

                setScale((prev) =>
                  prev === 1 ? 2 : 1,
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
                borderRadius: "0.75rem",
                userSelect: "none",
                touchAction: "none",
                cursor:
                  zoomEnabled && scale > 1
                    ? "grab"
                    : "zoom-in",
              }}
            />
          </AnimatePresence>
        </motion.div>

        {/* ── Previous button ────────────────────────────────────── */}

        {images.length > 1 && (
          <motion.button
            type="button"
            aria-label="Previous image"
            onMouseDown={() => {
              setPressedButton("prev");
            }}
            onMouseUp={() => {
              setPressedButton(null);
            }}
            onMouseLeave={() => {
              setPressedButton(null);
            }}
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            whileHover={{
              scale: 1.1,
              x: -4,
              borderColor:
                "var(--lightbox-blue)",
              boxShadow:
                "0 0 22px var(--lightbox-blue-glow)",
            }}
            whileTap={{
              scale: 0.94,
              y: -8,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 18,
            }}
            style={{
              position: "absolute",
              left: "calc(50% - 44vw)",
              top: "50%",
              zIndex: 4,
              width: "3.25rem",
              height: "3.25rem",
              borderRadius: "50%",

              border:
                pressedButton === "prev"
                  ? "2px solid var(--lightbox-blue-dark)"
                  : "2px solid var(--lightbox-arrow-bg)",

              background:
                pressedButton === "prev"
                  ? "var(--lightbox-blue-dark)"
                  : "var(--lightbox-arrow-bg)",

              color:
                "var(--lightbox-arrow-color)",

              fontSize: "2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              boxShadow:
                pressedButton === "prev"
                  ? "0 0 28px var(--lightbox-blue-glow)"
                  : "0 8px 30px var(--lightbox-shadow)",

              transition:
                "background 0.15s ease, border-color 0.15s ease",
            }}
          >
            ‹
          </motion.button>
        )}

        {/* ── Next button ────────────────────────────────────────── */}

        {images.length > 1 && (
          <motion.button
            type="button"
            aria-label="Next image"
            onMouseDown={() => {
              setPressedButton("next");
            }}
            onMouseUp={() => {
              setPressedButton(null);
            }}
            onMouseLeave={() => {
              setPressedButton(null);
            }}
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            whileHover={{
              scale: 1.1,
              x: 4,
              borderColor:
                "var(--lightbox-blue)",
              boxShadow:
                "0 0 22px var(--lightbox-blue-glow)",
            }}
            whileTap={{
              scale: 0.94,
              y: -8,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 18,
            }}
            style={{
              position: "absolute",
              right: "calc(50% - 44vw)",
              top: "50%",
              zIndex: 4,
              width: "3.25rem",
              height: "3.25rem",
              borderRadius: "50%",

              border:
                pressedButton === "next"
                  ? "2px solid var(--lightbox-blue-dark)"
                  : "2px solid var(--lightbox-arrow-bg)",

              background:
                pressedButton === "next"
                  ? "var(--lightbox-blue-dark)"
                  : "var(--lightbox-arrow-bg)",

              color:
                "var(--lightbox-arrow-color)",

              fontSize: "2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              boxShadow:
                pressedButton === "next"
                  ? "0 0 28px var(--lightbox-blue-glow)"
                  : "0 8px 30px var(--lightbox-shadow)",

              transition:
                "background 0.15s ease, border-color 0.15s ease",
            }}
          >
            ›
          </motion.button>
        )}

        {/* ── Thumbnails ─────────────────────────────────────────── */}

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
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              gap: "0.55rem",
              padding: "0.5rem",
              maxWidth: "90vw",
              overflowX: "auto",
              borderRadius: "0.85rem",
              background:
                "var(--lightbox-glass)",
              border:
                "1px solid var(--lightbox-border)",
              backdropFilter: "blur(12px)",
            }}
          >
            {images.map((image, index) => (
              <motion.button
                key={`${image}-${index}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setScale(1);
                  setIsPaused(false);
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
                      ? "2px solid var(--lightbox-accent)"
                      : "2px solid transparent",
                  background: "transparent",
                  borderRadius: "0.55rem",
                  cursor: "pointer",
                  opacity:
                    index === currentIndex
                      ? 1
                      : 0.55,
                  overflow: "hidden",
                  transition:
                    "border-color 0.2s ease, opacity 0.2s ease",
                }}
              >
                <img
                  src={image}
                  alt=""
                  style={{
                    width: "4.5rem",
                    height: "3.25rem",
                    display: "block",
                    objectFit: "cover",
                    borderRadius: "0.4rem",
                  }}
                />
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* ── Pause indicator ────────────────────────────────────── */}

        <AnimatePresence>
          {isPaused && (
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
              onClick={(event) =>
                event.stopPropagation()
              }
              style={{
                position: "absolute",
                bottom: "1rem",
                zIndex: 4,
                padding: "0.4rem 0.75rem",
                borderRadius: "999px",
                background:
                  "var(--lightbox-glass)",
                border:
                  "1px solid var(--lightbox-border)",
                backdropFilter: "blur(10px)",
                color:
                  "var(--lightbox-foreground)",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              Ⅱ Paused • Click Next / Previous to continue
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}