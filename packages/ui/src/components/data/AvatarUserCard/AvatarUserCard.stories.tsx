import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AvatarUserCard } from "./AvatarUserCard";
import type { SocialLink } from "./AvatarUserCard";

const sampleSocials: SocialLink[] = [
  { platform: "GitHub",   url: "https://github.com" },
  { platform: "LinkedIn", url: "https://linkedin.com" },
  { platform: "Twitter",  url: "https://x.com" },
];

const meta = {
  title:     "Data/AvatarUserCard",
  component: AvatarUserCard,
  tags:      ["autodocs"],
  argTypes: {
    size:   { control: "select", options: ["sm", "md", "lg"] },
    status: { control: "select", options: ["online", "offline"] },
    image:  { control: "text" },
  },
} satisfies Meta<typeof AvatarUserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name:   "Amna Farooq",
    role:   "AI/ML Enthusiast",
    status: "online",
    size:   "md",
  },
};

export const Small: Story = {
  args: {
    name:   "Peter Parker",
    role:   "AI/ML Enthusiast",
    status: "online",
    size:   "sm",
  },
};

export const Large: Story = {
  args: {
    name:   "Peter Parker",
    role:   "AI/ML Enthusiast",
    status: "online",
    size:   "lg",
  },
};

export const WithImage: Story = {
  args: {
    name:   "Peter Parker",
    role:   "AI/ML Enthusiast",
    status: "online",
    size:   "md",
    image:  "https://i.pravatar.cc/150?u=amna",
  },
};

export const InitialsFallback: Story = {
  args: {
    name:   "John Doe",
    role:   "Product Designer",
    status: "online",
    size:   "md",
  },
};

export const Online: Story = {
  args: {
    name:   "Sara Khan",
    role:   "Frontend Engineer",
    status: "online",
    size:   "md",
    image:  "https://i.pravatar.cc/150?u=sara",
  },
};

export const Offline: Story = {
  args: {
    name:   "Sara Khan",
    role:   "Frontend Engineer",
    status: "offline",
    size:   "md",
    image:  "https://i.pravatar.cc/150?u=sara",
  },
};

export const WithSocialLinks: Story = {
  args: {
    name:    "Amna Farooq",
    role:    "AI/ML Enthusiast",
    status:  "online",
    size:    "md",
    image:   "https://i.pravatar.cc/150?u=amna",
    socials: sampleSocials,
  },
};

export const LongUserName: Story = {
  args: {
    name:    "Christopher Alexander Maximilian Wellington-Smith",
    role:    "Senior Principal Staff Software Architect and Engineering Manager",
    status:  "offline",
    size:    "md",
    socials: sampleSocials,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "240px" }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  args: {
    name:    "Amna Farooq",
    role:    "AI/ML Enthusiast",
    status:  "online",
    size:    "md",
    image:   "https://i.pravatar.cc/150?u=amna",
    socials: sampleSocials,
  },
};

