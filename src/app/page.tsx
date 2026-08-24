"use client";

import React, { useState, useEffect } from "react";
import { VersionBar, ComponentVersion } from "@/components/VersionBar";
import { ThreeArcCarousel } from "@/components/ThreeArcCarousel";
import { PresentationMode } from "@/components/PresentationMode";
import { SplitShowcase } from "@/components/SplitShowcase";
import { Sparkles, Layers, Sliders, ExternalLink, Code2 } from "lucide-react";

export default function Home() {
  const [activeVersion, setActiveVersion] = useState<ComponentVersion>("v1-3d");
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [presentationStartIndex, setPresentationStartIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync dark class on html & body tags
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleOpenPresentation = (index: number = 0) => {
    setPresentationStartIndex(index);
    setIsPresentationOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Top Version Selector Bar */}
      <VersionBar
        activeVersion={activeVersion}
        onVersionChange={setActiveVersion}
        onLaunchPresentation={() => handleOpenPresentation(0)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Active View */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {activeVersion === "v1-3d" && (
          <ThreeArcCarousel
            onSelectSlide={(idx) => setPresentationStartIndex(idx)}
            onOpenPresentation={handleOpenPresentation}
          />
        )}

        {activeVersion === "v3-split" && (
          <SplitShowcase onOpenPresentation={handleOpenPresentation} />
        )}
      </main>

      {/* Fullscreen Presentation Deck Overlay */}
      {isPresentationOpen && (
        <PresentationMode
          initialSlideIndex={presentationStartIndex}
          onClose={() => setIsPresentationOpen(false)}
        />
      )}

      {/* Footer & Specs */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            {/* Clean footer */}
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Code2 size={14} /> Next.js 15 • Tailwind CSS • Framer Motion
            </span>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => handleOpenPresentation(0)}
              className="text-brand-orange hover:underline font-bold"
            >
              Launch Fullscreen Deck →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
