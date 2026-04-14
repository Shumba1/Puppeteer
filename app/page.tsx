import Link from "next/link";
import { CommandDeck } from "@/components/command-deck";
import { FileList } from "@/components/file-list";
import { HealthBadge } from "@/components/health-badge";
import { MetricCard } from "@/components/metric-card";
import { ObservabilityPanel } from "@/components/observability-panel";
import { SectionCard } from "@/components/section-card";
import { Sidebar } from "@/components/sidebar";
import { TaskBoard } from "@/components/task-board";
import { getDashboardSnapshot } from "@/lib/repo";

export default async function Page() {
  const data = await getDashboardSnapshot();
  const primaryTask = data.tasks.inbox[0]?.id ?? data.tasks.active[0]?.id ?? "T-001";
  const totalTasks = Object.values(data.tasks).reduce((sum, lane) => sum + lane.length, 0);

  return (
    <main className="mx-auto max-w-[1700px] px-4 py-6 lg:px-6">
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Sidebar projectName={data.projectName} phase={data.currentPhase} health={data.health.status} nextAction={data.nextActionSection || data.overview.current_objective} />

        <div className="space-y-6">
          <section id="overview" className="panel-strong overflow-hidden p-8">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="eyebrow">Command Centre</div>
                <h1 className="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">Stunning on the surface. Disciplined underneath.</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                  This dashboard is no longer just a beautiful task board. It is the command-and-observability layer for AI-assisted work: queue state, approvals, evidence, and whether AI is actually changing project execution in a durable way.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="chip">Next.js App Router</span>
                  <span className="chip">Tailwind CSS</span>
                  <span className="chip">Repo-first</span>
                  <span className="chip">Observability-aware</span>
                  <HealthBadge status={data.health.status} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:w-[440px]">
                <Link href="/inspect/MISSION.md" className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100 transition hover:bg-sky-500/15">Inspect mission</Link>
                <Link href="/inspect/docs/specs/observability-layer-spec.md" className="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-100 transition hover:bg-violet-500/15">Inspect observability spec</Link>
                <a href="#observability" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/8">Jump to observability</a>
                <a href="#docs" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/8">Jump to docs rail</a>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Current phase" value={data.overview.phase} sublabel="file-backed state" />
              <MetricCard label="Movement score" value={data.observability.movement_score} sublabel={data.observability.movement_stage} />
              <MetricCard label="Pending approvals" value={data.overview.pending_approvals} sublabel="explicit human gate" />
              <MetricCard label="Open risks" value={data.risks.length} sublabel={`${data.tasks.blocked.length} blocked task(s)`} />
            </div>
          </section>

          <SectionCard title="Meaningful work change" eyebrow="Observability layer" className="scroll-mt-20" action={<span className="chip">AI work observability</span>}>
            <div id="observability"><ObservabilityPanel data={data.observability} /></div>
          </SectionCard>

          <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
            <div className="space-y-6">
              <SectionCard title="Mission and current objective" eyebrow="North star">
                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-3xl border border-white/8 bg-slate-950/65 p-5">
                    <div className="eyebrow">Mission</div>
                    <p className="mt-3 text-base leading-7 text-slate-200">{data.missionSummary}</p>
                  </div>
                  <div className="rounded-3xl border border-white/8 bg-slate-950/65 p-5">
                    <div className="eyebrow">Current objective</div>
                    <p className="mt-3 text-base leading-7 text-slate-200">{data.overview.current_objective}</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Task board" eyebrow="Queue state" className="scroll-mt-20" action={<span className="chip">{totalTasks} visible tasks</span>}>
                <div id="tasks"><TaskBoard tasks={data.tasks} /></div>
              </SectionCard>

              <SectionCard title="Approvals and outputs" eyebrow="Review gates" className="scroll-mt-20">
                <div id="approvals" className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-3">
                    {data.approvals.length ? data.approvals.map((approval) => (
                      <div key={approval.id} className="rounded-2xl border border-white/8 bg-slate-950/65 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-white">{approval.id}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{approval.output_id} · {approval.task_id}</div>
                          </div>
                          <span className="rounded-full bg-amber-500/12 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-200">{approval.status}</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-300">Required by <span className="font-medium text-white">{approval.required_by}</span>.</p>
                      </div>
                    )) : <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-500">No approvals currently open.</div>}
                  </div>

                  <div className="space-y-3">
                    {data.outputs.length ? data.outputs.map((output) => (
                      <Link key={output.id} href={`/inspect/${output.path}`} className="block rounded-2xl border border-white/8 bg-slate-950/65 p-4 transition hover:border-sky-400/35 hover:bg-slate-900">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-white">{output.title}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{output.id} · {output.provider ?? output.worker}</div>
                          </div>
                          <span className="rounded-full bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">{output.status}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          {output.ai_touched !== false ? <span className="chip">AI touched</span> : null}
                          {output.writeback_complete !== false ? <span className="chip">Write-back complete</span> : null}
                          {output.evidence_linked ? <span className="chip">Evidence linked</span> : <span className="chip">Evidence pending</span>}
                        </div>
                        <div className="mt-3 text-sm text-slate-400">{output.path}</div>
                      </Link>
                    )) : <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-500">No outputs yet.</div>}
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Docs rail" eyebrow="Project memory" className="scroll-mt-20">
                <div id="docs" className="grid gap-4 lg:grid-cols-3">
                  <div><div className="mb-3 text-sm font-medium text-white">Project docs</div><FileList items={data.docCards} /></div>
                  <div><div className="mb-3 text-sm font-medium text-white">Canonical files</div><FileList items={data.canonicalCards} /></div>
                  <div>
                    <div className="mb-3 text-sm font-medium text-white">Skills and derived notes</div>
                    <div className="space-y-4"><FileList items={data.skillCards.slice(0, 3)} /><FileList items={data.sourceCards} /></div>
                  </div>
                </div>
              </SectionCard>
            </div>

            <div className="space-y-6">
              <SectionCard title="Health and risks" eyebrow="Operational status" action={<HealthBadge status={data.health.status} />}>
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/8 bg-slate-950/65 p-4">
                    <div className="eyebrow">Health reasons</div>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                      {data.health.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    {data.risks.map((risk) => (
                      <div key={risk.id} className="rounded-2xl border border-white/8 bg-slate-950/65 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium text-white">{risk.title}</div>
                          <span className="rounded-full bg-white/6 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">{risk.severity}</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500">{risk.id} · {risk.status}</div>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{risk.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Worker roster" eyebrow="Subscription roles">
                <div className="space-y-3">
                  {data.workers.map((worker) => (
                    <div key={`${worker.provider}-${worker.role}`} className="rounded-2xl border border-white/8 bg-slate-950/65 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-white">{worker.provider}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{worker.role}</div>
                        </div>
                        <span className="rounded-full bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">{worker.status}</span>
                      </div>
                      <div className="mt-3 text-sm text-slate-300">Current task: {worker.current_task ?? "None"}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Evidence and contradictions" eyebrow="Anti-hallucination rail">
                <div className="space-y-5">
                  <div>
                    <div className="text-sm font-medium text-white">Contradictions</div>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                      {data.evidence.contradictions.length ? data.evidence.contradictions.map((item) => <li key={item}>• {item}</li>) : <li>• No contradictions logged yet.</li>}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Open questions</div>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                      {data.evidence.open_questions.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Command deck" eyebrow="Operator runbook" className="scroll-mt-20">
                <div id="command-deck"><CommandDeck taskId={primaryTask} /></div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
