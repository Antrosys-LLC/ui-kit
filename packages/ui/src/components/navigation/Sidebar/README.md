# Sidebar Navigation

Collapsible sidebar navigation with nested routes, badges, configurable branding, and a user profile block.

## Usage

```tsx
import { Sidebar } from "@antrosys/ui";

function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/dashboard");

  return (
    <Sidebar
      collapsed={collapsed}
      activeRoute={activeRoute}
      onCollapse={() => setCollapsed(!collapsed)}
      onNavigate={(route) => setActiveRoute(route)}
      userProfile={{ name: "John Doe", role: "Admin", status: "online" }}
      items={[
        { label: "Dashboard", route: "/dashboard" },
        {
          label: "Projects",
          route: "/projects",
          children: [
            { label: "Active", route: "/projects/active" },
            { label: "Archived", route: "/projects/archived" }
          ]
        },
        { label: "Settings", route: "/settings" }
      ]}
    />
  );
}
```

## Props

### `SidebarProps`

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `items` | `SidebarItem[]` | required | Navigation tree — supports one level of nested children |
| `collapsed` | `boolean` | `false` | Renders the collapsed (icon-rail) layout |
| `activeRoute` | `string` | `undefined` | Route of the currently active item for highlighting |
| `userProfile` | `SidebarUserProfile` | `undefined` | Details for the user profile block at the bottom |
| `title` | `string` | `"AntroSys"` | Brand title text displayed in the header |
| `subtitle` | `string` | `"Workspace"` | Brand subtitle text displayed in the header |
| `logo` | `ReactNode` | `undefined` | Custom brand logo or icon element |
| `onNavigate` | `(route: string) => void` | `undefined` | Callback fired when a navigation item is clicked |
| `onCollapse` | `() => void` | `undefined` | Callback fired when the collapse toggle button is clicked |
| `className` | `string` | `undefined` | Additional CSS class names |

### `SidebarItem`

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `label` | `string` | required | Display label for the navigation item |
| `route` | `string` | required | Unique route string used for navigation and active state matching |
| `icon` | `ReactNode` | `undefined` | Optional icon rendered next to the label |
| `badge` | `number \| string` | `undefined` | Optional badge content rendered in a pill |
| `children` | `SidebarItem[]` | `undefined` | Optional nested children items for sub-navigation |

### `SidebarUserProfile`

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `name` | `string` | required | Display name of the user |
| `role` | `string` | `undefined` | Optional role or title displayed under the name |
| `avatar` | `string` | `undefined` | Optional URL for the user's avatar image |
| `status` | `"online" \| "offline" \| boolean` | `undefined` | Presence indicator status (omitted hides indicator) |

## Accessibility

- **Semantic landmarks**: Uses `<aside>` for the sidebar container and `<nav aria-label="Sidebar navigation">` for the navigation region.
- **Accordion controls**: Parent items with nested children include `aria-expanded` and `aria-controls` pointing to the submenu list ID.
- **Current page indicator**: The currently active route is marked with `aria-current="page"`.
- **Status announcement**: The user profile presence indicator uses `role="status"` and accessible labels (`Online` / `Offline`).
- **Keyboard interaction**: Full keyboard navigation support with visible focus rings (`focus-visible:ring-2`).

