import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { clsx } from "clsx";
import { ScrollReveal, withScrollReveal } from "./ScrollReveal";
import { ThemeContext } from "../../../providers/ThemeProvider";

const meta = {
  title: "Animation/ScrollReveal",
  component: ScrollReveal,
  tags: ["autodocs"],
  argTypes: {
    animation: {
      control: "select",
      options: [
        "fade-up",
        "fade-down",
        "fade-left",
        "fade-right",
        "zoom-in",
        "zoom-out",
        "flip",
        "fade",
      ],
      description: "Animation preset to apply when scrolling into view",
    },
    delay: {
      control: { type: "number", step: 0.1, min: 0 },
      description: "Delay before animation begins, in seconds",
    },
    duration: {
      control: { type: "number", step: 0.1, min: 0.1 },
      description: "Duration of the animation, in seconds",
    },
    stagger: {
      control: { type: "number", step: 0.05, min: 0 },
      description: "Stagger delay between sequential child elements in seconds",
    },
    threshold: {
      control: "text",
      description: "ScrollTrigger threshold (number 0..1 or position string e.g. 'top 80%')",
    },
    once: {
      control: "boolean",
      description: "If true, plays once. If false, repeats when scrolling in/out.",
    },
    distance: {
      control: { type: "number", step: 4, min: 0 },
      description: "Displacement distance for directional presets in pixels",
    },
    ease: {
      control: "text",
      description: "GSAP easing equation (e.g. 'power2.out', 'back.out(1.7)')",
    },
    loading: {
      control: "boolean",
      description: "Render accessible skeleton placeholder state",
    },
    disabled: {
      control: "boolean",
      description: "Disable scroll animations entirely",
    },
  },
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Helper component rendering a styled showcase card using Antrosys design tokens.
 */
function ShowcaseCard({
  title,
  subtitle,
  icon,
  badge = "Preset",
  tabIndex,
}: {
  title: string;
  subtitle: string;
  icon?: string;
  badge?: string;
  tabIndex?: number;
}) {
  const themeCtx = React.useContext(ThemeContext);
  const isDark = themeCtx?.theme === "dark";

  return (
    <div
      tabIndex={tabIndex}
      className={clsx(
        "rounded-[var(--ant-radius-lg)] border p-[var(--ant-spacing-6)] shadow-[var(--ant-shadow-sm)] hover:shadow-[var(--ant-shadow-md)] transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-2",
        isDark
          ? "bg-[var(--ant-color-neutral-800)] border-[var(--ant-color-neutral-700)] text-[var(--ant-color-neutral-100)] focus-visible:ring-offset-[var(--ant-color-neutral-900)]"
          : "bg-[var(--ant-color-surface-bg-card)] border-[var(--ant-color-surface-border)] text-[var(--ant-color-surface-text)] focus-visible:ring-offset-[var(--ant-color-neutral-0)]"
      )}
    >
      <div className="flex items-center justify-between mb-[var(--ant-spacing-4)]">
        <span className="inline-flex items-center justify-center w-[var(--ant-spacing-10)] h-[var(--ant-spacing-10)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-brand-primary)]/10 text-[var(--ant-color-brand-primary)] text-lg">
          {icon ?? "✨"}
        </span>
        <span className="text-[length:var(--ant-typography-fontSize-xs)] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-[var(--ant-radius-full)] bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary-dk)]">
          {badge}
        </span>
      </div>
      <h3 className="text-[length:var(--ant-typography-fontSize-lg)] font-bold mb-1">
        {title}
      </h3>
      <p
        className={clsx(
          "text-[length:var(--ant-typography-fontSize-sm)] leading-[var(--ant-typography-lineHeight-normal)]",
          isDark ? "text-[var(--ant-color-neutral-400)]" : "text-[var(--ant-color-surface-text-sub)]"
        )}
      >
        {subtitle}
      </p>
    </div>
  );
}

/**
 * Helper scroll container to preview scroll-reveal animations in Storybook.
 */
function ScrollContainer({
  children,
  leadText = "Scroll down inside this window to trigger the reveal effect",
}: {
  children: React.ReactNode;
  leadText?: string;
}) {
  const themeCtx = React.useContext(ThemeContext);
  const isDark = themeCtx?.theme === "dark";

  return (
    <div
      className={clsx(
        "h-[460px] overflow-y-auto rounded-[var(--ant-radius-xl)] border p-[var(--ant-spacing-6)]",
        isDark
          ? "border-[var(--ant-color-neutral-700)] bg-[var(--ant-color-neutral-900)]"
          : "border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)]"
      )}
    >
      <div
        className={clsx(
          "flex flex-col items-center justify-center h-[260px] text-center border-b border-dashed mb-[var(--ant-spacing-8)]",
          isDark ? "border-[var(--ant-color-neutral-700)]" : "border-[var(--ant-color-surface-border)]"
        )}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--ant-radius-full)] bg-[var(--ant-color-brand-primary)]/10 text-[var(--ant-color-brand-primary)] text-xs font-medium mb-3">
          <svg
            className="w-4 h-4 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          Scroll Trigger Active
        </div>
        <p
          className={clsx(
            "text-[length:var(--ant-typography-fontSize-sm)] max-w-sm",
            isDark ? "text-[var(--ant-color-neutral-400)]" : "text-[var(--ant-color-surface-text-sub)]"
          )}
        >
          {leadText}
        </p>
      </div>
      <div className="pb-[200px]">{children}</div>
    </div>
  );
}

/**
 * 1. Default: Standard Fade-Up reveal animation.
 */
export const Default: Story = {
  args: {
    animation: "fade-up",
    delay: 0.1,
    duration: 0.7,
    threshold: 0.2,
    once: true,
  },
  render: (args) => (
    <ScrollContainer>
      <ScrollReveal {...args}>
        <ShowcaseCard
          title="Fade Up Preset"
          subtitle="Smooth vertical entrance sliding upwards with opacity transition."
          badge="Default"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 2. FadeDown: Enters smoothly from above.
 */
export const FadeDown: Story = {
  args: {
    animation: "fade-down",
    duration: 0.7,
  },
  render: (args) => (
    <ScrollContainer>
      <ScrollReveal {...args}>
        <ShowcaseCard
          title="Fade Down Preset"
          subtitle="Enters gently moving downwards from top into view."
          icon="⬇️"
          badge="Fade Down"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 3. FadeLeft: Slides in horizontally from the right.
 */
export const FadeLeft: Story = {
  args: {
    animation: "fade-left",
    duration: 0.7,
  },
  render: (args) => (
    <ScrollContainer>
      <ScrollReveal {...args}>
        <ShowcaseCard
          title="Fade Left Preset"
          subtitle="Enters horizontally from the right towards the left."
          icon="⬅️"
          badge="Fade Left"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 4. FadeRight: Slides in horizontally from the left.
 */
export const FadeRight: Story = {
  args: {
    animation: "fade-right",
    duration: 0.7,
  },
  render: (args) => (
    <ScrollContainer>
      <ScrollReveal {...args}>
        <ShowcaseCard
          title="Fade Right Preset"
          subtitle="Enters horizontally from the left towards the right."
          icon="➡️"
          badge="Fade Right"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 5. ZoomIn: Scales up into view with a smooth pop.
 */
export const ZoomIn: Story = {
  args: {
    animation: "zoom-in",
    duration: 0.7,
  },
  render: (args) => (
    <ScrollContainer>
      <ScrollReveal {...args}>
        <ShowcaseCard
          title="Zoom In Preset"
          subtitle="Scales up from 85% to 100% size with simultaneous opacity fade."
          icon="🔍"
          badge="Zoom In"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 6. ZoomOut: Scales down from larger size into view.
 */
export const ZoomOut: Story = {
  args: {
    animation: "zoom-out",
    duration: 0.7,
  },
  render: (args) => (
    <ScrollContainer>
      <ScrollReveal {...args}>
        <ShowcaseCard
          title="Zoom Out Preset"
          subtitle="Gently scales down from 115% size to resting state."
          icon="🔎"
          badge="Zoom Out"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 7. Flip: 3D perspective card flip on reveal.
 */
export const Flip: Story = {
  args: {
    animation: "flip",
    duration: 0.8,
  },
  render: (args) => (
    <ScrollContainer>
      <ScrollReveal {...args}>
        <ShowcaseCard
          title="3D Flip Preset"
          subtitle="Card rotates in 3D perspective along the X-axis for a high-impact intro."
          icon="🔄"
          badge="Flip 3D"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 8. StaggeredList: Sequentially animates multiple items with a cascade delay.
 */
export const StaggeredList: Story = {
  args: {
    animation: "fade-up",
    stagger: 0.15,
    duration: 0.6,
  },
  render: (args) => (
    <ScrollContainer leadText="Scroll down to see cards cascade in with 150ms stagger intervals">
      <ScrollReveal {...args} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ShowcaseCard
          title="Phase 1: Discovery"
          subtitle="Map user journeys and uncover foundational system requirements."
          icon="1️⃣"
          badge="Step 01"
        />
        <ShowcaseCard
          title="Phase 2: Architecture"
          subtitle="Build robust component hierarchy and establish token contracts."
          icon="2️⃣"
          badge="Step 02"
        />
        <ShowcaseCard
          title="Phase 3: Deployment"
          subtitle="Deliver production-grade UI modules tested across light & dark themes."
          icon="3️⃣"
          badge="Step 03"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 9. RepeatOnScroll: Bidirectional scroll animation (`once: false`).
 */
export const RepeatOnScroll: Story = {
  args: {
    animation: "fade-up",
    once: false,
    duration: 0.6,
  },
  render: (args) => (
    <ScrollContainer leadText="Scroll up and down: the animation resets and replays dynamically each time!">
      <ScrollReveal {...args}>
        <ShowcaseCard
          title="Repeatable Scroll Trigger"
          subtitle="Reverses when scrolled past and replays smoothly when scrolling back in."
          icon="🔁"
          badge="once: false"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 10. ThresholdConfig: Triggering at custom viewport thresholds.
 */
export const ThresholdConfig: Story = {
  args: {
    animation: "fade-up",
    threshold: "top 60%",
    duration: 0.7,
  },
  render: (args) => (
    <ScrollContainer leadText="Configured with threshold='top 60%' (triggers deeper in the viewport)">
      <ScrollReveal {...args}>
        <ShowcaseCard
          title="Custom Threshold Trigger"
          subtitle="Requires the element to reach 60% of viewport height before initiating."
          icon="🎯"
          badge="top 60%"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 11. LoadingState: Skeleton placeholder for async content.
 */
export const LoadingState: Story = {
  args: {
    loading: true,
  },
  render: (args) => (
    <div className="max-w-md">
      <ScrollReveal {...args}>
        <ShowcaseCard title="Hidden Content" subtitle="Will not be shown during loading" />
      </ScrollReveal>
    </div>
  ),
};

/**
 * 12. DisabledState: Bypasses GSAP and renders content statically.
 */
export const DisabledState: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <div className="max-w-md">
      <ScrollReveal {...args}>
        <ShowcaseCard
          title="Animation Disabled"
          subtitle="Renders content immediately with full opacity and zero transform offset."
          icon="⏸️"
          badge="Disabled"
        />
      </ScrollReveal>
    </div>
  ),
};

/**
 * 13. WithHOC: Example using the `withScrollReveal` higher-order component.
 */
const AnimatedShowcaseCard = withScrollReveal(ShowcaseCard, {
  animation: "zoom-in",
  duration: 0.6,
});

export const WithScrollRevealHOC: Story = {
  render: () => (
    <ScrollContainer leadText="Scroll down to reveal component wrapped using withScrollReveal HOC">
      <AnimatedShowcaseCard
        title="HOC Enhanced Component"
        subtitle="This standard React component was wrapped using withScrollReveal(Component, options)."
        icon="🎁"
        badge="HOC Wrapper"
      />
    </ScrollContainer>
  ),
};

/**
 * 14. KeyboardFocusable: Demonstrates keyboard navigation and prominent focus ring visibility.
 */
export const KeyboardFocusable: Story = {
  render: () => (
    <ScrollContainer leadText="Use Tab / Shift+Tab to test visible focus rings on the interactive button and card below">
      <ScrollReveal
        as="button"
        animation="fade-up"
        className="w-full text-left cursor-pointer rounded-[var(--ant-radius-lg)]"
        onClick={() => alert("Action triggered via keyboard or click")}
      >
        <ShowcaseCard
          tabIndex={0}
          title="Interactive Keyboard-Accessible Element"
          subtitle="Press Tab to focus this element. Notice the crisp brand focus ring with theme-aware offset."
          icon="⌨️"
          badge="A11y Focus"
        />
      </ScrollReveal>
    </ScrollContainer>
  ),
};

/**
 * 15. DarkTheme: Demonstrates ScrollReveal, cards, and loading skeletons in dark mode.
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeContext.Provider value={{ theme: "dark", toggleTheme: () => {}, setTheme: () => {} }}>
      <div className="bg-[var(--ant-color-neutral-900)] p-[var(--ant-spacing-6)] rounded-[var(--ant-radius-xl)]">
        <ScrollContainer leadText="Dark Theme active: scroll down to trigger the dark-styled reveal card">
          <ScrollReveal animation="fade-up">
            <ShowcaseCard
              title="Dark Theme Integration"
              subtitle="Optimized with high contrast neutral tokens (--ant-color-neutral-800 / neutral-100)."
              icon="🌙"
              badge="Dark Mode"
            />
          </ScrollReveal>
        </ScrollContainer>
      </div>
    </ThemeContext.Provider>
  ),
};

