import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import * as Y from 'yjs';
import { RichTextEditor } from './RichTextEditor';

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
    toolbar: ['heading', 'bold', 'italic', 'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'image', 'table'],
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
    <div style={{ padding: '16px' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '760px',
          margin: '0 auto',
          border: '1px solid var(--ant-color-neutral-300)',
          background: 'var(--ant-color-surface-base)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.02)',
        }}
      >
        <RichTextEditor {...args} />
      </div>
    </div>
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
| John Doe | Writer |
| Jane Smith | Editor |`
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' }}>
        <RichTextEditor
          outputFormat="markdown"
          initialContent={`# My Notes

**Writing clean markdown** makes the content easy to read and edit.

> "Simple is powerful."

- Draft ready
- Quote included
- Table below

| Name | Role |
| --- | --- |
| John Doe | Writer |
| Jane Smith | Editor |`}
          onChange={setMarkdownText}
        />
        <div style={{ border: '1px solid var(--ant-color-surface-border, #CBD5E1)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', background: 'var(--ant-color-neutral-100, #F1F5F9)', borderBottom: '1px solid var(--ant-color-surface-border, #CBD5E1)', fontSize: '12px', fontWeight: 600 }}>
            Live Markdown Output (`outputFormat="markdown"`)
          </div>
          <pre
            style={{
              margin: 0,
              padding: '12px',
              backgroundColor: 'var(--ant-color-surface-bg, #F8FAFC)',
              fontSize: '13px',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
            }}
          >
            {markdownText}
          </pre>
        </div>
      </div>
    );
  },
};

export const CollaborativeWithYjs: Story = {
  render: () => {
    // Create a shared Yjs Doc to demonstrate collaborative multi-editor synchronization
    const sharedYDoc = new Y.Doc();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '840px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Peer Editor 1 (Collaborator A)</h3>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--ant-color-neutral-500, #64748B)' }}>
            Changes typed here sync live to Peer Editor 2 via the shared Yjs document.
          </p>
          <RichTextEditor
            collaborative
            ydoc={sharedYDoc}
            initialContent="<p>Shared collaborative document in real-time.</p>"
          />
        </div>

        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Peer Editor 2 (Collaborator B)</h3>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--ant-color-neutral-500, #64748B)' }}>
            Connected to the same Yjs Doc instance.
          </p>
          <RichTextEditor
            collaborative
            ydoc={sharedYDoc}
            initialContent="<p>Shared collaborative document in real-time.</p>"
          />
        </div>
      </div>
    );
  },
};

export const MinimalToolbar: Story = {
  args: {
    toolbar: ['bold', 'italic', 'bulletList', 'blockquote'],
    placeholder: 'Minimal quick comment editor...',
    initialContent: '<p>A simple toolbar for lightweight inline commenting or messaging.</p>',
  },
};

export const DisabledReadOnly: Story = {
  args: {
    disabled: true,
    initialContent: '<p>This editor is in <strong>read-only</strong> mode. Content cannot be edited.</p>',
  },
};
