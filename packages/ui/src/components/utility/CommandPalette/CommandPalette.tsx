import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Command, useCommandState } from "cmdk";
import { clsx } from "clsx";
import { ThemeContext } from "../../../providers/ThemeProvider";

/**
 * Structure representing an individual command or item in the palette.
 */
export interface CommandItem {
  /** Unique identifier for the command */
  id: string;
  /** Primary label or title displayed to the user */
  label: string;
  /**
   * Search and selection value used by cmdk.
   * If omitted, falls back to a compound value based on label, id, and description.
   */
  value?: string;
  /** Group ID that this command belongs to */
  group?: string;
  /** Additional keywords to enhance fuzzy search matching */
  keywords?: string[];
  /** Optional secondary subtitle or description */
  description?: string;
  /** Icon rendered before the label */
  icon?: ReactNode;
  /**
   * Keyboard shortcut representation.
   * Can be an array (e.g. ["⌘", "K"]) or a string (e.g. "Ctrl+S").
   */
  shortcut?: string | string[];
  /** Optional status or metadata badge */
  badge?: ReactNode;
  /** Disables execution and dims the visual presentation */
  disabled?: boolean;
  /** Callback fired when this specific command is executed */
  onSelect?: (command: CommandItem) => void;
  /** Custom renderer for this command item */
  render?: (command: CommandItem, isSelected: boolean) => ReactNode;
}

/**
 * Definition for command grouping hierarchy.
 */
export interface CommandGroup {
  /** Unique group identifier matching CommandItem.group */
  id: string;
  /** Group header title or custom element */
  heading: ReactNode;
}

/**
 * Public props for the CommandPalette component.
 */
export interface CommandPaletteProps {
  /** Array of executable command items */
  commands: CommandItem[];
  /** Definition of groups for organizing commands */
  groups?: CommandGroup[];
  /** Keyboard shortcut key (e.g., "k" for Cmd+K / Ctrl+K) */
  shortcut?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Controlled visibility state */
  isOpen?: boolean;
  /** Initial visibility state when uncontrolled */
  defaultOpen?: boolean;
  /** Callback fired when visibility changes */
  onOpenChange?: (open: boolean) => void;
  /** Global callback fired when any command is selected */
  onSelectCommand?: (command: CommandItem) => void;
  /** Custom content to render when no commands match search */
  emptyState?: ReactNode;
  /** Custom footer node (or null to hide the default footer) */
  footer?: ReactNode;
  /** Additional CSS class names for the palette dialog container */
  className?: string;
  /** Accessible label for the dialog */
  label?: string;
  /** Whether to automatically close the palette upon selection (defaults to true) */
  closeOnSelect?: boolean;
  /** Optional custom command renderer applied across all items if not overridden */
  renderCommand?: (command: CommandItem, isSelected: boolean) => ReactNode;
}

/**
 * Helper to compute a stable, unique search value for cmdk.
 */
function getItemValue(item: CommandItem): string {
  if (item.value) return item.value;
  const parts = [item.label, item.id];
  if (item.description) parts.push(item.description);
  return parts.join(" ");
}

function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const platform = navigator.platform || "";
  const ua = navigator.userAgent || "";
  return /Mac|iPhone|iPod|iPad/i.test(platform) || /Mac OS X/i.test(ua);
}

/**
 * Renders keyboard shortcut keycaps.
 */
function ShortcutKeys({
  shortcut,
  isDark,
}: {
  shortcut: string | string[];
  isDark: boolean;
}) {
  const keys = Array.isArray(shortcut)
    ? shortcut
    : shortcut.includes("+")
      ? shortcut.split("+")
      : [shortcut];

  return (
    <span className="flex items-center gap-[var(--ant-spacing-1)] select-none shrink-0" aria-hidden="true">
      {keys.map((k, i) => (
        <kbd
          key={i}
          className={clsx(
            "inline-flex items-center justify-center min-w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] px-[var(--ant-spacing-2)] text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontFamily-mono)] font-[var(--ant-typography-fontWeight-medium)] rounded-[var(--ant-radius-sm)] border",
            isDark
              ? "bg-[var(--ant-color-neutral-800)] border-[var(--ant-color-neutral-700)] text-[var(--ant-color-neutral-400)]"
              : "bg-[var(--ant-color-neutral-100)] border-[var(--ant-color-surface-border)] text-[var(--ant-color-surface-text-sub)]",
          )}
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}

/**
 * Internal item content renderer that monitors selection state via useCommandState.
 */
function ItemContent({
  item,
  isDark,
  renderCommand,
}: {
  item: CommandItem;
  isDark: boolean;
  renderCommand?: (item: CommandItem, isSelected: boolean) => ReactNode;
}) {
  const value = getItemValue(item);
  const isSelected = useCommandState((state) => state.value === value);

  if (item.render) {
    return <>{item.render(item, isSelected)}</>;
  }

  if (renderCommand) {
    return <>{renderCommand(item, isSelected)}</>;
  }

  return (
    <div className="flex items-center justify-between w-full gap-[var(--ant-spacing-3)] min-w-0">
      <div className="flex items-center gap-[var(--ant-spacing-3)] min-w-0 flex-1">
        {item.icon && (
          <span
            className={clsx(
              "flex items-center justify-center w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] shrink-0 text-[var(--ant-typography-fontSize-base)] transition-colors duration-[var(--ant-motion-duration-fast)]",
              isSelected
                ? isDark
                  ? "text-[var(--ant-color-brand-primary-lt)]"
                  : "text-[var(--ant-color-brand-primary)]"
                : isDark
                  ? "text-[var(--ant-color-neutral-400)]"
                  : "text-[var(--ant-color-surface-text-sub)]",
            )}
            aria-hidden="true"
          >
            {item.icon}
          </span>
        )}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="truncate font-[var(--ant-typography-fontWeight-medium)] leading-[var(--ant-typography-lineHeight-tight)]">
            {item.label}
          </span>
          {item.description && (
            <span
              className={clsx(
                "truncate text-[var(--ant-typography-fontSize-xs)] leading-[var(--ant-typography-lineHeight-normal)] mt-[var(--ant-spacing-1)] transition-colors duration-[var(--ant-motion-duration-fast)]",
                isSelected
                  ? isDark
                    ? "text-[var(--ant-color-brand-primary-lt)]"
                    : "text-[var(--ant-color-brand-primary-dk)]"
                  : isDark
                    ? "text-[var(--ant-color-neutral-400)]"
                    : "text-[var(--ant-color-surface-text-sub)]",
              )}
            >
              {item.description}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-[var(--ant-spacing-2)] shrink-0">
        {item.badge && (
          <span className="inline-flex items-center">{item.badge}</span>
        )}
        {item.shortcut && (
          <ShortcutKeys shortcut={item.shortcut} isDark={isDark} />
        )}
      </div>
    </div>
  );
}

/**
 * CommandPalette component
 *
 * A modern, accessible Command Palette (Cmd+K) dialogue powered by cmdk
 * and Antrosys design tokens.
 */
export function CommandPalette({
  commands = [],
  groups = [],
  shortcut = "k",
  placeholder = "Type a command or search...",
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  onSelectCommand,
  emptyState,
  footer,
  className,
  label = "Command Palette",
  closeOnSelect = true,
  renderCommand,
}: CommandPaletteProps) {
  const descriptionId = useId();

  // Theme detection with fallback to DOM attribute/class
  const themeCtx = useContext(ThemeContext);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (themeCtx?.theme) return themeCtx.theme === "dark";
    if (typeof document !== "undefined") {
      return (
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark")
      );
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      if (themeCtx?.theme) {
        setIsDark(themeCtx.theme === "dark");
        return;
      }
      if (typeof document !== "undefined") {
        setIsDark(
          document.documentElement.getAttribute("data-theme") === "dark" ||
            document.documentElement.classList.contains("dark"),
        );
      }
    };

    updateTheme();

    if (
      typeof MutationObserver !== "undefined" &&
      typeof document !== "undefined"
    ) {
      const observer = new MutationObserver(updateTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
      });
      return () => observer.disconnect();
    }
  }, [themeCtx?.theme]);

  // Open state management (controlled vs uncontrolled)
  const isControlled = controlledIsOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledIsOpen : uncontrolledOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  // Global keyboard shortcut: Cmd+key on macOS, Ctrl+key on Windows/Linux
  useEffect(() => {
    if (!shortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const targetKey = shortcut.toLowerCase();
      if (e.altKey || e.shiftKey || e.key.toLowerCase() !== targetKey) return;

      const apple = isApplePlatform();
      const modifierOk = apple
        ? e.metaKey && !e.ctrlKey
        : e.ctrlKey && !e.metaKey;

      if (!modifierOk) return;

      e.preventDefault();
      e.stopPropagation();
      handleOpenChange(!isOpen);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcut, isOpen, handleOpenChange]);

  // Handle item execution
  const handleSelectItem = useCallback(
    (item: CommandItem) => {
      if (item.disabled) return;
      item.onSelect?.(item);
      onSelectCommand?.(item);
      if (closeOnSelect) {
        handleOpenChange(false);
      }
    },
    [closeOnSelect, handleOpenChange, onSelectCommand],
  );

  // Group commands by their group identifier
  const { groupedCommands, ungroupedCommands } = useMemo(() => {
    const groupMap = new Map<string, CommandItem[]>();
    const ungrouped: CommandItem[] = [];
    const validGroupIds = new Set(groups.map((g) => g.id));

    commands.forEach((cmd) => {
      if (cmd.group && validGroupIds.has(cmd.group)) {
        const existing = groupMap.get(cmd.group) || [];
        existing.push(cmd);
        groupMap.set(cmd.group, existing);
      } else {
        ungrouped.push(cmd);
      }
    });

    return {
      groupedCommands: groupMap,
      ungroupedCommands: ungrouped,
    };
  }, [commands, groups]);

  const kbdClassName = clsx(
    "px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-sm)] border font-[var(--ant-typography-fontFamily-mono)] text-[var(--ant-typography-fontSize-xs)]",
    isDark
      ? "border-[var(--ant-color-neutral-700)] bg-[var(--ant-color-neutral-900)]"
      : "border-[var(--ant-color-surface-border)] bg-[var(--ant-color-neutral-0)]",
  );

  // Render an individual command item
  const renderItem = (item: CommandItem) => {
    const value = getItemValue(item);
    const keywords = item.group
      ? [...(item.keywords || []), item.group]
      : item.keywords;

    return (
      <Command.Item
        key={item.id}
        value={value}
        keywords={keywords}
        disabled={item.disabled}
        onSelect={() => handleSelectItem(item)}
        className={clsx(
          "relative flex items-center justify-between gap-[var(--ant-spacing-3)] px-[var(--ant-spacing-3)] py-[var(--ant-spacing-3)] min-h-[var(--ant-spacing-12)] rounded-[var(--ant-radius-md)] cursor-pointer text-[var(--ant-typography-fontSize-sm)] font-[var(--ant-typography-fontFamily-sans)] transition-colors duration-[var(--ant-motion-duration-fast)] outline-none select-none",
          "aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
          !isDark && [
            "text-[var(--ant-color-surface-text)]",
            "data-[selected=true]:bg-[var(--ant-color-brand-primary-lt)] data-[selected=true]:text-[var(--ant-color-brand-primary-dk)]",
            "aria-disabled:text-[var(--ant-color-surface-text-sub)]",
          ],
          isDark && [
            "text-[var(--ant-color-neutral-100)]",
            "data-[selected=true]:bg-[var(--ant-color-brand-primary-dk)] data-[selected=true]:text-[var(--ant-color-brand-primary-lt)]",
            "aria-disabled:text-[var(--ant-color-neutral-400)]",
          ],
        )}
      >
        <ItemContent
          item={item}
          isDark={isDark}
          renderCommand={renderCommand}
        />
      </Command.Item>
    );
  };

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      label={label}
      aria-describedby={descriptionId}
      overlayClassName="fixed inset-0 z-[var(--ant-zIndex-overlay)] bg-[color-mix(in_srgb,var(--ant-color-neutral-900)_50%,transparent)] backdrop-blur-[var(--ant-spacing-1)] transition-opacity duration-[var(--ant-motion-duration-normal)]"
      contentClassName={clsx(
        "fixed left-1/2 -translate-x-1/2 z-[var(--ant-zIndex-modal)]",
        "top-[var(--ant-spacing-4)] w-[calc(100%-var(--ant-spacing-8))] max-w-[calc(var(--ant-spacing-24)*6)]",
        "max-h-[calc(100dvh-var(--ant-spacing-8))] outline-none focus:outline-none",
        "sm:top-[var(--ant-spacing-8)]",
      )}
      className={clsx(
        "w-full max-h-full overflow-hidden rounded-[var(--ant-radius-xl)] border shadow-[var(--ant-shadow-xl)] flex flex-col font-[var(--ant-typography-fontFamily-sans)]",
        isDark
          ? "bg-[var(--ant-color-neutral-900)] border-[var(--ant-color-neutral-700)] text-[var(--ant-color-neutral-0)]"
          : "bg-[var(--ant-color-surface-bg-card)] border-[var(--ant-color-surface-border)] text-[var(--ant-color-surface-text)]",
        className,
      )}
    >
      <p id={descriptionId} className="sr-only">
        Search and execute commands. Use arrow keys to navigate, Enter to select, and Escape to close.
      </p>

      {/* Header Search Input */}
      <div
        className={clsx(
          "flex items-center gap-[var(--ant-spacing-3)] px-[var(--ant-spacing-4)] py-[var(--ant-spacing-4)] border-b shrink-0",
          isDark
            ? "border-[var(--ant-color-neutral-700)]"
            : "border-[var(--ant-color-surface-border)]",
        )}
      >
        <svg
          className={clsx(
            "w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)] shrink-0",
            isDark
              ? "text-[var(--ant-color-neutral-400)]"
              : "text-[var(--ant-color-surface-text-sub)]",
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <Command.Input
          placeholder={placeholder}
          aria-label={label}
          className={clsx(
            "w-full bg-transparent text-[var(--ant-typography-fontSize-md)] outline-none font-[var(--ant-typography-fontFamily-sans)] border-0 p-0 focus:ring-0",
            isDark
              ? "text-[var(--ant-color-neutral-0)] placeholder:text-[var(--ant-color-neutral-500)]"
              : "text-[var(--ant-color-surface-text)] placeholder:text-[var(--ant-color-surface-text-sub)]",
          )}
        />

        <kbd
          className={clsx(
            "hidden sm:inline-flex items-center justify-center h-[var(--ant-spacing-5)] px-[var(--ant-spacing-2)] text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontFamily-mono)] font-[var(--ant-typography-fontWeight-medium)] rounded-[var(--ant-radius-sm)] border shrink-0 select-none",
            isDark
              ? "bg-[var(--ant-color-neutral-800)] border-[var(--ant-color-neutral-700)] text-[var(--ant-color-neutral-400)]"
              : "bg-[var(--ant-color-neutral-100)] border-[var(--ant-color-surface-border)] text-[var(--ant-color-surface-text-sub)]",
          )}
          aria-hidden="true"
        >
          ESC
        </kbd>
      </div>

      {/* Results List */}
      <Command.List
        className={clsx(
          "min-h-0 flex-1 overflow-y-auto p-[var(--ant-spacing-2)] scroll-smooth",
          "max-h-[min(calc(var(--ant-spacing-24)*3+var(--ant-spacing-16)),calc(100dvh-var(--ant-spacing-24)*3))]",
          "[&::-webkit-scrollbar]:w-[var(--ant-spacing-1)]",
          "[&::-webkit-scrollbar-thumb]:rounded-[var(--ant-radius-full)]",
          isDark
            ? "[&::-webkit-scrollbar-thumb]:bg-[var(--ant-color-neutral-700)]"
            : "[&::-webkit-scrollbar-thumb]:bg-[var(--ant-color-neutral-300)]",
        )}
      >
        {/* Empty State */}
        <Command.Empty
          className={clsx(
            "py-[var(--ant-spacing-8)] px-[var(--ant-spacing-4)] text-center text-[var(--ant-typography-fontSize-sm)] select-none",
            isDark
              ? "text-[var(--ant-color-neutral-400)]"
              : "text-[var(--ant-color-surface-text-sub)]",
          )}
        >
          {emptyState || (
            <div className="flex flex-col items-center justify-center gap-[var(--ant-spacing-2)]">
              <svg
                className={clsx(
                  "w-[var(--ant-spacing-8)] h-[var(--ant-spacing-8)]",
                  isDark
                    ? "text-[var(--ant-color-neutral-600)]"
                    : "text-[var(--ant-color-neutral-300)]",
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path
                  d="M21 21l-4.35-4.35"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="font-[var(--ant-typography-fontWeight-medium)]">No results found.</p>
              <p className="text-[var(--ant-typography-fontSize-xs)]">
                Try searching with different keywords or terms.
              </p>
            </div>
          )}
        </Command.Empty>

        {/* Grouped Commands */}
        {groups.map((group) => {
          const groupItems = groupedCommands.get(group.id);
          if (!groupItems || groupItems.length === 0) return null;

          return (
            <Command.Group
              key={group.id}
              heading={group.heading}
              value={group.id}
              className={clsx(
                "mb-[var(--ant-spacing-1)] last:mb-0",
                "[&_[cmdk-group-heading]]:px-[var(--ant-spacing-3)] [&_[cmdk-group-heading]]:py-[var(--ant-spacing-2)]",
                "[&_[cmdk-group-heading]]:text-[var(--ant-typography-fontSize-xs)] [&_[cmdk-group-heading]]:font-[var(--ant-typography-fontWeight-semibold)]",
                "[&_[cmdk-group-heading]]:uppercase",
                "[&_[cmdk-group-heading]]:select-none",
                isDark
                  ? "[&_[cmdk-group-heading]]:text-[var(--ant-color-neutral-400)]"
                  : "[&_[cmdk-group-heading]]:text-[var(--ant-color-surface-text-sub)]",
              )}
            >
              {groupItems.map(renderItem)}
            </Command.Group>
          );
        })}

        {/* Ungrouped Commands */}
        {ungroupedCommands.length > 0 && (
          <Command.Group
            value="ungrouped"
            className="mb-[var(--ant-spacing-1)] last:mb-0"
          >
            {ungroupedCommands.map(renderItem)}
          </Command.Group>
        )}
      </Command.List>

      {/* Footer Navigation Bar */}
      {footer !== null && (
        <div
          className={clsx(
            "items-center justify-between px-[var(--ant-spacing-4)] py-[var(--ant-spacing-3)] border-t text-[var(--ant-typography-fontSize-xs)] select-none shrink-0",
            footer ? "flex" : "hidden sm:flex",
            isDark
              ? "bg-[var(--ant-color-neutral-800)] border-[var(--ant-color-neutral-700)] text-[var(--ant-color-neutral-400)]"
              : "bg-[var(--ant-color-surface-bg)] border-[var(--ant-color-surface-border)] text-[var(--ant-color-surface-text-sub)]",
          )}
        >
          {footer || (
            <>
              <div className="flex items-center gap-[var(--ant-spacing-3)]">
                <span className="flex items-center gap-[var(--ant-spacing-2)]">
                  <kbd className={kbdClassName} aria-hidden="true">
                    ↑
                  </kbd>
                  <kbd className={kbdClassName} aria-hidden="true">
                    ↓
                  </kbd>
                  <span>navigate</span>
                </span>

                <span className="flex items-center gap-[var(--ant-spacing-2)]">
                  <kbd className={kbdClassName} aria-hidden="true">
                    ↵
                  </kbd>
                  <span>select</span>
                </span>
              </div>

              <span className="flex items-center gap-[var(--ant-spacing-2)]">
                <kbd className={kbdClassName} aria-hidden="true">
                  esc
                </kbd>
                <span>close</span>
              </span>
            </>
          )}
        </div>
      )}
    </Command.Dialog>
  );
}
