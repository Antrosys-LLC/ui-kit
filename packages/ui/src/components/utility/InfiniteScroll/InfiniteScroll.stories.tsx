import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { InfiniteScrollList } from "./InfiniteScroll";

const mockInfiniteFetch = async (page: number, pageSize: number) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Simulate indefinite dataset by capping at page 10 (200 items)
  const maxPages = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = Array.from({ length: pageSize }, (_, i) => `Indefinite Stream Record #${start + i + 1}`);
  return {
    data,
    hasMore: page < maxPages,
  };
};

const meta = {
  title: "Utilities/InfiniteScrollList",
  component: InfiniteScrollList,
  tags: ["autodocs"],
  argTypes: {
    pageSize: { control: "number", description: "Items per page batch" },
    estimateSize: { control: "number", description: "Estimated row height in pixels" },
    scrollToTop: { control: "boolean", description: "Enable scroll-to-top floating button" },
    height: { control: "text", description: "Container viewport height" },
  },
  args: {
    fetchFn: mockInfiniteFetch,
    pageSize: 15,
    estimateSize: 42,
    overscan: 5,
    scrollToTop: true,
    height: "360px",
  },
} satisfies Meta<typeof InfiniteScrollList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    renderItem: (item: string) => (
      <div style={{ padding: "10px 16px", fontSize: "14px" }}>
        <strong>{item}</strong> — Streamed continuously via infinite scroll.
      </div>
    ),
  },
};

export const CustomLoadingWidget: Story = {
  args: {
    loadingWidget: (
      <div style={{ padding: "16px", textAlign: "center", fontStyle: "italic", color: "var(--ant-color-brand-primary)" }}>
        ⚡ Fetching next batch of indefinite items...
      </div>
    ),
    renderItem: (item: string) => (
      <div style={{ padding: "10px 16px", fontSize: "14px" }}>
        {item}
      </div>
    ),
  },
};

export const WithoutScrollToTop: Story = {
  args: {
    scrollToTop: false,
    renderItem: (item: string) => (
      <div style={{ padding: "10px 16px", fontSize: "14px" }}>
        {item}
      </div>
    ),
  },
};