import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "./Navbar";
import type { NavbarLink } from "./Navbar";
import { ThemeProvider } from "../../../providers/ThemeProvider";

const navigationLinks: NavbarLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
    children: [
      {
        label: "Design system",
        href: "/products/design-system",
      },
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
    label: "Resources",
    href: "/resources",
    children: [
      {
        label: "Documentation",
        href: "/resources/documentation",
      },
      {
        label: "Guides",
        href: "/resources/guides",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
];

function BrandLogo() {
  return (
    <span className="flex items-center gap-[var(--ant-spacing-2)]">
      <span
        className={[
          "flex h-[var(--ant-spacing-8)] w-[var(--ant-spacing-8)] items-center justify-center rounded-[var(--ant-radius-md)]",
          "bg-[var(--ant-color-brand-primary)]",
          "font-bold text-[var(--ant-color-neutral-0)]",
        ].join(" ")}
      >
        A
      </span>

      <span
        className={[
          "text-[length:var(--ant-typography-fontsize-lg)] font-semibold",
          "text-[var(--ant-color-surface-text)]",
        ].join(" ")}
      >
        Antrosys
      </span>
    </span>
  );
}

const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    transparent: {
      control: "boolean",
    },
    darkMode: {
      control: "boolean",
    },
    activeHref: {
      control: "text",
    },
    ariaLabel: {
      control: "text",
    },
    onNavigate: {
      action: "navigated",
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo: <BrandLogo />,
    links: navigationLinks,
    activeHref: "/",
  },
};

export const WithDropdowns: Story = {
  args: {
    logo: <BrandLogo />,
    links: navigationLinks,
    activeHref: "/products/components",
  },
};

export const WithCallToAction: Story = {
  args: {
    logo: <BrandLogo />,
    links: navigationLinks,
    activeHref: "/about",
    ctaButton: {
      label: "Get started",
      href: "/get-started",
    },
  },
};

export const WithDarkMode: Story = {
  args: {
    logo: <BrandLogo />,
    links: navigationLinks,
    activeHref: "/",
    darkMode: true,
    ctaButton: {
      label: "Get started",
      href: "/get-started",
    },
  },
};

export const TransparentOnScroll: Story = {
  args: {
    logo: <BrandLogo />,
    links: navigationLinks,
    activeHref: "/",
    transparent: true,
    darkMode: true,
    ctaButton: {
      label: "Get started",
      href: "/get-started",
    },
  },
  render: (args) => (
    <div
      className={[
        "min-h-[150vh]",
        "bg-gradient-to-b",
        "from-[var(--ant-color-brand-primary)]/15",
        "to-[var(--ant-color-neutral-0)]",
      ].join(" ")}
    >
      <Navbar {...args} />

      <main className="mx-auto max-w-[var(--ant-spacing-7xl)] p-[var(--ant-spacing-6)]">
        <h1
          className={[
            "text-[length:var(--ant-typography-fontsize-2xl)] font-bold",
            "text-[var(--ant-color-surface-text)]",
          ].join(" ")}
        >
          Scroll this page
        </h1>

        <p
          className={[
            "mt-[var(--ant-spacing-3)]",
            "text-[var(--ant-color-surface-text-sub)]",
          ].join(" ")}
        >
          The transparent Navbar becomes solid after the page is scrolled.
        </p>
      </main>
    </div>
  ),
};

export const Mobile: Story = {
  args: {
    logo: <BrandLogo />,
    links: navigationLinks,
    activeHref: "/products/components",
    darkMode: true,
    ctaButton: {
      label: "Get started",
      href: "/get-started",
    },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const Minimal: Story = {
  args: {
    logo: <BrandLogo />,
    links: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "About",
        href: "/about",
      },
    ],
    activeHref: "/",
  },
};