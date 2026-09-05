import React, { useState } from "react";
import { clsx } from "clsx";
import type { FilePreviewItemProps } from "./types";

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getFileIcon(type: string, name: string): React.ReactNode {
  const ext = name.split(".").pop()?.toLowerCase() || "";

  if (type.startsWith("image/")) {
    return (
      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }

  if (type === "application/pdf" || ext === "pdf") {
    return (
      <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }

  if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    type.includes("csv") ||
    ["xls", "xlsx", "csv"].includes(ext)
  ) {
    return (
      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }

  if (
    type.includes("word") ||
    type.includes("document") ||
    ["doc", "docx", "txt", "rtf", "md"].includes(ext)
  ) {
    return (
      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }

  if (
    type.includes("zip") ||
    type.includes("compressed") ||
    type.includes("tar") ||
    ["zip", "rar", "7z", "gz", "tar"].includes(ext)
  ) {
    return (
      <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    );
  }

  if (type.startsWith("video/")) {
    return (
      <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  }

  if (type.startsWith("audio/")) {
    return (
      <svg className="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5 text-[var(--ant-color-surface-text-sub)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

export function FilePreviewItem({
  file,
  onRemove,
  onRetry,
  onPreview,
  disabled = false,
  layout = "list",
}: FilePreviewItemProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isImage = file.type.startsWith("image/") && Boolean(file.previewUrl);

  const handlePreviewClick = () => {
    if (onPreview) {
      onPreview(file);
    } else if (isImage) {
      setModalOpen(true);
    }
  };

  if (layout === "grid") {
    return (
      <>
        <div
          className={clsx(
            "group relative flex flex-col justify-between overflow-hidden rounded-xl border p-3 transition duration-200",
            file.status === "error"
              ? "border-rose-300 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20"
              : file.status === "success"
              ? "border-emerald-300 bg-[var(--ant-color-surface-bg-card)] dark:border-emerald-900/60"
              : "border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] hover:border-[var(--ant-color-brand-primary)]/60 hover:shadow-md"
          )}
        >
          {/* Top thumbnail preview */}
          <div
            onClick={handlePreviewClick}
            className={clsx(
              "relative flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-[var(--ant-color-surface-bg)]",
              isImage && "cursor-pointer"
            )}
          >
            {isImage ? (
              <img
                src={file.previewUrl}
                alt={file.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1.5 p-2">
                {getFileIcon(file.type, file.name)}
                <span className="text-[10px] font-semibold text-[var(--ant-color-surface-text-sub)] uppercase">
                  {file.name.split(".").pop() || "file"}
                </span>
              </div>
            )}

            {/* Remove button floating on thumbnail */}
            {!disabled && onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(file.id);
                }}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-xs transition hover:bg-rose-600 group-hover:opacity-100"
                title="Remove file"
              >
                ✕
              </button>
            )}

            {/* Status indicator icon on thumbnail */}
            {file.status === "success" && (
              <div className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] text-white shadow-xs">
                ✓
              </div>
            )}
            {file.status === "error" && (
              <div className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-xs">
                !
              </div>
            )}
          </div>

          {/* Details below thumbnail */}
          <div className="mt-2 flex flex-col gap-1">
            <p className="truncate text-xs font-semibold text-[var(--ant-color-surface-text)]" title={file.name}>
              {file.name}
            </p>
            <div className="flex items-center justify-between text-[11px] text-[var(--ant-color-surface-text-sub)]">
              <span>{formatBytes(file.size)}</span>
              {file.status === "uploading" && (
                <span className="font-semibold text-[var(--ant-color-brand-primary)] animate-pulse">
                  {file.progress}%
                </span>
              )}
            </div>

            {/* Progress bar */}
            {file.status === "uploading" && (
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ant-color-neutral-200)]">
                <div
                  className="h-full bg-[var(--ant-color-brand-primary)] transition-all duration-300 ease-out"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            )}

            {/* Error message & retry */}
            {file.status === "error" && (
              <div className="mt-1 flex items-center justify-between gap-1 text-[11px] text-rose-600 dark:text-rose-400">
                <span className="truncate" title={file.error}>
                  {file.error || "Upload failed"}
                </span>
                {onRetry && (
                  <button
                    type="button"
                    onClick={() => onRetry(file)}
                    className="font-semibold underline hover:text-rose-700"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal for image enlargement */}
        {modalOpen && file.previewUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-fadeIn"
            onClick={() => setModalOpen(false)}
          >
            <div className="relative max-h-[85vh] max-w-[85vw] overflow-hidden rounded-2xl bg-[var(--ant-color-surface-bg-card)] p-2 shadow-2xl">
              <img src={file.previewUrl} alt={file.name} className="max-h-[80vh] w-auto rounded-xl object-contain" />
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Standard List Layout
  return (
    <>
      <div
        className={clsx(
          "group flex items-center justify-between gap-3 rounded-xl border p-3 transition duration-200",
          file.status === "error"
            ? "border-rose-300 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20"
            : file.status === "success"
            ? "border-emerald-300/80 bg-[var(--ant-color-surface-bg-card)] dark:border-emerald-900/60"
            : "border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] hover:border-[var(--ant-color-brand-primary)]/50 hover:shadow-xs"
        )}
      >
        {/* Left: Thumbnail / File Icon */}
        <div
          onClick={handlePreviewClick}
          className={clsx(
            "relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--ant-color-surface-bg)] border border-[var(--ant-color-surface-border)]",
            isImage && "cursor-pointer hover:opacity-90"
          )}
        >
          {isImage ? (
            <img src={file.previewUrl} alt={file.name} className="h-full w-full object-cover" />
          ) : (
            getFileIcon(file.type, file.name)
          )}
        </div>

        {/* Middle: Name, Size, Status & Progress */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className="truncate text-xs font-semibold text-[var(--ant-color-surface-text)]"
              title={file.name}
            >
              {file.name}
            </span>
            <span className="flex-shrink-0 text-[11px] font-medium text-[var(--ant-color-surface-text-sub)]">
              {formatBytes(file.size)}
            </span>
          </div>

          {/* Progress Bar (during upload) */}
          {file.status === "uploading" && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--ant-color-neutral-200)]">
                <div
                  className="h-full bg-[var(--ant-color-brand-primary)] transition-all duration-300 ease-out"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-[var(--ant-color-brand-primary)]">
                {file.progress}%
              </span>
            </div>
          )}

          {/* Success Status */}
          {file.status === "success" && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span>✓ Uploaded successfully</span>
            </div>
          )}

          {/* Error Message */}
          {file.status === "error" && (
            <div className="flex items-center justify-between text-[11px] text-rose-600 dark:text-rose-400">
              <span className="truncate">{file.error || "Upload failed"}</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={() => onRetry(file)}
                  className="ml-2 font-semibold underline hover:text-rose-700"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Action: Preview / Remove Button */}
        <div className="flex items-center gap-1">
          {isImage && (
            <button
              type="button"
              onClick={handlePreviewClick}
              title="Preview image"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--ant-color-surface-text-sub)] hover:bg-[var(--ant-color-neutral-200)]/60 hover:text-[var(--ant-color-surface-text)] transition"
            >
              👁
            </button>
          )}

          {!disabled && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(file.id)}
              title="Remove file"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--ant-color-surface-text-sub)] hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/60 transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Modal for image enlargement */}
      {modalOpen && file.previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-fadeIn"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-h-[85vh] max-w-[85vw] overflow-hidden rounded-2xl bg-[var(--ant-color-surface-bg-card)] p-2 shadow-2xl">
            <img src={file.previewUrl} alt={file.name} className="max-h-[80vh] w-auto rounded-xl object-contain" />
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
