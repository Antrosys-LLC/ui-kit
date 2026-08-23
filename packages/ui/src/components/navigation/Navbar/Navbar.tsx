import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { tokens } from "@antrosys/tokens";
import { useScrollY } from "../../../hooks/useScrollY";
import { useTheme } from "../../../hooks/useTheme";

const durationFast = parseFloat(tokens["motion-duration-fast"]) / 1000;
const durationSlow = parseFloat(tokens["motion-duration-slow"]) / 1000;

export interface NavbarLink {
  /** Visible link label */
  label: string;
  /** Link destination */
  href: string;
  /** Optional links displayed in a dropdown */
  children?: NavbarLink[];
}

export interface NavbarCtaButton {
  /** Call-to-action label */
  label: string;
  /** Call-to-action destination */
  href: string;
}

export interface NavbarProps {
  /** Brand logo or custom logo element */
  logo: React.ReactNode;
  /** Destination used when the logo is selected */
  logoHref?: string;
  /** Accessible name for the logo link */
  logoLabel?: string;
  /** Navigation links and optional dropdown groups */
  links: NavbarLink[];
  /** Optional call-to-action link */
  ctaButton?: NavbarCtaButton;
  /** Start transparent and become solid after scrolling */
  transparent?: boolean;
  /** Display the light/dark theme toggle */
  darkMode?: boolean;
  /** Explicit active URL. Defaults to the browser pathname */
  activeHref?: string;
  /** Accessible label for the navigation region */
  ariaLabel?: string;
  /** Additional class names */
  className?: string;
  /** Called when a navigation destination is selected */
  onNavigate?: (href: string) => void;
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[var(--ant-spacing-5)] w-[var(--ant-spacing-5)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[var(--ant-spacing-5)] w-[var(--ant-spacing-5)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-[var(--ant-spacing-4)] w-[var(--ant-spacing-4)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}

function ThemeIcon({ theme }: { theme: "light" | "dark" }) {
  return theme === "light" ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[var(--ant-spacing-5)] w-[var(--ant-spacing-5)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      <path d="m5.6 5.6 1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[var(--ant-spacing-5)] w-[var(--ant-spacing-5)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />
    </svg>
  );
}

function isLinkActive(link: NavbarLink, activeHref: string): boolean {
  if (link.href === activeHref) return true;

  return (
    link.children?.some((child) => child.href === activeHref) ?? false
  );
}

export function Navbar({
  logo,
  logoHref = "/",
  logoLabel = "Home",
  links,
  ctaButton,
  transparent = false,
  darkMode = false,
  activeHref,
  ariaLabel = "Primary navigation",
  className,
  onNavigate,
}: NavbarProps) {
  const scrollY = useScrollY();
  const { theme, toggleTheme } = useTheme();
  const drawerId = useId();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const currentHref =
    activeHref ??
    (typeof window !== "undefined" ? window.location.pathname : "");

  const isDark = theme === "dark";
  const isTransparent = transparent && scrollY < 16 && !mobileOpen;

  const surfaceClasses = isDark
    ? [
        "border-[var(--ant-color-neutral-700)]",
        "bg-[var(--ant-color-neutral-900)]",
        "text-[var(--ant-color-neutral-0)]",
      ]
    : [
        "border-[var(--ant-color-neutral-200)]",
        "bg-[var(--ant-color-neutral-0)]",
        "text-[var(--ant-color-neutral-900)]",
      ];

  const interactiveSurfaceClasses = isDark
    ? [
        "text-[var(--ant-color-neutral-0)]",
        "hover:bg-[var(--ant-color-neutral-800)]",
      ]
    : [
        "text-[var(--ant-color-neutral-900)]",
        "hover:bg-[var(--ant-color-neutral-100)]",
      ];

  const nestedBorderClass = isDark
    ? "border-[var(--ant-color-neutral-700)]"
    : "border-[var(--ant-color-neutral-200)]";

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavigate = (href: string) => {
    setMobileOpen(false);
    setOpenDropdown(null);
    onNavigate?.(href);
  };

  const linkClass = (active: boolean) =>
    clsx(
      "rounded-[var(--ant-radius-md)] px-[var(--ant-spacing-3)] py-[var(--ant-spacing-2)]",
      "text-[length:var(--ant-typography-fontsize-sm)] font-medium",
      "transition-colors",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-[var(--ant-color-brand-primary)]",
      "focus-visible:ring-offset-2",
      active
        ? "text-[var(--ant-color-brand-primary)]"
        : clsx(
            isDark
              ? "text-[var(--ant-color-neutral-0)]"
              : "text-[var(--ant-color-neutral-900)]",
            "hover:text-[var(--ant-color-brand-primary)]",
          ),
    );

  return (
    <header
      className={clsx(
        "sticky top-0 z-[var(--ant-zIndex-sticky)] w-full transition-colors",
        isTransparent
          ? [
              "bg-transparent",
              isDark
                ? "text-[var(--ant-color-neutral-0)]"
                : "text-[var(--ant-color-neutral-900)]",
            ]
          : ["border-b", surfaceClasses],
        className,
      )}
    >
      <nav
        aria-label={ariaLabel}
        className={clsx(
          "mx-auto flex h-[var(--ant-spacing-16)] max-w-[var(--ant-spacing-7xl)] items-center justify-between",
          "px-[var(--ant-spacing-4)]",
        )}
      >
        <a
          href={logoHref}
          aria-label={logoLabel}
          onClick={() => handleNavigate(logoHref)}
          className={clsx(
            "flex shrink-0 items-center",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[var(--ant-color-brand-primary)]",
            "focus-visible:ring-offset-2",
          )}
        >
          {logo}
        </a>

        <div className="hidden items-center gap-[var(--ant-spacing-1)] md:flex">
          {links.map((link) => {
            const active = isLinkActive(link, currentHref);
            const hasChildren = Boolean(link.children?.length);
            const dropdownOpen = openDropdown === link.label;

            if (!hasChildren) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => handleNavigate(link.href)}
                  className={linkClass(active)}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <div key={link.href} className="relative">
                <button
                  type="button"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  onClick={() =>
                    setOpenDropdown(dropdownOpen ? null : link.label)
                  }
                  className={clsx(
                    linkClass(active),
                    "flex items-center gap-[var(--ant-spacing-1)]",
                  )}
                >
                  {link.label}
                  <ChevronIcon />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: durationFast }}
                      className={clsx(
                        "absolute left-0 top-full mt-[var(--ant-spacing-2)] min-w-[var(--ant-spacing-48)]",
                        "rounded-[var(--ant-radius-md)] border",
                        surfaceClasses,
                        "p-[var(--ant-spacing-2)] shadow-[var(--ant-shadow-lg)]",
                      )}
                    >
                      {link.children?.map((child) => {
                        const childActive = child.href === currentHref;

                        return (
                          <a
                            key={child.href}
                            role="menuitem"
                            href={child.href}
                            aria-current={
                              childActive ? "page" : undefined
                            }
                            onClick={() => handleNavigate(child.href)}
                            className={clsx(
                              linkClass(childActive),
                              "block whitespace-nowrap",
                            )}
                          >
                            {child.label}
                          </a>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-[var(--ant-spacing-2)]">
          {darkMode && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Switch to dark theme"
                  : "Switch to light theme"
              }
              className={clsx(
                "inline-flex h-[var(--ant-spacing-9)] w-[var(--ant-spacing-9)] items-center justify-center rounded-[var(--ant-radius-md)]",
                interactiveSurfaceClasses,
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[var(--ant-color-brand-primary)]",
                "focus-visible:ring-offset-2",
              )}
            >
              <ThemeIcon theme={theme} />
            </button>
          )}

          {ctaButton && (
            <a
              href={ctaButton.href}
              onClick={() => handleNavigate(ctaButton.href)}
              className={clsx(
                "hidden rounded-[var(--ant-radius-md)] md:inline-flex",
                "bg-[var(--ant-color-brand-primary)]",
                "px-[var(--ant-spacing-4)] py-[var(--ant-spacing-2)]",
                "text-[length:var(--ant-typography-fontsize-sm)] font-medium",
                "text-[var(--ant-color-neutral-0)]",
                "hover:opacity-90",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[var(--ant-color-brand-primary)]",
                "focus-visible:ring-offset-2",
              )}
            >
              {ctaButton.label}
            </a>
          )}

          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls={drawerId}
            onClick={() => setMobileOpen((open) => !open)}
            className={clsx(
              "inline-flex h-[var(--ant-spacing-9)] w-[var(--ant-spacing-9)] items-center justify-center rounded-[var(--ant-radius-md)] md:hidden",
              interactiveSurfaceClasses,
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--ant-color-brand-primary)]",
              "focus-visible:ring-offset-2",
            )}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-[var(--ant-spacing-16)] z-[var(--ant-zIndex-overlay)] bg-[var(--ant-color-neutral-900)]/40 md:hidden"
            />

            <motion.div
              id={drawerId}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: durationSlow }}
              className={clsx(
                "fixed bottom-0 right-0 top-[var(--ant-spacing-16)] z-[var(--ant-zIndex-modal)] w-[min(90vw,var(--ant-spacing-96))]",
                "overflow-y-auto border-l",
                surfaceClasses,
                "p-[var(--ant-spacing-4)] md:hidden",
              )}
            >
              <div className="flex flex-col gap-[var(--ant-spacing-2)]">
                {links.map((link) => {
                  const active = isLinkActive(link, currentHref);
                  const hasChildren = Boolean(link.children?.length);
                  const dropdownOpen = openDropdown === link.label;

                  if (!hasChildren) {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => handleNavigate(link.href)}
                        className={linkClass(active)}
                      >
                        {link.label}
                      </a>
                    );
                  }

                  return (
                    <div key={link.href}>
                      <button
                        type="button"
                        aria-expanded={dropdownOpen}
                        onClick={() =>
                          setOpenDropdown(
                            dropdownOpen ? null : link.label,
                          )
                        }
                        className={clsx(
                          linkClass(active),
                          "flex w-full items-center justify-between",
                        )}
                      >
                        {link.label}
                        <ChevronIcon />
                      </button>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: durationFast }}
                            className="overflow-hidden"
                          >
                            <div
                              className={clsx(
                                "ml-[var(--ant-spacing-3)] mt-[var(--ant-spacing-1)]",
                                "flex flex-col gap-[var(--ant-spacing-1)]",
                                "border-l",
                                nestedBorderClass,
                                "pl-[var(--ant-spacing-3)]",
                              )}
                            >
                              {link.children?.map((child) => (
                                <a
                                  key={child.href}
                                  href={child.href}
                                  aria-current={
                                    child.href === currentHref
                                       ? "page"
                                      : undefined
                                  }
                                  onClick={() =>
                                    handleNavigate(child.href)
                                  }
                                  className={linkClass(
                                    child.href === currentHref,
                                  )}
                                >
                                  {child.label}
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {ctaButton && (
                  <a
                    href={ctaButton.href}
                    onClick={() => handleNavigate(ctaButton.href)}
                    className={clsx(
                      "mt-[var(--ant-spacing-2)] rounded-[var(--ant-radius-md)] text-center",
                      "bg-[var(--ant-color-brand-primary)]",
                      "px-[var(--ant-spacing-4)] py-[var(--ant-spacing-2)]",
                      "text-[length:var(--ant-typography-fontsize-sm)] font-medium",
                      "text-[var(--ant-color-neutral-0)]",
                      "focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-[var(--ant-color-brand-primary)]",
                      "focus-visible:ring-offset-2",
                    )}
                  >
                    {ctaButton.label}
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
