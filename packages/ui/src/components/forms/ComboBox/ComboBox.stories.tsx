import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Combobox, ComboboxOption } from './ComboBox';
import { ThemeContext } from '../../../providers/ThemeProvider';

const meta = {
  title: 'Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    onCreate: { action: 'created' },
    // Expose direct theme control in Storybook panel
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Explicit theme override supporting scoped dark/light resolution',
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const standardOptions: ComboboxOption[] = [
  { label: 'React', value: 'react', group: 'Frontend' },
  { label: 'Vue', value: 'vue', group: 'Frontend' },
  { label: 'Next.js', value: 'nextjs', group: 'Fullstack' },
  { label: 'Remix', value: 'remix', group: 'Fullstack' },
  { label: 'FastAPI', value: 'fastapi', group: 'Backend' },
  { label: 'Express', value: 'express', group: 'Backend' },
];

export const Default: Story = {
  args: {
    options: standardOptions,
    placeholder: 'Select a framework...',
    clearable: true,
  },
};

export const MultiSelectWithChips: Story = {
  args: {
    options: standardOptions,
    multi: true,
    value: ['react', 'nextjs'],
    clearable: true,
    placeholder: 'Select frameworks...',
  },
};

export const InsideCard: Story = {
  name: 'Inside Card Layout',
  args: {
    options: standardOptions,
    placeholder: 'Select a framework...',
    clearable: true,
  },
  render: (args) => (
    <div className="p-4">
      <div className="relative w-[360px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-5 shadow-sm">
        <h4 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Project Configuration
        </h4>
        <p className="mb-3 text-xs text-neutral-500">
          Select the primary framework for your application. The dropdown list pops over the card content.
        </p>
        <Combobox {...args} />
      </div>
    </div>
  ),
};

export const AsyncLoading: Story = {
  args: {
    options: [],
    async: true,
    placeholder: 'Loading remote options...',
  },
};

export const ScopedDarkMode: Story = {
  args: {
    options: standardOptions,
    placeholder: 'Scoped dark mode...',
    clearable: true,
  },
  render: (args) => (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {}, setTheme: () => {} }}>
      <div className="rounded-lg bg-neutral-950 p-6">
        <Combobox {...args} />
      </div>
    </ThemeContext.Provider>
  ),
};

export const CreateNewOption: Story = {
  args: {
    options: standardOptions,
    value: 'react',
    clearable: true,
    placeholder: 'Type to search or create...',
  },
  render: function CreateNewOptionStory(args) {
    const [options, setOptions] = useState<ComboboxOption[]>(standardOptions);
    const [selected, setSelected] = useState<string | string[]>(args.value ?? 'react');

    const handleCreate = (newLabel: string) => {
      const newOpt: ComboboxOption = {
        label: newLabel,
        value: newLabel.toLowerCase().replace(/\s+/g, '-'),
        group: 'Custom',
      };
      setOptions((prev) => [...prev, newOpt]);
      setSelected(newOpt.value);
      args.onCreate?.(newLabel);
    };

    return (
      <Combobox
        {...args}
        options={options}
        value={selected}
        onChange={(nextValue) => {
          setSelected(nextValue);
          args.onChange?.(nextValue);
        }}
        onCreate={handleCreate}
      />
    );
  },
};