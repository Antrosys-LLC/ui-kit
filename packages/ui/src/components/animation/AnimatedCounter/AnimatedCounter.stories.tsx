import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedCounter } from "./AnimatedCounter";

interface StoryCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const StoryCard: React.FC<StoryCardProps> = ({
  title,
  description,
  children,
  className = "",
}) => (
  <div
    className={`flex flex-col gap-[var(--ant-spacing-4)] p-[var(--ant-spacing-6)] bg-[var(--ant-color-surface-bg-card)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-800)] [.dark_&]:bg-[var(--ant-color-neutral-800)] rounded-[var(--ant-radius-xl)] border border-[var(--ant-color-surface-border)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-700)] [.dark_&]:border-[var(--ant-color-neutral-700)] shadow-[var(--ant-shadow-sm)] w-[calc(var(--ant-spacing-24)*4)] max-w-full ${className}`}
  >
    {(title || description) && (
      <div className="flex flex-col gap-[var(--ant-spacing-1)]">
        {title && (
          <h3 className="text-[var(--ant-typography-fontSize-sm)] font-semibold text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] m-[var(--ant-spacing-0)]">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] m-[var(--ant-spacing-0)]">
            {description}
          </p>
        )}
      </div>
    )}
    <div className="flex items-center">
      {children}
    </div>
  </div>
);

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
    frame: {
      control: "boolean",
      description: "Optional background frame/container behind the counter to ensure high contrast",
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
    size: "3xl",
    color: "default",
    separator: ",",
    decimal: ".",
    autoAnimate: true,
    autoAnimateOnce: true,
    frame: false,
  },
} satisfies Meta<typeof AnimatedCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default AnimatedCounter using standard Antrosys default props inside a unified card.
 */
export const Default: Story = {
  args: {
    end: 1250,
  },
  render: (args) => (
    <StoryCard
      title="Default Counter"
      description="Standard animated counter with default easing and configuration"
    >
      <AnimatedCounter {...args} />
    </StoryCard>
  ),
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
  render: (args) => (
    <StoryCard
      title="Basic Counter"
      description="Simple numeric counter counting from 0 to 1,250"
    >
      <AnimatedCounter {...args} />
    </StoryCard>
  ),
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
    size: "3xl",
  },
  render: (args) => (
    <StoryCard
      title="Currency Metric"
      description="Financial counter with dollar prefix and 2 decimal places"
    >
      <AnimatedCounter {...args} />
    </StoryCard>
  ),
};
export const Currency: Story = CurrencyPrefix;

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
    size: "3xl",
  },
  render: (args) => (
    <StoryCard
      title="Percentage Metric"
      description="Completion rate counter with percentage suffix"
    >
      <AnimatedCounter {...args} />
    </StoryCard>
  ),
};
export const Percentage: Story = PercentageSuffix;

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
    size: "3xl",
  },
  render: (args) => (
    <StoryCard
      title="Decimal Precision"
      description="High-precision scientific formatting with 4 decimal places"
    >
      <AnimatedCounter {...args} />
    </StoryCard>
  ),
};
export const DecimalFormatting: Story = DecimalValue;

/**
 * Fast duration (0.6 seconds) comparison.
 */
export const FastDuration: Story = {
  args: {
    start: 0,
    end: 420,
    duration: 0.6,
    size: "3xl",
  },
  render: (args) => (
    <StoryCard
      title="Fast Duration (0.6s)"
      description="Snappy animation for real-time dashboards and quick feedback"
    >
      <AnimatedCounter {...args} />
    </StoryCard>
  ),
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
    size: "3xl",
  },
  render: (args) => (
    <StoryCard
      title="Slow Duration (5.0s)"
      description="Deliberate count up to 1,000,000 with thousands separators"
    >
      <AnimatedCounter {...args} />
    </StoryCard>
  ),
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
    size: "3xl",
  },
  render: (args) => (
    <StoryCard
      title="Linear Animation (Easing Disabled)"
      description="Constant velocity counting without acceleration or deceleration"
    >
      <AnimatedCounter {...args} />
    </StoryCard>
  ),
};

/**
 * Custom easing function demonstrating fine-grained animation control.
 */
export const CustomEasing: Story = {
  args: {
    start: 0,
    end: 500,
    duration: 3,
    size: "3xl",
    easing: (t: number, b: number, c: number, d: number) => {
      let ts = t / (d / 2);
      if (ts < 1) return (c / 2) * ts * ts + b;
      ts--;
      return (-c / 2) * (ts * (ts - 2) - 1) + b;
    },
  },
  render: (args) => (
    <StoryCard
      title="Custom Easing Function"
      description="Custom quadratic ease-in-out curve for tailored animation motion"
    >
      <AnimatedCounter {...args} />
    </StoryCard>
  ),
};

/**
 * Counter with high-contrast frame/container, ensuring separation on any background.
 */
export const WithFrame: Story = {
  args: {
    end: 8540,
    prefix: "$",
    color: "brand",
    size: "3xl",
    frame: true,
  },
  render: (args) => (
    <StoryCard
      title="Self-Framed Counter"
      description="Embedded high-contrast container frame behind the counter"
    >
      <AnimatedCounter {...args} />
    </StoryCard>
  ),
};

/**
 * Demonstrates all typography size presets mapped to Antrosys tokens.
 */
export const SizeVariants: Story = {
  render: () => (
    <StoryCard
      title="Typography Sizes"
      description="Size presets from sm to 4xl mapped to Antrosys typography tokens"
    >
      <div className="flex flex-col gap-[var(--ant-spacing-4)] w-full">
        {(["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const).map((sz) => (
          <div key={sz} className="flex items-baseline gap-[var(--ant-spacing-4)]">
            <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-12)]">
              {sz}:
            </span>
            <AnimatedCounter end={1250} size={sz} />
          </div>
        ))}
      </div>
    </StoryCard>
  ),
};
export const Sizes: Story = SizeVariants;

/**
 * Demonstrates all semantic color variants mapped to Antrosys tokens.
 */
export const ColorVariants: Story = {
  render: () => (
    <StoryCard
      title="Semantic Color Variants"
      description="Color presets mapped to Antrosys semantic and brand tokens"
      className="w-full max-w-[calc(var(--ant-spacing-24)*7)]"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--ant-spacing-6)] w-full">
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Default
          </p>
          <AnimatedCounter end={120} color="default" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Brand
          </p>
          <AnimatedCounter end={340} color="brand" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Success
          </p>
          <AnimatedCounter end={98} suffix="%" color="success" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Warning
          </p>
          <AnimatedCounter end={15} suffix="!" color="warning" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Error
          </p>
          <AnimatedCounter end={4} prefix="-" color="error" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Info
          </p>
          <AnimatedCounter end={850} color="info" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Muted
          </p>
          <AnimatedCounter end={64} color="muted" size="2xl" />
        </div>
      </div>
    </StoryCard>
  ),
};

/**
 * Demonstrates interactive dynamic updates to the target value.
 */
export const InteractiveUpdate: Story = {
  render: () => {
    const [target, setTarget] = useState(100);

    return (
      <StoryCard
        title="Interactive Dynamic Counter"
        description="Update target value dynamically to trigger smooth transitions"
      >
        <div className="flex flex-col items-center gap-[var(--ant-spacing-4)] w-full">
          <AnimatedCounter end={target} duration={1.5} color="brand" size="3xl" />
          <div className="flex flex-wrap justify-center gap-[var(--ant-spacing-2)] mt-[var(--ant-spacing-2)]">
            <button
              type="button"
              onClick={() => setTarget(100)}
              className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-sm)] font-medium bg-[var(--ant-color-neutral-100)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-700)] [.dark_&]:bg-[var(--ant-color-neutral-700)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] border border-[var(--ant-color-surface-border)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-600)] [.dark_&]:border-[var(--ant-color-neutral-600)] hover:bg-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:hover:bg-[var(--ant-color-neutral-600)] [.dark_&]:hover:bg-[var(--ant-color-neutral-600)] transition-colors"
            >
              Reset (100)
            </button>
            <button
              type="button"
              onClick={() => setTarget(500)}
              className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-sm)] font-medium bg-[var(--ant-color-neutral-100)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-700)] [.dark_&]:bg-[var(--ant-color-neutral-700)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] border border-[var(--ant-color-surface-border)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-600)] [.dark_&]:border-[var(--ant-color-neutral-600)] hover:bg-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:hover:bg-[var(--ant-color-neutral-600)] [.dark_&]:hover:bg-[var(--ant-color-neutral-600)] transition-colors"
            >
              Count to 500
            </button>
            <button
              type="button"
              onClick={() => setTarget(2500)}
              className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-sm)] font-semibold bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-neutral-0)] hover:bg-[var(--ant-color-brand-primary-dk)] transition-colors shadow-[var(--ant-shadow-sm)]"
            >
              Count to 2,500
            </button>
          </div>
        </div>
      </StoryCard>
    );
  },
};

/**
 * Demonstrates real-world KPI stat cards with AnimatedCounter.
 */
export const StatCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--ant-spacing-4)] w-full max-w-[calc(var(--ant-spacing-24)*9)]">
      <StoryCard
        title="Total Revenue"
        description="Active recurring revenue across enterprise accounts"
        className="w-full"
      >
        <div className="flex flex-col gap-[var(--ant-spacing-1)] w-full">
          <AnimatedCounter
            prefix="$"
            end={128450}
            separator=","
            color="default"
            size="2xl"
          />
          <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-semantic-success)] font-semibold m-[var(--ant-spacing-0)]">
            +14.2% from last month
          </p>
        </div>
      </StoryCard>

      <StoryCard
        title="Active Users"
        description="Monthly active enterprise users across regions"
        className="w-full"
      >
        <div className="flex flex-col gap-[var(--ant-spacing-1)] w-full">
          <AnimatedCounter
            end={48290}
            suffix="+"
            separator=","
            color="brand"
            size="2xl"
          />
          <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-semantic-success)] font-semibold m-[var(--ant-spacing-0)]">
            +8.1% new signups
          </p>
        </div>
      </StoryCard>

      <StoryCard
        title="Customer Satisfaction"
        description="Overall customer sentiment index score"
        className="w-full"
      >
        <div className="flex flex-col gap-[var(--ant-spacing-1)] w-full">
          <AnimatedCounter
            end={99.8}
            suffix="%"
            decimals={1}
            color="success"
            size="2xl"
          />
          <p className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] font-medium m-[var(--ant-spacing-0)]">
            Based on 2,400 ratings
          </p>
        </div>
      </StoryCard>
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
          className="px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-sm)] font-medium bg-[var(--ant-color-neutral-100)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-700)] [.dark_&]:bg-[var(--ant-color-neutral-700)] text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] border border-[var(--ant-color-surface-border)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-600)] [.dark_&]:border-[var(--ant-color-neutral-600)] hover:bg-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:hover:bg-[var(--ant-color-neutral-600)] [.dark_&]:hover:bg-[var(--ant-color-neutral-600)] transition-colors"
        >
          Toggle Loading State: {loading ? "ON" : "OFF"}
        </button>

        <StoryCard
          title="Total Subscribers"
          description="Demonstrates skeleton loader transition"
        >
          {loading ? (
            <div
              className="h-[var(--ant-spacing-10)] w-[var(--ant-spacing-24)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-700)] [.dark_&]:bg-[var(--ant-color-neutral-700)] animate-pulse"
              aria-hidden="true"
            />
          ) : (
            <AnimatedCounter
              end={124500}
              separator=","
              suffix=" subscribers"
              size="2xl"
              color="brand"
            />
          )}
        </StoryCard>
      </div>
    );
  },
};

/**
 * Demonstrates viewport scroll trigger. Scroll down inside the container to trigger the animation.
 */
export const ViewportScrollTrigger: Story = {
  render: () => (
    <StoryCard
      title="Viewport Scroll Trigger"
      description="Scroll down inside the window to trigger auto-animation on reveal"
    >
      <div className="w-full h-[calc(var(--ant-spacing-24)*3)] overflow-y-auto p-[var(--ant-spacing-4)] border border-[var(--ant-color-surface-border)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-700)] [.dark_&]:border-[var(--ant-color-neutral-700)] rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-50)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-900)] [.dark_&]:bg-[var(--ant-color-neutral-900)] shadow-[var(--ant-shadow-sm)] text-center">
        <div className="inline-flex items-center gap-[var(--ant-spacing-1)] px-[var(--ant-spacing-3)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-neutral-200)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-800)] [.dark_&]:bg-[var(--ant-color-neutral-800)] text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)]">
          &darr; Scroll down to reveal
        </div>

        <div className="h-[calc(var(--ant-spacing-24)*3)] flex items-center justify-center text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] italic font-medium">
          (keep scrolling...)
        </div>

        <div className="p-[var(--ant-spacing-5)] bg-[var(--ant-color-surface-bg-card)] [[data-theme=dark]_&]:bg-[var(--ant-color-neutral-800)] [.dark_&]:bg-[var(--ant-color-neutral-800)] rounded-[var(--ant-radius-lg)] border border-[var(--ant-color-surface-border)] [[data-theme=dark]_&]:border-[var(--ant-color-neutral-700)] [.dark_&]:border-[var(--ant-color-neutral-700)] shadow-[var(--ant-shadow-md)]">
          <p className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Viewport Revealed
          </p>
          <AnimatedCounter
            end={8888}
            autoAnimate={true}
            autoAnimateOnce={false}
            color="default"
            size="3xl"
          />
          <p className="mt-[var(--ant-spacing-1)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-semantic-success)] font-semibold m-[var(--ant-spacing-0)]">
            Animated on reveal
          </p>
        </div>
      </div>
    </StoryCard>
  ),
};
