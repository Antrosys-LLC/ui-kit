import "./tailwind.css";

// ── Providers ────────────────────────────────────────────────────────────────

export { ThemeProvider, ThemeContext } from "./providers/ThemeProvider";

export { ToastProvider, ToastContext, useToast } from "./providers/ToastProvider";

export type { Toast, ToastType } from "./providers/ToastProvider";

// ── Hooks ────────────────────────────────────────────────────────────────────

export { useScrollY } from "./hooks/useScrollY";

export { useMediaQuery } from "./hooks/useMediaQuery";

export { useTheme } from "./hooks/useTheme";

// ── Primitives (layout) ──────────────────────────────────────────────────────

export { Stack } from "./primitives/Stack";

export { Grid } from "./primitives/Grid";

export { Cluster } from "./primitives/Cluster";

// ── Feedback ─────────────────────────────────────────────────────────────────

export { Button } from "./components/feedback/Button";

export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "./components/feedback/Button";

// ── Media ────────────────────────────────────────────────────────────────────

export { Lightbox } from "./components/media/Lightbox";

export type { LightboxProps } from "./components/media/Lightbox";

// ── Data ─────────────────────────────────────────────────────────────────────

export { AvatarUserCard } from "./components/data/AvatarUserCard";

export type {
  AvatarUserCardProps,
  AvatarUserCardSize,
  AvatarUserCardStatus,
  SocialLink,
} from "./components/data/AvatarUserCard";

// ── Navigation ───────────────────────────────────────────────────────────────

export { Pagination } from "./components/navigation/Pagination";

export type { PaginationProps } from "./components/navigation/Pagination";