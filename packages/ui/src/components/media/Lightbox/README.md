# Lightbox

A responsive image lightbox component with image navigation, thumbnail navigation, zoom support, autoplay, keyboard controls, focus management, and Framer Motion animations.

## Features

- Image preview in fullscreen mode
- Previous and next image navigation
- Thumbnail navigation
- Mouse wheel zoom
- Double-click zoom
- Optional automatic image navigation
- Configurable autoplay interval
- Keyboard controls
- Escape key to close
- Focus trap while the lightbox is open
- Restores focus when the lightbox closes
- Locks background page scrolling while open
- Framer Motion animations
- Responsive layout
- Accessible dialog with `aria-modal`

## Props

| Prop               | Type         | Default   | Description                                                               |
| ------------------ | ------------ | --------- | ------------------------------------------------------------------------- |
| `isOpen`           | `boolean`    | `true`    | Determines if the lightbox is currently open and visible                  |
| `src`              | `string`     | required  | Main image URL                                                            |
| `alt`              | `string`     | `"Image"` | Image alt text                                                            |
| `thumbnails`       | `string[]`   | `[]`      | Images shown as thumbnails                                                |
| `zoomEnabled`      | `boolean`    | `true`    | Enables image zoom using mouse wheel, double-click, and keyboard controls |
| `autoPlay`         | `boolean`    | `false`   | Enables automatic image navigation                                        |
| `autoPlayInterval` | `number`     | `3000`    | Time in milliseconds between automatic image changes                      |
| `onClose`          | `() => void` | required  | Called when the lightbox closes                                           |

## Autoplay

Autoplay is disabled by default.

To enable autoplay, set `autoPlay` to `true`:

```tsx
<Lightbox
  isOpen={open}
  src="/images/example.jpg"
  thumbnails={["/images/example.jpg", "/images/example-2.jpg", "/images/example-3.jpg"]}
  autoPlay
  autoPlayInterval={3000}
  onClose={() => setOpen(false)}
/>
```

`autoPlayInterval` is specified in milliseconds. The default interval is `3000ms` (3 seconds).

Autoplay pauses when the user interacts with zoom controls and resumes when navigating to another image.

## Keyboard Controls

- `Escape` → Close the lightbox
- `Arrow Left` → Previous image
- `Arrow Right` → Next image
- `+` / `=` → Zoom in
- `-` → Zoom out
- `Tab` → Move between available controls
- `Shift + Tab` → Move backward between available controls

Focus remains inside the lightbox while it is open. When the lightbox closes, focus is restored to the element that was focused before opening it.

## Zoom

Zoom is enabled by default.

Users can zoom using:

- Mouse wheel
- Double-click
- `+` or `=` keyboard key
- `-` keyboard key

Zoom can be disabled with:

```tsx
<Lightbox src="/images/example.jpg" zoomEnabled={false} onClose={() => setOpen(false)} />
```

## Accessibility

The lightbox uses an accessible dialog structure with:

- `role="dialog"`
- `aria-modal="true"`
- Accessible close button
- Accessible previous and next navigation buttons
- Keyboard navigation
- Focus trap
- Initial focus on the close button
- Focus restoration after closing
- Background scroll locking

## Example

```tsx
import { Lightbox } from "@antrosys/ui";

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open Lightbox
      </button>

      <Lightbox
        isOpen={open}
        src="/images/example.jpg"
        alt="Example image"
        thumbnails={["/images/example.jpg", "/images/example-2.jpg", "/images/example-3.jpg"]}
        zoomEnabled
        autoPlay
        autoPlayInterval={3000}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
```

## Single Image

The lightbox also works with a single image:

```tsx
<Lightbox isOpen={open} src="/images/example.jpg" alt="Example image" onClose={() => setOpen(false)} />
```

When only one image is provided, previous/next navigation and thumbnail navigation are not displayed.

## No Zoom

To disable all zoom interactions:

```tsx
<Lightbox isOpen={open} src="/images/example.jpg" zoomEnabled={false} onClose={() => setOpen(false)} />
```

## Autoplay Off

Autoplay is disabled by default:

```tsx
<Lightbox
  isOpen={open}
  src="/images/example.jpg"
  thumbnails={["/images/example.jpg", "/images/example-2.jpg"]}
  autoPlay={false}
  onClose={() => setOpen(false)}
/>
```

## Autoplay On

Autoplay can be enabled with a custom interval:

```tsx
<Lightbox
  isOpen={open}
  src="/images/example.jpg"
  thumbnails={["/images/example.jpg", "/images/example-2.jpg", "/images/example-3.jpg"]}
  autoPlay
  autoPlayInterval={5000}
  onClose={() => setOpen(false)}
/>
```

## Notes

- `autoPlay` defaults to `false`.
- `autoPlayInterval` defaults to `3000ms`.
- Autoplay only runs when there is more than one image.
- A non-positive `autoPlayInterval` disables the autoplay timer.
- Zoom is limited to a maximum scale of `3x`.
- Background scrolling is locked while the lightbox is open.
- The previously focused element is restored when the lightbox closes.