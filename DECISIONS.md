# Decisions

## 2026-04-14 — Browser automation deferred to v1.5+
- Context: The system is being built under a no-API constraint.
- Decision: Keep browser automation outside the critical path for v1.
- Why: UI volatility should not break the core operating loop before the manual loop is proven.
- Trade-off accepted: More manual effort in exchange for structural stability.
- Revisit trigger: 20+ successful manual task cycles.

## 2026-04-14 — Repo is canonical truth
- Context: State drift across LLM chats is a major failure mode.
- Decision: Treat repo files as the only durable project state.
- Why: Versioned files are inspectable, auditable, and recoverable.
- Trade-off accepted: Slightly more discipline required for write-back.
- Revisit trigger: Never, unless a better durable state model is proven.

## 2026-04-14 — Upgrade dashboard to Next.js + Tailwind
- Context: The original scaffold UI was functional but not premium enough for the intended operating style.
- Decision: Replace the static dashboard with a Next.js App Router dashboard using Tailwind CSS.
- Why: Better navigation, stronger component structure, and a much higher visual ceiling.
- Trade-off accepted: More frontend framework complexity in exchange for better operator UX.
- Revisit trigger: Only if the framework materially slows iteration.
