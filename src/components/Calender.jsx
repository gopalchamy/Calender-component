import { useEffect, useRef, useState } from "react";

const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function isInRange(day, start, end) {
  if (!start || !end) return false;
  return day > start && day < end;
}

function getMonthMatrix(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);

  // Convert JS week (Sun=0) into Monday-first index.
  const mondayFirstOffset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayFirstOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

export default function Calendar({
  monthLabel,
  selectionLabel,
  viewDate,
  range,
  onDayClick,
  onPreviousMonth,
  onNextMonth,
  onJumpToday,
  onPresetRange,
}) {
  const monthDays = getMonthMatrix(viewDate);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");
  const flipTimerRef = useRef(null);

  useEffect(() => {
    setIsFlipping(true);

    if (flipTimerRef.current) {
      window.clearTimeout(flipTimerRef.current);
    }

    flipTimerRef.current = window.setTimeout(() => {
      setIsFlipping(false);
      flipTimerRef.current = null;
    }, 560);

    return () => {
      if (flipTimerRef.current) {
        window.clearTimeout(flipTimerRef.current);
      }
    };
  }, [monthLabel]);

  const handlePreviousMonth = () => {
    setFlipDirection("prev");
    onPreviousMonth();
  };

  const handleNextMonth = () => {
    setFlipDirection("next");
    onNextMonth();
  };

  const handleDaySelect = (day) => {
    if (day.getFullYear() < viewDate.getFullYear()) {
      setFlipDirection("prev");
    } else if (day.getFullYear() > viewDate.getFullYear()) {
      setFlipDirection("next");
    } else if (day.getMonth() < viewDate.getMonth()) {
      setFlipDirection("prev");
    } else if (day.getMonth() > viewDate.getMonth()) {
      setFlipDirection("next");
    }

    onDayClick(day);
  };

  const handleJumpToday = () => {
    const now = new Date();
    const targetIndex = now.getFullYear() * 12 + now.getMonth();
    const currentIndex = viewDate.getFullYear() * 12 + viewDate.getMonth();
    setFlipDirection(targetIndex < currentIndex ? "prev" : "next");
    onJumpToday();
  };

  const handlePresetRange = (preset) => {
    setFlipDirection("next");
    onPresetRange(preset);
  };

  return (
    <section className="border-b border-slate-200/80 p-4 md:p-6 lg:border-b-0 lg:border-r">
      <div className="overflow-hidden rounded-[22px] bg-slate-100">
        <div className="relative h-56 w-full overflow-hidden md:h-64">
          <img
            src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1500&q=80"
            alt="Snow mountain with climber"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(175deg,transparent_25%,#18a9e8_26%,#18a9e8_66%,#ffffff_67%)]" />

          <div className="absolute bottom-5 right-5 rounded-xl bg-white/20 px-4 py-2 text-right backdrop-blur-sm">
            <p className="text-xs tracking-[0.18em] text-white/90">
              WALL PLANNER
            </p>
            <h1 className="font-['Bebas_Neue'] text-3xl leading-none text-white md:text-4xl">
              {monthLabel}
            </h1>
          </div>
        </div>

        <div
          key={monthLabel}
          className={`calendar-page-flip grid gap-4 p-4 md:p-5 ${
            isFlipping ? `is-flipping ${flipDirection}` : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-sky-500 hover:text-sky-600"
            >
              Prev
            </button>

            <p className="font-['Bebas_Neue'] text-2xl tracking-wider text-slate-800">
              {monthLabel}
            </p>

            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-sky-500 hover:text-sky-600"
            >
              Next
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleJumpToday}
              className="rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-sky-700"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handlePresetRange("THIS_WEEK")}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:border-sky-500 hover:text-sky-600"
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => handlePresetRange("NEXT_7_DAYS")}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:border-sky-500 hover:text-sky-600"
            >
              Next 7 Days
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold tracking-widest text-slate-500 md:text-xs">
            {dayLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {monthDays.map((day) => {
              const isCurrentMonth = day.getMonth() === viewDate.getMonth();
              const isStart = isSameDay(day, range.start);
              const isEnd = isSameDay(day, range.end);
              const between = isInRange(day, range.start, range.end);

              let stateClass =
                "border border-transparent bg-white text-slate-700 hover:border-slate-300";

              if (!isCurrentMonth) {
                stateClass =
                  "border border-transparent bg-slate-100 text-slate-400 hover:border-slate-300";
              }
              if (between) {
                stateClass =
                  "border border-sky-100 bg-sky-100 text-sky-800 hover:border-sky-300";
              }
              if (isStart || isEnd) {
                stateClass =
                  "border border-sky-700 bg-sky-600 text-white shadow-[0_8px_18px_rgba(8,106,158,0.3)]";
              }

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDaySelect(day)}
                  className={`h-10 rounded-xl text-sm font-semibold transition md:h-11 ${stateClass}`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 md:text-sm">
            <span className="font-semibold text-slate-800">Selected:</span>{" "}
            {selectionLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
