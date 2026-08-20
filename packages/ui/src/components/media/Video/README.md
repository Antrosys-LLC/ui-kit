## Video

A standard video player component for local or hosted video content.

### Usage

```tsx
import { Video } from "@antrosys/ui";

<Video controls poster="/poster.jpg" src="/sample.mp4" />
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | — | Video source URL |
| `poster` | `string` | — | Poster thumbnail image URL |
| `controls` | `boolean` | `true` | Enables native player controls |
| `variant` | `'default' \| 'rounded' \| 'fullscreen'` | `'default'` | Visual layout variant |
| `width` | `string \| number` | — | Custom width of the player (e.g. `400px`, `100%`) |
| `height` | `string \| number` | — | Custom height of the player (e.g. `250px`) |
| `autoPlay` | `boolean` | `false` | Plays the video automatically when loaded |
| `muted` | `boolean` | `false` | Mutes the audio output by default |
| `loop` | `boolean` | `false` | Loops the video back to the beginning when it finishes |
| `className` | `string` | — | Custom CSS classes to apply to the video element |

### Custom Sizing
By default, the video player fits its parent container width and uses a `16:9` aspect ratio. Passing a custom `width` or `height` dynamically disables the default sizing behavior. If you pass a custom `height`, the `aspect-video` constraint is removed to prevent black borders.

```tsx
// Custom dimensions (aspect ratio is maintained automatically if only width is passed)
<Video src="/sample.mp4" width="480px" />

// Exact dimensions
<Video src="/sample.mp4" width={640} height={360} />
```

### Fullscreen Variant
The `fullscreen` variant configures the video as a fixed backdrop overlay with absolute cover stretching, removing borders and scrollbars.

```tsx
// Loop an HD background video silently across the full screen
<Video src="/background.mp4" variant="fullscreen" autoPlay muted loop controls={false} />
```
