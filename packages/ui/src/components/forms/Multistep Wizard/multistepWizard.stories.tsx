import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MultiStepWizard, WizardStep } from './multistepWizard';

const meta = {
  title: 'Forms/MultiStepWizard',
  component: MultiStepWizard,
  tags: ['autodocs'],
  argTypes: {
    theme: { control: 'select', options: ['light', 'dark'] },
    showProgress: { control: 'boolean' },
    saveDraft: { control: 'boolean' },
    draftKey: { control: 'text' },
  },
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--ant-color-surface-bg)' },
        { name: 'dark', value: 'var(--ant-color-neutral-900)' },
      ],
    },
  },
} satisfies Meta<typeof MultiStepWizard>;

export default meta;
type Story = StoryObj<typeof meta>;

const buildDemoSteps = (theme: 'light' | 'dark'): WizardStep[] => {
  const isDark = theme === 'dark';
  const labelColor = isDark ? 'var(--ant-color-neutral-200)' : 'var(--ant-color-neutral-900)';
  const inputBg = isDark ? 'var(--ant-color-neutral-900)' : 'var(--ant-color-neutral-0)';
  const inputBorder = isDark ? 'var(--ant-color-neutral-600)' : 'var(--ant-color-neutral-300)';
  const inputText = isDark ? 'var(--ant-color-neutral-0)' : 'var(--ant-color-neutral-900)';

  return [
    {
      id: 'account',
      title: 'Account Information',
      description: 'Provide your core identity details.',
      validate: (data) => Boolean(data.username && data.email),
      component: ({ data, updateData }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--ant-typography-fontSize-xs)', marginBottom: 'var(--ant-spacing-1)', color: labelColor }}>Username *</label>
            <input
              type="text"
              value={data.username || ''}
              onChange={(e) => updateData({ username: e.target.value })}
              placeholder="e.g. jdoe"
              style={{
                width: '100%',
                padding: 'var(--ant-spacing-2) var(--ant-spacing-3)',
                border: `1px solid ${inputBorder}`,
                borderRadius: 'var(--ant-radius-lg)',
                background: inputBg,
                color: inputText,
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--ant-typography-fontSize-xs)', marginBottom: 'var(--ant-spacing-1)', color: labelColor }}>Email Address *</label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="jdoe@example.com"
              style={{
                width: '100%',
                padding: 'var(--ant-spacing-2) var(--ant-spacing-3)',
                border: `1px solid ${inputBorder}`,
                borderRadius: 'var(--ant-radius-lg)',
                background: inputBg,
                color: inputText,
                outline: 'none',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Customize your role and preferences.',
      validate: (data) => Boolean(data.role),
      component: ({ data, updateData }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--ant-typography-fontSize-xs)', marginBottom: 'var(--ant-spacing-1)', color: labelColor }}>Role / Title *</label>
            <input
              type="text"
              value={data.role || ''}
              onChange={(e) => updateData({ role: e.target.value })}
              placeholder="Frontend Developer"
              style={{
                width: '100%',
                padding: 'var(--ant-spacing-2) var(--ant-spacing-3)',
                border: `1px solid ${inputBorder}`,
                borderRadius: 'var(--ant-radius-lg)',
                background: inputBg,
                color: inputText,
                outline: 'none',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Verify your submitted info before finalizing.',
      component: ({ data }) => (
        <div style={{ fontSize: '13px', lineHeight: 1.6, color: labelColor }}>
          <p><strong>Username:</strong> {data.username || '—'}</p>
          <p><strong>Email:</strong> {data.email || '—'}</p>
          <p><strong>Role:</strong> {data.role || '—'}</p>
        </div>
      ),
    },
  ];
};

const commonArgs = {
  steps: buildDemoSteps('light'),
  onSubmit: (values: Record<string, any>) => alert(`Form Submitted:\n${JSON.stringify(values, null, 2)}`),
  showProgress: true,
  saveDraft: false,
  theme: 'light' as const,
  draftKey: 'storybook_wizard_demo',
};

export const Default: Story = {
  args: commonArgs,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithDraftSaving: Story = {
  args: {
    ...commonArgs,
    saveDraft: true,
    draftKey: 'storybook_wizard_demo',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    ...commonArgs,
    steps: buildDemoSteps('dark'),
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};

export const DarkModeWithDraftSaving: Story = {
  args: {
    ...commonArgs,
    steps: buildDemoSteps('dark'),
    saveDraft: true,
    draftKey: 'storybook_wizard_demo_dark',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};