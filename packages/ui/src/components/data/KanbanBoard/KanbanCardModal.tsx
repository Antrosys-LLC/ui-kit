import React, { useState, useEffect, useRef } from "react";
import type {
  KanbanCard,
  KanbanColumn,
  KanbanPriority,
  KanbanChecklistItem,
} from "./types";
import { Button } from "../../feedback/Button";
import { clsx } from "clsx";

interface KanbanCardModalProps {
  card: KanbanCard | null;
  columns: KanbanColumn[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: KanbanCard) => void;
  onDelete?: (cardId: string) => void;
}

export function KanbanCardModal({
  card,
  columns,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: KanbanCardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState("");
  const [priority, setPriority] = useState<KanbanPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [checklist, setChecklist] = useState<KanbanChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (card) {
      setTitle(card.title || "");
      setDescription(card.description || "");
      setColumnId(card.columnId || "");
      setPriority(card.priority || "medium");
      setDueDate(card.dueDate || "");
      setChecklist(card.checklist ? [...card.checklist] : []);
    }
  }, [card]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...card,
      title: title.trim(),
      description: description.trim(),
      columnId,
      priority,
      dueDate: dueDate || undefined,
      checklist,
    });
    onClose();
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: `check-${Date.now()}`,
        title: newChecklistText.trim(),
        completed: false,
      },
    ]);
    setNewChecklistText("");
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-xl max-h-[90vh] overflow-hidden rounded-2xl border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] shadow-2xl animate-scaleUp"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--ant-color-surface-border)] px-6 py-4 bg-[var(--ant-color-surface-bg)]/80">
          <div className="flex items-center gap-2">
            <span className="text-sm">📝</span>
            <h3 className="text-sm font-bold text-[var(--ant-color-surface-text)]">
              Task Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--ant-color-surface-text-sub)] hover:bg-[var(--ant-color-neutral-200)] hover:text-[var(--ant-color-surface-text)] transition"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[var(--ant-color-surface-text-sub)] uppercase tracking-wider mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] px-3 py-2 text-sm font-semibold text-[var(--ant-color-surface-text)] focus:border-[var(--ant-color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ant-color-brand-primary)]/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--ant-color-surface-text-sub)] uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add additional context or notes..."
              className="w-full rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] p-3 text-xs text-[var(--ant-color-surface-text)] placeholder-[var(--ant-color-surface-text-sub)] focus:border-[var(--ant-color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ant-color-brand-primary)]/20"
            />
          </div>

          {/* Meta Grid: Column, Priority, Due Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Column / Status */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--ant-color-surface-text-sub)] uppercase tracking-wider mb-1">
                Column
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] px-2.5 py-1.5 text-xs text-[var(--ant-color-surface-text)] focus:border-[var(--ant-color-brand-primary)] focus:outline-none"
              >
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--ant-color-surface-text-sub)] uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as KanbanPriority)}
                className="w-full rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] px-2.5 py-1.5 text-xs text-[var(--ant-color-surface-text)] focus:border-[var(--ant-color-brand-primary)] focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--ant-color-surface-text-sub)] uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] px-2.5 py-1.5 text-xs text-[var(--ant-color-surface-text)] focus:border-[var(--ant-color-brand-primary)] focus:outline-none"
              />
            </div>
          </div>

          {/* Checklist / Subtasks Section */}
          <div className="space-y-2 border-t border-[var(--ant-color-surface-border)]/60 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--ant-color-surface-text-sub)] uppercase tracking-wider">
                Checklist ({checklist.filter((i) => i.completed).length}/{checklist.length})
              </label>
            </div>

            <div className="space-y-1.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-[var(--ant-color-surface-bg)] px-3 py-1.5 text-xs"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="h-3.5 w-3.5 rounded border-[var(--ant-color-surface-border)] text-[var(--ant-color-brand-primary)]"
                    />
                    <span className={clsx("text-[var(--ant-color-surface-text)]", item.completed && "line-through opacity-60")}>
                      {item.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id)}
                    className="text-[var(--ant-color-surface-text-sub)] hover:text-rose-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add checklist item */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="Add subtask item..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddChecklistItem(e);
                  }
                }}
                className="flex-1 rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] px-2.5 py-1 text-xs text-[var(--ant-color-surface-text)] focus:border-[var(--ant-color-brand-primary)] focus:outline-none"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddChecklistItem}
                className="!px-2.5 h-7 text-xs"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-[var(--ant-color-surface-border)] pt-4 mt-4">
            {onDelete ? (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this task?")) {
                    onDelete(card.id);
                    onClose();
                  }
                }}
                className="!px-3 h-8 text-xs"
              >
                Delete Task
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose} className="!px-3 h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="!px-4 h-8 text-xs">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
