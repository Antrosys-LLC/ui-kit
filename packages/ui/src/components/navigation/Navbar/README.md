# Navbar

A responsive sticky navigation component with desktop links, dropdown menus, a mobile drawer, active-link highlighting, an optional call-to-action, transparent-to-solid scrolling, and theme controls.

The Navbar must be rendered within `ThemeProvider`.

## Usage

```tsx
import { Navbar, ThemeProvider } from "@antrosys/ui";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
    children: [
      {
        label: "Components",
        href: "/products/components",
      },
      {
        label: "Templates",
        href: "/products/templates",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
];

export function Header() {
  return (
    <ThemeProvider>
      <Navbar
        logo={<strong>Antrosys</strong>}
        links={links}
        activeHref="/"
        darkMode
        transparent
        ctaButton={{
          label: "Get started",
          href: "/get-started",
        }}
      />
    </ThemeProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `logo` | `React.ReactNode` | Required | Brand logo or custom logo element |
| `logoHref` | `string` | `"/"` | Destination used when the logo is selected |
| `logoLabel` | `string` | `"Home"` | Accessible name for the logo link |
| `links` | `NavbarLink[]` | Required | Navigation links and optional dropdown groups |
| `ctaButton` | `NavbarCtaButton` | - | Optional call-to-action button |
| `transparent` | `boolean` | `false` | Start transparent and become solid after scrolling |
| `darkMode` | `boolean` | `false` | Display the light/dark theme toggle |
| `activeHref` | `string` | - | Explicit active URL (defaults to window.location.pathname) |
| `ariaLabel` | `string` | `"Primary navigation"` | Accessible label for the navigation region |
| `className` | `string` | - | Additional class names |
| `onNavigate` | `(href: string) => void` | - | Called when a navigation destination is selected |

## NavbarLink

| Property | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | Yes | Visible link label |
| `href` | `string` | Yes | Link destination URL |
| `children` | `NavbarLink[]` | No | Optional nested links displayed in a dropdown |

## NavbarCtaButton

| Property | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | Yes | Call-to-action button label |
| `href` | `string` | Yes | Call-to-action destination URL |

## Responsive behavior

On smaller screens (below desktop breakpoint), navigation collapses into an accessible mobile slide-out drawer triggered by a hamburger button.

## Accessibility

- Semantic `<header>` and `<nav>` elements with configurable ARIA labels.
- Full keyboard navigation support (Escape closes dropdowns and mobile drawer, Tab navigation with focus rings).
- ARIA expanded, popup, and current page state attributes (`aria-expanded`, `aria-haspopup`, `aria-current`).
- Body scroll locking when mobile navigation drawer is active.