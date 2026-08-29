# Timeline

`Timeline` is a flexible, accessible, theme-adaptive component for rendering chronological events, company roadmaps, activity feeds, and milestone history. Built with `@antrosys/tokens`, it supports vertical and horizontal orientations, alternating layouts, date grouping, status badges, scroll reveal animations, and skeleton loading states.

---

## Features

* **Multi-Orientation**: Vertical (default) and Horizontal scrollable timeline modes.
* **Alternating Layout**: In vertical mode, items can dynamically alternate on opposite sides of a center track line.
* **Date Grouping**: Automatically group items under sticky/prominent date or year badges.
* **Status Badges & Custom Icons**: Supports `completed`, `current`, `upcoming`, `warning`, and `error` status variants or custom React icon badges.
* **Scroll-Triggered Reveal Animation**: Smooth fade-in and slide-up entrance animations powered by `IntersectionObserver` with `prefers-reduced-motion` fallbacks.
* **Skeleton Loading State**: Animated placeholder skeleton preserving the timeline's structural layout during data fetching.
* **Dense Mode**: Compact spacing option for high-density activity feeds and audit logs.
* **100% Tokenized Styling**: Full dark mode and light mode compatibility styled entirely with `@antrosys/tokens` CSS custom properties.
* **Accessible Semantics**: Uses semantic `<ol>` and `<li>` elements, `aria-current="step"`, and hidden decorative icons.

---

## Usage Examples

### Vertical Timeline (Default)

```tsx
import { Timeline } from "@antrosys/ui";

const milestones = [
  {
    id: "1",
    date: "Jan 10, 2026",
    title: "Project Inception",
    description: "Defined technical architecture, design tokens, and milestones.",
    status: "completed",
  },
  {
    id: "2",
    date: "Feb 15, 2026",
    title: "UI Component Library Launch",
    description: "Released primitive buttons, forms, and navigation components.",
    status: "completed",
  },
  {
    id: "3",
    date: "Mar 01, 2026",
    title: "Data Visualization & Timeline",
    description: "Engineered ChartSuite and Timeline components.",
    status: "current",
  },
  {
    id: "4",
    date: "Apr 01, 2026",
    title: "Production v1.0 Release",
    description: "Public deployment across production clusters.",
    status: "upcoming",
  },
];

<Timeline items={milestones} />
```

---

### Horizontal Timeline

```tsx
<Timeline
  items={milestones}
  orientation="horizontal"
  lineVariant="solid"
/>
```

---

### Alternating Vertical Timeline with Date Grouping

```tsx
<Timeline
  items={milestones}
  alternating={true}
  groupByDate={true}
  animated={true}
/>
```

---

### Status Variants

```tsx
const statusEvents = [
  { id: "1", title: "Task Completed", status: "completed" },
  { id: "2", title: "In Progress", status: "current" },
  { id: "3", title: "Warning Alert", status: "warning" },
  { id: "4", title: "Pipeline Failed", status: "error" },
  { id: "5", title: "Upcoming Step", status: "upcoming" },
];

<Timeline items={statusEvents} />
```

---

### Loading Skeleton State

```tsx
<Timeline
  items={[]}
  loading={true}
  loadingCount={4}
  orientation="horizontal"
/>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `TimelineItem[]` | — **(Required)** | Array of timeline event items to render |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Visual orientation layout direction |
| `alternating` | `boolean` | `false` | Alternate items left and right of track line (vertical mode only) |
| `groupByDate` | `boolean` | `false` | Group consecutive items by their `group` or `date` property |
| `animated` | `boolean` | `true` | Enable scroll-triggered reveal animations |
| `loading` | `boolean` | `false` | Show animated skeleton loading placeholder |
| `loadingCount` | `number` | `3` | Number of skeleton items to display when `loading={true}` |
| `lineVariant` | `"solid" \| "dashed" \| "dotted"` | `"solid"` | Style of the connecting line between nodes |
| `dense` | `boolean` | `false` | Enable compact dense mode with tighter spacing |
| `theme` | `"light" \| "dark" \| "auto"` | — | Explicit theme mode override; resolves via `ThemeContext` or DOM `data-theme` when omitted |
| `aria-label` | `string` | `"Timeline"` | Accessible label for the timeline region |
| `className` | `string` | — | Custom CSS class applied to root container |

---

### `TimelineItem` Interface

| Property | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — **(Required)** | Unique identifier for the timeline item |
| `title` | `ReactNode` | — **(Required)** | Primary title or headline of the event |
| `date` | `ReactNode` | `undefined` | Date, time, or timestamp label |
| `group` | `string` | `undefined` | Grouping key for `groupByDate` (e.g. `"2026"`, `"Q1 2026"`) |
| `description` | `ReactNode` | `undefined` | Secondary descriptive narrative |
| `icon` | `ReactNode` | `undefined` | Custom React icon or badge displayed inside the node |
| `status` | `"completed" \| "current" \| "upcoming" \| "warning" \| "error"` | `"upcoming"` | Progress status determining node color and indicators |
| `content` | `ReactNode` | `undefined` | Custom React component or rich body content |
| `tag` | `ReactNode` | `undefined` | Metadata badge or tag displayed alongside date |
| `disabled` | `boolean` | `false` | Inactive / disabled event styling |
| `className` | `string` | `undefined` | Custom CSS class applied to the event card |
