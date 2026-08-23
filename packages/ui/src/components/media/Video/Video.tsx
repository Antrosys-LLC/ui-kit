import React, { useState, useRef, useEffect, VideoHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface CaptionTrack {
  /** Source URL of the text track (.vtt file) */
  src: string;
  /** Label for the text track */
  label: string;
  /** Language tag (e.g. 'en') */
  srcLang: string;
  /** Whether this is the default track */
  default?: boolean;
}

export type VideoVariant = "default" | "rounded";
export type VideoSize = "sm" | "md" | "lg" | "xl" | "full";

export interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  /** Video source URL or embed ID */
  src: string;
  /** Poster image URL */
  poster?: string;
  /** Optional visual layout variant */
  variant?: VideoVariant;
  /** Sizing preset */
  size?: VideoSize;
  /** Optional list of caption tracks for standard video element */
  captions?: CaptionTrack[];
  /** Video player embed type */
  embedType?: "html5" | "youtube" | "vimeo";
  /** Plays the video automatically when loaded (lowercase option) */
  autoplay?: boolean;
  /** Force/simulate loading buffering state */
  loading?: boolean;
}

const sizePresets: Record<VideoSize, string> = {
  sm: "max-w-[var(--ant-video-size-sm)] w-full",
  md: "max-w-[var(--ant-video-size-md)] w-full",
  lg: "max-w-[var(--ant-video-size-lg)] w-full",
  xl: "max-w-[var(--ant-video-size-xl)] w-full",
  full: "w-full",
};

function getYouTubeEmbedUrl(src: string, autoplay?: boolean, loop?: boolean, muted?: boolean) {
  let videoId = src;
  const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?vi?=|&vi?=))([^#&?]*).*/;
  const match = src.match(youtubeRegex);
  if (match && match[1]) {
    videoId = match[1];
  }
  
  const params = new URLSearchParams();
  params.append("autoplay", autoplay ? "1" : "0");
  params.append("mute", muted ? "1" : "0");
  params.append("controls", "1");
  params.append("rel", "0");
  
  if (loop) {
    params.append("loop", "1");
    params.append("playlist", videoId);
  }
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function getVimeoEmbedUrl(src: string, autoplay?: boolean, loop?: boolean, muted?: boolean) {
  let videoId = src;
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
  const match = src.match(vimeoRegex);
  if (match && match[1]) {
    videoId = match[1];
  }
  
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    muted: muted ? "1" : "0",
    loop: loop ? "1" : "0",
    badge: "0",
    autopause: "0",
  });
  
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

export function Video({
  src,
  poster,
  variant = "default",
  size = "full",
  captions,
  embedType,
  autoplay,
  autoPlay,
  loop,
  muted,
  controls = true,
  loading = false,
  width,
  height,
  className,
  ...props
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-detect embed type if not explicitly provided
  const detectedEmbedType = React.useMemo(() => {
    if (embedType) return embedType;
    if (src.includes("youtube.com") || src.includes("youtu.be")) return "youtube";
    if (src.includes("vimeo.com")) return "vimeo";
    return "html5";
  }, [src, embedType]);

  // Combined autoplay, loop, muted logic
  const isAutoplay = !!(autoplay || autoPlay);
  const isLoop = !!loop;
  const isMutedDefault = !!muted;

  // React State for Custom Controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(isMutedDefault);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControlsOverlay, setShowControlsOverlay] = useState(true);

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = () => {
    setShowControlsOverlay(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControlsOverlay(false);
      }, 2500);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (!videoRef.current.paused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((err) => {
        console.warn("Playback prevented or interrupted: ", err);
      });
    }
  };

  // Sync state from Video Element events
  const onPlayEvent = () => setIsPlaying(true);
  const onPauseEvent = () => setIsPlaying(false);
  const onTimeUpdateEvent = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  const onDurationChangeEvent = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  const onVolumeChangeEvent = () => {
    if (videoRef.current) {
      setVolume(videoRef.current.volume);
      setIsMuted(videoRef.current.muted);
    }
  };
  const onWaitingEvent = () => setIsBuffering(true);
  const onPlayingEvent = () => setIsBuffering(false);

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Handle volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const vol = parseFloat(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
    if (vol > 0 && isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle captions visibility
  const toggleCaptions = () => {
    setShowCaptions((prev) => !prev);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncTracks = () => {
      const tracks = video.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = showCaptions ? "showing" : "disabled";
      }
    };

    // Run sync immediately
    syncTracks();

    // Re-run sync when new tracks are dynamically loaded by the browser
    video.textTracks.addEventListener("addtrack", syncTracks);
    return () => {
      video.textTracks.removeEventListener("addtrack", syncTracks);
    };
  }, [showCaptions, captions]);

  // Format time (e.g. 1:23)
  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const hasCustomSize = width !== undefined || height !== undefined;
  const showSpinner = loading || isBuffering;
  const focusRingClass = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-1";

  // Render iframe for YouTube or Vimeo
  if (detectedEmbedType === "youtube" || detectedEmbedType === "vimeo") {
    const embedUrl =
      detectedEmbedType === "youtube"
        ? getYouTubeEmbedUrl(src, isAutoplay, isLoop, isMutedDefault)
        : getVimeoEmbedUrl(src, isAutoplay, isLoop, isMutedDefault);

    return (
      <div
        ref={containerRef}
        style={{
          width,
          height,
        }}
        className={clsx(
          "relative overflow-hidden bg-[var(--ant-color-neutral-900)]",
          !hasCustomSize && sizePresets[size],
          !height && "aspect-video",
          variant === "rounded" && "rounded-[var(--ant-radius-lg)] shadow-[var(--ant-shadow-md)]",
          className
        )}
      >
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={`${detectedEmbedType} video player`}
        />
      </div>
    );
  }

  // Render Custom Skinned HTML5 Video Player
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onFocus={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControlsOverlay(false)}
      style={{
        width,
        height,
      }}
      className={clsx(
        "relative overflow-hidden bg-[var(--ant-color-neutral-900)] group select-none flex items-center justify-center",
        !hasCustomSize && sizePresets[size],
        !height && "aspect-video",
        variant === "rounded" && "rounded-[var(--ant-radius-lg)] shadow-[var(--ant-shadow-md)]",
        className
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={isAutoplay}
        loop={isLoop}
        muted={isMutedDefault}
        onPlay={onPlayEvent}
        onPause={onPauseEvent}
        onTimeUpdate={onTimeUpdateEvent}
        onDurationChange={onDurationChangeEvent}
        onVolumeChange={onVolumeChangeEvent}
        onWaiting={onWaitingEvent}
        onPlaying={onPlayingEvent}
        className="w-full h-full object-cover"
        crossOrigin={props.crossOrigin ?? (captions && captions.length > 0 ? "anonymous" : undefined)}
        onClick={togglePlay}
        {...props}
      >
        {captions?.map((track, idx) => (
          <track
            key={idx}
            kind="captions"
            src={track.src}
            label={track.label}
            srcLang={track.srcLang}
            default={track.default}
          />
        ))}
        Your browser does not support HTML5 video.
      </video>

      {/* Buffering/Loading Spinner */}
      {showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--ant-color-overlay-backdrop)] pointer-events-none transition-opacity duration-[var(--ant-motion-duration-normal)]">
          <svg className="animate-spin w-[var(--ant-spacing-10)] h-[var(--ant-spacing-10)] text-[var(--ant-color-brand-primary)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      )}

      {/* Big Play Overlay (when paused or not started, only if controls are enabled) */}
      {controls && !isPlaying && !showSpinner && (
        <button
          onClick={togglePlay}
          className={clsx(
            "cursor-pointer absolute flex items-center justify-center w-[var(--ant-spacing-16)] h-[var(--ant-spacing-16)] rounded-[var(--ant-radius-full)] bg-[var(--ant-color-overlay-bg)] hover:bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-overlay-text)] hover:scale-105 transition-all duration-[var(--ant-motion-duration-fast)] ease-out shadow-[var(--ant-shadow-lg)] backdrop-blur-md border border-[var(--ant-color-overlay-border)]",
            focusRingClass
          )}
          aria-label="Play video"
        >
          <svg className="w-[var(--ant-spacing-6)] h-[var(--ant-spacing-6)] fill-current ml-[var(--ant-spacing-1)]" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {/* Custom Controls Overlay */}
      {controls && (
        <div
          onFocus={handleMouseMove}
          className={clsx(
            "absolute bottom-[var(--ant-spacing-3)] left-[var(--ant-spacing-3)] right-[var(--ant-spacing-3)] bg-[var(--ant-color-overlay-bg)] backdrop-blur-md border border-[var(--ant-color-overlay-border)] text-[var(--ant-color-overlay-text)] px-[var(--ant-spacing-4)] py-[var(--ant-spacing-2.5)] rounded-[var(--ant-radius-xl)] flex flex-col gap-[var(--ant-spacing-2)] z-10 transition-all duration-[var(--ant-motion-duration-slow)] ease-out",
            showControlsOverlay
              ? "opacity-100 translate-y-0 visible pointer-events-auto"
              : "opacity-0 translate-y-2 invisible pointer-events-none"
          )}
          {...(!showControlsOverlay ? { inert: "" } : {})}
        >
          {/* Progress / Seek bar */}
          <div className="flex items-center w-full gap-[var(--ant-spacing-2)] group/progress">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className={clsx("w-full h-1 bg-[var(--ant-color-overlay-track)] hover:h-1.5 rounded-[var(--ant-radius-lg)] appearance-none cursor-pointer accent-[var(--ant-color-brand-primary)] transition-all", focusRingClass)}
              aria-label="Seek track"
            />
          </div>

          {/* Buttons & Labels Row */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[var(--ant-spacing-3)]">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className={clsx("p-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] hover:bg-[var(--ant-color-overlay-hover)] text-[var(--ant-color-overlay-text)] transition-colors", focusRingClass)}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] fill-current" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Time Display */}
              <span className="text-[var(--ant-typography-fontSize-xs)] font-mono tabular-nums text-[var(--ant-color-overlay-text-sub)]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-[var(--ant-spacing-3)]">
              {/* Captions Toggle */}
              {captions && captions.length > 0 && (
                <button
                  onClick={toggleCaptions}
                  className={clsx(
                    "p-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] transition-colors hover:bg-[var(--ant-color-overlay-hover)]",
                    focusRingClass,
                    showCaptions ? "text-[var(--ant-color-brand-accent)]" : "text-[var(--ant-color-overlay-text-muted)] hover:text-[var(--ant-color-neutral-0)]"
                  )}
                  aria-label="Toggle Subtitles"
                  title="Toggle Subtitles"
                >
                  <svg className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] fill-current" viewBox="0 0 24 24">
                    <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
                  </svg>
                </button>
              )}

              {/* Volume Slider / Mute */}
              <div className="flex items-center gap-[var(--ant-spacing-1.5)] group/volume">
                <button
                  onClick={toggleMute}
                  className={clsx("p-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] hover:bg-[var(--ant-color-overlay-hover)] text-[var(--ant-color-overlay-text)] transition-colors", focusRingClass)}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <svg className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] fill-current" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] fill-current" viewBox="0 0 24 24">
                      <path d="M7 9v6h4l5 5V4l-5 5H7zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                  ) : (
                    <svg className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] fill-current" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className={clsx("w-0 opacity-0 pointer-events-none group-hover/volume:w-[var(--ant-spacing-16)] group-hover/volume:opacity-100 group-hover/volume:pointer-events-auto focus-visible:w-[var(--ant-spacing-16)] focus-visible:opacity-100 focus-visible:pointer-events-auto h-1 bg-[var(--ant-color-overlay-track)] rounded-[var(--ant-radius-lg)] appearance-none cursor-pointer accent-[var(--ant-color-brand-primary)] transition-all duration-[var(--ant-motion-duration-slow)]", focusRingClass)}
                  aria-label="Volume level"
                />
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className={clsx("p-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] hover:bg-[var(--ant-color-overlay-hover)] text-[var(--ant-color-overlay-text)] transition-colors", focusRingClass)}
                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <svg className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] fill-current" viewBox="0 0 24 24">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                  </svg>
                ) : (
                  <svg className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)] fill-current" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
