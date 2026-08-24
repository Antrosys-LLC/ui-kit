/**
 * Token build script — generates CSS custom properties, Tailwind config, and JS/TS exports.
 * Run: node scripts/build-tokens.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, "..");

const tokens = JSON.parse(
  readFileSync(resolve(root, "tokens.json"), "utf8")
);

/**
 * Get a token value from a reference path.
 *
 * Example:
 * "{color.brand.primary-lt}"
 * -> "#EDE9FE"
 */
function resolveTokenReference(value) {
  if (typeof value !== "string") {
    return value;
  }

  const match = value.match(/^\{(.+)\}$/);

  if (!match) {
    return value;
  }

  const path = match[1].split(".");
  let current = tokens;

  for (const key of path) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return value;
    }

    current = current[key];
  }

  if (
    current &&
    typeof current === "object" &&
    "value" in current
  ) {
    return resolveTokenReference(current.value);
  }

  return value;
}

/**
 * Flatten nested token object.
 *
 * Example:
 * {
 *   color: {
 *     brand: {
 *       primary: {
 *         value: "#7C3AED"
 *       }
 *     }
 *   }
 * }
 *
 * becomes:
 *
 * {
 *   "color-brand-primary": "#7C3AED"
 * }
 */
function flatten(obj, prefix = "") {
  return Object.entries(obj).reduce(
    (acc, [key, val]) => {
      const path = prefix ? `${prefix}-${key}` : key;

      if (
        val &&
        typeof val === "object" &&
        "value" in val
      ) {
        acc[path] = resolveTokenReference(val.value);
      } else if (
        val &&
        typeof val === "object"
      ) {
        Object.assign(acc, flatten(val, path));
      }

      return acc;
    },
    {}
  );
}

const flat = flatten(tokens);

// ─────────────────────────────────────────────────────────────────────────────
// CSS custom properties
// ─────────────────────────────────────────────────────────────────────────────

mkdirSync(resolve(root, "dist/css"), {
  recursive: true,
});

const cssVars = Object.entries(flat)
  .map(([key, value]) => `  --ant-${key}: ${value};`)
  .join("\n");

const css = `:root {\n${cssVars}\n}\n`;

writeFileSync(
  resolve(root, "dist/css/tokens.css"),
  css
);

// ─────────────────────────────────────────────────────────────────────────────
// JS / TS constants
// ─────────────────────────────────────────────────────────────────────────────

mkdirSync(resolve(root, "dist/js"), {
  recursive: true,
});

const jsEntries = Object.entries(flat)
  .map(([key, value]) => `  "${key}": "${value}"`)
  .join(",\n");

const js = `export const tokens = {\n${jsEntries}\n};\n`;

writeFileSync(
  resolve(root, "dist/js/index.mjs"),
  js
);

const cjs = `module.exports = {\n${Object.entries(flat)
  .map(([key, value]) => `  "${key}": "${value}"`)
  .join(",\n")}\n};\n`;

writeFileSync(
  resolve(root, "dist/js/index.js"),
  cjs
);

const dts =
  "export declare const tokens: Record<string, string>;\n";

writeFileSync(
  resolve(root, "dist/js/index.d.ts"),
  dts
);

// ─────────────────────────────────────────────────────────────────────────────
// Tailwind config extension
// ─────────────────────────────────────────────────────────────────────────────

mkdirSync(resolve(root, "dist/tailwind"), {
  recursive: true,
});

const tw = `/** @type {import('tailwindcss').Config['theme']} */

module.exports = {
  colors: {
    brand: {
      DEFAULT: "var(--ant-color-brand-primary)",
      light: "var(--ant-color-brand-primary-lt)",
      dark: "var(--ant-color-brand-primary-dk)",
      accent: "var(--ant-color-brand-accent)",
    },

    success: "var(--ant-color-semantic-success)",
    warning: "var(--ant-color-semantic-warning)",
    error: "var(--ant-color-semantic-error)",
    info: "var(--ant-color-semantic-info)",
  },

  fontFamily: {
    sans: "var(--ant-typography-fontFamily-sans)",
    mono: "var(--ant-typography-fontFamily-mono)",
  },

  spacing: Object.fromEntries(
    ${JSON.stringify(
      Object.keys(tokens.spacing)
    )}.map((key) => [
      key,
      \`var(--ant-spacing-\${key})\`,
    ])
  ),

  borderRadius: Object.fromEntries(
    ${JSON.stringify(
      Object.keys(tokens.radius)
    )}.map((key) => [
      key,
      \`var(--ant-radius-\${key})\`,
    ])
  ),
};
`;

writeFileSync(
  resolve(root, "dist/tailwind/tokens.js"),
  tw
);

console.log(
  "✅ Tokens built → dist/css · dist/js · dist/tailwind"
);