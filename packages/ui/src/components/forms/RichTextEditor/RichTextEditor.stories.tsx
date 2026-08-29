import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, createContext } from 'react';
import * as Y from 'yjs';
import { RichTextEditor } from './RichTextEditor';

// Mock ThemeContext fallback aligning with the component's ThemeContext
const ThemeContext = createContext<{ theme?: string; isDark?: boolean }>({
  theme: 'dark',
  isDark: true,
});

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
      options: ['html', 'markdown'],
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
    initialContent: `# Ramsha Khan

Writing with the editor feels natural and simple.

> "Design is not just what it looks like and feels like. Design is how it works."

Here are a few quick notes:

- Clean layout
- Fast editing
- Good focus

| Task | Status |
| --- | --- |
| Draft | Ready |
| Review | In progress |`,
  },
  render: (args) => (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true }}>
      <div className="dark p-4">
        <div className="mx-auto w-full max-w-[760px] border border-[var(--ant-color-neutral-300,#d1d5db)] dark:border-[var(--ant-color-neutral-700,#374151)] bg-[var(--ant-color-surface-base,#ffffff)] dark:bg-[var(--ant-color-surface-dark,#111827)] shadow-[0_0_0_1px_rgba(0,0,0,0.02)]">
          <RichTextEditor {...args} />
        </div>
      </div>
    </ThemeContext.Provider>
  ),
};

export const WithFormattedContent: Story = {
  args: {
    initialContent: `
      <h2>Rich Text Editor #17</h2>
      <p>This editor is powered by <strong>Tiptap</strong> and React, supporting rich formatting, tables, images, and multiple output formats.</p>
      <blockquote>"Simple things should be simple, complex things should be possible."</blockquote>
      <ul>
        <li>Full WYSIWYG editing</li>
        <li>Clean <code>HTML</code> and <code>Markdown</code> output</li>
        <li>Optional <strong>Yjs</strong> collaborative mode</li>
      </ul>
      <pre><code>// Example code block
const editor = new Editor({
  extensions: [StarterKit, Table, Markdown]
});</code></pre>
    `,
    outputFormat: 'html',
  },
  render: (args) => (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true }}>
      <div className="dark p-4">
        <div className="mx-auto w-full max-w-[760px]">
          <RichTextEditor {...args} />
        </div>
      </div>
    </ThemeContext.Provider>
  ),
};

export const MarkdownOutputMode: Story = {
  render: () => {
    const [markdownText, setMarkdownText] = useState(`# My Notes

**Writing clean markdown** makes the content easy to read and edit.

> "Simple is powerful."

- Draft ready
- Quote included
- Table below

| Name | Role |
| --- | --- |
| Ramsha |  Frontend dev |
| Ayesha | Editor |`);

    return (
      <ThemeContext.Provider value={{ theme: 'dark', isDark: true }}>
        <div className="dark flex max-w-[800px] flex-col gap-4 p-4">
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
      </ThemeContext.Provider>
    );
  },
};

export const CollaborativeWithYjs: Story = {
  render: () => {
    const sharedYDoc = new Y.Doc();

    return (
      <ThemeContext.Provider value={{ theme: 'dark', isDark: true }}>
        <div className="dark flex max-w-[840px] flex-col gap-5 p-4">
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
              initialContent="<p>Shared collaborative document in real-time.</p>"
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
              initialContent="<p>Shared collaborative document in real-time.</p>"
            />
          </div>
        </div>
      </ThemeContext.Provider>
    );
  },
};

export const ScopedDarkMode: Story = {
  args: {
    placeholder: 'Type in dark mode...',
    initialContent: '<p>This editor is wrapped in a scoped dark theme provider.</p>',
  },
  render: (args) => (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true }}>
      <div className="dark rounded-lg bg-neutral-950 p-6">
        <RichTextEditor {...args} />
      </div>
    </ThemeContext.Provider>
  ),
};

export const MinimalToolbar: Story = {
  args: {
    toolbar: ['bold', 'italic', 'bulletList', 'blockquote'],
    placeholder: 'Minimal quick comment editor...',
    initialContent: '<p>A simple toolbar for lightweight inline commenting or messaging.</p>',
  },
  render: (args) => (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true }}>
      <div className="dark max-w-[700px] p-4">
        <RichTextEditor {...args} />
      </div>
    </ThemeContext.Provider>
  ),
};

export const DisabledReadOnly: Story = {
  args: {
    disabled: true,
    initialContent: '<p>This editor is in <strong>read-only</strong> mode. Content cannot be edited.</p>',
  },
  render: (args) => (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true }}>
      <div className="dark max-w-[700px] p-4">
        <RichTextEditor {...args} />
      </div>
    </ThemeContext.Provider>
  ),
};