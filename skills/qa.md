# Skill: QA

## Description
Use when an output must be reviewed against mission, evidence, constraints, and acceptance criteria.

## Required inputs
- task file
- output file under review
- `MISSION.md`
- acceptance criteria
- relevant evidence

## Process
1. Check alignment with mission.
2. Check acceptance criteria one by one.
3. Identify unsupported claims.
4. Identify omissions, weak logic, or contradictions.
5. Recommend one of:
   - approve
   - revise
   - reject

## Output format
```md
# QA Review

## Decision
approve | revise | reject

## Acceptance criteria check
- [ ] ...

## Issues found
- ...

## Unsupported claims
- ...

## Recommended revisions
- ...
```
