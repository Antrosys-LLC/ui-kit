# @antrosys/ui-kit

Antrosys design system monorepo — tokens, components, and Storybook.

## Packages

| Package | Description |
|---|---|
| `@antrosys/tokens` | Design token source of truth → CSS variables, Tailwind config, JS constants |
| `@antrosys/ui` | React component library |

## Quick start

```bash
# Clone and install
git clone https://github.com/antrosys/ui-kit.git
cd ui-kit

# If pnpm is not already available in your shell, enable it once:
corepack enable
# or, on systems without a global pnpm shim:
# npx -y pnpm@9.9.0 install

pnpm install

# Build design tokens
pnpm --filter @antrosys/tokens build

# Run Storybook
pnpm storybook
# If the shell still cannot find pnpm, use:
# npx -y pnpm@9.9.0 --filter @antrosys/ui storybook --host 0.0.0.0

# Type-check everything
pnpm type-check
```

> Note: On Windows, `pnpm` can fail in some terminals if the Corepack shim is not enabled. Running `corepack enable` once usually fixes that; otherwise use `npx -y pnpm@9.9.0 ...` for the same commands.

## Using in a project

```bash
pnpm add @antrosys/ui @antrosys/tokens
```

```tsx
// 1. Import the token CSS (once, at app root)
import "@antrosys/tokens/css";

// 2. Wrap with providers
import { ThemeProvider, ToastProvider } from "@antrosys/ui";

// 3. Use components
import { Button } from "@antrosys/ui";
```

## Component Index

See [`docs/components/`](./docs/components/) for per-component docs, or run Storybook for the live reference.

## Adding a new component

See [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md).
