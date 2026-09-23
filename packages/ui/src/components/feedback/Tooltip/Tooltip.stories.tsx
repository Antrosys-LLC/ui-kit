import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button";

const meta: Meta<typeof Tooltip> = {
  title: "Feedback/Tooltip",
  component: Tooltip,
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
      description: "Placement position",
    },
    trigger: {
      control: "select",
      options: ["hover", "focus", "click"],
      description: "Trigger action",
    },
    arrow: {
      control: "boolean",
      description: "Show arrow pointer",
    },
    offset: {
      control: { type: "number", min: 0, max: 30, step: 2 },
      description: "Distance offset in pixels",
    },
    disabled: {
      control: "boolean",
      description: "Disable tooltip",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const DefaultTop: Story = {
  args: {
    content: "Save document to cloud storage",
    placement: "top",
    children: <Button variant="primary">Hover Me</Button>,
  },
};

export const PlacementsGrid: Story = {
  name: "All Placements Grid",
  render: () => (
    <div className="flex flex-col items-center justify-center min-h-[360px] gap-8 p-12">
      <div className="flex gap-4">
        <Tooltip content="Tooltip on Top Start" placement="top-start">
          <Button variant="secondary" size="sm">
            Top Start
          </Button>
        </Tooltip>
        <Tooltip content="Tooltip on Top" placement="top">
          <Button variant="secondary" size="sm">
            Top
          </Button>
        </Tooltip>
        <Tooltip content="Tooltip on Top End" placement="top-end">
          <Button variant="secondary" size="sm">
            Top End
          </Button>
        </Tooltip>
      </div>

      <div className="flex justify-between w-full max-w-sm">
        <Tooltip content="Tooltip on Left" placement="left">
          <Button variant="secondary" size="sm">
            Left
          </Button>
        </Tooltip>
        <Tooltip content="Tooltip on Right" placement="right">
          <Button variant="secondary" size="sm">
            Right
          </Button>
        </Tooltip>
      </div>

      <div className="flex gap-4">
        <Tooltip content="Tooltip on Bottom Start" placement="bottom-start">
          <Button variant="secondary" size="sm">
            Bottom Start
          </Button>
        </Tooltip>
        <Tooltip content="Tooltip on Bottom" placement="bottom">
          <Button variant="secondary" size="sm">
            Bottom
          </Button>
        </Tooltip>
        <Tooltip content="Tooltip on Bottom End" placement="bottom-end">
          <Button variant="secondary" size="sm">
            Bottom End
          </Button>
        </Tooltip>
      </div>
    </div>
  ),
};

export const ClickTrigger: Story = {
  args: {
    trigger: "click",
    content: "Click again to dismiss",
    placement: "bottom",
    children: <Button variant="secondary">Click Me</Button>,
  },
};

export const RichHTMLContent: Story = {
  args: {
    placement: "right",
    content: (
      <div className="flex flex-col gap-1 text-left py-1">
        <div className="font-bold flex items-center gap-1.5 text-cyan-300">
          <span>⚡</span> Pro Feature
        </div>
        <div className="text-white/90 text-xs">
          Unlock automated CI/CD pipeline triggers and analytics.
        </div>
      </div>
    ),
    children: <Button variant="primary">Inspect Feature</Button>,
  },
};

export const WithoutArrow: Story = {
  args: {
    arrow: false,
    content: "Clean flat tooltip without arrow",
    placement: "top",
    children: <Button variant="ghost">No Arrow</Button>,
  },
};
