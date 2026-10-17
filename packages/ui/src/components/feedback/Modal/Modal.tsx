import React, { useContext, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ThemeContext } from "../../../providers/ThemeProvider";
import { clsx } from "clsx";

// ── Types ────────────────────────────────────────────────────────────────────

export type ModalSize =
  | "small"
  | "medium"
  | "large"
  | "full"
  | "sm"
  | "md"
  | "lg";

export type ModalVariant = "default" | "confirmation";

export interface ModalProps {
  /**
   * Controls whether the modal dialog is open and visible.
   */
  open: boolean;
  /**
   * Callback fired when the dialog requests to close (via close button, Escape key, or overlay click).
   */
  onClose: () => void;
  /**
   * Dialog max-width sizing preset.
   * - `small` / `sm`: 384px (max-w-sm)
   * - `medium` / `md`: 512px (max-w-lg) - Default
   * - `large` / `lg`: 672px (max-w-2xl)
   * - `full`: Near-viewport filling overlay
   * @default "medium"
   */
  size?: ModalSize;
  /**
   * Dialog visual and semantic variant.
   * `confirmation` adds warning/danger icon badge and high-visibility alert treatment.
   * @default "default"
   */
  variant?: ModalVariant;
  /**
   * Accessible headline title for the modal dialog. Rendered inside `Dialog.Title`.
   */
  title?: ReactNode;
  /**
   * Secondary narrative or subtitle text rendered inside `Dialog.Description`.
   */
  description?: ReactNode;
  /**
   * Action buttons rendered in the modal footer (e.g. Cancel and Confirm).
   */
  footer?: ReactNode;
  /**
   * When true, disables closing via Escape key, overlay backdrop click, and hides the close X button.
   * Useful for mandatory workflows or ongoing async operations.
   * @default false
   */
  preventClose?: boolean;
  /**
   * Whether to display the accessible dismiss 'X' button in the top-right header corner.
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Optional custom CSS class name applied to the dialog content card.
   */
  className?: string;
  /**
   * Optional direct color theme override ("light" | "dark").
   * Automatically resolves via `ThemeContext` or DOM `data-theme` when omitted.
   */
  theme?: "light" | "dark";
  /**
   * Main dialog body content.
   */
  children?: ReactNode;
}

// ── Size Mapping ─────────────────────────────────────────────────────────────

const sizeClasses: Record<ModalSize, string> = {
  small: "max-w-sm",
  sm: "max-w-sm",
  medium: "max-w-lg",
  md: "max-w-lg",
  large: "max-w-2xl",
  lg: "max-w-2xl",
  full: "max-w-[calc(100vw-var(--ant-spacing-8))] max-h-[calc(100vh-var(--ant-spacing-8))] h-[calc(100vh-var(--ant-spacing-8))]",
};

// ── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg
      className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ConfirmationAlertIcon() {
  return (
    <div
      className="inline-flex items-center justify-center shrink-0 w-[var(--ant-spacing-10)] h-[var(--ant-spacing-10)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-semantic-error)]/10 text-[var(--ant-color-semantic-error)]"
      aria-hidden="true"
    >
      <svg
        className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    </div>
  );
}

// ── Main Modal Component ────────────────────────────────────────────────────

/**
 * Accessible Modal / Dialog component for Antrosys UI built on Radix UI Dialog primitives.
 *
 * Provides focus trapping, focus restoration, scroll locking, portal rendering,
 * smooth animations, customizable header/body/footer composition, and strict design token styling.
 *
 * @example
 * ```tsx
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Edit Workspace Settings"
 *   description="Update details for your team workspace."
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
 *       <Button variant="primary" onClick={handleSave}>Save Changes</Button>
 *     </>
 *   }
 * >
 *   <p>Modal content goes here...</p>
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onClose,
  size = "medium",
  variant = "default",
  title,
  description,
  footer,
  preventClose = false,
  showCloseButton = true,
  className,
  theme: propTheme,
  children,
}: ModalProps) {
  // Theme resolution: prop override > ThemeContext > DOM data-theme > default light
  const contextTheme = useContext(ThemeContext)?.theme;
  const isDark =
    propTheme === "dark" ||
    (propTheme !== "light" &&
      (contextTheme === "dark" ||
        (typeof document !== "undefined" &&
          document.documentElement.getAttribute("data-theme") === "dark")));

  const resolvedTheme: "light" | "dark" = isDark ? "dark" : "light";

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (!preventClose) {
        onClose();
      }
    }
  };

  const handlePointerDownOutside = (event: Event) => {
    if (preventClose) {
      event.preventDefault();
    }
  };

  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    if (preventClose) {
      event.preventDefault();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Backdrop Overlay */}
        <Dialog.Overlay
          className={clsx(
            "fixed inset-0 z-[var(--ant-zIndex-overlay)]",
            "bg-[var(--ant-color-neutral-900)]/60 backdrop-blur-xs",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "duration-200 transition-opacity motion-reduce:animate-none"
          )}
        />

        {/* Content Positioning Container */}
        <div
          className="fixed inset-0 z-[var(--ant-zIndex-modal)] flex items-center justify-center p-[var(--ant-spacing-4)] sm:p-[var(--ant-spacing-6)] overflow-y-auto pointer-events-none"
          data-theme={resolvedTheme}
        >
          <Dialog.Content
            onPointerDownOutside={handlePointerDownOutside}
            onEscapeKeyDown={handleEscapeKeyDown}
            className={clsx(
              "pointer-events-auto relative w-full flex flex-col",
              sizeClasses[size],
              "rounded-[var(--ant-radius-2xl)]",
              "border",
              isDark
                ? "bg-[var(--ant-color-neutral-900)] border-[var(--ant-color-neutral-700)] text-[var(--ant-color-neutral-0)]"
                : "bg-[var(--ant-color-surface-bg-card)] border-[var(--ant-color-surface-border)] text-[var(--ant-color-surface-text)]",
              "shadow-[var(--ant-shadow-xl)]",
              "font-[var(--ant-typography-fontFamily-sans)]",
              "max-h-[min(calc(100vh-var(--ant-spacing-8)),850px)]",
              "overflow-hidden",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "duration-200 ease-out transition-all motion-reduce:animate-none",
              "focus-visible:outline-none",
              className
            )}
          >
            {/* Header Section */}
            {(title || description || (showCloseButton && !preventClose)) && (
              <div
                className={clsx(
                  "flex items-start justify-between gap-[var(--ant-spacing-4)]",
                  "p-[var(--ant-spacing-6)] pb-[var(--ant-spacing-4)]",
                  "border-b",
                  isDark
                    ? "border-[var(--ant-color-neutral-800)]"
                    : "border-[var(--ant-color-neutral-100)]"
                )}
              >
                <div className="flex items-start gap-[var(--ant-spacing-3)] flex-1 min-w-0">
                  {variant === "confirmation" && <ConfirmationAlertIcon />}
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    {title && (
                      <Dialog.Title
                        className={clsx(
                          "text-[var(--ant-typography-fontSize-lg)] font-[var(--ant-typography-fontWeight-semibold)]",
                          "leading-tight tracking-tight",
                          isDark
                            ? "text-[var(--ant-color-neutral-0)]"
                            : "text-[var(--ant-color-surface-text)]"
                        )}
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description
                        className={clsx(
                          "text-[var(--ant-typography-fontSize-sm)] font-[var(--ant-typography-fontWeight-normal)]",
                          "leading-relaxed",
                          isDark
                            ? "text-[var(--ant-color-neutral-400)]"
                            : "text-[var(--ant-color-surface-text-sub)]"
                        )}
                      >
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                </div>

                {/* Accessible Close Button */}
                {showCloseButton && !preventClose && (
                  <Dialog.Close
                    asChild
                    onClick={onClose}
                  >
                    <button
                      type="button"
                      aria-label="Close dialog"
                      className={clsx(
                        "inline-flex items-center justify-center shrink-0",
                        "w-8 h-8 rounded-[var(--ant-radius-full)]",
                        "transition-colors cursor-pointer",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)]",
                        isDark
                          ? "text-[var(--ant-color-neutral-400)] hover:text-[var(--ant-color-neutral-0)] hover:bg-[var(--ant-color-neutral-800)]"
                          : "text-[var(--ant-color-neutral-500)] hover:text-[var(--ant-color-neutral-900)] hover:bg-[var(--ant-color-neutral-100)]"
                      )}
                    >
                      <CloseIcon />
                    </button>
                  </Dialog.Close>
                )}
              </div>
            )}

            {/* Body Section (Auto-scrollable if content overflows) */}
            {children && (
              <div
                className={clsx(
                  "flex-1 overflow-y-auto p-[var(--ant-spacing-6)]",
                  "text-[var(--ant-typography-fontSize-base)] leading-relaxed",
                  isDark
                    ? "text-[var(--ant-color-neutral-200)]"
                    : "text-[var(--ant-color-surface-text)]"
                )}
              >
                {children}
              </div>
            )}

            {/* Footer Section */}
            {footer && (
              <div
                className={clsx(
                  "flex items-center justify-end gap-[var(--ant-spacing-3)]",
                  "p-[var(--ant-spacing-6)] pt-[var(--ant-spacing-4)]",
                  "border-t",
                  isDark
                    ? "border-[var(--ant-color-neutral-800)] bg-[var(--ant-color-neutral-900)]/50"
                    : "border-[var(--ant-color-neutral-100)] bg-[var(--ant-color-neutral-50)]/50"
                )}
              >
                {footer}
              </div>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
