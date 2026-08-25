import React, {
  HTMLAttributes,
  ReactNode,
  useState,
} from "react";
import { clsx } from "clsx";

/**
 * Single navigation item in the Sidebar hierarchy.
 */
export interface SidebarItem {
  /** Display label for the item */
  label: string;
  /** Optional icon rendered next to the label */
  icon?: ReactNode;
  /** Unique route string used for navigation and active state matching */
  route: string;
  /** Optional badge content (e.g. notification count or label) */
  badge?: number | string;
  /** Optional nested children items */
  children?: SidebarItem[];
}

/**
 * User profile information rendered at the bottom of the Sidebar.
 */
export interface SidebarUserProfile {
  /** Display name of the user */
  name: string;
  /** Optional role or subtitle */
  role?: string;
  /** Optional URL for the user's avatar image */
  avatar?: string;
  /** Status indicator: "online", "offline", or boolean true/false (omitted or false hides the indicator) */
  status?: "online" | "offline" | boolean;
}

/**
 * Props for the Sidebar component.
 */
export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Navigation tree — supports one level of nested children */
  items: SidebarItem[];
  /** Renders the collapsed (icon-rail) layout */
  collapsed?: boolean;
  /** Route of the currently active item, e.g. "/dashboard" */
  activeRoute?: string;
  /** Details for the user profile block at the bottom */
  userProfile?: SidebarUserProfile;
  /** Brand title text (default: "AntroSys") */
  title?: string;
  /** Brand subtitle text (default: "Workspace") */
  subtitle?: string;
  /** Optional custom brand logo/icon node */
  logo?: ReactNode;
  /** Callback fired when an item is clicked */
  onNavigate?: (route: string) => void;
  /** Callback fired when the collapse button is clicked */
  onCollapse?: () => void;
}

function DeveloperAvatar() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <circle
        cx="24"
        cy="24"
        r="24"
        fill="var(--ant-sidebar-icon-active-bg)"
      />

      <path
        d="M13 22C13 14.8 17.9 10 24 10C30.1 10 35 14.8 35 22V29H13V22Z"
        fill="var(--ant-sidebar-active-text)"
      />

      <path
        d="M17 21C17 16.6 20.1 14 24 14C27.9 14 31 16.6 31 21V26C31 30.4 27.9 34 24 34C20.1 34 17 30.4 17 26V21Z"
        fill="var(--ant-sidebar-bg)"
      />

      <path
        d="M17 20C18 15.5 21 13.5 25 14C28 14.2 30 16 31 19C28 18 25 17 22 18C20 18.7 18.5 19.8 17 20Z"
        fill="var(--ant-sidebar-active-text)"
      />

      <circle
        cx="21"
        cy="23"
        r="1"
        fill="var(--ant-sidebar-text)"
      />

      <circle
        cx="27"
        cy="23"
        r="1"
        fill="var(--ant-sidebar-text)"
      />

      <path
        d="M21 27C22.5 28.5 25.5 28.5 27 27"
        stroke="var(--ant-sidebar-active-text)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M11 44C11.8 37.5 16.8 33 24 33C31.2 33 36.2 37.5 37 44"
        fill="var(--ant-sidebar-active-text)"
      />

      <path
        d="M20 35L24 39L28 35"
        stroke="var(--ant-sidebar-bg)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={clsx(
        "h-4 w-4 transition-transform",
        open && "rotate-180"
      )}
      aria-hidden="true"
    >
      <path
        d="M5.5 7.5L10 12L14.5 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Collapsible sidebar navigation with nested routes, badges, configurable branding, and a user profile block.
 */
export function Sidebar({
  items,
  collapsed = false,
  activeRoute,
  userProfile,
  title = "AntroSys",
  subtitle = "Workspace",
  logo,
  onNavigate,
  onCollapse,
  className,
  ...props
}: SidebarProps) {
  const [openItems, setOpenItems] = useState<
    Record<string, boolean>
  >({});

  const toggleItem = (route: string) => {
    setOpenItems((previous) => ({
      ...previous,
      [route]: !previous[route],
    }));
  };

  const isActive = (item: SidebarItem): boolean => {
    if (activeRoute === item.route) {
      return true;
    }

    return Boolean(
      item.children?.some((child) => isActive(child))
    );
  };

  const renderItems = (
    navigationItems: SidebarItem[],
    level = 0
  ) => {
    return navigationItems.map((item) => {
      const active = isActive(item);

      const hasChildren = Boolean(
        item.children && item.children.length > 0
      );

      const isOpen = Boolean(openItems[item.route]);
      const submenuId = `sidebar-submenu-${item.route.replace(/[^a-zA-Z0-9-_]/g, "-")}`;

      return (
        <li
          key={item.route}
          className="w-full"
        >
          <div
            className={clsx(
              "relative flex w-full items-center rounded-xl transition-all",
              level > 0 && !collapsed && "ml-4"
            )}
          >
            {active && !collapsed && (
              <span
                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-sidebar-active-text"
                aria-hidden="true"
              />
            )}

            <button
              type="button"
              onClick={() => {
                if (hasChildren && !collapsed) {
                  toggleItem(item.route);
                }

                onNavigate?.(item.route);
              }}
              aria-current={
                activeRoute === item.route
                  ? "page"
                  : undefined
              }
              aria-expanded={
                hasChildren && !collapsed
                  ? isOpen
                  : undefined
              }
              aria-controls={
                hasChildren && !collapsed
                  ? submenuId
                  : undefined
              }
              aria-label={
                collapsed ? item.label : undefined
              }
              title={
                collapsed ? item.label : undefined
              }
              className={clsx(
                "group flex min-h-sidebar-item-height w-full min-w-0 cursor-pointer items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-active-text",
                active
                  ? "bg-sidebar-active-bg text-sidebar-active-text shadow-sm"
                  : "text-sidebar-text hover:bg-sidebar-hover",
                collapsed
                  ? "justify-center px-2.5"
                  : "gap-3"
              )}
            >
              {item.icon && (
                <span
                  className={clsx(
                    "flex h-sidebar-icon-size w-sidebar-icon-size shrink-0 items-center justify-center rounded-lg transition-all",
                    active
                      ? "bg-sidebar-icon-active-bg text-sidebar-active-text"
                      : "text-sidebar-icon group-hover:text-sidebar-active-text",
                    collapsed && "h-10 w-10"
                  )}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
              )}

              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1 truncate">
                    {item.label}
                  </span>

                  {item.badge !== undefined && (
                    <span className="min-w-5 shrink-0 rounded-full bg-sidebar-badge px-2 py-0.5 text-xs font-semibold text-neutral-0">
                      {item.badge}
                    </span>
                  )}

                  {hasChildren && (
                    <span
                      className="shrink-0 text-sidebar-text-secondary"
                      aria-hidden="true"
                    >
                      <ChevronIcon open={isOpen} />
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

          {hasChildren && isOpen && !collapsed && (
            <ul
              id={submenuId}
              className="relative ml-7 mt-1 space-y-1 pl-5"
            >
              <span
                className="absolute bottom-1 left-1 top-1 w-px bg-sidebar-border"
                aria-hidden="true"
              />

              {item.children!.map((child) => {
                const childActive = isActive(child);

                return (
                  <li key={child.route}>
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate?.(child.route)
                      }
                      className={clsx(
                        "relative flex min-h-sidebar-child-height w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-active-text",
                        childActive
                          ? "bg-sidebar-active-bg font-medium text-sidebar-active-text"
                          : "text-sidebar-text-secondary hover:bg-sidebar-hover hover:text-sidebar-text"
                      )}
                    >
                      {childActive && (
                        <span
                          className="absolute -left-5 h-1.5 w-1.5 rounded-full bg-sidebar-active-text"
                          aria-hidden="true"
                        />
                      )}

                      <span className="truncate">
                        {child.label}
                      </span>

                      {child.badge !== undefined && (
                        <span className="ml-auto min-w-5 shrink-0 rounded-full bg-sidebar-badge px-2 py-0.5 text-center text-xs font-semibold text-neutral-0">
                          {child.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <aside
      className={clsx(
        "flex h-full min-h-screen flex-col border-r border-sidebar-border bg-sidebar-bg transition-[width] duration-300 ease-in-out",
        collapsed
          ? "w-20"
          : "w-sidebar-width",
        className
      )}
      {...props}
    >
      {/* BRAND */}
      <div
        className={clsx(
          "flex h-sidebar-header-height shrink-0 items-center border-b border-sidebar-border",
          collapsed
            ? "justify-center px-3"
            : "justify-between px-4"
        )}
      >
        <div
          className={clsx(
            "flex min-w-0 items-center",
            collapsed
              ? "justify-center"
              : "gap-3"
          )}
        >
          {logo !== undefined ? (
            logo
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-active-bg text-lg font-bold text-sidebar-active-text">
              ✦
            </div>
          )}

          {!collapsed && (title || subtitle) && (
            <div className="min-w-0">
              {title && (
                <p className="truncate text-sm font-bold text-sidebar-text">
                  {title}
                </p>
              )}

              {subtitle && (
                <p className="truncate text-xs text-sidebar-text-secondary">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            aria-expanded={!collapsed}
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            title={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className={clsx(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-bg text-sidebar-text-secondary shadow-sm transition-all",
              "hover:bg-sidebar-hover hover:text-sidebar-active-text",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-active-text",
              collapsed &&
                "absolute left-sidebar-collapse-button-offset top-5 z-10"
            )}
          >
            {collapsed ? "→" : "←"}
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav
        aria-label="Sidebar navigation"
        className="flex-1 overflow-y-auto px-3 py-5"
      >
        {!collapsed && (
          <p className="mb-3 px-3 text-sidebar-section font-bold uppercase tracking-[0.14em] text-sidebar-text-secondary">
            Navigation
          </p>
        )}

        <ul className="w-full space-y-2">
          {renderItems(items)}
        </ul>
      </nav>

      {/* USER PROFILE */}
      {userProfile && (
        <div className="shrink-0 border-t border-sidebar-border p-3">
          <div
            className={clsx(
              "flex items-center rounded-xl bg-sidebar-profile-bg transition-all hover:bg-sidebar-hover",
              collapsed
                ? "justify-center p-1"
                : "gap-3 p-2.5"
            )}
          >
            <div className="relative shrink-0">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-sidebar-icon-active-bg text-sm font-bold text-sidebar-active-text">
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <DeveloperAvatar />
                )}
              </div>

              {userProfile.status !== undefined && userProfile.status !== false && (
                <span
                  role="status"
                  aria-label={userProfile.status === "offline" ? "Offline" : "Online"}
                  className={clsx(
                    "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-sidebar-profile-bg",
                    userProfile.status === "offline"
                      ? "bg-[var(--ant-color-neutral-400)]"
                      : "bg-[var(--ant-color-semantic-success)]"
                  )}
                />
              )}
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-sidebar-text">
                  {userProfile.name}
                </p>

                {userProfile.role && (
                  <p className="mt-0.5 truncate text-xs text-sidebar-text-secondary">
                    {userProfile.role}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}