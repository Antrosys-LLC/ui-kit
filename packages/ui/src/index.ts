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

// ─────────────────────────────────────────────────────────────────────────────
// Add new component exports here as they are built.
// Convention: keep alphabetical within each category group.
// ─────────────────────────────────────────────────────────────────────────────

// Navigation
export { Sidebar } from "./components/navigation/Sidebar";
export type {
  SidebarProps,
  SidebarItem,
  SidebarUserProfile,
} from "./components/navigation/Sidebar";
