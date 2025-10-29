"use client";

import { useState } from "react";
import { useCallAssistant } from "@/context/call-assistant-context";
import { personaPlaybooks } from "@/lib/mock-data";
import { capitalize } from "@/lib/utils";

type ScriptResponse = {
  opener: string;
  discovery: string[];
  differentiation: string[];
  closing: string;
  nextSteps: string[];
};

export function ScriptWorkbench() {
  const { contacts } = useCallAssistant();
  const [selectedContactId, setSelectedContactId] = useState<string>(
    contacts[0]?.id ?? ""
  );
  const [objective, setObjective] = useState("Discovery");
  const [tone, setTone] = useState("Advisor");
  const [challenge, setChallenge] = useState("Manual workflows");
  const [loading, setLoading] = useState(false);
  const [playbook, setPlaybook] = useState<ScriptResponse | null>(null);

  const selectedContact = contacts.find(
    (contact) => contact.id === selectedContactId
  );

  const handleGenerate = async () => {
    if (!selectedContact) return;
    setLoading(true);
    try {
      const response = await fetch("/api/call-playbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: selectedContact,
          objective,
          tone,
          challenge,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate playbook");
      }
      const data = (await response.json()) as ScriptResponse;
      setPlaybook(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card-surface p-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Conversation OS</h2>
          <p className="text-sm text-slate-400">
            Generate a living call script tailored to the buyer and objective
          </p>
        </div>
        <button
          onClick={handleGenerate}
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-400"
          disabled={loading}
        >
          {loading ? "Synthesizing..." : "Generate call plan"}
        </button>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <label className="text-sm text-slate-300">
          Customer
          <select
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
            value={selectedContactId}
            onChange={(event) => setSelectedContactId(event.target.value)}
          >
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name} • {contact.company}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Objective
          <select
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
          >
            <option>Discovery</option>
            <option>Qualification</option>
            <option>Product Demo</option>
            <option>Proposal Review</option>
            <option>Negotiation</option>
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Tone of voice
          <select
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
            value={tone}
            onChange={(event) => setTone(event.target.value)}
          >
            <option>Advisor</option>
            <option>Hype</option>
            <option>Consultative</option>
            <option>Challenger</option>
            <option>Concise</option>
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Primary friction
          <input
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
            value={challenge}
            onChange={(event) => setChallenge(event.target.value)}
          />
        </label>
      </div>

      {selectedContact && (
        <div className="mt-6 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-300">
            Persona autopilot: {capitalize(selectedContact.persona)}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
            {personaPlaybooks[selectedContact.persona].keyPoints.map((point) => (
              <li
                key={point}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {playbook && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
            <h3 className="text-sm font-semibold text-white">Conversation opener</h3>
            <p className="mt-2 text-sm text-slate-300">{playbook.opener}</p>
            <h4 className="mt-4 text-xs uppercase tracking-wide text-slate-400">
              Discovery prompts
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-slate-300">
              {playbook.discovery.map((question) => (
                <li key={question} className="rounded-lg bg-white/5 p-2">
                  {question}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
            <h3 className="text-sm font-semibold text-white">Value positioning</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-300">
              {playbook.differentiation.map((point) => (
                <li key={point} className="rounded-lg bg-white/5 p-2">
                  {point}
                </li>
              ))}
            </ul>
            <h4 className="mt-4 text-xs uppercase tracking-wide text-slate-400">
              Closing move
            </h4>
            <p className="mt-2 text-sm text-slate-300">{playbook.closing}</p>
            <h4 className="mt-4 text-xs uppercase tracking-wide text-slate-400">
              Next-step suggestions
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-slate-300">
              {playbook.nextSteps.map((item) => (
                <li key={item} className="rounded-lg bg-white/5 p-2">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </section>
  );
}
