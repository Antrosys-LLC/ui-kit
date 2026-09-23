# Popover

A positioned floating popup card with collision detection, arrow pointer, interactive HTML content, configurable triggers (`click`, `hover`, `focus`), header slot, close button, and focus management. Powered by **@floating-ui/react**.

## Features

- 🎯 **Smart Collision Detection**: Automatically adjusts placement (`flip`, `shift`) to remain visible inside viewport bounds.
- 🏹 **Arrow Pointer**: Seamless directional arrow styled with design token borders and surface backgrounds.
- 🎛️ **Header & Close Button**: Optional title header and close button with accessible button labels.
- 🔒 **Focus Management**: Optional modal focus trapping (`modal={true}`).
- 💡 **Rich Content**: Perfect for interactive menus, user profiles, filters, and custom forms.

## Usage

```tsx
import { Popover, Button } from "@antrosys/ui";

export function UserMenu() {
  return (
    <Popover
      title="User Account"
      closeButton
      placement="bottom-end"
      content={
        <div className="flex flex-col gap-3">
          <p className="text-sm">Manage preferences and security settings.</p>
          <Button size="sm" variant="primary">
            Account Settings
          </Button>
        </div>
      }
    >
      <Button variant="secondary">My Profile</Button>
    </Popover>
  );
}
```

## Props Table

| Prop           | Type                                          | Default                     | Description                       |
| -------------- | --------------------------------------------- | --------------------------- | --------------------------------- |
| `content`      | `React.ReactNode`                             | **Required**                | Popover body content              |
| `title`        | `React.ReactNode`                             | `undefined`                 | Optional title header             |
| `placement`    | `PopoverPlacement`                            | `"bottom"`                  | Placement relative to trigger     |
| `trigger`      | `"click" \| "hover" \| "focus" \| "manual"`   | `"click"`                   | Action that reveals popover       |
| `delay`        | `number \| { open?: number; close?: number }` | `{ open: 150, close: 150 }` | Open/close delay                  |
| `arrow`        | `boolean`                                     | `true`                      | Show pointing arrow               |
| `offset`       | `number`                                      | `10`                        | Distance in px from trigger       |
| `closeButton`  | `boolean`                                     | `false`                     | Show header close icon button     |
| `modal`        | `boolean`                                     | `false`                     | Enable modal focus trapping       |
| `open`         | `boolean`                                     | `undefined`                 | Controlled open state             |
| `defaultOpen`  | `boolean`                                     | `false`                     | Uncontrolled default state        |
| `onOpenChange` | `(open: boolean) => void`                     | `undefined`                 | Callback fired on open change     |
| `children`     | `React.ReactNode`                             | **Required**                | Trigger element                   |
| `className`    | `string`                                      | `undefined`                 | Custom CSS class for popover card |
