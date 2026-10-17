# Slideshow

A fullscreen presentation deck and slideshow component built with **React** and **GSAP**. It supports fluid hardware-accelerated slide transitions (`slide`, `fade`, `zoom`), rich keyboard navigation, an integrated progress indicator, presenter speaker notes, native browser Fullscreen API integration, and browser print / Save as PDF mode.

---

## Features

- **GSAP Animation Presets**: Smooth transitions including `fade`, `slide` (directional), and `zoom` (scale).
- **Reduced Motion Support**: Automatically skips motion and delivers instantaneous slide switching when `prefers-reduced-motion: reduce` is enabled.
- **Keyboard Navigation**: Comprehensive arrow keys (`ArrowRight`, `ArrowDown`, `ArrowLeft`, `ArrowUp`), `PageUp`/`PageDown`, `Home`, `End`, `F` (fullscreen toggle), and `S` / `N` (speaker notes toggle).
- **Presenter Speaker Notes**: Built-in toggleable notes panel that stays synchronized with the active slide and functions seamlessly in fullscreen mode.
- **Fullscreen Presentation**: One-click native browser Fullscreen API integration with cross-browser safeguards.
- **Print / PDF Export**: Built-in print stylesheet (`@media print`) rendering all slides sequentially as full-page presentation slides without UI chrome.
- **Antrosys Design Tokens**: Styled strictly with `@antrosys/tokens` CSS custom properties, providing zero-configuration Light and Dark mode support.
- **Accessible (WAI-ARIA)**: Built with `role="region"`, `aria-roledescription="slideshow"`, `aria-roledescription="slide"`, `aria-live="polite"`, visible focus rings, and accessible button labels.

---

## Installation / Import

```tsx
import { Slideshow } from "@antrosys/ui";
import type { SlideshowProps, SlideData, SlideshowTransition } from "@antrosys/ui";
```

---

## Usage Example

```tsx
import React from "react";
import { Slideshow } from "@antrosys/ui";
import type { SlideData } from "@antrosys/ui";

const slides: SlideData[] = [
  {
    id: "intro",
    title: "Welcome to Antrosys UI Kit",
    content: (
      <p>
        An enterprise-grade component library designed for speed, beauty, and accessibility.
      </p>
    ),
    notes: "Introduce the project goals and team roadmap.",
  },
  {
    id: "features",
    title: "Key Features",
    content: (
      <ul>
        <li>Hardware-accelerated GSAP animations</li>
        <li>Full keyboard navigation</li>
        <li>Print and PDF export support</li>
      </ul>
    ),
    notes: "Review each bullet point in detail.",
  },
  {
    id: "conclusion",
    title: "Get Started",
    content: <p>Explore the Storybook documentation to learn more!</p>,
  },
];

export function PresentationView() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <Slideshow
        slides={slides}
        transition="slide"
        showProgress
        allowKeyboard
      />
    </div>
  );
}
```

---

## Props

### `SlideshowProps`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `slides` | `SlideData[]` | *(required)* | Array of slide items to render in the presentation deck. |
| `transition` | `"slide" \| "fade" \| "zoom"` | `"slide"` | Animation transition preset between slides. |
| `showProgress` | `boolean` | `true` | Whether to display the top progress bar indicator. |
| `allowKeyboard` | `boolean` | `true` | Whether keyboard navigation shortcuts are active. |
| `initialSlide` | `number` | `0` | Initial slide index (0-based) in uncontrolled mode. |
| `currentSlide` | `number` | `undefined` | Controlled active slide index (0-based). |
| `onSlideChange` | `(index: number) => void` | `undefined` | Callback fired when the active slide changes. |
| `loop` | `boolean` | `false` | When `true`, navigating past the end wraps to the beginning and vice versa. |
| `showControls` | `boolean` | `true` | Whether to display the bottom navigation toolbar. |
| `defaultNotesOpen` | `boolean` | `false` | Whether the speaker notes overlay panel is open by default. |
| `className` | `string` | `undefined` | Additional CSS classes for the outer slideshow container. |
| `ariaLabel` | `string` | `"Presentation Slideshow"` | Accessible label for the slideshow region. |

### `SlideData` Structure

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string \| number` | `undefined` | Unique identifier for the slide. |
| `title` | `React.ReactNode` | `undefined` | Headline or title rendered at the top of the slide. |
| `content` | `React.ReactNode` | *(required)* | Main JSX content rendered in the slide body. |
| `notes` | `React.ReactNode` | `undefined` | Presenter speaker notes for this slide. |
| `background` | `string` | `undefined` | Optional custom CSS background color or gradient token. |
| `className` | `string` | `undefined` | Additional CSS classes applied directly to the slide element. |
| `ariaLabel` | `string` | `undefined` | Optional custom accessible label for assistive technologies. |

---

## Keyboard Navigation

When `allowKeyboard` is enabled (`true`), the following keyboard shortcuts are supported (disabled when interacting with form input fields):

| Key | Action |
| :--- | :--- |
| `ArrowRight` / `ArrowDown` / `PageDown` | Next slide |
| `ArrowLeft` / `ArrowUp` / `PageUp` | Previous slide |
| `Home` | Jump to first slide |
| `End` | Jump to last slide |
| `F` | Toggle fullscreen mode |
| `S` / `N` | Toggle speaker notes overlay panel |
| `Escape` | Close speaker notes panel (if open) |

---

## Transitions

- **`slide`** (default): Direction-aware horizontal translation with smooth easing.
- **`fade`**: Cross-fade opacity between slides.
- **`zoom`**: Scale and fade choreography for dynamic visual impact.

All transitions automatically defer to instantaneous switching when `prefers-reduced-motion: reduce` is detected.

---

## Print & PDF Export

Pressing <kbd>Ctrl + P</kbd> / <kbd>Cmd + P</kbd> activates the built-in `@media print` layout:
- Renders all slides sequentially as distinct presentation pages with page breaks (`page-break-after: always`).
- Hides interactive controls, progress bars, and navigation toolbars.
- Retains background styling and speaker notes formatting for clean PDF exporting.

---

## Accessibility

- **Roles & ARIA**: Container uses `role="region"` and `aria-roledescription="slideshow"`; active slide uses `role="group"` and `aria-roledescription="slide"`.
- **Live Regions**: Live viewport updates assistive technology with `aria-live="polite"`.
- **Focus Rings**: Controls utilize `focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)]` with clear offsets.
- **Accessible Names**: All icon buttons include descriptive `aria-label` attributes and state indicators (`aria-pressed`).
