import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChartSuite } from "./ChartSuite";
import type { ChartSuiteProps } from "./ChartSuite";

const monthlyPerformanceData = [
  { month: "Jan", revenue: 4200, expenses: 2400, profit: 1800 },
  { month: "Feb", revenue: 4800, expenses: 2700, profit: 2100 },
  { month: "Mar", revenue: 5600, expenses: 3100, profit: 2500 },
  { month: "Apr", revenue: 6100, expenses: 3300, profit: 2800 },
  { month: "May", revenue: 5900, expenses: 3200, profit: 2700 },
  { month: "Jun", revenue: 7200, expenses: 3900, profit: 3300 },
  { month: "Jul", revenue: 8400, expenses: 4300, profit: 4100 },
];

const deviceShareData = [
  { name: "Desktop", value: 54 },
  { name: "Mobile", value: 33 },
  { name: "Tablet", value: 13 },
];

const trafficSourceData = [
  { source: "Organic", visitors: 34200, conversion: 3.8 },
  { source: "Referral", visitors: 18400, conversion: 2.9 },
  { source: "Social", visitors: 22100, conversion: 1.7 },
  { source: "Email", visitors: 14800, conversion: 4.6 },
  { source: "Paid Ads", visitors: 28900, conversion: 2.4 },
];

const performanceRadarData = [
  { metric: "Performance", candidate: 92, benchmark: 75 },
  { metric: "Reliability", candidate: 88, benchmark: 80 },
  { metric: "Security", candidate: 95, benchmark: 85 },
  { metric: "Usability", candidate: 78, benchmark: 70 },
  { metric: "Accessibility", candidate: 90, benchmark: 65 },
  { metric: "Scalability", candidate: 84, benchmark: 78 },
];

const weeklyHeatmapData = [
  // Monday
  { x: "Mon", y: "Night", value: 12 },
  { x: "Mon", y: "Morning", value: 68 },
  { x: "Mon", y: "Afternoon", value: 92 },
  { x: "Mon", y: "Evening", value: 45 },
  // Tuesday
  { x: "Tue", y: "Night", value: 18 },
  { x: "Tue", y: "Morning", value: 74 },
  { x: "Tue", y: "Afternoon", value: 88 },
  { x: "Tue", y: "Evening", value: 52 },
  // Wednesday
  { x: "Wed", y: "Night", value: 15 },
  { x: "Wed", y: "Morning", value: 85 },
  { x: "Wed", y: "Afternoon", value: 96 },
  { x: "Wed", y: "Evening", value: 60 },
  // Thursday
  { x: "Thu", y: "Night", value: 22 },
  { x: "Thu", y: "Morning", value: 79 },
  { x: "Thu", y: "Afternoon", value: 84 },
  { x: "Thu", y: "Evening", value: 58 },
  // Friday
  { x: "Fri", y: "Night", value: 30 },
  { x: "Fri", y: "Morning", value: 65 },
  { x: "Fri", y: "Afternoon", value: 72 },
  { x: "Fri", y: "Evening", value: 82 },
  // Saturday
  { x: "Sat", y: "Night", value: 48 },
  { x: "Sat", y: "Morning", value: 35 },
  { x: "Sat", y: "Afternoon", value: 44 },
  { x: "Sat", y: "Evening", value: 76 },
  // Sunday
  { x: "Sun", y: "Night", value: 38 },
  { x: "Sun", y: "Morning", value: 28 },
  { x: "Sun", y: "Afternoon", value: 36 },
  { x: "Sun", y: "Evening", value: 50 },
];

const meta = {
  title: "Data/ChartSuite",
  component: ChartSuite,
  tags: ["autodocs"],
  parameters: {
    controls: {
      exclude: [
        "data",
        "series",
        "colors",
        "xLabels",
        "yLabels",
        "headerActions",
        "footer",
        "valueFormatter",
        "categoryFormatter",
      ],
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["line", "bar", "pie", "donut", "area", "radar", "heatmap"],
      description: "Chart visualization type",
    },
    title: { control: "text", description: "Card title" },
    subtitle: { control: "text", description: "Card subtitle" },
    height: { control: { type: "range", min: 200, max: 600, step: 20 } },
    showLegend: { control: "boolean" },
    showTooltip: { control: "boolean" },
    showGrid: { control: "boolean" },
    showXAxis: { control: "boolean" },
    showYAxis: { control: "boolean" },
    showExport: { control: "boolean" },
    animated: { control: "boolean" },
    stacked: { control: "boolean" },
    loading: { control: "boolean" },
    theme: {
      control: "select",
      options: ["light", "dark", "auto"],
      description: "Theme mode override",
    },
    data: { control: false },
    series: { control: false },
    colors: { control: false },
    xLabels: { control: false },
    yLabels: { control: false },
    valueFormatter: { control: false },
    categoryFormatter: { control: false },
    headerActions: { control: false },
    footer: { control: false },
    onExport: { action: "exported" },
  },
} satisfies Meta<typeof ChartSuite>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={monthlyPerformanceData}
      xAxisKey="month"
      series={[
        {
          dataKey: "revenue",
          name: "Revenue",
          color: "var(--ant-color-brand-primary)",
          unit: "$",
        },
        {
          dataKey: "profit",
          name: "Profit",
          color: "var(--ant-color-semantic-success)",
          unit: "$",
        },
      ]}
      valueFormatter={(val) => `$${val.toLocaleString()}`}
    />
  ),
  args: {
    type: "line",
    title: "Revenue Overview",
    subtitle: "Monthly performance",
    height: 320,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showExport: true,
    animated: true,
  },
};

export const Line: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={monthlyPerformanceData}
      xAxisKey="month"
      series={[
        {
          dataKey: "revenue",
          name: "Revenue",
          color: "var(--ant-color-brand-primary)",
          unit: "$",
        },
        {
          dataKey: "expenses",
          name: "Expenses",
          color: "var(--ant-color-semantic-error)",
          unit: "$",
        },
        {
          dataKey: "profit",
          name: "Net Profit",
          color: "var(--ant-color-semantic-success)",
          unit: "$",
        },
      ]}
      valueFormatter={(val) => `$${val.toLocaleString()}`}
    />
  ),
  args: {
    type: "line",
    title: "Revenue vs Expenses",
    subtitle: "Monthly performance overview in USD",
    height: 340,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showExport: true,
    animated: true,
  },
};

export const Bar: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={trafficSourceData}
      xAxisKey="source"
      series={[
        {
          dataKey: "visitors",
          name: "Total Visitors",
          color: "var(--ant-color-brand-primary)",
        },
      ]}
      valueFormatter={(val) => `${val.toLocaleString()} visits`}
    />
  ),
  args: {
    type: "bar",
    title: "Traffic & Visitors by Source",
    subtitle: "Acquisition breakdown for current quarter",
    height: 320,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showExport: true,
    animated: true,
  },
};

export const StackedBar: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={monthlyPerformanceData}
      xAxisKey="month"
      stacked={true}
      series={[
        {
          dataKey: "expenses",
          name: "Expenses",
          color: "var(--ant-color-semantic-error)",
        },
        {
          dataKey: "profit",
          name: "Profit",
          color: "var(--ant-color-semantic-success)",
        },
      ]}
      valueFormatter={(val) => `$${val.toLocaleString()}`}
    />
  ),
  args: {
    type: "bar",
    title: "Revenue & Expenses Breakdown",
    subtitle: "Stacked financial comparison",
    stacked: true,
    height: 320,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showExport: true,
    animated: true,
  },
};

export const Pie: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={deviceShareData}
      xAxisKey="name"
      dataKey="value"
      valueFormatter={(val) => `${val}%`}
    />
  ),
  args: {
    type: "pie",
    title: "Traffic by Device",
    subtitle: "Distribution of active user sessions",
    height: 320,
    showLegend: true,
    showTooltip: true,
    showExport: true,
    animated: true,
  },
};

export const Donut: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={deviceShareData}
      xAxisKey="name"
      dataKey="value"
      centerValue="100%"
      centerLabel="Total Traffic"
      valueFormatter={(val) => `${val}%`}
    />
  ),
  args: {
    type: "donut",
    title: "Device Share (Donut)",
    subtitle: "Breakdown with center total indicator",
    innerRadius: "60%",
    centerValue: "100%",
    centerLabel: "Total Traffic",
    height: 320,
    showLegend: true,
    showTooltip: true,
    showExport: true,
    animated: true,
  },
};

export const Area: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={monthlyPerformanceData}
      xAxisKey="month"
      series={[
        {
          dataKey: "revenue",
          name: "Revenue",
          color: "var(--ant-color-brand-primary)",
        },
        {
          dataKey: "profit",
          name: "Net Profit",
          color: "var(--ant-color-brand-accent)",
        },
      ]}
      valueFormatter={(val) => `$${val.toLocaleString()}`}
    />
  ),
  args: {
    type: "area",
    title: "Growth Trend",
    subtitle: "Cumulative performance with gradient fill",
    height: 320,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showExport: true,
    animated: true,
  },
};

export const Radar: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={performanceRadarData}
      xAxisKey="metric"
      series={[
        {
          dataKey: "candidate",
          name: "Current System",
          color: "var(--ant-color-brand-primary)",
        },
        {
          dataKey: "benchmark",
          name: "Industry Benchmark",
          color: "var(--ant-color-brand-accent)",
        },
      ]}
      valueFormatter={(val) => `${val}/100`}
    />
  ),
  args: {
    type: "radar",
    title: "System Performance Audit",
    subtitle: "Current metrics vs industry benchmark (Score out of 100)",
    height: 340,
    showLegend: true,
    showTooltip: true,
    showExport: true,
    animated: true,
  },
};

export const Heatmap: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={weeklyHeatmapData}
      xLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
      yLabels={["Night", "Morning", "Afternoon", "Evening"]}
      colors={["var(--ant-color-brand-primary)"]}
      valueFormatter={(val) => `${val} active users`}
    />
  ),
  args: {
    type: "heatmap",
    title: "Weekly Activity Heatmap",
    subtitle: "User activity density across days and time segments",
    height: 300,
    showTooltip: true,
    showExport: true,
    animated: true,
  },
};

export const Loading: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={[]}
    />
  ),
  args: {
    type: "line",
    title: "Loading State Example",
    subtitle: "Displays animated skeleton placeholder",
    loading: true,
    height: 320,
  },
};

export const Empty: Story = {
  render: (args) => (
    <ChartSuite
      {...args}
      data={[]}
    />
  ),
  args: {
    type: "bar",
    title: "Empty State Example",
    subtitle: "Displays placeholder when no dataset is provided",
    height: 300,
  },
};

