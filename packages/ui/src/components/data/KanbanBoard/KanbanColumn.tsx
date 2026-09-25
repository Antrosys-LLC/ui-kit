import React, { useState, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { clsx } from "clsx";
import type { KanbanColumn as IKanbanColumn, KanbanCard as IKanbanCard, KanbanPriority } from "./types";
import { KanbanCard } from "./KanbanCard";
import { KanbanCardQuickAdd } from "./KanbanCardQuickAdd";

interface KanbanColumnProps {
  column: IKanbanColumn;
  cards: IKanbanCard[];
  onOpenDetails?: (card: IKanbanCard) => void;
  onAddCard?: (columnId: string, title: string, priority: KanbanPriority) => void;
  onDeleteColumn?: (columnId: string) => void;
  cardTemplate?: (card: IKanbanCard, isDragging: boolean) => ReactNode;
  allowQuickAdd?: boolean;
  readOnly?: boolean;
}

export function KanbanColumn({
  column,
  cards,
  onOpenDetails,
  onAddCard,
  onDeleteColumn,
  cardTemplate,
  allowQuickAdd = true,
  readOnly = false,
}: KanbanColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: readOnly || column.isLocked,
  });

  const cardIds = cards.map((c) => c.id);
  const cardCount = cards.length;
  const isOverWipLimit = column.wipLimit !== undefined && cardCount > column.wipLimit;

  const handleQuickAdd = (title: string, priority: KanbanPriority) => {
    onAddCard?.(column.id, title, priority);
    setIsAddingCard(false);
  };

  const accentColor = column.color || "var(--ant-color-brand-primary)";

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex flex-col flex-shrink-0 w-80 max-w-full rounded-2xl border transition-all duration-200",
        "border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] shadow-xs",
        isOver && "ring-2 ring-[var(--ant-color-brand-primary)] bg-[var(--ant-color-brand-primary-lt)]/15",
        isOverWipLimit && "border-amber-400 dark:border-amber-600"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-[var(--ant-color-surface-border)] px-4 py-3.5 bg-[var(--ant-color-surface-bg-card)] rounded-t-2xl">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Accent Color Dot / Pill */}
          <span
            style={{ backgroundColor: accentColor }}
            className="h-3 w-3 rounded-full flex-shrink-0 shadow-xs"
          />

          {column.icon && <span className="text-sm">{column.icon}</span>}

          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ant-color-surface-text)] truncate">
            {column.title}
          </h3>

          {/* WIP Limit / Card Count Badge */}
          <span
            className={clsx(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition",
              isOverWipLimit
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-400"
                : "bg-[var(--ant-color-neutral-200)]/70 text-[var(--ant-color-surface-text-sub)]"
            )}
            title={
              isOverWipLimit
                ? `WIP limit exceeded! (${cardCount}/${column.wipLimit})`
                : column.wipLimit
                ? `WIP Limit: ${column.wipLimit}`
                : `${cardCount} tasks`
            }
          >
            {isOverWipLimit && <span>⚠️</span>}
            <span>{cardCount}</span>
            {column.wipLimit !== undefined && (
              <span className="opacity-70 font-normal">/ {column.wipLimit}</span>
            )}
          </span>
        </div>

        {/* Header Action Buttons */}
        {!readOnly && (
          <div className="flex items-center gap-1">
            {allowQuickAdd && (
              <button
                onClick={() => setIsAddingCard(!isAddingCard)}
                title="Add task to column"
                className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--ant-color-surface-text-sub)] hover:bg-[var(--ant-color-neutral-200)]/60 hover:text-[var(--ant-color-surface-text)] transition"
              >
                +
              </button>
            )}

            {onDeleteColumn && (
              <button
                onClick={() => onDeleteColumn(column.id)}
                title="Delete column"
                className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--ant-color-surface-text-sub)] hover:bg-rose-50 hover:text-rose-600 transition"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cards List Drop Zone */}
      <div className="flex flex-col flex-1 gap-2.5 p-3 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[140px]">
        {/* Inline Quick Add Form */}
        {isAddingCard && (
          <KanbanCardQuickAdd
            columnId={column.id}
            onAddCard={handleQuickAdd}
            onCancel={() => setIsAddingCard(false)}
          />
        )}

        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              disabled={readOnly}
              onOpenDetails={onOpenDetails}
              cardTemplate={cardTemplate}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && !isAddingCard && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--ant-color-surface-border)] p-6 text-center text-xs text-[var(--ant-color-surface-text-sub)]">
            <span className="text-xl opacity-40">📥</span>
            <span className="mt-1 font-medium">No tasks here</span>
            <span className="text-[10px] opacity-70">Drag items here or click + to add</span>
          </div>
        )}
      </div>

      {/* Column Footer: Quick Add button */}
      {!readOnly && allowQuickAdd && !isAddingCard && (
        <div className="p-2.5 border-t border-[var(--ant-color-surface-border)]/60 bg-[var(--ant-color-surface-bg-card)]/50 rounded-b-2xl">
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-[var(--ant-color-surface-text-sub)] transition hover:bg-[var(--ant-color-brand-primary-lt)]/30 hover:text-[var(--ant-color-brand-primary)]"
          >
            <span>+</span>
            <span>Add task</span>
          </button>
        </div>
      )}
    </div>
  );
}
