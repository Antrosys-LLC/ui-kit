/**
 * Token build script — generates CSS custom properties, Tailwind config, and JS/TS exports.
 * Run: node scripts/build-tokens.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, "..");
const tokens = JSON.parse(readFileSync(resolve(root, "tokens.json"), "utf8"));

/** Flatten nested token object → { "color-brand-primary": "#7C3AED" } */
function flatten(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const path = prefix ? `${prefix}-${key}` : key;
    if (val && typeof val === "object" && "value" in val) {
      acc[path] = val.value;
    } else if (val && typeof val === "object") {
      Object.assign(acc, flatten(val, path));
    }
    return acc;
  }, {});
}

const flat = flatten(tokens);

/** Resolve design token references, e.g. "{color.neutral.50}" → "var(--ant-color-neutral-50)" */
function resolveReference(val) {
  if (typeof val === "string" && val.startsWith("{") && val.endsWith("}")) {
    const refKey = val.slice(1, -1).replace(/\./g, "-");
    return `var(--ant-${refKey})`;
  }
  return val;
}

// ── CSS custom properties ────────────────────────────────────────────────────
mkdirSync(resolve(root, "dist/css"), { recursive: true });
const cssVars = Object.entries(flat)
  .map(([k, v]) => `  --ant-${k}: ${resolveReference(v)};`)
  .join("\n");
const css = `:root {\n${cssVars}\n}\n`;
writeFileSync(resolve(root, "dist/css/tokens.css"), css);

// ── JS/TS constants ──────────────────────────────────────────────────────────
mkdirSync(resolve(root, "dist/js"), { recursive: true });
const jsEntries = Object.entries(flat)
  .map(([k, v]) => `  "${k}": "${resolveReference(v)}"`).join(",\n");
const js = `export const tokens = {\n${jsEntries}\n};\n`;
writeFileSync(resolve(root, "dist/js/index.mjs"), js);
writeFileSync(resolve(root, "dist/js/index.js"), js.replace(/export const/g, "module.exports =").replace(" = {", " ({").replace(/\};\n$/, "});\n"));

const dts = `export declare const tokens: Record<string, string>;\n`;
writeFileSync(resolve(root, "dist/js/index.d.ts"), dts);

// ── Tailwind config extension ────────────────────────────────────────────────
mkdirSync(resolve(root, "dist/tailwind"), { recursive: true });
const tw = `/** @type {import('tailwindcss').Config['theme']} */
module.exports = {
  colors: {
    brand: {
      DEFAULT: "var(--ant-color-brand-primary)",
      light:   "var(--ant-color-brand-primary-lt)",
      dark:    "var(--ant-color-brand-primary-dk)",
      accent:  "var(--ant-color-brand-accent)",
    },
    success: "var(--ant-color-semantic-success)",
    warning: "var(--ant-color-semantic-warning)",
    error:   "var(--ant-color-semantic-error)",
    info:    "var(--ant-color-semantic-info)",
  },
  fontFamily: {
    sans: "var(--ant-typography-fontfamily-sans)",
    mono: "var(--ant-typography-fontfamily-mono)",
  },
  spacing: Object.fromEntries(
    ${JSON.stringify(Object.keys(tokens.spacing))}.map(k => [k, \`var(--ant-spacing-\${k})\`])
  ),
  borderRadius: Object.fromEntries(
    ${JSON.stringify(Object.keys(tokens.radius))}.map(k => [k, \`var(--ant-radius-\${k})\`])
  ),
};
`;
writeFileSync(resolve(root, "dist/tailwind/tokens.js"), tw);

console.log("✅ Tokens built → dist/css · dist/js · dist/tailwind");
