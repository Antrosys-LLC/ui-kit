import React, { useEffect } from "react";
import type { Preview } from "@storybook/react";
import "../src/tailwind.css"; // Tailwind utilities
import "@antrosys/tokens/css"; // injects CSS custom properties
import { ThemeContext } from "../src/providers/ThemeProvider";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const bg = context.globals.backgrounds?.value;
      const isDark = bg === "#0F172A";
      const theme = isDark ? "dark" : "light";

      useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
      }, [theme]);

      return React.createElement(
        ThemeContext.Provider,
        {
          value: {
            theme,
            toggleTheme: () => {},
            setTheme: () => {},
          },
        },
        React.createElement(Story, null)
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#F8FAFC" },
        { name: "dark", value: "#0F172A" },
        { name: "white", value: "#FFFFFF" },
      ],
    },
  },
};

export default preview;
