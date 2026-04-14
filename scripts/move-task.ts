import fs from "node:fs/promises";
import path from "node:path";
import { appendLog, argValue, findTask, readText, replaceStatus, writeText } from "./_lib.js";

const validStates = new Set(["inbox", "active", "review", "blocked", "done", "archived"]);

async function main() {
  const taskId = argValue("--task");
  const to = argValue("--to");

  if (!taskId || !to || !validStates.has(to)) {
    console.error("Usage: pnpm run move-task -- --task T-001 --to review");
    process.exit(1);
  }

  const currentPath = await findTask(taskId);
  if (!currentPath) {
    console.error(`Task not found: ${taskId}`);
    process.exit(1);
  }

  const newPath = `tasks/${to}/${taskId}.md`;
  const taskText = await readText(currentPath);
  const updated = replaceStatus(taskText, to);

  await writeText(newPath, updated);
  await fs.unlink(path.join(process.cwd(), currentPath));
  await appendLog(`task-moved ${taskId} ${currentPath} -> ${newPath}`);
  console.log(`Moved ${taskId} to ${to}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
