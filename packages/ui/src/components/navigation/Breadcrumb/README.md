# Breadcrumb

Accessible breadcrumb trail with custom separators, ellipsis collapsing for deep paths, interactive click/navigation handlers, and schema.org JSON-LD SEO support.

## Usage

```tsx
import { Breadcrumb } from "@antrosys/ui";

<Breadcrumb
  crumbs={[
    { label: "Home", href: "/", onClick: (e) => handleNavigate("/") },
    { label: "Products", href: "/products", onClick: (e) => handleNavigate("/products") },
    { label: "Electronics" },
  ]}
  separator="/"
  maxVisible={4}
  jsonLd={true}
/>
```

## Props

### `BreadcrumbProps`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `crumbs` | `BreadcrumbItem[]` | *required* | Array of path items with labels, URLs, and optional click handlers |
| `separator` | `ReactNode` | `'/'` | Custom separator node between items |
| `maxVisible` | `number` | `undefined` | Maximum visible items before collapsing with ellipsis |
| `jsonLd` | `boolean` | `false` | Injects Schema.org JSON-LD SEO structured data |
| `onItemClick` | `(crumb, index, e) => void` | `undefined` | Callback triggered whenever any crumb link is clicked |

### `BreadcrumbItem`

| Property | Type | Description |
| --- | --- | --- |
| `label` | `string` | Text label displayed for the breadcrumb item |
| `href` | `string` (optional) | URL destination for the link |
| `onClick` | `(e: MouseEvent) => void` (optional) | Custom click handler for client-side navigation |

All standard `<nav>` HTML attributes are also accepted.
