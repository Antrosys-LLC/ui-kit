import React, {
  forwardRef,
  useId,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  HTMLAttributes,
  MouseEvent,
} from "react";
import { clsx } from "clsx";
import { ThemeContext } from "../../../providers/ThemeProvider";
import { Button, ButtonSize } from "../Button";

// ── Types ────────────────────────────────────────────────────────────────────

export type EmptyStatePreset = "no-data" | "error-404" | "offline" | "no-results";
export type EmptyStateSize = "sm" | "md" | "lg";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Pre-configured empty state preset illustration and copy.
   * - `no-data`: friendly illustration for empty data collections
   * - `error-404`: page-not-found illustration
   * - `offline`: connection-lost illustration
   * - `no-results`: zero search or filter results illustration
   * @default "no-data"
   */
  preset?: EmptyStatePreset;

  /**
   * Custom primary heading. If omitted, a preset-specific default title is displayed.
   */
  title?: ReactNode;

  /**
   * Custom explanatory body copy. If omitted, a preset-specific default description is displayed.
   */
  description?: ReactNode;

  /**
   * Optional action button label. When provided, renders a primary call-to-action button.
   */
  actionLabel?: ReactNode;

  /**
   * Optional click callback for the action button.
   */
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Optional custom illustration replacing the preset's built-in SVG artwork.
   */
  illustration?: ReactNode;

  /**
   * Sizing preset controlling padding, illustration dimensions, and typographic scale.
   * - `sm`: compact layout for sidebars, widgets, or small cards
   * - `md`: standard layout for panels, containers, and data tables
   * - `lg`: expansive layout for full-page views or prominent empty states
   * @default "md"
   */
  size?: EmptyStateSize;

  /**
   * Optional additional CSS class names.
   */
  className?: string;
}

// ── Preset Defaults ──────────────────────────────────────────────────────────

interface PresetContent {
  title: string;
  description: string;
  actionLabel?: string;
}

const PRESET_DEFAULTS: Record<EmptyStatePreset, PresetContent> = {
  "no-data": {
    title: "No data available",
    description: "There is no data to display right now. Try adding items or check back later.",
    actionLabel: "Add item",
  },
  "error-404": {
    title: "Page not found",
    description: "The page or resource you are looking for does not exist or may have been moved.",
    actionLabel: "Back to home",
  },
  "offline": {
    title: "Connection lost",
    description: "You are currently offline. Check your network connection and try again.",
    actionLabel: "Retry connection",
  },
  "no-results": {
    title: "No results found",
    description: "We couldn't find any matches for your query. Try adjusting your search or filters.",
    actionLabel: "Clear search",
  },
};

// ── Preset SVG Illustrations ─────────────────────────────────────────────────

interface IllustrationProps {
  isDark: boolean;
}

function NoDataIllustration({ isDark }: IllustrationProps) {
  const cardFill = isDark ? "var(--ant-color-neutral-800)" : "var(--ant-color-surface-bg-card)";
  const cardStroke = isDark ? "var(--ant-color-neutral-700)" : "var(--ant-color-surface-border)";
  const headerStrip = isDark ? "var(--ant-color-neutral-700)" : "var(--ant-color-brand-primary-lt)";
  const ghostLine = isDark ? "var(--ant-color-neutral-400)" : "var(--ant-color-surface-text-sub)";
  const glowFill = isDark ? "var(--ant-color-brand-primary)" : "var(--ant-color-brand-primary-lt)";
  const glowOpacity = isDark ? "0.18" : "0.32";

  return (
    <svg
      viewBox="0 0 160 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
      focusable="false"
    >
      {/* Soft ground pedestal */}
      <ellipse
        cx="80"
        cy="104"
        rx="56"
        ry="12"
        fill="var(--ant-color-brand-primary)"
        fillOpacity={isDark ? "0.2" : "0.08"}
      />

      {/* Ambient background disc */}
      <circle
        cx="80"
        cy="56"
        r="44"
        fill={glowFill}
        fillOpacity={glowOpacity}
      />

      {/* Layered back card (angled depth) */}
      <rect
        x="40"
        y="28"
        width="76"
        height="56"
        rx="8"
        transform="rotate(-5 40 28)"
        fill={cardFill}
        stroke={cardStroke}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity={isDark ? "0.45" : "0.6"}
      />

      {/* Primary front card */}
      <rect
        x="42"
        y="32"
        width="76"
        height="64"
        rx="8"
        fill={cardFill}
        stroke={cardStroke}
        strokeWidth="1.5"
      />

      {/* Card header strip */}
      <path
        d="M42 40C42 35.5817 45.5817 32 50 32H110C114.418 32 118 35.5817 118 40V46H42V40Z"
        fill={headerStrip}
        fillOpacity={isDark ? "0.65" : "0.45"}
      />
      <circle cx="52" cy="39" r="2" fill="var(--ant-color-brand-primary)" fillOpacity={isDark ? "0.9" : "0.7"} />
      <circle cx="58" cy="39" r="2" fill={isDark ? "var(--ant-color-neutral-600)" : "var(--ant-color-surface-border)"} />
      <circle cx="64" cy="39" r="2" fill={isDark ? "var(--ant-color-neutral-600)" : "var(--ant-color-surface-border)"} />

      {/* Empty slot container */}
      <rect
        x="52"
        y="54"
        width="56"
        height="32"
        rx="6"
        fill="none"
        stroke={cardStroke}
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* Ghost content lines */}
      <line
        x1="62"
        y1="64"
        x2="98"
        y2="64"
        stroke={ghostLine}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity={isDark ? "0.55" : "0.35"}
      />
      <line
        x1="62"
        y1="73"
        x2="86"
        y2="73"
        stroke={ghostLine}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity={isDark ? "0.35" : "0.2"}
      />

      {/* Decorative brand accents */}
      <path
        d="M124 24L125.5 28.5L130 30L125.5 31.5L124 36L122.5 31.5L118 30L122.5 28.5L124 24Z"
        fill="var(--ant-color-brand-accent)"
      />
      <circle
        cx="32"
        cy="44"
        r="3"
        fill="var(--ant-color-brand-primary)"
        fillOpacity={isDark ? "0.6" : "0.4"}
      />
      <circle
        cx="114"
        cy="70"
        r="11"
        fill="var(--ant-color-brand-primary)"
      />
      <path
        d="M114 65V75M109 70H119"
        stroke="var(--ant-color-neutral-0)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Error404Illustration({ isDark }: IllustrationProps) {
  const cardFill = isDark ? "var(--ant-color-neutral-800)" : "var(--ant-color-surface-bg-card)";
  const cardStroke = isDark ? "var(--ant-color-neutral-700)" : "var(--ant-color-surface-border)";
  const headerStrip = isDark ? "var(--ant-color-neutral-700)" : "var(--ant-color-surface-border)";
  const glowFill = isDark ? "var(--ant-color-brand-primary)" : "var(--ant-color-brand-primary-lt)";
  const glowOpacity = isDark ? "0.18" : "0.28";

  return (
    <svg
      viewBox="0 0 160 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
      focusable="false"
    >
      {/* Ground shadow */}
      <ellipse
        cx="80"
        cy="104"
        rx="56"
        ry="12"
        fill="var(--ant-color-brand-primary)"
        fillOpacity={isDark ? "0.2" : "0.08"}
      />

      {/* Background radial disc */}
      <circle
        cx="80"
        cy="56"
        r="44"
        fill={glowFill}
        fillOpacity={glowOpacity}
      />

      {/* Severed route dashes on ground */}
      <path
        d="M48 98L68 86M92 86L112 98"
        stroke={cardStroke}
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      {/* Main card display */}
      <rect
        x="36"
        y="24"
        width="88"
        height="64"
        rx="10"
        fill={cardFill}
        stroke={cardStroke}
        strokeWidth="1.5"
      />

      {/* Window bar */}
      <path
        d="M36 34C36 28.4772 40.4772 24 46 24H114C119.523 24 124 28.4772 124 34V36H36V34Z"
        fill={headerStrip}
        fillOpacity={isDark ? "0.6" : "0.4"}
      />
      <circle cx="46" cy="30" r="2" fill="var(--ant-color-semantic-error)" fillOpacity="0.85" />
      <circle cx="52" cy="30" r="2" fill="var(--ant-color-semantic-warning)" fillOpacity="0.85" />
      <circle cx="58" cy="30" r="2" fill="var(--ant-color-semantic-success)" fillOpacity="0.85" />

      {/* Stylized geometric 404 artwork */}
      {/* Digit '4' */}
      <path
        d="M54 50V62H65M65 46V68"
        stroke={isDark ? "var(--ant-color-brand-primary-lt)" : "var(--ant-color-brand-primary)"}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Digit '0' with slash */}
      <rect
        x="72"
        y="46"
        width="16"
        height="22"
        rx="6"
        stroke="var(--ant-color-semantic-warning)"
        strokeWidth="2.5"
      />
      <line
        x1="74"
        y1="66"
        x2="86"
        y2="48"
        stroke="var(--ant-color-semantic-warning)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Digit '4' */}
      <path
        d="M95 50V62H106M106 46V68"
        stroke={isDark ? "var(--ant-color-brand-primary-lt)" : "var(--ant-color-brand-primary)"}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Floating warning badge */}
      <circle
        cx="120"
        cy="28"
        r="11"
        fill={cardFill}
        stroke="var(--ant-color-semantic-warning)"
        strokeWidth="1.5"
      />
      <path
        d="M120 23V28M120 32V32.5"
        stroke="var(--ant-color-semantic-warning)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Satellite disconnect node */}
      <circle
        cx="26"
        cy="48"
        r="4"
        fill="var(--ant-color-brand-accent)"
        fillOpacity="0.75"
      />
      <path
        d="M32 50L40 56"
        stroke="var(--ant-color-brand-accent)"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OfflineIllustration({ isDark }: IllustrationProps) {
  const cardFill = isDark ? "var(--ant-color-neutral-800)" : "var(--ant-color-surface-bg-card)";
  const cardStroke = isDark ? "var(--ant-color-neutral-700)" : "var(--ant-color-surface-border)";
  const glowFill = isDark ? "var(--ant-color-brand-primary)" : "var(--ant-color-brand-primary-lt)";
  const glowOpacity = isDark ? "0.18" : "0.25";
  const waveColor = isDark ? "var(--ant-color-brand-primary-lt)" : "var(--ant-color-brand-primary)";
  const subWaveColor = isDark ? "var(--ant-color-neutral-500)" : "var(--ant-color-surface-text-sub)";

  return (
    <svg
      viewBox="0 0 160 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
      focusable="false"
    >
      {/* Ground shadow */}
      <ellipse
        cx="80"
        cy="104"
        rx="54"
        ry="12"
        fill="var(--ant-color-brand-primary)"
        fillOpacity={isDark ? "0.2" : "0.08"}
      />

      {/* Backdrop circular glow */}
      <circle
        cx="80"
        cy="56"
        r="44"
        fill={glowFill}
        fillOpacity={glowOpacity}
      />

      {/* Wi-Fi broadcast signal waves */}
      <path
        d="M58 32C70 21 90 21 102 32"
        stroke={subWaveColor}
        strokeWidth="2"
        strokeDasharray="3 3"
        strokeLinecap="round"
        opacity={isDark ? "0.55" : "0.45"}
      />
      <path
        d="M67 40C74 33 86 33 93 40"
        stroke={waveColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="80" cy="47" r="2.5" fill={waveColor} />

      {/* Cloud silhouette */}
      <path
        d="M52 74C46.4772 74 42 69.5228 42 64C42 59.0426 45.6053 54.9272 50.3601 54.1292C51.6888 44.5262 59.9406 37 70 37C78.4717 37 85.6601 42.3168 88.3582 49.8398C90.3541 48.6946 92.6841 48 95.1667 48C103.359 48 110 54.4924 110 62.5C110 63.0232 109.973 63.5398 109.92 64.048C114.475 64.9754 118 68.9669 118 74C118 79.5228 113.523 84 108 84H52C46.4772 84 42 79.5228 42 74"
        fill={cardFill}
        stroke={cardStroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Receiver base line */}
      <path
        d="M72 88H88M80 88V98M74 98H86"
        stroke={cardStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Floating disconnection badge */}
      <circle
        cx="100"
        cy="74"
        r="13"
        fill={cardFill}
        stroke="var(--ant-color-semantic-error)"
        strokeWidth="1.5"
      />
      <line
        x1="92"
        y1="66"
        x2="108"
        y2="82"
        stroke="var(--ant-color-semantic-error)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <circle cx="94.5" cy="79.5" r="1.5" fill="var(--ant-color-semantic-error)" />
      <circle cx="105.5" cy="68.5" r="1.5" fill="var(--ant-color-semantic-error)" />

      {/* Lost connection packet dots */}
      <circle cx="34" cy="50" r="3" fill={subWaveColor} opacity={isDark ? "0.45" : "0.35"} />
      <circle cx="128" cy="44" r="2.5" fill="var(--ant-color-brand-accent)" opacity="0.8" />
    </svg>
  );
}

function NoResultsIllustration({ isDark }: IllustrationProps) {
  const cardFill = isDark ? "var(--ant-color-neutral-800)" : "var(--ant-color-surface-bg-card)";
  const cardStroke = isDark ? "var(--ant-color-neutral-700)" : "var(--ant-color-surface-border)";
  const headerStrip = isDark ? "var(--ant-color-neutral-700)" : "var(--ant-color-surface-border)";
  const ghostLine = isDark ? "var(--ant-color-neutral-400)" : "var(--ant-color-surface-text-sub)";
  const glowFill = isDark ? "var(--ant-color-brand-primary)" : "var(--ant-color-brand-primary-lt)";
  const glowOpacity = isDark ? "0.18" : "0.3";
  const lensStroke = isDark ? "var(--ant-color-brand-primary-lt)" : "var(--ant-color-brand-primary)";

  return (
    <svg
      viewBox="0 0 160 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
      focusable="false"
    >
      {/* Ground shadow */}
      <ellipse
        cx="80"
        cy="104"
        rx="54"
        ry="12"
        fill="var(--ant-color-brand-primary)"
        fillOpacity={isDark ? "0.2" : "0.08"}
      />

      {/* Backdrop circular glow */}
      <circle
        cx="76"
        cy="54"
        r="44"
        fill={glowFill}
        fillOpacity={glowOpacity}
      />

      {/* Background search document / table sheet */}
      <rect
        x="36"
        y="24"
        width="72"
        height="64"
        rx="8"
        fill={cardFill}
        stroke={cardStroke}
        strokeWidth="1.5"
      />

      {/* Search query header bar */}
      <rect
        x="44"
        y="32"
        width="56"
        height="8"
        rx="4"
        fill={headerStrip}
        fillOpacity={isDark ? "0.6" : "0.5"}
      />

      {/* Empty row placeholder dashes */}
      <line
        x1="44"
        y1="49"
        x2="80"
        y2="49"
        stroke={ghostLine}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeLinecap="round"
        opacity={isDark ? "0.5" : "0.4"}
      />
      <line
        x1="44"
        y1="59"
        x2="70"
        y2="59"
        stroke={ghostLine}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeLinecap="round"
        opacity={isDark ? "0.4" : "0.3"}
      />
      <line
        x1="44"
        y1="69"
        x2="76"
        y2="69"
        stroke={ghostLine}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeLinecap="round"
        opacity={isDark ? "0.3" : "0.2"}
      />

      {/* Prominent magnifying glass */}
      {/* Lens backplate & outline */}
      <circle
        cx="96"
        cy="62"
        r="24"
        fill={cardFill}
        fillOpacity={isDark ? "0.95" : "0.9"}
        stroke={lensStroke}
        strokeWidth="3"
      />

      {/* Glass tint highlight */}
      <path
        d="M82 50C88 44 98 44 104 49"
        stroke="var(--ant-color-brand-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Empty / zero match marker inside lens */}
      <path
        d="M91 57L101 67M101 57L91 67"
        stroke={ghostLine}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={isDark ? "0.7" : "0.55"}
      />

      {/* Magnifier handle */}
      <path
        d="M113 79L129 95"
        stroke="var(--ant-color-brand-primary)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="126"
        y1="92"
        x2="131"
        y2="97"
        stroke="var(--ant-color-brand-primary-dk)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Decorative stars */}
      <path
        d="M30 36L31.5 40.5L36 42L31.5 43.5L30 48L28.5 43.5L24 42L28.5 40.5L30 36Z"
        fill="var(--ant-color-brand-accent)"
      />
      <path
        d="M128 32L129 35L132 36L129 37L128 40L127 37L124 36L127 35L128 32Z"
        fill={isDark ? "var(--ant-color-brand-primary-lt)" : "var(--ant-color-brand-primary)"}
        fillOpacity={isDark ? "0.8" : "0.6"}
      />
    </svg>
  );
}

const PRESET_ILLUSTRATIONS: Record<EmptyStatePreset, (props: IllustrationProps) => React.JSX.Element> = {
  "no-data": NoDataIllustration,
  "error-404": Error404Illustration,
  "offline": OfflineIllustration,
  "no-results": NoResultsIllustration,
};

// ── Size Configuration ───────────────────────────────────────────────────────

interface SizeStyle {
  container: string;
  illustrationWrapper: string;
  title: string;
  description: string;
  actionMargin: string;
  buttonSize: ButtonSize;
}

const SIZE_STYLES: Record<EmptyStateSize, SizeStyle> = {
  sm: {
    container: "max-w-sm py-[var(--ant-spacing-6)] px-[var(--ant-spacing-4)]",
    illustrationWrapper: "w-[calc(var(--ant-spacing-24)+var(--ant-spacing-4))] h-[calc(var(--ant-spacing-20)+var(--ant-spacing-2))]",
    title: "text-[length:var(--ant-typography-fontSize-md)] font-[var(--ant-typography-fontWeight-semibold)] mt-[var(--ant-spacing-3)]",
    description: "text-[length:var(--ant-typography-fontSize-xs)] mt-[var(--ant-spacing-1)] max-w-xs",
    actionMargin: "mt-[var(--ant-spacing-4)]",
    buttonSize: "sm",
  },
  md: {
    container: "max-w-md py-[var(--ant-spacing-8)] px-[var(--ant-spacing-6)]",
    illustrationWrapper: "w-[calc(var(--ant-spacing-20)*2)] h-[calc(var(--ant-spacing-16)*2)]",
    title: "text-[length:var(--ant-typography-fontSize-xl)] font-[var(--ant-typography-fontWeight-semibold)] mt-[var(--ant-spacing-4)]",
    description: "text-[length:var(--ant-typography-fontSize-sm)] mt-[var(--ant-spacing-2)] max-w-sm",
    actionMargin: "mt-[var(--ant-spacing-5)]",
    buttonSize: "md",
  },
  lg: {
    container: "max-w-xl py-[var(--ant-spacing-12)] px-[var(--ant-spacing-8)]",
    illustrationWrapper: "w-[calc(var(--ant-spacing-24)*2)] h-[calc(var(--ant-spacing-20)*2)]",
    title: "text-[length:var(--ant-typography-fontSize-2xl)] font-[var(--ant-typography-fontWeight-bold)] mt-[var(--ant-spacing-6)]",
    description: "text-[length:var(--ant-typography-fontSize-base)] mt-[var(--ant-spacing-3)] max-w-md",
    actionMargin: "mt-[var(--ant-spacing-6)]",
    buttonSize: "lg",
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    {
      preset = "no-data",
      title,
      description,
      actionLabel,
      onAction,
      illustration,
      size = "md",
      className,
      ...rest
    },
    forwardedRef
  ) {
    const id = useId();
    const titleId = `${id}-title`;
    const descId = `${id}-desc`;

    const containerRef = useRef<HTMLDivElement | null>(null);

    // Merge forwardedRef with local containerRef
    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    // Robust theme resolution: ThemeContext > closest DOM ancestor > documentElement
    const themeCtx = useContext(ThemeContext);
    const [isDarkDom, setIsDarkDom] = useState<boolean>(false);

    useEffect(() => {
      if (typeof document === "undefined") return;

      const resolveDark = () => {
        if (themeCtx?.theme === "dark") {
          setIsDarkDom(true);
          return;
        }
        if (themeCtx?.theme === "light") {
          setIsDarkDom(false);
          return;
        }

        // Inspect closest container with data-theme or dark class
        const el = containerRef.current;
        if (el) {
          const closest = el.closest<HTMLElement>("[data-theme], .dark");
          if (closest) {
            const hasDark =
              closest.getAttribute("data-theme") === "dark" ||
              closest.classList.contains("dark");
            setIsDarkDom(hasDark);
            return;
          }
        }

        // Fallback to document root
        const docDark =
          document.documentElement.getAttribute("data-theme") === "dark" ||
          document.documentElement.classList.contains("dark");
        setIsDarkDom(docDark);
      };

      resolveDark();

      const observer = new MutationObserver(resolveDark);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
      });

      if (containerRef.current) {
        let parent = containerRef.current.parentElement;
        while (parent && parent !== document.body) {
          observer.observe(parent, {
            attributes: true,
            attributeFilter: ["data-theme", "class"],
          });
          parent = parent.parentElement;
        }
      }

      return () => observer.disconnect();
    }, [themeCtx?.theme]);

    const isDark = themeCtx?.theme === "dark" || isDarkDom;

    const presetContent = PRESET_DEFAULTS[preset] ?? PRESET_DEFAULTS["no-data"];
    const resolvedTitle = title ?? presetContent.title;
    const resolvedDescription = description ?? presetContent.description;
    const resolvedActionLabel = actionLabel ?? (onAction ? presetContent.actionLabel : undefined);

    const sizeStyle = SIZE_STYLES[size] ?? SIZE_STYLES.md;
    const DefaultIllustration = PRESET_ILLUSTRATIONS[preset] ?? PRESET_ILLUSTRATIONS["no-data"];

    return (
      <div
        ref={setRefs}
        role="region"
        aria-labelledby={resolvedTitle ? titleId : undefined}
        aria-describedby={resolvedDescription ? descId : undefined}
        className={clsx(
          "flex flex-col items-center justify-center text-center mx-auto w-full",
          "font-[var(--ant-typography-fontFamily-sans)]",
          "transition-colors duration-[var(--ant-motion-duration-normal)]",
          "motion-reduce:transition-none",
          sizeStyle.container,
          className
        )}
        {...rest}
      >
        {/* Illustration container */}
        <div
          aria-hidden="true"
          className={clsx(
            "flex items-center justify-center shrink-0",
            sizeStyle.illustrationWrapper
          )}
        >
          {illustration ? illustration : <DefaultIllustration isDark={isDark} />}
        </div>

        {/* Headline */}
        {resolvedTitle && (
          <h3
            id={titleId}
            className={clsx(
              // Light mode surface text
              "text-[var(--ant-color-surface-text)]",
              // Dark mode high contrast text (tokens: neutral-50 / neutral-0)
              "dark:text-[var(--ant-color-neutral-50)]",
              "[.dark_&]:text-[var(--ant-color-neutral-50)]",
              "[[data-theme=dark]_&]:text-[var(--ant-color-neutral-50)]",
              isDark && "text-[var(--ant-color-neutral-50)]",
              "leading-[var(--ant-typography-lineHeight-tight)]",
              "m-0 tracking-tight",
              sizeStyle.title
            )}
          >
            {resolvedTitle}
          </h3>
        )}

        {/* Description */}
        {resolvedDescription && (
          <p
            id={descId}
            className={clsx(
              // Light mode subtitle
              "text-[var(--ant-color-surface-text-sub)]",
              // Dark mode high contrast subtitle (token: neutral-400)
              "dark:text-[var(--ant-color-neutral-400)]",
              "[.dark_&]:text-[var(--ant-color-neutral-400)]",
              "[[data-theme=dark]_&]:text-[var(--ant-color-neutral-400)]",
              isDark && "text-[var(--ant-color-neutral-400)]",
              "leading-[var(--ant-typography-lineHeight-normal)]",
              "m-0",
              sizeStyle.description
            )}
          >
            {resolvedDescription}
          </p>
        )}

        {/* Optional Action Button */}
        {resolvedActionLabel && (
          <div className={sizeStyle.actionMargin}>
            <Button
              variant="primary"
              size={sizeStyle.buttonSize}
              onClick={onAction}
              className={clsx(
                "shadow-[var(--ant-shadow-sm)]",
                "focus-visible:ring-offset-[var(--ant-color-surface-bg-card)]",
                "dark:focus-visible:ring-offset-[var(--ant-color-neutral-900)]",
                "[.dark_&]:focus-visible:ring-offset-[var(--ant-color-neutral-900)]",
                "[[data-theme=dark]_&]:focus-visible:ring-offset-[var(--ant-color-neutral-900)]"
              )}
            >
              {resolvedActionLabel}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
