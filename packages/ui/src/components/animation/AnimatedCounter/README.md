# AnimatedCounter

A lightweight, accessible, and design-token-driven numerical animation component for the **Antrosys UI Kit**, powered by **CountUp.js 2.10.1**.

It animates numbers smoothly from a starting value to an end value, automatically triggers when scrolling into view via `IntersectionObserver`, supports decimal precision, custom prefixes/suffixes, configurable durations, and custom easing functions, while strictly respecting user accessibility preferences (`prefers-reduced-motion`).

---

## Features

- **CountUp.js Integration**: Leverages CountUp.js 2.10.1 with clean React lifecycle management, avoiding memory leaks via `onDestroy()`.
- **Viewport Auto-Trigger**: Automatically starts animation when the counter scrolls into view (`autoAnimate: true`), with configurable delays and single-trigger mode (`autoAnimateOnce: true`).
- **Dynamic Updates**: Seamlessly updates and re-animates from current values when the target `end` prop changes.
- **Prefix & Suffix Support**: Formats currency (`$`, `€`), percentages (`%`), positive trends (`+`), scales (`k`, `M`), and custom symbols.
- **Decimal Precision**: Configurable decimal places (`decimals`) and custom decimal/grouping separators.
- **Custom Easing**: Built-in `easeOutExpo` easing with options to disable (`easing={false}` for linear) or provide custom mathematical easing curves.
- **Accessible by Default**: Implements `role="status"`, `aria-live="polite"`, `aria-atomic="true"`, and descriptive `aria-label` to announce the final value cleanly to screen readers without jittering intermediate frame noise.
- **Reduced Motion Support**: Automatically skips animation and renders the final target number immediately when `prefers-reduced-motion: reduce` is detected.
- **Tabular Figures**: Enforces `tabular-nums` so numbers maintain fixed character widths without visual jittering during count transitions.
- **Design Token System**: Strictly uses Antrosys design tokens (`var(--ant-*)`), ensuring 100% theme consistency across light and dark modes with zero hardcoded hex colors.

---

## Installation / Import

```tsx
import { AnimatedCounter } from "@antrosys/ui";
import type {
  AnimatedCounterProps,
  AnimatedCounterSize,
  AnimatedCounterColor,
} from "@antrosys/ui";
```

---

## Usage Examples

### 1. Basic Counter
Animates from 0 to 1,250 with standard Antrosys styling:

```tsx
import { AnimatedCounter } from "@antrosys/ui";

export function BasicExample() {
  return <AnimatedCounter end={1250} />;
}
```

### 2. Currency with Prefix & Decimals
Animates a financial figure with `$` prefix and 2 decimal points:

```tsx
import { AnimatedCounter } from "@antrosys/ui";

export function RevenueCounter() {
  return (
    <AnimatedCounter
      prefix="$"
      start={0}
      end={4999.99}
      decimals={2}
      duration={2.5}
      color="brand"
      size="3xl"
    />
  );
}
```

### 3. Percentage with Suffix
Animates a completion metric with `%` suffix:

```tsx
import { AnimatedCounter } from "@antrosys/ui";

export function SuccessRate() {
  return (
    <AnimatedCounter
      end={99.8}
      suffix="%"
      decimals={1}
      color="success"
      size="2xl"
    />
  );
}
```

### 4. Custom Duration & Easing
Linear counting or custom easing curve:

```tsx
import { AnimatedCounter } from "@antrosys/ui";

// Linear counter (no easing)
<AnimatedCounter end={500} duration={3} easing={false} />

// Custom easing function
<AnimatedCounter
  end={1000}
  duration={2.5}
  easing={(t, b, c, d) => c * (-Math.pow(2, (-10 * t) / d) + 1) + b}
/>
```

### 5. KPI Dashboard Card
Real-world metric card presentation:

```tsx
import { AnimatedCounter } from "@antrosys/ui";

export function StatCard() {
  return (
    <div className="p-[var(--ant-spacing-6)] bg-[var(--ant-color-surface-bg-card)] rounded-[var(--ant-radius-xl)] border border-[var(--ant-color-surface-border)] shadow-[var(--ant-shadow-sm)]">
      <p className="text-[var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)] font-medium">
        Total Active Users
      </p>
      <div className="mt-[var(--ant-spacing-2)]">
        <AnimatedCounter
          end={48290}
          suffix="+"
          separator=","
          color="brand"
          size="3xl"
        />
      </div>
      <p className="mt-[var(--ant-spacing-1)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-semantic-success)] font-medium">
        +12.4% from last quarter
      </p>
    </div>
  );
}
```

---

## Props

### `AnimatedCounterProps`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `end` * | `number` | — | **Required**. Target numerical value to count to. |
| `start` | `number` | `0` | Starting numerical value for the animation. |
| `duration` | `number` | `2` | Animation duration in seconds. |
| `prefix` | `string` | `""` | String prepended to the counter (e.g. `"$"`, `"€"`). |
| `suffix` | `string` | `""` | String appended to the counter (e.g. `"%"`, `"+"`, `"k"`). |
| `decimals` | `number` | `0` | Number of decimal places to format. |
| `easing` | `boolean \| ((t, b, c, d) => number)` | `true` | `true` for standard easeOutExpo, `false` for linear, or a custom easing function. |
| `separator` | `string` | `","` | Thousands grouping separator. Set to `""` to disable grouping. |
| `decimal` | `string` | `"."` | Decimal point character. |
| `autoAnimate` | `boolean` | `true` | Trigger animation automatically when scrolled into viewport. |
| `autoAnimateOnce` | `boolean` | `true` | When `autoAnimate` is true, whether to run only once upon first reveal. |
| `autoAnimateDelay`| `number` | `150` | Milliseconds to wait after entering viewport before starting. |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl"` | `"2xl"` | Typography preset mapped to Antrosys tokens. |
| `color` | `"default" \| "brand" \| "success" \| "warning" \| "error" \| "info" \| "muted"` | `"default"` | Color variant mapped to Antrosys color tokens. |
| `onStart` | `() => void` | `undefined` | Callback invoked when animation begins. |
| `onComplete` | `() => void` | `undefined` | Callback invoked when animation finishes. |
| `className` | `string` | `undefined` | Additional custom CSS class names. |

*All standard `<span>` HTML attributes (such as `id`, `style`, `title`, etc.) are also supported.*

---

## Accessibility

- **Screen Reader Announcements**: Uses `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`.
- **Target Value Clarity**: Provides an `aria-label` containing the final formatted value (e.g. `"$4,999.99"`), preventing screen readers from attempting to narrate every intermediate frame calculation.
- **Reduced Motion**: Automatically bypasses animation frames when `prefers-reduced-motion: reduce` is detected, instantly rendering the target value for motion-sensitive users.
