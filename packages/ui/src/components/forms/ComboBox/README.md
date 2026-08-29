## Combobox / Searchable Dropdown

Accessible select component with real-time text filtering, multi-select tag chips, async loading state, grouped options, custom item creation, and clearable actions.

### Usage
```tsx
import { Combobox } from '@antrosys/ui';

const options = [
  { label: 'React', value: 'react', group: 'Frontend' },
  { label: 'Express', value: 'express', group: 'Backend' },
];

<Combobox
  options={options}
  placeholder="Select stack..."
  multi
  clearable
  onChange={(val) => console.log(val)}
/>
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `ComboboxOption[]` | `[]` | Array of selectable option items (`{ label, value, group?, disabled? }`) |
| `value` | `string \| string[]` | `undefined` | Controlled selection value (string for single, string[] for multi) |
| `onChange` | `(value: string \| string[]) => void` | `undefined` | Callback invoked when selection value changes |
| `multi` | `boolean` | `false` | Enable multi-selection mode rendered as removable tag chips |
| `async` | `boolean` | `false` | Displays an asynchronous / remote loading indicator |
| `onCreate` | `(query: string) => void` | `undefined` | Callback triggered when the user chooses to create a new option |
| `placeholder` | `string` | `'Select an option...'` | Placeholder text shown when no options are selected |
| `clearable` | `boolean` | `false` | Displays a clear button when items are selected |
| `disabled` | `boolean` | `false` | Disables user interaction |
| `className` | `string` | `undefined` | Optional CSS class name override |
| `theme` | `'light' \| 'dark'` | `undefined` | Direct theme override or resolved via `ThemeContext` |