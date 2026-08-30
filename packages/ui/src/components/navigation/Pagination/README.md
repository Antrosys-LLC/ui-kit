# Pagination

Navigates multi-page content with first/previous/next/last controls, ellipsis for large page counts, an optional items-per-page selector, and a jump-to-page field. The component is fully controlled — it never fetches data.

## Usage

```tsx
import { useState } from "react";
import { Pagination } from "@antrosys/ui";

export function Example() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  return (
    <Pagination
      total={240}
      perPage={perPage}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      showSizeChanger
      onPerPageChange={setPerPage}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `total` | `number` | — | Total number of items |
| `perPage` | `number` | — | Number of items displayed per page |
| `currentPage` | `number` | — | Currently active page |
| `onPageChange` | `(page: number) => void` | — | Called when the selected page changes |
| `showSizeChanger` | `boolean` | `false` | Whether to display the items-per-page selector |
| `onPerPageChange` | `(perPage: number) => void` | — | Called when the items-per-page value changes |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Options for the items-per-page selector |
| `className` | `string` | — | Optional additional CSS classes |

