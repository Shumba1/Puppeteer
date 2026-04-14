import fs from "node:fs/promises";
import path from "node:path";
import { appendLog, argValue, exists, nowIso, writeText } from "./_lib.js";

async function main() {
  const source = argValue("--source");
  const type = argValue("--type") || "raw";

  if (!source) {
    console.error("Usage: pnpm run ingest -- --source /path/to/file.txt --type raw");
    process.exit(1);
  }

  const supported = new Set(["raw", "web", "media"]);
  if (!supported.has(type)) {
    console.error("Type must be one of: raw, web, media");
    process.exit(1);
  }

  const fileName = path.basename(source);
  const target = `sources/${type}/${fileName}`;

  try {
    const content = await fs.readFile(source);
    await fs.mkdir(path.dirname(path.join(process.cwd(), target)), { recursive: true });
    await fs.writeFile(path.join(process.cwd(), target), content);
  } catch {
    // fallback: store the string as a pointer note
    const notePath = `sources/${type}/${fileName.replace(/\W+/g, "-") || "source"}-${Date.now()}.md`;
    await writeText(notePath, `# Ingested Source\n\nOriginal reference: ${source}\nIngested at: ${nowIso()}\n`);
    await appendLog(`ingest pointer-note ${notePath}`);
    console.log(`Stored pointer note: ${notePath}`);
    return;
  }

  await appendLog(`ingest ${target}`);
  console.log(`Ingested to ${target}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
