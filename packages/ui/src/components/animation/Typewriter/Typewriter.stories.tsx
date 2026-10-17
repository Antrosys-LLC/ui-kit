import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Typewriter } from "./Typewriter";

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
    <div className="flex items-center min-h-[var(--ant-spacing-12)]">
      {children}
    </div>
  </div>
);

const meta = {
  title: "Animation/Typewriter",
  component: Typewriter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    strings: {
      control: "object",
      description: "Array of string phrases to type, delete, and cycle through",
    },
    speed: {
      control: "number",
      description: "Typing speed in milliseconds per character",
    },
    deleteSpeed: {
      control: "number",
      description: "Deleting speed in milliseconds per character",
    },
    loop: {
      control: "boolean",
      description: "Whether to loop continuously through the strings",
    },
    pauseDuration: {
      control: "number",
      description: "Pause in milliseconds after typing a string before deleting",
    },
    startDelay: {
      control: "number",
      description: "Delay in milliseconds before animation starts",
    },
    cursor: {
      control: "text",
      description: "Cursor visibility boolean or custom cursor character",
    },
    cursorSpeed: {
      control: "number",
      description: "Blink speed of cursor in milliseconds",
    },
    html: {
      control: "boolean",
      description: "Support for parsing rich HTML tags within strings",
    },
    breakLines: {
      control: "boolean",
      description: "Whether to break lines instead of type-delete-retype",
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
    cursorColor: {
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
      description: "Cursor color override using Antrosys color tokens",
    },
    theme: {
      control: "select",
      options: ["auto", "light", "dark"],
      description: "Theme mode override",
    },
  },
  args: {
    strings: [
      "Antrosys UI Kit",
      "Modern Design System",
      "Accessible React Components",
    ],
    speed: 60,
    deleteSpeed: 40,
    loop: true,
    pauseDuration: 1500,
    startDelay: 200,
    cursor: "|",
    cursorSpeed: 500,
    html: false,
    breakLines: false,
    size: "3xl",
    color: "default",
    theme: "auto",
  },
} satisfies Meta<typeof Typewriter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Typewriter cycling through multiple strings inside the unified card.
 */
export const Default: Story = {
  render: (args) => (
    <StoryCard
      title="Default Typewriter"
      description="Standard typewriter effect cycling through three key phrases"
    >
      <Typewriter {...args} />
    </StoryCard>
  ),
};

/**
 * Demonstrates cycling across multiple phrases with custom pause and brand color.
 */
export const MultipleStrings: Story = {
  args: {
    strings: [
      "Developer Experience",
      "Token-Driven Architecture",
      "Enterprise Ready",
      "Flawless Performance",
    ],
    color: "brand",
    speed: 50,
    deleteSpeed: 30,
    pauseDuration: 1800,
  },
  render: (args) => (
    <StoryCard
      title="Multiple Phrases Cycle"
      description="Seamless type, pause, delete, and retype sequence across four phrases"
    >
      <Typewriter {...args} />
    </StoryCard>
  ),
};

/**
 * Demonstrates different typing and deleting speed configurations.
 */
export const DifferentSpeeds: Story = {
  render: () => (
    <StoryCard
      title="Typing Speeds"
      description="Comparison of fast, natural, and deliberate typing cadences"
      className="w-full max-w-[calc(var(--ant-spacing-24)*5)]"
    >
      <div className="flex flex-col gap-[var(--ant-spacing-4)] w-full">
        <div className="flex flex-col gap-[var(--ant-spacing-1)]">
          <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)]">
            Fast Speed (30ms / 20ms):
          </span>
          <Typewriter
            strings={["Fast & snappy typing for high-tempo UI"]}
            speed={30}
            deleteSpeed={20}
            size="xl"
            color="brand"
          />
        </div>

        <div className="flex flex-col gap-[var(--ant-spacing-1)]">
          <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)]">
            Natural Speed (60ms / 40ms):
          </span>
          <Typewriter
            strings={["Natural human-like typing rhythm"]}
            speed={60}
            deleteSpeed={40}
            size="xl"
            color="default"
          />
        </div>

        <div className="flex flex-col gap-[var(--ant-spacing-1)]">
          <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)]">
            Deliberate Speed (120ms / 60ms):
          </span>
          <Typewriter
            strings={["Deliberate and dramatic presentation"]}
            speed={120}
            deleteSpeed={60}
            size="xl"
            color="info"
          />
        </div>
      </div>
    </StoryCard>
  ),
};

/**
 * Demonstrates cursor customizations: classic pipe, terminal underscore, block, and hidden cursor.
 */
export const CursorVariants: Story = {
  render: () => (
    <StoryCard
      title="Cursor Customization"
      description="Custom characters, custom cursor color variants, and hidden cursor mode"
      className="w-full max-w-[calc(var(--ant-spacing-24)*5)]"
    >
      <div className="flex flex-col gap-[var(--ant-spacing-4)] w-full">
        <div className="flex items-baseline gap-[var(--ant-spacing-3)]">
          <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-20)]">
            Pipe (|):
          </span>
          <Typewriter
            strings={["Classic pipe cursor"]}
            cursor="|"
            size="xl"
            color="default"
          />
        </div>

        <div className="flex items-baseline gap-[var(--ant-spacing-3)]">
          <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-20)]">
            Underscore (_):
          </span>
          <Typewriter
            strings={["Terminal underscore cursor"]}
            cursor="_"
            size="xl"
            color="brand"
            cursorColor="brand"
          />
        </div>

        <div className="flex items-baseline gap-[var(--ant-spacing-3)]">
          <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-20)]">
            Block (▋):
          </span>
          <Typewriter
            strings={["Retro terminal block cursor"]}
            cursor="▋"
            size="xl"
            color="success"
            cursorColor="success"
          />
        </div>

        <div className="flex items-baseline gap-[var(--ant-spacing-3)]">
          <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] w-[var(--ant-spacing-20)]">
            No Cursor:
          </span>
          <Typewriter
            strings={["Clean text without cursor"]}
            cursor={false}
            size="xl"
            color="default"
          />
        </div>
      </div>
    </StoryCard>
  ),
};

/**
 * Demonstrates native rich HTML support, formatting styled words, emphasis, and tokens.
 */
export const HtmlContent: Story = {
  args: {
    html: true,
    strings: [
      'Build <span class="text-[var(--ant-color-brand-primary)] font-bold">blazing fast</span> interfaces',
      'Designed with <span class="text-[var(--ant-color-semantic-success)] font-bold">accessibility</span> first',
      'Powered by <span class="text-[var(--ant-color-semantic-info)] font-bold">Antrosys design tokens</span>',
    ],
    size: "2xl",
    speed: 50,
  },
  render: (args) => (
    <StoryCard
      title="Rich HTML Content Support"
      description="Directly renders HTML markup within strings, including token colors and bold weights"
    >
      <Typewriter {...args} />
    </StoryCard>
  ),
};

/**
 * Demonstrates continuous looping versus single-pass execution.
 */
export const LoopAndNonLoop: Story = {
  render: () => (
    <StoryCard
      title="Looping vs. Single-Pass"
      description="Continuous cycling compared against run-once completion"
      className="w-full max-w-[calc(var(--ant-spacing-24)*5)]"
    >
      <div className="flex flex-col gap-[var(--ant-spacing-4)] w-full">
        <div className="flex flex-col gap-[var(--ant-spacing-1)]">
          <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)]">
            Looping Enabled (Continuous):
          </span>
          <Typewriter
            strings={["Cycles endlessly...", "Back and forth...", "Without stopping."]}
            loop={true}
            size="xl"
            color="brand"
          />
        </div>

        <div className="flex flex-col gap-[var(--ant-spacing-1)]">
          <span className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)]">
            Single-Pass (Stops on Final Phrase):
          </span>
          <Typewriter
            strings={["First phrase...", "Second phrase...", "Finishes and stays here."]}
            loop={false}
            size="xl"
            color="success"
          />
        </div>
      </div>
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
            <Typewriter strings={["Antrosys Design System"]} size={sz} loop={false} />
          </div>
        ))}
      </div>
    </StoryCard>
  ),
};

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
          <Typewriter strings={["Default UI"]} color="default" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Brand
          </p>
          <Typewriter strings={["Brand Accent"]} color="brand" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Success
          </p>
          <Typewriter strings={["Success State"]} color="success" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Warning
          </p>
          <Typewriter strings={["Warning Alert"]} color="warning" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Error
          </p>
          <Typewriter strings={["Critical Error"]} color="error" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Info
          </p>
          <Typewriter strings={["Information"]} color="info" size="2xl" />
        </div>
        <div>
          <p className="text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] mb-[var(--ant-spacing-1)] m-[var(--ant-spacing-0)]">
            Muted
          </p>
          <Typewriter strings={["Subtle Muted"]} color="muted" size="2xl" />
        </div>
      </div>
    </StoryCard>
  ),
};

/**
 * Real-world marketing hero headline showcase demonstrating the Typewriter in context.
 */
export const HeroHeadline: Story = {
  render: () => (
    <StoryCard
      title="Marketing Hero Headline"
      description="Real-world hero section pattern with static prefix and dynamic typewriter keywords"
      className="w-full max-w-[calc(var(--ant-spacing-24)*6)]"
    >
      <div className="flex flex-col gap-[var(--ant-spacing-2)] w-full">
        <span className="text-[var(--ant-typography-fontSize-xs)] uppercase tracking-wider font-bold text-[var(--ant-color-brand-primary)] [[data-theme=dark]_&]:text-[var(--ant-color-brand-primary-lt)] [.dark_&]:text-[var(--ant-color-brand-primary-lt)]">
          Next-Generation Platform
        </span>
        <h2 className="text-[var(--ant-typography-fontSize-3xl)] font-bold text-[var(--ant-color-surface-text)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-100)] [.dark_&]:text-[var(--ant-color-neutral-100)] leading-tight m-[var(--ant-spacing-0)]">
          Build{" "}
          <Typewriter
            strings={[
              "extraordinary apps.",
              "accessible experiences.",
              "scalable systems.",
            ]}
            color="brand"
            size="3xl"
            speed={50}
            deleteSpeed={35}
          />
        </h2>
        <p className="text-[var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)] [[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)] [.dark_&]:text-[var(--ant-color-neutral-400)] m-[var(--ant-spacing-0)]">
          Empowering enterprise engineering teams with cohesive tokens, clean components, and accessible primitives.
        </p>
      </div>
    </StoryCard>
  ),
};
