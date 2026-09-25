import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
} from "react";
import { clsx } from "clsx";
import { Button } from "../../feedback/Button";
import { useTheme } from "../../../hooks/useTheme";
import { FilePreviewItem, formatBytes } from "./FilePreviewItem";
import type {
  FileUploaderProps,
  UploadFile,
} from "./types";

export function FileUploader({
  value,
  defaultValue = [],
  onChange,
  onUpload,
  onRemove,
  onSuccess,
  onError,
  accept,
  maxSize,
  minSize,
  maxFiles,
  multiple = true,
  disabled = false,
  autoUpload = false,
  showPreviewList = true,
  previewLayout = "list",
  variant = "default",
  title,
  description,
  dropzoneText,
  dropzoneHint,
  browseButtonText = "Browse Files",
  enablePaste = true,
  validate,
  customDropzone,
  customFileItem,
  className,
  theme: propTheme,
}: FileUploaderProps) {
  // Theme context resolution
  const themeContext = useTheme();
  const activeTheme = propTheme ?? themeContext.theme ?? "light";

  // File list state (controlled vs uncontrolled)
  const [internalFiles, setInternalFiles] = useState<UploadFile[]>(defaultValue);
  const files = value !== undefined ? value : internalFiles;

  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  // Update internal files helper
  const updateFiles = useCallback(
    (updater: (prev: UploadFile[]) => UploadFile[]) => {
      const next = updater(files);
      if (value === undefined) {
        setInternalFiles(next);
      }
      onChange?.(next);
      return next;
    },
    [files, onChange, value]
  );

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.previewUrl) {
          URL.revokeObjectURL(f.previewUrl);
        }
      });
    };
  }, [files]);

  // Open file selector
  const openFileDialog = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  // ── Validation Engine ───────────────────────────────────────────────────────
  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File size exceeds ${formatBytes(maxSize)}`;
      }
      if (minSize && file.size < minSize) {
        return `File size is smaller than ${formatBytes(minSize)}`;
      }

      if (accept) {
        const acceptList = Array.isArray(accept)
          ? accept
          : accept.split(",").map((s) => s.trim());

        const fileExt = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
        const fileMime = file.type.toLowerCase();

        const isAccepted = acceptList.some((rule) => {
          const lowerRule = rule.toLowerCase();
          if (lowerRule.startsWith(".")) {
            return lowerRule === fileExt;
          }
          if (lowerRule.endsWith("/*")) {
            const prefix = lowerRule.replace("/*", "");
            return fileMime.startsWith(prefix);
          }
          return fileMime === lowerRule;
        });

        if (!isAccepted) {
          return `Invalid file type (${fileExt || fileMime})`;
        }
      }

      if (validate) {
        const customResult = validate(file);
        if (typeof customResult === "string") return customResult;
        if (customResult === false) return "File validation failed";
      }

      return null;
    },
    [accept, maxSize, minSize, validate]
  );

  // ── Upload Execution Orchestrator ──────────────────────────────────────────
  const startUpload = useCallback(
    async (fileToUpload: UploadFile) => {
      if (!onUpload) return;

      // Update state to uploading
      updateFiles((prev) =>
        prev.map((f) =>
          f.id === fileToUpload.id
            ? { ...f, status: "uploading", progress: 0, error: undefined }
            : f
        )
      );

      try {
        const updateProgress = (pct: number) => {
          updateFiles((prev) =>
            prev.map((f) =>
              f.id === fileToUpload.id
                ? { ...f, progress: Math.min(100, Math.max(0, Math.round(pct))) }
                : f
            )
          );
        };

        const result = await onUpload(fileToUpload, updateProgress);

        updateFiles((prev) =>
          prev.map((f) =>
            f.id === fileToUpload.id
              ? { ...f, status: "success", progress: 100, response: result }
              : f
          )
        );

        onSuccess?.(fileToUpload, result);
      } catch (err: any) {
        const errorMsg = err?.message || "Upload failed";
        updateFiles((prev) =>
          prev.map((f) =>
            f.id === fileToUpload.id
              ? { ...f, status: "error", error: errorMsg }
              : f
          )
        );
        onError?.(err instanceof Error ? err : new Error(errorMsg), fileToUpload);
      }
    },
    [onError, onSuccess, onUpload, updateFiles]
  );

  // ── File Ingestion Handler ──────────────────────────────────────────────────
  const processNewFiles = useCallback(
    (rawFiles: FileList | File[]) => {
      const incomingList = Array.from(rawFiles);
      if (incomingList.length === 0) return;

      const currentCount = files.length;
      let filesToProcess = incomingList;

      if (maxFiles && currentCount + incomingList.length > maxFiles) {
        const availableSlots = Math.max(0, maxFiles - currentCount);
        if (availableSlots <= 0) {
          onError?.(new Error(`Maximum of ${maxFiles} files allowed`));
          return;
        }
        filesToProcess = incomingList.slice(0, availableSlots);
        onError?.(new Error(`Only ${availableSlots} file(s) added due to maxFiles limit`));
      }

      if (!multiple) {
        filesToProcess = filesToProcess.slice(0, 1);
      }

      const newUploadFiles: UploadFile[] = filesToProcess.map((file) => {
        const validationError = validateFile(file);
        const isImage = file.type.startsWith("image/");
        const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

        return {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: validationError ? "error" : "idle",
          error: validationError || undefined,
          previewUrl,
        };
      });

      const nextFiles = multiple
        ? [...files, ...newUploadFiles]
        : newUploadFiles;

      updateFiles(() => nextFiles);

      // Auto-upload valid files if enabled
      if (autoUpload && onUpload) {
        newUploadFiles
          .filter((f) => f.status === "idle")
          .forEach((f) => startUpload(f));
      }
    },
    [autoUpload, files, maxFiles, multiple, onError, onUpload, startUpload, updateFiles, validateFile]
  );

  // ── Drag & Drop Handlers ────────────────────────────────────────────────────
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setIsDragging(false);
      dragCounter.current = 0;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processNewFiles(e.dataTransfer.files);
    }
  };

  // ── Clipboard Paste Handler ─────────────────────────────────────────────────
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (disabled || !enablePaste) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
          const f = items[i].getAsFile();
          if (f) pastedFiles.push(f);
        }
      }

      if (pastedFiles.length > 0) {
        processNewFiles(pastedFiles);
      }
    },
    [disabled, enablePaste, processNewFiles]
  );

  // ── Item Actions ────────────────────────────────────────────────────────────
  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = files.find((f) => f.id === fileId);
    if (fileToRemove?.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }
    updateFiles((prev) => prev.filter((f) => f.id !== fileId));
    onRemove?.(fileId);
  };

  const handleRetryFile = (file: UploadFile) => {
    startUpload(file);
  };

  const handleUploadAll = () => {
    const pendingFiles = files.filter((f) => f.status === "idle" || f.status === "error");
    pendingFiles.forEach((f) => startUpload(f));
  };

  const handleClearAll = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    updateFiles(() => []);
  };

  const pendingCount = files.filter((f) => f.status === "idle" || f.status === "error").length;
  const isUploadingAny = files.some((f) => f.status === "uploading");

  // Accept attribute string for native input
  const acceptAttr = Array.isArray(accept) ? accept.join(",") : accept;

  // ── Render Avatar Variant ───────────────────────────────────────────────────
  if (variant === "avatar") {
    const currentAvatar = files[files.length - 1]?.previewUrl;

    return (
      <div
        data-theme={activeTheme}
        className={clsx("relative inline-flex flex-col items-center gap-2", className)}
      >
        <div
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={clsx(
            "group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition duration-200",
            isDragging
              ? "border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-brand-primary-lt)]/30 ring-4 ring-[var(--ant-color-brand-primary)]/20"
              : "border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] hover:border-[var(--ant-color-brand-primary)]",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          {currentAvatar ? (
            <img src={currentAvatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center text-[var(--ant-color-surface-text-sub)]">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}

          {/* Hover overlay with camera icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={acceptAttr}
          disabled={disabled}
          onChange={(e) => e.target.files && processNewFiles(e.target.files)}
          className="hidden"
        />

        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={openFileDialog}
          className="h-7 text-xs"
        >
          {browseButtonText}
        </Button>
      </div>
    );
  }

  // ── Render Compact / Button Variant ─────────────────────────────────────────
  if (variant === "button") {
    return (
      <div
        data-theme={activeTheme}
        className={clsx("inline-flex flex-col gap-3", className)}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple={multiple}
          accept={acceptAttr}
          disabled={disabled}
          onChange={(e) => e.target.files && processNewFiles(e.target.files)}
          className="hidden"
        />

        <Button
          type="button"
          variant="primary"
          disabled={disabled}
          onClick={openFileDialog}
          className="h-9 text-xs font-semibold"
        >
          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {browseButtonText}
        </Button>

        {/* File preview list */}
        {showPreviewList && files.length > 0 && (
          <div className="flex flex-col gap-2">
            {files.map((file) => (
              <FilePreviewItem
                key={file.id}
                file={file}
                onRemove={handleRemoveFile}
                onRetry={handleRetryFile}
                disabled={disabled}
                layout={previewLayout}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Render Default & Compact Dropzone ───────────────────────────────────────
  return (
    <div
      ref={containerRef}
      data-theme={activeTheme}
      onPaste={handlePaste}
      tabIndex={0}
      className={clsx(
        "flex w-full flex-col gap-4 font-sans outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] rounded-2xl",
        className
      )}
    >
      {/* Hidden File Input */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple={multiple}
        accept={acceptAttr}
        disabled={disabled}
        onChange={(e) => e.target.files && processNewFiles(e.target.files)}
        className="hidden"
      />

      {/* Header section */}
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-sm font-bold text-[var(--ant-color-surface-text)] sm:text-base">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-[var(--ant-color-surface-text-sub)]">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Dropzone Container */}
      {customDropzone ? (
        customDropzone({ isDragging, openFileDialog, disabled })
      ) : (
        <div
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openFileDialog();
            }
          }}
          className={clsx(
            "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-200 cursor-pointer",
            variant === "compact" ? "py-4 px-4" : "py-8 px-6",
            isDragging
              ? "border-[var(--ant-color-brand-primary)] bg-[var(--ant-color-brand-primary-lt)]/25 scale-[1.01] shadow-md ring-4 ring-[var(--ant-color-brand-primary)]/15"
              : "border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] hover:border-[var(--ant-color-brand-primary)]/70 hover:bg-[var(--ant-color-surface-bg)]",
            disabled && "cursor-not-allowed opacity-60 hover:border-[var(--ant-color-surface-border)] hover:bg-[var(--ant-color-surface-bg-card)]"
          )}
        >
          {/* Animated Upload Icon */}
          <div
            className={clsx(
              "flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary)] transition-transform duration-200 group-hover:scale-110 shadow-xs",
              variant === "compact" && "h-9 w-9 rounded-xl"
            )}
          >
            <svg
              className={clsx("h-6 w-6", variant === "compact" && "h-5 w-5")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          {/* Primary Text */}
          <div className="mt-3.5 flex flex-col items-center gap-1">
            <p className="text-xs sm:text-sm font-semibold text-[var(--ant-color-surface-text)]">
              {dropzoneText || (
                <>
                  <span className="text-[var(--ant-color-brand-primary)] underline decoration-[var(--ant-color-brand-primary)]/40 underline-offset-2 hover:decoration-[var(--ant-color-brand-primary)]">
                    Click to browse
                  </span>{" "}
                  or drag and drop files here
                </>
              )}
            </p>

            {/* Hint / File types and limits */}
            <p className="text-[11px] text-[var(--ant-color-surface-text-sub)]">
              {dropzoneHint || (
                <>
                  {accept ? `Supports: ${Array.isArray(accept) ? accept.join(", ") : accept}` : "Supports all common formats"}
                  {maxSize ? ` · Max ${formatBytes(maxSize)}` : ""}
                  {maxFiles ? ` · Up to ${maxFiles} files` : ""}
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Action Bar (Upload All, Clear All, Stats) */}
      {files.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--ant-color-surface-bg-card)] px-4 py-2.5 border border-[var(--ant-color-surface-border)] text-xs">
          <div className="flex items-center gap-2 text-[var(--ant-color-surface-text-sub)] font-medium">
            <span className="font-semibold text-[var(--ant-color-surface-text)]">
              {files.length} {files.length === 1 ? "file" : "files"}
            </span>
            <span>·</span>
            <span>
              {formatBytes(files.reduce((acc, f) => acc + f.size, 0))} total
            </span>
            {files.some((f) => f.status === "success") && (
              <>
                <span>·</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {files.filter((f) => f.status === "success").length} uploaded
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!autoUpload && onUpload && pendingCount > 0 && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={disabled || isUploadingAny}
                onClick={handleUploadAll}
                className="h-7 text-xs font-semibold"
              >
                {isUploadingAny ? "Uploading..." : `Upload All (${pendingCount})`}
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || isUploadingAny}
              onClick={handleClearAll}
              className="h-7 text-xs !px-2 text-[var(--ant-color-surface-text-sub)] hover:text-rose-600"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Queued Files Preview List / Grid */}
      {showPreviewList && files.length > 0 && (
        <div
          className={clsx(
            previewLayout === "grid"
              ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-2"
          )}
        >
          {files.map((file) =>
            customFileItem ? (
              customFileItem({
                file,
                onRemove: handleRemoveFile,
                onRetry: handleRetryFile,
                disabled,
                layout: previewLayout,
              })
            ) : (
              <FilePreviewItem
                key={file.id}
                file={file}
                onRemove={handleRemoveFile}
                onRetry={handleRetryFile}
                disabled={disabled}
                layout={previewLayout}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
