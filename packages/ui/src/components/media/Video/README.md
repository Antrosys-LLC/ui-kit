# Video Player

A custom-skinned HTML5 video player component featuring a full set of controls (play/pause, seek/progress bar, volume slider, fullscreen toggle, caption toggle, and loading indicators). Also features native iframe embed mode support for YouTube and Vimeo.

## Usage

```tsx
import { Video } from "@antrosys/ui";

// Custom skinned HTML5 player
<Video
  src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
  poster="https://media.w3.org/2010/05/sintel/poster.png"
  variant="rounded"
  size="lg"
/>

// HTML5 player with captions
<Video
  src="https://vjs.zencdn.net/v/oceans.mp4"
  captions={[
    {
      src: "https://vjs.zencdn.net/v/oceans.vtt",
      label: "English",
      srcLang: "en",
      default: true,
    }
  ]}
  size="lg"
/>

// YouTube Embed Mode
<Video
  src="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
  embedType="youtube"
  size="lg"
/>
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | — | Video source URL or video ID |
| `poster` | `string` | — | Poster thumbnail image URL |
| `captions` | `CaptionTrack[]` | — | Array of subtitles/caption tracks for the video player |
| `autoplay` | `boolean` | `false` | Plays the video automatically when loaded |
| `loop` | `boolean` | `false` | Loops the video back to the beginning when it finishes |
| `controls` | `boolean` | `true` | Enables native controls (embedded) or custom-skinned controls (HTML5) |
| `loading` | `boolean` | `false` | Forces or simulates the buffering spinner state |
| `muted` | `boolean` | `false` | Mutes the audio output by default |
| `embedType` | `'html5' \| 'youtube' \| 'vimeo'` | — | Optional embed player selector. Will auto-detect from `src` if not provided |
| `variant` | `'default' \| 'rounded'` | `'default'` | Visual layout variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'full'` | Preset width sizing |
| `width` | `string \| number` | — | Custom width (e.g. `400px`, `100%`) |
| `height` | `string \| number` | — | Custom height (e.g. `250px`) |
| `className` | `string` | — | Custom CSS classes to apply to the video player container |

### CaptionTrack Type

```typescript
export interface CaptionTrack {
  src: string;      // URL of the text track (.vtt file)
  label: string;    // User-visible label for the track
  srcLang: string;  // Language tag (e.g. 'en', 'es')
  default?: boolean;// Whether this track should be enabled by default
}
```

## Styling

The player styling is driven by the Antrosys token set and follows the actual component implementation in [packages/ui/src/components/media/Video/Video.tsx](packages/ui/src/components/media/Video/Video.tsx):

- **Canvas & backgrounds**: the player surface uses `var(--ant-color-neutral-900)`, the control overlay uses `var(--ant-color-overlay-bg)` with `backdrop-blur-md`, and the buffering layer uses `var(--ant-color-overlay-backdrop)`.
- **Borders & dividers**: overlay and control borders use `var(--ant-color-overlay-border)`, while hover states use `var(--ant-color-overlay-hover)`.
- **Text & icons**: `var(--ant-color-overlay-text)` is used for primary control labels and icons, `var(--ant-color-overlay-text-sub)` for timestamps, and `var(--ant-color-overlay-text-muted)` for inactive or disabled states.
- **Active states**: the slider track and filled controls use `var(--ant-color-overlay-track)` and `var(--ant-color-brand-primary)`, while active captions use `var(--ant-color-brand-accent)`.
- **Border radius**: the `rounded` variant and progress track use `var(--ant-radius-lg)`, the controls bar uses `var(--ant-radius-xl)`, action buttons use `var(--ant-radius-md)`, and the center play button uses `var(--ant-radius-full)`.
- **Sizing & spacing**: width presets map to `var(--ant-video-size-*)` (`sm`, `md`, `lg`, `xl`, `full`), and the layout spacing uses `var(--ant-spacing-*)` tokens.
- **Focus rings**: buttons and slider controls use `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-1` for keyboard accessibility.
