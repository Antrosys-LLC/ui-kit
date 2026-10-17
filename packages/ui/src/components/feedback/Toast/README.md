# Toast

A reusable, production-ready global notification and toast system for Antrosys UI, powered by [Sonner](https://sonner.ermilkowal.ski/). Built with full theme awareness (light/dark mode), strict TypeScript support, comprehensive accessibility live-region announcements, and Antrosys design tokens.

---

## Overview

The `Toast` component acts as a global mounting manager (`<Toast />` or `<Toaster />`) that coordinates toast placement, stacking, queueing, auto-dismissal, and interactive actions. Once mounted in your application tree or layout, you can trigger notifications imperatively from anywhere using the `toast` API.

---

## Installation & Dependencies

`@antrosys/ui` includes `sonner` as a core dependency. Ensure `@antrosys/ui` and `@antrosys/tokens` are imported in your project:

```bash
pnpm add @antrosys/ui @antrosys/tokens
```

Make sure the tokens CSS is imported in your app entry:

```tsx
import "@antrosys/tokens/css";
import "@antrosys/ui/styles";
```

---

## Basic Usage

Mount the `<Toast />` component once at your root layout or application root, then call `toast.*` from any handler or component:

```tsx
import { Toast, toast, Button } from "@antrosys/ui";

export function App() {
  return (
    <div>
      <Toast position="bottom-right" />
      <Button onClick={() => toast.success("Profile updated successfully")}>
        Save Profile
      </Button>
    </div>
  );
}
```

---

## Variants

The system supports four primary semantic feedback variants, plus standard messages, loaders, and custom JSX:

```tsx
// Success
toast.success("Profile updated successfully", {
  description: "All changes have been synced with the cloud.",
});

// Error
toast.error("Unable to save changes", {
  description: "Network timeout. Please check your connection and retry.",
});

// Warning
toast.warning("Your session will expire soon", {
  description: "You will be automatically logged out in 5 minutes.",
});

// Info
toast.info("New update available", {
  description: "Version 2.4.0 is now live.",
});

// Loading
const toastId = toast.loading("Processing transaction...");
```

---

## Positioning

The toast manager supports 6 screen positions:

| Position | Description |
|---|---|
| `"top-left"` | Anchored to top-left corner of the viewport |
| `"top-center"` | Anchored to top-center of the viewport |
| `"top-right"` | Anchored to top-right corner of the viewport |
| `"bottom-left"` | Anchored to bottom-left corner of the viewport |
| `"bottom-center"` | Anchored to bottom-center of the viewport |
| `"bottom-right"` | Anchored to bottom-right corner of the viewport *(default)* |

```tsx
<Toast position="top-right" />
```

---

## Duration & Auto-Dismiss

Configure default dismissal time globally via `<Toast duration={4000} />` or override per notification:

```tsx
// Fast 2-second toast
toast.info("Fast alert", { duration: 2000 });

// Persistent toast (stays until user dismisses or closes)
toast.warning("Important notice", { duration: Infinity });
```

---

## Action Buttons

Attach accessible action buttons (e.g. Undo, Retry, View) to any toast:

```tsx
toast.success("File deleted", {
  description: "document-2026.pdf was moved to trash.",
  action: {
    label: "Undo",
    onClick: () => {
      restoreFile();
      toast.info("File restored");
    },
  },
});
```

---

## Promise Toast

Provide seamless async feedback that automatically transitions from loading state to success or error state:

```tsx
toast.promise(saveUserData(), {
  loading: "Saving user data...",
  success: (data) => `Saved profile for ${data.name}!`,
  error: (err) => `Failed to save: ${err.message}`,
});
```

---

## Props

### `<Toast />` / `<Toaster />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `ToastPosition` | `"bottom-right"` | Screen anchor position for the notification stack. |
| `duration` | `number` | `4000` | Global default auto-dismiss duration in milliseconds. |
| `maxVisible` | `number` | `3` | Maximum number of notifications visible simultaneously. |
| `pauseOnHover` | `boolean` | `true` | Whether auto-dismiss countdown timer pauses when hovered. |
| `closeButton` | `boolean` | `true` | Whether to render an accessible dismiss close button on each toast. |
| `expand` | `boolean` | `false` | Whether hovering the stack expands all notifications. |
| `richColors` | `boolean` | `false` | Whether to enable rich saturated semantic backgrounds. |
| `theme` | `"light" \| "dark" \| "system"` | Auto-resolved | Explicit color theme override. Resolves via `ThemeContext` or `data-theme` when omitted. |
| `offset` | `string \| number` | `"24px"` | Viewport edge offset distance. |
| `gap` | `number` | `12` | Spacing gap between stacked toasts in pixels. |
| `className` | `string` | `undefined` | Custom CSS class name for the root container. |
| `style` | `React.CSSProperties` | `undefined` | Custom inline CSS styles for the root container. |
| `containerAriaLabel` | `string` | `"Notifications"` | Accessible landmark label for the toast container region. |
| `hotkey` | `string[]` | `["altKey", "KeyT"]` | Keyboard shortcut to focus active toast region. |

---

## Accessibility

- **Live Region**: Uses Sonner's built-in `role="region"` and `aria-live` announcer to ensure screen readers announce notifications without interrupting existing reading flow.
- **Keyboard Navigation**: Pressing the configured hotkey (`Alt+T` by default) focuses the notification container. Action and close buttons are fully keyboard navigable (`Tab` + `Enter`/`Space`).
- **Icons**: All decorative icons include `aria-hidden="true"`, ensuring no redundant or repetitive screen reader clutter.
- **Color Independence**: Semantic status is conveyed through both distinct SVG icons and clear textual messaging, ensuring compliance with WCAG 2.1 SC 1.4.1 (Use of Color).
- **High Contrast**: Meets WCAG 2.1 AA color contrast standards across both light and dark modes using Antrosys design tokens.
