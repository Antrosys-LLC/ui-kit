import React, { useState } from "react";
import type { Table } from "@tanstack/react-table";
import { Button } from "../../feedback/Button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  selectable?: boolean;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 50, 100],
  selectable = false,
}: DataTablePaginationProps<TData>) {
  const [jumpPage, setJumpPage] = useState("");
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const selectedRowsCount = table.getSelectedRowModel().rows.length;

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(jumpPage);
    if (!isNaN(target) && target >= 1 && target <= pageCount) {
      table.setPageIndex(target - 1);
      setJumpPage("");
    }
  };

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] px-4 py-3 text-xs sm:px-6">
      {/* Left: Row Selection / Total Records count */}
      <div className="flex items-center gap-3 text-[var(--ant-color-surface-text-sub)]">
        {selectable && selectedRowsCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ant-color-brand-primary-lt)] px-2.5 py-0.5 font-semibold text-[var(--ant-color-brand-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ant-color-brand-primary)]" />
            {selectedRowsCount} of {totalRows} selected
          </span>
        ) : (
          <span>
            Showing <strong className="font-semibold text-[var(--ant-color-surface-text)]">{startRow}</strong> to{" "}
            <strong className="font-semibold text-[var(--ant-color-surface-text)]">{endRow}</strong> of{" "}
            <strong className="font-semibold text-[var(--ant-color-surface-text)]">{totalRows}</strong> entries
          </span>
        )}
      </div>

      {/* Right: Controls & Page Numbers */}
      <div className="flex flex-wrap items-center gap-3.5">
        {/* Page size dropdown */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="page-size-select" className="text-[var(--ant-color-surface-text-sub)]">
            Rows per page:
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded-md border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] px-2 py-1 text-xs font-medium text-[var(--ant-color-surface-text)] transition focus:border-[var(--ant-color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ant-color-brand-primary)]"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
            className="!px-2 h-7"
          >
            «
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
            className="!px-2.5 h-7"
          >
            ‹
          </Button>

          <span className="px-2 font-medium text-[var(--ant-color-surface-text)]">
            Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
          </span>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
            className="!px-2.5 h-7"
          >
            ›
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
            className="!px-2 h-7"
          >
            »
          </Button>
        </div>

        {/* Jump to page */}
        {pageCount > 5 && (
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
            <span className="text-[var(--ant-color-surface-text-sub)]">Go to:</span>
            <input
              type="number"
              min={1}
              max={pageCount}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="1"
              className="w-12 rounded-md border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] px-1.5 py-1 text-center text-xs text-[var(--ant-color-surface-text)] focus:border-[var(--ant-color-brand-primary)] focus:outline-none"
            />
            <Button variant="secondary" size="sm" type="submit" className="!px-2 h-7">
              Go
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
