"use client";

import { useCallAssistant } from "@/context/call-assistant-context";
import { formatDateRelative } from "@/lib/utils";

const actions = [
  {
    label: "Send recap to Olivia",
    detail: "Attach revised scope with implementation fast-lane",
  },
  {
    label: "Prep logistics case study",
    detail: "Highlight integrations for Atlas Freight stakeholder meeting",
  },
  {
    label: "Design creative sprint outline",
    detail: "Draft modular options ahead of Sophia's proposal review",
  },
];

export function ActionPlaybook() {
  const { callQueue, contacts } = useCallAssistant();
  const followUps = callQueue.filter((call) => call.status !== "Completed");

  return (
    <section className="card-surface p-6">
      <header>
        <h2 className="text-lg font-semibold text-white">Action playbook</h2>
        <p className="text-sm text-slate-400">
          Execute the highest leverage moves after each conversation
        </p>
      </header>
      <ul className="mt-6 space-y-4">
        {followUps.map((call, index) => {
          const contact = contacts.find((item) => item.id === call.contactId);
          return (
            <li
              key={call.id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{call.objective}</span>
                <span>{formatDateRelative(call.scheduledFor)}</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {contact?.name ?? "Unknown contact"}
              </p>
              <p className="text-sm text-slate-300">
                {
                  actions[index % actions.length]?.detail ??
                  "Prep tailored follow-up"
                }
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
