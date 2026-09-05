import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./StatCard";
import { ThemeContext } from "../../../providers/ThemeProvider";

const meta = {
  title: "Data/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Metric label describing what the number represents",
    },
    value: {
      control: "number",
      description: "Current numerical metric value",
    },
    trend: {
      control: "select",
      options: [undefined, "up", "down"],
      description: "Trend direction",
    },
    trendValue: {
      control: "text",
      description: "Trend comparison value or percentage text",
    },
    period: {
      control: "text",
      description: "Period description for comparison",
    },
    prefix: {
      control: "text",
      description: "Content displayed before the value",
    },
    suffix: {
      control: "text",
      description: "Content displayed after the value",
    },
    loading: {
      control: "boolean",
      description: "Whether the card is in an animated skeleton loading state",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 1. Default: Basic KPI card displaying a simple count metric.
 */
export const Default: Story = {
  args: {
    label: "Active Users",
    value: 12450,
  },
};

/**
 * 2. WithPrefix: Currency metric with dollar sign prefix.
 */
export const WithPrefix: Story = {
  args: {
    label: "Total Revenue",
    value: 125430,
    prefix: "$",
  },
};

/**
 * 3. WithSuffix: Rate metric with percentage suffix.
 */
export const WithSuffix: Story = {
  args: {
    label: "Conversion Rate",
    value: 85.4,
    suffix: "%",
  },
};

/**
 * 4. TrendingUp: Financial KPI with positive trend indicator and period comparison badge.
 */
export const TrendingUp: Story = {
  args: {
    label: "Monthly Recurring Revenue",
    value: 48500,
    prefix: "$",
    trend: "up",
    trendValue: "+12.5%",
    period: "vs last month",
  },
};

/**
 * 5. TrendingDown: Performance KPI with downward trend indicator.
 */
export const TrendingDown: Story = {
  args: {
    label: "Bounce Rate",
    value: 34.2,
    suffix: "%",
    trend: "down",
    trendValue: "-4.8%",
    period: "vs last week",
  },
};

/**
 * 6. WithSparkline: Metric card featuring a responsive mini sparkline chart.
 */
export const WithSparkline: Story = {
  args: {
    label: "Server Requests",
    value: 94200,
    sparklineData: [45, 52, 49, 62, 58, 71, 84, 95],
    trend: "up",
    trendValue: "+18.2%",
    period: "past 7 days",
  },
};

/**
 * 7. Loading: Skeleton placeholder state when metric data is fetching.
 */
export const Loading: Story = {
  args: {
    label: "Active Subscribers",
    value: 3820,
    sparklineData: [10, 20, 15, 30],
    loading: true,
  },
};

/**
 * 8. LargeValue: Tests high-magnitude values and ensures layout resilience without overflow.
 */
export const LargeValue: Story = {
  args: {
    label: "Total Volume Processed",
    value: 14892500,
    prefix: "$",
    trend: "up",
    trendValue: "+24.8%",
    period: "all-time record",
    sparklineData: [120, 150, 180, 210, 260, 310, 390],
  },
};

/**
 * 9. DarkTheme: Demonstrates seamless design-token adaptation in dark theme.
 */
export const DarkTheme: Story = {
  args: {
    label: "Annual Recurring Revenue",
    value: 1250000,
    prefix: "$",
    trend: "up",
    trendValue: "+14.2%",
    period: "vs previous year",
    sparklineData: [60, 68, 75, 82, 90, 105, 125],
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <ThemeContext.Provider
        value={{ theme: "dark", toggleTheme: () => {}, setTheme: () => {} }}
      >
        <div
          data-theme="dark"
          className="p-[var(--ant-spacing-6)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-100)] max-w-xs"
        >
          <Story />
        </div>
      </ThemeContext.Provider>
    ),
  ],
};
