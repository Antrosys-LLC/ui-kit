# Typewriter

A polished, accessible, and design-token-driven text typing animation component for the **Antrosys UI Kit**, powered by **TypeIt 8.8.7**.

It provides smooth type → delete → retype animations across multiple strings, configurable typing and deleting speeds, pause durations, custom cursor styling, and native HTML content parsing, while strictly respecting user accessibility preferences (`prefers-reduced-motion`).

---

## Features

- **TypeIt Integration**: Built on TypeIt 8.8.7 with clean React lifecycle management, properly disposing instances via `destroy()` on unmount to prevent memory leaks.
- **Multiple Strings**: Cycles effortlessly through multiple string phrases with smooth typing, pausing, deleting, and retyping transitions.
- **Loop Support**: Continuous looping mode or single-pass completion with callbacks (`onStart`, `onComplete`).
- **Configurable Speeds**: Independent controls for typing speed (`speed`), deleting speed (`deleteSpeed`), and pause duration (`pauseDuration`).
- **Cursor Customization**: Toggleable cursor, custom characters (`|`, `_`, `▋`), configurable blink speed, and semantic token colors.
- **Rich HTML Parsing**: Directly renders HTML markup within strings without printing raw tags when `html: true`.
- **Accessible by Default**: Implements `role="status"`, `aria-live="polite"`, `aria-atomic="true"`, and full-string `aria-label` announcements so screen readers are not overloaded with per-character updates.
- **Reduced Motion Support**: Bypasses typing animation instantly and presents the complete text when `prefers-reduced-motion: reduce` is active.
- **Design Token System**: 100% Antrosys design tokens (`var(--ant-*)`) for all typography sizes, colors, spacing, radii, and borders. Zero hardcoded colors.

---

## Installation / Import

```tsx
import { Typewriter } from "@antrosys/ui";
import type {
  TypewriterProps,
  TypewriterSize,
  TypewriterColor,
} from "@antrosys/ui";
```

---

## Usage Examples

### 1. Basic Typewriter
Cycles through phrases with default speed and styling:

```tsx
import { Typewriter } from "@antrosys/ui";

export function BasicExample() {
  return (
    <Typewriter
      strings={[
        "Modern Component Library",
        "Design Token Architecture",
        "Accessible by Default",
      ]}
    />
  );
}
```

### 2. Multiple Strings & Custom Speeds
Fine-tune the typing speed, deleting speed, and pause between phrases:

```tsx
import { Typewriter } from "@antrosys/ui";

export function SpeedExample() {
  return (
    <Typewriter
      strings={["Fast typing cadence", "Rapid deleting speed", "Natural pauses"]}
      speed={45}
      deleteSpeed={25}
      pauseDuration={2000}
      color="brand"
      size="3xl"
    />
  );
}
```

### 3. Cursor Customization
Customize the cursor symbol or disable it completely:

```tsx
import { Typewriter } from "@antrosys/ui";

// Terminal underscore cursor with brand color
<Typewriter
  strings={["Terminal command prompt..."]}
  cursor="_"
  cursorColor="brand"
/>

// Hidden cursor
<Typewriter
  strings={["Clean text without blinking cursor"]}
  cursor={false}
/>
```

### 4. Rich HTML Content
Format highlighted words, emphasis, or colored tokens within typed phrases:

```tsx
import { Typewriter } from "@antrosys/ui";

export function HtmlExample() {
  return (
    <Typewriter
      html={true}
      strings={[
        'Build <span class="text-[var(--ant-color-brand-primary)] font-bold">faster</span> apps',
        'Deploy with <span class="text-[var(--ant-color-semantic-success)] font-bold">confidence</span>',
      ]}
      size="2xl"
    />
  );
}
```

### 5. Hero Section Headline
Real-world marketing headline with static prefix and animated keyword:

```tsx
import { Typewriter } from "@antrosys/ui";

export function HeroHeadline() {
  return (
    <h1 className="text-[var(--ant-typography-fontSize-4xl)] font-bold text-[var(--ant-color-surface-text)]">
      Empower your team to build{" "}
      <Typewriter
        strings={["extraordinary apps.", "accessible web UIs.", "scalable platforms."]}
        color="brand"
        size="4xl"
      />
    </h1>
  );
}
```

---

## Props

### `TypewriterProps`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `strings` * | `string[]` | — | **Required**. Array of string phrases to type, delete, and cycle through. |
| `speed` | `number` | `60` | Typing speed in milliseconds per character. |
| `deleteSpeed` | `number` | `40` | Deleting speed in milliseconds per character. |
| `loop` | `boolean` | `true` | Whether to loop through strings continuously. |
| `pauseDuration` | `number` | `1500` | Delay in milliseconds after typing a string before deleting it. |
| `startDelay` | `number` | `200` | Delay in milliseconds before typing begins. |
| `loopDelay` | `number` | `1000` | Delay in milliseconds before restarting the loop from string 0. |
| `cursor` | `boolean \| string` | `true` | Display cursor or specify a custom cursor character (`"|"`, `"_"`, `"▋"`). Pass `false` to hide. |
| `cursorSpeed` | `number` | `500` | Cursor blink duration in milliseconds. |
| `cursorColor` | `TypewriterColor` | `undefined` | Custom color variant for the cursor. Defaults to text color. |
| `html` | `boolean` | `false` | Whether to parse HTML markup inside string items. |
| `breakLines` | `boolean` | `false` | Whether to insert line breaks rather than deleting previous text. |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl"` | `"2xl"` | Typography preset mapped to Antrosys tokens. |
| `color` | `"default" \| "brand" \| "success" \| "warning" \| "error" \| "info" \| "muted"` | `"default"` | Color variant mapped to Antrosys tokens. |
| `theme` | `"auto" \| "light" \| "dark"` | `"auto"` | Explicit theme override. Defaults to DOM/Context detection. |
| `onStart` | `() => void` | `undefined` | Callback invoked when typing starts. |
| `onComplete` | `() => void` | `undefined` | Callback invoked when typing finishes (if `loop={false}`). |
| `className` | `string` | `undefined` | Additional CSS class names. |

*All standard HTML attributes supported by `<span>` (except `children`) are also accepted.*

---

## Accessibility

- **Screen Reader Announcements**: Implements `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`.
- **Target Value Clarity**: Provides an `aria-label` with the full phrase sequence to prevent screen readers from announcing every individual keystroke.
- **Reduced Motion**: Automatically bypasses animation frames when `prefers-reduced-motion: reduce` is detected, rendering the initial text statically for motion-sensitive users.
