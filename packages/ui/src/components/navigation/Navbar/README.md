
### `Navbar/README.md`

```md
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