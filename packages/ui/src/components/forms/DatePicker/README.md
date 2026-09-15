# DatePicker

An accessible, token-driven Date and Date-Range Picker component built with **React** and **Day.js**. It provides single date selection, date range selection with hover range highlighting, month/year selection, min/max constraints, customizable disabled date rules, dynamic localization, full keyboard roving navigation, desktop popovers, and mobile bottom sheet drawers.

---

## Features

- **Multiple Selection Modes**:
  - `single`: Select a single date.
  - `range`: Select a start date and an end date with dynamic hover preview.
  - `month`: Fast month and year picker view.
- **Boundary & Disabled Rules**:
  - `minDate` / `maxDate`: Strict selectable boundary enforcement.
  - `disabledDates`: Custom dates, date intervals, or predicate functions (e.g. disabling weekends or holidays).
- **Responsive Mobile Drawer**:
  - On desktop (`> 640px`), renders as an anchored floating dropdown popover.
  - On mobile (`<= 640px`), seamlessly transforms into a touch-friendly bottom sheet drawer with backdrop dismissal.
- **Dynamic Localization**:
  - Full Day.js locale support (`en`, `es`, `fr`, `de`, `ja`, etc.) with localized weekday and month headers.
- **Keyboard Navigation**:
  - Standard arrow key roving navigation, <kbd>PageUp</kbd>/<kbd>PageDown</kbd> month jumps, <kbd>Shift</kbd> + <kbd>PageUp</kbd>/<kbd>PageDown</kbd> year jumps, <kbd>Home</kbd>/<kbd>End</kbd> bounds, and <kbd>Enter</kbd>/<kbd>Space</kbd> selection.
- **Antrosys Design Tokens**:
  - 100% token-compliant with `@antrosys/tokens`, offering seamless Light and Dark mode theming.
- **Accessibility (WAI-ARIA)**:
  - Accessible input trigger with `aria-haspopup="dialog"`, ARIA calendar grid (`role="grid"`, `role="gridcell"`, `role="columnheader"`), `aria-selected`, `aria-disabled`, and visible focus rings.

---

## Installation / Import

```tsx
import { DatePicker } from "@antrosys/ui";
import type {
  DatePickerProps,
  DatePickerMode,
  DateRange,
  DisabledDateRule,
} from "@antrosys/ui";
```

---

## Usage Examples

### 1. Single Date Selection

```tsx
import React, { useState } from "react";
import { DatePicker } from "@antrosys/ui";

export function SingleDateExample() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <DatePicker
      mode="single"
      label="Appointment Date"
      value={date}
      onChange={(newDate) => setDate(newDate as Date | null)}
      placeholder="Select an appointment date..."
    />
  );
}
```

### 2. Date Range Selection

```tsx
import React, { useState } from "react";
import { DatePicker } from "@antrosys/ui";
import type { DateRange } from "@antrosys/ui";

export function RangeDateExample() {
  const [range, setRange] = useState<DateRange | null>({
    from: new Date(),
    to: null,
  });

  return (
    <DatePicker
      mode="range"
      label="Hotel Reservation"
      value={range}
      onChange={(newRange) => setRange(newRange as DateRange | null)}
      placeholder="Select check-in & check-out dates..."
    />
  );
}
```

### 3. Month & Year Selection

```tsx
import React, { useState } from "react";
import { DatePicker } from "@antrosys/ui";

export function MonthPickerExample() {
  const [month, setMonth] = useState<Date | null>(new Date());

  return (
    <DatePicker
      mode="month"
      label="Billing Cycle"
      value={month}
      onChange={(newMonth) => setMonth(newMonth as Date | null)}
    />
  );
}
```

---

## Props

### `DatePickerProps`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `"single" \| "range" \| "month"` | `"single"` | Selection mode for dates, ranges, or months. |
| `value` | `Date \| DateRange \| null` | `undefined` | Controlled value for the picker. |
| `defaultValue` | `Date \| DateRange \| null` | `null` | Initial uncontrolled value. |
| `onChange` | `(value: Date \| DateRange \| null) => void` | `undefined` | Callback fired when the selection changes. |
| `minDate` | `Date \| null` | `undefined` | Earliest selectable date boundary. |
| `maxDate` | `Date \| null` | `undefined` | Latest selectable date boundary. |
| `disabledDates` | `DisabledDateRule \| DisabledDateRule[]` | `undefined` | Specific dates, ranges, or predicate functions marking dates disabled. |
| `disabled` | `boolean` | `false` | Whether the entire date picker input is disabled. |
| `locale` | `string` | `"en"` | Day.js locale code for calendar formatting and names. |
| `placeholder` | `string` | `undefined` | Input placeholder text. |
| `format` | `string` | `undefined` | Custom date display format (e.g. `"YYYY-MM-DD"`). |
| `clearable` | `boolean` | `true` | Whether to display a clear button when a date is selected. |
| `label` | `string` | `undefined` | Accessible label rendered above the input. |
| `autoCloseOnSelect` | `boolean` | `true` | Automatically close popover when selection finishes. |
| `className` | `string` | `undefined` | Additional CSS classes for the container. |
| `id` | `string` | `undefined` | Optional input element ID. |
| `name` | `string` | `undefined` | Optional input element name. |
| `required` | `boolean` | `false` | Whether the form field is required. |

---

## Keyboard Navigation

| Key | Action |
| :--- | :--- |
| `Enter` / `Space` / `ArrowDown` (on trigger) | Opens the calendar popup or drawer. |
| `ArrowLeft` / `ArrowRight` | Navigate to previous / next day. |
| `ArrowUp` / `ArrowDown` | Navigate to previous / next week. |
| `PageUp` / `PageDown` | Jump to previous / next month. |
| `Shift` + `PageUp` / `Shift` + `PageDown` | Jump to previous / next year. |
| `Home` / `End` | Jump to the first / last day of the current month. |
| `Enter` / `Space` (on calendar day) | Select the focused date. |
| `Escape` | Close the calendar popover or drawer and return focus to trigger. |

---

## Accessibility

- **Input Trigger**: Features `aria-haspopup="dialog"`, `aria-expanded={isOpen}`, and accessible labels.
- **Calendar Grid**: Built with WAI-ARIA `role="grid"`, `role="columnheader"`, and `role="gridcell"`.
- **Selected & Disabled States**: Reflected via `aria-selected="true"` and `aria-disabled="true"`.
- **Focus Ring**: Every interactive element uses visible Antrosys focus rings (`focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)]`).
- **No Traps**: Clean escape key dismissal and focus restoration to the trigger input.
