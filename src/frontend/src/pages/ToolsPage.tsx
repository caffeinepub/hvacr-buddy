import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  Search,
  Store,
} from "lucide-react";
import { useState } from "react";

// ─── Parts Data ──────────────────────────────────────────────────────────────

interface HvacPart {
  name: string;
  description: string;
  typicalUse: string;
}

const PARTS: HvacPart[] = [
  {
    name: "Capacitor",
    description: "Stores and releases electrical energy",
    typicalUse: "Starts/runs compressor and fan motors",
  },
  {
    name: "Contactor",
    description: "Electrically controlled switch",
    typicalUse: "Switches high voltage to compressor",
  },
  {
    name: "TXV (Thermostatic Expansion Valve)",
    description: "Regulates refrigerant flow into evaporator",
    typicalUse: "Metering device in split systems",
  },
  {
    name: "Refrigerant (R-410A)",
    description: "Heat transfer fluid",
    typicalUse: "Carries heat in refrigeration cycle",
  },
  {
    name: "Refrigerant (R-22)",
    description: "Older heat transfer fluid",
    typicalUse: "Legacy systems only",
  },
  {
    name: "Filter Drier",
    description: "Removes moisture and debris",
    typicalUse: "Installed on liquid line",
  },
  {
    name: "Blower Motor",
    description: "Moves air across evaporator coil",
    typicalUse: "Indoor air handler",
  },
  {
    name: "Condenser Fan Motor",
    description: "Moves air across condenser coil",
    typicalUse: "Outdoor unit",
  },
  {
    name: "Contactor Coil",
    description: "Energizes contactor to close contacts",
    typicalUse: "Low voltage control circuit",
  },
  {
    name: "Transformer (24V)",
    description: "Steps down voltage for control circuit",
    typicalUse: "Powers thermostat and controls",
  },
  {
    name: "Thermostat",
    description: "Controls system based on temperature",
    typicalUse: "User interface for heating/cooling",
  },
  {
    name: "Pressure Switch (High/Low)",
    description: "Monitors refrigerant pressure",
    typicalUse: "Safety shutoff",
  },
  {
    name: "Hard Start Kit",
    description: "Assists compressor on startup",
    typicalUse: "Used on aged or struggling compressors",
  },
  {
    name: "Run Capacitor",
    description: "Keeps motor running efficiently",
    typicalUse: "Compressor and fan motors",
  },
  {
    name: "Start Capacitor",
    description: "Provides extra torque on startup",
    typicalUse: "Single-phase motors",
  },
  {
    name: "Reversing Valve",
    description: "Switches between heat and cool mode",
    typicalUse: "Heat pumps",
  },
  {
    name: "Accumulator",
    description: "Prevents liquid refrigerant from entering compressor",
    typicalUse: "Suction line",
  },
  {
    name: "Sight Glass",
    description: "Shows refrigerant charge condition",
    typicalUse: "Liquid line",
  },
  {
    name: "Service Valve (Schrader)",
    description: "Access port for gauges",
    typicalUse: "Suction and liquid line",
  },
  {
    name: "Evaporator Coil",
    description: "Absorbs heat from indoor air",
    typicalUse: "Indoor air handler",
  },
  {
    name: "Condenser Coil",
    description: "Releases heat to outdoor air",
    typicalUse: "Outdoor unit",
  },
  {
    name: "Compressor",
    description: "Pumps refrigerant through system",
    typicalUse: "Heart of the refrigeration system",
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

// ─── Parts Tab ───────────────────────────────────────────────────────────────

function PartsTab() {
  const [query, setQuery] = useState("");

  const filtered = PARTS.filter((p) =>
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

      {filtered.length === 0 ? (
        <div className="text-center py-14" data-ocid="parts.empty_state">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No parts found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((part, i) => (
            <Card
              key={part.name}
              className="border border-border"
              data-ocid={`parts.item.${i + 1}`}
            >
              <CardContent className="py-4 px-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-7 h-7 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-semibold text-sm text-foreground leading-snug">
                      {part.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {part.description}
                    </p>
                    <p className="text-xs text-foreground/70 pt-0.5">
                      <span className="font-medium text-muted-foreground">
                        Use:{" "}
                      </span>
                      {part.typicalUse}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
      key={supplier.id}
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
              data-ocid="tools.back_button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tools</h1>
            <p className="text-sm text-muted-foreground">
              Parts reference and local suppliers.
            </p>
          </div>
        </div>

        <Tabs defaultValue="parts" className="w-full">
          <TabsList
            className="mb-5 w-full grid grid-cols-2"
            data-ocid="tools.tab"
          >
            <TabsTrigger value="parts" data-ocid="tools.parts.tab">
              Parts
            </TabsTrigger>
            <TabsTrigger value="suppliers" data-ocid="tools.suppliers.tab">
              Suppliers
            </TabsTrigger>
          </TabsList>

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
    </div>
  );
}
