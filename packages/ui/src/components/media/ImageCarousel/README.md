# ImageCarousel

A responsive and accessible image carousel powered by Swiper. It supports touch gestures, keyboard navigation, autoplay, pagination, custom navigation controls, captions, lazy loading, configurable aspect ratios and thumbnail navigation.

## Usage

```tsx
import { ImageCarousel } from "@antrosys/ui";

const images = [
  {
    src: "/images/mountain.jpg",
    alt: "Mountain landscape",
    caption: "Mountain landscape",
    thumbnailSrc: "/images/mountain-thumbnail.jpg",
  },
  {
    src: "/images/lake.jpg",
    alt: "Lake surrounded by mountains",
    caption: "Mountain lake",
  },
];

export function Gallery() {
  return (
    <ImageCarousel
      images={images}
      autoplay
      interval={4000}
      showDots
      showArrows
      showThumbnails
      aspectRatio="16 / 9"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `images` | `CarouselImage[]` | Required | Images displayed in the carousel |
| `autoplay` | `boolean` | `false` | Automatically advances between slides |
| `interval` | `number` | `5000` | Autoplay interval in milliseconds |
| `showDots` | `boolean` | `true` | Displays pagination indicators |
| `showArrows` | `boolean` | `true` | Displays previous and next controls |
| `aspectRatio` | `string` | `"16 / 9"` | CSS aspect ratio applied to the carousel |
| `showThumbnails` | `boolean` | `false` | Displays thumbnail navigation |
| `stopOnInteraction` | `boolean` | `false` | Stops autoplay after user interaction |
| `className` | `string` | - | Additional class names |
| `onSlideChange` | `(index: number) => void` | - | Called when the active slide changes |

## CarouselImage

| Property | Type | Required | Description |
|---|---|---|---|
| `src` | `string` | Yes | Full-size image URL |
| `alt` | `string` | Yes | Accessible description of the image |
| `caption` | `string` | No | Caption displayed over the image |
| `thumbnailSrc` | `string` | No | Optional thumbnail image URL |

## Responsive behavior

Navigation controls, captions and thumbnails adapt to smaller viewports. The thumbnail strip scrolls horizontally without causing page-level overflow.

## Accessibility

- Touch, swipe and keyboard navigation are supported.
- Navigation and thumbnail controls have accessible labels.
- Controls include visible focus indicators.
- Each slide exposes its position within the carousel.
- Images require descriptive alternative text.
- Autoplay pauses on hover.
- Autoplay is disabled when reduced motion is preferred.
- The selected thumbnail is identified through `aria-pressed`.