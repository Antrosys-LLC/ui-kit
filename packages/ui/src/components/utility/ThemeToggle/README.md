## ThemeToggle

System-preference-aware dark/light mode switcher with local storage persistence and icon animation.

### Usage

```tsx
import { ThemeToggle } from "@antrosys/ui";

<ThemeToggle/>
export interface ThemeToggleProps {
  /** Default theme fallback */
  defaultTheme?: "light" | "dark";
  /** LocalStorage key for persistence */
  storageKey?: string;
  /** Enable smooth CSS transition animation */
  transition?: boolean;
  /** Whether to show the text label alongside the icon */
  showLabel?: boolean;
  /** Additional wrapper CSS class names */
  className?: string;
}
| Prop | Type | Default |
| :--- | :--- | :--- |
| `defaultTheme` | `'light' \| 'dark'` | `'light'` |
| `storageKey` | `string` | `'antrosys-ui-theme'` |
| `transition` | `boolean` | `true` |
| `showLabel` | `boolean` | `true` |
| `className` | `string` | — |