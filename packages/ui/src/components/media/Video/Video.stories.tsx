import type { Meta, StoryObj } from "@storybook/react";
import { Video } from "./Video";

const meta = {
  title: "Media/Video",
  component: Video,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "rounded"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
      description: "Preset width sizing",
    },
    width: {
      control: "text",
      description: "Custom width (e.g., 400px, 100%, 50vw)",
    },
    height: {
      control: "text",
      description: "Custom height (e.g., 250px)",
    },
    embedType: {
      control: "select",
      options: ["html5", "youtube", "vimeo"],
    },
  },
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    controls: true,
    size: "lg",
  },
};

export const Rounded: Story = {
  args: {
    src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    controls: true,
    variant: "rounded",
    size: "lg",
  },
};

export const WithPoster: Story = {
  args: {
    src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    poster: "https://media.w3.org/2010/05/sintel/poster.png",
    controls: true,
    size: "lg",
  },
};

export const WithCaptions: Story = {
  args: {
    src: "https://vjs.zencdn.net/v/oceans.mp4",
    poster: "https://vjs.zencdn.net/v/oceans.png",
    controls: true,
    size: "lg",
    captions: [
      {
        src: "https://vjs.zencdn.net/v/oceans.vtt",
        label: "English",
        srcLang: "en",
        default: true,
      },
    ],
  },
};

export const AutoplayMuted: Story = {
  args: {
    src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    autoplay: true,
    muted: true,
    loop: true,
    controls: false,
    size: "md",
  },
};

export const YouTubeEmbed: Story = {
  args: {
    src: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    size: "lg",
  },
};

export const VimeoEmbed: Story = {
  args: {
    src: "https://vimeo.com/76979871",
    size: "lg",
  },
};
