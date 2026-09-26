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
  FloatingArrow,
  Placement,
} from "@floating-ui/react";
import { clsx } from "clsx";

export type TooltipPlacement = Placement;
export type TooltipTrigger = "hover" | "focus" | "click" | "manual";

export interface TooltipProps {
  /**
   * Tooltip content (text or rich React nodes)
   */
  content: React.ReactNode;

  /**
   * Placement relative to the reference element (default: 'top')
   */
  placement?: TooltipPlacement;

  /**
   * Interaction trigger mode: `'hover'`, `'focus'`, `'click'`, or `'manual'` (default: `'hover'`)
   */
  trigger?: TooltipTrigger;

  /**
   * Open and close delay in milliseconds (e.g. 150 or `{ open: 150, close: 100 }`)
   */
  delay?: number | { open?: number; close?: number };

  /**
   * Show arrow pointer pointing to reference element (default: true)
   */
  arrow?: boolean;

  /**
   * Offset distance in pixels from the reference target (default: 8)
   */
  offset?: number;

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
   * Allow interactive pointer hover within the tooltip content
   */
  interactive?: boolean;

  /**
   * Disable tooltip from showing
   */
  disabled?: boolean;

  /**
   * Trigger child element (must accept ref and event handlers)
   */
  children: React.ReactNode;

  /**
   * Additional CSS class name for tooltip container
   */
  className?: string;

  /**
   * Custom inline styles for tooltip container
   */
  style?: React.CSSProperties;
}

/**
 * Tooltip - Smart floating tooltip with collision detection and customizable triggers
 */
export function Tooltip({
  content,
  placement = "top",
  trigger = "hover",
  delay = { open: 150, close: 100 },
  arrow = true,
  offset = 8,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  interactive = false,
  disabled = false,
  children,
  className,
  style,
}: TooltipProps) {
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
      shift({ padding: 8 }),
      arrow && floatingArrow({ element: arrowRef }),
    ].filter(Boolean),
  });

  const hover = useHover(context, {
    enabled: trigger === "hover" && !disabled,
    delay,
    move: false,
    handleClose: interactive ? undefined : undefined,
  });

  const focus = useFocus(context, {
    enabled: (trigger === "hover" || trigger === "focus") && !disabled,
  });

  const click = useClick(context, {
    enabled: trigger === "click" && !disabled,
  });

  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
    role,
  ]);

  const childrenRef = isValidElement(children)
    ? (children as unknown as { ref?: React.Ref<HTMLElement> }).ref
    : undefined;
  const mergedRef = useMergeRefs([refs.setReference, childrenRef]);

  // Clone child with reference props
  const triggerElement = isValidElement(children) ? (
    cloneElement(
      children,
      getReferenceProps({
        ref: mergedRef,
        ...children.props,
        "aria-describedby": isOpen ? "ant-tooltip" : undefined,
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
          <div
            id="ant-tooltip"
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...style }}
            className={clsx(
              "z-[9999] max-w-xs rounded-md px-3 py-1.5 text-xs font-medium leading-normal tracking-wide",
              "bg-[var(--ant-color-neutral-900)] text-white shadow-lg",
              "dark:bg-[var(--ant-color-neutral-100)] dark:text-[var(--ant-color-neutral-900)]",
              "animate-in fade-in zoom-in-95 duration-150 transition-opacity",
              className
            )}
            {...getFloatingProps()}
          >
            {content}
            {arrow && (
              <FloatingArrow
                ref={arrowRef}
                context={context}
                className="fill-[var(--ant-color-neutral-900)] dark:fill-[var(--ant-color-neutral-100)]"
                width={10}
                height={5}
              />
            )}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
