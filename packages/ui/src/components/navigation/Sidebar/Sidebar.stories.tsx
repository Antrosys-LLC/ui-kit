import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";

const HomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      d="M3.5 10.5L12 3.5L20.5 10.5V20.5H14.5V14.5H9.5V20.5H3.5V10.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FolderIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      d="M3.5 6.5C3.5 5.67 4.17 5 5 5H9L11 7H19C19.83 7 20.5 7.67 20.5 8.5V18C20.5 18.83 19.83 19.5 19 19.5H5C4.17 19.5 3.5 18.83 3.5 18V6.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <rect
      x="3.5"
      y="5.5"
      width="17"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M4.5 7L12 13L19.5 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 0 0 12 8.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M19.4 13.5C19.47 13.01 19.47 12.5 19.4 12L21 10.75L19.25 7.75L17.3 8.55C16.92 8.25 16.5 8 16.05 7.8L15.75 5.75H12.25L11.95 7.8C11.5 8 11.08 8.25 10.7 8.55L8.75 7.75L7 10.75L8.6 12C8.53 12.5 8.53 13.01 8.6 13.5L7 15.25L8.75 18.25L10.7 17.45C11.08 17.75 11.5 18 11.95 18.2L12.25 20.25H15.75L16.05 18.2C16.5 18 16.92 17.75 17.3 17.45L19.25 18.25L21 15.25L19.4 13.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const meta = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

const navigationItems = [
  {
    label: "Dashboard",
    icon: <HomeIcon />,
    route: "/dashboard",
  },
  {
    label: "Projects",
    icon: <FolderIcon />,
    route: "/projects",
    badge: 3,
    children: [
      {
        label: "All Projects",
        route: "/projects/all",
      },
      {
        label: "Active Projects",
        route: "/projects/active",
      },
    ],
  },
  {
    label: "Messages",
    icon: <MailIcon />,
    route: "/messages",
    badge: 5,
  },
  {
    label: "Settings",
    icon: <SettingsIcon />,
    route: "/settings",
  },
];

const InteractiveSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/dashboard");

  return (
    <Sidebar
      items={navigationItems}
      collapsed={collapsed}
      activeRoute={activeRoute}
      userProfile={{
        name: "Fatima Razaq",
        role: "Frontend Developer",
      }}
      onCollapse={() => setCollapsed((prev) => !prev)}
      onNavigate={(route) => {
        setActiveRoute(route);
        console.log("Navigate:", route);
      }}
    />
  );
};

export const Default: Story = {
  render: () => <InteractiveSidebar />,
};

export const Collapsed: Story = {
  render: () => {
    const [activeRoute, setActiveRoute] = useState("/dashboard");

    return (
      <Sidebar
        items={navigationItems}
        collapsed={true}
        activeRoute={activeRoute}
        userProfile={{
          name: "Fatima Razaq",
          role: "Frontend Developer",
        }}
        onNavigate={(route) => {
          setActiveRoute(route);
          console.log("Navigate:", route);
        }}
      />
    );
  },
};

export const NestedNavigation: Story = {
  args: {
    items: navigationItems,
    collapsed: false,
    activeRoute: "/projects/active",
    userProfile: {
      name: "Fatima Razaq",
      role: "Frontend Developer",
    },
  },
};

export const WithoutProfile: Story = {
  args: {
    items: navigationItems,
    collapsed: false,
    activeRoute: "/messages",
  },
};