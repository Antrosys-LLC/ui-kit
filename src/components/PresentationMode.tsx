"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, FileText, Grid, 
  Printer, Sparkles, Sliders, Monitor, Keyboard, CheckCircle2, ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { SLIDES_DATA, SlideItem } from "../data/slidesData";

interface PresentationModeProps {
  initialSlideIndex?: number;
  onClose: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  initialSlideIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transitionType, setTransitionType] = useState<"slide" | "fade" | "zoom" | "flip">("slide");
  const [showNotes, setShowNotes] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = SLIDES_DATA.length;
  const activeSlide = SLIDES_DATA[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % totalSlides;
      if (next === 0) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
      return next;
    });
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showHelp || showOverview) {
        if (e.key === "Escape") {
          setShowHelp(false);
          setShowOverview(false);
        }
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "Space":
        case "PageDown":
          e.preventDefault();
          handleNext();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          handlePrev();
          break;
        case "Home":
          setCurrentIndex(0);
          break;
        case "End":
          setCurrentIndex(totalSlides - 1);
          break;
        case "n":
        case "N":
          setShowNotes((prev) => !prev);
          break;
        case "o":
        case "O":
          setShowOverview((prev) => !prev);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "?":
          setShowHelp((prev) => !prev);
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, totalSlides, showHelp, showOverview, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Motion variants for slide transitions
  const getSlideVariants = () => {
    switch (transitionType) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case "zoom":
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 },
        };
      case "flip":
        return {
          initial: { opacity: 0, rotateY: 90 },
          animate: { opacity: 1, rotateY: 0 },
          exit: { opacity: 0, rotateY: -90 },
        };
      case "slide":
      default:
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -100 },
        };
    }
  };

  const variants = getSlideVariants();

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none print:bg-white print:text-black">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-30 print:hidden">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-sm font-bold tracking-wide uppercase text-slate-300">
            Presentation Mode
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* Transition Selector */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          {(["slide", "fade", "zoom", "flip"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTransitionType(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                transitionType === t
                  ? "bg-brand-orange text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-xl border transition-all ${
              isPlaying 
                ? "bg-brand-orange text-white border-brand-orange" 
                : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title={isPlaying ? "Pause Autoplay" : "Start Autoplay"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2 rounded-xl border transition-all ${
              showNotes 
                ? "bg-brand-orange text-white border-brand-orange" 
                : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title="Speaker Notes (Key: N)"
          >
            <FileText size={18} />
          </button>

          <button
            onClick={() => setShowOverview(true)}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Grid Overview (Key: O)"
          >
            <Grid size={18} />
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Export / Print PDF"
          >
            <Printer size={18} />
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard size={18} />
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1" />

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-all"
            title="Exit Presentation Mode (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center p-6 md:p-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative w-full max-w-6xl h-full max-h-[720px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row print:border-none print:shadow-none print:max-h-none print:h-auto"
          >
            {/* Visual Media Side */}
            <div className="relative w-full md:w-3/5 h-64 md:h-full">
              <Image
                src={activeSlide.imageUrl}
                alt={activeSlide.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 rounded-full text-xs font-black bg-brand-orange text-white shadow-lg tracking-wider">
                  {activeSlide.number}
                </span>
              </div>
            </div>

            {/* Slide Information & Details */}
            <div className="p-8 md:p-12 md:w-2/5 flex flex-col justify-between bg-slate-900/90 backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-brand-orange" />
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                    {activeSlide.category}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                  {activeSlide.title}
                </h2>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                  {activeSlide.description}
                </p>

                {/* Key Metrics */}
                {activeSlide.metrics && (
                  <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                    {activeSlide.metrics.map((m, idx) => (
                      <div key={idx}>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                          {m.label}
                        </p>
                        <p className="text-xl font-black text-brand-orange">
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {activeSlide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Slide {currentIndex + 1} of {totalSlides}
                </span>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 text-xs font-bold text-brand-orange hover:text-brand-orangeLight transition-colors"
                >
                  Next Project <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Side Floating Next/Prev Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-6 z-20 p-4 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-brand-orange transition-all hover:scale-110 shadow-xl"
          title="Previous Slide (←)"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-6 z-20 p-4 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-brand-orange transition-all hover:scale-110 shadow-xl"
          title="Next Slide (→)"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Speaker Notes Drawer */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-16 left-6 right-6 z-40 bg-slate-900/95 border border-brand-orange/40 rounded-2xl p-5 backdrop-blur-xl shadow-2xl max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-brand-orange" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Speaker Notes ({activeSlide.number})
                </span>
              </div>
              <button
                onClick={() => setShowNotes(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close (N)
              </button>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed font-sans">
              {activeSlide.speakerNotes}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview Grid Drawer (Key: O) */}
      <AnimatePresence>
        {showOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-slate-950/95 backdrop-blur-xl p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between max-w-6xl mx-auto mb-8">
              <div>
                <h2 className="text-2xl font-black text-white">Slide Overview Deck</h2>
                <p className="text-slate-400 text-sm">Click any slide thumbnail to jump directly</p>
              </div>
              <button
                onClick={() => setShowOverview(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold flex items-center gap-2"
              >
                <X size={18} /> Close Overview (Esc)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {SLIDES_DATA.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowOverview(false);
                  }}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 group ${
                    idx === currentIndex
                      ? "border-brand-orange ring-4 ring-brand-orange/40 scale-105"
                      : "border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-brand-orange text-white text-[10px] font-bold">
                      {slide.number}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900">
                    <p className="text-xs font-bold text-white truncate">{slide.title}</p>
                    <p className="text-[10px] text-slate-400">{slide.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <div 
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Keyboard size={18} className="text-brand-orange" />
                  <h3 className="text-lg font-bold text-white">Keyboard Navigation</h3>
                </div>
                <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-300">Next Slide</span>
                  <kbd className="px-2 py-1 bg-slate-800 text-brand-orange rounded font-mono text-xs">→ / Space</kbd>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-300">Previous Slide</span>
                  <kbd className="px-2 py-1 bg-slate-800 text-brand-orange rounded font-mono text-xs">←</kbd>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-300">Toggle Speaker Notes</span>
                  <kbd className="px-2 py-1 bg-slate-800 text-brand-orange rounded font-mono text-xs">N</kbd>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-300">Slide Overview Grid</span>
                  <kbd className="px-2 py-1 bg-slate-800 text-brand-orange rounded font-mono text-xs">O</kbd>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-300">Toggle Fullscreen</span>
                  <kbd className="px-2 py-1 bg-slate-800 text-brand-orange rounded font-mono text-xs">F</kbd>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-300">Exit Presentation</span>
                  <kbd className="px-2 py-1 bg-slate-800 text-brand-orange rounded font-mono text-xs">Esc</kbd>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Progress Bar */}
      <div className="w-full bg-slate-900 h-2 relative print:hidden">
        <motion.div
          className="bg-gradient-to-r from-brand-orange via-amber-500 to-rose-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>
    </div>
  );
};
