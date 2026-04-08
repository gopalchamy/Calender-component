import { useEffect, useState } from "react";

const STORAGE_PREFIX = "wall-calendar";

export default function Notes({
  monthLabel,
  monthKey,
  startDateKey,
  rangeKey,
  selectionLabel,
  rangeLengthDays,
  hasStartDate,
  hasCompleteRange,
  onClearRange,
}) {
  const [activeTab, setActiveTab] = useState("month");
  const [monthText, setMonthText] = useState("");
  const [dayText, setDayText] = useState("");
  const [rangeText, setRangeText] = useState("");
  const [copyState, setCopyState] = useState("idle");

  useEffect(() => {
    const monthSaved = localStorage.getItem(
      `${STORAGE_PREFIX}:month:${monthKey}`,
    );
    setMonthText(monthSaved ?? "");
  }, [monthKey]);

  useEffect(() => {
    if (!startDateKey) {
      setDayText("");
      return;
    }

    const daySaved = localStorage.getItem(
      `${STORAGE_PREFIX}:day:${startDateKey}`,
    );
    setDayText(daySaved ?? "");
  }, [startDateKey]);

  useEffect(() => {
    if (!rangeKey) {
      setRangeText("");
      return;
    }

    const rangeSaved = localStorage.getItem(
      `${STORAGE_PREFIX}:range:${rangeKey}`,
    );
    setRangeText(rangeSaved ?? "");
  }, [rangeKey]);

  const handleMonthText = (event) => {
    const nextValue = event.target.value;
    setMonthText(nextValue);
    localStorage.setItem(`${STORAGE_PREFIX}:month:${monthKey}`, nextValue);
  };

  const handleRangeText = (event) => {
    const nextValue = event.target.value;
    setRangeText(nextValue);

    if (rangeKey) {
      localStorage.setItem(`${STORAGE_PREFIX}:range:${rangeKey}`, nextValue);
    }
  };

  const handleDayText = (event) => {
    const nextValue = event.target.value;
    setDayText(nextValue);

    if (startDateKey) {
      localStorage.setItem(`${STORAGE_PREFIX}:day:${startDateKey}`, nextValue);
    }
  };

  const rangeMood =
    rangeLengthDays >= 14
      ? "Long Plan"
      : rangeLengthDays >= 7
        ? "Sprint"
        : rangeLengthDays >= 2
          ? "Short Burst"
          : "Single Day";

  const planSnapshot = [
    `Month: ${monthLabel}`,
    `Selection: ${selectionLabel}`,
    `Range length: ${rangeLengthDays || 0} day(s)`,
    `Mode: ${rangeMood}`,
    `Month memo chars: ${monthText.length}`,
    `Day memo chars: ${dayText.length}`,
    `Range memo chars: ${rangeText.length}`,
  ].join("\n");

  const copySnapshot = async () => {
    if (!navigator?.clipboard) {
      setCopyState("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(planSnapshot);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
    }
  };

  return (
    <aside className="p-4 md:p-6">
      <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-['Bebas_Neue'] text-3xl leading-none text-slate-800">
            Notes
          </h2>
          <button
            type="button"
            onClick={onClearRange}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 transition hover:border-sky-500 hover:text-sky-600"
          >
            Clear Range
          </button>
        </div>

        <div className="mb-4 inline-flex w-full rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("month")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              activeTab === "month"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Month Memo
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("day")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              activeTab === "day"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Day Memo
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("range")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              activeTab === "range"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Range Memo
          </button>
        </div>

        {activeTab === "month" ? (
          <section className="space-y-3">
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Month:{" "}
              <span className="font-semibold text-slate-800">{monthLabel}</span>
            </p>
            <textarea
              value={monthText}
              onChange={handleMonthText}
              rows={9}
              className="notes-area"
              placeholder="Add your month-level goals, reminders, and tasks..."
            />
          </section>
        ) : activeTab === "day" ? (
          <section className="space-y-3">
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Day:{" "}
              <span className="font-semibold text-slate-800">
                {hasStartDate ? startDateKey : "Pick at least one date"}
              </span>
            </p>

            <textarea
              value={dayText}
              onChange={handleDayText}
              rows={9}
              disabled={!hasStartDate}
              className="notes-area disabled:cursor-not-allowed disabled:opacity-55"
              placeholder={
                hasStartDate
                  ? "Write notes for this specific date..."
                  : "Select a date to enable day memo."
              }
            />
          </section>
        ) : (
          <section className="space-y-3">
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Range:{" "}
              <span className="font-semibold text-slate-800">
                {selectionLabel}
              </span>
            </p>

            <textarea
              value={rangeText}
              onChange={handleRangeText}
              rows={9}
              disabled={!hasCompleteRange}
              className="notes-area disabled:cursor-not-allowed disabled:opacity-55"
              placeholder={
                hasCompleteRange
                  ? "Add notes linked to this date range..."
                  : "Select both start and end dates to attach range notes."
              }
            />
          </section>
        )}

        <section className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">
              Plan Snapshot
            </p>
            <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-sky-700">
              {rangeMood}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Selected range length:{" "}
            <span className="font-semibold">{rangeLengthDays || 0}</span> day(s)
          </p>

          <button
            type="button"
            onClick={copySnapshot}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-500 hover:text-sky-600"
          >
            {copyState === "copied"
              ? "Snapshot Copied"
              : copyState === "error"
                ? "Clipboard Not Available"
                : "Copy Snapshot"}
          </button>
        </section>
      </div>
    </aside>
  );
}
