# ParallaxSection

A depth-layered scroll parallax and 3D interactive mouse-tilt section component for the **Antrosys UI Kit**, powered by **GSAP**, **ScrollTrigger**, and **Lenis** smooth scrolling.

It delivers buttery-smooth multi-plane parallax depth, independent layer velocity multipliers, interactive 3D mouse tracking, and smooth-scroll inertial synchronization, while strictly respecting user accessibility preferences (`prefers-reduced-motion`).

---

## Features

- **GSAP & ScrollTrigger Integration**: Scrubbed scroll animation synchronized to viewport entrance and exit with high-performance RAF batching.
- **Two-Tier DOM Architecture**: Separates scroll translation (`yPercent`) onto outer layer containers and 3D mouse tilt (`rotateX/rotateY`) onto inner layer containers, completely preventing matrix transform overwrites.
- **Multi-Layer Depth**: Configurable array of layers (`layers`) with independent speed multipliers (`speed`), supporting both forward and counter-scroll physics.
- **3D Mouse Tracking Tilt**: Interactive cursor tracking with configurable maximum rotation angles and perspective values.
- **Lenis Smooth-Scroll Integration**: Single-prop (`smoothScroll: true`) smooth inertial scroll integration directly wired to GSAP ScrollTrigger updates.
- **Accessible & Reduced Motion**: Automatically bypasses parallax animations and mouse-tilt when `prefers-reduced-motion: reduce` is active.
- **Strict Memory Management**: Automatically reverts all GSAP contexts, kills ScrollTrigger instances, and disposes Lenis on unmount.
- **Design Token System**: 100% Antrosys design tokens (`var(--ant-*)`) for colors, spacing, radius, and shadows. Zero hardcoded hex colors.

---

## Installation / Import

```tsx
import { ParallaxSection } from "@antrosys/ui";
import type {
  ParallaxSectionProps,
  ParallaxLayer,
} from "@antrosys/ui";
```

---

## Usage Examples

### 1. Basic Parallax Section
Depth-layered background and foreground content:

```tsx
import { ParallaxSection } from "@antrosys/ui";

export function BasicExample() {
  return (
    <div className="h-[calc(var(--ant-spacing-24)*4)] overflow-hidden">
      <ParallaxSection
        speed={1}
        layers={[
          {
            id: "bg-layer",
            speed: 0.4,
            children: (
              <div className="w-full h-full bg-[var(--ant-color-brand-primary-lt)]" />
            ),
          },
        ]}
      >
        <div className="p-[var(--ant-spacing-6)]">
          <h2 className="text-[var(--ant-typography-fontSize-2xl)] font-[var(--ant-typography-fontWeight-bold)] text-[var(--ant-color-surface-text)]">
            Parallax Depth
          </h2>
        </div>
      </ParallaxSection>
    </div>
  );
}
```

### 2. Multi-Layer Velocities with Counter-Scroll
Layers moving at independent positive and negative speeds:

```tsx
import { ParallaxSection } from "@antrosys/ui";

export function MultiLayerExample() {
  return (
    <ParallaxSection
      speed={1}
      layers={[
        {
          id: "counter-layer",
          speed: -0.5,
          children: <div className="text-[var(--ant-color-semantic-info)] font-[var(--ant-typography-fontWeight-bold)]">Counter Scroll</div>,
        },
        {
          id: "fast-layer",
          speed: 1.5,
          children: <div className="text-[var(--ant-color-brand-primary)] font-[var(--ant-typography-fontWeight-bold)]">Fast Motion</div>,
        },
      ]}
    >
      <p className="text-[var(--ant-color-surface-text)] font-[var(--ant-typography-fontWeight-semibold)]">Foreground Reference</p>
    </ParallaxSection>
  );
}
```

### 3. Interactive 3D Mouse Tilt
Tracks mouse cursor movements across the container:

```tsx
import { ParallaxSection } from "@antrosys/ui";

export function MouseTiltExample() {
  return (
    <ParallaxSection
      mouseTilt={{ max: 15, perspective: 1000 }}
      layers={[
        {
          id: "card",
          mouseTilt: 1,
          children: (
            <div className="p-[var(--ant-spacing-6)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-surface-bg-card)] border border-[var(--ant-color-surface-border)] shadow-[var(--ant-shadow-md)]">
              Interactive 3D Card
            </div>
          ),
        },
      ]}
    />
  );
}
```

### 4. Lenis Smooth-Scroll Integration
Enables Lenis smooth scrolling with ScrollTrigger synchronization:

```tsx
import { ParallaxSection } from "@antrosys/ui";

export function SmoothScrollExample() {
  return (
    <ParallaxSection
      smoothScroll={true}
      speed={1.2}
      layers={[
        {
          id: "floating-badge",
          speed: 0.8,
          children: <div>Smooth Inertial Parallax</div>,
        },
      ]}
    />
  );
}
```

### 5. Hero Section
Real-world marketing hero section combining depth background and headline:

```tsx
import { ParallaxSection } from "@antrosys/ui";

export function HeroSectionExample() {
  return (
    <ParallaxSection
      speed={1}
      mouseTilt={true}
      layers={[
        {
          id: "ambient-glow",
          speed: 0.3,
          children: (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-[calc(var(--ant-spacing-24)*3)] h-[calc(var(--ant-spacing-24)*3)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-brand-primary)]/20 blur-[var(--ant-radius-2xl)]" />
            </div>
          ),
        },
      ]}
    >
      <div className="p-[var(--ant-spacing-8)] text-center">
        <h1 className="text-[var(--ant-typography-fontSize-3xl)] font-[var(--ant-typography-fontWeight-bold)] text-[var(--ant-color-surface-text)]">
          Next-Generation Interfaces
        </h1>
      </div>
    </ParallaxSection>
  );
}
```

---

## Props

### `ParallaxSectionProps`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layers` | `ParallaxLayer[]` | **Required** | Array of parallax depth layers. |
| `speed` | `number` | `1` | Global parallax speed multiplier applied across all layers. |
| `mouseTilt` | `boolean \| { max?: number; perspective?: number }` | `false` | Enables interactive 3D mouse tracking tilt effect across layers. |
| `smoothScroll` | `boolean` | `false` | Enables Lenis smooth scrolling synchronized with ScrollTrigger updates. |
| `children` | `ReactNode` | `undefined` | Foreground content rendered in front of parallax layers. |
| `className` | `string` | `undefined` | Additional CSS class names for the outer container. |

### `ParallaxLayer`

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Optional unique identifier for the layer. |
| `children` | `ReactNode` | `undefined` | Content rendered inside the layer. |
| `speed` | `number` | `1` | Layer-specific speed multiplier. Positive for scroll direction, negative for counter-scroll. |
| `mouseTilt` | `boolean \| number` | `undefined` | Layer-specific tilt factor. Set to number to scale tilt intensity. |
| `zIndex` | `number` | `index` | CSS z-index stacking order for the layer. |
| `className` | `string` | `undefined` | Additional CSS class names for the layer wrapper. |
| `style` | `CSSProperties` | `undefined` | Additional inline styles for the layer wrapper. |

---

## Accessibility & Reduced Motion

- **Reduced Motion Respect**: Automatically detects `(prefers-reduced-motion: reduce)`. When detected, all GSAP ScrollTrigger tweens, ticker loops, and mouse-tilt event listeners are disabled, rendering all layers in static resting positions.
- **Pointer Events**: Outer scroll-translation layers have `pointer-events-none`, and inner content wrappers have `pointer-events-auto`, ensuring that buttons, links, and text within layers remain fully interactive.
