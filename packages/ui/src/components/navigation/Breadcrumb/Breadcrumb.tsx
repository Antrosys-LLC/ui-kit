import React from "react";
import { clsx } from "clsx";

export interface BreadcrumbItem {
  /** Label to display */
  label: string;
  /** Link URL */
  href?: string;
  /** Click handler for interactive navigation */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  /** Array of breadcrumb trail items */
  crumbs: BreadcrumbItem[];
  /** Custom separator node (default: '/') */
  separator?: React.ReactNode;
  /** Maximum visible items before collapsing with an ellipsis */
  maxVisible?: number;
  /** Enable schema.org JSON-LD script for SEO */
  jsonLd?: boolean;
  /** Callback triggered when any crumb link is clicked */
  onItemClick?: (crumb: BreadcrumbItem, index: number, e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function Breadcrumb({
  crumbs,
  separator = "/",
  maxVisible,
  jsonLd = false,
  onItemClick,
  className,
  ...props
}: BreadcrumbProps) {
  let visibleCrumbs = crumbs;
  let hasEllipsis = false;

  if (maxVisible && crumbs.length > maxVisible && maxVisible >= 2) {
    const first = crumbs.slice(0, 1);
    const last = crumbs.slice(crumbs.length - (maxVisible - 1));
    visibleCrumbs = [...first, { label: "..." }, ...last];
    hasEllipsis = true;
  }

  const structuredData = jsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.label,
          item: crumb.href || undefined,
        })),
      }
    : null;

  return (
    <>
      {jsonLd && structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <nav
        aria-label="Breadcrumb"
        className={clsx("ant-breadcrumb", className)}
        {...props}
      >
        <ol style={{ display: "flex", alignItems: "center", listStyle: "none", padding: 0, margin: 0 }}>
          {visibleCrumbs.map((crumb, index) => {
            const isLast = index === visibleCrumbs.length - 1;
            const isEllipsis = crumb.label === "..." && hasEllipsis;

            return (
              <li key={index} style={{ display: "inline-flex", alignItems: "center" }}>
                {isEllipsis ? (
                  <span aria-hidden="true" style={{ color: "var(--ant-color-neutral-400)" }}>
                    ...
                  </span>
                ) : isLast ? (
                  <span
                    aria-current="page"
                    style={{
                      color: "var(--ant-color-neutral-900)",
                      fontWeight: 600,
                    }}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <a
                    href={crumb.href || "#"}
                    onClick={(e) => {
                      if (crumb.onClick) {
                        crumb.onClick(e);
                      }
                      if (onItemClick) {
                        onItemClick(crumb, index, e);
                      }
                    }}
                    style={{
                      color: "var(--ant-color-neutral-600)",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    {crumb.label}
                  </a>
                )}

                {!isLast && (
                  <span
                    aria-hidden="true"
                    style={{
                      margin: "0 8px",
                      color: "var(--ant-color-neutral-400)",
                    }}
                  >
                    {separator}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
