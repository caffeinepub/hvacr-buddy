# HVAC Mentor AI – PT Chart Tool

## Current State
The app has Tools, Parts, Videos, Resources, Buddy chat, and Learn sections. The Tools tab lists HVAC field tools by category. There is no pressure-temperature calculator anywhere in the app.

## Requested Changes (Diff)

### Add
- A "Calculators" section or card group inside the Tools tab (to house PT Chart now, Superheat and Subcooling later)
- PT Chart screen with:
  - Refrigerant dropdown (11 refrigerants grouped: Common, New/A2L, Commercial)
  - PSI numeric input with instant calculation
  - Saturation temperature output in °F
  - Safety class badge (A1, A2L), safety classification label, and short note
- Placeholder cards for "Superheat Calculator" and "Subcooling Calculator" marked "Coming Soon"
- PTChartData.ts with hardcoded PSI→°F lookup tables for all 11 refrigerants + metadata

### Modify
- Tools tab: add a Calculators section at the top or bottom with the PT Chart card (and Coming Soon cards for Superheat/Subcooling)

### Remove
- Nothing removed

## Implementation Plan
1. Create `PTChartData.ts` — lookup tables (PSI → °F) for R-22, R-410A, R-134a, R-32, R-454B, R-1234yf, R-1234ze, R-404A, R-407C, R-448A, R-449A. Each entry includes safety class and note.
2. Create `PTChart.tsx` — refrigerant dropdown (grouped), PSI input, interpolated °F output, safety badge, mobile-friendly dark UI.
3. Add Calculators section to Tools tab with PT Chart card + 2 Coming Soon cards.
4. Wire navigation from Tools tab card → PT Chart screen.
