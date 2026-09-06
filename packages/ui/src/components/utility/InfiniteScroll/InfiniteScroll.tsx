import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { clsx } from "clsx";
import { ThemeContext } from "../../../providers/ThemeProvider";

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
  const themeCtx = useContext(ThemeContext);
  const isDark = themeCtx?.theme === "dark";

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

  const borderColor = isDark ? "var(--ant-color-neutral-700)" : "var(--ant-color-neutral-300)";
  const bgColor = isDark ? "var(--ant-color-neutral-900)" : "var(--ant-color-neutral-0)";
  const textColor = isDark ? "var(--ant-color-neutral-100)" : "var(--ant-color-neutral-900)";
  const rowBorderColor = isDark ? "var(--ant-color-neutral-800)" : "var(--ant-color-neutral-200)";
  const loaderColor = isDark ? "var(--ant-color-neutral-400)" : "var(--ant-color-neutral-500)";

  return (
    <div
      className={clsx("ant-infinite-scroll-list", className)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${borderColor}`,
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: "0px",
        width: "100%",
      }}
      {...props}
    >
      <div
        ref={parentRef}
        onScroll={handleScroll}
        style={{
          height,
          overflow: "auto",
          position: "relative",
          borderRadius: "0px",
        }}
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
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                  borderBottom: `1px solid ${rowBorderColor}`,
                  boxSizing: "border-box",
                }}
              >
                {isLoaderRow ? (
                  loadingWidget || (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "var(--ant-spacing-3)",
                        fontSize: "var(--ant-typography-fontsize-sm)",
                        color: loaderColor,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "16px",
                          height: "16px",
                          border: "2px solid currentColor",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          marginRight: "var(--ant-spacing-2)",
                        }}
                      />
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
          style={{
            position: "absolute",
            bottom: "var(--ant-spacing-4)",
            right: "var(--ant-spacing-4)",
            backgroundColor: "var(--ant-color-brand-primary)",
            color: "var(--ant-color-neutral-0)",
            padding: "var(--ant-spacing-2) var(--ant-spacing-3)",
            borderRadius: "0px",
            border: "none",
            cursor: "pointer",
            fontSize: "var(--ant-typography-fontsize-xs, 12px)",
            fontWeight: 500,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
          }}
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}