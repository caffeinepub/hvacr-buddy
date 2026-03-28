// ─── HVAC Component Identification Logic ─────────────────────────────────────

export interface ComponentIdentification {
  id: string;
  name: string;
  keywords: string[];
  whatItIs: string;
  whatItLooksLike: string;
  whereFound: string;
  imageKey?: string; // matches tool/part image if available
}

export const COMPONENT_IDENTIFICATIONS: ComponentIdentification[] = [
  {
    id: "capacitor",
    name: "Capacitor",
    keywords: ["capacitor", "run capacitor", "start capacitor", "dual run cap"],
    whatItIs:
      "A capacitor is an electrical component that stores and releases energy to help motors start and run efficiently. Most HVAC systems use a dual-run capacitor that supports both the compressor and fan motor simultaneously.",
    whatItLooksLike:
      "It's a cylindrical or oval-shaped metal or plastic canister, typically silver, black, or blue. It has metal terminals on top labeled HERM (for the compressor), FAN (for the fan motor), and C (common). Sizes range from a small soda can to a large coffee thermos. A failed capacitor often looks bulged or swollen on top.",
    whereFound:
      "Located inside the outdoor condenser unit. Open the side access panel — the capacitor is usually mounted near the contactor, attached to a bracket on the side wall of the cabinet.",
    imageKey: "capacitor",
  },
  {
    id: "contactor",
    name: "Contactor",
    keywords: ["contactor", "ac contactor", "hvac contactor"],
    whatItIs:
      "A contactor is an electrically operated switch that controls power to the compressor and outdoor fan motor. When the thermostat calls for cooling, it sends 24V to the contactor coil, which pulls in the contacts and allows 240V line power to flow through.",
    whatItLooksLike:
      "It's a small rectangular electrical switch, about the size of a deck of cards. It has large screw terminals on the top (line side, L1/L2) and bottom (load side, T1/T2) for the high-voltage wires, and two smaller terminals on the side or bottom for the 24V control wires. The center has a visible plunger that pulls in when energized.",
    whereFound:
      "Located inside the outdoor condenser unit, typically in the lower corner near the electrical connections. Remove the side access panel and look for the component with heavy wires running to it.",
    imageKey: "contactor",
  },
  {
    id: "evaporator_coil",
    name: "Evaporator Coil",
    keywords: [
      "evaporator coil",
      "evaporator",
      "indoor coil",
      "a coil",
      "a-coil",
    ],
    whatItIs:
      "The evaporator coil is the indoor heat exchanger in your HVAC system. Refrigerant flows through it at low pressure and temperature, absorbing heat from the air blowing across it. This is what actually cools your home.",
    whatItLooksLike:
      "It looks like a triangular or A-shaped set of aluminum fins with copper tubes running through them. The fins are very thin and closely spaced — similar to a car radiator but shaped like an upside-down V. It sits inside a metal housing (the coil cabinet) and connects to the refrigerant lines.",
    whereFound:
      "Located in the air handler or furnace cabinet, directly above the blower motor. It sits in the supply air path so all the air passes through it before reaching the ducts.",
    imageKey: "evaporator_coil",
  },
  {
    id: "compressor",
    name: "Compressor",
    keywords: ["compressor", "ac compressor", "hvac compressor"],
    whatItIs:
      "The compressor is the heart of the refrigeration system. It pumps refrigerant through the system by compressing low-pressure refrigerant vapor into high-pressure vapor, which then flows to the condenser coil to release heat outside.",
    whatItLooksLike:
      "It's a large black or gray cylindrical or dome-shaped metal component — about the size of a small fire extinguisher to a 5-gallon bucket, depending on the system size. It has refrigerant line connections on top (suction line, larger diameter; discharge line, smaller diameter) and electrical terminals under a cover cap.",
    whereFound:
      "Located inside the outdoor condenser unit, sitting in the lower section of the cabinet. It's the largest single component inside the outdoor unit.",
    imageKey: "compressor",
  },
  {
    id: "thermostat",
    name: "Thermostat",
    keywords: ["thermostat", "tstat", "t-stat", "wall thermostat"],
    whatItIs:
      "The thermostat is the control interface for the HVAC system. It monitors indoor temperature and sends signals to the system to heat or cool as needed. Modern smart thermostats can be programmed, controlled remotely, and track energy usage.",
    whatItLooksLike:
      "It's a flat rectangular or square device mounted on the interior wall, typically in a central hallway or living area. It has a display screen (digital on modern units), a few buttons or a touchscreen, and a backplate that connects to low-voltage control wires (usually 18 AWG). Common colors are white, gray, or black.",
    whereFound:
      "Mounted on an interior wall, usually in a central location of the home — hallway, living room, or stairwell. Avoid exterior walls and locations near heat sources, which can cause false readings.",
  },
  {
    id: "air_filter",
    name: "Air Filter",
    keywords: ["air filter", "filter", "furnace filter", "ac filter"],
    whatItIs:
      "The air filter traps dust, pollen, pet dander, and debris before the air enters the blower and passes over the evaporator coil. It protects the system's internal components and improves indoor air quality.",
    whatItLooksLike:
      "A flat rectangular frame (cardboard or plastic) filled with a pleated or fiberglass filtering media. The size is printed on the frame — e.g., 16x25x1 or 20x25x4. Pleated filters have a zig-zag pattern and are typically white or off-white when new, turning gray as they collect debris.",
    whereFound:
      "Either at the return air grille on the wall or ceiling, or at the air handler/furnace cabinet where the return duct connects. There's usually only one filter per system, but some larger systems have two.",
    imageKey: "air_filter",
  },
  {
    id: "multimeter",
    name: "Multimeter",
    keywords: ["multimeter", "volt meter", "voltmeter", "meter"],
    whatItIs:
      "A multimeter is a diagnostic tool that measures voltage, resistance, continuity, and capacitance. It's the most important diagnostic instrument for an HVAC technician — used to check electrical components, verify power, and test parts without guessing.",
    whatItLooksLike:
      "A handheld rectangular device with a digital display, a large rotary dial in the center for selecting measurement modes, and two probe ports at the bottom. It comes with a red probe (positive) and black probe (negative/common). Most HVAC meters are yellow or bright-colored for visibility.",
    whereFound:
      "In the technician's tool bag. Not a system component — it's a test instrument brought to the job site.",
    imageKey: "multimeter",
  },
  {
    id: "manifold_gauge",
    name: "Manifold Gauge Set",
    keywords: [
      "manifold gauge",
      "manifold gauges",
      "gauge set",
      "refrigerant gauges",
      "gauges",
    ],
    whatItIs:
      "A manifold gauge set measures refrigerant pressure on both the high side and low side of the system. Technicians use it to diagnose refrigerant charge issues, check for restrictions, and charge or recover refrigerant.",
    whatItLooksLike:
      "A set of two or three large pressure gauges (blue for low side, red for high side) connected to a manifold block in the center. Three colored hoses extend from the manifold — blue (low side), red (high side), and yellow (utility/center). Gauges have scales for multiple refrigerant types around the dial.",
    whereFound:
      "In the technician's tool bag. Connected to the system's service ports (Schrader valves) on the suction and liquid lines during diagnostics.",
    imageKey: "manifold_gauge_set",
  },
  {
    id: "reversing_valve",
    name: "Reversing Valve",
    keywords: [
      "reversing valve",
      "reverse valve",
      "4-way valve",
      "four way valve",
    ],
    whatItIs:
      "A reversing valve is a component found only in heat pumps. It reverses the direction of refrigerant flow to switch the system between heating and cooling modes. In heating mode, it redirects the refrigerant so the outdoor coil acts as the evaporator and the indoor coil acts as the condenser.",
    whatItLooksLike:
      "A cylindrical brass or copper valve, about 6–8 inches long, with four refrigerant line connections — one on each end and two on the side. It has a small solenoid coil (an electromagnet) mounted on top that shifts an internal slide to change refrigerant direction. The body is usually gold or copper-colored.",
    whereFound:
      "Located on the outdoor unit of a heat pump system, connected directly to the refrigerant lines near the compressor.",
  },
  {
    id: "txv",
    name: "TXV (Thermostatic Expansion Valve)",
    keywords: [
      "txv",
      "expansion valve",
      "thermostatic expansion valve",
      "metering device",
    ],
    whatItIs:
      "The TXV (Thermostatic Expansion Valve) is the metering device that controls how much refrigerant enters the evaporator coil. It maintains the correct superheat by opening and closing in response to temperature and pressure at the evaporator outlet.",
    whatItLooksLike:
      "A small brass or copper valve, roughly the size of a large thumb, with refrigerant line connections on two ends (inlet and outlet) and a thin capillary tube that runs to a sensing bulb. The sensing bulb is a small copper bulb clamped to the suction line near the coil outlet. Some TXVs also have an external equalizer port.",
    whereFound:
      "Located at the inlet of the evaporator coil, usually inside the air handler cabinet. The sensing bulb is clamped to the suction line just after the coil outlet.",
  },
  {
    id: "blower_motor",
    name: "Blower Motor",
    keywords: [
      "blower motor",
      "blower",
      "indoor fan motor",
      "air handler motor",
    ],
    whatItIs:
      "The blower motor drives the squirrel-cage blower wheel inside the air handler or furnace. It circulates indoor air across the evaporator coil (for cooling) or heat exchanger (for heating) and pushes conditioned air into the duct system.",
    whatItLooksLike:
      "A cylindrical electric motor, typically 4–8 inches in diameter, mounted inside the air handler cabinet. The motor shaft connects directly to a squirrel-cage blower wheel — a cylindrical drum with many small curved blades. Most are single-speed or multi-speed, and newer systems use variable-speed ECM motors that are narrower and more efficient.",
    whereFound:
      "Located in the lower section of the air handler or furnace cabinet, below the evaporator coil. The motor is mounted in a housing that holds the blower wheel.",
  },
  {
    id: "condenser_fan_motor",
    name: "Condenser Fan Motor",
    keywords: [
      "condenser fan",
      "outdoor fan",
      "condenser fan motor",
      "fan motor",
    ],
    whatItIs:
      "The condenser fan motor drives the propeller fan blade on top of the outdoor unit. It pulls air through the condenser coil to dissipate heat, allowing the refrigerant to condense from a hot vapor into a liquid.",
    whatItLooksLike:
      "A round electric motor, about 3–5 inches in diameter, mounted in the top of the outdoor unit beneath the fan grille. It has a vertical shaft that the propeller fan blade mounts to. The motor body is gray or black with a few electrical wire leads coming out of the side.",
    whereFound:
      "Mounted in the top center of the outdoor condenser unit, directly below the fan grille. The fan blades sit on the motor shaft and push air upward and out of the unit.",
  },
];

// ─── Identification Intent Detection ─────────────────────────────────────────

const IDENTIFICATION_PHRASES = [
  "what is a",
  "what is an",
  "what's a",
  "what's an",
  "whats a",
  "whats an",
  "what does a",
  "what does an",
  "what does the",
  "what does it look like",
  "what does a",
  "where is a",
  "where is the",
  "where is an",
  "where is",
  "what does",
  "describe a",
  "describe the",
  "identify a",
  "identify the",
  "tell me about a",
  "tell me about the",
  "explain a",
  "explain the",
  "what do",
  "show me",
];

export function detectIdentificationQuery(
  input: string,
): ComponentIdentification | null {
  const lower = input.toLowerCase().trim();

  const hasIntent = IDENTIFICATION_PHRASES.some((phrase) =>
    lower.includes(phrase),
  );

  if (!hasIntent) return null;

  for (const component of COMPONENT_IDENTIFICATIONS) {
    for (const keyword of component.keywords) {
      if (lower.includes(keyword)) {
        return component;
      }
    }
  }

  return null;
}
