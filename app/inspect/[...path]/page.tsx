import Link from "next/link";
import { notFound } from "next/navigation";
import { readRepoFile } from "@/lib/repo";

type Params = Promise<{ path: string[] }>;

function prettyTitle(pathParts: string[]) {
  return pathParts[pathParts.length - 1] ?? "File";
}

export default async function InspectPage({ params }: { params: Params }) {
  const resolved = await params;
  const relPath = resolved.path.join("/");
  const content = await readRepoFile(relPath);
  if (!content) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 lg:px-6">
      <div className="panel-strong overflow-hidden p-6 md:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">Repo inspect</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">{prettyTitle(resolved.path)}</h1>
            <p className="mt-2 text-sm text-slate-400">{relPath}</p>
          </div>
          <Link href="/" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/8">Back to dashboard</Link>
        </div>
        <div className="mt-6 rounded-3xl border border-white/8 bg-slate-950/80 p-4 md:p-6">
          <pre className="soft-scroll overflow-x-auto whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">{content}</pre>
        </div>
      </div>
    </main>
  );
}
