# Modal

A fully accessible, production-ready Modal / Dialog component for Antrosys UI built on top of [@radix-ui/react-dialog](https://www.radix-ui.com/primitives/docs/components/dialog). Features automated focus trapping, focus restoration, body scroll locking, portal rendering, responsive sizing presets, smooth entry/exit animations, and strict Antrosys design-token integration.

---

## Overview

The `Modal` component displays content in an elevated layer over the main application view. It uses Radix UI Dialog primitives under the hood to ensure full WAI-ARIA Dialog Modal compliance, screen reader announcement, and seamless keyboard navigation.

---

## Installation & Dependencies

`@radix-ui/react-dialog` is a core dependency of `@antrosys/ui`. Ensure `@antrosys/ui` and `@antrosys/tokens` are imported in your application:

```bash
pnpm add @antrosys/ui @antrosys/tokens
```

---

## Basic Usage

The `Modal` component operates as a controlled component via `open` and `onClose`:

```tsx
import { useState } from "react";
import { Modal, Button } from "@antrosys/ui";

export function EditProfileExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Edit Profile
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile"
        description="Update your display name and public avatar."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium">Display Name</label>
          <input
            type="text"
            defaultValue="Alex Morgan"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </Modal>
    </div>
  );
}
```

---

## Size Presets

The `size` prop controls the maximum width of the dialog:

| Size | Class / Max Width | Typical Use Case |
|---|---|---|
| `"small"` / `"sm"` | `max-w-sm` (384px) | Confirmations, simple binary choices, quick alerts |
| `"medium"` / `"md"` | `max-w-lg` (512px) | *Default*. Standard forms, settings dialogs |
| `"large"` / `"lg"` | `max-w-2xl` (672px) | Multi-column layouts, data tables, advanced configurations |
| `"full"` | Viewport bound (`100vw - 32px`) | Full-screen document editors, media viewers |

```tsx
<Modal size="large" open={open} onClose={handleClose} title="Advanced Configuration">
  {/* Large content */}
</Modal>
```

---

## Confirmation Variant

For destructive, irreversible, or critical workflows, specify `variant="confirmation"`:

```tsx
<Modal
  open={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  variant="confirmation"
  title="Delete Database Cluster?"
  description="This action cannot be undone. All database records and replicas will be purged permanently."
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Permanently Delete
      </Button>
    </>
  }
>
  <p className="text-sm">Please type your database name to confirm deletion.</p>
</Modal>
```

---

## Prevent Close (`preventClose`)

When `preventClose={true}`, user dismissal interactions are blocked:
- Pressing <kbd>Esc</kbd> will not close the dialog.
- Clicking or tapping on the backdrop overlay will not close the dialog.
- The top-right close 'X' button is automatically hidden.

Use this for active mutations, mandatory data migration prompts, or non-cancellable wizard steps:

```tsx
<Modal
  open={isUpgrading}
  onClose={() => {}}
  preventClose={true}
  title="System Update in Progress"
  description="Please wait while files are being verified."
>
  <ProgressBar progress={75} />
</Modal>
```

---

## Nested Dialogs

`Modal` supports opening child dialogs on top of parent dialogs. Focus trapping, overlay stacking, and Escape key dismissal naturally layer without custom state management:

```tsx
<Modal open={parentOpen} onClose={() => setParentOpen(false)} title="Parent Dialog">
  <Button variant="danger" onClick={() => setChildOpen(true)}>
    Trigger Confirmation
  </Button>

  <Modal
    open={childOpen}
    onClose={() => setChildOpen(false)}
    variant="confirmation"
    title="Nested Confirm"
  >
    Focus is properly trapped here while active.
  </Modal>
</Modal>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | *Required* | Controlled open visibility state of the modal. |
| `onClose` | `() => void` | *Required* | Callback fired when modal requests to close. |
| `size` | `"small" \| "medium" \| "large" \| "full" \| "sm" \| "md" \| "lg"` | `"medium"` | Dialog width sizing preset. |
| `variant` | `"default" \| "confirmation"` | `"default"` | Semantic visual variant. |
| `title` | `ReactNode` | `undefined` | Accessible headline title rendered in `Dialog.Title`. |
| `description` | `ReactNode` | `undefined` | Accessible subtitle rendered in `Dialog.Description`. |
| `footer` | `ReactNode` | `undefined` | Action buttons rendered in the bottom footer bar. |
| `preventClose` | `boolean` | `false` | When true, disables closing via Escape, overlay click, and hides close X. |
| `showCloseButton` | `boolean` | `true` | Whether to display the header dismiss 'X' button. |
| `className` | `string` | `undefined` | Optional CSS class name added to the dialog card. |
| `theme` | `"light" \| "dark"` | Auto | Explicit theme override. Resolves via `ThemeContext` or `data-theme` when omitted. |
| `children` | `ReactNode` | `undefined` | Body content rendered inside scrollable content area. |

---

## Accessibility

- **Focus Trap**: Radix UI automatically traps keyboard focus within the dialog content while open. Focus cannot leak into background elements.
- **Focus Restoration**: When the dialog closes, keyboard focus returns to the element that triggered it.
- **Scroll Lock**: Body scroll is locked while the dialog is mounted, preventing background document jumping or scrolling.
- **Keyboard Navigation**: Pressing <kbd>Escape</kbd> triggers `onClose` (unless `preventClose={true}`). <kbd>Tab</kbd> and <kbd>Shift+Tab</kbd> cycle through interactive elements.
- **Screen Reader Landmarks**: Automatically creates `role="dialog"` with `aria-labelledby` referencing `Dialog.Title` and `aria-describedby` referencing `Dialog.Description`.
- **Reduced Motion**: All entrance/exit scale and fade animations honor `prefers-reduced-motion: reduce`.
