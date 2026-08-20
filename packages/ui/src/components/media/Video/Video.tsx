import React, { VideoHTMLAttributes } from "react";
import { clsx } from "clsx";

export type VideoVariant = "default" | "rounded" | "fullscreen";
export type VideoSize = "sm" | "md" | "lg" | "xl" | "full";

export interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  /** Video source URL */
  src: string;
  /** Poster image URL */
  poster?: string;
  /** Optional visual layout variant */
  variant?: VideoVariant;
  /** Optional width sizing preset */
  size?: VideoSize;
  /** Enables native player controls */
  controls?: boolean;
  /** Plays the video automatically when loaded */
  autoPlay?: boolean;
  /** Mutes the audio output by default (required for autoplay in most browsers) */
  muted?: boolean;
  /** Loops the video back to the beginning when it finishes */
  loop?: boolean;
  /** Custom CSS classes to apply to the video element */
  className?: string;
}

const sizePresets: Record<VideoSize, string> = {
  sm: "max-w-[320px] w-full",
  md: "max-w-[480px] w-full",
  lg: "max-w-[640px] w-full",
  xl: "max-w-[800px] w-full",
  full: "w-full",
};

/**
 * Video component for rendering local or hosted video content.
 * Styled using design tokens and Tailwind CSS to match the Antrosys Design System.
 */
export function Video({
  src,
  poster,
  variant = "default",
  size = "full",
  width,
  height,
  style,
  className,
  ...props
}: VideoProps) {
  const hasCustomSize = width !== undefined || height !== undefined;

  return (
    <video
      src={src}
      poster={poster}
      width={width}
      height={height}
      style={{
        width,
        height,
        ...style,
      }}
      className={clsx(
        variant !== "fullscreen" && !hasCustomSize && sizePresets[size],
        variant !== "fullscreen" && !height && "aspect-video",
        variant === "fullscreen" && "absolute inset-0 w-full h-full z-[var(--ant-zIndex-overlay)] object-cover bg-black border-none",
        "bg-[var(--ant-color-neutral-900)] object-cover",
        variant !== "fullscreen" && "border border-[var(--ant-color-surface-border)]",
        "transition-all duration-[var(--ant-motion-duration-normal)] ease-[var(--ant-motion-easing-default)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-2",
        variant === "rounded" && "rounded-[var(--ant-radius-lg)] overflow-hidden shadow-[var(--ant-shadow-md)]",
        className
      )}
      {...props}
    />
  );
}
