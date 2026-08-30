# Tabs

An accessible, design-token-driven Tabs component built on top of **Radix UI** primitives and tailored for the **Antrosys UI Kit**. It provides smooth animated active-tab indicators, responsive scrollable overflow on mobile, horizontal and vertical orientation modes, and opt-in lazy mounting of tab panels.

---

## Features

- **WAI-ARIA Compliant**: Built on `@radix-ui/react-tabs`, adhering to WAI-ARIA tab patterns (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`).
- **Keyboard Navigation**: Roving tabindex with arrow keys (`Left`/`Right` for horizontal, `Up`/`Down` for vertical), `Home` (first tab), `End` (last tab), and `Enter`/`Space` activation.
- **Animated Underline Indicator**: Smooth CSS transition indicator that adapts dynamically to horizontal underline or vertical sidebar accent. Respects `prefers-reduced-motion`.
- **Mobile Responsive Overflow**: Tablist gracefully scrolls horizontally on narrow viewports without breaking layout, automatically bringing focused tabs into view.
- **Lazy Mounting**: Optional `lazy` prop to defer tab panel rendering until first visited, preserving state once rendered.
- **Design Tokens & Dark Mode**: Exclusively utilizes Antrosys design tokens (`--ant-*`), adapting seamlessly across light and dark themes.

---

## Installation / Import

```tsx
import { Tabs } from "@antrosys/ui";
import type { TabsProps, Tab } from "@antrosys/ui";
```

---

## Usage Example

```tsx
import React from "react";
import { Tabs } from "@antrosys/ui";

export function SettingsPage() {
  const tabs = [
    {
      value: "account",
      label: "Account",
      content: <div>Manage your profile and account settings.</div>,
    },
    {
      value: "security",
      label: "Security",
      content: <div>Configure two-factor authentication and passwords.</div>,
    },
    {
      value: "notifications",
      label: "Notifications",
      content: <div>Set up email and in-app alerts.</div>,
    },
    {
      value: "billing",
      label: "Billing",
      content: <div>View payment history and manage subscription plans.</div>,
    },
  ];

  return (
    <div className="p-6">
      <Tabs tabs={tabs} defaultTab="account" orientation="horizontal" />
    </div>
  );
}
```

---

## Props

### `TabsProps`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `tabs` | `Tab[]` | *(required)* | Array of tab configuration objects. |
| `defaultTab` | `string` | First enabled tab | Initially selected tab value in uncontrolled mode. |
| `value` | `string` | `undefined` | Selected tab value in controlled mode. |
| `onValueChange` | `(value: string) => void` | `undefined` | Callback invoked when the active tab value changes. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout orientation of tablist and panels. |
| `lazy` | `boolean` | `false` | When `true`, tab content is only mounted into the DOM upon initial activation. |
| `className` | `string` | `undefined` | Optional CSS class name passed to the root container. |
| `aria-label` | `string` | `"Tabs"` | Accessible label describing the purpose of the tablist. |

### `Tab` Interface

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | *(required)* | Unique string identifier for the tab. |
| `label` | `React.ReactNode` | *(required)* | Label rendered inside the tab trigger button. |
| `content` | `React.ReactNode` | *(required)* | Content rendered inside the active tab panel. |
| `disabled` | `boolean` | `false` | If `true`, the tab trigger cannot be activated or focused via keyboard. |
| `icon` | `React.ReactNode` | `undefined` | Optional icon element rendered before the label. |

---

## Orientations

### Horizontal Orientation (`orientation="horizontal"`)

The default layout. Renders tab triggers in a horizontal bar with a bottom border and an animated bottom indicator line (`height: 2px`).

```tsx
<Tabs tabs={tabs} orientation="horizontal" defaultTab="account" />
```

### Vertical Orientation (`orientation="vertical"`)

Renders a vertical sidebar navigation list with the active tab panel displayed alongside it. The active indicator smoothly tracks the active tab along the right border.

```tsx
<Tabs tabs={tabs} orientation="vertical" defaultTab="account" />
```

---

## Lazy Loading Behavior (`lazy={true}`)

- **When `lazy={false}` (default)**: All tab panels are mounted into the DOM on initial render. Inactive panels are hidden via CSS/Radix `data-state="inactive"`.
- **When `lazy={true}`**: Tab panel content is deferred and only mounted when the user activates that tab for the first time. Once activated, the panel remains mounted in the DOM to preserve form inputs, scroll position, and component state.

```tsx
<Tabs tabs={tabs} lazy={true} defaultTab="account" />
```

---

## Keyboard Navigation Reference

| Key | Action |
| :--- | :--- |
| `ArrowRight` / `ArrowLeft` | Moves focus to next / previous tab in horizontal orientation. |
| `ArrowDown` / `ArrowUp` | Moves focus to next / previous tab in vertical orientation. |
| `Home` | Moves focus to the first enabled tab. |
| `End` | Moves focus to the last enabled tab. |
| `Space` / `Enter` | Activates the focused tab trigger. |
| `Tab` | Moves focus into the active tabpanel content. |
