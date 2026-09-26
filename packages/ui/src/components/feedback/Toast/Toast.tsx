import React, { useContext, ReactNode } from "react";
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
  type ExternalToast,
} from "sonner";
import { ThemeContext } from "../../../providers/ThemeProvider";
import { clsx } from "clsx";

// ── Types ────────────────────────────────────────────────────────────────────

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastAction {
  /** Accessible label or content displayed on the action button */
  label: ReactNode;
  /** Event handler triggered when the action button is pressed */
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** Optional custom inline CSS properties for the action button */
  actionButtonStyle?: React.CSSProperties;
}

export interface ToastOptions {
  /** Unique toast identifier (used for updating or dismissing programmatically) */
  id?: string | number;
  /** Secondary narrative or explanatory text rendered below the title */
  description?: ReactNode;
  /** Auto-dismiss duration in milliseconds. Use Infinity for persistent notifications */
  duration?: number;
  /** Interactive action button configuration */
  action?: ToastAction;
  /** Interactive cancel button configuration */
  cancel?: ToastAction;
  /** Custom leading icon element */
  icon?: ReactNode;
  /** Explicit toggle for displaying the dismiss close button */
  closeButton?: boolean;
  /** Whether the toast can be dismissed by swiping or close interaction */
  dismissible?: boolean;
  /** Callback fired immediately when toast dismissal completes */
  onDismiss?: (toast: unknown) => void;
  /** Callback fired when auto-dismiss duration completes */
  onAutoClose?: (toast: unknown) => void;
  /** Optional CSS class name added to the toast card */
  className?: string;
  /** Optional inline CSS style properties for the toast card */
  style?: React.CSSProperties;
  /** Target toaster ID when multiple toaster instances are mounted */
  toasterId?: string;
}

export interface PromiseData<T = unknown> {
  /** Title or content displayed while the promise is pending */
  loading?: ReactNode;
  /** Title, content, or dynamic callback rendered upon promise resolution */
  success?: ReactNode | ((data: T) => ReactNode);
  /** Title, content, or dynamic error callback rendered upon promise rejection */
  error?: ReactNode | ((error: unknown) => ReactNode);
  /** Secondary description rendered during the promise lifecycle */
  description?: ReactNode | ((data: T) => ReactNode);
  /** Optional lifecycle cleanup callback executed when settled */
  finally?: () => void | Promise<void>;
}

export interface ToastProps {
  /**
   * Screen anchor position for the notification stack.
   * @default "bottom-right"
   */
  position?: ToastPosition;
  /**
   * Global auto-dismiss duration in milliseconds.
   * @default 4000
   */
  duration?: number;
  /**
   * Maximum number of notifications visible simultaneously before queuing/stacking.
   * @default 3
   */
  maxVisible?: number;
  /**
   * Whether auto-dismiss countdown timer pauses while cursor hovers over a toast.
   * @default true
   */
  pauseOnHover?: boolean;
  /**
   * Whether to render an accessible close dismiss button on toasts.
   * @default true
   */
  closeButton?: boolean;
  /**
   * Whether hovering any toast expands the stack to reveal all notifications.
   * @default false
   */
  expand?: boolean;
  /**
   * Whether to enable rich saturated semantic background styling.
   * @default false
   */
  richColors?: boolean;
  /**
   * Color theme override ('light' | 'dark' | 'system').
   * Resolves automatically via ThemeContext or DOM data-theme when omitted.
   */
  theme?: "light" | "dark" | "system";
  /**
   * Offset distance from viewport edges (pixels or CSS unit string).
   * @default "24px"
   */
  offset?: string | number;
  /**
   * Spacing gap between stacked toasts in pixels.
   * @default 12
   */
  gap?: number;
  /** Custom CSS class name for the root toaster container */
  className?: string;
  /** Custom inline CSS styles for the root toaster container */
  style?: React.CSSProperties;
  /** Accessible landmark label for the toast container region */
  containerAriaLabel?: string;
  /** Keyboard shortcut combination to focus active toast region */
  hotkey?: string[];
}

export type ToasterProps = ToastProps;

// ── Accessible SVG Icons ─────────────────────────────────────────────────────

function SuccessIcon() {
  return (
    <svg
      className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] text-[var(--ant-color-semantic-success)] shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] text-[var(--ant-color-semantic-error)] shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] text-[var(--ant-color-semantic-warning)] shrink-0"
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
  );
}

function InfoIcon() {
  return (
    <svg
      className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] text-[var(--ant-color-semantic-info)] shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] animate-spin text-[var(--ant-color-brand-primary)] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="w-[var(--ant-spacing-3)] h-[var(--ant-spacing-3)] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// ── Global Toast Manager Component ──────────────────────────────────────────

/**
 * Toast / Notification System Manager for Antrosys UI.
 *
 * Mount this component once at the root of your application (or within a page layout)
 * to render and manage global notifications triggered via `toast`.
 *
 * Fully respects Antrosys design tokens, light/dark themes, and accessibility requirements.
 */
export function Toast({
  position = "bottom-right",
  duration = 4000,
  maxVisible = 3,
  pauseOnHover: _pauseOnHover = true,
  closeButton = true,
  expand = false,
  richColors = false,
  theme: propTheme,
  offset = "24px",
  gap = 12,
  className,
  style,
  containerAriaLabel = "Notifications",
  hotkey = ["altKey", "KeyT"],
}: ToastProps) {
  // Theme resolution: prop override > ThemeContext > DOM data-theme > default light
  const contextTheme = useContext(ThemeContext)?.theme;
  const isDark =
    propTheme === "dark" ||
    (propTheme !== "light" &&
      (contextTheme === "dark" ||
        (typeof document !== "undefined" &&
          document.documentElement.getAttribute("data-theme") === "dark")));

  const resolvedTheme: "light" | "dark" = isDark ? "dark" : "light";

  const tokenThemeStyles = isDark
    ? {
        "--normal-bg": "var(--ant-color-neutral-900)",
        "--normal-border": "var(--ant-color-neutral-700)",
        "--normal-text": "var(--ant-color-neutral-0)",
        "--success-bg": "var(--ant-color-neutral-900)",
        "--success-border": "var(--ant-color-neutral-700)",
        "--success-text": "var(--ant-color-neutral-0)",
        "--error-bg": "var(--ant-color-neutral-900)",
        "--error-border": "var(--ant-color-neutral-700)",
        "--error-text": "var(--ant-color-neutral-0)",
        "--warning-bg": "var(--ant-color-neutral-900)",
        "--warning-border": "var(--ant-color-neutral-700)",
        "--warning-text": "var(--ant-color-neutral-0)",
        "--info-bg": "var(--ant-color-neutral-900)",
        "--info-border": "var(--ant-color-neutral-700)",
        "--info-text": "var(--ant-color-neutral-0)",
        fontFamily: "var(--ant-typography-fontFamily-sans)",
        borderRadius: "var(--ant-radius-lg)",
        boxShadow: "var(--ant-shadow-lg)",
        zIndex: "var(--ant-zIndex-toast)",
        ...style,
      }
    : {
        "--normal-bg": "var(--ant-color-neutral-0)",
        "--normal-border": "var(--ant-color-neutral-200)",
        "--normal-text": "var(--ant-color-neutral-900)",
        "--success-bg": "var(--ant-color-neutral-0)",
        "--success-border": "var(--ant-color-neutral-200)",
        "--success-text": "var(--ant-color-neutral-900)",
        "--error-bg": "var(--ant-color-neutral-0)",
        "--error-border": "var(--ant-color-neutral-200)",
        "--error-text": "var(--ant-color-neutral-900)",
        "--warning-bg": "var(--ant-color-neutral-0)",
        "--warning-border": "var(--ant-color-neutral-200)",
        "--warning-text": "var(--ant-color-neutral-900)",
        "--info-bg": "var(--ant-color-neutral-0)",
        "--info-border": "var(--ant-color-neutral-200)",
        "--info-text": "var(--ant-color-neutral-900)",
        fontFamily: "var(--ant-typography-fontFamily-sans)",
        borderRadius: "var(--ant-radius-lg)",
        boxShadow: "var(--ant-shadow-lg)",
        zIndex: "var(--ant-zIndex-toast)",
        ...style,
      };

  return (
    <SonnerToaster
      position={position}
      duration={duration}
      visibleToasts={maxVisible}
      closeButton={closeButton}
      expand={expand}
      richColors={richColors}
      theme={resolvedTheme}
      offset={offset}
      gap={gap}
      className={clsx("antrosys-toast-manager", className)}
      style={tokenThemeStyles as React.CSSProperties}
      containerAriaLabel={containerAriaLabel}
      hotkey={hotkey}
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />,
        info: <InfoIcon />,
        loading: <LoadingIcon />,
        close: <CloseIcon />,
      }}
      toastOptions={{
        classNames: {
          toast: clsx(
            "group antrosys-toast",
            "!font-[var(--ant-typography-fontFamily-sans)]",
            "!rounded-[var(--ant-radius-lg)]",
            "!shadow-[var(--ant-shadow-lg)]",
            "!p-[var(--ant-spacing-4)]",
            "!border",
            isDark
              ? "!border-[var(--ant-color-neutral-700)] !bg-[var(--ant-color-neutral-900)] !text-[var(--ant-color-neutral-0)]"
              : "!border-[var(--ant-color-surface-border)] !bg-[var(--ant-color-surface-bg-card)] !text-[var(--ant-color-surface-text)]"
          ),
          title: clsx(
            "!font-[var(--ant-typography-fontFamily-sans)]",
            "!text-[var(--ant-typography-fontSize-sm)]",
            "!font-[var(--ant-typography-fontWeight-medium)]",
            "leading-snug"
          ),
          description: clsx(
            "!font-[var(--ant-typography-fontFamily-sans)]",
            "!text-[var(--ant-typography-fontSize-xs)]",
            "leading-relaxed",
            isDark
              ? "!text-[var(--ant-color-neutral-400)]"
              : "!text-[var(--ant-color-neutral-500)]"
          ),
          actionButton: clsx(
            "!inline-flex !items-center !justify-center",
            "!font-[var(--ant-typography-fontFamily-sans)]",
            "!text-[var(--ant-typography-fontSize-xs)]",
            "!font-[var(--ant-typography-fontWeight-medium)]",
            "!h-7 !px-3",
            "!rounded-[var(--ant-radius-md)]",
            "!bg-[var(--ant-color-brand-primary)] !text-white",
            "hover:!bg-[var(--ant-color-brand-primary-dk)]",
            "focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[var(--ant-color-brand-primary)] focus-visible:!ring-offset-2",
            "transition-all cursor-pointer"
          ),
          cancelButton: clsx(
            "!inline-flex !items-center !justify-center",
            "!font-[var(--ant-typography-fontFamily-sans)]",
            "!text-[var(--ant-typography-fontSize-xs)]",
            "!font-[var(--ant-typography-fontWeight-medium)]",
            "!h-7 !px-3",
            "!rounded-[var(--ant-radius-md)]",
            "!border",
            isDark
              ? "!border-[var(--ant-color-neutral-700)] !text-[var(--ant-color-neutral-0)] hover:!bg-[var(--ant-color-neutral-800)]"
              : "!border-[var(--ant-color-surface-border)] !text-[var(--ant-color-surface-text)] hover:!bg-[var(--ant-color-neutral-100)]",
            "focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[var(--ant-color-brand-primary)] focus-visible:!ring-offset-2",
            "transition-all cursor-pointer"
          ),
          closeButton: clsx(
            "!rounded-[var(--ant-radius-full)]",
            "!border",
            isDark
              ? "!border-[var(--ant-color-neutral-700)] !bg-[var(--ant-color-neutral-900)] !text-[var(--ant-color-neutral-400)] hover:!text-[var(--ant-color-neutral-0)] hover:!bg-[var(--ant-color-neutral-800)]"
              : "!border-[var(--ant-color-surface-border)] !bg-[var(--ant-color-surface-bg-card)] !text-[var(--ant-color-neutral-500)] hover:!text-[var(--ant-color-neutral-900)] hover:!bg-[var(--ant-color-neutral-100)]",
            "focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[var(--ant-color-brand-primary)]",
            "transition-colors cursor-pointer"
          ),
        },
      }}
    />
  );
}

/**
 * Semantic alias for `<Toast />` component.
 */
export const Toaster = Toast;

// ── Imperative Toast Trigger API ─────────────────────────────────────────────

type MessageContent = (() => ReactNode) | ReactNode;

function mapOptions(options?: ToastOptions): ExternalToast | undefined {
  if (!options) return undefined;
  return {
    id: options.id,
    description: options.description as ExternalToast["description"],
    duration: options.duration,
    action: options.action as ExternalToast["action"],
    cancel: options.cancel as ExternalToast["cancel"],
    icon: options.icon,
    closeButton: options.closeButton,
    dismissible: options.dismissible,
    onDismiss: options.onDismiss as ExternalToast["onDismiss"],
    onAutoClose: options.onAutoClose as ExternalToast["onAutoClose"],
    className: options.className,
    style: options.style,
    toasterId: options.toasterId,
  };
}

/**
 * Antrosys Toast dispatch function and variant methods.
 *
 * @example
 * ```tsx
 * toast.success("Profile saved successfully");
 * toast.error("Unable to connect to server");
 * toast.warning("Session expires in 5 minutes");
 * toast.info("New update ready to install");
 *
 * // With action button
 * toast.success("File deleted", {
 *   action: {
 *     label: "Undo",
 *     onClick: () => handleRestoreFile(),
 *   },
 * });
 *
 * // Promise toast
 * toast.promise(saveUserData(), {
 *   loading: "Saving changes...",
 *   success: "Changes saved successfully!",
 *   error: "Failed to save changes.",
 * });
 * ```
 */
export const toast = Object.assign(
  (message: MessageContent, options?: ToastOptions) =>
    sonnerToast(message as Parameters<typeof sonnerToast>[0], mapOptions(options)),
  {
    /** Trigger a success notification */
    success: (message: MessageContent, options?: ToastOptions) =>
      sonnerToast.success(
        message as Parameters<typeof sonnerToast.success>[0],
        mapOptions(options)
      ),

    /** Trigger an error notification */
    error: (message: MessageContent, options?: ToastOptions) =>
      sonnerToast.error(
        message as Parameters<typeof sonnerToast.error>[0],
        mapOptions(options)
      ),

    /** Trigger a warning notification */
    warning: (message: MessageContent, options?: ToastOptions) =>
      sonnerToast.warning(
        message as Parameters<typeof sonnerToast.warning>[0],
        mapOptions(options)
      ),

    /** Trigger an informational notification */
    info: (message: MessageContent, options?: ToastOptions) =>
      sonnerToast.info(
        message as Parameters<typeof sonnerToast.info>[0],
        mapOptions(options)
      ),

    /** Trigger a loading spinner notification */
    loading: (message: MessageContent, options?: ToastOptions) =>
      sonnerToast.loading(
        message as Parameters<typeof sonnerToast.loading>[0],
        mapOptions(options)
      ),

    /** Trigger a standard message notification */
    message: (message: MessageContent, options?: ToastOptions) =>
      sonnerToast.message(
        message as Parameters<typeof sonnerToast.message>[0],
        mapOptions(options)
      ),

    /**
     * Trigger an asynchronous promise notification with loading, success, and error states.
     */
    promise: <T,>(
      promise: Promise<T> | (() => Promise<T>),
      data?: PromiseData<T>
    ) => sonnerToast.promise<T>(promise, data as Parameters<typeof sonnerToast.promise>[1]),

    /** Dismiss a specific toast by ID, or dismiss all active toasts when no ID is provided */
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),

    /** Render a fully custom JSX toast */
    custom: (
      jsx: (id: string | number) => React.ReactElement,
      options?: ToastOptions
    ) => sonnerToast.custom(jsx, mapOptions(options)),
  }
);
