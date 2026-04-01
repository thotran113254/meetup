"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Get weekday index (Mon=0 ... Sun=6) for the 1st of the month */
function getFirstWeekday(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

/** Build 6-week grid: each cell = { day, isCurrentMonth } */
function buildCalendarGrid(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);
  const cells: { day: number; isCurrentMonth: boolean }[] = [];

  /* Previous month trailing days */
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  /* Current month */
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true });
  }
  /* Next month leading days — fill to complete last row */
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, isCurrentMonth: false });
    }
  }
  return cells;
}

function formatSelectedDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Calendar date picker matching Figma design */
export function TourCheckoutCalendar({
  selectedDate,
  currentMonth,
  onDateSelect,
  onMonthChange,
}: {
  selectedDate: Date;
  currentMonth: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const cells = buildCalendarGrid(year, month);

  const goToPrevMonth = () => onMonthChange(new Date(year, month - 1));
  const goToNextMonth = () => onMonthChange(new Date(year, month + 1));

  const isSelected = (day: number, isCurrent: boolean) =>
    isCurrent &&
    day === selectedDate.getDate() &&
    month === selectedDate.getMonth() &&
    year === selectedDate.getFullYear();

  return (
    <div className="bg-white rounded-[12px] p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] flex flex-col gap-3 items-center">
      {/* Month navigation */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={goToPrevMonth} aria-label="Previous month">
          <ChevronLeft className="w-6 h-6 text-[#2E2E2E]" />
        </button>
        <span className="text-[16px] font-bold text-[#2E2E2E] tracking-[0.32px]">
          {MONTH_NAMES[month]} {year}
        </span>
        <button type="button" onClick={goToNextMonth} aria-label="Next month">
          <ChevronRight className="w-6 h-6 text-[#2E2E2E]" />
        </button>
      </div>

      {/* Selected date display */}
      <div className="w-full bg-[#F3F3F3] rounded-[8px] px-[14px] py-2 text-center">
        <span className="text-[14px] text-[#1D1D1D] leading-[1.5]">
          {formatSelectedDate(selectedDate)}
        </span>
      </div>

      {/* Day headers + grid */}
      <div className="w-full grid grid-cols-7 gap-y-3">
        {/* Day headers */}
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center">
            <span className="text-[14px] font-bold text-[#1D1D1D] tracking-[0.14px]">
              {d}
            </span>
          </div>
        ))}

        {/* Date cells */}
        {cells.map((cell, i) => {
          const selected = isSelected(cell.day, cell.isCurrentMonth);
          return (
            <div key={i} className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (cell.isCurrentMonth) {
                    onDateSelect(new Date(year, month, cell.day));
                  }
                }}
                className={`w-[30px] h-[30px] flex items-center justify-center rounded-full text-[14px] leading-[1.5] transition-colors ${
                  selected
                    ? "bg-[var(--color-primary)] text-white"
                    : cell.isCurrentMonth
                      ? "text-[#1D1D1D] hover:bg-[#F3F3F3]"
                      : "text-[#BDBDBD]"
                }`}
                disabled={!cell.isCurrentMonth}
              >
                {cell.day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
