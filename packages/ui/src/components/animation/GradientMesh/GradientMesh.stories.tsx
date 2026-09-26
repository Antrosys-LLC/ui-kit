import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GradientMesh } from "./GradientMesh";

const meta: Meta<typeof GradientMesh> = {
  title: "Animation/GradientMesh",
  component: GradientMesh,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["mesh", "conic", "blobs", "radial", "linear"],
      description: "Rendering mode",
    },
    speed: {
      control: { type: "range", min: 0.1, max: 3, step: 0.1 },
      description: "Animation speed multiplier",
    },
    blur: {
      control: "text",
      description: "CSS blur filter",
    },
    interactive: {
      control: "boolean",
      description: "Enable pointer/mouse interaction",
    },
    wireframe: {
      control: "boolean",
      description: "Enable 3D wireframe mesh in WebGL mode",
    },
    grain: {
      control: "boolean",
      description: "Subtle film grain noise overlay",
    },
    intensity: {
      control: { type: "range", min: 0.2, max: 2.5, step: 0.1 },
      description: "Wave displacement intensity",
    },
  },
};

export default meta;
type Story = StoryObj<typeof GradientMesh>;

export const Default3DMesh: Story = {
  name: "Three.js 3D Mesh",
  args: {
    type: "mesh",
    speed: 1,
    interactive: true,
    grain: true,
    className: "h-[500px]",
    children: (
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-6">
        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
          WebGL 3D Mesh Shader
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md max-w-2xl">
          Immersive Fluid Gradients
        </h1>
        <p className="mt-4 text-base md:text-lg text-white/80 max-w-xl">
          High performance procedural waving 3D mesh driven by Three.js and custom GLSL vertex noise
          shaders.
        </p>
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 rounded-lg bg-white text-neutral-900 font-semibold shadow-lg hover:bg-neutral-100 transition-all hover:scale-105 active:scale-95">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-lg bg-white/10 backdrop-blur-md text-white font-semibold border border-white/20 hover:bg-white/20 transition-all">
            Documentation
          </button>
        </div>
      </div>
    ),
  },
};

export const ConicGradient: Story = {
  name: "CSS Conic Gradient",
  args: {
    type: "conic",
    speed: 1.2,
    blur: "60px",
    interactive: true,
    className: "h-[450px]",
    children: (
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h2 className="text-3xl font-bold tracking-tight">Rotating Conic Gradient</h2>
        <p className="text-white/80 mt-2">Ultra-lightweight CSS GPU-accelerated gradient</p>
      </div>
    ),
  },
};

export const ColorBlobs: Story = {
  name: "Organic Color Blobs",
  args: {
    type: "blobs",
    speed: 1,
    blur: "70px",
    interactive: true,
    grain: true,
    className: "h-[450px] bg-neutral-950",
    children: (
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h2 className="text-3xl font-bold tracking-tight">Ambient Fluid Blobs</h2>
        <p className="text-neutral-300 mt-2">Smooth mouse-interactive atmospheric lighting</p>
      </div>
    ),
  },
};

export const CustomColors: Story = {
  name: "Cyberpunk Sunset Palette",
  args: {
    type: "mesh",
    colors: ["#EC4899", "#8B5CF6", "#F59E0B", "#10B981", "#3B82F6"],
    speed: 1.5,
    intensity: 1.4,
    interactive: true,
    className: "h-[450px]",
    children: (
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h2 className="text-3xl font-bold tracking-tight">Vibrant Multi-Color Mesh</h2>
        <p className="text-white/90 mt-2">Easily configure custom brand color stops</p>
      </div>
    ),
  },
};

export const WireframeMode: Story = {
  name: "Wireframe 3D Mesh",
  args: {
    type: "mesh",
    wireframe: true,
    speed: 0.8,
    intensity: 1.2,
    interactive: true,
    className: "h-[450px] bg-neutral-950",
    colors: ["#06B6D4", "#7C3AED", "#10B981", "#3B82F6", "#F59E0B"],
    children: (
      <div className="flex flex-col items-center justify-center h-full text-cyan-400 text-center px-4 font-mono">
        <h2 className="text-2xl font-bold tracking-widest uppercase">Wireframe Matrix</h2>
        <p className="text-cyan-200/70 mt-2 text-sm">Dynamic procedural geometry grid</p>
      </div>
    ),
  },
};

export const HeroSectionExample: Story = {
  name: "Hero Section Integration",
  args: {
    type: "mesh",
    speed: 0.9,
    grain: true,
    className: "h-[600px]",
    children: (
      <div className="flex flex-col justify-between h-full p-8 md:p-16 text-white">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold tracking-wider">ANTROSYS UI</div>
          <div className="flex gap-6 text-sm text-white/80">
            <span className="hover:text-white cursor-pointer">Products</span>
            <span className="hover:text-white cursor-pointer">Design System</span>
            <span className="hover:text-white cursor-pointer">Docs</span>
          </div>
        </div>
        <div className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
            Next-Gen UI Engineering
          </span>
          <h1 className="text-5xl font-black mt-2 leading-tight">
            Build Stunning Experiences Faster.
          </h1>
          <p className="text-white/80 mt-4 text-lg">
            Tokens, components, and animations tailored for world-class web applications.
          </p>
        </div>
        <div className="text-xs text-white/50">
          Move your mouse to interact with the fluid simulation.
        </div>
      </div>
    ),
  },
};
