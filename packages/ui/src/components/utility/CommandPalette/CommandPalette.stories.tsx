import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CommandPalette, type CommandItem, type CommandGroup } from "./CommandPalette";

const meta: Meta<typeof CommandPalette> = {
  title: "Utility/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const iconClassName = "w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]";

const SearchIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const PaletteIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const MoonIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const PlusIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CopyIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const BoxIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l-7-4A2 2 0 0 0 21 16z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const ChartIcon = () => (
  <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const standardGroups: CommandGroup[] = [
  { id: "recent", heading: "Recent" },
  { id: "commands", heading: "Commands" },
  { id: "pages", heading: "Pages" },
];

const standardCommands: CommandItem[] = [
  {
    id: "recent-tokens",
    label: "Design Tokens Guide",
    group: "recent",
    description: "tokens.json, CSS variables, and spacing rules",
    keywords: ["tokens", "styles", "variables", "theme", "colors"],
    icon: <PaletteIcon />,
    shortcut: ["G", "T"],
  },
  {
    id: "recent-avatar",
    label: "AvatarUserCard Component",
    group: "recent",
    description: "Component specification and live preview",
    keywords: ["avatar", "user", "card", "profile"],
    icon: <UserIcon />,
    shortcut: ["G", "A"],
  },
  {
    id: "recent-settings",
    label: "Project Configuration",
    group: "recent",
    description: "Build settings, linting, and workspace rules",
    keywords: ["settings", "config", "workspace", "options"],
    icon: <SettingsIcon />,
  },
  {
    id: "cmd-theme",
    label: "Toggle Color Theme",
    group: "commands",
    description: "Switch between Antrosys light and dark mode",
    keywords: ["theme", "dark", "light", "mode", "night", "toggle"],
    icon: <MoonIcon />,
    shortcut: ["⌘", "T"],
  },
  {
    id: "cmd-new-comp",
    label: "Create New Component",
    group: "commands",
    description: "Scaffold a new component in packages/ui",
    keywords: ["create", "new", "component", "scaffold", "add"],
    icon: <PlusIcon />,
    shortcut: ["⌘", "N"],
  },
  {
    id: "cmd-copy-link",
    label: "Copy Shareable Link",
    group: "commands",
    description: "Copy permalink for this story to clipboard",
    keywords: ["copy", "share", "link", "url", "clipboard"],
    icon: <CopyIcon />,
    shortcut: ["⌘", "C"],
  },
  {
    id: "cmd-export-bundle",
    label: "Export Production Bundle",
    group: "commands",
    description: "Trigger tsup build and package artifacts",
    keywords: ["export", "build", "dist", "bundle", "package"],
    icon: <BoxIcon />,
    shortcut: ["⌘", "E"],
  },
  {
    id: "cmd-deploy",
    label: "Deploy to Production",
    group: "commands",
    description: "Requires administrator authentication",
    keywords: ["deploy", "release", "ship", "production"],
    icon: <BoxIcon />,
    disabled: true,
  },
  {
    id: "page-dashboard",
    label: "Dashboard Overview",
    group: "pages",
    description: "Activity feed, component health, and analytics",
    keywords: ["dashboard", "overview", "metrics", "analytics", "home"],
    icon: <ChartIcon />,
    shortcut: ["G", "D"],
  },
  {
    id: "page-docs",
    label: "Component Documentation",
    group: "pages",
    description: "API references, prop types, and guides",
    keywords: ["docs", "documentation", "api", "readme", "reference"],
    icon: <FileTextIcon />,
    shortcut: ["G", "P"],
  },
];

function InteractiveStoryWrapper({
  children,
  defaultOpen = false,
  shortcut = "k",
}: {
  children: (props: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    lastExecuted: string | null;
    setLastExecuted: (msg: string) => void;
  }) => React.ReactNode;
  defaultOpen?: boolean;
  shortcut?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);

  const isMac =
    typeof navigator !== "undefined" &&
    /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);

  const shortcutDisplay = isMac ? `⌘${shortcut.toUpperCase()}` : `Ctrl+${shortcut.toUpperCase()}`;

  return (
    <div className="flex flex-col items-center justify-center gap-[var(--ant-spacing-6)] p-[var(--ant-spacing-8)] w-full max-w-[calc(var(--ant-spacing-24)*7)] font-[var(--ant-typography-fontFamily-sans)]">
      <div className="flex flex-col items-center gap-[var(--ant-spacing-3)] text-center">
        <h3 className="text-[var(--ant-typography-fontSize-lg)] font-[var(--ant-typography-fontWeight-semibold)] text-[var(--ant-color-surface-text)]">
          Antrosys Command Palette
        </h3>
        <p className="text-[var(--ant-typography-fontSize-sm)] text-[var(--ant-color-surface-text-sub)] max-w-[calc(var(--ant-spacing-24)*4+var(--ant-spacing-16))]">
          Press{" "}
          <kbd
            className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-sm)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] font-[var(--ant-typography-fontFamily-mono)] text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-semibold)] text-[var(--ant-color-surface-text)]"
            aria-hidden="true"
          >
            {shortcutDisplay}
          </kbd>{" "}
          globally or click the button below to open the palette.
        </p>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-[var(--ant-spacing-2)] px-[var(--ant-spacing-4)] py-[var(--ant-spacing-2)] mt-[var(--ant-spacing-2)] rounded-[var(--ant-radius-md)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-typography-fontSize-sm)] font-[var(--ant-typography-fontWeight-medium)] text-[var(--ant-color-surface-text)] shadow-[var(--ant-shadow-sm)] hover:bg-[var(--ant-color-surface-bg)] transition-colors duration-[var(--ant-motion-duration-fast)] cursor-pointer"
        >
          <SearchIcon />
          <span>Open Command Palette...</span>
          <kbd
            className="ml-[var(--ant-spacing-2)] px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-sm)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)] font-[var(--ant-typography-fontFamily-mono)] text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)]"
            aria-hidden="true"
          >
            {shortcutDisplay}
          </kbd>
        </button>
      </div>

      {lastExecuted && (
        <div className="flex items-center gap-[var(--ant-spacing-2)] px-[var(--ant-spacing-3)] py-[var(--ant-spacing-2)] rounded-[var(--ant-radius-md)] bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary-dk)] text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontWeight-medium)]">
          <span>Executed:</span>
          <span className="font-[var(--ant-typography-fontWeight-semibold)] underline">{lastExecuted}</span>
        </div>
      )}

      {children({ isOpen, setIsOpen, lastExecuted, setLastExecuted })}
    </div>
  );
}

function ServiceResult({
  cmd,
  isSelected,
  status,
  statusColor,
  meta,
}: {
  cmd: CommandItem;
  isSelected: boolean;
  status: string;
  statusColor: string;
  meta: string;
}) {
  return (
    <div className="flex items-center justify-between w-full py-[var(--ant-spacing-1)] min-w-0">
      <div className="flex items-center gap-[var(--ant-spacing-3)] min-w-0">
        <div
          className={clsxDot(statusColor, isSelected)}
        />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-[var(--ant-spacing-2)]">
            <span className="font-[var(--ant-typography-fontWeight-semibold)] text-[var(--ant-typography-fontSize-sm)] truncate">
              {cmd.label}
            </span>
            <span className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-sm)] text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontFamily-mono)] font-[var(--ant-typography-fontWeight-medium)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)]" style={{ color: statusColor }}>
              {status}
            </span>
          </div>
          <span className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] truncate">
            {cmd.description}
          </span>
        </div>
      </div>
      <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontFamily-mono)] text-[var(--ant-color-surface-text-sub)] shrink-0">
        {meta}
      </span>
    </div>
  );
}

function clsxDot(statusColor: string, isSelected: boolean) {
  return [
    "w-[var(--ant-spacing-3)] h-[var(--ant-spacing-3)] rounded-[var(--ant-radius-full)] shrink-0",
    isSelected ? "shadow-[var(--ant-shadow-sm)]" : "",
  ].join(" ") + ` `;
}

/**
 * Default / Basic Command Palette with realistic commands, groups, and keyboard navigation.
 */
export const Default: Story = {
  render: () => (
    <InteractiveStoryWrapper defaultOpen={true}>
      {({ isOpen, setIsOpen, setLastExecuted }) => (
        <CommandPalette
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          groups={standardGroups}
          commands={standardCommands}
          shortcut="k"
          placeholder="Type a command or search..."
          onSelectCommand={(cmd) => setLastExecuted(cmd.label)}
        />
      )}
    </InteractiveStoryWrapper>
  ),
};

/**
 * Fuzzy Search demonstration:
 * Try searching keywords or partial terms like "dark", "theme", "link", "scaffold", "docs", or "avatar".
 */
export const FuzzySearch: Story = {
  render: () => (
    <InteractiveStoryWrapper defaultOpen={true}>
      {({ isOpen, setIsOpen, setLastExecuted }) => (
        <CommandPalette
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          groups={standardGroups}
          commands={[
            ...standardCommands,
            {
              id: "cmd-billing",
              label: "Invoices & Billing History",
              group: "commands",
              description: "Review subscription invoices and payment methods",
              keywords: ["billing", "invoices", "payment", "money", "subscription", "pricing"],
              icon: <BoxIcon />,
              shortcut: ["⌘", "B"],
            },
            {
              id: "cmd-cache",
              label: "Purge Component Cache",
              group: "commands",
              description: "Clear compiled storybook assets and memory cache",
              keywords: ["cache", "clean", "purge", "reset", "clear"],
              icon: <SettingsIcon />,
            },
          ]}
          shortcut="k"
          placeholder="Try searching 'theme', 'pay', 'avatar', or 'build'..."
          onSelectCommand={(cmd) => setLastExecuted(cmd.label)}
        />
      )}
    </InteractiveStoryWrapper>
  ),
};

/**
 * Recent + Commands + Pages:
 * Demonstrates the required organizational hierarchy with distinct group headings.
 */
export const RecentCommandsPages: Story = {
  render: () => (
    <InteractiveStoryWrapper defaultOpen={true}>
      {({ isOpen, setIsOpen, setLastExecuted }) => (
        <CommandPalette
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          groups={[
            { id: "recent", heading: "Recent" },
            { id: "commands", heading: "Commands" },
            { id: "pages", heading: "Pages" },
          ]}
          commands={standardCommands}
          shortcut="k"
          placeholder="Browse Recent items, Commands, or Pages..."
          onSelectCommand={(cmd) => setLastExecuted(`${cmd.group?.toUpperCase()}: ${cmd.label}`)}
        />
      )}
    </InteractiveStoryWrapper>
  ),
};

/**
 * Item-level custom result renderers (`command.render`).
 */
export const CustomResults: Story = {
  render: () => {
    const customCommands: CommandItem[] = [
      {
        id: "svc-auth",
        label: "Auth & Identity Service",
        group: "services",
        description: "Antrosys OAuth2 and Session Provider · Latency: 18ms · Uptime: 99.98%",
        keywords: ["auth", "login", "jwt", "tokens", "session"],
        render: (cmd, isSelected) => (
          <ServiceStatusRow
            cmd={cmd}
            isSelected={isSelected}
            status="ONLINE"
            tone="success"
            meta="v2.4.1"
          />
        ),
      },
      {
        id: "svc-db",
        label: "Primary Database Cluster",
        group: "services",
        description: "Read replica active · 42% CPU utilization",
        keywords: ["database", "postgres", "sql", "storage"],
        render: (cmd, isSelected) => (
          <ServiceStatusRow
            cmd={cmd}
            isSelected={isSelected}
            status="DEGRADED"
            tone="warning"
            meta="us-east-1"
          />
        ),
      },
      {
        id: "svc-cdn",
        label: "Edge CDN & Static Assets",
        group: "services",
        description: "Global cache hit ratio 98.4%",
        keywords: ["cdn", "cache", "edge", "assets"],
        render: (cmd, isSelected) => (
          <ServiceStatusRow
            cmd={cmd}
            isSelected={isSelected}
            status="OPERATIONAL"
            tone="success"
            meta="Global Edge"
          />
        ),
      },
    ];

    return (
      <InteractiveStoryWrapper defaultOpen={true}>
        {({ isOpen, setIsOpen, setLastExecuted }) => (
          <CommandPalette
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            groups={[{ id: "services", heading: "Infrastructure Status & Services" }]}
            commands={customCommands}
            shortcut="k"
            placeholder="Inspect services or search status..."
            onSelectCommand={(cmd) => setLastExecuted(`Selected Service: ${cmd.label}`)}
          />
        )}
      </InteractiveStoryWrapper>
    );
  },
};

function ServiceStatusRow({
  cmd,
  isSelected,
  status,
  tone,
  meta,
}: {
  cmd: CommandItem;
  isSelected: boolean;
  status: string;
  tone: "success" | "warning";
  meta: string;
}) {
  const toneVar =
    tone === "success"
      ? "var(--ant-color-semantic-success)"
      : "var(--ant-color-semantic-warning)";

  return (
    <div className="flex items-center justify-between w-full py-[var(--ant-spacing-1)] min-w-0">
      <div className="flex items-center gap-[var(--ant-spacing-3)] min-w-0">
        <div
          className="w-[var(--ant-spacing-3)] h-[var(--ant-spacing-3)] rounded-[var(--ant-radius-full)] shrink-0"
          style={{
            backgroundColor: toneVar,
            boxShadow: isSelected ? "var(--ant-shadow-sm)" : undefined,
          }}
        />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-[var(--ant-spacing-2)]">
            <span className="font-[var(--ant-typography-fontWeight-semibold)] text-[var(--ant-typography-fontSize-sm)] truncate">
              {cmd.label}
            </span>
            <span
              className="px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-sm)] text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontFamily-mono)] font-[var(--ant-typography-fontWeight-medium)] border border-[var(--ant-color-surface-border)] bg-[var(--ant-color-surface-bg)]"
              style={{ color: toneVar }}
            >
              {status}
            </span>
          </div>
          <span className="text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)] truncate">
            {cmd.description}
          </span>
        </div>
      </div>
      <span className="text-[var(--ant-typography-fontSize-xs)] font-[var(--ant-typography-fontFamily-mono)] text-[var(--ant-color-surface-text-sub)] shrink-0">
        {meta}
      </span>
    </div>
  );
}

/**
 * Palette-level `renderCommand` applied to every item.
 */
export const CustomRenderer: Story = {
  render: () => (
    <InteractiveStoryWrapper defaultOpen={true}>
      {({ isOpen, setIsOpen, setLastExecuted }) => (
        <CommandPalette
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          groups={standardGroups}
          commands={standardCommands}
          shortcut="k"
          placeholder="Custom renderer across all results..."
          onSelectCommand={(cmd) => setLastExecuted(cmd.label)}
          renderCommand={(cmd, isSelected) => (
            <div className="flex items-center justify-between w-full gap-[var(--ant-spacing-3)] min-w-0">
              <span className="truncate font-[var(--ant-typography-fontWeight-medium)] text-[var(--ant-typography-fontSize-sm)]">
                {cmd.label}
              </span>
              <span
                className={
                  isSelected
                    ? "text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-brand-primary)]"
                    : "text-[var(--ant-typography-fontSize-xs)] text-[var(--ant-color-surface-text-sub)]"
                }
              >
                {cmd.group}
              </span>
            </div>
          )}
        />
      )}
    </InteractiveStoryWrapper>
  ),
};

/**
 * Empty search state: type a term that matches nothing (for example "zzzz").
 */
export const EmptySearch: Story = {
  render: () => (
    <InteractiveStoryWrapper defaultOpen={true}>
      {({ isOpen, setIsOpen, setLastExecuted }) => (
        <CommandPalette
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          groups={standardGroups}
          commands={standardCommands}
          shortcut="k"
          placeholder="Type 'zzzz' to see the empty state..."
          onSelectCommand={(cmd) => setLastExecuted(cmd.label)}
        />
      )}
    </InteractiveStoryWrapper>
  ),
};

/**
 * Light theme (Storybook background: light).
 */
export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
  render: () => (
    <InteractiveStoryWrapper defaultOpen={true}>
      {({ isOpen, setIsOpen, setLastExecuted }) => (
        <CommandPalette
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          groups={standardGroups}
          commands={standardCommands}
          shortcut="k"
          placeholder="Light theme command palette..."
          onSelectCommand={(cmd) => setLastExecuted(cmd.label)}
        />
      )}
    </InteractiveStoryWrapper>
  ),
};

/**
 * Dark theme (Storybook background: dark).
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <InteractiveStoryWrapper defaultOpen={true}>
      {({ isOpen, setIsOpen, setLastExecuted }) => (
        <CommandPalette
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          groups={standardGroups}
          commands={standardCommands}
          shortcut="k"
          placeholder="Dark theme command palette..."
          onSelectCommand={(cmd) => setLastExecuted(cmd.label)}
        />
      )}
    </InteractiveStoryWrapper>
  ),
};

/**
 * Keyboard Shortcut:
 * Cmd + K (macOS) or Ctrl + K (Windows/Linux).
 */
export const KeyboardShortcut: Story = {
  render: () => {
    return (
      <InteractiveStoryWrapper defaultOpen={false} shortcut="k">
        {({ isOpen, setIsOpen, setLastExecuted }) => (
          <CommandPalette
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            groups={standardGroups}
            commands={standardCommands}
            shortcut="k"
            placeholder="Search with Cmd+K / Ctrl+K..."
            onSelectCommand={(cmd) => setLastExecuted(cmd.label)}
          />
        )}
      </InteractiveStoryWrapper>
    );
  },
};
