# ImageCarousel

A responsive and accessible image carousel powered by Swiper. It supports touch gestures, keyboard navigation, autoplay, pagination, custom navigation controls, captions, lazy loading, aspect ratios, and thumbnails.

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