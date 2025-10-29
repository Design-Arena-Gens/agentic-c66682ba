"use client";

import { useMemo, useState } from "react";
import { useCallAssistant } from "@/context/call-assistant-context";
import { formatDateTime } from "@/lib/utils";

const sentiments = [
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "concerned", label: "Concerned" },
];

export function CallExecutionConsole() {
  const { callQueue, contacts, completeCall } = useCallAssistant();
  const actionable = useMemo(
    () => callQueue.filter((call) => call.status !== "Completed"),
    [callQueue]
  );
  const [selectedId, setSelectedId] = useState<string>(
    actionable[0]?.id ?? ""
  );
  const [summary, setSummary] = useState("Captured key pains and ROI outcomes");
  const [sentiment, setSentiment] = useState("positive");
  const [nextStep, setNextStep] = useState("Send tailored follow-up deck by 6pm");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const selectedCall = actionable.find((call) => call.id === selectedId);
  const contact = contacts.find((item) => item.id === selectedCall?.contactId);

  const handleComplete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCall) return;
    completeCall({
      callId: selectedCall.id,
      summary,
      sentiment: sentiment as "positive" | "neutral" | "concerned",
      nextStep,
    });
    setSummary("Call recorded");
    setNextStep("Confirm follow-up email sent");
    setConfirmation("Call captured and logged to timeline");
  };

  return (
    <section className="card-surface p-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Live call console</h2>
          <p className="text-sm text-slate-400">
            Capture outcomes the moment a conversation wraps up
          </p>
        </div>
      </header>

      {actionable.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">
          All calls are logged and up to date. Take a breather! ✅
        </p>
      ) : (
        <form
          className="mt-6 grid gap-4 md:grid-cols-2"
          onSubmit={handleComplete}
        >
          <div className="space-y-4">
            <label className="block text-sm text-slate-300">
              Call to log
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-brand-400 focus:outline-none"
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
              >
                {actionable.map((call) => {
                  const person = contacts.find((item) => item.id === call.contactId);
                  return (
                    <option key={call.id} value={call.id}>
                      {person?.name ?? "Unknown"} • {call.objective} • {formatDateTime(call.scheduledFor)}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              Conversation headline
              <textarea
                className="mt-1 min-h-[120px] w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-brand-400 focus:outline-none"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
              />
            </label>
          </div>
          <div className="space-y-4">
            <label className="block text-sm text-slate-300">
              Sentiment read
              <div className="mt-2 grid grid-cols-3 gap-2">
                {sentiments.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      sentiment === option.value
                        ? "border-brand-400 bg-brand-500/20 text-brand-100"
                        : "border-slate-700 bg-slate-900/70 text-slate-300"
                    }`}
                    onClick={() => setSentiment(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </label>
            <label className="block text-sm text-slate-300">
              Next step to broadcast
              <textarea
                className="mt-1 min-h-[120px] w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-brand-400 focus:outline-none"
                value={nextStep}
                onChange={(event) => setNextStep(event.target.value)}
              />
            </label>
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-400"
              >
                Log call outcome
              </button>
            </div>
            {confirmation && (
              <p className="text-xs text-emerald-300">{confirmation}</p>
            )}
          </div>
        </form>
      )}

      {selectedCall && contact && (
        <div className="mt-6 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-wide text-slate-500">Call briefing</p>
          <p className="mt-2 font-semibold text-white">
            {contact.name} • {contact.company}
          </p>
          <p className="mt-1 text-xs text-slate-400">{contact.title}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {selectedCall.prepNotes.map((note) => (
              <li key={note} className="rounded-full bg-white/5 px-3 py-1 text-xs">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
