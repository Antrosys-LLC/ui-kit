import React from "react";
import { clsx } from "clsx";

export type SkeletonVariant =
  "custom" | "text" | "avatar" | "card" | "table" | "table-row" | "chart";

export type SkeletonRadius = "none" | "sm" | "md" | "lg" | "xl" | "full" | string;

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Pre-built shape variant:
   * - `custom`: Single configurable rectangular/circular placeholder block
   * - `text`: Multi-line text block with staggered widths
   * - `avatar`: Circular user profile placeholder
   * - `card`: Complete card layout with avatar, header, image, and text
   * - `table`: Data table layout with header and rows
   * - `table-row`: Single table row placeholder with multiple column cells
   * - `chart`: Dashboard bar chart placeholder with varying heights
   */
  variant?: SkeletonVariant;

  /**
   * Number of lines / rows to generate for `text`, `table`, or `table-row` variants (default: 3)
   */
  rows?: number;

  /**
   * Enable shimmer sweep animation (default: true)
   */
  animated?: boolean;

  /**
   * Width of the skeleton element (e.g. 100, "100%", "240px")
   */
  width?: string | number;

  /**
   * Height of the skeleton element (e.g. 24, "1rem", "180px")
   */
  height?: string | number;

  /**
   * Render as a perfect circle (e.g. for user avatars or icon buttons)
   */
  circle?: boolean;

  /**
   * Corner radius preset or custom CSS value
   */
  radius?: SkeletonRadius;

  /**
   * Custom shimmer highlight gradient or color
   */
  shimmerColor?: string;

  /**
   * Custom children for composable layouts
   */
  children?: React.ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: React.CSSProperties;
}

const RADIUS_MAP: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

/**
 * Base atomic Skeleton box
 */
function BaseSkeletonBox({
  animated = true,
  width,
  height,
  circle = false,
  radius = "md",
  shimmerColor,
  className,
  style,
  children,
  ...props
}: Omit<SkeletonProps, "variant" | "rows">) {
  const isPresetRadius = typeof radius === "string" && RADIUS_MAP[radius];
  const radiusClass = circle ? "rounded-full" : isPresetRadius ? RADIUS_MAP[radius] : "";

  const customRadiusStyle = !circle && radius && !isPresetRadius ? { borderRadius: radius } : {};

  const sizeStyle: React.CSSProperties = {
    ...(width !== undefined ? { width: typeof width === "number" ? `${width}px` : width } : {}),
    ...(height !== undefined
      ? { height: typeof height === "number" ? `${height}px` : height }
      : {}),
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-[var(--ant-color-neutral-200)] dark:bg-[var(--ant-color-neutral-800)]",
        radiusClass,
        className
      )}
      style={{
        ...customRadiusStyle,
        ...sizeStyle,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {animated && (
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent"
          style={
            shimmerColor
              ? {
                  backgroundImage: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
                }
              : undefined
          }
        />
      )}
      {children}
    </div>
  );
}

/**
 * Text Variant Skeleton
 */
function TextSkeleton({ rows = 3, animated = true, className, style, ...props }: SkeletonProps) {
  const rowWidths = ["100%", "92%", "78%", "85%", "60%"];

  return (
    <div className={clsx("flex flex-col gap-2.5 w-full", className)} style={style} {...props}>
      {Array.from({ length: rows }).map((_, i) => (
        <BaseSkeletonBox
          key={i}
          animated={animated}
          height={props.height || 14}
          width={i === rows - 1 && rows > 1 ? "65%" : rowWidths[i % rowWidths.length]}
          radius={props.radius || "sm"}
        />
      ))}
    </div>
  );
}

/**
 * Avatar Variant Skeleton
 */
function AvatarSkeleton({
  width = 48,
  height = 48,
  animated = true,
  circle = true,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <BaseSkeletonBox
      circle={circle}
      width={width}
      height={height}
      animated={animated}
      className={className}
      style={style}
      {...props}
    />
  );
}

/**
 * Card Variant Skeleton
 */
function CardSkeleton({ animated = true, className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "p-5 rounded-xl border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] flex flex-col gap-4 max-w-sm w-full shadow-sm",
        className
      )}
      style={style}
      {...props}
    >
      {/* Header with Avatar + Name lines */}
      <div className="flex items-center gap-3">
        <BaseSkeletonBox circle width={44} height={44} animated={animated} />
        <div className="flex flex-col gap-2 flex-1">
          <BaseSkeletonBox width="55%" height={14} radius="sm" animated={animated} />
          <BaseSkeletonBox width="35%" height={10} radius="sm" animated={animated} />
        </div>
      </div>

      {/* Media placeholder */}
      <BaseSkeletonBox
        width="100%"
        height={160}
        radius="lg"
        animated={animated}
        className="w-full"
      />

      {/* Body lines */}
      <div className="flex flex-col gap-2 pt-1">
        <BaseSkeletonBox width="100%" height={12} radius="sm" animated={animated} />
        <BaseSkeletonBox width="88%" height={12} radius="sm" animated={animated} />
        <BaseSkeletonBox width="60%" height={12} radius="sm" animated={animated} />
      </div>

      {/* Footer action button */}
      <div className="flex justify-between items-center pt-2">
        <BaseSkeletonBox width={80} height={20} radius="sm" animated={animated} />
        <BaseSkeletonBox width={100} height={32} radius="md" animated={animated} />
      </div>
    </div>
  );
}

/**
 * Table Variant Skeleton
 */
function TableSkeleton({ rows = 4, animated = true, className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "w-full overflow-hidden rounded-lg border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)]",
        className
      )}
      style={style}
      {...props}
    >
      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-[var(--ant-color-surface-border)] bg-[var(--ant-color-neutral-50)] dark:bg-[var(--ant-color-neutral-900)]">
        <BaseSkeletonBox width="60%" height={14} radius="sm" animated={animated} />
        <BaseSkeletonBox width="70%" height={14} radius="sm" animated={animated} />
        <BaseSkeletonBox width="50%" height={14} radius="sm" animated={animated} />
        <BaseSkeletonBox width="40%" height={14} radius="sm" animated={animated} />
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0 border-[var(--ant-color-surface-border)] items-center"
        >
          <div className="flex items-center gap-2">
            <BaseSkeletonBox circle width={24} height={24} animated={animated} />
            <BaseSkeletonBox width="70%" height={12} radius="sm" animated={animated} />
          </div>
          <BaseSkeletonBox width="80%" height={12} radius="sm" animated={animated} />
          <BaseSkeletonBox width="55%" height={12} radius="sm" animated={animated} />
          <BaseSkeletonBox width="35%" height={24} radius="full" animated={animated} />
        </div>
      ))}
    </div>
  );
}

/**
 * Table Row Variant Skeleton
 */
function TableRowSkeleton({ animated = true, className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "grid grid-cols-4 gap-4 p-3 border-b border-[var(--ant-color-surface-border)] items-center w-full",
        className
      )}
      style={style}
      {...props}
    >
      <BaseSkeletonBox width="75%" height={14} radius="sm" animated={animated} />
      <BaseSkeletonBox width="60%" height={14} radius="sm" animated={animated} />
      <BaseSkeletonBox width="45%" height={14} radius="sm" animated={animated} />
      <BaseSkeletonBox width="30%" height={20} radius="md" animated={animated} />
    </div>
  );
}

/**
 * Chart Variant Skeleton
 */
function ChartSkeleton({ animated = true, className, style, ...props }: SkeletonProps) {
  const barHeights = [45, 75, 30, 90, 60, 85, 40, 70];

  return (
    <div
      className={clsx(
        "p-6 rounded-xl border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] flex flex-col gap-6 w-full max-w-lg shadow-sm",
        className
      )}
      style={style}
      {...props}
    >
      {/* Chart Title & Legend */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5 w-1/2">
          <BaseSkeletonBox width="80%" height={16} radius="sm" animated={animated} />
          <BaseSkeletonBox width="50%" height={10} radius="sm" animated={animated} />
        </div>
        <div className="flex gap-2">
          <BaseSkeletonBox width={50} height={12} radius="sm" animated={animated} />
          <BaseSkeletonBox width={50} height={12} radius="sm" animated={animated} />
        </div>
      </div>

      {/* Simulated Chart Bars with Y-Axis */}
      <div className="flex items-end justify-between gap-3 h-44 pt-4 border-b border-l border-[var(--ant-color-surface-border)] px-2">
        {barHeights.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
            <BaseSkeletonBox
              width="100%"
              height={`${h}%`}
              radius="sm"
              animated={animated}
              className="max-w-[36px]"
            />
          </div>
        ))}
      </div>

      {/* X-Axis labels */}
      <div className="flex justify-between px-2">
        {barHeights.map((_, i) => (
          <BaseSkeletonBox key={i} width={24} height={8} radius="sm" animated={animated} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton Loader Component
 */
export function Skeleton({
  variant = "custom",
  rows = 3,
  animated = true,
  width,
  height,
  circle = false,
  radius = "md",
  shimmerColor,
  children,
  className,
  style,
  ...restProps
}: SkeletonProps) {
  switch (variant) {
    case "text":
      return (
        <TextSkeleton
          rows={rows}
          animated={animated}
          height={height}
          radius={radius}
          className={className}
          style={style}
          {...restProps}
        />
      );
    case "avatar":
      return (
        <AvatarSkeleton
          width={width}
          height={height}
          circle={circle}
          animated={animated}
          className={className}
          style={style}
          {...restProps}
        />
      );
    case "card":
      return (
        <CardSkeleton animated={animated} className={className} style={style} {...restProps} />
      );
    case "table":
      return (
        <TableSkeleton
          rows={rows}
          animated={animated}
          className={className}
          style={style}
          {...restProps}
        />
      );
    case "table-row":
      return (
        <TableRowSkeleton animated={animated} className={className} style={style} {...restProps} />
      );
    case "chart":
      return (
        <ChartSkeleton animated={animated} className={className} style={style} {...restProps} />
      );
    case "custom":
    default:
      return (
        <BaseSkeletonBox
          animated={animated}
          width={width}
          height={height}
          circle={circle}
          radius={radius}
          shimmerColor={shimmerColor}
          className={className}
          style={style}
          {...restProps}
        >
          {children}
        </BaseSkeletonBox>
      );
  }
}

// Attach subcomponents for composable syntax: Skeleton.Card, Skeleton.Avatar, etc.
Skeleton.Custom = BaseSkeletonBox;
Skeleton.Text = TextSkeleton;
Skeleton.Avatar = AvatarSkeleton;
Skeleton.Card = CardSkeleton;
Skeleton.Table = TableSkeleton;
Skeleton.TableRow = TableRowSkeleton;
Skeleton.Chart = ChartSkeleton;
