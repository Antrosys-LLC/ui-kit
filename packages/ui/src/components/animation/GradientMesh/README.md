# Gradient / Mesh Background

Animated gradient or WebGL mesh background for hero sections and immersive landing pages. Provides lightweight CSS modes (`conic`, `blobs`, `radial`, `linear`) as well as a fluid 3D WebGL procedural noise mesh powered by **Three.js**.

## Features

- 🌊 **Three.js 3D WebGL Shader Mode**: Smooth waving parametric plane with multi-frequency Perlin noise displacement and multi-stop color blending.
- 🎨 **Lightweight CSS Modes**: Fast, GPU-accelerated `conic`, `blobs`, `radial`, and `linear` animations.
- 🖱️ **Interactive Pointer Tracking**: Reactive fluid wave ripples and parallax depth shift on cursor movement.
- 🎛️ **Configurable**: Customize color stops, animation speed, blur filter, intensity, wireframe mode, and subtle film grain overlay.
- 🧩 **Hero Content Slot**: Easy nesting of foreground titles, buttons, and badges with proper layering.

## Installation / Usage

```tsx
import { GradientMesh } from "@antrosys/ui";

export function Hero() {
  return (
    <GradientMesh
      type="mesh"
      colors={["#7C3AED", "#06B6D4", "#5B21B6", "#3B82F6", "#EDE9FE"]}
      speed={1}
      interactive
      grain
      className="h-[600px]"
    >
      <div className="flex flex-col items-center justify-center h-full text-white text-center">
        <h1 className="text-5xl font-bold">Next Generation Interface</h1>
        <p className="mt-4 text-lg text-white/80">Built with Antrosys UI</p>
      </div>
    </GradientMesh>
  );
}
```

## Props Table

| Prop          | Type                                                   | Default                   | Description                                           |
| ------------- | ------------------------------------------------------ | ------------------------- | ----------------------------------------------------- |
| `type`        | `"mesh" \| "conic" \| "blobs" \| "radial" \| "linear"` | `"mesh"`                  | Rendering mode                                        |
| `colors`      | `string[]`                                             | `Antrosys Brand Palette`  | Array of color stops (hex, rgb, hsl)                  |
| `speed`       | `number`                                               | `1`                       | Animation speed multiplier                            |
| `blur`        | `number \| string`                                     | `0` (mesh) / `50px` (CSS) | CSS blur filter applied to canvas / container         |
| `interactive` | `boolean`                                              | `true`                    | Enables pointer / mouse wave distortion and parallax  |
| `wireframe`   | `boolean`                                              | `false`                   | Renders 3D geometry wireframe in WebGL mode           |
| `grain`       | `boolean`                                              | `false`                   | Overlays a subtle procedural film grain noise texture |
| `intensity`   | `number`                                               | `1`                       | Wave amplitude / distortion factor                    |
| `children`    | `React.ReactNode`                                      | `undefined`               | Foreground elements rendered inside container         |
| `className`   | `string`                                               | `undefined`               | Additional class names                                |
| `style`       | `React.CSSProperties`                                  | `undefined`               | Inline styles                                         |

## Modes

### Three.js 3D WebGL Mesh (`type="mesh"`)

Renders a high-performance WebGL plane with custom GLSL vertex and fragment shaders. Reacts to pointer position by producing interactive fluid waves on top of continuous multi-octave noise.

### Rotating Conic Gradient (`type="conic"`)

Rotates a smooth multi-stop conic gradient with CSS blur for high performance on lower-power devices.

### Fluid Ambient Blobs (`type="blobs"`)

Animates floating, morphing circular gradients that gently drift across the container.
