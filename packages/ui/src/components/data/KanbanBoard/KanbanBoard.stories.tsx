import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { KanbanBoard } from "./KanbanBoard";
import type { KanbanColumn, KanbanCard } from "./types";

const INITIAL_COLUMNS: KanbanColumn[] = [
  { id: "col-backlog", title: "Backlog", color: "#64748B", wipLimit: 8 },
  { id: "col-in-progress", title: "In Progress", color: "#3B82F6", wipLimit: 3 },
  { id: "col-review", title: "Code Review", color: "#F59E0B", wipLimit: 2 },
  { id: "col-done", title: "Completed", color: "#10B981" },
];

const INITIAL_CARDS: KanbanCard[] = [
  {
    id: "card-1",
    columnId: "col-in-progress",
    title: "Implement TanStack Table virtual scrolling",
    description: "Support rendering 10,000+ rows seamlessly with high FPS and pinned headers.",
    priority: "urgent",
    dueDate: "2026-09-02",
    labels: [
      { id: "lbl-1", name: "Feature", bg: "#EDE9FE", color: "#7C3AED" },
      { id: "lbl-2", name: "Core", bg: "#E0F2FE", color: "#0284C7" },
    ],
    assignees: [
      { id: "usr-1", name: "Ryda Design", initials: "RD", role: "Lead UX" },
      { id: "usr-2", name: "Alex Chen", initials: "AC", role: "Dev" },
    ],
    checklist: [
      { id: "chk-1", title: "Estimate row height dynamic calculation", completed: true },
      { id: "chk-2", title: "Test scrollbar inertia on mobile devices", completed: true },
      { id: "chk-3", title: "Verify column pinning sticky offset", completed: false },
    ],
    attachmentsCount: 3,
    commentsCount: 6,
  },
  {
    id: "card-2",
    columnId: "col-in-progress",
    title: "DnD-Kit Kanban drag overlay & drop sensors",
    description: "Add smooth spring animations and collision detection for card reordering.",
    priority: "high",
    dueDate: "2026-09-05",
    labels: [
      { id: "lbl-3", name: "UI/UX", bg: "#FCE7F3", color: "#DB2777" },
    ],
    assignees: [
      { id: "usr-1", name: "Ryda Design", initials: "RD" },
    ],
    checklist: [
      { id: "chk-4", title: "Configure pointerSensor activation distance", completed: true },
      { id: "chk-5", title: "Test cross-column card transfer", completed: true },
    ],
    commentsCount: 4,
  },
  {
    id: "card-3",
    columnId: "col-backlog",
    title: "Excel XML & CSV client-side export utility",
    description: "Ensure proper UTF-8 BOM encoding for special international characters.",
    priority: "medium",
    dueDate: "2026-09-10",
    labels: [
      { id: "lbl-1", name: "Feature", bg: "#EDE9FE", color: "#7C3AED" },
    ],
    assignees: [
      { id: "usr-3", name: "Sarah Connor", initials: "SC" },
    ],
    checklist: [
      { id: "chk-6", title: "Format headers correctly", completed: true },
      { id: "chk-7", title: "Escape comma and quotation marks", completed: false },
    ],
    attachmentsCount: 1,
  },
  {
    id: "card-4",
    columnId: "col-review",
    title: "Responsive card view breakpoint styling",
    description: "Verify cards look sleek on viewports smaller than 640px.",
    priority: "medium",
    dueDate: "2026-09-01",
    labels: [
      { id: "lbl-3", name: "UI/UX", bg: "#FCE7F3", color: "#DB2777" },
    ],
    assignees: [
      { id: "usr-1", name: "Ryda Design", initials: "RD" },
    ],
    commentsCount: 2,
  },
  {
    id: "card-5",
    columnId: "col-done",
    title: "Theme Token CSS Variable integration",
    description: "Design system tokens wired up to Tailwind theme configuration.",
    priority: "low",
    labels: [
      { id: "lbl-2", name: "Core", bg: "#E0F2FE", color: "#0284C7" },
    ],
    assignees: [
      { id: "usr-2", name: "Alex Chen", initials: "AC" },
    ],
    checklist: [
      { id: "chk-8", title: "Build tokens script", completed: true },
      { id: "chk-9", title: "Export css and tailwind presets", completed: true },
    ],
  },
];

const meta: Meta<typeof KanbanBoard> = {
  title: "Data & Content Display/KanbanBoard",
  component: KanbanBoard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Antrosys Drag-and-drop Kanban Board built with dnd-kit. Features customizable columns, card labels, assignees avatar stack, due dates, WIP limit alerts, horizontal scroll layout, quick task creation, and card details modal.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const DefaultSprintBoard: Story = {
  render: () => {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <KanbanBoard
          title="Product Engineering Sprint 42"
          description="Drag cards across columns to transition task states. Click any task to inspect details."
          columns={INITIAL_COLUMNS}
          cards={INITIAL_CARDS}
          allowQuickAdd
          allowAddColumn
        />
      </div>
    );
  },
};

export const WipLimitsAndWarnings: Story = {
  render: () => {
    // Column with tight WIP limit to trigger warning badge
    const wipColumns: KanbanColumn[] = [
      { id: "col-todo", title: "To Do", color: "#64748B", wipLimit: 4 },
      { id: "col-in-dev", title: "Active Dev (WIP Limit: 1)", color: "#7C3AED", wipLimit: 1 },
      { id: "col-done", title: "Done", color: "#10B981" },
    ];

    const wipCards: KanbanCard[] = [
      { id: "c-1", columnId: "col-in-dev", title: "Fix memory leak in websocket stream", priority: "urgent" },
      { id: "c-2", columnId: "col-in-dev", title: "Implement OAuth refresh token rotation", priority: "high" },
      { id: "c-3", columnId: "col-todo", title: "Write end-to-end Cypress tests", priority: "medium" },
      { id: "c-4", columnId: "col-done", title: "Design token schema update", priority: "low" },
    ];

    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
          ⚠️ <strong>WIP Limit Warning Demo:</strong> The "Active Dev" column has a limit of 1 task but currently contains 2 tasks. Notice the warning badge and border highlight.
        </div>
        <KanbanBoard
          title="Strict WIP Limits Workflow"
          description="Enforces team throughput and visualizes process bottlenecks."
          columns={wipColumns}
          cards={wipCards}
          allowQuickAdd
        />
      </div>
    );
  },
};

export const CustomCardTemplate: Story = {
  render: () => {
    const customCards: KanbanCard[] = [
      {
        id: "ticket-101",
        columnId: "col-in-progress",
        title: "Enterprise Deal: Cloud Migration",
        priority: "urgent",
        customData: { value: "$45,000", client: "Acme Corp", health: "98%" },
      },
      {
        id: "ticket-102",
        columnId: "col-backlog",
        title: "Security Audit Renewal",
        priority: "medium",
        customData: { value: "$12,000", client: "Globex Inc", health: "85%" },
      },
      {
        id: "ticket-103",
        columnId: "col-done",
        title: "Annual Platform License Renewal",
        priority: "low",
        customData: { value: "$80,000", client: "Stark Industries", health: "100%" },
      },
    ];

    return (
      <div className="p-4 max-w-6xl mx-auto">
        <KanbanBoard
          title="Sales Pipeline & Deal Flow"
          description="Rendering custom card designs using the `cardTemplate` prop."
          columns={INITIAL_COLUMNS.slice(0, 3)}
          cards={customCards}
          cardTemplate={(card, isDragging) => (
            <div className={`p-4 rounded-xl border border-[var(--ant-color-brand-primary)]/40 bg-gradient-to-br from-[var(--ant-color-surface-bg-card)] to-[var(--ant-color-brand-primary-lt)]/20 shadow-sm transition hover:shadow-md ${isDragging ? "rotate-2 scale-102" : ""}`}>
              <div className="flex items-center justify-between text-xs font-bold text-[var(--ant-color-brand-primary)]">
                <span>{card.customData?.client}</span>
                <span className="rounded-full bg-[var(--ant-color-brand-primary)] px-2 py-0.5 text-[10px] text-white">
                  {card.customData?.value}
                </span>
              </div>
              <h4 className="mt-2 text-xs font-semibold text-[var(--ant-color-surface-text)]">
                {card.title}
              </h4>
              <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--ant-color-surface-text-sub)] border-t border-[var(--ant-color-surface-border)] pt-2">
                <span>Account Health</span>
                <span className="font-bold text-emerald-600">{card.customData?.health}</span>
              </div>
            </div>
          )}
        />
      </div>
    );
  },
};

export const ManyColumnsHorizontalScroll: Story = {
  render: () => {
    const manyColumns: KanbanColumn[] = [
      { id: "c-triage", title: "1. Triage", color: "#64748B", wipLimit: 10 },
      { id: "c-design", title: "2. UI/UX Design", color: "#EC4899", wipLimit: 4 },
      { id: "c-spec", title: "3. Tech Spec", color: "#8B5CF6", wipLimit: 3 },
      { id: "c-dev", title: "4. Development", color: "#3B82F6", wipLimit: 5 },
      { id: "c-qa", title: "5. QA & Staging", color: "#F59E0B", wipLimit: 3 },
      { id: "c-release", title: "6. Production Release", color: "#10B981" },
    ];

    const sampleCards: KanbanCard[] = [
      { id: "m-1", columnId: "c-triage", title: "User feedback on dark mode contrast", priority: "low" },
      { id: "m-2", columnId: "c-design", title: "Figma specs for Data Table filters", priority: "urgent" },
      { id: "m-3", columnId: "c-spec", title: "Architecture RFC: TanStack Virtual integration", priority: "high" },
      { id: "m-4", columnId: "c-dev", title: "Build sortable header pinning engine", priority: "high" },
      { id: "m-5", columnId: "c-qa", title: "Regression test keyboard navigation", priority: "medium" },
      { id: "m-6", columnId: "c-release", title: "Deploy v0.2.0 component library package", priority: "low" },
    ];

    return (
      <div className="p-4 max-w-full mx-auto">
        <KanbanBoard
          title="Full End-to-End Product Lifecycle"
          description="Smooth horizontal scroll layout supporting complex multi-stage release boards."
          columns={manyColumns}
          cards={sampleCards}
          allowAddColumn
          allowQuickAdd
        />
      </div>
    );
  },
};
