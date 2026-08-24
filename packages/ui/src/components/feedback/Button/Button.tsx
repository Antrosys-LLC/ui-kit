import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize    = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Show a loading spinner and disable interaction */
  loading?: boolean;
  /** Icon rendered before the label */
  iconLeft?: ReactNode;
  /** Icon rendered after the label */
  iconRight?: ReactNode;
  /** Fill the container width */
  fullWidth?: boolean;
  children: ReactNode;
}

const base = [
  "inline-flex items-center justify-center gap-2",
  "font-medium rounded-md transition-all",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "disabled:opacity-50 disabled:pointer-events-none",
].join(" ");

const variants: Record<ButtonVariant, string> = {
  primary:   "bg-[var(--ant-color-brand-primary)] text-white hover:bg-[var(--ant-color-brand-primary-dk)] focus-visible:ring-[var(--ant-color-brand-primary)]",
  secondary: "border border-[var(--ant-color-surface-border)] bg-white text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)]",
  ghost:     "bg-transparent text-[var(--ant-color-brand-primary)] hover:bg-[var(--ant-color-brand-primary-lt)]",
  danger:    "bg-[var(--ant-color-semantic-error)] text-white hover:opacity-90 focus-visible:ring-[var(--ant-color-semantic-error)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

export function Button({
  variant = "primary", size = "md", loading, iconLeft, iconRight,
  fullWidth, className, children, ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}
