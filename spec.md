# HVACR Buddy

## Current State
Buddy already suggests tools and parts during troubleshooting flows, with tool cards and part diagnosis messages built into relevant steps.

## Requested Changes (Diff)

### Add
- Structured 5-step tool/part suggestion logic inside Buddy's response engine

### Modify
- Tool and part suggestion flow to follow: (1) Identify situation, (2) Match to database entries, (3) Select ONE most relevant, (4) Explain simply, (5) Guide usage step-by-step

### Remove
- Nothing removed

## Implementation Plan
1. Update the tool/part suggestion logic in the Buddy assistant component to enforce the 5-step structured selection process
2. Ensure only ONE tool or part is surfaced per step, matched to the active troubleshooting context
3. Display suggestion in a clear card format: situation → match → selection → explanation → steps
