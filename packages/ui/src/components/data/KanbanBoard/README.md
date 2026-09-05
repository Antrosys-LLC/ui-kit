# KanbanBoard

An accessible, modern Drag-and-Drop Kanban Board component built with **dnd-kit** and **Antrosys Design Tokens**.

## Features

- 🎯 **dnd-kit Drag-and-Drop**: Butter-smooth dragging across and within columns with pointer and keyboard sensor support.
- 🎨 **Customizable Columns & Cards**: Accent colors, icons, labels, priority pills, and rich metadata.
- 👥 **Assignee Avatars**: Overlapping avatar stack with tooltip details.
- 📅 **Due Dates & Overdue Alerts**: Visual countdown badges with overdue highlight states.
- ⚠️ **WIP (Work-In-Progress) Limits**: Real-time card count vs column limit indicator with warning alerts.
- 📜 **Horizontal Scroll Layout**: Smooth horizontal scrolling for multi-stage pipelines.
- ✏️ **Card Details Modal**: In-depth inspection modal with subtasks checklist, description editor, and priority manager.
- ⚡ **Quick Task Composer**: Instant inline card creation with keyboard shortcuts (`Enter` to submit).
- 🔍 **Real-Time Filtering**: Search tasks by keywords, filter by priority, or filter by custom label chips.
- 🧩 **Custom Card Template**: Slot in custom card layouts via the `cardTemplate` prop.
- 🌓 **Theme Support**: Seamless dark and light mode styling.

## Installation & Import

```tsx
import { KanbanBoard, type KanbanColumnType, type KanbanCardType } from "@antrosys/ui";
```

## Basic Usage

```tsx
import { KanbanBoard, type KanbanColumnType, type KanbanCardType } from "@antrosys/ui";

const columns: KanbanColumnType[] = [
  { id: "todo", title: "To Do", color: "#64748B", wipLimit: 5 },
  { id: "doing", title: "In Progress", color: "#3B82F6", wipLimit: 3 },
  { id: "done", title: "Done", color: "#10B981" },
];

const cards: KanbanCardType[] = [
  {
    id: "card-1",
    columnId: "doing",
    title: "Implement Data Table component",
    priority: "urgent",
    dueDate: "2026-09-02",
    labels: [{ id: "l1", name: "Feature", color: "#7C3AED", bg: "#EDE9FE" }],
  },
];

export function ProjectBoard() {
  return (
    <KanbanBoard
      title="Engineering Sprint"
      columns={columns}
      cards={cards}
      onCardMove={(event, updatedCards) => {
        console.log("Card moved:", event);
      }}
    />
  );
}
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `KanbanColumn[]` | **Required** | Column definitions. |
| `cards` | `KanbanCard[]` | **Required** | Array of task cards. |
| `onCardMove` | `(event, updatedCards) => void` | `undefined` | Fired when a card is dropped in a new position/column. |
| `onCardUpdate` | `(card) => void` | `undefined` | Fired when card details are modified in modal. |
| `onCardCreate` | `(card) => void` | `undefined` | Fired when a new card is added. |
| `cardTemplate` | `(card, isDragging) => ReactNode` | `undefined` | Custom renderer for card contents. |
| `allowQuickAdd` | `boolean` | `true` | Enables inline task composer inside columns. |
| `allowAddColumn` | `boolean` | `true` | Enables adding new columns from toolbar. |
| `showToolbar` | `boolean` | `true` | Displays search and filter toolbar. |
| `readOnly` | `boolean` | `false` | Disables drag-and-drop and editing actions. |
