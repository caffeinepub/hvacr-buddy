# HVACR Buddy

## Current State
The Diagnose section has three tools: Symptom-based, Measurement-based, and Field HVAC Assistant. No photo-based diagnostic exists.

## Requested Changes (Diff)

### Add
- Photo Diagnostic tool inside the Diagnose section
- User can take a photo (camera) or upload a photo from device
- After photo is added, show a component selector with common HVAC parts
- User selects which components are visible in the photo (pattern-based, manual selection)
- For each selected component, display: name, what it does, common issues, what to check next
- Component data for: capacitor, contactor, wiring, refrigerant gauges, evaporator coil

### Modify
- Diagnose section: add Photo Diagnostic as a fourth tool tab/option

### Remove
- Nothing

## Implementation Plan
1. Create `PhotoDiagnostic` React component
2. Add camera capture (input type=camera) and file upload (input type=file, accept=image/*)
3. Show photo preview after capture/upload
4. Display selectable component chips/buttons for the 5 common HVAC components
5. On selection, show expandable cards with: name, what it does, common issues, what to check next
6. Wire into Diagnose section as a new tool option
7. No backend changes needed -- all logic is frontend only
