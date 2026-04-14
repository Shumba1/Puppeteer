import path from "node:path";
import {
  argValue,
  findTask,
  firstHeading,
  readJson,
  readText,
  section,
  stripCodeTicks,
  writeText
} from "./_lib.js";

type State = {
  current_objective: string;
};

async function main() {
  const taskId = argValue("--task");
  const role = argValue("--role") || "Driver";

  if (!taskId) {
    console.error("Usage: pnpm run build-pack -- --task T-001 --role Driver");
    process.exit(1);
  }

  const taskPath = await findTask(taskId);
  if (!taskPath) {
    console.error(`Task not found: ${taskId}`);
    process.exit(1);
  }

  const taskText = await readText(taskPath);
  const missionText = await readText("MISSION.md");
  const state = await readJson<State>("STATE.json");

  const inputs = section(taskText, "Inputs")
    .split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);

  const firstSkill = inputs.find((item) => item.includes("skills/")) || "skills/planning.md";
  const skillPath = stripCodeTicks(firstSkill);
  const skillText = await readText(skillPath);

  const resolvedInputs: Array<{ path: string; content: string }> = [];
  for (const input of inputs.slice(0, 6)) {
    const rel = stripCodeTicks(input);
    try {
      const content = await readText(rel);
      resolvedInputs.push({ path: rel, content });
    } catch {
      // ignore unreadable input paths
    }
  }

  const outputPath = stripCodeTicks(section(taskText, "Output path"));
  const outputFormat = section(taskText, "Output format");
  const acceptance = section(taskText, "Acceptance criteria");
  const observabilityHooks = section(taskText, "Observability hooks");

  const pack = `# Worker Pack — ${taskId}

## Role
${role}

## Mission
${section(missionText, "Mission").replace(/\n/g, " ")}

## Current objective
${state.current_objective}

## Task
${firstHeading(taskText)}

## Skill to apply
\`\`\`md
${skillText}
\`\`\`

## Relevant context
${resolvedInputs.map((item) => `### ${item.path}\n\`\`\`md\n${item.content}\n\`\`\``).join("\n\n")}

## Required output
Save the result conceptually to:
\`${outputPath}\`

## Output format
${outputFormat || "Markdown with clear headings."}

## Acceptance criteria
${acceptance}

## Observability hooks
${observabilityHooks || "- AI touched: yes\n- Evidence required: no\n- Approval required: yes"}

## Write-back rules
- Return markdown only unless a JSON schema is explicitly requested
- Use the exact output format above
- State uncertainty explicitly
- Do not invent missing state
- Treat write-back as creating a durable repo artifact, not disposable chat text
`;

  const outPath = path.join("docs", "briefs", `${taskId.toLowerCase()}-worker-pack.md`);
  await writeText(outPath, pack);
  console.log(pack);
  console.error(`\nSaved worker pack to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
