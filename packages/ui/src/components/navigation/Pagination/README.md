# Pagination

Navigates multi-page content with first/previous/next/last controls, ellipsis for large page counts, an optional items-per-page selector, and a jump-to-page field. The component is fully controlled — it never fetches data.

## Usage

```tsx
import { Pagination } from "@antrosys/ui";

<Pagination
  total={240}
  perPage={10}
  currentPage={page}
  onPageChange={setPage}
  showSizeChanger
  onPerPageChange={setPerPage}
/>
```

## Props

| Prop               | Type                     | Default            | Description                                      |
|--------------------|--------------------------|--------------------|--------------------------------------------------|
| `total`            | `number`                 | —                  | Total number of items                            |
| `perPage`          | `number`                 | —                  | Items displayed per page                         |
| `currentPage`      | `number`                 | —                  | Currently active page                            |
| `onPageChange`     | `(page: number) => void` | —                  | Called with a valid page number                  |
| `showSizeChanger`  | `boolean`                | `false`            | Shows the items-per-page selector                |
| `onPerPageChange`  | `(perPage: number) => void` | —               | Called when the page size changes                |
| `pageSizeOptions`  | `number[]`               | `10` `20` `50` `100` | Options for the size selector                 |
