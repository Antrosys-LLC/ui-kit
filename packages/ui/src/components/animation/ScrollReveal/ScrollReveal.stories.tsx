import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ScrollReveal } from "./ScrollReveal";

const meta: Meta<typeof ScrollReveal> = {
  title: "Animation/ScrollReveal",
  component: ScrollReveal,
  tags: ["autodocs"],
  argTypes: {
    animation: {
      control: "select",
      options: [
        "fade-up",
        "fade-down",
        "fade-left",
        "fade-right",
        "zoom-in",
        "zoom-out",
        "flip",
        "flip-x",
        "flip-y",
        "blur-in",
        "rotate",
      ],
      description: "Animation preset",
    },
    delay: {
      control: { type: "number", min: 0, max: 2, step: 0.1 },
      description: "Initial delay in seconds",
    },
    duration: {
      control: { type: "number", min: 0.2, max: 3, step: 0.1 },
      description: "Animation duration in seconds",
    },
    distance: {
      control: { type: "number", min: 10, max: 150, step: 5 },
      description: "Travel distance in pixels",
    },
    once: {
      control: "boolean",
      description: "Trigger once or repeat on scroll re-entry",
    },
    cascade: {
      control: "boolean",
      description: "Stagger child elements",
    },
    stagger: {
      control: { type: "number", min: 0.05, max: 0.5, step: 0.05 },
      description: "Stagger delay between children",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollReveal>;

export const FadeUp: Story = {
  args: {
    animation: "fade-up",
    children: (
      <div className="p-8 rounded-xl bg-[var(--ant-color-surface-bg-card)] border border-[var(--ant-color-surface-border)] shadow-md max-w-md">
        <h3 className="text-xl font-bold text-[var(--ant-color-surface-text)]">
          Fade Up Animation
        </h3>
        <p className="mt-2 text-sm text-[var(--ant-color-surface-text-sub)]">
          Smooth upward translation and opacity fade triggered automatically when this component
          scrolls into viewport.
        </p>
      </div>
    ),
  },
};

export const FadeLeft: Story = {
  args: {
    animation: "fade-left",
    children: (
      <div className="p-8 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg max-w-md">
        <h3 className="text-xl font-bold">Slide From Right (Fade Left)</h3>
        <p className="mt-2 text-sm opacity-90">
          Perfect for side-by-side feature presentations and alternating callouts.
        </p>
      </div>
    ),
  },
};

export const ZoomIn: Story = {
  args: {
    animation: "zoom-in",
    duration: 0.9,
    children: (
      <div className="p-8 rounded-2xl bg-cyan-500 text-white shadow-xl max-w-md text-center">
        <div className="text-4xl mb-2">🚀</div>
        <h3 className="text-2xl font-black">Zoom In Entrance</h3>
        <p className="mt-2 text-sm opacity-90">
          Scales dynamically with an exponential dampening curve.
        </p>
      </div>
    ),
  },
};

export const Flip3D: Story = {
  args: {
    animation: "flip",
    duration: 1.0,
    children: (
      <div className="p-8 rounded-xl bg-neutral-900 text-white border border-neutral-700 shadow-2xl max-w-md">
        <span className="text-xs uppercase font-mono tracking-widest text-purple-400">
          3D Perspective
        </span>
        <h3 className="text-xl font-bold mt-2">Perspective Flip Card</h3>
        <p className="mt-2 text-sm text-neutral-400">
          Utilizes CSS 3D matrix transforms and perspective depth for futuristic interfaces.
        </p>
      </div>
    ),
  },
};

export const BlurIn: Story = {
  args: {
    animation: "blur-in",
    duration: 1.1,
    children: (
      <div className="p-8 rounded-xl bg-white border border-neutral-200 shadow-lg max-w-md">
        <h3 className="text-xl font-bold text-neutral-900">Blur-In Resolution</h3>
        <p className="mt-2 text-sm text-neutral-600">
          Starts with an ambient 16px blur filter and smoothly sharpens into view.
        </p>
      </div>
    ),
  },
};

export const StaggeredCardGrid: Story = {
  name: "Staggered Child Grid (Cascade)",
  args: {
    animation: "fade-up",
    cascade: true,
    stagger: 0.15,
    duration: 0.7,
    className: "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl",
    children: [
      <div key="1" className="p-6 rounded-xl bg-white border border-neutral-200 shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-3">
          1
        </div>
        <h4 className="font-bold text-neutral-900">Step One: Design Tokens</h4>
        <p className="text-xs text-neutral-500 mt-1">
          Unified source of truth for all styles and theme variables.
        </p>
      </div>,
      <div key="2" className="p-6 rounded-xl bg-white border border-neutral-200 shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold mb-3">
          2
        </div>
        <h4 className="font-bold text-neutral-900">Step Two: UI Components</h4>
        <p className="text-xs text-neutral-500 mt-1">
          Modular, accessible, and high-performance React primitives.
        </p>
      </div>,
      <div key="3" className="p-6 rounded-xl bg-white border border-neutral-200 shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-3">
          3
        </div>
        <h4 className="font-bold text-neutral-900">Step Three: Storybook</h4>
        <p className="text-xs text-neutral-500 mt-1">
          Interactive sandbox and visual regression testing.
        </p>
      </div>,
    ],
  },
};

export const RepeatOnScrollDemo: Story = {
  name: "Repeat Animation on Re-Entry",
  args: {
    animation: "fade-up",
    once: false,
    children: (
      <div className="p-8 rounded-xl bg-purple-900 text-white shadow-xl max-w-md">
        <h3 className="text-xl font-bold">Reversible Scroll Trigger</h3>
        <p className="mt-2 text-sm text-purple-200">
          Scroll past this element and back up to watch it reverse and re-trigger automatically.
        </p>
      </div>
    ),
  },
};
