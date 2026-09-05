import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import * as Y from 'yjs';
import { RichTextEditor } from './RichTextEditor';
import { ThemeContext } from '../../../providers/ThemeProvider';

const meta = {
  title: 'Forms/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  argTypes: {
    toolbar: {
      control: 'object',
      description: 'Active toolbar items to display',
    },
    outputFormat: {
      control: 'select',
      options: ['markdown', 'html'],
      description: 'Output format emitted by onChange callback',
    },
    collaborative: {
      control: 'boolean',
      description: 'Enable collaborative mode indicator / Yjs sync',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables editing',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when editor is empty',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Theme override',
    },
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Write your article or notes here...',
    outputFormat: 'markdown',
    collaborative: false,
    toolbar: [
      'heading',
      'bold',
      'italic',
      'bulletList',
      'orderedList',
      'blockquote',
      'codeBlock',
      'image',
      'table',
    ],
    initialContent: `# Antrosys Rich Text Editor

Writing with the editor feels natural, fast, and structured.

> "Design is not just what it looks like and feels like. Design is how it works."

### Current Sprint Deliverables

| Task / Feature | Owner | Priority | Status |
| --- | --- | --- | --- |
| Rich Text Editor | Ramsha Khan | High | Done |
| Design Tokens | Design Systems | Medium | Ready |
| Storybook Suite | QA Team | High | In progress |

### Visual Preview

![Design System Visual](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80)`,
  },
  render: (args) => (
    <div className="p-4">
      <div className="mx-auto w-full max-w-[760px] border border-[var(--ant-color-neutral-300,#d1d5db)] dark:border-[var(--ant-color-neutral-700,#374151)] bg-[var(--ant-color-surface-base,#ffffff)] dark:bg-[var(--ant-color-surface-dark,#111827)] shadow-[0_0_0_1px_rgba(0,0,0,0.02)]">
        <RichTextEditor {...args} />
      </div>
    </div>
  ),
};

export const WithTable: Story = {
  name: 'With Table (Cells & Controls)',
  args: {
    placeholder: 'Edit table or content...',
    outputFormat: 'markdown',
    initialContent: `# Product Roadmap & Feature Matrix

Click inside any cell in the table below to activate the contextual **Table Controls** toolbar (add/remove rows & columns, toggle header row, merge/split cells).

| Module / Component | Category | Lead Owner | Status | ETA |
| --- | --- | --- | --- | --- |
| **RichTextEditor** | Forms | Ramsha Khan | Completed | Sprint 1 |
| **ChartSuite** | Visualizations | Alex Vance | In Progress | Sprint 2 |
| **ImageCarousel** | Media | Mia Wong | Completed | Sprint 1 |
| **ComboBox** | Forms | David Kim | In Review | Sprint 3 |
| **Timeline** | Data | Sarah Chen | Planning | Sprint 4 |

> **Pro Tip**: You can also drag the borders between columns to resize them interactively.`,
  },
  render: (args) => (
    <div className="p-4">
      <div className="mx-auto w-full max-w-[840px] border border-[var(--ant-color-neutral-300,#d1d5db)] dark:border-[var(--ant-color-neutral-700,#374151)] bg-[var(--ant-color-surface-base,#ffffff)] dark:bg-[var(--ant-color-surface-dark,#111827)] shadow-sm">
        <RichTextEditor {...args} />
      </div>
    </div>
  ),
};

export const WithImages: Story = {
  name: 'With Images',
  args: {
    placeholder: 'Write article with media...',
    outputFormat: 'markdown',
    initialContent: `# Visual Design & Asset Gallery

Visual assets and imagery bring context and clarity to user interfaces. The editor supports direct local image file uploads and remote URL insertion.

![Abstract Gradient Landscape](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80)

*Figure 1: Architectural gradient visual for brand theme explorations.*

### Component Wireframing

Below is an illustration of interface drafting workflows:

![Creative Workspace Desk](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80)

Select any image to focus or resize, or click the toolbar **Image** / **URL** buttons to insert additional media.`,
  },
  render: (args) => (
    <div className="p-4">
      <div className="mx-auto w-full max-w-[840px] border border-[var(--ant-color-neutral-300,#d1d5db)] dark:border-[var(--ant-color-neutral-700,#374151)] bg-[var(--ant-color-surface-base,#ffffff)] dark:bg-[var(--ant-color-surface-dark,#111827)] shadow-sm">
        <RichTextEditor {...args} />
      </div>
    </div>
  ),
};

export const WithTableAndImages: Story = {
  name: 'With Table & Images',
  args: {
    placeholder: 'Rich documentation...',
    outputFormat: 'markdown',
    initialContent: `# Executive Product Brief: Q3 Platform Release

This report documents current engineering milestones, architectural benchmarks, and visual assets for the upcoming release.

![Dashboard Analytics Overview](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80)

### Performance Benchmarks & Deliverables

| Feature Area | Target Metric | Current Result | Status |
| --- | --- | --- | --- |
| Editor Load Latency | < 150ms | **92ms** | Exceeded |
| Bundle Size (gzipped) | < 50kb | **38.4kb** | Target Met |
| Table Cell Rendering | 60 fps scroll | **60 fps** | Target Met |
| Image Asset Optimization | WebP / AVIF | **Enabled** | Completed |

> "Ensuring seamless integration across data tables, visual media, and rich text editing produces the best authoring experience."

### Architectural Overview

![Mobile Application Architecture](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80)`,
  },
  render: (args) => (
    <div className="p-4">
      <div className="mx-auto w-full max-w-[840px] border border-[var(--ant-color-neutral-300,#d1d5db)] dark:border-[var(--ant-color-neutral-700,#374151)] bg-[var(--ant-color-surface-base,#ffffff)] dark:bg-[var(--ant-color-surface-dark,#111827)] shadow-sm">
        <RichTextEditor {...args} />
      </div>
    </div>
  ),
};

export const WithFormattedContent: Story = {
  args: {
    outputFormat: 'markdown',
    initialContent: `## Rich Text Editor #17

This editor is powered by **Tiptap** and React, supporting rich formatting, tables, images, and multiple output formats.

> "Simple things should be simple, complex things should be possible."

- Full WYSIWYG editing
- Clean Markdown & HTML output
- Optional **Yjs** collaborative mode

\`\`\`typescript
const editor = new Editor({
  extensions: [StarterKit, Table, Image, Markdown]
});
\`\`\`

| Feature | Support |
| --- | --- |
| Resizable Tables | Yes |
| Media / Pictures | Yes |
| Real-time Collaboration | Yes |`,
  },
  render: (args) => (
    <div className="p-4">
      <div className="mx-auto w-full max-w-[760px]">
        <RichTextEditor {...args} />
      </div>
    </div>
  ),
};

export const MarkdownOutputMode: Story = {
  render: () => {
    const [markdownText, setMarkdownText] = useState(`# Project Overview

**Writing clean markdown** makes the content easy to read, edit, and sync.

> "Simple is powerful."

| Component | Status | Notes |
| --- | --- | --- |
| Table Cells | Fixed | Full border & padding support |
| Pictures / Images | Active | Responsive sizing & upload |

![Clean Workspace](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80)`);

    return (
      <div className="flex max-w-[800px] flex-col gap-4 p-4">
        <RichTextEditor
          outputFormat="markdown"
          initialContent={markdownText}
          onChange={setMarkdownText}
        />
        <div className="overflow-hidden rounded-md border border-[var(--ant-color-surface-border,#cbd5e1)] dark:border-neutral-700">
          <div className="border-b border-[var(--ant-color-surface-border,#cbd5e1)] dark:border-neutral-700 bg-[var(--ant-color-neutral-100,#f1f5f9)] dark:bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Live Markdown Output (<code className="font-mono">outputFormat="markdown"</code>)
          </div>
          <pre className="m-0 whitespace-pre-wrap bg-[var(--ant-color-surface-bg,#f8fafc)] dark:bg-neutral-900 p-3 font-mono text-[13px] text-neutral-900 dark:text-neutral-100">
            {markdownText}
          </pre>
        </div>
      </div>
    );
  },
};

export const CollaborativeWithYjs: Story = {
  render: () => {
    const sharedYDoc = new Y.Doc();

    return (
      <div className="flex max-w-[840px] flex-col gap-5 p-4">
        <div>
          <h3 className="mb-1 text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
            Peer Editor 1 (Collaborator A)
          </h3>
          <p className="mb-2 text-xs text-[var(--ant-color-neutral-500,#64748b)]">
            Changes typed here sync live to Peer Editor 2 via the shared Yjs document.
          </p>
          <RichTextEditor
            collaborative
            ydoc={sharedYDoc}
            initialContent="# Shared Document

Changes made here sync live between both peer editor instances."
          />
        </div>

        <div>
          <h3 className="mb-1 text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
            Peer Editor 2 (Collaborator B)
          </h3>
          <p className="mb-2 text-xs text-[var(--ant-color-neutral-500,#64748b)]">
            Connected to the same Yjs Doc instance.
          </p>
          <RichTextEditor
            collaborative
            ydoc={sharedYDoc}
            initialContent="# Shared Document

Changes made here sync live between both peer editor instances."
          />
        </div>
      </div>
    );
  },
};

export const ScopedDarkMode: Story = {
  args: {
    placeholder: 'Type in dark mode...',
    theme: 'dark',
    initialContent: `# Dark Mode Editor

This editor is rendered with dark mode theme styling.

| Metric | Score |
| --- | --- |
| Contrast | AAA |
| Readability | Excellent |`,
  },
  render: (args) => (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {}, setTheme: () => {} }}>
      <div className="rounded-lg bg-neutral-950 p-6">
        <RichTextEditor {...args} />
      </div>
    </ThemeContext.Provider>
  ),
};

export const MinimalToolbar: Story = {
  args: {
    toolbar: ['bold', 'italic', 'bulletList', 'blockquote'],
    placeholder: 'Minimal quick comment editor...',
    initialContent: `A simple toolbar for lightweight inline commenting or messaging.`,
  },
  render: (args) => (
    <div className="max-w-[700px] p-4">
      <RichTextEditor {...args} />
    </div>
  ),
};

export const DisabledReadOnly: Story = {
  args: {
    disabled: true,
    initialContent: `# Read-Only Document

This editor is in **read-only** mode. Content cannot be edited.

| Item | Status |
| --- | --- |
| Document Locking | Active |
| Editing | Disabled |`,
  },
  render: (args) => (
    <div className="max-w-[700px] p-4">
      <RichTextEditor {...args} />
    </div>
  ),
};