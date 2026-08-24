"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Maximize2, ExternalLink, Sparkles, Layers } from "lucide-react";
import { SLIDES_DATA } from "../data/slidesData";

interface SplitShowcaseProps {
  onOpenPresentation: (index: number) => void;
}

export const SplitShowcase: React.FC<SplitShowcaseProps> = ({ onOpenPresentation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeSlide = SLIDES_DATA[selectedIndex];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
            Version 03 • Split Overview
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Executive Project Portfolio
          </h2>
        </div>
        <p className="text-sm text-slate-500 max-w-md">
          Explore comprehensive project breakdowns with live operational metrics and design documentation.
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Project Navigation List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-2 no-scrollbar">
          {SLIDES_DATA.map((slide, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={slide.id}
                onClick={() => setSelectedIndex(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? "bg-slate-900 text-white border-brand-orange shadow-lg scale-[1.01]"
                    : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                    isSelected ? "bg-brand-orange text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {slide.number}
                  </span>
                  <div>
                    <h4 className="text-base font-bold leading-tight group-hover:text-brand-orange transition-colors">
                      {slide.title}
                    </h4>
                    <p className={`text-xs mt-0.5 ${isSelected ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
                      {slide.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                  )}
                  <ArrowRight size={18} className={`transition-transform ${isSelected ? "translate-x-1 text-brand-orange" : "opacity-0 group-hover:opacity-100"}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Preview & Specs (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl"
            >
              {/* Media banner */}
              <div className="relative h-72 md:h-80 w-full overflow-hidden group">
                <Image
                  src={activeSlide.imageUrl}
                  alt={activeSlide.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-bold shadow">
                    {activeSlide.number} {activeSlide.category}
                  </span>
                </div>

                <button
                  onClick={() => onOpenPresentation(selectedIndex)}
                  className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-white/20 hover:bg-brand-orange text-white backdrop-blur-md border border-white/30 text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
                >
                  <Maximize2 size={14} /> Fullscreen Slide
                </button>
              </div>

              {/* Details & Metrics */}
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  {activeSlide.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {activeSlide.description}
                </p>

                {/* Metrics cards */}
                {activeSlide.metrics && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {activeSlide.metrics.map((m, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                        <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">{m.label}</p>
                        <p className="text-2xl font-black text-brand-orange">{m.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {activeSlide.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
