import Link from "next/link";
import { HealthBadge } from "@/components/health-badge";

export function Sidebar({ projectName, phase, health, nextAction }: { projectName: string; phase: string; health: string; nextAction: string }) {
  const nav = [
    { href: "#overview", label: "Overview" },
    { href: "#tasks", label: "Task Board" },
    { href: "#approvals", label: "Approvals" },
    { href: "#docs", label: "Docs" },
    { href: "#command-deck", label: "Command Deck" }
  ];

  return (
    <aside className="panel-strong sticky top-6 h-[calc(100vh-3rem)] overflow-hidden p-6">
      <div className="flex h-full flex-col">
        <div>
          <div className="eyebrow">Puppeteer OS</div>
          <h1 className="mt-3 text-2xl font-semibold text-white">{projectName}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="chip">Phase · {phase}</span>
            <HealthBadge status={health} />
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="block rounded-2xl border border-transparent px-4 py-3 text-sm text-slate-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/12 via-violet-500/10 to-emerald-500/12 p-4">
          <div className="eyebrow">Next Action</div>
          <p className="mt-3 text-sm leading-6 text-slate-200">{nextAction}</p>
        </div>

        <div className="mt-auto rounded-3xl border border-white/10 bg-slate-950/75 p-4">
          <div className="eyebrow">Direct Inspect</div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <Link href="/inspect/MISSION.md" className="rounded-2xl border border-white/8 px-3 py-2 text-slate-300 transition hover:border-sky-400/30 hover:text-white">Mission</Link>
            <Link href="/inspect/STATE.json" className="rounded-2xl border border-white/8 px-3 py-2 text-slate-300 transition hover:border-sky-400/30 hover:text-white">State</Link>
            <Link href="/inspect/DECISIONS.md" className="rounded-2xl border border-white/8 px-3 py-2 text-slate-300 transition hover:border-sky-400/30 hover:text-white">Decisions</Link>
            <Link href="/inspect/EVIDENCE.md" className="rounded-2xl border border-white/8 px-3 py-2 text-slate-300 transition hover:border-sky-400/30 hover:text-white">Evidence</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
