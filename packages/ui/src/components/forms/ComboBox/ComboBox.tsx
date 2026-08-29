import React, {
  useState,
  useRef,
  useEffect,
  useId,
  createContext,
  useContext,
} from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Rule 3: Theme Resolution via React Context (ThemeProvider)
// ---------------------------------------------------------------------------
export interface ThemeContextValue {
  theme?: 'light' | 'dark' | string;
  isDark?: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

// ---------------------------------------------------------------------------
// Component Interfaces
// ---------------------------------------------------------------------------
export interface ComboboxOption {
  label: string;
  value: string;
  group?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Array of selectable option items */
  options: ComboboxOption[];
  /** Controlled selection value (string for single, string[] for multi) */
  value?: string | string[];
  /** Value change callback */
  onChange?: (value: string | string[]) => void;
  /** Enable multi-select with tag chips */
  multi?: boolean;
  /** Async search / loading state indicator */
  async?: boolean;
  /** Callback triggered when user chooses to create a new option */
  onCreate?: (searchQuery: string) => void;
  /** Placeholder text when selection is empty */
  placeholder?: string;
  /** Show clear selection button */
  clearable?: boolean;
  /** Disabled interaction state */
  disabled?: boolean;
  /** Optional custom class names */
  className?: string;
  /** Direct theme override prop */
  theme?: 'light' | 'dark';
}

export function Combobox({
  options = [],
  value,
  onChange,
  multi = false,
  async = false,
  onCreate,
  placeholder = 'Select an option...',
  clearable = false,
  disabled = false,
  className,
  theme: propTheme,
}: ComboboxProps) {
  // Rule 3: Local theme resolution directly from ThemeProvider context / props
  const context = useTheme();
  const activeTheme = propTheme ?? context.theme ?? 'light';
  const isDark = propTheme
    ? propTheme === 'dark'
    : Boolean(context.isDark || activeTheme === 'dark');

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  });
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (value !== undefined) {
      setSelected(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const filteredOptions =
    query.trim() === ''
      ? options
      : options.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase())
        );

  const groupedOptions = filteredOptions.reduce<Record<string, ComboboxOption[]>>(
    (acc, opt) => {
      const groupName = opt.group || '';
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(opt);
      return acc;
    },
    {}
  );

  const canCreate = Boolean(
    onCreate &&
      query.trim().length > 0 &&
      !options.some((opt) => opt.label.toLowerCase() === query.trim().toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const item = listboxRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      ) as HTMLElement | null;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (optionValue: string) => {
    let updated: string[];
    if (multi) {
      updated = selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue];
    } else {
      updated = [optionValue];
      setIsOpen(false);
      setQuery('');
    }
    setSelected(updated);
    onChange?.(multi ? updated : updated[0] || '');
  };

  const handleRemoveChip = (e: React.MouseEvent, valToRemove: string) => {
    e.stopPropagation();
    const updated = selected.filter((v) => v !== valToRemove);
    setSelected(updated);
    onChange?.(multi ? updated : updated[0] || '');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected([]);
    setQuery('');
    onChange?.(multi ? [] : '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        if (!filteredOptions[highlightedIndex].disabled) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
      } else if (isOpen && canCreate) {
        onCreate?.(query.trim());
        setQuery('');
        if (!multi) setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      data-theme={activeTheme}
      className={cn(
        // Rule 1: Tailwind layout and design tokens; fully overridable via incoming className
        'ant-combobox relative w-full max-w-[380px] font-sans text-sm',
        className
      )}
    >
      {/* Combobox Trigger Box (Rule 2: Pseudo-states via Tailwind variants, no raw <style>) */}
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-1.5 border px-2.5 py-1.5 transition-colors',
          // Light Mode
          !isDark && [
            'border-[var(--ant-color-neutral-300,#d1d5db)] bg-[var(--ant-color-surface-base,#ffffff)]',
            'focus-within:border-[var(--ant-color-brand-primary,#2563eb)] focus-within:ring-1 focus-within:ring-[var(--ant-color-brand-primary,#2563eb)]',
            disabled
              ? 'cursor-not-allowed bg-[var(--ant-color-neutral-100,#f3f4f6)] opacity-70'
              : 'cursor-text hover:border-[var(--ant-color-neutral-400,#9ca3af)]'
          ],
          // Rule 3: Scoped Dark Mode
          isDark && [
            'border-neutral-700 bg-neutral-900',
            'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500',
            disabled
              ? 'cursor-not-allowed bg-neutral-800/60 opacity-60'
              : 'cursor-text hover:border-neutral-500'
          ]
        )}
      >
        {/* Multi-Select Chips */}
        {multi &&
          selected.map((val) => {
            const opt = options.find((o) => o.value === val);
            const label = opt?.label || val;
            return (
              <span
                key={val}
                className={cn(
                  'inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium',
                  isDark
                    ? 'border border-neutral-700 bg-neutral-800 text-neutral-200'
                    : 'bg-[var(--ant-color-neutral-100,#e5e7eb)] text-[var(--ant-color-neutral-900,#111827)]'
                )}
              >
                {label}
                <button
                  type="button"
                  onClick={(e) => handleRemoveChip(e, val)}
                  aria-label={`Remove ${label}`}
                  className={cn(
                    'cursor-pointer border-none bg-transparent p-0 text-sm leading-none focus:outline-none',
                    isDark
                      ? 'text-neutral-400 hover:text-neutral-100'
                      : 'text-[var(--ant-color-neutral-600,#4b5563)] hover:text-[var(--ant-color-neutral-900,#111827)]'
                  )}
                >
                  &times;
                </button>
              </span>
            );
          })}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          disabled={disabled}
          placeholder={selected.length === 0 ? placeholder : ''}
          value={
            !multi && !isOpen && selected[0]
              ? options.find((o) => o.value === selected[0])?.label ?? selected[0]
              : query
          }
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex-1 basis-[60px] border-none bg-transparent p-0 text-sm outline-none disabled:cursor-not-allowed',
            isDark
              ? 'text-neutral-100 placeholder:text-neutral-500'
              : 'text-[var(--ant-color-neutral-900,#111827)] placeholder:text-[var(--ant-color-neutral-400,#9ca3af)]'
          )}
        />

        {async && (
          <span
            className={cn(
              'text-xs',
              isDark ? 'text-neutral-400' : 'text-[var(--ant-color-neutral-500,#6b7280)]'
            )}
          >
            Loading...
          </span>
        )}

        {/* Clear Action Button */}
        {clearable && selected.length > 0 && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear selection"
            className={cn(
              'cursor-pointer border-none bg-transparent p-0 text-sm leading-none focus:outline-none',
              isDark
                ? 'text-neutral-500 hover:text-neutral-300'
                : 'text-[var(--ant-color-neutral-400,#9ca3af)] hover:text-[var(--ant-color-neutral-600,#4b5563)]'
            )}
          >
            &#x2715;
          </button>
        )}
      </div>

      {/* Popover Dropdown */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          className={cn(
            'absolute left-0 right-0 top-[calc(100%+4px)] z-50 m-0 max-h-[220px] list-none overflow-y-auto border py-1 shadow-lg',
            isDark
              ? 'border-neutral-700 bg-neutral-900 text-neutral-100'
              : 'border-[var(--ant-color-neutral-300,#d1d5db)] bg-[var(--ant-color-surface-base,#ffffff)] text-[var(--ant-color-neutral-900,#111827)]'
          )}
        >
          {filteredOptions.length === 0 && !canCreate ? (
            <li
              className={cn(
                'px-3 py-2 text-[13px]',
                isDark ? 'text-neutral-400' : 'text-[var(--ant-color-neutral-500,#6b7280)]'
              )}
            >
              No results found
            </li>
          ) : (
            Object.entries(groupedOptions).map(([groupName, groupOpts]) => (
              <React.Fragment key={groupName || 'ungrouped'}>
                {groupName && (
                  <li
                    className={cn(
                      'select-none px-3 pb-0.5 pt-1.5 text-[11px] font-semibold uppercase tracking-wider',
                      isDark ? 'text-neutral-500' : 'text-[var(--ant-color-neutral-400,#9ca3af)]'
                    )}
                  >
                    {groupName}
                  </li>
                )}
                {groupOpts.map((opt) => {
                  const itemIndex = filteredOptions.indexOf(opt);
                  const isSelected = selected.includes(opt.value);
                  const isHighlighted = itemIndex === highlightedIndex;

                  return (
                    <li
                      key={opt.value}
                      data-index={itemIndex}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled}
                      onClick={() => !opt.disabled && handleSelect(opt.value)}
                      onMouseEnter={() => !opt.disabled && setHighlightedIndex(itemIndex)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-[13px] transition-colors',
                        opt.disabled && [
                          'cursor-not-allowed',
                          isDark ? 'text-neutral-600' : 'text-[var(--ant-color-neutral-400,#9ca3af)]',
                        ],
                        !opt.disabled && [
                          'cursor-pointer',
                          isDark ? 'text-neutral-100' : 'text-[var(--ant-color-neutral-900,#111827)]',
                        ],
                        isHighlighted && !opt.disabled && [
                          isDark ? 'bg-neutral-800' : 'bg-[var(--ant-color-neutral-100,#f3f4f6)]',
                        ],
                        isSelected && [
                          'font-semibold',
                          isDark ? 'text-blue-400' : 'text-[var(--ant-color-brand-primary,#2563eb)]',
                        ]
                      )}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <span className="text-xs font-bold leading-none">&#x2713;</span>}
                    </li>
                  );
                })}
              </React.Fragment>
            ))
          )}

          {canCreate && (
            <li
              role="option"
              aria-selected={false}
              onClick={() => {
                onCreate?.(query.trim());
                setQuery('');
                if (!multi) setIsOpen(false);
              }}
              className={cn(
                'cursor-pointer border-t px-3 py-2 text-[13px] font-medium transition-colors',
                isDark
                  ? 'border-neutral-800 text-blue-400 hover:bg-neutral-800'
                  : 'border-[var(--ant-color-neutral-200,#e5e7eb)] text-[var(--ant-color-brand-primary,#2563eb)] hover:bg-[var(--ant-color-neutral-100,#f3f4f6)]'
              )}
            >
              + Create &ldquo;{query}&rdquo;
            </li>
          )}
        </ul>
      )}
    </div>
  );
}