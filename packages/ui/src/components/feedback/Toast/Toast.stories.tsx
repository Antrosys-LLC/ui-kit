import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Toast, toast, type ToastPosition } from "./Toast";
import { Button } from "../Button";

const meta: Meta<typeof Toast> = {
  title: "Feedback/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      description: "Screen position where the toast stack renders",
    },
    duration: {
      control: "number",
      description: "Auto-dismiss duration in milliseconds",
    },
    maxVisible: {
      control: "number",
      description: "Maximum simultaneous visible toasts",
    },
    pauseOnHover: {
      control: "boolean",
      description: "Pause dismiss timer on mouse hover",
    },
    closeButton: {
      control: "boolean",
      description: "Show close button on each toast",
    },
    expand: {
      control: "boolean",
      description: "Expand stacked toasts on hover",
    },
    richColors: {
      control: "boolean",
      description: "Use rich variant background colors",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

/**
 * Basic interactive Toast manager example with default settings.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Toast {...args} />
      <Button
        variant="primary"
        onClick={() =>
          toast("System Notification", {
            description: "Your background sync completed successfully.",
          })
        }
      >
        Trigger Default Toast
      </Button>
    </div>
  ),
};

/**
 * Success notification with semantic icon and description.
 */
export const Success: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Toast {...args} />
      <Button
        variant="primary"
        onClick={() =>
          toast.success("Profile saved successfully", {
            description: "Your account preferences have been synchronized.",
          })
        }
      >
        Trigger Success Toast
      </Button>
    </div>
  ),
};

/**
 * Error notification with semantic error styling.
 */
export const ErrorStory: Story = {
  name: "Error",
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Toast {...args} />
      <Button
        variant="danger"
        onClick={() =>
          toast.error("Unable to save changes", {
            description: "Network timeout while reaching the server. Please retry.",
          })
        }
      >
        Trigger Error Toast
      </Button>
    </div>
  ),
};

/**
 * Warning notification with semantic warning icon.
 */
export const Warning: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Toast {...args} />
      <Button
        variant="secondary"
        onClick={() =>
          toast.warning("Your session expires soon", {
            description: "You will be logged out in 5 minutes due to inactivity.",
          })
        }
      >
        Trigger Warning Toast
      </Button>
    </div>
  ),
};

/**
 * Informational notification.
 */
export const Info: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Toast {...args} />
      <Button
        variant="ghost"
        onClick={() =>
          toast.info("New notification available", {
            description: "Version 2.4.0 has been deployed with performance improvements.",
          })
        }
      >
        Trigger Info Toast
      </Button>
    </div>
  ),
};

/**
 * Interactive position matrix demonstrating all 6 anchor positions:
 * top-left, top-center, top-right, bottom-left, bottom-center, bottom-right.
 */
export const Positions: Story = {
  render: function PositionsDemo() {
    const [activePosition, setActivePosition] =
      useState<ToastPosition>("bottom-right");

    const positions: ToastPosition[] = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];

    return (
      <div className="flex flex-col items-center gap-6 max-w-lg">
        <Toast position={activePosition} />
        <div className="text-sm font-medium text-[var(--ant-color-surface-text)]">
          Current Position: <span className="font-mono text-[var(--ant-color-brand-primary)]">{activePosition}</span>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full">
          {positions.map((pos) => (
            <Button
              key={pos}
              variant={activePosition === pos ? "primary" : "secondary"}
              size="sm"
              onClick={() => {
                setActivePosition(pos);
                setTimeout(() => {
                  toast.info(`Toast at ${pos}`, {
                    description: `Positioned dynamically at ${pos}`,
                  });
                }, 50);
              }}
            >
              {pos}
            </Button>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Toast with an accessible interactive action button (e.g. File deleted [Undo]).
 */
export const Action: Story = {
  render: (args) => {
    return (
      <div className="flex flex-col items-center gap-4">
        <Toast {...args} />
        <Button
          variant="primary"
          onClick={() =>
            toast.success("File deleted", {
              description: "annual-report-2026.pdf was moved to Trash.",
              action: {
                label: "Undo",
                onClick: () => {
                  toast.info("Action Undone", {
                    description: "annual-report-2026.pdf has been restored.",
                  });
                },
              },
            })
          }
        >
          Delete File (With Undo Action)
        </Button>
      </div>
    );
  },
};

/**
 * Asynchronous Promise toast supporting loading, success, and error resolution states.
 */
export const PromiseToast: Story = {
  name: "Promise",
  render: (args) => {
    const triggerSuccessPromise = () => {
      const mockApi = new Promise<{ id: string; name: string }>((resolve) => {
        setTimeout(() => {
          resolve({ id: "usr_102", name: "Alex Morgan" });
        }, 2000);
      });

      toast.promise(mockApi, {
        loading: "Saving profile changes...",
        success: (data) => `Profile updated for ${data.name}!`,
        error: "Failed to save profile.",
      });
    };

    const triggerErrorPromise = () => {
      const mockFailedApi = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Server timeout"));
        }, 2000);
      });

      toast.promise(mockFailedApi, {
        loading: "Connecting to database...",
        success: "Connection established!",
        error: "Database connection failed. Please retry.",
      });
    };

    return (
      <div className="flex items-center gap-4">
        <Toast {...args} />
        <Button variant="primary" onClick={triggerSuccessPromise}>
          Promise (Resolves Success)
        </Button>
        <Button variant="danger" onClick={triggerErrorPromise}>
          Promise (Rejection Error)
        </Button>
      </div>
    );
  },
};

/**
 * Demonstrates custom auto-dismiss durations (fast 2s, standard 4s, slow 8s, persistent).
 */
export const Duration: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Toast {...args} />
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast.info("Fast Toast (2000ms)", {
            duration: 2000,
            description: "Will dismiss in 2 seconds.",
          })
        }
      >
        2s Auto-Dismiss
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast.info("Long Toast (8000ms)", {
            duration: 8000,
            description: "Will stay visible for 8 seconds.",
          })
        }
      >
        8s Auto-Dismiss
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast.warning("Persistent Toast", {
            duration: Infinity,
            description: "Stays until manually dismissed or closed.",
          })
        }
      >
        Persistent (Infinity)
      </Button>
    </div>
  ),
};

/**
 * Demonstrates pause-on-hover behavior where auto-dismiss timer stops when hovered.
 */
export const PauseOnHover: Story = {
  name: "Pause on Hover",
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Toast {...args} pauseOnHover={true} duration={4000} />
      <div className="text-xs text-[var(--ant-color-surface-text-sub)]">
        Hover over the notification to pause the 4-second auto-dismiss countdown timer.
      </div>
      <Button
        variant="primary"
        onClick={() =>
          toast.info("Hover over me!", {
            description: "Countdown timer will freeze while mouse is hovering this toast.",
          })
        }
      >
        Trigger 4s Toast (Hover to Pause)
      </Button>
    </div>
  ),
};

/**
 * Demonstrates toast stacking and the maxVisible queue limit.
 */
export const Stacking: Story = {
  render: function StackingDemo(args) {
    const [count, setCount] = useState(1);

    return (
      <div className="flex flex-col items-center gap-4">
        <Toast {...args} maxVisible={3} />
        <div className="text-xs text-[var(--ant-color-surface-text-sub)]">
          Max visible is set to 3. Adding more notifications stacks and queues them cleanly.
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => {
              toast.info(`Queued Toast #${count}`, {
                description: `Created at timestamp ${new Date().toLocaleTimeString()}`,
              });
              setCount((c) => c + 1);
            }}
          >
            Spawn Toast #{count}
          </Button>
          <Button variant="secondary" onClick={() => toast.dismiss()}>
            Dismiss All
          </Button>
        </div>
      </div>
    );
  },
};

/**
 * Tests long multi-line titles and descriptions to ensure layouts wrap cleanly.
 */
export const LongContent: Story = {
  name: "Long Content",
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Toast {...args} />
      <Button
        variant="secondary"
        onClick={() =>
          toast.warning(
            "Security advisory: Critical software update required immediately",
            {
              description:
                "A critical vulnerability has been patched in version 3.8.2. All enterprise administrators are advised to update their clusters before the scheduled maintenance window on Friday evening at 23:00 UTC.",
              action: {
                label: "Review Advisory",
                onClick: () => {
                  toast.info("Redirecting to security release notes...");
                },
              },
            }
          )
        }
      >
        Trigger Long Content Toast
      </Button>
    </div>
  ),
};

/**
 * Verifies Toast component rendering and contrast in Dark Theme using Antrosys design tokens.
 */
export const DarkTheme: Story = {
  name: "Dark Theme",
  render: () => (
    <div
      data-theme="dark"
      className="p-8 rounded-[var(--ant-radius-xl)] bg-[var(--ant-color-neutral-900)] text-[var(--ant-color-neutral-0)] border border-[var(--ant-color-neutral-700)] flex flex-col items-center gap-4"
    >
      <Toast theme="dark" />
      <div className="text-sm font-semibold">Dark Mode Environment</div>
      <div className="text-xs text-[var(--ant-color-neutral-400)]">
        Uses semantic neutral-900 surface, neutral-700 borders, and high contrast text tokens.
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          onClick={() =>
            toast.success("Dark Mode Success", {
              description: "Theme styling adheres to Antrosys dark surface tokens.",
            })
          }
        >
          Success Toast
        </Button>
        <Button
          variant="danger"
          onClick={() =>
            toast.error("Dark Mode Error", {
              description: "High-contrast error alert in dark mode.",
            })
          }
        >
          Error Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.info("Dark Mode Action", {
              description: "Item archived into dark workspace.",
              action: {
                label: "Undo",
                onClick: () => toast.info("Restored"),
              },
            })
          }
        >
          With Action
        </Button>
      </div>
    </div>
  ),
};
