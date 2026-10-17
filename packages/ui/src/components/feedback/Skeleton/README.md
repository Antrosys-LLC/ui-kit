# Skeleton Loader

A shimmer-animation placeholder component that mirrors real content layout while data is loading. Includes ready-to-use presets for cards, tables, avatars, text blocks, and charts, as well as atomic sub-components for custom layouts.

## Features

- ✨ **Shimmer Wave Animation**: Fluid, GPU-friendly gradient sweep that automatically respects `prefers-reduced-motion`.
- 📐 **Pre-built Presets**:
  - `card`: Header with avatar, image hero, multiline content, and action button.
  - `table`: Full table with header row and variable data cells.
  - `table-row`: Single table row for incremental streaming.
  - `avatar`: Circular or rounded user avatar.
  - `text`: Multiline text block with randomized line widths.
  - `chart`: Bar chart skeleton with animated bars and axis markings.
  - `custom`: Atomic flexible shape.
- 🧱 **Composable API**: Use `Skeleton.Card`, `Skeleton.Avatar`, `Skeleton.Text`, etc. directly.
- 🎨 **Design Tokens**: Matches Antrosys neutral surface colors and dark mode tokens.

## Usage

### Using Pre-built Variants

```tsx
import { Skeleton } from "@antrosys/ui";

// Text block with 4 rows
<Skeleton variant="text" rows={4} />

// User avatar
<Skeleton variant="avatar" width={48} height={48} circle />

// Complete card skeleton
<Skeleton variant="card" />

// Data table with 5 rows
<Skeleton variant="table" rows={5} />

// Dashboard chart
<Skeleton variant="chart" />
```

### Composing Custom Layouts

```tsx
<div className="flex items-center gap-4">
  <Skeleton.Avatar width={40} height={40} circle />
  <div className="flex flex-col gap-2 flex-1">
    <Skeleton.Custom width="60%" height={14} radius="sm" />
    <Skeleton.Custom width="30%" height={10} radius="sm" />
  </div>
</div>
```

## Props Table

| Prop           | Type                                                                            | Default     | Description                                           |
| -------------- | ------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------- |
| `variant`      | `"custom" \| "text" \| "avatar" \| "card" \| "table" \| "table-row" \| "chart"` | `"custom"`  | Preset layout structure                               |
| `rows`         | `number`                                                                        | `3`         | Number of lines/rows for `text`, `table`, `table-row` |
| `animated`     | `boolean`                                                                       | `true`      | Enables shimmering wave animation                     |
| `width`        | `string \| number`                                                              | `undefined` | Width of custom skeleton block                        |
| `height`       | `string \| number`                                                              | `undefined` | Height of custom skeleton block                       |
| `circle`       | `boolean`                                                                       | `false`     | Renders a 100% circular border radius                 |
| `radius`       | `"none" \| "sm" \| "md" \| "lg" \| "xl" \| "full" \| string`                    | `"md"`      | Corner radius preset or custom CSS                    |
| `shimmerColor` | `string`                                                                        | `undefined` | Custom gradient highlight color                       |
| `className`    | `string`                                                                        | `undefined` | Additional class names                                |
| `style`        | `React.CSSProperties`                                                           | `undefined` | Inline style overrides                                |
