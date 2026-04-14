export function CommandDeck({ taskId }: { taskId: string }) {
  const commands = [
    `pnpm run validate`,
    `pnpm run refresh`,
    `pnpm run build-pack -- --task ${taskId} --role Driver`,
    `pnpm run move-task -- --task ${taskId} --to review`,
    `pnpm run project:lint`
  ];

  return (
    <div className="space-y-3">
      {commands.map((command) => (
        <div key={command} className="rounded-2xl border border-white/8 bg-slate-950/80 px-4 py-3 font-mono text-sm text-slate-200">
          {command}
        </div>
      ))}
    </div>
  );
}
