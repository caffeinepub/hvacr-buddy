export interface RecommendedVideo {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
}

const VIDEO_LIBRARY: RecommendedVideo[] = [
  {
    id: "epa-1",
    title: "EPA 608 Core Prep Part 1",
    url: "https://www.youtube.com/watch?v=BLtBaCt81i4",
    description:
      "Core section exam prep covering refrigerant regulations and safety.",
    tags: [
      "epa",
      "608",
      "core",
      "certification",
      "refrigerant",
      "regulations",
      "recovery",
      "ozone",
    ],
  },
  {
    id: "epa-2",
    title: "EPA 608 Core Prep Part 2",
    url: "https://www.youtube.com/watch?v=gi-RkhawFGU",
    description:
      "Continued core section prep with practice questions and key concepts.",
    tags: ["epa", "608", "core", "certification", "practice"],
  },
  {
    id: "epa-3",
    title: "EPA 608 Type 1 Prep",
    url: "https://www.youtube.com/watch?v=wZH058B3x54",
    description: "Small appliance certification prep for Type 1 exam.",
    tags: ["epa", "type1", "small appliance", "recovery", "evacuation"],
  },
  {
    id: "epa-4",
    title: "EPA 608 Type 2 Prep",
    url: "https://www.youtube.com/watch?v=Mnl_KY-D59A",
    description: "High-pressure appliance certification prep for Type 2 exam.",
    tags: [
      "epa",
      "type2",
      "high pressure",
      "charging",
      "superheat",
      "subcooling",
      "leak",
    ],
  },
  {
    id: "epa-5",
    title: "EPA 608 Type 3 Prep",
    url: "https://www.youtube.com/watch?v=CXMLkI1WMcQ",
    description: "Low-pressure appliance certification prep for Type 3 exam.",
    tags: ["epa", "type3", "low pressure", "vacuum", "purge", "leak"],
  },
  {
    id: "tool-1",
    title: "HVAC Multimeter 101",
    url: "https://www.youtube.com/watch?v=fa8NM7JzISM",
    description: "How to use a multimeter for HVAC electrical diagnostics.",
    tags: [
      "multimeter",
      "voltage",
      "continuity",
      "capacitance",
      "tool",
      "electrical",
    ],
  },
  {
    id: "tool-2",
    title: "How to Test Relays, Contactors, Transformers",
    url: "https://www.youtube.com/watch?v=4ja6GynaxQ0",
    description: "Step-by-step testing of common HVAC electrical components.",
    tags: [
      "relay",
      "contactor",
      "transformer",
      "multimeter",
      "test",
      "electrical",
      "voltage",
    ],
  },
  {
    id: "tool-3",
    title: "HVAC Refrigerant Gauges",
    url: "https://www.youtube.com/watch?v=eEZAgzkS_sA",
    description:
      "Understanding and using manifold gauge sets for refrigerant work.",
    tags: ["gauges", "manifold", "refrigerant", "pressure", "tool"],
  },
  {
    id: "tool-4",
    title: "Basic HVAC Tools",
    url: "https://www.youtube.com/watch?v=SxlLgRe2ZEM",
    description:
      "Overview of essential tools every HVAC technician needs in the field.",
    tags: ["tools", "basic", "technician", "field", "equipment"],
  },
  {
    id: "ref-1",
    title: "How to Evacuate AC System",
    url: "https://www.youtube.com/watch?v=JsnQeUSuUMU",
    description:
      "Proper procedure for evacuating an AC system before charging.",
    tags: [
      "evacuation",
      "vacuum",
      "charging",
      "refrigerant",
      "procedure",
      "vacuum pump",
    ],
  },
  {
    id: "ref-2",
    title: "Refrigerant Recovery",
    url: "https://www.youtube.com/watch?v=fROHlPXw_H0",
    description: "Safe and compliant refrigerant recovery process.",
    tags: [
      "recovery",
      "refrigerant",
      "epa",
      "compliance",
      "low refrigerant",
      "leak",
    ],
  },
  {
    id: "ref-3",
    title: "Superheat & Subcooling",
    url: "https://www.youtube.com/watch?v=5UU2c5e2ork",
    description:
      "Understanding superheat and subcooling for accurate system charging.",
    tags: [
      "superheat",
      "subcooling",
      "charging",
      "refrigerant",
      "gauges",
      "pressure",
    ],
  },
  {
    id: "air-1",
    title: "Impact of Airflow on Performance",
    url: "https://www.youtube.com/watch?v=hCZEg_DGCf0",
    description:
      "How airflow directly affects HVAC system efficiency and cooling.",
    tags: ["airflow", "performance", "efficiency", "cooling"],
  },
  {
    id: "air-2",
    title: "Symptoms of Low Airflow",
    url: "https://www.youtube.com/watch?v=x4_FkNNGzFo",
    description: "Identifying signs of restricted or insufficient airflow.",
    tags: [
      "airflow",
      "low airflow",
      "symptoms",
      "restriction",
      "blower",
      "filter",
    ],
  },
  {
    id: "air-3",
    title: "20 Causes of Low Airflow",
    url: "https://www.youtube.com/watch?v=T5eBsC_MZAI",
    description:
      "Comprehensive walkthrough of the most common low airflow causes.",
    tags: ["airflow", "low airflow", "causes", "filter", "blower", "duct"],
  },
  {
    id: "air-4",
    title: "Coil Freeze Explanation",
    url: "https://www.youtube.com/watch?v=fGZmQcLZ-5E",
    description:
      "Why coils freeze and how airflow and refrigerant relate to it.",
    tags: ["coil", "freeze", "icing", "airflow", "refrigerant", "coil iced up"],
  },
  {
    id: "ts-1",
    title: "AC Not Turning On",
    url: "https://www.youtube.com/watch?v=M6YFsFXhpwU",
    description: "Diagnosing why an AC system won't start or power up.",
    tags: [
      "not turning on",
      "no power",
      "unit dead",
      "ac",
      "diagnosis",
      "contactor",
      "capacitor",
    ],
  },
  {
    id: "ts-2",
    title: "Outdoor Unit Not Running",
    url: "https://www.youtube.com/watch?v=_6eRHebRBlg",
    description: "Troubleshooting a condenser unit that won't run.",
    tags: [
      "outdoor unit",
      "condenser",
      "not running",
      "diagnosis",
      "capacitor",
      "contactor",
    ],
  },
  {
    id: "ts-3",
    title: "Air Handler Not Working",
    url: "https://www.youtube.com/watch?v=-eRJl8Pb0gQ",
    description:
      "Step-by-step diagnosis for an air handler that's not operating.",
    tags: ["air handler", "not working", "blower", "diagnosis"],
  },
  {
    id: "ts-4",
    title: "AC Not Cooling",
    url: "https://www.youtube.com/watch?v=cJDRqWwlKug",
    description:
      "Finding the root cause when an AC system runs but won't cool.",
    tags: ["not cooling", "warm air", "ac", "troubleshoot", "diagnosis"],
  },
];

export function getRecommendedVideos(keywords: string[]): RecommendedVideo[] {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  const scored: { video: RecommendedVideo; score: number }[] = [];
  const seen = new Set<string>();

  for (const video of VIDEO_LIBRARY) {
    if (seen.has(video.id)) continue;
    let score = 0;
    for (const kw of lowerKeywords) {
      if (kw.length < 3) continue;
      for (const tag of video.tags) {
        if (tag.includes(kw) || kw.includes(tag)) score++;
      }
      if (video.title.toLowerCase().includes(kw)) score += 2;
      if (video.description.toLowerCase().includes(kw)) score += 1;
    }
    if (score > 0) {
      scored.push({ video, score });
      seen.add(video.id);
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.video);
}

export function extractKeywords(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[\s,;.]+/)
    .filter((w) => w.length > 3);
}
