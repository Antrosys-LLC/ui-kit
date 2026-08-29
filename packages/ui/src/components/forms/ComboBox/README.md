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