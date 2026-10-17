import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CopyButton } from "./CopyButton";

const meta = {
  title: "Utilities/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text", description: "Direct string value to copy to clipboard" },
    selector: { control: "text", description: "CSS selector to query text content from an element" },
    label: { control: "text", description: "Optional button label text" },
    timeout: { control: "number", description: "Duration in milliseconds before resetting state" },
    onCopy: { action: "copied", description: "Callback fired upon successful copy" },
    className: { control: "text", description: "Optional additional CSS classes" },
  },
  args: {
    value: "https://antrosys.io/docs/components/copy-button",
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "https://antrosys.io/docs/components/copy-button",
  },
};

export const WithLabel: Story = {
  args: {
    value: "npm install @antrosys/ui",
    label: "Copy install command",
  },
};

export const WithTargetSelector: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ant-spacing-3)", maxWidth: "380px" }}>
      <div
        id="snippet-code"
        style={{
          padding: "var(--ant-spacing-3)",
          backgroundColor: "var(--ant-color-neutral-100)",
          borderRadius: "0px",
          fontFamily: "monospace",
          fontSize: "var(--ant-typography-fontsize-sm)",
          border: "1px solid var(--ant-color-neutral-300)",
          color: "var(--ant-color-neutral-900)",
        }}
      >
        git clone https://github.com/Antrosys-LLC/ui-kit.git
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "var(--ant-typography-fontsize-sm)", color: "var(--ant-color-neutral-500)" }}>
          Copy code block
        </span>
        <CopyButton selector="#snippet-code" label="Copy code" />
      </div>
    </div>
  ),
};