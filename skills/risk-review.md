# Skill: Risk Review

## Description
Use when a task, workflow, or proposed system change needs explicit failure-mode review.

## Required inputs
- task file or proposal
- relevant plan or implementation notes
- `RISKS.json`
- `DECISIONS.md` if prior trade-offs matter

## Process
1. Identify operational, state, approval, and tooling risks.
2. Identify contradictions or fragile assumptions.
3. Distinguish immediate vs deferred risks.
4. Recommend mitigations and fallback paths.
5. Update the risk picture without overstating certainty.

## Output format
```md
# Risk Review

## Immediate risks
- ...

## Deferred risks
- ...

## Fragile assumptions
- ...

## Mitigations
- ...

## Manual fallback
- ...
```
