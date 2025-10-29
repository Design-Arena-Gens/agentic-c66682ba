"use client";

import { useMemo, useState } from "react";
import { useCallAssistant } from "@/context/call-assistant-context";
import { formatDateRelative, formatDateTime } from "@/lib/utils";
import { capitalize } from "@/lib/utils";
import { CallTask } from "@/lib/mock-data";

const objectiveCopy: Record<CallTask["objective"], string> = {
  Discovery: "Frame ROI and uncover pains",
  Qualification: "Confirm budget, authority, need, timing",
  "Product Demo": "Showcase key differentiators",
  "Proposal Review": "Align on scope and pricing",
  Negotiation: "Remove risk and close",
};

type ScheduleFormState = {
  contactId: string;
  scheduledFor: string;
  objective: CallTask["objective"];
  channel: "Zoom" | "Phone" | "Google Meet" | "Teams";
  prepNotes: string;
};

const initialForm: ScheduleFormState = {
  contactId: "",
  scheduledFor: "",
  objective: "Discovery",
  channel: "Zoom",
  prepNotes: "",
};

export function UpcomingCallsPanel() {
  const { callQueue, contacts, scheduleCall } = useCallAssistant();
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<ScheduleFormState>(initialForm);

  const upcoming = useMemo(
    () =>
      callQueue
        .filter((call) => call.status !== "Completed")
        .sort(
          (a, b) =>
            new Date(a.scheduledFor).getTime() -
            new Date(b.scheduledFor).getTime()
        ),
    [callQueue]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.contactId || !form.scheduledFor) return;

    scheduleCall({
      contactId: form.contactId,
      scheduledFor: new Date(form.scheduledFor).toISOString(),
      objective: form.objective,
      channel: form.channel,
      prepNotes: form.prepNotes
        ? form.prepNotes.split("\n").map((line) => line.trim()).filter(Boolean)
        : [],
    });

    setForm(initialForm);
    setExpanded(false);
  };

  return (
    <section className="card-surface p-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Command queue</h2>
          <p className="text-sm text-slate-400">
            Your prioritized calls for the next 48 hours
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-400"
          onClick={() => setExpanded((flag) => !flag)}
        >
          {expanded ? "Close scheduling" : "Schedule new call"}
        </button>
      </header>

      {expanded && (
        <form
          className="mt-6 grid gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm text-slate-300">
              Customer
              <select
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                value={form.contactId}
                onChange={(event) =>
                  setForm((state) => ({ ...state, contactId: event.target.value }))
                }
                required
              >
                <option value="">Select contact</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} • {contact.company}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-300">
              When
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                value={form.scheduledFor}
                onChange={(event) =>
                  setForm((state) => ({ ...state, scheduledFor: event.target.value }))
                }
                required
              />
            </label>
            <label className="text-sm text-slate-300">
              Channel
              <select
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                value={form.channel}
                onChange={(event) =>
                  setForm((state) => ({ ...state, channel: event.target.value as ScheduleFormState["channel"] }))
                }
              >
                <option value="Zoom">Zoom</option>
                <option value="Phone">Phone</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Teams">Teams</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Objective
              <select
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                value={form.objective}
                onChange={(event) =>
                  setForm((state) => ({ ...state, objective: event.target.value as ScheduleFormState["objective"] }))
                }
              >
                <option value="Discovery">Discovery</option>
                <option value="Qualification">Qualification</option>
                <option value="Product Demo">Product Demo</option>
                <option value="Proposal Review">Proposal Review</option>
                <option value="Negotiation">Negotiation</option>
              </select>
            </label>
            <label className="text-sm text-slate-300">
              Prep prompts
              <textarea
                className="mt-1 min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                placeholder="Bullet the questions or artifacts to prep"
                value={form.prepNotes}
                onChange={(event) =>
                  setForm((state) => ({ ...state, prepNotes: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Queue call
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 space-y-4">
        {upcoming.map((call) => {
          const contact = contacts.find((item) => item.id === call.contactId);
          if (!contact) return null;
          return (
            <li
              key={call.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  {contact.name} · {contact.company}
                </p>
                <p className="text-xs text-slate-400">
                  {call.objective} • {contact.timezone} • {call.channel}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {objectiveCopy[call.objective]}
                </p>
                {call.prepNotes.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {call.prepNotes.map((note, index) => (
                      <li
                        key={index}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200"
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-y-1 text-right text-sm text-slate-300">
                <p>{formatDateTime(call.scheduledFor)}</p>
                <p className="text-xs text-slate-500">
                  {capitalize(call.status)} · {formatDateRelative(call.scheduledFor)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
