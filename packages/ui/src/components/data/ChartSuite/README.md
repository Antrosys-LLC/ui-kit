# ChartSuite

`ChartSuite` is a flexible, theme-adaptive, responsive charting component for dashboards and analytical views. Built on top of Recharts, it supports 7 core visualization types, animated transitions, custom design-token tooltips, light/dark mode support, and one-click PNG exports.

## Supported Chart Types

1. **Line Chart** (`type="line"`) — Multi-series trend visualization with customizable curve smoothing and dot markers.
2. **Bar Chart** (`type="bar"`) — Categorical data comparisons with support for grouping and stacked layouts.
3. **Pie / Donut Chart** (`type="pie"` / `type="donut"`) — Proportional distribution with customizable radii and central summary labels.
4. **Area Chart** (`type="area"`) — Trend volume visualization with smooth gradient fills and stacking.
5. **Radar Chart** (`type="radar"`) — Multi-variable comparative analysis and benchmarking.
6. **Heatmap** (`type="heatmap"`) — 2D activity density matrix across category axes with interactive cell tooltips.

---

## Usage Examples

### Line Chart (Multi-Series)

```tsx
import { ChartSuite } from "@antrosys/ui";

const monthlyData = [
  { month: "Jan", revenue: 4200, expenses: 2400 },
  { month: "Feb", revenue: 4800, expenses: 2700 },
  { month: "Mar", revenue: 5600, expenses: 3100 },
];

<ChartSuite
  type="line"
  title="Financial Performance"
  subtitle="Monthly revenue vs expenses"
  data={monthlyData}
  xAxisKey="month"
  series={[
    { dataKey: "revenue", name: "Revenue", color: "var(--ant-color-brand-primary)" },
    { dataKey: "expenses", name: "Expenses", color: "var(--ant-color-semantic-error)" },
  ]}
  valueFormatter={(val) => `$${val.toLocaleString()}`}
/>
```

### Donut Chart with Center Metric

```tsx
const deviceData = [
  { name: "Desktop", value: 55 },
  { name: "Mobile", value: 33 },
  { name: "Tablet", value: 12 },
];

<ChartSuite
  type="donut"
  title="Traffic Share"
  subtitle="Distribution by device"
  data={deviceData}
  xAxisKey="name"
  dataKey="value"
  centerValue="100%"
  centerLabel="Total Share"
  valueFormatter={(val) => `${val}%`}
/>
```

### Activity Heatmap

```tsx
const activityMatrix = [
  { x: "Mon", y: "Morning", value: 68 },
  { x: "Mon", y: "Afternoon", value: 92 },
  { x: "Tue", y: "Morning", value: 74 },
  { x: "Tue", y: "Afternoon", value: 88 },
];

<ChartSuite
  type="heatmap"
  title="User Activity Heatmap"
  subtitle="Hourly traffic density"
  data={activityMatrix}
  xLabels={["Mon", "Tue", "Wed", "Thu", "Fri"]}
  yLabels={["Morning", "Afternoon", "Evening"]}
  valueFormatter={(val) => `${val} active users`}
/>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"line" \| "bar" \| "pie" \| "donut" \| "area" \| "radar" \| "heatmap"` | — | Visualization chart type (required) |
| `data` | `Record<string, any>[] \| HeatmapDataPoint[]` | `[]` | Data array to render (required) |
| `xAxisKey` | `string` | `"name"` | Data property key for X-axis / category labels |
| `yAxisKey` | `string` | `"value"` | Data property key for Y-axis (or radar values) |
| `series` | `ChartSeries[]` | auto-detected | Configuration array for multi-series charts |
| `dataKey` | `string` | — | Shorthand data key for single-series or pie charts |
| `title` | `string` | — | Card header title |
| `subtitle` | `string` | — | Card header subtitle / description |
| `height` | `number` | `320` | Chart container height in pixels |
| `colors` | `string[]` | design tokens | Custom color palette array for series/slices |
| `showLegend` | `boolean` | `true` | Toggle display of chart legend |
| `showTooltip` | `boolean` | `true` | Toggle uniform hover tooltip |
| `showGrid` | `boolean` | `true` | Toggle Cartesian / Polar grid lines |
| `showXAxis` | `boolean` | `true` | Toggle X-axis display |
| `showYAxis` | `boolean` | `true` | Toggle Y-axis display |
| `showExport` | `boolean` | `true` | Toggle Export to PNG button in header |
| `exportFileName` | `string` | title-based | Custom filename for exported PNG image |
| `onExport` | `() => void` | — | Callback invoked when export is triggered |
| `animated` | `boolean` | `true` | Enable entrance animations |
| `animationDuration`| `number` | `800` | Duration of entrance animation in ms |
| `stacked` | `boolean` | `false` | Enable stacked mode for Bar and Area charts |
| `innerRadius` | `number \| string` | `"60%"` (donut) / `0` (pie) | Inner radius for donut hole |
| `outerRadius` | `number \| string` | `"80%"` | Outer radius for pie / radar charts |
| `centerLabel` | `string` | — | Subtitle label rendered inside donut center |
| `centerValue` | `string \| number` | — | Metric value rendered inside donut center |
| `xLabels` | `string[]` | auto-detected | Column categories for Heatmap |
| `yLabels` | `string[]` | auto-detected | Row categories for Heatmap |
| `minHeatValue` | `number` | auto-calculated | Lower bound value for Heatmap color scale |
| `maxHeatValue` | `number` | auto-calculated | Upper bound value for Heatmap color scale |
| `valueFormatter` | `(value: number) => string` | — | Value formatter for tooltips and Y-axis |
| `categoryFormatter` | `(value: string \| number) => string` | — | Category / date formatter for X-axis |
| `loading` | `boolean` | `false` | Show animated skeleton loading state |
| `headerActions` | `ReactNode` | — | Custom actions rendered in header toolbar |
| `footer` | `ReactNode` | — | Custom content rendered in card footer |
| `theme` | `"light" \| "dark" \| "auto"` | `"auto"` | Explicit theme override |

### `ChartSeries` Interface

| Property | Type | Description |
|---|---|---|
| `dataKey` | `string` | Property key in each data object (required) |
| `name` | `string` | Human-readable series label for legend and tooltip |
| `color` | `string` | Series stroke/fill color (CSS variable or hex) |
| `unit` | `string` | Suffix unit (e.g. `"$"` or `"%"` or `"pts"`) |
| `curveType` | `"monotone" \| "linear" \| "natural" \| "step"` | Line / Area curve interpolation type |
| `stackId` | `string` | Stack identifier for bar/area grouping |
| `strokeDasharray` | `string` | SVG stroke dash array pattern (e.g. `"4 4"`) |
| `dot` | `boolean \| object` | Toggle or configure point markers |
