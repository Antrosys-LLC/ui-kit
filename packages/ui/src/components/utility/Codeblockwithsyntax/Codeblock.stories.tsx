import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./CodeBlock";

const sampleTypeScriptCode = `import React, { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`;

const samplePythonCode = `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=" ")
        a, b = b, a + b
    print()

fibonacci(10)`;

const sampleJsonCode = `{
  "name": "@antrosys/ui",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "shiki": "^1.0.0",
    "react": "^19.0.0"
  }
}`;

const sampleBashCode = `#!/bin/bash
echo "Installing dependencies..."
npm install
npm run storybook`;

const meta = {
  title: "Utilities/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  argTypes: {
    code: { control: "text", description: "Source code string" },
    lang: { control: "text", description: "Language identifier for Shiki" },
    customTheme: { control: "text", description: "Optional explicit Shiki theme override" },
    copySuccessText: { control: "text", description: "Custom copy feedback text" },
  },
  args: {
    code: sampleTypeScriptCode,
    lang: "tsx",
    showLineNumbers: true,
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    code: sampleTypeScriptCode,
    lang: "tsx",
    filename: "Counter.tsx",
  },
};

export const PythonSnippet: Story = {
  args: {
    code: samplePythonCode,
    lang: "python",
    filename: "fibonacci.py",
  },
};

export const JsonConfig: Story = {
  args: {
    code: sampleJsonCode,
    lang: "json",
    filename: "package.json",
  },
};

export const BashScript: Story = {
  args: {
    code: sampleBashCode,
    lang: "bash",
    filename: "setup.sh",
  },
};