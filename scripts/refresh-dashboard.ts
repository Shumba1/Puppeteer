import path from "node:path";
import {
  appendLog,
  firstHeading,
  listFiles,
  nowIso,
  readJson,
  readText,
  section,
  writeJson
} from "./_lib.js";

type State = {
  project: string;
  current_objective: string;
  current_phase: string;
  health: string;
};

type OutputRecord = {
  id: string;
  task_id: string;
  title: string;
  path: string;
  status: string;
  worker: string;
  provider?: string;
  created_at: string;
  ai_touched?: boolean;
  writeback_complete?: boolean;
  evidence_linked?: boolean;
  review_count?: number;
  revision_requested?: boolean;
  human_override?: boolean;
};

type ApprovalRecord = {
  id: string;
  task_id: string;
  output_id: string;
  status: string;
  required_by: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
};

async function parseTaskFile(relPath: string) {
  const text = await readText(relPath);
  const id = path.basename(relPath, ".md");
  const title = firstHeading(text).replace(`${id} — `, "");
  const status = section(text, "Status") || relPath.split("/")[1];
  return { id, title, status };
}

async function buildTasksJson() {
  const map: Record<string, Array<{ id: string; title: string; status: string }>> = {
    inbox: [],
    active: [],
    review: [],
    blocked: [],
    done: []
  };

  for (const col of Object.keys(map)) {
    const folder = `tasks/${col}`;
    const files = await listFiles(folder);
    for (const file of files.filter((f) => f.endsWith(".md"))) {
      map[col].push(await parseTaskFile(file));
    }
  }

  return map;
}

async function buildOutputsJson() {
  const statuses = ["drafts", "approved", "published", "archive"] as const;
  const existing = await readJson<OutputRecord[]>("dashboard-data/outputs.json").catch(() => []);
  const existingByPath = new Map(existing.map((item) => [item.path, item]));
  const outputs: OutputRecord[] = [];
  let counter = 1;
  const evidenceText = await readText("EVIDENCE.md").catch(() => "");

  for (const status of statuses) {
    const files = await listFiles(`outputs/${status}`);
    for (const file of files.filter((f) => f.endsWith(".md") && !f.endsWith("README.md"))) {
      const previous = existingByPath.get(file);
      const title = previous?.title || firstHeading(await readText(file)) || path.basename(file, ".md");
      const evidenceLinked = previous?.evidence_linked ?? evidenceText.includes(path.basename(file));
      outputs.push({
        id: previous?.id ?? `O-${String(counter).padStart(3, "0")}`,
        task_id: previous?.task_id ?? "unknown",
        title,
        path: file,
        status: previous?.status ?? (status === "drafts" ? "draft" : status),
        worker: previous?.worker ?? "driver",
        provider: previous?.provider ?? "unspecified",
        created_at: previous?.created_at ?? nowIso(),
        ai_touched: previous?.ai_touched ?? true,
        writeback_complete: previous?.writeback_complete ?? true,
        evidence_linked: evidenceLinked,
        review_count: previous?.review_count ?? 0,
        revision_requested: previous?.revision_requested ?? false,
        human_override: previous?.human_override ?? false
      });
      counter += 1;
    }
  }

  return outputs.length ? outputs : existing;
}

async function buildEvidenceJson(outputs: OutputRecord[]) {
  const text = await readText("EVIDENCE.md");
  const openQuestions = section(text, "Open questions")
    .split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);

  const contradictions = section(text, "Contradictions")
    .split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean)
    .filter((line) => line.toLowerCase() !== "none logged yet");

  const validatedOutputs = outputs
    .filter((item) => item.evidence_linked)
    .map((item) => ({ title: item.title, path: item.path }));

  return {
    validated_outputs: validatedOutputs,
    contradictions,
    open_questions: openQuestions,
    confidence_notes: {
      high: [],
      medium: [],
      low: []
    }
  };
}

async function buildHealthJson(tasks: Record<string, Array<unknown>>, approvals: ApprovalRecord[], state: State, observabilityScore: number) {
  const reasons: string[] = [];
  if (tasks.inbox.length) reasons.push(`${tasks.inbox.length} task(s) remain in inbox`);
  if (tasks.blocked.length) reasons.push(`${tasks.blocked.length} task(s) are blocked`);
  const awaiting = approvals.filter((a) => a.status === "awaiting_approval").length;
  if (awaiting) reasons.push(`${awaiting} approval(s) awaiting human review`);
  if (observabilityScore < 55) reasons.push("observability signals still need hardening before workflow freeze");

  return {
    status: state.health || (reasons.length ? "yellow" : "green"),
    reasons: reasons.length ? reasons : ["No immediate issues detected"]
  };
}

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildObservability(tasks: Record<string, Array<unknown>>, outputs: OutputRecord[], approvals: ApprovalRecord[], contradictions: string[]) {
  const totalTasks = Object.values(tasks).reduce((sum, lane) => sum + lane.length, 0);
  const completedTasks = tasks.done.length;
  const inMotionTasks = tasks.active.length + tasks.review.length;
  const totalOutputs = outputs.length;
  const aiTouched = outputs.filter((o) => o.ai_touched !== false).length;
  const writebackComplete = outputs.filter((o) => o.writeback_complete !== false).length;
  const evidenceLinked = outputs.filter((o) => o.evidence_linked === true).length;
  const revisioned = outputs.filter((o) => (o.review_count ?? 0) > 1 || o.revision_requested).length;
  const humanOverride = outputs.filter((o) => o.human_override).length;
  const totalApprovals = approvals.length;
  const resolvedApprovals = approvals.filter((a) => a.status !== "awaiting_approval").length;
  const openApprovals = totalApprovals - resolvedApprovals;

  const taskCompletionRate = pct(completedTasks, totalTasks || 1);
  const aiTouchRate = pct(aiTouched, totalOutputs || 1);
  const writebackRate = pct(writebackComplete, aiTouched || totalOutputs || 1);
  const evidenceCoverageRate = pct(evidenceLinked, totalOutputs || 1);
  const approvalClearanceRate = pct(resolvedApprovals, totalApprovals || 1);
  const revisionRate = pct(revisioned, totalOutputs || 1);
  const humanOverrideRate = pct(humanOverride, totalOutputs || 1);

  const movementScore = clamp(
    Math.round(
      (totalTasks ? 18 : 0) +
      (inMotionTasks ? 14 : 0) +
      (totalOutputs ? 16 : 0) +
      (writebackRate * 0.18) +
      (evidenceCoverageRate * 0.14) +
      (approvalClearanceRate * 0.10) +
      (taskCompletionRate * 0.10) -
      (tasks.blocked.length * 6) -
      (contradictions.length * 4)
    ),
    0,
    100
  );

  let movementStage = "Ambiguous";
  if (totalTasks > 0) movementStage = "Structured";
  if (inMotionTasks > 0 || totalOutputs > 0) movementStage = "Structured and moving";
  if (openApprovals > 0 && totalOutputs > 0) movementStage = "Reviewing and governing";
  if (resolvedApprovals > 0 && evidenceLinked > 0) movementStage = "Compounding with evidence";

  const signals = [
    {
      title: "AI work is landing as durable artifacts",
      detail: `${writebackComplete} of ${Math.max(aiTouched, totalOutputs)} AI-touched outputs have been written back into the repo instead of being left in chat.`,
      tone: writebackRate >= 80 ? "positive" : "watch"
    },
    {
      title: "Human control remains explicit",
      detail: openApprovals > 0
        ? `${openApprovals} approval gate(s) are still open, so important work is visible and governed.`
        : totalApprovals > 0
          ? "Approvals that existed have been resolved explicitly rather than by silence."
          : "No approvals have been logged yet; decide whether governance is intentionally absent or simply not instrumented.",
      tone: openApprovals > 0 || totalApprovals > 0 ? "neutral" : "watch"
    },
    {
      title: "Evidence coverage is the next pressure point",
      detail: evidenceLinked > 0
        ? `${evidenceLinked} output(s) are already linked back to evidence, which turns activity into validated movement.`
        : "Outputs exist, but the evidence rail still needs stronger linking before the dashboard can claim validated movement.",
      tone: evidenceLinked > 0 ? "positive" : "watch"
    }
  ] as const;

  const timeline = [
    { label: "Mission defined", status: "done" as const },
    { label: "Tasks structured", status: totalTasks > 0 ? "done" as const : "todo" as const },
    { label: "AI work in flight", status: totalOutputs > 0 || inMotionTasks > 0 ? "done" as const : "todo" as const },
    { label: "Write-back complete", status: writebackComplete > 0 ? "done" as const : "todo" as const },
    { label: "Approvals governed", status: openApprovals > 0 ? "active" as const : totalApprovals > 0 ? "done" as const : "todo" as const },
    { label: "Evidence linked", status: evidenceLinked > 0 ? "done" as const : "todo" as const }
  ];

  const narrative = movementStage === "Compounding with evidence"
    ? "The project is no longer just producing outputs; it is creating approved, evidence-linked work that compounds into durable project state."
    : movementStage === "Reviewing and governing"
      ? "The project has moved beyond setup. AI-touched work exists in the repo and is being held behind explicit approval gates, but evidence linkage and clearance still determine whether the change is truly validated."
      : "The project has moved beyond abstract setup: mission, state, tasks, skills, and AI-touched outputs now exist in canonical form. The next delta is to improve approvals, evidence linkage, and completion flow so the dashboard shows not just activity, but meaningful movement.";

  return {
    movement_stage: movementStage,
    movement_score: movementScore,
    narrative,
    task_completion_rate_pct: taskCompletionRate,
    approval_clearance_rate_pct: approvalClearanceRate,
    ai_touch_rate_pct: aiTouchRate,
    writeback_rate_pct: writebackRate,
    evidence_coverage_rate_pct: evidenceCoverageRate,
    revision_rate_pct: revisionRate,
    human_override_rate_pct: humanOverrideRate,
    signals,
    timeline
  };
}

async function main() {
  const missionText = await readText("MISSION.md");
  const mission = section(missionText, "Mission").replace(/\n/g, " ");
  const state = await readJson<State>("STATE.json");
  const risks = await readJson<unknown[]>("RISKS.json");
  const workers = await readJson<unknown[]>("dashboard-data/workers.json");
  const approvals = await readJson<ApprovalRecord[]>("dashboard-data/approvals.json");
  const tasks = await buildTasksJson();
  const outputs = await buildOutputsJson();
  const evidence = await buildEvidenceJson(outputs);
  const observability = buildObservability(tasks, outputs, approvals, evidence.contradictions);
  const health = await buildHealthJson(tasks, approvals, state, observability.movement_score);

  const overview = {
    project: state.project,
    mission,
    phase: state.current_phase,
    current_objective: state.current_objective,
    health: health.status,
    pending_approvals: approvals.filter((a) => a.status === "awaiting_approval").length,
    blocked_items: tasks.blocked.length
  };

  await writeJson("dashboard-data/overview.json", overview);
  await writeJson("dashboard-data/tasks.json", tasks);
  await writeJson("dashboard-data/outputs.json", outputs);
  await writeJson("dashboard-data/approvals.json", approvals);
  await writeJson("dashboard-data/risks.json", risks);
  await writeJson("dashboard-data/workers.json", workers);
  await writeJson("dashboard-data/evidence.json", evidence);
  await writeJson("dashboard-data/health.json", health);
  await writeJson("dashboard-data/observability.json", observability);

  await appendLog("dashboard-refreshed dashboard-data regenerated");
  console.log("Dashboard feeds refreshed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
