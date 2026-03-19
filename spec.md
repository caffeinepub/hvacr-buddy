# HVACR Buddy

## Current State
The app has a Field HVAC Assistant (Buddy) that guides users step-by-step through troubleshooting with text-based responses. Photo Diagnostic exists for component recognition. No inline visual aids (component images, diagrams, videos) are shown during the troubleshooting flow.

## Requested Changes (Diff)

### Add
- Multimedia support layer in the Field HVAC Assistant / Buddy responses
- When Buddy references a physical component (capacitor, contactor, coil, gauges, etc.), automatically surface a visual aid below the step
- Visual aid types: component image thumbnail, relevant diagram link, or suggested video
- Natural language intro before each visual (e.g., "Here's what that looks like:")
- A `componentVisuals` data map: component name → { image description, diagram reference, video reference }
- Visuals shown inline within the assistant response card, not as a separate section

### Modify
- Buddy's response renderer to detect component keywords and inject visual aids contextually
- Keep visual aids minimal: max 1 per response step, only when a physical part is mentioned
- Ensure visuals don't break the step-by-step flow — guidance always appears first

### Remove
- Nothing removed

## Implementation Plan
1. Create a `componentVisuals.ts` data file mapping component keywords to visual metadata (image path or icon, diagram ref, video ref)
2. Generate simple component illustration images for: capacitor, contactor, evaporator coil, condenser coil, refrigerant gauges, thermostat, air filter, TXV, compressor
3. Build a `ComponentVisualAid` React component that renders the visual card with natural intro text
4. Update the Field HVAC Assistant response rendering to detect physical component keywords and inject the visual aid below the relevant step
5. Apply same logic to Quick Diagnose results on dashboard
