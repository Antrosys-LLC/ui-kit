import React, { useState, ReactNode } from "react";
import type { KanbanPriority } from "./types";
import { Button } from "../../feedback/Button";

interface KanbanToolbarProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedPriority: KanbanPriority | "all";
  onPriorityChange: (p: KanbanPriority | "all") => void;
  selectedLabel: string | "all";
  onLabelChange: (lbl: string | "all") => void;
  availableLabels: Array<{ id: string; name: string }>;
  totalCards: number;
  columnsCount: number;
  allowAddColumn?: boolean;
  onAddColumn?: (title: string, color: string, wipLimit?: number) => void;
}

export function KanbanToolbar({
  title,
  description,
  actions,
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  selectedLabel,
  onLabelChange,
  availableLabels,
  totalCards,
  columnsCount,
  allowAddColumn = false,
  onAddColumn,
}: KanbanToolbarProps) {
  const [isAddingCol, setIsAddingCol] = useState(false);
  const [newColTitle, setNewColTitle] = useState("");
  const [newColColor, setNewColColor] = useState("#7C3AED");
  const [newColWip, setNewColWip] = useState("");

  const handleCreateColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;
    onAddColumn?.(
      newColTitle.trim(),
      newColColor,
      newColWip ? Number(newColWip) : undefined
    );
    setNewColTitle("");
    setNewColWip("");
    setIsAddingCol(false);
  };

  return (
    <div className="flex flex-col gap-3 border-b border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] p-4 sm:p-5">
      {/* Top Row: Title, Description, Stats & Actions */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {title && (
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-[var(--ant-color-surface-text)] sm:text-lg">
                {title}
              </h2>
              <span className="inline-flex items-center rounded-full bg-[var(--ant-color-brand-primary-lt)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ant-color-brand-primary)]">
                {totalCards} tasks · {columnsCount} columns
              </span>
            </div>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-[var(--ant-color-surface-text-sub)]">
              {description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {actions}
          {allowAddColumn && onAddColumn && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddingCol(!isAddingCol)}
              className="h-8 text-xs font-semibold"
            >
              + Add Column
            </Button>
          )}
        </div>
      </div>

      {/* Add Column Popover Modal/Form */}
      {isAddingCol && (
        <form
          onSubmit={handleCreateColumn}
          className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-surface-bg)] p-3 shadow-md animate-fadeIn"
        >
          <input
            type="text"
            value={newColTitle}
            onChange={(e) => setNewColTitle(e.target.value)}
            placeholder="Column Name (e.g. In Review)"
            required
            className="flex-1 min-w-[160px] rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] px-2.5 py-1 text-xs text-[var(--ant-color-surface-text)] focus:outline-none"
          />

          <div className="flex items-center gap-1.5 text-xs text-[var(--ant-color-surface-text-sub)]">
            <span>Color:</span>
            <input
              type="color"
              value={newColColor}
              onChange={(e) => setNewColColor(e.target.value)}
              className="h-6 w-7 cursor-pointer rounded border-0 bg-transparent"
            />
          </div>

          <input
            type="number"
            min={1}
            value={newColWip}
            onChange={(e) => setNewColWip(e.target.value)}
            placeholder="WIP Limit (optional)"
            className="w-32 rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] px-2 py-1 text-xs text-[var(--ant-color-surface-text)] focus:outline-none"
          />

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingCol(false)}
              className="h-7 text-xs !px-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!newColTitle.trim()}
              className="h-7 text-xs !px-3"
            >
              Create
            </Button>
          </div>
        </form>
      )}

      {/* Filter Row: Search, Priority Filter, Label Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <svg
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ant-color-surface-text-sub)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter tasks by title or text..."
            className="w-full rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] py-1.5 pr-7 pl-8.5 text-xs text-[var(--ant-color-surface-text)] placeholder-[var(--ant-color-surface-text-sub)] focus:border-[var(--ant-color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ant-color-brand-primary)]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Priority & Label Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[var(--ant-color-surface-text-sub)] font-medium">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value as any)}
              className="rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] px-2 py-1 text-xs font-medium text-[var(--ant-color-surface-text)] focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">⚪ Low</option>
            </select>
          </div>

          {/* Label filter */}
          {availableLabels.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[var(--ant-color-surface-text-sub)] font-medium">Label:</span>
              <select
                value={selectedLabel}
                onChange={(e) => onLabelChange(e.target.value)}
                className="rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] px-2 py-1 text-xs font-medium text-[var(--ant-color-surface-text)] focus:outline-none"
              >
                <option value="all">All Labels</option>
                {availableLabels.map((lbl) => (
                  <option key={lbl.id} value={lbl.name}>
                    {lbl.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
