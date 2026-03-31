import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ChevronRight,
  FileSearch,
  Lightbulb,
  MapPin,
  Search,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type LookupState = "input" | "brand-type" | "result";

interface ManufacturerInfo {
  name: string;
  url: string;
}

const BRANDS: ManufacturerInfo[] = [
  {
    name: "Carrier",
    url: "https://www.carrier.com/residential/en/us/products/",
  },
  { name: "Trane", url: "https://www.trane.com/residential/en/resources/" },
  { name: "Lennox", url: "https://www.lennox.com/resources" },
  { name: "Goodman", url: "https://www.goodmanmfg.com/resources" },
  { name: "Rheem", url: "https://www.rheem.com/support/" },
  { name: "York", url: "https://www.york.com/" },
  { name: "Heil", url: "https://www.heil-hvac.com/" },
  { name: "Amana", url: "https://www.amana-hac.com/" },
  { name: "Bryant", url: "https://www.bryant.com/" },
  { name: "Payne", url: "https://www.payne.com/" },
  { name: "Other", url: "https://www.manualslib.com/" },
];

const BRAND_MAP: Record<string, ManufacturerInfo> = {
  Carrier: {
    name: "Carrier",
    url: "https://www.carrier.com/residential/en/us/products/",
  },
  Trane: {
    name: "Trane",
    url: "https://www.trane.com/residential/en/resources/",
  },
  Lennox: { name: "Lennox", url: "https://www.lennox.com/resources" },
  Goodman: { name: "Goodman", url: "https://www.goodmanmfg.com/resources" },
  Rheem: { name: "Rheem", url: "https://www.rheem.com/support/" },
  York: { name: "York", url: "https://www.york.com/" },
  Heil: { name: "Heil", url: "https://www.heil-hvac.com/" },
  Amana: { name: "Amana", url: "https://www.amana-hac.com/" },
  Bryant: { name: "Bryant", url: "https://www.bryant.com/" },
  Payne: { name: "Payne", url: "https://www.payne.com/" },
};

const PREFIX_MAP: Array<{ prefixes: string[]; brand: ManufacturerInfo }> = [
  {
    prefixes: ["38", "24", "25", "40", "48"],
    brand: {
      name: "Carrier",
      url: "https://www.carrier.com/residential/en/us/products/",
    },
  },
  {
    prefixes: ["4T", "2T", "TTT", "TW"],
    brand: {
      name: "Trane",
      url: "https://www.trane.com/residential/en/resources/",
    },
  },
  {
    prefixes: ["XC", "XP", "SL", "ML", "EL", "CB"],
    brand: { name: "Lennox", url: "https://www.lennox.com/resources" },
  },
  {
    prefixes: ["GSXC", "DSXC", "CAPF", "AMST", "ASZ"],
    brand: { name: "Goodman", url: "https://www.goodmanmfg.com/resources" },
  },
  {
    prefixes: ["RA", "RP", "RLNL", "RH"],
    brand: { name: "Rheem", url: "https://www.rheem.com/support/" },
  },
  {
    prefixes: ["YXV", "ZH", "ZF"],
    brand: { name: "York", url: "https://www.york.com/" },
  },
  {
    prefixes: ["HVA", "HVB"],
    brand: { name: "Heil", url: "https://www.heil-hvac.com/" },
  },
  {
    prefixes: ["ASX", "AVXC"],
    brand: { name: "Amana", url: "https://www.amana-hac.com/" },
  },
  {
    prefixes: ["186B", "189B", "215A"],
    brand: { name: "Bryant", url: "https://www.bryant.com/" },
  },
  {
    prefixes: ["PA4Z"],
    brand: { name: "Payne", url: "https://www.payne.com/" },
  },
];

function detectManufacturer(model: string): ManufacturerInfo | null {
  const upper = model.trim().toUpperCase();
  const sorted = [...PREFIX_MAP].sort(
    (a, b) =>
      Math.max(...b.prefixes.map((p) => p.length)) -
      Math.max(...a.prefixes.map((p) => p.length)),
  );
  for (const entry of sorted) {
    for (const prefix of entry.prefixes) {
      if (upper.startsWith(prefix.toUpperCase())) {
        return entry.brand;
      }
    }
  }
  return null;
}

const SYSTEM_TYPES = ["Air Conditioner", "Heat Pump", "Furnace", "Air Handler"];

const WHAT_IT_SHOWS = [
  "Electrical wiring paths from power source to each component",
  "Component connections — capacitor, contactor, thermostat, control board",
  "Control board terminal labels and wire designations",
  "Safety switch locations (high pressure, low pressure, float switch)",
  "Wire color codes and gauge specifications",
];

const READING_TIPS = [
  "Follow wire colors — each color represents a specific circuit or voltage",
  "Trace from the power source to the load to understand circuit flow",
  "Boxes or rectangles represent physical components",
  "Solid lines are wires; dashed lines indicate low-voltage control circuits",
  "Numbers or letters on terminals match the labels on the physical component",
];

interface ResultData {
  manufacturer: ManufacturerInfo;
  modelNumber: string;
  isUnknown: boolean;
}

function ResultCard({
  result,
  onStartOver,
}: {
  result: ResultData;
  onStartOver: () => void;
}) {
  const manualsLibUrl = `https://www.manualslib.com/search.php?q=${encodeURIComponent(result.modelNumber || result.manufacturer.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-4"
      data-ocid="schematic.result.panel"
    >
      {/* Detected badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {result.isUnknown ? (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: "rgba(100,116,139,0.2)",
              color: "#94A3B8",
              border: "1px solid rgba(100,116,139,0.3)",
            }}
          >
            <Search className="w-3 h-3" />
            Unknown Manufacturer
          </div>
        ) : (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: "#FEF3C7",
              color: "#92400E",
            }}
            data-ocid="schematic.manufacturer.badge"
          >
            <Zap className="w-3 h-3" />
            {result.manufacturer.name} System Detected
          </div>
        )}
        <button
          type="button"
          onClick={onStartOver}
          className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
          style={{ color: "#38BDF8" }}
          data-ocid="schematic.start_over.button"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Start Over
        </button>
      </div>

      {/* Unknown manufacturer note */}
      {result.isUnknown && (
        <div
          className="rounded-xl p-3.5 text-xs leading-relaxed"
          style={{
            background: "rgba(100,116,139,0.1)",
            border: "1px solid rgba(100,116,139,0.2)",
            color: "#94A3B8",
          }}
        >
          <p className="font-semibold text-white mb-1">
            Manufacturer not recognized from prefix.
          </p>
          Check the data plate on the unit for the brand name, then use
          ManualsLib or the manufacturer website to look up your schematic.
        </div>
      )}

      {/* Where to Find It */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "#1E293B",
          border: "1px solid rgba(56,189,248,0.12)",
        }}
        data-ocid="schematic.where_to_find.panel"
      >
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4" style={{ color: "#38BDF8" }} />
          <h4 className="text-sm font-bold text-white">Where to Find It</h4>
        </div>
        <ol className="space-y-2.5">
          {[
            {
              step: 1,
              text: "Check inside the unit access panel door — most units have the wiring schematic affixed there.",
            },
            {
              step: 2,
              text: "Search the model number on ManualsLib.com to download the exact schematic PDF.",
            },
            {
              step: 3,
              text: `Visit ${result.manufacturer.name}'s support site — enter your model number to locate official documentation.`,
            },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                style={{
                  background: "rgba(56,189,248,0.15)",
                  color: "#38BDF8",
                }}
              >
                {step}
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#CBD5F5" }}
              >
                {text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* What This Schematic Shows */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "#1E293B",
          border: "1px solid rgba(56,189,248,0.12)",
        }}
        data-ocid="schematic.what_it_shows.panel"
      >
        <div className="flex items-center gap-2 mb-3">
          <FileSearch className="w-4 h-4" style={{ color: "#FBBF24" }} />
          <h4 className="text-sm font-bold text-white">
            What This Schematic Shows
          </h4>
        </div>
        <ul className="space-y-1.5">
          {WHAT_IT_SHOWS.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <ChevronRight
                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                style={{ color: "#FBBF24" }}
              />
              <span
                className="text-xs leading-relaxed"
                style={{ color: "#CBD5F5" }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tips for Reading It */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "#1E293B",
          border: "1px solid rgba(56,189,248,0.12)",
        }}
        data-ocid="schematic.reading_tips.panel"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4" style={{ color: "#86EFAC" }} />
          <h4 className="text-sm font-bold text-white">Tips for Reading It</h4>
        </div>
        <ul className="space-y-1.5">
          {READING_TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <ChevronRight
                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                style={{ color: "#86EFAC" }}
              />
              <span
                className="text-xs leading-relaxed"
                style={{ color: "#CBD5F5" }}
              >
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <Button
          size="sm"
          className="w-full text-xs font-semibold gap-1.5"
          style={{ background: "#0EA5E9", color: "white" }}
          onClick={() => window.open(manualsLibUrl, "_blank")}
          data-ocid="schematic.manualslib.button"
        >
          <Search className="w-3.5 h-3.5" />
          Search ManualsLib
        </Button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-opacity hover:opacity-80"
          style={{
            border: "1px solid rgba(251,191,36,0.5)",
            color: "#FBBF24",
            background: "rgba(251,191,36,0.08)",
          }}
          onClick={() => window.open(result.manufacturer.url, "_blank")}
          data-ocid="schematic.manufacturer_site.button"
        >
          <Zap className="w-3.5 h-3.5" />
          {result.isUnknown
            ? "Open ManualsLib"
            : `Open ${result.manufacturer.name} Site`}
        </button>
      </div>
    </motion.div>
  );
}

export default function SchematicLookup() {
  const [state, setState] = useState<LookupState>("input");
  const [modelNumber, setModelNumber] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [validationError, setValidationError] = useState("");
  const [result, setResult] = useState<ResultData | null>(null);

  function handleFind() {
    const model = modelNumber.trim();
    const brand = selectedBrand;

    if (!model && !brand) {
      setValidationError(
        "Please enter a model number or select a brand to continue",
      );
      return;
    }
    setValidationError("");

    if (model) {
      const detected = detectManufacturer(model);
      if (detected) {
        setResult({
          manufacturer: detected,
          modelNumber: model,
          isUnknown: false,
        });
        setState("result");
      } else {
        const fallback =
          brand && BRAND_MAP[brand]
            ? BRAND_MAP[brand]
            : { name: "Unknown", url: "https://www.manualslib.com/" };
        setResult({
          manufacturer: fallback,
          modelNumber: model,
          isUnknown: !BRAND_MAP[brand],
        });
        setState("result");
      }
    } else {
      setState("brand-type");
    }
  }

  function handleSystemTypeSelect(type: string) {
    const brandInfo = BRAND_MAP[selectedBrand] || {
      name: selectedBrand || "Unknown",
      url: "https://www.manualslib.com/",
    };
    setResult({
      manufacturer: { ...brandInfo, name: `${brandInfo.name} ${type}` },
      modelNumber: "",
      isUnknown: false,
    });
    setState("result");
  }

  function handleStartOver() {
    setModelNumber("");
    setSelectedBrand("");
    setValidationError("");
    setResult(null);
    setState("input");
  }

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "#162032",
        border: "1px solid rgba(251,191,36,0.18)",
      }}
      data-ocid="schematic.lookup.panel"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(251,191,36,0.15)" }}
        >
          <FileSearch className="w-4 h-4" style={{ color: "#FBBF24" }} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white leading-tight">
            Find Your System Schematic
          </h2>
          <p className="text-[11px]" style={{ color: "#64748B" }}>
            Enter your model number for exact guidance
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* INPUT STATE */}
        {state === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Model number */}
            <div>
              <label
                htmlFor="model-number-input"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Model Number
                <span
                  className="ml-1 text-[10px] font-normal"
                  style={{ color: "#475569" }}
                >
                  (preferred)
                </span>
              </label>
              <Input
                id="model-number-input"
                value={modelNumber}
                onChange={(e) => {
                  setModelNumber(e.target.value);
                  setValidationError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleFind()}
                placeholder="e.g. 38CKC036310"
                className="text-sm"
                style={{
                  background: "#0F172A",
                  border: "1px solid rgba(56,189,248,0.2)",
                  color: "white",
                }}
                data-ocid="schematic.model_number.input"
              />
            </div>

            {/* Brand */}
            <div>
              {/* Use p instead of label since Select doesn't expose a native input id */}
              <p
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#94A3B8" }}
              >
                Brand
                <span
                  className="ml-1 text-[10px] font-normal"
                  style={{ color: "#475569" }}
                >
                  (optional)
                </span>
              </p>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger
                  aria-label="Select brand"
                  className="text-sm"
                  style={{
                    background: "#0F172A",
                    border: "1px solid rgba(56,189,248,0.2)",
                    color: selectedBrand ? "white" : "#475569",
                  }}
                  data-ocid="schematic.brand.select"
                >
                  <SelectValue placeholder="Select brand..." />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "#1E293B",
                    border: "1px solid rgba(56,189,248,0.2)",
                  }}
                >
                  {BRANDS.map((b) => (
                    <SelectItem
                      key={b.name}
                      value={b.name}
                      className="text-white focus:bg-slate-700"
                    >
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Validation error */}
            {validationError && (
              <p
                className="text-xs font-medium"
                style={{ color: "#F87171" }}
                data-ocid="schematic.validation.error_state"
              >
                {validationError}
              </p>
            )}

            {/* Submit */}
            <Button
              className="w-full font-semibold text-sm gap-2"
              style={{ background: "#0EA5E9", color: "white" }}
              onClick={handleFind}
              data-ocid="schematic.find.submit_button"
            >
              <Search className="w-4 h-4" />
              Find Schematic
            </Button>

            {/* Tip */}
            <div
              className="flex items-start gap-2 rounded-lg p-2.5"
              style={{
                background: "rgba(56,189,248,0.07)",
                border: "1px solid rgba(56,189,248,0.1)",
              }}
            >
              <MapPin
                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                style={{ color: "#38BDF8" }}
              />
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: "#7DD3FC" }}
              >
                <span className="font-semibold">Tip:</span> Model number is on
                the data plate — usually on the side panel of the outdoor unit
              </p>
            </div>
          </motion.div>
        )}

        {/* BRAND TYPE STATE */}
        {state === "brand-type" && (
          <motion.div
            key="brand-type"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
            data-ocid="schematic.brand_type.panel"
          >
            <p className="text-sm font-semibold text-white">
              What type of {selectedBrand} system are you working on?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SYSTEM_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSystemTypeSelect(type)}
                  className="flex items-center gap-2 p-3 rounded-xl text-xs font-semibold text-left transition-all hover:opacity-80 active:scale-95"
                  style={{
                    background: "#1E293B",
                    border: "1px solid rgba(56,189,248,0.18)",
                    color: "#CBD5F5",
                  }}
                  data-ocid="schematic.system_type.button"
                >
                  <ChevronRight
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "#38BDF8" }}
                  />
                  {type}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleStartOver}
              className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
              style={{ color: "#38BDF8" }}
              data-ocid="schematic.back.button"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </motion.div>
        )}

        {/* RESULT STATE */}
        {state === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <ResultCard result={result} onStartOver={handleStartOver} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
