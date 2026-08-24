import React, { CSSProperties, ReactNode } from "react";

interface ClusterProps {
  children: ReactNode;
  gap?: string;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  className?: string;
}

/** Cluster — wrapping flex row, great for tags, pills, and button groups. */
export function Cluster({
  children, gap = "var(--ant-spacing-2)",
  align = "center", justify = "flex-start", className,
}: ClusterProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: align, justifyContent: justify }}
         className={className}>
      {children}
    </div>
  );
}
