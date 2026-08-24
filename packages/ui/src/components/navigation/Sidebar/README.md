# Sidebar Navigation

Collapsible sidebar navigation with nested routes, badges, and a user profile block.

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
      userProfile={{ name: "John Doe", role: "Admin" }}
      items={[
        { label: "Dashboard", route: "/dashboard" },
        { label: "Settings", route: "/settings" }
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `items` | `SidebarItem[]` | required | Navigation tree — supports one level of nested children |
| `collapsed` | `boolean` | `false` | Renders the collapsed (icon-rail) layout |
| `activeRoute` | `string` | `undefined` | Route of the currently active item |
| `userProfile` | `SidebarUserProfile` | `undefined` | Details for the user profile block |
| `onNavigate` | `(route: string) => void` | `undefined` | Callback fired when an item is clicked |
| `onCollapse` | `() => void` | `undefined` | Callback fired when the collapse button is clicked |
