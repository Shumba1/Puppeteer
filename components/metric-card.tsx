export function MetricCard({ label, value, sublabel }: { label: string; value: string | number; sublabel?: string }) {
  return (
    <div className="metric">
      <div className="eyebrow">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</div>
      {sublabel ? <p className="mt-2 text-sm text-slate-400">{sublabel}</p> : null}
    </div>
  );
}
