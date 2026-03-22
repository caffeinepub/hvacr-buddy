import VideoRecommendations from "@/components/VideoRecommendations";
import { Input } from "@/components/ui/input";
import { extractKeywords } from "@/utils/videoRecommendations";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Film,
  FlaskConical,
  Image as ImageIcon,
  ListOrdered,
  Search,
  Shield,
  ShieldAlert,
  Thermometer,
  Wind,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

interface KBStudyLink {
  label: string;
  section: string;
  categoryId: string;
  topicId: string;
}

interface KBTopic {
  id: string;
  title: string;
  keywords: string[];
  explanation: string;
  commonCauses: string[];
  diagnosticSteps: string[];
  safetyTips?: string[];
  relatedVideos: { title: string; url: string }[];
  relatedStudy: KBStudyLink[];
  relatedDiagrams: string[];
}

const KB_TOPICS: KBTopic[] = [
  {
    id: "ac-not-cooling",
    title: "AC Not Cooling",
    keywords: [
      "ac",
      "cooling",
      "not cooling",
      "warm air",
      "no cold air",
      "setpoint",
      "temperature",
    ],
    explanation:
      "The system runs but fails to produce adequately cold air or cannot maintain the thermostat setpoint. The compressor and fan may be running, but the supply air temperature is too high or the space never reaches the set temperature.",
    commonCauses: [
      "Low refrigerant charge due to a leak in the system",
      "Dirty or blocked condenser coil preventing heat rejection",
      "Failed run capacitor causing compressor or fan motor to underperform",
      "Low airflow from dirty filter, dirty blower wheel, or closed registers",
      "Thermostat malfunction or incorrect temperature offset",
      "Compressor not fully pumping (worn valves)",
    ],
    diagnosticSteps: [
      "Verify thermostat is set to COOL, set point is below room temperature, and fan is on AUTO",
      "Check supply and return air temperatures — a proper split is 16-22°F. Less than 14°F indicates a problem",
      "Inspect the condenser coil for dirt, grass clippings, or debris blocking airflow",
      "Check and replace the air filter; confirm all supply registers are open",
      "Connect manifold gauges to measure suction and head pressures",
      "Test the run capacitor with a capacitance meter (uF reading should be within +/-10% of rating)",
      "Measure compressor amps and compare to nameplate RLA",
    ],
    safetyTips: [
      "Do not operate a system with a known refrigerant leak — recover refrigerant first",
      "Always wear safety glasses when connecting or disconnecting gauge hoses",
      "High-side pressure on R-410A can exceed 400 psi — use rated hoses and fittings",
    ],
    relatedVideos: [
      {
        title: "EPA 608 Core Prep Part 1",
        url: "https://www.youtube.com/watch?v=BLtBaCt81i4",
      },
      {
        title: "How to Remove (Recover) Refrigerant",
        url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
      },
    ],
    relatedStudy: [
      {
        label: "Refrigeration Cycle",
        section: "Refrigeration System",
        categoryId: "refrigeration",
        topicId: "ref-cycle",
      },
      {
        label: "Gauges & Pressure Readings",
        section: "HVAC Tools & Procedures",
        categoryId: "tools",
        topicId: "gauges",
      },
    ],
    relatedDiagrams: ["Refrigeration Cycle"],
  },
  {
    id: "low-suction-pressure",
    title: "Low Suction Pressure",
    keywords: [
      "suction",
      "low suction",
      "suction pressure",
      "low side",
      "low psi",
    ],
    explanation:
      "Suction (low-side) pressure is below the normal operating range for the refrigerant type being used. For R-410A at 75°F indoor ambient, normal suction pressure is typically 115-125 psi. Low suction indicates the evaporator is not absorbing enough heat or refrigerant is restricted.",
    commonCauses: [
      "Low refrigerant charge from a system leak",
      "Restriction in the liquid line, filter drier, or TXV",
      "Dirty or iced-over evaporator coil blocking heat absorption",
      "Insufficient airflow across the evaporator (dirty filter, bad blower motor)",
      "TXV stuck in partially closed position",
    ],
    diagnosticSteps: [
      "Record static suction pressure before starting the system for comparison",
      "Check the air filter and evaporator coil for dirt or ice buildup",
      "Measure superheat at the suction line — high superheat (above 20°F) with low suction points to low charge or restriction",
      "Inspect the liquid line filter drier — a temperature drop across it indicates a restriction",
      "Check TXV bulb contact and insulation on the suction line at the evaporator outlet",
      "Look for signs of refrigerant leaks at fittings, service valves, and coil",
    ],
    safetyTips: [
      "Wear safety glasses when working near refrigerant lines and service ports",
      "Use proper EPA-approved recovery equipment — never vent refrigerant",
      "Refrigerant contact with skin can cause frostbite — wear insulated gloves",
    ],
    relatedVideos: [],
    relatedStudy: [
      {
        label: "Superheat & Subcooling",
        section: "Refrigeration System",
        categoryId: "refrigeration",
        topicId: "superheat",
      },
      {
        label: "Pressure Relationships",
        section: "Refrigeration System",
        categoryId: "refrigeration",
        topicId: "pressure",
      },
    ],
    relatedDiagrams: ["Refrigeration Cycle"],
  },
  {
    id: "high-head-pressure",
    title: "High Head Pressure",
    keywords: [
      "head pressure",
      "high head",
      "discharge pressure",
      "high side",
      "high psi",
    ],
    explanation:
      "Discharge (high-side) pressure is above the normal operating range. For R-410A, head pressure typically runs 350-420 psi on a 95°F day. Elevated head pressure causes the compressor to work harder, increasing amp draw and temperature, which can lead to premature failure.",
    commonCauses: [
      "Dirty or blocked condenser coil with restricted airflow",
      "Refrigerant overcharge — too much refrigerant in the system",
      "Non-condensables (air or nitrogen) trapped in the high side",
      "Failed or slow condenser fan motor",
      "Extremely high ambient outdoor temperature",
      "Condenser fan blade installed backwards or damaged",
    ],
    diagnosticSteps: [
      "Visually inspect condenser coil for debris, cottonwood, dirt, or vegetation blocking airflow",
      "Verify condenser fan is spinning at full speed in the correct direction (pulling air up through coil)",
      "Measure subcooling — subcooling above 20°F suggests overcharge or non-condensables",
      "Check outdoor ambient temperature and compare to manufacturer pressure/temperature performance data",
      "If non-condensables are suspected: shut system off, let pressures equalize, compare to PT chart for refrigerant type",
      "Check compressor amps — elevated amps confirm excessive head pressure load",
    ],
    safetyTips: [
      "Never bypass the high-pressure safety control — it protects against catastrophic compressor failure",
      "Do not attempt to purge non-condensables by venting — this is illegal under EPA regulations",
      "High-side pressure can be extremely dangerous; always use rated hoses and safety glasses",
    ],
    relatedVideos: [],
    relatedStudy: [
      {
        label: "Refrigeration Cycle",
        section: "Refrigeration System",
        categoryId: "refrigeration",
        topicId: "ref-cycle",
      },
      {
        label: "Common System Faults",
        section: "Refrigeration System",
        categoryId: "refrigeration",
        topicId: "faults",
      },
    ],
    relatedDiagrams: ["Refrigeration Cycle"],
  },
  {
    id: "capacitor-failure",
    title: "Capacitor Failure",
    keywords: [
      "capacitor",
      "cap",
      "microfarad",
      "uf",
      "start cap",
      "run cap",
      "won't start",
    ],
    explanation:
      "The start or run capacitor has weakened or failed. Capacitors provide the phase shift needed to start single-phase motors (compressor, condenser fan, blower). A weak capacitor causes hard starting, high amp draw, motor overheating, and eventual motor failure.",
    commonCauses: [
      "Normal age degradation — most capacitors last 5-10 years",
      "Prolonged exposure to high heat inside the condenser unit",
      "Electrical surges from lightning or utility voltage spikes",
      "Operating at rated limits in extreme ambient temperatures",
      "Moisture intrusion or physical damage to the capacitor case",
    ],
    diagnosticSteps: [
      "Visually inspect for a bulged top, leaking oil, or burn marks on the body",
      "Discharge the capacitor using an insulated screwdriver across the terminals before touching",
      "Set multimeter to capacitance (uF) mode and measure each terminal pair (HERM-C, FAN-C, HERM-FAN)",
      "A reading more than 10% below the nameplate rating indicates a weak capacitor; more than 20% = failed",
      "Check motor running amps — significantly above nameplate RLA with correct voltage indicates a weak cap",
      "Confirm correct uF and voltage rating before installing replacement",
    ],
    safetyTips: [
      "CRITICAL: Always discharge capacitor before handling — capacitors hold lethal voltage even with power off",
      "Use an insulated screwdriver to short each terminal to ground/case for 2-3 seconds before touching",
      "Never short the HERM and FAN terminals directly to each other — short each to the C (common) terminal",
      "Wear safety glasses and insulated gloves when working near capacitors",
    ],
    relatedVideos: [],
    relatedStudy: [
      {
        label: "Contactors, Relays & Transformers",
        section: "Electrical Training",
        categoryId: "electrical",
        topicId: "contactors",
      },
      {
        label: "Multimeter Usage",
        section: "Electrical Training",
        categoryId: "electrical",
        topicId: "multimeter",
      },
    ],
    relatedDiagrams: ["Capacitor Wiring"],
  },
  {
    id: "contactor-issues",
    title: "Contactor Issues",
    keywords: [
      "contactor",
      "contacts",
      "pull in",
      "coil",
      "compressor won't start",
      "burnt contacts",
    ],
    explanation:
      "The contactor is the main electromagnetic switch that sends line voltage (240V) to the compressor and condenser fan when the thermostat calls for cooling. A failed contactor will prevent the system from starting or cause unreliable operation.",
    commonCauses: [
      "Burnt or pitted contact surfaces from arcing over thousands of cycles",
      "Weak or open contactor coil — coil fails to pull in contacts when 24V is applied",
      "Insect nests or debris lodged between contacts preventing proper closure",
      "Worn mechanical components from high cycle count over many years",
      "Contacts welded together (stuck closed) from a fault current event",
    ],
    diagnosticSteps: [
      "With the thermostat calling for cooling, use a multimeter to check for 24V AC across the contactor coil terminals",
      "If 24V is present and contactor is not pulling in: coil or mechanical failure — replace contactor",
      "If no 24V at coil: trace back through low-voltage circuit (thermostat, wiring, control board)",
      "With power OFF and disconnect pulled, inspect contact surfaces for pitting, burning, or discoloration",
      "Measure line voltage in (L1/L2) and out (T1/T2) of contactor while running — voltage drop greater than 5V across contacts indicates bad contacts",
      "Check compressor amp draw — if contacts are resistive, amps may be lower than expected",
    ],
    safetyTips: [
      "Line voltage (240V) is present at the contactor — ALWAYS shut off the disconnect before inspecting or replacing",
      "Wait 30 seconds after disconnecting power before touching contactor terminals",
      "Never reach into a condenser while energized — all contactor service requires the disconnect to be pulled",
    ],
    relatedVideos: [
      {
        title: "How Power Moves Through an AC Schematic",
        url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
      },
    ],
    relatedStudy: [
      {
        label: "Contactors, Relays & Transformers",
        section: "Electrical Training",
        categoryId: "electrical",
        topicId: "contactors",
      },
      {
        label: "Low Voltage HVAC Circuits",
        section: "Electrical Training",
        categoryId: "electrical",
        topicId: "low-voltage",
      },
    ],
    relatedDiagrams: ["Contactor Wiring"],
  },
  {
    id: "airflow-problems",
    title: "Airflow Problems",
    keywords: [
      "airflow",
      "air flow",
      "static pressure",
      "filter",
      "blower",
      "duct",
      "registers",
      "cfm",
    ],
    explanation:
      "Insufficient or uneven airflow reduces system efficiency, increases operating pressures, and can cause evaporator coil icing or heat exchanger overheating. Proper airflow is typically 350-450 CFM per ton of cooling capacity.",
    commonCauses: [
      "Clogged or dirty air filter restricting return airflow",
      "Blocked or closed supply/return grilles and registers",
      "Dirty or debris-clogged blower wheel reducing fan output",
      "Undersized return air ductwork creating excessive static pressure",
      "Collapsed or kinked flex duct in the attic or crawlspace",
      "Failed blower motor capacitor or worn motor bearings",
    ],
    diagnosticSteps: [
      "Check and replace the air filter — this is always the first step",
      "Inspect all supply and return registers — ensure none are blocked by furniture or closed",
      "Measure temperature split between return and supply air (target 16-22°F for cooling)",
      "Measure external static pressure across the air handler using a manometer — compare to equipment ratings",
      "Inspect the blower wheel for dirt, lint, or debris buildup",
      "Confirm blower motor is at correct speed tap for heating vs. cooling",
      "Inspect ductwork in attic or crawlspace for collapsed, disconnected, or kinked sections",
    ],
    safetyTips: [
      "Never operate the system with return air fully blocked for extended periods — evaporator coil will freeze and liquid refrigerant can slug the compressor",
      "Disconnect power to the air handler before cleaning the blower wheel",
    ],
    relatedVideos: [],
    relatedStudy: [
      {
        label: "Gauges & Pressure Readings",
        section: "HVAC Tools & Procedures",
        categoryId: "tools",
        topicId: "gauges",
      },
      {
        label: "Common System Faults",
        section: "Refrigeration System",
        categoryId: "refrigeration",
        topicId: "faults",
      },
    ],
    relatedDiagrams: ["Airflow Diagram"],
  },
  {
    id: "superheat-subcooling",
    title: "Superheat & Subcooling",
    keywords: [
      "superheat",
      "subcooling",
      "sh",
      "sc",
      "charge",
      "saturation",
      "target superheat",
    ],
    explanation:
      "Superheat is the number of degrees the refrigerant vapor is above its saturation temperature at a given pressure, measured at the suction line. Subcooling is the number of degrees the refrigerant liquid is below its condensing temperature at a given pressure, measured at the liquid line. Both are essential diagnostic tools for verifying correct refrigerant charge.",
    commonCauses: [
      "High superheat + low subcooling: low refrigerant charge (most common field finding)",
      "Low superheat + high subcooling: refrigerant overcharge or restricted metering device outlet",
      "High superheat + normal subcooling: low airflow across evaporator or TXV stuck closed",
      "Low superheat alone: TXV flooding, bulb contact issue, or overcharge",
      "Abnormal subcooling with normal suction: non-condensables in high side or dirty condenser",
    ],
    diagnosticSteps: [
      "Measure suction line temperature with a pipe clamp thermometer (insulate the probe for accuracy)",
      "Record suction pressure from low-side gauge and look up saturation temperature on a PT chart for the specific refrigerant",
      "Superheat = suction line temp minus saturation temp at suction pressure (target: 8-15°F for TXV, 10-20°F for fixed-orifice)",
      "Measure liquid line temperature with a pipe clamp thermometer near the condenser outlet",
      "Record liquid line (head) pressure and look up condensing temperature on PT chart",
      "Subcooling = condensing (saturation) temp at head pressure minus liquid line temp (target: 10-15°F)",
      "Compare both readings to manufacturer specifications — always verify with the unit data plate",
    ],
    safetyTips: [
      "Use calibrated digital gauges and thermometers — inaccurate readings lead to incorrect charge decisions",
      "Wear safety glasses when connecting gauges — refrigerant under pressure can spray",
    ],
    relatedVideos: [],
    relatedStudy: [
      {
        label: "Superheat & Subcooling",
        section: "Refrigeration System",
        categoryId: "refrigeration",
        topicId: "superheat",
      },
      {
        label: "Pressure Relationships",
        section: "Refrigeration System",
        categoryId: "refrigeration",
        topicId: "pressure",
      },
    ],
    relatedDiagrams: ["Refrigeration Cycle"],
  },
  {
    id: "refrigerant-leaks",
    title: "Refrigerant Leaks",
    keywords: [
      "refrigerant",
      "leak",
      "low charge",
      "leak detection",
      "uv dye",
      "electronic leak",
      "R-410A",
      "R-22",
    ],
    explanation:
      "Refrigerant escaping the sealed system causes low charge, degraded cooling performance, and environmental damage. Identifying and repairing leaks before adding refrigerant is required by law and essential for long-term system reliability.",
    commonCauses: [
      "Vibration-induced loosening at flare fittings and brazed joints",
      "Formicary (ant-nest) corrosion on copper evaporator coil tubing caused by formic acid reacting with copper",
      "Schrader valve cores that have worn or loosened over time",
      "Service valve packing wearing out from repeated access",
      "Physical damage to the line set from improper installation, animals, or construction",
    ],
    diagnosticSteps: [
      "Use an electronic leak detector — pass the probe slowly around fittings, service valves, coil surfaces, and the line set",
      "Check most common leak points: evaporator coil TXV connections, flare fittings at service valves, schrader valve cores, brazed elbows in air handler",
      "If UV dye is present in the system, use a UV flashlight to locate dye traces at the leak point",
      "Confirm the leak location with leak-detection soap bubbles after electronic detection",
      "Document leak location and refrigerant type/amount on work order before recovering and repairing",
      "After repair, pressure test with dry nitrogen and check for leaks before evacuating and recharging",
    ],
    safetyTips: [
      "NEVER add refrigerant without locating and repairing the leak first — this is both ineffective and an EPA violation",
      "EPA Section 608 requires leak repair on any appliance over 5 lbs if the annual leak rate exceeds 10% (comfort cooling) or 20% (commercial refrigeration)",
      "Never vent refrigerant to the atmosphere — penalties can reach $44,539 per violation per day",
      "Use proper PPE: safety glasses, gloves, and face shield when handling refrigerant",
    ],
    relatedVideos: [
      {
        title: "How to Remove (Recover) Refrigerant",
        url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
      },
      {
        title: "How to Evacuate an AC System",
        url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
      },
    ],
    relatedStudy: [
      {
        label: "EPA 608 Core",
        section: "EPA 608 Certification",
        categoryId: "epa608",
        topicId: "core",
      },
      {
        label: "Refrigerant Recovery",
        section: "HVAC Tools & Procedures",
        categoryId: "tools",
        topicId: "recovery",
      },
    ],
    relatedDiagrams: ["Refrigeration Cycle"],
  },
];

// ─── Diagram Content ──────────────────────────────────────────────
interface DiagramContent {
  title: string;
  description: string;
  icon: React.ReactNode;
  sections: { heading: string; content: React.ReactNode }[];
}

function getDiagramContent(name: string): DiagramContent | null {
  switch (name) {
    case "Refrigeration Cycle":
      return {
        title: "Refrigeration Cycle",
        description: "How heat moves through a split AC system",
        icon: <Thermometer className="w-5 h-5" />,
        sections: [
          {
            heading: "System Flow",
            content: (
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  {[
                    {
                      step: "1",
                      label: "COMPRESSOR",
                      detail:
                        "Compresses low-pressure vapor → high-pressure hot vapor",
                      color: "#f97316",
                    },
                    {
                      step: "2",
                      label: "CONDENSER COIL",
                      detail:
                        "Rejects heat to outdoor air → refrigerant becomes liquid",
                      color: "#ef4444",
                    },
                    {
                      step: "3",
                      label: "METERING DEVICE",
                      detail: "TXV or fixed orifice drops pressure rapidly",
                      color: "#8b5cf6",
                    },
                    {
                      step: "4",
                      label: "EVAPORATOR COIL",
                      detail:
                        "Absorbs indoor heat → refrigerant boils back to vapor",
                      color: "#38bdf8",
                    },
                  ].map((item, i, arr) => (
                    <div key={item.step}>
                      <div
                        className="flex items-start gap-3 p-3 rounded-lg"
                        style={{
                          background: "oklch(var(--card))",
                          border: "1px solid oklch(var(--border))",
                        }}
                      >
                        <span
                          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: item.color }}
                        >
                          {item.step}
                        </span>
                        <div>
                          <p
                            className="text-xs font-bold tracking-wider"
                            style={{ color: item.color }}
                          >
                            {item.label}
                          </p>
                          <p className="text-sm text-foreground mt-0.5">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="flex justify-center py-1">
                          <div className="w-0.5 h-4 bg-border" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div
                  className="mt-3 p-3 rounded-lg"
                  style={{
                    background: "oklch(var(--secondary) / 0.5)",
                    border: "1px dashed oklch(var(--border))",
                  }}
                >
                  <p className="text-xs text-muted-foreground text-center">
                    ↺ Cycle repeats continuously while system is running
                  </p>
                </div>
              </div>
            ),
          },
          {
            heading: "Key Pressures (R-410A at 95°F Outdoor)",
            content: (
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Low Side (Suction)",
                    value: "115–125 psi",
                    color: "#38bdf8",
                  },
                  {
                    label: "High Side (Head)",
                    value: "380–420 psi",
                    color: "#ef4444",
                  },
                  {
                    label: "Target Superheat",
                    value: "8–15°F",
                    color: "#8b5cf6",
                  },
                  {
                    label: "Target Subcooling",
                    value: "10–15°F",
                    color: "#22c55e",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-lg text-center"
                    style={{
                      background: "oklch(var(--card))",
                      border: `1px solid ${item.color}40`,
                    }}
                  >
                    <p
                      className="text-base font-bold"
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            ),
          },
        ],
      };

    case "Capacitor Wiring":
      return {
        title: "Capacitor Wiring",
        description: "Dual run capacitor terminal identification and wiring",
        icon: <Zap className="w-5 h-5" />,
        sections: [
          {
            heading: "Terminal Layout (Dual Run Cap)",
            content: (
              <div className="space-y-3">
                <div
                  className="p-4 rounded-lg text-center"
                  style={{
                    background: "oklch(var(--card))",
                    border: "2px solid #f97316",
                  }}
                >
                  <p className="text-xs font-bold text-muted-foreground mb-3 tracking-wider">
                    DUAL RUN CAPACITOR
                  </p>
                  <div className="flex justify-around">
                    {[
                      {
                        terminal: "HERM",
                        wire: "Compressor Start Winding",
                        color: "#ef4444",
                      },
                      {
                        terminal: "C",
                        wire: "Common (shared ground)",
                        color: "#6b7280",
                      },
                      {
                        terminal: "FAN",
                        wire: "Condenser Fan Motor",
                        color: "#38bdf8",
                      },
                    ].map((t) => (
                      <div
                        key={t.terminal}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                          style={{
                            borderColor: t.color,
                            color: t.color,
                            background: `${t.color}15`,
                          }}
                        >
                          {t.terminal}
                        </div>
                        <p className="text-xs text-muted-foreground text-center leading-tight w-16">
                          {t.wire}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      pair: "HERM → C",
                      measure: "Measures compressor capacitance",
                      example: "e.g. 45 µF",
                    },
                    {
                      pair: "FAN → C",
                      measure: "Measures fan motor capacitance",
                      example: "e.g. 5 µF",
                    },
                    {
                      pair: "HERM → FAN",
                      measure: "Total combined reading",
                      example: "e.g. 50 µF",
                    },
                  ].map((row) => (
                    <div
                      key={row.pair}
                      className="flex items-center gap-3 p-2.5 rounded-lg"
                      style={{
                        background: "oklch(var(--secondary) / 0.4)",
                        border: "1px solid oklch(var(--border))",
                      }}
                    >
                      <span className="text-sm font-bold text-primary w-28 flex-shrink-0">
                        {row.pair}
                      </span>
                      <span className="text-xs text-foreground flex-1">
                        {row.measure}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {row.example}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
          {
            heading: "How to Test",
            content: (
              <ol className="space-y-2">
                {[
                  "Power OFF — pull the disconnect and wait 5 minutes",
                  "Discharge capacitor: short each terminal to C using an insulated screwdriver",
                  "Set multimeter to Capacitance (µF / F) mode",
                  "Touch probes to HERM and C → compare reading to nameplate",
                  "Touch probes to FAN and C → compare reading to nameplate",
                  "Within 10% of rating = good. More than 10% low = replace",
                ].map((step, i) => (
                  <li
                    key={step.slice(0, 20)}
                    className="flex items-start gap-3"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            ),
          },
        ],
      };

    case "Contactor Wiring":
      return {
        title: "Contactor Wiring",
        description: "How a contactor controls 240V to the compressor and fan",
        icon: <Zap className="w-5 h-5" />,
        sections: [
          {
            heading: "Contactor Circuit Diagram",
            content: (
              <div className="space-y-3">
                <div
                  className="p-4 rounded-lg"
                  style={{
                    background: "oklch(var(--card))",
                    border: "2px solid #38bdf8",
                  }}
                >
                  <p className="text-xs font-bold text-muted-foreground mb-4 tracking-wider text-center">
                    CONTACTOR — LINE VOLTAGE SIDE (240V)
                  </p>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div
                        className="flex-1 p-2 rounded text-center text-xs font-bold"
                        style={{
                          background: "#ef444420",
                          border: "1px solid #ef4444",
                          color: "#ef4444",
                        }}
                      >
                        L1 (Hot 1)
                      </div>
                      <div
                        className="flex-1 p-2 rounded text-center text-xs font-bold"
                        style={{
                          background: "#f9731620",
                          border: "1px solid #f97316",
                          color: "#f97316",
                        }}
                      >
                        L2 (Hot 2)
                      </div>
                    </div>
                    <div className="flex justify-center py-1">
                      <div className="text-xs text-muted-foreground">
                        ↓ Contacts close when coil energized ↓
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="flex-1 p-2 rounded text-center text-xs font-bold"
                        style={{
                          background: "#22c55e20",
                          border: "1px solid #22c55e",
                          color: "#22c55e",
                        }}
                      >
                        T1 → Compressor
                      </div>
                      <div
                        className="flex-1 p-2 rounded text-center text-xs font-bold"
                        style={{
                          background: "#22c55e20",
                          border: "1px solid #22c55e",
                          color: "#22c55e",
                        }}
                      >
                        T2 → Fan Motor
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-4 p-3 rounded"
                    style={{
                      background: "oklch(var(--secondary) / 0.4)",
                      border: "1px solid oklch(var(--border))",
                    }}
                  >
                    <p className="text-xs font-bold text-muted-foreground mb-1 tracking-wider">
                      COIL (LOW VOLTAGE SIDE — 24V)
                    </p>
                    <div className="flex gap-2 justify-center">
                      <div
                        className="px-3 py-1.5 rounded text-xs font-bold"
                        style={{
                          background: "#8b5cf620",
                          border: "1px solid #8b5cf6",
                          color: "#8b5cf6",
                        }}
                      >
                        A1 — 24V from thermostat (Y wire)
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      check: "24V at coil (A1/A2)?",
                      yes: "Coil energized — contacts should close",
                      no: "Trace thermostat/control board",
                    },
                    {
                      check: "Voltage drop across contacts?",
                      yes: "Less than 5V = good contacts",
                      no: "More than 5V = pitted/burned contacts",
                    },
                  ].map((row) => (
                    <div
                      key={row.check}
                      className="p-2.5 rounded-lg"
                      style={{
                        background: "oklch(var(--secondary) / 0.4)",
                        border: "1px solid oklch(var(--border))",
                      }}
                    >
                      <p className="text-xs font-bold text-foreground mb-1">
                        {row.check}
                      </p>
                      <p className="text-xs text-green-400">✓ {row.yes}</p>
                      <p className="text-xs text-red-400">✗ {row.no}</p>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
        ],
      };

    case "Airflow Diagram":
      return {
        title: "Airflow Diagram",
        description: "How air moves through a residential HVAC system",
        icon: <Wind className="w-5 h-5" />,
        sections: [
          {
            heading: "Air Handler Flow Path",
            content: (
              <div className="space-y-2">
                {[
                  {
                    step: "1",
                    label: "RETURN AIR GRILLE",
                    detail:
                      "Room air pulled back into the system through return ducts",
                    color: "#6b7280",
                  },
                  {
                    step: "2",
                    label: "AIR FILTER",
                    detail:
                      "Catches dust, debris, and particles — replace regularly (1–3 months)",
                    color: "#f97316",
                  },
                  {
                    step: "3",
                    label: "BLOWER MOTOR",
                    detail: "Fan wheel pulls air across the evaporator coil",
                    color: "#8b5cf6",
                  },
                  {
                    step: "4",
                    label: "EVAPORATOR COIL",
                    detail: "Cold refrigerant absorbs heat from passing air",
                    color: "#38bdf8",
                  },
                  {
                    step: "5",
                    label: "SUPPLY DUCTS",
                    detail: "Cooled/heated air distributed to each room",
                    color: "#22c55e",
                  },
                  {
                    step: "6",
                    label: "SUPPLY REGISTERS",
                    detail:
                      "Adjustable vents deliver conditioned air into the space",
                    color: "#22c55e",
                  },
                ].map((item, i, arr) => (
                  <div key={item.step}>
                    <div
                      className="flex items-start gap-3 p-3 rounded-lg"
                      style={{
                        background: "oklch(var(--card))",
                        border: "1px solid oklch(var(--border))",
                      }}
                    >
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: item.color }}
                      >
                        {item.step}
                      </span>
                      <div>
                        <p
                          className="text-xs font-bold tracking-wider"
                          style={{ color: item.color }}
                        >
                          {item.label}
                        </p>
                        <p className="text-sm text-foreground mt-0.5">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex justify-center py-1">
                        <div className="w-0.5 h-4 bg-border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ),
          },
          {
            heading: "Target Airflow (by Tonnage)",
            content: (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { tons: "1.5 ton", cfm: "525–675 CFM" },
                  { tons: "2 ton", cfm: "700–900 CFM" },
                  { tons: "2.5 ton", cfm: "875–1125 CFM" },
                  { tons: "3 ton", cfm: "1050–1350 CFM" },
                  { tons: "3.5 ton", cfm: "1225–1575 CFM" },
                  { tons: "4 ton", cfm: "1400–1800 CFM" },
                ].map((row) => (
                  <div
                    key={row.tons}
                    className="p-2.5 rounded-lg text-center"
                    style={{
                      background: "oklch(var(--card))",
                      border: "1px solid oklch(var(--border))",
                    }}
                  >
                    <p className="text-xs font-bold text-primary">{row.tons}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                      {row.cfm}
                    </p>
                  </div>
                ))}
              </div>
            ),
          },
        ],
      };

    default:
      return null;
  }
}

// ─── Diagram Viewer ───────────────────────────────────────────────
function DiagramViewer({
  name,
  onClose,
}: { name: string; onClose: () => void }) {
  const diagram = getDiagramContent(name);
  if (!diagram) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "oklch(var(--background))" }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: "oklch(var(--border))" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: "oklch(var(--primary))" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Diagram
          </p>
          <p
            className="text-sm font-semibold truncate"
            style={{ color: "oklch(var(--foreground))" }}
          >
            {diagram.title}
          </p>
        </div>
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "oklch(var(--learn-bg))",
            color: "oklch(var(--learn-icon))",
          }}
        >
          {diagram.icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
          <p
            className="text-sm"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            {diagram.description}
          </p>
          {diagram.sections.map((section) => (
            <div key={section.heading}>
              <div
                className="flex items-center gap-2 mb-3 pb-1.5"
                style={{ borderBottom: "1px solid oklch(var(--border))" }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  {section.heading}
                </p>
              </div>
              {section.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Topic Card ───────────────────────────────────────────────────
function TopicCard({
  topic,
  index,
  isOpen,
  onToggle,
  onNavigateToStudy,
  onOpenDiagram,
}: {
  topic: KBTopic;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onNavigateToStudy: (categoryId: string, topicId: string) => void;
  onOpenDiagram: (name: string) => void;
}) {
  return (
    <div
      className="border border-border rounded-xl overflow-hidden bg-card shadow-xs"
      data-ocid={`kb.topic.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/40 transition-colors"
        data-ocid={`kb.topic.toggle.${index + 1}`}
      >
        <span
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{
            background: "oklch(var(--learn-bg))",
            color: "oklch(var(--learn-icon))",
          }}
        >
          {index + 1}
        </span>
        <span className="flex-1 font-semibold text-sm text-foreground">
          {topic.title}
        </span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-border px-4 pb-5 pt-4 space-y-5">
          {/* Explanation */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Explanation
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {topic.explanation}
            </p>
          </section>

          {/* Common Causes */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Common Causes
              </h3>
            </div>
            <ul className="space-y-1.5">
              {topic.commonCauses.map((cause) => (
                <li key={cause.slice(0, 40)} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span className="text-sm leading-relaxed text-foreground">
                    {cause}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Diagnostic Steps */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <ListOrdered className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Diagnostic Steps
              </h3>
            </div>
            <ol className="space-y-2">
              {topic.diagnosticSteps.map((step, si) => (
                <li key={step.slice(0, 40)} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                    {si + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Safety Tips */}
          {topic.safetyTips && topic.safetyTips.length > 0 && (
            <section className="rounded-lg border border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/20 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Safety Tips
                </h3>
              </div>
              <ul className="space-y-1.5">
                {topic.safetyTips.map((tip) => (
                  <li key={tip.slice(0, 40)} className="flex items-start gap-2">
                    <AlertTriangle className="flex-shrink-0 w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <span className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Related Resources */}
          {(topic.relatedVideos.length > 0 ||
            topic.relatedStudy.length > 0 ||
            topic.relatedDiagrams.length > 0) && (
            <section>
              <div className="flex items-center gap-2 mb-2.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Related Resources
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Videos — external links */}
                {topic.relatedVideos.map((v, vi) => (
                  <a
                    key={v.url}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 active:scale-95"
                    style={{
                      background: "oklch(var(--diagnose-bg))",
                      color: "oklch(var(--diagnose-icon))",
                      borderColor: "oklch(var(--diagnose-icon) / 0.3)",
                    }}
                    data-ocid={`kb.video.item.${vi + 1}`}
                  >
                    <Film className="w-3 h-3" />
                    {v.title}
                  </a>
                ))}

                {/* Study sections — navigate in-app */}
                {topic.relatedStudy.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => onNavigateToStudy(s.categoryId, s.topicId)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-80 active:scale-95 cursor-pointer"
                    style={{
                      background: "oklch(var(--learn-bg))",
                      color: "oklch(var(--learn-icon))",
                      borderColor: "oklch(var(--learn-icon) / 0.3)",
                    }}
                    data-ocid={`kb.study.item.${s.label.slice(0, 10)}`}
                  >
                    <BookOpen className="w-3 h-3" />
                    {s.label}
                  </button>
                ))}

                {/* Diagrams — open in-app viewer */}
                {topic.relatedDiagrams.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onOpenDiagram(d)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-80 active:scale-95 cursor-pointer"
                    style={{
                      background: "oklch(var(--tools-bg))",
                      color: "oklch(var(--jobs-icon))",
                      borderColor: "oklch(var(--jobs-icon) / 0.3)",
                    }}
                    data-ocid={`kb.diagram.item.${d.slice(0, 10)}`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    {d}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

interface KnowledgeBaseProps {
  onNavigateToStudy?: (categoryId: string, topicId: string) => void;
}

export default function KnowledgeBase({
  onNavigateToStudy,
}: KnowledgeBaseProps) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeDiagram, setActiveDiagram] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return KB_TOPICS;
    return KB_TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q)) ||
        t.explanation.toLowerCase().includes(q),
    );
  }, [query]);

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function handleNavigateToStudy(categoryId: string, topicId: string) {
    if (onNavigateToStudy) {
      onNavigateToStudy(categoryId, topicId);
    }
  }

  // Diagram viewer overlay
  if (activeDiagram) {
    return (
      <DiagramViewer
        name={activeDiagram}
        onClose={() => setActiveDiagram(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search HVAC topics..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpenId(null);
          }}
          className="pl-9 pr-9 h-10"
          data-ocid="kb.search_input"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpenId(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="kb.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result count */}
      {query && (
        <p className="text-xs text-muted-foreground px-0.5">
          {filtered.length === 0
            ? "No topics found. Try a different search term."
            : `${filtered.length} topic${filtered.length !== 1 ? "s" : ""} found`}
        </p>
      )}

      {/* Topics */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((topic, i) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={i}
              isOpen={openId === topic.id}
              onToggle={() => handleToggle(topic.id)}
              onNavigateToStudy={handleNavigateToStudy}
              onOpenDiagram={(name) => setActiveDiagram(name)}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-12 text-center"
          data-ocid="kb.empty_state"
        >
          <Search className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            No matching topics
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Try searching: "capacitor", "suction", "airflow"
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-3 text-xs text-primary hover:underline"
            data-ocid="kb.close_button"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Video Recommendations */}
      {query && filtered.length > 0 && (
        <VideoRecommendations keywords={extractKeywords(query)} />
      )}

      {!query && (
        <p className="text-xs text-muted-foreground text-center pt-1">
          {KB_TOPICS.length} topics · Tap any topic to expand
        </p>
      )}
    </div>
  );
}
