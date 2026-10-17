import React, { useState, useEffect, useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { clsx } from "clsx";

export interface InfiniteScrollListProps<T = any> extends React.ComponentPropsWithoutRef<"div"> {
  /** Function to fetch pages indefinitely */
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; hasMore: boolean }>;
  /** Number of items per fetched page (default: 20) */
  pageSize?: number;
  /** Estimated height of each row in pixels (default: 40) */
  estimateSize?: number;
  /** Number of items outside visible viewport (default: 5) */
  overscan?: number;
  /** Whether to show the scroll-to-top button (default: true) */
  scrollToTop?: boolean;
  /** Height of the viewport container (default: '400px') */
  height?: string | number;
  /** Custom renderer for each item row */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Custom loading spinner widget component */
  loadingWidget?: React.ReactNode;
}

export function InfiniteScrollList<T = any>({
  fetchFn,
  pageSize = 20,
  estimateSize = 40,
  overscan = 5,
  scrollToTop = true,
  height = "400px",
  renderItem,
  loadingWidget,
  className,
  ...props
}: InfiniteScrollListProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);

  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await fetchFn(page, pageSize);
      setItems((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to fetch infinite scroll data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, loading, hasMore, fetchFn]);

  useEffect(() => {
    loadMoreData();
  }, [loadMoreData]);

  const rowVirtualizer = useVirtualizer({
    count: hasMore ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

    if (scrollBottom < 60 && !loading && hasMore) {
      loadMoreData();
    }

    if (target.scrollTop > 200) {
      setShowTopBtn(true);
    } else {
      setShowTopBtn(false);
    }
  };

  const scrollToTopFn = () => {
    parentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={clsx(
        "ant-infinite-scroll-list relative flex flex-col w-full overflow-hidden",
        "border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-surface-text)] rounded-[var(--ant-radius-xl)]",
        className
      )}
      {...props}
    >
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="relative overflow-auto w-full"
        style={{ height }}
      >
        <div style={{ height: `${totalSize}px`, width: "100%", position: "relative" }}>
          {virtualRows.map((virtualRow) => {
            const isLoaderRow = virtualRow.index > items.length - 1;
            const item = items[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="absolute top-0 left-0 w-full border-b border-[var(--ant-color-surface-border)] box-border"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  loadingWidget || (
                    <div className="flex items-center justify-center p-[var(--ant-spacing-4)] text-[var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)]">
                      <svg
                        className="animate-spin -ml-1 mr-[var(--ant-spacing-2)] h-[var(--ant-spacing-4)] w-[var(--ant-spacing-4)] text-[var(--ant-color-brand-primary)]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading infinite items...
                    </div>
                  )
                ) : (
                  renderItem(item, virtualRow.index)
                )}
              </div>
            );
          })}
        </div>
      </div>

      {scrollToTop && showTopBtn && (
        <button
          type="button"
          onClick={scrollToTopFn}
          aria-label="Scroll to top"
          className={clsx(
            "absolute bottom-[var(--ant-spacing-4)] right-[var(--ant-spacing-4)] z-10",
            "bg-[var(--ant-color-brand-primary)] text-white shadow-[var(--ant-shadow-lg)]",
            "px-[var(--ant-spacing-3)] py-[var(--ant-spacing-2)] rounded-[var(--ant-radius-full)]",
            "text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-medium)] cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-2",
            "hover:bg-[var(--ant-color-brand-primary-dk)]"
          )}
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}