# Button

The primary interactive element. Supports 4 variants, 3 sizes, loading state, and icon slots.

## Usage

```tsx
import { Button } from "@antrosys/ui";

<Button variant="primary" size="md" onClick={() => save()}>
  Save changes
</Button>
```

## Props

| Prop       | Type                                       | Default     | Description                        |
|------------|--------------------------------------------|-------------|------------------------------------|
| `variant`  | `primary` `secondary` `ghost` `danger`    | `primary`   | Visual style                       |
| `size`     | `sm` `md` `lg`                             | `md`        | Height / padding preset            |
| `loading`  | `boolean`                                  | `false`     | Shows spinner, disables clicks     |
| `iconLeft` | `ReactNode`                                | —           | Icon before label                  |
| `iconRight`| `ReactNode`                                | —           | Icon after label                   |
| `fullWidth`| `boolean`                                  | `false`     | 100% container width               |

All standard `<button>` HTML attributes are also accepted.
