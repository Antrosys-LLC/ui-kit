import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";
import { ThemeContext } from "../../../providers/ThemeProvider";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    preset: {
      control: "select",
      options: ["no-data", "error-404", "offline", "no-results"],
      description: "Visual illustration preset and default messaging",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component scale and typography hierarchy",
    },
    title: {
      control: "text",
      description: "Custom headline title",
    },
    description: {
      control: "text",
      description: "Custom explanatory body copy",
    },
    actionLabel: {
      control: "text",
      description: "Call-to-action button label",
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Preset Stories ───────────────────────────────────────────────────────────

/**
 * Friendly empty data illustration suitable for blank tables, initial lists, or empty workspaces.
 */
export const NoData: Story = {
  args: {
    preset: "no-data",
    actionLabel: "Add item",
  },
};

/**
 * Page or resource not found (404) illustration with broken route indicators.
 */
export const Error404: Story = {
  args: {
    preset: "error-404",
    actionLabel: "Back to home",
  },
};

/**
 * Offline / network disconnect illustration with severed signal pulses.
 */
export const Offline: Story = {
  args: {
    preset: "offline",
    actionLabel: "Retry connection",
  },
};

/**
 * Search or filter query with zero matches, featuring an empty magnifier inspection.
 */
export const NoResults: Story = {
  args: {
    preset: "no-results",
    actionLabel: "Clear search",
  },
};

// ── Size Variations ──────────────────────────────────────────────────────────

/**
 * Compact layout (`sm`) designed for sidebars, mobile drawers, or small widget cards.
 */
export const SizeSmall: Story = {
  args: {
    preset: "no-data",
    size: "sm",
    actionLabel: "Add item",
  },
};

/**
 * Standard layout (`md`) designed for panels, cards, and modal dialogs.
 */
export const SizeMedium: Story = {
  args: {
    preset: "no-data",
    size: "md",
    actionLabel: "Add item",
  },
};

/**
 * Expansive layout (`lg`) designed for heroic empty states and full-page views.
 */
export const SizeLarge: Story = {
  args: {
    preset: "no-data",
    size: "lg",
    actionLabel: "Add item",
  },
};

// ── Customization Stories ────────────────────────────────────────────────────

/**
 * Demonstrates overriding the preset's default heading and description with custom copy.
 */
export const CustomTitleAndDescription: Story = {
  args: {
    preset: "no-data",
    title: "Your inbox is completely clear",
    description: "You have reviewed all pending notifications and approvals for today. Enjoy your day!",
    actionLabel: "View archive",
  },
};

/**
 * Demonstrates interactive action button with a live event callback.
 */
export const WithActionCallback: Story = {
  render: () => {
    const [actionCount, setActionCount] = useState(0);

    return (
      <div className="flex flex-col items-center gap-[var(--ant-spacing-4)] w-full max-w-lg mx-auto">
        <EmptyState
          preset="offline"
          actionLabel="Retry connection"
          onAction={() => setActionCount((c) => c + 1)}
        />
        {actionCount > 0 && (
          <div
            role="status"
            className="p-[var(--ant-spacing-3)] rounded-[var(--ant-radius-md)] border border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary-dk)] text-[length:var(--ant-typography-fontSize-sm)] font-[var(--ant-typography-fontWeight-medium)]"
          >
            Connection retry requested {actionCount} {actionCount === 1 ? "time" : "times"}.
          </div>
        )}
      </div>
    );
  },
};

/**
 * Demonstrates completely replacing the built-in preset SVG with a custom ReactNode illustration.
 */
export const CustomIllustration: Story = {
  args: {
    preset: "no-data",
    title: "Pro features locked",
    description: "Upgrade your subscription to unlock advanced real-time team collaboration.",
    actionLabel: "Upgrade to Pro",
    illustration: (
      <div
        className="w-[var(--ant-spacing-16)] h-[var(--ant-spacing-16)] rounded-[var(--ant-radius-full)] flex items-center justify-center bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary)] shadow-[var(--ant-shadow-sm)]"
        aria-hidden="true"
      >
        <svg
          className="w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
    ),
  },
};

// ── Theme Stories ────────────────────────────────────────────────────────────

/**
 * Explicit Dark Theme demonstration verifying high contrast and token adaptation.
 */
export const DarkTheme: Story = {
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
          className="dark p-[var(--ant-spacing-8)] rounded-[var(--ant-radius-xl)] border border-[var(--ant-color-neutral-700)] bg-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-50)] shadow-[var(--ant-shadow-md)] max-w-lg mx-auto"
        >
          <Story />
        </div>
      </ThemeContext.Provider>
    ),
  ],
  args: {
    preset: "no-data",
    actionLabel: "Create project",
  },
};
