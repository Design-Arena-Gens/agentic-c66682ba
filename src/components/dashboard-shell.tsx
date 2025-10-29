"use client";

import { CallAssistantProvider, useCallAssistant } from "@/context/call-assistant-context";
import { MetricGrid } from "@/components/metric-grid";
import { UpcomingCallsPanel } from "@/components/upcoming-calls";
import { PipelineBoard } from "@/components/pipeline-board";
import { ScriptWorkbench } from "@/components/script-workbench";
import { NotesTimeline } from "@/components/notes-timeline";
import { ActionPlaybook } from "@/components/action-playbook";
import { CallExecutionConsole } from "@/components/call-execution-console";
import { SparklesIcon, PhoneArrowDownLeftIcon } from "@heroicons/react/24/outline";

function DashboardInner() {
  const { contacts, callQueue } = useCallAssistant();

  const scheduledToday = callQueue.filter((call) => {
    const target = new Date(call.scheduledFor);
    const now = new Date();
    return (
      target.getDate() === now.getDate() &&
      target.getMonth() === now.getMonth() &&
      target.getFullYear() === now.getFullYear()
    );
  }).length;

  const followUps = callQueue.filter((call) => call.status === "Needs Follow-up").length;

  const pipelineValue = contacts
    .filter((contact) => ["Discovery", "Proposal", "Negotiation"].includes(contact.status))
    .reduce((total, contact) => total + contact.annualValue, 0);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-6 pb-12 pt-10">
      <section className="glass-panel overflow-hidden rounded-3xl border border-slate-800/80 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-medium text-brand-100">
              <SparklesIcon className="h-4 w-4" />
              Autonomous call controller
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
              Operate your entire client conversation workflow from one agentic cockpit.
            </h1>
            <p className="text-sm text-slate-300 md:text-base">
              Sequence discovery, demos, and negotiations with precision. The agent keeps
              call prep, live guidance, and follow-ups synchronized so you can focus on
              winning freelancing deals.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-200">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Calls today</p>
                <p className="text-2xl font-semibold text-white">{scheduledToday}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Follow-ups</p>
                <p className="text-2xl font-semibold text-white">{followUps}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Active pipeline</p>
                <p className="text-2xl font-semibold text-white">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(pipelineValue)}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full max-w-sm rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <PhoneArrowDownLeftIcon className="h-5 w-5 text-brand-300" />
              Next best move
            </div>
            <p className="mt-4 text-base font-medium text-white">
              Confirm Olivia's multi-year automation roll-out and send the pricing remix before tomorrow's CFO sync.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li className="rounded-xl bg-white/5 px-3 py-2">
                Summarize value proof: 38% faster onboarding
              </li>
              <li className="rounded-xl bg-white/5 px-3 py-2">
                Offer concierge migration crew for phase 2
              </li>
              <li className="rounded-xl bg-white/5 px-3 py-2">
                Lock next negotiation touchpoint on Thursday
              </li>
            </ul>
          </div>
        </div>
      </section>

      <MetricGrid />

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingCallsPanel />
        <PipelineBoard />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ScriptWorkbench />
        <CallExecutionConsole />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <NotesTimeline />
        <ActionPlaybook />
      </div>
    </main>
  );
}

export function DashboardShell() {
  return (
    <CallAssistantProvider>
      <DashboardInner />
    </CallAssistantProvider>
  );
}
