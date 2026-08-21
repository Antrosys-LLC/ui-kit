import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Lightbox } from "./Lightbox";

const images = [
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80",
];

const meta = {
  title: "Media/Lightbox",
  component: Lightbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div
        style={{
          minWidth: "320px",
          minHeight: "420px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "var(--lightbox-background)",
          borderRadius: "1.25rem",
        }}
      >
        {!open ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              src={images[0]}
              alt="Preview"
              style={{
                width: "320px",
                height: "220px",
                objectFit: "cover",
                borderRadius: "1rem",
                boxShadow: "0 20px 50px var(--lightbox-shadow)",
              }}
            />

            <button
              type="button"
              onClick={() => setOpen(true)}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "999px",
                border: "1px solid var(--lightbox-border)",
                background: "var(--lightbox-glass)",
                color: "var(--lightbox-foreground)",
                cursor: "pointer",
                fontWeight: 600,
                backdropFilter: "blur(10px)",
              }}
            >
              Open Image
            </button>
          </div>
        ) : (
          <Lightbox
            src={images[0]}
            alt="Beautiful landscape"
            thumbnails={images}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    );
  },
};


