import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GradientMeshBackground } from "./GradientMeshBackground";

const meta: Meta<typeof GradientMeshBackground> = {
  title: "Animation/GradientMeshBackground",
  component: GradientMeshBackground,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["conic", "mesh", "blobs", "radial"],
      description: "Rendering engine mode (conic, 3D mesh, blobs, radial)",
    },
    speed: {
      control: { type: "range", min: 0, max: 3, step: 0.1 },
      description: "Animation speed multiplier (0 = static)",
    },
    blur: {
      control: "text",
      description: "CSS blur intensity in pixels or string (e.g. 50, '40px')",
    },
    interactive: {
      control: "boolean",
      description: "React to pointer position across the container",
    },
    intensity: {
      control: { type: "range", min: 0.2, max: 2.5, step: 0.1 },
      description: "Wave elevation factor for 3D mesh mode",
    },
    grain: {
      control: "boolean",
      description: "Add a subtle film grain noise texture",
    },
    wireframe: {
      control: "boolean",
      description: "Wireframe mesh rendering for 3D mode",
    },
  },
};

export default meta;
type Story = StoryObj<typeof GradientMeshBackground>;

/**
 * 1. Default Lightweight Conic Mode
 */
export const Default: Story = {
  args: {
    type: "conic",
    speed: 1,
    interactive: true,
    grain: false,
  },
  render: (args) => (
    <div className="w-full h-[500px]">
      <GradientMeshBackground {...args}>
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <span className="inline-flex items-center px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-[var(--ant-color-surface-bg-card)]/80 text-[var(--ant-color-brand-primary)] shadow-sm backdrop-blur-md">
            CSS Conic Mode (Default)
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--ant-color-surface-text)] mb-3">
            Fluid Gradient Backgrounds
          </h1>
          <p className="max-w-xl text-sm md:text-base text-[var(--ant-color-surface-text-sub)]">
            Ultra-lightweight, 60fps CSS conic gradient animation powered by Antrosys design tokens.
          </p>
        </div>
      </GradientMeshBackground>
    </div>
  ),
};

/**
 * 2. Three.js 3D WebGL Shader Mesh Mode
 * Inspired by shadergradient.co with fluid 3D organic color blobs.
 */
export const ThreeJsMesh: Story = {
  args: {
    type: "mesh",
    speed: 1,
    intensity: 1.2,
    interactive: true,
    grain: true,
  },
  render: (args) => (
    <div className="w-full h-[550px]">
      <GradientMeshBackground {...args}>
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <span className="inline-flex items-center px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-white/20 text-white shadow-sm backdrop-blur-md border border-white/30">
            Three.js 3D Shader Mesh
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-4">
            Organic 3D Deformation
          </h1>
          <p className="max-w-lg text-white/90 text-sm md:text-base drop-shadow">
            Move your mouse across the canvas to interact with the vertex elevation waves in real
            time.
          </p>
        </div>
      </GradientMeshBackground>
    </div>
  ),
};

/**
 * 3. Fluid Organic Color Blobs
 */
export const OrganicBlobs: Story = {
  args: {
    type: "blobs",
    speed: 1,
    blur: 60,
    interactive: true,
  },
  render: (args) => (
    <div className="w-full h-[500px]">
      <GradientMeshBackground {...args}>
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--ant-color-surface-text)] mb-2">
            Morphing Radial Blobs
          </h2>
          <p className="max-w-md text-sm text-[var(--ant-color-surface-text-sub)]">
            Four fluid blobs floating organically with cursor reaction and heavy Gaussian blur.
          </p>
        </div>
      </GradientMeshBackground>
    </div>
  ),
};

/**
 * 4. Custom Color Palette (Sunset / Neon Glow)
 */
export const CustomColors: Story = {
  args: {
    type: "conic",
    speed: 1.2,
    colors: ["#F43F5E", "#FB923C", "#FBBF24", "#A855F7", "#6366F1"],
    interactive: true,
  },
  render: (args) => (
    <div className="w-full h-[500px]">
      <GradientMeshBackground {...args}>
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow mb-2">Sunset Glow Palette</h2>
          <p className="max-w-md text-sm text-white/90 drop-shadow">
            Pass any custom array of hex, rgb, or CSS token variables to customize the ambiance.
          </p>
        </div>
      </GradientMeshBackground>
    </div>
  ),
};

/**
 * 5. Slow & Static (Reduced Motion Compliance)
 */
export const SlowAndStatic: Story = {
  args: {
    type: "conic",
    speed: 0,
    interactive: false,
  },
  render: (args) => (
    <div className="w-full h-[450px]">
      <GradientMeshBackground {...args}>
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <span className="inline-flex items-center px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-semantic-info)] border border-[var(--ant-color-surface-border)]">
            Speed = 0 (Static Mode)
          </span>
          <h2 className="text-2xl font-bold text-[var(--ant-color-surface-text)] mb-2">
            Reduced Motion & Low Power
          </h2>
          <p className="max-w-md text-xs text-[var(--ant-color-surface-text-sub)]">
            Animations freeze instantly when speed is 0 or when the user activates
            `prefers-reduced-motion: reduce`.
          </p>
        </div>
      </GradientMeshBackground>
    </div>
  ),
};

/**
 * 6. Interactive Hero Section
 */
export const HeroSectionExample: Story = {
  args: {
    type: "mesh",
    speed: 0.8,
    intensity: 1.0,
    grain: true,
    interactive: true,
  },
  render: (args) => (
    <div className="w-full min-h-[600px] flex items-center">
      <GradientMeshBackground {...args} className="min-h-[600px]">
        <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--ant-color-brand-accent)] animate-pulse" />
            ShaderGradient.co Inspired
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md mb-6">
            Design Next-Gen Hero Experiences
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-white/90 leading-relaxed mb-8 drop-shadow">
            Integrate dynamic 3D WebGL gradients or lightweight CSS fallbacks directly into your
            Antrosys layouts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-white text-[var(--ant-color-brand-primary)] font-semibold shadow-lg hover:bg-neutral-100 transition-transform active:scale-95"
            >
              Get Started
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/30 transition-transform active:scale-95"
            >
              Explore Components
            </button>
          </div>
        </div>
      </GradientMeshBackground>
    </div>
  ),
};
