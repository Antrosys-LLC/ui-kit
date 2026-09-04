import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { clsx } from "clsx";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

// Ensure required Day.js plugins are loaded
dayjs.extend(isBetween);

export type DatePickerMode = "single" | "range" | "month";

export interface DateRange {
  /** Start date of the range */
  from?: Date | null;
  /** End date of the range */
  to?: Date | null;
}

export type DisabledDateRule =
  | Date
  | Date[]
  | { from?: Date; to?: Date }
  | ((date: Date) => boolean);

export interface DatePickerProps {
  /** Selection mode: single date, date range, or month/year */
  mode?: DatePickerMode;
  /** Controlled selection value */
  value?: Date | DateRange | null;
  /** Initial uncontrolled selection value */
  defaultValue?: Date | DateRange | null;
  /** Callback fired when selected date or date range changes */
  onChange?: (value: Date | DateRange | null) => void;
  /** Earliest selectable date boundary */
  minDate?: Date | null;
  /** Latest selectable date boundary */
  maxDate?: Date | null;
  /** Rules for dates that should be disabled and non-selectable */
  disabledDates?: DisabledDateRule | DisabledDateRule[];
  /** Whether the entire input is disabled */
  disabled?: boolean;
  /** Day.js locale code (e.g. "en", "es", "fr", "de", "ja") */
  locale?: string;
  /** Input placeholder string */
  placeholder?: string;
  /** Date format string for the input display (e.g. "YYYY-MM-DD", "MMM D, YYYY") */
  format?: string;
  /** Whether to show a clear button when a value is selected */
  clearable?: boolean;
  /** Accessible label for the input trigger */
  label?: string;
  /** Whether to automatically close the picker upon completing a selection */
  autoCloseOnSelect?: boolean;
  /** Additional CSS class names for the outer container */
  className?: string;
  /** Optional form field ID */
  id?: string;
  /** Optional form field name */
  name?: string;
  /** Whether this field is required */
  required?: boolean;
}

const focusRingClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ant-color-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ant-color-surface-bg-card)]";

function isDateDisabled(
  date: Dayjs,
  minDate?: Date | null,
  maxDate?: Date | null,
  disabledDates?: DisabledDateRule | DisabledDateRule[],
): boolean {
  const d = date.startOf("day");

  if (minDate) {
    const min = dayjs(minDate).startOf("day");
    if (d.isBefore(min)) return true;
  }

  if (maxDate) {
    const max = dayjs(maxDate).startOf("day");
    if (d.isAfter(max)) return true;
  }

  if (!disabledDates) return false;

  const rules = Array.isArray(disabledDates) ? disabledDates : [disabledDates];
  const nativeDate = d.toDate();

  for (const rule of rules) {
    if (typeof rule === "function") {
      if (rule(nativeDate)) return true;
    } else if (rule instanceof Date) {
      if (d.isSame(dayjs(rule).startOf("day"), "day")) return true;
    } else if (Array.isArray(rule)) {
      for (const item of rule) {
        if (d.isSame(dayjs(item).startOf("day"), "day")) return true;
      }
    } else if (rule && typeof rule === "object") {
      const from = rule.from ? dayjs(rule.from).startOf("day") : null;
      const to = rule.to ? dayjs(rule.to).startOf("day") : null;
      if (from && to && d.isBetween(from, to, "day", "[]")) return true;
      if (from && !to && (d.isAfter(from) || d.isSame(from, "day"))) return true;
      if (!from && to && (d.isBefore(to) || d.isSame(to, "day"))) return true;
    }
  }

  return false;
}

/**
 * DatePicker component for Antrosys UI Kit.
 * Built with React + Day.js, supporting single date, date range,
 * month/year selection, min/max dates, disabled rules, full keyboard navigation,
 * and mobile drawer presentation.
 */
export function DatePicker({
  mode = "single",
  value: controlledValue,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  disabled = false,
  locale = "en",
  placeholder,
  format,
  clearable = true,
  label,
  autoCloseOnSelect = true,
  className,
  id: propId,
  name,
  required,
}: DatePickerProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const generatedId = useId();
  const inputId = propId || generatedId;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<Date | DateRange | null>(
    defaultValue ?? null,
  );
  const selectedValue = isControlled ? controlledValue : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"days" | "months" | "years">(
    mode === "month" ? "months" : "days",
  );

  // Active viewing month / year in calendar
  const [viewDate, setViewDate] = useState<Dayjs>(() => {
    if (selectedValue) {
      if (selectedValue instanceof Date) return dayjs(selectedValue);
      if ("from" in selectedValue && selectedValue.from)
        return dayjs(selectedValue.from);
    }
    return dayjs();
  });

  // Focused date for keyboard navigation
  const [focusedDate, setFocusedDate] = useState<Dayjs>(() => viewDate);

  // Range selection state
  const [rangeStart, setRangeStart] = useState<Dayjs | null>(() => {
    if (
      selectedValue &&
      typeof selectedValue === "object" &&
      "from" in selectedValue &&
      selectedValue.from
    ) {
      return dayjs(selectedValue.from);
    }
    return null;
  });
  const [rangeEnd, setRangeEnd] = useState<Dayjs | null>(() => {
    if (
      selectedValue &&
      typeof selectedValue === "object" &&
      "to" in selectedValue &&
      selectedValue.to
    ) {
      return dayjs(selectedValue.to);
    }
    return null;
  });
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Synchronize internal range state when controlled value changes
  useEffect(() => {
    if (mode === "range") {
      if (selectedValue && typeof selectedValue === "object" && "from" in selectedValue) {
        setRangeStart(selectedValue.from ? dayjs(selectedValue.from) : null);
        setRangeEnd(selectedValue.to ? dayjs(selectedValue.to) : null);
      } else {
        setRangeStart(null);
        setRangeEnd(null);
      }
    }
  }, [mode, selectedValue]);

  // Default display formats
  const defaultFormat = useMemo(() => {
    if (format) return format;
    if (mode === "month") return "MMMM YYYY";
    return "MMM D, YYYY";
  }, [format, mode]);

  // Formatted value for the input field
  const displayValue = useMemo(() => {
    if (!selectedValue) return "";
    if (mode === "single" && selectedValue instanceof Date) {
      return dayjs(selectedValue).locale(locale).format(defaultFormat);
    }
    if (mode === "month" && selectedValue instanceof Date) {
      return dayjs(selectedValue).locale(locale).format(defaultFormat);
    }
    if (mode === "range" && typeof selectedValue === "object" && "from" in selectedValue) {
      const fromStr = selectedValue.from
        ? dayjs(selectedValue.from).locale(locale).format(defaultFormat)
        : "";
      const toStr = selectedValue.to
        ? dayjs(selectedValue.to).locale(locale).format(defaultFormat)
        : "";
      if (fromStr && toStr) return `${fromStr} - ${toStr}`;
      if (fromStr) return `${fromStr} - ...`;
      return "";
    }
    return "";
  }, [defaultFormat, locale, mode, selectedValue]);

  const defaultPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    if (mode === "range") return "Select date range...";
    if (mode === "month") return "Select month...";
    return "Select date...";
  }, [mode, placeholder]);

  // Outside click handler to close popover
  useEffect(() => {
    if (!isOpen || isMobile) return undefined;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isMobile, isOpen]);

  // Commit value change helper
  const commitValue = useCallback(
    (newValue: Date | DateRange | null) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      commitValue(null);
      setRangeStart(null);
      setRangeEnd(null);
      setHoverDate(null);
      inputRef.current?.focus();
    },
    [commitValue],
  );

  // Month navigation
  const prevMonth = () => setViewDate((d) => d.subtract(1, "month"));
  const nextMonth = () => setViewDate((d) => d.add(1, "month"));
  const prevYear = () => setViewDate((d) => d.subtract(1, "year"));
  const nextYear = () => setViewDate((d) => d.add(1, "year"));

  // Day selection
  const handleSelectDate = useCallback(
    (targetDate: Dayjs) => {
      if (isDateDisabled(targetDate, minDate, maxDate, disabledDates)) return;

      if (mode === "single") {
        commitValue(targetDate.toDate());
        if (autoCloseOnSelect) setIsOpen(false);
      } else if (mode === "month") {
        commitValue(targetDate.startOf("month").toDate());
        if (autoCloseOnSelect) setIsOpen(false);
      } else if (mode === "range") {
        if (!rangeStart || (rangeStart && rangeEnd)) {
          // Starting new range
          setRangeStart(targetDate);
          setRangeEnd(null);
          commitValue({ from: targetDate.toDate(), to: null });
        } else {
          // Completing range
          let from = rangeStart;
          let to = targetDate;
          if (targetDate.isBefore(rangeStart)) {
            from = targetDate;
            to = rangeStart;
          }
          setRangeStart(from);
          setRangeEnd(to);
          commitValue({ from: from.toDate(), to: to.toDate() });
          if (autoCloseOnSelect) setIsOpen(false);
        }
      }
    },
    [
      autoCloseOnSelect,
      commitValue,
      disabledDates,
      maxDate,
      minDate,
      mode,
      rangeEnd,
      rangeStart,
    ],
  );

  // Keyboard navigation inside calendar
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.focus();
        return;
      }

      let newFocused = focusedDate;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          newFocused = focusedDate.subtract(1, "day");
          break;
        case "ArrowRight":
          e.preventDefault();
          newFocused = focusedDate.add(1, "day");
          break;
        case "ArrowUp":
          e.preventDefault();
          newFocused = focusedDate.subtract(7, "day");
          break;
        case "ArrowDown":
          e.preventDefault();
          newFocused = focusedDate.add(7, "day");
          break;
        case "PageUp":
          e.preventDefault();
          newFocused = e.shiftKey
            ? focusedDate.subtract(1, "year")
            : focusedDate.subtract(1, "month");
          break;
        case "PageDown":
          e.preventDefault();
          newFocused = e.shiftKey
            ? focusedDate.add(1, "year")
            : focusedDate.add(1, "month");
          break;
        case "Home":
          e.preventDefault();
          newFocused = focusedDate.startOf("month");
          break;
        case "End":
          e.preventDefault();
          newFocused = focusedDate.endOf("month");
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleSelectDate(focusedDate);
          return;
        default:
          return;
      }

      setFocusedDate(newFocused);
      setViewDate(newFocused);
    },
    [focusedDate, handleSelectDate, isOpen],
  );

  // Generate 42 calendar grid days (6 weeks) for current viewDate
  const calendarDays = useMemo(() => {
    const startOfMonth = viewDate.locale(locale).startOf("month");
    const startDayOfWeek = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)
    const startDate = startOfMonth.subtract(startDayOfWeek, "day");

    const days: Dayjs[] = [];
    for (let i = 0; i < 42; i += 1) {
      days.push(startDate.add(i, "day"));
    }
    return days;
  }, [locale, viewDate]);

  // Weekday header names
  const weekdayNames = useMemo(() => {
    const baseSunday = dayjs().locale(locale).day(0);
    const names: string[] = [];
    for (let i = 0; i < 7; i += 1) {
      names.push(baseSunday.add(i, "day").format("dd"));
    }
    return names;
  }, [locale]);

  // Month names for Month View
  const monthNames = useMemo(() => {
    const months: string[] = [];
    for (let i = 0; i < 12; i += 1) {
      months.push(dayjs().locale(locale).month(i).format("MMM"));
    }
    return months;
  }, [locale]);

  // Render Calendar Content
  const renderCalendar = () => (
    <div
      ref={gridRef}
      role="application"
      aria-label="Calendar view"
      className="p-[var(--ant-spacing-4)] w-[320px] max-w-full select-none"
    >
      {/* Header: Month & Year Controls */}
      <div className="flex items-center justify-between mb-[var(--ant-spacing-3)] pb-[var(--ant-spacing-2)] border-b border-[var(--ant-color-surface-border)]">
        <div className="flex items-center gap-[var(--ant-spacing-1)]">
          <button
            type="button"
            onClick={prevYear}
            className={clsx(
              "p-[var(--ant-spacing-1.5)] rounded-[var(--ant-radius-md)] text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)] transition-colors",
              focusRingClass,
            )}
            aria-label="Previous year"
          >
            <svg
              className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={prevMonth}
            className={clsx(
              "p-[var(--ant-spacing-1.5)] rounded-[var(--ant-radius-md)] text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)] transition-colors",
              focusRingClass,
            )}
            aria-label="Previous month"
          >
            <svg
              className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Month/Year selector toggle */}
        <button
          type="button"
          onClick={() =>
            setViewMode((m) => (m === "days" ? "months" : "days"))
          }
          className={clsx(
            "px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-sm)] font-semibold text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)] transition-colors",
            focusRingClass,
          )}
          aria-label={`Switch view: currently viewing ${viewDate.locale(locale).format("MMMM YYYY")}`}
        >
          {viewDate.locale(locale).format("MMMM YYYY")}
        </button>

        <div className="flex items-center gap-[var(--ant-spacing-1)]">
          <button
            type="button"
            onClick={nextMonth}
            className={clsx(
              "p-[var(--ant-spacing-1.5)] rounded-[var(--ant-radius-md)] text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)] transition-colors",
              focusRingClass,
            )}
            aria-label="Next month"
          >
            <svg
              className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextYear}
            className={clsx(
              "p-[var(--ant-spacing-1.5)] rounded-[var(--ant-radius-md)] text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)] transition-colors",
              focusRingClass,
            )}
            aria-label="Next year"
          >
            <svg
              className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === "months" && (
        <div className="grid grid-cols-3 gap-[var(--ant-spacing-2)] py-[var(--ant-spacing-2)]">
          {monthNames.map((mName, idx) => {
            const isCurrentMonth =
              viewDate.month() === idx &&
              (selectedValue instanceof Date
                ? dayjs(selectedValue).month() === idx &&
                  dayjs(selectedValue).year() === viewDate.year()
                : false);
            return (
              <button
                key={mName}
                type="button"
                onClick={() => {
                  const newDate = viewDate.month(idx);
                  setViewDate(newDate);
                  if (mode === "month") {
                    handleSelectDate(newDate);
                  } else {
                    setViewMode("days");
                  }
                }}
                className={clsx(
                  "py-[var(--ant-spacing-2.5)] rounded-[var(--ant-radius-lg)] text-[var(--ant-typography-fontSize-sm)] font-medium transition-colors",
                  isCurrentMonth
                    ? "bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-neutral-0)] font-semibold"
                    : "text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)]",
                  focusRingClass,
                )}
              >
                {mName}
              </button>
            );
          })}
        </div>
      )}

      {/* Days Grid View */}
      {viewMode === "days" && (
        <>
          {/* Weekday Headers */}
          <div
            role="row"
            className="grid grid-cols-7 mb-[var(--ant-spacing-1.5)] text-center"
          >
            {weekdayNames.map((name) => (
              <div
                key={name}
                role="columnheader"
                aria-label={name}
                className="text-[var(--ant-typography-fontSize-xs)] font-semibold text-[var(--ant-color-surface-text-sub)] uppercase tracking-wider py-[var(--ant-spacing-1)]"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div
            role="grid"
            aria-label={`Month of ${viewDate.locale(locale).format("MMMM YYYY")}`}
            className="grid grid-cols-7 gap-y-[var(--ant-spacing-1)] text-center"
          >
            {calendarDays.map((dayObj) => {
              const isCurrentMonth = dayObj.isSame(viewDate, "month");
              const isToday = dayObj.isSame(dayjs(), "day");
              const isDisabled = isDateDisabled(
                dayObj,
                minDate,
                maxDate,
                disabledDates,
              );

              // Selection checks
              let isSelected = false;
              let isRangeStartDay = false;
              let isRangeEndDay = false;
              let isInRangeDay = false;

              if (mode === "single" && selectedValue instanceof Date) {
                isSelected = dayObj.isSame(dayjs(selectedValue), "day");
              } else if (mode === "range") {
                if (rangeStart && dayObj.isSame(rangeStart, "day")) {
                  isRangeStartDay = true;
                  isSelected = true;
                }
                if (rangeEnd && dayObj.isSame(rangeEnd, "day")) {
                  isRangeEndDay = true;
                  isSelected = true;
                }
                if (rangeStart && rangeEnd) {
                  const from = rangeStart.isBefore(rangeEnd)
                    ? rangeStart
                    : rangeEnd;
                  const to = rangeStart.isBefore(rangeEnd)
                    ? rangeEnd
                    : rangeStart;
                  isInRangeDay = dayObj.isBetween(from, to, "day", "()");
                } else if (rangeStart && !rangeEnd && hoverDate) {
                  const from = rangeStart.isBefore(hoverDate)
                    ? rangeStart
                    : hoverDate;
                  const to = rangeStart.isBefore(hoverDate)
                    ? hoverDate
                    : rangeStart;
                  isInRangeDay = dayObj.isBetween(from, to, "day", "()");
                }
              }

              const isFocused = dayObj.isSame(focusedDate, "day");

              return (
                <div
                  key={dayObj.format("YYYY-MM-DD")}
                  className={clsx(
                    "relative p-0 flex items-center justify-center",
                    isInRangeDay &&
                      "bg-[var(--ant-color-brand-primary-lt)] dark:bg-[var(--ant-color-neutral-800)]",
                    isRangeStartDay &&
                      (rangeEnd || hoverDate) &&
                      "rounded-l-[var(--ant-radius-full)]",
                    isRangeEndDay &&
                      rangeStart &&
                      "rounded-r-[var(--ant-radius-full)]",
                  )}
                >
                  <button
                    type="button"
                    role="gridcell"
                    disabled={isDisabled}
                    tabIndex={isFocused ? 0 : -1}
                    aria-selected={isSelected}
                    aria-disabled={isDisabled}
                    aria-label={dayObj
                      .locale(locale)
                      .format("dddd, MMMM D, YYYY")}
                    onClick={() => handleSelectDate(dayObj)}
                    onMouseEnter={() => {
                      if (mode === "range" && rangeStart && !rangeEnd) {
                        setHoverDate(dayObj);
                      }
                    }}
                    className={clsx(
                      "w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] flex items-center justify-center rounded-[var(--ant-radius-full)] text-[var(--ant-typography-fontSize-sm)] font-medium transition-all duration-[var(--ant-motion-duration-fast)]",
                      isSelected
                        ? "bg-[var(--ant-color-brand-primary)] text-[var(--ant-color-neutral-0)] font-semibold shadow-[var(--ant-shadow-sm)]"
                        : isCurrentMonth
                          ? "text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)]"
                          : "text-[var(--ant-color-neutral-400)] dark:text-[var(--ant-color-neutral-600)] hover:bg-[var(--ant-color-neutral-50)] dark:hover:bg-[var(--ant-color-neutral-900)]",
                      isToday &&
                        !isSelected &&
                        "border border-[var(--ant-color-brand-primary)] text-[var(--ant-color-brand-primary)] font-semibold",
                      isDisabled &&
                        "opacity-30 cursor-not-allowed hover:bg-transparent pointer-events-none",
                      focusRingClass,
                    )}
                  >
                    {dayObj.date()}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Quick Footer: Today / Clear Shortcuts */}
      <div className="flex items-center justify-between mt-[var(--ant-spacing-3)] pt-[var(--ant-spacing-2)] border-t border-[var(--ant-color-surface-border)]">
        <button
          type="button"
          onClick={() => {
            const today = dayjs();
            setViewDate(today);
            setFocusedDate(today);
            handleSelectDate(today);
          }}
          className={clsx(
            "px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-brand-primary)] hover:bg-[var(--ant-color-brand-primary-lt)] transition-colors",
            focusRingClass,
          )}
        >
          Today
        </button>
        {clearable && selectedValue && (
          <button
            type="button"
            onClick={handleClear}
            className={clsx(
              "px-[var(--ant-spacing-2)] py-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-typography-fontSize-xs)] font-medium text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-semantic-error)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)] transition-colors",
              focusRingClass,
            )}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={clsx("relative inline-block w-full max-w-sm", className)}
    >
      {/* Optional Accessible Field Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[var(--ant-typography-fontSize-sm)] font-medium text-[var(--ant-color-surface-text)] mb-[var(--ant-spacing-1.5)]"
        >
          {label}
          {required && (
            <span
              className="text-[var(--ant-color-semantic-error)] ml-[var(--ant-spacing-1)]"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      {/* Input Trigger Button */}
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="text"
          readOnly
          disabled={disabled}
          value={displayValue}
          placeholder={defaultPlaceholder}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={label || defaultPlaceholder}
          required={required}
          className={clsx(
            "w-full h-10 px-[var(--ant-spacing-3)] pl-[var(--ant-spacing-10)] pr-[var(--ant-spacing-10)] rounded-[var(--ant-radius-lg)] text-[var(--ant-typography-fontSize-sm)] cursor-pointer select-none transition-all",
            "bg-[var(--ant-color-surface-bg-card)] text-[var(--ant-color-surface-text)] border border-[var(--ant-color-surface-border)] shadow-[var(--ant-shadow-sm)]",
            "hover:border-[var(--ant-color-neutral-400)] dark:hover:border-[var(--ant-color-neutral-600)]",
            disabled &&
              "opacity-50 cursor-not-allowed bg-[var(--ant-color-neutral-100)] dark:bg-[var(--ant-color-neutral-900)] pointer-events-none",
            focusRingClass,
          )}
        />

        {/* Left Calendar Icon */}
        <div
          aria-hidden="true"
          className="absolute left-[var(--ant-spacing-3)] text-[var(--ant-color-surface-text-sub)] pointer-events-none flex items-center"
        >
          <svg
            className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        {/* Right Clear or Toggle Icon */}
        <div className="absolute right-[var(--ant-spacing-2.5)] flex items-center gap-[var(--ant-spacing-1)]">
          {clearable && selectedValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={clsx(
                "p-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)] hover:bg-[var(--ant-color-neutral-100)] dark:hover:bg-[var(--ant-color-neutral-800)] transition-colors",
                focusRingClass,
              )}
              aria-label="Clear selected date"
            >
              <svg
                className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            className={clsx(
              "p-[var(--ant-spacing-1)] rounded-[var(--ant-radius-md)] text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)] transition-transform duration-[var(--ant-motion-duration-normal)]",
              isOpen && "rotate-180",
              focusRingClass,
            )}
            aria-label={isOpen ? "Close calendar" : "Open calendar"}
          >
            <svg
              className="w-[var(--ant-spacing-4)] h-[var(--ant-spacing-4)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Popover View */}
      {isOpen && !isMobile && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Calendar Popover"
          className={clsx(
            "absolute top-full left-0 mt-[var(--ant-spacing-2)] z-[var(--ant-zIndex-dropdown)]",
            "bg-[var(--ant-color-surface-bg-card)] rounded-[var(--ant-radius-xl)] border border-[var(--ant-color-surface-border)] shadow-[var(--ant-shadow-xl)]",
            "animate-in fade-in zoom-in-95 duration-[var(--ant-motion-duration-fast)]",
          )}
        >
          {renderCalendar()}
        </div>
      )}

      {/* Mobile Drawer / Bottom Sheet View */}
      {isOpen && isMobile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Select Date Drawer"
          className="fixed inset-0 z-[var(--ant-zIndex-modal)] flex flex-col justify-end"
        >
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[var(--ant-color-neutral-900)]/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal */}
          <div className="relative w-full bg-[var(--ant-color-surface-bg-card)] border-t border-[var(--ant-color-surface-border)] rounded-t-[var(--ant-radius-2xl)] shadow-[var(--ant-shadow-xl)] z-10 flex flex-col max-h-[85vh] overflow-y-auto">
            {/* Sheet Handle */}
            <div className="flex justify-center pt-[var(--ant-spacing-3)] pb-[var(--ant-spacing-1)]">
              <div
                className="w-10 h-1 rounded-full bg-[var(--ant-color-neutral-300)] dark:bg-[var(--ant-color-neutral-700)]"
                aria-hidden="true"
              />
            </div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between px-[var(--ant-spacing-4)] py-[var(--ant-spacing-2)] border-b border-[var(--ant-color-surface-border)]">
              <h3 className="text-[var(--ant-typography-fontSize-md)] font-bold text-[var(--ant-color-surface-text)]">
                {mode === "range"
                  ? "Select Date Range"
                  : mode === "month"
                    ? "Select Month"
                    : "Select Date"}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "p-[var(--ant-spacing-1.5)] rounded-[var(--ant-radius-md)] text-[var(--ant-color-surface-text-sub)] hover:text-[var(--ant-color-surface-text)]",
                  focusRingClass,
                )}
                aria-label="Close date picker sheet"
              >
                <svg
                  className="w-[var(--ant-spacing-5)] h-[var(--ant-spacing-5)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Calendar in Drawer */}
            <div className="flex justify-center pb-[var(--ant-spacing-6)]">
              {renderCalendar()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
