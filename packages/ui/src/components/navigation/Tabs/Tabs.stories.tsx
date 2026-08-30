import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import type { Tab } from "./Tabs";
import { ThemeContext } from "../../../providers/ThemeProvider";

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 8h.01M12 12v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LayersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CreditCardIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const MessageSquareIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <path
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const sampleTabs: Tab[] = [
  {
    value: "overview",
    label: "Overview",
    content: (
      <div className="space-y-[var(--ant-spacing-3)] p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)]">
        <h3 className="text-[length:var(--ant-typography-fontSize-lg)] font-semibold text-[var(--ant-color-surface-text)]">
          Antrosys Design System
        </h3>
        <p className="text-[length:var(--ant-typography-fontSize-base)] text-[var(--ant-color-surface-text-sub)]">
          A scalable, token-driven component architecture built for modern enterprise web applications.
          Seamlessly integrates accessible primitives, smooth micro-interactions, and multi-theme adaptability.
        </p>
        <div className="flex gap-[var(--ant-spacing-2)] pt-[var(--ant-spacing-2)]">
          <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-sm)] text-[length:var(--ant-typography-fontSize-xs)] font-medium bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary-dk)]">
            v0.1.0
          </span>
          <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-sm)] text-[length:var(--ant-typography-fontSize-xs)] font-medium bg-[var(--ant-color-neutral-100)] text-[var(--ant-color-surface-text)]">
            WAI-ARIA Compliant
          </span>
        </div>
      </div>
    ),
  },
  {
    value: "features",
    label: "Features",
    content: (
      <div className="space-y-[var(--ant-spacing-3)] p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)]">
        <h3 className="text-[length:var(--ant-typography-fontSize-lg)] font-semibold text-[var(--ant-color-surface-text)]">
          Core Capabilities
        </h3>
        <ul className="space-y-[var(--ant-spacing-2)] text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text)] list-disc list-inside">
          <li>Accessible Radix UI keyboard navigation (Arrow keys, Home, End)</li>
          <li>Hardware-accelerated CSS animated active-tab indicator</li>
          <li>Responsive horizontal overflow with scroll-into-view behavior</li>
          <li>Opt-in lazy mounting to optimize panel render performance</li>
        </ul>
      </div>
    ),
  },
  {
    value: "pricing",
    label: "Pricing",
    content: (
      <div className="space-y-[var(--ant-spacing-3)] p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)]">
        <h3 className="text-[length:var(--ant-typography-fontSize-lg)] font-semibold text-[var(--ant-color-surface-text)]">
          Subscription Tiers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--ant-spacing-3)]">
          <div className="p-[var(--ant-spacing-3)] rounded-[var(--ant-radius-md)] border border-[var(--ant-color-surface-border)]">
            <h4 className="font-semibold text-[var(--ant-color-brand-primary)]">Community</h4>
            <p className="text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)]">Free forever for open-source and individual projects.</p>
          </div>
          <div className="p-[var(--ant-spacing-3)] rounded-[var(--ant-radius-md)] border border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-brand-primary-lt)]">
            <h4 className="font-semibold text-[var(--ant-color-brand-primary-dk)]">Enterprise</h4>
            <p className="text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text)]">Dedicated support, SLAs, and custom token pipelines.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    value: "reviews",
    label: "Reviews",
    content: (
      <div className="space-y-[var(--ant-spacing-3)] p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)]">
        <h3 className="text-[length:var(--ant-typography-fontSize-lg)] font-semibold text-[var(--ant-color-surface-text)]">
          Developer Feedback
        </h3>
        <blockquote className="border-l-2 border-[var(--ant-color-brand-primary)] pl-[var(--ant-spacing-3)] italic text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)]">
          &ldquo;The Tabs component makes keyboard interaction effortless while keeping animations buttery smooth across viewport sizes.&rdquo;
        </blockquote>
      </div>
    ),
  },
];

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Tab layout orientation",
    },
    lazy: {
      control: "boolean",
      description: "Whether tab panels should be mounted lazily upon activation",
    },
    defaultTab: {
      control: "text",
      description: "Initial active tab value",
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 1. Default horizontal tabs with several tabs and realistic content.
 */
export const Default: Story = {
  args: {
    tabs: sampleTabs,
    defaultTab: "overview",
    orientation: "horizontal",
    lazy: false,
  },
};

/**
 * 2. Explicit Horizontal Orientation demonstration.
 */
export const Horizontal: Story = {
  args: {
    tabs: sampleTabs,
    defaultTab: "features",
    orientation: "horizontal",
  },
};

/**
 * 3. Vertical Orientation with sidebar list and content display.
 */
export const Vertical: Story = {
  args: {
    tabs: sampleTabs,
    defaultTab: "overview",
    orientation: "vertical",
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

/**
 * 4. WithIcons: Demonstrates tabs containing icons alongside text labels.
 */
const iconTabs: Tab[] = [
  {
    value: "overview",
    label: "Overview",
    icon: <InfoIcon />,
    content: sampleTabs[0].content,
  },
  {
    value: "features",
    label: "Features",
    icon: <LayersIcon />,
    content: sampleTabs[1].content,
  },
  {
    value: "pricing",
    label: "Pricing",
    icon: <CreditCardIcon />,
    content: sampleTabs[2].content,
  },
  {
    value: "reviews",
    label: "Reviews",
    icon: <MessageSquareIcon />,
    content: sampleTabs[3].content,
  },
];

export const WithIcons: Story = {
  args: {
    tabs: iconTabs,
    defaultTab: "overview",
    orientation: "horizontal",
  },
};

/**
 * 5. ManyTabs: Demonstrates responsive horizontal scrolling overflow on compact screens.
 */
const overflowTabs: Tab[] = [
  { value: "overview", label: "Overview", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">Overview panel content</div> },
  { value: "features", label: "Features", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">Features panel content</div> },
  { value: "architecture", label: "Architecture", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">Architecture panel content</div> },
  { value: "analytics", label: "Analytics", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">Analytics panel content</div> },
  { value: "team", label: "Team Members", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">Team panel content</div> },
  { value: "integrations", label: "Integrations", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">Integrations panel content</div> },
  { value: "apikeys", label: "API Keys", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">API Keys panel content</div> },
  { value: "webhooks", label: "Webhooks", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">Webhooks panel content</div> },
  { value: "billing", label: "Billing & Plans", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">Billing panel content</div> },
  { value: "audit", label: "Audit Logs", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">Audit Logs panel content</div> },
  { value: "settings", label: "Preferences", content: <div className="p-4 border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">Settings panel content</div> },
];

export const ManyTabs: Story = {
  args: {
    tabs: overflowTabs,
    defaultTab: "overview",
    orientation: "horizontal",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg p-[var(--ant-spacing-4)] border border-dashed border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-lg)]">
        <div className="mb-[var(--ant-spacing-2)] text-[length:var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)]">
          Container constrained to demonstrate mobile scroll overflow:
        </div>
        <Story />
      </div>
    ),
  ],
};

/**
 * 6. Lazy: Demonstrates lazy-mounting of tab content. Panels are only mounted when first activated.
 */
function LazyDemoPanel({ name }: { name: string }) {
  const [mountedAt] = useState(() => new Date().toLocaleTimeString());

  return (
    <div className="p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-md)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] space-y-[var(--ant-spacing-2)]">
      <div className="flex items-center gap-[var(--ant-spacing-2)]">
        <span className="h-2 w-2 rounded-full bg-[var(--ant-color-semantic-success)]" />
        <h4 className="font-semibold text-[var(--ant-color-surface-text)]">{name} Panel</h4>
      </div>
      <p className="text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)]">
        This panel was first mounted into the DOM at: <strong className="text-[var(--ant-color-brand-primary)]">{mountedAt}</strong>
      </p>
    </div>
  );
}

const lazyTabs: Tab[] = [
  { value: "tab1", label: "Initial Tab", content: <LazyDemoPanel name="Initial Tab" /> },
  { value: "tab2", label: "Lazy Tab A", content: <LazyDemoPanel name="Lazy Tab A" /> },
  { value: "tab3", label: "Lazy Tab B", content: <LazyDemoPanel name="Lazy Tab B" /> },
];

export const Lazy: Story = {
  args: {
    tabs: lazyTabs,
    defaultTab: "tab1",
    lazy: true,
  },
};

/**
 * 7. Dark Theme: Verifies that design tokens adapt automatically in dark theme.
 */
export const DarkTheme: Story = {
  args: {
    tabs: sampleTabs,
    defaultTab: "overview",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <ThemeContext.Provider
        value={{ theme: "dark", toggleTheme: () => {}, setTheme: () => {} }}
      >
        <div
          data-theme="dark"
          className="p-[var(--ant-spacing-6)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-100)]"
        >
          <Story />
        </div>
      </ThemeContext.Provider>
    ),
  ],
};

/**
 * 8. Keyboard Accessibility: Demonstrates full WAI-ARIA keyboard navigation and disabled tab handling.
 */
const a11yTabs: Tab[] = [
  {
    value: "account",
    label: "Account",
    content: (
      <div className="p-[var(--ant-spacing-4)] border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">
        <h4 className="font-semibold text-[var(--ant-color-surface-text)] mb-2">Account Profile</h4>
        <p className="text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)]">
          Manage your personal details, email preferences, and security credentials. Use Left/Right Arrow keys to switch tabs.
        </p>
      </div>
    ),
  },
  {
    value: "security",
    label: "Security",
    content: (
      <div className="p-[var(--ant-spacing-4)] border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">
        <h4 className="font-semibold text-[var(--ant-color-surface-text)] mb-2">Security & Passkeys</h4>
        <p className="text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)]">
          Two-factor authentication and active session management.
        </p>
      </div>
    ),
  },
  {
    value: "archived",
    label: "Archived (Disabled)",
    disabled: true,
    content: (
      <div className="p-[var(--ant-spacing-4)]">
        Disabled content is unreachable.
      </div>
    ),
  },
  {
    value: "notifications",
    label: "Notifications",
    content: (
      <div className="p-[var(--ant-spacing-4)] border border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg-card)]">
        <h4 className="font-semibold text-[var(--ant-color-surface-text)] mb-2">Notification Preferences</h4>
        <p className="text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)]">
          Configure real-time alerts and email digests.
        </p>
      </div>
    ),
  },
];

export const KeyboardAccessibility: Story = {
  args: {
    tabs: a11yTabs,
    defaultTab: "account",
  },
};
