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
    commonSymptoms: string[];
    function: string;
    howToCheck: string;
    replacementNote: string;
  }
> = {
  Capacitor: {
    commonSymptoms: ["unit not starting", "humming sound", "fan not spinning"],
    function: "Provides starting and running energy to motors",
    howToCheck: "Use a multimeter in capacitance mode and compare to rating",
    replacementNote: "Match exact microfarad rating",
  },
  Contactor: {
    commonSymptoms: ["outdoor unit not running", "clicking sound"],
    function: "Controls power to compressor and fan",
    howToCheck: "Check for voltage across terminals with multimeter",
    replacementNote: "Ensure correct voltage rating",
  },
  "Air Filter": {
    commonSymptoms: ["weak airflow", "system freezing", "poor cooling"],
    function: "Filters air before entering system",
    howToCheck: "Inspect for dirt or blockage",
    replacementNote: "Replace regularly",
  },
  "Evaporator Coil": {
    commonSymptoms: ["freezing", "not cooling"],
    function: "Absorbs heat from indoor air",
    howToCheck: "Inspect for ice or dirt buildup",
    replacementNote: "Clean before replacing",
  },
};

// ─── Seed Data ────────────────────────────────────────────────────────────────

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
    description: "Stores and releases electrical energy",
    category: "Electrical",
    typicalUse: "Starts/runs compressor and fan motors",
  },
  {
    name: "Contactor",
    description: "Electrically controlled switch",
    category: "Electrical",
    typicalUse: "Switches high voltage to compressor",
  },
  {
    name: "TXV (Thermostatic Expansion Valve)",
    description: "Regulates refrigerant flow into evaporator",
    category: "Refrigerant",
    typicalUse: "Metering device in split systems",
  },
  {
    name: "Filter Drier",
    description: "Removes moisture and debris from refrigerant",
    category: "Refrigerant",
    typicalUse: "Installed on liquid line",
  },
  {
    name: "Reversing Valve",
    description: "Switches between heat and cool mode",
    category: "Refrigerant",
    typicalUse: "Heat pumps",
  },
  {
    name: "Blower Motor",
    description: "Moves air across evaporator coil",
    category: "Mechanical",
    typicalUse: "Indoor air handler",
  },
  {
    name: "Fan Blade",
    description: "Moves air across condenser coil",
    category: "Mechanical",
    typicalUse: "Outdoor condenser unit",
  },
  {
    name: "Run Capacitor",
    description: "Keeps motor running efficiently after startup",
    category: "Electrical",
    typicalUse: "Compressor and fan motors",
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

  return (
    <Card
      className="border border-border overflow-hidden"
      data-ocid={`parts.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => details && setExpanded((v) => !v)}
        aria-expanded={details ? expanded : undefined}
        style={details ? undefined : { cursor: "default" }}
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
            {details && (
              <div className="flex-shrink-0 mt-0.5">
                {expanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </button>

      {details && expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          {/* Part Image */}
          {(() => {
            const vk = nameToVisualKey[part.name];
            const v = vk ? componentVisuals[vk] : null;
            return v ? (
              <div className="flex justify-center pb-1">
                <img
                  src={v.imageSrc}
                  alt={part.name}
                  className="h-36 object-contain rounded-lg opacity-95"
                />
              </div>
            ) : null;
          })()}
          {/* Common Symptoms */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Common Symptoms
            </p>
            <div className="flex flex-wrap gap-1.5">
              {details.commonSymptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>

          {/* Function */}
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Function
            </p>
            <p className="text-sm text-foreground">{details.function}</p>
          </div>

          {/* How to Check */}
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              How to Check
            </p>
            <p className="text-sm text-foreground">{details.howToCheck}</p>
          </div>

          {/* Replacement Note */}
          <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2.5">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {details.replacementNote}
            </p>
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

  const filtered = parts.filter((p) =>
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
