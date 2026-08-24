import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";
import type { PaginationProps } from "./Pagination";

const meta = {
  title:     "Navigation/Pagination",
  component: Pagination,
  tags:      ["autodocs"],
  argTypes: {
    total:           { control: "number" },
    perPage:         { control: "number" },
    currentPage:     { control: "number" },
    showSizeChanger: { control: "boolean" },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractivePagination(props: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(props.currentPage);
  const [perPage, setPerPage] = useState(props.perPage);

  return (
    <Pagination
      {...props}
      perPage={perPage}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onPerPageChange={setPerPage}
    />
  );
}

export const Default: Story = {
  args: {
    total: 80,
    perPage: 10,
    currentPage: 1,
    onPageChange: () => undefined,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const ManyPages: Story = {
  args: {
    total: 240,
    perPage: 10,
    currentPage: 6,
    onPageChange: () => undefined,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const FirstPage: Story = {
  args: {
    total: 120,
    perPage: 10,
    currentPage: 1,
    onPageChange: () => undefined,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const LastPage: Story = {
  args: {
    total: 120,
    perPage: 10,
    currentPage: 12,
    onPageChange: () => undefined,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const WithSizeChanger: Story = {
  args: {
    total: 240,
    perPage: 10,
    currentPage: 1,
    showSizeChanger: true,
    onPageChange: () => undefined,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const JumpToPage: Story = {
  args: {
    total: 200,
    perPage: 10,
    currentPage: 4,
    onPageChange: () => undefined,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const ServerSide: Story = {
  args: {
    total: 95,
    perPage: 10,
    currentPage: 1,
    showSizeChanger: true,
    onPageChange: () => undefined,
  },
  render: function ServerSideStory(args) {
    const [currentPage, setCurrentPage] = useState(args.currentPage);
    const [perPage, setPerPage] = useState(args.perPage);
    const [status, setStatus] = useState(`Showing page ${args.currentPage} of mock API results`);

    const requestPage = (page: number) => {
      setStatus(`Requesting page ${page} from API…`);
      window.setTimeout(() => {
        setCurrentPage(page);
        setStatus(`Loaded page ${page} from API`);
      }, 400);
    };

    return (
      <div className="flex flex-col gap-[var(--ant-spacing-3)]">
        <p className="m-0 text-[length:var(--ant-typography-fontsize-sm)] text-[var(--ant-color-surface-text-sub)]">
          {status}
        </p>
        <Pagination
          total={args.total}
          perPage={perPage}
          currentPage={currentPage}
          showSizeChanger={args.showSizeChanger}
          onPageChange={requestPage}
          onPerPageChange={setPerPage}
        />
      </div>
    );
  },
};
