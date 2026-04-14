import fs from "node:fs/promises";
import path from "node:path";

export type Overview = {
  project: string;
  mission: string;
  phase: string;
  current_objective: string;
  health: string;
  pending_approvals: number;
  blocked_items: number;
};

export type TaskCard = { id: string; title: string; status: string };
export type TaskBoard = Record<"inbox" | "active" | "review" | "blocked" | "done", TaskCard[]>;
export type OutputCard = {
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
export type ApprovalCard = {
  id: string;
  task_id: string;
  output_id: string;
  status: string;
  required_by: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
};
export type RiskCard = { id: string; title: string; severity: string; likelihood: string; mitigation: string; owner: string; status: string };
export type WorkerCard = { role: string; provider: string; status: string; current_task: string | null; last_update: string };
export type EvidenceFeed = {
  validated_outputs: Array<{ title: string; path: string }>;
  contradictions: string[];
  open_questions: string[];
  confidence_notes: { high: string[]; medium: string[]; low: string[] };
};
export type Health = { status: string; reasons: string[] };
export type FileCard = { path: string; title: string; preview: string; group: string };
export type Observability = {
  movement_stage: string;
  movement_score: number;
  narrative: string;
  task_completion_rate_pct: number;
  approval_clearance_rate_pct: number;
  ai_touch_rate_pct: number;
  writeback_rate_pct: number;
  evidence_coverage_rate_pct: number;
  revision_rate_pct: number;
  human_override_rate_pct: number;
  signals: Array<{ title: string; detail: string; tone: "positive" | "watch" | "neutral" }>;
  timeline: Array<{ label: string; status: "done" | "active" | "todo" }>;
};

const root = process.cwd();

async function readText(relPath: string): Promise<string> {
  return fs.readFile(path.join(root, relPath), "utf8");
}

async function readJson<T>(relPath: string, fallback: T): Promise<T> {
  try {
    const raw = await readText(relPath);
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function section(text: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`##\\s+${escaped}\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, "m");
  const match = text.match(re);
  return match ? match[1].trim() : "";
}

async function exists(relPath: string) {
  try {
    await fs.access(path.join(root, relPath));
    return true;
  } catch {
    return false;
  }
}

async function listFiles(relDir: string): Promise<string[]> {
  const full = path.join(root, relDir);
  if (!(await exists(relDir))) return [];
  const results: string[] = [];
  async function walk(dir: string, prefix: string) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      const absolute = path.join(dir, item.name);
      const rel = path.join(prefix, item.name).replace(/\\/g, "/");
      if (item.isDirectory()) await walk(absolute, rel);
      else results.push(rel);
    }
  }
  await walk(full, relDir.replace(/\\/g, "/"));
  return results.sort();
}

function previewOf(text: string) {
  return text
    .replace(/^#.*$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim()
    .slice(0, 180);
}

async function buildFileCards(relDir: string, group: string, limit = 6): Promise<FileCard[]> {
  const files = (await listFiles(relDir)).filter((file) => /\.(md|txt|json)$/i.test(file)).slice(0, limit);
  const cards: FileCard[] = [];
  for (const file of files) {
    const text = await readText(file);
    const heading = text.match(/^#\s+(.+)$/m)?.[1] ?? path.basename(file);
    cards.push({ path: file, title: heading, preview: previewOf(text), group });
  }
  return cards;
}

export async function getDashboardSnapshot() {
  const [overview, tasks, outputs, approvals, risks, workers, evidence, health, observability, missionText, nextActionsText] = await Promise.all([
    readJson<Overview>("dashboard-data/overview.json", {
      project: "project", mission: "", phase: "unknown", current_objective: "No objective found", health: "gray", pending_approvals: 0, blocked_items: 0
    }),
    readJson<TaskBoard>("dashboard-data/tasks.json", { inbox: [], active: [], review: [], blocked: [], done: [] }),
    readJson<OutputCard[]>("dashboard-data/outputs.json", []),
    readJson<ApprovalCard[]>("dashboard-data/approvals.json", []),
    readJson<RiskCard[]>("dashboard-data/risks.json", []),
    readJson<WorkerCard[]>("dashboard-data/workers.json", []),
    readJson<EvidenceFeed>("dashboard-data/evidence.json", { validated_outputs: [], contradictions: [], open_questions: [], confidence_notes: { high: [], medium: [], low: [] } }),
    readJson<Health>("dashboard-data/health.json", { status: "gray", reasons: [] }),
    readJson<Observability>("dashboard-data/observability.json", {
      movement_stage: "Ambiguous",
      movement_score: 0,
      narrative: "No observability data yet.",
      task_completion_rate_pct: 0,
      approval_clearance_rate_pct: 0,
      ai_touch_rate_pct: 0,
      writeback_rate_pct: 0,
      evidence_coverage_rate_pct: 0,
      revision_rate_pct: 0,
      human_override_rate_pct: 0,
      signals: [],
      timeline: []
    }),
    readText("MISSION.md"),
    readText("NEXT_ACTIONS.md")
  ]);

  const docCards = await buildFileCards("docs", "Project docs", 10);
  const sourceCards = await buildFileCards("sources/derived", "Derived notes", 4);
  const skillCards = await buildFileCards("skills", "Skills", 6);
  const canonicalCards = await Promise.all(["MISSION.md", "STATE.json", "DECISIONS.md", "RISKS.json", "EVIDENCE.md", "NEXT_ACTIONS.md", "AGENTS.md"].map(async (file) => {
    const text = await readText(file);
    return { path: file, title: file, preview: previewOf(text), group: "Canonical" } satisfies FileCard;
  }));

  return {
    overview, tasks, outputs, approvals, risks, workers, evidence, health, observability,
    missionSummary: section(missionText, "Mission"),
    projectName: section(missionText, "Project") || overview.project,
    currentPhase: section(missionText, "Current phase") || overview.phase,
    nextActionSection: section(nextActionsText, "Now"),
    docCards, sourceCards, skillCards, canonicalCards
  };
}

export async function readRepoFile(relPath: string): Promise<string | null> {
  if (!isAllowedRepoPath(relPath)) return null;
  try {
    return await readText(relPath);
  } catch {
    return null;
  }
}

export function isAllowedRepoPath(relPath: string): boolean {
  if (relPath.includes("..")) return false;
  const normalized = relPath.replace(/^\/+/, "");
  const fileAllow = new Set(["MISSION.md", "STATE.json", "DECISIONS.md", "RISKS.json", "EVIDENCE.md", "NEXT_ACTIONS.md", "LOG.md", "AGENTS.md"]);
  if (fileAllow.has(normalized)) return true;
  const folderAllow = ["docs/", "skills/", "tasks/", "outputs/", "sources/", "dashboard-data/"];
  return folderAllow.some((prefix) => normalized.startsWith(prefix));
}
