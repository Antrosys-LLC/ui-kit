import React, { useEffect, useId, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import Collaboration from '@tiptap/extension-collaboration';
import { Markdown } from 'tiptap-markdown';
import type * as Y from 'yjs';
import { clsx } from 'clsx';

export type ToolbarItem =
  | 'bold'
  | 'italic'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock'
  | 'image'
  | 'table'
  | 'undo'
  | 'redo';

export type OutputFormat = 'html' | 'markdown';

export interface RichTextEditorProps {
  /** Initial content string (HTML or Markdown) */
  initialContent?: string;
  /** Content change callback with updated output according to outputFormat */
  onChange?: (content: string) => void;
  /** Array of active toolbar control tools */
  toolbar?: ToolbarItem[];
  /** Enable real-time collaborative editing state / UI */
  collaborative?: boolean;
  /** Optional Yjs Doc for live multi-user collaborative synchronization */
  ydoc?: Y.Doc;
  /** Output data format: 'html' (default) or 'markdown' */
  outputFormat?: OutputFormat;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Disabled / read-only state */
  disabled?: boolean;
  /** Custom image upload handler returning a Promise<string> or string URL */
  onImageUpload?: (file: File) => Promise<string> | string;
  /** Additional container CSS class name */
  className?: string;
  /** Minimum height of the editor area (default '200px') */
  minHeight?: string | number;
}

const defaultToolbar: ToolbarItem[] = [
  'bold',
  'italic',
  'heading',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'image',
  'table',
];

export function RichTextEditor({
  initialContent = '',
  onChange,
  toolbar = defaultToolbar,
  collaborative = false,
  ydoc,
  outputFormat = 'html',
  placeholder = 'Start writing your content...',
  disabled = false,
  onImageUpload,
  className,
  minHeight = '200px',
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const headingSelectId = useId();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const updateDarkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkTheme(theme === 'dark');
    };

    updateDarkTheme();
    const observer = new MutationObserver(updateDarkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      // When Yjs collaboration is enabled, StarterKit history is disabled (Yjs manages history)
      history: collaborative && ydoc ? false : undefined,
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        class: 'ant-rte-image',
      },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'ant-rte-table',
      },
    }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({
      placeholder,
      emptyEditorClass: 'is-editor-empty',
    }),
    Markdown.configure({
      html: true,
      tightLists: true,
      tightListClass: 'tight',
      bulletListMarker: '-',
      linkify: true,
      breaks: false,
      transformPastedText: true,
      transformCopiedText: true,
    }),
    ...(collaborative && ydoc
      ? [
          Collaboration.configure({
            document: ydoc,
          }),
        ]
      : []),
  ];

  const editor = useEditor({
    extensions,
    content: initialContent,
    editable: !disabled,
    onUpdate: ({ editor: currentEditor }) => {
      if (!onChange) return;
      if (outputFormat === 'markdown') {
        const markdownStorage = (currentEditor.storage as unknown as { markdown?: { getMarkdown: () => string } }).markdown;
        const markdownOutput = markdownStorage?.getMarkdown ? markdownStorage.getMarkdown() : currentEditor.getText();
        onChange(markdownOutput);
      } else {
        onChange(currentEditor.getHTML());
      }
    },
  });

  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!editor) return;
    const value = e.target.value;
    if (value === 'p') {
      editor.chain().focus().setParagraph().run();
    } else if (value === 'h1') {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (value === 'h2') {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (value === 'h3') {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
  };

  const handleImageFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (onImageUpload) {
        const url = await onImageUpload(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            editor.chain().focus().setImage({ src: reader.result, alt: file.name }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInsertImageUrl = () => {
    if (!editor || disabled) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleInsertTable = () => {
    if (!editor || disabled) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const getActiveHeading = () => {
    if (!editor) return 'p';
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    return 'p';
  };

  const isTableActive = editor?.isActive('table');

  return (
    <div
      className={clsx('ant-rich-text-editor', className)}
      data-theme-dark={isDarkTheme ? 'true' : 'false'}
      style={{
        width: '100%',
        border: '1px solid var(--ant-color-surface-border)',
        borderRadius: 'var(--ant-radius-md)',
        backgroundColor: isDarkTheme ? 'var(--ant-color-neutral-900)' : 'var(--ant-color-neutral-0)',
        fontFamily: 'var(--ant-typography-fontFamily-sans)',
        overflow: 'hidden',
        boxShadow: 'var(--ant-shadow-sm)',
      }}
    >
      {/* Collaborative Mode Banner */}
      {collaborative && (
        <div
          data-testid="collaborative-banner"
          style={{
            padding: 'var(--ant-spacing-2) var(--ant-spacing-3)',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: 'var(--ant-color-brand-primary-lt)',
            color: 'var(--ant-color-brand-primary)',
            borderBottom: '1px solid var(--ant-color-surface-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--ant-spacing-2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ant-spacing-2)' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--ant-color-semantic-success)',
                boxShadow: '0 0 0 2px var(--ant-color-semantic-success)',
                opacity: 0.25,
              }}
            />
            <span>Collaborative Mode Active (Yjs Enabled)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--ant-color-brand-primary)',
                color: 'var(--ant-color-neutral-0)',
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              U1
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--ant-color-semantic-info)',
                color: 'var(--ant-color-neutral-0)',
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              U2
            </span>
          </div>
        </div>
      )}

      {/* Editor Toolbar */}
      <div
        role="toolbar"
        aria-label="Editor formatting toolbar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 10px',
          backgroundColor: isDarkTheme ? 'var(--ant-color-neutral-800)' : 'var(--ant-color-surface-bg)',
          borderBottom: '1px solid var(--ant-color-surface-border)',
        }}
      >
        {/* Headings Selector */}
        {toolbar.includes('heading') && (
          <>
            <label
              htmlFor={headingSelectId}
              id={`${headingSelectId}-label`}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: isDarkTheme ? 'var(--ant-color-neutral-100)' : 'var(--ant-color-surface-text)',
                marginRight: '4px',
              }}
            >
              Heading
            </label>
            <select
              id={headingSelectId}
              aria-label="Heading style"
              aria-labelledby={`${headingSelectId}-label`}
              title="Heading style"
              value={getActiveHeading()}
              onChange={handleHeadingChange}
              disabled={disabled || !editor}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                padding: '4px 8px',
                border: '1px solid var(--ant-color-surface-border)',
                borderRadius: 'var(--ant-radius-sm)',
                backgroundColor: 'var(--ant-color-neutral-0)',
                color: 'var(--ant-color-surface-text)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                outline: 'none',
              }}
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
          </>
        )}

        {/* Bold Button */}
        {toolbar.includes('bold') && (
          <button
            type="button"
            aria-label="Toggle bold"
            aria-pressed={editor?.isActive('bold')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
            style={{
              padding: '4px 8px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid',
              borderColor: editor?.isActive('bold') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-border)',
              backgroundColor: editor?.isActive('bold') ? 'var(--ant-color-brand-primary-lt)' : 'var(--ant-color-neutral-0)',
              color: editor?.isActive('bold') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-text)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            B
          </button>
        )}

        {/* Italic Button */}
        {toolbar.includes('italic') && (
          <button
            type="button"
            aria-label="Toggle italic"
            aria-pressed={editor?.isActive('italic')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
            style={{
              padding: '4px 8px',
              fontSize: '13px',
              fontStyle: 'italic',
              fontFamily: 'serif',
              fontWeight: 600,
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid',
              borderColor: editor?.isActive('italic') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-border)',
              backgroundColor: editor?.isActive('italic') ? 'var(--ant-color-brand-primary-lt)' : 'var(--ant-color-neutral-0)',
              color: editor?.isActive('italic') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-text)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            I
          </button>
        )}

        {/* Bullet List */}
        {toolbar.includes('bulletList') && (
          <button
            type="button"
            aria-label="Toggle bullet list"
            aria-pressed={editor?.isActive('bulletList')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            title="Bullet List"
            style={{
              padding: '4px 8px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid',
              borderColor: editor?.isActive('bulletList') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-border)',
              backgroundColor: editor?.isActive('bulletList') ? 'var(--ant-color-brand-primary-lt)' : 'var(--ant-color-neutral-0)',
              color: editor?.isActive('bulletList') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-text)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            • List
          </button>
        )}

        {/* Ordered List */}
        {toolbar.includes('orderedList') && (
          <button
            type="button"
            aria-label="Toggle numbered list"
            aria-pressed={editor?.isActive('orderedList')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
            style={{
              padding: '4px 8px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid',
              borderColor: editor?.isActive('orderedList') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-border)',
              backgroundColor: editor?.isActive('orderedList') ? 'var(--ant-color-brand-primary-lt)' : 'var(--ant-color-neutral-0)',
              color: editor?.isActive('orderedList') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-text)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            1. List
          </button>
        )}

        {/* Blockquote */}
        {toolbar.includes('blockquote') && (
          <button
            type="button"
            aria-label="Toggle blockquote"
            aria-pressed={editor?.isActive('blockquote')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
            style={{
              padding: '4px 8px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid',
              borderColor: editor?.isActive('blockquote') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-border)',
              backgroundColor: editor?.isActive('blockquote') ? 'var(--ant-color-brand-primary-lt)' : 'var(--ant-color-neutral-0)',
              color: editor?.isActive('blockquote') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-text)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            “ Quote
          </button>
        )}

        {/* Code Block */}
        {toolbar.includes('codeBlock') && (
          <button
            type="button"
            aria-label="Toggle code block"
            aria-pressed={editor?.isActive('codeBlock')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              fontFamily: 'monospace',
              fontWeight: 600,
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid',
              borderColor: editor?.isActive('codeBlock') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-border)',
              backgroundColor: editor?.isActive('codeBlock') ? 'var(--ant-color-brand-primary-lt)' : 'var(--ant-color-neutral-0)',
              color: editor?.isActive('codeBlock') ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-text)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            &lt;/&gt;
          </button>
        )}

        {/* Image Insert */}
        {toolbar.includes('image') && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Select image file"
              title="Select image file"
              style={{ display: 'none' }}
              onChange={handleImageFileSelected}
              disabled={disabled}
            />
            <button
              type="button"
              aria-label="Insert image"
              disabled={disabled || !editor}
              onClick={() => {
                if (onImageUpload) {
                  fileInputRef.current?.click();
                  return;
                }
                handleInsertImageUrl();
              }}
              title="Insert Image"
              style={{
                padding: '4px 8px',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: 'var(--ant-radius-sm)',
                border: '1px solid var(--ant-color-surface-border)',
                backgroundColor: 'var(--ant-color-neutral-0)',
                color: 'var(--ant-color-surface-text)',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              Image
            </button>
          </>
        )}

        {/* Table Insertion */}
        {toolbar.includes('table') && (
          <button
            type="button"
            aria-label="Insert 3x3 table"
            aria-pressed={isTableActive}
            disabled={disabled || !editor}
            onClick={handleInsertTable}
            title="Insert Table"
            style={{
              padding: '4px 8px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid',
              borderColor: isTableActive ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-border)',
              backgroundColor: isTableActive ? 'var(--ant-color-brand-primary-lt)' : 'var(--ant-color-neutral-0)',
              color: isTableActive ? 'var(--ant-color-brand-primary)' : 'var(--ant-color-surface-text)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            ⊞ Table
          </button>
        )}

        {/* Undo / Redo */}
        {toolbar.includes('undo') && (
          <button
            type="button"
            aria-label="Undo"
            disabled={disabled || !editor || !editor.can().undo()}
            onClick={() => editor?.chain().focus().undo().run()}
            title="Undo (Ctrl+Z)"
            style={{
              padding: '4px 8px',
              fontSize: '13px',
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid var(--ant-color-surface-border)',
              backgroundColor: 'var(--ant-color-neutral-0)',
              color: 'var(--ant-color-surface-text)',
              cursor: disabled || !editor?.can().undo() ? 'not-allowed' : 'pointer',
              opacity: editor?.can().undo() ? 1 : 0.5,
            }}
          >
            ↺
          </button>
        )}

        {toolbar.includes('redo') && (
          <button
            type="button"
            aria-label="Redo"
            disabled={disabled || !editor || !editor.can().redo()}
            onClick={() => editor?.chain().focus().redo().run()}
            title="Redo (Ctrl+Y)"
            style={{
              padding: '4px 8px',
              fontSize: '13px',
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid var(--ant-color-surface-border)',
              backgroundColor: 'var(--ant-color-neutral-0)',
              color: 'var(--ant-color-surface-text)',
              cursor: disabled || !editor?.can().redo() ? 'not-allowed' : 'pointer',
              opacity: editor?.can().redo() ? 1 : 0.5,
            }}
          >
            ↻
          </button>
        )}
      </div>

      {/* Table Context Controls (Appears when cursor is inside a table) */}
      {isTableActive && !disabled && (
        <div
          data-testid="table-controls"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            backgroundColor: 'var(--ant-color-neutral-100)',
            borderBottom: '1px solid var(--ant-color-surface-border)',
            fontSize: '12px',
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--ant-color-neutral-600)', marginRight: '4px' }}>
            Table:
          </span>
          <button
            type="button"
            aria-label="Add row to table"
            title="Add row to table"
            onClick={() => editor?.chain().focus().addRowAfter().run()}
            style={{
              padding: '2px 6px',
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid var(--ant-color-surface-border)',
              backgroundColor: 'var(--ant-color-neutral-0)',
              cursor: 'pointer',
            }}
          >
            + Row
          </button>
          <button
            type="button"
            aria-label="Delete row from table"
            title="Delete row from table"
            onClick={() => editor?.chain().focus().deleteRow().run()}
            style={{
              padding: '2px 6px',
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid var(--ant-color-surface-border)',
              backgroundColor: 'var(--ant-color-neutral-0)',
              cursor: 'pointer',
            }}
          >
            - Row
          </button>
          <button
            type="button"
            aria-label="Add column to table"
            title="Add column to table"
            onClick={() => editor?.chain().focus().addColumnAfter().run()}
            style={{
              padding: '2px 6px',
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid var(--ant-color-surface-border)',
              backgroundColor: 'var(--ant-color-neutral-0)',
              cursor: 'pointer',
            }}
          >
            + Col
          </button>
          <button
            type="button"
            aria-label="Delete column from table"
            title="Delete column from table"
            onClick={() => editor?.chain().focus().deleteColumn().run()}
            style={{
              padding: '2px 6px',
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid var(--ant-color-surface-border)',
              backgroundColor: 'var(--ant-color-neutral-0)',
              cursor: 'pointer',
            }}
          >
            - Col
          </button>
          <button
            type="button"
            aria-label="Delete table"
            title="Delete table"
            onClick={() => editor?.chain().focus().deleteTable().run()}
            style={{
              padding: '2px 6px',
              borderRadius: 'var(--ant-radius-sm)',
              border: '1px solid var(--ant-color-semantic-error)',
              backgroundColor: 'var(--ant-color-neutral-0)',
              color: 'var(--ant-color-semantic-error)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Delete Table
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div
        className="ant-rte-container"
        style={{
          minHeight,
          padding: '12px 16px',
          cursor: disabled ? 'not-allowed' : 'text',
          backgroundColor: isDarkTheme ? 'var(--ant-color-neutral-900)' : disabled ? 'var(--ant-color-surface-bg)' : 'transparent',
          fontSize: '14px',
          lineHeight: '1.6',
          color: isDarkTheme ? 'var(--ant-color-neutral-100)' : 'var(--ant-color-surface-text)',
        }}
        onClick={() => {
          if (!editor?.isFocused && !disabled) {
            editor?.chain().focus().run();
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .ant-rich-text-editor[data-theme-dark="true"] [role="toolbar"] button,
        .ant-rich-text-editor[data-theme-dark="true"] [role="toolbar"] select,
        .ant-rich-text-editor[data-theme-dark="true"] [role="toolbar"] input {
          background-color: var(--ant-color-neutral-800) !important;
          color: var(--ant-color-neutral-100) !important;
          border-color: var(--ant-color-neutral-600) !important;
        }

        .ant-rich-text-editor[data-theme-dark="true"] [role="toolbar"] button:focus-visible,
        .ant-rich-text-editor[data-theme-dark="true"] [role="toolbar"] select:focus-visible,
        .ant-rich-text-editor[data-theme-dark="true"] [role="toolbar"] input:focus-visible {
          outline: 2px solid var(--ant-color-brand-primary);
          outline-offset: 2px;
        }

        .ant-rich-text-editor .ProseMirror {
          outline: none;
          min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight};
          background: ${isDarkTheme ? 'var(--ant-color-neutral-900)' : 'transparent'};
          color: ${isDarkTheme ? 'var(--ant-color-neutral-100)' : 'var(--ant-color-surface-text)'};
        }
        .ant-rich-text-editor .ProseMirror p {
          margin: 0.5em 0;
          color: ${isDarkTheme ? 'var(--ant-color-neutral-100)' : 'var(--ant-color-surface-text)'};
        }
        .ant-rich-text-editor .ProseMirror h1 {
          font-size: 1.75em;
          font-weight: 700;
          margin: 0.8em 0 0.4em 0;
          line-height: 1.25;
        }
        .ant-rich-text-editor .ProseMirror h2 {
          font-size: 1.4em;
          font-weight: 600;
          margin: 0.7em 0 0.35em 0;
          line-height: 1.3;
        }
        .ant-rich-text-editor .ProseMirror h3 {
          font-size: 1.15em;
          font-weight: 600;
          margin: 0.6em 0 0.3em 0;
          line-height: 1.4;
        }
        .ant-rich-text-editor .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ant-rich-text-editor .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ant-rich-text-editor .ProseMirror li {
          margin: 0.2em 0;
        }
        .ant-rich-text-editor .ProseMirror blockquote {
          border-left: 3px solid var(--ant-color-brand-primary);
          padding-left: 12px;
          margin: 0.8em 0;
          font-style: italic;
          color: ${isDarkTheme ? 'var(--ant-color-neutral-200)' : 'var(--ant-color-neutral-600)'};
          background-color: ${isDarkTheme ? 'var(--ant-color-neutral-900)' : 'var(--ant-color-surface-bg)'};
          padding: 8px 12px;
          border-radius: 0 var(--ant-radius-sm) var(--ant-radius-sm) 0;
        }
        .ant-rich-text-editor .ProseMirror pre {
          background: var(--ant-color-neutral-900);
          color: var(--ant-color-neutral-50);
          font-family: var(--ant-typography-fontFamily-mono);
          padding: 10px 14px;
          border-radius: var(--ant-radius-sm);
          margin: 0.8em 0;
          overflow-x: auto;
          font-size: 13px;
        }
        .ant-rich-text-editor .ProseMirror pre code {
          background: none;
          color: inherit;
          font-size: inherit;
          padding: 0;
        }
        .ant-rich-text-editor .ProseMirror img.ant-rte-image {
          max-width: 100%;
          height: auto;
          border-radius: var(--ant-radius-sm);
          margin: 8px 0;
          display: block;
        }
        .ant-rich-text-editor .ProseMirror table.ant-rte-table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 12px 0;
          overflow: hidden;
        }
        .ant-rich-text-editor .ProseMirror table.ant-rte-table td,
        .ant-rich-text-editor .ProseMirror table.ant-rte-table th {
          min-width: 1em;
          border: 1px solid var(--ant-color-surface-border);
          padding: 6px 10px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ant-rich-text-editor .ProseMirror table.ant-rte-table th {
          font-weight: 600;
          text-align: left;
          background-color: var(--ant-color-neutral-100);
        }
        .ant-rich-text-editor .ProseMirror table.ant-rte-table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: var(--ant-color-brand-primary-lt);
          opacity: 0.35;
          pointer-events: none;
        }
        .ant-rich-text-editor .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--ant-color-neutral-400);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

