// ─── Tools & Parts Client-Side Reference Database ───────────────────────────
// Mirrors the seeded tools[] and parts[] backend collections so Buddy can
// look up full guidance data entirely on the frontend — no async call needed.

export type SafetyCategory =
  | "electrical"
  | "refrigerant"
  | "pressure"
  | "mechanical"
  | null;

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
    category: "Installation Tools",
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

  // ─── Hand Tools ────────────────────────────────────────────────────────────
  {
    name: "Adjustable Wrench",
    category: "Hand Tools",
    usedFor: ["tightening fittings", "loosening nuts", "pipe connections"],
    explanation:
      "An adjustable wrench grips flat-sided nuts and bolts so you can tighten or loosen threaded connections without a dedicated socket.",
    whenToUse: "When tightening or loosening threaded connections and fittings",
    steps: [
      "Select appropriate jaw opening for the fastener size.",
      "Engage the jaw fully on the flat sides of the nut or bolt.",
      "Turn clockwise to tighten, counterclockwise to loosen.",
      "Avoid over-tightening — snug plus a quarter turn is usually sufficient.",
    ],
    safety: "mechanical",
    aliases: ["adjustable wrench", "crescent wrench"],
  },
  {
    name: "Pipe Wrench",
    category: "Hand Tools",
    usedFor: [
      "gripping pipes",
      "tightening pipe fittings",
      "removing corroded fittings",
    ],
    explanation:
      "A pipe wrench grips round pipe and corroded fittings with serrated jaws so you can apply high torque to threaded pipe connections.",
    whenToUse: "When working with round or corroded pipe fittings",
    steps: [
      "Adjust the jaw to fit snugly around the pipe.",
      "Apply force in the direction the upper jaw is facing.",
      "Use two wrenches for opposing force — one to hold, one to turn.",
      "Protect finish surfaces with tape or cloth if needed.",
    ],
    safety: "mechanical",
    aliases: ["pipe wrench", "pipe-wrench"],
  },
  {
    name: "Screwdrivers",
    category: "Hand Tools",
    usedFor: [
      "removing access panels",
      "securing terminal screws",
      "fastening covers",
    ],
    explanation:
      "Screwdrivers drive and remove fasteners on HVAC panels, covers, and terminal blocks — flathead and Phillips are the two most common types in the field.",
    whenToUse:
      "When removing or securing screws on panels, covers, and terminal blocks",
    steps: [
      "Match the driver tip to the screw head (flathead or Phillips).",
      "Press firmly into the screw head before turning to avoid cam-out.",
      "Turn clockwise to tighten, counterclockwise to remove.",
      "Use a magnetic tip to avoid dropping screws inside the unit.",
    ],
    safety: null,
    aliases: [
      "screwdriver",
      "flathead",
      "phillips",
      "screwdrivers",
      "flat head",
      "phillips head",
    ],
  },
  {
    name: "Nut Drivers",
    category: "Hand Tools",
    usedFor: [
      "removing hex-head screws",
      "accessing panels",
      "electrical terminal work",
    ],
    explanation:
      "Nut drivers speed up removal of hex-head sheet metal screws on HVAC panels — much faster than a standard screwdriver for panel access.",
    whenToUse:
      "When removing or installing hex-head sheet metal screws on HVAC panels",
    steps: [
      'Select the correct nut driver size (typically 1/4" or 5/16" for HVAC panels).',
      "Press firmly onto the hex screw head.",
      "Turn counterclockwise to remove, clockwise to install.",
      "Use a T-handle or ratcheting nut driver to speed up panel removal.",
    ],
    safety: null,
    aliases: ["nut driver", "nut drivers"],
  },
  {
    name: "Pliers",
    category: "Hand Tools",
    usedFor: ["gripping components", "bending wire", "holding tubing"],
    explanation:
      "Pliers grip, bend, and manipulate small components — needle nose works in tight spaces, channel locks handle larger fittings.",
    whenToUse: "When gripping, bending, or manipulating small parts or wire",
    steps: [
      "Select needle nose for tight spaces, channel locks for larger grips.",
      "Position the jaws fully on the object before squeezing.",
      "Use channel locks on fittings — open to the correct jaw size first.",
      "Avoid using pliers on soft brass fittings — use a proper wrench instead.",
    ],
    safety: "mechanical",
    aliases: [
      "pliers",
      "needle nose",
      "needle nose pliers",
      "channel locks",
      "channellock",
    ],
  },
  {
    name: "Tubing Cutter",
    category: "Hand Tools",
    usedFor: ["cutting copper tubing", "cutting refrigerant lines"],
    explanation:
      "A tubing cutter makes clean, square cuts on copper line sets without crimping or deforming the tube wall.",
    whenToUse: "When cutting copper line set or refrigerant tubing to length",
    steps: [
      "Measure and mark the cut point on the tubing.",
      "Clamp the cutter wheel onto the mark — wheel on top of the tube.",
      "Rotate the cutter around the tube one full turn.",
      "Tighten the feed knob a quarter turn, then rotate again.",
      "Repeat until the tube is cut through cleanly.",
    ],
    safety: "mechanical",
    aliases: ["tubing cutter", "tube cutter", "copper cutter"],
  },
  {
    name: "Deburring Tool",
    category: "Hand Tools",
    usedFor: ["deburring cut tubing", "removing sharp edges from copper"],
    explanation:
      "A deburring tool removes the inner burr left after cutting copper tubing so the end is smooth and ready for flaring or brazing.",
    whenToUse:
      "Immediately after cutting copper tubing, before flaring or brazing",
    steps: [
      "Insert the reamer blade into the cut end of the tubing.",
      "Rotate clockwise with gentle inward pressure.",
      "Continue until the inner edge is smooth with no sharp burrs.",
      "Wipe away any copper shavings before proceeding.",
    ],
    safety: "mechanical",
    aliases: ["deburring tool", "deburring", "reamer", "deburrer"],
  },

  // ─── Power Tools ───────────────────────────────────────────────────────────
  {
    name: "Cordless Drill",
    category: "Power Tools",
    usedFor: [
      "drilling mounting holes",
      "driving screws",
      "installing equipment",
    ],
    explanation:
      "A cordless drill bores mounting holes and drives fasteners when installing HVAC equipment and routing line sets.",
    whenToUse:
      "When mounting equipment, drilling holes for line sets, or driving fasteners",
    steps: [
      "Select the correct bit — drill bit for holes, driver bit for screws.",
      "Set the torque clutch to appropriate setting to avoid stripping.",
      "Squeeze the trigger gently for control at the start.",
      "Keep the drill perpendicular to the work surface.",
    ],
    safety: "mechanical",
    aliases: ["cordless drill", "drill"],
  },
  {
    name: "Impact Driver",
    category: "Power Tools",
    usedFor: [
      "driving long screws",
      "fastening lag bolts",
      "high-torque fastening",
    ],
    explanation:
      "An impact driver delivers high rotational torque in short bursts to drive long or heavy fasteners that a regular drill would struggle with.",
    whenToUse: "When driving long or heavy fasteners into mounting surfaces",
    steps: [
      "Insert the correct impact-rated driver bit.",
      "Position the bit fully in the fastener head.",
      "Squeeze the trigger — the impact mechanism fires automatically under load.",
      "Release before the fastener bottoms out to avoid over-driving.",
    ],
    safety: "mechanical",
    aliases: ["impact driver", "impact"],
  },
  {
    name: "Reciprocating Saw (Sawzall)",
    category: "Power Tools",
    usedFor: [
      "cutting ductwork",
      "demolition",
      "cutting through walls for line sets",
    ],
    explanation:
      "A reciprocating saw makes fast cuts through ductwork, walls, and old equipment during removal and installation.",
    whenToUse:
      "When cutting ductwork, penetrating walls, or removing old equipment",
    steps: [
      "Select the correct blade — metal blade for duct, demo blade for walls.",
      "Keep the shoe plate pressed firmly against the work surface.",
      "Let the blade do the work — don't force it.",
      "Keep clear of hidden wires and pipes before cutting.",
    ],
    safety: "mechanical",
    aliases: ["sawzall", "reciprocating saw", "recip saw"],
  },

  // ─── Installation Tools ───────────────────────────────────────────────────
  {
    name: "Flaring Tool",
    category: "Installation Tools",
    usedFor: ["creating flare fittings", "flaring copper tubing"],
    explanation:
      "A flaring tool forms a precise bell-shaped flare on the end of copper tubing so it seals correctly against a flare fitting without soldering.",
    whenToUse: "When making flare connections on refrigerant line sets",
    steps: [
      "Cut and deburr the tubing end first.",
      "Slide the flare nut onto the tubing before flaring.",
      'Insert the tubing into the flaring block at the correct depth (about 1/8" above the block).',
      "Tighten the yoke to press the cone into the tubing and form the flare.",
      "Inspect the flare for cracks or uneven edges before connecting.",
    ],
    safety: "mechanical",
    aliases: ["flaring tool", "flare tool"],
  },
  {
    name: "Swaging Tool",
    category: "Installation Tools",
    usedFor: [
      "swaging copper tubing",
      "making swaged connections without fittings",
    ],
    explanation:
      "A swaging tool expands one tube end so it fits over a mating tube for a brazed connection — no coupling fitting required.",
    whenToUse:
      "When connecting two tubes of the same size without a coupling fitting",
    steps: [
      "Deburr and clean both tube ends.",
      "Insert the swaging punch into the tube end to the correct depth.",
      "Strike the punch with a hammer or use a ratchet-style swager.",
      "Check the swaged end fits snugly over the mating tube.",
      "Braze the joint after fitting.",
    ],
    safety: "mechanical",
    aliases: ["swaging tool", "swage tool"],
  },
  {
    name: "Torque Wrench",
    category: "Installation Tools",
    usedFor: ["torquing flare fittings", "tightening to spec"],
    explanation:
      "A torque wrench tightens refrigerant flare fittings to the exact manufacturer torque specification so they seal without cracking the flare.",
    whenToUse:
      "When tightening refrigerant flare fittings to manufacturer torque specifications",
    steps: [
      "Set the desired torque value on the wrench handle.",
      "Attach the correct socket or open-end adapter.",
      "Apply force smoothly — the wrench will click when the set torque is reached.",
      "Stop immediately when you hear the click — do not continue tightening.",
    ],
    safety: "mechanical",
    aliases: ["torque wrench", "torque"],
  },

  // ─── Electrical Support ───────────────────────────────────────────────────
  {
    name: "Wire Strippers",
    category: "Electrical",
    usedFor: ["stripping wire insulation", "preparing wire ends for terminals"],
    explanation:
      "Wire strippers remove insulation from wire ends cleanly so control wiring can be connected to terminals without nicked conductors.",
    whenToUse:
      "When connecting control wiring or replacing electrical connections",
    steps: [
      "Match the wire gauge to the stripper notch (usually 18–22 AWG for control wiring).",
      "Insert the wire into the correct gauge notch.",
      "Squeeze firmly and pull toward the wire end in one smooth motion.",
      "Confirm a clean strip — no nicks or cut strands.",
    ],
    safety: "electrical",
    aliases: ["wire strippers", "wire stripper"],
  },
  {
    name: "Crimpers",
    category: "Electrical",
    usedFor: ["crimping wire connectors", "securing terminals"],
    explanation:
      "Crimpers compress wire connectors and terminals onto stripped wire ends for a secure, vibration-resistant electrical connection.",
    whenToUse: "When joining wires or attaching ring/spade terminals",
    steps: [
      "Select the correct connector for the wire gauge.",
      "Insert the stripped wire end fully into the connector barrel.",
      "Position the connector in the correct groove of the crimper.",
      "Squeeze firmly in one motion — the connector should not spin or pull off the wire.",
    ],
    safety: "electrical",
    aliases: ["crimpers", "crimping tool", "wire crimper"],
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
  "adjustable wrench",
  "tubing cutter",
  "flaring tool",
  "torque wrench",
  "wire strippers",
  "crimpers",
  "screwdrivers",
  "nut drivers",
  "cordless drill",
  "impact driver",
  "reciprocating saw (sawzall)",
  "pipe wrench",
  "pliers",
  "deburring tool",
  "swaging tool",
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
