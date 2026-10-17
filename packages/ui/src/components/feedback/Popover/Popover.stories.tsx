import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Popover } from "./Popover";
import { Button } from "../Button";

const meta: Meta<typeof Popover> = {
  title: "Feedback/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
        "right",
        "right-start",
        "right-end",
      ],
      description: "Popover placement",
    },
    trigger: {
      control: "select",
      options: ["click", "hover", "focus"],
      description: "Trigger mechanism",
    },
    arrow: {
      control: "boolean",
      description: "Show arrow pointer",
    },
    closeButton: {
      control: "boolean",
      description: "Show close button in header",
    },
    modal: {
      control: "boolean",
      description: "Trap focus within popover modal",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const DefaultCard: Story = {
  args: {
    title: "Quick Profile",
    closeButton: true,
    content: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
            JD
          </div>
          <div>
            <div className="font-semibold text-sm">Jane Doe</div>
            <div className="text-xs text-neutral-500">jane.doe@antrosys.io</div>
          </div>
        </div>
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-end gap-2">
          <Button size="sm" variant="ghost">
            Logout
          </Button>
          <Button size="sm" variant="primary">
            View Profile
          </Button>
        </div>
      </div>
    ),
    children: <Button variant="secondary">Open Profile</Button>,
  },
};

export const InteractiveSettingsForm: Story = {
  name: "Interactive Form Popover",
  render: () => {
    const [dimensions, setDimensions] = useState({ width: "100%", height: "250px" });

    return (
      <Popover
        title="Canvas Dimensions"
        closeButton
        content={
          <div className="flex flex-col gap-3">
            <p className="text-xs text-neutral-500">
              Set default dimensions for the graphic container.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium block mb-1">Width</label>
                <input
                  type="text"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Height</label>
                <input
                  type="text"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button size="sm" variant="primary">
                Apply
              </Button>
            </div>
          </div>
        }
      >
        <Button variant="secondary">Configure Canvas</Button>
      </Popover>
    );
  },
};

export const HoverPopover: Story = {
  name: "Hover Trigger Popover",
  args: {
    trigger: "hover",
    placement: "top",
    title: "Instant Preview",
    content: (
      <div className="text-xs text-neutral-600 dark:text-neutral-300">
        Hover-activated popover for effortless contextual glance cards and quick statistics.
      </div>
    ),
    children: <Button variant="ghost">Hover for Glance</Button>,
  },
};
