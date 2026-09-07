## CodeBlock

Styled code block supporting syntax styling, line numbers, highlighted lines, diff mode, copy button, language badge, and collapsible long blocks.

### Usage

```tsx
import { CodeBlock } from "@antrosys/ui";

<CodeBlock code="const greeting = 'Hello World';" highlightLines="{[1]}" lang="typescript" showLineNumbers="{true}"/>