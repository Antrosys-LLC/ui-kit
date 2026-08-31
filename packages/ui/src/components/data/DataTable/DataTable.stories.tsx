import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./DataTable";
import type { DataTableColumnDef } from "./types";
import { Button } from "../../feedback/Button";

interface Product {
  id: string;
  name: string;
  category: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  price: number;
  sales: number;
  rating: number;
  lastUpdated: string;
}

const SAMPLE_PRODUCTS: Product[] = [
  { id: "PRD-001", name: "Quantum Pro Keyboard", category: "Peripherals", status: "In Stock", price: 149.99, sales: 1240, rating: 4.8, lastUpdated: "2026-08-15" },
  { id: "PRD-002", name: "UltraWide Curved 34\" Monitor", category: "Displays", status: "In Stock", price: 599.00, sales: 840, rating: 4.9, lastUpdated: "2026-08-20" },
  { id: "PRD-003", name: "Ergonomic Mesh Chair", category: "Furniture", status: "Low Stock", price: 329.50, sales: 512, rating: 4.6, lastUpdated: "2026-08-18" },
  { id: "PRD-004", name: "Studio Wireless Headphones", category: "Audio", status: "In Stock", price: 199.99, sales: 2150, rating: 4.7, lastUpdated: "2026-08-28" },
  { id: "PRD-005", name: "Thunderbolt 4 Docking Station", category: "Peripherals", status: "Out of Stock", price: 189.00, sales: 320, rating: 4.3, lastUpdated: "2026-08-12" },
  { id: "PRD-006", name: "Smart Standing Desk 60x30", category: "Furniture", status: "In Stock", price: 479.00, sales: 630, rating: 4.8, lastUpdated: "2026-08-22" },
  { id: "PRD-007", name: "4K AI Streaming Webcam", category: "Video", status: "In Stock", price: 129.99, sales: 1480, rating: 4.5, lastUpdated: "2026-08-29" },
  { id: "PRD-008", name: "Noise Cancelling Microphone", category: "Audio", status: "Low Stock", price: 89.95, sales: 940, rating: 4.4, lastUpdated: "2026-08-10" },
  { id: "PRD-009", name: "Magnetic Wireless Charger Stand", category: "Accessories", status: "In Stock", price: 49.99, sales: 3100, rating: 4.7, lastUpdated: "2026-08-30" },
  { id: "PRD-010", name: "Aluminum Laptop Riser Pro", category: "Accessories", status: "In Stock", price: 39.99, sales: 2750, rating: 4.6, lastUpdated: "2026-08-25" },
  { id: "PRD-011", name: "Mechanical Numpad RGB", category: "Peripherals", status: "Out of Stock", price: 54.00, sales: 210, rating: 4.1, lastUpdated: "2026-08-05" },
  { id: "PRD-012", name: "Desk Mat Extended Felt Gray", category: "Accessories", status: "In Stock", price: 29.00, sales: 4200, rating: 4.9, lastUpdated: "2026-08-31" },
];

const columns: DataTableColumnDef<Product, any>[] = [
  {
    accessorKey: "id",
    header: "SKU",
    size: 110,
    meta: {
      title: "SKU Code",
      align: "left",
      isEditable: false,
    },
    cell: ({ getValue }) => (
      <span className="font-mono text-xs font-semibold text-[var(--ant-color-brand-primary)]">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Product Name",
    size: 260,
    meta: {
      title: "Product Title",
      isEditable: true,
      editType: "text",
      validate: (val) => (!val || String(val).trim().length < 3 ? "Minimum 3 characters" : true),
    },
    cell: ({ getValue }) => (
      <span className="font-medium text-[var(--ant-color-surface-text)]">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 140,
    meta: {
      title: "Category",
      isEditable: true,
      editType: "select",
      editOptions: [
        { label: "Peripherals", value: "Peripherals" },
        { label: "Displays", value: "Displays" },
        { label: "Furniture", value: "Furniture" },
        { label: "Audio", value: "Audio" },
        { label: "Video", value: "Video" },
        { label: "Accessories", value: "Accessories" },
      ],
    },
    cell: ({ getValue }) => (
      <span className="inline-flex rounded-md bg-[var(--ant-color-neutral-100)] px-2 py-0.5 text-xs font-medium text-[var(--ant-color-surface-text-sub)]">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Inventory Status",
    size: 140,
    meta: {
      title: "Status",
      isEditable: true,
      editType: "select",
      editOptions: [
        { label: "In Stock", value: "In Stock" },
        { label: "Low Stock", value: "Low Stock" },
        { label: "Out of Stock", value: "Out of Stock" },
      ],
    },
    cell: ({ getValue }) => {
      const val = getValue() as Product["status"];
      const isOk = val === "In Stock";
      const isWarn = val === "Low Stock";
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isOk
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : isWarn
              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isOk ? "bg-emerald-500" : isWarn ? "bg-amber-500" : "bg-rose-500"
            }`}
          />
          {val}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price ($)",
    size: 110,
    meta: {
      title: "Unit Price",
      align: "right",
      isEditable: true,
      editType: "number",
      validate: (val) => (Number(val) <= 0 ? "Price must be > 0" : true),
    },
    cell: ({ getValue }) => (
      <span className="font-semibold text-[var(--ant-color-surface-text)]">
        ${(getValue() as number).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "sales",
    header: "Total Units Sold",
    size: 130,
    meta: {
      title: "Sales Count",
      align: "right",
    },
    cell: ({ getValue }) => (
      <span className="text-[var(--ant-color-surface-text)]">
        {(getValue() as number).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    size: 110,
    meta: {
      title: "Customer Rating",
      align: "center",
    },
    cell: ({ getValue }) => (
      <div className="flex items-center justify-center gap-1">
        <span className="text-amber-400">★</span>
        <span className="font-semibold text-xs text-[var(--ant-color-surface-text)]">
          {getValue() as number}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    size: 130,
    meta: {
      title: "Date Modified",
    },
    cell: ({ getValue }) => (
      <span className="text-xs text-[var(--ant-color-surface-text-sub)]">
        {getValue() as string}
      </span>
    ),
  },
];

const meta: Meta<typeof DataTable> = {
  title: "Data & Content Display/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Antrosys Feature-Rich Data Table built with TanStack Table. Supports column sorting, column pinning, multi-row selection, inline cell editing, CSV/Excel export, virtualized scrolling for massive datasets, and responsive mobile card view.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  render: () => (
    <div className="p-4 max-w-6xl mx-auto">
      <DataTable
        title="Product Catalog"
        description="Real-time inventory levels, pricing, and sales performance metrics."
        data={SAMPLE_PRODUCTS}
        columns={columns}
        selectable
        exportable
        initialPageSize={6}
      />
    </div>
  ),
};

export const SelectableWithBatchActions: Story = {
  render: () => {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <DataTable
          title="Order & Inventory Management"
          description="Select multiple items to perform batch actions."
          data={SAMPLE_PRODUCTS}
          columns={columns}
          selectable
          exportable
          bulkActions={(selected, _table) => (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => alert(`Marked ${selected.length} items as In Stock`)}
                className="h-7 text-xs"
              >
                Mark In-Stock
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => alert(`Archived ${selected.length} items`)}
                className="h-7 text-xs"
              >
                Archive Selected
              </Button>
            </div>
          )}
          initialPageSize={6}
        />
      </div>
    );
  },
};

export const InlineRowEditing: Story = {
  render: () => {
    const [data, setData] = useState(SAMPLE_PRODUCTS);

    const handleRowSave = (updatedRow: any) => {
      setData((prev) => prev.map((item) => (item.id === updatedRow.id ? updatedRow : item)));
    };

    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="mb-4 rounded-lg bg-[var(--ant-color-brand-primary-lt)] p-3 text-xs text-[var(--ant-color-brand-primary-dk)]">
          💡 <strong>Double-click</strong> any cell or click the ✏️ pencil icon to edit product name, category, status, and price inline! Press <strong>Enter</strong> to commit or <strong>Esc</strong> to cancel.
        </div>
        <DataTable
          title="Editable Product Catalog"
          description="Instant client-side cell and row editing with validation."
          data={data}
          columns={columns}
          selectable
          exportable
          onRowEditSave={handleRowSave}
          initialPageSize={6}
        />
      </div>
    );
  },
};

export const ColumnPinning: Story = {
  render: () => (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-3 text-xs text-[var(--ant-color-surface-text-sub)]">
        SKU code is pinned to the left. Scroll horizontally or click 📌 on column headers to pin/unpin other columns.
      </div>
      <DataTable
        title="Pinned Columns Grid"
        data={SAMPLE_PRODUCTS}
        columns={columns}
        selectable
        enablePinning
        initialPinning={{ left: ["id"] }}
        initialPageSize={6}
      />
    </div>
  ),
};

export const VirtualScrollingLargeDataset: Story = {
  render: () => {
    // Generate 1,000 rows for high performance virtual scroll testing
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: `PRD-${String(i + 1).padStart(4, "0")}`,
      name: `Enterprise Server Node #${i + 1}`,
      category: i % 3 === 0 ? "Hardware" : i % 2 === 0 ? "Displays" : "Peripherals",
      status: i % 5 === 0 ? "Out of Stock" : i % 3 === 0 ? "Low Stock" : "In Stock",
      price: 100 + (i * 17) % 800,
      sales: 50 + (i * 29) % 3000,
      rating: +(4.0 + ((i % 10) / 10)).toFixed(1),
      lastUpdated: "2026-08-30",
    }));

    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="mb-3 text-xs text-[var(--ant-color-surface-text-sub)]">
          Rendering <strong>1,000 items</strong> with TanStack Virtual for 60fps scrolling performance.
        </div>
        <DataTable
          title="1,000 Virtualized Records"
          description="High-frequency streaming dataset with virtual row scrolling."
          data={largeDataset as any}
          columns={columns}
          virtualScroll
          virtualScrollHeight={460}
          selectable
          exportable
        />
      </div>
    );
  },
};

export const ResponsiveMobileCardView: Story = {
  render: () => (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-3 text-xs text-[var(--ant-color-surface-text-sub)]">
        Toggle the view icon in the top-right toolbar to switch between standard table grid and responsive card view.
      </div>
      <DataTable
        title="Mobile Optimized Product Cards"
        description="Responsive card grid view for smaller viewports or dashboard cards."
        data={SAMPLE_PRODUCTS.slice(0, 6)}
        columns={columns}
        selectable
        enableMobileCards
        initialPageSize={6}
      />
    </div>
  ),
};
