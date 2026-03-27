export interface ComponentVisual {
  name: string;
  intro: string;
  imageSrc: string;
  diagramRef?: string;
  videoRef?: { title: string; url: string };
}

export const componentVisuals: Record<string, ComponentVisual> = {
  // ── PARTS ──────────────────────────────────────────────────────────────────
  capacitor: {
    name: "Capacitor",
    intro:
      "That part is called a capacitor. Here's what it typically looks like:",
    imageSrc: "/assets/generated/part-capacitor.dim_400x400.png",
    diagramRef: "Capacitor Wiring",
  },
  contactor: {
    name: "Contactor",
    intro: "Let me show you what that component should look like:",
    imageSrc: "/assets/generated/part-contactor.dim_400x400.png",
    diagramRef: "Contactor Wiring",
    videoRef: {
      title: "How to Test Relays, Contactors, Transformers",
      url: "https://www.youtube.com/watch?v=4ja6GynaxQ0",
    },
  },
  "evaporator coil": {
    name: "Evaporator Coil",
    intro: "Here's what the evaporator coil looks like:",
    imageSrc: "/assets/generated/part-evaporator-coil.dim_400x400.png",
    diagramRef: "Refrigeration Cycle",
  },
  "condenser coil": {
    name: "Condenser Coil",
    intro: "Here's what the condenser coil looks like:",
    imageSrc: "/assets/generated/part-evaporator-coil.dim_400x400.png",
    diagramRef: "Refrigeration Cycle",
  },
  thermostat: {
    name: "Thermostat",
    intro: "Here's what a typical thermostat looks like:",
    imageSrc: "/assets/generated/part-thermostat.dim_400x400.png",
    diagramRef: "24V Control Circuit",
  },
  filter: {
    name: "Air Filter",
    intro: "Here's what a standard air filter looks like:",
    imageSrc: "/assets/generated/part-air-filter.dim_400x400.png",
    diagramRef: "Airflow Diagram",
  },
  compressor: {
    name: "Compressor",
    intro: "Here's what the compressor looks like:",
    imageSrc: "/assets/generated/part-compressor.dim_400x400.png",
    diagramRef: "Refrigeration Cycle",
    videoRef: {
      title: "Refrigerant Recovery",
      url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
    },
  },

  // ── TOOLS ──────────────────────────────────────────────────────────────────
  multimeter: {
    name: "Multimeter",
    intro: "You'll need a multimeter for this. Here's what it looks like:",
    imageSrc: "/assets/generated/tool-multimeter.dim_400x400.png",
    videoRef: {
      title: "HVAC Multimeter 101",
      url: "https://www.youtube.com/watch?v=fa8NM7JzISM",
    },
  },
  "clamp meter": {
    name: "Clamp Meter",
    intro: "You'll need a clamp meter for this. Here's what it looks like:",
    imageSrc: "/assets/generated/tool-clamp-meter.dim_400x400.png",
    videoRef: {
      title: "HVAC Multimeter 101",
      url: "https://www.youtube.com/watch?v=fa8NM7JzISM",
    },
  },
  gauges: {
    name: "Manifold Gauge Set",
    intro: "Here's a quick visual so you know what you're working with:",
    imageSrc: "/assets/generated/tool-manifold-gauge.dim_400x400.png",
    videoRef: {
      title: "HVAC Refrigerant Gauges",
      url: "https://www.youtube.com/watch?v=eEZAgzkS_sA",
    },
  },
  "vacuum pump": {
    name: "Vacuum Pump",
    intro: "You'll need a vacuum pump for this. Here's what it looks like:",
    imageSrc: "/assets/generated/tool-vacuum-pump.dim_400x400.png",
    videoRef: {
      title: "How to Evacuate AC System",
      url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
    },
  },
  wrench: {
    name: "Adjustable Wrench",
    intro: "Grab an adjustable wrench. Here's what it looks like:",
    imageSrc: "/assets/generated/tool-adjustable-wrench.dim_400x400.png",
  },
  screwdriver: {
    name: "Screwdrivers",
    intro: "You'll need a screwdriver for this. Here's what to look for:",
    imageSrc: "/assets/generated/tool-screwdrivers.dim_400x400.png",
  },
  pliers: {
    name: "Pliers",
    intro: "Grab a pair of pliers. Here's what they look like:",
    imageSrc: "/assets/generated/tool-pliers.dim_400x400.png",
  },
  "tubing cutter": {
    name: "Tubing Cutter",
    intro: "You'll need a tubing cutter for this. Here's what it looks like:",
    imageSrc: "/assets/generated/tool-tubing-cutter.dim_400x400.png",
  },
  drill: {
    name: "Cordless Drill",
    intro: "You'll need a cordless drill for this. Here's what it looks like:",
    imageSrc: "/assets/generated/tool-cordless-drill.dim_400x400.png",
  },
  "impact driver": {
    name: "Impact Driver",
    intro: "You'll need an impact driver for this. Here's what it looks like:",
    imageSrc: "/assets/generated/tool-impact-driver.dim_400x400.png",
  },
  "flaring tool": {
    name: "Flaring Tool",
    intro: "You'll need a flaring tool for this. Here's what it looks like:",
    imageSrc: "/assets/generated/tool-flaring-tool.dim_400x400.png",
  },
};

// Returns the first matching visual for a given text block
export function detectComponentVisual(text: string): ComponentVisual | null {
  const lower = text.toLowerCase();
  // Order matters — check multi-word / specific first
  const keys = [
    "evaporator coil",
    "condenser coil",
    "clamp meter",
    "vacuum pump",
    "tubing cutter",
    "impact driver",
    "flaring tool",
    "manifold gauge",
    "multimeter",
    "capacitor",
    "contactor",
    "compressor",
    "thermostat",
    "screwdriver",
    "wrench",
    "pliers",
    "drill",
    "filter",
    "gauges",
  ];
  for (const key of keys) {
    if (lower.includes(key)) return componentVisuals[key];
  }
  return null;
}

// Map tool/part names (from database) to visual keys
export const nameToVisualKey: Record<string, string> = {
  Multimeter: "multimeter",
  "Clamp Meter": "clamp meter",
  "Manifold Gauge Set": "gauges",
  "Vacuum Pump": "vacuum pump",
  "Adjustable Wrench": "wrench",
  Screwdrivers: "screwdriver",
  Screwdriver: "screwdriver",
  Pliers: "pliers",
  "Needle Nose Pliers": "pliers",
  "Channel Lock Pliers": "pliers",
  "Tubing Cutter": "tubing cutter",
  "Cordless Drill": "drill",
  "Impact Driver": "impact driver",
  "Flaring Tool": "flaring tool",
  Capacitor: "capacitor",
  "Dual Run Capacitor": "capacitor",
  "Run Capacitor": "capacitor",
  Contactor: "contactor",
  "Air Filter": "filter",
  "Evaporator Coil": "evaporator coil",
  Compressor: "compressor",
  Thermostat: "thermostat",
};
