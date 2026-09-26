import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["custom", "text", "avatar", "card", "table", "table-row", "chart"],
      description: "Pre-built skeleton layout variant",
    },
    animated: {
      control: "boolean",
      description: "Enable shimmer animation",
    },
    rows: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description: "Number of rows for text/table variants",
    },
    circle: {
      control: "boolean",
      description: "Render as circle (for custom variant)",
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "full"],
      description: "Border radius preset",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextBlock: Story = {
  name: "Text Block",
  args: {
    variant: "text",
    rows: 4,
    animated: true,
  },
};

export const Avatar: Story = {
  name: "Avatar",
  args: {
    variant: "avatar",
    width: 64,
    height: 64,
    circle: true,
    animated: true,
  },
};

export const Card: Story = {
  name: "Card",
  args: {
    variant: "card",
    animated: true,
  },
};

export const Table: Story = {
  name: "Table",
  args: {
    variant: "table",
    rows: 5,
    animated: true,
  },
};

export const Chart: Story = {
  name: "Dashboard Chart",
  args: {
    variant: "chart",
    animated: true,
  },
};

export const CustomShape: Story = {
  name: "Custom Dimensions",
  args: {
    variant: "custom",
    width: 320,
    height: 80,
    radius: "xl",
    animated: true,
  },
};

export const WithoutAnimation: Story = {
  name: "Static (No Animation)",
  args: {
    variant: "card",
    animated: false,
  },
};

export const ComposableCustomLayout: Story = {
  name: "Composable Complex Layout",
  render: () => (
    <div className="p-6 rounded-2xl border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] max-w-xl flex flex-col gap-6 shadow-sm">
      {/* Top Profile Banner */}
      <div className="flex items-center gap-4">
        <Skeleton.Avatar width={56} height={56} circle />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton.Custom width="40%" height={16} radius="sm" />
          <Skeleton.Custom width="25%" height={12} radius="sm" />
        </div>
        <Skeleton.Custom width={90} height={36} radius="lg" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-[var(--ant-color-surface-border)] flex flex-col gap-2">
          <Skeleton.Custom width="60%" height={12} radius="sm" />
          <Skeleton.Custom width="80%" height={24} radius="md" />
        </div>
        <div className="p-4 rounded-xl border border-[var(--ant-color-surface-border)] flex flex-col gap-2">
          <Skeleton.Custom width="60%" height={12} radius="sm" />
          <Skeleton.Custom width="80%" height={24} radius="md" />
        </div>
        <div className="p-4 rounded-xl border border-[var(--ant-color-surface-border)] flex flex-col gap-2">
          <Skeleton.Custom width="60%" height={12} radius="sm" />
          <Skeleton.Custom width="80%" height={24} radius="md" />
        </div>
      </div>

      {/* Content description */}
      <Skeleton.Text rows={3} />
    </div>
  ),
};
