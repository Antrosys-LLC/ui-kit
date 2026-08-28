import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useContext,
  useId,
  HTMLAttributes,
  ReactNode,
} from "react";
import { clsx } from "clsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";
import { ThemeContext } from "../../../providers/ThemeProvider";

export type ChartType =
  | "line"
  | "bar"
  | "pie"
  | "donut"
  | "area"
  | "radar"
  | "heatmap";

export interface ChartSeries {
  /** The key in each data item corresponding to this series value */
  dataKey: string;
  /** Display label of the series in tooltip and legend */
  name?: string;
  /** Series stroke/fill color. Defaults to theme token palette */
  color?: string;
  /** Suffix/unit for values (e.g. "$", "%", "pts") */
  unit?: string;
  /** For line/area charts: curve interpolation type */
  curveType?: "monotone" | "linear" | "natural" | "step";
  /** For bar/area charts: stack identifier */
  stackId?: string;
  /** Stroke dash style (e.g. "4 4") */
  strokeDasharray?: string;
  /** Whether to show dots on line charts */
  dot?: boolean | object;
}

export interface HeatmapDataPoint {
  /** Column / horizontal category */
  x: string | number;
  /** Row / vertical category */
  y: string | number;
  /** Numerical value determining color intensity */
  value: number;
  /** Optional custom display label */
  label?: string;
}

export interface ChartSuiteProps extends HTMLAttributes<HTMLDivElement> {
  /** Chart visualization type */
  type: ChartType;
  /** Dataset array */
  data: Record<string, any>[] | HeatmapDataPoint[];
  /** Data key for category / X-axis (e.g. "date", "name", "category", "month") */
  xAxisKey?: string;
  /** Data key for Y-axis (for simple single-value charts or radar/heatmap Y coordinate) */
  yAxisKey?: string;
  /** Configuration for multiple series (Line, Bar, Area, Radar) */
  series?: ChartSeries[];
  /** Single series dataKey shorthand if series array is not passed */
  dataKey?: string;
  /** Card header title */
  title?: string;
  /** Card header subtitle / description */
  subtitle?: string;
  /** Chart height in pixels. Default: 320 */
  height?: number;
  /** Custom colors array for segments or series */
  colors?: string[];
  /** Show legend (default: true) */
  showLegend?: boolean;
  /** Show custom tooltip (default: true) */
  showTooltip?: boolean;
  /** Show grid lines (default: true) */
  showGrid?: boolean;
  /** Show X-axis (default: true) */
  showXAxis?: boolean;
  /** Show Y-axis (default: true) */
  showYAxis?: boolean;
  /** Enable PNG export button (default: true) */
  showExport?: boolean;
  /** Custom filename for PNG export (without extension) */
  exportFileName?: string;
  /** Callback fired on PNG export */
  onExport?: () => void;
  /** Whether chart animations are enabled (default: true) */
  animated?: boolean;
  /** Animation duration in milliseconds (default: 800) */
  animationDuration?: number;
  /** Stack bars or areas (default: false) */
  stacked?: boolean;
  /** For Donut/Pie: inner radius (default for donut: "60%", pie: 0) */
  innerRadius?: number | string;
  /** For Donut/Pie: outer radius (default: "80%") */
  outerRadius?: number | string;
  /** For Donut: central primary label inside the donut hole */
  centerLabel?: string;
  /** For Donut: central primary value / summary inside the donut hole */
  centerValue?: string | number;
  /** For Heatmap: X-axis categories/columns */
  xLabels?: string[];
  /** For Heatmap: Y-axis categories/rows */
  yLabels?: string[];
  /** For Heatmap: minimum value for color intensity scaling */
  minHeatValue?: number;
  /** For Heatmap: maximum value for color intensity scaling */
  maxHeatValue?: number;
  /** Custom value formatter function */
  valueFormatter?: (value: number) => string;
  /** Custom category / date formatter function */
  categoryFormatter?: (value: string | number) => string;
  /** Loading state with animated skeleton */
  loading?: boolean;
  /** Custom header actions slot */
  headerActions?: ReactNode;
  /** Custom footer slot */
  footer?: ReactNode;
  /** Optional theme override */
  theme?: "light" | "dark" | "auto";
}

/** Theme token-based color palette */
export const DEFAULT_CHART_COLORS = [
  "var(--ant-color-brand-primary)",
  "var(--ant-color-brand-accent)",
  "var(--ant-color-semantic-success)",
  "var(--ant-color-semantic-warning)",
  "var(--ant-color-semantic-info)",
  "var(--ant-color-semantic-error)",
  "var(--ant-color-brand-primary-dk)",
  "var(--ant-color-neutral-500)",
];

/** Custom Uniform Tooltip Component */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    dataKey?: string;
    payload?: any;
    unit?: string;
  }>;
  label?: string | number;
  valueFormatter?: (val: number) => string;
  categoryFormatter?: (val: string | number) => string;
  isDark?: boolean;
}

function UniformTooltip({
  active,
  payload,
  label,
  valueFormatter,
  categoryFormatter,
  isDark = false,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const displayLabel =
    label !== undefined && label !== null
      ? categoryFormatter
        ? categoryFormatter(label)
        : String(label)
      : undefined;

  return (
    <div
      className={clsx(
        "rounded-[var(--ant-radius-lg)] p-[var(--ant-spacing-3)]",
        isDark
          ? "bg-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-0)] border border-[var(--ant-color-neutral-700)]"
          : "bg-[var(--ant-color-neutral-0)] text-[var(--ant-color-neutral-900)] border border-[var(--ant-color-neutral-200)]",
        "shadow-[var(--ant-shadow-lg)] min-w-36 text-[length:var(--ant-typography-fontSize-xs)] select-none",
        "backdrop-blur-sm z-[var(--ant-zIndex-tooltip)]"
      )}
    >
      {displayLabel && (
        <p
          className={clsx(
            "font-semibold pb-[var(--ant-spacing-1)] mb-[var(--ant-spacing-2)] border-b",
            isDark
              ? "text-[var(--ant-color-neutral-0)] border-[var(--ant-color-neutral-700)]"
              : "text-[var(--ant-color-neutral-900)] border-[var(--ant-color-neutral-200)]"
          )}
        >
          {displayLabel}
        </p>
      )}
      <div className="flex flex-col gap-[var(--ant-spacing-1)]">
        {payload.map((item, index) => {
          const numValue =
            typeof item.value === "number" ? item.value : Number(item.value);
          const formattedVal =
            !isNaN(numValue) && valueFormatter
              ? valueFormatter(numValue)
              : item.value;

          return (
            <div
              key={`tooltip-item-${index}`}
              className="flex items-center justify-between gap-[var(--ant-spacing-3)]"
            >
              <div className="flex items-center gap-[var(--ant-spacing-2)]">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color || DEFAULT_CHART_COLORS[0] }}
                />
                <span
                  className={clsx(
                    isDark
                      ? "text-[var(--ant-color-neutral-400)]"
                      : "text-[var(--ant-color-neutral-500)]"
                  )}
                >
                  {item.name || item.dataKey || "Value"}
                </span>
              </div>
              <span
                className={clsx(
                  "font-semibold",
                  isDark
                    ? "text-[var(--ant-color-neutral-0)]"
                    : "text-[var(--ant-color-neutral-900)]"
                )}
              >
                {formattedVal}
                {item.unit ? ` ${item.unit}` : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Loading Skeleton Component */
function ChartLoadingSkeleton({
  height = 320,
  isDark = false,
}: {
  height: number;
  isDark?: boolean;
}) {
  return (
    <div
      className="relative w-full flex flex-col justify-between p-[var(--ant-spacing-4)]"
      style={{ height }}
      aria-label="Loading chart"
      role="status"
    >
      {/* Background skeleton structure */}
      <div className="w-full h-full flex flex-col justify-between animate-pulse opacity-50">
        <div className="flex items-center justify-between w-full mb-[var(--ant-spacing-3)]">
          <div
            className={clsx(
              "h-[var(--ant-spacing-4)] w-[var(--ant-spacing-24)] rounded-[var(--ant-radius-md)]",
              isDark
                ? "bg-[var(--ant-color-neutral-700)]"
                : "bg-[var(--ant-color-neutral-200)]"
            )}
          />
          <div
            className={clsx(
              "h-[var(--ant-spacing-4)] w-[var(--ant-spacing-20)] rounded-[var(--ant-radius-md)]",
              isDark
                ? "bg-[var(--ant-color-neutral-700)]"
                : "bg-[var(--ant-color-neutral-200)]"
            )}
          />
        </div>
        <div className="flex-1 w-full flex items-end gap-[var(--ant-spacing-3)] py-[var(--ant-spacing-4)]">
          {[40, 75, 55, 90, 65, 80, 45, 95].map((h, i) => (
            <div
              key={i}
              className={clsx(
                "flex-1 rounded-[var(--ant-radius-sm)]",
                isDark
                  ? "bg-[var(--ant-color-neutral-700)]"
                  : "bg-[var(--ant-color-neutral-200)]"
              )}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div
          className={clsx(
            "flex items-center justify-between w-full pt-[var(--ant-spacing-2)] border-t",
            isDark
              ? "border-[var(--ant-color-neutral-700)]"
              : "border-[var(--ant-color-neutral-200)]"
          )}
        >
          <div
            className={clsx(
              "h-[var(--ant-spacing-3)] w-[var(--ant-spacing-16)] rounded-[var(--ant-radius-sm)]",
              isDark
                ? "bg-[var(--ant-color-neutral-700)]"
                : "bg-[var(--ant-color-neutral-200)]"
            )}
          />
          <div
            className={clsx(
              "h-[var(--ant-spacing-3)] w-[var(--ant-spacing-16)] rounded-[var(--ant-radius-sm)]",
              isDark
                ? "bg-[var(--ant-color-neutral-700)]"
                : "bg-[var(--ant-color-neutral-200)]"
            )}
          />
          <div
            className={clsx(
              "h-[var(--ant-spacing-3)] w-[var(--ant-spacing-16)] rounded-[var(--ant-radius-sm)]",
              isDark
                ? "bg-[var(--ant-color-neutral-700)]"
                : "bg-[var(--ant-color-neutral-200)]"
            )}
          />
        </div>
      </div>

      {/* Central circular loading spinner */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div
          className={clsx(
            "flex items-center justify-center p-[var(--ant-spacing-3)] rounded-full backdrop-blur-xs shadow-[var(--ant-shadow-md)]",
            isDark
              ? "bg-[var(--ant-color-neutral-800)]/90 border border-[var(--ant-color-neutral-700)]"
              : "bg-[var(--ant-color-neutral-0)]/90 border border-[var(--ant-color-neutral-200)]"
          )}
        >
          <svg
            className="w-7 h-7 animate-spin text-[var(--ant-color-brand-primary)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Heatmap Visualization Component */
interface HeatmapProps {
  data: HeatmapDataPoint[];
  xLabels?: string[];
  yLabels?: string[];
  minHeatValue?: number;
  maxHeatValue?: number;
  height: number;
  valueFormatter?: (val: number) => string;
  categoryFormatter?: (val: string | number) => string;
  showTooltip?: boolean;
  animated?: boolean;
  colors: string[];
  isDark?: boolean;
}

function HeatmapChart({
  data,
  xLabels,
  yLabels,
  minHeatValue,
  maxHeatValue,
  height,
  valueFormatter,
  categoryFormatter,
  showTooltip = true,
  animated = true,
  colors,
  isDark = false,
}: HeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    point: HeatmapDataPoint;
    x: number;
    y: number;
  } | null>(null);

  // Auto-resolve unique X and Y categories if not explicitly provided
  const cols = useMemo(() => {
    if (xLabels && xLabels.length > 0) return xLabels;
    const set = new Set<string>();
    data.forEach((d) => set.add(String(d.x)));
    return Array.from(set);
  }, [data, xLabels]);

  const rows = useMemo(() => {
    if (yLabels && yLabels.length > 0) return yLabels;
    const set = new Set<string>();
    data.forEach((d) => set.add(String(d.y)));
    return Array.from(set);
  }, [data, yLabels]);

  // Lookup map for values
  const matrix = useMemo(() => {
    const map = new Map<string, HeatmapDataPoint>();
    data.forEach((d) => {
      map.set(`${d.x}-${d.y}`, d);
    });
    return map;
  }, [data]);

  // Min and Max values for intensity interpolation
  const { minVal, maxVal } = useMemo(() => {
    if (data.length === 0) return { minVal: 0, maxVal: 100 };
    let min = minHeatValue ?? Infinity;
    let max = maxHeatValue ?? -Infinity;
    if (minHeatValue === undefined || maxHeatValue === undefined) {
      data.forEach((d) => {
        if (d.value < min) min = d.value;
        if (d.value > max) max = d.value;
      });
    }
    if (min === max) max = min + 1;
    return { minVal: min, maxVal: max };
  }, [data, minHeatValue, maxHeatValue]);

  const baseColor = colors[0] || DEFAULT_CHART_COLORS[0];

  return (
    <div
      className="relative w-full flex flex-col justify-between select-none overflow-x-auto p-[var(--ant-spacing-2)]"
      style={{ minHeight: height }}
      onMouseLeave={() => setHoveredCell(null)}
    >
      <div className="flex-1 flex flex-col justify-center">
        {/* Heatmap Grid Table */}
        <div className="grid gap-[var(--ant-spacing-1)] w-full">
          {rows.map((rowLabel) => (
            <div
              key={`row-${rowLabel}`}
              className="flex items-center gap-[var(--ant-spacing-2)] w-full"
            >
              {/* Row Header */}
              <span
                className={clsx(
                  "w-[var(--ant-spacing-16)] shrink-0 text-right truncate text-[length:var(--ant-typography-fontSize-xs)]",
                  isDark
                    ? "text-[var(--ant-color-neutral-400)]"
                    : "text-[var(--ant-color-neutral-500)]"
                )}
              >
                {categoryFormatter ? categoryFormatter(rowLabel) : rowLabel}
              </span>

              {/* Row Cells */}
              <div className="flex-1 flex items-center gap-[var(--ant-spacing-1)]">
                {cols.map((colLabel) => {
                  const point = matrix.get(`${colLabel}-${rowLabel}`) || {
                    x: colLabel,
                    y: rowLabel,
                    value: 0,
                  };
                  const ratio = Math.max(
                    0,
                    Math.min(1, (point.value - minVal) / (maxVal - minVal))
                  );
                  // Opacity between 0.1 and 1.0 based on intensity
                  const opacity = 0.12 + ratio * 0.88;

                  return (
                    <button
                      key={`cell-${colLabel}-${rowLabel}`}
                      type="button"
                      aria-label={`${colLabel}, ${rowLabel}: ${point.value}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredCell({
                          point,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }}
                      className={clsx(
                        "flex-1 h-[var(--ant-spacing-8)] rounded-[var(--ant-radius-sm)] transition-transform",
                        "hover:scale-105 hover:ring-2 hover:ring-[var(--ant-color-brand-primary)]",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--ant-color-brand-primary)]",
                        animated && "transition-all duration-300"
                      )}
                      style={{
                        backgroundColor: baseColor,
                        opacity,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Column Headers */}
          <div className="flex items-center gap-[var(--ant-spacing-2)] w-full mt-[var(--ant-spacing-1)]">
            <span className="w-[var(--ant-spacing-16)] shrink-0" />
            <div className="flex-1 flex items-center gap-[var(--ant-spacing-1)]">
              {cols.map((colLabel) => (
                <span
                  key={`col-${colLabel}`}
                  className={clsx(
                    "flex-1 text-center truncate text-[length:var(--ant-typography-fontSize-xs)]",
                    isDark
                      ? "text-[var(--ant-color-neutral-400)]"
                      : "text-[var(--ant-color-neutral-500)]"
                  )}
                >
                  {categoryFormatter ? categoryFormatter(colLabel) : colLabel}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Legend Bar */}
      <div
        className={clsx(
          "flex items-center justify-end gap-[var(--ant-spacing-2)] mt-[var(--ant-spacing-3)] pt-[var(--ant-spacing-2)] border-t text-[length:var(--ant-typography-fontSize-xs)]",
          isDark
            ? "border-[var(--ant-color-neutral-700)] text-[var(--ant-color-neutral-400)]"
            : "border-[var(--ant-color-neutral-200)] text-[var(--ant-color-neutral-500)]"
        )}
      >
        <span>Less</span>
        <div className="flex items-center gap-[var(--ant-spacing-1)]">
          {[0.15, 0.35, 0.55, 0.75, 1.0].map((op, idx) => (
            <span
              key={idx}
              className="w-3.5 h-3.5 rounded-[var(--ant-radius-sm)] inline-block"
              style={{ backgroundColor: baseColor, opacity: op }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Interactive Tooltip Popover */}
      {showTooltip && hoveredCell && (
        <div
          className="fixed pointer-events-none transform -translate-x-1/2 -translate-y-full mb-[var(--ant-spacing-2)] z-[var(--ant-zIndex-tooltip)]"
          style={{ left: hoveredCell.x, top: hoveredCell.y }}
        >
          <UniformTooltip
            active={true}
            label={`${hoveredCell.point.y} • ${hoveredCell.point.x}`}
            payload={[
              {
                name: hoveredCell.point.label || "Value",
                value: hoveredCell.point.value,
                color: baseColor,
              },
            ]}
            valueFormatter={valueFormatter}
            isDark={isDark}
          />
        </div>
      )}
    </div>
  );
}

/**
 * ChartSuite Component
 * Comprehensive, responsive, theme-adaptive charting component supporting Line, Bar, Pie, Donut, Area, Radar, and Heatmap charts.
 */
export function ChartSuite({
  type,
  data,
  xAxisKey = "name",
  yAxisKey = "value",
  series,
  dataKey,
  title,
  subtitle,
  height = 320,
  colors,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showExport = true,
  exportFileName,
  onExport,
  animated = true,
  animationDuration = 800,
  stacked = false,
  innerRadius,
  outerRadius = "80%",
  centerLabel,
  centerValue,
  xLabels,
  yLabels,
  minHeatValue,
  maxHeatValue,
  valueFormatter,
  categoryFormatter,
  loading = false,
  headerActions,
  footer,
  theme: themeOverride,
  className,
  ...props
}: ChartSuiteProps) {
  const chartData = useMemo(() => data || [], [data]);
  const chartColors = useMemo(() => colors || DEFAULT_CHART_COLORS, [colors]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const idPrefix = useMemo(
    () => rawId.replace(/[^a-zA-Z0-9_-]/g, "_"),
    [rawId]
  );
  const themeCtx = useContext(ThemeContext);

  // Active theme resolution (supports prop override, ThemeContext, and DOM data-theme attribute)
  const activeTheme =
    themeOverride && themeOverride !== "auto"
      ? themeOverride
      : themeCtx?.theme ||
        (typeof document !== "undefined" &&
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light");
  const isDark = activeTheme === "dark";

  // Derive active series list
  const resolvedSeries = useMemo<ChartSeries[]>(() => {
    if (series && series.length > 0) {
      return series.map((s, idx) => ({
        ...s,
        color: s.color || chartColors[idx % chartColors.length],
        curveType: s.curveType || "monotone",
      }));
    }
    if (dataKey) {
      return [
        {
          dataKey,
          name: dataKey,
          color: chartColors[0],
          curveType: "monotone",
        },
      ];
    }
    // Auto-discover numeric keys from first data item if none provided
    if (chartData && chartData.length > 0 && typeof chartData[0] === "object" && chartData[0] !== null) {
      const firstItem = chartData[0] as Record<string, unknown>;
      const keys = Object.keys(firstItem).filter(
        (k) => k !== xAxisKey && typeof firstItem[k] === "number"
      );
      if (keys.length > 0) {
        return keys.map((k, idx) => ({
          dataKey: k,
          name: k,
          color: chartColors[idx % chartColors.length],
          curveType: "monotone",
        }));
      }
    }
    return [
      {
        dataKey: yAxisKey || "value",
        name: "Value",
        color: chartColors[0],
        curveType: "monotone",
      },
    ];
  }, [series, dataKey, chartData, xAxisKey, yAxisKey, chartColors]);

  // Export to PNG handler
  const handleExportPNG = useCallback(() => {
    if (!containerRef.current) return;

    try {
      const svgElement = containerRef.current.querySelector("svg");
      const filename = `${(
        exportFileName ||
        title ||
        `chart_${type}`
      )
        .toLowerCase()
        .replace(/\s+/g, "_")}.png`;

      if (svgElement) {
        const serializer = new XMLSerializer();
        const svgClone = svgElement.cloneNode(true) as SVGElement;
        const rect = svgElement.getBoundingClientRect();
        const width = rect.width || 600;
        const svgHeight = rect.height || height;

        svgClone.setAttribute("width", `${width}`);
        svgClone.setAttribute("height", `${svgHeight}`);

        // Resolve the theme background token to a concrete color — the exported
        // SVG is detached from the document where CSS variables would resolve.
        const resolvedBackground =
          getComputedStyle(containerRef.current).getPropertyValue(
            isDark
              ? "--ant-color-neutral-900"
              : "--ant-color-neutral-0"
          ).trim() || (isDark ? "var(--ant-color-neutral-900)" : "var(--ant-color-neutral-0)");

        // Background rect to prevent transparent exports
        const bgRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        bgRect.setAttribute("width", "100%");
        bgRect.setAttribute("height", "100%");
        bgRect.setAttribute("fill", resolvedBackground);
        svgClone.insertBefore(bgRect, svgClone.firstChild);

        const svgString = serializer.serializeToString(svgClone);
        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = 2;
          canvas.width = width * scale;
          canvas.height = svgHeight * scale;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.scale(scale, scale);
            ctx.drawImage(image, 0, 0);
            const pngURL = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngURL;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
          URL.revokeObjectURL(blobURL);
          onExport?.();
        };
        image.src = blobURL;
      }
    } catch (err) {
      console.error("Failed to export chart as PNG", err);
    }
  }, [exportFileName, title, type, height, isDark, onExport]);

  // Donut chart radii defaults
  const resolvedInnerRadius =
    type === "donut" ? innerRadius ?? "60%" : innerRadius ?? 0;

  // Chart rendering logic
  const renderChart = () => {
    if (loading) {
      return <ChartLoadingSkeleton height={height} isDark={isDark} />;
    }

    if (!chartData || chartData.length === 0) {
      return (
        <div
          className={clsx(
            "flex flex-col items-center justify-center text-[length:var(--ant-typography-fontSize-sm)]",
            isDark
              ? "text-[var(--ant-color-neutral-400)]"
              : "text-[var(--ant-color-neutral-500)]"
          )}
          style={{ height }}
        >
          <svg
            className="w-10 h-10 mb-[var(--ant-spacing-2)] opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span>No chart data available</span>
        </div>
      );
    }

    if (type === "heatmap") {
      return (
        <HeatmapChart
          data={chartData as HeatmapDataPoint[]}
          xLabels={xLabels}
          yLabels={yLabels}
          minHeatValue={minHeatValue}
          maxHeatValue={maxHeatValue}
          height={height}
          valueFormatter={valueFormatter}
          categoryFormatter={categoryFormatter}
          showTooltip={showTooltip}
          animated={animated}
          colors={chartColors}
          isDark={isDark}
        />
      );
    }

    const gridStroke = isDark
      ? "var(--ant-color-neutral-700)"
      : "var(--ant-color-neutral-200)";
    const axisTickStroke = isDark
      ? "var(--ant-color-neutral-400)"
      : "var(--ant-color-neutral-500)";

    return (
      <div
        className="relative w-full flex items-center justify-center"
        style={{ height }}
      >
        <ResponsiveContainer width="100%" height={height}>
          {(() => {
            switch (type) {
              case "line":
                return (
                  <LineChart
                    data={chartData}
                    margin={{ top: 12, right: 16, left: -8, bottom: 4 }}
                  >
                    {showGrid && (
                      <CartesianGrid
                        stroke={gridStroke}
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                    )}
                    {showXAxis && (
                      <XAxis
                        dataKey={xAxisKey}
                        stroke={axisTickStroke}
                        tick={{
                          fill: axisTickStroke,
                          fontSize: "var(--ant-typography-fontSize-xs)",
                        }}
                        tickFormatter={categoryFormatter}
                        tickLine={false}
                        axisLine={{ stroke: gridStroke }}
                      />
                    )}
                    {showYAxis && (
                      <YAxis
                        stroke={axisTickStroke}
                        tick={{
                          fill: axisTickStroke,
                          fontSize: "var(--ant-typography-fontSize-xs)",
                        }}
                        tickFormatter={valueFormatter}
                        tickLine={false}
                        axisLine={{ stroke: gridStroke }}
                      />
                    )}
                    {showTooltip && (
                      <RechartsTooltip
                        content={
                          <UniformTooltip
                            valueFormatter={valueFormatter}
                            categoryFormatter={categoryFormatter}
                            isDark={isDark}
                          />
                        }
                      />
                    )}
                    {showLegend && (
                      <RechartsLegend
                        wrapperStyle={{
                          paddingTop: "var(--ant-spacing-3)",
                          fontSize: "var(--ant-typography-fontSize-xs)",
                          color: isDark
                            ? "var(--ant-color-neutral-0)"
                            : "var(--ant-color-neutral-900)",
                        }}
                      />
                    )}
                    {resolvedSeries.map((s) => (
                      <Line
                        key={s.dataKey}
                        type={s.curveType || "monotone"}
                        dataKey={s.dataKey}
                        name={s.name || s.dataKey}
                        stroke={s.color}
                        strokeWidth={2.5}
                        strokeDasharray={s.strokeDasharray}
                        dot={
                          s.dot !== undefined
                            ? s.dot
                            : { r: 3, fill: s.color, strokeWidth: 0 }
                        }
                        activeDot={{ r: 6, fill: s.color, strokeWidth: 2 }}
                        isAnimationActive={animated}
                        animationDuration={animationDuration}
                      />
                    ))}
                  </LineChart>
                );

              case "bar":
                return (
                  <BarChart
                    data={chartData}
                    margin={{ top: 12, right: 16, left: -8, bottom: 4 }}
                  >
                    {showGrid && (
                      <CartesianGrid
                        stroke={gridStroke}
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                    )}
                    {showXAxis && (
                      <XAxis
                        dataKey={xAxisKey}
                        stroke={axisTickStroke}
                        tick={{
                          fill: axisTickStroke,
                          fontSize: "var(--ant-typography-fontSize-xs)",
                        }}
                        tickFormatter={categoryFormatter}
                        tickLine={false}
                        axisLine={{ stroke: gridStroke }}
                      />
                    )}
                    {showYAxis && (
                      <YAxis
                        stroke={axisTickStroke}
                        tick={{
                          fill: axisTickStroke,
                          fontSize: "var(--ant-typography-fontSize-xs)",
                        }}
                        tickFormatter={valueFormatter}
                        tickLine={false}
                        axisLine={{ stroke: gridStroke }}
                      />
                    )}
                    {showTooltip && (
                      <RechartsTooltip
                        content={
                          <UniformTooltip
                            valueFormatter={valueFormatter}
                            categoryFormatter={categoryFormatter}
                            isDark={isDark}
                          />
                        }
                      />
                    )}
                    {showLegend && (
                      <RechartsLegend
                        wrapperStyle={{
                          paddingTop: "var(--ant-spacing-3)",
                          fontSize: "var(--ant-typography-fontSize-xs)",
                          color: isDark
                            ? "var(--ant-color-neutral-0)"
                            : "var(--ant-color-neutral-900)",
                        }}
                      />
                    )}
                    {resolvedSeries.map((s) => (
                      <Bar
                        key={s.dataKey}
                        dataKey={s.dataKey}
                        name={s.name || s.dataKey}
                        fill={s.color}
                        stackId={stacked ? "chart-stack" : s.stackId}
                        radius={
                          stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]
                        }
                        isAnimationActive={animated}
                        animationDuration={animationDuration}
                      />
                    ))}
                  </BarChart>
                );

              case "area":
                return (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 12, right: 16, left: -8, bottom: 4 }}
                  >
                    <defs>
                      {resolvedSeries.map((s, idx) => (
                        <linearGradient
                          key={`gradient-${s.dataKey}`}
                          id={`${idPrefix}-gradient-${idx}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={s.color}
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor={s.color}
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    {showGrid && (
                      <CartesianGrid
                        stroke={gridStroke}
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                    )}
                    {showXAxis && (
                      <XAxis
                        dataKey={xAxisKey}
                        stroke={axisTickStroke}
                        tick={{
                          fill: axisTickStroke,
                          fontSize: "var(--ant-typography-fontSize-xs)",
                        }}
                        tickFormatter={categoryFormatter}
                        tickLine={false}
                        axisLine={{ stroke: gridStroke }}
                      />
                    )}
                    {showYAxis && (
                      <YAxis
                        stroke={axisTickStroke}
                        tick={{
                          fill: axisTickStroke,
                          fontSize: "var(--ant-typography-fontSize-xs)",
                        }}
                        tickFormatter={valueFormatter}
                        tickLine={false}
                        axisLine={{ stroke: gridStroke }}
                      />
                    )}
                    {showTooltip && (
                      <RechartsTooltip
                        content={
                          <UniformTooltip
                            valueFormatter={valueFormatter}
                            categoryFormatter={categoryFormatter}
                            isDark={isDark}
                          />
                        }
                      />
                    )}
                    {showLegend && (
                      <RechartsLegend
                        wrapperStyle={{
                          paddingTop: "var(--ant-spacing-3)",
                          fontSize: "var(--ant-typography-fontSize-xs)",
                          color: isDark
                            ? "var(--ant-color-neutral-0)"
                            : "var(--ant-color-neutral-900)",
                        }}
                      />
                    )}
                    {resolvedSeries.map((s, idx) => (
                      <Area
                        key={s.dataKey}
                        type={s.curveType || "monotone"}
                        dataKey={s.dataKey}
                        name={s.name || s.dataKey}
                        stroke={s.color}
                        strokeWidth={2.5}
                        fill={`url(#${idPrefix}-gradient-${idx})`}
                        stackId={stacked ? "chart-stack" : s.stackId}
                        isAnimationActive={animated}
                        animationDuration={animationDuration}
                      />
                    ))}
                  </AreaChart>
                );

              case "pie":
              case "donut":
                return (
                  <PieChart>
                    {showTooltip && (
                      <RechartsTooltip
                        content={
                          <UniformTooltip
                            valueFormatter={valueFormatter}
                            categoryFormatter={categoryFormatter}
                            isDark={isDark}
                          />
                        }
                      />
                    )}
                    {showLegend && (
                      <RechartsLegend
                        wrapperStyle={{
                          paddingTop: "var(--ant-spacing-3)",
                          fontSize: "var(--ant-typography-fontSize-xs)",
                          color: isDark
                            ? "var(--ant-color-neutral-0)"
                            : "var(--ant-color-neutral-900)",
                        }}
                      />
                    )}
                    <Pie
                      data={chartData}
                      dataKey={dataKey || resolvedSeries[0]?.dataKey || "value"}
                      nameKey={xAxisKey || "name"}
                      cx="50%"
                      cy="50%"
                      innerRadius={resolvedInnerRadius}
                      outerRadius={outerRadius}
                      paddingAngle={0}
                      isAnimationActive={animated}
                      animationDuration={animationDuration}
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                );

              case "radar":
                return (
                  <RadarChart
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={outerRadius}
                  >
                    <PolarGrid stroke={gridStroke} />
                    <PolarAngleAxis
                      dataKey={xAxisKey}
                      stroke={axisTickStroke}
                      tick={{
                        fill: axisTickStroke,
                        fontSize: "var(--ant-typography-fontSize-xs)",
                      }}
                    />
                    <PolarRadiusAxis
                      stroke={gridStroke}
                      tick={{
                        fill: axisTickStroke,
                        fontSize: "var(--ant-typography-fontSize-xs)",
                      }}
                    />
                    {showTooltip && (
                      <RechartsTooltip
                        content={
                          <UniformTooltip
                            valueFormatter={valueFormatter}
                            categoryFormatter={categoryFormatter}
                            isDark={isDark}
                          />
                        }
                      />
                    )}
                    {showLegend && (
                      <RechartsLegend
                        wrapperStyle={{
                          paddingTop: "var(--ant-spacing-3)",
                          fontSize: "var(--ant-typography-fontSize-xs)",
                          color: isDark
                            ? "var(--ant-color-neutral-0)"
                            : "var(--ant-color-neutral-900)",
                        }}
                      />
                    )}
                    {resolvedSeries.map((s) => (
                      <Radar
                        key={s.dataKey}
                        name={s.name || s.dataKey}
                        dataKey={s.dataKey}
                        stroke={s.color}
                        fill={s.color}
                        fillOpacity={0.35}
                        strokeWidth={2}
                        isAnimationActive={animated}
                        animationDuration={animationDuration}
                      />
                    ))}
                  </RadarChart>
                );

              default:
                return null;
            }
          })()}
        </ResponsiveContainer>
        {/* Central Label for Donut Charts */}
        {type === "donut" && (centerValue || centerLabel) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
            style={{
              paddingBottom: showLegend
                ? "var(--ant-spacing-6)"
                : "var(--ant-spacing-0)",
            }}
          >
            {centerValue && (
              <span
                className={clsx(
                  "font-bold text-[length:var(--ant-typography-fontSize-2xl)] leading-tight text-center",
                  isDark
                    ? "text-[var(--ant-color-neutral-0)]"
                    : "text-[var(--ant-color-neutral-900)]"
                )}
              >
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span
                className={clsx(
                  "text-[length:var(--ant-typography-fontSize-xs)] leading-tight text-center mt-0.5",
                  isDark
                    ? "text-[var(--ant-color-neutral-400)]"
                    : "text-[var(--ant-color-neutral-500)]"
                )}
              >
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const hasHeader = Boolean(title || subtitle || showExport || headerActions);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "flex flex-col w-full rounded-[var(--ant-radius-xl)] transition-all",
        "p-[var(--ant-spacing-4)] shadow-[var(--ant-shadow-sm)]",
        isDark
          ? "bg-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-0)] border border-[var(--ant-color-neutral-700)]"
          : "bg-[var(--ant-color-neutral-0)] text-[var(--ant-color-neutral-900)] border border-[var(--ant-color-neutral-200)]",
        className
      )}
      {...props}
    >
      {/* Header section */}
      {hasHeader && (
        <div
          className={clsx(
            "flex items-start justify-between gap-[var(--ant-spacing-3)] mb-[var(--ant-spacing-4)] pb-[var(--ant-spacing-2)] border-b",
            isDark
              ? "border-[var(--ant-color-neutral-700)]"
              : "border-[var(--ant-color-neutral-200)]"
          )}
        >
          <div className="min-w-0 flex-1">
            {title && (
              <h3
                className={clsx(
                  "font-semibold text-[length:var(--ant-typography-fontSize-base)] truncate",
                  isDark
                    ? "text-[var(--ant-color-neutral-0)]"
                    : "text-[var(--ant-color-neutral-900)]"
                )}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                className={clsx(
                  "text-[length:var(--ant-typography-fontSize-xs)] mt-0.5",
                  isDark
                    ? "text-[var(--ant-color-neutral-400)]"
                    : "text-[var(--ant-color-neutral-500)]"
                )}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-[var(--ant-spacing-2)] shrink-0">
            {headerActions}
            {showExport && !loading && (
              <button
                type="button"
                onClick={handleExportPNG}
                aria-label="Export chart as PNG"
                title="Export as PNG"
                className={clsx(
                  "inline-flex items-center gap-[var(--ant-spacing-1)] px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)]",
                  "text-[length:var(--ant-typography-fontSize-xs)] font-medium",
                  isDark
                    ? "text-[var(--ant-color-neutral-0)] bg-[var(--ant-color-neutral-800)] border border-[var(--ant-color-neutral-700)] hover:bg-[var(--ant-color-neutral-700)]"
                    : "text-[var(--ant-color-neutral-900)] bg-[var(--ant-color-neutral-50)] border border-[var(--ant-color-neutral-200)] hover:bg-[var(--ant-color-neutral-100)]",
                  "hover:text-[var(--ant-color-brand-primary)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)]",
                  "transition-colors select-none cursor-pointer"
                )}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Export PNG</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Chart Body */}
      <div className="w-full flex-1 min-h-0 relative">{renderChart()}</div>

      {/* Optional Footer */}
      {footer && (
        <div
          className={clsx(
            "mt-[var(--ant-spacing-3)] pt-[var(--ant-spacing-2)] border-t",
            isDark
              ? "border-[var(--ant-color-neutral-700)]"
              : "border-[var(--ant-color-neutral-200)]"
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
