import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./Timeline";
import type { TimelineItem } from "./Timeline";

const sampleMilestones: TimelineItem[] = [
  {
    id: "step-1",
    date: "Jan 10, 2026",
    group: "2026",
    title: "Project Inception & Architecture",
    description:
      "Defined core specifications, technical stack, design-token foundation, and team assignments.",
    status: "completed",
    tag: (
      <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-semantic-success)]/10 text-[var(--ant-color-semantic-success)] font-medium">
        Completed
      </span>
    ),
  },
  {
    id: "step-2",
    date: "Feb 05, 2026",
    group: "2026",
    title: "Design System & UI Component Library",
    description:
      "Created reusable primitive tokens, accessible button suites, forms, modal dialogs, and navigation headers.",
    status: "completed",
    tag: (
      <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-semantic-success)]/10 text-[var(--ant-color-semantic-success)] font-medium">
        Completed
      </span>
    ),
  },
  {
    id: "step-3",
    date: "Feb 28, 2026",
    group: "2026",
    title: "Data Visualization & Timeline Rollout",
    description:
      "Engineered ChartSuite visualization suite and chronological Timeline components with dark mode compatibility.",
    status: "current",
    tag: (
      <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-brand-primary)]/10 text-[var(--ant-color-brand-primary)] font-medium">
        In Progress
      </span>
    ),
  },
  {
    id: "step-4",
    date: "Mar 15, 2026",
    group: "2026",
    title: "E2E Testing & Performance Audit",
    description:
      "Execute automated cross-browser matrix, accessibility (WCAG 2.1 AA) evaluation, and bundle optimization.",
    status: "upcoming",
  },
  {
    id: "step-5",
    date: "Apr 01, 2026",
    group: "2026",
    title: "Production Release (v1.0.0)",
    description:
      "Official public deployment across staging and production clusters with automated CI/CD releases.",
    status: "upcoming",
  },
];

const multiYearHistory: TimelineItem[] = [
  {
    id: "hist-1",
    date: "March 2024",
    group: "2024",
    title: "Company Founded",
    description: "Antrosys LLC was established with the vision of high-speed developer tooling.",
    status: "completed",
  },
  {
    id: "hist-2",
    date: "September 2024",
    group: "2024",
    title: "Seed Investment Secured",
    description: "Closed $2.4M seed funding round led by top enterprise venture partners.",
    status: "completed",
  },
  {
    id: "hist-3",
    date: "January 2025",
    group: "2025",
    title: "Alpha Platform Beta Launch",
    description: "Private preview rollout to 150 enterprise early-access partners worldwide.",
    status: "completed",
  },
  {
    id: "hist-4",
    date: "August 2025",
    group: "2025",
    title: "Core Design Token Engine (v0.9)",
    description: "Built the unified design-token architecture backing web, mobile, and IDE extensions.",
    status: "completed",
  },
  {
    id: "hist-5",
    date: "January 2026",
    group: "2026",
    title: "Global Developer Suite (v1.0)",
    description: "Public GA launch of full UI-Kit components, documentation site, and CLI tooling.",
    status: "current",
  },
  {
    id: "hist-6",
    date: "Q3 2026",
    group: "2026",
    title: "AI Co-pilot Multi-Agent Integrations",
    description: "Autonomous code assistant agents and generative UI workflows.",
    status: "upcoming",
  },
];

const statusShowcaseItems: TimelineItem[] = [
  {
    id: "status-completed",
    date: "10:00 AM",
    title: "Database Backup Completed",
    description: "Automated snapshot backup verified and stored in encrypted vault.",
    status: "completed",
  },
  {
    id: "status-current",
    date: "10:30 AM",
    title: "Kubernetes Migration In Progress",
    description: "Deploying blue/green traffic switch across primary compute nodes.",
    status: "current",
  },
  {
    id: "status-warning",
    date: "11:15 AM",
    title: "High Memory Threshold Detected",
    description: "Redis worker pod memory consumption reached 84% capacity.",
    status: "warning",
  },
  {
    id: "status-error",
    date: "11:45 AM",
    title: "Webhook Timeout Failure",
    description: "Failed to dispatch payload to third-party payment gateway after 3 retries.",
    status: "error",
  },
  {
    id: "status-upcoming",
    date: "12:30 PM",
    title: "Scheduled Maintenance Window",
    description: "Planned certificate rotation and CDN cache invalidation.",
    status: "upcoming",
  },
];

const meta = {
  title: "Data/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    controls: {
      exclude: ["items"],
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Timeline visual layout direction",
    },
    alternating: {
      control: "boolean",
      description: "Alternate items left and right of track line (vertical only)",
    },
    groupByDate: {
      control: "boolean",
      description: "Group items under chronological date/year badges",
    },
    animated: {
      control: "boolean",
      description: "Enable scroll reveal animations",
    },
    loading: {
      control: "boolean",
      description: "Show skeleton loading placeholder",
    },
    loadingCount: {
      control: { type: "range", min: 1, max: 6, step: 1 },
      description: "Number of loading skeleton placeholders",
    },
    lineVariant: {
      control: "select",
      options: ["solid", "dashed", "dotted"],
      description: "Connecting line style",
    },
    dense: {
      control: "boolean",
      description: "Compact dense mode with tighter spacing",
    },
    theme: {
      control: "select",
      options: ["light", "dark", "auto"],
      description: "Explicit theme mode override",
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: sampleMilestones,
    orientation: "vertical",
    alternating: false,
    groupByDate: false,
    animated: true,
    loading: false,
    lineVariant: "solid",
    dense: false,
  },
};

export const Horizontal: Story = {
  args: {
    items: sampleMilestones,
    orientation: "horizontal",
    animated: true,
    lineVariant: "solid",
    dense: false,
  },
};

export const Alternating: Story = {
  args: {
    items: sampleMilestones,
    orientation: "vertical",
    alternating: true,
    groupByDate: false,
    animated: true,
    lineVariant: "solid",
    dense: false,
  },
};

export const DateGroups: Story = {
  args: {
    items: multiYearHistory,
    orientation: "vertical",
    alternating: false,
    groupByDate: true,
    animated: true,
    lineVariant: "solid",
    dense: false,
  },
};

export const AlternatingWithDateGroups: Story = {
  args: {
    items: multiYearHistory,
    orientation: "vertical",
    alternating: true,
    groupByDate: true,
    animated: true,
    lineVariant: "solid",
    dense: false,
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        id: "ic-1",
        date: "09:00 AM",
        title: "Sprint Planning",
        description: "Review sprint backlog and prioritize epics with product stakeholders.",
        status: "completed",
        icon: (
          <svg className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)] text-[var(--ant-color-neutral-0)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
      },
      {
        id: "ic-2",
        date: "11:30 AM",
        title: "Code Review & PR Approvals",
        description: "Merged 14 pending pull requests into main staging branch.",
        status: "completed",
        icon: (
          <svg className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)] text-[var(--ant-color-neutral-0)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
      },
      {
        id: "ic-3",
        date: "02:00 PM",
        title: "Cloud Infrastructure Deployment",
        description: "Provisioning dynamic auto-scaling clusters on Kubernetes.",
        status: "current",
        icon: (
          <svg className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)] text-[var(--ant-color-neutral-0)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        ),
      },
      {
        id: "ic-4",
        date: "04:30 PM",
        title: "Security & Penetration Audit",
        description: "Automated vulnerability scanning across public API gateway endpoints.",
        status: "upcoming",
        icon: (
          <svg className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)] text-[var(--ant-color-neutral-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
    ],
    orientation: "vertical",
    alternating: false,
    lineVariant: "solid",
  },
};

export const StatusVariants: Story = {
  args: {
    items: statusShowcaseItems,
    orientation: "vertical",
    alternating: false,
    groupByDate: false,
    lineVariant: "dashed",
    dense: false,
  },
};

export const Dense: Story = {
  args: {
    items: statusShowcaseItems,
    orientation: "vertical",
    alternating: false,
    groupByDate: false,
    dense: true,
    lineVariant: "solid",
  },
};

export const CustomContent: Story = {
  args: {
    items: [
      {
        id: "custom-1",
        date: "Today, 10:15 AM",
        title: "Production Deployment (v2.4.0)",
        description: "Zero-downtime rolling update deployed to primary Kubernetes cluster.",
        status: "completed",
        tag: (
          <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-semantic-success)]/10 text-[var(--ant-color-semantic-success)] font-medium text-[length:var(--ant-typography-fontSize-xs)]">
            Deployed
          </span>
        ),
        content: (
          <div className="flex flex-col gap-[var(--ant-spacing-2)] mt-[var(--ant-spacing-2)]">
            <div className="grid grid-cols-2 gap-[var(--ant-spacing-2)]">
              <div className="p-[var(--ant-spacing-2)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg)] border border-[var(--ant-color-surface-border)] text-[length:var(--ant-typography-fontSize-xs)]">
                <span className="text-[var(--ant-color-surface-text-sub)] block">Duration</span>
                <span className="font-semibold text-[var(--ant-color-semantic-success)]">1m 42s</span>
              </div>
              <div className="p-[var(--ant-spacing-2)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-surface-bg)] border border-[var(--ant-color-surface-border)] text-[length:var(--ant-typography-fontSize-xs)]">
                <span className="text-[var(--ant-color-surface-text-sub)] block">Coverage</span>
                <span className="font-semibold text-[var(--ant-color-brand-primary)]">98.4%</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-[var(--ant-spacing-1)] text-[length:var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)]">
              <span>Commit: <code className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-sm)] bg-[var(--ant-color-surface-bg)] text-[var(--ant-color-surface-text)] font-mono border border-[var(--ant-color-surface-border)]">v2.4.0-rc3</code></span>
              <span className="font-medium text-[var(--ant-color-brand-primary)] cursor-pointer hover:underline">View Logs →</span>
            </div>
          </div>
        ),
      },
      {
        id: "custom-2",
        date: "Today, 11:30 AM",
        title: "Developer Community Milestone",
        description: "Crossed 100,000 monthly active developers across global regions.",
        status: "current",
        tag: (
          <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-brand-primary)]/10 text-[var(--ant-color-brand-primary)] font-medium text-[length:var(--ant-typography-fontSize-xs)]">
            Milestone
          </span>
        ),
        content: (
          <div className="mt-[var(--ant-spacing-2)] p-[var(--ant-spacing-3)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-brand-primary)]/10 border border-[var(--ant-color-brand-primary)]/20 text-[length:var(--ant-typography-fontSize-xs)]">
            <p className="font-medium text-[var(--ant-color-brand-primary)]">
              🎉 Growth rate increased by +42% week-over-week.
            </p>
          </div>
        ),
      },
    ],
    orientation: "vertical",
    alternating: false,
  },
};

export const Loading: Story = {
  args: {
    items: [],
    loading: true,
    loadingCount: 3,
    orientation: "vertical",
    alternating: false,
  },
};

export const LoadingHorizontal: Story = {
  args: {
    items: [],
    loading: true,
    loadingCount: 4,
    orientation: "horizontal",
  },
};

export const Disabled: Story = {
  args: {
    items: [
      {
        id: "dis-1",
        date: "Phase 1",
        title: "Active Pipeline Step",
        description: "Standard active milestone in current progression.",
        status: "completed",
      },
      {
        id: "dis-2",
        date: "Phase 2",
        title: "Disabled / Locked Milestone",
        description: "This milestone is currently disabled or pending prerequisite unlock.",
        status: "upcoming",
        disabled: true,
        tag: (
          <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-surface-bg)] text-[var(--ant-color-surface-text-sub)] border border-[var(--ant-color-surface-border)] font-medium text-[length:var(--ant-typography-fontSize-xs)]">
            Locked
          </span>
        ),
      },
      {
        id: "dis-3",
        date: "Phase 3",
        title: "Future Milestone",
        description: "Scheduled release milestone.",
        status: "upcoming",
      },
    ],
    orientation: "vertical",
    alternating: false,
  },
};
