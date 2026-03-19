import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  LogOut,
  MapPin,
  QrCode,
  Settings,
  Stethoscope,
  Wind,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const FEATURE_CARDS = [
  {
    key: "diagnose",
    path: "/diagnose",
    title: "Diagnose",
    description: "Identify and troubleshoot HVAC faults quickly.",
    icon: Stethoscope,
    iconStyle: {
      color: "oklch(var(--diagnose-icon))",
      bg: "oklch(var(--diagnose-bg))",
    },
  },
  {
    key: "jobs",
    path: "/jobs",
    title: "Jobs",
    description: "View and manage your scheduled service jobs.",
    icon: Briefcase,
    iconStyle: {
      color: "oklch(var(--jobs-icon))",
      bg: "oklch(var(--jobs-bg))",
    },
  },
  {
    key: "learn",
    path: "/learn",
    title: "Learn",
    description: "Access guides, training resources, and tips.",
    icon: BookOpen,
    iconStyle: {
      color: "oklch(var(--learn-icon))",
      bg: "oklch(var(--learn-bg))",
    },
  },
  {
    key: "tools",
    path: "/tools",
    title: "Tools",
    description: "Calculators, references, and field utilities.",
    icon: Wrench,
    iconStyle: {
      color: "oklch(var(--tools-icon))",
      bg: "oklch(var(--tools-bg))",
    },
  },
];

interface Scenario {
  keywords: string[];
  causes: string[];
  steps: string[];
  videos: { title: string; url: string }[];
}

const SCENARIOS: Scenario[] = [
  {
    keywords: [
      "ac not cooling",
      "not cooling",
      "warm air",
      "no cool",
      "low cooling",
    ],
    causes: [
      "Low refrigerant charge",
      "Dirty or clogged air filter",
      "Failed compressor",
    ],
    steps: [
      "Check and replace the air filter if dirty",
      "Verify thermostat is set to COOL and below room temp",
      "Check refrigerant pressure with gauges — low pressure indicates a leak or undercharge",
    ],
    videos: [
      {
        title: "EPA 608 Core Prep Part 1",
        url: "https://www.youtube.com/watch?v=BLtBaCt81i4",
      },
    ],
  },
  {
    keywords: ["frozen coil", "ice", "freezing", "iced up"],
    causes: [
      "Low airflow over evaporator coil",
      "Low refrigerant causing coil to over-cool",
      "Dirty evaporator coil",
    ],
    steps: [
      "Turn off the unit and let the ice melt completely",
      "Check and replace the air filter",
      "Verify all supply/return vents are open and unobstructed",
    ],
    videos: [
      {
        title: "How to Remove (Recover) Refrigerant",
        url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
      },
    ],
  },
  {
    keywords: ["not heating", "no heat", "heat not working", "won't heat"],
    causes: [
      "Failed heat strip or heat element",
      "Bad or misconfigured thermostat",
      "Tripped breaker on heating circuit",
    ],
    steps: [
      "Check thermostat — ensure it's set to HEAT and above room temp",
      "Check the breaker panel for any tripped breakers",
      "Test heat strip continuity with a multimeter",
    ],
    videos: [],
  },
  {
    keywords: [
      "short cycling",
      "turns off",
      "keeps turning off",
      "cycles too fast",
    ],
    causes: [
      "Dirty air filter restricting airflow",
      "Low refrigerant charge",
      "Oversized unit for the space",
    ],
    steps: [
      "Check and replace the air filter",
      "Measure refrigerant pressures — look for low suction pressure",
      "Verify thermostat location is not near a heat source",
    ],
    videos: [],
  },
  {
    keywords: ["high pressure", "high head", "high head pressure"],
    causes: [
      "Dirty condenser coil blocking heat rejection",
      "Blocked airflow around outdoor unit",
      "Refrigerant overcharge",
    ],
    steps: [
      "Clean condenser coils with coil cleaner and rinse",
      "Ensure 18–24 inches of clearance around the outdoor unit",
      "Check refrigerant charge — recover excess if overcharged",
    ],
    videos: [
      {
        title: "How to Evacuate an AC System",
        url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
      },
    ],
  },
  {
    keywords: [
      "electrical",
      "not turning on",
      "no power",
      "tripped breaker",
      "won't start",
      "unit not starting",
    ],
    causes: [
      "Tripped circuit breaker",
      "Failed run or start capacitor",
      "Burnt or worn contactor contacts",
    ],
    steps: [
      "Check breaker panel — reset any tripped breaker once",
      "Test capacitor microfarads with a multimeter (replace if ±10% of rating)",
      "Inspect contactor for burnt or pitted contacts",
    ],
    videos: [
      {
        title: "How Power Moves Through an AC Schematic",
        url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
      },
    ],
  },
  {
    keywords: [
      "capacitor",
      "fan not spinning",
      "fan won't spin",
      "capacitor failed",
    ],
    causes: ["Failed run capacitor", "Weak or bulging capacitor"],
    steps: [
      "Check capacitor microfarads with a multimeter — replace if out of tolerance",
      "Visually inspect for bulging top or oil residue",
      "Replace capacitor with same MFD and voltage rating",
    ],
    videos: [
      {
        title: "How Power Moves Through an AC Schematic",
        url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
      },
    ],
  },
  {
    keywords: [
      "refrigerant leak",
      "leak",
      "low refrigerant",
      "oily residue",
      "hissing",
    ],
    causes: [
      "Low refrigerant from a leak",
      "Oily residue visible near fittings or coil",
      "Audible hissing near refrigerant lines",
    ],
    steps: [
      "Connect gauges and check suction/head pressures",
      "Use an electronic leak detector around coils and fittings",
      "Repair leak, pull vacuum, and recharge to manufacturer spec",
    ],
    videos: [
      {
        title: "How to Remove (Recover) Refrigerant",
        url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
      },
      {
        title: "How to Evacuate an AC System",
        url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
      },
    ],
  },
];

function matchScenario(query: string): Scenario | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  for (const scenario of SCENARIOS) {
    for (const kw of scenario.keywords) {
      if (q.includes(kw)) return scenario;
    }
  }
  return null;
}

const QUICK_ACTIONS = [
  {
    label: "Troubleshoot System",
    icon: Wrench,
    action: "troubleshoot" as const,
    color: "var(--diagnose-icon)",
    bg: "var(--diagnose-bg)",
  },
  {
    label: "Identify Error Code",
    icon: QrCode,
    action: "diagnose" as const,
    color: "var(--jobs-icon)",
    bg: "var(--jobs-bg)",
  },
  {
    label: "Find Parts Near Me",
    icon: MapPin,
    action: "tools" as const,
    color: "var(--tools-icon)",
    bg: "var(--tools-bg)",
  },
  {
    label: "EPA Practice Mode",
    icon: GraduationCap,
    action: "learn" as const,
    color: "var(--learn-icon)",
    bg: "var(--learn-bg)",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const displayName = userProfile?.name ?? "there";

  const [symptomInput, setSymptomInput] = useState("");
  const [diagResult, setDiagResult] = useState<Scenario | null | "no-match">(
    null,
  );

  const handleSignOut = async () => {
    await clear();
    queryClient.clear();
  };

  const handleTroubleshoot = () => {
    const result = matchScenario(symptomInput);
    setDiagResult(result ?? "no-match");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleTroubleshoot();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymptomInput(e.target.value);
    if (diagResult !== null) setDiagResult(null);
  };

  const handleQuickAction = (
    action: (typeof QUICK_ACTIONS)[number]["action"],
  ) => {
    if (action === "troubleshoot") {
      handleTroubleshoot();
    } else if (action === "diagnose") {
      navigate({ to: "/diagnose" });
    } else if (action === "tools") {
      navigate({ to: "/tools" });
    } else if (action === "learn") {
      navigate({ to: "/learn" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-xs">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: "oklch(var(--primary) / 1)" }}
            >
              <Wind className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold text-foreground tracking-tight">
                HVAC Mentor AI
              </span>
              <span
                className="block text-[10px] font-500 uppercase tracking-widest"
                style={{ color: "oklch(var(--primary) / 1)" }}
              >
                HVAC
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="header.settings.button"
              className="relative p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {displayName}
              </span>
            </div>
            <Button
              data-ocid="header.sign_out.button"
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* AI Assistant Card */}
        <section className="pt-8 pb-4 px-6">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="bg-card border border-border rounded-2xl shadow-card p-6"
              data-ocid="assistant.card"
            >
              {/* Greeting */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "oklch(var(--primary) / 0.12)" }}
                  >
                    <Wind
                      className="w-5 h-5"
                      style={{ color: "oklch(var(--primary) / 1)" }}
                    />
                  </div>
                  <span className="text-lg font-bold text-foreground tracking-tight">
                    👋 What are you working on today?
                  </span>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Describe your issue and I'll help you diagnose it.
                </p>
              </div>

              {/* Input */}
              <div className="flex gap-2 mb-5">
                <Input
                  data-ocid="assistant.input"
                  value={symptomInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe issue... (Low cooling, unit not starting, etc.)"
                  className="flex-1 rounded-xl border-border bg-background text-sm h-11"
                />
              </div>

              {/* Quick Action Buttons — 2x2 grid */}
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((qa) => {
                  const Icon = qa.icon;
                  return (
                    <button
                      key={qa.label}
                      type="button"
                      data-ocid={`assistant.${qa.action}.button`}
                      onClick={() => handleQuickAction(qa.action)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: `oklch(${qa.bg})` }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: `oklch(${qa.color})` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {qa.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Diagnose Results */}
              <AnimatePresence>
                {diagResult !== null && (
                  <motion.div
                    key="results"
                    data-ocid="assistant.panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <Separator className="my-5" />

                    {diagResult === "no-match" ? (
                      <div
                        data-ocid="assistant.empty_state"
                        className="text-sm text-muted-foreground"
                      >
                        No match found. Try the full{" "}
                        <button
                          type="button"
                          data-ocid="assistant.diagnose.link"
                          onClick={() => navigate({ to: "/diagnose" })}
                          className="underline font-medium text-foreground hover:text-primary transition-colors"
                        >
                          Diagnose tool
                        </button>
                        .
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Likely Causes
                          </p>
                          <ul className="space-y-1">
                            {diagResult.causes.map((cause) => (
                              <li
                                key={cause}
                                className="flex items-start gap-2 text-sm text-foreground"
                              >
                                <span
                                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{
                                    background: "oklch(var(--diagnose-icon))",
                                  }}
                                />
                                {cause}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Troubleshooting Steps
                          </p>
                          <ol className="space-y-1">
                            {diagResult.steps.map((step, stepIdx) => (
                              <li
                                key={step}
                                className="flex items-start gap-2 text-sm text-foreground"
                              >
                                <span
                                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                                  style={{
                                    background: "oklch(var(--primary) / 1)",
                                  }}
                                >
                                  {stepIdx + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {diagResult.videos.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Suggested Videos
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {diagResult.videos.map((video, vidIdx) => (
                                  <a
                                    key={video.url}
                                    data-ocid={`assistant.video.item.${vidIdx + 1}`}
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted text-xs font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
                                  >
                                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                    {video.title}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="py-6 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURE_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    type="button"
                    key={card.key}
                    data-ocid={`dashboard.${card.key}.card`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 12px 28px rgba(17,24,39,0.12)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate({ to: card.path })}
                    className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-4 shadow-card cursor-pointer text-left w-full transition-colors hover:border-primary/40"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: card.iconStyle.bg }}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{ color: card.iconStyle.color }}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground">
                        {card.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Continue Learning */}
        <section className="pb-12 px-6">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="bg-card border border-border rounded-xl shadow-card p-5 flex items-center justify-between gap-4"
              data-ocid="continue_learning.card"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(var(--learn-bg))" }}
                >
                  <GraduationCap
                    className="w-5 h-5"
                    style={{ color: "oklch(var(--learn-icon))" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Continue Learning
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pick up where you left off
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-ocid="continue_learning.link"
                onClick={() => navigate({ to: "/learn" })}
                className="flex items-center gap-1.5 text-sm font-semibold shrink-0 transition-colors hover:opacity-80"
                style={{ color: "oklch(var(--primary) / 1)" }}
              >
                Resume EPA Section
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-md"
                style={{ background: "oklch(var(--primary) / 1)" }}
              >
                <Wind className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-bold text-foreground">
                HVAC Mentor AI
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
