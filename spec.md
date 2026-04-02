# HVACR Buddy — Buddy Behavior Rules Enforcement

## Current State

Buddy's logic is distributed across:
- `mentorLogic.ts` — legacy keyword-based fallback for unregistered symptoms
- `flowEngine.ts` — structured multi-step flows with branching
- `howToLogic.ts` — 12 step-by-step how-to guides with intent detection
- `MentorChat.tsx` — core chat component with intent routing, all sub-components
- `responseValidator.ts` — pre-render quality gate (one question, no stacking)
- `BuddyPage.tsx` — full-screen Buddy tab wrapper

Current intent detection order: Identification → HowTo → Flow → Legacy.

The existing rules (one question, step-by-step, validation) are partially enforced but lack:
1. System type clarification (residential vs. rooftop vs. other)
2. Explicit context continuity enforcement (don't restart, build on prior answers)
3. Safety reminders for electricity/refrigerant/moving parts
4. "No guessing" fallback phrasing
5. Resource suggestion cap (only one video/resource at a time)
6. Failure condition detection and recovery messaging

## Requested Changes (Diff)

### Add
- System type detection: when symptom input is ambiguous (no system type context), Buddy asks "Is this a residential unit, rooftop unit, or something else?" once before proceeding
- Context continuity: store `systemType` in chat state; include it in every flow step and diagnosis so Buddy tailors responses
- Safety reminder injection: auto-add safety note to any response involving electrical, refrigerant, or moving parts keywords
- "No guessing" response path: when no flow or legacy match is found (truly unknown input), Buddy responds with the defined clarifying phrase instead of a generic fallback
- Single resource rule: ensure only one video/resource is ever surfaced per response
- Identification mode: strengthen the 4-part response (definition, looks like, location, function + optional image)

### Modify
- `MentorChat.tsx`: add `systemType` field to `ChatState`, inject system type question logic before flow activation, improve no-match fallback to use the "I want to make sure I guide you correctly" phrasing
- `responseValidator.ts`: add safety keyword detection; inject standard safety reminder if keywords present and no safety note already in response
- `mentorLogic.ts`: ensure all fallback branches carry safety notes for relevant symptoms; improve no-match path
- `flowEngine.ts`: pass `systemType` through `FlowState` so steps can reference it
- `BuddyPage.tsx`: no changes needed

### Remove
- Generic "I'm not sure" fallback responses that don't guide the user — replace with the no-guessing clarifying phrase

## Implementation Plan

1. Add `systemType: string | null` to `ChatState` and `FlowState`
2. In `processInput`, before activating a flow or legacy path, check if `systemType` is null and input looks like a troubleshooting query — if so, ask the system type clarification question first and set a pending `pendingSymptom` so it resumes after the answer
3. Add `SAFETY_KEYWORDS` list in `responseValidator.ts`; if any match and no safety note present, append a short safety reminder
4. Replace generic no-match fallback in `MentorChat.tsx` with: "I want to make sure I guide you correctly — can you tell me more about the issue?"
5. Enforce single resource rule: in `MentorChat.tsx`, ensure `relatedVideo` is only shown for the last mentor message (already partly done) and no additional resource links accumulate
6. Validate and run frontend build
