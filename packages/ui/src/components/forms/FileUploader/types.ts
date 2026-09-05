import type { ReactNode } from "react";

export type FileStatus = "idle" | "uploading" | "success" | "error";

export interface UploadFile {
  /** Unique ID generated for the file in queue */
  id: string;
  /** Native File instance */
  file: File;
  /** File name */
  name: string;
  /** Size in bytes */
  size: number;
  /** MIME type string */
  type: string;
  /** Upload progress percentage from 0 to 100 */
  progress: number;
  /** Current upload status */
  status: FileStatus;
  /** Error message if upload failed or file validation failed */
  error?: string;
  /** Object URL for local image/media preview */
  previewUrl?: string;
  /** Remote response data returned after successful upload */
  response?: unknown;
}

export type FileUploaderVariant = "default" | "compact" | "avatar" | "button";

export type FilePreviewLayout = "list" | "grid";

export interface DropzoneRenderProps {
  isDragging: boolean;
  openFileDialog: () => void;
  disabled?: boolean;
}

export interface FilePreviewItemProps {
  file: UploadFile;
  onRemove?: (fileId: string) => void;
  onRetry?: (file: UploadFile) => void;
  onPreview?: (file: UploadFile) => void;
  disabled?: boolean;
  layout?: FilePreviewLayout;
}

export interface FileUploaderProps {
  /** Controlled file list */
  value?: UploadFile[];
  /** Default initial files for uncontrolled state */
  defaultValue?: UploadFile[];
  /** Callback triggered whenever files in the queue change */
  onChange?: (files: UploadFile[]) => void;
  /** Async upload handler per file */
  onUpload?: (file: UploadFile, updateProgress: (progress: number) => void) => Promise<unknown> | void;
  /** Callback fired when a file is removed */
  onRemove?: (fileId: string) => void;
  /** Callback fired when a file upload completes successfully */
  onSuccess?: (file: UploadFile, response: unknown) => void;
  /** Callback fired when an error occurs during validation or upload */
  onError?: (error: Error, file?: UploadFile) => void;
  /** Accepted file types e.g. "image/*", ".pdf,.docx", ["image/png", "image/jpeg"] */
  accept?: string | string[];
  /** Maximum file size in bytes (e.g. 5 * 1024 * 1024 for 5MB) */
  maxSize?: number;
  /** Minimum file size in bytes */
  minSize?: number;
  /** Maximum number of files allowed in the queue */
  maxFiles?: number;
  /** Allow selecting multiple files */
  multiple?: boolean;
  /** Disabled interaction state */
  disabled?: boolean;
  /** Automatically start uploading files as soon as they are added */
  autoUpload?: boolean;
  /** Show the list/grid of queued files below dropzone */
  showPreviewList?: boolean;
  /** Layout for file previews ('list' | 'grid') */
  previewLayout?: FilePreviewLayout;
  /** Display variant for dropzone */
  variant?: FileUploaderVariant;
  /** Title header displayed above dropzone */
  title?: ReactNode;
  /** Description or subtitle text */
  description?: ReactNode;
  /** Primary text inside dropzone */
  dropzoneText?: ReactNode;
  /** Hint text inside dropzone (e.g. "PNG, JPG up to 10MB") */
  dropzoneHint?: ReactNode;
  /** Text on the browse files button */
  browseButtonText?: string;
  /** Enable clipboard paste to upload (Ctrl+V / Cmd+V) */
  enablePaste?: boolean;
  /** Custom validation function returning error message string if invalid */
  validate?: (file: File) => string | boolean | undefined;
  /** Custom render function for the dropzone container */
  customDropzone?: (props: DropzoneRenderProps) => ReactNode;
  /** Custom render function for preview items */
  customFileItem?: (props: FilePreviewItemProps) => ReactNode;
  /** Additional container CSS class */
  className?: string;
  /** Theme override ('light' | 'dark') */
  theme?: "light" | "dark";
}
