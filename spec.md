# HVACR Buddy

## Current State
The app has a flow engine (`flowEngine.ts`) with a registry pattern, and one registered flow: `ac_not_cooling` (`acNotCooling.ts`). The `MentorChat` component imports and activates flows by trigger keyword. A `FlowProgressBar` component shows step progress, but is currently hardcoded to `AC_FLOW_STEPS`.

## Requested Changes (Diff)

### Add
- `unitNotTurningOn.ts` flow for "unit not turning on" / "won't start" triggers
- `acFreezingUp.ts` flow for "freezing up" / "ice on coil" / "frozen coil" triggers
- `noHeat.ts` flow for "no heat" / "not heating" triggers
- `breakerTripping.ts` flow for "breaker tripping" / "breaker keeps tripping" triggers
- `progressSteps` field on `FlowDef` so each flow defines its own progress bar steps

### Modify
- `flowEngine.ts`: add optional `progressSteps` to `FlowDef` interface
- `MentorChat.tsx`: import all 4 new flows; make `FlowProgressBar` use active flow's `progressSteps` (falling back to `AC_FLOW_STEPS`); add new step labels

### Remove
- Nothing

## Implementation Plan
1. Update `flowEngine.ts` to add `progressSteps?: string[]` to `FlowDef`
2. Add `progressSteps` to `acNotCooling.ts`
3. Create `unitNotTurningOn.ts` flow with steps: power_check → thermostat_check → breaker_check → contactor_check → capacitor_check → diagnosis
4. Create `acFreezingUp.ts` flow with steps: airflow_check → filter_check → refrigerant_check → coil_check → diagnosis
5. Create `noHeat.ts` flow with steps: system_type → thermostat_check → power_check → ignition_check → heat_source_check → diagnosis
6. Create `breakerTripping.ts` flow with steps: system_type → timing_check → amperage_context → capacitor_check → compressor_check → diagnosis
7. Update `MentorChat.tsx` to import new flows and make progress bar dynamic
