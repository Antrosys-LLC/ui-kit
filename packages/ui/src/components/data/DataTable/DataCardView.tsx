import React, { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";
import { clsx } from "clsx";

interface DataCardViewProps<TData> {
  table: Table<TData>;
  selectable?: boolean;
  onRowClick?: (row: TData, index: number) => void;
  cardTemplate?: (row: TData, index: number, isSelected: boolean) => ReactNode;
}

export function DataCardView<TData>({
  table,
  selectable,
  onRowClick,
  cardTemplate,
}: DataCardViewProps<TData>) {
  const rows = table.getRowModel().rows;
  const visibleColumns = table
    .getVisibleLeafColumns()
    .filter((col) => col.id !== "_select" && col.id !== "_actions");

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-[var(--ant-color-surface-text-sub)]">
        <svg className="mb-3 h-10 w-10 text-[var(--ant-color-neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm font-medium">No matching records found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {rows.map((row, idx) => {
        const isSelected = row.getIsSelected();

        if (cardTemplate) {
          return (
            <div
              key={row.id}
              onClick={() => onRowClick?.(row.original, idx)}
              className={clsx(
                "relative rounded-xl border transition duration-200 cursor-pointer overflow-hidden",
                isSelected
                  ? "border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-brand-primary-lt)]/30 ring-2 ring-[var(--ant-color-brand-primary)]/40"
                  : "border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] hover:border-[var(--ant-color-brand-primary)]/50 hover:shadow-md"
              )}
            >
              {selectable && (
                <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={row.getToggleSelectedHandler()}
                    className="h-4 w-4 rounded border-[var(--ant-color-surface-border)] text-[var(--ant-color-brand-primary)] focus:ring-[var(--ant-color-brand-primary)]"
                  />
                </div>
              )}
              {cardTemplate(row.original, idx, isSelected)}
            </div>
          );
        }

        return (
          <div
            key={row.id}
            onClick={() => onRowClick?.(row.original, idx)}
            className={clsx(
              "group relative flex flex-col justify-between rounded-xl border p-4.5 transition duration-200 cursor-pointer",
              isSelected
                ? "border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-brand-primary-lt)]/20 ring-2 ring-[var(--ant-color-brand-primary)]/30 shadow-xs"
                : "border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] hover:border-[var(--ant-color-brand-primary)]/50 hover:shadow-md"
            )}
          >
            {selectable && (
              <div className="absolute top-3.5 right-3.5" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={row.getToggleSelectedHandler()}
                  className="h-4 w-4 rounded border-[var(--ant-color-surface-border)] text-[var(--ant-color-brand-primary)] focus:ring-[var(--ant-color-brand-primary)]"
                />
              </div>
            )}

            <div className="space-y-2.5">
              {visibleColumns.map((col, cIdx) => {
                const cell = row.getVisibleCells().find((c) => c.column.id === col.id);
                const headerTitle =
                  (col.columnDef.meta as any)?.title ||
                  (typeof col.columnDef.header === "string" ? col.columnDef.header : col.id);

                if (cIdx === 0) {
                  return (
                    <div key={col.id} className="pr-6">
                      <span className="text-[11px] font-semibold tracking-wider text-[var(--ant-color-surface-text-sub)] uppercase">
                        {headerTitle}
                      </span>
                      <div className="mt-0.5 text-base font-semibold text-[var(--ant-color-surface-text)]">
                        {cell ? (
                          typeof cell.column.columnDef.cell === "function" ? (
                            (cell.column.columnDef.cell as any)(cell.getContext())
                          ) : (
                            String(cell.getValue() ?? "")
                          )
                        ) : null}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={col.id} className="flex items-center justify-between border-t border-[var(--ant-color-surface-border)]/60 pt-2 text-xs">
                    <span className="text-[var(--ant-color-surface-text-sub)] font-medium">
                      {headerTitle}:
                    </span>
                    <span className="text-[var(--ant-color-surface-text)] font-semibold text-right">
                      {cell ? (
                        typeof cell.column.columnDef.cell === "function" ? (
                          (cell.column.columnDef.cell as any)(cell.getContext())
                        ) : (
                          String(cell.getValue() ?? "")
                        )
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
