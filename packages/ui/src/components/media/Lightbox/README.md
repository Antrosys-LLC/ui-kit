# Lightbox

A responsive image lightbox component with image navigation and zoom support.

## Features

- Image preview in fullscreen mode
- Previous and next image navigation
- Thumbnail navigation
- Mouse wheel zoom
- Double-click zoom
- Keyboard controls
- Escape key to close
- Framer Motion animations

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | required | Main image URL |
| `alt` | `string` | `"Image"` | Image alt text |
| `thumbnails` | `string[]` | `[]` | Images shown as thumbnails |
| `zoomEnabled` | `boolean` | `true` | Enables image zoom |
| `onClose` | `() => void` | required | Called when the lightbox closes |

## Keyboard Controls

- `Escape` → Close
- `Arrow Left` → Previous image
- `Arrow Right` → Next image
- `+` / `=` → Zoom in
- `-` → Zoom out

## Example

```tsx
<Lightbox
  src="/images/example.jpg"
  alt="Example image"
  thumbnails={[
    "/images/example.jpg",
    "/images/example-2.jpg",
    "/images/example-3.jpg",
  ]}
  zoomEnabled
  onClose={() => setOpen(false)}
/>