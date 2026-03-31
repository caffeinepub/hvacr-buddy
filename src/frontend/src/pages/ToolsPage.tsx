import BottomTabBar from "@/components/BottomTabBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { componentVisuals, nameToVisualKey } from "@/data/componentVisuals";
import { useActor } from "@/hooks/useActor";
import {
  useAddPart,
  useAddTool,
  useGetParts,
  useGetTools,
  useIsCallerAdmin,
} from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  Search,
  ShieldAlert,
  Store,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Tool Details ─────────────────────────────────────────────────────────────

const TOOL_DETAILS: Record<
  string,
  {
    usedFor: string[];
    whenToUse: string;
    howToUse: string;
    safety: string;
  }
> = {
  Multimeter: {
    usedFor: ["voltage testing", "continuity testing", "capacitor testing"],
    whenToUse: "When checking electrical components or verifying power",
    howToUse:
      "Set to voltage or capacitance mode. Place probes on terminals to measure.",
    safety: "Ensure power is off when checking resistance or capacitance.",
  },
  "Clamp Meter": {
    usedFor: ["measuring current draw"],
    whenToUse: "When checking if motors or compressors are drawing proper amps",
    howToUse: "Clamp around a single wire and read amperage.",
    safety: "Avoid contact with exposed wires.",
  },
  "Manifold Gauge Set": {
    usedFor: ["checking system pressure", "charging refrigerant"],
    whenToUse: "When diagnosing refrigerant issues",
    howToUse: "Connect hoses to service ports and read high/low pressure.",
    safety: "Wear gloves and avoid refrigerant exposure.",
  },
  "Vacuum Pump": {
    usedFor: ["evacuating system"],
    whenToUse: "Before charging refrigerant after any repair",
    howToUse:
      "Connect to manifold center hose, open valves, run until 500 microns.",
    safety: "Ensure proper hose connections and monitor for vacuum hold.",
  },
  "Leak Detector": {
    usedFor: ["finding refrigerant leaks"],
    whenToUse: "When system is low on refrigerant",
    howToUse: "Move sensor around coils and connections.",
    safety: "Use in ventilated area.",
  },
  // Hand Tools
  "Adjustable Wrench": {
    usedFor: ["tightening fittings", "loosening nuts", "pipe connections"],
    whenToUse: "When tightening or loosening threaded connections",
    howToUse:
      "Engage jaw on flat sides of nut. Turn clockwise to tighten, counterclockwise to loosen.",
    safety: "Avoid over-tightening brass fittings — they can crack.",
  },
  "Pipe Wrench": {
    usedFor: [
      "gripping pipes",
      "tightening pipe fittings",
      "removing corroded fittings",
    ],
    whenToUse: "When working with round or corroded pipe fittings",
    howToUse:
      "Adjust jaw to fit pipe, apply force in direction upper jaw faces. Use two wrenches for opposing force.",
    safety: "Protect finish surfaces with tape or cloth to prevent damage.",
  },
  Screwdrivers: {
    usedFor: [
      "removing access panels",
      "securing terminal screws",
      "fastening covers",
    ],
    whenToUse:
      "When removing or securing screws on panels, covers, and terminal blocks",
    howToUse:
      "Match tip to screw head (flathead or Phillips). Press firmly before turning to avoid cam-out.",
    safety: "Use insulated screwdrivers near live terminals.",
  },
  "Nut Drivers": {
    usedFor: [
      "removing hex-head screws",
      "accessing panels",
      "electrical terminal work",
    ],
    whenToUse:
      "When removing or installing hex-head sheet metal screws on HVAC panels",
    howToUse:
      'Select 1/4" or 5/16" for HVAC panels. Press onto hex head, turn counterclockwise to remove.',
    safety: "Use correct size to avoid rounding off hex heads.",
  },
  Pliers: {
    usedFor: ["gripping components", "bending wire", "holding tubing"],
    whenToUse: "When gripping, bending, or manipulating small parts or wire",
    howToUse:
      "Select needle nose for tight spaces, channel locks for larger grips. Position jaws fully before squeezing.",
    safety:
      "Avoid using pliers on soft brass fittings — use a proper wrench instead.",
  },
  "Tubing Cutter": {
    usedFor: ["cutting copper tubing", "cutting refrigerant lines"],
    whenToUse: "When cutting copper line set or refrigerant tubing to length",
    howToUse:
      "Clamp wheel on mark, rotate full turn, tighten feed knob quarter turn, rotate again. Repeat until cut.",
    safety:
      "Deburr immediately after cutting to remove sharp edges inside the tube.",
  },
  "Deburring Tool": {
    usedFor: ["deburring cut tubing", "removing sharp edges from copper"],
    whenToUse:
      "Immediately after cutting copper tubing, before flaring or brazing",
    howToUse:
      "Insert reamer blade into cut end, rotate clockwise with gentle pressure until smooth.",
    safety:
      "Wipe away copper shavings — they can contaminate the refrigerant circuit.",
  },
  // Power Tools
  "Cordless Drill": {
    usedFor: [
      "drilling mounting holes",
      "driving screws",
      "installing equipment",
    ],
    whenToUse:
      "When mounting equipment, drilling holes for line sets, or driving fasteners",
    howToUse:
      "Select correct bit, set torque clutch, squeeze trigger gently, keep drill perpendicular.",
    safety: "Check for hidden wires or pipes before drilling into walls.",
  },
  "Impact Driver": {
    usedFor: [
      "driving long screws",
      "fastening lag bolts",
      "high-torque fastening",
    ],
    whenToUse: "When driving long or heavy fasteners into mounting surfaces",
    howToUse:
      "Insert impact-rated bit, position in fastener head, squeeze trigger. Release before bottoming out.",
    safety:
      "Use impact-rated bits only — standard bits can shatter under impact.",
  },
  "Reciprocating Saw (Sawzall)": {
    usedFor: [
      "cutting ductwork",
      "demolition",
      "cutting through walls for line sets",
    ],
    whenToUse:
      "When cutting ductwork, penetrating walls, or removing old equipment",
    howToUse:
      "Select correct blade, keep shoe plate pressed against surface, let blade do the work.",
    safety:
      "Always check for hidden wires and pipes before cutting into walls.",
  },
  // Installation Tools
  "Flaring Tool": {
    usedFor: ["creating flare fittings", "flaring copper tubing"],
    whenToUse: "When making flare connections on refrigerant line sets",
    howToUse:
      'Cut and deburr tube, slide flare nut on first, insert in block 1/8" above, tighten yoke to form flare.',
    safety:
      "Inspect flare for cracks before connecting — a cracked flare will leak refrigerant.",
  },
  "Swaging Tool": {
    usedFor: [
      "swaging copper tubing",
      "making swaged connections without fittings",
    ],
    whenToUse:
      "When connecting two tubes of the same size without a coupling fitting",
    howToUse:
      "Deburr both ends, insert swaging punch to correct depth, strike or ratchet to expand. Braze after fitting.",
    safety:
      "Ensure tubes are clean and free of burrs before brazing the swaged joint.",
  },
  "Torque Wrench": {
    usedFor: ["torquing flare fittings", "tightening to spec"],
    whenToUse:
      "When tightening refrigerant flare fittings to manufacturer torque specifications",
    howToUse:
      "Set desired torque, attach adapter, apply force smoothly. Stop immediately when wrench clicks.",
    safety:
      "Never continue tightening after the click — over-torquing cracks the flare.",
  },
  // Electrical Support
  "Wire Strippers": {
    usedFor: ["stripping wire insulation", "preparing wire ends for terminals"],
    whenToUse:
      "When connecting control wiring or replacing electrical connections",
    howToUse:
      "Match gauge to notch (18–22 AWG for control wiring), insert wire, squeeze and pull in one motion.",
    safety: "Turn power off before stripping wire near live terminals.",
  },
  Crimpers: {
    usedFor: ["crimping wire connectors", "securing terminals"],
    whenToUse: "When joining wires or attaching ring/spade terminals",
    howToUse:
      "Select correct connector, insert stripped wire fully, position in correct groove, squeeze firmly.",
    safety:
      "Confirm wire is fully seated before crimping — a partial insertion creates a weak connection.",
  },
};

// ─── Part Details ─────────────────────────────────────────────────────────────

const PART_DETAILS: Record<
  string,
  {
    whatItIs: string;
    whatItDoes: string;
    whatItLooksLike: string;
    whereLocated: string;
  }
> = {
  Capacitor: {
    whatItIs:
      "A capacitor is an electrical energy-storage device that helps motors start and run efficiently. Most HVAC systems use a dual-run capacitor that supports both the compressor and the condenser fan motor.",
    whatItDoes:
      "Provides the starting boost and running support current that motors need. Without it, the compressor or fan motor will hum, struggle to start, or not run at all.",
    whatItLooksLike:
      "A cylindrical or oval metal/plastic canister, typically silver, black, or blue. The top has metal terminals labeled HERM, FAN, and C. A bad capacitor often looks bulged or swollen on top.",
    whereLocated:
      "Inside the outdoor condenser unit. Open the side access panel — mounted near the contactor on a bracket along the side wall of the cabinet.",
  },
  Contactor: {
    whatItIs:
      "A contactor is an electrically operated high-voltage switch that controls power to the compressor and outdoor fan motor. When the thermostat calls for cooling, 24V closes the contactor.",
    whatItDoes:
      "Acts as the main power switch for the outdoor unit, opening and closing under thermostat command to start and stop the compressor and condenser fan motor.",
    whatItLooksLike:
      "A small rectangular switch about the size of a deck of cards. Large screw terminals on top and bottom carry high-voltage wires. Two smaller terminals accept 24V control wires. A visible plunger pulls in when energized.",
    whereLocated:
      "Inside the outdoor condenser unit, typically in the lower corner near the electrical entry point. Look for the component with the heaviest wires.",
  },
  Transformer: {
    whatItIs:
      "A transformer steps down 120V or 240V line voltage to the 24V signal used by the thermostat and all control circuits. It is the power source for the entire low-voltage control system.",
    whatItDoes:
      "Converts line voltage down to 24V AC to power the thermostat, contactor coil, control board, and all low-voltage components. If it fails, nothing in the control system will function.",
    whatItLooksLike:
      "A small rectangular or square block, usually black or gray, about the size of a large ice cube. It has two sets of wire leads — the primary (high-voltage) side and the secondary (24V) side. A VA rating is printed on the label.",
    whereLocated:
      "Mounted inside the air handler or furnace cabinet, usually on the control board bracket or near the blower compartment.",
  },
  Thermostat: {
    whatItIs:
      "The thermostat is the control center for the HVAC system. It monitors indoor temperature and sends low-voltage signals to start or stop heating and cooling.",
    whatItDoes:
      "Reads indoor temperature, compares it to the setpoint, and sends on/off signals to the heating and cooling equipment. It is the user's only interface for controlling the system.",
    whatItLooksLike:
      "A flat rectangular or square device mounted on an interior wall, typically white, gray, or black. Modern units have a digital display and touchscreen; older units use a rotary dial.",
    whereLocated:
      "Mounted on an interior wall in a central location — hallway, living room, or stairwell. Should not be on an exterior wall or near heat sources.",
  },
  "Evaporator Coil": {
    whatItIs:
      "The evaporator coil is the indoor heat exchanger where refrigerant absorbs heat from the air inside your home. It is what actually cools the circulated air.",
    whatItDoes:
      "Refrigerant enters at low pressure and temperature, absorbing heat from warm indoor air blown across the fins. This cools the air and evaporates the refrigerant into a vapor before it heads to the compressor.",
    whatItLooksLike:
      "A triangular or A-shaped assembly of thin aluminum fins with copper tubes running through them — similar to a car radiator shaped like an upside-down V.",
    whereLocated:
      "In the air handler or furnace cabinet, directly above the blower motor. All indoor air passes through it before reaching the supply ducts.",
  },
  "Condenser Coil": {
    whatItIs:
      "The condenser coil is the outdoor heat exchanger where refrigerant releases the heat it absorbed indoors. It is the outdoor counterpart to the evaporator coil.",
    whatItDoes:
      "Hot high-pressure refrigerant vapor flows through the coil. The condenser fan pulls outdoor air across the fins, removing heat and causing the refrigerant to condense into liquid.",
    whatItLooksLike:
      "A large grid of thin aluminum fins with copper tubes, wrapped around three or four sides of the outdoor unit cabinet. The closely spaced fins resemble a car radiator.",
    whereLocated:
      "Wrapped around the outside walls of the outdoor condenser unit. The fin surface is visible from outside the cabinet without removing any panels.",
  },
  Compressor: {
    whatItIs:
      "The compressor is the heart of the refrigeration system. It pressurizes the refrigerant vapor so the system can move heat from indoors to outdoors.",
    whatItDoes:
      "Compresses low-pressure refrigerant vapor from the evaporator into high-pressure, high-temperature vapor and pumps it to the condenser coil, driving the entire heat transfer cycle.",
    whatItLooksLike:
      "A large black or gray dome-shaped or cylindrical metal component — about the size of a small fire extinguisher up to a 5-gallon bucket. It has a large suction line and a smaller discharge line on top.",
    whereLocated:
      "Inside the outdoor condenser unit, sitting in the lower section of the cabinet. It is the largest single component inside the outdoor unit.",
  },
  "TXV (Thermostatic Expansion Valve)": {
    whatItIs:
      "The TXV is the metering device that precisely controls how much liquid refrigerant enters the evaporator coil, balancing the refrigerant charge to match the cooling load.",
    whatItDoes:
      "Acts as a variable throttle that restricts refrigerant flow to match the cooling load. It reads suction line temperature via a sensing bulb and opens or closes to maintain correct superheat.",
    whatItLooksLike:
      "A small brass or copper valve roughly the size of a large thumb, with refrigerant fittings on two ends and a thin capillary tube running to a sensing bulb clamped to the suction line.",
    whereLocated:
      "At the inlet of the evaporator coil, inside the air handler cabinet. The sensing bulb is clamped to the suction line just past the coil outlet.",
  },
  "Reversing Valve": {
    whatItIs:
      "A reversing valve is found only in heat pumps. It switches the direction of refrigerant flow so the system can operate in both heating and cooling modes.",
    whatItDoes:
      "Redirects refrigerant flow between heating and cooling modes. In heating mode, the outdoor coil becomes the evaporator and the indoor coil becomes the condenser, extracting heat from outdoor air.",
    whatItLooksLike:
      "A cylindrical brass or copper valve, about 6–8 inches long, with four refrigerant line connections. A small solenoid coil is mounted on top that shifts an internal slide to reverse flow direction.",
    whereLocated:
      "On the outdoor unit of a heat pump system, connected directly to the refrigerant lines near the compressor.",
  },
  "Filter Drier": {
    whatItIs:
      "A filter drier removes moisture, acid, and contaminants from the refrigerant before it reaches the metering device, protecting the system from corrosion and ice blockages.",
    whatItDoes:
      "Acts as the system's internal filter. The desiccant core absorbs moisture that causes acid and freeze-ups, while the screen catches debris. Always replaced after a compressor burnout.",
    whatItLooksLike:
      "A small cylindrical metal canister, typically 3–6 inches long and 1–2 inches in diameter, copper or silver in color, with flare or sweat fittings on each end. An arrow shows the required flow direction.",
    whereLocated:
      "In-line on the liquid (smaller) refrigerant line, usually near the outdoor unit or at the service valve. Always on the high-pressure liquid side before the expansion device.",
  },
  Accumulator: {
    whatItIs:
      "An accumulator is a safety device on the suction line that catches any liquid refrigerant before it can reach the compressor. Liquid entering a compressor causes catastrophic damage.",
    whatItDoes:
      "Any liquid refrigerant entering the accumulator settles to the bottom while only vapor is drawn off through the outlet tube to the compressor, preventing liquid slugging.",
    whatItLooksLike:
      "An upright cylindrical metal tank, typically 6–12 inches tall and 3–5 inches in diameter, installed in-line on the large suction refrigerant line. Looks like a small boiler or propane canister.",
    whereLocated:
      "On the suction line between the evaporator coil and the compressor, usually mounted near the outdoor unit. Common on heat pumps.",
  },
  "Blower Motor": {
    whatItIs:
      "The blower motor drives the squirrel-cage fan wheel inside the air handler or furnace that circulates air throughout the home.",
    whatItDoes:
      "Pulls return air from the home, forces it across the evaporator coil or heat exchanger, and pushes conditioned air into the supply ducts. Without it, no air moves through the system.",
    whatItLooksLike:
      "A cylindrical electric motor, typically 4–8 inches in diameter, mounted inside the air handler cabinet. The shaft connects to a squirrel-cage blower wheel — a cylindrical drum with many curved blades.",
    whereLocated:
      "In the lower section of the air handler or furnace cabinet, below the evaporator coil, inside the blower housing assembly.",
  },
  "Condenser Fan Motor": {
    whatItIs:
      "The condenser fan motor drives the propeller fan blade on top of the outdoor unit to pull air through the condenser coil and dissipate heat.",
    whatItDoes:
      "Keeps the condenser coil cool by pulling outdoor air across its fins. Without airflow, head pressure climbs and the system trips on high-pressure lockout.",
    whatItLooksLike:
      "A round electric motor, about 3–5 inches in diameter, mounted in the top-center of the outdoor unit beneath the fan grille. It has a vertical shaft for the propeller blade and several wire leads.",
    whereLocated:
      "Mounted in the top of the outdoor condenser unit, directly below the fan grille. The propeller sits on the motor shaft and pushes air upward out of the unit.",
  },
  "Pressure Switch": {
    whatItIs:
      "A pressure switch is a safety device that monitors refrigerant pressure and shuts the system down if pressure goes too high or too low.",
    whatItDoes:
      "Continuously monitors system pressure. If high pressure exceeds the cutout (dirty condenser coil, failed fan), or low pressure drops (low refrigerant), it opens its contact and shuts down the compressor.",
    whatItLooksLike:
      "A small cylindrical or disc-shaped electrical switch, about the size of a large coin, with a short refrigerant port and two electrical wire terminals. High-pressure switches are often red; low-pressure often blue.",
    whereLocated:
      "Threaded into the refrigerant lines on the outdoor unit. The high-pressure switch is on the discharge (smaller) line; the low-pressure switch is on the suction (larger) line.",
  },
  "Float Switch": {
    whatItIs:
      "A float switch is a safety device in the condensate drain pan that shuts the system off if the pan fills with water, preventing overflow and water damage.",
    whatItDoes:
      "As condensate water rises due to a clogged drain line, the float lifts and opens the switch contact, cutting power to the system. This stops cooling and prevents the pan from overflowing.",
    whatItLooksLike:
      "A small plastic device about the size of a matchbox with a buoyant float arm or ball on one end and two electrical wires from the body. Some clip into the drain line; others sit inside the secondary drain pan.",
    whereLocated:
      "In the primary or secondary condensate drain pan under the indoor air handler or evaporator coil cabinet. Some installs place it inline in the condensate drain line.",
  },
};

// ─── Seed Data──────────────────────────────────────────────────────────────

const SEED_TOOLS = [
  {
    name: "Multimeter",
    description: "Measures voltage, current, and resistance",
    category: "Electrical",
  },
  {
    name: "Manifold Gauge Set",
    description: "Reads suction and discharge pressures in refrigerant systems",
    category: "Refrigerant",
  },
  {
    name: "Vacuum Pump",
    description:
      "Evacuates moisture and non-condensables from refrigerant circuits",
    category: "Installation Tools",
  },
  {
    name: "Refrigerant Scale",
    description: "Weighs refrigerant during charging and recovery",
    category: "Refrigerant",
  },
  {
    name: "Clamp Meter",
    description: "Measures amperage without breaking the circuit",
    category: "Electrical",
  },
  {
    name: "Thermometer / Temp Probe",
    description:
      "Measures supply and return air temperatures for delta-T checks",
    category: "Diagnostics",
  },
  {
    name: "Leak Detector",
    description: "Electronic sensor for detecting refrigerant leaks",
    category: "Refrigerant",
  },
  // Hand Tools
  {
    name: "Adjustable Wrench",
    description: "Tightens and loosens threaded fittings and nuts",
    category: "Hand Tools",
  },
  {
    name: "Pipe Wrench",
    description: "Grips and turns round pipe and corroded fittings",
    category: "Hand Tools",
  },
  {
    name: "Screwdrivers",
    description:
      "Drives and removes flathead and Phillips screws on panels and covers",
    category: "Hand Tools",
  },
  {
    name: "Nut Drivers",
    description: "Removes hex-head sheet metal screws for panel access",
    category: "Hand Tools",
  },
  {
    name: "Pliers",
    description: "Grips, bends, and manipulates small components and wire",
    category: "Hand Tools",
  },
  {
    name: "Tubing Cutter",
    description: "Makes clean, square cuts on copper refrigerant tubing",
    category: "Hand Tools",
  },
  {
    name: "Deburring Tool",
    description:
      "Removes inner burr from cut copper tubing before flaring or brazing",
    category: "Hand Tools",
  },
  // Power Tools
  {
    name: "Cordless Drill",
    description:
      "Drills mounting holes and drives fasteners during installation",
    category: "Power Tools",
  },
  {
    name: "Impact Driver",
    description:
      "Drives long screws and lag bolts with high-torque impact action",
    category: "Power Tools",
  },
  {
    name: "Reciprocating Saw (Sawzall)",
    description:
      "Cuts ductwork, walls, and old equipment during removal and install",
    category: "Power Tools",
  },
  // Installation Tools
  {
    name: "Flaring Tool",
    description:
      "Forms a precise flare on copper tubing for leak-free flare connections",
    category: "Installation Tools",
  },
  {
    name: "Swaging Tool",
    description:
      "Expands a tube end to accept a mating tube for a brazed connection",
    category: "Installation Tools",
  },
  {
    name: "Torque Wrench",
    description:
      "Tightens flare fittings to manufacturer torque spec to prevent leaks",
    category: "Installation Tools",
  },
  // Electrical Support
  {
    name: "Wire Strippers",
    description:
      "Removes insulation cleanly from control wire ends for terminal connections",
    category: "Electrical",
  },
  {
    name: "Crimpers",
    description:
      "Compresses wire connectors and terminals for secure electrical connections",
    category: "Electrical",
  },
];

const SEED_PARTS = [
  {
    name: "Capacitor",
    description:
      "Stores and releases electrical energy to start and run motors",
    category: "Electrical",
    typicalUse: "Starts/runs compressor and fan motors",
  },
  {
    name: "Contactor",
    description: "Electrically controlled high-voltage switch",
    category: "Electrical",
    typicalUse: "Switches 240V power to compressor",
  },
  {
    name: "Transformer",
    description: "Steps down line voltage to 24V for control circuits",
    category: "Electrical",
    typicalUse: "Powers thermostat and control board",
  },
  {
    name: "Thermostat",
    description: "Control center that monitors and adjusts indoor temperature",
    category: "Electrical",
    typicalUse: "User interface for system control",
  },
  {
    name: "Evaporator Coil",
    description: "Indoor heat exchanger that absorbs heat from air",
    category: "Refrigerant",
    typicalUse: "Cools indoor air in air handler",
  },
  {
    name: "Condenser Coil",
    description: "Outdoor heat exchanger that releases heat to outside air",
    category: "Refrigerant",
    typicalUse: "Rejects heat in outdoor unit",
  },
  {
    name: "Compressor",
    description: "Heart of the refrigeration system — pressurizes refrigerant",
    category: "Refrigerant",
    typicalUse: "Pumps refrigerant through the system",
  },
  {
    name: "TXV (Thermostatic Expansion Valve)",
    description: "Precisely meters liquid refrigerant into the evaporator coil",
    category: "Refrigerant",
    typicalUse: "Metering device in split systems",
  },
  {
    name: "Reversing Valve",
    description: "Switches refrigerant flow direction for heating and cooling",
    category: "Refrigerant",
    typicalUse: "Heat pumps only",
  },
  {
    name: "Filter Drier",
    description: "Removes moisture and debris from refrigerant circuit",
    category: "Refrigerant",
    typicalUse: "Installed on liquid line",
  },
  {
    name: "Accumulator",
    description: "Catches liquid refrigerant before it reaches the compressor",
    category: "Refrigerant",
    typicalUse: "Suction line safety device",
  },
  {
    name: "Blower Motor",
    description: "Drives the indoor fan to circulate air through the system",
    category: "Airflow",
    typicalUse: "Indoor air handler",
  },
  {
    name: "Condenser Fan Motor",
    description: "Drives the outdoor fan to cool the condenser coil",
    category: "Airflow",
    typicalUse: "Outdoor condenser unit",
  },
  {
    name: "Pressure Switch",
    description: "Safety switch that monitors refrigerant pressure levels",
    category: "Electrical",
    typicalUse: "High and low pressure protection",
  },
  {
    name: "Float Switch",
    description: "Safety switch that prevents condensate drain pan overflow",
    category: "Electrical",
    typicalUse: "Condensate drain protection",
  },
];

// ─── Suppliers Data ──────────────────────────────────────────────────────────

interface Supplier {
  id: string;
  name: string;
  shortLocation: string;
  fullAddress: string;
  partsAvailable: string[];
}

const SUPPLIERS: Supplier[] = [
  {
    id: "johnstone",
    name: "Johnstone Supply",
    shortLocation: "Orlando, FL 32812",
    fullAddress: "5505 Hoffner Ave, Orlando, FL 32812 (near 32819)",
    partsAvailable: [
      "Capacitors",
      "Contactors",
      "Motors",
      "Controls",
      "Refrigerant",
      "Tools",
      "Filters",
    ],
  },
  {
    id: "united",
    name: "United Refrigeration Inc.",
    shortLocation: "Orlando, FL 32808",
    fullAddress: "3325 W. Colonial Dr, Orlando, FL 32808",
    partsAvailable: [
      "Refrigerant",
      "Compressors",
      "Expansion Valves",
      "Coils",
      "Filter Driers",
      "Fittings",
    ],
  },
  {
    id: "grainger",
    name: "Grainger",
    shortLocation: "Orlando, FL 32809",
    fullAddress: "1940 W. Oak Ridge Rd, Orlando, FL 32809",
    partsAvailable: [
      "Motors",
      "Electrical Components",
      "Tools",
      "Safety Equipment",
      "Belts",
      "Hardware",
    ],
  },
  {
    id: "ferguson",
    name: "Ferguson HVAC",
    shortLocation: "Orlando, FL 32812",
    fullAddress: "5345 Hoffner Ave, Orlando, FL 32812",
    partsAvailable: [
      "HVAC Equipment",
      "Ductwork",
      "Controls",
      "Thermostats",
      "Grilles",
      "Refrigerant",
    ],
  },
  {
    id: "baker",
    name: "Baker Distributing",
    shortLocation: "Orlando, FL 32811",
    fullAddress: "4614 L.B. McLeod Rd, Orlando, FL 32811",
    partsAvailable: [
      "Full HVAC Equipment Lines",
      "Parts",
      "Refrigerant",
      "Tools",
      "Accessories",
    ],
  },
];

// ─── Seeder Hook ──────────────────────────────────────────────────────────────

function useSeeder(toolsEmpty: boolean, partsEmpty: boolean, ready: boolean) {
  const { actor } = useActor();
  const { data: isAdmin } = useIsCallerAdmin();
  const addTool = useAddTool();
  const addPart = useAddPart();
  const seeded = useRef(false);

  useEffect(() => {
    if (!ready || !actor || !isAdmin || seeded.current) return;
    if (!toolsEmpty && !partsEmpty) return;

    seeded.current = true;

    const seedAll = async () => {
      if (toolsEmpty) {
        await Promise.all(
          SEED_TOOLS.map((t) =>
            addTool.mutateAsync({
              name: t.name,
              description: t.description,
              category: t.category,
            }),
          ),
        );
      }
      if (partsEmpty) {
        await Promise.all(
          SEED_PARTS.map((p) =>
            addPart.mutateAsync({
              name: p.name,
              description: p.description,
              category: p.category,
              typicalUse: p.typicalUse,
            }),
          ),
        );
      }
    };

    seedAll();
  }, [ready, actor, isAdmin, toolsEmpty, partsEmpty, addTool, addPart]);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWhenToUseByCategory(category: string): string {
  switch (category) {
    case "Electrical":
      return "When diagnosing electrical components";
    case "Refrigerant":
      return "When working with refrigerant systems";
    case "Hand Tools":
      return "For mechanical installation and repair tasks";
    case "Power Tools":
      return "During installation and removal of components";
    case "Installation Tools":
      return "When making refrigerant line connections";
    case "Diagnostics":
      return "When measuring system performance";
    default:
      return "As needed for HVAC service work";
  }
}

// ─── Tool Card ────────────────────────────────────────────────────────────────

function ToolCard({
  tool,
  index,
}: {
  tool: { id: unknown; name: string; description: string; category: string };
  index: number;
}) {
  const details = TOOL_DETAILS[tool.name];
  const [expanded, setExpanded] = useState(false);

  const whenToUse = details?.whenToUse ?? getWhenToUseByCategory(tool.category);

  return (
    <Card
      className="border border-border overflow-hidden"
      data-ocid={`tools.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <CardContent className="py-4 px-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-7 h-7 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
              <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm text-foreground leading-snug">
                  {tool.name}
                </p>
                {tool.category && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {tool.category}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {tool.description}
              </p>
              <p className="text-xs text-foreground/70 pt-0.5">
                <span className="font-medium text-muted-foreground">
                  When to use:{" "}
                </span>
                {whenToUse}
              </p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardContent>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          {/* Tool Image */}
          {(() => {
            const vk = nameToVisualKey[tool.name];
            const v = vk ? componentVisuals[vk] : null;
            return v ? (
              <div className="flex justify-center pb-1">
                <img
                  src={v.imageSrc}
                  alt={tool.name}
                  className="h-36 object-contain rounded-lg opacity-95"
                />
              </div>
            ) : null;
          })()}
          {details ? (
            <>
              {/* Used For */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Used For
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {details.usedFor.map((use) => (
                    <Badge
                      key={use}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* When to Use */}
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  When to Use
                </p>
                <p className="text-sm text-foreground">{details.whenToUse}</p>
              </div>

              {/* How to Use */}
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  How to Use
                </p>
                <p className="text-sm text-foreground">{details.howToUse}</p>
              </div>

              {/* Safety */}
              <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2.5">
                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  {details.safety}
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                When to Use
              </p>
              <p className="text-sm text-foreground">{whenToUse}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── Tools Tab ────────────────────────────────────────────────────────────────

function ToolsTab() {
  const { data: backendTools = [], isLoading } = useGetTools();
  const [query, setQuery] = useState("");

  // Fall back to SEED_TOOLS when backend has no data yet
  const displayTools =
    backendTools.length > 0
      ? backendTools
      : SEED_TOOLS.map((t, i) => ({ id: String(i), ...t }));

  const filtered = displayTools.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase().trim()),
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tools… e.g. multimeter, gauges"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          data-ocid="tools.search_input"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="tools.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14" data-ocid="tools.empty_state">
          <Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No tools found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((tool, i) => (
            <ToolCard key={String(tool.id)} tool={tool} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Part Card ────────────────────────────────────────────────────────────────

function PartCard({
  part,
  index,
}: {
  part: {
    id: unknown;
    name: string;
    description: string;
    category: string;
    typicalUse: string;
  };
  index: number;
}) {
  const details = PART_DETAILS[part.name];
  const [expanded, setExpanded] = useState(false);

  const visualKey = nameToVisualKey[part.name];
  const visual = visualKey ? componentVisuals[visualKey] : null;

  return (
    <Card
      className="border border-border overflow-hidden"
      data-ocid={`parts.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <CardContent className="py-4 px-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-7 h-7 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
              <Package className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm text-foreground leading-snug">
                  {part.name}
                </p>
                {part.category && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {part.category}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {part.description}
              </p>
              <p className="text-xs text-foreground/70 pt-0.5">
                <span className="font-medium text-muted-foreground">Use: </span>
                {part.typicalUse}
              </p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardContent>
      </button>

      {expanded && details && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          {/* Part Image */}
          {visual && (
            <div className="flex justify-center pb-1">
              <img
                src={visual.imageSrc}
                alt={part.name}
                className="h-40 object-contain rounded-lg opacity-95"
              />
            </div>
          )}

          {/* What It Is */}
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">
              What It Is
            </p>
            <p className="text-sm text-foreground">{details.whatItIs}</p>
          </div>

          {/* What It Does */}
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">
              What It Does
            </p>
            <p className="text-sm text-foreground">{details.whatItDoes}</p>
          </div>

          {/* What It Looks Like */}
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">
              What It Looks Like
            </p>
            <p className="text-sm text-foreground">{details.whatItLooksLike}</p>
          </div>

          {/* Where Located */}
          <div className="flex items-start gap-2 rounded-md bg-sky-950/40 border border-sky-800/40 px-3 py-2.5">
            <MapPin className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-400 mb-0.5">
                Where It Is Located
              </p>
              <p className="text-sm text-foreground">{details.whereLocated}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Parts Tab ───────────────────────────────────────────────────────────────

function PartsTab() {
  const { data: parts = [], isLoading } = useGetParts();
  const [query, setQuery] = useState("");

  const displayParts =
    parts.length > 0
      ? parts
      : SEED_PARTS.map((p, i) => ({ id: String(i), ...p }));
  const filtered = displayParts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase().trim()),
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search parts… e.g. capacitor, TXV, refrigerant"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          data-ocid="parts.search_input"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="parts.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14" data-ocid="parts.empty_state">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            {query ? "No parts found" : "No parts added yet"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {query
              ? "Try a different search term."
              : "Check back after an admin seeds the data."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((part, i) => (
            <PartCard key={String(part.id)} part={part} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Suppliers Tab ───────────────────────────────────────────────────────────

function SupplierCard({
  supplier,
  index,
}: { supplier: Supplier; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className="border border-border overflow-hidden"
      data-ocid={`suppliers.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setExpanded((v) => !v)}
        data-ocid={`suppliers.toggle.${index + 1}`}
        aria-expanded={expanded}
      >
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 w-8 h-8 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                <Store className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm font-semibold text-foreground leading-snug">
                  {supplier.name}
                </CardTitle>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    {supplier.shortLocation}
                  </span>
                </div>
              </div>
            </div>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        </CardHeader>
      </button>

      {expanded && (
        <CardContent
          className="px-4 pb-4 pt-0 space-y-3"
          data-ocid={`suppliers.panel.${index + 1}`}
        >
          <div className="h-px bg-border" />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Address
            </p>
            <p className="text-sm text-foreground">{supplier.fullAddress}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Parts Available
            </p>
            <div className="flex flex-wrap gap-1.5">
              {supplier.partsAvailable.map((part) => (
                <Badge
                  key={part}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {part}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function SuppliersTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Local suppliers near ZIP{" "}
          <span className="font-medium text-foreground">32819</span> — Orlando,
          FL
        </p>
      </div>
      {SUPPLIERS.map((supplier, i) => (
        <SupplierCard key={supplier.id} supplier={supplier} index={i} />
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ToolsPage() {
  const { data: tools = [], isFetched: toolsFetched } = useGetTools();
  const { data: parts = [], isFetched: partsFetched } = useGetParts();

  const dataReady = toolsFetched && partsFetched;
  useSeeder(tools.length === 0, parts.length === 0, dataReady);

  return (
    <div className="min-h-screen bg-background pb-14">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              data-ocid="tools.back_button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tools</h1>
            <p className="text-sm text-muted-foreground">
              Tools, parts reference, and local suppliers.
            </p>
          </div>
        </div>

        <Tabs defaultValue="tools" className="w-full">
          <TabsList
            className="mb-5 w-full grid grid-cols-3"
            data-ocid="tools.tab"
          >
            <TabsTrigger value="tools" data-ocid="tools.tools.tab">
              Tools
            </TabsTrigger>
            <TabsTrigger value="parts" data-ocid="tools.parts.tab">
              Parts
            </TabsTrigger>
            <TabsTrigger value="suppliers" data-ocid="tools.suppliers.tab">
              Suppliers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools">
            <ToolsTab />
          </TabsContent>

          <TabsContent value="parts">
            <PartsTab />
          </TabsContent>

          <TabsContent value="suppliers">
            <SuppliersTab />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-10">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
      <BottomTabBar />
    </div>
  );
}
