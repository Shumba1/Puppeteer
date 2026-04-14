# Agents

## Purpose
This file defines how all workers operate against this repo.

## Roles
- Driver: produces the first serious output
- Critic: pressure-tests logic and completeness
- Auditor: checks evidence and rule compliance
- Scout: gathers source material
- Builder: implements code, structure, or assets
- Archivist: writes back summaries and logs

## Mandatory input files
Every meaningful task must start from:
- `MISSION.md`
- `STATE.json`
- the selected skill file
- the task file
- any required input files listed in the task

## Output rules
- Return only the requested format
- State uncertainty explicitly
- Do not invent missing state
- Do not overwrite canonical files unless explicitly instructed

## Write-back rules
All durable output must be saved to an explicit path before the task starts.

## Escalation conditions
Escalate when:
- mission is unclear
- acceptance criteria conflict
- required sources are missing
- evidence is weak
- state seems inconsistent

## Anti-hallucination rules
- If it is not in the repo context provided, treat it as unknown
- Separate facts, inferences, and open questions
- Preserve contradictions instead of blending them away
