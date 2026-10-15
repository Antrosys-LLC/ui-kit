# EmptyState

A premium feedback component designed to guide users when content or data is not yet available, a network connection is lost, a search query yields zero results, or a page is not found.

Features:
- **4 Presets**: `no-data`, `error-404`, `offline`, and `no-results`.
- **Inline SVG Artwork**: Handcrafted, scalable, accessible illustrations leveraging AntroSys design tokens.
- **Responsive Sizing**: `sm`, `md`, and `lg` scale presets with balanced typography and spacing.
- **Automatic Theme Inheritance**: Seamlessly adapts across light and dark modes with high-contrast text and surfaces using zero hardcoded hex colors.
- **WAI-ARIA Accessible**: Semantic markup, ARIA labelling, keyboard-operable call-to-action button, and `prefers-reduced-motion` compliance.

---

## Installation & Import

```tsx
import { EmptyState } from "@antrosys/ui";
// or relative import within packages:
// import { EmptyState } from "./components/feedback/EmptyState";
```

---

## Presets Overview

| Preset | Description | Default Title | Default Description | Default Action |
| :--- | :--- | :--- | :--- | :--- |
| `no-data` | Empty data collections, tables, or workspaces | "No data available" | "There is no data to display right now. Try adding items or check back later." | "Add item" |
| `error-404` | Resource or page not found | "Page not found" | "The page or resource you are looking for does not exist or may have been moved." | "Back to home" |
| `offline` | Lost or disconnected network state | "Connection lost" | "You are currently offline. Check your network connection and try again." | "Retry connection" |
| `no-results` | Zero search results or filtered matches | "No results found" | "We couldn't find any matches for your query. Try adjusting your search or filters." | "Clear search" |

---

## Usage Examples

### 1. Basic Preset Usage

```tsx
import { EmptyState } from "@antrosys/ui";

export function ProjectListEmpty() {
  return (
    <EmptyState
      preset="no-data"
      actionLabel="Create project"
      onAction={() => console.log("Create project clicked")}
    />
  );
}
```

### 2. Search Zero Results

```tsx
import { EmptyState } from "@antrosys/ui";

export function SearchResults({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <EmptyState
      preset="no-results"
      title={`No results for "${query}"`}
      description="Check for typos or try clearing your active filters to see all records."
      actionLabel="Reset filters"
      onAction={onReset}
    />
  );
}
```

### 3. Offline Error with Reconnect Action

```tsx
import { EmptyState } from "@antrosys/ui";

export function OfflineNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      preset="offline"
      actionLabel="Try again"
      onAction={onRetry}
    />
  );
}
```

### 4. Compact Card / Sidebar Widget (`size="sm"`)

```tsx
import { EmptyState } from "@antrosys/ui";

export function SidebarTasksEmpty() {
  return (
    <EmptyState
      preset="no-data"
      size="sm"
      title="No tasks due"
      description="You have completed all pending tasks for today."
    />
  );
}
```

### 5. Custom Artwork Illustration

```tsx
import { EmptyState } from "@antrosys/ui";

export function CustomLockedState() {
  return (
    <EmptyState
      preset="no-data"
      title="Analytics locked"
      description="Upgrade your workspace plan to view detailed conversion analytics."
      actionLabel="Upgrade now"
      onAction={() => window.location.href = "/billing"}
      illustration={
        <div className="w-[var(--ant-spacing-16)] h-[var(--ant-spacing-16)] rounded-[var(--ant-radius-full)] flex items-center justify-center bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary)]">
          <svg className="w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      }
    />
  );
}
```

---

## Props

The `EmptyState` component accepts the following props:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `preset` | `"no-data" \| "error-404" \| "offline" \| "no-results"` | `"no-data"` | Visual illustration preset and default headline / copy. |
| `title` | `ReactNode` | Preset default | Custom primary heading. |
| `description` | `ReactNode` | Preset default | Custom explanatory narrative copy. |
| `actionLabel` | `ReactNode` | Preset default (when `onAction` provided) | Call-to-action button label. If omitted and `onAction` is provided, the preset default label is used. If omitted without `onAction`, no button renders. |
| `onAction` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | Callback fired when the action button is clicked. |
| `illustration` | `ReactNode` | Preset SVG | Custom visual element replacing the built-in SVG artwork. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Controls layout padding, SVG scale, and typographic hierarchy. |
| `className` | `string` | — | Optional custom CSS class name applied to the outer container. |

All other standard `HTMLAttributes<HTMLDivElement>` (such as `id`, `data-testid`, `role`) are also supported and forwarded to the root element.

---

## Theme Inheritance (Light & Dark)

The component strictly consumes semantic design tokens from `@antrosys/tokens` and guarantees high contrast across themes:
- **Light Theme**:
  - Title: `var(--ant-color-surface-text)`
  - Description: `var(--ant-color-surface-text-sub)`
  - Cards: `var(--ant-color-surface-bg-card)` with border `var(--ant-color-surface-border)`
- **Dark Theme**:
  - Title: `var(--ant-color-neutral-50)` (high contrast against dark backgrounds)
  - Description: `var(--ant-color-neutral-400)` (accessible contrast)
  - Cards: `var(--ant-color-neutral-800)` with border `var(--ant-color-neutral-700)`
  - Ambient glow: `var(--ant-color-brand-primary)` with calibrated opacity

**Theme Resolution**: Supports seamless detection through:
1. `ThemeContext` from `<ThemeProvider>`
2. Closest parent container with `data-theme="dark"` or `.dark` class
3. Document root attribute `document.documentElement[data-theme="dark"]`
4. Responsive CSS variants (`dark:`, `[.dark_&]:`, `[[data-theme=dark]_&]:`)

---

## Accessibility

- **Semantic Landmark**: Uses `role="region"` with accessible `aria-labelledby` and `aria-describedby` IDs generated via React's `useId()`.
- **Keyboard Navigation**: The action button renders using the native `<button>` element provided by `Button`, fully focusable via `Tab` with high-contrast visible focus rings.
- **Decorative SVG**: Built-in illustrations are configured with `aria-hidden="true"` and `focusable="false"`, preventing screen reader verbosity on decorative artwork.
- **Reduced Motion**: Respects `prefers-reduced-motion` with `motion-reduce:transition-none`.
- **Contrast**: Complies with WCAG AA/AAA contrast ratios in both light and dark themes using semantic tokens.
