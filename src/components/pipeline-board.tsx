"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { useCallAssistant } from "@/context/call-assistant-context";
import { ContactStatus } from "@/lib/mock-data";
import { formatDateRelative } from "@/lib/utils";

const statusOrder: ContactStatus[] = [
  "New",
  "Discovery",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

const statusAccent: Record<ContactStatus, string> = {
  New: "bg-slate-700/60 text-slate-200",
  Discovery: "bg-sky-500/20 text-sky-200",
  Proposal: "bg-indigo-500/20 text-indigo-200",
  Negotiation: "bg-amber-500/20 text-amber-200",
  Won: "bg-emerald-500/20 text-emerald-200",
  Lost: "bg-rose-500/20 text-rose-200",
};

export function PipelineBoard() {
  const { contacts } = useCallAssistant();

  const grouped = useMemo(() => {
    return statusOrder.map((status) => ({
      status,
      items: contacts.filter((contact) => contact.status === status),
    }));
  }, [contacts]);

  return (
    <section className="card-surface p-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Pipeline board</h2>
          <p className="text-sm text-slate-400">
            Track momentum for every prospect in your orbit
          </p>
        </div>
      </header>
      <div className="mt-6 grid gap-4 overflow-x-auto md:grid-cols-3 xl:grid-cols-6">
        {grouped.map((column) => (
          <div
            key={column.status}
            className="min-w-[220px] rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4"
          >
            <header
              className={clsx(
                "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium",
                statusAccent[column.status]
              )}
            >
              <span>{column.status}</span>
              <span className="text-xs text-slate-500">
                {column.items.length} lead{column.items.length === 1 ? "" : "s"}
              </span>
            </header>
            <ul className="mt-4 space-y-3">
              {column.items.length === 0 ? (
                <li className="rounded-xl border border-dashed border-slate-700 p-3 text-xs text-slate-500">
                  No records yet
                </li>
              ) : (
                column.items.map((contact) => (
                  <li
                    key={contact.id}
                    className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-3 text-sm text-slate-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{contact.name}</p>
                      <span className="text-xs text-slate-500">
                        {formatDateRelative(contact.lastInteraction)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {contact.title} • {contact.company}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-300"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-slate-400">
                      ACV {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(contact.annualValue)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
