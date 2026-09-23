# Scroll-Reveal Wrapper

A high-performance scroll-triggered entrance animation wrapper and HOC built on **GSAP ScrollTrigger**. Animates any child component as it enters the viewport with customizable presets, stagger cascades, thresholds, and repeats.

## Features

- ⚡ **GSAP ScrollTrigger**: Silky smooth 60fps GPU transforms and sub-pixel interpolation.
- 🎭 **Rich Presets**: `fade-up`, `fade-down`, `fade-left`, `fade-right`, `zoom-in`, `zoom-out`, `flip`, `flip-x`, `flip-y`, `blur-in`, `rotate`.
- 🪜 **Stagger & Cascade**: Easily animate card grids or lists sequentially with the `cascade` and `stagger` props.
- 🎯 **Viewport Thresholds**: Define viewport trigger points (e.g. `"top 80%"` or `0.2`).
- 🔁 **Once or Repeat**: Configure whether animations play once or reverse/re-animate on subsequent scrolls.
- ♿ **Accessibility**: Automatically respects `prefers-reduced-motion`.
- 📦 **HOC Support**: Includes `withScrollReveal(Component, options)` for effortless wrapping.

## Usage

### As a Wrapper

```tsx
import { ScrollReveal } from "@antrosys/ui";

export function FeatureSection() {
  return (
    <ScrollReveal animation="fade-up" delay={0.2} duration={0.8}>
      <div className="card">
        <h2>Innovative Performance</h2>
        <p>Built for modern web experiences.</p>
      </div>
    </ScrollReveal>
  );
}
```

### Cascading Stagger for Lists/Grids

```tsx
<ScrollReveal animation="fade-up" cascade stagger={0.15}>
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</ScrollReveal>
```

### As a Higher-Order Component (HOC)

```tsx
import { withScrollReveal } from "@antrosys/ui";
import { MyCard } from "./MyCard";

const AnimatedCard = withScrollReveal(MyCard, { animation: "zoom-in", duration: 0.9 });

export function Section() {
  return <AnimatedCard title="Hello World" />;
}
```

## Props Table

| Prop        | Type                                                                                                                                            | Default        | Description                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------ |
| `animation` | `"fade-up" \| "fade-down" \| "fade-left" \| "fade-right" \| "zoom-in" \| "zoom-out" \| "flip" \| "flip-x" \| "flip-y" \| "blur-in" \| "rotate"` | `"fade-up"`    | Animation preset                                       |
| `delay`     | `number`                                                                                                                                        | `0`            | Initial delay in seconds                               |
| `stagger`   | `number`                                                                                                                                        | `0.1`          | Interval in seconds between cascading children         |
| `threshold` | `number \| string`                                                                                                                              | `"top 85%"`    | ScrollTrigger viewport trigger position                |
| `once`      | `boolean`                                                                                                                                       | `true`         | If true, plays once; if false, reverses on scroll exit |
| `duration`  | `number`                                                                                                                                        | `0.8`          | Animation duration in seconds                          |
| `distance`  | `number \| string`                                                                                                                              | `40`           | Translation distance in pixels for movement presets    |
| `ease`      | `string`                                                                                                                                        | `"power2.out"` | GSAP easing formula                                    |
| `cascade`   | `boolean`                                                                                                                                       | `false`        | Apply animation & stagger to direct children           |
| `as`        | `React.ElementType`                                                                                                                             | `"div"`        | HTML tag or component for wrapper container            |
| `children`  | `React.ReactNode`                                                                                                                               | `undefined`    | Children to reveal                                     |
| `className` | `string`                                                                                                                                        | `undefined`    | Additional class name                                  |
| `style`     | `React.CSSProperties`                                                                                                                           | `undefined`    | Inline styles                                          |
