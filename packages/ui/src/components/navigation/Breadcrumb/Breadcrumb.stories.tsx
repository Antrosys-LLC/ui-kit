import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";

const defaultCrumbs: BreadcrumbItem[] = [
  { label: "Home", href: "#" },
  { label: "Products", href: "#" },
  { label: "Electronics" },
];

const deepCrumbs: BreadcrumbItem[] = [
  { label: "Home", href: "#" },
  { label: "Products", href: "#" },
  { label: "Electronics", href: "#" },
  { label: "Laptops", href: "#" },
  { label: 'Pro Model 16"' },
];

const meta = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  argTypes: {
    crumbs: {
      control: "object",
      description: "Array of breadcrumb trail items with labels, links, and click handlers",
    },
    separator: {
      control: "text",
      description: "Custom separator node between items (default: '/')",
    },
    maxVisible: {
      control: "number",
      description: "Maximum visible items before collapsing with an ellipsis",
    },
    jsonLd: {
      control: "boolean",
      description: "Enable schema.org JSON-LD script for SEO",
    },
    onItemClick: {
      action: "item clicked",
      description: "Callback triggered when any crumb link is clicked",
    },
    className: {
      control: "text",
      description: "Optional additional CSS classes",
    },
  },
  args: {
    crumbs: defaultCrumbs,
    separator: "/",
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    crumbs: defaultCrumbs,
    separator: "/",
  },
};

export const CustomSeparator: Story = {
  args: {
    crumbs: defaultCrumbs,
    separator: ">",
  },
};

export const ArrowSeparator: Story = {
  args: {
    crumbs: defaultCrumbs,
    separator: "→",
  },
};

export const BulletSeparator: Story = {
  args: {
    crumbs: defaultCrumbs,
    separator: "•",
  },
};

export const CollapsedWithEllipsis: Story = {
  args: {
    crumbs: deepCrumbs,
    maxVisible: 3,
    separator: "/",
  },
};

export const DeepTrail: Story = {
  args: {
    crumbs: [
      { label: "Home", href: "#" },
      { label: "Departments", href: "#" },
      { label: "Electronics", href: "#" },
      { label: "Computers", href: "#" },
      { label: "Laptops", href: "#" },
      { label: 'Workstation 16"' },
    ],
    separator: "/",
  },
};

export const TwoItems: Story = {
  args: {
    crumbs: [{ label: "Dashboard", href: "#" }, { label: "Analytics" }],
    separator: "/",
  },
};

export const WithJsonLd: Story = {
  args: {
    crumbs: [
      { label: "Home", href: "https://example.com" },
      { label: "Products", href: "https://example.com/products" },
      { label: "Electronics" },
    ],
    separator: "/",
    jsonLd: true,
  },
};

export const OnItemClick: Story = {
  args: {
    crumbs: deepCrumbs,
    separator: "/",
  },
};

function InteractiveTrailDemo(args: React.ComponentProps<typeof Breadcrumb>) {
  const [trail, setTrail] = useState<string[]>(["Home", "Products", "Electronics"]);
  const sequence = ["Home", "Products", "Electronics", "Laptops", 'Pro Model 16"'];

  const crumbs: BreadcrumbItem[] = trail.map((item, index) => {
    const isCurrent = index === trail.length - 1;
    return {
      label: item,
      href: isCurrent ? undefined : "#",
      onClick: (e) => {
        e.preventDefault();
        setTrail(trail.slice(0, index + 1));
      },
    };
  });

  const nextIndex = sequence.indexOf(trail[trail.length - 1]) + 1;
  const nextItem = nextIndex > 0 && nextIndex < sequence.length ? sequence[nextIndex] : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--ant-spacing-4)",
      }}
    >
      <Breadcrumb {...args} crumbs={crumbs} />
      <div
        style={{
          display: "flex",
          gap: "var(--ant-spacing-2)",
          alignItems: "center",
        }}
      >
        {nextItem && (
          <button
            type="button"
            onClick={() => setTrail([...trail, nextItem])}
            style={{
              padding: "var(--ant-spacing-2) var(--ant-spacing-4)",
              fontSize: "var(--ant-typography-fontsize-sm)",
              fontWeight: 500,
              color: "var(--ant-color-neutral-0)",
              backgroundColor: "var(--ant-color-brand-primary)",
              border: "none",
              borderRadius: "var(--ant-radius-md)",
              cursor: "pointer",
            }}
          >
            Go deeper → {nextItem}
          </button>
        )}
        {trail.length > 1 && (
          <button
            type="button"
            onClick={() => setTrail(trail.slice(0, -1))}
            style={{
              padding: "var(--ant-spacing-2) var(--ant-spacing-4)",
              fontSize: "var(--ant-typography-fontsize-sm)",
              fontWeight: 500,
              color: "var(--ant-color-neutral-900)",
              backgroundColor: "var(--ant-color-neutral-100)",
              border: "1px solid var(--ant-color-neutral-300)",
              borderRadius: "var(--ant-radius-md)",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveTrailDemo {...args} />,
  args: {
    separator: "/",
  },
};