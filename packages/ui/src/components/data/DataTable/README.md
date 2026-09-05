# DataTable

A modern, highly performant, accessible Data Table component powered by **TanStack Table** and **TanStack Virtual**.

## Features

- ⚡ **TanStack Table v8 Core**: Headless, flexible, and blazing fast data grids.
- 🔄 **Sortable Columns**: Single and multi-column sorting with visual indicators.
- 📌 **Column Pinning**: Pin crucial columns (e.g. IDs, Actions) to the left or right with sticky alignment.
- ☑️ **Multi-Row Selection**: Bulk selection across pages with animated batch action toolbar.
- ✏️ **Inline Row & Cell Editing**: Click or double-click to edit cell values inline with custom validation.
- 💾 **CSV & Excel Export**: Instant client-side export with full UTF-8 BOM encoding.
- 🚀 **Virtual Scrolling**: Virtualized rendering supporting 10,000+ records at 60 FPS.
- 📱 **Responsive Card View**: Seamlessly switches to modern card layout on mobile devices or via toolbar toggle.
- 🔍 **Search & Filters**: Global filter and column-level search capabilities.
- 👁️ **Column Visibility**: Toggle column visibility on the fly.
- 🎚️ **Density Sizing**: Compact, Comfortable, and Spacious row height presets.
- 🌓 **Theme Support**: Seamless dark and light mode styling with Antrosys Design Tokens.

## Installation & Import

```tsx
import { DataTable, type DataTableColumnDef } from "@antrosys/ui";
```

## Basic Usage

```tsx
import { DataTable, type DataTableColumnDef } from "@antrosys/ui";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

const columns: DataTableColumnDef<User>[] = [
  { accessorKey: "id", header: "User ID", size: 100 },
  { accessorKey: "name", header: "Full Name", meta: { isEditable: true } },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "email", header: "Email Address" },
];

export function UserGrid({ users }: { users: User[] }) {
  return (
    <DataTable
      title="Team Directory"
      data={users}
      columns={columns}
      selectable
      exportable
      searchable
    />
  );
}
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `DataTableColumnDef<TData>[]` | **Required** | Column definitions. |
| `data` | `TData[]` | **Required** | Array of row data items. |
| `selectable` | `boolean` | `false` | Enables row selection checkboxes and batch actions. |
| `exportable` | `boolean` | `true` | Enables CSV and Excel export options in the toolbar. |
| `virtualScroll`| `boolean` | `false` | Enables TanStack Virtual row virtualization. |
| `virtualScrollHeight` | `number` | `480` | Container height in px for virtualized scrolling. |
| `searchable` | `boolean` | `true` | Shows global search input in toolbar. |
| `enablePinning` | `boolean` | `true` | Allows left/right column pinning. |
| `enableMobileCards` | `boolean` | `true` | Allows switching to responsive card view. |
| `pagination` | `boolean` | `true` | Enables pagination controls (when virtualScroll is false). |
| `onRowEditSave` | `(row, index, col) => void` | `undefined` | Triggered when an inline cell edit is saved. |
| `bulkActions` | `(selectedRows, table) => ReactNode` | `undefined` | Custom action buttons rendered in the selection bar. |
