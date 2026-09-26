# CommandPalette (Cmd+K)

A modern, production-grade **Command Palette** component for the Antrosys UI-Kit. Built on top of [`cmdk`](https://cmdk.paco.me/) and fully integrated with Antrosys design tokens and theme architecture, it provides an intuitive, highly accessible spotlight search interface for enterprise and productivity applications.

---

## Features

- **Global Shortcut**: Toggleable anywhere via `Cmd + K` on macOS and `Ctrl + K` on Windows/Linux (with listener cleanup and default browser behavior suppression).
- **Fuzzy Search**: Fast, forgiving fuzzy search scoring across titles, values, descriptions, keywords, and groupings via `cmdk`.
- **Group Hierarchy**: Structured organization with subtle group headings supporting categories like `Recent`, `Commands`, and `Pages`.
- **Keyboard Navigation**: Full keyboard accessibility (`↑` / `↓` navigation, `Enter` selection, `Esc` dismissal).
- **Custom Result Renderers**: Item-level and palette-level custom render functions for icons, badges, status indicators, and metadata.
- **Zero Hardcoded Values**: Styled exclusively via Antrosys CSS design tokens (`--ant-color-surface-*`, `--ant-color-brand-*`, `--ant-spacing-*`, etc.).
- **Theme Adaptive**: Automatically adapts to Light and Dark themes via semantic CSS variables and `ThemeContext`.
- **Accessible & Responsive**: Accessible ARIA modal semantics, focus trapping, screen-reader announcements, and responsive viewport sizing.

---

## Installation & Import

Import from the `@antrosys/ui` package:

```tsx
import { CommandPalette } from "@antrosys/ui";
import type { CommandItem, CommandGroup, CommandPaletteProps } from "@antrosys/ui";
```

Or from the utility component path:

```tsx
import { CommandPalette } from "./components/utility/CommandPalette";
```

---

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `commands`* | `CommandItem[]` | `[]` | Array of executable command items. |
| `groups` | `CommandGroup[]` | `[]` | Definitions for organizing commands into visual groups. |
| `shortcut` | `string` | `"k"` | Keyboard shortcut key triggered alongside `Cmd` / `Ctrl`. |
| `placeholder` | `string` | `"Type a command or search..."` | Search input placeholder text. |
| `isOpen` | `boolean` | `undefined` | Controlled visibility state. |
| `defaultOpen` | `boolean` | `false` | Initial visibility state when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback fired when visibility changes. |
| `onSelectCommand`| `(command: CommandItem) => void` | `undefined` | Global callback triggered whenever any command is selected. |
| `emptyState` | `ReactNode` | `undefined` | Custom content rendered when no search results match. |
| `footer` | `ReactNode` | `undefined` | Custom footer element, or `null` to hide the footer. |
| `closeOnSelect` | `boolean` | `true` | Whether to automatically close the palette upon executing an item. |
| `renderCommand` | `(item, isSelected) => ReactNode` | `undefined` | Custom result renderer applied across all items. |
| `label` | `string` | `"Command Palette"` | Accessible label for the modal dialog. |
| `className` | `string` | `undefined` | Optional class name for the dialog box. |

*\* Indicates a required prop.*

---

## Data Structures

### `CommandItem`

```ts
interface CommandItem {
  /** Unique identifier for the command */
  id: string;
  /** Primary label displayed to the user */
  label: string;
  /** Optional custom search value used by cmdk */
  value?: string;
  /** Group ID that this command belongs to */
  group?: string;
  /** Searchable keywords to enhance fuzzy search matching */
  keywords?: string[];
  /** Optional secondary description or subtitle */
  description?: string;
  /** Icon rendered before the label */
  icon?: ReactNode;
  /** Keyboard shortcut (e.g., ["⌘", "K"] or "Ctrl+S") */
  shortcut?: string | string[];
  /** Optional status or metadata badge */
  badge?: ReactNode;
  /** Disables execution and dims the visual representation */
  disabled?: boolean;
  /** Callback fired when this specific command is executed */
  onSelect?: (command: CommandItem) => void;
  /** Custom renderer for this command item */
  render?: (command: CommandItem, isSelected: boolean) => ReactNode;
}
```

### `CommandGroup`

```ts
interface CommandGroup {
  /** Unique group identifier matching CommandItem.group */
  id: string;
  /** Group heading label or element */
  heading: ReactNode;
}
```

---

## Basic Usage

```tsx
import React, { useState } from "react";
import { CommandPalette } from "./components/utility/CommandPalette";

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  const groups = [
    { id: "recent", heading: "Recent" },
    { id: "commands", heading: "Commands" },
    { id: "pages", heading: "Pages" },
  ];

  const commands = [
    {
      id: "theme",
      label: "Toggle Theme",
      group: "commands",
      description: "Switch between light and dark mode",
      keywords: ["dark", "light", "mode", "color"],
      shortcut: ["⌘", "T"],
      onSelect: () => console.log("Toggled theme"),
    },
    {
      id: "profile",
      label: "User Profile",
      group: "recent",
      description: "View account settings",
      shortcut: ["G", "P"],
      onSelect: () => console.log("Navigated to profile"),
    },
    {
      id: "docs",
      label: "Documentation",
      group: "pages",
      description: "Antrosys UI-Kit documentation",
      keywords: ["help", "guides", "api"],
      onSelect: () => console.log("Opened documentation"),
    },
  ];

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Open Command Palette (Cmd + K)
      </button>

      <CommandPalette
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        groups={groups}
        commands={commands}
        shortcut="k"
        placeholder="Type a command or search..."
        onSelectCommand={(cmd) => console.log("Executed:", cmd.label)}
      />
    </div>
  );
}
```

---

## Custom Result Renderers

You can supply a custom rendering function per command item via `command.render` or globally via `renderCommand`:

```tsx
const commands: CommandItem[] = [
  {
    id: "service-database",
    label: "Database Cluster",
    group: "services",
    description: "Read replica online",
    render: (cmd, isSelected) => (
      <div className="flex items-center justify-between w-full py-[var(--ant-spacing-1)]">
        <div className="flex items-center gap-[var(--ant-spacing-3)]">
          <span className="w-[var(--ant-spacing-2)] h-[var(--ant-spacing-2)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-semantic-success)]" />
          <div>
            <p className="font-[var(--ant-typography-fontWeight-semibold)] text-[var(--ant-typography-fontSize-sm)]">{cmd.label}</p>
            <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)]">
              {cmd.description}
            </p>
          </div>
        </div>
        <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontFamily-mono)] text-[var(--ant-color-surface-text-sub)]">99.9% uptime</span>
      </div>
    ),
  },
];
```

---

## Keyboard Navigation & Shortcuts

| Action | Shortcut (macOS) | Shortcut (Windows / Linux) |
| :--- | :--- | :--- |
| **Open / Close Palette** | `⌘ + K` | `Ctrl + K` |
| **Close Palette** | `Escape` | `Escape` |
| **Navigate Up** | `↑` or `Ctrl + P` | `↑` or `Ctrl + P` |
| **Navigate Down** | `↓` or `Ctrl + N` | `↓` or `Ctrl + N` |
| **Execute / Select** | `Enter` | `Enter` |

---

## Accessibility & Theming

- **WAI-ARIA Conformance**: Built with Radix Dialog primitives. Includes `role="dialog"`, `role="combobox"`, `role="listbox"`, and `role="option"`.
- **Focus Management**: Automatically sets focus to the search field upon opening, traps keyboard focus within the dialog, and restores focus to the trigger element upon closing.
- **Design Tokens**: All background colors, borders, typography, radiuses, shadows, and z-indexes utilize Antrosys tokens (`--ant-color-surface-*`, `--ant-color-brand-*`, `--ant-spacing-*`, `--ant-radius-*`, `--ant-shadow-*`, `--ant-zIndex-*`).
- **Dark Mode**: Works out of the box with the Antrosys `data-theme="dark"` attribute, `.dark` class, and `ThemeProvider`.
