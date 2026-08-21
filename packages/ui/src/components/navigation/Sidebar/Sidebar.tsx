import React, { HTMLAttributes, ReactNode, useState } from "react";
import { clsx } from "clsx";

export interface SidebarItem {
  label: string;
  icon?: ReactNode;
  route: string;
  badge?: number | string;
  children?: SidebarItem[];
}

export interface SidebarUserProfile {
  name: string;
  role?: string;
  avatar?: string;
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  items: SidebarItem[];
  collapsed?: boolean;
  activeRoute?: string;
  userProfile?: SidebarUserProfile;
  onNavigate?: (route: string) => void;
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
        fill="var(--sidebar-icon-active-bg)"
      />

      <path
        d="M13 22C13 14.8 17.9 10 24 10C30.1 10 35 14.8 35 22V29H13V22Z"
        fill="var(--sidebar-active-text)"
      />

      <path
        d="M17 21C17 16.6 20.1 14 24 14C27.9 14 31 16.6 31 21V26C31 30.4 27.9 34 24 34C20.1 34 17 30.4 17 26V21Z"
        fill="var(--sidebar-bg)"
      />

      <path
        d="M17 20C18 15.5 21 13.5 25 14C28 14.2 30 16 31 19C28 18 25 17 22 18C20 18.7 18.5 19.8 17 20Z"
        fill="var(--sidebar-active-text)"
      />

      <circle cx="21" cy="23" r="1" fill="var(--sidebar-text)" />
      <circle cx="27" cy="23" r="1" fill="var(--sidebar-text)" />

      <path
        d="M21 27C22.5 28.5 25.5 28.5 27 27"
        stroke="var(--sidebar-active-text)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M11 44C11.8 37.5 16.8 33 24 33C31.2 33 36.2 37.5 37 44"
        fill="var(--sidebar-active-text)"
      />

      <path
        d="M20 35L24 39L28 35"
        stroke="var(--sidebar-bg)"
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
      className={`h-4 w-4 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
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

export function Sidebar({
  items,
  collapsed = false,
  activeRoute,
  userProfile,
  onNavigate,
  onCollapse,
  className,
  ...props
}: SidebarProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (route: string) => {
    setOpenItems((previous) => ({
      ...previous,
      [route]: !previous[route],
    }));
  };

  const isActive = (item: SidebarItem): boolean => {
    if (activeRoute === item.route) return true;

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

      return (
        <li key={item.route} className="w-full">
          <div
            className={`relative flex w-full items-center rounded-xl transition-all duration-200 ${
              level > 0 && !collapsed ? "ml-4" : ""
            }`}
          >
            {active && !collapsed && (
              <span
                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-[var(--sidebar-active-text)]"
                aria-hidden="true"
              />
            )}

            <button
              type="button"
              onClick={() => {
                if (hasChildren) {
                  toggleItem(item.route);
                }

                onNavigate?.(item.route);
              }}
              aria-current={
                activeRoute === item.route ? "page" : undefined
              }
              aria-label={collapsed ? item.label : undefined}
              title={collapsed ? item.label : undefined}
              className={`group flex min-h-[44px] w-full min-w-0 items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-active-text)] ${
                active
                  ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] shadow-sm"
                  : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]"
              } ${
                collapsed
                  ? "justify-center px-2.5"
                  : "gap-3"
              }`}
            >
              {item.icon && (
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-[var(--sidebar-icon-active-bg)] text-[var(--sidebar-active-text)]"
                      : "text-[var(--sidebar-icon)] group-hover:text-[var(--sidebar-active-text)]"
                  } ${collapsed ? "h-10 w-10" : ""}`}
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
                    <span
                      className="min-w-5 shrink-0 rounded-full bg-[var(--sidebar-badge)] px-2 py-0.5 text-center text-[11px] font-semibold text-white"
                    >
                      {item.badge}
                    </span>
                  )}

                  {hasChildren && (
                    <span
                      className="shrink-0 text-[var(--sidebar-text-secondary)]"
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
            <ul className="relative ml-7 mt-1 space-y-1 pl-5">
              <span
                className="absolute bottom-1 left-1 top-1 w-px bg-[var(--sidebar-border)]"
                aria-hidden="true"
              />

              {item.children!.map((child) => {
                const childActive = isActive(child);

                return (
                  <li key={child.route}>
                    <button
                      type="button"
                      onClick={() => onNavigate?.(child.route)}
                      className={`relative flex min-h-[38px] w-full items-center rounded-lg px-3 py-2 text-sm cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-active-text)] ${
                        childActive
                          ? "bg-[var(--sidebar-active-bg)] font-medium text-[var(--sidebar-active-text)]"
                          : "text-[var(--sidebar-text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]"
                      }`}
                    >
                      {childActive && (
                        <span
                          className="absolute -left-5 h-1.5 w-1.5 rounded-full bg-[var(--sidebar-active-text)]"
                          aria-hidden="true"
                        />
                      )}

                      <span className="truncate">
                        {child.label}
                      </span>

                      {child.badge !== undefined && (
                        <span className="ml-auto text-xs">
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
      className={`flex h-full min-h-screen flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] ${
        collapsed ? "w-20" : "w-[260px]"
      } transition-[width] duration-300 ease-in-out ${className ?? ""}`}
      {...props}
    >
      {/* BRAND */}
      <div
        className={`flex h-[76px] shrink-0 items-center border-b border-[var(--sidebar-border)] ${
          collapsed
            ? "justify-center px-3"
            : "justify-between px-4"
        }`}
      >
        <div
          className={`flex min-w-0 items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--sidebar-active-bg)] text-lg font-bold text-[var(--sidebar-active-text)]">
            ✦
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--sidebar-text)]">
                AntroSys
              </p>

              <p className="truncate text-xs text-[var(--sidebar-text-secondary)]">
                Workspace
              </p>
            </div>
          )}
        </div>

        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
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
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text-secondary)] shadow-sm transition-all duration-200 hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-active-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-active-text)] ${
              collapsed
                ? "absolute left-[68px] top-5 z-10"
                : ""
            }`}
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
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--sidebar-text-secondary)]">
            Navigation
          </p>
        )}

        <ul className="w-full space-y-2">
          {renderItems(items)}
        </ul>
      </nav>

      {/* USER PROFILE */}
      {userProfile && (
        <div className="shrink-0 border-t border-[var(--sidebar-border)] p-3">
          <div
            className={`flex items-center rounded-xl bg-[var(--sidebar-profile-bg)] transition-all duration-200 hover:bg-[var(--sidebar-hover)] ${
              collapsed
                ? "justify-center p-1"
                : "gap-3 p-2.5"
            }`}
          >
            <div className="relative shrink-0">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--sidebar-icon-active-bg)] text-sm font-bold text-[var(--sidebar-active-text)]">
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

              <span
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--sidebar-profile-bg)] bg-[var(--sidebar-active-text)]"
                aria-label="Online"
              />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--sidebar-text)]">
                  {userProfile.name}
                </p>

                {userProfile.role && (
                  <p className="mt-0.5 truncate text-xs text-[var(--sidebar-text-secondary)]">
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