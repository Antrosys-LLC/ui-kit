import React, { cloneElement, isValidElement, useRef, useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset as floatingOffset,
  flip,
  shift,
  arrow as floatingArrow,
  useHover,
  useFocus,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingFocusManager,
  FloatingArrow,
  Placement,
} from "@floating-ui/react";
import { clsx } from "clsx";

export type PopoverPlacement = Placement;
export type PopoverTrigger = "click" | "hover" | "focus" | "manual";

export interface PopoverProps {
  /**
   * Popover body content (can include forms, lists, cards, buttons)
   */
  content: React.ReactNode;

  /**
   * Optional header title for the popover card
   */
  title?: React.ReactNode;

  /**
   * Placement relative to the reference element (default: 'bottom')
   */
  placement?: PopoverPlacement;

  /**
   * Interaction trigger mode: `'click'`, `'hover'`, `'focus'`, or `'manual'` (default: `'click'`)
   */
  trigger?: PopoverTrigger;

  /**
   * Open and close delay in milliseconds (e.g. 150 or `{ open: 150, close: 100 }`)
   */
  delay?: number | { open?: number; close?: number };

  /**
   * Show arrow pointer pointing to reference element (default: true)
   */
  arrow?: boolean;

  /**
   * Offset distance in pixels from the reference target (default: 10)
   */
  offset?: number;

  /**
   * Show an 'x' close button in the top right corner (default: false)
   */
  closeButton?: boolean;

  /**
   * Trap focus within popover when open (default: false)
   */
  modal?: boolean;

  /**
   * Controlled open state
   */
  open?: boolean;

  /**
   * Initial open state when uncontrolled
   */
  defaultOpen?: boolean;

  /**
   * Callback fired when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Disable popover
   */
  disabled?: boolean;

  /**
   * Trigger child element (must accept ref and event handlers)
   */
  children: React.ReactNode;

  /**
   * Additional CSS class name for popover card
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Popover - Positioned popup card with collision detection and rich HTML content
 */
export function Popover({
  content,
  title,
  placement = "bottom",
  trigger = "click",
  delay = { open: 150, close: 150 },
  arrow = true,
  offset = 10,
  closeButton = false,
  modal = false,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  className,
  style,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const arrowRef = useRef<SVGSVGElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = disabled ? false : isControlled ? controlledOpen : uncontrolledOpen;

  const setIsOpen = (nextOpen: boolean) => {
    if (disabled) return;
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      floatingOffset(arrow ? offset + 4 : offset),
      flip({ fallbackAxisSideDirection: "start" }),
      shift({ padding: 12 }),
      arrow && floatingArrow({ element: arrowRef }),
    ].filter(Boolean),
  });

  const click = useClick(context, {
    enabled: trigger === "click" && !disabled,
  });

  const hover = useHover(context, {
    enabled: trigger === "hover" && !disabled,
    delay,
    handleClose: undefined,
  });

  const focus = useFocus(context, {
    enabled: (trigger === "hover" || trigger === "focus") && !disabled,
  });

  const dismiss = useDismiss(context, {
    outsidePress: true,
    escapeKey: true,
  });

  const role = useRole(context, { role: "dialog" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    hover,
    focus,
    dismiss,
    role,
  ]);

  const childrenRef = isValidElement(children)
    ? (children as unknown as { ref?: React.Ref<HTMLElement> }).ref
    : undefined;
  const mergedRef = useMergeRefs([refs.setReference, childrenRef]);

  const triggerElement = isValidElement(children) ? (
    cloneElement(
      children,
      getReferenceProps({
        ref: mergedRef,
        ...children.props,
        "aria-expanded": isOpen,
        "aria-haspopup": "dialog",
      })
    )
  ) : (
    <span ref={refs.setReference} {...getReferenceProps()}>
      {children}
    </span>
  );

  return (
    <>
      {triggerElement}
      {isOpen && !disabled && (
        <FloatingPortal>
          {modal ? (
            <FloatingFocusManager context={context} modal={modal}>
              <div
                ref={refs.setFloating}
                style={{ ...floatingStyles, ...style }}
                className={clsx(
                  "z-[9990] w-80 max-w-[calc(100vw-24px)] rounded-xl border border-[var(--ant-color-surface-border)]",
                  "bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-surface-text)] shadow-2xl p-4",
                  "animate-in fade-in zoom-in-95 duration-150 outline-none",
                  className
                )}
                {...getFloatingProps()}
              >
                {(title || closeButton) && (
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--ant-color-surface-border)]">
                    {title && <h4 className="text-sm font-semibold tracking-tight">{title}</h4>}
                    {closeButton && (
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-md text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)] transition-colors ml-auto"
                        aria-label="Close popover"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                <div>{content}</div>
                {arrow && (
                  <FloatingArrow
                    ref={arrowRef}
                    context={context}
                    className="fill-[var(--ant-color-surface-bg-card)] stroke-[var(--ant-color-surface-border)] stroke-[1]"
                    width={14}
                    height={7}
                  />
                )}
              </div>
            </FloatingFocusManager>
          ) : (
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, ...style }}
              className={clsx(
                "z-[9990] w-80 max-w-[calc(100vw-24px)] rounded-xl border border-[var(--ant-color-surface-border)]",
                "bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-surface-text)] shadow-2xl p-4",
                "animate-in fade-in zoom-in-95 duration-150 outline-none",
                className
              )}
              {...getFloatingProps()}
            >
              {(title || closeButton) && (
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--ant-color-surface-border)]">
                  {title && <h4 className="text-sm font-semibold tracking-tight">{title}</h4>}
                  {closeButton && (
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-md text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)] transition-colors ml-auto"
                      aria-label="Close popover"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <div>{content}</div>
              {arrow && (
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  className="fill-[var(--ant-color-surface-bg-card)] stroke-[var(--ant-color-surface-border)] stroke-[1]"
                  width={14}
                  height={7}
                />
              )}
            </div>
          )}
        </FloatingPortal>
      )}
    </>
  );
}
