import Link from "next/link";
import type { FileCard } from "@/lib/repo";

export function FileList({ items }: { items: FileCard[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link key={item.path} href={`/inspect/${item.path}`} className="block rounded-2xl border border-white/8 bg-slate-950/55 p-4 transition hover:border-sky-400/35 hover:bg-slate-900/90">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-white">{item.title}</div>
            <span className="rounded-full bg-white/6 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">{item.group}</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">{item.path}</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{item.preview || "No preview available."}</p>
        </Link>
      ))}
    </div>
  );
}
