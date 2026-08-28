import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import type { Tab } from "./Tabs";

const sampleTabs: Tab[] = [
  {
    value: "overview",
    label: "Overview",
    content: (
      <div className="space-y-[var(--ant-spacing-3)] p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] [data-theme=dark]:bg-[var(--ant-color-neutral-800)] dark:bg-[var(--ant-color-neutral-800)]">
        <h3 className="text-[length:var(--ant-typography-fontSize-lg)] font-semibold text-[var(--ant-color-surface-text)] [data-theme=dark]:text-[var(--ant-color-neutral-0)] dark:text-[var(--ant-color-neutral-0)]">
          Antrosys Design System
        </h3>
        <p className="text-[length:var(--ant-typography-fontSize-base)] text-[var(--ant-color-surface-text-sub)] [data-theme=dark]:text-[var(--ant-color-neutral-300)] dark:text-[var(--ant-color-neutral-300)]">
          A scalable, token-driven component architecture built for modern enterprise web applications.
          Seamlessly integrates accessible primitives, smooth micro-interactions, and multi-theme adaptability.
        </p>
        <div className="flex gap-[var(--ant-spacing-2)] pt-[var(--ant-spacing-2)]">
          <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-sm)] text-[length:var(--ant-typography-fontSize-xs)] font-medium bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary-dk)] [data-theme=dark]:bg-[var(--ant-color-brand-primary-dk)] [data-theme=dark]:text-[var(--ant-color-brand-primary-lt)] dark:bg-[var(--ant-color-brand-primary-dk)] dark:text-[var(--ant-color-brand-primary-lt)]">
            v0.1.0
          </span>
          <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-sm)] text-[length:var(--ant-typography-fontSize-xs)] font-medium bg-[var(--ant-color-neutral-100)] text-[var(--ant-color-surface-text)] [data-theme=dark]:bg-[var(--ant-color-neutral-700)] [data-theme=dark]:text-[var(--ant-color-neutral-100)] dark:bg-[var(--ant-color-neutral-700)] dark:text-[var(--ant-color-neutral-100)]">
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
      <div className="space-y-[var(--ant-spacing-3)] p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] [data-theme=dark]:bg-[var(--ant-color-neutral-800)] dark:bg-[var(--ant-color-neutral-800)]">
        <h3 className="text-[length:var(--ant-typography-fontSize-lg)] font-semibold text-[var(--ant-color-surface-text)] [data-theme=dark]:text-[var(--ant-color-neutral-0)] dark:text-[var(--ant-color-neutral-0)]">
          Core Capabilities
        </h3>
        <ul className="space-y-[var(--ant-spacing-2)] text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text)] [data-theme=dark]:text-[var(--ant-color-neutral-200)] dark:text-[var(--ant-color-neutral-200)] list-disc list-inside">
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
      <div className="space-y-[var(--ant-spacing-3)] p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] [data-theme=dark]:bg-[var(--ant-color-neutral-800)] dark:bg-[var(--ant-color-neutral-800)]">
        <h3 className="text-[length:var(--ant-typography-fontSize-lg)] font-semibold text-[var(--ant-color-surface-text)] [data-theme=dark]:text-[var(--ant-color-neutral-0)] dark:text-[var(--ant-color-neutral-0)]">
          Subscription Tiers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--ant-spacing-3)]">
          <div className="p-[var(--ant-spacing-3)] rounded-[var(--ant-radius-md)] border border-[var(--ant-color-surface-border)]">
            <h4 className="font-semibold text-[var(--ant-color-brand-primary)] [data-theme=dark]:text-[var(--ant-color-brand-primary-lt)] dark:text-[var(--ant-color-brand-primary-lt)]">Community</h4>
            <p className="text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)] [data-theme=dark]:text-[var(--ant-color-neutral-300)] dark:text-[var(--ant-color-neutral-300)]">Free forever for open-source and individual projects.</p>
          </div>
          <div className="p-[var(--ant-spacing-3)] rounded-[var(--ant-radius-md)] border border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-brand-primary-lt)] [data-theme=dark]:bg-[var(--ant-color-neutral-700)] dark:bg-[var(--ant-color-neutral-700)]">
            <h4 className="font-semibold text-[var(--ant-color-brand-primary-dk)] [data-theme=dark]:text-[var(--ant-color-brand-primary-lt)] dark:text-[var(--ant-color-brand-primary-lt)]">Enterprise</h4>
            <p className="text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text)] [data-theme=dark]:text-[var(--ant-color-neutral-200)] dark:text-[var(--ant-color-neutral-200)]">Dedicated support, SLAs, and custom token pipelines.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    value: "reviews",
    label: "Reviews",
    content: (
      <div className="space-y-[var(--ant-spacing-3)] p-[var(--ant-spacing-4)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] [data-theme=dark]:bg-[var(--ant-color-neutral-800)] dark:bg-[var(--ant-color-neutral-800)]">
        <h3 className="text-[length:var(--ant-typography-fontSize-lg)] font-semibold text-[var(--ant-color-surface-text)] [data-theme=dark]:text-[var(--ant-color-neutral-0)] dark:text-[var(--ant-color-neutral-0)]">
          Developer Feedback
        </h3>
        <blockquote className="border-l-2 border-[var(--ant-color-brand-primary)] [data-theme=dark]:border-[var(--ant-color-brand-accent)] dark:border-[var(--ant-color-brand-accent)] pl-[var(--ant-spacing-3)] italic text-[length:var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)] [data-theme=dark]:text-[var(--ant-color-neutral-300)] dark:text-[var(--ant-color-neutral-300)]">
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
      <div className="max-w-[700px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * 4. ManyTabs: Demonstrates responsive horizontal scrolling overflow on compact screens.
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
      <div className="max-w-[480px] p-[var(--ant-spacing-4)] border border-dashed border-[var(--ant-color-surface-border)] rounded-[var(--ant-radius-lg)]">
        <div className="mb-[var(--ant-spacing-2)] text-[length:var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)]">
          Container constrained to 480px to demonstrate mobile scroll overflow:
        </div>
        <Story />
      </div>
    ),
  ],
};

/**
 * 5. Lazy: Demonstrates lazy-mounting of tab content. Panels are only mounted when first activated.
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
 * 6. Dark Theme: Verifies that design tokens adapt automatically in dark theme.
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
      <div
        data-theme="dark"
        className="p-[var(--ant-spacing-6)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-100)] dark"
      >
        <Story />
      </div>
    ),
  ],
};

/**
 * 7. Keyboard Accessibility: Demonstrates full WAI-ARIA keyboard navigation and disabled tab handling.
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
