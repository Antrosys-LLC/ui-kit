import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ParallaxSection } from "./ParallaxSection";

interface StoryCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}

const StoryCard: React.FC<StoryCardProps> = ({
  title,
  description,
  children,
  className = "",
  hint,
}) => (
  <div
    className={`flex flex-col gap-[var(--ant-spacing-4)] p-[var(--ant-spacing-6)] bg-[var(--ant-color-neutral-0)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)] rounded-[var(--ant-radius-2xl)] border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] shadow-[var(--ant-shadow-sm)] w-full max-w-[calc(var(--ant-spacing-24)*8.5)] ${className}`}
  >
    {(title || description) && (
      <div className="flex flex-col gap-[var(--ant-spacing-1)]">
        {title && (
          <h3 className="text-[var(--ant-typography-fontSize-sm)] font-[var(--ant-typography-fontWeight-semibold)] uppercase tracking-wider text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] m-[var(--ant-spacing-0)]">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] m-[var(--ant-spacing-0)]">
            {description}
          </p>
        )}
      </div>
    )}
    <div className="flex flex-col items-center w-full">
      {children}
    </div>
    {hint && (
      <div className="flex items-center justify-center gap-[var(--ant-spacing-2)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] pt-[var(--ant-spacing-2)] border-t border-[var(--ant-color-neutral-100)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)]">
        <span>{hint}</span>
      </div>
    )}
  </div>
);

const meta = {
  title: "Animation/ParallaxSection",
  component: ParallaxSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    layers: {
      control: false,
      description: "Array of parallax depth layers",
    },
    speed: {
      control: "number",
      description: "Global parallax speed multiplier across all layers",
    },
    mouseTilt: {
      control: "boolean",
      description: "Toggle interactive 3D mouse tracking tilt effect",
    },
    smoothScroll: {
      control: "boolean",
      description: "Enable Lenis smooth-scroll integration with ScrollTrigger",
    },
  },
  args: {
    speed: 1,
    mouseTilt: false,
    smoothScroll: false,
  },
} satisfies Meta<typeof ParallaxSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 1. Default
 * Minimal monochrome centered composition with background geometry gliding behind foreground card.
 */
export const Default: Story = {
  render: () => (
    <div className="w-full min-h-[105vh] pt-[var(--ant-spacing-8)] pb-[calc(var(--ant-spacing-24)*2.5)] flex flex-col items-center justify-start">
      <StoryCard
        title="Default Parallax"
        description="Centered foreground card with multi-plane depth gliding smoothly during document scroll"
        hint="Scroll down to witness background depth movement"
      >
        <div className="w-full h-[calc(var(--ant-spacing-24)*4.5)] rounded-[var(--ant-radius-xl)] overflow-hidden border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] bg-[var(--ant-color-neutral-50)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)] relative flex items-center justify-center">
          <ParallaxSection
            speed={1}
            className="h-full w-full bg-transparent"
            layers={[
              {
                id: "default-bg-geometry",
                speed: 0.25,
                children: (
                  <div className="w-full h-full flex items-center justify-center pointer-events-none">
                    <div className="w-[calc(var(--ant-spacing-24)*3.6)] h-[calc(var(--ant-spacing-24)*3.6)] rounded-[var(--ant-radius-full)] border border-[var(--ant-color-neutral-300)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] opacity-40 flex items-center justify-center">
                      <div className="w-[calc(var(--ant-spacing-24)*2.4)] h-[calc(var(--ant-spacing-24)*2.4)] rounded-[var(--ant-radius-full)] border border-dashed border-[var(--ant-color-neutral-300)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] opacity-50" />
                    </div>
                  </div>
                ),
              },
            ]}
          >
            <div className="w-full h-full flex items-center justify-center p-[var(--ant-spacing-6)] pointer-events-none">
              <div className="p-[var(--ant-spacing-8)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-0)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)] border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] shadow-[var(--ant-shadow-md)] max-w-[calc(var(--ant-spacing-24)*4)] text-center flex flex-col items-center gap-[var(--ant-spacing-2)] pointer-events-auto">
                <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-medium)] tracking-widest uppercase text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] m-[var(--ant-spacing-0)]">
                  PARALLAX SECTION
                </span>
                <h2 className="text-[var(--ant-typography-fontSize-xl)] font-[var(--ant-typography-fontWeight-bold)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] tracking-tight m-[var(--ant-spacing-0)]">
                  Spatial Motion
                </h2>
                <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] leading-relaxed m-[var(--ant-spacing-0)]">
                  Hardware-accelerated depth transforms scrubbed smoothly against document scroll.
                </p>
              </div>
            </div>
          </ParallaxSection>
        </div>
      </StoryCard>
    </div>
  ),
};

/**
 * 2. MultipleLayers
 * Non-overlapping 3-plane spatial composition with distinct velocities and visible counter-scroll.
 * Corners and center are strictly separated to guarantee zero visual collisions.
 */
export const MultipleLayers: Story = {
  render: () => (
    <div className="w-full min-h-[140vh] pt-[var(--ant-spacing-8)] pb-[calc(var(--ant-spacing-24)*5)] flex flex-col items-center justify-start">
      <StoryCard
        title="Multi-Layer Velocity Composition"
        description="Three non-overlapping depth planes demonstrating opposing counter-scroll and forward velocities"
        hint="Scroll to observe: Counter-Scroll glides upward while forward planes glide downward"
      >
        <div className="w-full h-[calc(var(--ant-spacing-24)*4.5)] rounded-[var(--ant-radius-xl)] overflow-hidden border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] bg-[var(--ant-color-neutral-50)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)] relative flex items-center justify-center">
          <ParallaxSection
            speed={1}
            className="h-full w-full bg-transparent"
            layers={[
              {
                id: "multi-counter-plane",
                speed: -0.5,
                zIndex: 2,
                children: (
                  <div className="w-full h-full flex items-center justify-start pl-[var(--ant-spacing-8)] pointer-events-none">
                    <div className="px-[var(--ant-spacing-4)] py-[var(--ant-spacing-2.5)] rounded-[var(--ant-radius-lg)] bg-[var(--ant-color-neutral-0)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-800)] [.dark_&]:bg-[var(--ant-color-neutral-800)] border border-[var(--ant-color-neutral-300)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-700)] [.dark_&]:border-[var(--ant-color-neutral-700)] shadow-[var(--ant-shadow-sm)] flex items-center gap-[var(--ant-spacing-2)] pointer-events-auto">
                      <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-bold)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)]">
                        ↑ Counter-Scroll (-0.5x)
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                id: "multi-slow-plane",
                speed: 0.35,
                zIndex: 2,
                children: (
                  <div className="w-full h-full flex items-center justify-end pr-[var(--ant-spacing-8)] -translate-y-[calc(var(--ant-spacing-20))] pointer-events-none">
                    <div className="px-[var(--ant-spacing-4)] py-[var(--ant-spacing-2.5)] rounded-[var(--ant-radius-lg)] bg-[var(--ant-color-neutral-0)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-800)] [.dark_&]:bg-[var(--ant-color-neutral-800)] border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-700)] [.dark_&]:border-[var(--ant-color-neutral-700)] shadow-[var(--ant-shadow-sm)] flex items-center gap-[var(--ant-spacing-2)] pointer-events-auto">
                      <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-medium)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-300)] [.dark_&]:text-[var(--ant-color-neutral-300)]">
                        ↓ Slow Motion (+0.35x)
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                id: "multi-fast-plane",
                speed: 0.9,
                zIndex: 2,
                children: (
                  <div className="w-full h-full flex items-center justify-end pr-[var(--ant-spacing-8)] translate-y-[calc(var(--ant-spacing-20))] pointer-events-none">
                    <div className="px-[var(--ant-spacing-4)] py-[var(--ant-spacing-2.5)] rounded-[var(--ant-radius-lg)] bg-[var(--ant-color-neutral-0)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-800)] [.dark_&]:bg-[var(--ant-color-neutral-800)] border border-[var(--ant-color-neutral-300)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-700)] [.dark_&]:border-[var(--ant-color-neutral-700)] shadow-[var(--ant-shadow-sm)] flex items-center gap-[var(--ant-spacing-2)] pointer-events-auto">
                      <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-semibold)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)]">
                        ↓↓ Fast Motion (+0.9x)
                      </span>
                    </div>
                  </div>
                ),
              },
            ]}
          >
            <div className="w-full h-full flex items-center justify-center p-[var(--ant-spacing-6)] pointer-events-none">
              <div className="p-[var(--ant-spacing-6)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-0)]/95 [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)]/95 [.dark_&]:bg-[var(--ant-color-neutral-900)]/95 border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] shadow-[var(--ant-shadow-md)] text-center flex flex-col items-center gap-[var(--ant-spacing-2)] max-w-[calc(var(--ant-spacing-24)*3.2)] pointer-events-auto">
                <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-medium)] tracking-widest uppercase text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] m-[var(--ant-spacing-0)]">
                  MULTI-VELOCITY
                </span>
                <h4 className="text-[var(--ant-typography-fontSize-lg)] font-[var(--ant-typography-fontWeight-bold)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] m-[var(--ant-spacing-0)]">
                  Opposing Vectors
                </h4>
                <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] leading-relaxed m-[var(--ant-spacing-0)]">
                  Independent velocity planes scrub concurrently in forward and reverse directions.
                </p>
              </div>
            </div>
          </ParallaxSection>
        </div>
      </StoryCard>
    </div>
  ),
};

/**
 * 3. MouseTilt
 * Single clean centered card with responsive 3D perspective tilt.
 */
export const MouseTilt: Story = {
  render: () => (
    <div className="w-full min-h-[105vh] pt-[var(--ant-spacing-8)] pb-[calc(var(--ant-spacing-24)*2.5)] flex flex-col items-center justify-start">
      <StoryCard
        title="Interactive 3D Tilt"
        description="Responsive 3D perspective rotation tracking mouse cursor coordinates"
        hint="Hover across the container: surface tilts in 3D perspective and smoothly resets on leave"
      >
        <div className="w-full h-[calc(var(--ant-spacing-24)*4.5)] rounded-[var(--ant-radius-xl)] overflow-hidden border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] bg-[var(--ant-color-neutral-50)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)] relative flex items-center justify-center cursor-crosshair">
          <ParallaxSection
            mouseTilt={{ max: 18, perspective: 800 }}
            speed={0.4}
            className="h-full w-full bg-transparent"
            layers={[
              {
                id: "tilt-card-surface",
                mouseTilt: 1.4,
                speed: 0.5,
                children: (
                  <div className="w-full h-full flex items-center justify-center p-[var(--ant-spacing-6)]">
                    <div className="p-[var(--ant-spacing-8)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-0)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)] border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] shadow-[var(--ant-shadow-lg)] flex flex-col items-center gap-[var(--ant-spacing-2)] text-center max-w-[calc(var(--ant-spacing-24)*4)]">
                      <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-medium)] uppercase tracking-widest text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] m-[var(--ant-spacing-0)]">
                        3D PERSPECTIVE
                      </span>
                      <h4 className="text-[var(--ant-typography-fontSize-xl)] font-[var(--ant-typography-fontWeight-bold)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] m-[var(--ant-spacing-0)]">
                        Interactive Mouse Tilt
                      </h4>
                      <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] leading-relaxed m-[var(--ant-spacing-0)]">
                        Two-tier DOM architecture decouples 3D cursor tracking rotations from scroll translation.
                      </p>
                      <span className="mt-[var(--ant-spacing-2)] px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)]">
                        Hover across surface
                      </span>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </StoryCard>
    </div>
  ),
};

/**
 * 4. SmoothScroll
 * Clean minimal composition demonstrating Lenis smooth scrolling integration.
 */
export const SmoothScroll: Story = {
  render: () => (
    <div className="w-full min-h-[105vh] pt-[var(--ant-spacing-8)] pb-[calc(var(--ant-spacing-24)*2.5)] flex flex-col items-center justify-start">
      <StoryCard
        title="Smooth Scroll Integration"
        description="Inertial scroll physics calculated by Lenis and synchronized with GSAP ScrollTrigger updates"
        hint="Scroll with mouse wheel or trackpad to feel smooth momentum damping"
      >
        <div className="w-full h-[calc(var(--ant-spacing-24)*4.5)] rounded-[var(--ant-radius-xl)] overflow-hidden border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] bg-[var(--ant-color-neutral-50)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)] relative flex items-center justify-center">
          <ParallaxSection
            smoothScroll={true}
            speed={1.2}
            className="h-full w-full bg-transparent"
            layers={[
              {
                id: "smooth-bg-frame",
                speed: 0.35,
                children: (
                  <div className="w-full h-full flex items-center justify-center pointer-events-none">
                    <div className="w-[calc(var(--ant-spacing-24)*4.2)] h-[calc(var(--ant-spacing-24)*2.6)] rounded-[var(--ant-radius-2xl)] border border-[var(--ant-color-neutral-300)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] opacity-30" />
                  </div>
                ),
              },
            ]}
          >
            <div className="w-full h-full flex items-center justify-center p-[var(--ant-spacing-6)]">
              <div className="p-[var(--ant-spacing-8)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-0)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)] border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] shadow-[var(--ant-shadow-md)] max-w-[calc(var(--ant-spacing-24)*4)] text-center flex flex-col items-center gap-[var(--ant-spacing-2)]">
                <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-medium)] uppercase tracking-widest text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] m-[var(--ant-spacing-0)]">
                  INERTIAL SCROLL
                </span>
                <h2 className="text-[var(--ant-typography-fontSize-xl)] font-[var(--ant-typography-fontWeight-bold)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] tracking-tight m-[var(--ant-spacing-0)]">
                  Lenis Momentum
                </h2>
                <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] leading-relaxed m-[var(--ant-spacing-0)]">
                  ScrollTrigger updates smoothly on every Lenis scroll tick, providing fluid momentum without jitter.
                </p>
                <span className="mt-[var(--ant-spacing-2)] px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)]">
                  Lerp: 0.1 · 60 FPS
                </span>
              </div>
            </div>
          </ParallaxSection>
        </div>
      </StoryCard>
    </div>
  ),
};

/**
 * 5. HeroSection
 * Premium minimal black-and-white hero section with clear typography, subtle depth, and clean CTAs.
 */
export const HeroSection: Story = {
  render: () => (
    <div className="w-full min-h-[105vh] pt-[var(--ant-spacing-8)] pb-[calc(var(--ant-spacing-24)*2.5)] flex flex-col items-center justify-start">
      <StoryCard
        title="Hero Section"
        description="Premium monochrome hero layout with multi-plane depth and subtle 3D interactive tilt"
        hint="Scroll to inspect depth separation · Hover to experience subtle 3D tilt"
      >
        <div className="w-full h-[calc(var(--ant-spacing-24)*4.8)] rounded-[var(--ant-radius-xl)] overflow-hidden border border-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] bg-[var(--ant-color-neutral-50)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)] relative flex items-center justify-center">
          <ParallaxSection
            speed={0.85}
            mouseTilt={{ max: 12, perspective: 1000 }}
            className="h-full w-full bg-transparent"
            layers={[
              {
                id: "hero-bg-frame",
                speed: 0.2,
                mouseTilt: 0.3,
                children: (
                  <div className="w-full h-full flex items-center justify-center pointer-events-none">
                    <div className="w-[calc(var(--ant-spacing-24)*5.2)] h-[calc(var(--ant-spacing-24)*3.2)] rounded-[var(--ant-radius-2xl)] border border-[var(--ant-color-neutral-300)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-800)] [.dark_&]:border-[var(--ant-color-neutral-800)] opacity-30" />
                  </div>
                ),
              },
            ]}
          >
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-[var(--ant-spacing-8)] gap-[var(--ant-spacing-3)] max-w-[calc(var(--ant-spacing-24)*4.5)] mx-auto pointer-events-none">
              <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-medium)] tracking-widest uppercase text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] m-[var(--ant-spacing-0)]">
                UI KIT ANIMATION
              </span>
              <h2 className="text-[var(--ant-typography-fontSize-2xl)] font-[var(--ant-typography-fontWeight-bold)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] tracking-tight leading-tight m-[var(--ant-spacing-0)]">
                Immersive Interfaces
              </h2>
              <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] leading-relaxed max-w-[calc(var(--ant-spacing-24)*3.8)] m-[var(--ant-spacing-0)]">
                Decoupled scroll parallax and 3D interactive physics built for high-performance applications.
              </p>
              <div className="flex items-center gap-[var(--ant-spacing-3)] pt-[var(--ant-spacing-2)] pointer-events-auto">
                <button
                  type="button"
                  style={{ color: "var(--ant-color-neutral-0)" }}
                  className="px-[var(--ant-spacing-5)] py-[var(--ant-spacing-2)] rounded-[var(--ant-radius-lg)] bg-[var(--ant-color-neutral-900)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-0)] [.dark_&]:bg-[var(--ant-color-neutral-0)] [[data-theme=dark]_&]:!text-[var(--ant-color-neutral-900)] [.dark_&]:!text-[var(--ant-color-neutral-900)] text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-semibold)] shadow-[var(--ant-shadow-sm)] cursor-pointer"
                >
                  Get Started
                </button>
                <button
                  type="button"
                  className="px-[var(--ant-spacing-5)] py-[var(--ant-spacing-2)] rounded-[var(--ant-radius-lg)] bg-transparent border border-[var(--ant-color-neutral-300)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-700)] [.dark_&]:border-[var(--ant-color-neutral-700)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-200)] [.dark_&]:text-[var(--ant-color-neutral-200)] text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-semibold)] cursor-pointer"
                >
                  Documentation
                </button>
              </div>
            </div>
          </ParallaxSection>
        </div>
      </StoryCard>
    </div>
  ),
};
