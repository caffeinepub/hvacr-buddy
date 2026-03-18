import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ExternalLink,
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
    title: "EPA 608 Prep",
    links: [
      {
        label: "EPA 608 Core Exam Study Guide",
        url: "https://www.youtube.com/watch?v=6W8P6DKrLKs",
      },
      {
        label: "EPA 608 Type II Practice Questions",
        url: "https://www.youtube.com/watch?v=5rDm6OQYDNE",
      },
      {
        label: "Refrigerant Regulations Overview",
        url: "https://www.youtube.com/watch?v=4QH9p0eMkB4",
      },
    ],
  },
  {
    id: "electrical-schematics",
    title: "Electrical & Schematics",
    links: [
      {
        label: "How to Read HVAC Wiring Diagrams",
        url: "https://www.youtube.com/watch?v=p9_5keR5hLc",
      },
      {
        label: "HVAC Electrical Basics",
        url: "https://www.youtube.com/watch?v=3g5Q5bTVrKc",
      },
      {
        label: "Reading Ladder Diagrams",
        url: "https://www.youtube.com/watch?v=qDR7JqcqUkA",
      },
    ],
  },
  {
    id: "refrigerant-diagnostics",
    title: "Refrigerant Diagnostics",
    links: [
      {
        label: "Superheat and Subcooling Explained",
        url: "https://www.youtube.com/watch?v=M8dWxPvMhAE",
      },
      {
        label: "How to Diagnose Low Refrigerant",
        url: "https://www.youtube.com/watch?v=lOC3JzNkUsw",
      },
      {
        label: "Refrigerant Pressure Chart Walkthrough",
        url: "https://www.youtube.com/watch?v=YmFNADQjAic",
      },
    ],
  },
  {
    id: "tools-procedures",
    title: "HVAC Tools & Procedures",
    links: [
      {
        label: "How to Use a Manifold Gauge Set",
        url: "https://www.youtube.com/watch?v=yw3Hag7FvTs",
      },
      {
        label: "Using a Multimeter for HVAC",
        url: "https://www.youtube.com/watch?v=SLkEP_Zy3CE",
      },
      {
        label: "Nitrogen Pressure Testing",
        url: "https://www.youtube.com/watch?v=IJ5sW9FHZAU",
      },
    ],
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
function VideosTab() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-2" data-ocid="learn.videos.list">
      {VIDEO_CATEGORIES.map((cat, i) => {
        const isOpen = openId === cat.id;
        return (
          <Card
            key={cat.id}
            className="overflow-hidden"
            data-ocid={`learn.videos.item.${i + 1}`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-accent/50 transition-colors"
              onClick={() => toggle(cat.id)}
              data-ocid={`learn.videos.toggle.${i + 1}`}
            >
              <p className="font-semibold text-foreground text-sm">
                {cat.title}
              </p>
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

// ─── LearnPage ─────────────────────────────────────────────────
export default function LearnPage() {
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
        <Tabs defaultValue="study" className="w-full">
          <TabsList className="mb-5 w-full" data-ocid="learn.tab">
            <TabsTrigger
              value="study"
              className="flex-1"
              data-ocid="learn.study.tab"
            >
              Study
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="flex-1"
              data-ocid="learn.videos.tab"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="diagrams"
              className="flex-1"
              data-ocid="learn.diagrams.tab"
            >
              Diagrams
            </TabsTrigger>
          </TabsList>

          <TabsContent value="study">
            <StudyTab />
          </TabsContent>

          <TabsContent value="videos">
            <VideosTab />
          </TabsContent>

          <TabsContent value="diagrams">
            <DiagramsTab />
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
