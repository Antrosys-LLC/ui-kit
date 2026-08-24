import React, { FormEvent, useContext, useId, useState } from "react";
import { clsx } from "clsx";
import { Button } from "../../feedback/Button";
import { ThemeContext } from "../../../providers/ThemeProvider";

export interface PaginationProps {
  /** Total number of items */
  total: number;
  /** Number of items displayed per page */
  perPage: number;
  /** Currently active page */
  currentPage: number;
  /** Called when the selected page changes */
  onPageChange: (page: number) => void;
  /** Whether to display the items-per-page selector */
  showSizeChanger?: boolean;
  /** Called when the items-per-page value changes */
  onPerPageChange?: (perPage: number) => void;
  /** Options for the items-per-page selector */
  pageSizeOptions?: number[];
  /** Optional additional CSS classes */
  className?: string;
}

type PageItem = number | "ellipsis";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function range(start: number, end: number): number[] {
  const items: number[] = [];
  for (let i = start; i <= end; i += 1) items.push(i);
  return items;
}

function getTotalPages(total: number, perPage: number): number {
  if (total <= 0) return 0;
  const safePerPage = Math.max(1, perPage);
  return Math.ceil(total / safePerPage);
}

/** Compact page list with ellipsis for large page counts. */
export function getPageItems(currentPage: number, totalPages: number, siblingCount = 1): PageItem[] {
  if (totalPages <= 0) return [];

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) return range(1, totalPages);

  const leftSibling = Math.max(safeCurrentPage - siblingCount, 1);
  const rightSibling = Math.min(safeCurrentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [...range(1, leftItemCount), "ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [1, "ellipsis", ...range(totalPages - rightItemCount + 1, totalPages)];
  }

  return [1, "ellipsis", ...range(leftSibling, rightSibling), "ellipsis", totalPages];
}

export function Pagination({
  total,
  perPage,
  currentPage,
  onPageChange,
  showSizeChanger = false,
  onPerPageChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
}: PaginationProps) {
  const [jumpValue, setJumpValue] = useState("");
  const jumpInputId = useId();
  const themeCtx = useContext(ThemeContext);
  const isDark = themeCtx?.theme === "dark";

  const totalPages = getTotalPages(total, perPage);
  const safeCurrentPage = totalPages > 0 ? Math.min(Math.max(1, currentPage), totalPages) : 1;
  const pageItems = getPageItems(safeCurrentPage, totalPages);
  const isFirstPage = totalPages <= 1 || currentPage <= 1;
  const isLastPage = totalPages <= 1 || currentPage >= totalPages;
  const sizeOptions = pageSizeOptions.includes(perPage)
    ? pageSizeOptions
    : [...pageSizeOptions, perPage].sort((a, b) => a - b);

  const goTo = (page: number) => {
    if (totalPages <= 0 || !Number.isInteger(page)) return;
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    onPageChange(page);
  };

  const submitJump = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (totalPages <= 0) return;
    const parsed = Number.parseInt(jumpValue, 10);
    if (Number.isNaN(parsed)) return;
    const next = Math.min(totalPages, Math.max(1, parsed));
    goTo(next);
    setJumpValue("");
  };

  const handlePerPageChange = (nextPerPage: number) => {
    if (!Number.isInteger(nextPerPage) || nextPerPage <= 0) return;
    onPerPageChange?.(nextPerPage);
    const nextTotalPages = getTotalPages(total, nextPerPage);
    if (currentPage > nextTotalPages && nextTotalPages > 0) {
      onPageChange(nextTotalPages);
    } else if (currentPage < 1 && nextTotalPages > 0) {
      onPageChange(1);
    }
  };

  const controlClass = clsx(
    "h-7 rounded-[var(--ant-radius-md)]",
    "text-[length:var(--ant-typography-fontSize-sm)]",
    "px-[var(--ant-spacing-2)]",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--ant-color-brand-primary)]",
    "focus-visible:ring-offset-2",
    isDark
      ? [
          "border border-[var(--ant-color-neutral-700)]",
          "bg-[var(--ant-color-neutral-800)]",
          "text-[var(--ant-color-neutral-0)]",
          "focus-visible:ring-offset-[var(--ant-color-neutral-900)]",
        ]
      : [
          "border border-[var(--ant-color-neutral-200)]",
          "bg-[var(--ant-color-neutral-0)]",
          "text-[var(--ant-color-neutral-900)]",
          "focus-visible:ring-offset-[var(--ant-color-neutral-0)]",
        ],
  );

  const labelTextClass = clsx(
    "text-[length:var(--ant-typography-fontSize-sm)]",
    isDark ? "text-[var(--ant-color-neutral-100)]" : "text-[var(--ant-color-neutral-900)]",
  );

  const ellipsisClass = clsx(
    "px-[var(--ant-spacing-1)]",
    isDark ? "text-[var(--ant-color-neutral-400)]" : "text-[var(--ant-color-neutral-500)]",
  );

  return (
    <div
      className={clsx(
        "flex flex-wrap items-center",
        "gap-[var(--ant-spacing-3)]",
        className,
      )}
    >
      <nav aria-label="Pagination" className="flex flex-wrap items-center gap-[var(--ant-spacing-1)]">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-label="First page"
          disabled={isFirstPage}
          onClick={() => goTo(1)}
        >
          First
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-label="Previous page"
          disabled={isFirstPage}
          onClick={() => goTo(safeCurrentPage - 1)}
        >
          Previous
        </Button>

        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className={ellipsisClass}
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={item === currentPage ? "primary" : "ghost"}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
              onClick={() => goTo(item)}
            >
              {item}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-label="Next page"
          disabled={isLastPage}
          onClick={() => goTo(safeCurrentPage + 1)}
        >
          Next
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-label="Last page"
          disabled={isLastPage}
          onClick={() => goTo(totalPages)}
        >
          Last
        </Button>
      </nav>

      {showSizeChanger && (
        <label className={clsx("inline-flex items-center gap-[var(--ant-spacing-2)]", labelTextClass)}>
          <span>Items per page</span>
          <select
            aria-label="Items per page"
            className={controlClass}
            value={perPage}
            onChange={(event) => handlePerPageChange(Number(event.target.value))}
          >
            {sizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      )}

      <form
        className="inline-flex items-center gap-[var(--ant-spacing-2)]"
        onSubmit={submitJump}
      >
        <label
          htmlFor={jumpInputId}
          className={labelTextClass}
        >
          Go to page
        </label>
        <input
          id={jumpInputId}
          aria-label="Go to page"
          className={clsx(controlClass, "w-[var(--ant-spacing-16)]")}
          type="number"
          inputMode="numeric"
          min={1}
          max={Math.max(1, totalPages)}
          disabled={totalPages <= 0}
          value={jumpValue}
          onChange={(event) => setJumpValue(event.target.value)}
        />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={totalPages <= 0}
        >
          Go
        </Button>
      </form>
    </div>
  );
}
