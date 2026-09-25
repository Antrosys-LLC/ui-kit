import type { Table } from "@tanstack/react-table";
import type { TableExportOptions } from "./types";

/**
 * Escapes values for CSV format adhering to RFC 4180
 */
function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Triggers a browser file download from Blob
 */
function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Extracts visible headers and row values from a TanStack Table instance
 */
export function extractTableData<TData>(
  table: Table<TData>,
  options: TableExportOptions = {},
  selectedOnly = false
): { headers: string[]; columnKeys: string[]; rows: (string | number | boolean)[][] } {
  const visibleColumns = table
    .getVisibleLeafColumns()
    .filter((col) => col.id !== "_select" && col.id !== "_actions" && (options.includeHidden || col.getIsVisible()));

  const headers = visibleColumns.map((col) => {
    const headerDef = col.columnDef.header;
    const metaTitle = (col.columnDef.meta as any)?.title;
    if (metaTitle) return metaTitle;
    if (typeof headerDef === "string") return headerDef;
    return col.id;
  });

  const columnKeys = visibleColumns.map((col) => col.id);

  const rowModels = selectedOnly
    ? table.getSelectedRowModel().rows
    : table.getFilteredRowModel().rows;

  const rows = rowModels.map((row) => {
    return visibleColumns.map((col) => {
      const cellValue = row.getValue(col.id);
      const customFormatter = options.formatters?.[col.id];
      if (customFormatter) {
        return customFormatter(cellValue, row.original);
      }
      if (typeof cellValue === "object" && cellValue !== null) {
        if (cellValue instanceof Date) return cellValue.toISOString().split("T")[0];
        return JSON.stringify(cellValue);
      }
      return cellValue ?? "";
    }) as (string | number | boolean)[];
  });

  return { headers, columnKeys, rows };
}

/**
 * Exports table data to CSV format
 */
export function exportToCSV<TData>(
  table: Table<TData>,
  options: TableExportOptions = {},
  selectedOnly = false
) {
  const { headers, rows } = extractTableData(table, options, selectedOnly);
  const lines: string[] = [];

  if (options.includeHeaders !== false) {
    lines.push(headers.map(escapeCsvValue).join(","));
  }

  rows.forEach((row) => {
    lines.push(row.map(escapeCsvValue).join(","));
  });

  const csvContent = "\uFEFF" + lines.join("\r\n"); // UTF-8 BOM for Excel compatibility
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const fileName = `${options.fileName || "table-export"}_${new Date().toISOString().slice(0, 10)}.csv`;

  triggerDownload(blob, fileName);
}

/**
 * Exports table data to Excel-compatible XML format (.xls / .xlsx)
 */
export function exportToExcel<TData>(
  table: Table<TData>,
  options: TableExportOptions = {},
  selectedOnly = false
) {
  const { headers, rows } = extractTableData(table, options, selectedOnly);

  const headerCells = headers
    .map(
      (h) =>
        `<Cell ss:StyleID="header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`
    )
    .join("");

  const rowCells = rows
    .map((row) => {
      const cells = row
        .map((val) => {
          const type = typeof val === "number" ? "Number" : "String";
          return `<Cell><Data ss:Type="${type}">${escapeXml(String(val ?? ""))}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  const xmlContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="header">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#7C3AED" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Sheet1">
  <Table>
   <Row ss:Height="24">${headerCells}</Row>
   ${rowCells}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const fileName = `${options.fileName || "table-export"}_${new Date().toISOString().slice(0, 10)}.xls`;

  triggerDownload(blob, fileName);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
