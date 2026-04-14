import { exists, listFiles, readJson, readText } from "./_lib.js";

async function main() {
  const warnings: string[] = [];

  const taskFiles = [
    ...(await listFiles("tasks/inbox")),
    ...(await listFiles("tasks/active")),
    ...(await listFiles("tasks/review")),
    ...(await listFiles("tasks/blocked")),
    ...(await listFiles("tasks/done"))
  ].filter((f) => f.endsWith(".md"));

  for (const task of taskFiles) {
    const text = await readText(task);
    if (!text.includes("## Acceptance criteria")) warnings.push(`${task}: missing acceptance criteria section`);
    if (!text.includes("## Status")) warnings.push(`${task}: missing status section`);
    if (!text.includes("## Output format")) warnings.push(`${task}: missing output format section`);
    if (!text.includes("## Observability hooks")) warnings.push(`${task}: missing observability hooks section`);
  }

  const approvals = await readJson<Array<{ output_id: string; status: string }>>("dashboard-data/approvals.json");
  const outputs = await readJson<Array<{ id: string; evidence_linked?: boolean; ai_touched?: boolean; writeback_complete?: boolean }>>("dashboard-data/outputs.json");
  const outputIds = new Set(outputs.map((o) => o.id));
  for (const approval of approvals) {
    if (!outputIds.has(approval.output_id)) warnings.push(`Approval references missing output: ${approval.output_id}`);
  }

  const aiTouchedWithoutWriteback = outputs.filter((o) => o.ai_touched && o.writeback_complete === false).length;
  if (aiTouchedWithoutWriteback) warnings.push(`${aiTouchedWithoutWriteback} AI-touched output(s) are not marked writeback_complete`);

  if (!(await exists("docs/notes"))) warnings.push("docs/notes missing");
  if (!(await exists("skills/risk-review.md"))) warnings.push("skills/risk-review.md missing");
  if (!(await exists("dashboard-data/approvals.json"))) warnings.push("dashboard-data/approvals.json missing");
  if (!(await exists("dashboard-data/observability.json"))) warnings.push("dashboard-data/observability.json missing");
  if (!(await exists("docs/specs/observability-layer-spec.md"))) warnings.push("docs/specs/observability-layer-spec.md missing");

  if (warnings.length) {
    console.log("Lint warnings:");
    for (const warning of warnings) console.log(`- ${warning}`);
  } else {
    console.log("No lint warnings.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
