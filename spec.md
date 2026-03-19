# HVACR Buddy

## Current State
Buddy uses mentorLogic.ts with a simple 2-question follow-up model. No multi-step structured flow or branching by state exists.

## Requested Changes (Diff)

### Add
- flowEngine.ts: flow definition system with FlowState tracking (step, system_type, outdoor_running, etc.)
- flows/acNotCooling.ts: 8-step AC Not Cooling flow with branching
- Flow Activation layer in MentorChat.tsx

### Modify
- MentorChat.tsx: add flowState branch alongside existing generic logic

### Remove
- Nothing

## Implementation Plan
1. Create flowEngine.ts with types and advanceFlow logic
2. Create flows/acNotCooling.ts with all 8 steps
3. Update MentorChat.tsx to activate flow on matching symptom
