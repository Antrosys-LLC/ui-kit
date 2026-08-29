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

// ── Forms ────────────────────────────────────────────────────────────────────

export { Combobox } from "./components/forms/ComboBox";

export type { ComboboxProps, ComboboxOption } from "./components/forms/ComboBox";

export { MultiStepWizard } from "./components/forms/MultistepWizard";

export type {
  MultiStepWizardProps,
  WizardValues,
  WizardStep,
} from "./components/forms/MultistepWizard";

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

export { ChartSuite, DEFAULT_CHART_COLORS } from "./components/data/ChartSuite";

export type {
  ChartSuiteProps,
  ChartType,
  ChartSeries,
  HeatmapDataPoint,
} from "./components/data/ChartSuite";

export * from "./components/data/Timeline";

// ── Media ────────────────────────────────────────────────────────────────────

export { ImageCarousel } from "./components/media/ImageCarousel";

export type {
  CarouselImage,
  ImageCarouselProps,
} from "./components/media/ImageCarousel";

// ── Navigation ───────────────────────────────────────────────────────────────

export { Navbar } from "./components/navigation/Navbar";

export type {
  NavbarCtaButton,
  NavbarLink,
  NavbarProps,
} from "./components/navigation/Navbar";

export { Video } from "./components/media/Video";
export type { VideoProps, CaptionTrack, VideoVariant, VideoSize } from "./components/media/Video";

// ── Forms ────────────────────────────────────────────────────────────────────

export { RichTextEditor } from "./components/forms/RichTextEditor";

export type {
  RichTextEditorProps,
  ToolbarItem,
  OutputFormat,
} from "./components/forms/RichTextEditor";

// ── Navigation ───────────────────────────────────────────────────────────────
export { Breadcrumb } from "./components/navigation/Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./components/navigation/Breadcrumb";
export { Pagination } from "./components/navigation/Pagination";

export type { PaginationProps } from "./components/navigation/Pagination";

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
