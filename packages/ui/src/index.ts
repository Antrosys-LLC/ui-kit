import "./tailwind.css";
// ── Providers ────────────────────────────────────────────────────────────────
export { ThemeProvider, ThemeContext } from "./providers/ThemeProvider";
export { ToastProvider, ToastContext, useToast } from "./providers/ToastProvider";
export type { Toast, ToastType } from "./providers/ToastProvider";

// ── Hooks ────────────────────────────────────────────────────────────────────
export { useScrollY }    from "./hooks/useScrollY";
export { useMediaQuery } from "./hooks/useMediaQuery";
export { useTheme }      from "./hooks/useTheme";

// ── Primitives (layout) ──────────────────────────────────────────────────────
export { Stack }   from "./primitives/Stack";
export { Grid }    from "./primitives/Grid";
export { Cluster } from "./primitives/Cluster";

// ── Feedback ─────────────────────────────────────────────────────────────────
export { Button } from "./components/feedback/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/feedback/Button";

// ── Data ─────────────────────────────────────────────────────────────────────
export { AvatarUserCard } from "./components/data/AvatarUserCard";
export type {
  AvatarUserCardProps,
  AvatarUserCardSize,
  AvatarUserCardStatus,
  SocialLink,
} from "./components/data/AvatarUserCard";

// ── Media ────────────────────────────────────────────────────────────────────
export { Video } from "./components/media/Video";
export type { VideoProps, CaptionTrack, VideoVariant, VideoSize } from "./components/media/Video";

// ── Navigation ───────────────────────────────────────────────────────────────
export { Breadcrumb } from "./components/navigation/Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./components/navigation/Breadcrumb";
export { Pagination } from "./components/navigation/Pagination";
export type { PaginationProps } from "./components/navigation/Pagination";

// ─────────────────────────────────────────────────────────────────────────────
// Add new component exports here as they are built.
// Convention: keep alphabetical within each category group.
// ─────────────────────────────────────────────────────────────────────────────