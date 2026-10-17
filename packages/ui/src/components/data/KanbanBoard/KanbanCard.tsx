import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "clsx";
import type { KanbanCard as IKanbanCard, KanbanPriority } from "./types";

interface KanbanCardProps {
  card: IKanbanCard;
  isOverlay?: boolean;
  disabled?: boolean;
  onOpenDetails?: (card: IKanbanCard) => void;
  cardTemplate?: (card: IKanbanCard, isDragging: boolean) => React.ReactNode;
}

const PRIORITY_STYLES: Record<
  KanbanPriority,
  { label: string; bg: string; text: string; dot: string }
> = {
  low: {
    label: "Low",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-300",
    dot: "bg-slate-400",
  },
  medium: {
    label: "Medium",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  high: {
    label: "High",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  urgent: {
    label: "Urgent",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

export function KanbanCard({
  card,
  isOverlay = false,
  disabled = false,
  onOpenDetails,
  cardTemplate,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: disabled || isOverlay,
    data: {
      type: "Card",
      card,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  if (cardTemplate) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => onOpenDetails?.(card)}
        className={clsx(
          "cursor-grab active:cursor-grabbing focus:outline-none",
          isOverlay && "rotate-2 shadow-2xl scale-102 ring-2 ring-[var(--ant-color-brand-primary)]"
        )}
      >
        {cardTemplate(card, isDragging || isOverlay)}
      </div>
    );
  }

  // Checklist calculations
  const totalChecklist = card.checklist?.length || 0;
  const completedChecklist =
    card.checklist?.filter((item) => item.completed).length || 0;

  // Due date status
  const isOverdue =
    card.dueDate &&
    new Date(card.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  const priorityMeta = card.priority ? PRIORITY_STYLES[card.priority] : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpenDetails?.(card)}
      className={clsx(
        "group relative flex flex-col gap-2.5 rounded-xl border p-3.5 text-left transition-all duration-150 select-none",
        "border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] shadow-xs",
        "hover:border-[var(--ant-color-brand-primary)]/50 hover:shadow-md cursor-grab active:cursor-grabbing",
        isOverlay && "rotate-2 shadow-2xl scale-102 ring-2 ring-[var(--ant-color-brand-primary)] opacity-100 z-50",
        isDragging && "opacity-30"
      )}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${card.title}`}
    >
      {/* Top Meta: Labels & Priority */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        {/* Labels list */}
        {card.labels && card.labels.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1">
            {card.labels.map((lbl) => (
              <span
                key={lbl.id}
                style={{
                  backgroundColor: lbl.bg || "var(--ant-color-brand-primary-lt)",
                  color: lbl.color || "var(--ant-color-brand-primary)",
                }}
                className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide"
              >
                {lbl.name}
              </span>
            ))}
          </div>
        ) : (
          <div />
        )}

        {/* Priority Badge */}
        {priorityMeta && (
          <span
            className={clsx(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              priorityMeta.bg,
              priorityMeta.text
            )}
          >
            <span className={clsx("h-1.5 w-1.5 rounded-full", priorityMeta.dot)} />
            {priorityMeta.label}
          </span>
        )}
      </div>

      {/* Card Title */}
      <h4 className="text-xs font-semibold text-[var(--ant-color-surface-text)] leading-snug line-clamp-2">
        {card.title}
      </h4>

      {/* Description Preview (if any) */}
      {card.description && (
        <p className="text-[11px] text-[var(--ant-color-surface-text-sub)] line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Subtasks Progress Bar (if checklist items exist) */}
      {totalChecklist > 0 && (
        <div className="mt-1 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[var(--ant-color-surface-text-sub)]">
            <span className="flex items-center gap-1 font-medium">
              <svg className="h-3 w-3 text-[var(--ant-color-brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Checklist
            </span>
            <span className="font-semibold">{completedChecklist}/{totalChecklist}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[var(--ant-color-surface-bg)] overflow-hidden">
            <div
              className={clsx(
                "h-full rounded-full transition-all duration-300",
                completedChecklist === totalChecklist
                  ? "bg-[var(--ant-color-semantic-success)]"
                  : "bg-[var(--ant-color-brand-primary)]"
              )}
              style={{ width: `${(completedChecklist / totalChecklist) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Footer: Due Date, Counters & Assignees */}
      <div className="flex items-center justify-between border-t border-[var(--ant-color-surface-border)]/60 pt-2.5 mt-0.5 text-[11px] text-[var(--ant-color-surface-text-sub)]">
        <div className="flex items-center gap-2">
          {/* Due date */}
          {card.dueDate && (
            <span
              className={clsx(
                "inline-flex items-center gap-1 font-medium text-[10px]",
                isOverdue
                  ? "text-[var(--ant-color-semantic-error)] font-semibold"
                  : "text-[var(--ant-color-surface-text-sub)]"
              )}
              title={isOverdue ? "Overdue task!" : `Due: ${card.dueDate}`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {card.dueDate}
            </span>
          )}

          {/* Attachments counter */}
          {(card.attachmentsCount || 0) > 0 && (
            <span className="flex items-center gap-0.5 text-[10px]" title={`${card.attachmentsCount} attachments`}>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {card.attachmentsCount}
            </span>
          )}

          {/* Comments counter */}
          {(card.commentsCount || 0) > 0 && (
            <span className="flex items-center gap-0.5 text-[10px]" title={`${card.commentsCount} comments`}>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {card.commentsCount}
            </span>
          )}
        </div>

        {/* Assignees Stack */}
        {card.assignees && card.assignees.length > 0 && (
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {card.assignees.slice(0, 3).map((assignee) => (
              <div
                key={assignee.id}
                title={`${assignee.name}${assignee.role ? ` (${assignee.role})` : ""}`}
                className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-[var(--ant-color-surface-bg-card)] bg-[var(--ant-color-brand-primary)] text-[9px] font-bold text-white shadow-xs overflow-hidden"
              >
                {assignee.avatarUrl ? (
                  <img src={assignee.avatarUrl} alt={assignee.name} className="h-full w-full object-cover" />
                ) : (
                  assignee.initials || assignee.name.slice(0, 2).toUpperCase()
                )}
              </div>
            ))}
            {card.assignees.length > 3 && (
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-[var(--ant-color-surface-bg-card)] bg-[var(--ant-color-neutral-400)] text-[9px] font-semibold text-white">
                +{card.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
