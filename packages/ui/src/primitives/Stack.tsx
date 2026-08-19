import React, { CSSProperties, ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  gap?: string | number;
  direction?: "row" | "column";
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: boolean;
  style?: CSSProperties;
  className?: string;
}

/** Stack — flex container for vertical or horizontal sequences. */
export function Stack({
  children, gap = "var(--ant-spacing-4)", direction = "column",
  align, justify, wrap, style, className,
}: StackProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: direction,
        gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
