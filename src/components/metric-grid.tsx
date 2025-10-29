"use client";

import { metricSnapshots } from "@/lib/mock-data";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") {
    return <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-400" />;
  }
  if (trend === "down") {
    return <ArrowTrendingDownIcon className="h-4 w-4 text-rose-400" />;
  }
  return <span className="h-4 w-4 rounded-full bg-slate-500" aria-hidden />;
};

export function MetricGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {metricSnapshots.map((metric) => (
        <article
          key={metric.label}
          className="card-surface p-5 transition hover:border-brand-500/50"
        >
          <header className="flex items-center justify-between text-sm text-slate-400">
            <span>{metric.label}</span>
            <TrendIcon trend={metric.trend} />
          </header>
          <p className="mt-3 text-2xl font-semibold text-white">
            {metric.primary}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            <span
              className={
                metric.trend === "down"
                  ? "text-rose-400"
                  : metric.trend === "up"
                  ? "text-emerald-400"
                  : "text-slate-400"
              }
            >
              {metric.delta}
            </span>{" "}
            {metric.context}
          </p>
        </article>
      ))}
    </section>
  );
}
