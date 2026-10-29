
import {
  Calendar,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  Clock,
  Timer,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

/* ================= TYPES ================= */

export type DateTimeMode =
  | "date"
  | "range"
  | "month"
  | "year"
  | "yearRange"
  | "time"
  | "timeRange";

type PanelMode = "calendar" | "month" | "year";

interface DateTimeSelectorProps {
  label?: string;
  required?: boolean;
  mode: DateTimeMode;
  value: any;
  onChange: (value: any) => void;
  error?: string | FieldError;
  registration?: UseFormRegisterReturn;
  minYear?: number;
  maxYear?: number;
  /** When false, months/dates after "today" cannot be selected. Defaults to true (unrestricted). */
  isFutureSelectable?: boolean;
}

/* ================= CONSTANTS ================= */

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const iconMap = {
  date: Calendar,
  range: CalendarDays,
  month: CalendarDays,
  year: CalendarClock,
  yearRange: CalendarClock,
  time: Clock,
  timeRange: Timer,
};

/* ================= HELPERS ================= */

const today = new Date();

const pad = (n: number) => String(n).padStart(2, "0");

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseDateLikeValue = (value: unknown): Date | null => {
  if (typeof value !== "string") return null;

  if (ISO_DATE_PATTERN.test(value)) {
    const [yearText, monthText, dayText] = value.split("-");
    const yearNumber = Number(yearText);
    const monthNumber = Number(monthText);
    const dayNumber = Number(dayText);

    if (
      Number.isFinite(yearNumber) &&
      Number.isFinite(monthNumber) &&
      Number.isFinite(dayNumber)
    ) {
      return new Date(yearNumber, monthNumber - 1, dayNumber);
    }
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const formatDate = (y: number, m: number, d: number) =>
  `${y}-${pad(m + 1)}-${pad(d)}`;

const buildMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = Array(firstDay).fill(null);

  for (let i = 1; i <= totalDays; i++) {
    cells.push(i);
  }

  return cells;
};

const getInitialPanelMode = (mode: DateTimeMode): PanelMode => {
  if (mode === "month") return "month";
  if (mode === "year" || mode === "yearRange") return "year";
  return "calendar";
};

/* ============ FUTURE-RESTRICTION HELPERS (additive, opt-in only) ============ */

const TODAY_YEAR = today.getFullYear();
const TODAY_MONTH = today.getMonth();
const TODAY_STR = formatDate(TODAY_YEAR, TODAY_MONTH, today.getDate());

const isMonthFutureOrCurrent = (monthIndex: number) => monthIndex >= TODAY_MONTH;

const isDateFuture = (dateStr: string) => dateStr > TODAY_STR;

/* ================= COMPONENT ================= */

export default function DateTimeSelector({
  label,
  required,
  mode,
  value,
  onChange,
  error,
  registration,
  minYear=1990,
  maxYear,
  isFutureSelectable = true,
}: DateTimeSelectorProps) {

  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const [panelMode, setPanelMode] = useState<PanelMode>(
    getInitialPanelMode(mode)
  );

  const [viewYear, setViewYear] = useState(
    parseDateLikeValue(value)?.getFullYear() ?? today.getFullYear()
  );

  const [viewMonth, setViewMonth] = useState(
    parseDateLikeValue(value)?.getMonth() ?? today.getMonth()
  );

  // Set default year range if not provided
  const yearMin = minYear ?? today.getFullYear() - 50;
  const yearMax = maxYear ?? today.getFullYear();

  const Icon = iconMap[mode];

  const updateMenuPosition = useCallback(() => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const preferredHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < preferredHeight && spaceAbove > spaceBelow;
    const availableSpace = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(160, Math.min(preferredHeight, availableSpace - 8));

    setMenuStyle({
      position: "fixed",
      left: rect.left,
      top: openUp ? Math.max(8, rect.top - maxHeight - 4) : rect.bottom + 4,
      width: rect.width,
      maxHeight,
      zIndex: 2147483647,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  /* ================= OUTSIDE CLICK ================= */

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !wrapperRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= RESET PANEL ON OPEN ================= */

  useEffect(() => {
    if (open) {
      setPanelMode(getInitialPanelMode(mode));
    }
  }, [open, mode]);

  /* ================= EDIT MODE SYNC ================= */

  useEffect(() => {
    let nextYear: number | null = null;
    let nextMonth: number | null = null;

    if (!value) {
      nextYear = today.getFullYear();
      nextMonth = today.getMonth();
    }

    if (mode === "date" && typeof value === "string") {
      const d = parseDateLikeValue(value);

      if (d) {
        nextYear = d.getFullYear();
        nextMonth = d.getMonth();
      }
    }

    if (mode === "range" && value?.start) {
      const d = parseDateLikeValue(value.start);

      if (d) {
        nextYear = d.getFullYear();
        nextMonth = d.getMonth();
      }
    }

    if (mode === "month" && typeof value?.month === "number") {
      nextMonth = value.month;
    }

    if (mode === "year" && typeof value?.year === "number") {
      nextYear = value.year;
    }

    if (mode === "yearRange" && value?.startYear) {
      nextYear = value.startYear;
    }

    if (typeof nextYear === "number") {
      setViewYear((prev) => (prev === nextYear ? prev : nextYear));
    }

    if (typeof nextMonth === "number") {
      setViewMonth((prev) => (prev === nextMonth ? prev : nextMonth));
    }

  }, [value, mode]);

  /* ================= DISPLAY ================= */

  const displayValue = () => {

    if (!value) return "Select";

    switch (mode) {

      case "date":
        return value;

      case "range":
        return value?.start && value?.end
          ? `${value.start} → ${value.end}`
          : "Select range";

      case "month":
        return months[value.month];

      case "year":
        return value.year;

      case "yearRange":
        return value?.startYear && value?.endYear
          ? `${value.startYear}-${String(value.endYear).slice(-2)}`
          : "Select Financial Year";

      case "time":
        return value.time;

      case "timeRange":
        return `${value.startTime} → ${value.endTime}`;

      default:
        return "Select";
    }
  };

  /* ================= RANGE HANDLER ================= */

  const handleRangeClick = (date: string) => {

    if (!isFutureSelectable && isDateFuture(date)) return;

    if (!value?.start || value?.end) {
      onChange({
        start: date,
        end: "",
      });

    } else {

      if (date < value.start) return;

      onChange({
        start: value.start,
        end: date,
      });

      setOpen(false);
    }
  };

  /* ================= YEAR CLICK HANDLER ================= */

  const handleYearClick = (y: number) => {

    // DATE / RANGE MODE
    if (mode === "date" || mode === "range") {
      setViewYear(y);
      setPanelMode("calendar");
      return;
    }

    // YEAR MODE
    if (mode === "year") {
      onChange({ year: y });
      setOpen(false);
      return;
    }

    // YEAR RANGE MODE
    if (mode === "yearRange") {
      onChange({
        startYear: y,
        endYear: y + 1,
      });

      setOpen(false);
      return;
    }
  };

  /* ================= MONTH-PANEL FUTURE RESTRICTION ================= */

  // Only relevant for plain "month" mode (used by Monthly reporting period).
  // When isFutureSelectable is false, the current month and future months are disabled.
  const isMonthOptionDisabled = (monthIndex: number) =>
    mode === "month" && !isFutureSelectable && isMonthFutureOrCurrent(monthIndex);

  return (
    <div
      className="w-full mb-4 relative"
      ref={wrapperRef}
    >

      {/* LABEL */}
      {label && (
        <label className="block mb-1 text-md font-medium">
          {label}
          {required && " *"}
        </label>
      )}

      <input
        type="hidden"
        {...registration}
      />

      {/* INPUT */}
      <div
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full px-4 py-3 min-h-12 rounded-lg
          bg-(--input-bg-color)
          flex justify-between items-center cursor-pointer
          ${error
            ? "border-b-3 border-b-red-500"
            : "focus-within:border-b-3 focus-within:border-b-(--primary)"
          }
        `}
      >

        <div className="flex items-center gap-2">
          <Icon size={18} />

          <span className="text-sm">
            {displayValue()}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180" : ""
            }`}
        />
      </div>

      {/* Render in a portal so parent popovers and scroll areas cannot clip the picker. */}
      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          data-date-time-menu
          style={menuStyle}
          className="overflow-hidden rounded-xl bg-white shadow-lg"
        >

          <div className="max-h-80 overflow-y-auto p-4">

            {/* YEAR PANEL */}
            {panelMode === "year" && (
              <div className="grid grid-cols-4 gap-2">

                {Array.from(
                  { length: yearMax - yearMin + 1 },
                  (_, i) => yearMin + i
                ).map((y) => {

                  const selected =
                    mode === "year"
                      ? value?.year === y
                      : value?.startYear === y ||
                      value?.endYear === y;

                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => handleYearClick(y)}
                      className={`
                      py-1 rounded text-sm
                      ${selected
                          ? "bg-(--primary) text-white"
                          : "bg-gray-100 hover:bg-(--primary) hover:text-white"
                        }
                    `}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}

            {/* MONTH PANEL */}
            {panelMode === "month" && (
              <div className="grid grid-cols-3 gap-2">

                {months.map((m, i) => {

                  const disabled = isMonthOptionDisabled(i);

                  return (
                    <button
                      key={m}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        onChange({ month: i });
                        setOpen(false);
                      }}
                      className={`
                      py-2 rounded
                      ${disabled
                          ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-(--primary) hover:text-white"
                        }
                    `}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            )}

            {/* CALENDAR */}
            {(mode === "date" || mode === "range") &&
              panelMode === "calendar" && (
                <>

                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-2">

                    {/* PREVIOUS */}
                    <button
                      type="button"
                      onClick={() => {

                        if (viewMonth === 0) {

                          setViewMonth(11);
                          setViewYear((prev) => prev - 1);

                        } else {

                          setViewMonth((prev) => prev - 1);
                        }
                      }}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                    >
                      ‹
                    </button>

                    {/* MONTH YEAR */}
                    <button
                      type="button"
                      onClick={() => setPanelMode("year")}
                      className="font-medium text-sm"
                    >
                      {months[((viewMonth % 12) + 12) % 12]} {viewYear}
                    </button>

                    {/* NEXT */}
                    <button
                      type="button"
                      onClick={() => {

                        if (viewMonth === 11) {

                          setViewMonth(0);
                          setViewYear((prev) => prev + 1);

                        } else {

                          setViewMonth((prev) => prev + 1);
                        }
                      }}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                    >
                      ›
                    </button>
                  </div>

                  {/* WEEK DAYS */}
                  <div className="grid grid-cols-7 text-xs text-center mb-1">

                    {weekDays.map((d) => (
                      <span key={d}>
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* DAYS */}
                  <div className="grid grid-cols-7 gap-1">

                    {buildMonthDays(
                      viewYear,
                      viewMonth
                    ).map((d, i) => {

                      if (!d) {
                        return <div key={i} />;
                      }

                      const date = formatDate(
                        viewYear,
                        viewMonth,
                        d
                      );

                      const normalizedValue =
                        typeof value === "string"
                          ? value.split("T")[0]
                          : value;

                      const todayDate = formatDate(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                      );

                      const selected =
                        mode === "date"
                          ? normalizedValue
                            ? normalizedValue === date
                            : todayDate === date
                          : date === value?.start || date === value?.end;

                      const disabled = !isFutureSelectable && isDateFuture(date);

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={disabled}
                          onClick={() => {

                            if (disabled) return;

                            if (mode === "date") {
                              onChange(date);
                              setOpen(false);
                            } else {
                              handleRangeClick(date);
                            }
                          }}
                          className={`
                          py-1 rounded
                          ${disabled
                              ? "text-gray-300 cursor-not-allowed"
                              : selected
                                ? "bg-(--primary) text-white"
                                : "hover:bg-gray-200"
                            }
                        `}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

            {/* TIME */}
            {(mode === "time" || mode === "timeRange") && (
              <div className="grid grid-cols-4 gap-2">

                {Array.from({ length: 24 }).map((_, h) => {

                  const t = `${pad(h)}:00`;

                  const selected =
                    mode === "time"
                      ? value?.time === t
                      : value?.startTime === t ||
                      value?.endTime === t;

                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => {

                        if (mode === "time") {

                          onChange({ time: t });
                          setOpen(false);

                        } else {

                          if (
                            !value?.startTime ||
                            value?.endTime
                          ) {

                            onChange({
                              startTime: t,
                              endTime: "",
                            });

                          } else {

                            if (t < value.startTime) return;

                            onChange({
                              startTime: value.startTime,
                              endTime: t,
                            });

                            setOpen(false);
                          }
                        }
                      }}
                      className={`
                      py-2 rounded
                      ${selected
                          ? "bg-(--primary) text-white"
                          : "bg-gray-100 hover:bg-(--primary) hover:text-white"
                        }
                    `}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* ERROR */}
      {error && (
        <p className="text-xs text-red-500 mt-1">
          *{" "}
          {typeof error === "string"
            ? error
            : error.message}
        </p>
      )}
    </div>
  );
}
