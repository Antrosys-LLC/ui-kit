import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "./ThemeToggle";

const meta = {
  title: "Utilities/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  argTypes: {
    defaultTheme: { control: "select", options: ["light", "dark"], description: "Default theme fallback" },
    storageKey: { control: "text", description: "LocalStorage key for persistence" },
    transition: { control: "boolean", description: "Enable smooth CSS transition animation" },
    showLabel: { control: "boolean", description: "Display text label alongside icon" },
    className: { control: "text", description: "Optional additional CSS classes" },
  },
  args: {
    defaultTheme: "light",
    storageKey: "antrosys-ui-theme",
    transition: true,
    showLabel: true,
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultTheme: "light",
    storageKey: "antrosys-ui-theme-light",
  },
};

export const DefaultDark: Story = {
  args: {
    defaultTheme: "dark",
    storageKey: "antrosys-ui-theme-dark",
  },
};

export const IconOnly: Story = {
  args: {
    showLabel: false,
  },
};

export const WithoutTransition: Story = {
  args: {
    transition: false,
  },
};