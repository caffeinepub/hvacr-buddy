import EPA608Exam from "@/components/EPA608Exam";
import KnowledgeBase from "@/components/KnowledgeBase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EXAM_CORE,
  EXAM_TYPE1,
  EXAM_TYPE2,
  EXAM_TYPE3,
  type ExamQuestion,
} from "@/data/epa608ExamQuestions";
import {
  EPA608_CORE,
  EPA608_TYPE1,
  EPA608_TYPE2,
  EPA608_TYPE3,
} from "@/data/epa608Questions";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Database,
  ExternalLink,
  Lightbulb,
  Play,
  Settings,
  Shield,
  Thermometer,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────
type View = "home" | "category" | "topic" | "knowledge-base" | "exam";

interface PracticeQ {
  q: string;
  a: string;
}

interface VideoLink {
  title: string;
  url: string;
}

interface TopicSection {
  heading: string;
  items: string[];
}

interface Topic {
  id: string;
  title: string;
  sections: TopicSection[];
  practiceQs?: PracticeQ[];
  videos?: VideoLink[];
  examQuestions?: ExamQuestion[];
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  colorVar: string;
  bgVar: string;
  topics: Topic[];
}

// ─── Content Data ────────────────────────────────────────────
const CATEGORIES: Category[] = [
  {
    id: "epa608",
    title: "EPA 608 Certification",
    subtitle:
      "Federal regulations, refrigerant handling, and certification prep",
    icon: <Shield className="w-6 h-6" />,
    colorVar: "oklch(var(--diagnose-icon))",
    bgVar: "oklch(var(--diagnose-bg))",
    topics: [
      {
        id: "core",
        title: "Core",
        examQuestions: EXAM_CORE,
        sections: [
          {
            heading: "Key Concepts",
            items: [
              "Ozone depletion and the Clean Air Act",
              "CFC, HCFC, HFC refrigerant classifications",
              "Global Warming Potential (GWP)",
              "Venting prohibitions and penalties",
              "Refrigerant containers: color coding and safety",
              "Recovery requirements before opening a system",
            ],
          },
          {
            heading: "Explanation",
            items: [
              "The Core section covers federal regulations, environmental law, and safety practices that apply to ALL types of refrigerant work regardless of system size.",
            ],
          },
        ],
        practiceQs: EPA608_CORE,
        videos: [
          {
            title: "EPA 608 Core Prep Part 1",
            url: "https://www.youtube.com/watch?v=BLtBaCt81i4",
          },
          {
            title: "EPA 608 Core Prep Part 2",
            url: "https://www.youtube.com/watch?v=gi-RkhawFGU",
          },
        ],
      },
      {
        id: "type1",
        title: "Type I",
        examQuestions: EXAM_TYPE1,
        sections: [
          {
            heading: "Key Concepts",
            items: [
              "Small appliances (under 5 lbs of refrigerant)",
              "Recovery requirements for small appliances",
              "Self-contained recovery equipment",
              "Passive recovery techniques",
            ],
          },
          {
            heading: "Explanation",
            items: [
              "Type I covers small appliances like window ACs, refrigerators, and dehumidifiers. Special recovery rules apply due to small charge sizes.",
            ],
          },
        ],
        practiceQs: EPA608_TYPE1,
        videos: [
          {
            title: "EPA 608 Type 1 Prep",
            url: "https://www.youtube.com/watch?v=wZH058B3x54",
          },
        ],
      },
      {
        id: "type2",
        title: "Type II",
        examQuestions: EXAM_TYPE2,
        sections: [
          {
            heading: "Key Concepts",
            items: [
              "High-pressure appliances (R-22, R-410A systems)",
              "Recovery efficiency requirements",
              "System evacuation before recharging",
              "Leak detection requirements",
              "Low-loss fittings",
            ],
          },
          {
            heading: "Explanation",
            items: [
              "Type II covers high-pressure systems like residential and commercial air conditioners and heat pumps. Most field technicians work primarily with Type II equipment.",
            ],
          },
        ],
        practiceQs: EPA608_TYPE2,
        videos: [
          {
            title: "EPA 608 Type 2 Prep",
            url: "https://www.youtube.com/watch?v=Mnl_KY-D59A",
          },
        ],
      },
      {
        id: "type3",
        title: "Type III",
        examQuestions: EXAM_TYPE3,
        sections: [
          {
            heading: "Key Concepts",
            items: [
              "Low-pressure appliances (R-11, R-113 centrifugal chillers)",
              "Leak detection and repair requirements",
              "Standing pressure test",
              "Pressure purging procedures",
            ],
          },
          {
            heading: "Explanation",
            items: [
              "Type III covers low-pressure systems like large centrifugal chillers. These systems operate below atmospheric pressure and require special handling to prevent moisture entry.",
            ],
          },
        ],
        practiceQs: EPA608_TYPE3,
        videos: [
          {
            title: "EPA 608 Type 3 Prep",
            url: "https://www.youtube.com/watch?v=CXMLkI1WMcQ",
          },
        ],
      },
    ],
  },
  {
    id: "electrical",
    title: "Electrical Training",
    subtitle: "Multimeters, low voltage circuits, and component testing",
    icon: <Zap className="w-6 h-6" />,
    colorVar: "oklch(var(--chart-4))",
    bgVar: "oklch(var(--tools-bg))",
    topics: [
      {
        id: "multimeter",
        title: "Multimeter Usage",
        sections: [
          {
            heading: "When to Use",
            items: [
              "Use a multimeter to test voltage, resistance, continuity, and amperage in HVAC circuits before and after repairs.",
            ],
          },
          {
            heading: "Safety Rules",
            items: [
              "Always set the meter to the correct function before testing",
              "Never test resistance on a live circuit",
              "Use proper rated test leads",
              "Keep hands away from metal probes when testing live voltage",
            ],
          },
          {
            heading: "Continuity",
            items: [
              "Checks if a circuit path is complete. Use on capacitors, contactors, fuses. Meter beeps = good path.",
            ],
          },
          {
            heading: "Voltage",
            items: [
              "Measures electrical potential. 240V across compressor terminals = power present. Always test before working.",
            ],
          },
          {
            heading: "Resistance (Ohms)",
            items: [
              "Measures opposition to current flow. Motor windings should show specific resistance values from the nameplate.",
            ],
          },
          {
            heading: "Amperage (Amps)",
            items: [
              "Use clamp attachment around a single wire. Compressor running amps should be at or below nameplate RLA.",
            ],
          },
          {
            heading: "Real HVAC Examples",
            items: [
              "Check a blown fuse: set to continuity, probe each end. No beep = blown.",
              "Test a contactor coil: set to resistance, read coil ohms. Open = bad coil.",
              "Measure 24V control circuit: set to VAC, probe R and C terminals on board.",
            ],
          },
        ],
        practiceQs: [
          {
            q: "What meter setting do you use to check a fuse?",
            a: "Continuity (or resistance/ohms).",
          },
          {
            q: "Can you measure resistance on a live circuit?",
            a: "No, always de-energize the circuit first.",
          },
          {
            q: "What does a reading of OL (overload) mean on resistance mode?",
            a: "Open circuit — no path for current.",
          },
          {
            q: "Where do you clamp an amp meter to measure compressor amps?",
            a: "Around one wire going to the compressor (not two wires at once).",
          },
          {
            q: "What voltage should you see on a 24V control circuit?",
            a: "24–28V AC between R and C.",
          },
        ],
      },
      {
        id: "low-voltage",
        title: "Low Voltage HVAC Circuits",
        sections: [
          {
            heading: "When to Use",
            items: [
              "Troubleshooting thermostat wiring, control boards, and 24V control circuits.",
            ],
          },
          {
            heading: "Safety Rules",
            items: [
              "24V is low voltage but can still damage control boards if shorted",
              "Always identify R, C, Y, G, W, O/B terminals before testing",
              "Disconnect power before rewiring",
            ],
          },
          {
            heading: "Explanation",
            items: [
              "HVAC control circuits run on 24V AC from a transformer. The thermostat sends signals through colored wires to the air handler and condenser.",
              "Common wires: R (power), C (common), Y (cooling), G (fan), W (heat), O/B (reversing valve).",
            ],
          },
          {
            heading: "Real HVAC Examples",
            items: [
              "No cooling call: check for 24V between R and Y at the air handler",
              "Fan runs but no cooling: Y signal missing, check thermostat or wire",
              "System short cycles: check for loose wire causing intermittent contact",
            ],
          },
        ],
        practiceQs: [
          {
            q: "What wire color typically carries the 24V power signal?",
            a: "Red (R wire).",
          },
          {
            q: "What does the Y terminal control?",
            a: "Cooling (compressor/condenser call).",
          },
          {
            q: "What does the C wire provide?",
            a: "The common return path for the 24V circuit.",
          },
          {
            q: "Where does the 24V originate in an HVAC system?",
            a: "The control transformer in the air handler or furnace.",
          },
          {
            q: "If there is no 24V between R and C, what is the likely cause?",
            a: "Blown fuse or failed transformer.",
          },
        ],
      },
      {
        id: "contactors",
        title: "Contactors, Relays & Transformers",
        sections: [
          {
            heading: "When to Use",
            items: [
              "Diagnosing starting failures, voltage issues, and control circuit problems.",
            ],
          },
          {
            heading: "Safety Rules",
            items: [
              "Contactors carry 240V — de-energize before inspecting",
              "Always verify power is off at disconnect before touching contacts",
              "Burned or pitted contacts can cause high resistance and heat",
            ],
          },
          {
            heading: "Contactor",
            items: [
              "Electromagnetic switch that opens/closes the 240V circuit to the compressor and condenser fan. Coil is energized by 24V from the thermostat.",
            ],
          },
          {
            heading: "Relay",
            items: [
              "Smaller version of a contactor, used for fan motors and lower-amperage loads.",
            ],
          },
          {
            heading: "Transformer",
            items: [
              "Converts 240V to 24V for the control circuit. Located in the air handler. Rated in VA (volt-amps).",
            ],
          },
          {
            heading: "Real HVAC Examples",
            items: [
              "Contactor not pulling in: check for 24V at coil terminals. No 24V = thermostat/wiring issue. 24V present, not pulling = bad contactor.",
              "Transformer output low: measure secondary voltage — should be 24–28V AC. Low = overloaded or failing transformer.",
            ],
          },
        ],
        practiceQs: [
          {
            q: "What energizes a contactor coil?",
            a: "24V AC from the thermostat control circuit.",
          },
          {
            q: "What voltage do contactor power contacts carry?",
            a: "240V (line voltage).",
          },
          {
            q: "How do you test if a contactor coil is good?",
            a: "Measure resistance across coil terminals — typical range 8–20 ohms.",
          },
          {
            q: "What happens when a contactor's contacts are pitted or burned?",
            a: "High resistance, voltage drop, and potential compressor damage.",
          },
          {
            q: "What is the primary side voltage of a typical HVAC transformer?",
            a: "240V (or 120V on some systems).",
          },
        ],
      },
    ],
  },
  {
    id: "refrigeration",
    title: "Refrigeration System",
    subtitle: "Refrigeration cycle, superheat, subcooling, and system faults",
    icon: <Thermometer className="w-6 h-6" />,
    colorVar: "oklch(var(--learn-icon))",
    bgVar: "oklch(var(--learn-bg))",
    topics: [
      {
        id: "ref-cycle",
        title: "Refrigeration Cycle",
        sections: [
          {
            heading: "Explanation",
            items: [
              "The refrigeration cycle moves heat from inside a space to outside using a refrigerant. It has four main components: compressor, condenser, metering device, evaporator.",
            ],
          },
          {
            heading: "Steps",
            items: [
              "1. Compressor: Compresses low-pressure vapor into high-pressure hot vapor",
              "2. Condenser: Hot vapor releases heat to outdoor air, becomes liquid",
              "3. Metering Device (TXV or orifice): Drops pressure rapidly, refrigerant cools",
              "4. Evaporator: Low-pressure liquid absorbs indoor heat, becomes vapor — cycle repeats",
            ],
          },
          {
            heading: "Field Examples",
            items: [
              "If the condenser coil is dirty, heat cannot reject — head pressure rises",
              "If the evaporator is iced over, airflow is restricted — suction pressure drops",
              "Low refrigerant charge: suction pressure drops, superheat rises",
            ],
          },
          {
            heading: "Diagnostic Tips",
            items: [
              "High suction + high head = overcharge or non-condensables",
              "Low suction + normal head = low charge or restricted metering device",
              "Evaporator icing = low airflow, low charge, or dirty filter",
            ],
          },
        ],
      },
      {
        id: "superheat",
        title: "Superheat & Subcooling",
        sections: [
          {
            heading: "Superheat",
            items: [
              "Temperature of vapor above its boiling point at a given pressure. Measured at suction line. Indicates if evaporator is properly loaded.",
            ],
          },
          {
            heading: "Subcooling",
            items: [
              "Temperature drop of liquid below its condensing point. Measured at liquid line. Indicates charge level and condenser efficiency.",
            ],
          },
          {
            heading: "Normal Ranges",
            items: [
              "Superheat: 10–20°F at the evaporator outlet (TXV systems: 8–12°F)",
              "Subcooling: 10–20°F at condenser outlet",
            ],
          },
          {
            heading: "Field Examples",
            items: [
              "High superheat + low subcooling = low refrigerant charge",
              "Low superheat = possible flooding (liquid slugging compressor risk)",
              "High subcooling + normal or high suction = overcharge",
            ],
          },
          {
            heading: "Diagnostic Tips",
            items: [
              "Always use actual saturation temperature from pressure-temperature chart",
              "Superheat = actual suction line temp − saturation temp at suction pressure",
              "Subcooling = saturation temp at head pressure − actual liquid line temp",
            ],
          },
        ],
      },
      {
        id: "pressure",
        title: "Pressure Relationships",
        sections: [
          {
            heading: "Explanation",
            items: [
              "Refrigerant pressure and temperature are directly related. Using a PT chart, you can find saturation temperature for any given pressure.",
            ],
          },
          {
            heading: "Key Points",
            items: [
              "High side (head pressure): reflects outdoor temperature and condenser condition",
              "Low side (suction pressure): reflects indoor load and evaporator condition",
              "Pressure rises with temperature; pressure drops with temperature",
            ],
          },
          {
            heading: "Field Examples",
            items: [
              "Outdoor temp 95°F: expect R-410A head pressure around 400–420 psi",
              "Low suction pressure on a hot day: likely low charge or restricted metering device",
              "High head pressure on a mild day: dirty condenser, overcharge, or non-condensables",
            ],
          },
          {
            heading: "Diagnostic Tips",
            items: [
              "Always compare readings to outdoor and indoor temperatures",
              "Use a PT chart or digital gauges for accurate saturation temps",
              "Non-condensables (air/nitrogen in system) raise head pressure without raising suction",
            ],
          },
        ],
      },
      {
        id: "faults",
        title: "Common System Faults",
        sections: [
          {
            heading: "Explanation",
            items: [
              "Understanding common faults helps technicians diagnose faster in the field.",
            ],
          },
          {
            heading: "Fault List",
            items: [
              "Low refrigerant charge: Low suction, high superheat, low subcooling. Check for leaks.",
              "Overcharge: High suction and head pressure, low superheat. Remove refrigerant.",
              "Dirty condenser coil: High head pressure, normal suction. Clean coil.",
              "Dirty evaporator / low airflow: Low suction, possible icing, high superheat. Check filter, blower, coil.",
              "Bad metering device / TXV stuck closed: Very low suction, very high superheat. Replace TXV.",
              "Compressor valve failure: Low head, high suction, low temperature differential. Check compression ratio.",
              "Non-condensables in system: High head pressure despite normal conditions. Recover, evacuate, recharge.",
            ],
          },
          {
            heading: "Diagnostic Tips",
            items: [
              "Always record pressures, temps, superheat, and subcooling before diagnosing",
              "Compare to manufacturer specs and outdoor/indoor conditions",
              "Rule out simple causes first: filter, airflow, breakers, thermostat",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "tools",
    title: "HVAC Tools & Procedures",
    subtitle: "Gauges, evacuation, recovery, and charging step-by-step",
    icon: <Wrench className="w-6 h-6" />,
    colorVar: "oklch(var(--jobs-icon))",
    bgVar: "oklch(var(--jobs-bg))",
    topics: [
      {
        id: "gauges",
        title: "Gauges & Pressure Readings",
        sections: [
          {
            heading: "When to Use",
            items: [
              "Any time you need to measure system pressures, check charge, or diagnose a system.",
            ],
          },
          {
            heading: "Step-by-Step",
            items: [
              "1. Connect manifold gauge set — blue (low side) to suction service valve, red (high side) to liquid/discharge service valve",
              "2. Purge hoses briefly before connecting (if not using nitrogen-filled hoses)",
              "3. Record low-side (suction) and high-side (head) pressures",
              "4. Cross-reference with PT chart to find saturation temperatures",
              "5. Calculate superheat (suction line) and subcooling (liquid line)",
            ],
          },
          {
            heading: "Safety Warnings",
            items: [
              "Never connect gauges to a running system without knowing system pressures first",
              "High-side pressure can exceed 400 psi on R-410A systems — use rated hoses",
              "Always wear safety glasses when connecting/disconnecting gauge hoses",
              "Purge hoses before connecting to avoid introducing air into the system",
            ],
          },
        ],
      },
      {
        id: "vacuum",
        title: "Vacuum & Evacuation",
        sections: [
          {
            heading: "When to Use",
            items: [
              "After any repair that opens the refrigerant circuit. Must evacuate before recharging.",
            ],
          },
          {
            heading: "Step-by-Step",
            items: [
              "1. Connect vacuum pump to gauge manifold center port",
              "2. Open both manifold valves (high and low side)",
              "3. Start vacuum pump; target 500 microns or lower",
              "4. Monitor vacuum with a micron gauge — not the manifold gauge",
              "5. Close manifold valves and shut off pump; hold vacuum for 15–30 min",
              "6. If micron level rises quickly: moisture or leak present — find and fix before charging",
            ],
          },
          {
            heading: "Safety Warnings",
            items: [
              "Never use refrigerant to flush a system — illegal and wasteful",
              "A manifold gauge cannot accurately measure deep vacuum — use a micron gauge",
              "Moisture in the system causes acid buildup and compressor damage",
            ],
          },
        ],
      },
      {
        id: "recovery",
        title: "Refrigerant Recovery",
        sections: [
          {
            heading: "When to Use",
            items: [
              "Before opening any refrigerant circuit for repair. Required by law (EPA Section 608).",
            ],
          },
          {
            heading: "Step-by-Step",
            items: [
              "1. Connect recovery machine to gauge manifold",
              "2. Connect recovery cylinder (yellow/gray) — ensure it is not full",
              "3. Start recovery machine; open manifold valves",
              "4. Monitor system pressures until they reach 0 psi (or required recovery level)",
              "5. Weigh recovery cylinder to track amount recovered",
              "6. Record refrigerant type and amount on work order",
            ],
          },
          {
            heading: "Safety Warnings",
            items: [
              "Never vent refrigerant to atmosphere — federal violation",
              "Use the correct recovery cylinder for the refrigerant type",
              "Do not overfill recovery cylinders — 80% capacity maximum",
              "Wear safety glasses and gloves — refrigerant can cause frostbite",
            ],
          },
        ],
        videos: [
          {
            title:
              "How to Remove (Recover) Refrigerant From a Running AC System",
            url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
          },
        ],
      },
      {
        id: "charging",
        title: "Charging Procedures",
        sections: [
          {
            heading: "When to Use",
            items: ["After evacuation, when adding refrigerant to a system."],
          },
          {
            heading: "Step-by-Step",
            items: [
              "1. Verify system has passed vacuum hold test (500 microns or below)",
              "2. Connect refrigerant cylinder to manifold center port",
              "3. For blends (R-410A): charge as liquid from cylinder (invert cylinder or use liquid port)",
              "4. Open low-side valve slowly; add refrigerant in small amounts",
              "5. Monitor suction and head pressure, superheat, and subcooling",
              "6. Charge to manufacturer specs — do not guess",
              "7. Check for leaks after charging",
            ],
          },
          {
            heading: "Safety Warnings",
            items: [
              "Never charge liquid into the suction side quickly — risk of liquid slugging",
              "R-410A must be charged as liquid to prevent fractionation",
              "Do not add refrigerant to a leaking system without finding and fixing the leak first",
              "Always weigh in refrigerant when possible for accuracy",
            ],
          },
        ],
        videos: [
          {
            title: "How to Evacuate an AC System (Full Vacuum Procedure)",
            url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
          },
        ],
      },
    ],
  },
];

// ─── Section Icon Map ────────────────────────────────────────────
function sectionIcon(heading: string) {
  if (heading.toLowerCase().includes("safety"))
    return <AlertTriangle className="w-4 h-4 text-destructive" />;
  if (heading.toLowerCase().includes("step"))
    return <Settings className="w-4 h-4 text-primary" />;
  if (
    heading.toLowerCase().includes("example") ||
    heading.toLowerCase().includes("tip")
  )
    return (
      <Lightbulb
        className="w-4 h-4"
        style={{ color: "oklch(var(--chart-4))" }}
      />
    );
  if (heading.toLowerCase().includes("key concept"))
    return <BookOpen className="w-4 h-4 text-primary" />;
  return null;
}

function isSafetySection(h: string) {
  return h.toLowerCase().includes("safety");
}

// ─── Practice Question Component ──────────────────────────────────
function PracticeQuestion({
  q,
  a,
  index,
}: { q: string; a: string; index: number }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <button
      type="button"
      className="w-full border border-border rounded-lg overflow-hidden cursor-pointer select-none text-left"
      onClick={() => setRevealed((v) => !v)}
      data-ocid={`learn.question.item.${index + 1}`}
    >
      <div className="flex items-start gap-3 p-3 bg-secondary/50 hover:bg-secondary transition-colors">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <p className="text-sm font-medium leading-snug flex-1">{q}</p>
        <ChevronRight
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200 ${revealed ? "rotate-90" : ""}`}
        />
      </div>
      {revealed && (
        <div className="p-3 bg-card border-t border-border">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold text-primary">A: </span>
            {a}
          </p>
        </div>
      )}
    </button>
  );
}

// ─── Topic View ─────────────────────────────────────────────────────
function TopicView({
  topic,
  category,
  onStartExam,
}: {
  topic: Topic;
  category: Category;
  onStartExam: () => void;
}) {
  return (
    <div className="space-y-5">
      {/* Exam Simulation Entry — EPA 608 only */}
      {topic.examQuestions && topic.examQuestions.length > 0 && (
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            <p className="text-sm font-bold text-primary">Exam Simulation</p>
            <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
              {topic.examQuestions.length} questions
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Practice Mode or Exam Mode with randomized multiple-choice questions
          </p>
          <Button onClick={onStartExam} size="sm" className="gap-2 w-full">
            <ClipboardList className="w-4 h-4" />
            Start Exam Simulation
          </Button>
        </div>
      )}

      {/* Sections */}
      {topic.sections.map((section) => (
        <div key={section.heading}>
          <div
            className={`flex items-center gap-2 mb-2 pb-1.5 border-b ${isSafetySection(section.heading) ? "border-destructive/30" : "border-border"}`}
          >
            {sectionIcon(section.heading)}
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${isSafetySection(section.heading) ? "text-destructive" : "text-primary"}`}
            >
              {section.heading}
            </h3>
          </div>
          <ul className="space-y-1.5">
            {section.items.map((item) => (
              <li key={item.slice(0, 40)} className="flex items-start gap-2">
                <span
                  className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${isSafetySection(section.heading) ? "bg-destructive" : "bg-primary"}`}
                />
                <p className="text-sm leading-relaxed text-foreground">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Practice Questions */}
      {topic.practiceQs && topic.practiceQs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-border">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
              Practice Questions
            </h3>
            <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
              {topic.practiceQs.length} questions
            </Badge>
            <span className="text-xs text-muted-foreground">Tap to reveal</span>
          </div>
          <div className="space-y-2">
            {topic.practiceQs.map((pq, qi) => (
              <PracticeQuestion
                key={pq.q.slice(0, 30)}
                q={pq.q}
                a={pq.a}
                index={qi}
              />
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {topic.videos && topic.videos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-border">
            <Play className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
              Linked Videos
            </h3>
          </div>
          <div className="space-y-2">
            {topic.videos.map((v, vi) => (
              <a
                key={v.title}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary transition-colors group"
                data-ocid={`learn.video.item.${vi + 1}`}
              >
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: category.bgVar }}
                >
                  <Play
                    className="w-4 h-4"
                    style={{ color: category.colorVar }}
                  />
                </span>
                <span className="text-sm font-medium flex-1 leading-snug">
                  {v.title}
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Category View ─────────────────────────────────────────────────
function CategoryView({
  category,
  onSelectTopic,
}: { category: Category; onSelectTopic: (t: Topic) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">{category.subtitle}</p>
      {category.topics.map((topic, ti) => (
        <button
          type="button"
          key={topic.id}
          onClick={() => onSelectTopic(topic)}
          className="w-full text-left flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/30 transition-all group"
          data-ocid={`learn.topic.item.${ti + 1}`}
        >
          <span
            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: category.bgVar, color: category.colorVar }}
          >
            {ti + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">
              {topic.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {topic.sections.length} sections
              {topic.practiceQs
                ? ` · ${topic.practiceQs.length} questions`
                : ""}
              {topic.examQuestions ? " · exam" : ""}
              {topic.videos
                ? ` · ${topic.videos.length} video${topic.videos.length !== 1 ? "s" : ""}`
                : ""}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}

// ─── Home View ─────────────────────────────────────────────────────
function HomeView({
  onSelectCategory,
  onSelectKnowledgeBase,
}: {
  onSelectCategory: (c: Category) => void;
  onSelectKnowledgeBase: () => void;
}) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onSelectKnowledgeBase}
        className="w-full text-left flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/40 hover:border-primary/30 transition-all group shadow-xs"
        data-ocid="learn.knowledge_base.button"
      >
        <span
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: "oklch(var(--learn-bg))",
            color: "oklch(var(--learn-icon))",
          }}
        >
          <Database className="w-6 h-6" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base text-foreground leading-tight">
            Knowledge Base
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            Search HVAC topics with field-focused explanations and diagnostics
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
              8 topics
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
              Search
            </Badge>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
      </button>
      {CATEGORIES.map((cat, ci) => (
        <button
          type="button"
          key={cat.id}
          onClick={() => onSelectCategory(cat)}
          className="w-full text-left flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/40 hover:border-primary/30 transition-all group shadow-xs"
          data-ocid={`learn.category.item.${ci + 1}`}
        >
          <span
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: cat.bgVar, color: cat.colorVar }}
          >
            {cat.icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base text-foreground leading-tight">
              {cat.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              {cat.subtitle}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {cat.topics.map((t) => (
                <Badge
                  key={t.id}
                  variant="secondary"
                  className="text-xs px-2 py-0 h-5"
                >
                  {t.title}
                </Badge>
              ))}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function LearnPage() {
  const [view, setView] = useState<View>("home");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  function goHome() {
    setView("home");
    setSelectedCategory(null);
    setSelectedTopic(null);
  }

  function goToCategory(cat: Category) {
    setSelectedCategory(cat);
    setSelectedTopic(null);
    setView("category");
  }

  function goToTopic(topic: Topic) {
    setSelectedTopic(topic);
    setView("topic");
  }

  function navigateFromKB(categoryId: string, topicId: string) {
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    if (!cat) return;
    const topic = cat.topics.find((t) => t.id === topicId);
    if (!topic) return;
    setSelectedCategory(cat);
    setSelectedTopic(topic);
    setView("topic");
  }

  function goBack() {
    if (view === "exam") {
      setView("topic");
    } else if (view === "topic") {
      setSelectedTopic(null);
      setView("category");
    } else if (view === "category") {
      goHome();
    } else if (view === "knowledge-base") {
      goHome();
    }
  }

  const headerTitle = () => {
    if (view === "exam" && selectedTopic)
      return { sub: selectedTopic.title, main: "Exam Simulation" };
    if (view === "topic" && selectedCategory && selectedTopic)
      return { sub: selectedCategory.title, main: selectedTopic.title };
    if (view === "category" && selectedCategory)
      return { main: selectedCategory.title };
    if (view === "knowledge-base") return { main: "Knowledge Base" };
    return null;
  };

  const ht = headerTitle();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          {view === "home" ? (
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <h1 className="font-bold text-base text-foreground leading-tight">
                  Learn
                </h1>
                <p className="text-xs text-muted-foreground">
                  HVAC Training System
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 text-sm text-primary font-medium hover:opacity-80 transition-opacity"
                data-ocid="learn.back.button"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              {ht && (
                <div className="flex-1 min-w-0">
                  {ht.sub && (
                    <p className="text-xs text-muted-foreground truncate">
                      {ht.sub}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-foreground truncate">
                    {ht.main}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5" data-ocid="learn.section">
        {view === "home" && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Select a category to begin studying.
            </p>
            <HomeView
              onSelectCategory={goToCategory}
              onSelectKnowledgeBase={() => setView("knowledge-base")}
            />
          </div>
        )}

        {view === "category" && selectedCategory && (
          <CategoryView category={selectedCategory} onSelectTopic={goToTopic} />
        )}

        {view === "topic" && selectedTopic && selectedCategory && (
          <TopicView
            topic={selectedTopic}
            category={selectedCategory}
            onStartExam={() => setView("exam")}
          />
        )}

        {view === "exam" && selectedTopic?.examQuestions && (
          <EPA608Exam
            sectionTitle={selectedTopic.title}
            questions={selectedTopic.examQuestions}
            onBack={() => setView("topic")}
          />
        )}

        {view === "knowledge-base" && (
          <KnowledgeBase onNavigateToStudy={navigateFromKB} />
        )}
      </main>

      <footer className="max-w-lg mx-auto px-4 py-6 mt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()}. 
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
