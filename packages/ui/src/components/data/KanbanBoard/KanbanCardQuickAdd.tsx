import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../feedback/Button";
import type { KanbanPriority } from "./types";

interface KanbanCardQuickAddProps {
  columnId: string;
  onAddCard: (title: string, priority: KanbanPriority) => void;
  onCancel: () => void;
}

export function KanbanCardQuickAdd({
  columnId: _columnId,
  onAddCard,
  onCancel,
}: KanbanCardQuickAddProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<KanbanPriority>("medium");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddCard(title.trim(), priority);
    setTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-xl border border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-surface-bg-card)] p-3 shadow-md animate-fadeIn"
    >
      <textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter task title... (Press Enter to save)"
        rows={2}
        className="w-full resize-none rounded-lg border-0 bg-transparent p-1 text-xs font-medium text-[var(--ant-color-surface-text)] placeholder-[var(--ant-color-surface-text-sub)] focus:outline-none"
      />

      <div className="flex items-center justify-between border-t border-[var(--ant-color-surface-border)]/60 pt-2">
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-[var(--ant-color-surface-text-sub)]">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as KanbanPriority)}
            className="rounded border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] px-1.5 py-0.5 text-[10px] text-[var(--ant-color-surface-text)] focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="!px-2 h-6 text-[11px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!title.trim()}
            className="!px-2.5 h-6 text-[11px]"
          >
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
}
