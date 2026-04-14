# Observability Layer Spec

## Purpose
Make the dashboard prove whether AI is changing work meaningfully, not merely producing visible activity.

## Core question
For any project, the dashboard should answer:
- what changed because AI was used?
- did that work become durable project state?
- is the work validated, approved, and moving the mission forward?

## Required v1 signals
- movement stage
- movement score
- AI-touched output rate
- write-back completion rate
- evidence coverage rate
- approval clearance rate
- revision rate
- task completion rate

## Required dashboard behaviour
- show operational control and meaningful work change separately
- keep approval, evidence, and contradiction rails visible
- avoid vanity metrics such as token count or message count
- prefer project movement and validated output metrics over raw activity metrics

## Canonical feed
The dashboard reads `dashboard-data/observability.json`.

## Rule
If the system cannot explain how AI changed work, the observability layer is incomplete even if the UI looks polished.
