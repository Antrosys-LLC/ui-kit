# Tooltip

A positioned floating tooltip with collision detection, arrow pointer, delay controls, rich HTML content support, and trigger modes (`hover`, `click`, `focus`). Built with **@floating-ui/react**.

## Features

- 🎯 **Smart Collision Detection**: Powered by Floating UI `flip`, `shift`, and `autoUpdate` to ensure tooltips never overflow the viewport.
- 🏹 **Arrow Pointer**: Directional SVG arrow aligned with the anchor target.
- ⏱️ **Delay Config**: Set opening and closing delays in milliseconds.
- 🎨 **Design Tokens**: Styled with Antrosys neutral tokens and responsive light/dark theme variables.
- ♿ **Accessible**: Includes `aria-describedby` wiring and keyboard escape dismissal.

## Usage

```tsx
import { Tooltip, Button } from "@antrosys/ui";

// Basic Hover Tooltip
<Tooltip content="Edit project configuration">
  <Button variant="secondary">Settings</Button>
</Tooltip>

// Rich Content Tooltip with Placement
<Tooltip
  placement="bottom"
  content={
    <div>
      <strong>Antrosys Cloud</strong>
      <p className="text-xs">Deployment status: Healthy</p>
    </div>
  }
>
  <span className="badge">Status</span>
</Tooltip>
```

## Props Table

| Prop           | Type                                          | Default                     | Description                                 |
| -------------- | --------------------------------------------- | --------------------------- | ------------------------------------------- |
| `content`      | `React.ReactNode`                             | **Required**                | Content displayed inside the tooltip        |
| `placement`    | `TooltipPlacement`                            | `"top"`                     | Placement position (12 positions available) |
| `trigger`      | `"hover" \| "focus" \| "click" \| "manual"`   | `"hover"`                   | User action that activates tooltip          |
| `delay`        | `number \| { open?: number; close?: number }` | `{ open: 150, close: 100 }` | Open/close delay in ms                      |
| `arrow`        | `boolean`                                     | `true`                      | Show arrow pointing to trigger element      |
| `offset`       | `number`                                      | `8`                         | Distance in pixels from target              |
| `open`         | `boolean`                                     | `undefined`                 | Controlled open state                       |
| `defaultOpen`  | `boolean`                                     | `false`                     | Uncontrolled default state                  |
| `onOpenChange` | `(open: boolean) => void`                     | `undefined`                 | Callback on open change                     |
| `disabled`     | `boolean`                                     | `false`                     | Disable tooltip                             |
| `children`     | `React.ReactNode`                             | **Required**                | Trigger element                             |
| `className`    | `string`                                      | `undefined`                 | Custom CSS class for tooltip                |
