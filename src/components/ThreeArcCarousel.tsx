"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Maximize2, Sparkles, Layers, Info } from "lucide-react";
import { SLIDES_DATA, SlideItem } from "../data/slidesData";

interface ThreeArcCarouselProps {
  onSelectSlide?: (index: number) => void;
  onOpenPresentation?: (index: number) => void;
}

export const ThreeArcCarousel: React.FC<ThreeArcCarouselProps> = ({
  onSelectSlide,
  onOpenPresentation,
}) => {
  const [activeIndex, setActiveIndex] = useState(3); // Center around 3rd/4th item initially
  const [isHovered, setIsHovered] = useState(false);
  const [selectedModalSlide, setSelectedModalSlide] = useState<SlideItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Calculate 3D arc transform for each card index relative to active index
  const getCardTransform = (index: number) => {
    const total = SLIDES_DATA.length;
    // Calculate relative distance with circular wrapping
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const absDiff = Math.abs(diff);

    // Arc math parameters for smooth perspective curve matching the screenshot
    const radius = 620; // 3D arc radius
    const angleStep = 24; // Degrees separation per step
    const angleDeg = diff * angleStep;
    const angleRad = (angleDeg * Math.PI) / 180;

    // Position on 3D cylindrical arc
    const translateX = Math.sin(angleRad) * radius;
    const translateZ = (Math.cos(angleRad) - 1) * 380 - absDiff * 40;
    const rotateY = -angleDeg * 0.85; // Tilt inwards to create concave arc

    // Opacity and scale falloff
    const opacity = Math.max(0.35, 1 - absDiff * 0.18);
    const scale = Math.max(0.72, 1 - absDiff * 0.08);
    const zIndex = 100 - absDiff * 10;

    return {
      translateX,
      translateZ,
      rotateY,
      opacity,
      scale,
      zIndex,
      isCenter: diff === 0,
      diff,
    };
  };

  const activeSlide = SLIDES_DATA[activeIndex];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8 md:py-14 flex flex-col items-center select-none overflow-hidden">
      
      {/* Header Section - Exactly matching reference screenshot */}
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-orange font-bold text-sm md:text-base tracking-wide uppercase inline-block mb-2"
        >
          Slideshow Project
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-3"
        >
          Curious about other versions
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-6"
        >
          Explore multiple interactive component designs, 3D perspective carousels, and fullscreen presentation slide decks.
        </motion.p>

        {/* CTA Button matching reference image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full pl-5 pr-2 py-2 hover:shadow-md transition-all cursor-pointer group"
          onClick={() => onOpenPresentation && onOpenPresentation(activeIndex)}
        >
          <span className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200">
            See versions
          </span>
          <span className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowRight size={16} />
          </span>
        </motion.div>
      </div>

      {/* 3D Arc Curved Carousel Viewport */}
      <div 
        ref={containerRef}
        className="relative w-full h-[460px] md:h-[540px] perspective-container flex items-center justify-center my-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full preserve-3d flex items-center justify-center">
          {SLIDES_DATA.map((slide, idx) => {
            const transform = getCardTransform(idx);
            
            return (
              <motion.div
                key={slide.id}
                className="absolute cursor-pointer touch-none"
                animate={{
                  x: transform.translateX,
                  z: transform.translateZ,
                  rotateY: transform.rotateY,
                  opacity: transform.opacity,
                  scale: transform.scale,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 26,
                  mass: 0.9,
                }}
                style={{
                  zIndex: transform.zIndex,
                  width: "240px",
                  height: "370px",
                }}
                onClick={() => {
                  if (transform.isCenter) {
                    setSelectedModalSlide(slide);
                  } else {
                    setActiveIndex(idx);
                    if (onSelectSlide) onSelectSlide(idx);
                  }
                }}
              >
                {/* 3D Arc Card Container */}
                <div 
                  className={`relative w-full h-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 group border ${
                    transform.isCenter 
                      ? "ring-4 ring-brand-orange/60 border-brand-orange shadow-glow" 
                      : "border-slate-200/40 dark:border-slate-700/50"
                  }`}
                >
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 240px, 280px"
                    priority={Math.abs(transform.diff) <= 2}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Card Header Tag */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/40 backdrop-blur-md text-white border border-white/20">
                      {slide.number}
                    </span>
                    {transform.isCenter && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-orange text-white flex items-center gap-1 shadow">
                        <Sparkles size={10} /> Focus
                      </span>
                    )}
                  </div>

                  {/* Card Bottom Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[11px] font-medium text-brand-orangeLight uppercase tracking-wider mb-0.5">
                      {slide.category}
                    </p>
                    <h3 className="text-base font-bold leading-tight drop-shadow-sm">
                      {slide.title}
                    </h3>
                  </div>

                  {/* Quick Expand Button on Center Hover */}
                  {transform.isCenter && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModalSlide(slide);
                      }}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      title="Inspect Details"
                    >
                      <Info size={22} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Floating Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-6 z-50 w-12 h-12 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg text-slate-800 dark:text-white flex items-center justify-center hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange transition-all hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 md:right-6 z-50 w-12 h-12 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg text-slate-800 dark:text-white flex items-center justify-center hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange transition-all hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Step Markers Underneath - Directly matching reference screenshot (#01, #02, #03, #04) */}
      <div className="w-full max-w-4xl mt-2 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 py-4 border-t border-slate-200/80 dark:border-slate-800">
          {SLIDES_DATA.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setActiveIndex(idx);
                  if (onSelectSlide) onSelectSlide(idx);
                }}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                  isActive 
                    ? "bg-slate-100 dark:bg-slate-800 scale-105 font-bold text-slate-900 dark:text-white" 
                    : "opacity-60 hover:opacity-100 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className={`text-xs md:text-sm font-black mb-0.5 ${isActive ? "text-brand-orange" : "text-slate-500"}`}>
                  {slide.number}
                </span>
                <span className="text-[11px] md:text-xs font-semibold leading-tight line-clamp-1">
                  {slide.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="flex items-center gap-4 mt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-full shadow-lg">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Slide <strong className="text-slate-900 dark:text-white">{activeIndex + 1}</strong> of {SLIDES_DATA.length}
        </span>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />

        <button
          onClick={() => onOpenPresentation && onOpenPresentation(activeIndex)}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:underline"
        >
          <Maximize2 size={14} /> Fullscreen Presentation Mode
        </button>
      </div>

      {/* Detail Inspector Modal for Selected Card */}
      <AnimatePresence>
        {selectedModalSlide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedModalSlide(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                <Image
                  src={selectedModalSlide.imageUrl}
                  alt={selectedModalSlide.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                  {selectedModalSlide.number}
                </div>
              </div>

              <div className="p-6 md:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
                    {selectedModalSlide.category}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 mb-3">
                    {selectedModalSlide.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                    {selectedModalSlide.description}
                  </p>

                  {selectedModalSlide.metrics && (
                    <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                      {selectedModalSlide.metrics.map((m, i) => (
                        <div key={i}>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{m.label}</p>
                          <p className="text-base font-bold text-brand-orange">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {selectedModalSlide.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const idx = SLIDES_DATA.findIndex((s) => s.id === selectedModalSlide.id);
                      setSelectedModalSlide(null);
                      if (onOpenPresentation) onOpenPresentation(idx >= 0 ? idx : 0);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-brand-orange text-white font-semibold text-sm hover:bg-brand-orangeLight transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <Maximize2 size={16} /> Present Deck
                  </button>
                  <button
                    onClick={() => setSelectedModalSlide(null)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
