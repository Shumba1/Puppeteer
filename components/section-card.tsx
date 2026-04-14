export function SectionCard({ title, eyebrow, action, children, className = "" }: { title: string; eyebrow?: string; action?: React.ReactNode; children: React.ReactNode; className?: string; }) {
  return (
    <section className={`panel p-6 ${className}`.trim()}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
          <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
