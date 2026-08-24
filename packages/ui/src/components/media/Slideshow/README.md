# Slideshow / Presentation Mode (#04)

> Fullscreen slide deck component with animated transitions (fade, slide, zoom, 3D flip), 3D perspective arc carousel, speaker notes, and print/PDF export mode.

## 🚀 Features
- **3D Arc Perspective Carousel**: Concave cylindrical perspective layout matching UI Display & Media specification.
- **Fullscreen Presentation Deck**: Rich transitions (Slide, Fade, Zoom, 3D Flip).
- **Keyboard Navigation**: `←` / `→` / `Space` for slides, `N` for Speaker Notes drawer, `O` for Grid Overview, `F` for Fullscreen toggle, `?` for Shortcuts help, `Esc` to exit.
- **Dual Theme Support**: Site-wide Light and Dark mode styling.

## 📋 Props
| Prop | Type | Description |
|---|---|---|
| `slides` | `SlideItem[]` | Array of slide items containing metadata, images, and notes. |
| `transition` | `"slide" \| "fade" \| "zoom" \| "flip"` | Active slide transition style. |
| `showProgress` | `boolean` | Displays bottom progress indicator. |
| `allowKeyboard` | `boolean` | Enables arrow and keyboard hotkey listeners. |

## 🛠️ Usage
```tsx
import { ThreeArcCarousel, PresentationMode } from "@antrosys/ui";

export function SlideshowDemo() {
  return (
    <ThreeArcCarousel
      onOpenPresentation={(index) => console.log("Open presentation slide", index)}
    />
  );
}
```
