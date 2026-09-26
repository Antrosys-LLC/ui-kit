## VirtualList

Renders only visible rows from a large dataset via windowing with infinite scroll pagination.

### Usage

```tsx
import { VirtualList } from "@antrosys/ui";

<VirtualList (page, fetchFn="{async"> ({ data: [...], hasMore: true })}
  renderItem={(item) => <div>{item.name}</div>}
/>
export interface InfiniteScrollListProps<T = any> extends React.ComponentPropsWithoutRef<"div"> {
  /** Function to fetch pages indefinitely */
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; hasMore: boolean }>;
  /** Number of items per fetched page (default: 20) */
  pageSize?: number;
  /** Estimated height of each row in pixels (default: 40) */
  estimateSize?: number;
  /** Number of items outside visible viewport (default: 5) */
  overscan?: number;
  /** Whether to show the scroll-to-top button (default: true) */
  scrollToTop?: boolean;
  /** Height of the viewport container (default: '400px') */
  height?: string | number;
  /** Custom renderer for each item row */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Custom loading spinner widget component */
  loadingWidget?: React.ReactNode;
}
| Prop | Type | Default |
| :--- | :--- | :--- |
| `fetchFn` | `(page: number, pageSize: number) => Promise<{ data: T[]; hasMore: boolean }>` | — |
| `pageSize` | `number` | `20` |
| `estimateSize` | `number` | `40` |
| `overscan` | `number` | `5` |
| `scrollToTop` | `boolean` | `true` |
| `height` | `string \| number` | `'400px'` |
| `renderItem` | `(item: T, index: number) => React.ReactNode` | — |
| `loadingWidget` | `React.ReactNode` | — |
| `className` | `string` | — |