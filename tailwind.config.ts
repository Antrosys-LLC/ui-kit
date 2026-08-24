import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          orange: "#F26522",
          orangeLight: "#FF7D3B",
          dark: "#0F172A",
          cardBg: "#1E293B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      boxShadow: {
        '3d': '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        'glow': '0 0 25px rgba(242, 101, 34, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;
