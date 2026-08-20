import type { Meta, StoryObj } from "@storybook/react";
import { Video } from "./Video";

const meta = {
  title: "Media/Video",
  component: Video,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "rounded", "fullscreen"],
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
  },
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    controls: true,
    size: "full",
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
    size: "xl",
  },
};

export const AutoplayMuted: Story = {
  args: {
    src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    autoPlay: true,
    muted: true,
    loop: true,
    controls: false,
    size: "md",
  },
};

export const SmallSize: Story = {
  args: {
    src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    controls: true,
    size: "sm",
  },
};

export const Fullscreen: Story = {
  decorators: [
    (Story) => (
      <div style={{ position: "relative", width: "100%", height: "600px", overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    src: "https://vjs.zencdn.net/v/oceans.mp4",
    controls: true,
    variant: "fullscreen",
  },
};
