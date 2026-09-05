import React, { useState, useEffect, useRef } from "react";
import type { DataTableColumnMeta } from "./types";

interface DataTableCellEditorProps<TData> {
  value: any;
  row: TData;
  rowIndex: number;
  columnId: string;
  meta?: DataTableColumnMeta<TData>;
  onSave: (val: any) => void;
  onCancel: () => void;
}

export function DataTableCellEditor<TData>({
  value: initialValue,
  row,
  meta,
  onSave,
  onCancel,
}: DataTableCellEditorProps<TData>) {
  const [value, setValue] = useState(initialValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    setValue(initialValue ?? "");
    inputRef.current?.focus();
  }, [initialValue]);

  const handleCommit = () => {
    if (meta?.validate) {
      const validationResult = meta.validate(value, row);
      if (typeof validationResult === "string") {
        setError(validationResult);
        return;
      }
      if (validationResult === false) {
        setError("Invalid input value");
        return;
      }
    }
    setError(null);
    onSave(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const editType = meta?.editType || "text";

  return (
    <div className="relative flex items-center w-full min-w-[120px]" onClick={(e) => e.stopPropagation()}>
      {editType === "select" && meta?.editOptions ? (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleCommit}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-surface-bg-card)] px-2 py-1 text-xs font-medium text-[var(--ant-color-surface-text)] shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--ant-color-brand-primary)]/40"
        >
          {meta.editOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : editType === "boolean" ? (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => {
              setValue(e.target.checked);
              onSave(e.target.checked);
            }}
            onKeyDown={handleKeyDown}
            className="h-4 w-4 rounded border-[var(--ant-color-surface-border)] text-[var(--ant-color-brand-primary)] focus:ring-[var(--ant-color-brand-primary)]"
          />
          <span className="text-xs text-[var(--ant-color-surface-text-sub)]">
            {value ? "Active" : "Inactive"}
          </span>
        </div>
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={editType === "number" ? "number" : editType === "date" ? "date" : "text"}
          value={value}
          onChange={(e) => setValue(editType === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
          onBlur={handleCommit}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-surface-bg-card)] px-2 py-1 text-xs text-[var(--ant-color-surface-text)] shadow-xs transition focus:outline-none focus:ring-2 focus:ring-[var(--ant-color-brand-primary)]/40"
        />
      )}

      {error && (
        <div className="absolute top-full left-0 z-50 mt-1 rounded bg-[var(--ant-color-semantic-error)] px-2 py-0.5 text-[10px] font-medium text-white shadow-md">
          {error}
        </div>
      )}
    </div>
  );
}
