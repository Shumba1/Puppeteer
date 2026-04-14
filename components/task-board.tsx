import Link from "next/link";
import type { TaskBoard as TaskBoardType } from "@/lib/repo";

const columns: Array<{ key: keyof TaskBoardType; label: string; tone: string }> = [
  { key: "inbox", label: "Inbox", tone: "from-sky-400/20 to-sky-500/5" },
  { key: "active", label: "Active", tone: "from-violet-400/20 to-violet-500/5" },
  { key: "review", label: "Review", tone: "from-amber-400/20 to-amber-500/5" },
  { key: "blocked", label: "Blocked", tone: "from-rose-400/20 to-rose-500/5" },
  { key: "done", label: "Done", tone: "from-emerald-400/20 to-emerald-500/5" }
];

export function TaskBoard({ tasks }: { tasks: TaskBoardType }) {
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {columns.map((column) => (
        <div key={column.key} className={`rounded-3xl border border-white/10 bg-gradient-to-b ${column.tone} p-4`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{column.label}</h3>
            <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-slate-300">{tasks[column.key].length}</span>
          </div>
          <div className="mt-4 space-y-3">
            {tasks[column.key].length ? tasks[column.key].map((task) => (
              <Link key={task.id} href={`/inspect/tasks/${column.key}/${task.id}.md`} className="block rounded-2xl border border-white/8 bg-slate-950/70 p-4 transition hover:border-sky-400/35 hover:bg-slate-900">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{task.id}</div>
                <div className="mt-2 text-sm font-medium text-white">{task.title}</div>
                <div className="mt-3 inline-flex rounded-full bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">{task.status}</div>
              </Link>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/8 p-4 text-sm text-slate-500">No tasks in this lane.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
