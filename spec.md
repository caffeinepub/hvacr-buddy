# HVACR Buddy

## Current State
Dashboard has a header, welcome hero with search bar, four feature cards (Diagnose, Jobs, Learn, Tools), and a footer. No inline diagnostic capability exists on the dashboard itself.

## Requested Changes (Diff)

### Add
- Quick Diagnose widget on the Dashboard, placed between the hero/search section and the feature cards.
- Text input for entering a symptom or issue.
- Instant results panel (shown inline, no page navigation) with:
  - Likely causes (2-3 bullet points)
  - Basic troubleshooting steps (2-3 steps)
  - Suggested videos (1-2 relevant videos from the Video Library)
- Results are generated from the same rule-based keyword logic already used in the Diagnose page.

### Modify
- Dashboard.tsx: insert the Quick Diagnose section between the hero and the feature cards grid.

### Remove
- Nothing removed.

## Implementation Plan
1. Add a `QuickDiagnose` component (or inline section) in Dashboard.tsx.
2. Implement keyword-matching logic (reuse patterns from DiagnosePage) to return causes, steps, and video suggestions based on the entered symptom.
3. Show results immediately as the user types or on submit (a small "Check" button or Enter key).
4. Keep the layout clean -- results appear below the input, collapsed when empty.
5. Video suggestions link to the Video Library in Learn.
