"use client";

import React from "react";
import { Layers, Maximize2, Columns, Sun, Moon, Sparkles } from "lucide-react";

export type ComponentVersion = "v1-3d" | "v2-presentation" | "v3-split";

interface VersionBarProps {
  activeVersion: ComponentVersion;
  onVersionChange: (version: ComponentVersion) => void;
  onLaunchPresentation: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const VersionBar: React.FC<VersionBarProps> = ({
  activeVersion,
  onVersionChange,
  onLaunchPresentation,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        


        {/* Version Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => onVersionChange("v1-3d")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeVersion === "v1-3d"
                ? "bg-brand-orange text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers size={14} /> Version 1 (3D Arc Carousel)
          </button>

          <button
            onClick={onLaunchPresentation}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Maximize2 size={14} /> Version 2 (Fullscreen Deck)
          </button>

          <button
            onClick={() => onVersionChange("v3-split")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeVersion === "v3-split"
                ? "bg-brand-orange text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Columns size={14} /> Version 3 (Split Overview)
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Toggle Dark/Light Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={onLaunchPresentation}
            className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orangeLight text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Maximize2 size={14} /> Present Deck
          </button>
        </div>

      </div>
    </div>
  );
};
