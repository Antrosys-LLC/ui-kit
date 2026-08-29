import React, { useId, useRef, createContext, useContext } from 'react';
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
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Rule 3: Theme Context & Hook for Scoped Dark Mode
// ---------------------------------------------------------------------------
export interface ThemeContextValue {
  theme?: 'light' | 'dark' | string;
  isDark?: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

// ---------------------------------------------------------------------------
// Component Interfaces
// ---------------------------------------------------------------------------
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
  /** Direct theme override prop ('light' | 'dark') */
  theme?: 'light' | 'dark';
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
  theme: propTheme,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const headingSelectId = useId();

  // Rule 3: Direct Context resolution without DOM MutationObserver
  const context = useTheme();
  const activeTheme = propTheme ?? context.theme ?? 'light';
  const isDark = propTheme
    ? propTheme === 'dark'
    : Boolean(context.isDark || activeTheme === 'dark');

  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
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
        const markdownStorage = (
          currentEditor.storage as unknown as {
            markdown?: { getMarkdown: () => string };
          }
        ).markdown;
        const markdownOutput = markdownStorage?.getMarkdown
          ? markdownStorage.getMarkdown()
          : currentEditor.getText();
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
            editor
              .chain()
              .focus()
              .setImage({ src: reader.result, alt: file.name })
              .run();
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
      data-theme={activeTheme}
      className={cn(
        // Rule 1: Tailwind utility classes + design token mapping
        'ant-rich-text-editor relative w-full overflow-hidden border shadow-sm transition-colors',
        'font-[var(--ant-typography-fontFamily-sans,sans-serif)]',
        
        // Light & Dark Frame Tokens
        !isDark && [
          'border-[var(--ant-color-surface-border,#cbd5e1)]',
          'bg-[var(--ant-color-surface-base,#ffffff)]',
          'text-[var(--ant-color-surface-text,#0f172a)]',
        ],
        isDark && 'border-neutral-700 bg-neutral-900 text-neutral-100',

        // Rule 2: Pure Tailwind Arbitrary Variants replacing raw <style> block
        '[&_.ProseMirror]:outline-none',
        '[&_.ProseMirror]:p-3',
        '[&_.ProseMirror:focus-visible]:ring-2 [&_.ProseMirror:focus-visible]:ring-[var(--ant-color-brand-primary,#2563eb)]',
        '[&_.ProseMirror_p]:my-2',
        '[&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:my-3',
        '[&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:my-2.5',
        '[&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:my-2',
        '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2',
        '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-2',
        '[&_.ProseMirror_li]:my-0.5',
        '[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-[var(--ant-color-brand-primary,#2563eb)]',
        '[&_.ProseMirror_blockquote]:my-3 [&_.ProseMirror_blockquote]:p-3 [&_.ProseMirror_blockquote]:italic',
        !isDark && [
          '[&_.ProseMirror_blockquote]:bg-[var(--ant-color-surface-bg,#f8fafc)]',
          '[&_.ProseMirror_blockquote]:text-[var(--ant-color-neutral-600,#475569)]',
        ],
        isDark && [
          '[&_.ProseMirror_blockquote]:bg-neutral-800/60',
          '[&_.ProseMirror_blockquote]:text-neutral-300',
        ],
        '[&_.ProseMirror_pre]:bg-neutral-950 [&_.ProseMirror_pre]:text-neutral-50 [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_pre]:my-3 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:font-mono [&_.ProseMirror_pre]:text-xs',
        '[&_.ProseMirror_img.ant-rte-image]:max-w-full [&_.ProseMirror_img.ant-rte-image]:h-auto [&_.ProseMirror_img.ant-rte-image]:my-2 [&_.ProseMirror_img.ant-rte-image]:block',
        '[&_.ProseMirror_table.ant-rte-table]:w-full [&_.ProseMirror_table.ant-rte-table]:border-collapse [&_.ProseMirror_table.ant-rte-table]:table-fixed [&_.ProseMirror_table.ant-rte-table]:my-3',
        '[&_.ProseMirror_table.ant-rte-table_td]:border [&_.ProseMirror_table.ant-rte-table_td]:p-2 [&_.ProseMirror_table.ant-rte-table_td]:align-top',
        '[&_.ProseMirror_table.ant-rte-table_th]:border [&_.ProseMirror_table.ant-rte-table_th]:p-2 [&_.ProseMirror_table.ant-rte-table_th]:font-semibold [&_.ProseMirror_table.ant-rte-table_th]:text-left',
        !isDark && [
          '[&_.ProseMirror_table.ant-rte-table_td]:border-[var(--ant-color-surface-border,#cbd5e1)]',
          '[&_.ProseMirror_table.ant-rte-table_th]:border-[var(--ant-color-surface-border,#cbd5e1)]',
          '[&_.ProseMirror_table.ant-rte-table_th]:bg-[var(--ant-color-neutral-100,#f1f5f9)]',
        ],
        isDark && [
          '[&_.ProseMirror_table.ant-rte-table_td]:border-neutral-700',
          '[&_.ProseMirror_table.ant-rte-table_th]:border-neutral-700',
          '[&_.ProseMirror_table.ant-rte-table_th]:bg-neutral-800',
        ],
        '[&_.ProseMirror_table.ant-rte-table_.selectedCell:after]:bg-[var(--ant-color-brand-primary-lt,#dbeafe)] [&_.ProseMirror_table.ant-rte-table_.selectedCell:after]:opacity-35',
        '[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[var(--ant-color-neutral-400,#94a3b8)]',
        '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
        '[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
        '[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
        '[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
        className
      )}
    >
      {/* Collaborative Banner */}
      {collaborative && (
        <div
          data-testid="collaborative-banner"
          className={cn(
            'flex items-center justify-between gap-2 border-b px-3 py-2 text-xs font-medium',
            !isDark && 'border-[var(--ant-color-surface-border,#cbd5e1)] bg-blue-50 text-blue-700',
            isDark && 'border-neutral-700 bg-blue-950/40 text-blue-300'
          )}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.3)]" />
            <span>Collaborative Mode Active (Yjs Enabled)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              U1
            </span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
              U2
            </span>
          </div>
        </div>
      )}

      {/* Editor Toolbar */}
      <div
        role="toolbar"
        aria-label="Editor formatting toolbar"
        className={cn(
          'flex flex-wrap items-center gap-1 border-b px-2.5 py-2',
          !isDark && 'border-[var(--ant-color-surface-border,#cbd5e1)] bg-[var(--ant-color-surface-bg,#f8fafc)]',
          isDark && 'border-neutral-700 bg-neutral-800'
        )}
      >
        {/* Heading Dropdown */}
        {toolbar.includes('heading') && (
          <div className="mr-1 flex items-center gap-1.5">
            <label
              htmlFor={headingSelectId}
              id={`${headingSelectId}-label`}
              className={cn(
                'text-xs font-semibold',
                !isDark ? 'text-[var(--ant-color-surface-text,#0f172a)]' : 'text-neutral-300'
              )}
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
              className={cn(
                'border px-2 py-1 text-xs font-medium outline-none transition-colors disabled:cursor-not-allowed',
                !isDark && [
                  'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-900',
                  'hover:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500',
                ],
                isDark && [
                  'border-neutral-600 bg-neutral-900 text-neutral-100',
                  'hover:border-neutral-500 focus-visible:ring-2 focus-visible:ring-blue-500',
                ]
              )}
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
          </div>
        )}

        {/* Toolbar Buttons */}
        {toolbar.includes('bold') && (
          <button
            type="button"
            aria-label="Toggle bold"
            aria-pressed={editor?.isActive('bold')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
            className={cn(
              'border px-2 py-1 text-xs font-bold transition-all disabled:cursor-not-allowed',
              editor?.isActive('bold')
                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-400'
                : cn(
                    'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-700 hover:bg-neutral-50',
                    isDark && 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                  )
            )}
          >
            B
          </button>
        )}

        {toolbar.includes('italic') && (
          <button
            type="button"
            aria-label="Toggle italic"
            aria-pressed={editor?.isActive('italic')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
            className={cn(
              'border px-2 py-1 font-serif text-xs font-semibold italic transition-all disabled:cursor-not-allowed',
              editor?.isActive('italic')
                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-400'
                : cn(
                    'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-700 hover:bg-neutral-50',
                    isDark && 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                  )
            )}
          >
            I
          </button>
        )}

        {toolbar.includes('bulletList') && (
          <button
            type="button"
            aria-label="Toggle bullet list"
            aria-pressed={editor?.isActive('bulletList')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            title="Bullet List"
            className={cn(
              'border px-2 py-1 text-xs font-medium transition-all disabled:cursor-not-allowed',
              editor?.isActive('bulletList')
                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-400'
                : cn(
                    'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-700 hover:bg-neutral-50',
                    isDark && 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                  )
            )}
          >
            • List
          </button>
        )}

        {toolbar.includes('orderedList') && (
          <button
            type="button"
            aria-label="Toggle numbered list"
            aria-pressed={editor?.isActive('orderedList')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
            className={cn(
              'border px-2 py-1 text-xs font-medium transition-all disabled:cursor-not-allowed',
              editor?.isActive('orderedList')
                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-400'
                : cn(
                    'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-700 hover:bg-neutral-50',
                    isDark && 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                  )
            )}
          >
            1. List
          </button>
        )}

        {toolbar.includes('blockquote') && (
          <button
            type="button"
            aria-label="Toggle blockquote"
            aria-pressed={editor?.isActive('blockquote')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
            className={cn(
              'border px-2 py-1 text-xs font-medium transition-all disabled:cursor-not-allowed',
              editor?.isActive('blockquote')
                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-400'
                : cn(
                    'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-700 hover:bg-neutral-50',
                    isDark && 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                  )
            )}
          >
            “ Quote
          </button>
        )}

        {toolbar.includes('codeBlock') && (
          <button
            type="button"
            aria-label="Toggle code block"
            aria-pressed={editor?.isActive('codeBlock')}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
            className={cn(
              'border px-2 py-1 font-mono text-xs font-semibold transition-all disabled:cursor-not-allowed',
              editor?.isActive('codeBlock')
                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-400'
                : cn(
                    'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-700 hover:bg-neutral-50',
                    isDark && 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                  )
            )}
          >
            &lt;/&gt;
          </button>
        )}

        {toolbar.includes('image') && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Select image file"
              title="Select image file"
              className="hidden"
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
              className={cn(
                'border px-2 py-1 text-xs font-medium transition-all disabled:cursor-not-allowed',
                !isDark && 'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-700 hover:bg-neutral-50',
                isDark && 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
              )}
            >
              Image
            </button>
          </>
        )}

        {toolbar.includes('table') && (
          <button
            type="button"
            aria-label="Insert 3x3 table"
            aria-pressed={isTableActive}
            disabled={disabled || !editor}
            onClick={handleInsertTable}
            title="Insert Table"
            className={cn(
              'border px-2 py-1 text-xs font-medium transition-all disabled:cursor-not-allowed',
              isTableActive
                ? 'border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-400'
                : cn(
                    'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-700 hover:bg-neutral-50',
                    isDark && 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                  )
            )}
          >
            ⊞ Table
          </button>
        )}

        {toolbar.includes('undo') && (
          <button
            type="button"
            aria-label="Undo"
            disabled={disabled || !editor || !editor.can().undo()}
            onClick={() => editor?.chain().focus().undo().run()}
            title="Undo (Ctrl+Z)"
            className={cn(
              'border px-2 py-1 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-40',
              !isDark && 'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-700 hover:bg-neutral-50',
              isDark && 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
            )}
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
            className={cn(
              'border px-2 py-1 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-40',
              !isDark && 'border-[var(--ant-color-surface-border,#cbd5e1)] bg-white text-neutral-700 hover:bg-neutral-50',
              isDark && 'border-neutral-600 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
            )}
          >
            ↻
          </button>
        )}
      </div>

      {/* Table Context Controls */}
      {isTableActive && !disabled && (
        <div
          data-testid="table-controls"
          className={cn(
            'flex flex-wrap items-center gap-1.5 border-b px-2.5 py-1 text-xs',
            !isDark && 'border-[var(--ant-color-surface-border,#cbd5e1)] bg-[var(--ant-color-neutral-100,#f1f5f9)]',
            isDark && 'border-neutral-700 bg-neutral-800/80 text-neutral-200'
          )}
        >
          <span className="mr-1 font-semibold text-neutral-500 dark:text-neutral-400">
            Table:
          </span>
          <button
            type="button"
            onClick={() => editor?.chain().focus().addRowAfter().run()}
            className="border border-neutral-300 bg-white px-1.5 py-0.5 text-xs hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
          >
            + Row
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().deleteRow().run()}
            className="border border-neutral-300 bg-white px-1.5 py-0.5 text-xs hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
          >
            - Row
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().addColumnAfter().run()}
            className="border border-neutral-300 bg-white px-1.5 py-0.5 text-xs hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
          >
            + Col
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().deleteColumn().run()}
            className="border border-neutral-300 bg-white px-1.5 py-0.5 text-xs hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
          >
            - Col
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().deleteTable().run()}
            className="border border-rose-300 bg-rose-50 px-1.5 py-0.5 text-xs font-medium text-rose-600 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
          >
            Delete Table
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div
        className={cn(
          'ant-rte-container w-full p-3 text-sm leading-relaxed transition-colors',
          disabled ? 'cursor-not-allowed opacity-75' : 'cursor-text',
          !isDark && disabled && 'bg-[var(--ant-color-surface-bg,#f8fafc)]',
          isDark && 'bg-neutral-900 text-neutral-100'
        )}
        style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
        onClick={() => {
          if (!editor?.isFocused && !disabled) {
            editor?.chain().focus().run();
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}