/**
 * Token build script — generates CSS custom properties,
 * Tailwind config, and JS/TS exports.
 *
 * Run: node scripts/build-tokens.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, "..");

const tokens = JSON.parse(readFileSync(resolve(root, "tokens.json"), "utf8"));

/**
 * Resolve token references such as:
 * {color.neutral.50}
 * {color.semantic.info}
 */
function resolveReference(value) {
  if (typeof value !== "string" || !value.startsWith("{") || !value.endsWith("}")) {
    return value;
  }

  const path = value.slice(1, -1).split(".");

  let resolved = tokens;

  for (const key of path) {
    if (resolved && typeof resolved === "object" && key in resolved) {
      resolved = resolved[key];
    } else {
      return value;
    }
  }

  if (resolved && typeof resolved === "object" && "value" in resolved) {
    return resolveReference(resolved.value);
  }

  return value;
}

/**
 * Flatten nested token object.
 * Example:
 * { color: { brand: { primary: { value: "#7C3AED" } } } }
 *
 * becomes:
 * { "color-brand-primary": "#7C3AED" }
 */
function flatten(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const path = prefix ? `${prefix}-${key}` : key;

    if (val && typeof val === "object" && "value" in val) {
      acc[path] = resolveReference(val.value);
    } else if (val && typeof val === "object") {
      Object.assign(acc, flatten(val, path));
    }

    return acc;
  }, {});
}

const flat = flatten(tokens);

// Resolve aliases like "{color.neutral.50}"
for (const [k, v] of Object.entries(flat)) {
  if (typeof v === "string" && v.startsWith("{") && v.endsWith("}")) {
    const ref = v.slice(1, -1).replace(/\./g, "-");
    if (flat[ref]) {
      flat[k] = flat[ref];
    }
  }
}


// ── CSS custom properties ────────────────────────────────────────────────────

mkdirSync(resolve(root, "dist/css"), {
  recursive: true,
});

const cssVars = Object.entries(flat)
  .map(([key, value]) => `  --ant-${key}: ${value};`)
  .join("\n");

const css = `:root {\n${cssVars}\n}\n`;

writeFileSync(resolve(root, "dist/css/tokens.css"), css);

// ── JS/TS constants ──────────────────────────────────────────────────────────

mkdirSync(resolve(root, "dist/js"), {
  recursive: true,
});

const jsEntries = Object.entries(flat)
  .map(([key, value]) => `  "${key}": ${JSON.stringify(value)}`)
  .join(",\n");

const js = `export const tokens = {\n${jsEntries}\n};\n`;

writeFileSync(resolve(root, "dist/js/index.mjs"), js);

const cjs = `const tokens = {\n${jsEntries}\n};\n\nmodule.exports = { tokens };\n`;

writeFileSync(resolve(root, "dist/js/index.js"), cjs);

const dts = `export declare const tokens: Record<string, string>;\n`;

writeFileSync(resolve(root, "dist/js/index.d.ts"), dts);

// ── Tailwind config extension ────────────────────────────────────────────────

mkdirSync(resolve(root, "dist/tailwind"), {
  recursive: true,
});

const tw = `/**
 * @type {import('tailwindcss').Config['theme']}
 */

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
    ${JSON.stringify(Object.keys(tokens.spacing))}.map((key) => [
      key,
      \`var(--ant-spacing-\${key})\`,
    ]),
  ),

  borderRadius: Object.fromEntries(
    ${JSON.stringify(Object.keys(tokens.radius))}.map((key) => [
      key,
      \`var(--ant-radius-\${key})\`,
    ]),
  ),
};
`;

writeFileSync(resolve(root, "dist/tailwind/tokens.js"), tw);

console.log("✅ Tokens built → dist/css · dist/js · dist/tailwind");
