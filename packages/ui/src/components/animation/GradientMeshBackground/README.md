# GradientMeshBackground

An animated gradient and WebGL mesh background component for **`@antrosys/ui`**, inspired by [ShaderGradient.co](https://www.shadergradient.co/).

It provides an ultra-lightweight CSS conic gradient mode by default for zero-overhead hero sections, and an optional **Three.js** mode for fluid, organic 3D color blobs and real-time vertex deformation.

---

## Features

- ⚡ **Lightweight CSS Conic Mode (Default)**: Hardware-accelerated CSS conic gradient and radial blend with 0 extra runtime weight.
- 🎨 **3D Fluid WebGL Mesh Mode**: Three.js powered procedural GLSL shader mesh with organic Simplex/Perlin noise displacement waves.
- 🫧 **Organic Drifting Blobs**: Multi-stop floating gradient blobs with pointer reactivity and deep Gaussian blurring.
- 🎯 **Pointer Interactivity**: Real-time cursor tracking with smooth inertia interpolation.
- ♿ **Accessibility Compliant**: Honors `prefers-reduced-motion: reduce` by freezing animations to resting states automatically.
- 🛡️ **Graceful WebGL Fallback**: Automatically falls back to lightweight CSS conic gradient if WebGL is unavailable or fails to initialize.
- 🌗 **Theme Token Aware**: Uses Antrosys design tokens (`var(--ant-color-...)`) for seamless light and dark mode integration.
- 🧹 **Automatic Resource Cleanup**: Fully disposes Three.js geometries, materials, renderers, and requestAnimationFrame loops on unmount.

---

## Installation / Import

```tsx
import { GradientMeshBackground } from "@antrosys/ui";
import type { GradientMeshBackgroundProps, GradientMeshBackgroundType } from "@antrosys/ui";
```

---

## Props

### `GradientMeshBackgroundProps`

Extends standard `React.HTMLAttributes<HTMLDivElement>`:

| Prop          | Type                                       | Default     | Description                                                                                    |
| :------------ | :----------------------------------------- | :---------- | :--------------------------------------------------------------------------------------------- |
| `type`        | `"conic" \| "mesh" \| "blobs" \| "radial"` | `"conic"`   | Rendering engine mode. `"conic"` is lightweight CSS; `"mesh"` is 3D WebGL shader.              |
| `colors`      | `string[]`                                 | `undefined` | Array of color stops (hex, rgb, or CSS token variables like `var(--ant-color-brand-primary)`). |
| `speed`       | `number`                                   | `1`         | Animation speed multiplier. `0` pauses/freezes animation.                                      |
| `blur`        | `number \| string`                         | `undefined` | Blur filter intensity (`50px` for CSS modes, `0px` for 3D mesh).                               |
| `interactive` | `boolean`                                  | `true`      | Enables interactive pointer/mouse tracking across the canvas.                                  |
| `intensity`   | `number`                                   | `1`         | Wave elevation amplitude factor for 3D mesh mode.                                              |
| `grain`       | `boolean`                                  | `false`     | Overlays a subtle SVG film grain noise texture for high-end aesthetic.                         |
| `wireframe`   | `boolean`                                  | `false`     | Renders wireframe polygon geometry in 3D mesh mode.                                            |
| `children`    | `React.ReactNode`                          | `undefined` | Foreground content rendered above the decorative background.                                   |
| `className`   | `string`                                   | `undefined` | Additional CSS class names merged with `clsx`.                                                 |
| `style`       | `React.CSSProperties`                      | `undefined` | Inline styles applied to outer container.                                                      |

---

## Usage Examples

### 1. Default Lightweight Conic Background

```tsx
import React from "react";
import { GradientMeshBackground } from "@antrosys/ui";

export function HeroSection() {
  return (
    <GradientMeshBackground type="conic" speed={1}>
      <div className="flex flex-col items-center justify-center min-h-[480px] p-8 text-center">
        <h1 className="text-4xl font-bold text-[var(--ant-color-surface-text)]">
          Welcome to Antrosys UI
        </h1>
        <p className="mt-2 text-[var(--ant-color-surface-text-sub)]">
          Fast, accessible, token-driven component library.
        </p>
      </div>
    </GradientMeshBackground>
  );
}
```

### 2. 3D WebGL Fluid Mesh (ShaderGradient.co Style)

```tsx
import React from "react";
import { GradientMeshBackground } from "@antrosys/ui";

export function WebGLHero() {
  return (
    <GradientMeshBackground type="mesh" speed={1.2} intensity={1.5} interactive={true} grain={true}>
      <div className="flex flex-col items-center justify-center min-h-[600px] text-white text-center">
        <h1 className="text-5xl font-extrabold drop-shadow-md">Immersive 3D Gradient</h1>
        <p className="mt-4 text-white/90 drop-shadow">
          Interactive real-time GPU displacement waves.
        </p>
      </div>
    </GradientMeshBackground>
  );
}
```

### 3. Custom Color Palette

```tsx
import React from "react";
import { GradientMeshBackground } from "@antrosys/ui";

export function SunsetSection() {
  return (
    <GradientMeshBackground
      type="blobs"
      blur={70}
      colors={["#F43F5E", "#FB923C", "#FBBF24", "#8B5CF6", "#3B82F6"]}
    >
      <div className="p-12 text-white">
        <h2 className="text-3xl font-bold">Custom Vibrant Atmosphere</h2>
      </div>
    </GradientMeshBackground>
  );
}
```

### 4. Reduced Motion & Static Mode

```tsx
import React from "react";
import { GradientMeshBackground } from "@antrosys/ui";

export function StaticBackground() {
  return (
    <GradientMeshBackground type="conic" speed={0} interactive={false}>
      <div className="p-8">Static resting gradient background</div>
    </GradientMeshBackground>
  );
}
```

---

## Accessibility & Performance

1. **A11y**: The decorative background layer is marked with `aria-hidden="true"`, ensuring screen readers perceive only the foreground content within `children`.
2. **Reduced Motion**: Respects `(prefers-reduced-motion: reduce)` by automatically halting CSS rotations and WebGL shader progression.
3. **Graceful Fallback**: If WebGL is disabled or encounters a GPU context creation failure, it automatically falls back to the CSS conic mode without throwing runtime errors.
4. **Memory Management**: When unmounted, Three.js geometries, materials, renderers, and event observers are immediately disposed of to prevent memory leaks.
