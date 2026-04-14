import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
      <div className="panel-strong w-full p-8 text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-3 text-3xl font-semibold text-white">File not found</h1>
        <p className="mt-4 text-slate-300">The requested repo path is missing or not allowed for inspection.</p>
        <Link href="/" className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/8">Back to dashboard</Link>
      </div>
    </main>
  );
}
