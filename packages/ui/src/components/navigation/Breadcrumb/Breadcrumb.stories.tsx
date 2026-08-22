import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";

const meta = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  argTypes: {
    separator: { control: "text" },
    maxVisible: { control: "number" },
    jsonLd: { control: "boolean" },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

interface DemoProps {
  initialTrail?: string[];
  separator?: React.ReactNode;
  maxVisible?: number;
  jsonLd?: boolean;
}

const pageDefinitions: Record<string, { label: string; description: string }> = {
  Home: {
    label: "Home",
    description: "Welcome to the Home dashboard. Click on breadcrumb links (like 'Home' or 'Products') to navigate between screens.",
  },
  Products: {
    label: "Products",
    description: "Explore all product catalogs, categories, and department inventory listings.",
  },
  Electronics: {
    label: "Electronics",
    description: "Electronics department featuring laptops, mobile devices, audio gear, and accessories.",
  },
  Laptops: {
    label: "Laptops",
    description: "High-performance laptops, ultrabooks, notebooks, and workstation PCs.",
  },
  'Pro Model 16"': {
    label: 'Pro Model 16"',
    description: "Flagship 16-inch high-performance model with ultra-retina display.",
  },
};

const fullPathSequence = ["Home", "Products", "Electronics", "Laptops", 'Pro Model 16"'];

function InteractiveBreadcrumbDemo({
  initialTrail = ["Home", "Products", "Electronics"],
  separator = "/",
  maxVisible,
  jsonLd = false,
}: DemoProps) {
  const [trail, setTrail] = useState<string[]>(initialTrail);

  const currentKey = trail[trail.length - 1] || "Home";
  const currentInfo = pageDefinitions[currentKey] || {
    label: currentKey,
    description: `Current screen: ${currentKey}`,
  };

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

  const nextIndex = fullPathSequence.indexOf(currentKey) + 1;
  const nextItem =
    nextIndex > 0 && nextIndex < fullPathSequence.length
      ? fullPathSequence[nextIndex]
      : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      <Breadcrumb
        crumbs={crumbs}
        separator={separator}
        maxVisible={maxVisible}
        jsonLd={jsonLd}
      />

      {/* Screen container */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid var(--ant-color-neutral-200)",
          borderRadius: "var(--ant-radius-lg)",
          padding: "36px",
          minHeight: "220px",
          boxShadow: "var(--ant-shadow-sm)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "inline-block", marginBottom: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--ant-color-brand-primary)",
              backgroundColor: "var(--ant-color-brand-primary-lt)",
              padding: "3px 8px",
              borderRadius: "var(--ant-radius-sm)",
            }}
          >
            Active View
          </span>
        </div>

        <h2
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: "var(--ant-color-neutral-900)",
            margin: "6px 0 10px 0",
          }}
        >
          {currentInfo.label} Screen
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "var(--ant-color-neutral-500)",
            margin: "0 0 20px 0",
            maxWidth: "520px",
            lineHeight: "1.5",
          }}
        >
          {currentInfo.description}
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {nextItem && (
            <button
              type="button"
              onClick={() => setTrail([...trail, nextItem])}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#FFFFFF",
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
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--ant-color-neutral-700)",
                backgroundColor: "var(--ant-color-neutral-100)",
                border: "1px solid var(--ant-color-neutral-200)",
                borderRadius: "var(--ant-radius-md)",
                cursor: "pointer",
              }}
            >
              ← Back to {trail[trail.length - 2]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <InteractiveBreadcrumbDemo
      initialTrail={["Home", "Products", "Electronics"]}
      separator={args.separator}
      maxVisible={args.maxVisible}
      jsonLd={args.jsonLd}
    />
  ),
  args: {
    separator: "/",
  },
};

export const CustomSeparator: Story = {
  render: (args) => (
    <InteractiveBreadcrumbDemo
      initialTrail={["Home", "Products", "Electronics"]}
      separator={args.separator || ">"}
      maxVisible={args.maxVisible}
      jsonLd={args.jsonLd}
    />
  ),
  args: {
    separator: ">",
  },
};

export const CollapsedWithEllipsis: Story = {
  render: (args) => (
    <InteractiveBreadcrumbDemo
      initialTrail={["Home", "Products", "Electronics", "Laptops", 'Pro Model 16"']}
      separator={args.separator}
      maxVisible={args.maxVisible || 3}
      jsonLd={args.jsonLd}
    />
  ),
  args: {
    maxVisible: 3,
  },
};

export const WithJsonLd: Story = {
  render: (args) => (
    <InteractiveBreadcrumbDemo
      initialTrail={["Home", "Products", "Electronics"]}
      separator={args.separator}
      maxVisible={args.maxVisible}
      jsonLd={true}
    />
  ),
  args: {
    jsonLd: true,
  },
};
