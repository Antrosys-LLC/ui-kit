import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title:     "Feedback/Button",
  component: Button,
  tags:      ["autodocs"],
  argTypes: {
    variant:   { control: "select", options: ["primary", "secondary", "ghost", "danger"] },
    size:      { control: "select", options: ["sm", "md", "lg"] },
    loading:   { control: "boolean" },
    fullWidth: { control: "boolean" },
    disabled:  { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story    = { args: { children: "Save changes", variant: "primary" } };
export const Secondary: Story  = { args: { children: "Cancel",        variant: "secondary" } };
export const Ghost: Story      = { args: { children: "Learn more",    variant: "ghost" } };
export const Danger: Story     = { args: { children: "Delete record", variant: "danger" } };
export const Loading: Story    = { args: { children: "Saving…",       loading: true } };
export const Small: Story      = { args: { children: "Compact",       size: "sm" } };
export const Large: Story      = { args: { children: "Big action",    size: "lg" } };
export const FullWidth: Story  = { args: { children: "Submit form",   fullWidth: true } };
