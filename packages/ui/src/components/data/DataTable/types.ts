import type { ReactNode } from "react";
import type {
  ColumnDef,
  ColumnPinningState,
  Table,
} from "@tanstack/react-table";

export type TableDensity = "compact" | "comfortable" | "spacious";

export interface DataTableColumnMeta<TData, TValue = unknown> {
  /** Display title for column selector / export */
  title?: string;
  /** Whether column can be edited inline */
  isEditable?: boolean;
  /** Edit input type */
  editType?: "text" | "number" | "select" | "date" | "boolean";
  /** Select options if editType is 'select' */
  editOptions?: Array<{ label: string; value: any }>;
  /** Custom validation function */
  validate?: (value: TValue, row: TData) => string | boolean | undefined;
  /** Alignment of column text */
  align?: "left" | "center" | "right";
  /** Custom CSS class for cell */
  cellClassName?: string;
  /** Custom CSS class for header */
  headerClassName?: string;
  /** Prevent column from being hidden */
  hideable?: boolean;
}

export type DataTableColumnDef<TData, TValue = any> = ColumnDef<TData, TValue> & {
  meta?: DataTableColumnMeta<TData, TValue>;
};

export interface TableExportOptions {
  /** Base filename for export */
  fileName?: string;
  /** Custom column formatter during export */
  formatters?: Record<string, (value: any, row: any) => string>;
  /** Include hidden columns in export */
  includeHidden?: boolean;
  /** Include header row */
  includeHeaders?: boolean;
}

export interface DataTableProps<TData> {
  /** Array of column definitions */
  columns: DataTableColumnDef<TData, any>[];
  /** Array of data rows */
  data: TData[];
  /** Enable multi-row selection with checkboxes */
  selectable?: boolean;
  /** Enable CSV and Excel file export */
  exportable?: boolean;
  /** Enable high-performance virtualized scrolling */
  virtualScroll?: boolean;
  /** Fixed height in pixels for virtualized table (default: 480) */
  virtualScrollHeight?: number;
  /** Enable global text search filter */
  searchable?: boolean;
  /** Placeholder for global search input */
  searchPlaceholder?: string;
  /** Enable column-level filters */
  filterable?: boolean;
  /** Enable column pinning (left / right) */
  enablePinning?: boolean;
  /** Initial column pinning state */
  initialPinning?: ColumnPinningState;
  /** Enable column visibility toggle dropdown */
  enableColumnVisibility?: boolean;
  /** Enable responsive mobile card view */
  enableMobileCards?: boolean;
  /** Custom render function for card view item (mobile/card mode) */
  cardTemplate?: (row: TData, index: number, isSelected: boolean) => ReactNode;
  /** Density sizing preset */
  density?: TableDensity;
  /** Allow user to toggle table density */
  enableDensityToggle?: boolean;
  /** Enable pagination (defaults to true if virtualScroll is false) */
  pagination?: boolean;
  /** Default page size options */
  pageSizeOptions?: number[];
  /** Initial page size */
  initialPageSize?: number;
  /** Title header displayed above table */
  title?: ReactNode;
  /** Subtitle or description text */
  description?: ReactNode;
  /** Custom action buttons rendered in toolbar */
  actions?: ReactNode;
  /** Custom bulk action buttons when rows are selected */
  bulkActions?: (selectedRows: TData[], table: Table<TData>) => ReactNode;
  /** Callback when row selection changes */
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  /** Callback when inline row edit is saved */
  onRowEditSave?: (updatedRow: TData, rowIndex: number, columnId: string) => Promise<boolean | void> | boolean | void;
  /** Callback when a row is clicked */
  onRowClick?: (row: TData, index: number) => void;
  /** Unique row ID getter (default uses index or `id` property) */
  getRowId?: (row: TData, index: number) => string;
  /** Loading state indicator */
  loading?: boolean;
  /** Empty state message or custom component */
  emptyState?: ReactNode;
  /** Additional container CSS class */
  className?: string;
  /** Theme override ('light' | 'dark') */
  theme?: "light" | "dark";
}
