import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slideshow & Presentation Mode | Design Component",
  description: "3D perspective coverflow carousel and fullscreen presentation slide deck component design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-brand-orange selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
