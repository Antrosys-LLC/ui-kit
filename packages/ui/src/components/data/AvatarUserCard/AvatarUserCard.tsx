import React, { useState, useContext, HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import { ThemeContext } from "../../../providers/ThemeProvider";

export type AvatarUserCardSize = "sm" | "md" | "lg";
export type AvatarUserCardStatus = "online" | "offline";

export interface SocialLink {
  /** Social platform name — used for accessible link labels */
  platform: string;
  /** Destination URL for the social profile */
  url: string;
  /** Optional custom icon; platform initial is shown if omitted */
  icon?: ReactNode;
}

export interface AvatarUserCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Display name of the user */
  name: string;
  /** Role, title, or subtitle under the name */
  role: string;
  /** Presence indicator shown on the avatar */
  status: AvatarUserCardStatus;
  /** Size preset for avatar, typography, and status dot */
  size?: AvatarUserCardSize;
  /** Optional avatar image URL; initials are used when missing or on load error */
  image?: string;
  /** Optional social profile links */
  socials?: SocialLink[];
}

/** Derive 1–2 character initials from a display name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const rootSizes: Record<AvatarUserCardSize, string> = {
  sm: "gap-[var(--ant-spacing-2)]",
  md: "gap-[var(--ant-spacing-3)]",
  lg: "gap-[var(--ant-spacing-4)]",
};

const avatarSizes: Record<AvatarUserCardSize, string> = {
  sm: "h-[var(--ant-spacing-8)] w-[var(--ant-spacing-8)] text-[length:var(--ant-typography-fontSize-xs)]",
  md: "h-[var(--ant-spacing-10)] w-[var(--ant-spacing-10)] text-[length:var(--ant-typography-fontSize-sm)]",
  lg: "h-14 w-14 text-[length:var(--ant-typography-fontSize-lg)]",
};

const statusSizes: Record<AvatarUserCardSize, string> = {
  sm: "h-[var(--ant-spacing-2)] w-[var(--ant-spacing-2)]",
  md: "h-2.5 w-2.5",
  lg: "h-3.5 w-3.5",
};

const nameSizes: Record<AvatarUserCardSize, string> = {
  sm: "text-[length:var(--ant-typography-fontSize-sm)]",
  md: "text-[length:var(--ant-typography-fontSize-base)]",
  lg: "text-[length:var(--ant-typography-fontSize-md)]",
};

const roleSizes: Record<AvatarUserCardSize, string> = {
  sm: "text-[length:var(--ant-typography-fontSize-xs)]",
  md: "text-[length:var(--ant-typography-fontSize-sm)]",
  lg: "text-[length:var(--ant-typography-fontSize-base)]",
};

const socialSizes: Record<AvatarUserCardSize, string> = {
  sm: "h-[var(--ant-spacing-6)] w-[var(--ant-spacing-6)] text-[length:var(--ant-typography-fontSize-xs)]",
  md: "h-7 w-7 text-[length:var(--ant-typography-fontSize-sm)]",
  lg: "h-[var(--ant-spacing-8)] w-[var(--ant-spacing-8)] text-[length:var(--ant-typography-fontSize-base)]",
};

const statusColors: Record<AvatarUserCardStatus, string> = {
  online:  "bg-[var(--ant-color-semantic-success)]",
  offline: "bg-[var(--ant-color-neutral-400)]",
};

export function AvatarUserCard({
  name,
  role,
  status,
  size = "md",
  image,
  socials,
  className,
  ...props
}: AvatarUserCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const themeCtx = useContext(ThemeContext);
  const isDark = themeCtx?.theme === "dark";

  const showImage = Boolean(image) && !imageFailed;
  const initials = getInitials(name);
  const hasSocials = Boolean(socials && socials.length > 0);

  return (
    <div
      className={clsx(
        "inline-flex max-w-full items-center",
        rootSizes[size],
        className,
      )}
      {...props}
    >
      {/* Avatar + status */}
      <div className="relative shrink-0">
        <div
          className={clsx(
            "flex items-center justify-center overflow-hidden rounded-[var(--ant-radius-full)]",
            "font-semibold select-none transition-colors",
            isDark
              ? "bg-[var(--ant-color-brand-primary-dk)] text-[var(--ant-color-brand-primary-lt)]"
              : "bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary-dk)]",
            avatarSizes[size],
          )}
          aria-hidden={showImage ? undefined : true}
        >
          {showImage ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
        </div>

        <span
          className={clsx(
            "absolute bottom-0 right-0 rounded-[var(--ant-radius-full)]",
            "ring-2 transition-colors",
            isDark
              ? "ring-[var(--ant-color-neutral-900)]"
              : "ring-[var(--ant-color-neutral-0)]",
            statusSizes[size],
            statusColors[status],
          )}
          role="status"
          aria-label={status === "online" ? "Online" : "Offline"}
        />
      </div>

      {/* Name, role, socials */}
      <div className="min-w-0 flex flex-col gap-[var(--ant-spacing-1)]">
        <div className="min-w-0">
          <p
            className={clsx(
              "truncate font-semibold leading-tight transition-colors",
              isDark
                ? "text-[var(--ant-color-neutral-0)]"
                : "text-[var(--ant-color-neutral-900)]",
              nameSizes[size],
            )}
          >
            {name}
          </p>
          <p
            className={clsx(
              "truncate leading-tight transition-colors",
              isDark
                ? "text-[var(--ant-color-neutral-400)]"
                : "text-[var(--ant-color-neutral-500)]",
              roleSizes[size],
            )}
          >
            {role}
          </p>
        </div>

        {hasSocials && (
          <ul
            className="flex flex-wrap items-center gap-[var(--ant-spacing-1)] list-none m-0 p-0"
            aria-label={`${name} social links`}
          >
            {socials!.map((social) => (
              <li key={`${social.platform}-${social.url}`}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on ${social.platform}`}
                  className={clsx(
                    "inline-flex items-center justify-center rounded-[var(--ant-radius-md)]",
                    "transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-[var(--ant-color-brand-primary)]",
                    "focus-visible:ring-offset-2",
                    isDark
                      ? [
                          "text-[var(--ant-color-brand-primary-lt)]",
                          "bg-[var(--ant-color-neutral-800)]",
                          "hover:bg-[var(--ant-color-brand-primary)] hover:text-[var(--ant-color-neutral-0)]",
                          "focus-visible:ring-offset-[var(--ant-color-neutral-900)]",
                        ]
                      : [
                          "text-[var(--ant-color-brand-primary)]",
                          "bg-[var(--ant-color-brand-primary-lt)]",
                          "hover:bg-[var(--ant-color-brand-primary)] hover:text-[var(--ant-color-neutral-0)]",
                          "focus-visible:ring-offset-[var(--ant-color-neutral-0)]",
                        ],
                    socialSizes[size],
                  )}
                >
                  {social.icon ?? (
                    <span aria-hidden="true" className="font-medium uppercase">
                      {social.platform.charAt(0)}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
