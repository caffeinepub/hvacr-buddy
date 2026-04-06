# HVACR Buddy — Type III Low Pressure Systems Expansion

## Current State
- App supports EPA 608 Core, Type I (small appliances), and Type II (high-pressure systems)
- Type III section exists in LearnPage with EPA 608 practice questions (25 Qs already in epa608Questions.ts)
- MentorChat supports systemType clarification (residential/rooftop/commercial/other) but NO Type III / chiller / low-pressure detection
- identificationLogic.ts has 15 standard HVAC parts — no Type III-specific parts (purge unit, rupture disc, float valve, evaporator vessel, water-cooled condenser, tube bundle)
- toolsPartsDatabase.ts has 22 tools and 15 parts — no Type III-specific tools (micron gauge, low-pressure recovery machine) or parts
- Buddy's assistantLogic.ts has no chiller / centrifugal / R-123 / R-11 / low-pressure detection
- LearnPage Type III section is minimal (just key concepts + practice Qs + 1 video) — needs EPA rules, equipment list, safety content

## Requested Changes (Diff)

### Add
- **Type III system type detection** in MentorChat: detect keywords "chiller", "centrifugal", "low-pressure refrigerant", "R-123", "R-11" and set systemType = "type3_chiller"
- **Type III Buddy mode**: when systemType is "type3_chiller", Buddy uses advanced explanations, moves slower and more precise, emphasizes system sensitivity, vacuum conditions, air/moisture contamination, purge system operation, and leak sensitivity
- **Type III safety warnings**: auto-inject safety reminders about operating under vacuum, risk of air/moisture contamination, and system sensitivity whenever Type III is detected
- **6 new Type III parts** in identificationLogic.ts and toolsPartsDatabase.ts:
  - Purge Unit (Refrigerant/Chiller)
  - Rupture Disc (Safety/Chiller)
  - Float Valve (Refrigerant/Chiller)
  - Evaporator Vessel (Refrigerant/Chiller)
  - Water-Cooled Condenser (Refrigerant/Chiller)
  - Tube Bundle (Refrigerant/Chiller)
- **4 Type III tools** (some already exist, add/update as needed):
  - Vacuum Pump (already exists — tag as critical for Type III)
  - Micron Gauge (new — add to tools database)
  - Low-Pressure Recovery Machine (new)
  - Leak Detector (already exists — update with Type III context)
- **EPA Rules content** for Type III in LearnPage:
  - 35% annual leak rate repair threshold (commercial > 50 lbs)
  - Evacuation: pressurize to 0 psig before opening (not vacuum like high-pressure)
  - Recovery requirements (use low-pressure rated equipment)
- **Enhanced LearnPage Type III section**: add Equipment section (chiller, centrifugal chiller, absorption system), Safety section, EPA Rules section
- **Type III troubleshooting guidance**: when chiller/Type III is active, Buddy emphasizes vacuum conditions, air and moisture contamination, purge system operation, leak sensitivity

### Modify
- MentorChat system type detection: add "chiller", "centrifugal", "r-123", "r-11", "low pressure chiller" to detection keywords, route to type3_chiller mode
- MentorChat system type quick answers: add "Chiller / Low Pressure" button
- assistantLogic.ts: add Type III-aware troubleshooting responses for chiller symptoms
- identificationLogic.ts: add 6 new Type III component entries (no images for new parts — follow strict no-guess rule)
- toolsPartsDatabase.ts: add micron gauge and low-pressure recovery machine; tag vacuum pump as Type III critical
- LearnPage Type III section: enrich with equipment, EPA rules, safety warnings

### Remove
- Nothing removed

## Implementation Plan
1. **MentorChat.tsx**: Add Type III keyword detection ("chiller", "centrifugal", "r-123", "r-11"). When detected, set systemType = "type3_chiller". Add "Chiller / Low Pressure" as a quick answer option. When systemType is type3_chiller, auto-inject Type III safety reminders (vacuum, moisture, sensitivity) into Buddy responses.
2. **identificationLogic.ts**: Add 6 new entries for purge unit, rupture disc, float valve, evaporator vessel, water-cooled condenser, tube bundle. No images (no verified files). Add keywords to detect these parts from user queries.
3. **toolsPartsDatabase.ts**: Add micron gauge and low-pressure recovery machine as new tools. Add 6 Type III parts to parts array. Add Type III flag to vacuum pump and leak detector.
4. **assistantLogic.ts**: Add Type III troubleshooting responses — focus on vacuum conditions, air/moisture contamination, purge system, leak sensitivity. Add chiller-specific symptom patterns.
5. **LearnPage.tsx**: Enhance Type III section with Equipment subsection (chiller types, absorption awareness), EPA Rules subsection (35% threshold, evacuation requirements, recovery rules), Safety subsection (vacuum warnings, contamination risks).
