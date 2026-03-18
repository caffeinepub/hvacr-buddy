import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Play,
  RotateCcw,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// ─── Study Data ────────────────────────────────────────────────
const STUDY_TOPICS = [
  {
    id: "hvac-basics",
    title: "HVAC Basics",
    subtitle: "System types, components, and how they work together",
    bullets: [
      "Heating, cooling, and ventilation work together to control indoor climate",
      "Refrigerant absorbs heat indoors and releases it outdoors",
      "Common system types: split systems, packaged units, heat pumps",
      "Key components: compressor, condenser, evaporator, metering device",
      "Regular maintenance includes filter changes and coil cleaning",
    ],
  },
  {
    id: "electrical-fundamentals",
    title: "Electrical Fundamentals",
    subtitle: "Voltage, current, resistance, and HVAC circuits",
    bullets: [
      "Voltage (V) is electrical pressure; current (A) is flow; resistance (Ω) opposes flow",
      "Ohm's Law: V = I × R",
      "Series circuits share the same current; parallel circuits share the same voltage",
      "HVAC systems use both 24V control circuits and 240V power circuits",
      "Always de-energize before working on electrical components",
    ],
  },
  {
    id: "multimeter-usage",
    title: "Multimeter Usage",
    subtitle: "Measuring voltage, resistance, and continuity",
    bullets: [
      "Use AC voltage setting to check line voltage (240V or 120V)",
      "Use DC voltage for control board signals",
      "Resistance mode checks continuity of fuses, contacts, and windings",
      "Microamps mode tests flame sensor signals on furnaces",
      "Always check leads and settings before measuring",
    ],
  },
  {
    id: "refrigeration-concepts",
    title: "Refrigeration Concepts",
    subtitle: "Superheat, subcooling, and the refrigerant cycle",
    bullets: [
      "Refrigerant changes state (liquid ↔ vapor) to move heat",
      "Evaporator absorbs heat; condenser releases heat",
      "Superheat: degrees of vapor above boiling point at suction line",
      "Subcooling: degrees of liquid below condensing point at liquid line",
      "Proper charge = correct superheat AND subcooling values",
    ],
  },
];

// ─── Videos Data ───────────────────────────────────────────────
const VIDEO_CATEGORIES = [
  {
    id: "epa-608",
    title: "EPA 608 Certification",
    relatedTab: "epa608",
    relatedLabel: "View EPA 608 Study Topics",
    videos: [
      {
        id: "BLtBaCt81i4",
        title: "EPA 608 Core Prep Part 1",
        description:
          "First part of the Core exam prep covering ozone depletion, refrigerant regulations, and EPA 608 requirements.",
      },
      {
        id: "gi-RkhawFGU",
        title: "EPA 608 Core Prep Part 2",
        description:
          "Continues Core exam prep with refrigerant recovery, recycling, and reclamation rules.",
      },
      {
        id: "wZH058B3x54",
        title: "EPA 608 Type 1 Prep",
        description:
          "Study guide for Type I certification covering small appliances and passive/active recovery methods.",
      },
      {
        id: "Mnl_KY-D59A",
        title: "EPA 608 Type 2 Prep",
        description:
          "Covers high-pressure refrigerant systems, recovery requirements, and Type II exam topics.",
      },
      {
        id: "CXMLkI1WMcQ",
        title: "EPA 608 Type 3 Prep",
        description:
          "Covers low-pressure chiller systems, R-11/R-123 handling, and Type III exam preparation.",
      },
    ],
  },
  {
    id: "electrical-schematics",
    title: "Electrical and Schematics",
    relatedTab: "study",
    relatedLabel: "View Electrical Study Topics",
    videos: [
      {
        id: "VtC25cV1mU0",
        title: "How Power Moves Through an AC System Schematic",
        description:
          "Visual walkthrough of how electrical power flows through an AC system using a wiring schematic.",
      },
    ],
  },
  {
    id: "refrigerant-diagnostics",
    title: "Refrigerant Diagnostics",
    relatedTab: "diagnose-measurements",
    relatedLabel: "Open Measurement Diagnostic Tool",
    videos: [
      {
        id: "fROHlPXw_H0",
        title: "How to Remove (Recover) Refrigerant From a Running AC System",
        description:
          "Step-by-step procedure for safely recovering refrigerant from a live system using a recovery machine.",
      },
      {
        id: "JsnQeUSuUMU",
        title: "How to Evacuate an AC System (Full Vacuum Procedure)",
        description:
          "Full vacuum procedure for evacuating an AC system to remove moisture and non-condensables before charging.",
      },
    ],
  },
  {
    id: "hvac-fundamentals",
    title: "HVAC Fundamentals",
    relatedTab: "study",
    relatedLabel: "View HVAC Study Topics",
    videos: [],
  },
  {
    id: "tools-procedures",
    title: "HVAC Tools and Procedures",
    relatedTab: "tools",
    relatedLabel: "View Tools Section",
    videos: [],
  },
];

// ─── Diagrams Data ─────────────────────────────────────────────
const DIAGRAMS = [
  {
    id: "refrigeration-cycle",
    title: "Refrigeration Cycle",
    description: "Shows the 4-stage refrigerant loop.",
    content: `[Evaporator] → absorbs heat, refrigerant evaporates
     ↓
[Compressor] → raises pressure and temperature
     ↓
[Condenser] → releases heat, refrigerant condenses
     ↓
[Metering Device] → drops pressure, cycle repeats`,
  },
  {
    id: "24v-control-circuit",
    title: "24V Control Circuit",
    description: "Low-voltage circuit that controls HVAC operation.",
    content: `Transformer (240V → 24V)
     ↓
Thermostat (R, G, Y, W terminals)
     ↓
Control Board
     ↓
Contactors / Relays → Start components`,
  },
  {
    id: "contactor-wiring",
    title: "Contactor Wiring",
    description:
      "How a contactor connects power to the compressor and condenser fan.",
    content: `L1 ──[Contactor L1]──► T1 → Compressor
L2 ──[Contactor L2]──► T2 → Compressor

Coil A1/A2 (24V) ← from control board
When coil energized: contacts close → power flows`,
  },
  {
    id: "capacitor-wiring",
    title: "Capacitor Wiring",
    description: "Run and start capacitor connections.",
    content: `Dual Run Capacitor:
HERM terminal → Compressor start winding
FAN terminal  → Condenser fan motor
COM terminal  → Common (shared return)

Higher µF = compressor side
Lower µF  = fan side`,
  },
  {
    id: "airflow-diagram",
    title: "Airflow Diagram",
    description: "Return and supply air path through the system.",
    content: `Return Air → Filter → Evaporator Coil → Blower
     ↓
Supply Plenum → Ductwork → Supply Registers

Static pressure increases with dirty filter or blocked ducts
Proper CFM = ~400 CFM per ton of cooling`,
  },
];

// ─── EPA 608 Topics Data ───────────────────────────────────────
const EPA_608_TOPICS = [
  {
    id: "core",
    title: "Core",
    subtitle: "Regulations, ozone depletion, and general practices",
    explanation:
      "Covers refrigerant regulations, ozone depletion, section 608 of the Clean Air Act, and general practices required for all technicians.",
    keyConcepts: [
      "Section 608 of Clean Air Act",
      "Ozone depletion potential (ODP)",
      "Global warming potential (GWP)",
      "Venting prohibition",
      "Required certification levels",
    ],
    bullets: [
      "Safety regulations require proper handling of all refrigerants",
      "Refrigerant types: CFCs (highest ODP), HCFCs (moderate ODP), HFCs (zero ODP)",
      "Intentional venting of refrigerants is illegal under the Clean Air Act",
      "Only certified technicians may purchase refrigerants in containers over 2 lbs",
      "Refrigerant must be recovered before opening any system",
      "Records of refrigerant purchases and use must be kept for 3 years",
      "Reclaimed refrigerant meets purity standards for reuse",
      "De minimis exemptions allow incidental releases during normal good-faith operation",
    ],
  },
  {
    id: "type1",
    title: "Type I",
    subtitle: "Small appliances with 5 lbs or less of refrigerant",
    explanation:
      "Covers small appliances containing 5 lbs or less of refrigerant (R-12 window ACs, household fridges).",
    keyConcepts: [
      "Small appliances ≤5 lbs refrigerant",
      "Self-contained recovery",
      "System-dependent recovery",
      "EPA recovery requirements",
      "R-12 and R-134a",
    ],
    bullets: [
      "Sealed systems typically include household refrigerators and window ACs",
      "Refrigerant must be recovered before disposal or major repair",
      "System-dependent recovery uses the appliance's own compressor",
      "Self-contained recovery equipment works independently of the system",
      "90% recovery efficiency required when system compressor is working",
      "80% efficiency required when compressor is inoperative",
      "No venting allowed — even small amounts must be captured",
    ],
  },
  {
    id: "type2",
    title: "Type II",
    subtitle: "High-pressure appliances above 5 lbs",
    explanation:
      "Covers systems using high-pressure refrigerants such as R-22, R-410A, R-134a above 5 lbs.",
    keyConcepts: [
      "High-pressure refrigerants",
      "R-22, R-410A, R-134a",
      "Recovery equipment certification",
      "Leak rate requirements",
      "90% recovery efficiency",
    ],
    bullets: [
      "Includes commercial and residential AC systems above 5 lbs",
      "Manifold gauges used to measure suction and discharge pressures",
      "Refrigerant must be recovered before opening any part of the system",
      "Technicians must detect and report leaks in systems over 50 lbs",
      "Leaks in systems over 50 lbs must be repaired within 30 days",
      "Evacuation required after recovery and before recharging",
      "90% recovery efficiency required for high-pressure appliances",
    ],
  },
  {
    id: "type3",
    title: "Type III",
    subtitle: "Low-pressure appliances and large chillers",
    explanation:
      "Covers low-pressure systems using R-11, R-113, R-123 typically in large commercial chillers.",
    keyConcepts: [
      "Low-pressure refrigerants",
      "R-11, R-113, R-123",
      "Chiller systems",
      "Purge units",
      "Leak detection",
    ],
    bullets: [
      "Used in large commercial centrifugal chiller systems",
      "Low-pressure means boiling point above 0°F at atmospheric pressure",
      "Systems operate below atmospheric pressure (vacuum conditions)",
      "Purge units remove non-condensable gases like air that infiltrate the system",
      "Air infiltration reduces efficiency and raises head pressure",
      "Up to 35% annual leak rate allowed before repair is required",
      "Special recovery procedures required due to sub-atmospheric operation",
    ],
  },
];

// ─── EPA 608 Quiz Data ─────────────────────────────────────────
type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const EPA_608_QUIZ: Record<string, QuizQuestion[]> = {
  core: [
    {
      question: "What law regulates refrigerant handling in the US?",
      options: [
        "Clean Air Act",
        "OSHA Act",
        "Energy Policy Act",
        "Refrigerant Control Act",
      ],
      answer: 0,
      explanation:
        "Section 608 of the Clean Air Act prohibits venting and requires technician certification.",
    },
    {
      question:
        "Which refrigerants have the highest ozone depletion potential?",
      options: ["HFCs", "HCFCs", "CFCs", "Natural refrigerants"],
      answer: 2,
      explanation:
        "CFCs like R-11 and R-12 have the highest ODP due to their chlorine content.",
    },
    {
      question: "It is illegal to intentionally vent which refrigerants?",
      options: ["CFCs only", "HFCs only", "CFCs and HCFCs", "All refrigerants"],
      answer: 3,
      explanation:
        "The EPA prohibits venting of all refrigerants used in MVAC and commercial/industrial equipment.",
    },
    {
      question: 'What is the "de minimis" exemption?',
      options: [
        "Allows small venting during normal operations",
        "Exempts homeowners from certification",
        "Allows venting HFCs only",
        "No exemptions exist",
      ],
      answer: 0,
      explanation:
        "De minimis allows release of small amounts during normal good-faith operation but does not allow intentional venting.",
    },
    {
      question: "Who must be certified under Section 608?",
      options: [
        "Only service contractors",
        "Anyone who purchases refrigerant",
        "Technicians who open refrigerant circuits",
        "Everyone who owns HVAC equipment",
      ],
      answer: 2,
      explanation:
        "Technicians who maintain, service, repair, or dispose of appliances must be certified.",
    },
    {
      question: "Which organization administers EPA 608 certification tests?",
      options: [
        "EPA directly",
        "ASHRAE",
        "EPA-approved certifying organizations",
        "Local government",
      ],
      answer: 2,
      explanation:
        "The EPA approves private certifying organizations to administer the tests.",
    },
    {
      question: "What does ODP stand for?",
      options: [
        "Ozone Depletion Potential",
        "Optimal Discharge Pressure",
        "Ozone Detection Protocol",
        "Operating Design Pressure",
      ],
      answer: 0,
      explanation:
        "ODP measures how much a refrigerant degrades the ozone layer compared to R-11.",
    },
    {
      question: "Refrigerant records must be kept for how long?",
      options: ["1 year", "3 years", "5 years", "10 years"],
      answer: 1,
      explanation:
        "EPA requires refrigerant purchase and use records to be kept for at least 3 years.",
    },
    {
      question: "Which refrigerant type is being phased down due to GWP?",
      options: ["CFCs", "HCFCs", "HFCs", "Natural refrigerants"],
      answer: 2,
      explanation:
        "HFCs are being phased down under the AIM Act due to high global warming potential.",
    },
    {
      question: "What is required before opening a refrigerant circuit?",
      options: [
        "Add nitrogen",
        "Recover refrigerant",
        "Add dye",
        "Leak check only",
      ],
      answer: 1,
      explanation:
        "Refrigerant must be recovered before opening any refrigerant-containing system.",
    },
  ],
  type1: [
    {
      question: "Small appliances under Type I contain how much refrigerant?",
      options: [
        "Less than 2 lbs",
        "5 lbs or less",
        "Between 5–15 lbs",
        "More than 15 lbs",
      ],
      answer: 1,
      explanation:
        "Type I covers appliances with 5 lbs or less of refrigerant, such as window ACs and household refrigerators.",
    },
    {
      question: "What recovery method requires no separate equipment?",
      options: [
        "Active recovery",
        "System-dependent recovery",
        "Passive recovery",
        "Manual recovery",
      ],
      answer: 1,
      explanation:
        "System-dependent recovery uses the appliance's own compressor to remove refrigerant.",
    },
    {
      question:
        "What refrigerant is common in older window AC units covered under Type I?",
      options: ["R-22", "R-410A", "R-12", "R-134a"],
      answer: 2,
      explanation:
        "R-12 (a CFC) was commonly used in older small appliances before the phase-out.",
    },
    {
      question: "When must refrigerant be recovered from a small appliance?",
      options: [
        "Only if it's leaking",
        "Before disposal or major repair",
        "Only for R-12 systems",
        "Never required for small systems",
      ],
      answer: 1,
      explanation:
        "Recovery is required before disposing of or making major repairs to any small appliance.",
    },
    {
      question:
        "What recovery efficiency is required for Type I systems with a working compressor?",
      options: ["80%", "90%", "95%", "100%"],
      answer: 1,
      explanation:
        "90% recovery efficiency is required when the system compressor is operational.",
    },
    {
      question: "What efficiency is required if the compressor is not working?",
      options: ["70%", "80%", "85%", "90%"],
      answer: 1,
      explanation:
        "When the compressor is inoperative, 80% recovery efficiency is required.",
    },
    {
      question: "Which of the following is a Type I appliance?",
      options: [
        "100-ton chiller",
        "Rooftop package unit",
        "Household refrigerator",
        "Commercial walk-in cooler",
      ],
      answer: 2,
      explanation:
        "Household refrigerators typically contain 5 lbs or less of refrigerant and fall under Type I.",
    },
    {
      question: "Technicians performing Type I recovery must use EPA-approved:",
      options: [
        "Nitrogen tanks",
        "Recovery equipment",
        "Refrigerant cylinders",
        "All of the above",
      ],
      answer: 1,
      explanation:
        "EPA-approved recovery equipment must be used for all refrigerant recovery operations.",
    },
    {
      question: "What must be done with recovered refrigerant?",
      options: [
        "Vent it outside",
        "Recycle, reclaim, or properly dispose",
        "Store indefinitely",
        "Return only to manufacturer",
      ],
      answer: 1,
      explanation:
        "Recovered refrigerant must be recycled, reclaimed, or properly disposed of — never vented.",
    },
    {
      question: "Intentionally venting refrigerant from a small appliance is:",
      options: [
        "Legal in small amounts",
        "Allowed for R-134a",
        "Illegal under the Clean Air Act",
        "Permitted by homeowners",
      ],
      answer: 2,
      explanation:
        "Intentional venting is illegal for all refrigerants in all appliances under Section 608.",
    },
  ],
  type2: [
    {
      question:
        "Type II covers appliances using high-pressure refrigerants with more than how many pounds?",
      options: ["2 lbs", "5 lbs", "10 lbs", "15 lbs"],
      answer: 1,
      explanation:
        "Type II covers appliances with more than 5 lbs of high-pressure refrigerant.",
    },
    {
      question:
        "Which refrigerant is a high-pressure refrigerant covered under Type II?",
      options: ["R-11", "R-123", "R-410A", "R-113"],
      answer: 2,
      explanation:
        "R-410A is a high-pressure refrigerant commonly used in residential and commercial AC systems.",
    },
    {
      question:
        "What percent recovery efficiency is required for Type II systems?",
      options: ["70%", "80%", "90%", "95%"],
      answer: 2,
      explanation:
        "90% recovery efficiency is required for high-pressure appliances.",
    },
    {
      question:
        "Leak rate limits for commercial refrigeration systems above 50 lbs:",
      options: ["5% annually", "10% annually", "20% annually", "35% annually"],
      answer: 1,
      explanation:
        "Commercial refrigeration systems over 50 lbs must not exceed 10% annual leak rate without repair.",
    },
    {
      question:
        "What document must be kept when purchasing more than 2 lbs of refrigerant?",
      options: [
        "Work order",
        "Refrigerant purchase log",
        "Building permit",
        "Technician license",
      ],
      answer: 1,
      explanation:
        "A refrigerant purchase and use log must be maintained when purchases exceed 2 lbs.",
    },
    {
      question:
        "Before connecting manifold gauges to a system, the technician should:",
      options: [
        "Purge hoses with refrigerant",
        "Purge hoses with nitrogen",
        "Evacuate the system",
        "Check static pressure only",
      ],
      answer: 0,
      explanation:
        "Hoses should be purged of air by briefly opening them to the refrigerant side before connecting to the system.",
    },
    {
      question: "R-22 is classified as:",
      options: ["CFC", "HCFC", "HFC", "Natural refrigerant"],
      answer: 1,
      explanation:
        "R-22 is an HCFC (hydrochlorofluorocarbon), being phased out due to ozone depletion potential.",
    },
    {
      question: "What tool is used to measure refrigerant pressures?",
      options: [
        "Multimeter",
        "Manifold gauge set",
        "Megohmmeter",
        "Thermometer",
      ],
      answer: 1,
      explanation:
        "A manifold gauge set measures suction and discharge pressures in refrigerant systems.",
    },
    {
      question:
        "What must technicians do if a leak is discovered in a system with more than 50 lbs?",
      options: [
        "Continue operating",
        "Repair within 30 days",
        "Recover and scrap",
        "Report to state only",
      ],
      answer: 1,
      explanation:
        "Leaks in systems over 50 lbs must be repaired within 30 days of discovery.",
    },
    {
      question:
        "High-pressure refrigerants are defined as having a boiling point of:",
      options: [
        "Below -50°F at atmospheric pressure",
        "Above 0°F at atmospheric pressure",
        "Between -50°F and 0°F",
        "Exactly -40°F",
      ],
      answer: 0,
      explanation:
        "High-pressure refrigerants have a boiling point below -50°F at atmospheric pressure.",
    },
  ],
  type3: [
    {
      question: "Type III covers which type of appliances?",
      options: [
        "Small window units",
        "High-pressure chillers",
        "Low-pressure chillers",
        "All refrigeration equipment",
      ],
      answer: 2,
      explanation:
        "Type III covers low-pressure appliances typically used in large commercial chiller systems.",
    },
    {
      question:
        "Which refrigerant is classified as low-pressure under Type III?",
      options: ["R-22", "R-410A", "R-11", "R-134a"],
      answer: 2,
      explanation:
        "R-11 (a CFC) is a low-pressure refrigerant used in large centrifugal chillers.",
    },
    {
      question: "Low-pressure refrigerants have a boiling point:",
      options: [
        "Below -50°F",
        "Between -50°F and 0°F",
        "Above 0°F at atmospheric pressure",
        "Exactly 0°F",
      ],
      answer: 2,
      explanation:
        "Low-pressure refrigerants boil above 0°F at atmospheric pressure, operating at sub-atmospheric pressures.",
    },
    {
      question:
        "What device on a low-pressure chiller removes non-condensable gases?",
      options: ["Expansion valve", "Purge unit", "Compressor", "Dryer"],
      answer: 1,
      explanation:
        "Purge units are used on low-pressure chillers to remove air and non-condensable gases that accumulate.",
    },
    {
      question: "What is the allowable leak rate for low-pressure appliances?",
      options: ["5% per year", "10% per year", "35% per year", "No limit"],
      answer: 2,
      explanation:
        "Low-pressure appliances (comfort cooling) are allowed up to 35% annual leak rate before repair is required.",
    },
    {
      question: "Low-pressure systems operate at:",
      options: [
        "High positive pressure",
        "Slightly above atmospheric",
        "Below atmospheric pressure (vacuum)",
        "Exactly atmospheric",
      ],
      answer: 2,
      explanation:
        "Low-pressure refrigerants operate at pressures below atmospheric (in a vacuum state), so air can infiltrate if there are leaks.",
    },
    {
      question: "R-123 is used in Type III systems as a replacement for:",
      options: ["R-22", "R-11", "R-410A", "R-12"],
      answer: 1,
      explanation:
        "R-123 is an HCFC used as a transitional replacement for R-11 in low-pressure centrifugal chillers.",
    },
    {
      question:
        "Why is air infiltration especially dangerous in low-pressure systems?",
      options: [
        "It raises efficiency",
        "It causes high pressure",
        "Non-condensables reduce efficiency and cause pressure problems",
        "It cools faster",
      ],
      answer: 2,
      explanation:
        "Air infiltration introduces non-condensables that increase head pressure and reduce system efficiency.",
    },
    {
      question:
        "What is the recovery requirement vacuum level for low-pressure appliances?",
      options: ["25 in Hg", "29 in Hg", "27 in Hg", "15 in Hg"],
      answer: 2,
      explanation:
        "Low-pressure appliances require evacuation to 25 mm Hg absolute (approximately 27 in Hg vacuum).",
    },
    {
      question:
        "A centrifugal chiller using R-11 would fall under which certification type?",
      options: ["Type I", "Type II", "Type III", "Universal"],
      answer: 2,
      explanation:
        "Centrifugal chillers using R-11 operate at low pressures and are covered under Type III certification.",
    },
  ],
};

// ─── EPA 608 Videos Data ───────────────────────────────────────
const EPA_608_VIDEOS = [
  {
    id: "epa608-core",
    title: "Core",
    subtitle: "Regulations, ozone depletion, and general practices",
    links: [
      {
        label: "EPA 608 Core Exam Study Guide",
        url: "https://www.youtube.com/watch?v=6W8P6DKrLKs",
      },
      {
        label: "Refrigerant Regulations Overview",
        url: "https://www.youtube.com/watch?v=4QH9p0eMkB4",
      },
      {
        label: "Section 608 Overview",
        url: "https://www.youtube.com/watch?v=4lFv0d4YwNs",
      },
    ],
  },
  {
    id: "epa608-type1",
    title: "Type I",
    subtitle: "Small appliances and recovery techniques",
    links: [
      {
        label: "EPA 608 Type I Small Appliances",
        url: "https://www.youtube.com/watch?v=5rDm6OQYDNE",
      },
      {
        label: "Recovery Techniques for Small Appliances",
        url: "https://www.youtube.com/watch?v=l2Oc5e6qBrc",
      },
      {
        label: "Small Appliance Refrigerant Recovery",
        url: "https://www.youtube.com/watch?v=Vn8pKWuNI6k",
      },
    ],
  },
  {
    id: "epa608-type2",
    title: "Type II",
    subtitle: "High-pressure refrigerants and commercial systems",
    links: [
      {
        label: "High-Pressure Refrigerants Explained",
        url: "https://www.youtube.com/watch?v=M8dWxPvMhAE",
      },
      {
        label: "R-22 vs R-410A Recovery",
        url: "https://www.youtube.com/watch?v=lOC3JzNkUsw",
      },
      {
        label: "Type II Exam Prep",
        url: "https://www.youtube.com/watch?v=YmFNADQjAic",
      },
    ],
  },
  {
    id: "epa608-type3",
    title: "Type III",
    subtitle: "Low-pressure chillers and special procedures",
    links: [
      {
        label: "Low-Pressure Chiller Systems",
        url: "https://www.youtube.com/watch?v=yw3Hag7FvTs",
      },
      {
        label: "R-11 and R-123 Type III Guide",
        url: "https://www.youtube.com/watch?v=SLkEP_Zy3CE",
      },
      {
        label: "Type III Certification Overview",
        url: "https://www.youtube.com/watch?v=IJ5sW9FHZAU",
      },
    ],
  },
];

// ─── Study Tab ─────────────────────────────────────────────────
function StudyTab() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-2" data-ocid="learn.study.list">
      {STUDY_TOPICS.map((topic, i) => {
        const isOpen = openId === topic.id;
        return (
          <Card
            key={topic.id}
            className="overflow-hidden"
            data-ocid={`learn.study.item.${i + 1}`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-accent/50 transition-colors"
              onClick={() => toggle(topic.id)}
              data-ocid={`learn.study.toggle.${i + 1}`}
            >
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {topic.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {topic.subtitle}
                </p>
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <CardContent className="pt-0 pb-4 px-4 border-t border-border">
                <ul className="space-y-2 mt-3">
                  {topic.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── Videos Tab ────────────────────────────────────────────────
function VideosTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [openCatId, setOpenCatId] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  function toggleCat(id: string) {
    setOpenCatId((prev) => {
      if (prev === id) {
        setPlayingVideoId(null);
        return null;
      }
      setPlayingVideoId(null);
      return id;
    });
  }

  function playVideo(videoId: string) {
    setPlayingVideoId((prev) => (prev === videoId ? null : videoId));
  }

  function handleRelatedClick(relatedTab: string) {
    if (relatedTab === "diagnose-measurements") {
      window.location.href = "/diagnose";
    } else if (relatedTab === "tools") {
      window.location.href = "/tools";
    } else {
      onNavigate(relatedTab);
    }
  }

  return (
    <div className="flex flex-col gap-2" data-ocid="learn.videos.list">
      {VIDEO_CATEGORIES.map((cat, i) => {
        const isOpen = openCatId === cat.id;
        return (
          <Card
            key={cat.id}
            className="overflow-hidden"
            data-ocid={`learn.videos.item.${i + 1}`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-accent/50 transition-colors"
              onClick={() => toggleCat(cat.id)}
              data-ocid={`learn.videos.toggle.${i + 1}`}
            >
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {cat.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cat.videos.length > 0
                    ? `${cat.videos.length} video${cat.videos.length === 1 ? "" : "s"}`
                    : "Coming soon"}
                </p>
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <CardContent className="pt-0 pb-4 px-4 border-t border-border">
                <ul className="mt-3 flex flex-col gap-3">
                  {cat.videos.length === 0 && (
                    <li className="text-sm text-muted-foreground py-1">
                      Videos coming soon.
                    </li>
                  )}
                  {cat.videos.map((video, vi) => (
                    <li key={video.id} data-ocid={`learn.videos.item.${i + 1}`}>
                      {playingVideoId === video.id ? (
                        <div className="rounded-lg overflow-hidden border border-border">
                          <div className="flex items-center justify-between px-3 py-2 bg-muted/50">
                            <p className="text-xs font-medium text-foreground truncate">
                              {video.title}
                            </p>
                            <button
                              type="button"
                              onClick={() => setPlayingVideoId(null)}
                              className="ml-2 flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                              data-ocid={`learn.videos.close_button.${vi + 1}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div
                            style={{
                              position: "relative",
                              paddingTop: "56.25%",
                            }}
                          >
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
                              title={video.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: "none",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-accent/40 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-snug">
                              {video.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {video.description}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0 h-8 gap-1.5 text-xs"
                            onClick={() => playVideo(video.id)}
                            data-ocid={`learn.videos.button.${vi + 1}`}
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Play
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary hover:text-primary/80 h-7 px-2"
                    onClick={() => handleRelatedClick(cat.relatedTab)}
                    data-ocid={`learn.videos.link.${i + 1}`}
                  >
                    <ExternalLink className="h-3 w-3 mr-1.5" />
                    {cat.relatedLabel}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── Diagrams Tab ──────────────────────────────────────────────
function DiagramsTab() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-2" data-ocid="learn.diagrams.list">
      {DIAGRAMS.map((diagram, i) => {
        const isOpen = openId === diagram.id;
        return (
          <Card
            key={diagram.id}
            className="overflow-hidden"
            data-ocid={`learn.diagrams.item.${i + 1}`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-accent/50 transition-colors"
              onClick={() => toggle(diagram.id)}
              data-ocid={`learn.diagrams.toggle.${i + 1}`}
            >
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {diagram.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {diagram.description}
                </p>
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <CardContent className="pt-0 pb-4 px-4 border-t border-border">
                <pre className="mt-3 text-xs text-foreground font-mono bg-muted rounded-md p-3 leading-relaxed overflow-x-auto whitespace-pre">
                  {diagram.content}
                </pre>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── EPA 608 Tab ───────────────────────────────────────────────
function Epa608TopicsSubTab() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-2" data-ocid="learn.epa608.topics.list">
      {EPA_608_TOPICS.map((topic, i) => {
        const isOpen = openId === topic.id;
        return (
          <Card
            key={topic.id}
            className="overflow-hidden"
            data-ocid={`learn.epa608.topics.item.${i + 1}`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-accent/50 transition-colors"
              onClick={() => toggle(topic.id)}
              data-ocid={`learn.epa608.topics.toggle.${i + 1}`}
            >
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {topic.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {topic.subtitle}
                </p>
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <CardContent className="pt-0 pb-4 px-4 border-t border-border">
                <p className="mt-3 text-sm text-muted-foreground">
                  {topic.explanation}
                </p>

                <p className="mt-3 mb-2 text-xs font-semibold text-foreground uppercase tracking-wide">
                  Key Concepts
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {topic.keyConcepts.map((concept) => (
                    <Badge
                      key={concept}
                      variant="secondary"
                      className="text-xs"
                    >
                      {concept}
                    </Badge>
                  ))}
                </div>

                <p className="mb-2 text-xs font-semibold text-foreground uppercase tracking-wide">
                  What to Know
                </p>
                <ul className="space-y-2">
                  {topic.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function Epa608QuizSubTab() {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const quizSections = [
    { key: "core", label: "Core", subtitle: "Regulations & General Practices" },
    { key: "type1", label: "Type I", subtitle: "Small Appliances" },
    { key: "type2", label: "Type II", subtitle: "High-Pressure Appliances" },
    { key: "type3", label: "Type III", subtitle: "Low-Pressure Appliances" },
  ];

  function startQuiz(key: string) {
    setActiveQuiz(key);
    setAnswers({});
  }

  function resetQuiz() {
    setAnswers({});
  }

  function selectAnswer(questionIndex: number, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  }

  if (!activeQuiz) {
    return (
      <div className="flex flex-col gap-2" data-ocid="learn.epa608.quiz.list">
        {quizSections.map((section, i) => (
          <Card key={section.key} data-ocid={`learn.epa608.quiz.item.${i + 1}`}>
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-accent/50 transition-colors"
              onClick={() => startQuiz(section.key)}
              data-ocid={`learn.epa608.quiz.start.${i + 1}`}
            >
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {section.label} Quiz
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {section.subtitle} — {EPA_608_QUIZ[section.key].length}{" "}
                  questions
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>
          </Card>
        ))}
      </div>
    );
  }

  const questions = EPA_608_QUIZ[activeQuiz];
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.entries(answers).filter(
    ([idx, chosen]) => questions[Number(idx)].answer === chosen,
  ).length;
  const sectionLabel =
    quizSections.find((s) => s.key === activeQuiz)?.label ?? "";

  return (
    <div data-ocid="learn.epa608.quiz.panel">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-semibold text-foreground text-sm">
            {sectionLabel} Quiz
          </p>
          <p className="text-xs text-muted-foreground">
            {questions.length} questions
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveQuiz(null)}
          data-ocid="learn.epa608.quiz.cancel_button"
        >
          ← Back
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const hasAnswered = chosen !== undefined;
          const isCorrect = hasAnswered && chosen === q.answer;

          return (
            <Card
              key={q.question}
              className="overflow-hidden"
              data-ocid={`learn.epa608.quiz.row.${qi + 1}`}
            >
              <CardContent className="px-4 py-4">
                <p className="font-medium text-sm text-foreground mb-3">
                  <span className="text-muted-foreground mr-1">{qi + 1}.</span>
                  {q.question}
                </p>
                <div className="flex flex-col gap-2">
                  {q.options.map((option, oi) => {
                    let btnClass =
                      "w-full text-left px-3 py-2 rounded-md border text-sm transition-colors ";
                    if (!hasAnswered) {
                      btnClass +=
                        "border-border hover:bg-accent/50 text-foreground";
                    } else if (oi === q.answer) {
                      btnClass +=
                        "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200";
                    } else if (oi === chosen) {
                      btnClass +=
                        "border-red-400 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200";
                    } else {
                      btnClass += "border-border text-muted-foreground";
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        className={btnClass}
                        onClick={() => !hasAnswered && selectAnswer(qi, oi)}
                        disabled={hasAnswered}
                        data-ocid={`learn.epa608.quiz.radio.${qi + 1}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {hasAnswered && (
                  <div
                    className={`mt-3 flex items-start gap-2 text-sm ${
                      isCorrect
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-600 dark:text-red-400"
                    }`}
                    data-ocid={`learn.epa608.quiz.${isCorrect ? "success" : "error"}_state.${qi + 1}`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <span>{q.explanation}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {answeredCount > 0 && (
        <div
          className="mt-4 p-4 rounded-lg bg-muted text-center"
          data-ocid="learn.epa608.quiz.panel"
        >
          <p className="text-sm font-semibold text-foreground">
            Score: {correctCount} / {answeredCount} answered correctly
          </p>
          {answeredCount === questions.length && (
            <p className="text-xs text-muted-foreground mt-1">
              {correctCount === questions.length
                ? "🎉 Perfect score!"
                : `${questions.length - correctCount} to review`}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetQuiz}
          className="flex items-center gap-1.5"
          data-ocid="learn.epa608.quiz.secondary_button"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry Quiz
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveQuiz(null)}
          data-ocid="learn.epa608.quiz.cancel_button"
        >
          Back to Quizzes
        </Button>
      </div>
    </div>
  );
}

function Epa608VideosSubTab() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-2" data-ocid="learn.epa608.videos.list">
      {EPA_608_VIDEOS.map((cat, i) => {
        const isOpen = openId === cat.id;
        return (
          <Card
            key={cat.id}
            className="overflow-hidden"
            data-ocid={`learn.epa608.videos.item.${i + 1}`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-accent/50 transition-colors"
              onClick={() => toggle(cat.id)}
              data-ocid={`learn.epa608.videos.toggle.${i + 1}`}
            >
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {cat.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cat.subtitle}
                </p>
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <CardContent className="pt-0 pb-3 px-4 border-t border-border">
                <ul className="mt-2 space-y-1">
                  {cat.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 py-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function Epa608Tab() {
  return (
    <div>
      <div className="mb-4">
        <p className="text-sm font-semibold text-foreground">
          EPA 608 Certification
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Study topics, practice tests, and training videos for all four
          certification types.
        </p>
      </div>
      <Tabs defaultValue="topics" className="w-full">
        <TabsList className="mb-4 w-full" data-ocid="learn.epa608.subtab">
          <TabsTrigger
            value="topics"
            className="flex-1 text-xs"
            data-ocid="learn.epa608.topics.tab"
          >
            Topics
          </TabsTrigger>
          <TabsTrigger
            value="tests"
            className="flex-1 text-xs"
            data-ocid="learn.epa608.tests.tab"
          >
            Practice Tests
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="flex-1 text-xs"
            data-ocid="learn.epa608.videos.tab"
          >
            Videos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="topics">
          <Epa608TopicsSubTab />
        </TabsContent>
        <TabsContent value="tests">
          <Epa608QuizSubTab />
        </TabsContent>
        <TabsContent value="videos">
          <Epa608VideosSubTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── LearnPage ─────────────────────────────────────────────────
export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<string>("study");
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              data-ocid="learn.back_button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Learn</h1>
            <p className="text-sm text-muted-foreground">
              Study guides, videos, and reference diagrams.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-5 w-full" data-ocid="learn.tab">
            <TabsTrigger
              value="study"
              className="flex-1 text-xs"
              data-ocid="learn.study.tab"
            >
              Study
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="flex-1 text-xs"
              data-ocid="learn.videos.tab"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="diagrams"
              className="flex-1 text-xs"
              data-ocid="learn.diagrams.tab"
            >
              Diagrams
            </TabsTrigger>
            <TabsTrigger
              value="epa608"
              className="flex-1 text-xs"
              data-ocid="learn.epa608.tab"
            >
              EPA 608
            </TabsTrigger>
          </TabsList>

          <TabsContent value="study">
            <StudyTab />
          </TabsContent>

          <TabsContent value="videos">
            <VideosTab onNavigate={setActiveTab} />
          </TabsContent>

          <TabsContent value="diagrams">
            <DiagramsTab />
          </TabsContent>

          <TabsContent value="epa608">
            <Epa608Tab />
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
    </div>
  );
}
