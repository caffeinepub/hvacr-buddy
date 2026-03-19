// ─── Tools & Parts Client-Side Reference Database ───────────────────────────
// Mirrors the seeded tools[] and parts[] backend collections so Buddy can
// look up full guidance data entirely on the frontend — no async call needed.

export type SafetyCategory = "electrical" | "refrigerant" | "pressure" | null;

export interface ToolData {
  name: string;
  category: string;
  usedFor: string[];
  explanation: string; // one sentence: what it is + why it's needed
  whenToUse: string;
  steps: string[]; // how to use it — numbered
  safety: SafetyCategory;
  aliases: string[]; // alternate names used in scenario data
}

export interface PartData {
  name: string;
  category: string;
  explanation: string; // one sentence: what it does
  commonSymptoms: string[];
  steps: string[]; // how to check it — numbered
  replacementNote: string;
  safety: SafetyCategory;
  aliases: string[];
}

export const TOOLS_DB: ToolData[] = [
  {
    name: "Multimeter",
    category: "Electrical",
    usedFor: [
      "voltage testing",
      "continuity testing",
      "capacitor testing",
      "resistance testing",
    ],
    explanation:
      "A multimeter measures voltage, resistance, and capacitance so you can confirm if power is reaching a component or if it has failed.",
    whenToUse:
      "When checking electrical components or verifying power is present",
    steps: [
      "Select the correct mode — VAC for voltage, Ω for resistance, or µF for capacitance.",
      "Place the red probe on the positive terminal and the black probe on the negative (or ground).",
      "Read the display and compare to the expected value.",
      "If voltage is missing or resistance is open/shorted, that component is the fault.",
    ],
    safety: "electrical",
    aliases: [
      "multimeter",
      "volt meter",
      "voltmeter",
      "capacitor tester",
      "digital multimeter",
    ],
  },
  {
    name: "Clamp Meter",
    category: "Electrical",
    usedFor: ["measuring current draw", "amperage check", "motor amp draw"],
    explanation:
      "A clamp meter measures live amp draw without breaking the circuit, so you can confirm a motor or compressor is within its rated operating range.",
    whenToUse:
      "When checking if motors or compressors are drawing proper amperage",
    steps: [
      "Set the clamp meter to AC amps (A) mode.",
      "Open the clamp and wrap it around a single wire — not both wires together.",
      "Read the amperage on the display.",
      "Compare to the unit nameplate — normal RLA is the steady-run value; LRA is the startup spike.",
    ],
    safety: "electrical",
    aliases: ["clamp meter", "amp meter", "ammeter", "clamp-meter"],
  },
  {
    name: "Manifold Gauge Set",
    category: "Refrigerant",
    usedFor: [
      "checking system pressure",
      "charging refrigerant",
      "suction pressure",
      "head pressure",
    ],
    explanation:
      "A manifold gauge set connects to the system service ports to show suction and head pressures, which tells you if the refrigerant charge and system balance are correct.",
    whenToUse:
      "When diagnosing refrigerant issues or confirming system pressures",
    steps: [
      "Connect the blue (low-side) hose to the suction service valve.",
      "Connect the red (high-side) hose to the discharge service valve.",
      "With the system running, read both gauges and note the pressures.",
      "Compare to the manufacturer's pressure chart for the refrigerant type and outdoor temperature.",
    ],
    safety: "refrigerant",
    aliases: [
      "manifold gauge set",
      "manifold gauges",
      "gauge set",
      "refrigerant gauges",
      "gauges",
    ],
  },
  {
    name: "Vacuum Pump",
    category: "Refrigerant",
    usedFor: ["evacuating system", "pulling vacuum", "removing moisture"],
    explanation:
      "A vacuum pump removes air and moisture from the refrigerant circuit before charging, which prevents acid formation and compressor damage.",
    whenToUse: "Before adding refrigerant to a system after any repair",
    steps: [
      "Connect the vacuum pump to the center (yellow) hose on the manifold gauge set.",
      "Open both high-side and low-side gauge valves.",
      "Start the pump and pull the system down to 500 microns or below.",
      "Close both valves and shut the pump off — monitor for 15 minutes to confirm no rise (leak test).",
    ],
    safety: "refrigerant",
    aliases: ["vacuum pump", "vac pump"],
  },
  {
    name: "Leak Detector",
    category: "Refrigerant",
    usedFor: ["finding refrigerant leaks", "leak detection"],
    explanation:
      "An electronic leak detector senses refrigerant vapor in the air so you can pinpoint the exact location of a leak before recharging.",
    whenToUse:
      "When the system is low on refrigerant or after any coil or line repair",
    steps: [
      "Turn on the detector and allow it to warm up (30 seconds for most models).",
      "Start at the lowest point — refrigerant vapor is heavier than air.",
      "Move the probe slowly around coil connections, flare fittings, and Schrader cores.",
      "When the detector beeps or the alarm rate increases, you've found the leak zone — mark it and recheck.",
    ],
    safety: "refrigerant",
    aliases: [
      "leak detector",
      "electronic leak detector",
      "refrigerant leak detector",
    ],
  },
  {
    name: "Thermometer",
    category: "Airflow",
    usedFor: [
      "measuring supply air temperature",
      "delta-T check",
      "temperature measurement",
    ],
    explanation:
      "A thermometer measures supply and return air temperatures so you can confirm how much heat transfer is actually happening in the system.",
    whenToUse: "When checking cooling or heating performance at the vents",
    steps: [
      "Insert the probe into the supply vent opening.",
      "Wait 30 seconds for a stable reading.",
      "Record the supply air temperature and the return air temperature.",
      "Subtract: return temp minus supply temp = delta-T. Normal cooling delta-T is 15–20°F.",
    ],
    safety: null,
    aliases: ["thermometer", "digital thermometer", "temperature probe"],
  },
];

export const PARTS_DB: PartData[] = [
  {
    name: "Capacitor",
    category: "Electrical",
    explanation:
      "A capacitor stores and releases electrical energy to give the compressor and fan motor the boost they need to start and keep running.",
    commonSymptoms: [
      "unit not starting",
      "humming sound",
      "fan not spinning",
      "breaker tripping on startup",
    ],
    steps: [
      "Turn the disconnect OFF before touching anything inside the outdoor unit.",
      "Discharge the capacitor by shorting its terminals with an insulated screwdriver.",
      "Set your multimeter to capacitance mode (µF symbol).",
      "Place the probes on the capacitor terminals and read the µF value.",
      "If the reading is more than 10% below the rated value on the label, the capacitor is bad — replace it.",
    ],
    replacementNote:
      "Match the exact microfarad (µF) and voltage rating on the original label.",
    safety: "electrical",
    aliases: [
      "capacitor",
      "run capacitor",
      "start capacitor",
      "dual run capacitor",
      "dual-run capacitor",
      "run/start capacitor",
    ],
  },
  {
    name: "Contactor",
    category: "Electrical",
    explanation:
      "A contactor is the electrical switch that closes to send high-voltage power to the compressor and outdoor fan when the thermostat calls.",
    commonSymptoms: [
      "outdoor unit not running",
      "clicking sound",
      "unit not starting",
      "no power to outdoor unit",
    ],
    steps: [
      "Turn the disconnect OFF before opening the outdoor unit panel.",
      "With the thermostat calling for cooling, use a multimeter (VAC mode) to check for 24V across the contactor coil terminals.",
      "If 24V is present but the contactor won't pull in, the coil is burned — replace the contactor.",
      "Check the contact faces for pitting or burning — if the contacts are pitted, replace the contactor even if it pulls in.",
    ],
    replacementNote:
      "Ensure the replacement contactor matches the voltage and amp rating of the original.",
    safety: "electrical",
    aliases: ["contactor"],
  },
  {
    name: "Air Filter",
    category: "Airflow",
    explanation:
      "The air filter removes dust and debris from return air before it passes over the evaporator coil — a clogged filter starves the system of airflow.",
    commonSymptoms: [
      "weak airflow",
      "system freezing",
      "poor cooling",
      "coil icing",
    ],
    steps: [
      "Locate the filter at the return air grille or inside the air handler cabinet.",
      "Remove the filter and hold it up to a light — if you can't see light through it, it's due for replacement.",
      "Replace with a filter of the same size and MERV rating.",
      "Confirm the filter is installed with the airflow arrow pointing toward the air handler.",
    ],
    replacementNote:
      "Replace every 1–3 months depending on system load and indoor air quality.",
    safety: null,
    aliases: ["air filter", "filter"],
  },
  {
    name: "Evaporator Coil",
    category: "Refrigerant",
    explanation:
      "The evaporator coil is where refrigerant absorbs heat from the indoor air — when it gets dirty or ices over, cooling stops.",
    commonSymptoms: [
      "freezing",
      "not cooling",
      "coil iced up",
      "poor airflow through coil",
    ],
    steps: [
      "Shut the system off before inspecting — if the coil is iced, run fan-only to thaw first (1–2 hours).",
      "After thawing, inspect the coil surface for dirt, debris, or mold buildup.",
      "If dirty, clean with a coil cleaner spray according to the product directions.",
      "After cleaning and drying, restart the system and check supply air temperature and pressures.",
    ],
    replacementNote:
      "Clean before replacing — a coil with good airflow and refrigerant charge rarely needs replacement.",
    safety: "refrigerant",
    aliases: ["evaporator coil", "evap coil", "indoor coil", "a-coil"],
  },
];

// ─── Lookup Helpers ───────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

export function lookupTool(name: string): ToolData | null {
  const n = normalize(name);
  return (
    TOOLS_DB.find((t) =>
      t.aliases.some(
        (alias) =>
          normalize(alias) === n ||
          n.includes(normalize(alias)) ||
          normalize(alias).includes(n),
      ),
    ) ?? null
  );
}

export function lookupPart(name: string): PartData | null {
  const n = normalize(name);
  return (
    PARTS_DB.find((p) =>
      p.aliases.some(
        (alias) =>
          normalize(alias) === n ||
          n.includes(normalize(alias)) ||
          normalize(alias).includes(n),
      ),
    ) ?? null
  );
}

// ─── Situation → Best Tool/Part ───────────────────────────────────────────────
// Given a list of tool or part names (from a scenario), return the single most
// relevant one based on priority rules:
//  - Tools: prefer multimeter > manifold gauges > clamp meter > others
//  - Parts: prefer capacitor > contactor > filter > coil

const TOOL_PRIORITY = [
  "multimeter",
  "manifold gauge set",
  "clamp meter",
  "leak detector",
  "thermometer",
  "vacuum pump",
];
const PART_PRIORITY = [
  "capacitor",
  "run capacitor",
  "contactor",
  "air filter",
  "evaporator coil",
];

export function selectBestTool(toolNames: string[]): ToolData | null {
  for (const priority of TOOL_PRIORITY) {
    for (const name of toolNames) {
      const found = lookupTool(name);
      if (
        found &&
        TOOL_PRIORITY.indexOf(normalize(found.name)) <=
          TOOL_PRIORITY.indexOf(priority)
      ) {
        return found;
      }
    }
  }
  // Fallback: return the first one that resolves
  for (const name of toolNames) {
    const found = lookupTool(name);
    if (found) return found;
  }
  return null;
}

export function selectBestPart(partNames: string[]): PartData | null {
  for (const priority of PART_PRIORITY) {
    for (const name of partNames) {
      const found = lookupPart(name);
      if (
        found &&
        PART_PRIORITY.indexOf(normalize(found.name)) <=
          PART_PRIORITY.indexOf(priority)
      ) {
        return found;
      }
    }
  }
  for (const name of partNames) {
    const found = lookupPart(name);
    if (found) return found;
  }
  return null;
}
