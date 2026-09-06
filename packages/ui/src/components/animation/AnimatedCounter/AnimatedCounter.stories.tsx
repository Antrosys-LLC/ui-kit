import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedCounter } from "./AnimatedCounter";

const meta = {
  title: "Animation/AnimatedCounter",
  component: AnimatedCounter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    start: {
      control: "number",
      description: "Starting numeric value for the counter animation",
    },
    end: {
      control: "number",
      description: "Target numeric value to count to",
    },
    duration: {
      control: "number",
      description: "Animation duration in seconds",
    },
    prefix: {
      control: "text",
      description: "Symbol or string prepended to the counter",
    },
    suffix: {
      control: "text",
      description: "Symbol or string appended to the counter",
    },
    decimals: {
      control: "number",
      description: "Number of decimal places to format",
    },
    easing: {
      control: "boolean",
      description: "Enable smooth easing (easeOutExpo) or false for linear",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"],
      description: "Size preset using Antrosys typography tokens",
    },
    color: {
      control: "select",
      options: [
        "default",
        "brand",
        "success",
        "warning",
        "error",
        "info",
        "muted",
      ],
      description: "Color variant using Antrosys color tokens",
    },
    separator: {
      control: "text",
      description: "Thousands grouping separator",
    },
    decimal: {
      control: "text",
      description: "Decimal point character",
    },
    autoAnimate: {
      control: "boolean",
      description: "Trigger animation upon scrolling into viewport",
    },
    autoAnimateOnce: {
      control: "boolean",
      description: "Only animate once upon entering viewport",
    },
    onStart: {
      action: "animation started",
      description: "Callback invoked when count begins",
    },
    onComplete: {
      action: "animation completed",
      description: "Callback invoked when count finishes",
    },
  },
  args: {
    start: 0,
    end: 1250,
    duration: 2,
    prefix: "",
    suffix: "",
    decimals: 0,
    easing: true,
    size: "2xl",
    color: "default",
    separator: ",",
    decimal: ".",
    autoAnimate: true,
    autoAnimateOnce: true,
  },
} satisfies Meta<typeof AnimatedCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default AnimatedCounter using standard Antrosys default props.
 */
export const Default: Story = {
  args: {
    end: 1250,
  },
};

/**
 * Basic counter counting from 0 to 1,250 with standard Antrosys styling.
 */
export const Basic: Story = {
  args: {
    start: 0,
    end: 1250,
    duration: 2,
  },
};

/**
 * Financial / Currency metric with prefix "$" and 2 decimal places.
 */
export const CurrencyPrefix: Story = {
  args: {
    start: 0,
    end: 4999.99,
    prefix: "$",
    decimals: 2,
    duration: 2.5,
    color: "brand",
  },
};

/**
 * Completion / Percentage metric with suffix "%".
 */
export const PercentageSuffix: Story = {
  args: {
    start: 0,
    end: 99.4,
    suffix: "%",
    decimals: 1,
    duration: 2,
    color: "success",
  },
};

/**
 * Precision scientific metric demonstrating decimal formatting.
 */
export const DecimalValue: Story = {
  args: {
    start: 0,
    end: 3.14159,
    decimals: 4,
    duration: 2,
    color: "info",
  },
};

/**
 * Fast duration (0.6 seconds) comparison.
 */
export const FastDuration: Story = {
  args: {
    start: 0,
    end: 420,
    duration: 0.6,
  },
};

/**
 * Slow duration (5 seconds) with large numbers and separators.
 */
export const SlowDuration: Story = {
  args: {
    start: 0,
    end: 1000000,
    duration: 5,
    separator: ",",
    color: "brand",
  },
};

/**
 * Linear counting with easing disabled (`easing={false}`).
 */
export const EasingDisabled: Story = {
  args: {
    start: 0,
    end: 250,
    duration: 2.5,
    easing: false,
  },
};

/**
 * Custom easing function demonstrating fine-grained animation control.
 */
export const CustomEasing: Story = {
  args: {
    start: 0,
    end: 500,
    duration: 3,
    // Quadratic ease-in-out
    easing: (t: number, b: number, c: number, d: number) => {
      let ts = t / (d / 2);
      if (ts < 1) return (c / 2) * ts * ts + b;
      ts--;
      return (-c / 2) * (ts * (ts - 2) - 1) + b;
    },
  },
};

/**
 * Demonstrates all typography size presets mapped to Antrosys tokens.
 */
export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--ant-spacing-4)] items-start">
      <div className="flex items-baseline gap-[var(--ant-spacing-4)]">
        <span className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-12)]">
          sm:
        </span>
        <AnimatedCounter end={100} size="sm" />
      </div>
      <div className="flex items-baseline gap-[var(--ant-spacing-4)]">
        <span className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-12)]">
          md:
        </span>
        <AnimatedCounter end={250} size="md" />
      </div>
      <div className="flex items-baseline gap-[var(--ant-spacing-4)]">
        <span className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-12)]">
          lg:
        </span>
        <AnimatedCounter end={500} size="lg" />
      </div>
      <div className="flex items-baseline gap-[var(--ant-spacing-4)]">
        <span className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-12)]">
          xl:
        </span>
        <AnimatedCounter end={750} size="xl" />
      </div>
      <div className="flex items-baseline gap-[var(--ant-spacing-4)]">
        <span className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-12)]">
          2xl:
        </span>
        <AnimatedCounter end={1000} size="2xl" />
      </div>
      <div className="flex items-baseline gap-[var(--ant-spacing-4)]">
        <span className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-12)]">
          3xl:
        </span>
        <AnimatedCounter end={2500} size="3xl" />
      </div>
      <div className="flex items-baseline gap-[var(--ant-spacing-4)]">
        <span className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-12)]">
          4xl:
        </span>
        <AnimatedCounter end={5000} size="4xl" />
      </div>
    </div>
  ),
};

/**
 * Demonstrates all semantic color variants mapped to Antrosys tokens.
 */
export const ColorVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--ant-spacing-6)] p-[var(--ant-spacing-6)] bg-[var(--ant-color-surface-bg-card)] dark:bg-[var(--ant-color-neutral-900)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-900)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] dark:border-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:border-[var(--ant-color-neutral-800)]">
      <div>
        <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)]">
          Default
        </p>
        <AnimatedCounter end={120} color="default" />
      </div>
      <div>
        <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)]">
          Brand
        </p>
        <AnimatedCounter end={340} color="brand" />
      </div>
      <div>
        <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)]">
          Success
        </p>
        <AnimatedCounter end={98} suffix="%" color="success" />
      </div>
      <div>
        <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)]">
          Warning
        </p>
        <AnimatedCounter end={15} suffix="!" color="warning" />
      </div>
      <div>
        <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)]">
          Error
        </p>
        <AnimatedCounter end={4} prefix="-" color="error" />
      </div>
      <div>
        <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)]">
          Info
        </p>
        <AnimatedCounter end={850} color="info" />
      </div>
      <div>
        <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)]">
          Muted
        </p>
        <AnimatedCounter end={64} color="muted" />
      </div>
    </div>
  ),
};

/**
 * Demonstrates interactive dynamic updates to the target value.
 */
export const InteractiveUpdate: Story = {
  render: () => {
    const [target, setTarget] = useState(100);

    return (
      <div className="flex flex-col items-center gap-[var(--ant-spacing-4)] p-[var(--ant-spacing-6)] bg-[var(--ant-color-surface-bg-card)] dark:bg-[var(--ant-color-neutral-900)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-900)] rounded-[var(--ant-radius-xl)] border border-[var(--ant-color-surface-border)] dark:border-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:border-[var(--ant-color-neutral-800)] shadow-[var(--ant-shadow-sm)]">
        <AnimatedCounter end={target} duration={1.5} color="brand" size="3xl" />
        <div className="flex gap-[var(--ant-spacing-2)] mt-[var(--ant-spacing-2)]">
          <button
            type="button"
            onClick={() => setTarget(100)}
            className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-sm)] bg-[var(--ant-color-neutral-100)] dark:bg-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-800)] text-[var(--ant-color-surface-text)] dark:text-[var(--ant-color-neutral-100)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-100)] hover:bg-[var(--ant-color-neutral-200)] dark:hover:bg-[var(--ant-color-neutral-700)] [[data-theme='dark']_&]:hover:bg-[var(--ant-color-neutral-700)] transition-colors"
          >
            Reset (100)
          </button>
          <button
            type="button"
            onClick={() => setTarget(500)}
            className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-sm)] bg-[var(--ant-color-neutral-100)] dark:bg-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-800)] text-[var(--ant-color-surface-text)] dark:text-[var(--ant-color-neutral-100)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-100)] hover:bg-[var(--ant-color-neutral-200)] dark:hover:bg-[var(--ant-color-neutral-700)] [[data-theme='dark']_&]:hover:bg-[var(--ant-color-neutral-700)] transition-colors"
          >
            Count to 500
          </button>
          <button
            type="button"
            onClick={() => setTarget(2500)}
            className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-sm)] bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-neutral-0)] hover:bg-[var(--ant-color-brand-primary-dk)] transition-colors"
          >
            Count to 2,500
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates real-world KPI stat cards with AnimatedCounter.
 */
export const StatCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--ant-spacing-4)] w-full">
      <div className="p-[var(--ant-spacing-5)] bg-[var(--ant-color-surface-bg-card)] dark:bg-[var(--ant-color-neutral-900)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-900)] rounded-[var(--ant-radius-xl)] border border-[var(--ant-color-surface-border)] dark:border-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:border-[var(--ant-color-neutral-800)] shadow-[var(--ant-shadow-sm)]">
        <p className="text-[var(--ant-typography-fontSize-sm)] font-medium text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)]">
          Total Revenue
        </p>
        <div className="mt-[var(--ant-spacing-2)]">
          <AnimatedCounter
            prefix="$"
            end={128450}
            separator=","
            color="default"
            size="2xl"
          />
        </div>
        <p className="mt-[var(--ant-spacing-1)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-semantic-success)] font-medium">
          +14.2% from last month
        </p>
      </div>

      <div className="p-[var(--ant-spacing-5)] bg-[var(--ant-color-surface-bg-card)] dark:bg-[var(--ant-color-neutral-900)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-900)] rounded-[var(--ant-radius-xl)] border border-[var(--ant-color-surface-border)] dark:border-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:border-[var(--ant-color-neutral-800)] shadow-[var(--ant-shadow-sm)]">
        <p className="text-[var(--ant-typography-fontSize-sm)] font-medium text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)]">
          Active Users
        </p>
        <div className="mt-[var(--ant-spacing-2)]">
          <AnimatedCounter
            end={48290}
            suffix="+"
            separator=","
            color="brand"
            size="2xl"
          />
        </div>
        <p className="mt-[var(--ant-spacing-1)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-semantic-success)] font-medium">
          +8.1% new signups
        </p>
      </div>

      <div className="p-[var(--ant-spacing-5)] bg-[var(--ant-color-surface-bg-card)] dark:bg-[var(--ant-color-neutral-900)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-900)] rounded-[var(--ant-radius-xl)] border border-[var(--ant-color-surface-border)] dark:border-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:border-[var(--ant-color-neutral-800)] shadow-[var(--ant-shadow-sm)]">
        <p className="text-[var(--ant-typography-fontSize-sm)] font-medium text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)]">
          Customer Satisfaction
        </p>
        <div className="mt-[var(--ant-spacing-2)]">
          <AnimatedCounter
            end={99.8}
            suffix="%"
            decimals={1}
            color="success"
            size="2xl"
          />
        </div>
        <p className="mt-[var(--ant-spacing-1)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)]">
          Based on 2,400 ratings
        </p>
      </div>
    </div>
  ),
};

/**
 * Demonstrates loading skeleton state transitioning into the animated counter.
 */
export const LoadingOrDisabledState: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);

    return (
      <div className="flex flex-col gap-[var(--ant-spacing-4)] items-center">
        <button
          type="button"
          onClick={() => setLoading(!loading)}
          className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-sm)] bg-[var(--ant-color-neutral-100)] dark:bg-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-800)] text-[var(--ant-color-surface-text)] dark:text-[var(--ant-color-neutral-100)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-100)] hover:bg-[var(--ant-color-neutral-200)] dark:hover:bg-[var(--ant-color-neutral-700)] [[data-theme='dark']_&]:hover:bg-[var(--ant-color-neutral-700)] transition-colors"
        >
          Toggle Loading State: {loading ? "ON" : "OFF"}
        </button>

        <div className="p-[var(--ant-spacing-6)] w-[var(--ant-sidebar-width)] bg-[var(--ant-color-surface-bg-card)] dark:bg-[var(--ant-color-neutral-900)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-900)] rounded-[var(--ant-radius-xl)] border border-[var(--ant-color-surface-border)] dark:border-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:border-[var(--ant-color-neutral-800)] shadow-[var(--ant-shadow-sm)]">
          <p className="text-[var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-2)]">
            Total Subscribers
          </p>

          {loading ? (
            <div
              className="h-[var(--ant-spacing-10)] w-[var(--ant-spacing-24)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-neutral-200)] dark:bg-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-800)] animate-pulse"
              aria-hidden="true"
            />
          ) : (
            <AnimatedCounter
              end={124500}
              separator=","
              suffix=" subscribers"
              size="xl"
              color="brand"
            />
          )}
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates viewport scroll trigger. Scroll down inside the container to trigger the animation.
 */
export const ViewportScrollTrigger: Story = {
  render: () => (
    <div className="w-[var(--ant-sidebar-width)] h-[calc(var(--ant-spacing-24)*3)] overflow-y-auto p-[var(--ant-spacing-4)] border border-[var(--ant-color-surface-border)] dark:border-[var(--ant-color-neutral-700)] [[data-theme='dark']_&]:border-[var(--ant-color-neutral-700)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-surface-bg)] dark:bg-[var(--ant-color-neutral-900)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-900)] shadow-[var(--ant-shadow-sm)] text-center">
      <div className="inline-flex items-center gap-[var(--ant-spacing-1)] px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-neutral-100)] dark:bg-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-800)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text)] dark:text-[var(--ant-color-neutral-200)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-200)] font-semibold">
        &darr; Scroll down to reveal
      </div>

      <div className="h-[calc(var(--ant-spacing-24)*3)] flex items-center justify-center text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-400)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-400)] italic">
        (keep scrolling...)
      </div>

      <div className="p-[var(--ant-spacing-5)] bg-[var(--ant-color-surface-bg-card)] dark:bg-[var(--ant-color-neutral-800)] [[data-theme='dark']_&]:bg-[var(--ant-color-neutral-800)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] dark:border-[var(--ant-color-neutral-700)] [[data-theme='dark']_&]:border-[var(--ant-color-neutral-700)] shadow-[var(--ant-shadow-md)]">
        <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] dark:text-[var(--ant-color-neutral-300)] [[data-theme='dark']_&]:text-[var(--ant-color-neutral-300)] font-medium mb-[var(--ant-spacing-1)]">
          Viewport Revealed
        </p>
        <AnimatedCounter
          end={8888}
          autoAnimate={true}
          autoAnimateOnce={false}
          color="default"
          size="3xl"
        />
        <p className="mt-[var(--ant-spacing-1)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-semantic-success)] font-medium">
          Animated on reveal
        </p>
      </div>
    </div>
  ),
};

/**
 * Demonstrates the AnimatedCounter on a dark surface, proving theme adaptability with 100% Antrosys tokens.
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div
      data-theme="dark"
      className="p-[var(--ant-spacing-6)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-900)] border border-[var(--ant-color-neutral-800)] flex flex-col gap-[var(--ant-spacing-5)] items-start w-[calc(var(--ant-spacing-24)*4)]"
    >
      <div>
        <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)]">
          Default Counter (High Contrast on Dark)
        </p>
        <AnimatedCounter end={125000} size="3xl" color="default" />
      </div>

      <div>
        <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)]">
          Brand Metric
        </p>
        <div className="flex items-baseline gap-[var(--ant-spacing-3)]">
          <AnimatedCounter end={7420} size="3xl" color="brand" prefix="$" />
          <span className="text-[var(--ant-typography-fontSize-sm)] text-[var(--ant-color-semantic-success)] font-bold">
            +22.4%
          </span>
        </div>
      </div>

      <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-neutral-400)]">
        Active recurring revenue across enterprise accounts
      </p>
    </div>
  ),
};
