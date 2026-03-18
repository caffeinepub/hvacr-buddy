import VideoRecommendations from "@/components/VideoRecommendations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  FIELD_SCENARIOS,
  FieldAssistantScenario,
  MeasurementResult,
  getMeasurementInsight,
  matchesFieldQuery,
} from "@/utils/assistantLogic";
import { extractKeywords } from "@/utils/videoRecommendations";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  LayoutDashboard,
  Package,
  Paperclip,
  PlayCircle,
  Search,
  Upload,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetMyJobs, useUpdateJob } from "../hooks/useQueries";

interface Scenario {
  id: string;
  title: string;
  keywords: string[];
  causes: string[];
  steps: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "ac-not-cooling",
    title: "AC Not Cooling",
    keywords: ["ac not cooling", "not cooling", "no cold air", "ac warm"],
    causes: [
      "Low refrigerant / refrigerant leak",
      "Dirty or clogged condenser coils",
      "Faulty compressor",
      "Thermostat set incorrectly or malfunctioning",
    ],
    steps: [
      "Check the thermostat — ensure it is set to COOL and the temperature is below the current room temp.",
      "Inspect the air filter — replace if dirty or clogged.",
      "Check the outdoor condenser unit — look for debris blocking airflow around the unit.",
      "Listen for the compressor — if it is not running, check for tripped breakers or blown fuses.",
    ],
  },
  {
    id: "compressor-not-starting",
    title: "Compressor Not Starting",
    keywords: [
      "compressor not starting",
      "compressor won't start",
      "compressor not running",
    ],
    causes: [
      "Tripped circuit breaker or blown fuse",
      "Faulty capacitor",
      "Low refrigerant pressure lockout",
      "Defective contactor",
    ],
    steps: [
      "Check the electrical panel — reset any tripped breakers.",
      "Inspect the capacitor — a swollen or leaking capacitor needs replacement.",
      "Check refrigerant pressure — low pressure may trigger a safety lockout.",
      "Test the contactor — look for pitting or burning on the contacts.",
    ],
  },
  {
    id: "fan-running-no-cooling",
    title: "Fan Running But No Cooling",
    keywords: [
      "fan running no cooling",
      "fan on no cool",
      "air blowing but not cold",
    ],
    causes: [
      "Compressor has failed or is not engaging",
      "Low refrigerant charge",
      "Faulty run capacitor on the compressor",
      "Reversing valve stuck (heat pump units)",
    ],
    steps: [
      "Confirm the outdoor fan and compressor are both running — if only the fan runs, the compressor may be faulty.",
      "Check refrigerant pressures using gauges.",
      "Test the compressor capacitor for proper microfarad rating.",
      "On heat pumps, check if the reversing valve is stuck in heating mode.",
    ],
  },
  {
    id: "weak-airflow",
    title: "Weak Airflow",
    keywords: ["weak airflow", "low airflow", "poor airflow", "not enough air"],
    causes: [
      "Clogged air filter",
      "Blocked or closed supply/return vents",
      "Leaky or disconnected ductwork",
      "Blower motor issue",
    ],
    steps: [
      "Check and replace the air filter if dirty.",
      "Walk through the space and ensure all supply and return vents are open and unobstructed.",
      "Inspect accessible ductwork for disconnections or visible leaks.",
      "Listen to the blower motor — unusual noise or slow speed may indicate a failing motor or capacitor.",
    ],
  },
];

function matchesQuery(scenario: Scenario, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  if (scenario.title.toLowerCase().includes(q)) return true;
  return scenario.keywords.some((kw) => kw.includes(q));
}

interface DiagResult {
  issue: string;
  explanation: string;
  checks: string[];
}

function analyze(
  suction: number,
  head: number,
  superheat: number,
  subcooling: number,
): DiagResult {
  if (superheat > 15 && subcooling < 5) {
    return {
      issue: "Possible Low Refrigerant Charge",
      explanation:
        "High superheat combined with low subcooling is a strong indicator that the system is low on refrigerant or has a refrigerant leak.",
      checks: [
        "Inspect all refrigerant line connections and fittings for signs of oil or leaks.",
        "Check Schrader valve cores for leaks.",
        "Perform a leak search with an electronic leak detector or UV dye.",
        "Verify charge with manufacturer's superheat or subcooling target.",
      ],
    };
  }
  if (suction < 60 && superheat > 15) {
    return {
      issue: "Possible Restriction or Low Airflow",
      explanation:
        "Low suction pressure combined with high superheat suggests a refrigerant restriction or severely restricted airflow across the evaporator.",
      checks: [
        "Inspect and replace the air filter.",
        "Check the evaporator coil for ice or heavy dirt buildup.",
        "Inspect the TXV or metering device for restriction or malfunction.",
        "Verify all supply and return registers are open and unobstructed.",
      ],
    };
  }
  if (head > 350) {
    return {
      issue: "Possible Dirty Condenser or Condenser Airflow Problem",
      explanation:
        "Elevated head pressure is typically caused by a dirty condenser coil, blocked airflow around the outdoor unit, or a condenser fan issue.",
      checks: [
        "Inspect and clean the condenser coil.",
        "Check that nothing is blocking airflow around the outdoor unit (vegetation, panels, debris).",
        "Confirm the condenser fan is running at proper speed.",
        "Check for non-condensables in the refrigerant circuit.",
      ],
    };
  }
  return {
    issue: "Pressures Appear Near Normal — Possible Airflow Issue",
    explanation:
      "Refrigerant pressures look relatively normal. If cooling is still poor, the most likely cause is an airflow problem rather than a refrigerant issue.",
    checks: [
      "Check and replace the air filter.",
      "Inspect supply and return vents for blockage.",
      "Verify the blower wheel and motor are operating correctly.",
      "Measure the temperature differential (delta-T) across the evaporator coil — it should be 15–20°F.",
    ],
  };
}

function MeasurementsTab() {
  const [suction, setSuction] = useState("");
  const [head, setHead] = useState("");
  const [superheat, setSuperheat] = useState("");
  const [subcooling, setSubcooling] = useState("");
  const [result, setResult] = useState<DiagResult | null>(null);
  const [error, setError] = useState("");

  function handleAnalyze() {
    const s = Number.parseFloat(suction);
    const h = Number.parseFloat(head);
    const sh = Number.parseFloat(superheat);
    const sc = Number.parseFloat(subcooling);
    if (
      Number.isNaN(s) ||
      Number.isNaN(h) ||
      Number.isNaN(sh) ||
      Number.isNaN(sc)
    ) {
      setError("Please fill in all four fields before analyzing.");
      setResult(null);
      return;
    }
    setError("");
    setResult(analyze(s, h, sh, sc));
  }

  function handleClear() {
    setSuction("");
    setHead("");
    setSuperheat("");
    setSubcooling("");
    setResult(null);
    setError("");
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="suction">Suction Pressure (psig)</Label>
          <Input
            id="suction"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 70"
            value={suction}
            onChange={(e) => setSuction(e.target.value)}
            data-ocid="measurements.suction.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="head">Head Pressure (psig)</Label>
          <Input
            id="head"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 250"
            value={head}
            onChange={(e) => setHead(e.target.value)}
            data-ocid="measurements.head.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="superheat">Superheat (°F)</Label>
          <Input
            id="superheat"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 12"
            value={superheat}
            onChange={(e) => setSuperheat(e.target.value)}
            data-ocid="measurements.superheat.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subcooling">Subcooling (°F)</Label>
          <Input
            id="subcooling"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 10"
            value={subcooling}
            onChange={(e) => setSubcooling(e.target.value)}
            data-ocid="measurements.subcooling.input"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleAnalyze}
          data-ocid="measurements.analyze.primary_button"
        >
          Analyze
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          data-ocid="measurements.clear.secondary_button"
        >
          Clear
        </Button>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 text-sm text-destructive"
          data-ocid="measurements.error_state"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <Card data-ocid="measurements.result.card">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <CardTitle className="text-base font-semibold leading-snug">
                {result.issue}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {result.explanation}
            </p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Recommended Next Checks
              </p>
              <ul className="space-y-2">
                {result.checks.map((check) => (
                  <li
                    key={check}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
      {result && (
        <VideoRecommendations
          keywords={
            result.issue
              ? extractKeywords(result.issue)
              : ["refrigerant", "pressure", "airflow"]
          }
        />
      )}
    </div>
  );
}

// ─── Field HVAC Assistant ───────────────────────────────────────────────────

const EXAMPLE_CHIPS = [
  "AC not cooling",
  "Compressor not starting",
  "Fan running but no cooling",
  "Low suction pressure",
  "Frozen coil",
  "Short cycling",
  "Refrigerant leak",
];

// ─── Photo Analysis Mini (reused in Field Assistant) ─────────────────────────

function PhotoAnalysisMini() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    setSelected(new Set());
  }

  function toggleComponent(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedComponents = HVAC_COMPONENTS.filter((c) => selected.has(c.id));

  return (
    <div className="border-t border-border/50 pt-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
        data-ocid="field_assistant.photo.toggle"
      >
        <Camera className="h-4 w-4" />
        Photo Analysis
        {expanded ? (
          <ChevronUp className="h-4 w-4 ml-auto" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-auto" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {!photoUrl ? (
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                className="gap-2"
                data-ocid="field_assistant.photo.upload_button"
              >
                <Camera className="h-3.5 w-3.5" />
                Take Photo
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => uploadInputRef.current?.click()}
                className="gap-2"
                data-ocid="field_assistant.photo.upload_button"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Photo
              </Button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img
                  src={photoUrl}
                  alt="HVAC component for analysis"
                  className="w-full max-h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (photoUrl) URL.revokeObjectURL(photoUrl);
                    setPhotoUrl(null);
                    setSelected(new Set());
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/90 border border-border flex items-center justify-center"
                  aria-label="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {HVAC_COMPONENTS.map((comp) => {
                  const isSel = selected.has(comp.id);
                  return (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => toggleComponent(comp.id)}
                      className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${isSel ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary/50"}`}
                    >
                      {comp.name}
                    </button>
                  );
                })}
              </div>
              {selectedComponents.length > 0 && (
                <div className="space-y-2">
                  {selectedComponents.map((comp, i) => (
                    <Card
                      key={comp.id}
                      className={`border ${COMPONENT_BG[comp.id]}`}
                      data-ocid={`field_assistant.photo.item.${i + 1}`}
                    >
                      <CardContent className="pt-3 pb-3 space-y-2">
                        <p
                          className={`text-sm font-semibold ${COMPONENT_ACCENT[comp.id]}`}
                        >
                          {comp.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {comp.whatItDoes}
                        </p>
                        <p className="text-xs text-foreground">
                          <span className="font-medium">Issues: </span>
                          {comp.commonIssues}
                        </p>
                        <p className="text-xs text-foreground">
                          <span className="font-medium">Check: </span>
                          {comp.checkNext}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {comp.relatedVideos.map((v) => (
                            <span
                              key={v}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-medium"
                            >
                              <PlayCircle className="h-2.5 w-2.5" />
                              {v}
                            </span>
                          ))}
                          {comp.relatedStudy.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-medium"
                            >
                              <BookOpen className="h-2.5 w-2.5" />
                              {s}
                            </span>
                          ))}
                          {comp.relatedDiagrams.map((d) => (
                            <span
                              key={d}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-medium"
                            >
                              <LayoutDashboard className="h-2.5 w-2.5" />
                              {d}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {selected.size === 0 && (
                <p className="text-xs text-muted-foreground">
                  Select a component above to see analysis.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FieldAssistantTab() {
  const [query, setQuery] = useState("");
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [suction, setSuction] = useState("");
  const [head, setHead] = useState("");
  const [superheat, setSuperheat] = useState("");
  const [subcooling, setSubcooling] = useState("");

  const trimmed = query.trim();
  const match = trimmed
    ? (FIELD_SCENARIOS.find((s) => matchesFieldQuery(s, trimmed)) ?? null)
    : null;
  const noMatch = trimmed.length > 0 && match === null;

  const sVal = suction !== "" ? Number.parseFloat(suction) : null;
  const hVal = head !== "" ? Number.parseFloat(head) : null;
  const shVal = superheat !== "" ? Number.parseFloat(superheat) : null;
  const scVal = subcooling !== "" ? Number.parseFloat(subcooling) : null;

  const hasMeasurementInput =
    showMeasurements &&
    (suction !== "" || head !== "" || superheat !== "" || subcooling !== "");

  const measurementResult = hasMeasurementInput
    ? getMeasurementInsight(
        sVal !== null && !Number.isNaN(sVal) ? sVal : null,
        hVal !== null && !Number.isNaN(hVal) ? hVal : null,
        shVal !== null && !Number.isNaN(shVal) ? shVal : null,
        scVal !== null && !Number.isNaN(scVal) ? scVal : null,
      )
    : null;

  return (
    <div className="space-y-5">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="e.g. AC not cooling, compressor not starting…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          data-ocid="field_assistant.search_input"
        />
      </div>

      {/* Optional measurements toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowMeasurements((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="field_assistant.toggle"
        >
          {showMeasurements ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          Add Measurements (Optional)
        </button>

        {showMeasurements && (
          <div className="mt-3 p-4 rounded-lg border border-border bg-muted/30 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fa-suction" className="text-xs">
                  Suction Pressure (psig)
                </Label>
                <Input
                  id="fa-suction"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 70"
                  value={suction}
                  onChange={(e) => setSuction(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="field_assistant.suction.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fa-head" className="text-xs">
                  Head Pressure (psig)
                </Label>
                <Input
                  id="fa-head"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 250"
                  value={head}
                  onChange={(e) => setHead(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="field_assistant.head.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fa-superheat" className="text-xs">
                  Superheat (°F)
                </Label>
                <Input
                  id="fa-superheat"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 12"
                  value={superheat}
                  onChange={(e) => setSuperheat(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="field_assistant.superheat.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fa-subcooling" className="text-xs">
                  Subcooling (°F)
                </Label>
                <Input
                  id="fa-subcooling"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 10"
                  value={subcooling}
                  onChange={(e) => setSubcooling(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="field_assistant.subcooling.input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty prompt with example chips */}
      {!trimmed && !measurementResult && (
        <div className="pt-2" data-ocid="field_assistant.empty_state">
          <p className="text-sm text-muted-foreground mb-3">
            Enter a symptom above to get started. Try one of these:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setQuery(chip)}
                className="px-3 py-1.5 rounded-full border border-border bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/70 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Standalone measurement result card — shown even without a symptom match */}
      {measurementResult && (
        <Card
          className="border-amber-500/40 bg-amber-500/5"
          data-ocid="field_assistant.success_state"
        >
          <CardContent className="pt-4 pb-4 space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <p className="text-sm font-semibold text-foreground">
                {measurementResult.title}
              </p>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {measurementResult.insight}
            </p>
            <ul className="pl-6 space-y-1">
              {measurementResult.actions.map((action) => (
                <li
                  key={action}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  {action}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* No match */}
      {noMatch && (
        <div
          className="text-center py-12"
          data-ocid="field_assistant.error_state"
        >
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No match found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try rephrasing — e.g. "AC not cooling" or "low suction pressure".
          </p>
        </div>
      )}

      {/* Result card */}
      {match && (
        <Card data-ocid="field_assistant.result.card">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-2">
              <Wrench className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <CardTitle className="text-base font-semibold leading-snug">
                {match.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Likely Causes */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Likely Causes
              </p>
              <ul className="space-y-1.5">
                {match.causes.map((cause) => (
                  <li
                    key={cause}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {cause}
                  </li>
                ))}
              </ul>
            </div>

            {/* Diagnostic Steps */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Diagnostic Steps
              </p>
              <ol className="space-y-2">
                {match.steps.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Recommended Tools */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Recommended Tools
              </p>
              <ul className="space-y-1.5">
                {match.tools.map((tool) => (
                  <li
                    key={tool}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            {/* Possible Parts */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Possible Parts Needed
              </p>
              <div className="flex flex-wrap gap-1.5">
                {match.possibleParts.map((part) => (
                  <span
                    key={part}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-secondary text-secondary-foreground text-xs font-medium"
                  >
                    <Package className="h-3 w-3 flex-shrink-0" />
                    {part}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Content */}
            <div className="pt-1 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Related Content
              </p>
              <div className="space-y-2.5">
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Study Topics
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.relatedStudy.map((topic) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Videos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.relatedVideos.map((video) => (
                      <Badge
                        key={video}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {video}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Diagrams
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.relatedDiagrams.map((diagram) => (
                      <Badge
                        key={diagram}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {diagram}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(match || measurementResult) && (
        <VideoRecommendations
          keywords={[
            ...extractKeywords(query),
            ...(match ? match.keywords.slice(0, 3) : []),
          ]}
        />
      )}
      {/* Photo Analysis — inline mini tool */}
      <PhotoAnalysisMini />
    </div>
  );
}

// ─── Photo Diagnostic ────────────────────────────────────────────────────────

interface HvacComponent {
  id: string;
  name: string;
  whatItDoes: string;
  commonIssues: string;
  checkNext: string;
  relatedVideos: string[];
  relatedStudy: string[];
  relatedDiagrams: string[];
}

const HVAC_COMPONENTS: HvacComponent[] = [
  {
    id: "capacitor",
    name: "Capacitor",
    whatItDoes: "Helps start and run the compressor and fan motors.",
    commonIssues:
      "Weak or failed capacitor — causes hard starts, motor humming, or unit not starting.",
    checkNext:
      "Test microfarad rating with a multimeter or capacitor tester. Compare to the rated value on the label.",
    relatedVideos: ["Electrical and Schematics"],
    relatedStudy: ["Electrical Training — Contactors & Relays"],
    relatedDiagrams: ["Capacitor Wiring"],
  },
  {
    id: "contactor",
    name: "Contactor",
    whatItDoes: "Controls power flow to the compressor and condenser fan.",
    commonIssues:
      "Burnt or pitted contacts, no coil voltage, or contacts stuck open/closed.",
    checkNext:
      "Check voltage across the coil (24V). Inspect contacts for pitting or burning. Test continuity when engaged.",
    relatedVideos: ["Electrical and Schematics"],
    relatedStudy: ["Electrical Training — Contactors & Relays"],
    relatedDiagrams: ["Contactor Wiring"],
  },
  {
    id: "wiring",
    name: "Wiring",
    whatItDoes:
      "Carries control voltage and line voltage throughout the system.",
    commonIssues:
      "Loose connections, broken wires, or burnt insulation causing intermittent faults.",
    checkNext:
      "Check continuity with a multimeter. Inspect for loose terminals, corrosion, or heat damage.",
    relatedVideos: ["Electrical and Schematics"],
    relatedStudy: ["Electrical Training — Multimeter Usage"],
    relatedDiagrams: ["24V Control Circuit"],
  },
  {
    id: "gauges",
    name: "Refrigerant Gauges",
    whatItDoes: "Measure suction and head pressure in the refrigerant circuit.",
    commonIssues:
      "Inaccurate readings due to gauge error, Schrader valve leaks, or contaminated hoses.",
    checkNext:
      "Zero the gauges before use. Check Schrader cores for leaks. Compare readings to expected pressures for the refrigerant type.",
    relatedVideos: ["Refrigerant Diagnostics"],
    relatedStudy: ["HVAC Tools & Procedures — Gauges"],
    relatedDiagrams: ["Refrigeration Cycle"],
  },
  {
    id: "evaporator-coil",
    name: "Evaporator Coil",
    whatItDoes: "Absorbs heat from the indoor air to cool the space.",
    commonIssues:
      "Iced coil from low airflow or low refrigerant. Dirty coil reducing efficiency.",
    checkNext:
      "Check for ice buildup. Inspect and replace the air filter. Measure suction pressure and superheat.",
    relatedVideos: ["Refrigerant Diagnostics"],
    relatedStudy: ["Refrigeration System — Superheat & Subcooling"],
    relatedDiagrams: ["Refrigeration Cycle", "Airflow Diagram"],
  },
];

// accent color per component for visual distinction
const COMPONENT_ACCENT: Record<string, string> = {
  capacitor: "text-amber-500",
  contactor: "text-blue-500",
  wiring: "text-orange-500",
  gauges: "text-teal-500",
  "evaporator-coil": "text-cyan-500",
};

const COMPONENT_BG: Record<string, string> = {
  capacitor: "bg-amber-500/10 border-amber-500/30",
  contactor: "bg-blue-500/10 border-blue-500/30",
  wiring: "bg-orange-500/10 border-orange-500/30",
  gauges: "bg-teal-500/10 border-teal-500/30",
  "evaporator-coil": "bg-cyan-500/10 border-cyan-500/30",
};

function PhotoDiagnosticTab() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [photoNotes, setPhotoNotes] = useState("");
  const [showJobPanel, setShowJobPanel] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { identity } = useInternetIdentity();
  const { data: jobs } = useGetMyJobs();
  const updateJob = useUpdateJob();

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    setSelected(new Set());
    setPhotoNotes("");
    setShowJobPanel(false);
  }

  function handleClear() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setSelected(new Set());
    setPhotoNotes("");
    setShowJobPanel(false);
  }

  function toggleComponent(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function attachToJob(job: {
    id: bigint;
    title: string;
    notes: string;
    measurements: string;
    repairNotes: string;
    photos: string[];
    date: string;
  }) {
    if (!photoUrl) return;
    const updatedNotes = photoNotes
      ? job.notes
        ? `${job.notes}\n${photoNotes}`
        : photoNotes
      : job.notes;
    try {
      await updateJob.mutateAsync({
        jobId: job.id,
        title: job.title,
        notes: updatedNotes,
        measurements: job.measurements,
        repairNotes: job.repairNotes,
        photos: [...job.photos, photoUrl],
        date: job.date,
      });
      toast.success("Photo attached to job.");
      setShowJobPanel(false);
    } catch {
      toast.error("Failed to attach photo.");
    }
  }

  const selectedComponents = HVAC_COMPONENTS.filter((c) => selected.has(c.id));

  return (
    <div className="space-y-6">
      {/* Step 1 — Photo capture/upload */}
      {!photoUrl ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <Camera className="h-7 w-7 text-muted-foreground" />
            </div>
          </div>
          <div>
            <p className="font-medium text-foreground">Add a Photo</p>
            <p className="text-sm text-muted-foreground mt-1">
              Take or upload a photo of the HVAC components you want to inspect.
            </p>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button
              variant="default"
              onClick={() => cameraInputRef.current?.click()}
              className="gap-2"
              data-ocid="photo_diagnostic.upload_button"
            >
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
            <Button
              variant="outline"
              onClick={() => uploadInputRef.current?.click()}
              className="gap-2"
              data-ocid="photo_diagnostic.upload_button"
            >
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
          </div>
          {/* Hidden inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Photo preview */}
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img
              src={photoUrl}
              alt="HVAC component uploaded for analysis"
              className="w-full max-h-72 object-cover"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 border border-border flex items-center justify-center hover:bg-background transition-colors"
              data-ocid="photo_diagnostic.close_button"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Step 2 — Component selector */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Select the components visible in the photo:
            </p>
            <div
              className="flex flex-wrap gap-2"
              data-ocid="photo_diagnostic.panel"
            >
              {HVAC_COMPONENTS.map((comp) => {
                const isSelected = selected.has(comp.id);
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => toggleComponent(comp.id)}
                    className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-secondary"
                    }`}
                    data-ocid="photo_diagnostic.toggle"
                  >
                    {comp.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3 — Analysis results */}
          {selectedComponents.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">
                  Analysis Results
                </p>
              </div>
              {selectedComponents.map((comp, i) => (
                <Card
                  key={comp.id}
                  className={`border ${COMPONENT_BG[comp.id]}`}
                  data-ocid={`photo_diagnostic.item.${i + 1}`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle
                      className={`text-base font-semibold flex items-center gap-2 ${COMPONENT_ACCENT[comp.id]}`}
                    >
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      {comp.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        What It Does
                      </p>
                      <p className="text-sm text-foreground">
                        {comp.whatItDoes}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Common Issues
                      </p>
                      <p className="text-sm text-foreground">
                        {comp.commonIssues}
                      </p>
                    </div>
                    <div className="pt-1 border-t border-border/50">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        What to Check Next
                      </p>
                      <p className="text-sm text-foreground">
                        {comp.checkNext}
                      </p>
                    </div>
                    {/* Helpful Resources */}
                    <div className="pt-1 border-t border-border/50">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Helpful Resources
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {comp.relatedVideos.map((v) => (
                          <span
                            key={v}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-medium"
                          >
                            <PlayCircle className="h-3 w-3 flex-shrink-0" />
                            {v}
                          </span>
                        ))}
                        {comp.relatedStudy.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-medium"
                          >
                            <BookOpen className="h-3 w-3 flex-shrink-0" />
                            {s}
                          </span>
                        ))}
                        {comp.relatedDiagrams.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-medium"
                          >
                            <LayoutDashboard className="h-3 w-3 flex-shrink-0" />
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Notes + Attach to Job */}
              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="photo-notes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="photo-notes"
                    data-ocid="photo_diagnostic.textarea"
                    placeholder="Add notes about what you observed…"
                    value={photoNotes}
                    onChange={(e) => setPhotoNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  data-ocid="photo_diagnostic.open_modal_button"
                  onClick={() => setShowJobPanel((v) => !v)}
                >
                  <Paperclip className="h-4 w-4" />
                  Attach to Job
                  {showJobPanel ? (
                    <ChevronUp className="h-3.5 w-3.5 ml-1" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                  )}
                </Button>

                {showJobPanel && (
                  <div
                    className="rounded-lg border border-border bg-muted/30 p-4 space-y-2"
                    data-ocid="photo_diagnostic.panel"
                  >
                    {!identity ? (
                      <p className="text-sm text-muted-foreground">
                        Log in to attach this photo to a job.
                      </p>
                    ) : !jobs || jobs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No jobs found. Create a job first.
                      </p>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Select a job to attach this photo:
                        </p>
                        <div className="space-y-1.5">
                          {jobs.map((job, idx) => (
                            <button
                              key={job.id.toString()}
                              type="button"
                              data-ocid={`photo_diagnostic.item.${idx + 1}`}
                              onClick={() => attachToJob(job)}
                              disabled={updateJob.isPending}
                              className="w-full text-left px-3 py-2.5 rounded-md border border-border bg-background hover:bg-secondary hover:border-primary/40 transition-colors flex items-center justify-between gap-2 disabled:opacity-50"
                            >
                              <span className="text-sm font-medium text-foreground truncate">
                                {job.title}
                              </span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {job.date}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prompt if no component selected yet */}
          {selected.size === 0 && (
            <p
              className="text-sm text-muted-foreground text-center py-4"
              data-ocid="photo_diagnostic.empty_state"
            >
              Tap a component above to see its analysis.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DiagnosePage() {
  const [query, setQuery] = useState("");

  const results = SCENARIOS.filter((s) => matchesQuery(s, query));

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
              data-ocid="diagnose.back_button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Diagnose</h1>
            <p className="text-sm text-muted-foreground">
              Search by symptom, measurements, or analyze a photo.
            </p>
          </div>
        </div>

        <Tabs defaultValue="symptom" className="w-full">
          <TabsList
            className="mb-5 w-full grid grid-cols-4"
            data-ocid="diagnose.tab"
          >
            <TabsTrigger
              value="symptom"
              className="text-xs px-1"
              data-ocid="diagnose.symptom.tab"
            >
              Symptom
            </TabsTrigger>
            <TabsTrigger
              value="measurements"
              className="text-xs px-1"
              data-ocid="diagnose.measurements.tab"
            >
              Measurements
            </TabsTrigger>
            <TabsTrigger
              value="field-assistant"
              className="text-xs px-1"
              data-ocid="diagnose.field_assistant.tab"
            >
              Field Assist
            </TabsTrigger>
            <TabsTrigger
              value="photo"
              className="text-xs px-1"
              data-ocid="diagnose.photo.tab"
            >
              📷 Photo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptom">
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="e.g. AC not cooling, weak airflow, compressor..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                data-ocid="diagnose.search_input"
              />
            </div>

            {/* Results */}
            {results.length === 0 ? (
              <div
                className="text-center py-16"
                data-ocid="diagnose.empty_state"
              >
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">
                  No results found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different symptom or keyword.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {results.map((scenario, i) => (
                  <Card key={scenario.id} data-ocid={`diagnose.item.${i + 1}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">
                        {scenario.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Possible Causes
                        </p>
                        <ul className="space-y-1">
                          {scenario.causes.map((cause) => (
                            <li
                              key={cause}
                              className="flex items-start gap-2 text-sm text-foreground"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Diagnostic Steps
                        </p>
                        <ol className="space-y-1.5">
                          {scenario.steps.map((step, si) => (
                            <li
                              key={step}
                              className="flex items-start gap-2.5 text-sm text-foreground"
                            >
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold flex items-center justify-center">
                                {si + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          {query && results.length > 0 && (
            <VideoRecommendations keywords={extractKeywords(query)} />
          )}

          <TabsContent value="measurements">
            <MeasurementsTab />
          </TabsContent>

          <TabsContent value="field-assistant">
            <FieldAssistantTab />
          </TabsContent>

          <TabsContent value="photo">
            <PhotoDiagnosticTab />
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
