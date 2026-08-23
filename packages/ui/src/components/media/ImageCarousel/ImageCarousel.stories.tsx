import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ImageCarousel } from "./ImageCarousel";
import type { CarouselImage } from "./ImageCarousel";
import { ThemeProvider } from "../../../providers/ThemeProvider";
import { useTheme } from "../../../hooks/useTheme";

const sampleImages: CarouselImage[] = [
  {
    src: "https://picsum.photos/id/1018/1200/675",
    thumbnailSrc: "https://picsum.photos/id/1018/240/135",
    alt: "Mountain landscape beneath a cloudy sky",
    caption: "Mountain landscape",
  },
  {
    src: "https://picsum.photos/id/1015/1200/675",
    thumbnailSrc: "https://picsum.photos/id/1015/240/135",
    alt: "River flowing between forested mountains",
    caption: "River valley",
  },
  {
    src: "https://picsum.photos/id/1016/1200/675",
    thumbnailSrc: "https://picsum.photos/id/1016/240/135",
    alt: "Mountain ridge reflected in a lake",
    caption: "Mountain lake",
  },
  {
    src: "https://picsum.photos/id/1025/1200/675",
    thumbnailSrc: "https://picsum.photos/id/1025/240/135",
    alt: "A dog looking toward the camera",
    caption: "Portrait",
  },
];

const imagesWithoutCaptions: CarouselImage[] = sampleImages.map(
  ({ src, alt, thumbnailSrc }) => ({
    src,
    alt,
    thumbnailSrc,
  }),
);

const meta = {
  title: "Media/ImageCarousel",
  component: ImageCarousel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="w-[min(90vw,56rem)]">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    autoplay: {
      control: "boolean",
    },
    interval: {
      control: {
        type: "number",
        min: 1000,
        step: 500,
      },
    },
    showDots: {
      control: "boolean",
    },
    showArrows: {
      control: "boolean",
    },
    showThumbnails: {
      control: "boolean",
    },
    stopOnInteraction: {
      control: "boolean",
    },
    aspectRatio: {
      control: "text",
    },
    onSlideChange: {
      action: "slide changed",
    },
  },
} satisfies Meta<typeof ImageCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    images: sampleImages,
    showDots: true,
    showArrows: true,
    aspectRatio: "16 / 9",
  },
};

export const Autoplay: Story = {
  args: {
    images: sampleImages,
    autoplay: true,
    interval: 3000,
    showDots: true,
    showArrows: true,
  },
};

export const StopOnInteraction: Story = {
  args: {
    images: sampleImages,
    autoplay: true,
    stopOnInteraction: true,
  },
};

export const CustomInterval: Story = {
  args: {
    images: sampleImages,
    autoplay: true,
    interval: 1500,
  },
};

export const WithThumbnails: Story = {
  args: {
    images: sampleImages,
    showThumbnails: true,
    showDots: false,
    showArrows: true,
  },
};

export const WithoutCaptions: Story = {
  args: {
    images: imagesWithoutCaptions,
    showDots: true,
    showArrows: true,
  },
};

export const WithoutControls: Story = {
  args: {
    images: sampleImages,
    showDots: false,
    showArrows: false,
  },
};

export const SquareAspectRatio: Story = {
  args: {
    images: sampleImages,
    aspectRatio: "1 / 1",
    showDots: true,
    showArrows: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[min(90vw,32rem)]">
        <Story />
      </div>
    ),
  ],
};

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
    showDots: true,
    showArrows: true,
    showThumbnails: true,
  },
};

export const Empty: Story = {
  args: {
    images: [],
  },
};

function DarkThemeWrapper({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="rounded-[var(--ant-radius-lg)] bg-[var(--ant-color-neutral-900)] p-[var(--ant-spacing-6)]">
      {children}
    </div>
  );
}

export const EmptyDarkTheme: Story = {
  args: {
    images: [],
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: (args) => (
    <DarkThemeWrapper>
      <ImageCarousel {...args} />
    </DarkThemeWrapper>
  ),
};