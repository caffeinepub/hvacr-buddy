// ─── Shared Field HVAC Assistant Logic ──────────────────────────────────────

export interface FieldAssistantScenario {
  id: string;
  title: string;
  keywords: string[];
  causes: string[];
  steps: string[];
  tools: string[];
  possibleParts: string[];
  relatedStudy: string[];
  relatedVideos: string[];
  relatedDiagrams: string[];
}

export const FIELD_SCENARIOS: FieldAssistantScenario[] = [
  {
    id: "field-ac-not-cooling",
    title: "AC Not Cooling",
    keywords: [
      "ac not cooling",
      "not cooling",
      "no cold air",
      "ac warm",
      "not cold",
    ],
    causes: [
      "Low refrigerant charge or leak",
      "Dirty condenser coils restricting heat transfer",
      "Faulty or failing compressor",
      "Thermostat malfunction or incorrect settings",
    ],
    steps: [
      "Check thermostat is set to COOL and set below current room temp.",
      "Inspect air filter — replace if dirty or clogged.",
      "Check outdoor unit for blocked airflow or dirty condenser coil.",
      "Listen for compressor operation — if silent, check breakers and capacitor.",
    ],
    tools: ["Manifold gauge set", "Thermometer", "Multimeter"],
    possibleParts: [
      "Run capacitor",
      "Refrigerant charge",
      "Contactor",
      "Air filter",
    ],
    relatedStudy: ["Refrigeration Concepts", "HVAC Basics"],
    relatedVideos: ["Refrigerant Diagnostics", "HVAC Tools & Procedures"],
    relatedDiagrams: ["Refrigeration Cycle", "Airflow Diagram"],
  },
  {
    id: "field-compressor-not-starting",
    title: "Compressor Not Starting",
    keywords: [
      "compressor not starting",
      "compressor won't start",
      "compressor not running",
      "compressor dead",
    ],
    causes: [
      "Tripped breaker or blown fuse",
      "Failed run or start capacitor",
      "Defective contactor",
      "Low refrigerant pressure safety lockout",
    ],
    steps: [
      "Reset any tripped breakers and check fuses at the disconnect.",
      "Inspect the capacitor visually — bulging or leaking means replacement needed.",
      "Test the contactor with a multimeter for voltage and contact condition.",
      "Check refrigerant pressures — low pressure may trigger a lockout.",
    ],
    tools: ["Multimeter", "Manifold gauge set", "Capacitor tester"],
    possibleParts: ["Run/start capacitor", "Contactor", "Dual-run capacitor"],
    relatedStudy: ["Electrical Fundamentals", "Multimeter Usage"],
    relatedVideos: ["Electrical & Schematics", "HVAC Tools & Procedures"],
    relatedDiagrams: ["Contactor Wiring", "Capacitor Wiring"],
  },
  {
    id: "field-fan-running-no-cooling",
    title: "Fan Running But No Cooling",
    keywords: [
      "fan running no cooling",
      "fan on no cool",
      "air blowing not cold",
      "fan works no cool",
      "blowing warm air",
    ],
    causes: [
      "Compressor not engaging or failed",
      "Low refrigerant charge",
      "Faulty run capacitor on compressor",
      "Reversing valve stuck in heating mode (heat pumps)",
    ],
    steps: [
      "Confirm both outdoor fan and compressor are running — if only fan runs, focus on compressor.",
      "Check refrigerant pressures using manifold gauges.",
      "Test compressor run capacitor for proper microfarad rating.",
      "On heat pumps, check reversing valve operation and solenoid.",
    ],
    tools: ["Manifold gauge set", "Multimeter", "Capacitor tester"],
    possibleParts: [
      "Run capacitor",
      "Compressor",
      "Reversing valve (heat pump)",
    ],
    relatedStudy: ["Refrigeration Concepts", "Electrical Fundamentals"],
    relatedVideos: ["Refrigerant Diagnostics", "Electrical & Schematics"],
    relatedDiagrams: ["Refrigeration Cycle", "Contactor Wiring"],
  },
  {
    id: "field-low-suction-pressure",
    title: "Low Suction Pressure",
    keywords: [
      "low suction pressure",
      "low suction",
      "suction too low",
      "suction pressure low",
    ],
    causes: [
      "Low refrigerant charge or leak",
      "Restricted metering device (TXV or orifice)",
      "Dirty evaporator coil or iced coil",
      "Low airflow across evaporator",
    ],
    steps: [
      "Check suction pressure with manifold gauges and compare to manufacturer specs.",
      "Inspect evaporator coil for ice buildup — if iced, shut down and allow to thaw.",
      "Replace dirty air filter and confirm all return vents are open.",
      "Inspect TXV or metering device for restriction or malfunction.",
    ],
    tools: ["Manifold gauge set", "Thermometer", "Leak detector"],
    possibleParts: ["TXV/metering device", "Filter", "Refrigerant charge"],
    relatedStudy: ["Refrigeration Concepts", "HVAC Basics"],
    relatedVideos: ["Refrigerant Diagnostics", "EPA 608 Prep"],
    relatedDiagrams: ["Refrigeration Cycle", "Airflow Diagram"],
  },
  {
    id: "field-high-head-pressure",
    title: "High Head Pressure",
    keywords: [
      "high head pressure",
      "high discharge pressure",
      "head pressure too high",
    ],
    causes: [
      "Dirty or blocked condenser coil",
      "Condenser fan not running or slow",
      "Non-condensables in the refrigerant circuit",
      "Overcharge of refrigerant",
    ],
    steps: [
      "Inspect and clean the condenser coil.",
      "Verify condenser fan is spinning at full speed.",
      "Check for non-condensables — connect gauges and observe pressure behavior.",
      "Verify refrigerant charge is within manufacturer specs.",
    ],
    tools: ["Manifold gauge set", "Coil cleaner", "Multimeter"],
    possibleParts: ["Condenser fan motor", "Capacitor", "Coil cleaner"],
    relatedStudy: ["Refrigeration Concepts", "HVAC Basics"],
    relatedVideos: ["Refrigerant Diagnostics", "HVAC Tools & Procedures"],
    relatedDiagrams: ["Refrigeration Cycle", "Airflow Diagram"],
  },
  {
    id: "field-frozen-coil",
    title: "Frozen / Iced Evaporator Coil",
    keywords: [
      "frozen coil",
      "iced coil",
      "ice on coil",
      "unit freezing up",
      "coil frozen",
      "ice buildup",
    ],
    causes: [
      "Severely restricted or dirty air filter",
      "Low refrigerant charge",
      "Blower motor running slow or failed",
      "Blocked return air grilles",
    ],
    steps: [
      "Shut down the system and switch to fan-only mode to thaw the coil.",
      "Replace the air filter — dirty filter is the #1 cause.",
      "Check return air grilles for blockage.",
      "After thawing, restart and check suction pressure and superheat.",
    ],
    tools: ["Manifold gauge set", "Thermometer", "Multimeter"],
    possibleParts: [
      "Air filter",
      "Blower motor capacitor",
      "Refrigerant charge",
    ],
    relatedStudy: ["Refrigeration Concepts", "HVAC Basics"],
    relatedVideos: ["Refrigerant Diagnostics", "HVAC Tools & Procedures"],
    relatedDiagrams: ["Refrigeration Cycle", "Airflow Diagram"],
  },
  {
    id: "field-short-cycling",
    title: "Short Cycling",
    keywords: [
      "short cycling",
      "turns on and off",
      "unit cycling",
      "cycles too fast",
      "keeps turning off",
    ],
    causes: [
      "Oversized unit for the space",
      "Low refrigerant triggering low-pressure cutout",
      "Dirty air filter causing high-pressure lockout",
      "Faulty thermostat or control board",
    ],
    steps: [
      "Check and replace the air filter.",
      "Connect manifold gauges — look for low suction or high head pressure cutouts.",
      "Verify thermostat location is not near heat sources causing false readings.",
      "Check control board for fault codes or lockout indicators.",
    ],
    tools: ["Manifold gauge set", "Multimeter", "Thermometer"],
    possibleParts: ["Thermostat", "Control board", "Refrigerant charge"],
    relatedStudy: ["Refrigeration Concepts", "Electrical Fundamentals"],
    relatedVideos: ["Refrigerant Diagnostics", "Electrical & Schematics"],
    relatedDiagrams: ["Refrigeration Cycle", "24V Control Circuit"],
  },
  {
    id: "field-refrigerant-leak",
    title: "Refrigerant Leak",
    keywords: [
      "refrigerant leak",
      "oil stains",
      "leak",
      "losing charge",
      "low charge",
      "oily residue",
    ],
    causes: [
      "Leaking Schrader valve core",
      "Pinhole leak in evaporator or condenser coil",
      "Loose or cracked flare fitting",
      "Vibration-damaged refrigerant line",
    ],
    steps: [
      "Look for oil stains at fittings, coils, and line sets — oil follows refrigerant leaks.",
      "Use an electronic leak detector or UV dye to pinpoint the leak.",
      "Check all Schrader valve cores for seeping.",
      "After repair, pressure test and verify charge to manufacturer specs.",
    ],
    tools: ["Electronic leak detector", "UV dye kit", "Manifold gauge set"],
    possibleParts: [
      "Schrader valve cores",
      "Flare fittings",
      "Refrigerant charge",
      "Line set section",
    ],
    relatedStudy: ["EPA 608 Core", "Refrigeration Concepts"],
    relatedVideos: ["Refrigerant Diagnostics", "EPA 608 Prep"],
    relatedDiagrams: ["Refrigeration Cycle"],
  },
  {
    id: "field-no-heat-heat-pump",
    title: "No Heat (Heat Pump)",
    keywords: [
      "no heat",
      "not heating",
      "heat pump not heating",
      "aux heat",
      "heat mode not working",
    ],
    causes: [
      "Reversing valve stuck in cooling mode",
      "Low refrigerant charge in heating mode",
      "Outdoor unit not running or iced over",
      "Auxiliary heat strips failed",
    ],
    steps: [
      "Verify thermostat is in HEAT mode and set above current temperature.",
      "Check if outdoor unit is running — look for ice buildup on unit.",
      "Test reversing valve solenoid for 24V and proper shifting.",
      "Check auxiliary heat strips with a clamp meter for current draw.",
    ],
    tools: ["Multimeter", "Clamp meter", "Manifold gauge set"],
    possibleParts: [
      "Reversing valve",
      "Reversing valve solenoid",
      "Heat strips",
      "Sequencer",
    ],
    relatedStudy: ["Refrigeration Concepts", "Electrical Fundamentals"],
    relatedVideos: ["Refrigerant Diagnostics", "Electrical & Schematics"],
    relatedDiagrams: ["Refrigeration Cycle", "24V Control Circuit"],
  },
  {
    id: "field-tripped-breaker",
    title: "Tripped Breaker",
    keywords: [
      "breaker tripping",
      "keeps tripping",
      "breaker won't stay on",
      "breaker trips",
      "circuit breaker",
    ],
    causes: [
      "Compressor drawing locked rotor amperage (LRA) — hard starting",
      "Failed capacitor causing motor overload",
      "Short to ground in compressor or motor windings",
      "Undersized or weak breaker",
    ],
    steps: [
      "Do NOT reset repeatedly — check amperage before restarting.",
      "Use a clamp meter to measure compressor amps at startup.",
      "Test run and start capacitors — weak capacitors cause hard starts.",
      "Megohm-test compressor windings to check for ground fault.",
    ],
    tools: ["Clamp meter", "Multimeter", "Capacitor tester"],
    possibleParts: [
      "Run/start capacitor",
      "Hard start kit",
      "Contactor",
      "Compressor",
    ],
    relatedStudy: ["Electrical Fundamentals", "Multimeter Usage"],
    relatedVideos: ["Electrical & Schematics", "HVAC Tools & Procedures"],
    relatedDiagrams: ["Contactor Wiring", "Capacitor Wiring"],
  },
];

export interface MeasurementResult {
  title: string;
  insight: string;
  actions: string[];
}

export function matchesFieldQuery(
  scenario: FieldAssistantScenario,
  query: string,
): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  if (scenario.title.toLowerCase().includes(q)) return true;
  return scenario.keywords.some((kw) => kw.includes(q) || q.includes(kw));
}

export function getMeasurementInsight(
  suction: number | null,
  head: number | null,
  superheat: number | null,
  subcooling: number | null,
): MeasurementResult | null {
  if (
    superheat !== null &&
    subcooling !== null &&
    superheat > 15 &&
    subcooling < 5
  ) {
    return {
      title: "Low Refrigerant Charge",
      insight:
        "High superheat + low subcooling. Likely undercharged or leaking.",
      actions: [
        "Check for refrigerant leaks at all connections",
        "Verify charge with manufacturer target superheat/subcooling",
        "Inspect Schrader valve cores",
      ],
    };
  }
  if (head !== null && head > 350) {
    return {
      title: "High Head Pressure",
      insight: "Possible dirty condenser coil or airflow restriction.",
      actions: [
        "Clean condenser coil",
        "Check condenser fan speed",
        "Clear debris around outdoor unit",
      ],
    };
  }
  if (
    suction !== null &&
    superheat !== null &&
    suction < 60 &&
    superheat > 15
  ) {
    return {
      title: "Low Suction / Restriction",
      insight:
        "Low suction + high superheat. Possible restriction or low airflow.",
      actions: [
        "Replace air filter",
        "Check TXV or metering device",
        "Inspect evaporator coil for ice",
      ],
    };
  }
  if (
    suction !== null &&
    superheat !== null &&
    suction < 60 &&
    superheat <= 15
  ) {
    return {
      title: "Low Suction / Possible Overcharge",
      insight:
        "Low suction with normal superheat. Could be overcharged or flooded.",
      actions: ["Verify refrigerant charge", "Check metering device operation"],
    };
  }
  return null;
}

export function parseMeasurementsText(text: string): {
  suction: number | null;
  head: number | null;
  superheat: number | null;
  subcooling: number | null;
} {
  const lower = text.toLowerCase();
  const extract = (patterns: string[]) => {
    for (const p of patterns) {
      const m = lower.match(new RegExp(`${p}[:\s]+([\d.]+)`));
      if (m) return Number.parseFloat(m[1]);
    }
    return null;
  };
  return {
    suction: extract(["suction", "suct", "low side"]),
    head: extract(["head", "high side", "discharge"]),
    superheat: extract(["superheat", "sh"]),
    subcooling: extract(["subcooling", "sc", "sub"]),
  };
}
