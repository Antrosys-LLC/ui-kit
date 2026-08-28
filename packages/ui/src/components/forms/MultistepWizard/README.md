## MultiStepWizard

Stepper-driven form with per-step validation, optional Zod schemas, progress tracking, back/forward navigation, and localStorage draft recovery.

### Usage
```tsx
import { z } from 'zod';
import { MultiStepWizard } from '@antrosys/ui';

const steps = [
  {
    id: 'step-1',
    title: 'Personal Info',
    fields: ['name', 'email'],
    schema: z.object({
      name: z.string().min(2, 'Name is required'),
      email: z.string().email('Valid email required'),
    }),
    component: ({ data, updateData }) => (
      <div>
        <input
          value={data.name || ''}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="Your name"
        />
        <input
          value={data.email || ''}
          onChange={(e) => updateData({ email: e.target.value })}
          placeholder="you@example.com"
        />
      </div>
    ),
  },
];

<MultiStepWizard
  steps={steps}
  showProgress
  saveDraft
  onSubmit={(formData) => {
    console.log('Done', formData);
  }}
/>;
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `WizardStep[]` | required | Ordered array of wizard steps |
| `onSubmit` | `(formData) => void \| Promise<void>` | required | Called when the final step is submitted |
| `initialValues` | `Record<string, any>` | `{}` | Prefill values for the form state |
| `saveDraft` | `boolean` | `false` | Persist the current form state to localStorage |
| `draftKey` | `string` | `'ant_wizard_draft'` | Key used for the saved draft |
| `showProgress` | `boolean` | `true` | Displays the step progress bar |
| `className` | `string` | `undefined` | Additional class names for the container |

### `WizardStep`

| Property | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique step identifier |
| `title` | `string` | Visible step label |
| `description` | `string` (optional) | Supporting subtitle text |
| `fields` | `string[]` (optional) | Limits validation to the fields relevant to this step |
| `schema` | `z.ZodType` (optional) | Zod schema used for per-step validation |
| `component` | `ReactNode` or function | Step content to render |
| `validate` | `(data) => boolean \| Promise<boolean>` | Optional custom validation before moving forward |