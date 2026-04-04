import BottomTabBar from "@/components/BottomTabBar";
import SchematicLookup from "@/components/SchematicLookup";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  BookText,
  ExternalLink,
  FileSearch,
  GraduationCap,
  Search,
  Wrench,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface Resource {
  title: string;
  description: string;
  url: string;
}

interface ResourceSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  resources: Resource[];
}

const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    id: "manufacturer-manuals",
    title: "Manufacturer Manuals",
    icon: <BookText className="w-4 h-4" />,
    resources: [
      {
        title: "Carrier",
        description:
          "Installation, service, and product manuals for Carrier HVAC systems",
        url: "https://www.carrier.com/residential/en/us/products/",
      },
      {
        title: "Trane",
        description:
          "Technical documents, installation guides, and service manuals",
        url: "https://www.trane.com/residential/en/resources/",
      },
      {
        title: "Lennox",
        description:
          "Product manuals, installation guides, and technical support",
        url: "https://www.lennox.com/resources",
      },
      {
        title: "Goodman",
        description:
          "Service manuals and installation documentation for Goodman products",
        url: "https://www.goodmanmfg.com/resources",
      },
      {
        title: "Rheem",
        description:
          "HVAC documentation, installation guides, and product manuals",
        url: "https://www.rheem.com/support/",
      },
      {
        title: "ManualsLib",
        description:
          "Largest online database of HVAC manuals from all manufacturers",
        url: "https://www.manualslib.com/",
      },
    ],
  },
  {
    id: "schematics",
    title: "Schematics & Wiring Diagrams",
    icon: <Zap className="w-4 h-4" />,
    resources: [
      {
        title: "Carrier Wiring Diagrams",
        description:
          "Electrical schematics and wiring diagrams for Carrier units",
        url: "https://www.carrier.com/residential/en/us/products/",
      },
      {
        title: "Trane Wiring Schematics",
        description:
          "Control wiring and electrical schematics for Trane systems",
        url: "https://www.trane.com/residential/en/resources/",
      },
      {
        title: "ManualsLib Schematics",
        description:
          "Search by model number to find unit-specific wiring diagrams",
        url: "https://www.manualslib.com/",
      },
      {
        title: "ACCA Technical Resources",
        description: "Industry-standard wiring references and technical guides",
        url: "https://www.acca.org/",
      },
    ],
  },
  {
    id: "technical-guides",
    title: "Technical Guides",
    icon: <Wrench className="w-4 h-4" />,
    resources: [
      {
        title: "ASHRAE Standards",
        description:
          "Industry standards for HVAC design, installation, and testing",
        url: "https://www.ashrae.org/",
      },
      {
        title: "ACCA Manuals",
        description: "Manual J, D, S load calculation and system design guides",
        url: "https://www.acca.org/",
      },
      {
        title: "Refrigerant Reference",
        description: "Pressure-temperature charts and refrigerant properties",
        url: "https://www.refrigerants.com/",
      },
      {
        title: "NEC Electrical Code",
        description: "National Electrical Code for HVAC wiring compliance",
        url: "https://www.nfpa.org/",
      },
    ],
  },
  {
    id: "epa608",
    title: "EPA 608 Study Resources",
    icon: <GraduationCap className="w-4 h-4" />,
    resources: [
      {
        title: "EPA 608 Study Guide",
        description: "Complete EPA Section 608 certification study materials",
        url: "https://www.epa.gov/section608",
      },
      {
        title: "ESCO Institute",
        description: "EPA 608 practice tests and certification preparation",
        url: "https://www.escogroup.org/",
      },
      {
        title: "HVAC Excellence",
        description: "Certification study materials and practice exams",
        url: "https://www.hvacexcellence.org/",
      },
      {
        title: "R-410A Safety Guide",
        description: "Safe handling of refrigerants and EPA regulations",
        url: "https://www.epa.gov/section608",
      },
    ],
  },
];

const SCHEMATIC_STEPS = [
  {
    num: 1,
    title: "Check Inside Unit Panel",
    detail:
      "Most units have a wiring schematic affixed to the inside of the access panel door. Always check here first — it's the quickest source.",
  },
  {
    num: 2,
    title: "Search Using Model Number",
    detail:
      "Locate the model/serial number on the data plate, then search on ManualsLib.com or the manufacturer's site to download the exact schematic.",
  },
  {
    num: 3,
    title: "Use Manufacturer Websites",
    detail:
      "Visit the manufacturer's support page and enter your model number to download the exact schematic for your unit.",
  },
];

function ResourceCard({
  resource,
  index,
}: { resource: Resource; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: "#1E293B",
        border: "1px solid rgba(56,189,248,0.12)",
      }}
      data-ocid={`resources.resource.card.${index + 1}`}
    >
      <div className="flex-1">
        <h3 className="text-sm font-bold text-white leading-tight mb-1">
          {resource.title}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
          {resource.description}
        </p>
      </div>
      <Button
        size="sm"
        className="w-full text-xs font-semibold gap-1.5"
        style={{
          background: "oklch(var(--primary) / 1)",
          color: "white",
        }}
        onClick={() => window.open(resource.url, "_blank")}
        data-ocid={`resources.open_resource.button.${index + 1}`}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open Resource
      </Button>
    </motion.div>
  );
}

const SECTION_ICON_BG: Record<string, string> = {
  "manufacturer-manuals": "rgba(56,189,248,0.12)",
  schematics: "rgba(251,191,36,0.12)",
  "technical-guides": "rgba(134,239,172,0.12)",
  epa608: "rgba(167,139,250,0.12)",
};

const SECTION_ICON_COLOR: Record<string, string> = {
  "manufacturer-manuals": "#38BDF8",
  schematics: "#FBBF24",
  "technical-guides": "#86EFAC",
  epa608: "#A78BFA",
};

export default function ResourcesPage() {
  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: "#0F172A" }}
      data-ocid="resources.page"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-4 py-4 flex items-center gap-3"
        style={{
          background: "rgba(15,23,42,0.95)",
          borderBottom: "1px solid rgba(56,189,248,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(56,189,248,0.15)" }}
        >
          <BookOpen className="w-4 h-4" style={{ color: "#38BDF8" }} />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">
            Resources
          </h1>
          <p className="text-[11px]" style={{ color: "#64748B" }}>
            Manuals, schematics &amp; technical references
          </p>
        </div>
      </header>

      <main className="px-4 pt-5 space-y-8">
        {/* Schematic Lookup — first child */}
        <SchematicLookup />

        {/* Resource sections */}
        {RESOURCE_SECTIONS.map((section) => (
          <section
            key={section.id}
            data-ocid={`resources.${section.id}.section`}
          >
            {/* Section header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: SECTION_ICON_BG[section.id] }}
              >
                <span style={{ color: SECTION_ICON_COLOR[section.id] }}>
                  {section.icon}
                </span>
              </div>
              <h2
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: SECTION_ICON_COLOR[section.id] }}
              >
                {section.title}
              </h2>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {section.resources.map((resource, i) => (
                <ResourceCard
                  key={resource.title}
                  resource={resource}
                  index={i}
                />
              ))}
            </div>

            {/* Schematic finder panel — inserted after schematics section */}
            {section.id === "schematics" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="mt-5 rounded-2xl p-5"
                style={{
                  background: "#162032",
                  border: "1px solid rgba(251,191,36,0.18)",
                }}
                data-ocid="resources.schematic_finder.panel"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(251,191,36,0.15)" }}
                  >
                    <FileSearch
                      className="w-4 h-4"
                      style={{ color: "#FBBF24" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Find Your System Schematic
                    </h3>
                    <p className="text-[11px]" style={{ color: "#64748B" }}>
                      3 steps to locate your wiring diagram
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {SCHEMATIC_STEPS.map((step) => (
                    <div
                      key={step.num}
                      className="flex items-start gap-3"
                      data-ocid={`resources.schematic_step.${step.num}`}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                        style={{
                          background: "rgba(251,191,36,0.2)",
                          color: "#FBBF24",
                        }}
                      >
                        {step.num}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-snug">
                          {step.title}
                        </p>
                        <p
                          className="text-xs leading-relaxed mt-0.5"
                          style={{ color: "#94A3B8" }}
                        >
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                  style={{
                    background: "rgba(251,191,36,0.12)",
                    border: "1px solid rgba(251,191,36,0.25)",
                    color: "#FBBF24",
                  }}
                  onClick={() =>
                    window.open("https://www.manualslib.com/", "_blank")
                  }
                  data-ocid="resources.manualslib_search.button"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search ManualsLib by Model Number
                </button>
              </motion.div>
            )}
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="mt-10 px-4 pb-4 text-center">
        <p className="text-[11px]" style={{ color: "#334155" }}>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
      <BottomTabBar />
    </div>
  );
}
