import { useMemo, useState } from "react";
import Calendar from "./components/Calender";
import Notes from "./components/Notes";

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function getWeekRange(baseDate) {
  const day = startOfDay(baseDate);
  const mondayOffset = (day.getDay() + 6) % 7;

  const start = new Date(day);
  start.setDate(day.getDate() - mondayOffset);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
}

export default function App() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [range, setRange] = useState({ start: null, end: null });

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(viewDate),
    [viewDate],
  );

  const selectionLabel = useMemo(() => {
    if (!range.start) return "Pick a start date";
    if (!range.end)
      return `Start: ${toDateKey(range.start)}. Pick an end date.`;
    return `${toDateKey(range.start)} to ${toDateKey(range.end)}`;
  }, [range.end, range.start]);

  const monthKey = useMemo(() => toMonthKey(viewDate), [viewDate]);

  const rangeKey = useMemo(() => {
    if (!range.start || !range.end) return "";
    return `${toDateKey(range.start)}__${toDateKey(range.end)}`;
  }, [range.end, range.start]);

  const startDateKey = useMemo(() => {
    if (!range.start) return "";
    return toDateKey(range.start);
  }, [range.start]);

  const rangeLengthDays = useMemo(() => {
    if (!range.start || !range.end) return 0;
    const dayMs = 24 * 60 * 60 * 1000;
    return Math.floor((range.end - range.start) / dayMs) + 1;
  }, [range.end, range.start]);

  const handleDayClick = (clickedDate) => {
    const day = startOfDay(clickedDate);

    setRange((current) => {
      if (!current.start || (current.start && current.end)) {
        return { start: day, end: null };
      }

      if (sameDay(day, current.start)) {
        return { start: day, end: day };
      }

      if (day < current.start) {
        return { start: day, end: current.start };
      }

      return { start: current.start, end: day };
    });

    if (
      day.getMonth() !== viewDate.getMonth() ||
      day.getFullYear() !== viewDate.getFullYear()
    ) {
      setViewDate(new Date(day.getFullYear(), day.getMonth(), 1));
    }
  };

  const goToPreviousMonth = () => {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  };

  const jumpToToday = () => {
    const today = startOfDay(new Date());
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setRange({ start: today, end: today });
  };

  const applyPresetRange = (preset) => {
    const today = startOfDay(new Date());

    if (preset === "THIS_WEEK") {
      const weekRange = getWeekRange(today);
      setRange(weekRange);
      setViewDate(
        new Date(weekRange.start.getFullYear(), weekRange.start.getMonth(), 1),
      );
      return;
    }

    if (preset === "NEXT_7_DAYS") {
      const end = new Date(today);
      end.setDate(today.getDate() + 6);
      setRange({ start: today, end });
      setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] bg-[var(--paper)] shadow-[var(--calendar-shadow)] calendar-shell">
        <div className="calendar-rings" aria-hidden="true" />

        <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
          <Calendar
            monthLabel={monthLabel}
            selectionLabel={selectionLabel}
            viewDate={viewDate}
            range={range}
            onDayClick={handleDayClick}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            onJumpToday={jumpToToday}
            onPresetRange={applyPresetRange}
          />

          <Notes
            monthLabel={monthLabel}
            monthKey={monthKey}
            startDateKey={startDateKey}
            rangeKey={rangeKey}
            selectionLabel={selectionLabel}
            rangeLengthDays={rangeLengthDays}
            hasStartDate={Boolean(range.start)}
            hasCompleteRange={Boolean(range.start && range.end)}
            onClearRange={() => setRange({ start: null, end: null })}
          />
        </div>
      </section>
    </main>
  );
}
