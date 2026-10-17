# ScrollReveal

A high-performance scroll-triggered animation wrapper and Higher-Order Component (HOC) for **`@antrosys/ui`**, powered by **GSAP** and **ScrollTrigger**.

It animates any child element or staggered list into view as it crosses the viewport threshold, complete with preset transitions, bidirectional repeat capabilities, accessibility motion-reduction safeguards, theme token integration, and accessible skeleton loading states.

---

## Features

- **GSAP & ScrollTrigger Powered**: Smooth 60fps hardware-accelerated animations using GSAP context isolation and automatic garbage collection.
- **Preset Animations**: Out-of-the-box support for `fade-up`, `fade-down`, `fade-left`, `fade-right`, `zoom-in`, `zoom-out`, `flip` (3D), and `fade`.
- **Stagger Delays**: Effortlessly cascade lists, card grids, or timelines by setting a `stagger` delay in seconds.
- **Flexible Thresholds**: Trigger animations based on fractional viewport depth (e.g., `0.2` for top 80%) or custom ScrollTrigger syntax (e.g., `"top 85%"`).
- **Once or Repeat**: Configure `once={true}` for one-time entrance or `once={false}` for replayable in-and-out scroll effects.
- **HOC Wrapper Included**: Wrap existing components using `withScrollReveal(MyComponent, options)`.
- **Accessible Loading Skeleton**: Built-in `loading={true}` state styled with Antrosys tokens and `role="status"` screen reader support.
- **Reduced Motion Compliant**: Automatically detects `prefers-reduced-motion: reduce` and renders elements without animation to honor user accessibility preferences.
- **Theme Aware**: Built on Antrosys design tokens (`var(--ant-...)`), seamlessly supporting light and dark themes.

---

## Installation / Import

```tsx
import { ScrollReveal, withScrollReveal } from "@antrosys/ui";
import type {
  ScrollRevealProps,
  ScrollRevealAnimation,
  ScrollRevealHocOptions,
} from "@antrosys/ui";
```

---

## Props

### `ScrollRevealProps`

`ScrollReveal` extends standard `React.HTMLAttributes<HTMLElement>`:

| Prop            | Type                    | Default        | Description                                                                                                                  |
| :-------------- | :---------------------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| `animation`     | `ScrollRevealAnimation` | `"fade-up"`    | Animation preset (`"fade-up"`, `"fade-down"`, `"fade-left"`, `"fade-right"`, `"zoom-in"`, `"zoom-out"`, `"flip"`, `"fade"`). |
| `delay`         | `number`                | `0`            | Delay before the animation begins, in seconds.                                                                               |
| `duration`      | `number`                | `0.7`          | Duration of the animation, in seconds.                                                                                       |
| `stagger`       | `number`                | `0`            | Stagger delay interval between sequential child elements in seconds (e.g., `0.15`).                                          |
| `threshold`     | `number \| string`      | `0.2`          | Trigger start threshold. Number between `0` and `1` (ratio into viewport) or ScrollTrigger string (`"top 85%"`).             |
| `once`          | `boolean`               | `true`         | When `true`, plays once. When `false`, reverses on scroll out and replays on scroll in.                                      |
| `distance`      | `number`                | `32`           | Movement displacement distance in pixels for directional presets (`fade-up`, `fade-left`, etc.).                             |
| `ease`          | `string`                | `"power2.out"` | GSAP easing curve equation (e.g., `"power2.out"`, `"back.out(1.7)"`).                                                        |
| `loading`       | `boolean`               | `false`        | Displays an accessible skeleton loading placeholder state.                                                                   |
| `disabled`      | `boolean`               | `false`        | Disables animations entirely and renders children statically in their resting state.                                         |
| `as`            | `React.ElementType`     | `"div"`        | HTML tag or React component to render as the container element (`"div"`, `"section"`, `"ul"`, etc.).                         |
| `childSelector` | `string`                | `undefined`    | Optional CSS selector to target specific children for staggered animations (defaults to direct children).                    |
| `onReveal`      | `() => void`            | `undefined`    | Callback invoked when the element enters the trigger area.                                                                   |
| `children`      | `React.ReactNode`       | `undefined`    | Content to animate.                                                                                                          |
| `className`     | `string`                | `undefined`    | Additional CSS class names merged cleanly with `clsx`.                                                                       |

---

## Usage Examples

### 1. Basic Fade-Up Reveal

Wrap any element to reveal it as the user scrolls down the page:

```tsx
import React from "react";
import { ScrollReveal } from "@antrosys/ui";

export function HeroBanner() {
  return (
    <ScrollReveal animation="fade-up" delay={0.2} duration={0.8}>
      <div className="p-8 rounded-lg bg-[var(--ant-color-surface-bg-card)] border border-[var(--ant-color-surface-border)]">
        <h1 className="text-2xl font-bold text-[var(--ant-color-surface-text)]">
          Welcome to Antrosys
        </h1>
        <p className="text-[var(--ant-color-surface-text-sub)]">
          Modern, token-driven web component library.
        </p>
      </div>
    </ScrollReveal>
  );
}
```

### 2. Staggered Card Grid

Pass `stagger={0.15}` to automatically cascade through child elements sequentially:

```tsx
import React from "react";
import { ScrollReveal } from "@antrosys/ui";

export function FeatureGrid() {
  return (
    <ScrollReveal
      animation="fade-up"
      stagger={0.15}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div className="p-6 rounded-lg bg-[var(--ant-color-surface-bg-card)] border border-[var(--ant-color-surface-border)]">
        <h3>Design Tokens</h3>
        <p>Curated color harmonies and responsive typography.</p>
      </div>
      <div className="p-6 rounded-lg bg-[var(--ant-color-surface-bg-card)] border border-[var(--ant-color-surface-border)]">
        <h3>Accessible</h3>
        <p>Full keyboard navigation and ARIA compliant.</p>
      </div>
      <div className="p-6 rounded-lg bg-[var(--ant-color-surface-bg-card)] border border-[var(--ant-color-surface-border)]">
        <h3>Fast</h3>
        <p>60fps hardware accelerated animations.</p>
      </div>
    </ScrollReveal>
  );
}
```

### 3. Repeatable Reveal on Scroll (`once={false}`)

Replays the reveal animation whenever the user scrolls out and back in:

```tsx
import React from "react";
import { ScrollReveal } from "@antrosys/ui";

export function ReplayableSection() {
  return (
    <ScrollReveal animation="zoom-in" once={false} duration={0.6}>
      <div className="p-8 text-center bg-[var(--ant-color-brand-primary)]/10 rounded-xl">
        <h2 className="text-xl font-bold text-[var(--ant-color-brand-primary)]">
          Dynamic Re-triggering
        </h2>
        <p className="text-[var(--ant-color-surface-text-sub)]">
          Scroll up and down to see this element animate continuously!
        </p>
      </div>
    </ScrollReveal>
  );
}
```

### 4. Custom Viewport Threshold

Configure how far into view an element must travel before animating:

```tsx
import React from "react";
import { ScrollReveal } from "@antrosys/ui";

export function CustomThresholdDemo() {
  return (
    // Triggers when the top of the element hits 60% of viewport height
    <ScrollReveal threshold="top 60%" animation="fade-left">
      <div className="p-6 rounded-lg border border-[var(--ant-color-surface-border)]">
        Triggered deeper into the screen!
      </div>
    </ScrollReveal>
  );
}
```

### 5. Using the Higher-Order Component (`withScrollReveal`)

Enhance reusable components without adding wrapping JSX manually:

```tsx
import React from "react";
import { withScrollReveal } from "@antrosys/ui";

interface ProductCardProps {
  name: string;
  price: string;
}

function ProductCard({ name, price }: ProductCardProps) {
  return (
    <div className="p-4 rounded-lg bg-[var(--ant-color-surface-bg-card)] border border-[var(--ant-color-surface-border)]">
      <h4>{name}</h4>
      <p>{price}</p>
    </div>
  );
}

// Create animated component
export const AnimatedProductCard = withScrollReveal(ProductCard, {
  animation: "flip",
  duration: 0.8,
});

// Render anywhere with optional prop overrides
export function ProductList() {
  return (
    <AnimatedProductCard name="Enterprise License" price="$999/yr" scrollReveal={{ delay: 0.2 }} />
  );
}
```

### 6. Loading Skeleton State

Display an accessible skeleton while asynchronous data is fetching:

```tsx
import React from "react";
import { ScrollReveal } from "@antrosys/ui";

export function LoadingSection({ isLoading }: { isLoading: boolean }) {
  return (
    <ScrollReveal loading={isLoading} animation="fade-up">
      <div>Loaded Content</div>
    </ScrollReveal>
  );
}
```

---

## Accessibility (a11y)

- **Motion Reduction**: Respects the `prefers-reduced-motion: reduce` media query. When active, animations are bypassed and content renders at full opacity and natural position immediately.
- **Accessible Loading**: The skeleton loading state uses `role="status"`, `aria-label="Loading content"`, and includes a screen reader announcement (`<span className="sr-only">Loading content...</span>`).
- **Semantic Containers**: Supports polymorphic rendering via the `as` prop (`section`, `article`, `ul`, `nav`, etc.) to preserve semantic document hierarchy.
- **Keyboard Navigation**: Maintains native focus order and tabability across all child interactive controls.
