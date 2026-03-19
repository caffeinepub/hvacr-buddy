export interface ComponentVisual {
  name: string;
  intro: string;
  imageSrc: string;
  diagramRef?: string;
  videoRef?: { title: string; url: string };
}

export const componentVisuals: Record<string, ComponentVisual> = {
  capacitor: {
    name: "Capacitor",
    intro:
      "That part is called a capacitor. Here's what it typically looks like:",
    imageSrc:
      "/assets/generated/component-capacitor-transparent.dim_400x300.png",
    diagramRef: "Capacitor Wiring",
    videoRef: undefined,
  },
  contactor: {
    name: "Contactor",
    intro: "Let me show you what that component should look like:",
    imageSrc:
      "/assets/generated/component-contactor-transparent.dim_400x300.png",
    diagramRef: "Contactor Wiring",
    videoRef: {
      title: "How Power Moves Through an AC System Schematic",
      url: "https://www.youtube.com/watch?v=VtC25cV1mU0",
    },
  },
  gauges: {
    name: "Manifold Gauge Set",
    intro: "Here's a quick visual so you know what you're checking:",
    imageSrc: "/assets/generated/component-gauges-transparent.dim_400x300.png",
    videoRef: {
      title: "How to Evacuate an AC System (Full Vacuum Procedure)",
      url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
    },
  },
  "evaporator coil": {
    name: "Evaporator Coil",
    intro: "Here's what the evaporator coil looks like:",
    imageSrc:
      "/assets/generated/component-evaporator-coil-transparent.dim_400x300.png",
    diagramRef: "Refrigeration Cycle",
  },
  "condenser coil": {
    name: "Condenser Coil",
    intro: "Here's what the condenser coil looks like:",
    imageSrc:
      "/assets/generated/component-condenser-coil-transparent.dim_400x300.png",
    diagramRef: "Refrigeration Cycle",
  },
  thermostat: {
    name: "Thermostat",
    intro: "Here's what a typical thermostat looks like:",
    imageSrc:
      "/assets/generated/component-thermostat-transparent.dim_400x300.png",
    diagramRef: "24V Control Circuit",
  },
  filter: {
    name: "Air Filter",
    intro: "Here's what a standard air filter looks like:",
    imageSrc:
      "/assets/generated/component-air-filter-transparent.dim_400x300.png",
    diagramRef: "Airflow Diagram",
  },
  compressor: {
    name: "Compressor",
    intro: "Here's what the compressor looks like:",
    imageSrc:
      "/assets/generated/component-compressor-transparent.dim_400x300.png",
    diagramRef: "Refrigeration Cycle",
    videoRef: {
      title: "How to Remove Refrigerant From a Running AC System",
      url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
    },
  },
};

// Returns the first matching visual for a given text block
export function detectComponentVisual(text: string): ComponentVisual | null {
  const lower = text.toLowerCase();
  // Order matters — check multi-word first
  const keys = [
    "evaporator coil",
    "condenser coil",
    "capacitor",
    "contactor",
    "compressor",
    "thermostat",
    "filter",
    "gauges",
  ];
  for (const key of keys) {
    if (lower.includes(key)) return componentVisuals[key];
  }
  return null;
}
