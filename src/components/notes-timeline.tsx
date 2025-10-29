"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { useCallAssistant } from "@/context/call-assistant-context";
import { formatDateTime } from "@/lib/utils";

const sentimentColor: Record<string, string> = {
  positive: "bg-emerald-500/20 text-emerald-200",
  neutral: "bg-slate-500/20 text-slate-200",
  concerned: "bg-amber-500/20 text-amber-200",
};

export function NotesTimeline() {
  const { notes, contacts } = useCallAssistant();

  const entries = useMemo(
    () =>
      [...notes].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notes]
  );

  return (
    <section className="card-surface p-6">
      <header>
        <h2 className="text-lg font-semibold text-white">Debrief timeline</h2>
        <p className="text-sm text-slate-400">
          Every important call insight and next step
        </p>
      </header>
      <ul className="mt-6 space-y-4">
        {entries.map((entry) => {
          const contact = contacts.find((item) => item.id === entry.contactId);
          return (
            <li
              key={entry.id}
              className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{formatDateTime(entry.createdAt)}</span>
                {contact && <span>{contact.name}</span>}
              </div>
              <p className="mt-3 text-sm font-medium text-white">
                {entry.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                <span
                  className={clsx(
                    "rounded-full px-3 py-1",
                    sentimentColor[entry.sentiment]
                  )}
                >
                  {entry.sentiment.toUpperCase()}
                </span>
                <span className="rounded-full bg-brand-500/20 px-3 py-1 text-brand-100">
                  Next: {entry.nextStep}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
