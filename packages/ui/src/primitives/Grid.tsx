import React, { CSSProperties, ReactNode } from "react";

interface GridProps {
  children: ReactNode;
  cols?: number | string;
  gap?: string;
  style?: CSSProperties;
  className?: string;
}

/** Grid — CSS grid wrapper with token-based gap. */
export function Grid({ children, cols = 12, gap = "var(--ant-spacing-6)", style, className }: GridProps) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: typeof cols === "number" ? `repeat(${cols}, minmax(0, 1fr))` : cols,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
