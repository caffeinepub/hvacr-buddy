# HVAC Mentor AI — Parts Section

## Current State
- ToolsPage has a Parts tab but only seeds 8 parts (Capacitor, Contactor, TXV, Filter Drier, Reversing Valve, Blower Motor, Fan Blade, Run Capacitor)
- Parts tab shows backend data only, shows empty state if backend has no data
- PART_DETAILS only covers 4 parts with symptoms/function/howToCheck/replacementNote structure
- PartCard expands in-place but uses old detail structure
- identificationLogic.ts has all 15 parts but VERIFIED_PART_IMAGES only has 7 images
- componentVisuals.ts nameToVisualKey missing most new parts
- Images missing for: Transformer, TXV, Reversing Valve, Filter Drier, Accumulator, Blower Motor, Condenser Fan Motor, Pressure Switch, Float Switch

## Requested Changes (Diff)

### Add
- 9 new part images generated and stored in public/assets/generated/
- Full PART_DETAILS for all 15 required parts using the 4-section structure: whatItIs, whatItDoes, whatItLooksLike, whereLocated
- All 15 parts in SEED_PARTS so tab is never empty
- New PartCard detail view showing image + 4 structured sections (What it is, What it does, What it looks like, Where it is located)
- nameToVisualKey mappings for all 15 new parts
- VERIFIED_PART_IMAGES entries for all 15 parts

### Modify
- SEED_PARTS expanded from 8 to 15 with all required parts
- PartsTab always falls back to SEED_PARTS (same pattern as ToolsTab)
- PartCard detail uses new 4-section layout matching the detail page spec
- componentVisuals.ts updated with all new part keys
- identificationLogic.ts VERIFIED_PART_IMAGES updated with all new images

### Remove
- Old PartCard detail format using commonSymptoms/howToCheck/replacementNote (replaced with new structure)

## Implementation Plan
1. Update ToolsPage.tsx: expand SEED_PARTS to 15, rewrite PART_DETAILS to 4-section structure, update PartCard to show image + 4 sections, make PartsTab never empty
2. Update componentVisuals.ts: add nameToVisualKey entries for all 15 parts
3. Update identificationLogic.ts: add all 9 new image entries to VERIFIED_PART_IMAGES
