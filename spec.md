# HVAC Mentor AI

## Current State
ResourcesPage has static resource cards and a basic 3-step "Find Your System Schematic" informational panel. No interactive lookup flow exists.

## Requested Changes (Diff)

### Add
- Interactive `SchematicLookup` component embedded in ResourcesPage (above existing sections)
- Two-step guided flow:
  1. Input step: model number field (primary) + brand field (optional), with a "Find Schematic" button
  2. If model number provided: identify manufacturer from model prefix, show targeted guidance (where to find schematic for that brand, what schematic shows, tips for reading it, direct links)
  3. If no model number: prompt asking for brand + system type, then show brand-specific guidance
- Manufacturer detection logic for common prefixes: Carrier (38/24/25/40/48), Trane (4T/2T/TTT/TW), Lennox (XC/XP/SL/ML/EL/CB), Goodman (GSXC/DSXC/CAPF/AMST/ASZ), Rheem (RA/RP/RLNL/RH), York (YXV/ZH/ZF), Heil (HVA/HVB), Amana (ASX/AVXC), Bryant (186B/189B/215A), Payne (PA4Z)
- ManualsLib direct search link using model number
- "What this schematic shows" + "Tips for reading" sections in response
- No fake schematics generated — only real source guidance

### Modify
- ResourcesPage: insert `<SchematicLookup />` below the page header, before existing resource sections

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/SchematicLookup.tsx` with full interactive lookup logic
2. Import and embed it in `ResourcesPage.tsx` below the header
