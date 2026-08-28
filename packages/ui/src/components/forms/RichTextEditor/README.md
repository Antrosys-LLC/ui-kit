# RichTextEditor (#17)

WYSIWYG editor built with **React** and **Tiptap**. Features a rich toolbar with formatting, headings, bullet/ordered lists, blockquotes, code blocks, image upload/URL insertion, and interactive table management. Supports clean **HTML** or **Markdown** output and optional real-time collaborative editing with **Yjs**.

## Reference
- [Tiptap Getting Started](https://tiptap.dev/docs/editor/getting-started/overview)

## Features

- **Tiptap Engine**: Robust, extensible prose editor architecture built on ProseMirror.
- **Rich Formatting Toolbar**: Bold, italic, headings (H1, H2, H3, Paragraph), bullet lists, numbered lists, blockquotes, code blocks, undo, and redo.
- **Image Upload & URL**: Insert images via direct local file upload (base64 or custom async uploader) or URL.
- **Interactive Tables**: Insert tables (3x3 default with header row) and access contextual table editing actions (add/remove rows, add/remove columns, delete table).
- **Dual Output Formats**: Switch between clean `html` and clean `markdown` output.
- **Collaborative Mode**: Optional real-time multi-user editing with `Yjs` (`@tiptap/extension-collaboration`).

## Usage

### Basic WYSIWYG Editor (HTML Output)

```tsx
import { useState } from 'react';
import { RichTextEditor } from '@antrosys/ui';

export function DocumentEditor() {
  const [htmlContent, setHtmlContent] = useState('<p>Hello world!</p>');

  return (
    <RichTextEditor
      initialContent={htmlContent}
      onChange={(content) => setHtmlContent(content)}
      outputFormat="html"
    />
  );
}
```

### Markdown Output Mode

```tsx
import { useState } from 'react';
import { RichTextEditor } from '@antrosys/ui';

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('# Title\n\n**Bold** text with markdown.');

  return (
    <RichTextEditor
      initialContent="# Title\n\n**Bold** text with markdown."
      outputFormat="markdown"
      onChange={(md) => setMarkdown(md)}
    />
  );
}
```

### Collaborative Mode with Yjs

```tsx
import * as Y from 'yjs';
import { RichTextEditor } from '@antrosys/ui';

const ydoc = new Y.Doc();

export function CollaborativeEditor() {
  return (
    <RichTextEditor
      collaborative
      ydoc={ydoc}
      initialContent="<p>Live synchronized document.</p>"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | `string` | `''` | Initial content string in HTML or Markdown |
| `onChange` | `(content: string) => void` | — | Callback invoked with updated content in `outputFormat` |
| `toolbar` | `ToolbarItem[]` | Default toolbar | Array of toolbar items to display |
| `collaborative` | `boolean` | `false` | Enables collaborative mode UI banner and presence |
| `ydoc` | `Y.Doc` | `undefined` | Optional Yjs Document instance for real-time collaboration |
| `outputFormat` | `'html' \| 'markdown'` | `'html'` | Desired output data format |
| `placeholder` | `string` | `'Start writing your content...'` | Empty-state placeholder text |
| `disabled` | `boolean` | `false` | Sets editor to read-only mode |
| `onImageUpload` | `(file: File) => Promise<string> \| string` | — | Custom image uploader returning image URL |
| `minHeight` | `string \| number` | `'200px'` | Minimum height of the content area |
| `className` | `string` | — | Custom container CSS class name |

## Toolbar Items

- `bold`: Bold formatting (`Ctrl+B`)
- `italic`: Italic formatting (`Ctrl+I`)
- `heading`: Heading levels dropdown (`H1`, `H2`, `H3`, `Paragraph`)
- `bulletList`: Bulleted list
- `orderedList`: Numbered ordered list
- `blockquote`: Blockquote callout
- `codeBlock`: Formatted syntax code block
- `image`: Local file upload & URL insertion
- `table`: 3x3 table insertion + contextual table controls
- `undo`: Undo change (`Ctrl+Z`)
- `redo`: Redo change (`Ctrl+Y`)