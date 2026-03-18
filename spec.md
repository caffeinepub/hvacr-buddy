# HVACR Buddy

## Current State
The Learn route renders a placeholder via `<SectionPage title="Learn" />`. No actual content or navigation exists in the Learn section.

## Requested Changes (Diff)

### Add
- `LearnPage.tsx`: Full Learn section with three tabs: Study, Videos, Diagrams
  - Study tab: 4 topics (HVAC Basics, Electrical Fundamentals, Multimeter Usage, Refrigeration Concepts) with selectable cards that expand to show concise content
  - Videos tab: 4 categories (EPA 608 Prep, Electrical & Schematics, Refrigerant Diagnostics, HVAC Tools & Procedures) with 2-3 video links per category (YouTube embeds or links)
  - Diagrams tab: 5 diagrams (Refrigeration Cycle, 24V Control Circuit, Contactor Wiring, Capacitor Wiring, Airflow Diagram) displayed as selectable items with descriptive text/SVG placeholder

### Modify
- `App.tsx`: Update learnRoute to use `LearnPage` instead of `SectionPage`

### Remove
- Nothing removed

## Implementation Plan
1. Create `LearnPage.tsx` with tab navigation (Study / Videos / Diagrams)
2. Study tab: card list, click to expand with brief educational content
3. Videos tab: category list, click to see 2-3 curated YouTube links per category
4. Diagrams tab: list of diagrams, click to view a simple labeled description or inline SVG
5. Update `App.tsx` learnRoute to import and use `LearnPage`
