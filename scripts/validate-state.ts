import { exists, readJson } from "./_lib.js";

const requiredFiles = [
  "MISSION.md",
  "STATE.json",
  "DECISIONS.md",
  "RISKS.json",
  "EVIDENCE.md",
  "NEXT_ACTIONS.md",
  "LOG.md",
  "AGENTS.md",
  "dashboard-data/overview.json",
  "dashboard-data/tasks.json",
  "dashboard-data/outputs.json",
  "dashboard-data/approvals.json",
  "dashboard-data/risks.json",
  "dashboard-data/workers.json",
  "dashboard-data/evidence.json",
  "dashboard-data/health.json",
  "dashboard-data/observability.json"
];

async function main() {
  const missing: string[] = [];
  for (const file of requiredFiles) {
    if (!(await exists(file))) missing.push(file);
  }

  const jsonFiles = [
    "STATE.json",
    "RISKS.json",
    "dashboard-data/overview.json",
    "dashboard-data/tasks.json",
    "dashboard-data/outputs.json",
    "dashboard-data/approvals.json",
    "dashboard-data/risks.json",
    "dashboard-data/workers.json",
    "dashboard-data/evidence.json",
    "dashboard-data/health.json",
    "dashboard-data/observability.json"
  ];

  const invalidJson: string[] = [];
  for (const file of jsonFiles) {
    try {
      await readJson(file);
    } catch {
      invalidJson.push(file);
    }
  }

  if (missing.length || invalidJson.length) {
    console.error("Validation failed.");
    if (missing.length) console.error("Missing files:\n- " + missing.join("\n- "));
    if (invalidJson.length) console.error("Invalid JSON:\n- " + invalidJson.join("\n- "));
    process.exit(1);
  }

  console.log("Validation passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
