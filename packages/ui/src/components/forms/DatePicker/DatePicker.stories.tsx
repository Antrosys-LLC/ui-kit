import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Forms/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    mode: "single",
    label: "Event Date",
    placeholder: "Select a date...",
  },
};

export const SingleDate: Story = {
  args: {
    mode: "single",
    label: "Scheduled Appointment",
    defaultValue: new Date(2026, 8, 15),
  },
};

export const DateRangeExample: Story = {
  name: "DateRange",
  args: {
    mode: "range",
    label: "Booking Duration",
    defaultValue: {
      from: new Date(2026, 8, 10),
      to: new Date(2026, 8, 20),
    },
  },
};

export const PartiallySelectedRange: Story = {
  args: {
    mode: "range",
    label: "Flight Departure & Return",
    defaultValue: {
      from: new Date(2026, 8, 12),
      to: null,
    },
  },
};

export const MonthYearPicker: Story = {
  args: {
    mode: "month",
    label: "Billing Statement Month",
    defaultValue: new Date(2026, 8, 1),
  },
};

export const WithMinDate: Story = {
  args: {
    mode: "single",
    label: "Future Reservation Only",
    minDate: new Date(2026, 8, 10),
    defaultValue: new Date(2026, 8, 15),
  },
};

export const WithMaxDate: Story = {
  args: {
    mode: "single",
    label: "Historical Records Only",
    maxDate: new Date(2026, 8, 20),
    defaultValue: new Date(2026, 8, 5),
  },
};

export const WithMinAndMaxDate: Story = {
  args: {
    mode: "range",
    label: "Q3 Project Sprint",
    minDate: new Date(2026, 8, 1),
    maxDate: new Date(2026, 8, 30),
    defaultValue: {
      from: new Date(2026, 8, 5),
      to: new Date(2026, 8, 15),
    },
  },
};

export const WithDisabledDates: Story = {
  args: {
    mode: "single",
    label: "Weekday Appointments (Weekends Disabled)",
    disabledDates: [
      // Disable weekends
      (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
      },
      // Disable specific holiday date
      new Date(2026, 8, 25),
    ],
  },
};

export const DifferentLocale: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[var(--ant-color-surface-text-sub)]">
          Demonstrates dynamic localization with formatted month and weekday names.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            label="Spanish (es)"
            locale="es"
            defaultValue={new Date(2026, 8, 15)}
          />
          <DatePicker
            label="French (fr)"
            locale="fr"
            defaultValue={new Date(2026, 8, 15)}
          />
        </div>
      </div>
    );
  },
};

export const Empty: Story = {
  args: {
    mode: "single",
    label: "Unselected Date Field",
    placeholder: "Pick a date...",
  },
};

export const Selected: Story = {
  args: {
    mode: "single",
    label: "Confirmed Departure Date",
    defaultValue: new Date(2026, 8, 18),
  },
};

export const Disabled: Story = {
  args: {
    mode: "single",
    label: "Locked Delivery Date",
    disabled: true,
    defaultValue: new Date(2026, 8, 22),
  },
};

export const MobileDrawer: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    mode: "range",
    label: "Mobile Hotel Stay",
    defaultValue: {
      from: new Date(2026, 8, 14),
      to: new Date(2026, 8, 18),
    },
  },
  render: (args) => (
    <div className="w-full max-w-xs mx-auto">
      <div className="p-3 mb-3 rounded-lg bg-[var(--ant-color-brand-primary-lt)] text-[var(--ant-color-brand-primary)] text-xs">
        📱 In mobile viewports (&le; 640px), the date picker opens as a native bottom sheet drawer.
      </div>
      <DatePicker {...args} />
    </div>
  ),
};

export const LightTheme: Story = {
  args: {
    mode: "range",
    label: "Light Theme Schedule",
    defaultValue: {
      from: new Date(2026, 8, 8),
      to: new Date(2026, 8, 16),
    },
  },
};

export const DarkTheme: Story = {
  args: {
    mode: "range",
    label: "Dark Theme Schedule",
    defaultValue: {
      from: new Date(2026, 8, 8),
      to: new Date(2026, 8, 16),
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4 max-w-md">
        <div className="p-3 rounded-lg bg-[var(--ant-color-neutral-100)] text-[var(--ant-color-neutral-800)] dark:bg-[var(--ant-color-neutral-800)] dark:text-[var(--ant-color-neutral-100)] text-xs space-y-1">
          <div className="font-semibold text-sm mb-1">⌨️ Keyboard Navigation Guide:</div>
          <div><kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">Enter</kbd> / <kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">&darr;</kbd>: Open Calendar</div>
          <div><kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">&larr;</kbd> <kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">&rarr;</kbd> <kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">&uarr;</kbd> <kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">&darr;</kbd>: Navigate Days & Weeks</div>
          <div><kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">PageUp</kbd> / <kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">PageDown</kbd>: Jump Months (<kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">Shift</kbd> for Years)</div>
          <div><kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">Home</kbd> / <kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">End</kbd>: Start / End of month</div>
          <div><kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">Enter</kbd> / <kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">Space</kbd>: Select Date</div>
          <div><kbd className="px-1 bg-white dark:bg-black rounded shadow-xs">Escape</kbd>: Close Calendar</div>
        </div>
        <DatePicker
          mode="single"
          label="Accessible Keyboard DatePicker"
          defaultValue={new Date(2026, 8, 15)}
        />
      </div>
    );
  },
};
