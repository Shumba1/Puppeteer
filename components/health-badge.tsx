const palette: Record<string, string> = {
  green: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  yellow: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  red: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
  gray: "bg-slate-500/15 text-slate-300 ring-slate-400/30"
};

export function HealthBadge({ status }: { status: string }) {
  const classes = palette[status] ?? palette.gray;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ring-1 ${classes}`}>
      <span className="size-2 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
