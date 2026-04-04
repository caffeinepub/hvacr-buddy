# HVACR Buddy — PT Data System Upgrade

## Current State

- `PTChartData.ts` exists with 11 refrigerants, `ptLookup()`, `getPsiRange()`, and linear interpolation
- PT tables use sparse data (coarse 50-PSI steps at high pressures) — not accurate enough for field use
- Out-of-range warning exists but message wording is `"{psi} PSI is outside the data range..."`
- PTChart, SuperheatCalculator, SubcoolingCalculator all import from PTChartData and call `ptLookup` / `getPsiRange`
- No "typical operating range" concept separate from table bounds

## Requested Changes (Diff)

### Add
- `getOperatingRange(refrigerantId)` — returns the typical HVAC field operating PSI range (not the full table bounds) per refrigerant, used for the "outside typical operating range" warning
- Dense, accurate PT lookup tables (5–10 PSI steps) for all 11 refrigerants based on standard ASHRAE/REFPROP saturation data
- Warning message: "Pressure is outside typical operating range for this refrigerant" shown when PSI is outside typical operating range

### Modify
- Replace sparse PT tables in `PTChartData.ts` with accurate, dense tabulated data for all 11 refrigerants
- Update PTChart, SuperheatCalculator, SubcoolingCalculator to call `getOperatingRange` and show the new warning message when PSI is outside typical operating range
- Keep existing out-of-table-bounds null return (extrapolation guard)

### Remove
- Old sparse PT table data
- Old warning message wording (replaced with new exact wording)

## Implementation Plan

1. Replace `PTChartData.ts` with accurate dense tables + `getOperatingRange()` function
   - R-22: 0–300 PSI, typical operating 30–250 PSI, 5-PSI steps
   - R-410A: 0–500 PSI, typical operating 50–450 PSI, 5-PSI steps
   - R-134a: 0–280 PSI, typical operating 10–230 PSI, 5-PSI steps
   - R-32: 0–500 PSI, typical operating 50–450 PSI, 10-PSI steps
   - R-454B: 0–450 PSI, typical operating 50–400 PSI, 10-PSI steps
   - R-1234yf: 0–280 PSI, typical operating 10–230 PSI, 5-PSI steps
   - R-1234ze: 0–200 PSI, typical operating 5–170 PSI, 5-PSI steps
   - R-404A: 0–400 PSI, typical operating 20–300 PSI, 5-PSI steps
   - R-407C: 0–400 PSI, typical operating 20–300 PSI, 5-PSI steps
   - R-448A: 0–400 PSI, typical operating 20–300 PSI, 5-PSI steps
   - R-449A: 0–400 PSI, typical operating 20–300 PSI, 5-PSI steps
2. Update PTChart.tsx — replace out-of-range warning with new wording, use `getOperatingRange`
3. Update SuperheatCalculator.tsx — same warning update
4. Update SubcoolingCalculator.tsx — same warning update
