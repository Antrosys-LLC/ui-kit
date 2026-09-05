import React, { useState, useRef, useEffect, ReactNode } from "react";
import type { Table } from "@tanstack/react-table";
import type { TableDensity, TableExportOptions } from "./types";
import { Button } from "../../feedback/Button";
import { exportToCSV, exportToExcel } from "./exportUtils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchable?: boolean;
  searchPlaceholder?: string;
  globalFilter: string;
  onGlobalFilterChange: (val: string) => void;
  density: TableDensity;
  onDensityChange: (d: TableDensity) => void;
  enableDensityToggle?: boolean;
  enableColumnVisibility?: boolean;
  exportable?: boolean;
  exportOptions?: TableExportOptions;
  viewMode: "table" | "card";
  onViewModeChange: (m: "table" | "card") => void;
  enableMobileCards?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  bulkActions?: (selectedRows: TData[], table: Table<TData>) => ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchable = true,
  searchPlaceholder = "Search records...",
  globalFilter,
  onGlobalFilterChange,
  density,
  onDensityChange,
  enableDensityToggle = true,
  enableColumnVisibility = true,
  exportable = true,
  exportOptions,
  viewMode,
  onViewModeChange,
  enableMobileCards = true,
  title,
  description,
  actions,
  bulkActions,
}: DataTableToolbarProps<TData>) {
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const colMenuRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const selectedCount = selectedRows.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colMenuRef.current && !colMenuRef.current.contains(event.target as Node)) {
        setColMenuOpen(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hideableColumns = table
    .getAllLeafColumns()
    .filter((col) => col.id !== "_select" && col.id !== "_actions" && (col.columnDef.meta as any)?.hideable !== false);

  return (
    <div className="flex flex-col gap-3 border-b border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] p-4 sm:p-5">
      {/* Top row: Title, Subtitle, and Custom Actions */}
      {(title || description || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h3 className="text-base font-semibold tracking-tight text-[var(--ant-color-surface-text)] sm:text-lg">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-[var(--ant-color-surface-text-sub)]">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Batch Selection Banner (Visible when rows selected) */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-[var(--ant-color-brand-primary-lt)] px-3.5 py-2 text-xs text-[var(--ant-color-brand-primary-dk)] transition animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--ant-color-brand-primary)] text-[10px] font-bold text-white">
              {selectedCount}
            </span>
            <span className="font-semibold">{selectedCount} row{selectedCount > 1 ? "s" : ""} selected</span>
          </div>

          <div className="flex items-center gap-2">
            {bulkActions && bulkActions(selectedRows, table)}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.toggleAllRowsSelected(false)}
              className="!px-2 !py-0.5 text-xs font-semibold hover:underline"
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Global Search Input */}
        {searchable ? (
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ant-color-surface-text-sub)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => onGlobalFilterChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] py-1.5 pr-8 pl-9 text-xs text-[var(--ant-color-surface-text)] placeholder-[var(--ant-color-surface-text-sub)] transition focus:border-[var(--ant-color-brand-primary)] focus:bg-[var(--ant-color-surface-bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--ant-color-brand-primary)]/20"
            />
            {globalFilter && (
              <button
                onClick={() => onGlobalFilterChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)]"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <div />
        )}

        {/* Right: Density, Column Visibility, Export, View Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Density Toggle */}
          {enableDensityToggle && (
            <div className="flex rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] p-0.5">
              {(["compact", "comfortable", "spacious"] as TableDensity[]).map((d) => (
                <button
                  key={d}
                  onClick={() => onDensityChange(d)}
                  title={`${d.charAt(0).toUpperCase() + d.slice(1)} spacing`}
                  className={`rounded px-2 py-1 text-[11px] font-medium capitalize transition ${
                    density === d
                      ? "bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-brand-primary)] shadow-xs"
                      : "text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)]"
                  }`}
                >
                  {d === "compact" ? "S" : d === "comfortable" ? "M" : "L"}
                </button>
              ))}
            </div>
          )}

          {/* Column Visibility Dropdown */}
          {enableColumnVisibility && hideableColumns.length > 0 && (
            <div className="relative" ref={colMenuRef}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setColMenuOpen(!colMenuOpen)}
                className="h-8 !px-2.5 text-xs font-medium"
              >
                <svg className="h-3.5 w-3.5 text-[var(--ant-color-surface-text-sub)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Columns
              </Button>

              {colMenuOpen && (
                <div className="absolute right-0 z-50 mt-1.5 w-48 rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] p-2 shadow-lg backdrop-blur-md">
                  <div className="mb-1.5 border-b border-[var(--ant-color-surface-border)]/60 pb-1 text-[11px] font-semibold text-[var(--ant-color-surface-text-sub)]">
                    Toggle Columns
                  </div>
                  <div className="max-h-56 space-y-1 overflow-y-auto">
                    {hideableColumns.map((col) => {
                      const headerTitle =
                        (col.columnDef.meta as any)?.title ||
                        (typeof col.columnDef.header === "string" ? col.columnDef.header : col.id);

                      return (
                        <label
                          key={col.id}
                          className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)]"
                        >
                          <input
                            type="checkbox"
                            checked={col.getIsVisible()}
                            onChange={col.getToggleVisibilityHandler()}
                            className="h-3.5 w-3.5 rounded border-[var(--ant-color-surface-border)] text-[var(--ant-color-brand-primary)] focus:ring-[var(--ant-color-brand-primary)]"
                          />
                          <span className="truncate">{headerTitle}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Export Dropdown */}
          {exportable && (
            <div className="relative" ref={exportMenuRef}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="h-8 !px-2.5 text-xs font-medium"
              >
                <svg className="h-3.5 w-3.5 text-[var(--ant-color-surface-text-sub)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </Button>

              {exportMenuOpen && (
                <div className="absolute right-0 z-50 mt-1.5 w-44 rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] p-1 shadow-lg">
                  <button
                    onClick={() => {
                      exportToCSV(table, exportOptions, false);
                      setExportMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)]"
                  >
                    <span className="font-bold text-[var(--ant-color-semantic-success)]">CSV</span>
                    <span>Export all as CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      exportToExcel(table, exportOptions, false);
                      setExportMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)]"
                  >
                    <span className="font-bold text-[var(--ant-color-brand-primary)]">XLS</span>
                    <span>Export all as Excel</span>
                  </button>
                  {selectedCount > 0 && (
                    <button
                      onClick={() => {
                        exportToCSV(table, exportOptions, true);
                        setExportMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs font-medium text-[var(--ant-color-brand-primary)] hover:bg-[var(--ant-color-brand-primary-lt)]/40 border-t border-[var(--ant-color-surface-border)]/60 mt-1 pt-1"
                    >
                      <span>Export selected ({selectedCount})</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* View Mode Toggle (Table vs Cards) */}
          {enableMobileCards && (
            <div className="flex rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] p-0.5">
              <button
                onClick={() => onViewModeChange("table")}
                title="Table View"
                className={`rounded p-1 transition ${
                  viewMode === "table"
                    ? "bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-brand-primary)] shadow-xs"
                    : "text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)]"
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => onViewModeChange("card")}
                title="Card View"
                className={`rounded p-1 transition ${
                  viewMode === "card"
                    ? "bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-brand-primary)] shadow-xs"
                    : "text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)]"
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
