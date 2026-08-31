import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  ColumnPinningState,
  Row,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { clsx } from "clsx";

import type {
  DataTableProps,
  DataTableColumnDef,
  TableDensity,
  DataTableColumnMeta,
} from "./types";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableCellEditor } from "./DataTableCellEditor";
import { DataCardView } from "./DataCardView";

export function DataTable<TData>({
  columns: userColumns,
  data,
  selectable = false,
  exportable = true,
  virtualScroll = false,
  virtualScrollHeight = 480,
  searchable = true,
  searchPlaceholder = "Search records...",
  filterable: _filterable = false,
  enablePinning = true,
  initialPinning = {},
  enableColumnVisibility = true,
  enableMobileCards = true,
  cardTemplate,
  density: initialDensity = "comfortable",
  enableDensityToggle = true,
  pagination = true,
  pageSizeOptions = [10, 20, 50, 100],
  initialPageSize = 10,
  title,
  description,
  actions,
  bulkActions,
  onRowSelectionChange,
  onRowEditSave,
  onRowClick,
  getRowId,
  loading = false,
  emptyState,
  className,
  theme,
}: DataTableProps<TData>) {
  // ── States ──────────────────────────────────────────────────────────────────
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(initialPinning);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [density, setDensity] = useState<TableDensity>(initialDensity);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Inline editing state: { rowIndex: number, columnId: string }
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);

  // ── Build Column Definitions (injecting Selection column if enabled) ────────
  const columns = useMemo<DataTableColumnDef<TData, any>[]>(() => {
    if (!selectable) return userColumns;

    const selectColumn: DataTableColumnDef<TData, any> = {
      id: "_select",
      size: 44,
      enablePinning: true,
      meta: {
        hideable: false,
        isEditable: false,
        align: "center",
      },
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            ref={(input) => {
              if (input) {
                input.indeterminate = table.getIsSomePageRowsSelected();
              }
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="h-4 w-4 rounded border-[var(--ant-color-surface-border)] text-[var(--ant-color-brand-primary)] transition focus:ring-[var(--ant-color-brand-primary)]"
            aria-label="Select all rows"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-[var(--ant-color-surface-border)] text-[var(--ant-color-brand-primary)] transition focus:ring-[var(--ant-color-brand-primary)]"
            aria-label={`Select row ${row.index + 1}`}
          />
        </div>
      ),
    };

    return [selectColumn, ...userColumns];
  }, [selectable, userColumns]);

  // ── React Table Instance ────────────────────────────────────────────────────
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnPinning,
      rowSelection,
    },
    enableRowSelection: selectable,
    enablePinning,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: (updater) => {
      const nextSelection = typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(nextSelection);
      if (onRowSelectionChange) {
        const selectedOriginalRows = Object.keys(nextSelection)
          .filter((k) => nextSelection[k])
          .map((k) => {
            const rowIndex = Number(k);
            return data[rowIndex] || (data as any)[k];
          })
          .filter(Boolean);
        onRowSelectionChange(selectedOriginalRows);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination && !virtualScroll ? getPaginationRowModel() : undefined,
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
  });

  // ── Virtual Scrolling Setup ─────────────────────────────────────────────────
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: useCallback(
      () => (density === "compact" ? 36 : density === "comfortable" ? 48 : 60),
      [density]
    ),
    overscan: 10,
    enabled: virtualScroll,
  });

  const virtualRows = virtualScroll ? rowVirtualizer.getVirtualItems() : [];
  const totalVirtualSize = virtualScroll ? rowVirtualizer.getTotalSize() : 0;
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalVirtualSize - (virtualRows[virtualRows.length - 1].end || 0)
      : 0;

  // ── Density Spacing Classes ─────────────────────────────────────────────────
  const cellPaddingClass =
    density === "compact"
      ? "px-3 py-1.5 text-xs"
      : density === "comfortable"
      ? "px-4 py-3 text-xs sm:text-sm"
      : "px-5 py-4 text-sm";

  const headerPaddingClass =
    density === "compact"
      ? "px-3 py-2 text-xs"
      : density === "comfortable"
      ? "px-4 py-3 text-xs"
      : "px-5 py-3.5 text-xs font-semibold";

  // ── Handle Inline Edit Save ─────────────────────────────────────────────────
  const handleCellSave = async (rowIndex: number, columnId: string, newValue: any) => {
    const row = rows[rowIndex];
    if (row && onRowEditSave) {
      const updatedRow = { ...row.original, [columnId]: newValue };
      await onRowEditSave(updatedRow, rowIndex, columnId);
    }
    setEditingCell(null);
  };

  // ── Pinning Styles Helper ───────────────────────────────────────────────────
  const getPinningStyles = (column: any): React.CSSProperties => {
    const isPinned = column.getIsPinned();
    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : undefined,
      zIndex: isPinned ? 2 : 1,
    };
  };

  return (
    <div
      data-theme={theme}
      className={clsx(
        "relative flex w-full flex-col overflow-hidden rounded-xl border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] shadow-xs transition-colors duration-200",
        className
      )}
    >
      {/* Table Toolbar */}
      <DataTableToolbar
        table={table}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        density={density}
        onDensityChange={setDensity}
        enableDensityToggle={enableDensityToggle}
        enableColumnVisibility={enableColumnVisibility}
        exportable={exportable}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        enableMobileCards={enableMobileCards}
        title={title}
        description={description}
        actions={actions}
        bulkActions={bulkActions}
      />

      {/* Main Content Area: Table Mode or Card Mode */}
      {viewMode === "card" ? (
        <DataCardView
          table={table}
          selectable={selectable}
          onRowClick={onRowClick}
          cardTemplate={cardTemplate}
        />
      ) : (
        <div
          ref={tableContainerRef}
          className="relative w-full overflow-x-auto overflow-y-auto"
          style={{
            maxHeight: virtualScroll ? `${virtualScrollHeight}px` : undefined,
          }}
        >
          <table className="w-full border-collapse text-left" role="table">
            {/* Table Header */}
            <thead className="sticky top-0 z-10 border-b border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)]/95 backdrop-blur-xs">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isPinned = header.column.getIsPinned();
                    const isSortable = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();
                    const meta = header.column.columnDef.meta as DataTableColumnMeta<TData> | undefined;

                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...getPinningStyles(header.column),
                          width: header.getSize() !== 150 ? header.getSize() : undefined,
                        }}
                        className={clsx(
                          "font-semibold tracking-wider text-[var(--ant-color-surface-text-sub)] uppercase select-none transition-colors",
                          headerPaddingClass,
                          meta?.align === "center" && "text-center",
                          meta?.align === "right" && "text-right",
                          isPinned && "bg-[var(--ant-color-surface-bg)] shadow-[inset_-1px_0_0_var(--ant-color-surface-border)]",
                          isSortable && "cursor-pointer hover:text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)]/60",
                          meta?.headerClassName
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        aria-sort={
                          sortDirection === "asc"
                            ? "ascending"
                            : sortDirection === "desc"
                            ? "descending"
                            : "none"
                        }
                      >
                        <div className={clsx(
                          "flex items-center gap-1.5",
                          meta?.align === "center" && "justify-center",
                          meta?.align === "right" && "justify-end"
                        )}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}

                          {/* Sort Indicator */}
                          {isSortable && (
                            <span className="inline-flex text-[var(--ant-color-brand-primary)]">
                              {sortDirection === "asc" ? (
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M7 14l5-5 5 5H7z" />
                                </svg>
                              ) : sortDirection === "desc" ? (
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M7 10l5 5 5-5H7z" />
                                </svg>
                              ) : (
                                <svg className="h-3 w-3 opacity-30 group-hover:opacity-70" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 6l-4 5h8l-4-5zm0 12l4-5H8l4 5z" />
                                </svg>
                              )}
                            </span>
                          )}

                          {/* Column Pinning Toggle Button */}
                          {enablePinning && header.column.id !== "_select" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentPin = header.column.getIsPinned();
                                header.column.pin(currentPin === "left" ? false : "left");
                              }}
                              title={isPinned ? "Unpin column" : "Pin column to left"}
                              className={clsx(
                                "rounded p-0.5 text-[10px] opacity-0 group-hover:opacity-100 transition",
                                isPinned ? "!opacity-100 text-[var(--ant-color-brand-primary)]" : "text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)]"
                              )}
                            >
                              📌
                            </button>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)]">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--ant-color-brand-primary)] border-t-transparent" />
                      <span className="text-xs font-medium text-[var(--ant-color-surface-text-sub)]">
                        Loading table data...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-12 text-center">
                    {emptyState || (
                      <div className="flex flex-col items-center justify-center text-[var(--ant-color-surface-text-sub)]">
                        <svg className="mb-2 h-10 w-10 text-[var(--ant-color-neutral-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-sm font-medium">No records found</p>
                        <p className="text-xs text-[var(--ant-color-surface-text-sub)]/80">Try adjusting your search query or filters</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : virtualScroll ? (
                <>
                  {paddingTop > 0 && (
                    <tr>
                      <td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
                    </tr>
                  )}
                  {virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return renderTableRow(row, virtualRow.index);
                  })}
                  {paddingBottom > 0 && (
                    <tr>
                      <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
                    </tr>
                  )}
                </>
              ) : (
                rows.map((row, index) => renderTableRow(row, index))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {pagination && !virtualScroll && viewMode === "table" && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          selectable={selectable}
        />
      )}
    </div>
  );

  function renderTableRow(row: Row<TData>, rowIndex: number) {
    const isSelected = row.getIsSelected();

    return (
      <tr
        key={row.id}
        onClick={() => onRowClick?.(row.original, rowIndex)}
        className={clsx(
          "group transition-colors duration-150",
          isSelected
            ? "bg-[var(--ant-color-brand-primary-lt)]/25 hover:bg-[var(--ant-color-brand-primary-lt)]/35"
            : "hover:bg-[var(--ant-color-neutral-50)] dark:hover:bg-[var(--ant-color-neutral-800)]/40",
          onRowClick && "cursor-pointer"
        )}
      >
        {row.getVisibleCells().map((cell) => {
          const isPinned = cell.column.getIsPinned();
          const meta = cell.column.columnDef.meta as DataTableColumnMeta<TData> | undefined;
          const isCellEditing =
            editingCell?.rowIndex === rowIndex && editingCell?.columnId === cell.column.id;

          return (
            <td
              key={cell.id}
              style={{
                ...getPinningStyles(cell.column),
                width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined,
              }}
              onDoubleClick={() => {
                if (meta?.isEditable) {
                  setEditingCell({ rowIndex, columnId: cell.column.id });
                }
              }}
              className={clsx(
                "text-[var(--ant-color-surface-text)] transition-colors",
                cellPaddingClass,
                meta?.align === "center" && "text-center",
                meta?.align === "right" && "text-right",
                isPinned && "bg-[var(--ant-color-surface-bg-card)] shadow-[inset_-1px_0_0_var(--ant-color-surface-border)] group-hover:bg-[var(--ant-color-neutral-50)] dark:group-hover:bg-[var(--ant-color-neutral-800)]/40",
                meta?.cellClassName
              )}
            >
              {isCellEditing ? (
                <DataTableCellEditor
                  value={cell.getValue()}
                  row={row.original}
                  rowIndex={rowIndex}
                  columnId={cell.column.id}
                  meta={meta}
                  onSave={(newVal) => handleCellSave(rowIndex, cell.column.id, newVal)}
                  onCancel={() => setEditingCell(null)}
                />
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="flex-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                  {meta?.isEditable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCell({ rowIndex, columnId: cell.column.id });
                      }}
                      title="Edit cell"
                      className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-[10px] text-[var(--ant-color-surface-text-sub)] transition"
                    >
                      ✏️
                    </button>
                  )}
                </div>
              )}
            </td>
          );
        })}
      </tr>
    );
  }
}
