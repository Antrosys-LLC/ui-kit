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
Custom player controls are styled using Antrosys Design Tokens:
- Borders: `var(--ant-color-surface-border)`
- Border Radius: `var(--ant-radius-lg)` for `rounded` variant, controls box `var(--ant-radius-xl)`
- Background: `backdrop-blur-md` overlay
- Focus State: Outline accent `var(--ant-color-brand-primary)`
