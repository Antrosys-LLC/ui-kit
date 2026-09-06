# CopyButton

A production-ready copy-to-clipboard action component with checkmark feedback animation, tooltip support, and target selector querying. Inspired by shadcn/ui.

## Features

- **One-Click Copy**: Instantly writes text values or targeted DOM element text to the user's clipboard.
- **Visual Feedback**: Smooth checkmark icon animation and floating 'Copied!' tooltip confirmation.
- **Flexible Targeting**: Supports direct string `value` props or CSS `selector` queries.
- **Design Token Compliance**: Fully styled using Antrosys design tokens supporting light and dark themes.

---

## Installation & Import

\`\`\`tsx
import { CopyButton } from '@antrosys/ui';
\`\`\`

---

## Usage Examples

### 1. Direct Value Copy
\`\`\`tsx
<CopyButton value="https://antrosys.io/docs" />
\`\`\`

### 2. With Button Label
\`\`\`tsx
<CopyButton value="npm install @antrosys/ui" label="Copy install command" />
\`\`\`

### 3. Using a Target Selector
\`\`\`tsx
<div id="code-snippet">git clone https://github.com/Antrosys-LLC/ui-kit.git</div>
<CopyButton selector="#code-snippet" label="Copy code" />
\`\`\`

---

## Props

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | — | The direct string value to copy to clipboard. |
| `selector` | `string` | — | CSS selector to query text content from an element (alternative to `value`). |
| `label` | `string` | — | Optional button label text displayed alongside the icon. |
| `timeout` | `number` | `2000` | Duration in milliseconds before resetting the copied state back to default. |
| `onCopy` | `(text: string) => void` | — | Callback function fired upon a successful copy action. |
| `className` | `string` | — | Additional wrapper CSS class names for custom layout adjustments. |
| `theme` | `'light' \| 'dark'` | — | Direct theme override prop supporting scoped dark/light resolution. |