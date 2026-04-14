import fs from "node:fs/promises";
import path from "node:path";

export const root = process.cwd();

export type Json = Record<string, unknown> | Array<unknown>;

export async function readText(relPath: string): Promise<string> {
  return fs.readFile(path.join(root, relPath), "utf8");
}

export async function writeText(relPath: string, content: string): Promise<void> {
  const full = path.join(root, relPath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf8");
}

export async function readJson<T>(relPath: string): Promise<T> {
  const raw = await readText(relPath);
  return JSON.parse(raw) as T;
}

export async function writeJson(relPath: string, value: unknown): Promise<void> {
  await writeText(relPath, JSON.stringify(value, null, 2) + "\n");
}

export async function exists(relPath: string): Promise<boolean> {
  try {
    await fs.access(path.join(root, relPath));
    return true;
  } catch {
    return false;
  }
}

export async function listFiles(relDir: string): Promise<string[]> {
  const full = path.join(root, relDir);
  const results: string[] = [];

  async function walk(dir: string, prefix: string) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      const itemFull = path.join(dir, item.name);
      const rel = path.join(prefix, item.name).replace(/\\/g, "/");
      if (item.isDirectory()) {
        await walk(itemFull, rel);
      } else {
        results.push(rel);
      }
    }
  }

  if (!(await exists(relDir))) return [];
  await walk(full, relDir.replace(/\\/g, "/"));
  return results.sort();
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

export function section(text: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`##\\s+${escaped}\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, "m");
  const match = text.match(re);
  return match ? match[1].trim() : "";
}

export async function appendLog(message: string): Promise<void> {
  const line = `${nowIso()} ${message}\n`;
  const current = (await exists("LOG.md")) ? await readText("LOG.md") : "";
  await writeText("LOG.md", current + line);
}

export async function findTask(taskId: string): Promise<string | null> {
  const folders = ["tasks/inbox", "tasks/active", "tasks/review", "tasks/blocked", "tasks/done"];
  for (const folder of folders) {
    const candidate = `${folder}/${taskId}.md`;
    if (await exists(candidate)) return candidate;
  }
  return null;
}

export function replaceStatus(taskText: string, newStatus: string): string {
  return taskText.replace(/## Status\n([^\n]+)/m, `## Status\n${newStatus}`);
}

export function firstHeading(text: string): string {
  const match = text.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

export function stripCodeTicks(value: string): string {
  return value.replace(/^`|`$/g, "");
}
