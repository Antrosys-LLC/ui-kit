import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

const images = [
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80",
];

const meta: Meta<typeof Lightbox> = {
  title: "Media/Lightbox",
  component: Lightbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const containerStyle = {
  width: "min(90vw, 620px)",
  minHeight: "430px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  background: "#ffffff",
  borderRadius: "1.25rem",
  boxSizing: "border-box" as const,
};

const contentStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  gap: "1.25rem",
};

const imageStyle = {
  width: "min(100%, 420px)",
  height: "250px",
  objectFit: "cover" as const,
  borderRadius: "1rem",
  display: "block",
};

const buttonStyle = {
  padding: "0.8rem 1.5rem",
  border: "none",
  borderRadius: "999px",
  background: "#111111",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "0.95rem",
  transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
};

function Preview({ image, label, onOpen }: { image: string; label: string; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <img src={image} alt="Lightbox preview" style={imageStyle} />

        <button
          type="button"
          onClick={onOpen}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            ...buttonStyle,
            transform: hovered ? "translateY(-2px) scale(1.03)" : "scale(1)",
            boxShadow: hovered ? "0 10px 25px rgb(0 0 0 / 0.18)" : "0 5px 15px rgb(0 0 0 / 0.12)",
            background: hovered ? "#7C3AED" : "#111111",
          }}
        >
          {label}
        </button>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return open ? (
      <Lightbox
        src={images[0]}
        alt="Beautiful landscape"
        thumbnails={images}
        onClose={() => setOpen(false)}
      />
    ) : (
      <Preview image={images[0]} label="Open Image" onOpen={() => setOpen(true)} />
    );
  },
};

export const SingleImage: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return open ? (
      <Lightbox src={images[0]} alt="Single landscape" onClose={() => setOpen(false)} />
    ) : (
      <Preview image={images[0]} label="Open Single Image" onOpen={() => setOpen(true)} />
    );
  },
};

export const NoZoom: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return open ? (
      <Lightbox
        src={images[0]}
        alt="Landscape without zoom"
        thumbnails={images}
        zoomEnabled={false}
        onClose={() => setOpen(false)}
      />
    ) : (
      <Preview image={images[0]} label="Open Without Zoom" onOpen={() => setOpen(true)} />
    );
  },
};

export const AutoPlayOff: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return open ? (
      <Lightbox
        src={images[0]}
        alt="AutoPlay disabled"
        thumbnails={images}
        autoPlay={false}
        onClose={() => setOpen(false)}
      />
    ) : (
      <Preview image={images[0]} label="Open AutoPlay Off" onOpen={() => setOpen(true)} />
    );
  },
};

export const AutoPlayOn: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return open ? (
      <Lightbox
        src={images[0]}
        alt="AutoPlay enabled"
        thumbnails={images}
        autoPlay
        autoPlayInterval={3000}
        onClose={() => setOpen(false)}
      />
    ) : (
      <Preview image={images[0]} label="Open AutoPlay On" onOpen={() => setOpen(true)} />
    );
  },
};

export const Accessibility: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return open ? (
      <Lightbox
        src={images[0]}
        alt="Accessible landscape viewer"
        thumbnails={images}
        autoPlay={false}
        onClose={() => setOpen(false)}
      />
    ) : (
      <Preview image={images[0]} label="Open Accessible Lightbox" onOpen={() => setOpen(true)} />
    );
  },
};
