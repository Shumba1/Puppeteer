# Puppeteer OS v1.1 — Next.js + Tailwind + Observability Scaffold

Puppeteer OS is a local-first, repo-first, human-governed operating system for running AI-assisted projects with subscription chatbots when you do not have direct model API access.

It exists to solve the failure mode of ordinary chatbot work: context drift, forgotten decisions, repeated prompting, weak write-back, and dashboards that look impressive but are not grounded in durable state.

The operating model is simple:

- **repo is truth**
- **dashboard is control room**
- **observability proves meaningful work change**
- **skills are reusable methods**
- **LLMs do judgement**
- **scripts do reliability**
- **human approves important changes**
- **browser automation stays out of the critical path for v1**

## What Puppeteer OS is

Puppeteer OS is a **project operating system**, not a single chatbot wrapper.

It treats each project as a durable working system made of:

- a canonical repo for truth and memory
- a premium Next.js + Tailwind dashboard for visibility and control
- reusable markdown skills for repeatable methods
- deterministic scripts for validation, movement, refresh, and pack-building
- subscription models acting as workers in defined roles
- a human operator acting as chairman and final approver
- an observability layer that measures whether AI is creating durable, governed work change

In plain English: it sits between your projects and your AI subscriptions, turning chaotic chat work into governed project execution.

## Why Puppeteer OS exists

Normal chatbot use breaks down as projects get larger and more iterative.

Typical failure modes are:

- chats forget prior decisions
- outputs drift away from the mission
- context gets bloated
- model roles blur together
- useful work stays trapped in chat
- nothing is written back cleanly
- dashboards become theatre instead of truth
- repeated workflows never compound into reusable methods
- teams cannot clearly see whether AI is meaningfully changing work or merely generating activity

Puppeteer OS exists to move durable memory, workflow, governance, and observability **out of chat** and into a controlled repo-first system.

## What this scaffold now does

- gives each project its own canonical repo
- turns markdown skills into reusable operating methods
- provides a premium Next.js + Tailwind command dashboard
- keeps durable state in markdown and JSON
- adds an **observability layer** so the dashboard shows not just queue state, but whether AI is meaningfully changing work

## Core stance

- Repo is truth
- Dashboard is control room
- Observability proves meaningful work change
- LLMs do judgement
- Scripts do reliability
- Browser automation stays out of the critical path for v1

## What Puppeteer OS does

Puppeteer OS runs one or more projects through a repeatable loop:

1. define the mission
2. ingest sources
3. create tasks
4. build a minimal worker pack
5. send that pack to a chosen model
6. receive output
7. review or critique it where needed
8. write the result back into the repo as a defined project artifact
9. refresh dashboard state
10. promote proven methods into reusable skills

That is the core engine. The dashboard visualises the loop. The repo holds the truth. The scripts keep state reliable. The models do the judgement work.

## What the observability layer means

The dashboard is expected to show more than tasks and outputs. It should answer:

- what changed because AI was used?
- did that work become a durable repo artifact?
- is the work evidence-linked and approval-governed?
- is the project moving forward, or merely generating visible activity?

The canonical feed for that layer is:

- `dashboard-data/observability.json`

This is the difference between a dashboard that looks active and a dashboard that proves meaningful work change.

## What “write it back into the repo” means

Write-back is **not** any of the following:

- “keep it in chat”
- “paste it somewhere later”
- “remember it mentally”

It means converting model output into a **defined project artifact**, saving it at a **defined repo path**, in a **defined format**, against **defined acceptance criteria**.

### Typical write-back targets

A model output should usually land in one of these places:

- `outputs/drafts/*.md` or `outputs/approved/*.md` for substantive deliverables
- `sources/derived/*.md` for model-produced summaries, extracts, diarised notes, and research briefs
- `tasks/<state>/T-xxx.md` for task creation or task-state changes
- `NEXT_ACTIONS.md` for the immediate human/operator queue
- `DECISIONS.md` for important architectural or strategic decisions
- `EVIDENCE.md` for validated claims, source links, contradictions, and confidence notes
- `LOG.md` for chronological activity records
- `STATE.json` for current objective, health, counts, and next action
- `dashboard-data/*.json` for UI feeds such as overview, tasks, outputs, approvals, risks, workers, evidence, health, and observability

### Preferred write-back formats

Use these defaults:

- **Markdown (`.md`)** for human-readable project knowledge, outputs, notes, skills, evidence, and logs
- **JSON (`.json`)** for machine-readable state, approvals, dashboard feeds, observability feeds, and contracts between scripts/UI
- **Source files in original format** under `sources/raw/` for PDFs, images, transcripts, spreadsheets, and other raw materials

### Write-back rule

Before sending work to a model, the task should already declare:

- the expected output path
- the expected output format
- the acceptance criteria

Example:

```md
## Output path
outputs/drafts/architecture-brief-v1.md

## Expected format
Markdown with these headings:
- Executive Summary
- Proposed Architecture
- Risks
- Next Actions
```

If the output is stateful rather than narrative, the task should declare JSON output explicitly.

Example:

```json
{
  "approval_id": "A-001",
  "task_id": "T-001",
  "status": "awaiting_approval",
  "required_by": "human"
}
```

## What Puppeteer OS is made of

Each project repo is expected to contain:

- canonical project files such as `MISSION.md`, `STATE.json`, `DECISIONS.md`, `RISKS.json`, `EVIDENCE.md`, `NEXT_ACTIONS.md`, `LOG.md`, and `AGENTS.md`
- `docs/` for briefs, specs, notes, decision support, and templates
- `skills/` for reusable operating methods
- `tasks/` for task lifecycle state
- `sources/` for raw and derived material
- `outputs/` for drafts, approved work, and published work
- `dashboard-data/` for dashboard feeds including observability
- `scripts/` for deterministic project operations

This is the project brain. If it is not in the repo, it does not exist.

## What Puppeteer OS is not

Puppeteer OS is **not**:

- a fully autonomous AI company
- a magic no-code agent swarm
- a replacement for human judgement
- a browser bot sitting in total control
- a giant multi-model council for every trivial decision
- a dashboard pretending to be the source of truth
- a database-heavy platform on day one

It is a disciplined manual-operator system first.

## What changed in this upgrade

- The old static dashboard has been replaced with a **Next.js App Router** dashboard.
- The UI now uses **Tailwind CSS** and a premium command-centre layout.
- The repo-first architecture is unchanged: markdown and JSON remain canonical truth.
- The dashboard reads from the repo directly on the server and from `dashboard-data/*.json` feeds.
- An explicit **observability layer** has been added so the dashboard can show whether AI is producing meaningful, durable, governed work change.

## Workflow stance

This is still a manual-first operating system.

That means:

- worker packs are built deliberately
- outputs are written back deliberately
- approvals are explicit
- the dashboard visualises reality rather than replacing it

If the UI ever outruns the process discipline, simplify the UI instead of weakening the process.

## Scope of v1

Included in v1:

- one project repo template
- canonical project files
- `docs/` subfolders
- starter skills
- task and output models
- dashboard shell
- dashboard JSON feeds
- observability feed and observability spec
- deterministic scripts for ingest, validate, pack-building, task movement, linting, and dashboard refresh
- explicit approvals

Not included in v1:

- database or vector store
- browser automation in the critical path
- default multi-model councils
- autonomous publishing
- hidden state outside the repo

## Important docs in this scaffold

- `docs/specs/dashboard-module-spec.md`
- `docs/specs/observability-layer-spec.md`
- `docs/templates/task-template.md`

## Current limitations

Puppeteer OS is strong, but not magic.

- It is still human-in-the-loop in v1.
- Consumer chat UIs are sandboxed and cannot be trusted as a backend runtime.
- Browser automation is useful later, but fragile if used too early.
- The system depends on good file discipline.
- The observability layer is only as good as the write-back discipline and task contracts behind it.
- It can become bloated if too many skills, reviewers, or speculative tools are added too early.

## Future path

### v1.5 — selective operator acceleration

Potential additions:

- clipboard and upload/download helpers
- file watchers
- better dashboard polish
- stronger linting
- export/import staging
- optional browser helpers for low-risk repetitive actions

### v2 — controlled semi-automation

Potential additions:

- structured browser workers for stable flows
- multi-project launcher/dashboard
- search/index layer if flat files start hurting
- richer evidence and contradiction tracking
- optional SQLite only if flat files become painful
- stronger local services around the same repo-first model

## Quick start

```bash
pnpm install
pnpm run validate
pnpm run refresh
pnpm run dev
```

Then open:

```text
http://localhost:3000
```

## Main commands

```bash
pnpm run refresh
pnpm run build-pack -- --task T-001 --role Driver
pnpm run move-task -- --task T-001 --to review
pnpm run ingest -- --source /absolute/path/to/file.pdf --type raw
pnpm run project:lint
```

## Routes

- `/` — command centre dashboard
- `/inspect/<path>` — inspect repo files in the UI, e.g. `/inspect/MISSION.md`
