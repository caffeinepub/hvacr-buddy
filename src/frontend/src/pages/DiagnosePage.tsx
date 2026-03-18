import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, CheckCircle2, Search } from "lucide-react";
import { useState } from "react";

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
    </div>
  );
}

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
              Search by symptom or enter measurements for a quick diagnosis.
            </p>
          </div>
        </div>

        <Tabs defaultValue="symptom" className="w-full">
          <TabsList className="mb-5 w-full" data-ocid="diagnose.tab">
            <TabsTrigger
              value="symptom"
              className="flex-1"
              data-ocid="diagnose.symptom.tab"
            >
              Symptom Search
            </TabsTrigger>
            <TabsTrigger
              value="measurements"
              className="flex-1"
              data-ocid="diagnose.measurements.tab"
            >
              Measurements
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

          <TabsContent value="measurements">
            <MeasurementsTab />
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
