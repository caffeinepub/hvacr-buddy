// ─── HVAC Component Identification Logic ─────────────────────────────────────

export interface ComponentIdentification {
  id: string;
  name: string;
  category: string;
  associatedSystem: string;
  keywords: string[];
  definition: string; // simple 1-2 sentence definition
  whatItLooksLike: string; // clear visual description
  whereFound: string; // location in the system
  whatItDoes: string; // function / role
  // Only set when a verified image file exists. Never guess.
  imageKey?: string;
  // legacy compat
  whatItIs?: string;
}

export const COMPONENT_IDENTIFICATIONS: ComponentIdentification[] = [
  // ─ verified image: part-capacitor.dim_400x400.png ─
  {
    id: "capacitor",
    name: "Capacitor",
    category: "Electrical",
    associatedSystem: "Outdoor",
    keywords: ["capacitor", "run capacitor", "start capacitor", "dual run cap"],
    definition:
      "A capacitor is an electrical energy-storage device that helps motors start and run efficiently. Most HVAC systems use a dual-run capacitor that supports both the compressor and the condenser fan motor.",
    whatItLooksLike:
      "A cylindrical or oval metal/plastic canister, typically silver, black, or blue — ranging from soda-can to thermos size. The top has metal terminals labeled HERM (compressor), FAN, and C (common). A bad capacitor often looks bulged or swollen on top.",
    whereFound:
      "Inside the outdoor condenser unit. Open the side access panel — the capacitor is mounted near the contactor on a bracket along the side wall of the cabinet.",
    whatItDoes:
      "Provides the starting boost and running support current that motors need. Without it, the compressor or fan motor will hum, struggle to start, or not run at all.",
    imageKey: "capacitor",
  },
  // ─ verified image: part-contactor.dim_400x400.png ─
  {
    id: "contactor",
    name: "Contactor",
    category: "Electrical",
    associatedSystem: "Outdoor",
    keywords: ["contactor", "ac contactor", "hvac contactor"],
    definition:
      "A contactor is an electrically operated high-voltage switch that controls power to the compressor and outdoor fan motor. When the thermostat calls for cooling, 24V closes the contactor and allows 240V to flow.",
    whatItLooksLike:
      "A small rectangular switch about the size of a deck of cards. Large screw terminals on top (L1/L2 line side) and bottom (T1/T2 load side) carry the high-voltage wires. Two smaller terminals accept the 24V control wires. A visible plunger in the center pulls in when energized.",
    whereFound:
      "Inside the outdoor condenser unit, typically in the lower corner near the electrical entry point. Remove the side access panel and look for the component with the heaviest wires.",
    whatItDoes:
      "Acts as the main power switch for the outdoor unit, opening and closing under thermostat command to start and stop the compressor and condenser fan motor.",
    imageKey: "contactor",
  },
  // ─ no verified image for transformer ─
  {
    id: "transformer",
    name: "Transformer",
    category: "Electrical",
    associatedSystem: "Indoor",
    keywords: ["transformer", "control transformer", "24v transformer"],
    definition:
      "A transformer steps down 120V or 240V line voltage to the 24V signal used by the thermostat and all control circuits. It is the power source for the entire low-voltage control system.",
    whatItLooksLike:
      "A small rectangular or square block, usually black or gray, about the size of a large ice cube. It has two sets of wire leads — the primary side (high-voltage input) and the secondary side (24V output). A VA rating is printed on the label (common sizes: 40VA, 75VA).",
    whereFound:
      "Mounted inside the air handler or furnace cabinet, usually on the control board bracket or near the blower compartment.",
    whatItDoes:
      "Converts line voltage down to 24V AC to power the thermostat, contactor coil, control board, and all low-voltage components. If it fails, nothing in the control system will function.",
    imageKey: "transformer",
  },
  // ─ verified image: part-thermostat.dim_400x400.png ─
  {
    id: "thermostat",
    name: "Thermostat",
    category: "Electrical",
    associatedSystem: "Indoor",
    keywords: ["thermostat", "tstat", "t-stat", "wall thermostat"],
    definition:
      "The thermostat is the control center for the HVAC system. It monitors indoor temperature and sends low-voltage signals to start or stop heating and cooling.",
    whatItLooksLike:
      "A flat rectangular or square device mounted on an interior wall, typically white, gray, or black. Modern units have a digital display and touchscreen; older units use a rotary dial. A backplate behind it connects to thin 18 AWG low-voltage wires.",
    whereFound:
      "Mounted on an interior wall in a central location — hallway, living room, or stairwell. Should not be on an exterior wall or near heat sources.",
    whatItDoes:
      "Reads indoor temperature, compares it to the setpoint, and sends on/off signals to the heating and cooling equipment. It is the user's only interface for controlling the system.",
    imageKey: "thermostat",
  },
  // ─ verified image: part-evaporator-coil.dim_400x400.png ─
  {
    id: "evaporator_coil",
    name: "Evaporator Coil",
    category: "Refrigerant",
    associatedSystem: "Indoor",
    keywords: [
      "evaporator coil",
      "evaporator",
      "indoor coil",
      "a coil",
      "a-coil",
    ],
    definition:
      "The evaporator coil is the indoor heat exchanger where refrigerant absorbs heat from the air inside your home. It is what actually cools the circulated air.",
    whatItLooksLike:
      "A triangular or A-shaped assembly of thin aluminum fins with copper tubes running through them — similar to a car radiator shaped like an upside-down V. It sits inside a metal housing connected to the refrigerant lines.",
    whereFound:
      "In the air handler or furnace cabinet, directly above the blower motor. All indoor air passes through it before reaching the supply ducts.",
    whatItDoes:
      "Refrigerant enters at low pressure and temperature, absorbing heat from warm indoor air blown across the fins. This cools the air and evaporates the refrigerant into a vapor before it heads to the compressor.",
    imageKey: "evaporator_coil",
  },
  // ─ verified image: component-condenser-coil-transparent.dim_400x300.png ─
  {
    id: "condenser_coil",
    name: "Condenser Coil",
    category: "Refrigerant",
    associatedSystem: "Outdoor",
    keywords: ["condenser coil", "outdoor coil", "condenser"],
    definition:
      "The condenser coil is the outdoor heat exchanger where refrigerant releases the heat it absorbed indoors. It is the outdoor counterpart to the evaporator coil.",
    whatItLooksLike:
      "A large grid of thin aluminum fins with copper tubes, wrapped around three or four sides of the outdoor unit cabinet. The closely spaced fins resemble a car radiator. The surface area is much larger than the evaporator coil.",
    whereFound:
      "Wrapped around the outside walls of the outdoor condenser unit. The fin surface is visible from outside the cabinet without removing any panels.",
    whatItDoes:
      "Hot high-pressure refrigerant vapor from the compressor flows through the coil. The condenser fan pulls outdoor air across the fins, removing heat and causing the refrigerant to condense into liquid so it can return indoors to absorb more heat.",
    imageKey: "condenser_coil",
  },
  // ─ verified image: part-compressor.dim_400x400.png ─
  {
    id: "compressor",
    name: "Compressor",
    category: "Refrigerant",
    associatedSystem: "Outdoor",
    keywords: ["compressor", "ac compressor", "hvac compressor"],
    definition:
      "The compressor is the heart of the refrigeration system. It pressurizes the refrigerant vapor so the system can move heat from indoors to outdoors.",
    whatItLooksLike:
      "A large black or gray dome-shaped or cylindrical metal component — about the size of a small fire extinguisher up to a 5-gallon bucket. It has a large suction line and a smaller discharge line on top, plus an electrical terminal block under a cover cap.",
    whereFound:
      "Inside the outdoor condenser unit, sitting in the lower section of the cabinet. It is the largest single component inside the outdoor unit.",
    whatItDoes:
      "Compresses low-pressure refrigerant vapor from the evaporator into high-pressure, high-temperature vapor and pumps it to the condenser coil. This compression is what drives the entire heat transfer cycle.",
    imageKey: "compressor",
  },
  // ─ no verified image for TXV ─
  {
    id: "txv",
    name: "TXV (Thermostatic Expansion Valve)",
    category: "Refrigerant",
    associatedSystem: "Indoor",
    keywords: [
      "txv",
      "expansion valve",
      "thermostatic expansion valve",
      "metering device",
    ],
    definition:
      "The TXV (Thermostatic Expansion Valve) is the metering device that precisely controls how much liquid refrigerant enters the evaporator coil, balancing the refrigerant charge to the system load.",
    whatItLooksLike:
      "A small brass or copper valve roughly the size of a large thumb, with refrigerant fittings on two ends (inlet and outlet) and a thin capillary tube running to a sensing bulb — a small copper bulb clamped tightly to the suction line just after the coil outlet, usually wrapped in foam insulation.",
    whereFound:
      "At the inlet of the evaporator coil, inside the air handler cabinet. The sensing bulb is clamped to the suction line just past the coil outlet.",
    whatItDoes:
      "Acts as a variable throttle that restricts refrigerant flow to match the cooling load. It reads suction line temperature via the sensing bulb and opens or closes to maintain correct superheat, protecting the compressor from liquid refrigerant.",
    imageKey: "txv",
  },
  // ─ no verified image for reversing valve ─
  {
    id: "reversing_valve",
    name: "Reversing Valve",
    category: "Refrigerant",
    associatedSystem: "Outdoor",
    keywords: [
      "reversing valve",
      "reverse valve",
      "4-way valve",
      "four way valve",
    ],
    definition:
      "A reversing valve is found only in heat pumps. It switches the direction of refrigerant flow so the system can operate in both heating and cooling modes.",
    whatItLooksLike:
      "A cylindrical brass or copper valve, about 6–8 inches long, with four refrigerant line connections — one on each end and two on the side. A small solenoid coil (electromagnet) is mounted on top that shifts an internal slide to reverse the flow direction. The body is typically gold or copper-colored.",
    whereFound:
      "On the outdoor unit of a heat pump system, connected directly to the refrigerant lines near the compressor.",
    whatItDoes:
      "Redirects refrigerant flow between heating and cooling modes. In heating mode, refrigerant flows in reverse — the outdoor coil becomes the evaporator and the indoor coil becomes the condenser, extracting heat from outdoor air and releasing it indoors.",
    imageKey: "reversing_valve",
  },
  // ─ no verified image for filter drier ─
  {
    id: "filter_drier",
    name: "Filter Drier",
    category: "Refrigerant",
    associatedSystem: "Outdoor",
    keywords: [
      "filter drier",
      "filter dryer",
      "drier",
      "dryer",
      "liquid line drier",
    ],
    definition:
      "A filter drier removes moisture, acid, and contaminants from the refrigerant before it reaches the metering device, protecting the system from internal corrosion and ice blockages.",
    whatItLooksLike:
      "A small cylindrical metal canister, typically 3–6 inches long and 1–2 inches in diameter, copper or silver in color, with flare or sweat fittings on each end. An arrow on the body shows the required refrigerant flow direction.",
    whereFound:
      "In-line on the liquid (smaller) refrigerant line, usually near the outdoor unit or at the service valve. Always installed on the high-pressure liquid side before the expansion device.",
    whatItDoes:
      "Acts as the system's internal filter. The desiccant core absorbs moisture that causes acid and freeze-ups, while the screen catches debris. Always replaced after a compressor burnout or any time the system is opened.",
    imageKey: "filter_drier",
  },
  // ─ no verified image for accumulator ─
  {
    id: "accumulator",
    name: "Accumulator",
    category: "Refrigerant",
    associatedSystem: "Outdoor",
    keywords: ["accumulator", "suction accumulator"],
    definition:
      "An accumulator is a safety device on the suction line that catches any liquid refrigerant before it can reach the compressor. Liquid entering a compressor causes catastrophic damage.",
    whatItLooksLike:
      "An upright cylindrical metal tank, typically 6–12 inches tall and 3–5 inches in diameter, installed in-line on the large suction refrigerant line. It looks like a small boiler or propane canister with a steel or gray finish.",
    whereFound:
      "On the suction line between the evaporator coil and the compressor, usually mounted near the outdoor unit. Common on heat pumps and systems prone to liquid floodback.",
    whatItDoes:
      "Any liquid refrigerant entering the accumulator settles to the bottom while only vapor is drawn off through the outlet tube to the compressor. This prevents liquid slugging — one of the most common causes of compressor failure.",
    imageKey: "accumulator",
  },
  // ─ no verified image for blower motor ─
  {
    id: "blower_motor",
    name: "Blower Motor",
    category: "Airflow",
    associatedSystem: "Indoor",
    keywords: [
      "blower motor",
      "blower",
      "indoor fan motor",
      "air handler motor",
    ],
    definition:
      "The blower motor drives the squirrel-cage fan wheel inside the air handler or furnace that circulates air throughout the home.",
    whatItLooksLike:
      "A cylindrical electric motor, typically 4–8 inches in diameter, mounted inside the air handler cabinet. The shaft connects to a squirrel-cage blower wheel — a cylindrical drum with many curved blades that resembles a hamster wheel. ECM variable-speed motors are slimmer and more modern.",
    whereFound:
      "In the lower section of the air handler or furnace cabinet, below the evaporator coil, inside the blower housing assembly.",
    whatItDoes:
      "Pulls return air from the home, forces it across the evaporator coil or heat exchanger, and pushes conditioned air into the supply ducts. Without it, no air moves through the system.",
    imageKey: "blower_motor",
  },
  // ─ no verified image for condenser fan motor ─
  {
    id: "condenser_fan_motor",
    name: "Condenser Fan Motor",
    category: "Airflow",
    associatedSystem: "Outdoor",
    keywords: [
      "condenser fan",
      "outdoor fan",
      "condenser fan motor",
      "fan motor",
    ],
    definition:
      "The condenser fan motor drives the propeller fan blade on top of the outdoor unit to pull air through the condenser coil and dissipate heat.",
    whatItLooksLike:
      "A round electric motor, about 3–5 inches in diameter, mounted in the top-center of the outdoor unit beneath the fan grille. It has a vertical shaft for the propeller blade and several wire leads from the side. The body is typically gray or black.",
    whereFound:
      "Mounted in the top of the outdoor condenser unit, directly below the fan grille. The propeller sits on the motor shaft and pushes air upward out of the unit.",
    whatItDoes:
      "Keeps the condenser coil cool by pulling outdoor air across its fins. Without airflow, head pressure climbs and the system trips on high-pressure lockout.",
    imageKey: "condenser_fan_motor",
  },
  // ─ no verified image for pressure switch ─
  {
    id: "pressure_switch",
    name: "Pressure Switch",
    category: "Electrical",
    associatedSystem: "Outdoor",
    keywords: [
      "pressure switch",
      "high pressure switch",
      "low pressure switch",
      "hp switch",
      "lp switch",
    ],
    definition:
      "A pressure switch is a safety device that monitors refrigerant pressure and shuts the system down if pressure goes too high or too low. Most systems have both a high-pressure and a low-pressure switch.",
    whatItLooksLike:
      "A small cylindrical or disc-shaped electrical switch, about the size of a large coin or small spool, with a short refrigerant port that threads into the line and two electrical wire terminals. High-pressure switches are often red; low-pressure switches are often blue.",
    whereFound:
      "Threaded into the refrigerant lines on the outdoor unit. The high-pressure switch is on the discharge (smaller) line; the low-pressure switch is on the suction (larger) line.",
    whatItDoes:
      "Continuously monitors system pressure. If high pressure exceeds the cutout (e.g., dirty condenser coil, failed fan), it opens its contact and shuts down the compressor. If low pressure drops below cutout (e.g., low refrigerant), it does the same.",
    imageKey: "pressure_switch",
  },
  // ─ no verified image for float switch ─
  {
    id: "float_switch",
    name: "Float Switch",
    category: "Electrical",
    associatedSystem: "Indoor",
    keywords: [
      "float switch",
      "condensate float switch",
      "drain safety switch",
      "float",
    ],
    definition:
      "A float switch is a safety device in the condensate drain pan that shuts the system off if the pan fills with water, preventing overflow and water damage.",
    whatItLooksLike:
      "A small plastic device about the size of a matchbox with a buoyant float arm or ball on one end and two electrical wires coming from the body. Some versions clip into the drain line; others sit inside the secondary drain pan beneath the air handler.",
    whereFound:
      "In the primary or secondary condensate drain pan under the indoor air handler or evaporator coil cabinet. Some installs place it inline in the condensate drain line.",
    whatItDoes:
      "As condensate water rises due to a clogged drain line, the float lifts and opens the switch contact, cutting power to the system. This stops cooling and prevents the pan from overflowing onto ceilings or floors.",
    imageKey: "float_switch",
  },
  // ─ verified image: part-air-filter.dim_400x400.png (extra, not in required list) ─
  {
    id: "air_filter",
    name: "Air Filter",
    category: "Airflow",
    associatedSystem: "Indoor",
    keywords: ["air filter", "filter", "furnace filter", "ac filter"],
    definition:
      "The air filter traps dust, pollen, pet dander, and debris before air enters the blower and passes over the evaporator coil, protecting internal components and improving air quality.",
    whatItLooksLike:
      "A flat rectangular frame (cardboard or plastic) filled with pleated or fiberglass filtering media. The size is printed on the frame edge (e.g., 16x25x1). Pleated filters are white or off-white when new, turning gray as they collect debris.",
    whereFound:
      "Either at the return air grille on the wall or ceiling, or at the air handler/furnace cabinet where the return duct connects.",
    whatItDoes:
      "Catches airborne particles before they reach the coil and blower. A clogged filter restricts airflow and is the single most common cause of reduced system performance and coil icing.",
    imageKey: "air_filter",
  },
  // ─ Type III Low-Pressure Chiller Parts (no verified images — strict no-guess) ─
  {
    id: "purge_unit",
    name: "Purge Unit",
    category: "Refrigerant",
    associatedSystem: "Chiller",
    keywords: ["purge unit", "purge", "purger", "chiller purge"],
    definition:
      "A purge unit is an automatic device on low-pressure centrifugal chillers that continuously removes non-condensables (air, moisture) that accumulate because the system operates below atmospheric pressure.",
    whatItLooksLike:
      "A small metal cabinet or box mounted on the side of the chiller, typically 12–18 inches tall, with refrigerant connections going to the condenser and evaporator shells. It has indicator lights and a counter that logs purge cycles. A small recovery vessel may be attached.",
    whereFound:
      "Mounted on the chiller itself, usually near the condenser shell. It has a refrigerant line connecting to the top of the condenser where non-condensables accumulate.",
    whatItDoes:
      "Draws off non-condensable gases (air, nitrogen, moisture vapor) from the top of the condenser shell, compresses them, and separates them. Refrigerant is recovered; non-condensables are safely discharged. High purge rates indicate a refrigerant leak allowing air entry.",
  },
  {
    id: "rupture_disc",
    name: "Rupture Disc",
    category: "Safety",
    associatedSystem: "Chiller",
    keywords: [
      "rupture disc",
      "rupture disk",
      "pressure relief disc",
      "burst disc",
    ],
    definition:
      "A rupture disc is a one-time-use pressure safety device that protects a low-pressure chiller from dangerously high internal pressure — typically from fire or abnormal conditions that could cause refrigerant to reach unsafe pressures.",
    whatItLooksLike:
      "A thin metal disc, typically 2–4 inches in diameter, clamped between two flanges on the chiller shell or pressure vessel. The disc is designed to rupture at a specific pressure, releasing refrigerant safely rather than allowing an explosion.",
    whereFound:
      "On the pressure vessel shell of the chiller (evaporator or condenser), often near a pressure relief valve. Required by ASME code on refrigerant pressure vessels.",
    whatItDoes:
      "Acts as a last-resort pressure safety device. If system pressure exceeds the design limit (e.g., during a fire or major system failure), the disc ruptures and vents refrigerant, preventing catastrophic vessel failure.",
  },
  {
    id: "float_valve_chiller",
    name: "Float Valve (Chiller)",
    category: "Refrigerant",
    associatedSystem: "Chiller",
    keywords: [
      "float valve",
      "high side float",
      "low side float",
      "chiller float",
    ],
    definition:
      "A float valve in a centrifugal chiller is the metering device that controls refrigerant flow from the condenser to the evaporator shell, replacing the TXV used in smaller systems.",
    whatItLooksLike:
      "A ball float attached to a linkage arm connected to a needle valve, housed inside the chiller's condenser or evaporator shell. It is not externally visible without opening the chiller — it looks similar to a toilet tank float but built for refrigerant service.",
    whereFound:
      "Inside the chiller's condenser shell (high-side float) or evaporator shell (low-side float), submerged in the refrigerant liquid level.",
    whatItDoes:
      "Maintains the correct refrigerant liquid level in the shell. As liquid refrigerant accumulates, the float rises and opens the valve, allowing refrigerant to flow to the evaporator. This is a simple, reliable metering method suited to the large-capacity, low-pressure chiller design.",
  },
  {
    id: "evaporator_vessel",
    name: "Evaporator Vessel",
    category: "Refrigerant",
    associatedSystem: "Chiller",
    keywords: [
      "evaporator vessel",
      "evaporator shell",
      "chiller evaporator",
      "cooler shell",
      "barrel evaporator",
    ],
    definition:
      "The evaporator vessel (also called the cooler shell) is the large heat exchanger in a centrifugal chiller where refrigerant evaporates and absorbs heat from the chilled water circuit.",
    whatItLooksLike:
      "A large horizontal cylindrical steel vessel, typically 3–6 feet in diameter and 6–15 feet long, with chilled water inlet/outlet nozzles on each end and refrigerant connections on top. It dominates the lower section of the chiller package.",
    whereFound:
      "On the bottom half of the chiller package. The chilled water circuit runs through tubes inside the vessel, while refrigerant evaporates around the outside of those tubes.",
    whatItDoes:
      "Chilled water flows through copper or steel tubes inside the vessel. Low-pressure refrigerant on the shell side evaporates at around 34–40°F, absorbing heat from the water and cooling it. The cooled water is then pumped to air handling units throughout the building.",
  },
  {
    id: "water_cooled_condenser",
    name: "Water-Cooled Condenser",
    category: "Refrigerant",
    associatedSystem: "Chiller",
    keywords: [
      "water cooled condenser",
      "water-cooled condenser",
      "condenser shell",
      "chiller condenser",
      "shell and tube condenser",
    ],
    definition:
      "The water-cooled condenser in a centrifugal chiller is a shell-and-tube heat exchanger where hot refrigerant vapor condenses by transferring heat to condenser water, which carries the heat to a cooling tower.",
    whatItLooksLike:
      "A large horizontal cylindrical steel vessel, similar in appearance to the evaporator vessel but typically mounted above it. Has condenser water inlet/outlet nozzles and refrigerant vapor inlet from the compressor on one end. The two vessels (evaporator below, condenser above) are the most visible parts of the chiller package.",
    whereFound:
      "On the top half of the chiller package, directly above the evaporator vessel. The refrigerant circuit connects compressor discharge to the condenser, and the condenser to the evaporator.",
    whatItDoes:
      "High-pressure refrigerant vapor from the compressor enters the condenser shell and condenses on the water-cooled tubes, releasing heat. Condenser water (cooled by a cooling tower) flows through the tubes and carries the rejected heat to the outdoors. The condensed liquid refrigerant then flows to the evaporator through the float valve.",
  },
  {
    id: "tube_bundle",
    name: "Tube Bundle",
    category: "Refrigerant",
    associatedSystem: "Chiller",
    keywords: [
      "tube bundle",
      "tubes",
      "chiller tubes",
      "heat exchanger tubes",
      "copper tubes",
    ],
    definition:
      "The tube bundle is the assembly of heat transfer tubes inside the evaporator or condenser vessel of a centrifugal chiller. It is the critical heat exchange surface that transfers heat between the refrigerant and the water circuits.",
    whatItLooksLike:
      "A cylindrical bundle of hundreds of copper or enhanced-surface steel tubes, typically 3/4 to 1 inch in diameter, arranged in a pattern inside the shell. The ends of the tubes are expanded into tube sheets at each end of the vessel. Individual tubes can be plugged if they develop leaks.",
    whereFound:
      "Inside both the evaporator and condenser shells of the chiller. The tube bundle fills most of the interior volume of each vessel.",
    whatItDoes:
      "In the evaporator: chilled water flows through the tubes; refrigerant evaporates on the outside, cooling the water. In the condenser: condenser water flows through the tubes; hot refrigerant vapor condenses on the outside, transferring heat to the water. Tube fouling (scale, biological deposits) significantly reduces chiller efficiency.",
  },
];

// ─── Verified image map ───────────────────────────────────────────────────────
// Only keys that map to a real, confirmed file in public/assets/generated/
// If the imageKey is not in this map, NO image is shown. Never guess.
export const VERIFIED_PART_IMAGES: Record<string, string> = {
  capacitor: "/assets/generated/part-capacitor.dim_400x400.png",
  contactor: "/assets/generated/part-contactor.dim_400x400.png",
  thermostat: "/assets/generated/part-thermostat.dim_400x400.png",
  evaporator_coil: "/assets/generated/part-evaporator-coil.dim_400x400.png",
  compressor: "/assets/generated/part-compressor.dim_400x400.png",
  air_filter: "/assets/generated/part-air-filter.dim_400x400.png",
  condenser_coil:
    "/assets/generated/component-condenser-coil-transparent.dim_400x300.png",
  transformer: "/assets/generated/part-transformer.dim_400x400.png",
  txv: "/assets/generated/part-txv.dim_400x400.png",
  reversing_valve: "/assets/generated/part-reversing-valve.dim_400x400.png",
  filter_drier: "/assets/generated/part-filter-drier.dim_400x400.png",
  accumulator: "/assets/generated/part-accumulator.dim_400x400.png",
  blower_motor: "/assets/generated/part-blower-motor.dim_400x400.png",
  condenser_fan_motor:
    "/assets/generated/part-condenser-fan-motor.dim_400x400.png",
  pressure_switch: "/assets/generated/part-pressure-switch.dim_400x400.png",
  float_switch: "/assets/generated/part-float-switch.dim_400x400.png",
};

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
      if (lower.includes(keyword)) return component;
    }
  }
  return null;
}
