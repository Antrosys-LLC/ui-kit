import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Slideshow } from "./Slideshow";
import type { SlideData } from "./Slideshow";

const sampleSlides: SlideData[] = [
  {
    id: "welcome",
    title: "Antrosys Design System & UI Kit",
    content: (
      <div className="flex flex-col items-center gap-[var(--ant-spacing-4)] py-[var(--ant-spacing-4)]">
        <p className="max-w-2xl text-[var(--ant-color-surface-text-sub)]">
          An enterprise-ready design system built with accessible primitives,
          dynamic GSAP animations, and token-driven theming.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[var(--ant-spacing-2)] mt-[var(--ant-spacing-2)]">
          <span className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary)] text-[var(--ant-typography-fontSize-xs)] font-semibold">
            React 18+
          </span>
          <span className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary)] text-[var(--ant-typography-fontSize-xs)] font-semibold">
            GSAP Powered
          </span>
          <span className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary)] text-[var(--ant-typography-fontSize-xs)] font-semibold">
            WAI-ARIA A11y
          </span>
        </div>
      </div>
    ),
    notes:
      "Welcome the audience and introduce the core mission of Antrosys UI: unified design tokens, high performance, and accessible components.",
  },
  {
    id: "architecture",
    title: "Modular Component Architecture",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--ant-spacing-4)] text-left my-[var(--ant-spacing-4)] w-full">
        <div className="p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-surface-bg)] border border-[var(--ant-color-surface-border)] shadow-[var(--ant-shadow-sm)]">
          <div className="w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-neutral-0)] flex items-center justify-center font-bold mb-[var(--ant-spacing-3)]">
            01
          </div>
          <h3 className="font-semibold text-[var(--ant-typography-fontSize-md)] mb-[var(--ant-spacing-1)]">
            Token System
          </h3>
          <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)]">
            Single source of truth for colors, spacing, typography, and motion.
          </p>
        </div>

        <div className="p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-surface-bg)] border border-[var(--ant-color-surface-border)] shadow-[var(--ant-shadow-sm)]">
          <div className="w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-brand-accent)] text-[var(--ant-color-neutral-0)] flex items-center justify-center font-bold mb-[var(--ant-spacing-3)]">
            02
          </div>
          <h3 className="font-semibold text-[var(--ant-typography-fontSize-md)] mb-[var(--ant-spacing-1)]">
            GSAP Choreography
          </h3>
          <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)]">
            Hardware-accelerated micro-interactions and transitions with zero layout jank.
          </p>
        </div>

        <div className="p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-surface-bg)] border border-[var(--ant-color-surface-border)] shadow-[var(--ant-shadow-sm)]">
          <div className="w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-semantic-success)] text-[var(--ant-color-neutral-0)] flex items-center justify-center font-bold mb-[var(--ant-spacing-3)]">
            03
          </div>
          <h3 className="font-semibold text-[var(--ant-typography-fontSize-md)] mb-[var(--ant-spacing-1)]">
            Accessibility First
          </h3>
          <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)]">
            Keyboard focus rings, ARIA live regions, and reduced motion adaptations.
          </p>
        </div>
      </div>
    ),
    notes:
      "Highlight the three pillars of the architectural foundation: token consistency, GSAP-backed transitions, and strict a11y compliance.",
  },
  {
    id: "metrics",
    title: "Performance & Quality Metrics",
    content: (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--ant-spacing-4)] my-[var(--ant-spacing-4)] w-full">
        <div className="p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-surface-bg)] border border-[var(--ant-color-surface-border)]">
          <div className="text-[var(--ant-typography-fontSize-3xl)] font-extrabold text-[var(--ant-color-brand-primary)]">
            100%
          </div>
          <div className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] mt-[var(--ant-spacing-1)]">
            TypeScript Strict
          </div>
        </div>
        <div className="p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-surface-bg)] border border-[var(--ant-color-surface-border)]">
          <div className="text-[var(--ant-typography-fontSize-3xl)] font-extrabold text-[var(--ant-color-semantic-success)]">
            0
          </div>
          <div className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] mt-[var(--ant-spacing-1)]">
            A11y Violations
          </div>
        </div>
        <div className="p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-surface-bg)] border border-[var(--ant-color-surface-border)]">
          <div className="text-[var(--ant-typography-fontSize-3xl)] font-extrabold text-[var(--ant-color-brand-accent)]">
            60fps
          </div>
          <div className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] mt-[var(--ant-spacing-1)]">
            Smooth Transitions
          </div>
        </div>
        <div className="p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-surface-bg)] border border-[var(--ant-color-surface-border)]">
          <div className="text-[var(--ant-typography-fontSize-3xl)] font-extrabold text-[var(--ant-color-neutral-700)]">
            &lt;5kb
          </div>
          <div className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] mt-[var(--ant-spacing-1)]">
            Tree-Shakeable
          </div>
        </div>
      </div>
    ),
    notes:
      "Emphasize the strict quality benchmarks: 100% TypeScript coverage, zero Storybook a11y violations, and optimal bundle size.",
  },
  {
    id: "summary",
    title: "Ready to Present Anywhere",
    content: (
      <div className="flex flex-col items-center gap-[var(--ant-spacing-4)] py-[var(--ant-spacing-2)]">
        <p className="max-w-xl text-[var(--ant-color-surface-text-sub)]">
          Seamlessly switch to fullscreen mode with <kbd className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-0.5)] rounded-[var(--ant-radius-sm)] bg-[var(--ant-color-neutral-200)] font-mono text-[var(--ant-typography-fontSize-xs)]">F</kbd>,
          toggle speaker notes with <kbd className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-0.5)] rounded-[var(--ant-radius-sm)] bg-[var(--ant-color-neutral-200)] font-mono text-[var(--ant-typography-fontSize-xs)]">S</kbd>,
          or press <kbd className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-0.5)] rounded-[var(--ant-radius-sm)] bg-[var(--ant-color-neutral-200)] font-mono text-[var(--ant-typography-fontSize-xs)]">Ctrl/Cmd + P</kbd> for PDF export.
        </p>
        <div className="p-[var(--ant-spacing-3)] rounded-[var(--ant-radius-lg)] bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary)] text-[var(--ant-typography-fontSize-sm)] font-medium">
          Thank you for exploring Antrosys UI Kit!
        </div>
      </div>
    ),
    notes:
      "Wrap up the presentation by inviting questions from the team or audience.",
  },
];

const meta: Meta<typeof Slideshow> = {
  title: "Animation/Slideshow",
  component: Slideshow,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Slideshow>;

export const Default: Story = {
  args: {
    slides: sampleSlides,
    transition: "slide",
    showProgress: true,
    allowKeyboard: true,
  },
};

export const FadeTransition: Story = {
  args: {
    slides: sampleSlides,
    transition: "fade",
    showProgress: true,
  },
};

export const SlideTransition: Story = {
  args: {
    slides: sampleSlides,
    transition: "slide",
    showProgress: true,
  },
};

export const ZoomTransition: Story = {
  args: {
    slides: sampleSlides,
    transition: "zoom",
    showProgress: true,
  },
};

export const WithProgress: Story = {
  args: {
    slides: sampleSlides,
    showProgress: true,
  },
};

export const WithoutProgress: Story = {
  args: {
    slides: sampleSlides,
    showProgress: false,
  },
};

export const KeyboardNavigation: Story = {
  args: {
    slides: sampleSlides,
    allowKeyboard: true,
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="p-3 rounded-lg bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary)] text-sm">
        💡 <strong>Keyboard Shortcuts:</strong> Use <kbd className="px-1 py-0.5 bg-white rounded shadow-sm">←</kbd> / <kbd className="px-1 py-0.5 bg-white rounded shadow-sm">→</kbd> to navigate, <kbd className="px-1 py-0.5 bg-white rounded shadow-sm">Home</kbd> / <kbd className="px-1 py-0.5 bg-white rounded shadow-sm">End</kbd> to jump, <kbd className="px-1 py-0.5 bg-white rounded shadow-sm">F</kbd> for fullscreen, and <kbd className="px-1 py-0.5 bg-white rounded shadow-sm">S</kbd> for speaker notes.
      </div>
      <Slideshow {...args} />
    </div>
  ),
};

export const WithSpeakerNotes: Story = {
  args: {
    slides: sampleSlides,
    defaultNotesOpen: true,
  },
};

export const Fullscreen: Story = {
  args: {
    slides: sampleSlides,
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--ant-color-surface-text-sub)]">
        Click the fullscreen icon in the bottom-right toolbar or press <kbd className="px-1.5 py-0.5 bg-[var(--ant-color-neutral-200)] rounded text-xs">F</kbd> on your keyboard to enter presentation mode.
      </p>
      <Slideshow {...args} />
    </div>
  ),
};

export const PrintMode: Story = {
  args: {
    slides: sampleSlides,
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="p-3 rounded-lg bg-[var(--ant-color-neutral-100)] text-[var(--ant-color-neutral-700)] text-sm">
        🖨️ <strong>Print & PDF Export:</strong> Press <kbd className="px-1.5 py-0.5 bg-white rounded shadow-sm text-xs">Ctrl + P</kbd> or <kbd className="px-1.5 py-0.5 bg-white rounded shadow-sm text-xs">Cmd + P</kbd> to preview the browser print / Save as PDF layout.
      </div>
      <Slideshow {...args} />
    </div>
  ),
};

export const MultipleSlides: Story = {
  args: {
    slides: [
      ...sampleSlides,
      {
        id: "slide-5",
        title: "Code Integration Example",
        content: (
          <div className="text-left w-full max-w-xl mx-auto p-4 rounded-xl bg-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-100)] font-mono text-xs overflow-x-auto shadow-md">
            <pre>
              {`import { Slideshow } from "@antrosys/ui";

export function Presentation() {
  return (
    <Slideshow
      slides={slides}
      transition="slide"
      showProgress
      allowKeyboard
    />
  );
}`}
            </pre>
          </div>
        ),
        notes: "Walk through the straightforward import and JSX usage of Slideshow.",
      },
      {
        id: "slide-6",
        title: "Global Theme Synchronization",
        content: (
          <p className="text-[var(--ant-color-surface-text-sub)] max-w-lg">
            Adapts on the fly between Light and Dark mode using the standard
            Antrosys design tokens and custom properties.
          </p>
        ),
        notes: "Demonstrate theme adaptability across dark and light palettes.",
      },
    ],
  },
};

export const DarkTheme: Story = {
  args: {
    slides: sampleSlides,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const ReducedMotion: Story = {
  args: {
    slides: sampleSlides,
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--ant-color-surface-text-sub)]">
        When the user's OS has "Reduce motion" enabled, slide changes occur instantly without animation transitions.
      </p>
      <Slideshow {...args} />
    </div>
  ),
};

export const ControlledState: Story = {
  render: () => {
    const [current, setCurrent] = useState(0);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--ant-color-surface-text)] font-medium">
            Controlled Slide Index: {current + 1}
          </span>
          <button
            type="button"
            onClick={() => setCurrent(0)}
            className="px-2 py-1 text-xs rounded bg-[var(--ant-color-neutral-200)] text-[var(--ant-color-surface-text)]"
          >
            Go to First
          </button>
          <button
            type="button"
            onClick={() => setCurrent(sampleSlides.length - 1)}
            className="px-2 py-1 text-xs rounded bg-[var(--ant-color-neutral-200)] text-[var(--ant-color-surface-text)]"
          >
            Go to Last
          </button>
        </div>
        <Slideshow
          slides={sampleSlides}
          currentSlide={current}
          onSlideChange={setCurrent}
        />
      </div>
    );
  },
};
