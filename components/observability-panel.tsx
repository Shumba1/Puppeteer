type ObservabilitySignal = {
  title: string;
  detail: string;
  tone: "positive" | "watch" | "neutral";
};

type Observability = {
  movement_stage: string;
  movement_score: number;
  narrative: string;
  task_completion_rate_pct: number;
  approval_clearance_rate_pct: number;
  ai_touch_rate_pct: number;
  writeback_rate_pct: number;
  evidence_coverage_rate_pct: number;
  revision_rate_pct: number;
  human_override_rate_pct: number;
  signals: ObservabilitySignal[];
  timeline: Array<{ label: string; status: "done" | "active" | "todo" }>;
};

function toneClasses(tone: ObservabilitySignal["tone"]) {
  switch (tone) {
    case "positive":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-100";
    case "watch":
      return "border-amber-400/20 bg-amber-500/10 text-amber-100";
    default:
      return "border-sky-400/20 bg-sky-500/10 text-sky-100";
  }
}

function Metric({ label, value, helper }: { label: string; value: number; helper: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-950/65 p-4">
      <div className="eyebrow">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}%</div>
      <div className="mt-2 text-sm text-slate-400">{helper}</div>
    </div>
  );
}

export function ObservabilityPanel({ data }: { data: Observability }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.92))] p-6 shadow-[0_24px_80px_-36px_rgba(14,165,233,0.55)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="eyebrow">Meaningful work change</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">{data.movement_stage}</h3>
            </div>
            <div className="rounded-full border border-sky-300/20 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-100">
              Movement score {data.movement_score}
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">{data.narrative}</p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,0.95),rgba(168,85,247,0.95),rgba(34,197,94,0.95))]"
              style={{ width: `${Math.max(6, Math.min(data.movement_score, 100))}%` }}
            />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {data.signals.map((signal) => (
              <div key={signal.title} className={`rounded-2xl border p-4 ${toneClasses(signal.tone)}`}>
                <div className="text-sm font-medium">{signal.title}</div>
                <p className="mt-2 text-sm leading-6 text-current/85">{signal.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Metric label="AI-touched outputs" value={data.ai_touch_rate_pct} helper="share of outputs materially produced with AI" />
          <Metric label="Write-back rate" value={data.writeback_rate_pct} helper="AI outputs that became durable repo artifacts" />
          <Metric label="Evidence coverage" value={data.evidence_coverage_rate_pct} helper="outputs explicitly linked to evidence" />
          <Metric label="Approval clearance" value={data.approval_clearance_rate_pct} helper="approvals already resolved or committed" />
          <Metric label="Revision rate" value={data.revision_rate_pct} helper="outputs that needed further rework" />
          <Metric label="Task completion" value={data.task_completion_rate_pct} helper="work that has moved through the board" />
        </div>
      </div>

      <div className="rounded-3xl border border-white/8 bg-slate-950/65 p-5">
        <div className="eyebrow">Execution progression</div>
        <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {data.timeline.map((item) => {
            const statusClass = item.status === "done"
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
              : item.status === "active"
                ? "border-sky-400/20 bg-sky-500/10 text-sky-100"
                : "border-white/8 bg-white/4 text-slate-400";

            return (
              <div key={item.label} className={`rounded-2xl border p-4 ${statusClass}`}>
                <div className="text-[11px] uppercase tracking-[0.2em] text-current/75">{item.status}</div>
                <div className="mt-2 text-sm font-medium leading-6 text-current">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
