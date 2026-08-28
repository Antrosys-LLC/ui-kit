import React, { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { z } from 'zod';
import { useForm, type DefaultValues } from 'react-hook-form';

export type WizardValues = Record<string, any>;

export interface WizardStep<TData extends WizardValues = WizardValues> {
  /** Unique key or identifier for the step */
  id: string;
  /** Display title for step header/indicator */
  title: string;
  /** Description or subtitle */
  description?: string;
  /** Step-specific fields used for per-step validation */
  fields?: Array<keyof TData>;
  /** Optional Zod schema for this step */
  schema?: z.ZodType<TData>;
  /** Content to render for this step */
  component:
    | React.ReactNode
    | ((helpers: { data: TData; updateData: (fields: Partial<TData>) => void }) => React.ReactNode);
  /** Optional custom validator function before advancing */
  validate?: (data: TData) => boolean | Promise<boolean>;
}

export interface MultiStepWizardProps<TData extends WizardValues = WizardValues> {
  /** Array of wizard steps */
  steps: WizardStep<TData>[];
  /** Final submission handler */
  onSubmit: (formData: TData) => void | Promise<void>;
  /** Initial form values */
  initialValues?: Partial<TData>;
  /** Save progress draft to localStorage */
  saveDraft?: boolean;
  /** Custom localStorage key */
  draftKey?: string;
  /** Show top progress bar */
  showProgress?: boolean;
  /** Visual theme for the entire form */
  theme?: 'light' | 'dark';
  /** Custom class name */
  className?: string;
}

const getInitialValues = <TData extends WizardValues>(
  initialValues: Partial<TData> | undefined,
  draftKey: string,
  saveDraft: boolean,
): Partial<TData> => {
  if (saveDraft && typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<TData>;
        if (parsed && typeof parsed === 'object') {
          return { ...initialValues, ...parsed };
        }
      }
    } catch {
      // Ignore invalid storage and fall back to initial values.
    }
  }

  return initialValues ?? {};
};

export function MultiStepWizard<TData extends WizardValues>({
  steps = [],
  onSubmit,
  initialValues = {},
  saveDraft = false,
  draftKey = 'ant_wizard_draft',
  showProgress = true,
  theme = 'light',
  className,
}: MultiStepWizardProps<TData>) {
  const defaultValues = getInitialValues(initialValues, draftKey, saveDraft) as DefaultValues<TData>;

  const methods = useForm<TData>({
    defaultValues,
    mode: 'onSubmit',
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [focusedAction, setFocusedAction] = useState<'back' | 'next' | null>(null);

  const formData = methods.watch() as TData;

  useEffect(() => {
    if (saveDraft && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(draftKey, JSON.stringify(formData));
      } catch (error) {
        console.error('Failed to save wizard draft to localStorage', error);
      }
    }
  }, [formData, saveDraft, draftKey]);

  const currentStep = steps[currentStepIndex] ?? null;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progressPercent = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  const updateData = (fields: Partial<TData>) => {
    Object.entries(fields).forEach(([key, value]) => {
      methods.setValue(key as any, value as any, {
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  };

  const validateCurrentStep = useMemo(() => {
    return async (): Promise<boolean> => {
      setErrorMsg(null);

      if (!currentStep) {
        return false;
      }

      const stepData = currentStep.fields?.length
        ? (currentStep.fields.reduce((acc, field) => {
            acc[field as string] = formData[field as string];
            return acc;
          }, {} as Record<string, any>))
        : formData;

      if (currentStep.schema) {
        const parsed = currentStep.schema.safeParse(stepData as TData);
        if (!parsed.success) {
          const message = parsed.error.issues[0]?.message || 'Please complete all required fields correctly before proceeding.';
          setErrorMsg(message);
          return false;
        }
      }

      if (currentStep.validate) {
        const isValid = await currentStep.validate(formData);
        if (!isValid) {
          setErrorMsg('Please complete all required fields correctly before proceeding.');
          return false;
        }
      }

      return true;
    };
  }, [currentStep, formData]);

  const handleNext = async () => {
    setIsValidating(true);

    try {
      const isStepValid = await validateCurrentStep();
      if (!isStepValid) {
        return;
      }

      if (isLastStep) {
        await onSubmit(formData);
        if (saveDraft && typeof window !== 'undefined') {
          window.localStorage.removeItem(draftKey);
        }
        return;
      }

      setCurrentStepIndex((prev: number) => prev + 1);
    } finally {
      setIsValidating(false);
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (!isFirstStep) {
      setCurrentStepIndex((prev: number) => prev - 1);
    }
  };

  if (!steps || steps.length === 0 || !currentStep) {
    return null;
  }

  const isDark = theme === 'dark';
  const surface = isDark ? 'var(--ant-color-neutral-900)' : 'var(--ant-color-neutral-0)';
  const border = isDark ? 'var(--ant-color-neutral-700)' : 'var(--ant-color-surface-border)';
  const heading = isDark ? 'var(--ant-color-neutral-0)' : 'var(--ant-color-neutral-900)';
  const muted = isDark ? 'var(--ant-color-neutral-300)' : 'var(--ant-color-neutral-500)';
  const progressTrack = isDark ? 'var(--ant-color-neutral-800)' : 'var(--ant-color-neutral-200)';
  const progressFill = 'var(--ant-color-brand-primary)';
  const actionBg = isDark ? 'var(--ant-color-neutral-900)' : 'var(--ant-color-neutral-0)';
  const actionBorder = isDark ? 'var(--ant-color-neutral-600)' : 'var(--ant-color-neutral-300)';
  const actionText = isDark ? 'var(--ant-color-neutral-0)' : 'var(--ant-color-neutral-900)';
  const metaText = isDark ? 'var(--ant-color-neutral-300)' : 'var(--ant-color-neutral-500)';
  const divider = isDark ? 'var(--ant-color-neutral-700)' : 'var(--ant-color-neutral-200)';
  const errorBg = isDark
    ? 'color-mix(in srgb, var(--ant-color-semantic-error) 16%, var(--ant-color-neutral-900))'
    : 'color-mix(in srgb, var(--ant-color-semantic-error) 10%, var(--ant-color-neutral-0))';
  const errorText = isDark ? 'var(--ant-color-neutral-0)' : 'var(--ant-color-semantic-error)';
  const errorBorder = 'var(--ant-color-semantic-error)';
  const focusGlow = isDark
    ? 'color-mix(in srgb, var(--ant-color-brand-primary) 35%, transparent)'
    : 'color-mix(in srgb, var(--ant-color-brand-primary) 25%, transparent)';

  return (
    <div
      className={clsx('ant-wizard', className)}
      style={{
        width: '100%',
        maxWidth: '640px',
        border: `1px solid ${border}`,
        borderRadius: 'var(--ant-radius-xl)',
        backgroundColor: surface,
        padding: 'var(--ant-spacing-6)',
        fontFamily: 'inherit',
        color: heading,
      }}
    >
      {showProgress && (
        <div style={{ marginBottom: 'var(--ant-spacing-5)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--ant-typography-fontSize-xs)',
              fontWeight: 500,
              color: metaText,
              marginBottom: 'var(--ant-spacing-2)',
            }}
          >
            <span>
              Step {currentStepIndex + 1} of {steps.length}: {currentStep.title}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div
            style={{
              height: 'var(--ant-spacing-1)',
              backgroundColor: progressTrack,
              width: '100%',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: progressFill,
                transition: 'width var(--ant-motion-duration-slow) var(--ant-motion-easing-default)',
              }}
            />
          </div>
        </div>
      )}

      <div style={{ marginBottom: 'var(--ant-spacing-4)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--ant-typography-fontSize-lg)', fontWeight: 600, color: heading }}>
          {currentStep.title}
        </h3>
        {currentStep.description && (
          <p style={{ margin: 'var(--ant-spacing-1) 0 0 0', fontSize: 'var(--ant-typography-fontSize-sm)', color: muted }}>
            {currentStep.description}
          </p>
        )}
      </div>

      <div
        key={currentStep.id}
        style={{
          minHeight: '160px',
          padding: 'var(--ant-spacing-2) 0',
          animation: 'wizard-step-fade var(--ant-motion-duration-normal) var(--ant-motion-easing-out)',
        }}
      >
        {typeof currentStep.component === 'function'
          ? currentStep.component({ data: formData, updateData })
          : currentStep.component}
      </div>
      <style>{`
        @keyframes wizard-step-fade {
          from {
            opacity: 0;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {errorMsg && (
        <div
          style={{
            marginTop: 'var(--ant-spacing-3)',
            padding: 'var(--ant-spacing-2) var(--ant-spacing-3)',
            fontSize: 'var(--ant-typography-fontSize-xs)',
            backgroundColor: errorBg,
            color: errorText,
            border: `1px solid ${errorBorder}`,
          }}
        >
          {errorMsg}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 'var(--ant-spacing-6)',
          paddingTop: 'var(--ant-spacing-4)',
          borderTop: `1px solid ${divider}`,
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          onFocus={() => setFocusedAction('back')}
          onBlur={() => setFocusedAction((prev: 'back' | 'next' | null) => (prev === 'back' ? null : prev))}
          disabled={isFirstStep || isValidating}
          style={{
            padding: 'var(--ant-spacing-2) var(--ant-spacing-4)',
            fontSize: 'var(--ant-typography-fontSize-base)',
            fontWeight: 500,
            borderRadius: 'var(--ant-radius-lg)',
            border: `1px solid ${actionBorder}`,
            backgroundColor: actionBg,
            color: isFirstStep ? (isDark ? 'var(--ant-color-neutral-400)' : 'var(--ant-color-neutral-400)') : actionText,
            cursor: isFirstStep ? 'not-allowed' : 'pointer',
            outline: 'none',
            boxShadow: focusedAction === 'back' ? `0 0 0 3px ${focusGlow}` : 'none',
          }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          onFocus={() => setFocusedAction('next')}
          onBlur={() => setFocusedAction((prev: 'back' | 'next' | null) => (prev === 'next' ? null : prev))}
          disabled={isValidating}
          style={{
            padding: 'var(--ant-spacing-2) var(--ant-spacing-4)',
            fontSize: 'var(--ant-typography-fontSize-base)',
            fontWeight: 500,
            borderRadius: 'var(--ant-radius-lg)',
            border: `1px solid ${'var(--ant-color-brand-primary)'}`,
            backgroundColor: progressFill,
            color: 'var(--ant-color-neutral-0)',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: focusedAction === 'next' ? `0 0 0 3px ${focusGlow}` : 'none',
          }}
        >
          {isValidating ? 'Validating...' : isLastStep ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
